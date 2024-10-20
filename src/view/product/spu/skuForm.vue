<template>
    <div>
        <el-form label-width="100px">
            <!-- SKU名称 -->
            <el-form-item label="SKU名称">
                <el-input placeholder="SKU名称" v-model="skuParams.skuName"></el-input>
            </el-form-item>
            <!-- 价格（元） -->
            <el-form-item label="价格（元）">
                <el-input placeholder="价格（元）" v-model="skuParams.price"></el-input>
            </el-form-item>
            <!-- 重量(g) -->
            <el-form-item label="重量(g)">
                <el-input placeholder="重量(g)" v-model="skuParams.weight"></el-input>
            </el-form-item>
            <!-- SKU描述 -->
            <el-form-item label="SKU描述">
                <el-input placeholder="SKU描述" type="textarea" v-model="skuParams.skuDesc"></el-input>
            </el-form-item>
            <!-- 平台属性 -->
            <el-form-item label="平台属性:" style="margin-bottom: 20px;">
                <el-form :inline="true" label-width="100px">
                    <el-form-item :label="item.attrName" v-for="item in attrArr" :key="item.id">
                        <el-select placeholder="请选择" v-model="item.AttrIdAndAttrValueId">
                            <el-option v-for="attrValue in item.attrValueList" :label="attrValue.valueName"
                                :value="`${item.id}:${attrValue.id}`"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-form-item>
            <!-- 销售属性 -->
            <el-form-item label="销售属性:">
                <el-form :inline="true" label-width="100px">
                    <el-form-item :label="item.saleAttrName" v-for="item in hasSaleSpuArr" :key="item.id">
                        <el-select placeholder="请选择" v-model="item.saleIdAndValueId">
                            <el-option v-for="saleAttrName in item.spuSaleAttrValueList" :key="saleAttrName.id"
                                :label="saleAttrName.saleAttrValueName"
                                :value="`${item.id}:${saleAttrName.id}`"></el-option>
                        </el-select>
                    </el-form-item>

                </el-form>
            </el-form-item>
            <!-- table -->
            <el-form-item label="图片名称">
                <el-table :data="imgListArr" border ref="table">
                    <el-table-column type="selection" width="80px" align="center"></el-table-column>
                    <el-table-column label="图片">
                        <template #="{ row }">
                            <img :src="row.imgUrl" alt="" style="width: 150px;">
                        </template>
                    </el-table-column>
                    <el-table-column label="名称" prop="imgName"></el-table-column>
                    <el-table-column label="操作">
                        <template #="{ row }">
                            <el-button type="warning" size="default" @click="defaultImg(row)">设置默认</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="default" @click="save">保存</el-button>
                <el-button type="primary" size="default" @click="quitSku">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { reqSpuHasSaleAttr, reqSpuImageList, saveSkuReq } from '@/api/product/spu'
import { attrReq } from '@/api/product/attr'
import type { SpuData, SpuImg, spuSaleAttr, SkuData, saleArr, Attr } from '@/api/product/spu/type'
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
// 存储属性
let attrArr = ref<any>([])
// 存储图片
let imgListArr = ref<SpuImg[]>([])
// 存储一个已有的SPU拥有多少个销售属性
let hasSaleSpuArr = ref<spuSaleAttr[]>([])
// 获取table组件
const table = ref<any>()
// 添加自定义事件
let $emit = defineEmits(["changeSence"])
// 取消按钮的回调
const quitSku = () => {
    // 回到spu
    $emit('changeSence', { flag: 0, params: '' })
}
// 初始化需要收集的数据
let skuParams = reactive<SkuData>({
    //父组件传递过来的数据
    "category3Id": "",//三级分类的ID
    "spuId": "",//已有的SPU的ID
    "tmId": "",//SPU品牌的ID
    //v-model收集
    "skuName": "",//sku名字
    "price": "",//sku价格
    "weight": "",//sku重量
    "skuDesc": "",//sku的描述

    "skuAttrValueList": [//平台属性的收集
    ],
    "skuSaleAttrValueList": [//销售属性
    ],
    "skuDefaultImg": "",//sku图片地址
})
// 暴露方法。发请求获取数据
const getSku = async (spu: SpuData, c1Id: number | string, c2Id: number | string, c3Id: number | string) => {
    skuParams.category3Id = spu.category3Id
    skuParams.tmId = spu.tmId
    skuParams.spuId = (spu.id as number)
    let res1 = await attrReq(c1Id, c2Id, c3Id)
    let res2 = await reqSpuHasSaleAttr((spu.id as number))
    let res3 = await reqSpuImageList(spu.id as number)

    if (res1.code == 200) {
        // 存储属性
        attrArr.value = res1.data
    } else {
        ElMessage.error(res1.message)
    }

    if (res2.code == 200) {
        // 存储一个已有的SPU拥有多少个销售属性
        hasSaleSpuArr.value = res2.data
    } else {
        ElMessage.error(res2.message)
    }

    if (res3.code == 200) {
        // 存储图片
        imgListArr.value = res3.data
    } else {
        ElMessage.error(res3.message)
    }


}
// 选择默认图片
const defaultImg = (row: SpuImg) => {
    skuParams.skuDefaultImg = row.imgUrl as string
    // 调用该方法清空用户的选择(用于多选表格)排他法思想
    table.value.clearSelection()
    // 点击"设置默认"按钮后，调用该方法可以勾选多选框(用于多选表格)
    table.value.toggleRowSelection(row, true)

}
// 保存sku
const save = async () => {
    //处理属性id和属性值id成为接口想要的数据
    skuParams.skuAttrValueList = attrArr.value.reduce((acc: Attr[], curr: any) => {
        if (curr.AttrIdAndAttrValueId) {
            acc.push({
                attrId: curr.AttrIdAndAttrValueId.split(':')[0],
                valueId: curr.AttrIdAndAttrValueId.split(':')[1]
            })
        }
        return acc
    }, [])

    

    // 处理销售属性id和销售属性值id成为接口想要的数据
    skuParams.skuSaleAttrValueList = hasSaleSpuArr.value.reduce((acc: saleArr[], curr: spuSaleAttr) => {
        if (curr.saleIdAndValueId) {
            acc.push({
                saleAttrId: curr.saleIdAndValueId.split(':')[0],
                saleAttrValueId: curr.saleIdAndValueId.split(':')[1]
            })
        }
        return acc
    }, [])









    // skuParams.skuAttrValueList = attrArr.value.reduce((prev: any, next: any) => {
    //     if (next.AttrIdAndAttrValueId) {
    //         let [attrId, valueId] = next.AttrIdAndAttrValueId.split(':');
    //         prev.push({
    //             attrId,
    //             valueId
    //         })
    //     }
    //     return prev;
    // }, []);
    // //销售属性
    // skuParams.skuSaleAttrValueList = hasSaleSpuArr.value.reduce((prev: any, next: any) => {
    //     if (next.saleIdAndValueId) {
    //         let [saleAttrId, saleAttrValueId] = next.saleIdAndValueId.split(':');
    //         prev.push({
    //             saleAttrId, saleAttrValueId
    //         })
    //     }
    //     return prev;
    // }, []);




    let res = await saveSkuReq(skuParams)
    console.log(res);
    if (res.code == 200) {
        ElMessage.success('添加成功')
        $emit('changeSence', { flag: 0, params: '' })
    } else {
        ElMessage.error('添加失败')
    }

}

defineExpose({
    getSku
})
</script>

<style scoped></style>