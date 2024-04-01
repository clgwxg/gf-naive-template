import 'normalize.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
//全局组件
import GlobalComponent from './components/global'
import App from './App.vue'
import router from './router'
const app = createApp(App)
app.use(GlobalComponent)
app.use(createPinia())
app.use(router)
app.mount('#app')
