<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const handleRegister = async () => {
  if (!username.value || !email.value || !password.value) {
    errorMessage.value = '请填写所有必填字段'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = '两次输入的密码不一致'
    return
  }

  if (password.value.length < 6) {
    errorMessage.value = '密码长度至少为6位'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    // 使用用户存储的注册方法
    await userStore.register(username.value, email.value, password.value)
    router.push('/')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '注册失败，请稍后重试'
  } finally {
    isLoading.value = false
  }
}

const goToLogin = () => {
  router.push('/login')
}

const goToHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="register-view">
    <div class="container">
      <div class="register-card">
        <div class="register-header">
          <button @click="goToHome" class="back-button">← 返回首页</button>
          <h1 class="register-title">加入诗海寻梦</h1>
          <p class="register-subtitle">开启您的诗词收藏之旅</p>
        </div>

        <form @submit.prevent="handleRegister" class="register-form">
          <div class="form-group">
            <label for="username" class="form-label">用户名 *</label>
            <input
              id="username"
              v-model="username"
              type="text"
              class="form-input"
              placeholder="请输入用户名"
              required
            />
          </div>

          <div class="form-group">
            <label for="email" class="form-label">邮箱 *</label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="form-input"
              placeholder="请输入邮箱地址"
              required
            />
          </div>

          <div class="form-group">
            <label for="password" class="form-label">密码 *</label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="form-input"
              placeholder="请输入密码（至少6位）"
              required
            />
          </div>

          <div class="form-group">
            <label for="confirmPassword" class="form-label">确认密码 *</label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              class="form-input"
              placeholder="请再次输入密码"
              required
            />
          </div>

          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <button type="submit" class="register-button" :disabled="isLoading">
            {{ isLoading ? '注册中...' : '注册' }}
          </button>
        </form>

        <div class="register-footer">
          <p class="login-text">
            已有账号？
            <button @click="goToLogin" class="login-link">立即登录</button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.container {
  width: 100%;
  max-width: 400px;
}

.register-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.register-header {
  text-align: center;
  margin-bottom: 32px;
}

.back-button {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 16px;
}

.back-button:hover {
  text-decoration: underline;
}

.register-title {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 8px;
  font-family: 'SimSun', serif;
}

.register-subtitle {
  color: #666;
  font-size: 1rem;
}

.register-form {
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  color: #495057;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
}

.error-message {
  background: #ffe6e6;
  color: #d63031;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 16px;
  font-size: 14px;
}

.register-button {
  width: 100%;
  background: #764ba2;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.register-button:hover:not(:disabled) {
  background: #6a4190;
}

.register-button:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.register-footer {
  text-align: center;
}

.login-text {
  color: #666;
  font-size: 14px;
}

.login-link {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  text-decoration: underline;
}

.login-link:hover {
  color: #5a6fd8;
}

@media (max-width: 480px) {
  .register-card {
    padding: 24px;
  }

  .register-title {
    font-size: 1.5rem;
  }
}
</style>
