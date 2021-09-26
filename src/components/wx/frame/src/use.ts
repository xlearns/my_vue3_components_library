import F from './frame'
let f:any = new F()
let Vue:any
const start = function(fps=60){
  clearInterval(f.timer)
  f.start()
  f.timer = setInterval(()=>{
    //  main
    f.update()
    sessionStorage.setItem('maxFrame',f.maxFrame)
    sessionStorage.setItem('minFrame',f.minFrame)
    sessionStorage.setItem('currFrame',f.currFrame)
  },1000/fps)
}
const stop = function(){
  clearInterval(f.timer)
}

export default function(vue:any){
  Vue = vue
  return {
    'start':start,
    'stop':stop
  }
}