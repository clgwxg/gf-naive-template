<template>
  <n-button :disabled="disabled" v-bind="attrs"
    ><template #icon
      ><n-icon :size="props.iconSize" v-if="hasIcon"><slot name="icon"></slot></n-icon></template
    ><slot></slot
  ></n-button>
</template>
<script setup>
import { useAttrs, useSlots, computed } from 'vue'
import { useAdminStore } from '@/stores/admin'
const adminStroe = useAdminStore()
const attrs = useAttrs()
const hasIcon = !!useSlots().icon
const props = defineProps({
  iconSize: {
    type: Number,
    default: 14
  },
  permission: {
    type: String,
    default: ''
  }
})
const disabled = computed(() => {
  if (props.permission == '') {
    return false
  }
  if (adminStroe.hasPermission(props.permission)) {
    return false
  }
  return true
})
</script>
