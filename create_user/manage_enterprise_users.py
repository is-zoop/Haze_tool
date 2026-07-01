"""Periodically create or disable Haze enterprise users.

Implement the two iterator functions below with your own user source.
Runs every 30 minutes by default and stays in the foreground for Docker.
"""

from __future__ import annotations

import json
import os
import sys
import time
from datetime import datetime
from typing import Any, Iterable
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, urlopen


API_BASE_URL = os.getenv("HAZE_API_BASE_URL", "http://127.0.0.1:8000")
SYSTEM_ADMIN_PHONE = os.getenv("HAZE_SYSTEM_ADMIN_PHONE", "")
SYSTEM_ADMIN_PASSWORD = os.getenv("HAZE_SYSTEM_ADMIN_PASSWORD", "")
SYNC_INTERVAL_SECONDS = int(os.getenv("HAZE_SYNC_INTERVAL_SECONDS", "1800"))


def iter_users_to_create() -> Iterable[dict[str, Any]]:
    """Return users to create in the current cycle."""
    # TODO: Replace with your traversal/query logic.
    # yield {
    #     "member_no": "330425",
    #     "initial_password": "paiwo123",  # Optional
    #     "name": "Example User",
    #     "email": "user@example.com",     # Optional
    #     "phone": "18689565248",
    #     "department": "Other",
    #     "role_code": "USER",             # ADMIN / DEVELOPER / USER
    #     "status": "active",
    # }
    return ()


def iter_member_nos_to_disable() -> Iterable[str]:
    """Return member numbers to disable in the current cycle."""
    # TODO: Replace with your traversal/query logic. Example: yield "330425"
    return ()


class ApiRequestError(RuntimeError):
    def __init__(self, message: str, *, status_code: int | None = None) -> None:
        super().__init__(message)
        self.status_code = status_code


def log(message: str, *, error: bool = False) -> None:
    timestamp = datetime.now().astimezone().isoformat(timespec="seconds")
    print(f"[{timestamp}] {message}", file=sys.stderr if error else sys.stdout, flush=True)


def request_json(
    method: str,
    path: str,
    *,
    body: dict[str, Any] | None = None,
    token: str | None = None,
) -> dict[str, Any]:
    headers = {"Accept": "application/json"}
    data = None
    if body is not None:
        headers["Content-Type"] = "application/json"
        data = json.dumps(body, ensure_ascii=False).encode("utf-8")
    if token:
        headers["Authorization"] = f"Bearer {token}"

    request = Request(
        f"{API_BASE_URL.rstrip('/')}{path}", data=data, headers=headers, method=method
    )
    try:
        with urlopen(request, timeout=30) as response:
            payload = json.loads(response.read().decode("utf-8"))
    except HTTPError as exc:
        raw = exc.read().decode("utf-8", errors="replace")
        try:
            message = json.loads(raw).get("message", raw)
        except json.JSONDecodeError:
            message = raw or exc.reason
        raise ApiRequestError(f"HTTP {exc.code}: {message}", status_code=exc.code) from exc
    except URLError as exc:
        raise ApiRequestError(f"Cannot connect to Haze API: {exc.reason}") from exc

    if payload.get("code") != 0:
        raise ApiRequestError(str(payload.get("message", "API request failed")))
    return payload


def login_system_admin() -> str:
    if not SYSTEM_ADMIN_PHONE or not SYSTEM_ADMIN_PASSWORD:
        raise ValueError("Set HAZE_SYSTEM_ADMIN_PHONE and HAZE_SYSTEM_ADMIN_PASSWORD")
    payload = request_json(
        "POST",
        "/api/auth/login",
        body={"phone": SYSTEM_ADMIN_PHONE, "password": SYSTEM_ADMIN_PASSWORD},
    )
    user = payload["data"]["user"]
    if user.get("role_code") != "SYSTEM_ADMIN":
        raise ApiRequestError("The configured account is not a system administrator")
    return str(payload["data"]["access_token"])


def create_user(token: str, user: dict[str, Any]) -> None:
    missing = [
        key
        for key in ("member_no", "name", "phone", "department", "role_code")
        if not user.get(key)
    ]
    if missing:
        raise ValueError(f"Complete user fields first: {', '.join(missing)}")
    body = dict(user)
    if not body.get("initial_password"):
        body.pop("initial_password", None)
    result = request_json("POST", "/api/users", body=body, token=token)["data"]
    member = result["member"]
    log(
        f"Created member_no={member['member_no']} name={member['name']} "
        f"temporary_password={result['temporary_password']}"
    )


def disable_user(token: str, member_no: str) -> None:
    member_no = str(member_no).strip()
    if not member_no:
        raise ValueError("Member number to disable cannot be blank")
    member = request_json(
        "PATCH",
        f"/api/users/{quote(member_no, safe='')}/status",
        body={"status": "disabled"},
        token=token,
    )["data"]
    log(f"Disabled member_no={member['member_no']} name={member['name']}")


def run_sync_cycle() -> bool:
    """Run one synchronization cycle; return True when all actions succeeded."""
    log("Starting enterprise user synchronization")
    token = login_system_admin()
    failures = 0

    for user in iter_users_to_create():
        member_no = str(user.get("member_no", ""))
        try:
            create_user(token, user)
        except ApiRequestError as exc:
            if exc.status_code == 409:
                log(f"Skipped existing/conflicting member_no={member_no}: {exc}")
            else:
                failures += 1
                log(f"Create failed for member_no={member_no}: {exc}", error=True)
        except (KeyError, TypeError, ValueError) as exc:
            failures += 1
            log(f"Invalid create data for member_no={member_no}: {exc}", error=True)

    for member_no in iter_member_nos_to_disable():
        try:
            disable_user(token, member_no)
        except (ApiRequestError, KeyError, TypeError, ValueError) as exc:
            failures += 1
            log(f"Disable failed for member_no={member_no}: {exc}", error=True)

    log(f"Enterprise user synchronization finished; failures={failures}")
    return failures == 0


def run_forever(*, once: bool = False) -> int:
    if SYNC_INTERVAL_SECONDS <= 0:
        raise ValueError("HAZE_SYNC_INTERVAL_SECONDS must be greater than 0")
    while True:
        started_at = time.monotonic()
        try:
            succeeded = run_sync_cycle()
        except Exception as exc:
            succeeded = False
            log(f"Synchronization cycle failed: {exc}", error=True)
        if once:
            return 0 if succeeded else 1
        sleep_seconds = max(0.0, SYNC_INTERVAL_SECONDS - (time.monotonic() - started_at))
        log(f"Next synchronization starts in {sleep_seconds:.0f} seconds")
        time.sleep(sleep_seconds)


def main() -> int:
    if len(sys.argv) > 2 or (len(sys.argv) == 2 and sys.argv[1] != "--once"):
        print("Usage: python manage_enterprise_users.py [--once]", file=sys.stderr)
        return 2
    try:
        return run_forever(once="--once" in sys.argv[1:])
    except ValueError as exc:
        log(f"Configuration error: {exc}", error=True)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
