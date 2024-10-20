<template>
    <div>
        <el-form label-width="100px">
            <el-form-item label="SUP名称">
                <el-input placeholder="请你输入SPU名称" v-model="SpuParams.spuName"></el-input>
            </el-form-item>

            <el-form-item label="SUP品牌">
                <el-select placeholder="请选择" v-model="SpuParams.tmId">
                    <el-option v-for="item in tradeMarkArr" :key="item.id" :label="item.tmName"
                        :value="item.id"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="SPU描述">
                <el-input placeholder="请你输入SPU描述" type="textarea" v-model="SpuParams.description"></el-input>
            </el-form-item>

            <el-form-item label="SPU图片">
                <el-upload v-model:file-list="supImageArr" action="/api/admin/product/fileUpload" list-type="picture-card"
                    :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :before-upload="handlerUpload">
                    <el-icon>
                        <Plus />
                    </el-icon>
                </el-upload>
                <el-dialog v-model="dialogVisible">
                    <img w-full :src="dialogImageUrl" alt="Preview Image" style="width: 100%;height: 100%;" />
                </el-dialog>
            </el-form-item>

            <el-form-item label="SPU销售属性">
                <el-select v-model="unSelect"
                    :placeholder="unSelectSaleAttr.length ? `还未选择${unSelectSaleAttr.length}个` : '无'">
                    <el-option v-for="item in unSelectSaleAttr" :key="item.id" :label="item.name"
                        :value="`${item.id}:${item.name}`"></el-option>
                </el-select>
                <el-button type="primary" icon="Plus" size="default" style="margin-left: 10px;" @click="addSaleAttr"
                    :disabled="!unSelect">添加属性</el-button>
                <el-table border style="margin-top: 10px;" :data="spuSaleAttrArr">
                    <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
                    <el-table-column label="销售属性名字" width="120px" prop="saleAttrName"></el-table-column>
                    <el-table-column label="销售属性值">
                        <template #="{ row }">
                            <el-tag v-for="item in row.spuSaleAttrValueList" :key="item.id" class="mx-1" closable
                                style="margin: 0 5px;">
                                {{ item.saleAttrValueName }}
                            </el-tag>
                            <el-input v-model="row.newSaleAttrName" @blur="toLook(row)" v-if="row.flag == true" size="small"
                                style="width: 100px;" placeholder="请输入"></el-input>
                            <el-button @click="toEdit(row)" v-else type="success" icon="plus" size="small"></el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="90px">
                        <template #="{ $index }">
                            <el-button type="danger" size="small" icon="delete"
                                @click="spuSaleAttrArr.splice($index, 1)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item>
                <template #>
                    <el-button type="primary" @click="save" :disabled="spuSaleAttrArr.length ? false : true">保存</el-button>
                    <el-button type="primary" @click="cancel">取消</el-button>
                </template>
            </el-form-item>


        </el-form>
    </div>
</template>

<script setup lang="ts">
import { reqAllTradeMark, reqSpuImageList, reqSpuHasSaleAttr, reqAllSaleAttr, reqSaveOrUpdateSpu } from '@/api/product/spu'
// 引入类型
import { ElMessage, type UploadProps } from 'element-plus'
import type { spuAttrValue, SpuData, AllTradeMark, SpuHasImg, spuSaleAttrRes, HasSaleAttrResponseData, Trademark, SpuImg, spuSaleAttr, HasSaleAttr } from '@/api/product/spu/type.ts'

import { ref, computed } from 'vue'
let tradeMarkArr = ref<Trademark[]>([])
let supImageArr = ref<SpuImg[]>([])
let spuSaleAttrArr = ref<spuSaleAttr[]>([])
let hasSaleAttrArr = ref<HasSaleAttr[]>([])

// 将来收集还未选择的销售属性的ID与属性值的名字
let unSelect = ref<string>('')
// 
//存储预览图片地址
let dialogImageUrl = ref<string>('')
// 对话框是否出现
let dialogVisible = ref<boolean>(false)
//存储已有的SPU对象 发送添加或修改spu请求的参数
let SpuParams = ref<SpuData>({
    category3Id: "",//收集三级分类的ID
    spuName: "",//SPU的名字
    description: "",//SPU的描述
    tmId: '',//品牌的ID
    spuImageList: [],
    spuSaleAttrList: [],
});
let $emit = defineEmits(['changeSence'])
// 触发自定义事件
const cancel = () => {
    // 退出添加SPU场景
    $emit('changeSence', { flag: 0, params: SpuParams.value.id ? 'update' : 'add' })
    // 清除图片
    supImageArr.value = []
    //清空销售属性
    spuSaleAttrArr.value = [];
}
// 修改spu 发送请求获取sup数据 父组件使用该方法
const getSpu = async (spu: SpuData) => {

    SpuParams.value = spu
    //spu:即为父组件传递过来的已有的SPU对象[不完整]
    //获取全部品牌的数据
    let res: AllTradeMark = await reqAllTradeMark();
    //获取某一个品牌旗下全部售卖商品的图片
    let res1: SpuHasImg = await reqSpuImageList((spu.id as number));
    //获取已有的SPU销售属性的数据
    let res2: spuSaleAttrRes = await reqSpuHasSaleAttr((spu.id as number));
    //获取整个项目全部SPU的销售属性
    let res3: HasSaleAttrResponseData = await reqAllSaleAttr();
    // 存储发送请求得到的数据
    if (res.code == 200) {
        tradeMarkArr.value = res.data
    }
    if (res1.code == 200) {
        supImageArr.value = res1.data.map((item) => {
            console.log(item);
            
            return {
                name: item.imgName,
                url: item.imgUrl
            }
        })
    }
    if (res2.code == 200) {
        spuSaleAttrArr.value = res2.data
    }
    if (res3.code == 200) {
        hasSaleAttrArr.value = res3.data
    }

}
// 点击文件列表中已上传的文件时的钩子
const handlePictureCardPreview: UploadProps['onPreview'] = (file: any) => {
    dialogImageUrl.value = file.url
    dialogVisible.value = true
}
// 文件列表移除文件时的钩子
const handleRemove = () => {
    ElMessage.success('删除照片成功')
}

