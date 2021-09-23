export const navList = {
  left: [
    {
      name: "首页",
      val: "home",
      icon: "el-icon-s-home",
    },
    // {
    //   name: "应用管理",
    //   val: "app",
    //   icon: "el-icon-menu",
    // },
    {
      name: "用户管理",
      val: "user",
      icon: "el-icon-s-custom",
    },
    // {
    //   name: "设备管理",
    //   val: "echipament",
    //   icon: "el-icon-printer",
    // },
    {
      name: "访问控制",
      val: "acces",
      icon: "el-icon-s-operation",
    },
  ],
  right: [
    {
      name: "网关管理",
      val: "network",
      icon: "el-icon-first-aid-kit",
    },
    {
      name: "资产隐身",
      val: "property",
      icon: "el-icon-s-check",
    },
  ],
  // {
  //   name: "网络隐身",
  //   val: "network",
  //   icon: "el-icon-first-aid-kit",
  //   child: [
  //     {
  //       name: "网关管理",
  //       val: "network/list",
  //     },
  //     {
  //       name: "连接器管理",
  //       val: "network/connect",
  //     },
  //   ],
  // },
  // {
  //   name: "动态安全评估",
  //   val: "safe",
  //   icon: "el-icon-first-aid-kit",
  // },
  // {
  //   name: "身份认证",
  //   val: "identity",
  //   icon: "el-icon-s-check",
  //   child: [
  //     {
  //       name: "统一认证",
  //       val: "identity/unified",
  //     },
  //     {
  //       name: "客户端版本限制",
  //       val: "identity/limit",
  //     },
  //   ],
  // },
  // {
  //   name: "浏览器配置",
  //   val: "browser",
  //   icon: "el-icon-s-platform",
  // },
  // {
  //   name: "国密设置",
  //   val: "national",
  //   icon: "el-icon-s-check",
  // },
  // {
  //   name: "数据防泄密",
  //   val: "data",
  //   icon: "el-icon-s-data",
  // },
}

export const menu = {
  user: [
    {
      name: "用户列表",
      val: "list",
    },
    {
      name: "部门",
      val: "group",
    },
  ],
  acces: [
    {
      name: "策略组",
      val: "user",
    },
    {
      name: "黑名单IP",
      val: "ip",
    },
  ],
}

export const userAll = [
  {
    id: 1,
    label: "创安恒宇",
    children: [
      {
        id: 2,
        label: "管理中心",
      },
      {
        id: 4,
        label: "营销中心",
      },
      {
        id: 6,
        label: "分公司",
      },
      {
        id: 8,
        label: "演示账号",
      },
      {
        id: 9,
        label: "合作伙伴",
      },
      {
        id: 10,
        label: "产品中心",
      },
      {
        id: 12,
        label: "总裁办",
      },
    ],
  },
]

export const echiDetail = [
  {
    label: "设备型号",
    val: "name",
  },
  {
    label: "设备名称",
    val: "name",
  },
  {
    label: "操作系统版本",
    val: "name",
  },
  {
    label: "操作系统位数",
    val: "name",
  },
  {
    label: "客户端版本",
    val: "name",
  },
  {
    label: "所属用户",
    val: "name",
  },
  {
    label: "设备UDID",
    val: "name",
  },
  {
    label: "激活时间",
    val: "name",
  },
  {
    label: "最后登录",
    val: "name",
  },
  {
    label: "设备状态",
    val: "state",
  },
]
export const logHeadTitle = [
  {
    label: "时间",
    val: "log_time",
  },
  {
    label: "来源IP",
    val: "source_ip",
  },
  {
    label: "失败原因",
    val: "fail_reason",
  },
  {
    label: "操作内容",
    val: "operation_type",
  },
  {
    label: "操作结果",
    val: "operation_result",
  },
  {
    label: "等级",
    val: "log_level",
  },
  {
    label: "参数",
    val: "description",
  },
  {
    label: "执行类",
    val: "operation_controller",
  },
  {
    label: "来源用户",
    val: "source_name",
  },
]
