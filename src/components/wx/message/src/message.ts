import msg from './message.vue';
import { createVNode, render } from 'vue'
const container:any = document.createElement('div')

const wxMessage:any = function(option:any){
  let {type,message} = option
  const vm = createVNode(msg,{},message)
  render(vm, container)
  if(type=='success'){
    document.body.appendChild(container.firstElementChild);
  }
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