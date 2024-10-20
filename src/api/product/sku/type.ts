//服务器全部接口返回的数据类型
export interface ResponseData {
    code: number
    message: string
    ok: boolean
}
export interface Attr {
    attrId: number | string //平台属性的ID
    valueId: number | string //属性值的ID
    attrName?: string
}

export interface saleArr {
    saleAttrId: number | string //属性ID
    saleAttrValueId: number | string //属性值的ID
    saleAttrValueName?: string
}
// sku图片列表定义
export interface skuImg {
    createTime: null
    id: number
    imgName: string
    imgUrl: string
    isDefault: string
    skuId: number
    spuImgId: number
    updateTime: string

}

export interface SkuData {
    category3Id: string | number //三级分类的ID
    spuId: string | number //已有的SPU的ID
    tmId: string | number //SPU品牌的ID
    skuName: string //sku名字
    price: string | number //sku价格
    weight: string | number //sku重量
    skuDesc: string //sku的描述
    skuAttrValueList?: Attr[]
    skuSaleAttrValueList?: saleArr[]
    skuDefaultImg: string //sku图片地址
    isSale?: number //商品上架和下架的信息
    id?: number
    skuImageList?:skuImg[]
}

//获取SKU数据接口的ts类型
export interface skuInfoData extends ResponseData {
    data: {
        records: SkuData[]
        total: number
        size: number
        current: number
        orders: []
        optimizeCountSql: boolean
        hitCount: boolean
        countId: null
        maxLimit: null
        searchCount: boolean
        pages: number
    }
}

// 
export interface skuInfoResDate extends ResponseData {
    data: SkuData
}