import { CapabilityItem } from "../types/capability";

export const CUSTOM_CATEGORIES = [
  { id: "all", zh: "全部", en: "All", ja: "すべて", es: "Todo" },
  { id: "analytics", zh: "数据分析", en: "Data Analytics", ja: "データ分析", es: "Análisis de Datos" },
  { id: "dev", zh: "软件开发", en: "Software Development", ja: "ソフトウェア開発", es: "Desarrollo de Software" },
  { id: "office", zh: "企业办公", en: "Enterprise Office", ja: "企業オフィス", es: "Oficina Empresarial" },
  { id: "sales", zh: "电商运营", en: "E-Commerce", ja: "Eコマース運営", es: "E-Commerce" },
  { id: "finance", zh: "财务", en: "Finance", ja: "財務", es: "Finanzas" },
  { id: "hr", zh: "人力资源", en: "Human Resources", ja: "人事", es: "Recursos Humanos" },
  { id: "knowledge", zh: "知识检索", en: "Knowledge Search", ja: "ナレッジ検索", es: "Búsqueda de Conocimiento" },
  { id: "workflow", zh: "流程协作", en: "Workflow", ja: "ワークフロー", es: "Flujo de Trabajo" }
];

export const POPULAR_SEARCHES = [
  { zh: "数据分析", en: "Data Analytics", ja: "データ分析", es: "Análisis" },
  { zh: "知识检索", en: "Knowledge Search", ja: "ナレッジ検索", es: "Búsqueda" },
  { zh: "SQL", en: "SQL", ja: "SQL", es: "SQL" },
  { zh: "文档生成", en: "Document Gen", ja: "文書作成", es: "Generar Doc" },
  { zh: "电商运营", en: "E-Commerce", ja: "Eコマース", es: "E-Commerce" }
];

