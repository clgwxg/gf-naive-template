<script setup>
import StrokeText from '@/components/StrokeText.vue'
defineOptions({
  name: 'NotFound'
})
</script>

<template>
  <div class="home-view"><StrokeText :font-size="200" text="404" /></div>
</template>
<style lang="scss" scoped>
.home-view {
  height: 100%;
}
</style>
