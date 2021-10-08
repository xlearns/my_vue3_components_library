import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";
import store from "./store";
import * as echarts from "echarts";
import wxUi from './components/wx/index'
import '@/utils/error'
import '@/components/wx/font/font.scss'
const app = createApp(App);
app.use(store);
app.use(router);
app.use(wxUi)
app.config.globalProperties.$echarts = echarts;
app.mount("#app");
