<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Suspense } from 'vue'
import AppHeader from '@/components/common/AppHeader.vue'
import AppFooter from '@/components/common/AppFooter.vue'
import { useThemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'
import { onMounted } from 'vue'

const themeStore = useThemeStore()
const userStore = useUserStore()

onMounted(() => {
  themeStore.initTheme()
  userStore.initUser()
})
</script>

<template>
  <div class="app">
    <div class="top-progress" aria-hidden="true"></div>
    <AppHeader />
    <main class="main-content">
      <Suspense>
        <template #default>
          <RouterView />
        </template>
        <template #fallback>
          <div class="route-loading">
            <div class="spinner" />
            <div>页面加载中...</div>
          </div>
        </template>
      </Suspense>
    </main>
    <AppFooter />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  line-height: 1.6;
  color: #2c3e50;
  background-color: #ffffff;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: 80px; /* 为固定头部留出空间 */
  min-height: calc(100vh - 80px);
  width: 100%;
}

/* 全局样式 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  gap: 8px;
}

.btn-primary {
  background: #8b5a2b;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: #7a4a1f;
  transform: translateY(-2px);
}

.btn-secondary {
  background: white;
  color: #8b5a2b;
  padding: 1rem 2rem;
  border: 2px solid #8b5a2b;
  border-radius: 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: #8b5a2b;
  color: white;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }

  .btn {
    padding: 10px 20px;
    font-size: 16px;
  }
}

/* 动画效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 深色主题样式 */
.dark-theme {
  --bg-primary: #1a1a1a;
  --bg-secondary: #2d2d2d;
  --bg-card: #333333;
  --text-primary: #ffffff;
  --text-secondary: #b0b0b0;
  --text-muted: #888888;
  --border-color: #444444;
  --accent-color: #667eea;
  --accent-hover: #5a6fd8;
}

.dark-theme body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

.dark-theme .card {
  background: var(--bg-card);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.dark-theme .btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.dark-theme .btn-secondary:hover {
  background: var(--border-color);
}

/* 深色主题下的滚动条 */
.dark-theme ::-webkit-scrollbar-track {
  background: #2d2d2d;
}

.dark-theme ::-webkit-scrollbar-thumb {
  background: #555555;
}

.dark-theme ::-webkit-scrollbar-thumb:hover {
  background: #666666;
}
.route-loading {
  min-height: 40vh;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  justify-content: center;
  color: #666;
}

.route-loading .spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #eee;
  border-top-color: #8b5a2b;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
/* 顶部进度条（无需依赖） */
.top-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  width: 0%;
  background: #8b5a2b;
  z-index: 9999;
  opacity: 0;
  transition: opacity 0.2s ease;
}

body.route-loading-active .top-progress {
  opacity: 1;
  animation: topbar 1.2s ease-in-out infinite;
}

@keyframes topbar {
  0% {
    width: 0%;
    transform: translateX(0);
  }
  50% {
    width: 60%;
    transform: translateX(40%);
  }
  100% {
    width: 0%;
    transform: translateX(100%);
  }
}
</style>
