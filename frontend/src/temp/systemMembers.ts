export interface SystemMember {
  id: string;
  name: string;
  email: string;
  department: string;
  role: "Admin" | "Member";
  status: "active" | "disabled";
}

export const MOCK_SYSTEM_MEMBERS: SystemMember[] = [
  {
    id: "M1001",
    name: "李国强",
    email: "liguoqiang@haze.co",
    department: "总裁办",
    role: "Admin",
    status: "active",
  },
  {
    id: "M1002",
    name: "章建华",
    email: "zhangjianhua@haze.co",
    department: "企业架构部",
    role: "Admin",
    status: "active",
  },
  {
    id: "M1003",
    name: "陈晓磊",
    email: "chenxiaolei@haze.co",
    department: "AI平台研发部",
    role: "Member",
    status: "active",
  },
  {
    id: "M1004",
    name: "周梦琪",
    email: "zhoumengqi@haze.co",
    department: "大模型算法团队",
    role: "Member",
    status: "active",
  },
  {
    id: "M1005",
    name: "吴海涛",
    email: "wuhaitao@haze.co",
    department: "信息安全部",
    role: "Member",
    status: "disabled",
  },
  {
    id: "M1006",
    name: "刘婷婷",
    email: "liutingting@haze.co",
    department: "人力资源综合部",
    role: "Member",
    status: "active",
  }
];
