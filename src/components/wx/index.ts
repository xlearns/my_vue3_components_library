import wxForm from "./form/index";
import wxFormItem from "./form-item/index";
import wxInput from "./input/index";
import wxMessage from "./Message/index";
import wxButton from "./button/index";
const components = [
  wxForm,
  wxFormItem,
  wxInput,
  wxButton
]
const install = function(Vue:any,opts={}){
  components.forEach((component:any)=>{
      Vue.component(component.name,component)
  })
  Vue.config.globalProperties.$wxMessage = wxMessage;
}
export default {
  ...components,
  install
}
