<template>
  <ui-form ref="formRef" :items="formItems">
     <template #item="{ item, model }">
      <menu-tree :tree-data='menus' v-model="model[item.field]" v-if="item.field == 'menuIds'"></menu-tree>
    </template>
  </ui-form>
</template>
<script setup>
import { ref } from 'vue'
import useToast from '@/hooks/useToast'
import { statusDict } from '@/dict/common'
import { getRole, addRole, updateRole } from '@/api/role'
import { getMenuList } from '@/api/menu'
import MenuTree from "./MenuTree.vue"
const toast=useToast()
const defaultValue = { status: 1}
const formItems = [
  {
    type: 'input',
    label: '角色名称',
    field: 'name',
    span: 24,
    rule: { required: true, message: '请输入角色名称', trigger: ['blur'] }
  },
  { type: 'radioGroup', label: '角色状态', field: 'status', options: statusDict, span: 24 },
  {type:"slot",label:"菜单权限",field:"menuIds",span:24,rule: { required: true, validator(_rule,value){
     if(value?.length==0 || !value){
      return new Error("请选择菜单")
     }
     return true
  } }},
  {
    type: 'textarea',
    label: '备注',
    field: 'remark',
    span: 24
  },
]
const formRef = ref()
const menus = ref([])
const getTreeMenu = (list) => {
  return list.map((item) => {
    let menu = { key: item.id, label: item.name }
    if (item?.children?.length > 0) {
      menu.children = getTreeMenu(item.children)
    }
    return menu
  })
}
const loadMenu = async () => {
  let res=await  getMenuList()
  let menuOptions = res?.data?.list || []
  menus.value = getTreeMenu(menuOptions)
}
const findParent=(id,list,parent)=>{
  for(let i=0;i<list.length;i++){
    let item=list[i]
    if(item.key==id){
       parent.push(id)
       return parent
    }
    if(item.children){
       findParent(id,item.children,parent)
       if(parent.length>0){
        parent.push(item.key)
       }
    }
  }
}
const findAllParent=(list)=>{
  let arr=[]
  list.forEach(id => {
    findParent(id,menus.value,arr)
  })
  return Array.from(new Set(arr))
}
const isLastLevel=(id,list)=>{
  let isLast=false
  list.forEach(item=>{
    if(item.key==id&&!item.children){
      isLast=true
    }
    if(item.children){
      isLast=isLastLevel(id,item.children)
    }
  })
  return isLast
}
const getLastLevelMenu=(menuIds=[])=>{
  return menuIds?.filter(id=>{
    return isLastLevel(id,menus.value)
  })
}
defineExpose({
  async init(params) {
    await loadMenu()
    if (params.id) {
      getRole(params.id).then((res) => {
        let menu = res?.data || {}
        let menuIds=getLastLevelMenu(menu.menuIds)
        formRef.value?.setValue({ ...defaultValue, ...menu ,menuIds:menuIds})
      })
    } else {
      formRef.value?.setValue({ ...defaultValue })
    }
  },
  submit() {
    return new Promise((resolve) => {
      formRef.value?.submit().then(values=>{
        let menuIds=findAllParent(values.menuIds || [])
        const formData={...values,menuIds:menuIds.join(",")}
        if (formData.id) {
        updateRole(formData).then(res=>{
          if(res?.code==2000){
              toast.success(res?.msg || '修改成功')
              resolve(true)
            }else{
              toast.error(res?.msg || '修改失败')
              resolve(false)
            }
        }).catch(()=>resolve())
        } else {
          addRole(formData).then(res=>{
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
