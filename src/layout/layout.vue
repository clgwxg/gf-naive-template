<template>
  <n-layout has-sider class="layout">
    <n-layout-sider content-style="height:100%" :native-scrollbar="false" bordered>
      <div class="layout-sider">
        <div class="logo"><StrokeText :fontSize="30" text="GF-NAIVE" /></div>
        <div class="nav-box">
          <n-scrollbar style="height: 100%">
            <layout-nav />
          </n-scrollbar>
        </div>
      </div>
    </n-layout-sider>
    <n-layout content-class="layout-flex">
      <n-layout-header class="layout-header" bordered
        ><layout-header></layout-header
      ></n-layout-header>
      <n-layout-content class="flex">
        <router-view></router-view>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>
<script setup>
import { RouterView } from 'vue-router'
import LayoutHeader from './component/layout-header.vue'
import LayoutNav from './component/layout-nav.vue'
import StrokeText from '@/components/StrokeText.vue'
defineOptions({
  name: 'layout-page'
})
</script>
<style lang="scss" scoped>
.layout {
  height: 100%;
  :deep(.layout-flex) {
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
  .flex {
    flex: 1;
    overflow: hidden;
  }
}
.layout-header {
  height: 50px;
}
.layout-sider {
  display: flex;
  align-items: stretch;
  flex-direction: column;
  height: 100%;
  .logo {
    height: 50px;
  }
  .nav-box {
    flex: 1;
    overflow: hidden;
  }
}
</style>
