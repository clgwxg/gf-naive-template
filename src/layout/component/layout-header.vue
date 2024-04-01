<template>
  <div class="layout-header">
    <n-popselect @update:value='handleUserAction' :options='userOptions'>
      <div class="user">
        <svg-icon color='' :size="30" icon="avatar"></svg-icon>
        <span class="nick">{{nick}}</span>
      </div>
    </n-popselect>
  </div>
</template>
<script setup>
import { useThemeVars } from 'naive-ui'
import {useAdminStore} from '@/stores/admin'
import {computed} from 'vue'
const adminStore=useAdminStore()
const colorVar=useThemeVars()
const nick=computed(()=>adminStore.adminInfo?.nickName)
console.log(adminStore)
const userOptions=[
  {label:"个人中心",value:"1"},
  {label:"退出登录",value:"2"}
]
const handleUserAction=(value)=>{
  switch(value){
    case '2':
      adminStore.logout({cancelText:"取消",content:"确认退出登录吗?"})
  }
}
</script>
<style lang="scss" scoped>
.layout-header{
  display: flex;
  justify-content: end;
  align-items: center;
  padding: 0px 16px;
  .user{
    display: flex;
    align-items: center;
    cursor: pointer;
    .nick{
      margin-left: 6px;
      font-size: 14px;
      color: v-bind('colorVar.textColor2');
    }
  }
}
</style>