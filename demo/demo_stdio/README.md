# HazeToolPlat Demo MCP Server

用于测试平台 MCP 沙箱功能的演示服务器，实现 **MCP 2024-11-05 协议（HTTP 传输）**。

## 快速启动

```bash
cd demo
pip install fastapi uvicorn
python mcp_demo_server.py
```

服务启动后监听 `http://127.0.0.1:8765`

## 在平台注册

1. 进入**开发者中心** → 点击 **+ 注册能力**
2. 选择类型 **MCP Server**
3. 传输方式选 **HTTP**
4. `serverUrl` 填写 `http://127.0.0.1:8765`
5. 保存后点击 **▶ 测试** 按钮启动沙箱测试

## 提供的工具（5个）

| 工具名 | 说明 | 是否只读 |
|--------|------|---------|
| `list_employees` | 获取员工列表，支持按部门筛选 | ✅ |
| `get_employee` | 按工号查询员工详情 | ✅ |
| `list_departments` | 获取所有部门及人数 | ✅ |
| `query_attendance` | 查询员工最近 N 天考勤记录 | ✅ |
| `get_system_info` | 获取服务器运行状态 | ✅ |

## MCP 协议端点

| 方法 | 端点 | 说明 |
|------|------|------|
| GET | `/` | 服务健康检查（沙箱测试第1步） |
| POST | `/` | JSON-RPC 处理（initialize / tools/list / tools/call） |

## 测试沙箱预期结果

```
✅ 1. 服务连接测试   — HTTP 200 OK
✅ 2. 认证测试       — 端点验证通过
✅ 3. 协议初始化     — 协议版本: 2024-11-05
✅ 4. 工具列表获取   — 发现 5 个工具
✅ 5. 工具调用测试   — list_employees 调用成功
✅ 6. 完成           — 测试通过
```
