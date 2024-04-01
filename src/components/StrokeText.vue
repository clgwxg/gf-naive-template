<template>
  <div class="stroke-text" :style="textStyle">
    {{ text }}
  </div>
</template>
<script setup>
import { useThemeVars } from 'naive-ui'
import { computed } from 'vue'
const colorVar = useThemeVars()
const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  fontSize: {
    type: Number,
    default: 20
  },
  fill: {
    type: String,
    default: '#fff'
  },
  strokeColor: {
    type: String,
    default: ''
  }
})
console.log(props)
const textStyle = computed(() => {
  return {
    color: props.fill,
    fontSize: props.fontSize + 'px'
  }
})
const color = computed(() => props.strokeColor || colorVar.value.primaryColor)
</script>
<style lang="scss" scoped>
.stroke-text {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 1px;
  text-shadow:
    1px 1px 0 v-bind('color'),
    -1px -1px 0 v-bind('color'),
    -1px 1px 0 v-bind('color'),
    1px -1px 0 v-bind('color');
}
</style>
