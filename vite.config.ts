import { defineConfig,loadEnv } from 'vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { viteMockServe } from 'vite-plugin-mock'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig(({ command ,mode}) => {
  // 
  let env = loadEnv(mode,process.cwd())
  return {
    devServer: {
      overlay: {
          warnings: true,
          errors: true
      }
  },
  lintOnSave: false,
    plugins: [vue(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      symbolId: 'icon-[dir]-[name]',
    }),
    viteMockServe({
      localEnabled: command === 'serve',
    })
    ],
    resolve: {
      alias: {
        "@": path.resolve("./src") // 相对路径别名配置，使用 @ 代替 src
      }
    },
    // 配置代理解决跨域
    server:{
      proxy:{
        [env.VITE_APP_BASE_API]:{
          // 获取数据的服务器地址的设置
          target:env.VITE_SERVE,
          // 需要代理跨域
          changeOrigin: true,
          // 路径重写
          rewrite: (path) => path.replace(/^\/api/, ''),
        }
      }
    //   proxy: {
    //     'http://sph-api.atguigu.cn': {
    //         //获取数据的服务器地址设置
    //         target: "http://sph-api.atguigu.cn",
    //         //需要代理跨域
    //         changeOrigin: true,
    //     }
    // }
    }
  }
})
// https://vitejs.dev/config/
// import { defineConfig, loadEnv } from 'vite'
// import vue from '@vitejs/plugin-vue'
// import path from 'path'
// //引入svg需要用到插件
// import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
// //mock插件提供方法
// import { viteMockServe } from 'vite-plugin-mock'
// export default defineConfig(({ command, mode }) => {
//   //获取各种环境下的对应的变量
//   let env = loadEnv(mode, process.cwd());
//   return {
//     publicPath: 'https://gitee.com/jch1011/guiguzhenxuan',
//     plugins: [vue(),
//     createSvgIconsPlugin({
//       iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
//       symbolId: 'icon-[dir]-[name]',
//     }),
//     viteMockServe({
//       localEnabled: command === 'serve',//保证开发阶段可以使用mock接口
//     })
//     ],
//     resolve: {
//       alias: {
//         "@": path.resolve("./src") // 相对路径别名配置，使用 @ 代替 src
//       }
//     },
    
    
//   }
// })
