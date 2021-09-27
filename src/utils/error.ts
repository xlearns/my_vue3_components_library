import { sendError }  from './common'
//网页崩溃
//JS 异常
window.onerror = function(message, source, lineno, colno, error){
  sendError('js异常:',{
    message, source, lineno, colno, error
  })
  return true;
}
//reject没有catch住触发
window.addEventListener('unhandledrejection',(event)=>{
  sendError('promise异常:',event)
})
//资源异常
window.addEventListener('error',(event)=>{
  const target = event.target || event.srcElement;
  const isElementTarget =
    target instanceof HTMLScriptElement ||
    target instanceof HTMLLinkElement ||
    target instanceof HTMLImageElement;
  if (!isElementTarget) {
    return false;
  }
  const url =
      (target as HTMLScriptElement | HTMLImageElement).src ||
      (target as HTMLLinkElement).href;
  sendError('资源加载异常',{
    error: new Error(`ResourceLoadError: ${url}`),
    type: 'resource load'
  })
})
