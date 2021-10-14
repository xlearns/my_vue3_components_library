import Logo from './src/index.vue'
Logo.install = function(Vue:any){
  Vue.component(Logo.name,Logo)
}
export default Logo
