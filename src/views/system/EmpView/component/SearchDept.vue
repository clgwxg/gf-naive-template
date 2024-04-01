<template>
  <div class="search-dept">
    <n-form>
      <n-input @update:value='handleChange'></n-input>
    </n-form>
    <div class="flex-wrap" v-if="props.list.length>0">
      <n-tree
        block-line
        :data="props.list"
        :default-expand-all='true'
        selectable
        :pattern="keyword"
        :show-irrelevant-nodes='false'
        @update:selected-keys='handleSelect'
      />
    </div>
  </div>
</template>

<script setup name='search-dept'>
import {ref} from "vue"
const props=defineProps({
  list:{
    type:Array,
    default(){
      return []
    }
  }
})
const keyword=ref('')
const emits=defineEmits(['select'])

const findChildId=(list,parentId,childrenArr)=>{
    list.forEach(item => {
       let pathArr=item.path.split("-")
       let index=pathArr.indexOf(`${parentId}`)
       if(index>-1){
        childrenArr.push(...pathArr.slice(index))
       }
       if(item.children){
        findChildId(item.children,parentId,childrenArr)
       }
    })
}
  const handleSelect=(keys)=>{
    let resultArr=[]
    findChildId(props.list,keys[0],resultArr)
    emits('select',Array.from(new Set(resultArr)).toString())
  }
  const handleChange=(value)=>{
    keyword.value=value
  }
</script>
<style lang="scss" scoped>
.search-dept{
  display: flex;
  flex-direction: column;
  align-items: stretch;
  height: 100%;
  .flex-wrap{
    flex:1;
    padding-top: 10px;
  }
}
</style>