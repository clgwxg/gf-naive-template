<template>
  <ui-form ref="formRef" :items="formItems">
    <template #item="{ item, model }">
      <n-cascader
        v-if="item.field == 'deptId'"
        v-model:value="model[item.field]"
        :options="depts"
         clearable
        check-strategy='parent'
      ></n-cascader>
      <n-tree-select
        v-if="item.field == 'postId'"
        v-model:value="model[item.field]"
        :options="posts"
         clearable
      ></n-tree-select>
      <n-select v-if="item.field=='roleId'" :virtual-scroll='true'  v-model:value="model[item.field]" :options='roles'></n-select>
    </template>
  </ui-form>
</template>
<script setup>
import { ref } from 'vue'
import useToast from '@/hooks/useToast'
import { statusDict } from '@/dict/common'
import { getEmp, addEmp, updateEmp } from '@/api/emp'
import { getDeptList} from '@/api/dept'
import { getPostList} from '@/api/post'
import { getRoleList } from '@/api/role'
const toast=useToast()
const defaultValue = { status: 1}
const depts=ref([])
const posts =ref([])
const roles=ref([])
const getTree = (list,key='key') => {
  return list.map((item) => {
    let dept = { [key]: item.id, label: item.name }
    if (item?.children?.length > 0) {
      dept.children = getTree(item.children,key)
    }
    return dept
  })
}
const formItems = [
  {
    type: 'input',
    label: '账号',
    field: 'account',
    span: 12,
    rule: { required: true, message: '请输入账号', trigger: ['blur'] }
  },
  {
    type: 'input',
    label: '密码',
    field: 'password',
    span: 12,
    rule: { required: true, message: '请输入密码', trigger: ['blur'] },
    isRender(model) {
      return !model.value.id
    }
  },
  {
    type: 'input',
    label: '昵称',
    field: 'nickName',
    span: 12,
    rule: { required: true, message: '请输入昵称', trigger: ['blur'] }
  },
  {
    type: 'input',
    label: '手机号',
    field: 'phone',
    span: 12,
    rule: { required: true, message: '请输入手机号', trigger: ['blur'] }
  },
  {
    type: 'input',
    label: '邮箱',
    field: 'email',
    span: 12
  },
  {
    type: 'slot',
    label: '部门',
    field: 'deptId',
    span: 12,
    rule: { required: true,validator(rule,value){
       if(!value){
        return new Error('请选择部门')
       }
       return true
     }, trigger: ['blur'] }
  },
  {
    type: 'slot',
    label: '岗位',
    field: 'postId',
    span: 12
  },
  {
    type: 'slot',
    label: '角色',
    field: 'roleId',
    span: 12
  },
  { type: 'radioGroup', label: '员工状态', field: 'status', options: statusDict, span: 12 },
  {
    type: 'textarea',
    label: '备注',
    field: 'remark',
    span: 24
  },
]
const formRef = ref()
defineExpose({
  async init(params) {
    getDeptList().then(res=>{
       let deptOptions = res?.data?.list || []
       depts.value = getTree(deptOptions,'value')
    })
    getPostList().then(res=>{
      let postOptions = res?.data?.list || []
       posts.value = getTree(postOptions)
    })
    getRoleList({pageNum:0}).then(res=>{
      const list=res?.data?.list||[]
      roles.value=list.map(item=>{
        return {label:item.name,value:item.id}
      })
    })
    if (params.id) {
      getEmp(params.id).then((res) => {
        let values = res?.data || {}
        formRef.value?.setValue({ ...defaultValue, ...values})
      })
    } else {
      formRef.value?.setValue({ ...defaultValue })
    }
  },
  submit() {
    return new Promise((resolve) => {
      formRef.value?.submit().then(values=>{
        if (values.id) {
        updateEmp(values).then(res=>{
          if(res?.code==2000){
              toast.success(res?.msg || '修改成功')
              resolve(true)
            }else{
              toast.error(res?.msg || '修改失败')
              resolve(false)
            }
        }).catch(()=>resolve())
        } else {
          addEmp(values).then(res=>{
            if(res?.code==2000){
              toast.success(res?.msg || '新增成功')
              resolve(true)
            }else{
              toast.error(res?.msg || '新增失败')
                resolve(false)
            }
            
          }).catch(()=>resolve())
        }
      }).catch(()=>resolve(false))
    })
  }
})
</script>
