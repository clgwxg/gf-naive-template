<template>
  <div class="login">
    <div class="container">
      <h4 class="title">Gf-NAIVE管理系统</h4>
      <n-form ref="formRef" :model="form" :rules="rules" :show-label="false">
        <n-form-item path="account">
          <n-input clearable placeholder="帐号" v-model:value="form.account">
            <template #prefix>
              <n-icon><PersonOutline /></n-icon>
            </template>
          </n-input>
        </n-form-item>
        <n-form-item path="password">
          <n-input clearable type="password" placeholder="密码" v-model:value="form.password">
            <template #prefix>
              <n-icon><LockClosedOutline /></n-icon
            ></template>
          </n-input>
        </n-form-item>
        <n-form-item>
          <n-button @click="handleLogin" :loading="loading" block type="primary">登录</n-button>
        </n-form-item>
      </n-form>
    </div>
  </div>
</template>
<script setup>
import { LockClosedOutline, PersonOutline } from '@vicons/ionicons5'
import { reactive, ref } from 'vue'
import { login as loginApi } from '@/api/admin'
import { useAdminStore } from '@/stores/admin'
import useToast from '@/hooks/useToast'
import { useRouter } from 'vue-router'
// import { resetRoute } from '@/router'
const adminStore = useAdminStore()
const router = useRouter()
const toast = useToast()
const formRef = ref()
const loading = ref(false)
const form = reactive({
  account: '',
  password: ''
})
const rules = {
  account: {
    required: true,
    message: '请输入账号',
    trigger: 'blur'
  },
  password: {
    required: true,
    message: '请输入密码',
    trigger: 'blur'
  }
}
// resetRoute()
const handleLogin = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      loginApi(form).then((res) => {
        if (res.code === 2000 && res?.data?.token) {
          adminStore.setToken(res?.data?.token)
          router.replace({ name: 'Home' })
        } else {
          toast.error(res.msg || '系统错误，稍后重试')
        }
      })
    }
  })
}
</script>
<style lang="scss" scoped>
.login {
  background: url(@/assets/images/1353938.jpg) no-repeat center / cover;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .container {
    background: rgba(255, 255, 255, 0.7);
    border-radius: 6px;
    padding: 16px 16px 0;
    width: 300px;
    .title {
      margin: 0;
      text-align: center;
      margin-bottom: 16px;
    }
  }
}
</style>
