"""
HazeToolPlat Demo MCP Server (STDIO)
实现 MCP 2024-11-05 协议，STDIO 传输模式。

启动方式：
    pip install -r requirements.txt
    python mcp_demo_server.py

注册到平台时：
    连接方式选 STDIO
    启动命令填写: python mcp_demo_server.py
"""

from __future__ import annotations

import json
import platform
import random
import sys
from datetime import datetime, timedelta

# ──────────────────────────────────────────────────────────
# 工具定义
# ──────────────────────────────────────────────────────────

TOOLS: list[dict] = [
    {
        "name": "list_employees",
        "description": "获取员工列表，支持按部门筛选",
        "inputSchema": {
            "type": "object",
            "properties": {
                "department": {
                    "type": "string",
                    "description": "部门名称，留空返回全部",
                },
                "limit": {
                    "type": "integer",
                    "description": "最多返回条数，默认 10",
                },
            },
            "required": [],
        },
    },
    {
        "name": "get_employee",
        "description": "按员工 ID 查询员工详情",
        "inputSchema": {
            "type": "object",
            "properties": {
                "employee_id": {
                    "type": "string",
                    "description": "员工工号，格式 EMP-xxx",
                }
            },
            "required": ["employee_id"],
        },
    },
    {
        "name": "list_departments",
        "description": "获取所有部门及人员数量",
        "inputSchema": {
            "type": "object",
            "properties": {},
            "required": [],
        },
    },
    {
        "name": "query_attendance",
        "description": "查询指定员工最近 N 天的考勤记录",
        "inputSchema": {
            "type": "object",
            "properties": {
                "employee_id": {
                    "type": "string",
                    "description": "员工工号",
                },
                "days": {
                    "type": "integer",
                    "description": "查询最近几天，默认 7",
                },
            },
            "required": ["employee_id"],
        },
    },
    {
        "name": "get_system_info",
        "description": "获取 MCP Demo 服务器运行信息",
        "inputSchema": {
            "type": "object",
            "properties": {},
            "required": [],
        },
    },
]

# ──────────────────────────────────────────────────────────
# 演示数据
# ──────────────────────────────────────────────────────────

EMPLOYEES = [
    {"id": "EMP-001", "name": "张三",   "department": "工程部", "title": "高级工程师", "email": "zhangsan@haze.com", "hire_date": "2021-03-15"},
    {"id": "EMP-002", "name": "李四",   "department": "产品部", "title": "产品经理",   "email": "lisi@haze.com",     "hire_date": "2020-07-01"},
    {"id": "EMP-003", "name": "王五",   "department": "工程部", "title": "前端工程师", "email": "wangwu@haze.com",   "hire_date": "2022-01-10"},
    {"id": "EMP-004", "name": "赵六",   "department": "市场部", "title": "市场运营",   "email": "zhaoliu@haze.com",  "hire_date": "2021-09-20"},
    {"id": "EMP-005", "name": "孙七",   "department": "人事部", "title": "HR 主管",    "email": "sunqi@haze.com",    "hire_date": "2019-11-05"},
    {"id": "EMP-006", "name": "周八",   "department": "工程部", "title": "后端工程师", "email": "zhouba@haze.com",   "hire_date": "2023-02-28"},
    {"id": "EMP-007", "name": "吴九",   "department": "产品部", "title": "UX 设计师",  "email": "wujiu@haze.com",    "hire_date": "2022-06-14"},
    {"id": "EMP-008", "name": "郑十",   "department": "市场部", "title": "品牌策划",   "email": "zhengshi@haze.com", "hire_date": "2023-08-01"},
    {"id": "EMP-009", "name": "冯十一", "department": "工程部", "title": "算法工程师", "email": "fengsy@haze.com",   "hire_date": "2020-04-17"},
    {"id": "EMP-010", "name": "陈十二", "department": "财务部", "title": "财务分析师", "email": "chenshier@haze.com","hire_date": "2021-12-03"},
]

DEPARTMENTS = [
    {"name": "工程部", "head": "张三",   "headcount": 4},
    {"name": "产品部", "head": "李四",   "headcount": 2},
    {"name": "市场部", "head": "赵六",   "headcount": 2},
    {"name": "人事部", "head": "孙七",   "headcount": 1},
    {"name": "财务部", "head": "陈十二", "headcount": 1},
]

_START_TIME = datetime.now()

# ──────────────────────────────────────────────────────────
# 工具实现
# ──────────────────────────────────────────────────────────

def tool_list_employees(args: dict) -> list[dict]:
    dept = args.get("department", "").strip()
    limit = int(args.get("limit") or 10)
    result = [e for e in EMPLOYEES if not dept or e["department"] == dept]
    return result[:limit]


