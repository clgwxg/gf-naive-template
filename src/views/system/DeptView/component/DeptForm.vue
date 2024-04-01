<template>
  <ui-form ref="formRef" :items="formItems">
    <template #item="{ item, model }">
      <n-cascader
        v-if="item.field == 'parentId'"
        v-model:value="model[item.field]"
        :options="depts"
        clearable
        check-strategy='parent'
      ></n-cascader>
    </template>
  </ui-form>
</template>
<script setup>
import { ref } from 'vue'
import useToast from '@/hooks/useToast'
import {  statusDict } from '@/dict/common'
import { getDeptList, getDept, addDept, updateDept } from '@/api/dept'
const toast = useToast()
const defaultValue = { status: 1, parentId: 1}
const formItems = [
  {
    type: 'slot',
    label: '上级部门',
    field: 'parentId',
    options: [],
    span: 24
  },
  {
    type: 'input',
    label: '部门名称',
    field: 'name',
    span: 12,
    rule: { required: true, message: '请输入部门名称', trigger: ['blur'] }
  },
   {
    type: 'input',
    label: '负责人',
    field: 'leader',
    span: 12
  },
  {
    type: 'input',
    label: '手机号',
    field: 'phone',
    span: 12
  },
  {
    type: 'input',
    label: '邮箱',
    field: 'email',
    span: 12
  },
  { type: 'radioGroup', label: '部门状态', field: 'status', options: statusDict, span: 12 }
]
const formRef = ref()
const depts = ref([])
const getTreeDept = (list) => {
  return list.map((item) => {
    let dept = { value: item.id, label: item.name }
    if (item?.children?.length > 0) {
      dept.children = getTreeDept(item.children)
    }
    return dept
  })
}
const loadDept = () => {
  getDeptList().then((res) => {
    let deptOptions = res?.data?.list || []
    depts.value = getTreeDept(deptOptions)
  })
}
defineExpose({
  async init(params) {
    loadDept()
    if (params.parentId) {
      formRef.value?.setValue({ ...defaultValue, parentId: params.parentId })
    } else if (params.id) {
      getDept(params.id).then((res) => {
        let dept = res?.data || {}
        formRef.value?.setValue({ ...defaultValue, ...dept })
      })
    } else {
      formRef.value?.setValue({ ...defaultValue })
    }
  },
  submit() {
    return new Promise((resolve) => {
      formRef.value?.submit().then((values) => {
        if (values.id) {
          updateDept(values)
            .then((res) => {
              if (res?.code == 2000) {
                toast.success(res?.msg || '修改成功')
                resolve(true)
              } else {
                toast.error(res?.msg || '修改失败')
                resolve(false)
              }
            })
            .catch(() => resolve())
        } else {
          addDept(values)
            .then((res) => {
              if (res?.code == 2000) {
                toast.success(res?.msg || '新增成功')
                resolve(true)
              } else {
                toast.error(res?.msg || '新增失败')
                resolve(false)
              }
            })
            .catch(() => resolve())
        }
      }).catch(()=>resolve(false))
    })
  }
})
</script>
