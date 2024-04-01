import axios from 'axios'
import { useAdminStore } from '@/stores/admin'
import useToast from '@/hooks/useToast'
const toast = useToast()
const instance = axios.create({
  baseURL: import.meta.env.VITE_API,
  timeout: 5000
})

instance.interceptors.request.use((config) => {
  const adminStore = useAdminStore()
  if (adminStore.token) {
    config.headers.Authorization = adminStore.token
  }
  return config
})
instance.interceptors.response.use((res) => {
  const adminStore = useAdminStore()
  if (res.data?.code === 3000) {
    adminStore.logout({ content: '权限过期，请重新登录！' })
  } else if (res.data?.code === 3001) {
    toast.error(res.data?.msg)
  }
  return res.data
})
const ajax = {
  get(url, data = {}) {
    return instance.get(url, { params: data })
  },
  post(url, data = {}) {
    return instance.post(url, data)
  },
  delete(url, data = {}) {
    return instance.delete(url, { params: data })
  },
  put(url, data = {}) {
    return instance.put(url, data)
  }
}
export default ajax
