/// <reference types="vite/client" />
declare module "*.mjs"

declare module '*.vue' {
    import { ComponentOptions } from 'vue'
    const componentOptions: ComponentOptions
    export default componentOptions
  }

  // 声明nprogress
declare module "nprogress";
