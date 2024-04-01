<template>
  <n-form  label-placement="left" :model="model">
    <n-grid :cols="24" :x-gap="24">
      <n-form-item-gi v-for="item in props.items" :span="item.span || 6" :key="item.field" :label="item.label" :path="item.field">
        <n-input v-if="item.type=='input'" v-model:value="model[item.field]" :placeholder="item.placeholder || item.label" />
        <n-select v-else-if="item.type=='select'" v-model:value="model[item.field]" :options="item.options" />
        <n-date-picker v-else-if="item.type=='dateRange'" value-format="yyyy.MM.dd" v-model:value="model[item.field]" type="daterange" clearable />
      </n-form-item-gi>
      <n-form-item-gi :span="6">
        <n-space><n-button @click="handleSearch" type="primary"><template #icon><n-icon><SearchOutline /></n-icon></template>搜索</n-button><n-button @click="handleReset"><template #icon><n-icon><SyncOutline /></n-icon></template>重置</n-button></n-space>
      </n-form-item-gi>
    </n-grid>
  </n-form>
</template>
<script setup>
import {ref} from "vue"
import {SearchOutline ,SyncOutline} from '@vicons/ionicons5'
const emits = defineEmits(['search'])
const model=ref({})
const props=defineProps({
  items:{
    type:Array,
    default(){
      return []
    }
  }
})
const handleSearch=()=>{
  // 200 200 624 624
  emits('search',model.value)
}
const handleReset=()=>{
  let value={}
  Object.keys(model.value).forEach(key=>{
    value[key]=null
  })
  model.value=value
  console.log(model.value)
  emits('search',{})
}
</script>
<style lang="scss" scoped></style>