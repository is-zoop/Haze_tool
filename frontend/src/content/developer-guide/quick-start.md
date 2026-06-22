---
title: 快速开始
description: 欢迎使用 HAZE 开发者指南。通过本篇教程，您将快速了解如何从零开始，在 HAZE 平台注册、调试并最终发布一项 AI 能力。
updatedAt: 2026-06-16
readingTime: 5 分钟
order: 1
downloadLabel: 下载开发环境包
downloadUrl: /templates/haze-dev-sdk.zip
actionLabel: 前往开发者中心
actionMenu: dev
checklist:
  - id: 1
    title: 了解能力分类
    desc: 熟悉 Skill (提示词/流) 与 MCP Server (服务/接口) 的核心特点与业务契合度。
    icon: Sparkles
  - id: 2
    title: 初始化本地工程
    desc: 下载统一的模板工程包，包含预设的结构、配置文件及标准测试套件。
    icon: Terminal
  - id: 3
    title: 配置沙箱连接
    desc: 在本地启动测试沙箱，利用 SSE 协议或进程通道建立与 HAZE 客户端的通信。
    icon: Database
  - id: 4
    title: 提交审批发布
    desc: 通过组织管理员或团队负责人的安全和功能审计，最终一键上架至能力市场。
    icon: ShieldCheck
faqs:
  - q: Skill 与 MCP Server 哪个更适合我的业务？
    a: 如果您的核心交付物是高度精练的场景化提示术语、行业知识包，以及少量工作流编排，请选择 Skill；如果您需要模型实时访问内部 SQL 数据库、企业私有业务 API，或在沙箱内完成受控文件系统操作，请选择 MCP Server。
  - q: 本地测试沙箱不需要开通企业账号吗？
    a: 不需要，任何部门的开发者只要在内网网段内，都可以下载 HAZE 客户端调试环境，利用本地 STDIO 通道直接进行对接调测。
  - q: 企业组织管理员审核一般需要多久？
    a: 标准审核流程在 1-2 个工作日内完成，重点审查安全边界声明（如是否涉及生产写权限、敏感数据外流等）。
---

## 为什么要接入 HAZE 平台？

HAZE 是企业级的 AI 能力底座。在这里，每个部门的业务专家与技术工程师都可以将独特的知识、企业资产和垂直系统转化为模型可调用的插件。

* **共享业务生态**：您的代码和提示词将成为全公司共享的高并发微服务。
* **极致安全的调用沙箱**：通过平台统一进行的 OAuth 连接和内置的安全审计过滤器，完美隔离内网敏感数据。
* **业务价值直观量化**：通过内网开发者大盘一目了然获取 API 调用、高频场景、告警日志和流控分析。

---

## 选择您的能力类型

在着手编写代码前，您需要明确选择最契合当前业务场景的能力载体：

| 能力类型 | 核心机制 | 适用典型场景 | 安全要求 |
| :--- | :--- | :--- | :--- |
| **Skill (技能流)** | 系统提示词 & `SKILL.md` 描述 | 统一日报汇总、智能格式清洗、公办流程答卷系统 | **较低**（纯文本加工与轻资产操作） |
| **MCP Server (协议服务)** | Model Context Protocol 进程/HTTP | 数据库 SQL 直接读写、本地沙箱文件全文检索、ERP 实时查询 | **中-高**（需要完善的安全声明与审计） |

---

## 环境初始化与脚手架

为了降低多类型能力的编写难度，我们提供了一键式初始化命令和预置依赖模板：

1. **获取 SDK 与测试套件**
   单击页面上方的 **下载示例模板** 按钮，或者在终端运行：
   ```bash
   npx @haze/cli init my-awesome-capability
   ```
2. **选择预设环境**
   系统将提示您选择 `Skill / System Prompt` 还是 `MCP Server (Node.js/Python)`。
3. **完成依赖安装**
   ```bash
   cd my-awesome-capability
   npm install
   ```

---

## 快速调试与沙箱演示

利用平台自带的沙箱调测控制台（前往 **开发者中心**），无需复杂的企业网关配置即可预览执行链详情：

```typescript
// 一个简易的 MCP 发现工具示例
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server({
  name: "demo-server",
  version: "1.0.0"
}, {
  capabilities: { tools: {} }
});

// 注册一个组织架构查询工具
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [{
      name: "get_user_summary",
      description: "汇总组织通讯录、职责和高频日志项",
      inputSchema: { type: "object", properties: {} }
    }]
  };
});
```

启动您的开发环境：
```bash
npm run dev
```
之后，您可以在平台 **开发者中心** 执行连接，输入一段普通对话来观察 AI 模型是如何拆解并成功回调到您的本地代码的。

> 提示：运行日志和执行堆栈可以在右侧的终端监控栏中无缝捕获。

---

## 版本打包与一键发布

当本地调试一切顺利，并确保覆盖了所有的安全防护规则（如边界检查）后，您只需生成标准的包描述：

```bash
npm run build
```

在系统后台，点击页面右下角的 **下一篇** 深入阅读。您的提交将直接通过内网发送给团队审核人，审批通过后，将自动上架到能力市场展示给全部员工。
