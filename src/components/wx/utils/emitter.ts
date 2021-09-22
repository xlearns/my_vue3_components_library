
export const dispatch = function(This:any,componentName:any, eventName:any, params:any){
  let parent = This.$parent || This.$root;
  let name = parent.$options.name;
  while (parent && (!name || name !== componentName)) {
    parent = parent.$parent;
    if (parent) name = parent.$options.name;
  }
  if (parent) parent.$emit.apply(parent, [eventName].concat(params));
}


export const broadcast:any = function(This:any,componentName:any, eventName:any, params:any) {
  This.$children.forEach((child:any) => {
    const name = child.$options.name;
    if (name === componentName) child.$emit.apply(child, [eventName].concat(params));
    else broadcast.apply(child, [componentName, eventName].concat([params]));
  });
}