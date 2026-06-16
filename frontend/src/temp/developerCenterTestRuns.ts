/**
 * Temporary prototype data.
 * Replace with API data when backend integration begins.
 */

import { TestRun } from "../types/developer-center";

export const MOCK_DEVELOPER_TEST_RUNS: TestRun[] = [
  {
    id: "tr-1",
    testName: "2025Q4 财务附表全面解析验证",
    assetId: "asset-1",
    assetName: "财务报表摘要智能生成器",
    assetType: "Skill",
    testVersion: "v1.2.0",
    environment: "Staging",
    status: "pass",
    duration: 3524,
    executor: "李娜 (Lina)",
    executionTime: "2026-06-15 15:28:10",
    input: "评估文件 2025_Q4_Report.pdf 并生成总结，重点比对母公司现金流量表",
    expectedResult: "生成成功，提取出收入 1.2亿, 同比增加 12.5%, 毛利率 42.1%",
    actualResult: "分析生成完成：[高拟合财务摘要] 指标提取：当年主营业务收入 120,405,200.00 元 (符合 1.2 预判)，同比高增长 12.51%，销售毛利率 42.12%。",
    steps: [
      "1. 提取资产负债表与损益表的原始 PDF 流并读取表单元数据",
      "2. 调用 MCP 对应工具：export_financial_metrics 提取比率",
      "3. 组装提示词发送至企业服务器处理中心",
      "4. 合成结构化分析 MD 文档结构"
    ],
    toolCalls: [
      {
        toolName: "export_financial_metrics",
        args: `{"companyCode": "HAZE_PROD", "metricsList": ["ROE", "EBITDA_MARGIN"]}`,
        result: `{"results": {"ROE": "14.8%", "EBITDA_MARGIN": "19.2%"}, "currency": "CNY"}`
      }
    ]
  },
  {
    id: "tr-2",
    testName: "未指定报表格式降级对齐测试",
    assetId: "asset-1",
    assetName: "财务报表摘要智能生成器",
    assetType: "Skill",
    testVersion: "v1.2.0",
    environment: "Sandbox",
    status: "fail",
    duration: 1845,
    executor: "李娜 (Lina)",
    executionTime: "2026-06-15 15:10:00",
    input: "分析格式毁损的财务附表_damaged.xls",
    expectedResult: "返回错误：'未能在指定区域定位到母公司现金流量平衡表'",
    actualResult: "Error: ParseExcelFailed - Excel 单元格结构缺失 (Row 42 Col 3)，无法识别主营收入起始行。",
    steps: [
      "1. 载入损坏的二进制 .xls 数据文件",
      "2. 尝试执行文件校验与格式定位",
      "3. 发现必要的损益表标题行格式缺失",
      "4. 抛出异常并写入错误监控堆栈"
    ],
    toolCalls: [],
    errorSummary: "ParseExcelFailed: 未能在指定区域定位到母公司现金流量平衡表，第 42 行结构断层"
  },
  {
    id: "tr-3",
    testName: "电子租赁合同合规基础扫描",
    assetId: "asset-2",
    assetName: "合同法律条款风险审核",
    assetType: "Skill",
    testVersion: "v0.1.0",
    environment: "Sandbox",
    status: "unexecuted",
    duration: 0,
    executor: "王磊 (Leo)",
    executionTime: "2026-06-14 10:12:00",
    input: "检查 generic_office_lease_contract.txt 中的纠纷及赔付约定",
    expectedResult: "扫描完毕，发现并标红合同中的高危管辖权与无法免除的不合理条款",
    actualResult: "未开始执行",
    steps: [],
    toolCalls: []
  },
  {
    id: "tr-4",
    testName: "批量舆情词典极限压力吞吐",
    assetId: "asset-3",
    assetName: "电商评价多维情感极性分析",
    assetType: "Skill",
    testVersion: "v1.0.0-beta.2",
    environment: "Staging",
    status: "executing",
    duration: 14205,
    executor: "张杰 (Jack)",
    executionTime: "2026-06-15 18:45:00",
    input: "连续灌入 10000 条混杂了密集同义词与标点的在线商品劣评日志",
    expectedResult: "成功在大并发下计算多维度权重评分，无超时，并在 db 标记异常舆情点",
    actualResult: "正在进行队列语义向量切分...",
    steps: [
      "1. 多线程分片加载在线日志",
      "2. 提交到内部 Embedding 集群进行特征映射 (当前进度 42%)"
    ],
    toolCalls: []
  },
  {
    id: "tr-5",
    testName: "常规投递候选人信息解析比对",
    assetId: "asset-5",
    assetName: "智能简历解析与岗位契合度匹配器",
    assetType: "Skill",
    testVersion: "v2.0.1",
    environment: "Production",
    status: "pass",
    duration: 4100,
    executor: "刘洋 (Alex)",
    executionTime: "2026-06-15 08:28:15",
    input: "解析 candidate_bob_resume.pdf 并评估与 Senior_Architect 职能契合度",
    expectedResult: "契合度为 88.5%, 在并发中间件经验有 95% 满足度，英文书写有轻度缺陷",
    actualResult: "【匹配报告】 候选人 Bob 评估分: 88.5，技能分布：Kubernetes = 90，React = 85。与 Senior_Architect 契合，高弹性并发设计经验完全满足，额外在文档书写方面建议二轮电话抽测。",
    steps: [
      "1. 通过 read_sandbox_file 模块安全读取简历 PDF 纯文本",
      "2. 精准归一化高校及就职起止年份",
      "3. 自动化提取关键词，关联架构师 JD 多维度岗位标准",
      "4. 生成结构化评分大纲"
    ],
    toolCalls: [
      {
        toolName: "read_sandbox_file",
        args: `{"relativePath": "resumes/candidate_bob_resume.txt"}`,
        result: `{"content": "Bob, 10 Years Dev, Former Tech Lead. Expert at high-concurrency systems, Spring Cloud and k8s.", "byteSize": 12500}`
      }
    ]
  },
  {
    id: "tr-6",
    testName: "反爬虫防御触发与异常日志捕获",
    assetId: "asset-6",
    assetName: "竞争对手价格实时监控与调价建议",
    assetType: "Skill",
    testVersion: "v1.0.2",
    environment: "Production",
    status: "fail",
    duration: 9530,
    executor: "杨波 (Bob)",
    executionTime: "2026-06-15 19:12:44",
    input: "对拼多多 20 个主打 SKU 定日定时拉网采样",
    expectedResult: "拿到完好的价格 JSON 数据并推荐调价系数",
    actualResult: "Error: HttpForbiddenResponseException (503 Service Unavailable / Slider Anti-Crawler Alert)",
    steps: [
      "1. 发射爬虫探针握手信号",
      "2. 代理池轮转发现大部分被 PDD 防火墙识别",
      "3. 跳出拼多多安全滑块验证验证",
      "4. 中断抛出，捕获 HttpForbiddenResponseException 错误"
    ],
    toolCalls: [],
    errorSummary: "HttpForbiddenResponseException: 请求频繁被重定向到验证码页，滑块阻断 3 级响应"
  },
  {
    id: "tr-7",
    testName: "大单品高比例跌价红区阻断测试",
    assetId: "asset-6",
    assetName: "竞争对手价格实时监控与调价建议",
    assetType: "Skill",
    testVersion: "v1.0.2",
    environment: "Production",
    status: "fail",
    duration: 5210,
    executor: "杨波 (Bob)",
    executionTime: "2026-06-14 19:10:00",
    input: "对淘宝 iPad Pro 报价跌落 30% 异常调价校验",
    expectedResult: "系统风控成功警示警告，不准许直接同步淘宝最低报价",
    actualResult: "Error: PriceFloorBreachedException - 外部报价 3500 元低于设定红线 4200 元幅度过大，已自动降噪挂起。",
    steps: [
      "1. 拉取外部竞品列表并检测其价格降幅为 32%",
      "2. 触发风控安全阈值 (MAX_DROP = 15%)",
      "3. 抛出严重预警，并停止后台程序联动同步"
    ],
    toolCalls: [],
    errorSummary: "PriceFloorBreachedException: 竞品价格背离企业核定红线，价格偏离差达 32.1%"
  },
  {
    id: "tr-8",
    testName: "安全数据库探针心跳联通性探测",
    assetId: "asset-7",
    assetName: "企业内部数据库安全连接服务",
    assetType: "MCP Server",
    testVersion: "v2.1.2",
    environment: "Production",
    status: "pass",
    duration: 180,
    executor: "王磊 (Leo)",
    executionTime: "2026-06-15 20:00:10",
    input: "发送 MCP 握手心跳与 list_tools 查询",
    expectedResult: "握手通过，返回 3 个合格 Tools、2 个特定 Resources 并返回协议规范版本号",
    actualResult: "Status HTTP 200 OK. Protocols meta v1.0.1. Handshake approved with 3 registered tools and DB resource paths.",
    steps: [
      "1. 发起安全握手 Header 加签",
      "2. 校验后端服务秘钥 (SEC_HAZE_PROD_DB_SECRET)",
      "3. 请求列出可用工具",
      "4. 封包返回 JSON 并评估网络响应延迟"
    ],
    toolCalls: []
  },
  {
    id: "tr-9",
    testName: "受控制读写沙箱物理边界越界测试",
    assetId: "asset-8",
    assetName: "工作区受控文件系统沙箱服务",
    assetType: "MCP Server",
    testVersion: "v1.0.0",
    environment: "Sandbox",
    status: "pass",
    duration: 85,
    executor: "刘洋 (Alex)",
    executionTime: "2026-06-15 11:35:00",
    input: "发起 read_file 请求，路径注入 '../../etc/passwd'",
    expectedResult: "探测到多级物理非法越界注入，被 MCP 中间件安全模块拦截拦截并提示禁止访问",
    actualResult: "Success (Correct Negative Response) - 拦截成功：relativePath 不在安全白名单沙箱 `./sandbox` 基准线下。",
    steps: [
      "1. 接收 relativePath: '../../etc/passwd'",
      "2. 安全沙箱路径标准化防溢出计算得到物理目标路径为 /etc/passwd",
      "3. 进行边界沙包安全围栏检查 (is_inside_subdir)",
      "4. 安全合规拦截并返回标准的拒绝指示代码"
    ],
    toolCalls: []
  },
  {
    id: "tr-10",
    testName: "老旧工单接口遗留阻断轮询",
    assetId: "asset-9",
    assetName: "旧版 Redmine 缺陷管理同步后端",
    assetType: "MCP Server",
    testVersion: "v0.8.5",
    environment: "Sandbox",
    status: "cancelled",
    duration: 15200,
    executor: "系统后台 (System Sync)",
    executionTime: "2026-06-10 14:01:00",
    input: "定时循环轮询 Redmine 节点并过滤已归档问题",
    expectedResult: "由于该老旧服务已被官方封存，不应执行轮询逻辑，执行优雅中退",
    actualResult: "Test run was cancelled by user - 服务属于 Disabled 状态，轮询在进行到第 3 大环时被用户强制拦截注销。",
    steps: [
      "1. 发送 HTTP 会话鉴权请求",
      "2. 超时未回复，等待 15 秒后用户从控制面板点击 '取消测试'"
    ],
    toolCalls: []
  },
  {
    id: "tr-11",
    testName: "执行极高并发数据库 SELECT 操作",
    assetId: "asset-7",
    assetName: "企业内部数据库安全连接服务",
    assetType: "MCP Server",
    testVersion: "v2.1.2",
    environment: "Production",
    status: "pass",
    duration: 890,
    executor: "王磊 (Leo)",
    executionTime: "2026-06-15 19:40:00",
    input: "发送 exec_safe_select 工具，SQL 携带多表 JOIN 操作",
    expectedResult: "提取大关联表成功，安全限切 100 行，无死锁情况，耗时在 1s 内",
    actualResult: "Successfully executed SELECT with 100 rows truncated. DB cost: 840ms. Network cost: 50ms.",
    steps: [
      "1. 校验 SQL 只读特征",
      "2. 向后台数据库执行并发隔离联接查询",
      "3. 限制返回最大 100 行数据封包",
      "4. 返回结果 JSON 包"
    ],
    toolCalls: []
  },
  {
    id: "tr-12",
    testName: "沙箱文本读取常规尺寸极速加载",
    assetId: "asset-8",
    assetName: "工作区受控文件系统沙箱服务",
    assetType: "MCP Server",
    testVersion: "v1.0.0",
    environment: "Sandbox",
    status: "pass",
    duration: 35,
    executor: "刘洋 (Alex)",
    executionTime: "2026-06-15 11:20:00",
    input: "读取 12KB 大小的 standard_readme.md 文本",
    expectedResult: "一次性读取干净并返回中文字符支持良好的文本包",
    actualResult: "Success - Byte size: 12400. Content structure loaded perfectly. Encoding: utf-8.",
    steps: [
      "1. 读取本地 sandbox/standard_readme.md 文件",
      "2. 字节流转码 UTF-8 校验首部",
      "3. 返回完整文本 JSON 格式"
    ],
    toolCalls: []
  }
];
