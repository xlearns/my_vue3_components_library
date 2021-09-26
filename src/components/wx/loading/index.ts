import Loading from './src/loading.vue'
Loading.install = function(Vue:any){  
  Vue.component(Loading.name,Loading)
}
export default Loading