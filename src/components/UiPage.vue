<template>
  <div class="ui-page">
    <div class="ui-page-left" v-if="slots.left"><slot name='left'></slot></div>
    <div class="ui-page-right">
      <div class="ui-page-right-content">
        <div class="header" v-if="data.showHeader"><slot name="header"></slot></div>
        <div class="body">
          <n-scrollbar style="height:100%">
            <div class="body-container">
                <div class="action">
                  <div class="action-left"><slot name="action"></slot></div>
                  <slot name="actionRight">
                    <n-space>
                      <n-tooltip placement="top" trigger="hover">
                        <template #trigger>
                          <n-button @click="handleAction('header')" circle><template #icon><n-icon><SearchOutline /></n-icon></template></n-button>
                        </template>
                        <span>隐藏搜索</span>
                      </n-tooltip>
                      <n-tooltip placement="top" trigger="hover">
                        <template #trigger>
                          <n-button @click="handleAction('refresh')" circle><template #icon><n-icon><SyncOutline /></n-icon></template></n-button>
                        </template>
                        <span>刷新</span>
                      </n-tooltip>
                    </n-space>
                  </slot>
                </div>
                <div class="slot-default"><slot></slot></div>
            </div>
          </n-scrollbar>
        </div>
        <div class="footer" v-if="props.total>0">
          <div class="footer-left"><slot name="footerLeft"></slot></div>
          <slot name="footerRight">
            <n-pagination
              v-model:page="page"
              v-model:page-size='pageSize'
              :page-sizes='[10,20,30]'
              :item-count="props.total"
              show-quick-jumper
              show-size-picker
            >
              <template #prefix="{ itemCount }">
              共 {{ itemCount }} 条
              </template>
            </n-pagination>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {computed, reactive,useSlots} from "vue"
import { useThemeVars } from 'naive-ui'
import {SearchOutline ,SyncOutline} from '@vicons/ionicons5'
const slots=useSlots()
const emits=defineEmits(['refresh','update:pageNum','update:pageSize'])
const data=reactive({showHeader:true})
const colorVar=useThemeVars()
const props=defineProps({
  total:{
    type:Number,
    default:0
  },
  pageNum:{
    type:Number,
    default:1
  },
  pageSize:{
    type:Number,
    default:10
  }
})
const page=computed({
  get(){
    return props.modelPageNum
  },
  set(page){
    emits('update:pageNum',page)
  }
})
const pageSize=computed({
  get(){
    return props.pageSize
  },
  set(pageSize){
    emits('update:pageNum',1)
    emits('update:pageSize',pageSize)
  }
})
const handleAction=(action)=>{
  if(action=='header'){
    data.showHeader=!data.showHeader
  }else if(action=='refresh'){
    emits('refresh')
  }
}
</script>
<style lang="scss">
.ui-page{
  height: 100%;
  display: flex;
  .ui-page-left{
    height: 100%;
    width:300px;
    padding: 16px;
    box-sizing: border-box;
    &+.ui-page-right{
      border-left: 1px solid v-bind('colorVar.borderColor');
    }
  }
  .ui-page-right{
    height: 100%;
    flex:1;
     box-sizing: border-box;
  }
}
.ui-page-right-content{
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding-top: 16px;
  padding-bottom: 16px;
  box-sizing: border-box;
  .header{
    padding:0px 16px 0;
  }
  .body{
    flex:1;
    overflow: hidden;
    .body-container{
      padding: 0 16px;
    }
    .action{
      padding-bottom: 10px;
      display: flex;
      .action-left{
        flex:1;
      }
    }
  }
  .footer{
    padding:16px 16px 0;
    border-top: 1px solid  v-bind('colorVar.borderColor');
    display: flex;
    .footer-left{
      flex:1;
    }
  }
}
</style>