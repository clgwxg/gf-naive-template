<script setup>
import {  RouterView ,useRouter} from 'vue-router'
import { zhCN, dateZhCN } from 'naive-ui'
import {useAdminStore} from '@/stores/admin'
import {resetRoute} from "@/router"
const router=useRouter()
const adminStore=useAdminStore()
const submitCallback=async ()=>{
    await adminStore.confirmLogout()
    resetRoute()
    router.replace({name:"Login"})
}
const cancelCallback=()=>{
  adminStore.logout({show:false})
}
</script>

<template>
   <n-modal
    v-model:show="adminStore.logoutModal.show"
    :show-icon='false'
    preset="dialog"
    title="提示"
    :content="adminStore.logoutModal.content"
    :closable='false'
    positive-text="确认"
    :negative-text="adminStore.logoutModal.cancelText"
    @positive-click="submitCallback"
    @negative-click="cancelCallback"
  />
  <n-config-provider class="n-config" :locale="zhCN" :date-locale="dateZhCN">
    <n-dialog-provider>
      <n-message-provider>
        <RouterView />
    </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>
<style lang="scss">
html,body,#app,.n-config{
  height: 100%;
}
</style>

