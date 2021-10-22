import wxForm from "./form/index";
import wxFormItem from "./form-item/index";
import wxInput from "./input/index";
import wxMessage from "./Message/index";
import wxFrame from "./frame/index";
import wxButton from "./button/index";
import wxProcess from "./progress/index";
import wxLoading from "./loading/index";
import wxDraggable from './draggable/index'
import wxPagination from './pagination/index'
import {Scroll,ScrollLoader} from './scroll/index'
import { wxCheckbox, wxCheckboxGroup } from "./checkbox";
import {
  wxTable,
  wxTableHead,
  wxTableBody,
  wxTableTd,
  wxColumn
} from "./table/index";
import { wxCol, wxRow } from "./layout/index";
import wxDialog from "./dialog/index";
import wxLogin from "./login/";
import wxCaptcha from "./captcha";
import "./theme/index.scss";
const components = [
  wxDraggable,
  wxForm,
  wxCaptcha,
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
  wxRow,
  wxPagination,
  wxDialog,
  wxLogin,
  Scroll,
  ScrollLoader
];
const install = function (Vue: any, opts = {}) {
  components.forEach((component: any) => {
    Vue.component(component.name, component);
  });
  Vue.config.globalProperties.$wxMessage = wxMessage;
  Vue.config.globalProperties.$wxFrame = wxFrame(Vue);
};
export default {
  ...components,
  install,
};
