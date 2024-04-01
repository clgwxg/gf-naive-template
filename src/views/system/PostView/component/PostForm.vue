<template>
  <ui-form ref="formRef" :items="formItems"></ui-form>
</template>
<script setup>
import { ref } from 'vue'
import useToast from '@/hooks/useToast'
import { statusDict } from '@/dict/common'
import { getPost, addPost, updatePost } from '@/api/post'
const toast=useToast()
const defaultValue = { status: 1}
const formItems = [
  {
    type: 'input',
    label: '岗位名称',
    field: 'name',
    span: 24,
    rule: { required: true, message: '请输入岗位名称', trigger: ['blur'] }
  },
  {
    type: 'input',
    label: '岗位编码',
    field: 'code',
    span: 24,
    rule: { required: true, message: '请输入岗位编码', trigger: ['blur'] }
  },
  { type: 'radioGroup', label: '岗位状态', field: 'status', options: statusDict, span: 24 },
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
    if (params.id) {
      getPost(params.id).then((res) => {
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
        updatePost(values).then(res=>{
          if(res?.code==2000){
              toast.success(res?.msg || '修改成功')
              resolve(true)
            }else{
              toast.error(res?.msg || '修改失败')
              resolve(false)
            }
        }).catch(()=>resolve())
        } else {
          addPost(values).then(res=>{
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
