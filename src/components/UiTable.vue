<template>
  <n-data-table @update:expanded-row-keys='handleExpanded' v-bind="attrs" :expanded-row-keys='expandedAll' :rowKey="(row)=>row.id" size="small"></n-data-table>
</template>
<script setup>
import {useAttrs,ref,watch} from 'vue'
const attrs=useAttrs()
const handleExpanded=(keys)=>{
  expandedAll.value=keys
}
const expandedAll=ref([])
const getAllIds=(list=[])=>{
  let ids=[]
  list.forEach(item=>{
    if(item?.children?.length>0){
      ids.push(item.id)
      ids=ids.concat(getAllIds(item.children))
    }
  })
  return ids
}
// 实现default-expand-all 
watch(()=>attrs.data,function(data){
  if(attrs['default-expand-all']){
    expandedAll.value=getAllIds(data)
  }
})
</script>