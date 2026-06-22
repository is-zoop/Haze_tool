---
title: MCP Server 注册
description: 了解如何将企业内部、本地沙箱以及三方 SaaS 系统的业务逻辑、数据库等深度资源注册为 HAZE 支持的主动调用 MCP 插件。
updatedAt: 2026-06-16
readingTime: 7 分钟
order: 4
downloadLabel: 下载 MCP Node.js 示例
downloadUrl: /templates/mcp-node-demo.zip
actionLabel: 工具列表校验
actionMenu: dev
checklist:
  - id: 1
    title: 选定连接方式
    desc: STDIO 适合本地沙箱调试物理磁盘；HTTP/SSE/SSE-Proxy 适合分布式应用。
    icon: Database
  - id: 2
    title: 定义工具元数据
    desc: 确保 tools.inputSchema 的 JSON-schema 声明清晰，参数无歧义。
    icon: Terminal
  - id: 3
    title: 提供认证凭证
    desc: 企业密钥必须统一使用内网 Secret 动态鉴权，防止明文代码暴露。
    icon: ShieldCheck
  - id: 4
    title: 安全事件上报
    desc: 所有 API 写操作均需要接入审批机制。
    icon: Sparkles
faqs:
  - q: 为什么模型在会话中没有触发我的 MCP 工具？
    a: 大概率是因为您工具的 description 写的过于简略。由于模型是根据描述匹配决策的，如果描述没有写清它解决的业务痛点和接收的入参含义，匹配权重会极大下降。
  - q: MCP 连接超时阈值一般是多少？
    a: 在标准内网高频应用场景下，HAZE 设定的默认回调响应时间为 12 秒。若您的工具由于耗时长的离线 SQL 导致超时，请接入 SSE 轮询机制或启用异步任务追踪结构。
---

## 协议背景

HAZE 完美对齐了 Anthropic 主导提出的 Model Context Protocol (MCP，模型上下文协议)。
借助 MCP 协议，企业内的开发团队可以用自己最熟悉的研发语言（Node.js, Python, Java, Go 等）将各自专有的异构系统包装为一个受控、自描述、自发现的标准通道服务。

---

## 核心配置类型选择

注册 MCP 服务时，HAZE 主要提供以下三种底层驱动连接方案，以适应不同阶段的部署安全级别：

### 1. STDIO / Process (进程管道命令)
* **原理**：HAZE 大模型本地执行端或远程连接机器通过操作系统调用（如 `node`、`python`），新起一个本地守护子进程，利用标准的 Input/Output 流与运行态建立无物理隔离的低码长连接。
* **特点**：速度极快、不依赖任何广域网链路。最适合开发、单元测试调试以及用于在沙箱内获取本地磁盘文件的只读/全文索引。
* **注册项示例**：
  ```json
  {
    "mcpServers": {
      "enterprise-file-sand": {
        "command": "node",
        "args": ["/absolute/path/to/server/index.js"],
        "env": {
          "SANDBOX_ROOT": "/user/safe/dir"
        }
      }
    }
  }
  ```

### 2. HTTP / SSE (基于 Server-Sent Events 的流微服务)
* **原理**：MCP 服务常驻在公司的 K8s 内部集群或特定的测试服务器上，提供独立的 HTTP 端点。通过 Server-Sent Events 在服务器和 HAZE 中枢建立长连接通道。
* **特点**：支持集群部署、状态恢复及动态横向扩容。适合全线投入、服务化分层管理的生产级 API 工具注入（如 ERP 查询、OA 物流查询等）。

### 3. 企业受控代理型
* **原理**：将网络边界划分至平台中央网关。由中枢统一接收用户 Prompt，提取调用后，通过企业专有 VPN 及零信任网卡进行受控 API 的统一调用审计并追加日志。

---

## 定义符合规范的 Tools 信息

一个标准的 MCP 注册项除了链接之外，其对外暴露的核心能力一般表现为一个包含特定 `tools` 列表的 JSON Schema：

```typescript
// Node.js SDK 注册 Tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "query_database_by_sql",
        description: "高警限制：只读权限！根据指定的 SQL 检索企业数据库昨日订单状态，并返回标准化 JSON 数组。禁止运行 DELETE, UPDATE 或 INSERT 语句。",
        inputSchema: {
          type: "object",
          properties: {
            sql: {
              type: "string",
              description: "精确的 SQL 查询语句。仅限于 SELECT。"
            }
          },
          required: ["sql"]
        }
      }
    ]
  };
});
```

---

## 安全防护最佳实践

* **动态注入鉴权密钥**：禁止将鉴权用的 Token 或 API-Key 随代码一并书写或上传。在注册界面，请务必使用 `HAZE_SECRET_REF("${SECRET_NAME}")` 语法。平台会在建立底层信道交互前，动态从安全 KeyVault 提取真实值注入环境变量中。
* **参数合理性强限制校验**：大模型极易根据模糊语意输入非期望格式。在您的 MCP 服务端代码中，务必对输入参数（如 `sql` 字段）附加二次校验正则防御（例如拦截多字符拼接、子句溢出等恶意入侵语句）。
