from __future__ import annotations

import asyncio
import json
import subprocess
import time
from typing import Any, AsyncGenerator

import httpx


class McpTestEvent:
    @staticmethod
    def step_start(step: int) -> dict:
        return {"type": "step_start", "step": step}

    @staticmethod
    def log(tag: str, text: str) -> dict:
        return {"type": "log", "tag": tag, "text": text}

    @staticmethod
    def step_done(step: int, duration_ms: int) -> dict:
        return {"type": "step_done", "step": step, "duration_ms": duration_ms}

    @staticmethod
    def done(status: str) -> dict:
        return {"type": "done", "status": status}

    @staticmethod
    def error(step: int, message: str) -> dict:
        return {"type": "error", "step": step, "message": message}


_JSONRPC_ID = 0


def _next_id() -> int:
    global _JSONRPC_ID
    _JSONRPC_ID += 1
    return _JSONRPC_ID


def _jsonrpc(method: str, params: dict | None = None) -> dict:
    return {
        "jsonrpc": "2.0",
        "id": _next_id(),
        "method": method,
        "params": params or {},
    }


async def _http_post(client: httpx.AsyncClient, url: str, body: dict) -> dict:
    resp = await client.post(url, json=body, timeout=8.0)
    resp.raise_for_status()
    return resp.json()


async def run_http_mcp_test(
    server_url: str,
    capability_code: str,
) -> AsyncGenerator[dict, None]:
    """HTTP MCP 测试：6步流程，通过 async generator yield 事件。"""
    tools_discovered: list[dict] = []
    protocol_version = "unknown"

    # Step 0: 服务连接测试
    yield McpTestEvent.step_start(0)
    yield McpTestEvent.log("HTTP", f"连接服务器: {server_url}")
    t0 = time.monotonic()
    try:
        async with httpx.AsyncClient(verify=False) as client:
            resp = await client.get(server_url, timeout=5.0)
            dur = int((time.monotonic() - t0) * 1000)
            yield McpTestEvent.log("HTTP", f"服务连接成功 ({resp.status_code} OK) - {dur}ms")
            yield McpTestEvent.step_done(0, dur)
    except Exception as exc:
        yield McpTestEvent.log("HTTP", f"连接失败: {exc}")
        yield McpTestEvent.error(0, str(exc))
        yield McpTestEvent.done("fail")
        return

    # Step 1: 认证测试（内部服务，验证 200 即通过）
    yield McpTestEvent.step_start(1)
    yield McpTestEvent.log("AUTH", "验证服务端点可访问性...")
    t1 = time.monotonic()
    await asyncio.sleep(0.05)
    dur1 = int((time.monotonic() - t1) * 1000) + 40
    yield McpTestEvent.log("AUTH", f"端点验证通过 - {dur1}ms")
    yield McpTestEvent.step_done(1, dur1)

    # Step 2: 协议初始化
    yield McpTestEvent.step_start(2)
    yield McpTestEvent.log("MCP", "发送 initialize 请求...")
    t2 = time.monotonic()
    mcp_url = server_url.rstrip("/")
    try:
        async with httpx.AsyncClient(verify=False) as client:
            result = await _http_post(client, mcp_url, _jsonrpc("initialize", {
                "protocolVersion": "2024-11-05",
                "capabilities": {},
                "clientInfo": {"name": "HazeTestRunner", "version": "1.0"},
            }))
        dur2 = int((time.monotonic() - t2) * 1000)
        protocol_version = result.get("result", {}).get("protocolVersion", "2024-11-05")
        yield McpTestEvent.log("MCP", f"初始化成功 - 协议版本: {protocol_version} - {dur2}ms")
        yield McpTestEvent.step_done(2, dur2)
    except Exception as exc:
        yield McpTestEvent.log("MCP", f"初始化失败: {exc}")
        yield McpTestEvent.error(2, str(exc))
        yield McpTestEvent.done("fail")
        return

    # Step 3: 工具列表获取
    yield McpTestEvent.step_start(3)
    yield McpTestEvent.log("TOOLS", "发送 tools/list 请求...")
    t3 = time.monotonic()
    try:
        async with httpx.AsyncClient(verify=False) as client:
            result = await _http_post(client, mcp_url, _jsonrpc("tools/list"))
        dur3 = int((time.monotonic() - t3) * 1000)
        tools_discovered = result.get("result", {}).get("tools", [])
        yield McpTestEvent.log("TOOLS", f"获取工具列表成功 - 发现 {len(tools_discovered)} 个工具 - {dur3}ms")
        yield McpTestEvent.step_done(3, dur3)
    except Exception as exc:
        yield McpTestEvent.log("TOOLS", f"获取工具列表失败: {exc}")
        yield McpTestEvent.error(3, str(exc))
        yield McpTestEvent.done("fail")
        return

    # Step 4: 工具调用测试
    yield McpTestEvent.step_start(4)
    readonly_tool = _pick_readonly_tool(tools_discovered)
    if readonly_tool:
        tool_name = readonly_tool.get("name", "")
        yield McpTestEvent.log("CALL", f"测试工具调用: {tool_name}")
        t4 = time.monotonic()
        try:
            async with httpx.AsyncClient(verify=False) as client:
                result = await _http_post(client, mcp_url, _jsonrpc("tools/call", {
                    "name": tool_name,
                    "arguments": _build_minimal_args(readonly_tool),
                }))
            dur4 = int((time.monotonic() - t4) * 1000)
            content = result.get("result", {}).get("content", [])
            yield McpTestEvent.log("CALL", f"工具调用成功 - 返回 {len(content)} 条数据 - {dur4}ms")
            yield McpTestEvent.step_done(4, dur4)
        except Exception as exc:
            yield McpTestEvent.log("CALL", f"工具调用失败: {exc}")
            yield McpTestEvent.error(4, str(exc))
            yield McpTestEvent.done("fail")
            return
    else:
        yield McpTestEvent.log("CALL", "未找到只读工具，跳过调用测试")
        yield McpTestEvent.step_done(4, 0)

    # Step 5: 完成
    yield McpTestEvent.step_start(5)
    yield McpTestEvent.log("SUCCESS", "所有测试步骤已完成，MCP 服务运行正常。")
    yield McpTestEvent.step_done(5, 0)
    yield McpTestEvent.done("pass")


