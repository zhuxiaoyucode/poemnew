<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { usePoetryStore } from '@/stores/poetry'
import { useThemeStore } from '@/stores/theme'
import type { UserActivity } from '@/types/user'

const userStore = useUserStore()
const poetryStore = usePoetryStore()
const themeStore = useThemeStore()

const activeTab = ref('history')
const readingHistory = ref<UserActivity[]>([])
const favoritePoems = ref<string[]>([])

const userStats = computed(() => ({
  poemsRead: userStore.userActivities.filter((a) => a.activityType === 'view').length,
  poemsLiked: userStore.userActivities.filter((a) => a.activityType === 'like').length,
  poemsShared: userStore.userActivities.filter((a) => a.activityType === 'share').length,
}))

onMounted(() => {
  loadUserData()
  themeStore.initTheme()
})

const handleThemeChange = () => {
  themeStore.setTheme(themeStore.currentTheme)
}

const loadUserData = () => {
  if (userStore.isLoggedIn) {
    // 重新获取阅读历史数据
    userStore.getReadingHistory().then((history) => {
      readingHistory.value = history as any[]
    })
    userStore.getFavoritePoems().then((favorites) => {
      favoritePoems.value = favorites as string[]
    })
  } else {
    readingHistory.value = []
    favoritePoems.value = []
  }
}

// 监听登录状态变化
watch(
  () => userStore.isLoggedIn,
  (isLoggedIn) => {
    if (isLoggedIn) {
      loadUserData()
    }
  },
)

const getPoemById = (poemId: string) => {
  const poem = poetryStore.poems.find((p) => p.id === poemId)
  if (poem) {
    // 关联诗人信息
    const poet = poetryStore.poets.find((p) => p.id === poem.poetId)
    return {
      ...poem,
      poet: poet || null,
    }
  }
  return null
}

const clearHistory = () => {
  if (userStore.isLoggedIn) {
    userStore.userActivities = userStore.userActivities.filter((a) => a.activityType !== 'view')
    readingHistory.value = []
  }
}

const logout = () => {
  userStore.logout()
  // 实际项目中应该跳转到首页
}
</script>

<template>
  <div class="profile-view">
    <div class="container">
      <!-- 用户信息卡片 -->
      <section class="user-card">
        <div class="user-avatar">
          {{ userStore.currentUser?.username?.charAt(0) || 'U' }}
        </div>
        <div class="user-info">
          <h1 class="username">{{ userStore.currentUser?.username || '游客' }}</h1>
          <p class="user-email" v-if="userStore.currentUser?.email">
            {{ userStore.currentUser.email }}
          </p>
          <p class="member-since">
            加入时间: {{ userStore.currentUser?.createdAt?.toLocaleDateString() || '刚刚' }}
          </p>
        </div>
        <div class="user-stats">
          <div class="stat-item">
            <span class="stat-number">{{ userStats.poemsRead }}</span>
            <span class="stat-label">已读诗作</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ userStats.poemsLiked }}</span>
            <span class="stat-label">喜欢</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ userStats.poemsShared }}</span>
            <span class="stat-label">分享</span>
          </div>
        </div>
      </section>

      <!-- 标签导航 -->
      <nav class="profile-tabs">
        <button
          :class="['tab-button', { active: activeTab === 'history' }]"
          @click="activeTab = 'history'"
        >
          阅读历史
        </button>
        <button
          :class="['tab-button', { active: activeTab === 'favorites' }]"
          @click="activeTab = 'favorites'"
        >
          我的收藏
        </button>
        <button
          :class="['tab-button', { active: activeTab === 'settings' }]"
          @click="activeTab = 'settings'"
        >
          偏好设置
        </button>
      </nav>

      <!-- 阅读历史 -->
      <section v-if="activeTab === 'history'" class="tab-content">
        <div class="section-header">
          <h2>阅读历史</h2>
          <button @click="clearHistory" class="clear-btn">清空历史</button>
        </div>

        <div v-if="readingHistory.length > 0" class="history-list">
          <div v-for="activity in readingHistory" :key="activity.id" class="history-item">
            <div class="poem-info">
              <h4>{{ getPoemById(activity.poemId)?.title || '未知诗作' }}</h4>
              <p>{{ getPoemById(activity.poemId)?.poet?.name || '未知诗人' }}</p>
            </div>
            <div class="activity-time">
              {{ activity.createdAt?.toLocaleString() || '未知时间' }}
            </div>
          </div>
        </div>
        <div v-else class="empty-state">
          <p>暂无阅读历史</p>
        </div>
      </section>

      <!-- 我的收藏 -->
      <section v-if="activeTab === 'favorites'" class="tab-content">
        <h2>我的收藏</h2>

        <div v-if="favoritePoems.length > 0" class="favorites-grid">
          <div v-for="poemId in favoritePoems" :key="poemId" class="favorite-item">
            <div class="poem-info">
              <h4>{{ getPoemById(poemId)?.title || '未知诗作' }}</h4>
              <p>{{ getPoemById(poemId)?.poet?.name || '未知诗人' }}</p>
              <p class="poem-excerpt">
                {{ getPoemById(poemId)?.content?.substring(0, 50) || '' }}...
              </p>
            </div>
          </div>
        </div>
        <div v-else class="empty-state">
          <p>暂无收藏诗作</p>
        </div>
      </section>

      <!-- 偏好设置 -->
      <section v-if="activeTab === 'settings'" class="tab-content">
        <h2>偏好设置</h2>

        <div class="settings-form">
          <div class="setting-group">
            <label>阅读难度</label>
            <select v-model="userStore.userPreferences.readingLevel">
              <option value="beginner">初级</option>
              <option value="intermediate">中级</option>
              <option value="advanced">高级</option>
            </select>
          </div>

          <div class="setting-group">
            <label>主题模式</label>
            <select v-model="themeStore.currentTheme" @change="handleThemeChange">
              <option value="light">浅色</option>
              <option value="dark">深色</option>
              <option value="auto">自动</option>
            </select>
          </div>

          <div class="setting-group">
            <label>语言</label>
            <select v-model="userStore.userPreferences.language">
              <option value="zh">中文</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        <div class="logout-section">
          <button @click="logout" class="logout-btn">退出登录</button>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.profile-view {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 2rem 0;
}

