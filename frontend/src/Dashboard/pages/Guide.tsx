import React, { useState } from "react";
import { 
  Terminal, 
  FolderGit, 
  ChevronRight, 
  Workflow, 
  CheckCircle2, 
  FileText
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface GuideProps {
  onBackToHome?: () => void;
  langCode?: "ZH" | "EN" | "JA" | "ES";
}

const GUIDE_SECTIONS = [
  {
    id: "quick-start",
    title: "快速开始 (Quick Start)",
    icon: Terminal,
    desc: "3分钟完成首次企业能力发布"
  },
  {
    id: "skill-upload",
    title: "Skill 上传规范",
    icon: Workflow,
    desc: "AI 技能交互 prompt 编写标准"
  },
  {
    id: "skill-md-spec",
    title: "SKILL.md 编写规范",
    icon: FileText,
    desc: "规范文档与元数据格式描述"
  },
  {
    id: "mcp-register",
    title: "MCP Server 注册说明",
    icon: FolderGit,
    desc: "如何通过 STDIO/HTTP 代理注册服务"
  },
  {
    id: "mcp-discovery",
    title: "MCP Tools 自动发现",
    icon: CheckCircle2,
    desc: "协议工具集自动解析生命周期"
  },
  {
    id: "test-and-pub",
    title: "测试与发布",
    icon: CheckCircle2,
    desc: "一键部署与系统检测运行标准"
  }
];

export function Guide({ onBackToHome: _onBackToHome, langCode: _langCode = "ZH" }: GuideProps) {
  const [activeSection, setActiveSection] = useState("quick-start");

  const renderSectionContent = () => {
    switch (activeSection) {
      case "quick-start":
        return (
          <div className="space-y-4 text-left">
            <h3 className="text-xs font-bold text-foreground border-l-2 border-primary pl-2">1. 什么是 Haze 能力中心？</h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-normal">
              能力中心是企业内部 AI Agents、Skills 与各种基于 Model Context Protocol (MCP) 连接的专属共享平台。
              让开发人员注册的上下文、API 和智能技能能够被组织内其他业务人员或大模型会话一键发现并挂载使用。
            </p>
            
            <h3 className="text-xs font-bold text-foreground border-l-2 border-primary pl-2 mt-4">2. 首次接入三步法</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="p-3 bg-muted/40 rounded-lg border border-border/80 text-left">
                <span className="text-xs font-bold text-primary">Step 1. 选择类型</span>
                <p className="text-xs text-muted-foreground mt-1 font-normal">区分您要发布的是纯 Prompt 与交互指南驱动的 <b>Skill</b>，还是带有后端动态 API 的 <b>MCP Server</b>。</p>
              </div>
              <div className="p-3 bg-muted/40 rounded-lg border border-border/80 text-left">
                <span className="text-xs font-bold text-primary">Step 2. 在线测试</span>
                <p className="text-xs text-muted-foreground mt-1 font-normal">在开发者中心使用测试用例或测试连接指令，验证大模型工具调用的响应状态。</p>
              </div>
              <div className="p-3 bg-muted/40 rounded-lg border border-border/80 text-left">
                <span className="text-xs font-bold text-primary">Step 3. 提交与分享</span>
                <p className="text-xs text-muted-foreground mt-1 font-normal">提交审核。管理员确认无敏感泄漏后即通过，并在全组织能力市场展示。</p>
              </div>
            </div>
            
            <div className="p-3 bg-primary/5 rounded-lg border border-primary/10 mt-4 text-left font-normal text-xs text-muted-foreground">
              <div className="flex items-center gap-1 text-primary font-semibold text-xs">
                <Terminal size={13} />
                <span>连接状态建议</span>
              </div>
              <p className="text-xs text-primary leading-relaxed mt-1 font-normal">
                对于 MCP Server 开发者，在公司内网测试建议优先采用 <b>STDIO 连接</b> 挂载本地实例以保障安全性，生产部署建议采用 SSE 代理架构。
              </p>
            </div>
          </div>
        );

      case "skill-upload":
        return (
          <div className="space-y-4 text-left">
            <h3 className="text-xs font-bold text-foreground border-l-2 border-primary pl-2">Skill 核心定义</h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-normal">
              AI Skill 是通过设定系统人设、提示词约束（System Prompts）、限定适用边界，并可选择性挂载特定依赖 MCP Server 形成的高级功能包。
              它不需要开发者单独编写一套 API 路由服务，而是依靠成熟 of RAG 和提示词技术完成各种高度对齐的组织工作流。
            </p>

            <h3 className="text-xs font-bold text-foreground border-l-2 border-primary pl-2 mt-4">Prompt 编写指南</h3>
            <ul className="list-disc pl-4 text-xs text-muted-foreground space-y-2 font-normal">
              <li><b>人设精简清晰：</b> 明确指出大模型作为特定职能（如财务勾稽审计专家）的核心边界。</li>
              <li><b>限制不能做的事情：</b> 用强烈的 NEGATIVE_CONSTRAINTS 字眼防止大模型产生未对齐的执行行为。</li>
              <li><b>输入输出案例匹配：</b> 设定典型的标准 Input 与 Markdown 格式的 Output 结构。</li>
            </ul>

            <div className="p-3 bg-muted text-foreground border border-border rounded-lg overflow-x-auto text-xs font-mono leading-relaxed mt-3 whitespace-pre-wrap">
              {"# 负向限制声明示例\n[CRITICAL_RULES]\n- 遇到非法数字格式或主表不平衡时，必须直接输出 [MATCH_ERROR] 中断指令，不得猜测数据。\n- 禁止执行任何删改或转移财务数据到外部网关的操作。"}
            </div>
          </div>
        );

      case "skill-md-spec":
        return (
          <div className="space-y-4 text-left">
            <h3 className="text-xs font-bold text-foreground border-l-2 border-primary pl-2">为什么要编写 SKILL.md ？</h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-normal">
              SKILL.md 是对 AI 技能的终极使用协议和说明文档。大模型在执行该 Skill 会自动预读该文档的 Markdown 原信息，以明晰适用条件、输入输出模式及其调用依赖。
            </p>

            <h3 className="text-xs font-bold text-foreground border-l-2 border-primary pl-2 mt-4">标准 SKILL.md 元数据清单</h3>
            <div className="border border-border rounded-xl spill-hidden mt-2 text-xs font-normal bg-card">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted text-muted-foreground border-b border-border">
                    <th className="p-2 pl-3">节点名</th>
                    <th className="p-2">说明</th>
                    <th className="p-2 pr-3">是否必填</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-muted-foreground">
                  <tr>
                    <td className="p-2 pl-3 font-mono text-xs text-foreground/80"># 技能名</td>
                    <td className="p-2">主标题描述</td>
                    <td className="p-2 pr-3 text-emerald-600 font-medium">必填</td>
                  </tr>
                  <tr>
                    <td className="p-2 pl-3 font-mono text-xs text-foreground/80">## 核心能力特性</td>
                    <td className="p-2">大模型能做的细分子动作</td>
                    <td className="p-2 pr-3 text-emerald-600 font-medium">必填</td>
                  </tr>
                  <tr>
                    <td className="p-2 pl-3 font-mono text-xs text-foreground/80">## 适用边界及限制</td>
                    <td className="p-2">对模型幻想的前置拦截约束项</td>
                    <td className="p-2 pr-3 text-emerald-600 font-medium">必填</td>
                  </tr>
                  <tr>
                    <td className="p-2 pl-3 font-mono text-xs text-foreground/80">## 提示语示例</td>
                    <td className="p-2">成员日常点击调用的 Input 范例</td>
                    <td className="p-2 pr-3 text-muted-foreground/60">选填</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );

      case "mcp-register":
        return (
          <div className="space-y-4 text-left">
            <h3 className="text-xs font-bold text-foreground border-l-2 border-primary pl-2">Model Context Protocol 规范</h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-normal">
              MCP 是大模型接入本地或专属业务系统上下文的万能通信标准协议。在 Haze 能力中心注册 MCP Server 后，平台将代表客户端代理请求，解析出其具备的 Tools 以及 Resources。
            </p>

            <h3 className="text-xs font-bold text-foreground border-l-2 border-primary pl-2 mt-4">协议支持连接方式</h3>
            <div className="space-y-3 mt-2 font-normal text-xs text-muted-foreground">
              <div className="p-3 bg-muted/40 rounded-lg border border-border/80">
                <p className="font-bold text-foreground">1. STDIO 管道连接 (本地驱动 / 研发阶段)</p>
                <p className="mt-1">通过指定系统执行宿主命令（如 `npx`、`node`、`python`）启动，直接通过系统的输入输出流（STDIN/STDOUT）高安全速度完成挂载。</p>
              </div>
              <div className="p-3 bg-muted/40 rounded-lg border border-border/80">
                <p className="font-bold text-foreground">2. HTTP / SSE 桥接连接 (线上生产实例)</p>
                <p className="mt-1">服务器通过标准 Web Server 提供 HTTP / Server-Sent Events 服务。需要设置 Haze-Secret 鉴权签名通过服务网关访问。</p>
              </div>
            </div>
          </div>
        );

      case "mcp-discovery":
        return (
          <div className="space-y-4 text-left">
            <h3 className="text-xs font-bold text-foreground border-l-2 border-primary pl-2">自动探测机制 (Auto-Discovery)</h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-normal">
              注册 MCP Server 时，您无需在平台手动配置每一个动作接口的 Schema 属性。
              Haze 平台会在挂载时自动发出 <b>Tools / Resources / Prompts</b> 发现动作：
            </p>
            
            <ul className="list-disc pl-4 text-xs text-muted-foreground space-y-2 font-normal">
              <li><b>Tools 发现：</b> 对接服务会自动响应 `tools/list` 端口，下传支持所有的 JSON schema 规范工具清单。</li>
              <li><b>Resources 发现：</b> 自动响应 `resources/list`，将所指元数据或物理脱敏数据映射绑定。</li>
              <li><b>自动挂载：</b> 模型直接从自动发现返回的 Schema 描述动态执行绑定与会话推理。</li>
            </ul>
          </div>
        );

      case "test-and-pub":
        return (
          <div className="space-y-4 text-left">
            <h3 className="text-xs font-bold text-foreground border-l-2 border-primary pl-2">在线调试 (Sandbox Run)</h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-normal">
              在开发者中心，针对每一个草稿资产，您都可以点击“在线调试”在网页端拉起独立沙盒会话，直接输入模拟对账单、业务代码，观察大模型提取元数据及 API 的响应流和报错排查。
            </p>

            <h3 className="text-xs font-bold text-foreground border-l-2 border-primary pl-2 mt-4">发布流转状态变更</h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-normal">
              V1 将发布审查精简为企业无断点自理服务，其资产流转包含以下五个轻量状态：
            </p>
            <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
              <span className="p-1 px-2.5 bg-muted text-foreground border border-border rounded-lg">草稿 (Draft)</span>
              <span className="text-muted-foreground self-center">→</span>
              <span className="p-1 px-2.5 bg-amber-500/15 text-amber-600 rounded-lg border border-amber-500/20">待审核 (Reviewing)</span>
              <span className="text-muted-foreground self-center">→</span>
              <span className="p-1 px-2.5 bg-emerald-500/15 text-emerald-600 rounded-lg border border-emerald-500/20">已发布 (Published)</span>
              <span className="text-muted-foreground self-center">⬇️</span>
              <span className="p-1 px-2.5 bg-muted text-muted-foreground/60 rounded-lg border border-border ml-4">已下线 (Offline)</span>
              <span className="p-1 px-2.5 bg-destructive/15 text-destructive rounded-lg border border-destructive/20">已拒绝 (Rejected)</span>
            </div>
          </div>
        );

      case "faq":
        return (
          <div className="space-y-4 text-left">
            <h3 className="text-xs font-bold text-foreground border-l-2 border-primary pl-2">常见高分问题</h3>
            <div className="space-y-4 mt-2">
              <div className="font-normal text-xs text-muted-foreground">
                <p className="font-bold text-foreground">Q. 连接 MCP Server 显示 STDIO exited with error code 1 怎么办？</p>
                <p className="mt-1 leading-relaxed">请检查您的启动命令（比如 `npx`）是否在容器环境变量的 PATH 路径中，且本地是否存在该包。同时检验本地端口代理及文件访问权限是否通畅。</p>
              </div>

              <div className="font-normal text-xs text-muted-foreground">
                <p className="font-bold text-foreground">Q. 开发好了一个单独的 MCP Tool，能直接作为一级上传吗？</p>
                <p className="mt-1 leading-relaxed">根据 V1 平台极简最新定位，MCP Tool 不再作为一级能力资产。您须将其定义、编写并包装进对应的 <b>MCP Server</b> 中启动运行，平台会通过探测机制完成 Tool 的自动发现和绑定。</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="dashboard-page-stack h-full flex flex-col overflow-hidden" id="haze-guide-page-container">
      <div className="flex-1 min-h-0 min-w-0 bg-muted/10 grid grid-cols-1 lg:grid-cols-[240px_1fr] divide-x divide-border">
        {/* Left Nav Menu */}
        <div className="bg-card lg:h-full p-4 overflow-y-auto w-full flex flex-col justify-between shrink-0">
          <div className="space-y-1">
            <p className="text-xs font-bold text-muted-foreground px-2.5 pb-2 block text-left">文档类目</p>
            {GUIDE_SECTIONS.map((sec) => {
              const IconComp = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full flex items-center gap-3 py-2 px-2.5 rounded-lg text-xs font-semibold cursor-pointer text-left transition-colors ${
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <IconComp size={14} className={isActive ? "text-primary" : "text-muted-foreground/60"} />
                  <div className="min-w-0 flex-1 leading-none">
                    <p className="truncate">{sec.title}</p>
                    <span className="text-[10px] text-muted-foreground/60 font-normal leading-relaxed lines-1 block mt-0.5">{sec.desc}</span>
                  </div>
                  <ChevronRight size={11} className={isActive ? "text-primary bg-primary/20" : "text-muted-foreground/40"} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Doc Viewer */}
        <div className="flex flex-col h-full overflow-hidden bg-card">
          <div className="p-5 border-b border-border flex items-center justify-between shrink-0 bg-muted/20">
            <div className="text-left">
              <h2 className="text-xs font-bold text-foreground">
                {GUIDE_SECTIONS.find(s => s.id === activeSection)?.title}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5 font-normal leading-none">
                {GUIDE_SECTIONS.find(s => s.id === activeSection)?.desc}
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-muted-foreground bg-muted p-1 px-2 rounded-md">DOC SECTION</span>
          </div>
          
          <ScrollArea className="flex-1 min-h-0 bg-card">
            <div className="p-6 max-w-4xl">
              {renderSectionContent()}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
