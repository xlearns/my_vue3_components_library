import wxForm from "./form/index";
import wxFormItem from "./form-item/index";
import wxInput from "./input/index";
import wxMessage from "./Message/index";
import wxFrame from "./frame/index";
import wxButton from "./button/index";
import wxProcess from "./progress/index";
import wxLoading from "./loading/index";
import {wxCheckbox, wxCheckboxGroup} from './checkbox'
import {wxTable, wxTableHead,wxTableBody,wxTableTd,wxColumn} from './table/index'
import {wxCol, wxRow} from './layout/index'
const components = [
  wxForm,
  wxFormItem,
  wxInput,
  wxButton,
  wxProcess,
  wxLoading,
  wxTable,
  wxCheckbox,
  wxCheckboxGroup,
  wxTable, 
  wxTableHead,
  wxTableBody,
  wxTableTd,
  wxColumn,
  wxCol,
  wxRow
]
const install = function(Vue:any,opts={}){
  components.forEach((component:any)=>{
      Vue.component(component.name,component)
  })
  Vue.config.globalProperties.$wxMessage = wxMessage;
  Vue.config.globalProperties.$wxFrame = wxFrame(Vue);
}
export default {
  ...components,
  install
}
