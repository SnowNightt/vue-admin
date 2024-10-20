import request from '@/utils/request'
import type {skuInfoData,skuInfoResDate} from './type'

enum API{
    // 获取sku数据
    GETSKU_URL = '/admin/product/list/',
    // 上架商品的请求
    upSku_URK  = '/admin/product/onSale/',
    // 下架商品的请求
    CANAELSKU_URL = '/admin/product/cancelSale/',
    // 获取商品详情
    SKUINFO_URL = '/admin/product/getSkuInfo/',
    // 删除sku
    DELETESKU_URL = '/admin/product/deleteSku/'
}
// 获取sku数据
export const getSkuReq = (page:number,limit:number)=>request.get<any,skuInfoData>(API.GETSKU_URL+`${page}/${limit}`)
// 上架商品的请求
export const upSkuReq = (skuId:number)=>request.get<any,any>(API.upSku_URK+skuId)
// 下架商品的请求
export const cancelSkuReq = (skuId:number)=>request.get<any,any>(API.CANAELSKU_URL+skuId)
// 获取商品详情
export const skuInfoReq = (skuId:number)=>request.get<any,skuInfoResDate>(API.SKUINFO_URL+skuId)
// 删除sku
export const deleteSku = (skuId:number)=>request.delete<any,any>(API.DELETESKU_URL+skuId)