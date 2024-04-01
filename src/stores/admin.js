import { defineStore } from 'pinia'

import { getAdminInfo, adminLogout } from '@/api/admin'

export const useAdminStore = defineStore('admin', {
  state: () => {
    return {
      token: sessionStorage.getItem('token') || '',
      admin: null,
      logoutModal: {
        show: false,
        cancelText: '',
        content: ''
      }
    }
  },
  getters: {
    adminMenu() {
      return this.admin?.menu || []
    },
    adminInfo() {
      return this.admin?.adminInfo || {}
    },
    _permission() {
      return this.adminMenu.map((item) => item.perms)
    },
    hasPermission() {
      return (permission) => this._permission.includes(permission)
    }
  },
  actions: {
    setToken(token) {
      sessionStorage.setItem('token', token)
      this.token = token
    },
    getAdminInfo() {
      return new Promise((resolve, reject) => {
        getAdminInfo()
          .then((res) => {
            if (res.code === 2000 && res.data) {
              this.admin = res.data
              resolve()
              return
            }
            reject()
          })
          .catch(() => {
            reject()
          })
      })
    },
    logout(options = {}) {
      this.logoutModal = Object.assign(
        {
          show: true,
          cancelText: '',
          content: ''
        },
        options
      )
    },
    async confirmLogout() {
      sessionStorage.removeItem('token')
      this.token = ''
      this.admin = null
      await adminLogout()
    }
  }
})
