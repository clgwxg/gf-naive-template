import { createRouter, createWebHistory } from 'vue-router'
import { useAdminStore } from '@/stores/admin'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/admin',
      component: () => import('@/layout/layout.vue'),
      children: [
        {
          path: 'home',
          name: 'Home',
          component: () => import('@/views/HomeView/index.vue')
        }
      ]
    },
    { path: '/:pathMatch(.*)', component: () => import('@/views/NotFound.vue') }
  ]
})
let initRoute = null
let isInit = false
export const createRoute = async (adminStore) => {
  if (adminStore.token == '') {
    return
  }
  await adminStore.getAdminInfo().catch(() => {})
  const pages = import.meta.glob('../views/**/**/index.vue')
  const children = adminStore?.adminMenu
    ?.filter((item) => item.type == 2)
    .map((item) => {
      return {
        path: item.url,
        component: pages[`../views${item.path}.vue`]
      }
    })
  if (children.length) {
    let route = {
      path: '/',
      component: () => import('../layout/layout.vue'),
      children: children
    }
    initRoute = router.addRoute(route)
  }
  isInit = true
}
router.beforeEach(async (to) => {
  const adminStore = useAdminStore()
  // 没有登录，跳转登录页
  if (adminStore.token == '') {
    resetRoute()
    if (to.name != 'Login') {
      return { name: 'Login' }
    } else {
      return true
    }
  }
  // 没有初始化路由
  if (!isInit) {
    await createRoute(adminStore)
    return to
  }
  return true
})
//重置路由
export const resetRoute = () => {
  isInit = false
  initRoute && initRoute()
  initRoute = null
}

export default router
