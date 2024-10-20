import {defineStore} from 'pinia'

export default defineStore('setting',{
    state:()=>{
        return{
            // 设置菜单是否折叠
            isCollapse:false,
            // 刷新业务
            refresh:false
        }
    }
})

