<template>
  <ui-form ref="formRef" :items="formItems">
    <template #item="{ item, model }">
      <n-tree-select
        v-if="item.field == 'parentId'"
        v-model:value="model[item.field]"
        :options="menus"
      ></n-tree-select>
      <select-icon v-model="model[item.field]" v-if="item.field == 'icon'"></select-icon>
    </template>
  </ui-form>
</template>
<script setup>
import { ref } from 'vue'
import useToast from '@/hooks/useToast'
import { typeDict, cacheDict, visibleDict } from '@/dict/menu'
import { yesOrNoDict, statusDict } from '@/dict/common'
import { getMenuList, getMenu, addMenu, updateMenu } from '@/api/menu'
import SelectIcon from './SelectIcon.vue'
const toast = useToast()
const defaultValue = { type: 1, isFrame: 0, isVisible: 1, status: 1, parentId: 0, isCache: 0 }
const formItems = [
  {
    type: 'slot',
    label: '上级菜单',
    field: 'parentId',
    options: [{ key: '0', label: '根目录' }],
    span: 24
  },
  { type: 'radioGroup', label: '菜单类型', field: 'type', options: typeDict, span: 24 },
  {
    type: 'slot',
    label: '菜单图标',
    field: 'icon',
    span: 24,
    isRender(model) {
      return model.value.type == 2 || model.value.type == 1
    }
  },
  {
    type: 'input',
    label: '菜单名称',
    field: 'name',
    span: 12,
    rule: { required: true, message: '请输入菜单名称', trigger: ['blur'] }
  },
  {
    type: 'radioGroup',
    label: '是否外链',
    field: 'isFrame',
    options: yesOrNoDict,
    span: 12,
    isRender(model) {
      return model.value.type == 2
    }
  },
  {
    type: 'input',
    label: '路由地址',
    field: 'url',
    span: 12,
    rule: { required: true, message: '请输入菜单名称', trigger: ['blur'] },
    isRender(model) {
      return model.value.type == 2
    }
  },
  {
    type: 'input',
    label: '组件路径',
    field: 'path',
    span: 12,
    isRender(model) {
      return model.value.type == 2
    }
  },
  { type: 'input', label: '权限标识', field: 'perms', span: 12 },
  {
    type: 'input',
    label: '路由参数',
    field: 'query',
    span: 12,
    isRender(model) {
      return model.value.type == 2
    }
  },
  {
    type: 'radioGroup',
    label: '是否缓存',
    field: 'isCache',
    options: cacheDict,
    span: 12,
    isRender(model) {
      return model.value.type == 2
    }
  },
  {
    type: 'radioGroup',
    label: '显示状态',
    field: 'isVisible',
    options: visibleDict,
    span: 12,
    isRender(model) {
      return model.value.type == 2 || model.value.type == 1
    }
  },
  { type: 'radioGroup', label: '菜单状态', field: 'status', options: statusDict, span: 12 }
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
const loadMenu = () => {
  getMenuList().then((res) => {
    let menuOptions = res?.data?.list || []
    menus.value = [{ key: 0, label: '根目录', children: getTreeMenu(menuOptions) }]
  })
}
defineExpose({
  async init(params) {
    loadMenu()
    if (params.parentId) {
      formRef.value?.setValue({ ...defaultValue, parentId: params.parentId })
    } else if (params.id) {
      getMenu(params.id).then((res) => {
        let menu = res?.data || {}
        formRef.value?.setValue({ ...defaultValue, ...menu })
      })
    } else {
      formRef.value?.setValue({ ...defaultValue })
    }
  },
  submit() {
    return new Promise((resolve) => {
      formRef.value?.submit().then((values) => {
        if (values.id) {
          updateMenu(values)
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
          addMenu(values)
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
