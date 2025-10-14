// AI相关类型定义

export interface AIConversation {
  id: string
  userId: string
  poemId?: string
  title: string
  messages: AIMessage[]
  createdAt: Date
  updatedAt: Date
}

export interface AIMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  type: 'question' | 'analysis' | 'interaction'
}

export interface AIAnalysisRequest {
  poemId: string
  question?: string
  context?: string
  depth: 'brief' | 'detailed' | 'comprehensive'
}

export interface AIAnalysisResponse {
  analysis: string
  keyPoints: string[]
  relatedPoems: string[]
  suggestedQuestions: string[]
}

export interface AIPoetryInteraction {
  type: 'duilian' | 'feihualing' | 'creative'
  theme?: string
  difficulty: 'easy' | 'medium' | 'hard'
  userInput?: string
  aiResponse: string
}