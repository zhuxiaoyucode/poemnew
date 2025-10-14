// 用户相关类型定义

export interface User {
  id: string
  username: string
  email?: string
  avatar?: string
  preferences: UserPreferences
  createdAt: Date
  lastLoginAt: Date
}

export interface UserPreferences {
  favoritePoets: string[]
  favoriteTags: string[]
  readingLevel: 'beginner' | 'intermediate' | 'advanced'
  theme: 'light' | 'dark' | 'auto'
  language: 'zh' | 'en'
}

export interface UserActivity {
  id: string
  userId: string
  poemId: string
  activityType: 'view' | 'like' | 'collect' | 'share'
  createdAt: Date
}

export interface UserRecommendation {
  poemId: string
  reason: string
  confidence: number
  viewed: boolean
}