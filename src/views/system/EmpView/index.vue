<template>
  <ui-page
    @refresh="loadData"
    :total="page.total"
    v-model:pageNum="page.pageNum"
    v-model:pageSize="page.pageSize"
  >
    <template #left>
      <search-dept :list="depts" @select="handleDeptSelect"></search-dept>
    </template>
    <template #header>
      <search-form @search="handleSearch" :items="searchItems"></search-form>
    </template>
    <template #action>
      <ui-btn :iconSize="16" permission="system:emp:add" type="primary" @click="() => handleAdd()"
        ><template #icon><AddOutline /></template>新增</ui-btn
      >
    </template>
    <ui-table :columns="columns" :data="page.list"></ui-table>
    <form-modal @confirm="loadData" :width="760" ref="modelRef">
      <emp-form></emp-form>
    </form-modal>
  </ui-page>
</template>
<script setup>
import { ref, reactive, h, watch } from 'vue'
import { AddOutline, TrashOutline, PencilOutline } from '@vicons/ionicons5'
import { NSpace } from 'naive-ui'
import UiBtn from '@/components/UiBtn.vue'
import { statusDict } from '@/dict/common'
import EmpForm from './component/EmpForm.vue'
import { getEmpList, delEmp } from '@/api/emp'
import { getDeptList } from '@/api/dept'
import useDeleteConfirm from '@/hooks/useDeleteConfirm'
import SearchDept from './component/SearchDept.vue'
import { deepFind } from '@/utils/utils'
import DictTag from '@/components/DictTag.vue'
defineOptions({
  name: 'EmpView'
})
const deleteConfirm = useDeleteConfirm(delEmp)
const depts = ref([])
const getTreeDept = (list, parentIds = '0') => {
  return list.map((item) => {
    let parentPath = parentIds.split('-')
    parentPath.push(item.id)
    parentPath = parentPath.join('-')
    let dept = { key: item.id, label: item.name, path: parentPath }
    if (item?.children?.length > 0) {
      dept.children = getTreeDept(item.children, parentPath)
    }
    return dept
  })
}
getDeptList().then((res) => {
  let deptOptions = res?.data?.list || []
  depts.value = getTreeDept(deptOptions)
})
const page = reactive({
  list: [],
  loading: false,
  queryParams: { deptId: '' },
  total: 0,
  pageSize: 10,
  pageNum: 1
})

const searchItems = [
  { type: 'input', label: '关键字', field: 'keyword', placeholder: '账号或昵称' },
  { type: 'input', label: '手机号', field: 'phone' },
  { type: 'select', label: '员工状态', field: 'status', options: statusDict }
]
const actionBtn = [
  { text: '编辑', action: 'edit', icon: h(PencilOutline), permission: 'system:emp:edit' },
  { text: '删除', action: 'del', icon: h(TrashOutline), permission: 'system:emp:delete' }
]
const columns = [
  { key: 'account', title: '账号' },
  { key: 'nickName', title: '昵称' },
  {
    key: 'deptId',
    title: '部门',
    render(row) {
      let item = deepFind(depts.value, 'key', row.deptId)
      return item?.label
    }
  },
  {
    key: 'postId',
    title: '岗位',
    render(row) {
      return row?.post?.name
    }
  },
  {
    key: 'roleId',
    title: '角色',
    render(row) {
      return row?.role?.name
    }
  },
  {
    key: 'status',
    title: '员工状态',
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
  modelRef.value.Open(params, '新增员工')
}
const loadData = () => {
  if (page.loading) {
    return
  }
  page.loading = true
  getEmpList({ ...page.queryParams, pageNum: page.pageNum, pageSize: page.pageSize })
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
    modelRef.value.Open({ id: row.id }, '编辑员工')
  }
}
const handleDeptSelect = (deptId) => {
  page.queryParams.deptId = deptId
  page.pageNum = 1
  loadData()
}
</script>
