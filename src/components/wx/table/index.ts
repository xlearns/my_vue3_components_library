import wxTable from './../table/src/table.vue'
import wxTableHead from './../table/src/tableHead.vue'
import wxTableBody from './../table/src/tableBody.vue'
import wxTableTd from './../table/src/tableTd.vue'
import wxColumn from './../table/src/column.vue'

wxTable.install = function(Vue:any){
    Vue.component(wxTable.name,wxTable)
}
wxTableHead.install = function(Vue:any){
    Vue.component(wxTableHead.name,wxTableHead)
}
wxTableBody.install = function(Vue:any){
    Vue.component(wxTableBody.name,wxTableBody)
}
wxTableTd.install = function(Vue:any){
    Vue.component(wxTableTd.name,wxTableTd)
}
wxColumn.install = function(Vue:any){
    Vue.component(wxColumn.name,wxColumn)
}
export {wxTable, wxTableHead,wxTableBody,wxTableTd,wxColumn}