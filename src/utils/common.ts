// 将时间戳转换为日期格式
export const formatter = (date: any) => {
  return new Date(date).toLocaleString("chinese", {
    hour12: false,
  })
}
//深拷贝

export function deepClone(obj:any){
  const _toString = Object.prototype.toString
  // null, undefined, non-object, function
  if(!obj||typeof obj!='object'){
    return obj
  }
  // DOM Node
  if (obj.nodeType && 'cloneNode' in obj) {
    return obj.cloneNode(true)
  }
  // Date
  if (_toString.call(obj) === '[object Date]') {
    return new Date(obj.getTime())
  }
  // RegExp
  if (_toString.call(obj) === '[object RegExp]') {
    const flags = []
    if (obj.global) { flags.push('g') }
    if (obj.multiline) { flags.push('m') }
    if (obj.ignoreCase) { flags.push('i') }
    return new RegExp(obj.source, flags.join(''))
  }
  //array
  const result = Array.isArray(obj) ? [] : obj.constructor ? new obj.constructor() : {}
  for (const key in obj) {
    result[key] = deepClone(obj[key])
  }
  return result
}
//Function.prototype.call.bind(Object.prototype.toString)与Object.prototype.toString.call意识相同
const toStr = Function.prototype.call.bind(Object.prototype.toString)

//判断是不是object类型
export function isObjectObject(t:any) {
  return toStr(t) === '[object Object]'
}
//判断是不是Array类型
export function isObjectArray(t:any) {
  return toStr(t) === 
  '[object Array]'
}
//判断是不是Null类型
export function isObjectNull(t:any) {
  return toStr(t) === '[object Null]'
}
//判断是不是undefin类型
export function isObjectUnde(t:any) {
  return toStr(t) === '[object Undefined]'
}

//首字母大写
export function titleCase(str:String){
  return str.replace(/^[a-z]/g,item=>item.toUpperCase())
}
// 下划转驼峰
export function beautifierConf(str:String){
  //substr方便反取，slice适合争取
  return str.replace(/_[a-z]/g,item=>item.substr(-1).toUpperCase())
}
//判断是不是数字类型字符串
export function isNumberStr(str:any){
  return /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g.test(str)
}
export const exportDefault = 'export default '

export function sendError(type:any,obj:Object){
    console.error(type,obj)
}