<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const searchQuery = ref('')
const isMenuOpen = ref(false)

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      name: 'search',
      query: { q: searchQuery.value }
    })
    searchQuery.value = ''
  }
}



const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
  <header class="app-header">
    <div class="container">
      <div class="header-content">
        <!-- Logo区域 -->
        <div class="logo-section">
          <router-link to="/" class="logo-link">
            <div class="logo">
              <span class="logo-icon">📚</span>
              <span class="logo-text">诗海寻梦</span>
            </div>
          </router-link>
        </div>

        <!-- 搜索区域 -->
        <div class="search-section">
          <div class="search-container">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索诗词、诗人或主题..."
              class="search-input"
              @keyup.enter="handleSearch"
            />
            <button @click="handleSearch" class="search-button">
              <span class="search-icon">🔍</span>
            </button>
          </div>
        </div>

        <!-- 导航菜单 -->
        <nav class="nav-section">
          <router-link to="/" class="nav-link">首页</router-link>
          <router-link to="/search" class="nav-link">探索</router-link>
          <router-link v-if="userStore.isLoggedIn" to="/profile" class="nav-link">个人中心</router-link>
          <button v-else @click="userStore.login('游客')" class="login-btn">
            登录
          </button>
        </nav>

        <!-- 移动端菜单按钮 -->
        <button class="mobile-menu-btn" @click="toggleMenu">
          <span class="menu-icon">☰</span>
        </button>
      </div>

      <!-- 移动端菜单 -->
      <div v-if="isMenuOpen" class="mobile-menu">
        <router-link to="/" class="mobile-nav-link" @click="toggleMenu">首页</router-link>
        <router-link to="/search" class="mobile-nav-link" @click="toggleMenu">探索</router-link>
        <router-link v-if="userStore.isLoggedIn" to="/profile" class="mobile-nav-link" @click="toggleMenu">个人中心</router-link>
        <button v-else @click="userStore.login('游客'); toggleMenu()" class="mobile-login-btn">
          登录
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e9ecef;
  z-index: 1000;
  height: 80px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* Logo样式 */
.logo-section {
  flex-shrink: 0;
}

.logo-link {
  text-decoration: none;
  color: inherit;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
}

.logo-icon {
  font-size: 2rem;
}

.logo-text {
  font-family: 'SimSun', serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 搜索区域 */
.search-section {
  flex: 1;
  max-width: 400px;
  display: flex;
  justify-content: center;
}

.search-container {
  display: flex;
  background: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e9ecef;
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  border: none;
  background: transparent;
  font-size: 14px;
  outline: none;
}

.search-input::placeholder {
  color: #6c757d;
}

.search-button {
  padding: 12px 16px;
  background: #667eea;
  border: none;
  color: white;
  cursor: pointer;
  transition: background 0.2s;
}

.search-button:hover {
  background: #5a6fd8;
}

/* 导航菜单 */
.nav-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-link {
  text-decoration: none;
  color: #495057;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s;
}

.nav-link:hover {
  color: #667eea;
  background: #f8f9fa;
}

.nav-link.router-link-active {
  color: #667eea;
  background: #f0f2ff;
}

.login-btn {
  padding: 8px 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.login-btn:hover {
  background: #5a6fd8;
}

/* 移动端菜单按钮 */
.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 8px;
}

.mobile-menu {
  display: none;
  flex-direction: column;
  background: white;
  border-top: 1px solid #e9ecef;
  padding: 20px 0;
}

.mobile-nav-link {
  padding: 12px 20px;
  text-decoration: none;
  color: #495057;
  border-bottom: 1px solid #f8f9fa;
  transition: background 0.2s;
}

.mobile-nav-link:hover {
  background: #f8f9fa;
}

.mobile-login-btn {
  padding: 12px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  margin: 10px 20px;
  cursor: pointer;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    gap: 10px;
  }
  
  .search-section {
    max-width: 200px;
  }
  
  .nav-section {
    display: none;
  }
  
  .mobile-menu-btn {
    display: block;
  }
  
  .mobile-menu {
    display: flex;
  }
}

@media (max-width: 480px) {
  .search-section {
    display: none;
  }
  
  .logo-text {
    font-size: 1.2rem;
  }
}
</style>