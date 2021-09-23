import { isContext } from "vm";
import { createStore } from "vuex";

export default createStore({
  state: {
    error: false,
    iswxFormBlur:false,
    wxFormValue:'',
    wxFormAdd:[],
    wxLabelName: "",
    wxFormRemove:'',
    wxClearAll:false
  },
  getters: {
    getError: state => state.error
  },
  mutations: {
    changeError(state, val) {
      state.error = val;
    },
    changeWxClearAll(state){
      state.wxClearAll = !state.wxClearAll
    },
    changeWxFormValue(state,val){
      state.wxFormValue = val
    },
    changeWxFormBlur(state,val){
      state.iswxFormBlur = true
    },
    changeWxFormAdd(state,val){
      state.wxFormAdd.push(val as never)
    },
    changeWxFormRemove(state,val){
      state.wxFormRemove = val
    }
  },
  actions: {
    changeErrorAction(context, val) {
      context.commit("changeError", val);
    },
    formChange(context,val){
      context.commit('changeWxFormValue',val)
    },
    formBlur(context,val){
      // console.log('blur',val)
      context.commit('changeWxFormBlur',val)
    },
    formAdd(context:any,val){
      // console.log('formAdd',val)
      context.commit('changeWxFormAdd',val)
    },
    formRemove(context:any,val){
      // console.log('formAdd',val)
      context.commit('changeWxFormRemove',val)
    },
    formWxClearAll(context){
      context.commit('changeWxClearAll')
    }
  },
  modules: {}
});
