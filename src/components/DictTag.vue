<template>
  <n-tag type='success' size='small' v-if="text">{{text}}</n-tag>
</template>

<script setup>
import {computed} from "vue"
const props=defineProps({
  dict:{
    type:Array,
    default(){
      return []
    }
  },
  value:{
    type:[Number,String],
    default:""
  }
})
const text=computed(()=>{
   let item=props.dict?.find(item=>item.value==props.value)
   return item?.label || ''
})
</script>