//照片钱上传成功之前的钩子约束文件的大小与类型
const handlerUpload = (file: any) => {
    if (file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/gif') {
        if (file.size / 1024 / 1024 < 3) {
            return true;
        } else {
            ElMessage({
                type: 'error',
                message: '上传文件务必小于3M'
            })
            return false;
        }
    } else {
        ElMessage({
            type: 'error',
            message: '上传文件务必PNG|JPG|GIF'
        })
        return false;
    }
}
// 计算出未选择的项
const unSelectSaleAttr = computed(() => {
    //全部销售属性:颜色、版本、尺码
    //已有的销售属性:颜色、版本
    return hasSaleAttrArr.value.filter((item) => {
        return spuSaleAttrArr.value.every(spu => {
            return item.name != spu.saleAttrName;
        })
    })
})
// 添加属性按钮的回调
const addSaleAttr = () => {
    let [baseSaleAttrId, saleAttrName] = unSelect.value.split(':')
    let newSpuSaleAttr: spuSaleAttr = {
        spuSaleAttrValueList: [],
        baseSaleAttrId,
        saleAttrName
    }
    // 追加到数组当中
    spuSaleAttrArr.value.push(newSpuSaleAttr)
    // 清空收集的数据
    unSelect.value = ''
}
// 添加属性值
const toEdit = (row: spuSaleAttr) => {
    // 添加flag和newSaleAttrName属性
    // flag:控制编辑和查看的切换
    // newSaleAttrName:spuSaleAttrArr中添加一个属性newSaleAttrName,存储新增的属性值，和输入框双向绑定
    row.flag = true
    row.newSaleAttrName = ''


}
// 失去焦点转为查看
const toLook = (row: spuSaleAttr) => {

    // 结构出来的都属字符串,ts中baseSaleAttrId定义的是number，ts中baseSaleAttrId的类型改为联合类型
    let { baseSaleAttrId, newSaleAttrName } = row

    // 构造一个属性值对象push到spuSaleAttrValueList中，实现失去焦点后新增的属性值显示在tag中
    let newspuSaleAttrValueObj: spuAttrValue = {
        baseSaleAttrId,
        saleAttrValueName: (newSaleAttrName as string)
    }
    // 非法1:输入为空
    if (!(newSaleAttrName as string).trim()) {
        ElMessage.error('输入值为空')
        row.flag = false
        return
    }

    // 非法2:输入值重复
    let repeat = row.spuSaleAttrValueList.find((item) => {
        return item.saleAttrValueName == newSaleAttrName
    })
    if (repeat) {
        ElMessage.error('属性值重复')
        row.flag = false
        return
    }
    // 将新对象添加到属性值数组中
    row.spuSaleAttrValueList.push(newspuSaleAttrValueObj)

    row.flag = false
}
// 保存按钮的回调
const save = async () => {
    SpuParams.value.spuImageList = supImageArr.value.map((item: any) => {
        return {
            imgName: item.name,
            // 添加spu：上传的图片的地址在response.data里
            // 修改spu：图片地址在URL里
            imgUrl: (item.response && item.response.data)||item.url
            // imgUrl: item.response.data||item.url 这种写法在点修改后保存会报错，因为点修改按钮，里面的图片没response属性，为undefined。
            // undefined.data会报错，所以要先保证有response，
            // (item.response && item.response.data)||item.url 若没有response则item.response为false，执行item.url
        }
    })
    SpuParams.value.spuSaleAttrList = spuSaleAttrArr.value
    let res: any = await reqSaveOrUpdateSpu(SpuParams.value)

    if (res.code == 200) {
        ElMessage({
            type: 'success',
            message: SpuParams.value.id ? '更新成功' : '添加成功'
        })
        // 退出添加SPU场景
        $emit('changeSence', { flag: 0, params: SpuParams.value.id ? 'update' : 'add' })
        // 清除图片
        supImageArr.value = []
        //清空销售属性
        spuSaleAttrArr.value = [];
    } else {
        ElMessage({
            type: 'error',
            message: SpuParams.value.id ? '更新失败' : '添加失败'
        })
    }

}
// 添加spu方法并暴露
const addSup = async (category3Id: number) => {
    //清空数据
    Object.assign(SpuParams.value, {
        category3Id: "",//收集三级分类的ID
        spuName: "",//SPU的名字
        description: "",//SPU的描述
        tmId: '',//品牌的ID
        spuImageList: [],
        spuSaleAttrList: [],
    });
    //清空照片 
    // supImageArr.value = []; 在保存和取消按钮那清除了
    //清空销售属性
    spuSaleAttrArr.value = [];
    // 如果先点过修改，会带有id，清除id
    delete SpuParams.value.id
    SpuParams.value.category3Id = category3Id
    // 获取全部商品品牌和商品的属性
    //获取全部品牌的数据
    let res: AllTradeMark = await reqAllTradeMark();
    if (res.code == 200) {
        tradeMarkArr.value = res.data
    }
    //获取整个项目全部SPU的销售属性
    let res3: HasSaleAttrResponseData = await reqAllSaleAttr();
    if (res3.code == 200) {
        hasSaleAttrArr.value = res3.data
    }

}
// 组件方法暴露
defineExpose({ getSpu, addSup })
</script>

<style scoped></style>