export const MOCK_CAPABILITIES: CapabilityItem[] = [
  // ==================== SKILLS ====================
  {
    id: "sk_1",
    name: "销售日报自动分析",
    type: "Skill",
    description: "汇聚并自动分析前一日全渠道销售数据，自动产出包含异动归因、趋势预测、高潜货品及爆款建议的结构化日报。",
    calls: 1248,
    status: "active",
    author: "数据科学部",
    version: "v2.1.0",
    updateTime: "2026-06-12",
    permissionsStatus: "direct",
    riskLevel: "low",
    department: "数据科学部",
    tags: ["数据分析", "电商运营", "自动化"],
    scenarios: ["主站每日销售分析", "大促业绩跟踪", "异常销售归因"],
    whatItCanDo: ["提炼多维度销售核心指标与同比变动", "识别非正常下滑/暴涨品类并做下钻归因", "生成图表和排版考究的 Markdown 销售简报"],
    whatItCantDo: ["无法关联未在ERP登记的其他销售渠道数据", "不负责实际执行降价或促量修改指令"],
    inputExample: "请分析2026年6月14日华东区女装品类日报，销售额500万，退货率高达15%。",
    outputExample: "### 华东区女装品类日报分析报告\n\n**核心结论：** 6月14日销售额环比下滑4.2%，但退货率达15%（触发红色预警）。\n\n**归因分析：** 退货率激增主要来源于 `sk-1029` 连衣裙（退货率34%），用户反馈其尺码严重偏小。",
    steps: ["输入分析日期与核心指标", "大模型调用ERP模型提取多因子属性", "完成多因子交叉比对算法生成报告"],
    examples: ["分析昨日跨境电商服饰类目表现", "诊断本周数码配件退货率异常升高的原因"],
    notes: ["建议配合企業数据中心 MCP 获取精准元数据", "分析时请注意保证本地区服划分与账期口径一致"],
    dependencies: [
      { type: "MCP Server", name: "企业数据中心 MCP" }
    ]
  },
  {
    id: "sk_2",
    name: "企业知识检索助手",
    type: "Skill",
    description: "一站式极速检索、提炼企业所有历史规章制度、福利标准、技术红皮书，安全防泄露，带有溯源引用。",
    calls: 5410,
    status: "active",
    author: "信息安全部",
    version: "v4.0.2",
    updateTime: "2026-06-14",
    permissionsStatus: "granted",
    riskLevel: "low",
    department: "行政与安全部",
    tags: ["知识检索", "企业办公", "行政制度"],
    scenarios: ["新员工入职导引培训", "公司最新财务与差旅规程核实", "IT技术栈架构查阅"],
    whatItCanDo: ["在万级文档库中执行向量交叉检索", "提供带有原文段落和引用文件出处的答复", "自动总结规章相似点，去重合并"],
    whatItCantDo: ["不能查阅标有机密安全级别的高敏感未授权机要公文", "不支持外部公共网络搜索引擎搜索"],
    inputExample: "北京分公司的差旅住宿标准是多少？有餐补吗？",
    outputExample: "依据《2026企业差旅管理标准第四版》，北京分公司普通员工住宿标准为 500元/天。提供出差期间 80元/天 的餐费补助，无需发票凭证。",
    steps: ["在对话框中输入行政人事相关疑问", "系统自动解析疑问并进行向量检索", "大模型合成有来源的政策说明文档"],
    examples: ["年假调休有过期说吗？", "如何报销办公电脑损耗？"],
    notes: ["各分公司细则不同，若未指明城市，系统默认基于集团总部一般标准回复"],
    dependencies: []
  },
  {
    id: "sk_3",
    name: "行业研报深度分析",
    type: "Skill",
    description: "提供金融级、逻辑闭环的深度分析能力。快速剖析数十万字多格式券商、机构研报，自动绘制商业画布与竞对矩阵。",
    calls: 890,
    status: "active",
    author: "战略规划部",
    version: "v1.2.0",
    updateTime: "2026-06-11",
    permissionsStatus: "need_apply",
    riskLevel: "medium",
    department: "战略规划部",
    tags: ["数据分析", "财务", "决策辅助"],
    scenarios: ["前瞻性赛道筛选与可行性论证", "行业核心头部玩家竞争优势拆解", "市场复合增长率(CAGR)预测整理"],
    whatItCanDo: ["自动解析并对比多篇超长 PDF/Docs 格式研究报告", "提炼估值区间、PE模型及主推逻辑核心要点", "自动形成波特五力模型和 SWOT 分析大纲"],
    whatItCantDo: ["无法绝对保证未来财务模型的100%精准度，仅供决策辅助", "不能拉取非上市公司的机密财务账目"],
    inputExample: "深度总结2025年集成电路先进制程及设备国产化替代进程研究报告。",
    outputExample: "**研报摘要：** 我国半导体先进制程在刻蚀、薄膜沉积领域国产化率突破45%，但光刻及量测环节依旧承压。预测2026年复合增长率在18.2%左右。",
    steps: ["上传研报 PDF 附件或提供研报本地路径", "开始向量块深度精读，解析所有图表与数表", "选择商业画布或竞对分析矩阵输出格式"],
    examples: ["如何评价今年新能源储能市场的增速降温？", "对比华为与特斯拉在智能驾驶的硬件选择差异"],
    notes: ["由于本项应用消耗高算力 Token 较多，建议单次研报上传不超过 3 份"],
    dependencies: []
  },
  {
    id: "sk_4",
    name: "API 文档自动生成器",
    type: "Skill",
    description: "解析业务系统代码仓库、SQL Schema 或 swagger 配置描述，全自动生成国际化、结构清晰且配有样例的 API 标准技术文档。",
    calls: 312,
    status: "active",
    author: "基础架构部",
    version: "v1.0.5",
    updateTime: "2026-06-08",
    permissionsStatus: "pending",
    riskLevel: "low",
    department: "技术委员会",
    tags: ["软件开发", "流程协作", "文档生成"],
    scenarios: ["老旧服务API重构生成全新 Swagger/OpenAPI 标准", "快速为合规团队输出对外 API 输出说明", "自动根据 controller 逆向产出多语言 SDK 框架"],
    whatItCanDo: ["深度理解 TypeScript, Java, Python 及 Go 语言声明", "自动对接口功能及参数做多语言自动润色", "生成可立即导入 Postman/Apifox 的 OpenAPI 3.0 JSON"],
    whatItCantDo: ["不能直接从无逻辑的白盒编译后二进制包分析接口", "不提供实际代码向测试环境的部署运行维护服务"],
    inputExample: "请为以下 TypeScript Express 的 User 接口生成文档:\n```ts\napp.post('/api/user', (req, res) => { ... })\n```",
    outputExample: "### POST /api/user\n\n描述：注册或更新企业内部成员节点。\n\n**请求头 (Headers):**\n- `Content-Type`: `application/json`\n\n**请求体 (Request Body):**\n| 字段 | 类型 | 必填 | 描述 |\n|---|---|---|---|\n| name | string | 是 | 用户姓名 |",
    steps: ["复制相关控制器代码或数据库 DDL", "选择目标输出语言与模板风格", "系统深度静态分析并润色生成对应格式说明"],
    examples: ["帮我给电商结算微服务生成 markdown 文档", "把下面这段 SQL 表 schema 转成 API 参数定义"],
    notes: ["为获得最佳解析质量，代码应附带完整规范的变量命名与JSDoc注释说明"],
    dependencies: [
      { type: "MCP Tool", name: "generate_api_document" }
    ]
  },
  {
    id: "sk_5",
    name: "Excel 数据智能化加工",
    type: "Skill",
    description: "高级复杂多表 VLOOKUP 替换、乱码清理、格式对齐以及透视表自动设计。用自然语言解决千奇百怪的复杂统计整理诉求。",
    calls: 1540,
    status: "active",
    author: "财务共享中心",
    version: "v3.2.0",
    updateTime: "2026-06-13",
    permissionsStatus: "expired",
    riskLevel: "medium",
    department: "财务共享部",
    tags: ["数据分析", "企业办公", "文件处理"],
    scenarios: ["两表按错乱的主键外键多重匹配汇总", "合并几十张不规则分表，抹平字段差异", "清理姓名括号中多余的空格与不兼容符号"],
    whatItCanDo: ["使用基于多步骤决策的 Python Pandas 算子脚本对数据执行清洗", "自动检测表格潜在的数据异常与极值，并予以警示标记", "重新包装生成完全保留原有公式、图表和样式的 XLSX 文件"],
    whatItCantDo: ["无法处理单文件超过 1GB 或已被部分加密的物理锁死表格"],
    inputExample: "帮我把表A的‘商户名’和表B的‘流水记录’关联，若多重出现则进行累计求和，保存新表。",
    outputExample: "完成关联汇总。共匹配到 540 个商户。其中 12 个商户在表B中无匹配。已为您建立全新名为 `result_consolidated.xlsx` 表，包含累计求项。",
    steps: ["上传待处理的原始 Excel 文件", "在对话框中用白话输入您期望实现的清洗、转化甚至公式计算要求", "点击运行展示预览数据及执行代码，满意后下载最终新表"],
    examples: ["过滤所有销售额小于1000且客服评价低于3星的行", "把混在一个单元格里的‘省-市-区-具体地址’按逗号拆分成4列"],
    notes: ["由于清洗引擎运行于沙箱沙盒中，生成的文件暂存在云端，请在生成后的24小时内下载"],
    dependencies: [
      { type: "MCP Tool", name: "export_excel" }
    ]
  },
  {
    id: "sk_6",
    name: "客服对话精准总结",
    type: "Skill",
    description: "自动提炼 50 轮以上的复杂多重对话、客服录音转文本，极速提炼客诉要点、情绪极值并自动生成工单分派到对应职责单元。",
    calls: 2011,
    status: "maintenance",
    author: "客户服务部",
    version: "v1.5.0",
    updateTime: "2026-06-10",
    permissionsStatus: "direct",
    riskLevel: "low",
    department: "客户服务部",
    tags: ["企业办公", "绩效看板", "知识检索"],
    scenarios: ["海量日常投诉数据自动打标与分类聚类", "质检抽样自动提取，并针对恶劣对话发出警报", "针对退换货争议提炼出事件责任主体链条"],
    whatItCanDo: ["提炼出对话双方的态度情感极值与争议焦点", "一秒生成标准的包含“发生事件-用户要求-解决方案”的规范工单描述", "支持对多渠道接入（飞书、公众号、网页客服）对话提炼汇总"],
    whatItCantDo: ["无法直接拦截正在发生的激烈热线对话并强行挂断/介入", "总结不代表质检仲裁的最终法律效力结论"],
    inputExample: "输入1500字工单对话文本:‘用户投诉快递弄丢，客服态度不好推倭，用户要求赔偿...’",
    outputExample: "### 客户诉求工单汇总表\n\n- **客诉主要矛盾：** 快递延误破损后无人认领。客服 `A-05` 处理时存在‘已读不理’行为。\n- **商户情绪级别：** 愤怒 (4星级)\n- **分派目的地：** 逆向下单纠纷处理项目组",
    steps: ["将海量文本或客服工作流日志粘贴或连入对应端口", "大模型通过结构化提取语法归纳关键事件", "自动分类并在内部触发工单流推荐推送"],
    examples: ["把昨天售后的 300 份对话做聚合报告，找出前三名最主要的商品缺陷", "批量抽查新晋客服的态度得分走势分析表"],
    notes: ["维护中状态：由于后台工单派发API正在接口架构升级，部分工单暂不能直接物理发送，现处于生成状态缓存模式。"],
    dependencies: []
  },

  // ==================== MCP SERVERS ====================
  {
    id: "mcp_s1",
    name: "企业数据中心 MCP",
    type: "MCP",
    description: "连接公司核心 PostgreSQL 业务数据网格。支持安全地对销售库、商户库、供应链看板元数据与实时流水进行统一的上下文获取和多维度安全检索。",
    calls: 15400,
    status: "active",
    author: "基础软件部",
    version: "v5.0.0",
    updateTime: "2026-06-15",
    permissionsStatus: "need_apply",
    riskLevel: "high",
    department: "基础软件部",
    systemName: "Core Data Fabric (ERP)",
    toolsCount: 3,
    resourcesCount: 12,
    promptsCount: 4,
    connectType: "gRPC On-Premise Secure Tunnel",
    avgResponseTime: "45ms",
    accessInstruction: "本 MCP 服务器包含高敏感的企业生产流水数据，所有外部请求均在信息防泄露沙箱内审计拦截，调用端需持有 `auth-token-level-3` 并在审批通过后方能获取连接地址。",
    resourcesList: [
      "postgres://internal-sales-db/schema",
      "postgres://inventory-read-replica/catalog_metadata",
      "postgres://customer-loyalty-service/active_tiers"
    ],
    promptsList: [
      "analyze-monthly-sales-trends (年度、季度及按月拆解的高性能销售汇总视图指导词)",
      "diagnostic-inventory-bottlenecks (用于快速诊断多仓库存预警、SKU呆滞的通用提示词手册)"
    ],
    toolsList: [
      { name: "query_sales_data", description: "按产品代码、日期段和部门 ID 执行经过审计的高合规性销售流水查询", isReadonly: true, riskLevel: "medium", permissionsStatus: "need_apply", status: "active" },
      { name: "get_user_profile", description: "查询内部注册员工与其业务归属实体（不包含个人身份隐私等敏感字段）", isReadonly: true, riskLevel: "low", permissionsStatus: "direct", status: "active" },
      { name: "export_excel", description: "将多表复杂格式结果输出生成格式考究、符合企业要求的原生 XLS 网格并提供高速下载", isReadonly: false, riskLevel: "medium", permissionsStatus: "expired", status: "active" }
    ]
  },
  {
    id: "mcp_s2",
    name: "GitHub 协作连接器",
    type: "MCP",
    description: "一键打通企业内部自建 Git 仓库及公共 GitHub 组织仓库上下文。支持 AI 代理动态精读特定仓库的源码、Issue 反馈信息、自动提交经过评估的 PR 或评审任务。",
    calls: 3200,
    status: "active",
    author: "DevOps 团队",
    version: "v2.2.1",
    updateTime: "2026-06-13",
    permissionsStatus: "granted",
    riskLevel: "medium",
    department: "DevOps工作组",
    systemName: "Internal GitLab / GitHub Organization",
    toolsCount: 6,
    resourcesCount: 4,
    promptsCount: 2,
    connectType: "WebSocket Proxy via SSH Gate",
    avgResponseTime: "120ms",
    accessInstruction: "采用 OAuth 认证机制进行多端资源限制与授权校验。已经授权给个人工作空间使用，您可以用直接运行调试、调用内部 API 进行敏捷 DevOps 工具链搭建。",
    resourcesList: [
      "github://enterprise-org/repos/active-list",
      "github://repository/meta-manifest"
    ],
    promptsList: [
      "review-code-pr-style (用于自动化审查并打分 PR 样式、测试覆盖、不安全声明的代码范本)",
      "draft-release-news (根据两版本间 commits 自动聚合分类撰写技术中台更新日志的提示词模板)"
    ],
    toolsList: [
      { name: "read_repository", description: "深度克隆/静态扫描特定 Git 项目仓库中的多个文本源码文件并抽取摘要", isReadonly: true, riskLevel: "low", permissionsStatus: "pending", status: "active" },
      { name: "search_code", description: "在全组织的有效公开仓库代码库中基于正则表达式进行关键片段查找定位", isReadonly: true, riskLevel: "low", permissionsStatus: "direct", status: "active" },
      { name: "send_approval_request", description: "在对关键流程产生深远影响（如线上删除、配置重构、批量重写等）前触发工单确认", isReadonly: false, riskLevel: "high", permissionsStatus: "direct", status: "active" }
    ]
  },
  {
    id: "mcp_s3",
    name: "企业文件系统 MCP",
    type: "MCP",
    description: "连接网盘、协同办公网盘及本地大容量共享存储群组。支持高吞吐大文件挂载、文件变动监听、在线格式快速转换为多重 AI 解析器可识别的纯文本文档格式。",
    calls: 410,
    status: "maintenance",
    author: "IT 运维中心",
    version: "v1.1.0",
    updateTime: "2026-06-10",
    permissionsStatus: "direct",
    riskLevel: "high",
    department: "IT技术共享部",
    systemName: "Network Attached Storage (NAS) / WebDAV Client",
    toolsCount: 4,
    resourcesCount: 2,
    promptsCount: 0,
    connectType: "Direct OS Kernel Mounted Port (Samba/WebDAV)",
    avgResponseTime: "80ms",
    accessInstruction: "维护期间，当前 Samba 共享挂载通道进行只读锁死，在 6 月 16 日系统升级完成后将恢复写权限。仅提供特定根节点下经过安全鉴密后的公开文档挂载，高涉密目录目前无法在文件市场直接进行连接。",
    resourcesList: [
      "nas://root-network-nas/public_docs",
      "nas://engineering-manuals/current_v3"
    ],
    promptsList: [],
    toolsList: [
      { name: "search_enterprise_docs", description: "基于文件全文描述和属性在共享云盘、NAS及本地特定公共网格中检索相应文档", isReadonly: true, riskLevel: "low", permissionsStatus: "granted", status: "active" }
    ]
  },

  // ==================== MCP TOOLS ====================
  {
    id: "tl_1",
    name: "query_sales_data",
    type: "Tool",
    description: "按产品代码、日期段和部门 ID 执行经过审计的高合规性销售流水查询。限制最大返回数据为 1000 行元信息，以保障性能稳定性。",
    calls: 6410,
    status: "active",
    author: "基础软件部",
    version: "v3.1.0",
    updateTime: "2026-06-15",
    permissionsStatus: "need_apply",
    riskLevel: "medium",
    department: "基础软件部",
    mcpServerName: "企业数据中心 MCP",
    isReadonly: true,
    needConfirmation: false,
    paramsCount: 4,
    avgResponseTime: "30ms",
    paramsList: [
      { name: "product_code", type: "string", required: true, description: "必填。需要筛选汇总的特定 SKU 专属销售条码，多项可用逗号拼接。" },
      { name: "start_date", type: "string", required: true, description: "必填。起始统计时间走势日期，格式 YYYY-MM-DD。" },
      { name: "end_date", type: "string", required: true, description: "必填。终止日期，必须等于或晚于 start_date，格式 YYYY-MM-DD。" },
      { name: "department_id", type: "string", required: false, description: "选填。仅查看特定业务组/事业群下的局部销售指标，忽略则汇总全渠道。" }
    ],
    inputSchema: `{
  "type": "object",
  "properties": {
    "product_code": { "type": "string", "description": "SKU 专属销售码" },
    "start_date": { "type": "string", "description": "起始日期 YYYY-MM-DD" },
    "end_date": { "type": "string", "description": "终止日期 YYYY-MM-DD" },
    "department_id": { "type": "string", "description": "对应事业部 ID" }
  },
  "required": ["product_code", "start_date", "end_date"]
}`,
    outputExample: `[
  { "date": "2026-06-14", "sku": "sk-1029", "volume": 1205, "revenue": 120500.0, "currency": "RNY", "refund_rate": 0.05 },
  { "date": "2026-06-14", "sku": "sk-1030", "volume": 540, "revenue": 54000.0, "currency": "RNY", "refund_rate": 0.02 }
]`
  },
  {
    id: "tl_2",
    name: "search_enterprise_docs",
    type: "Tool",
    description: "基于文件全文描述和属性在共享云盘、NAS及本地特定公共网格中检索相应文档名称、位置与段落定位，支持语义理解筛选。",
    calls: 12040,
    status: "active",
    author: "IT 运维中心",
    version: "v2.0.0",
    updateTime: "2026-06-13",
    permissionsStatus: "granted",
    riskLevel: "low",
    department: "IT技术共享部",
    mcpServerName: "企业文件系统 MCP",
    isReadonly: true,
    needConfirmation: false,
    paramsCount: 2,
    avgResponseTime: "110ms",
    paramsList: [
      { name: "query", type: "string", required: true, description: "必填。需要模糊或语义相关的搜索关键词，如‘2026福利年假标准’。" },
      { name: "file_format", type: "string", required: false, description: "选填。指定文件类型做第一阶段强条件过滤筛选（pdf, docx, xlsx, md）。" }
    ],
    inputSchema: `{
  "type": "object",
  "properties": {
    "query": { "type": "string", "description": "检索短句" },
    "file_format": { "type": "string", "enum": ["pdf", "docx", "xlsx", "md"], "description": "约束文档后缀" }
  },
  "required": ["query"]
}`,
    outputExample: `[
  { "filename": "2026集团员工福利白皮书.pdf", "path": "nas://hr_docs/manuals/", "score": 0.94, "matching_paragraph": "北京分公司的差旅住宿标准为500元一天，含集团普通岗位级别享受出差每日80元膳食伙食补助..." }
]`
  },
  {
    id: "tl_3",
    name: "generate_api_document",
    type: "Tool",
    description: "高吞吐量静态与代码语义分析算法。将输入的规范代码块和表 DDL 结构极速润色转换生成高质量 API 说明书，符合主流企业文档协作网格排版。",
    calls: 418,
    status: "active",
    author: "技术委员会",
    version: "v1.1.2",
    updateTime: "2026-06-08",
    permissionsStatus: "direct",
    riskLevel: "low",
    department: "技术委员会",
    mcpServerName: "GitHub 协作连接器",
    isReadonly: false,
    needConfirmation: false,
    paramsCount: 3,
    avgResponseTime: "15ms",
    paramsList: [
      { name: "source_code", type: "string", required: true, description: "必填。需要转化为文档的 Controller 或 Schema 源码，包含完整的入参和注释。" },
      { name: "format", type: "string", required: true, description: "必填。选定导出风格模板模式（markdown, html, json_schema, swagger_api）。" },
      { name: "en_translation", type: "boolean", required: false, description: "选填。是否同步对业务文案与变量描述生成标准的英文直译对照组。" }
    ],
    inputSchema: `{
  "type": "object",
  "properties": {
    "source_code": { "type": "string", "description": "目标语言原始代码串" },
    "format": { "type": "string", "enum": ["markdown", "html", "json_schema", "swagger_api"], "description": "模板目标规范" },
    "en_translation": { "type": "boolean", "description": "是否一并英文翻译" }
  },
  "required": ["source_code", "format"]
}`,
    outputExample: `{
  "success": true,
  "formatted_text": "### POST /api/user\\n\\n**请求体 Parameters:**\\n- name (string): 注册真实名称\\n- age (number): 员工归纳年龄...",
  "size_bytes": 1420
}`
  },
  {
    id: "tl_4",
    name: "read_repository",
    type: "Tool",
    description: "受限的 GitLab/GitHub 克隆。静态扫描并拉取指定组织或白名单个人项目仓库中的核心文本代码源，并解析其主要工程依赖骨架。",
    calls: 204,
    status: "active",
    author: "DevOps 团队",
    version: "v1.0.0",
    updateTime: "2026-06-14",
    permissionsStatus: "pending",
    riskLevel: "low",
    department: "DevOps工作组",
    mcpServerName: "GitHub 协作连接器",
    isReadonly: true,
    needConfirmation: false,
    paramsCount: 3,
    avgResponseTime: "350ms",
    paramsList: [
      { name: "repo_url", type: "string", required: true, description: "必填。符合安全鉴权白名单的内外部有效 Git 服务器项目 HTTPS 全局地址。" },
      { name: "target_file_path", type: "string", required: false, description: "选填。特定目标源代码的相对文件位置，传空则扫描最外层核心入口骨架。" },
      { name: "max_lines", type: "number", required: false, description: "选填。单次解析代码的最大物理行数限制，默认为 500 行。" }
    ],
    inputSchema: `{
  "type": "object",
  "properties": {
    "repo_url": { "type": "string", "description": "项目 Git 地址" },
    "target_file_path": { "type": "string", "description": "目标文件相对位置" },
    "max_lines": { "type": "number", "description": "行数裁剪" }
  },
  "required": ["repo_url"]
}`,
    outputExample: `{
  "repo_name": "react-example",
  "file_retrieved": "src/main.tsx",
  "content": "import React from 'react';\\nimport ReactDOM from 'react-dom/client';\\nconsole.log('App started');... ",
  "truncated": false
}`
  },
  {
    id: "tl_5",
    name: "export_excel",
    type: "Tool",
    description: "接收复杂的表格结构化数据数组（JSON Array of Objects），在云端利用独立沙箱的高可移植性 pandas 快速转换生成配有特定主色标题行的完美 XLSX 文档。",
    calls: 1540,
    status: "active",
    author: "基础软件部",
    version: "v2.1.2",
    updateTime: "2026-06-13",
    permissionsStatus: "expired",
    riskLevel: "medium",
    department: "基础软件部",
    mcpServerName: "企业数据中心 MCP",
    isReadonly: false,
    needConfirmation: false,
    paramsCount: 3,
    avgResponseTime: "85ms",
    paramsList: [
      { name: "data_payload", type: "string", required: true, description: "必填。合法的 JSON 格式列表字符串，代表即将被转换并清洗的列-值记录对。" },
      { name: "sheet_name", type: "string", required: false, description: "选填。生成的目标 Excel 文件的子工作名，默认为‘Sheet1’。" },
      { name: "header_theme_color", type: "string", required: false, description: "选填。样式模板主题色方案，可选择（classic_blue, forest_green, warm_orange）。" }
    ],
    inputSchema: `{
  "type": "object",
  "properties": {
    "data_payload": { "type": "string", "description": "JSON 行数组序列化字符串" },
    "sheet_name": { "type": "string", "description": "工作表子项名称" },
    "header_theme_color": { "type": "string", "enum": ["classic_blue", "forest_green", "warm_orange"], "description": "首行标题背景色主题色配比" }
  },
  "required": ["data_payload"]
}`,
    outputExample: `{
  "success": true,
  "download_url": "/api/downloads/tasks/xlsx_65f8a0.xlsx",
  "rows_count": 480
}`
  },
  {
    id: "tl_6",
    name: "send_approval_request",
    type: "Tool",
    description: "向关联审批系统自动推送一条结构化的物理或组织工单审查事件。支持指定多重紧急系数，对于高危行为提供两段式的强制驳回或确认。",
    calls: 540,
    status: "active",
    author: "信息安全部",
    version: "v1.5.0",
    updateTime: "2026-06-11",
    permissionsStatus: "direct",
    riskLevel: "high",
    department: "行政与安全部",
    mcpServerName: "GitHub 协作连接器",
    isReadonly: false,
    needConfirmation: true,
    paramsCount: 3,
    avgResponseTime: "12ms",
    paramsList: [
      { name: "workflow_id", type: "string", required: true, description: "必填。需要触发审计流的关联任务 ID，如‘TASK-1025’。" },
      { name: "reason", type: "string", required: true, description: "必填。对此重大变更的合理性书面阐述与申请要点汇总描述。" },
      { name: "priority", type: "string", required: false, description: "选填。此审批的紧急响应等级，如（normal, high, critical），影响通知通道推送。" }
    ],
    inputSchema: `{
  "type": "object",
  "properties": {
    "workflow_id": { "type": "string", "description": "审批目标任务链条" },
    "reason": { "type": "string", "description": "操作业务原因" },
    "priority": { "type": "string", "enum": ["normal", "high", "critical"], "description": "任务优先级" }
  },
  "required": ["workflow_id", "reason"]
}`,
    outputExample: `{
  "dispatch_success": true,
  "ticket_number": "TKT-2026-06152",
  "assigned_team": "IT-SEC-TEAM",
  "status": "AWAITING_ORGANIZATIONAL_APPROVAL"
}`
  }
];
