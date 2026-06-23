from __future__ import annotations

from collections.abc import Generator
from io import BytesIO
from pathlib import Path
from zipfile import ZipFile

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.bootstrap import bootstrap
from app.core.config import get_settings
from app.db.base import Base
from app.db.session import get_db
from app.main import create_app


def _zip_bytes(files: dict[str, str]) -> bytes:
    buffer = BytesIO()
    with ZipFile(buffer, "w") as archive:
        for name, content in files.items():
            archive.writestr(name, content)
    return buffer.getvalue()


def _login(client: TestClient, phone: str, password: str) -> dict[str, str]:
    response = client.post("/api/auth/login", json={"phone": phone, "password": password})
    assert response.status_code == 200, response.text
    return {"Authorization": f"Bearer {response.json()['data']['access_token']}"}


@pytest.fixture
def capability_client(tmp_path: Path) -> Generator[tuple[TestClient, dict[str, dict[str, str]]], None, None]:
    engine = create_engine(
        "sqlite+pysqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    TestingSession = sessionmaker(bind=engine, class_=Session, expire_on_commit=False)
    Base.metadata.create_all(engine)
    settings = get_settings()
    original_storage = settings.local_storage_dir
    settings.local_storage_dir = tmp_path / "storage"
    settings.initial_admin_name = "admin"
    settings.initial_admin_phone = "13800138000"
    settings.initial_admin_email = "admin@example.com"
    settings.initial_admin_password = "AdminPass!123"
    settings.initial_admin_department = "Platform"
    with TestingSession() as session:
        bootstrap(session)

    def override_get_db() -> Generator[Session, None, None]:
        with TestingSession() as session:
            yield session

    application = create_app()
    application.dependency_overrides[get_db] = override_get_db
    with TestClient(application, raise_server_exceptions=False) as client:
        admin = _login(client, "13800138000", "AdminPass!123")
        headers: dict[str, dict[str, str]] = {"admin": admin}
        for suffix, name in (("1", "Developer One"), ("2", "Developer Two")):
            response = client.post(
                "/api/users",
                headers=admin,
                json={
                    "name": name,
                    "phone": f"1380013800{suffix}",
                    "email": f"dev{suffix}@example.com",
                    "department": "Engineering",
                    "role_code": "DEVELOPER",
                    "status": "active",
                },
            )
            assert response.status_code == 200, response.text
            temporary_password = response.json()["data"]["temporary_password"]
            headers[f"dev{suffix}"] = _login(client, f"1380013800{suffix}", temporary_password)
        yield client, headers
    settings.local_storage_dir = original_storage


def _upload_package(client: TestClient, headers: dict[str, str], capability_type: str, files: dict[str, str]) -> dict:
    response = client.post(
        f"/api/developer/uploads/package?type={capability_type}",
        headers=headers,
        files={"file": (f"{capability_type}.zip", _zip_bytes(files), "application/zip")},
    )
    assert response.status_code == 200, response.text
    return response.json()["data"]


def _create_capability(
    client: TestClient,
    headers: dict[str, str],
    *,
    code: str,
    capability_type: str,
) -> dict:
    files = {"SKILL.md": "# Skill"} if capability_type == "skill" else {"package.json": '{"name":"mcp-server"}'}
    upload = _upload_package(client, headers, capability_type, files)
    response = client.post(
        "/api/developer/capabilities",
        headers=headers,
        json={
            "code": code,
            "name": f"Capability {code}",
            "type": capability_type,
            "description": "Capability description",
            "category": "Engineering",
            "version": "1.0.0",
            "tags": ["automation"],
            "config": {"transport": "HTTP"} if capability_type == "mcp" else {"skill_md": "SKILL.md"},
            "package_upload_token": upload["upload_token"],
        },
    )
    assert response.status_code == 200, response.text
    return response.json()["data"]


def test_skill_lifecycle_versions_and_code_reuse(capability_client) -> None:
    client, headers = capability_client
    icon = client.post(
        "/api/developer/uploads/icon",
        headers=headers["dev1"],
        files={"file": ("icon.png", b"\x89PNG\r\n\x1a\ncontent", "image/png")},
    )
    assert icon.status_code == 200, icon.text
    package = _upload_package(client, headers["dev1"], "skill", {"SKILL.md": "# Skill", "main.py": "print(1)"})
    created = client.post(
        "/api/developer/capabilities",
        headers=headers["dev1"],
        json={
            "code": "finance_skill",
            "name": "Finance Skill",
            "type": "skill",
            "description": "Analyze finance data",
            "category": "Finance",
            "version": "v1.0.0",
            "tags": ["finance"],
            "config": {"skill_md": "SKILL.md"},
            "icon_upload_token": icon.json()["data"]["upload_token"],
            "package_upload_token": package["upload_token"],
        },
    )
    assert created.status_code == 200, created.text
    asset = created.json()["data"]
    assert asset["status"] == "draft"
    assert asset["recent_test_status"] == "none"
    assert asset["icon"] == f"/api/developer/capabilities/{asset['id']}/icon"
    assert client.get(asset["icon"], headers=headers["dev1"]).status_code == 200
    assert client.get(asset["icon"], headers=headers["dev2"]).status_code == 404

    versions = client.get(f"/api/developer/capabilities/{asset['id']}/versions", headers=headers["dev1"])
    assert versions.json()["data"]["total"] == 1
    assert client.get(f"/api/developer/capabilities/{asset['id']}", headers=headers["dev2"]).status_code == 404
    assert client.get(f"/api/developer/capabilities/{asset['id']}", headers=headers["admin"]).status_code == 200

    edited = client.patch(
        f"/api/developer/capabilities/{asset['id']}",
        headers=headers["dev1"],
        json={"name": "Finance Skill Updated", "tags": ["finance", "report"]},
    )
    assert edited.status_code == 200, edited.text
    published = client.post(f"/api/developer/capabilities/{asset['id']}/publish", headers=headers["dev1"])
    assert published.status_code == 200
    version_upload = _upload_package(client, headers["dev1"], "skill", {"SKILL.md": "# Version 1.1"})
    versioned = client.post(
        f"/api/developer/capabilities/{asset['id']}/versions",
        headers=headers["dev1"],
        json={"version": "1.1.0", "changelog": "New report support", "package_upload_token": version_upload["upload_token"]},
    )
    assert versioned.status_code == 200, versioned.text
    assert versioned.json()["data"]["version"] == "1.1.0"
    assert client.get(f"/api/developer/capabilities/{asset['id']}/versions", headers=headers["dev1"]).json()["data"]["total"] == 2
    assert client.post(f"/api/developer/capabilities/{asset['id']}/offline", headers=headers["dev1"]).json()["data"]["status"] == "offline"

    capability_storage = Path(get_settings().local_storage_dir) / "capabilities" / str(asset["id"])
    assert capability_storage.is_dir()
    deleted = client.delete(f"/api/developer/capabilities/{asset['id']}", headers=headers["dev1"])
    assert deleted.status_code == 200
    assert not capability_storage.exists()
    replacement = _create_capability(client, headers["dev1"], code="finance_skill", capability_type="skill")
    assert replacement["code"] == "finance_skill"


def test_mcp_publish_gate_test_result_and_filters(capability_client) -> None:
    client, headers = capability_client
    asset = _create_capability(client, headers["dev1"], code="database_mcp", capability_type="mcp")
    capability_id = asset["id"]
    blocked = client.post(f"/api/developer/capabilities/{capability_id}/publish", headers=headers["dev1"])
    assert blocked.status_code == 409
    denied = client.patch(
        f"/api/developer/capabilities/{capability_id}/test-status",
        headers=headers["dev1"],
        json={"status": "pass"},
    )
    assert denied.status_code == 403
    passed = client.patch(
        f"/api/developer/capabilities/{capability_id}/test-status",
        headers=headers["admin"],
        json={"status": "pass"},
    )
    assert passed.status_code == 200, passed.text
    assert passed.json()["data"]["recent_test_status"] == "pass"
    published = client.post(f"/api/developer/capabilities/{capability_id}/publish", headers=headers["dev1"])
    assert published.status_code == 200
    listing = client.get(
        "/api/developer/capabilities?type=mcp&status=published&search=database",
        headers=headers["dev1"],
    )
    assert listing.status_code == 200
    data = listing.json()["data"]
    assert data["total"] == 1
    assert data["items"][0]["code"] == "database_mcp"
    assert data["counts"]["mcp"] == 1


def test_upload_validation_and_token_ownership(capability_client) -> None:
    client, headers = capability_client
    missing_skill = client.post(
        "/api/developer/uploads/package?type=skill",
        headers=headers["dev1"],
        files={"file": ("bad.zip", _zip_bytes({"README.md": "missing"}), "application/zip")},
    )
    assert missing_skill.status_code == 400
    unsafe = client.post(
        "/api/developer/uploads/package?type=mcp",
        headers=headers["dev1"],
        files={"file": ("unsafe.zip", _zip_bytes({"../evil.txt": "bad"}), "application/zip")},
    )
    assert unsafe.status_code == 400

    upload = _upload_package(client, headers["dev1"], "mcp", {"mcp.json": '{"transport":"stdio"}'})
    stolen = client.post(
        "/api/developer/capabilities",
        headers=headers["dev2"],
        json={
            "code": "stolen_mcp",
            "name": "Stolen MCP",
            "type": "mcp",
            "version": "1.0.0",
            "package_upload_token": upload["upload_token"],
        },
    )
    assert stolen.status_code == 403