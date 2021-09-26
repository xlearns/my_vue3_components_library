import wxTable from './../table/src/table.vue'
wxTable.install = function(Vue:any){
    Vue.component(wxTable.name,wxTable)
}
export default wxTable