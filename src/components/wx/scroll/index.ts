import Scroll from './src/scroll.vue'
import ScrollLoader from './src/scrollLoad.vue'
Scroll.install = function(Vue:any){
  Vue.install(Scroll.name,Scroll)
}
ScrollLoader.install = function(Vue:any){
  Vue.install(ScrollLoader.name,ScrollLoader)
}
export {
  Scroll,
  ScrollLoader
}