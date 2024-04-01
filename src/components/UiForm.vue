<script setup>
import {ref,computed} from "vue"

const props=defineProps({
  items:{
    type:Array,
    default(){
      return []
    }
  },
  labelWidth:{
    type:Number,
    default:80
  }
})
const model=ref({})
const formRef=ref()
const rules=computed(()=>{
  return props.items.reduce((rule,item)=>{
    if(item.rule){
      rule[item.field]=item.rule
    }
    return rule
  },{})

})
defineExpose({
  submit(){
    console.log(model.value)
    return new Promise((resolve,reject)=>{
      formRef.value?.validate(errors=>{
        if(!errors){
          resolve(model.value)
        }else{
          reject(errors)
        }
      }).catch(err=>console.log(err))
    })
  },
  setValue(value={}){
    model.value=value
  },
  getValue(field){
    return field?model.value[field]:model.value
  }
})
const isRender=(item)=>{
   if(typeof item.isRender =='function'){
     return item.isRender(model)
   }
   return true
}
</script>
<template>
  <n-form ref='formRef' label-placement="left" :label-width="props.labelWidth" :rules="rules" require-mark-placement="left" :model="model">
    <n-grid :cols="24" :x-gap="24">
      <template v-for="item in props.items" :key="item.field">
        <n-form-item-gi v-if="isRender(item)" :span="item.span" :label="item.label" :path="item.field">
          <n-input v-if="item.type=='input'" v-model:value="model[item.field]" :placeholder="item.placeholder" />
          <n-input v-else-if="item.type=='textarea'" type='textarea' v-model:value="model[item.field]" :placeholder="item.placeholder" />
          <n-radio-group v-else-if="item.type=='radioGroup'" v-model:value="model[item.field]">
            <n-space>
              <n-radio v-for="radio in item.options" :key="radio.value" :value="radio.value">
                {{ radio.label }}
              </n-radio>
            </n-space>
          </n-radio-group>
          <n-tree-select v-else-if="item.type=='treeSelect'" v-model:value="model[item.field]" :options="item.options"></n-tree-select>
          <template v-else-if="item.type=='slot'">
             <slot name="item" :item="item" :model="model"></slot>
          </template>
        </n-form-item-gi>
      </template>
    </n-grid>
  </n-form>
</template>