import { createApp } from 'vue'
import App from './App.vue'

// 引入element plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 引入清除样式
import 'reset-css'
// 中文
// 在vite-env.d.ts配置declare module "*.mjs"就没有红色波浪线了,打包时也不会报错
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
let app = createApp(App);

// 全局注册icon图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 全局注册icon图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 引入svg图标
import 'virtual:svg-icons-register'
// 引入store
import store from '@/store/index.ts'
app.use(store)
// 安装ElementPlus
app.use(ElementPlus,{
    locale:zhCn
});
// 引入暗黑模式样式
import 'element-plus/theme-chalk/dark/css-vars.css'
// 引入permission路由守卫
import './permission.ts'
// 引入路由
import route from '@/route/index.ts'
// 引入自定义指令
import {isHasButton} from '@/directive/has.ts'
// 把app传入
isHasButton(app)

app.use(route)


// 注册components文件夹内部全部全局组件
// app.use方法安装自定义插件
import gloablComponent from '@/components'
app.use(gloablComponent)
app.mount('#app');
