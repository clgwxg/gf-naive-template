<template>
  <ui-page @refresh="loadData">
    <template #header>
      <search-form @search="handleSearch" :items="searchItems"></search-form>
    </template>
    <template #action>
      <ui-btn :iconSize="16" type="primary" permission="system:dept:add" @click="() => handleAdd()"
        ><template #icon><AddOutline /></template>新增</ui-btn
      >
    </template>
    <ui-table :default-expand-all="true" :columns="columns" :data="page.list"></ui-table>
    <form-modal @confirm="loadData" ref="modelRef">
      <dept-form></dept-form>
    </form-modal>
  </ui-page>
</template>
<script setup>
import { ref, reactive, h } from 'vue'
import { AddOutline, TrashOutline, PencilOutline } from '@vicons/ionicons5'
import { NSpace } from 'naive-ui'
import UiBtn from '@/components/UiBtn.vue'
import { statusDict } from '@/dict/common'
import DeptForm from './component/DeptForm.vue'
import { getDeptList, delDept } from '@/api/dept'
import useDeleteConfirm from '@/hooks/useDeleteConfirm'
import DictTag from '@/components/DictTag.vue'
defineOptions({
  name: 'DeptView'
})
const deleteConfirm = useDeleteConfirm(delDept)
const page = reactive({ list: [], loading: false, queryParams: {} })

const searchItems = [
  { type: 'input', label: '部门名称', field: 'name' },
  { type: 'select', label: '部门状态', field: 'status', options: statusDict }
]
const actionBtn = [
  { text: '新增', action: 'add', icon: h(AddOutline), permission: 'system:dept:add' },
  { text: '编辑', action: 'edit', icon: h(PencilOutline), permission: 'system:dept:edit' },
  { text: '删除', action: 'del', icon: h(TrashOutline), permission: 'system:dept:delete' }
]
const columns = [
  { key: 'name', title: '部门名称' },
  {
    key: 'status',
    title: '部门状态',
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
      const actions = actionBtn
        .filter((item) => (row.id == 1 && item.action == 'del' ? false : true))
        .map((item) => {
          return h(
            UiBtn,
            {
              text: true,
              type: 'primary',
              permission: item.permission,
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
  modelRef.value.Open(params, '新增部门')
}
const loadData = () => {
  if (page.loading) {
    return
  }
  page.loading = true
  getDeptList(page.queryParams)
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
    modelRef.value.Open({ id: row.id }, '编辑部门')
  } else if (action == 'add') {
    handleAdd({ parentId: row.id })
  }
}
</script>
