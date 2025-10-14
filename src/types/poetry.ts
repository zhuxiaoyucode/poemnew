// 诗词相关类型定义

export interface Poet {
  id: string
  name: string
  dynasty: string
  birthYear?: number
  deathYear?: number
  biography: string
  avatar?: string
  tags: string[]
}

export interface Poem {
  id: string
  title: string
  content: string
  poetId: string
  poet?: Poet
  dynasty: string
  translation?: string
  background?: string
  tags: string[]
  audioUrl?: string
  imageUrl?: string
  createdAt: Date
  updatedAt: Date
}

export interface PoetryTag {
  id: string
  name: string
  type: 'theme' | 'imagery' | 'technique' | 'emotion'
  description?: string
}

export interface AIPoetryAnalysis {
  id: string
  poemId: string
  analysis: string
  style: string
  imagery: string[]
  emotion: string
  techniques: string[]
  createdAt: Date
}

export interface PoetrySearchParams {
  query?: string
  poet?: string
  dynasty?: string
  tags?: string[]
  page?: number
  limit?: number
}

export interface PoetryRecommendation {
  poem: Poem
  reason: string
  similarity: number
}