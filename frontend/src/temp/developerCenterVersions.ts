/**
 * Temporary prototype data.
 * Replace with API data when backend integration begins.
 */

import { VersionRecord } from "../types/developer-center";

export const MOCK_DEVELOPER_VERSIONS: VersionRecord[] = [
  {
    id: "ver-1",
    version: "v1.2.0",
    assetId: "asset-1",
    assetName: "财务报表摘要智能生成器",
    status: "release",
    changelog: "增加对 export_financial_metrics 工具链的参数对齐支持，修复对繁体中文 PDF 文件转码时拼音解析出现的轻微丢词漏洞，支持自适应分页提取。",
    creator: "李娜 (Lina)",
    createdAt: "2026-06-15 10:00:00",
    publishedAt: "2026-06-15 15:30:00"
  },
  {
    id: "ver-2",
    version: "v1.1.0",
    assetId: "asset-1",
    assetName: "财务报表摘要智能生成器",
    status: "deprecated",
    changelog: "增加多级指标比对逻辑，扩充支持利润表与现金流量表在异常发生时的退化阻断提醒机制。",
    creator: "李娜 (Lina)",
    createdAt: "2026-06-01 09:20:00",
    publishedAt: "2026-06-01 10:45:00"
  },
  {
    id: "ver-3",
    version: "v1.0.0",
    assetId: "asset-1",
    assetName: "财务报表摘要智能生成器",
    status: "deprecated",
    changelog: "首个内部测试基础稳定版发布，实现基于 DQL 只读连接的表单摘要大模型翻译成稿逻辑。",
    creator: "李娜 (Lina)",
    createdAt: "2026-05-15 08:30:00",
    publishedAt: "2026-05-15 09:15:00"
  },
  {
    id: "ver-4",
    version: "v0.1.0",
    assetId: "asset-2",
    assetName: "合同法律条款风险审核",
    status: "draft",
    changelog: "合同风险基础审查 Skill 初始化草稿，预先编写了针对保密义务、排除纠纷地、赔偿上限等合规条目的基本判定规则和 SKILL.md 文档。",
    creator: "王磊 (Leo)",
    createdAt: "2026-06-14 10:00:00"
  },
  {
    id: "ver-5",
    version: "v1.0.0-beta.2",
    assetId: "asset-3",
    assetName: "电商评价多维情感极性分析",
    status: "beta",
    changelog: "优化情感分类模型适配多语种，增加了对拼多多、淘宝客服聊天评价数据的多线程分片降噪与向量聚合操作。",
    creator: "张杰 (Jack)",
    createdAt: "2026-06-15 11:15:00"
  },
  {
    id: "ver-6",
    version: "v1.1.0",
    assetId: "asset-4",
    assetName: "每日行业快讯自动成稿及社媒排版",
    status: "beta",
    changelog: "修改成稿模版适配小红书、微信公众号两种渠道排版，扩充了 emoji 卡片和技术术语自解释索引结构。",
    creator: "陈静 (Jane)",
    createdAt: "2026-06-12 09:00:00"
  },
  {
    id: "ver-7",
    version: "v2.0.1",
    assetId: "asset-5",
    assetName: "智能简历解析与岗位契合度匹配器",
    status: "release",
    changelog: "全面升级 CV 安全沙箱传输协议，新增对 PDF 表单内部图片和无格式混排文字的精确度空间聚类拆解，大幅度提升学历年份伪造判别的鲁棒性。",
    creator: "刘洋 (Alex)",
    createdAt: "2026-06-14 14:00:00",
    publishedAt: "2026-06-15 08:30:00"
  },
  {
    id: "ver-8",
    version: "v2.0.0",
    assetId: "asset-5",
    assetName: "智能简历解析与岗位契合度匹配器",
    status: "deprecated",
    changelog: "首个采用 Node FS 沙箱隔离的版本，支持本地白名单路径下的单个简历的同步读取，摒弃先前直连底层系统的设计形式。",
    creator: "刘洋 (Alex)",
    createdAt: "2026-05-20 10:00:00",
    publishedAt: "2026-05-21 09:00:00"
  },
  {
    id: "ver-9",
    version: "v2.1.2",
    assetId: "asset-7",
    assetName: "企业内部数据库安全连接服务",
    status: "release",
    changelog: "MCP 服务性能日常调优版，解决特定时区参数返回错误的时间戳问题。将 Safe Select 安全截断上限强制缩入 100 行，大幅压缩 SQL 联机超时至 3000ms。",
    creator: "王磊 (Leo)",
    createdAt: "2026-06-15 16:00:00",
    publishedAt: "2026-06-15 20:01:00"
  },
  {
    id: "ver-10",
    version: "v1.0.0",
    assetId: "asset-8",
    assetName: "工作区受控文件系统沙箱服务",
    status: "beta",
    changelog: "工作区受控文件系统沙箱首发。支持最基础的读写越界校验、TF-IDF 倒排文件检索、大文本分片 50KB 安全切割，向外发布 read_sandbox_file 核心 Tool。",
    creator: "刘洋 (Alex)",
    createdAt: "2026-06-15 11:00:00"
  }
];
