import { DeveloperAsset } from "../types/developer-center";

export const MOCK_DEVELOPER_SKILLS: DeveloperAsset[] = [
  {
    id: "asset-1",
    name: "财务报表摘要智能生成器",
    code: "fin_statement_summary",
    type: "Skill",
    description: "通过读取 PDF 或 Excel 报表，对企业的季度、年度财报进行核心指标提取与分析并产出标准化文档生成的 AI Skill。",
    version: "v1.2.0",
    project: "财务风控分析 (Finance Analysis)",
    owner: "李娜 (Lina)",
    status: "published",
    recentTestStatus: "pass",
    updatedAt: "2026-06-15 15:30:24",
    calls: 1542,
    tags: ["Finance", "PDF", "DocGen"],
    visibility: "internal",
    skillMd: `# 财务报表摘要智能生成器\n\n该 Skill 旨在从非结构化的企业对账单、损益表和资产负债表等 PDF/Excel 文件中自动提取并核准核心财报指标。\n\n## 核心特性\n- 高频财务指标匹配 (ROE、EBITDA)\n- 逻辑合理性对账勾稽检测\n- 自动翻译与行业词汇自适应对齐`,
    dependentTools: ["exec_safe_select", "export_financial_metrics"],
    testCases: [
      { id: "tc-1", name: "2025Q4 财报验证", input: "评估文件 2025_Q4_Report.pdf 并生成总结", expected: "生成成功，提取出收入 1.2亿, 同比增加 12.5%, 毛利率 42.1%" },
      { id: "tc-2", name: "结构不匹配对齐", input: "分析格式毁损的财务附表", expected: "返回错误：'未能在指定区域定位到母公司现金流量平衡表'" }
    ]
  },
  {
    id: "asset-2",
    name: "合同法律条款风险审核",
    code: "contract_legal_auditor",
    type: "Skill",
    description: "快速审查电子合同文本中的排他性、赔偿限额以及争议管辖权等条款中的高危法律陷阱并进行批注提示。",
    version: "v0.1.0",
    project: "法务合同助手 (Legal Assistant)",
    owner: "王磊 (Leo)",
    status: "draft",
    recentTestStatus: "none",
    updatedAt: "2026-06-14 10:12:00",
    calls: 0,
    tags: ["Legal", "Auditing", "DocReview"],
    visibility: "private",
    skillMd: `# 合同法律条款风险审核\n\n自动对照企业内部合规审查条款库，审查任意租赁、外包、销售合同文本的安全度。\n\n## 主要审计项\n- 赔偿额度是否有封顶条款\n- 是否存在不可撤销排他协议`,
    dependentTools: ["read_sandbox_file"],
    testCases: [
      { id: "tc-3", name: "标准的雇佣合同校验", input: "检查 standard_hr_employment_contract.txt 中的保密和退税责任", expected: "扫描完毕，发现 1 项中风险（在第八条关于研发成果归属定义的过度衍生）" }
    ]
  }
];
