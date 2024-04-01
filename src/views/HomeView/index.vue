<script setup>
import StrokeText from '@/components/StrokeText.vue'
defineOptions({
  name: 'HomeView'
})
</script>

<template>
  <div class="home-view"><StrokeText :font-size="100" text="Hello World" /></div>
</template>
<style lang="scss" scoped>
.home-view {
  height: 100%;
}
</style>
