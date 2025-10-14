import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, UserPreferences, UserActivity } from '@/types/user'

export const useUserStore = defineStore('user', () => {
  // 状态
  const currentUser = ref<User | null>(null)
  const isLoggedIn = computed(() => currentUser.value !== null)
  const userActivities = ref<UserActivity[]>([])
  const userPreferences = ref<UserPreferences>({
    favoritePoets: [],
    favoriteTags: [],
    readingLevel: 'beginner',
    theme: 'auto',
    language: 'zh'
  })

  // Actions
  const login = async (username: string, _password?: string) => {
    // 模拟登录
    currentUser.value = {
      id: '1',
      username,
      preferences: userPreferences.value,
      createdAt: new Date(),
      lastLoginAt: new Date()
    }
    
    // 记录登录活动
    recordActivity('login', 'view')
  }

  const logout = () => {
    currentUser.value = null
  }

  const recordActivity = (poemId: string, activityType: UserActivity['activityType']) => {
    if (!currentUser.value) return
    
    const activity: UserActivity = {
      id: Date.now().toString(),
      userId: currentUser.value.id,
      poemId,
      activityType,
      createdAt: new Date()
    }
    
    userActivities.value.push(activity)
  }

  const updatePreferences = (preferences: Partial<UserPreferences>) => {
    userPreferences.value = { ...userPreferences.value, ...preferences }
    
    if (currentUser.value) {
      currentUser.value.preferences = userPreferences.value
    }
  }

  const getReadingHistory = () => {
    if (!currentUser.value) return []
    
    return userActivities.value
      .filter(activity => activity.activityType === 'view')
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 10)
  }

  const getFavoritePoems = () => {
    if (!currentUser.value) return []
    
    const favoriteActivities = userActivities.value
      .filter(activity => activity.activityType === 'like')
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    
    return favoriteActivities.map(activity => activity.poemId)
  }

  return {
    // 状态
    currentUser,
    userPreferences,
    userActivities,
    
    // Getter
    isLoggedIn,
    
    // Actions
    login,
    logout,
    recordActivity,
    updatePreferences,
    getReadingHistory,
    getFavoritePoems
  }
})