.container {
  width: 100%;
  max-width: none;
  margin: 0 auto;
  padding: 0 2rem;
}

/* 用户信息卡片 */
.user-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 30px;
}

.user-avatar {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
}

.username {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 8px;
}

.user-email,
.member-since {
  color: #666;
  margin-bottom: 4px;
}

.user-stats {
  display: flex;
  gap: 30px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #667eea;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

/* 标签导航 */
.profile-tabs {
  display: flex;
  background: white;
  border-radius: 8px;
  padding: 8px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.tab-button {
  flex: 1;
  padding: 12px 16px;
  border: none;
  background: transparent;
  color: #666;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
}

.tab-button.active {
  background: #667eea;
  color: white;
}

.tab-button:hover:not(.active) {
  background: #f8f9fa;
}

/* 标签内容 */
.tab-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  color: #2c3e50;
  margin: 0;
}

.clear-btn {
  padding: 6px 12px;
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

/* 历史列表 */
.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  transition: all 0.2s;
}

.history-item:hover {
  border-color: #667eea;
  background: #f8f9fa;
}

.poem-info h4 {
  color: #2c3e50;
  margin-bottom: 4px;
}

.poem-info p {
  color: #666;
  font-size: 0.9rem;
}

.activity-time {
  color: #888;
  font-size: 0.8rem;
}

/* 收藏网格 */
.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.favorite-item {
  padding: 16px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  transition: all 0.2s;
}

.favorite-item:hover {
  border-color: #667eea;
}

.poem-excerpt {
  color: #666;
  font-size: 0.9rem;
  margin-top: 8px;
}

/* 设置表单 */
.settings-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 400px;
}

.setting-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-group label {
  font-weight: 600;
  color: #2c3e50;
}

.setting-group select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

/* 退出登录 */
.logout-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.logout-btn {
  padding: 10px 20px;
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
}

.logout-btn:hover {
  background: #ff5252;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
}

@media (max-width: 768px) {
  .user-card {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }

  .user-stats {
    gap: 20px;
  }

  .profile-tabs {
    flex-direction: column;
  }

  .favorites-grid {
    grid-template-columns: 1fr;
  }
}

/* 深色主题样式 */
.dark-theme .profile-view {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
}

.dark-theme .user-card,
.dark-theme .tab-content,
.dark-theme .profile-tabs {
  background: var(--bg-card);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.dark-theme .username {
  color: var(--text-primary);
}

.dark-theme .user-email,
.dark-theme .member-since,
.dark-theme .stat-label {
  color: var(--text-secondary);
}

.dark-theme .history-item,
.dark-theme .favorite-item {
  background: var(--bg-secondary);
  border-color: var(--border-color);
  color: var(--text-primary);
}

.dark-theme .history-item:hover,
.dark-theme .favorite-item:hover {
  background: var(--border-color);
}

.dark-theme .tab-button {
  color: var(--text-secondary);
}

.dark-theme .tab-button.active {
  background: var(--accent-color);
  color: white;
}

.dark-theme .tab-button:hover:not(.active) {
  background: var(--bg-secondary);
}

.dark-theme .setting-group label {
  color: var(--text-primary);
}

.dark-theme .setting-group select {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-color: var(--border-color);
}

.dark-theme .logout-section {
  border-top-color: var(--border-color);
}
</style>
