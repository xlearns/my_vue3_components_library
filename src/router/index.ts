import { createRouter, createWebHistory } from "vue-router"
import Login from "../views/Login.vue"
import Main from "../views/Main.vue"
import Control from "../views/bigscreen/Control.vue"
import Terminal from "../views/user/Terminal.vue"
import Branch from "../views/user/Branch.vue"
import Gateway from "../views/gateway/Gateway.vue"
import ResourceApp from "../views/resourse/ResourceApp.vue"
import UserLog from "../views/logs/UserLog.vue"
import ManagementLog from "../views/logs/ManagementLog.vue"
import AuthorityManage from "../views/system/AuthorityManage.vue"
import UserManage from "../views/system/UserManage.vue"
import VersionManage from "../views/trustedwork/VersionManage.vue"
import InformationManage from "../views/equipment/InformationManage.vue"
import ResourceManage from "../views/resourse/ResourceManage.vue"
import ApplyResources from "../views/resourse/ApplyResources.vue"
import ApplyApp from "../views/resourse/ApplyApp.vue"
import Route from "../views/gateway/Route.vue"
import Mindmap from "../views/bigscreen/Mindmap.vue"
import SystemLog from "@/views/logs/SystemLog.vue"
import NoMatch from "@/views/NoMatch.vue"
const routes:any = [
  //登录
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: { isPublic: true },
  },
  //大屏
  {
    path: "/bigscreen/Control",
    name: "Control",
    component: Control,
  },
  {
    path: "/bigscreen/mind", // 匹配所有路由
    name: "Mindmap",
    component: Mindmap,
  },
  //首页
  {
    path: "/",
    name: "main",
    component: Main,
    redirect: "/404",
    children: [
      //系统日志
      {
        path: "/logs/userlog",
        name: "userLog",
        component: UserLog,
      },
      {
        path: "/logs/managementlog",
        name: "ManagementLog",
        component: ManagementLog,
      },
      {
        path: "/logs/systemlog",
        name: "SystemLog",
        component: SystemLog,
      },
      // {
      //   path: "/logs/gatewaylog",
      //   name: "SystemLog",
      //   component: SystemLog,
      // },
      // {
      //   path: "/logs/operationlog",
      //   name: "SystemLog",
      //   component: SystemLog,
      // },
      //使用者管理
      {
        path: "/user/branch",
        name: "branch",
        component: Branch,
      },
      {
        path: "/user/terminal",
        name: "terminal",
        component: Terminal,
      },
      //网关管理
      {
        path: "/gateway/gateway",
        name: "gateway",
        component: Gateway,
      },
      {
        path: "/gateway/gatewayRoute",
        name: "route",
        component: Route,
      },
      //设备信息管理
      {
        path: "/equipment/informationmanage",
        name: "informationmanage",
        component: InformationManage,
      },
      //系统管理
      {
        path: "/system/usermanage",
        name: "usermanage",
        component: UserManage,
      },
      {
        path: "/system/authoritymanage",
        name: "AuthorityManage",
        component: AuthorityManage,
      },
      //可信工作域版本管理
      {
        path: "/trustedwork/versionmanage",
        name: "versionmanage",
        component: VersionManage,
      },
      //资源管理
      {
        path: "/resourse/resourcemanage",
        name: "resourcemanage",
        component: ResourceManage,
      },
      {
        path: "/resourse/applyresources",
        name: "applyresources",
        component: ApplyResources,
      },
      {
        path: "/resourse/applyapp",
        name: "applyapp",
        component: ApplyApp,
      },
      {
        path: "/resourse/resourceapp",
        name: "resourceapp",
        component: ResourceApp,
      },
      {
        path: "/:catchAll(.*)", // 匹配所有路由
        name: "redirect404",
        redirect: "/404",
      },
      {
        path: "/404", // 匹配所有路由
        name: "404",
        component: NoMatch
      },
    ],
  },
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})
router.beforeEach((to:any, from:any, next:any) => {
  if (!to.meta.isPublic && !sessionStorage.getItem("token")) {
    sessionStorage.clear()
    return next("/login")
  } else {
    next()
  }
})
export default router