def tool_get_employee(args: dict) -> dict | str:
    eid = args.get("employee_id", "").strip()
    for e in EMPLOYEES:
        if e["id"] == eid:
            return e
    return f"未找到员工: {eid}"


def tool_list_departments(_args: dict) -> list[dict]:
    return DEPARTMENTS


def tool_query_attendance(args: dict) -> list[dict] | str:
    eid = args.get("employee_id", "").strip()
    days = int(args.get("days") or 7)
    emp = next((e for e in EMPLOYEES if e["id"] == eid), None)
    if not emp:
        return f"未找到员工: {eid}"
    records = []
    statuses = ["正常", "正常", "正常", "正常", "迟到", "早退", "正常"]
    for i in range(days):
        date = (datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d")
        weekday = (datetime.now() - timedelta(days=i)).weekday()
        if weekday >= 5:
            records.append({"date": date, "status": "休息", "check_in": None, "check_out": None})
        else:
            status = random.choice(statuses)
            h = "09:05" if status == "迟到" else "08:58"
            records.append({
                "date": date,
                "status": status,
                "check_in": f"{date} {h}",
                "check_out": f"{date} {random.choice(['17:30', '18:00', '18:45', '19:20'])}",
            })
    return records


def tool_get_system_info(_args: dict) -> dict:
    uptime = datetime.now() - _START_TIME
    return {
        "server": "HazeToolPlat Demo MCP Server",
        "version": "1.0.0",
        "protocol": "MCP 2024-11-05",
        "transport": "STDIO",
        "tools_count": len(TOOLS),
        "uptime_seconds": int(uptime.total_seconds()),
        "started_at": _START_TIME.strftime("%Y-%m-%d %H:%M:%S"),
        "python": platform.python_version(),
        "os": platform.system(),
    }


TOOL_HANDLERS = {
    "list_employees":   tool_list_employees,
    "get_employee":     tool_get_employee,
    "list_departments": tool_list_departments,
    "query_attendance": tool_query_attendance,
    "get_system_info":  tool_get_system_info,
}

# ──────────────────────────────────────────────────────────
# JSON-RPC 辅助
# ──────────────────────────────────────────────────────────

def _send(obj: dict) -> None:
    """向 stdout 写出一行 JSON-RPC 响应（STDIO 协议要求每条消息占一行）。"""
    sys.stdout.write(json.dumps(obj, ensure_ascii=False) + "\n")
    sys.stdout.flush()


def _ok(req_id, result) -> dict:
    return {"jsonrpc": "2.0", "id": req_id, "result": result}


def _err(req_id, code: int, message: str) -> dict:
    return {"jsonrpc": "2.0", "id": req_id, "error": {"code": code, "message": message}}


# ──────────────────────────────────────────────────────────
# 请求处理
# ──────────────────────────────────────────────────────────

def handle(body: dict) -> dict | None:
    method = body.get("method", "")
    params = body.get("params", {})
    req_id = body.get("id")

    if method == "initialize":
        return _ok(req_id, {
            "protocolVersion": "2024-11-05",
            "serverInfo": {"name": "demo-mcp-server", "version": "1.0.0"},
            "capabilities": {"tools": {"listChanged": False}},
        })

    if method == "tools/list":
        return _ok(req_id, {"tools": TOOLS})

    if method == "tools/call":
        tool_name: str = params.get("name", "")
        arguments: dict = params.get("arguments", {})
        handler = TOOL_HANDLERS.get(tool_name)
        if handler is None:
            return _err(req_id, -32601, f"Tool not found: {tool_name}")
        try:
            data = handler(arguments)
            text = json.dumps(data, ensure_ascii=False, indent=2)
            return _ok(req_id, {"content": [{"type": "text", "text": text}], "isError": False})
        except Exception as exc:
            return _ok(req_id, {"content": [{"type": "text", "text": str(exc)}], "isError": True})

    # notifications 无需响应
    if method.startswith("notifications/"):
        return None

    return _err(req_id, -32601, f"Method not found: {method}")


# ──────────────────────────────────────────────────────────
# 主循环：从 stdin 逐行读取 JSON-RPC 请求
# ──────────────────────────────────────────────────────────

def main() -> None:
    print("HazeToolPlat Demo MCP Server started (STDIO)", file=sys.stderr)
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        try:
            body = json.loads(line)
        except json.JSONDecodeError as exc:
            _send(_err(None, -32700, f"Parse error: {exc}"))
            continue
        try:
            response = handle(body)
            if response is not None:
                _send(response)
        except Exception as exc:
            _send(_err(body.get("id"), -32603, f"Internal error: {exc}"))


if __name__ == "__main__":
    main()
