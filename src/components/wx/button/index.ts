import wxButton from './src/wxButton.vue'
wxButton.install = function(Vue:any){
    Vue.component(wxButton.name,wxButton)
}
export default wxButton