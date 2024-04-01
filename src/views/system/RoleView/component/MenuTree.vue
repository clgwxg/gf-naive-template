<template>
  <div class="tree">
    <n-tree
    block-line
    checkable
    cascade
    :selectable="false"
    :data="props.treeData"
    virtual-scroll
    style="height: 140px"
    v-model:checked-keys='checkedKeys'
    ></n-tree>
  </div>
</template>

<script setup>
import { useThemeVars } from 'naive-ui'
import { computed } from 'vue'
const themeVar=useThemeVars()
const props=defineProps({
  treeData:{
    type:Array,
    default(){
      return []
    }
  },
  modelValue:{
    type:Array,
    default(){
      return []
    }
  }
})

const emits=defineEmits(['update:modelValue'])
const checkedKeys=computed({
  get(){
    return props.modelValue
  },
  set(value){
    emits('update:modelValue',value)
  }
})
</script>
<style lang='scss' scoped>
.tree{
  border:1px solid v-bind('themeVar.borderColor');
  border-radius: v-bind('themeVar.borderRadius');
  flex:1;
}
</style>