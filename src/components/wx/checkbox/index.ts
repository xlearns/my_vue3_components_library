
 import wxCheckbox from './checkbox.vue'
 import wxCheckboxGroup from './group.vue'
 wxCheckbox.install = function(Vue:any){
      Vue.component(wxCheckbox.name,wxCheckbox)
 }
 wxCheckboxGroup.install = function(Vue:any){
      Vue.component(wxCheckboxGroup.name,wxCheckboxGroup)
 }
 export {wxCheckbox, wxCheckboxGroup}
 