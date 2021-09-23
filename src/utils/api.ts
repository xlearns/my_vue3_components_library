import axios from "axios"
import router from "@/router/index"
interface Data {
  [key: string]: any
}
// 添加请求拦截器，在请求头中加token
axios.interceptors.request.use(
  (config) => {
    if (sessionStorage.getItem("token")) {
      config.headers.token = sessionStorage.getItem("token")
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
// 添加响应拦截器，拦截请求没有权限的响应
axios.interceptors.response.use(
  (response: any) => {
    const msg = response.message ? response.message : "token过期"
    if (response.data.errorCode === -3 || response.data.errorCode === -5) {
      // 跳转到登录
      alert(msg)
      router.push("/")
      return
    }
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

const fetchData = <S, T>(
  url = "",
  data = {} as Data,
  method = "GET"
): Promise<T> => {
  method = method.toUpperCase() // 将字符串转换为大写
  const reqdata = {} as Data
  Object.keys(data).forEach((key: string) => {
    if (![undefined, "全部"].includes(data[key])) {
      reqdata[key] = data[key]
    }
  })
  // 解析data = {} 里面的参数，转成JSONP格式
  if (method === "GET") {
    let dataStr = ""
    Object.keys(reqdata).forEach((key) => {
      if (!["", undefined, null].includes(reqdata[key])) {
        if (Array.isArray(reqdata[key])) {
          reqdata[key].forEach((item: string) => {
            dataStr += `${key}=${encodeURIComponent(item)}&`
          })
        } else {
          dataStr += `${key}=${encodeURIComponent(reqdata[key])}&` // 数据最终形式key1=data1&key2=data2&
        }
      }
    })
    if (dataStr !== "") {
      dataStr = dataStr.substr(0, dataStr.lastIndexOf("&"))
      url = `${url}?${dataStr}` // get方法下降url转化为url?key=data形式
    }
    // 尝试从远程获取数据
    try {
      // 异步操作
      return new Promise((resolve, reject) => {
        axios.get(url).then(
          (response) => {
            const responseData = response.data
            resolve(responseData)
          },
          //新增
          (error) => {
            reject(error)
          }
        )
      })
    } catch (error) {
      throw new Error(error)
    }
  } else {
    // 非get方法，尝试获取数据
    const requestData = reqdata
    try {
      // 异步操作
      return new Promise((resolve, reject) => {
        const reqParam: Data = {
          method: method,
          url: url,
          data: requestData,
        }
        axios(reqParam).then(
          (response) => {
            resolve(response.data)
          },
          //新增
          (error) => {
            reject(error)
          }
        )
      })
    } catch (error) {
      throw new Error(error)
    }
  }
}
interface Resp {
  errorCode?: number
  message?: string
  [key: string]: any
}

// 资产
export const getHost = (data: Data) =>
  fetchData<Data, Resp>("/api/host/getHost", data, "POST")

// 新建用户列表
export const createUser = (data: Data) =>
  fetchData<Data, Resp>("/api/user/saveUser", data, "POST")
// 筛选用户列表
export const selectUserInfo = (data: Data) =>
  fetchData<Data, Resp>("/api/user/queryUser", data, "POST")
export const delUser = (data: Data) =>
  fetchData<Data, Resp>("/api/user/deleteUser", data, "POST")
// 用户
// 用户登录
export const login = (data: Data) =>
  fetchData<Data, Resp>("/api/verify/adminLogin", data, "POST")

//终端用户管理
export const queryUserList = (data: Data) =>
  fetchData<Data, Resp>("/api/user/queryUserList", data, "POST")
export const saveUser = (data: Data) =>
  fetchData<Data, Resp>("/api/user/saveUser", data, "POST")
export const updateUser = (data: Data) =>
  fetchData<Data, Resp>("/api/user/updateUser", data, "POST")
export const deleteUser = (data: Data) =>
  fetchData<Data, Resp>("/api/user/deleteUser", data, "POST")
export const existUserName = (data: Data) =>
  fetchData<Data, Resp>("/api/user/existUserName", data, "GET")
//获取排行榜数据
export const getRankList = (data: Data) =>
  fetchData<Data, Resp>("/api/websocket/getRankList", data, "POST")
//部门
export const queryGroup = (data: Data) =>
  fetchData<Data, Resp>("/api/group/selectGroup", data, "POST")
export const saveGroup = (data: Data) =>
  fetchData<Data, Resp>("/api/group/saveGroup", data, "POST")
export const updateGroup = (data: Data) =>
  fetchData<Data, Resp>("/api/group/updateGroup", data, "POST")
export const deleteGroup = (data: Data) =>
  fetchData<Data, Resp>("/api/group/deleteGroup", data, "POST")
export const groupUserName = (data: Data) =>
  fetchData<Data, Resp>("/api/group/existGroupName", data, "GET")
//网关
// 网关
export const selectAllGateway = (data: Data) =>
  fetchData<Data, Resp>("/api/gateway/selectAllGateway", data, "POST")
export const addGateway = (data: Data) =>
  fetchData<Data, Resp>("/api/gateway/addGateway", data, "POST")
export const updateGateway = (data: Data) =>
  fetchData<Data, Resp>("/api/gateway/updateGateway", data, "POST")
export const deleteGateway = (data: Data) =>
  fetchData<Data, Resp>("/api/gateway/deleteGateway", data, "POST")
export const existGatewayName = (data: Data) =>
  fetchData<Data, Resp>("/api/gateway/existGatewayName", data, "GET")
// 网关路由管理
export const getRoute = (data: Data) =>
  fetchData<Data, Resp>("/api/gatewayRoute/getRoute", data, "POST")
export const saveRoute = (data: Data) =>
  fetchData<Data, Resp>("/api/gatewayRoute/saveRoute", data, "POST")
export const updateRoute = (data: Data) =>
  fetchData<Data, Resp>("/api/gatewayRoute/updateRoute", data, "POST")
export const deleteRoute = (data: Data) =>
  fetchData<Data, Resp>("/api/gatewayRoute/deleteRoute", data, "POST")
//app
export const getAllApp = (data: Data) =>
  fetchData<Data, Resp>("/api/app/getAllApp", data, "POST")
export const updateApp = (data: Data) =>
  fetchData<Data, Resp>("/api/app/updateApp", data, "POST")
export const deleteApp = (data: Data) =>
  fetchData<Data, Resp>("/api/app/recycle", data, "POST")
export const delRecycle = (data: Data) =>
  fetchData<Data, Resp>("/api/app/delRecycle", data, "GET")
//文件
export const getAllResource = (data: Data) =>
  fetchData<Data, Resp>("/api/resource/getAllResource", data, "POST")
export const delRecycle_res = (data: Data) =>
  fetchData<Data, Resp>("/api/resource/delRecycle", data, "GET")
export const recycle_res = (data: Data) =>
  fetchData<Data, Resp>("/api/resource/recycle", data, "POST")
export const updateResource = (data: Data) =>
  fetchData<Data, Resp>("/api/resource/updateResource", data, "POST")
//日志
export const getAllLog = (data: Data) =>
  fetchData<Data, Resp>("/api/log/getAllLog", data, "POST")
export const getAllSandbox = (data: Data) =>
  fetchData<Data, Resp>("/api/sandboxApp/getAllSandbox", data, "POST")
export const uploadSandbox = (data: Data) =>
  fetchData<Data, Resp>("/api/sandboxApp/uploadSandbox", data, "POST")
export const updateSandbox = (data: Data) =>
  fetchData<Data, Resp>("/api/sandboxApp/updateSandbox", data, "POST")
//系统用户管理
export const getAllAdmin = (data: Data) =>
  fetchData<Data, Resp>("/api/admin/getAllAdmin", data, "POST")
