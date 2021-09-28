import {reactive,effect} from '@vue/reactivity'


export default function useStorage(key:any,value=[]){
    let data = reactive({})
    //将数据变成响应式
    Object.assign(data,localStorage[key]&&JSON.parse(localStorage[key])||value)
    effect(()=>{
      localStorage[key] = JSON.stringify(data)
    })
    return data
}