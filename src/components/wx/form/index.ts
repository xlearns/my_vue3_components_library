import Form from './src/wxForm.vue'
Form.install = function(Vue:any){
  Vue.component(Form.name, Form);
}
export default Form