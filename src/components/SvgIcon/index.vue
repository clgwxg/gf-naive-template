<template>
  <SvgIcon class="svg-icon" :class="{fill:props.color}"  :width="size" :height="size"></SvgIcon>
</template>
<script setup>
import { defineAsyncComponent } from "vue";
defineOptions({
  name:"svg-icon"
})
const props=defineProps({
  icon:{
    type:String,
    default:""
  },
  color:{
    type:String,
    default:"#666"
  },
  size:{
    type:Number,
    default:30
  }
})
const SvgIcon=defineAsyncComponent(()=>import(`./src/${props.icon}.svg`))
</script>
<style lang="scss" scoped>
.svg-icon{
  &.fill{
    :deep(path){
     fill:v-bind('props.color');
  }
  }
}
</style>