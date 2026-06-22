---
title: MCP 自动发现
description: 掌握 HAZE 是如何通过标准协议动态获悉、检测并整合 MCP Server 所声明的工具、提示词模板及物理资源的完整运行机制。
updatedAt: 2026-06-16
readingTime: 5 分钟
order: 5
downloadLabel: 下载自动发现示例代码
downloadUrl: /templates/mcp-discovery-sample.zip
actionLabel: 前往在线调试
actionMenu: dev
checklist:
  - id: 1
    title: 匹配端点列表
    desc: 标准实现 `/tools/list`, `/resources/list` 及 `/prompts/list`。
    icon: Sparkles
  - id: 2
    title: 检测动态监听
    desc: 系统会实时检测 MCP 的自更新状态并在几毫秒内通知模型。
    icon: Database
  - id: 3
    title: 完善资源 URI
    desc: 所有提供的企业知识资源使用标准的 `mcp://` 命名约定。
    icon: Terminal
  - id: 4
    title: 格式严密审核
    desc: 参数校验器可自动侦破类型声明与真实调用不匹配的情况。
    icon: ShieldCheck
faqs:
  - q: 为什么新增了 Tool，但聊天面板中还是不显示？
    a: 最常见的情况是客户端没有触发二次拉取。我们提供了自动重连与心跳感知机制，您可以在服务管理器中手动刷新，让客户端重新调用 `/tools/list` 以对齐缓存。
  - q: 资源 (Resource) 和提示词模板 (Prompt Template) 有什么区别？
    a: 资源是静态的或在实时数据库中直接获取的参考源（如系统文件、日志、元数据）；提示词模板是一个对用户可见、携带参数的引导场景，通常供成员按格式调用。
---

## 自动发现生命周期说明

“自动发现” 是 Model Context Protocol 的最关键能力。在传统的对接框架下，如果要给系统接入一个新接口，需要后端、网关和前端全链路做多套页面和适配。
而使用 MCP 自动发现：
1. 大模型运行时在通道开通时会发出握手指令。
2. 您的 MCP Server 返回当前的声明文件，无需客户端任何定制改造。
3. 平台大盘立刻收录您的全套接口，并将其一并编译进会话推荐项或供能力审批人员审核。

---

## 核心接口自发现格式规范

根据协议规范，您的服务应当重点支持并响应以下三大通信协议事件：

### 1. `tools/list` (动态工具收集)
向模型暴露所有它可以调用并反馈的函数结构，包括函数名、详细说明、输入 schema 形式。

```typescript
// 一个工具声明 JSON 响应
{
  "tools": [
    {
      "name": "get_weekly_report",
      "description": "从 ERP 系统拉取销售部某位业务经理在指定自然周的高管分析日报",
      "inputSchema": {
        "type": "object",
        "properties": {
          "managerId": { "type": "string", "description": "业务员企业工号" },
          "weekNumber": { "type": "integer", "description": "第几周（例如：24）" }
        },
        "required": ["managerId", "weekNumber"]
      }
    }
  ]
}
```

### 2. `resources/list` (受控知识池/实时文档发现)
让模型可以直接以只读模式访问非关系型格式，如系统配置、特定的开发文档甚至挂接的物联网遥测数据报文。

```typescript
// 声明挂起的实时传感器资源
{
  "resources": [
    {
      "uri": "mcp://sensor/device-019/metrics",
      "name": "测试室 19 温度传感器实时指标",
      "description": "每 3 秒自动更新一次的温湿度反馈参数",
      "mimeType": "application/json"
    }
  ]
}
```

### 3. `prompts/list` (标准预习与推荐提示模板)
允许您的系统主动把写好的“最佳引导话术”挂接到客户端的下拉推荐栏或对话侧边快捷中心，降低普通职员由于指令不规范产生的幻觉比率。

---

## 变化主动感知 (Notifications/心跳监测)

当您在 MCP 后端运行由于业务变更临时下线了某个工具，或者更新了 `tools` 列表中输入参数的字段：
* 您的服务端可发出 `notifications/tools/list-changed` 自发现广播。
* HAZE 客户端将顺延该通道瞬间重启资源嗅探，无需整站服务器热换升级。
* 如果您使用标准 Python/JS SDK，框架内部已默认封装此感知重连协议，直接调用 `notify_changed` 机制即可。
