import wxColumn from './../table/src/column.vue'
wxColumn.install = function(Vue:any){
    Vue.component(wxColumn.name,wxColumn)
}
export default wxColumn