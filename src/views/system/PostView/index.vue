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
      <ui-btn :iconSize="16" permission="system:post:add" type="primary" @click="() => handleAdd()"
        ><template #icon><AddOutline /></template>新增</ui-btn
      >
    </template>
    <ui-table :columns="columns" :data="page.list"></ui-table>
    <form-modal @confirm="loadData" ref="modelRef">
      <post-form></post-form>
    </form-modal>
  </ui-page>
</template>
<script setup>
import { ref, reactive, h, watch } from 'vue'
import { AddOutline, TrashOutline, PencilOutline } from '@vicons/ionicons5'
import { NSpace } from 'naive-ui'
import UiBtn from '@/components/UiBtn.vue'
import { statusDict } from '@/dict/common'
import PostForm from './component/PostForm.vue'
import { getPostList, delPost } from '@/api/post'
import useDeleteConfirm from '@/hooks/useDeleteConfirm'
import DictTag from '@/components/DictTag.vue'
defineOptions({
  name: 'PostView'
})
const deleteConfirm = useDeleteConfirm(delPost)
const page = reactive({
  list: [],
  loading: false,
  queryParams: {},
  total: 0,
  pageSize: 10,
  pageNum: 1
})

const searchItems = [
  { type: 'input', label: '岗位名称', field: 'name' },
  { type: 'input', label: '岗位编码', field: 'code' },
  { type: 'select', label: '岗位状态', field: 'status', options: statusDict }
]
const actionBtn = [
  { text: '编辑', action: 'edit', icon: h(PencilOutline), permission: 'system:post:edit' },
  { text: '删除', action: 'del', icon: h(TrashOutline), permission: 'system:post:delete' }
]
const columns = [
  { key: 'name', title: '岗位名称' },
  { key: 'code', title: '岗位编码' },
  {
    key: 'status',
    title: '岗位状态',
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
  modelRef.value.Open(params, '新增岗位')
}
const loadData = () => {
  if (page.loading) {
    return
  }
  page.loading = true
  getPostList({ ...page.queryParams, pageNum: page.pageNum, pageSize: page.pageSize })
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
    modelRef.value.Open({ id: row.id }, '编辑岗位')
  }
}
</script>
