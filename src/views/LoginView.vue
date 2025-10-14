<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const username = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  if (!username.value || !password.value) {
    errorMessage.value = '请输入用户名和密码'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    await userStore.login(username.value, password.value)
    router.push('/')
  } catch (error) {
    errorMessage.value = '登录失败，请检查用户名和密码'
  } finally {
    isLoading.value = false
  }
}

const goToRegister = () => {
  router.push('/register')
}

const goToHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="login-view">
    <div class="container">
      <div class="login-card">
        <div class="login-header">
          <button @click="goToHome" class="back-button">← 返回首页</button>
          <h1 class="login-title">登录诗海寻梦</h1>
          <p class="login-subtitle">继续您的诗词探索之旅</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="username" class="form-label">用户名</label>
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
            <label for="password" class="form-label">密码</label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="form-input"
              placeholder="请输入密码"
              required
            />
          </div>

          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <button type="submit" class="login-button" :disabled="isLoading">
            {{ isLoading ? '登录中...' : '登录' }}
          </button>
        </form>

        <div class="login-footer">
          <p class="register-text">
            还没有账号？
            <button @click="goToRegister" class="register-link">立即注册</button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.container {
  width: 100%;
  max-width: 400px;
}

.login-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.login-header {
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

.login-title {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 8px;
  font-family: 'SimSun', serif;
}

.login-subtitle {
  color: #666;
  font-size: 1rem;
}

.login-form {
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

.login-button {
  width: 100%;
  background: #667eea;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.login-button:hover:not(:disabled) {
  background: #5a6fd8;
}

.login-button:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.login-footer {
  text-align: center;
}

.register-text {
  color: #666;
  font-size: 14px;
}

.register-link {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  text-decoration: underline;
}

.register-link:hover {
  color: #5a6fd8;
}

@media (max-width: 480px) {
  .login-card {
    padding: 24px;
  }

  .login-title {
    font-size: 1.5rem;
  }
}
</style>
