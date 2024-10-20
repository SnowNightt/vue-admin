import request from '@/utils/request'
import type {ResponseBody}from './type.ts'
enum API{
    C1_URL = '/admin/product/getCategory1',
    C2_URL = '/admin/product/getCategory2/',
    C3_URL = '/admin/product/getCategory3/',
    ARR_URL = '/admin/product/attrInfoList/',
    ADDOREDITATTR_URL = '/admin/product/saveAttrInfo',
    DELETEATTR_URL = '/admin/product/deleteAttr/'

}

// c1的请求
export const C1Req = ()=>request.get<any,ResponseBody>(API.C1_URL)
// c2的请求
export const C2Req = (category1Id:number|string)=>request.get<any,ResponseBody>(API.C2_URL + category1Id)
// c3的请求
export const C3Req = (category2Id:number|string)=>request.get<any,ResponseBody>(API.C3_URL + category2Id)
// 发送请求获取属性
export const attrReq = (category1Id:number|string,category2Id:number|string,category3Id:number|string)=>request.get<any,any>(API.ARR_URL + `${category1Id}/${category2Id}/${category3Id}`)
// 添加属性或修改属性
export const updataOrAddAttrReq = (data:any)=>request.post(API.ADDOREDITATTR_URL,data)
// 删除属性
export const deleteAttr = (attrId:number)=>request.delete(API.DELETEATTR_URL + attrId)