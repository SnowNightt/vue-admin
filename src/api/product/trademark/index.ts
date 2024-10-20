import request from '@/utils/request'
import type {ResponseBody,RecordsObj} from './type.ts'
enum API{
    // 获取品牌的接口
    GET_TRADEMARK_URL='/admin/product/baseTrademark/',
    ADD_TRADEMARK_URL = '/admin/product/baseTrademark/save',
    EDIT_TRADEMARK_URL = '/admin/product/baseTrademark/update',
    DEL_TRADEMARK_URL = '/admin/product/baseTrademark/remove/'
}
// page:获取第几页数据
// limit：获取几个数据
export const getTrademark = (page:number,limit:number)=>request.get<any,ResponseBody>(API.GET_TRADEMARK_URL+`${page}/${limit}`)

// 添加品牌
export const addTrademark = (data:RecordsObj)=>request.post<any,any>(API.ADD_TRADEMARK_URL,data)

// 修改品牌
export const editTrademarkReq = (data:RecordsObj)=>request.put<any,any>(API.EDIT_TRADEMARK_URL,data)

// 删除品牌
// export const deleleTrademarkReq = (id:number)=>request.delete<any,any>(API.DEL_TRADEMARK_URL+id)
export const deleleTrademarkReq = (id: number) =>request.delete<any, any>(API.DEL_TRADEMARK_URL + id)