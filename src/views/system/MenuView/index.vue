<template>
  <ui-page @refresh="loadData">
    <template #header>
      <search-form @search="handleSearch" :items="searchItems"></search-form>
    </template>
    <template #action>
      <ui-btn :iconSize="16" permission="system:menu:add" type="primary" @click="() => handleAdd()"
        ><template #icon><AddOutline /></template>新增</ui-btn
      >
    </template>
    <ui-table :columns="columns" :data="page.list"></ui-table>
    <form-modal @confirm="loadData" ref="modelRef">
      <menu-form></menu-form>
    </form-modal>
  </ui-page>
</template>
<script setup>
import { ref, reactive, h } from 'vue'
import { AddOutline, TrashOutline, PencilOutline } from '@vicons/ionicons5'
import { NSpace } from 'naive-ui'
import UiBtn from '@/components/UiBtn.vue'
import { statusDict } from '@/dict/common'
import MenuForm from './component/MenuForm.vue'
import { getMenuList, delMenu } from '@/api/menu'
import useDeleteConfirm from '@/hooks/useDeleteConfirm'
import DictTag from '@/components/DictTag.vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
defineOptions({
  name: 'MenuView'
})
const deleteConfirm = useDeleteConfirm(delMenu)
const page = reactive({ list: [], loading: false, queryParams: {} })

const searchItems = [
  { type: 'input', label: '菜单名称', field: 'name' },
  { type: 'select', label: '菜单状态', field: 'status', options: statusDict }
]
const actionBtn = [
  { text: '新增', action: 'add', icon: h(AddOutline), permission: 'system:menu:add' },
  { text: '编辑', action: 'edit', icon: h(PencilOutline), permission: 'system:menu:edit' },
  { text: '删除', action: 'del', icon: h(TrashOutline), permission: 'system:menu:delete' }
]
const columns = [
  { key: 'name', title: '菜单名称' },
  {
    key: 'icon',
    title: '图标',
    align: 'center',
    render(row) {
      return row.icon && h(SvgIcon, { icon: row.icon, size: 16 })
    }
  },
  { key: 'perms', title: '权限标识' },
  { key: 'path', title: '组件路径' },
  {
    key: 'status',
    title: '菜单状态',
    render(row) {
      return h(DictTag, { dict: statusDict, value: row.status })
    }
  },
  { key: 'createdAt', title: '创建时间', align: 'center' },
  {
    key: 'action',
    title: '操作',
    align: 'center',
    width: 220,
    render(row) {
      const actions = actionBtn.map((item) => {
        return h(
          UiBtn,
          {
            text: true,
            permission: item.permission,
            type: 'primary',
            onClick: () => handleAction(item.action, row)
          },
          { default: () => item.text, icon: () => item.icon }
        )
      })
      return h(NSpace, { justify: 'space-between' }, { default: () => actions })
    }
  }
]
const modelRef = ref()
const handleSearch = (params) => {
  page.queryParams = params
  loadData()
}
const handleAdd = (params = {}) => {
  modelRef.value.Open(params, '新增菜单')
}
const loadData = () => {
  if (page.loading) {
    return
  }
  page.loading = true
  getMenuList(page.queryParams)
    .then((res) => {
      page.list = res?.data?.list || []
    })
    .finally(() => {
      page.loading = false
    })
}
loadData()
const handleAction = async (action, row) => {
  if (action == 'del') {
    let res = await deleteConfirm(row.id)
    res?.code === 2000 && loadData()
  } else if (action == 'edit') {
    modelRef.value.Open({ id: row.id }, '编辑菜单')
  } else if (action == 'add') {
    handleAdd({ parentId: row.id })
  }
}
</script>
