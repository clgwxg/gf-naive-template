<template>
  <ui-page
    @refresh="loadData"
    :total="page.total"
    v-model:pageNum="page.pageNum"
    v-model:pageSize="page.pageSize"
  >
    <template #header>
      <search-form @search="handleSearch" :items="searchItems"></search-form>
    </template>
    <template #action>
      <ui-btn :iconSize="16" type="primary" permission="system:role:add" @click="() => handleAdd()"
        ><template #icon><AddOutline /></template>新增</ui-btn
      >
    </template>
    <ui-table :columns="columns" :data="page.list"></ui-table>
    <form-modal @confirm="loadData" ref="modelRef">
      <role-form></role-form>
    </form-modal>
  </ui-page>
</template>
<script setup>
import { ref, reactive, h, watch } from 'vue'
import { AddOutline, TrashOutline, PencilOutline } from '@vicons/ionicons5'
import { NSpace } from 'naive-ui'
import UiBtn from '@/components/UiBtn.vue'
import { statusDict } from '@/dict/common'
import RoleForm from './component/RoleForm.vue'
import { getRoleList, delRole } from '@/api/role'
import useDeleteConfirm from '@/hooks/useDeleteConfirm'
import DictTag from '@/components/DictTag.vue'
defineOptions({
  name: 'RoleView'
})
const deleteConfirm = useDeleteConfirm(delRole)
const page = reactive({
  list: [],
  loading: false,
  queryParams: {},
  total: 0,
  pageSize: 10,
  pageNum: 1
})

const searchItems = [
  { type: 'input', label: '角色名称', field: 'name' },
  { type: 'select', label: '角色状态', field: 'status', options: statusDict },
  { type: 'dateRange', label: '创建时间', field: 'date' }
]
const actionBtn = [
  { text: '编辑', action: 'edit', icon: h(PencilOutline), permission: 'system:role:edit' },
  { text: '删除', action: 'del', icon: h(TrashOutline), permission: 'system:role:delete' }
]
const columns = [
  { key: 'name', title: '角色名称' },
  {
    key: 'status',
    title: '角色状态',
    render(row) {
      return h(DictTag, { dict: statusDict, value: row.status })
    }
  },
  { key: 'createdAt', title: '创建时间', align: 'center' },
  {
    key: 'action',
    title: '操作',
    align: 'center',
    width: 140,
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
  modelRef.value.Open(params, '新增角色')
}
const loadData = () => {
  if (page.loading) {
    return
  }
  page.loading = true
  getRoleList({ ...page.queryParams, pageNum: page.pageNum, pageSize: page.pageSize })
    .then((res) => {
      page.list = res?.data?.list || []
      page.total = res?.data?.total || 0
    })
    .finally(() => {
      page.loading = false
    })
}
loadData()
watch([() => page.pageSize, () => page.pageNum], () => {
  loadData()
})
const handleAction = async (action, row) => {
  if (action == 'del') {
    let res = await deleteConfirm(row.id)
    res?.code === 2000 && loadData()
  } else if (action == 'edit') {
    modelRef.value.Open({ id: row.id }, '编辑角色')
  }
}
</script>
