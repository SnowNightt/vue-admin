import SvgIcon from './SvgIcon/index.vue'
import Category from './category/index.vue'
// 引入类型
import type { App, Component } from 'vue';

// 全局注册图标

const components: { [name: string]: Component } = { SvgIcon,Category };
export default{
    // 原理可看尚硅谷的尙甄选项目P25集
    // 务必叫install方法 会把app应用实例注入进来。
    install(app:App){
        Object.keys(components).forEach((key:string)=>{
            app.component(key,components[key])
        })
        
    }
}