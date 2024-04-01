<template>
  <n-menu
    v-model:value="activeKey"
    :collapsed="collapsed"
    :collapsed-width="64"
    :collapsed-icon-size="22"
    :options="menuOptions"
  />
</template>

<script setup>
import { computed, ref, h } from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import { RouterLink, useRoute } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
const route = useRoute()
const adminStore = useAdminStore()
function renderIcon(icon) {
  return () => h(SvgIcon, { icon: icon })
}
function renderMenu(treeMenu) {
  return treeMenu.map((item) => {
    let query = {}
    if (item.query) {
      try {
        query = JSON.parse(item.query)
      } catch (error) {
        console.log(error)
      }
    }
    let menu = {
      label: () =>
        h(
          RouterLink,
          {
            to: item.url,
            query: query
          },
          { default: () => item.label }
        ),
      icon: renderIcon(item.icon),
      key: item.url
    }

    if (item.children) {
      menu.children = renderMenu(item.children)
    }
    return menu
  })
}
function jsonToUrlParam(jsonStr) {
  try {
    return new URLSearchParams(JSON.parse(jsonStr)).toString()
  } catch (error) {
    return ''
  }
}
function transTree(data) {
  let result = []
  let map = {}
  if (!Array.isArray(data)) {
    //验证data是不是数组类型
    return []
  }
  data = data
    ?.filter((item) => item.type != 3 && item.visible)
    .map((item) => {
      let url = item.url
      if (item.query) {
        let query = jsonToUrlParam(item.query)
        if (query) {
          url += url.indexOf('?') > -1 ? query : '?' + query
        }
      }
      return {
        url: url,
        label: item.name,
        id: item.id,
        parentId: item.parentId,
        icon: item.icon
      }
    })
  data.forEach((item) => {
    //建立每个数组元素id和该对象的关系
    map[item.id] = item //这里可以理解为浅拷贝，共享引用
  })
  data.forEach((item) => {
    let parent = map[item.parentId] //找到data中每一项item的爸爸
    if (parent) {
      //说明元素有爸爸，把元素放在爸爸的children下面
      ;(parent.children || (parent.children = [])).push(item)
    } else {
      //说明元素没有爸爸，是根节点，把节点push到最终结果中
      result.push(item) //item是对象的引用
    }
  })
  return result //数组里的对象和data是共享的
}
let activeKey = computed(() => {
  return route.fullPath
})
let collapsed = ref(false)
const treeMenu = computed(() => {
  const treeMenu = transTree(adminStore.adminMenu)
  treeMenu.unshift({
    url: '/admin/home',
    icon: 'home',
    label: '首页',
    id: '0'
  })
  return treeMenu
})
const menuOptions = computed(() => {
  return renderMenu(treeMenu.value)
})
</script>
