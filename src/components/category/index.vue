<template>
  <div>
    <el-card>
      <el-form inline="true">
        <el-form-item label="一级分类" >
          <el-select placeholder="请选择" v-model="C1ID" @change="handle1" :disabled="disabledSelect == false?true:false">
            <el-option :label="item.name" v-for="item in category1" :key="item.id" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select placeholder="请选择" v-model="C2ID" @change="handle2" :disabled="disabledSelect == false?true:false">
            <el-option :label="item.name" v-for="item in category2" :key="item.id" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
          <el-select placeholder="请选择" v-model="C3ID" @change="handle3" :disabled="disabledSelect == false?true:false">
            <el-option :label="item.name" v-for="item in category3" :key="item.id" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { C1Req, C2Req, C3Req } from '@/api/product/attr'
import { onMounted, ref } from 'vue';
import type { ResponseBody, CategoryObj } from '@/api/product/attr/type.ts'
defineProps(['disabledSelect'])
// 保存一级的数据
let category1 = ref<CategoryObj[]>([])
// 保存二级的数据
let category2 = ref<CategoryObj[]>([])
// 保存三级的数据
let category3 = ref<CategoryObj[]>([])
// 保存C1的ID
let C1ID = ref<number | string>('')
// 保存C2的ID
let C2ID = ref<number | string>('')
// 保存C3的ID
let C3ID = ref<number | string>('')
// 发送C1请求
const getC1Req = async () => {
  let res: ResponseBody = await C1Req()
  if (res.code == 200) {
    // 将一级分类的数据保存
    category1.value = res.data
  }
}
// 选完一级分类后发送请求获得二级分类的数据
const handle1 = async () => {
  let res: ResponseBody = await C2Req(C1ID.value)
  if (res.code == 200) {
    // 将二级分类的数据保存
    category2.value = res.data
  }
  // 防止三个分类都选完后突然改变一级分类导致后两的分类的数据还是原数据的bug
  C2ID.value = ''
  C3ID.value = ''
  category3.value = []
  // 触发自定义事件，没有3id，走else
  $emit('getCatgory3Id', { category1Id: C1ID.value, category2Id: C2ID.value, category3Id: C3ID.value })
}
// 选完二级分类后发送请求获得三级分类的数据
const handle2 = async () => {
  let res: ResponseBody = await C3Req(C2ID.value)
  if (res.code == 200) {
    category3.value = res.data
  }
  // 防止三个分类都选完后突然改变二级分类导致后三级分类的数据还是原数据的bug
  C3ID.value = ''
  // 触发自定义事件，没有3id，走else
  $emit('getCatgory3Id', { category1Id: C1ID.value, category2Id: C2ID.value, category3Id: C3ID.value })
}
onMounted(() => {
  // 页面挂载完毕发送请求获取一级分类数据
  getC1Req()
})
// 绑定自定义事件
let $emit = defineEmits(['getCatgory3Id'])
const handle3 = () => {
  // 自定义事件将C3ID传给父组件
  // 触发自定义事件给父组件传数据
  $emit('getCatgory3Id', { category1Id: C1ID.value, category2Id: C2ID.value, category3Id: C3ID.value })
}

</script>

<style scoped></style>