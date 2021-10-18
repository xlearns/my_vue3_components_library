import Input from './src/wxInput.vue'
Input.install = function(Vue:any){
  Vue.component(Input.name, Input);
}
export default Input