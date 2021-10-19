import pagination from './src/pagination'
pagination.install = function(Vue:any){
    Vue.component(pagination.name,pagination)
}
export default pagination 