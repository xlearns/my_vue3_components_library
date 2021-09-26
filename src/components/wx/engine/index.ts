import Engine from './src/engine.vue'
Engine.install = function(Vue:any){
  Vue.component(Engine.name, Engine);
}
export default Engine