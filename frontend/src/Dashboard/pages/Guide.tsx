import React, { Fragment, useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Code2,
  FileText,
  FolderGit,
  PlayCircle,
  Terminal,
  Workflow,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface GuideProps {
  onBackToHome?: () => void;
  langCode?: "ZH" | "EN" | "JA" | "ES";
}

const GUIDE_SECTIONS = [
  { id: "quick-start", title: "快速开始", icon: Terminal },
  { id: "skill-upload", title: "Skill 上传规范", icon: Workflow },
  { id: "skill-md-spec", title: "SKILL.md 编写规范", icon: FileText },
  { id: "mcp-register", title: "MCP Server 注册", icon: FolderGit },
  { id: "mcp-discovery", title: "MCP 自动发现", icon: CheckCircle2 },
  { id: "test-and-pub", title: "测试与发布", icon: PlayCircle },
] as const;

type SectionId = typeof GUIDE_SECTIONS[number]["id"];

const QUICK_START_STEPS = [
  ["选择能力类型", "Skill 适合沉淀提示词、操作规范和使用边界；MCP Server 适合把内部系统、文件、数据库或业务 API 接入模型上下文。"],
  ["补齐交付材料", "填写名称、唯一 Code、版本、负责人、能力描述和测试用例。Skill 需要 SKILL.md，MCP 需要启动方式和服务地址。"],
  ["调试后发布", "先在开发者中心跑沙箱测试，再发布到能力市场。发布后的能力会进入组织可发现、可申请、可挂载的工作流。"],
];

const SKILL_RULES = [
  "说明能力适用的业务场景，而不是只写模型能做什么。",
  "明确负向限制，例如禁止访问外部网络、禁止修改生产数据、遇到字段缺失必须中断。",
  "提供真实输入示例和期望输出格式，减少用户调用时的猜测成本。",
  "如果依赖 MCP Server 或内部知识库，把依赖名称、权限要求和失败兜底写清楚。",
];

const SKILL_MD_ROWS = [
  ["# 能力名称", "一句话说明能力用途", "必填"],
  ["## 适用场景", "列出典型业务输入和使用人群", "必填"],
  ["## 输入与输出", "给出输入样例、输出结构和字段解释", "必填"],
  ["## 限制边界", "列出禁止行为、权限要求和错误处理", "必填"],
  ["## 依赖资源", "MCP、文件、数据表或服务依赖", "可选"],
];

const MCP_CONNECTIONS = [
  ["STDIO / Process", "适合本地工具、私有脚本和研发阶段验证。通过命令启动服务，使用标准输入输出与模型客户端通信。"],
  ["HTTP / SSE", "适合生产服务和网关代理。服务需要提供稳定 URL、鉴权方式、健康检查和超时策略。"],
  ["受控代理", "适合访问企业内网资源。通过平台网关统一注入凭证、审计日志和资源范围限制。"],
];

export function Guide({ onBackToHome: _onBackToHome, langCode: _langCode = "ZH" }: GuideProps) {
  const [activeSection, setActiveSection] = useState<SectionId>("quick-start");
  const activeMeta = useMemo(
    () => GUIDE_SECTIONS.find((section) => section.id === activeSection) ?? GUIDE_SECTIONS[0],
    [activeSection],
  );

  return (
    <div className="dashboard-page-stack h-full overflow-hidden" id="haze-guide-page-container">
      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden rounded-xl border border-border/70 bg-white lg:grid-cols-[260px_1fr]">
        <aside className="hidden min-h-0 border-r border-border/70 bg-slate-50/70 p-3 lg:flex lg:flex-col">
          <div className="mb-3 px-2">
            <Badge variant="outline" className="mb-2 rounded-md bg-white text-[11px] text-slate-600">
              <BookOpen className="mr-1 h-3 w-3 text-slate-500" />
              Developer Guide
            </Badge>
            <h2 className="text-sm font-bold text-slate-950">开发者指南</h2>
          </div>

          <ScrollArea className="min-h-0 flex-1 pr-1">
            <div className="space-y-1">
              {GUIDE_SECTIONS.map((section) => {
                const Icon = section.icon;
                const active = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id)}
                    className={`flex h-10 w-full items-center gap-3 rounded-lg px-2.5 text-left text-xs transition-colors ${
                      active
                        ? "bg-slate-950 text-white"
                        : "text-slate-600 hover:bg-white hover:text-slate-950"
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${active ? "text-white" : "text-slate-400"}`} />
                    <span className="min-w-0 flex-1 truncate font-bold">{section.title}</span>
                    <ChevronRight className={`h-3 w-3 shrink-0 ${active ? "text-white" : "text-slate-300"}`} />
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </aside>

        <main className="flex min-h-0 flex-col overflow-hidden">
          <div className="border-b border-border/70 bg-white p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <activeMeta.icon className="h-4 w-4 text-slate-500" />
                <h1 className="text-base font-bold text-slate-950">{activeMeta.title}</h1>
              </div>
              <div className="flex flex-wrap gap-1.5 lg:hidden">
                {GUIDE_SECTIONS.map((section) => (
                  <Button
                    key={section.id}
                    variant={activeSection === section.id ? "default" : "outline"}
                    size="sm"
                    className="h-8 px-2.5 text-xs"
                    onClick={() => setActiveSection(section.id)}
                  >
                    {section.title}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <ScrollArea className="min-h-0 flex-1 bg-slate-50/70">
            <div className="mx-auto max-w-5xl p-4">
              <SectionContent activeSection={activeSection} />
            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
  );
}

function SectionContent({ activeSection }: { activeSection: SectionId }) {
  switch (activeSection) {
    case "quick-start":
      return (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {QUICK_START_STEPS.map(([title, text], index) => (
            <Card key={title} className="rounded-lg bg-white shadow-none">
              <CardHeader className="p-4 pb-2">
                <Badge variant="secondary" className="mb-2 w-fit rounded-md text-[11px]">
                  Step {index + 1}
                </Badge>
                <CardTitle className="text-sm">{title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-xs leading-5 text-slate-600">{text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      );

    case "skill-upload":
      return (
        <Card className="rounded-lg bg-white shadow-none">
          <CardHeader className="p-4">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Workflow className="h-4 w-4 text-slate-500" />
              Skill 交付清单
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 p-4 pt-0">
            {SKILL_RULES.map((rule, index) => (
              <div key={rule} className="flex gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white text-[11px] font-bold text-slate-600">
                  {index + 1}
                </span>
                <p className="text-xs leading-5 text-slate-600">{rule}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      );

    case "skill-md-spec":
      return (
        <Card className="rounded-lg bg-white shadow-none">
          <CardHeader className="p-4">
            <CardTitle className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-slate-500" />
              SKILL.md 推荐结构
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full border-collapse text-left text-xs">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="p-3">章节</th>
                    <th className="p-3">说明</th>
                    <th className="p-3">要求</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-white">
                  {SKILL_MD_ROWS.map(([section, desc, required]) => (
                    <tr key={section}>
                      <td className="p-3 font-mono font-semibold text-slate-900">{section}</td>
                      <td className="p-3 text-slate-600">{desc}</td>
                      <td className="p-3">
                        <Badge variant="secondary" className="rounded-md text-[11px]">
                          {required}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      );

    case "mcp-register":
      return (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {MCP_CONNECTIONS.map(([title, text]) => (
            <Card key={title} className="rounded-lg bg-white shadow-none">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <FolderGit className="h-4 w-4 text-slate-500" />
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-xs leading-5 text-slate-600">{text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      );

    case "mcp-discovery":
      return (
        <Card className="rounded-lg bg-white shadow-none">
          <CardHeader className="p-4">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Code2 className="h-4 w-4 text-slate-500" />
              自动发现生命周期
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-4 pt-0">
            {["tools/list 返回工具 schema", "resources/list 返回资源映射", "prompts/list 返回可复用提示词", "能力市场展示可申请的挂载入口"].map((step, index, array) => (
              <Fragment key={step}>
                <div className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-700">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white font-bold text-slate-600">{index + 1}</span>
                  <span className="font-semibold">{step}</span>
                </div>
                {index < array.length - 1 && <Separator className="mx-6 w-auto bg-slate-200" />}
              </Fragment>
            ))}
          </CardContent>
        </Card>
      );

    case "test-and-pub":
      return (
        <Card className="rounded-lg bg-white shadow-none">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm">发布状态流转</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-2 p-4 pt-0 text-xs">
            {["Draft", "Reviewing", "Published", "Offline"].map((state, index) => (
              <Fragment key={state}>
                <Badge variant="outline" className="rounded-md px-3 py-1 text-[11px]">
                  {state}
                </Badge>
                {index < 3 && <ChevronRight className="h-3 w-3 text-slate-400" />}
              </Fragment>
            ))}
          </CardContent>
        </Card>
      );

    default:
      return null;
  }
}
