import request from '@/utils/request'
import type { HasSpuResponseData, AllTradeMark, SpuHasImg, spuSaleAttrRes, HasSaleAttrResponseData, SpuData, SkuData,skuInfoData} from './type.ts'
enum API {
    HASSPU_URL = '/admin/product/',
    //获取全部品牌的数据
    ALLTRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
    //获取某个SPU下的全部的售卖商品的图片数据
    IMAGE_URL = '/admin/product/spuImageList/',
    //获取某一个SPU下全部的已有的销售属性接口地址
    SPUHASSALEATTR_URL = '/admin/product/spuSaleAttrList/',
    //获取整个项目全部的销售属性[颜色、版本、尺码]
    ALLSALEATTR_URL = '/admin/product/baseSaleAttrList',
    // 保存新增的SUP
    SAVESPU_URL = '/admin/product/saveSpuInfo',
    // 修改SPU
    UPDATESPU_URL = '/admin/product/updateSpuInfo',
    // 保存sku
    SAVESKU_URL = '/admin/product/saveSkuInfo',
    //查看某一个已有的SPU下全部售卖的商品
    SKUINFO_URL = '/admin/product/findBySpuId/',
    // 删除spu
    DELSPU_URL = '/admin/product/deleteSpu/'
}
// 获取spu数据
export const getSpuReq = (page: number, limit: number, category3Id: number | string) =>
    request.get<any, HasSpuResponseData>(API.HASSPU_URL + `${page}/${limit}?category3Id=${category3Id}`)
//获取全部的SPU的品牌的数据
export const reqAllTradeMark = () =>
    request.get<any, AllTradeMark>(API.ALLTRADEMARK_URL)
//获取某一个已有的SPU下全部商品的图片地址
export const reqSpuImageList = (spuId: number) =>
    request.get<any, SpuHasImg>(API.IMAGE_URL + spuId)
//获取某一个已有的SPU拥有多少个销售属性
export const reqSpuHasSaleAttr = (spuId: number) =>
    request.get<any, spuSaleAttrRes>(API.SPUHASSALEATTR_URL + spuId)
//获取全部的销售属性
export const reqAllSaleAttr = () =>
    request.get<any, HasSaleAttrResponseData>(API.ALLSALEATTR_URL)


// 修改或新增SPU
export const reqSaveOrUpdateSpu = (data: SpuData) => {
    //如果SPU对象拥有ID,更新已有的SPU
    if (data.id) {
        return request.post<any, any>(API.UPDATESPU_URL, data)
    } else {
        return request.post<any, any>(API.SAVESPU_URL, data)
    }
}

// export const reqSaveOrUpdateSpu = (data:SpuData)=>{
//     if(data.id){
//         request.post<any,any>(API.UPDATESPU_URL,data)
//     }else{
//         request.post<any,any>(API.SAVESPU_URL,data)
//     }
// }

// 保存sku
export const saveSkuReq = (data: SkuData) => request.post<any, any>(API.SAVESKU_URL, data)

  //查看某一个已有的SPU下全部售卖的商品
  export const getSkuInfo = (spuId: number | string)=>request.get<any,skuInfoData>(API.SKUINFO_URL + spuId)

//   删除spu
export const delSpu = (spuId:number|string) =>request.delete<any,any>(API.DELSPU_URL +spuId)