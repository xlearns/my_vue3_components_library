import FormItem from './src/wxFormItem.vue'
FormItem.install = function(Vue:any){
  Vue.component(FormItem.name, FormItem);
}
export default FormItem