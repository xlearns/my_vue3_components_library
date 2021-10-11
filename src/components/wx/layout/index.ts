import wxCol from './src/wxCol.vue'
import wxRow from './src/wxRow'
wxCol.install = function (Vue:any){
  Vue.component(wxCol.name,wxCol)
}
wxRow.install = function (Vue:any){
  Vue.component(wxRow.name,wxRow)
}
export {wxCol,wxRow}