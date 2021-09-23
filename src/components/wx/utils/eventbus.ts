class Bus{
  list:{[key:string]:Array<Function>};
  constructor(){
      //初始化
      this.list = {}
  }
  //订阅
  $on(name:string,fn:Function){
      //如果没有初始化
      this.list[name] = this.list[name] || [];
      this.list[name].push(fn);
  }
  //发布
  $emit(name:string,data?:any){
    if(this.list[name]){
      //存在
      this.list[name].forEach((fn:Function)=>{
        fn(data)
      })
    }
  }
  //取消订阅
  $off(name:string){

  }
}
export default Bus