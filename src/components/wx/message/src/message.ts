import msg from './message.vue';
import { createVNode, render } from 'vue'
let container:any = document.createElement('div')
let seed = 1;
let props = null;
let duration = 1200
const wxMessage:any = function(option:any){
  let {type,message} = option
  let  vm:any;
  ++seed
  if(type=='success'){
    props = {class:'wxMessageSuccess'}
    vm = createVNode(msg,props,message)
  }else if(type=='warning'){
    props = {class:'wxMessageWarning'}
    vm = createVNode(msg,props,message)
  }else if(type=='info'){
    props = {class:'wxMessageInfo'}
    vm = createVNode(msg,props,message)
  }else if(type=='error'){
    props = {class:'wxMessageError'}
    vm = createVNode(msg,props,message)
  }
  
  vm.props!.destroy = () => {
    render(null, container)
  }

  vm&&render(vm, container)
  vm&&document.body.appendChild(container.firstElementChild);
  setTimeout(()=>{
    vm.props?.destroy() 
  },duration)
};

['success', 'warning', 'info', 'error'].forEach((type) => {
  wxMessage[type] = (options:any)=>{
    return wxMessage({
      type,
      message: options
    });
  }
});
export default wxMessage;