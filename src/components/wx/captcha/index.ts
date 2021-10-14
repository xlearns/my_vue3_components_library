import captcha from './src/index.vue'
captcha.install = function(Vue:any){
  Vue.component(captcha.name,captcha)
}
export default captcha
