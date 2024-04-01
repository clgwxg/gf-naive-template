<script setup>
import {ref,h,useSlots,computed,nextTick} from "vue"
const props=defineProps({
  width:{
    type:Number,
    default:600
  }
})
const title=ref('提示')
const style=computed(()=>{
   return {width:props.width+'px'}
})
defineExpose({
  Open(formParams,_title='提示'){
    title.value=_title
    showModal.value=true
    nextTick(()=>{
      formRef.value?.init(formParams)
    })
  }
})
const showModal=ref(false)
const formRef=ref(null)
const loading=ref(false)
const slots=useSlots()
const slotDefaults=slots.default()
const emit = defineEmits(['confirm'])
const UiForm=h(slotDefaults[0])
const handleConfirm=async ()=>{
  loading.value=true
  const res = await formRef.value?.submit('confirm').catch(()=>{})
  loading.value=false
  if(res){
    showModal.value=false
    emit('confirm',res)
  }
  
}
</script>
<template>
   <n-modal v-model:show="showModal" :style="style" :showIcon="false" preset="dialog">
    <template #header>
      <div>{{title}}</div>
    </template>
    <div><UiForm ref="formRef"><slot></slot></UiForm></div>
    <template #action>
      <slot name="footer">
        <n-space>
           <n-button @click="()=>showModal=false">取消</n-button>
           <n-button :loading="loading" type="primary" @click="handleConfirm">确定</n-button>
        </n-space>
      </slot>
    </template>
  </n-modal>
</template>