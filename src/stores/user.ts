import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, UserPreferences, UserActivity } from '@/types/user'

// 模拟用户数据库
const mockUsers = ref([
  {
    id: '1',
    username: 'demo',
    email: 'demo@example.com',
    password: '123456',
    preferences: {
      favoritePoets: [],
      favoriteTags: [],
      readingLevel: 'beginner',
      theme: 'auto',
      language: 'zh',
    },
    createdAt: new Date('2024-01-01'),
    lastLoginAt: new Date(),
  },
])

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
    language: 'zh',
  })

  // Actions
  const login = async (username: string, password: string) => {
    // 查找用户
    const user = mockUsers.value.find((u) => u.username === username && u.password === password)

    if (!user) {
      throw new Error('用户名或密码错误')
    }

    // 更新最后登录时间
    user.lastLoginAt = new Date()

    currentUser.value = {
      id: user.id,
      username: user.username,
      email: user.email,
      preferences: user.preferences,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
    }

    // 记录登录活动
    recordActivity('login', 'view')
  }

  const register = async (username: string, email: string, password: string) => {
    // 检查用户名是否已存在
    const existingUser = mockUsers.value.find((u) => u.username === username)
    if (existingUser) {
      throw new Error('用户名已存在')
    }

    // 检查邮箱是否已存在
    const existingEmail = mockUsers.value.find((u) => u.email === email)
    if (existingEmail) {
      throw new Error('邮箱已被注册')
    }

    // 创建新用户
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password,
      preferences: {
        favoritePoets: [],
        favoriteTags: [],
        readingLevel: 'beginner' as const,
        theme: 'auto' as const,
        language: 'zh' as const,
      },
      createdAt: new Date(),
      lastLoginAt: new Date(),
    }

    mockUsers.value.push(newUser)

    // 自动登录
    currentUser.value = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      preferences: newUser.preferences,
      createdAt: newUser.createdAt,
      lastLoginAt: newUser.lastLoginAt,
    }

    // 记录注册活动
    recordActivity('register', 'view')
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
      createdAt: new Date(),
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
      .filter((activity) => activity.activityType === 'view')
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 10)
  }

  const getFavoritePoems = () => {
    if (!currentUser.value) return []

    const favoriteActivities = userActivities.value
      .filter((activity) => activity.activityType === 'like')
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    return favoriteActivities.map((activity) => activity.poemId)
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
    register,
    logout,
    recordActivity,
    updatePreferences,
    getReadingHistory,
    getFavoritePoems,
  }
})