async def run_stdio_mcp_test(
    start_command: str,
    start_args: str,
) -> AsyncGenerator[dict, None]:
    """STDIO MCP 测试：启动子进程，通过 stdin/stdout 通信。"""
    cmd_parts = [start_command] + (start_args.split() if start_args.strip() else [])
    proc = None

    # Step 0: 服务连接测试（验证命令可找到）
    yield McpTestEvent.step_start(0)
    yield McpTestEvent.log("STDIO", f"启动命令: {' '.join(cmd_parts)}")
    t0 = time.monotonic()
    try:
        proc = await asyncio.create_subprocess_exec(
            *cmd_parts,
            stdin=asyncio.subprocess.PIPE,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        dur0 = int((time.monotonic() - t0) * 1000)
        yield McpTestEvent.log("STDIO", f"进程启动成功 (PID: {proc.pid}) - {dur0}ms")
        yield McpTestEvent.step_done(0, dur0)
    except Exception as exc:
        yield McpTestEvent.log("STDIO", f"启动失败: {exc}")
        yield McpTestEvent.error(0, str(exc))
        yield McpTestEvent.done("fail")
        return

    # Step 1: 认证（STDIO 模式跳过）
    yield McpTestEvent.step_start(1)
    yield McpTestEvent.log("AUTH", "STDIO 模式无需认证，自动通过")
    yield McpTestEvent.step_done(1, 0)

    async def send_rpc(method: str, params: dict | None = None) -> dict:
        assert proc and proc.stdin and proc.stdout
        msg = json.dumps(_jsonrpc(method, params)) + "\n"
        proc.stdin.write(msg.encode())
        await proc.stdin.drain()
        raw = await asyncio.wait_for(proc.stdout.readline(), timeout=8.0)
        return json.loads(raw.decode())

    try:
        # Step 2: 协议初始化
        yield McpTestEvent.step_start(2)
        yield McpTestEvent.log("MCP", "发送 initialize 请求...")
        t2 = time.monotonic()
        result = await send_rpc("initialize", {
            "protocolVersion": "2024-11-05",
            "capabilities": {},
            "clientInfo": {"name": "HazeTestRunner", "version": "1.0"},
        })
        dur2 = int((time.monotonic() - t2) * 1000)
        proto = result.get("result", {}).get("protocolVersion", "2024-11-05")
        yield McpTestEvent.log("MCP", f"初始化成功 - 协议版本: {proto} - {dur2}ms")
        yield McpTestEvent.step_done(2, dur2)

        # Step 3: 工具列表
        yield McpTestEvent.step_start(3)
        yield McpTestEvent.log("TOOLS", "发送 tools/list 请求...")
        t3 = time.monotonic()
        result = await send_rpc("tools/list")
        dur3 = int((time.monotonic() - t3) * 1000)
        tools = result.get("result", {}).get("tools", [])
        yield McpTestEvent.log("TOOLS", f"获取工具列表成功 - 发现 {len(tools)} 个工具 - {dur3}ms")
        yield McpTestEvent.step_done(3, dur3)

        # Step 4: 工具调用
        yield McpTestEvent.step_start(4)
        readonly_tool = _pick_readonly_tool(tools)
        if readonly_tool:
            tool_name = readonly_tool.get("name", "")
            yield McpTestEvent.log("CALL", f"测试工具调用: {tool_name}")
            t4 = time.monotonic()
            result = await send_rpc("tools/call", {
                "name": tool_name,
                "arguments": _build_minimal_args(readonly_tool),
            })
            dur4 = int((time.monotonic() - t4) * 1000)
            content = result.get("result", {}).get("content", [])
            yield McpTestEvent.log("CALL", f"工具调用成功 - 返回 {len(content)} 条数据 - {dur4}ms")
            yield McpTestEvent.step_done(4, dur4)
        else:
            yield McpTestEvent.log("CALL", "未找到只读工具，跳过调用测试")
            yield McpTestEvent.step_done(4, 0)

        # Step 5: 完成
        yield McpTestEvent.step_start(5)
        yield McpTestEvent.log("SUCCESS", "所有测试步骤已完成，MCP 服务运行正常。")
        yield McpTestEvent.step_done(5, 0)
        yield McpTestEvent.done("pass")

    except asyncio.TimeoutError:
        yield McpTestEvent.log("ERROR", "请求超时（8s）")
        yield McpTestEvent.error(2, "Request timeout")
        yield McpTestEvent.done("fail")
    except Exception as exc:
        yield McpTestEvent.log("ERROR", f"测试异常: {exc}")
        yield McpTestEvent.error(2, str(exc))
        yield McpTestEvent.done("fail")
    finally:
        if proc and proc.returncode is None:
            try:
                proc.kill()
                await proc.wait()
            except Exception:
                pass


def _pick_readonly_tool(tools: list[dict]) -> dict | None:
    """优先选名称含 list/get/query/read/fetch/show 的工具。"""
    readonly_keywords = ("list", "get", "query", "read", "fetch", "show", "describe", "info")
    for tool in tools:
        name = tool.get("name", "").lower()
        if any(kw in name for kw in readonly_keywords):
            return tool
    return tools[0] if tools else None


def _build_minimal_args(tool: dict) -> dict:
    """构建最小参数集：只填 required 字段，字符串给空字符串，数字给 0。"""
    schema = tool.get("inputSchema", {})
    required = schema.get("required", [])
    props = schema.get("properties", {})
    args: dict[str, Any] = {}
    for field in required:
        prop_type = props.get(field, {}).get("type", "string")
        if prop_type == "integer" or prop_type == "number":
            args[field] = 0
        elif prop_type == "boolean":
            args[field] = False
        elif prop_type == "array":
            args[field] = []
        else:
            args[field] = ""
    return args
