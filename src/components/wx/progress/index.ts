import wxProcess from "./src/progress.vue";
wxProcess.install = function(Vue:any){
  Vue.component(wxProcess.name,wxProcess)
}
export default wxProcess