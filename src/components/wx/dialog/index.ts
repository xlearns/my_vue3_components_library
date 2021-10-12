import Dialog from './src/dialog..vue'
Dialog.install = function(Vue:any){
  Vue.component(Dialog.name,Dialog)
}

export default Dialog