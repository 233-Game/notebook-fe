import { createApp } from 'vue'

import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import User from '../common/user'
import CommonFunction from '/common/commonFunction'
import config from '/common/config'
import ENum from '../common/ENum'
const app = createApp(App)
// 引入element组件库
app.use(ElementPlus)
app.use(store).use(router).mount('#app')
// 全局挂载
app.config.globalProperties.$user = User
app.config.globalProperties.$commonFun = CommonFunction
app.config.globalProperties.$config = config
app.config.globalProperties.$eNum = ENum
