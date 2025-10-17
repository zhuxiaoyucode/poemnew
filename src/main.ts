import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { checkTablesExist } from './utils/database'

// 导入全局样式
import './assets/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 检查数据库表是否存在（静默处理错误，不影响应用启动）
checkTablesExist()
  .then(({ usersExist, activitiesExist }) => {
    if (!usersExist || !activitiesExist) {
      console.warn('数据库表不存在，请运行SQL脚本创建表：')
      console.warn('1. 登录Supabase控制台')
      console.warn('2. 进入SQL编辑器')
      console.warn('3. 复制create_tables.sql文件内容并执行')
    }
  })
  .catch((error) => {
    console.warn('数据库检查失败，但应用将继续运行:', error.message)
  })

app.mount('#app')
