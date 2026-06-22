export interface SystemMember {
  id: string;
  name: string;
  email: string;
  department: string;
  role: "Admin" | "Member";
  status: "active" | "disabled";
  lastLoginAt?: string;
  phone: string;
}

export const LOCALIZED_DEPARTMENTS: Record<string, Record<string, string>> = {
  ZH: {
    "总裁办": "总裁办",
    "企业架构部": "企业架构部",
    "AI平台研发部": "AI平台研发部",
    "大模型算法团队": "大模型算法团队",
    "信息安全部": "信息安全部",
    "人力资源综合部": "人力资源综合部"
  },
  JA: {
    "总裁办": "社長室",
    "企业架构部": "エンタープライズアーキテクチャ部門",
    "AI平台研发部": "AIプラットフォーム開発部門",
    "大模型算法团队": "大規模モデルアルゴリズムチーム",
    "信息安全部": "情報セキュリティ部門",
    "人力资源综合部": "総合人事部門"
  },
  ES: {
    "总裁办": "Oficina del Presidente",
    "企业架构部": "Arquit. de la Empresa",
    "AI平台研发部": "I+D Plataforma de IA",
    "大模型算法团队": "Equipo Algr. Modelos Grandes",
    "信息安全部": "Seguridad de la Info.",
    "人力资源综合部": "Recursos Humanos"
  },
  EN: {
    "总裁办": "President's Office",
    "企业架构部": "Enterprise Architecture",
    "AI platform R&D": "AI Platform R&D",
    "AI平台研发部": "AI Platform R&D",
    "大模型算法团队": "Large Model Algorithms",
    "信息安全部": "Information Security",
    "人力资源综合部": "Human Resources"
  }
};

export const LOCALIZED_NAMES: Record<string, Record<string, string>> = {
  ZH: {
    "李国强": "李国强",
    "章建华": "章建华",
    "陈晓磊": "陈晓磊",
    "周梦琪": "周梦琪",
    "吴海涛": "吴海涛",
    "刘婷婷": "刘婷婷"
  },
  JA: {
    "李国强": "李国強",
    "章建华": "章建華",
    "陈晓磊": "陳暁磊",
    "周梦琪": "周夢琪",
    "吴海涛": "呉海涛",
    "刘婷婷": "劉婷婷"
  },
  ES: {
    "李国强": "Guoqiang Li",
    "章建华": "Jianhua Zhang",
    "陈晓磊": "Xiaolei Chen",
    "周梦琪": "Mengqi Zhou",
    "吴海涛": "Haitao Wu",
    "刘婷婷": "Tingting Liu"
  },
  EN: {
    "李国强": "Guoqiang Li",
    "章建华": "Jianhua Zhang",
    "陈晓磊": "Xiaolei Chen",
    "周梦琪": "Mengqi Zhou",
    "吴海涛": "Haitao Wu",
    "刘婷婷": "Tingting Liu"
  }
};

export const MOCK_SYSTEM_MEMBERS: SystemMember[] = [
  {
    id: "M1001",
    name: "李国强",
    email: "liguoqiang@haze.co",
    department: "总裁办",
    role: "Admin",
    status: "active",
    lastLoginAt: "2026-06-17T09:32:00",
    phone: "13800138001"
  },
  {
    id: "M1002",
    name: "章建华",
    email: "zhangjianhua@haze.co",
    department: "企业架构部",
    role: "Admin",
    status: "active",
    lastLoginAt: "2026-06-16T16:45:00",
    phone: "13800138002"
  },
  {
    id: "M1003",
    name: "陈晓磊",
    email: "chenxiaolei@haze.co",
    department: "AI平台研发部",
    role: "Member",
    status: "active",
    lastLoginAt: "2026-06-15T12:00:00",
    phone: "13800138003"
  },
  {
    id: "M1004",
    name: "周梦琪",
    email: "zhoumengqi@haze.co",
    department: "大模型算法团队",
    role: "Member",
    status: "active",
    lastLoginAt: "2026-06-14T09:12:00",
    phone: "13800138004"
  },
  {
    id: "M1005",
    name: "吴海涛",
    email: "wuhaitao@haze.co",
    department: "信息安全部",
    role: "Member",
    status: "disabled",
    lastLoginAt: "2026-06-02T10:30:00",
    phone: "13800138005"
  },
  {
    id: "M1006",
    name: "刘婷婷",
    email: "liutingting@haze.co",
    department: "人力资源综合部",
    role: "Member",
    status: "active",
    lastLoginAt: "2026-06-17T08:51:00",
    phone: "13912345678"
  }
];
