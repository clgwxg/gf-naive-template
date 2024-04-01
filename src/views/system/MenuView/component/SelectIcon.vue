<template>
 <n-popover trigger="hover">
    <template #trigger>
      <n-input v-model:value="value" readonly>悬浮</n-input>
    </template>
    <div class="container">
      <n-scrollbar style="max-height: 120px">
        <div class="select">
          <div v-for="item in icons" :key="item" @click="handleSelect(item)" class="item">
            <svg-icon :size="14" :icon="item"></svg-icon>
            <span class="text">{{ item }}</span>
          </div>
        </div>
      </n-scrollbar>
    </div>
  </n-popover>
</template>
<script setup>
import {computed} from "vue"
const modules = import.meta.glob('@/components/SvgIcon/src/*.svg')
const icons=Object.keys(modules).map(path=>{
   let res=path.match(/\S*\/(\S*).svg/)
   return res[1]
})
const handleSelect=(value)=>{
   emits('update:modelValue',value)
}
const props=defineProps({
  modelValue:{
    type:String,
    default:""
  }
})
const emits=defineEmits(['update:modelValue'])
const value=computed({
  get(){
    return props.modelValue
  },
  set(value){
    emits('update:modelValue',value)
  }
})
</script>
<style lang="scss" scoped>
.container{
  width: 100%;
  .select{
    padding:10px;
    display: grid;
     grid-template-columns: repeat(3, 100px);
     .item{
      display: flex;
      align-items: center;
      cursor: pointer;
      .text{
        flex:1;
        margin-left: 4px;
      }
     }
  }
}
</style>