import FormItem from '../form/src/item/wxFormItem.vue'
FormItem.install = function(Vue:any){
  Vue.component(FormItem.name, FormItem);
}
export default FormItem