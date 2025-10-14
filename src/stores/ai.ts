import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AIConversation, AIMessage, AIAnalysisRequest } from '@/types/ai'

export const useAIStore = defineStore('ai', () => {
  // 状态
  const currentConversation = ref<AIConversation | null>(null)
  const isAnalyzing = ref(false)
  const conversationHistory = ref<AIConversation[]>([])

  // Actions
  const startNewConversation = (poemId?: string, title?: string) => {
    const conversation: AIConversation = {
      id: Date.now().toString(),
      userId: 'current-user', // 实际项目中应该使用真实用户ID
      poemId,
      title: title || '新的对话',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    currentConversation.value = conversation
    conversationHistory.value.unshift(conversation)
    
    return conversation
  }

  const sendMessage = async (content: string, type: AIMessage['type'] = 'question') => {
    if (!currentConversation.value) {
      startNewConversation()
    }

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
      type
    }

    currentConversation.value!.messages.push(userMessage)
    currentConversation.value!.updatedAt = new Date()

    // 模拟AI响应
    isAnalyzing.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const aiResponse = generateAIResponse(content, type)
      const aiMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        type: 'analysis'
      }

      currentConversation.value!.messages.push(aiMessage)
      return aiResponse
    } finally {
      isAnalyzing.value = false
    }
  }

  const analyzePoem = async (request: AIAnalysisRequest) => {
    isAnalyzing.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // 模拟AI分析结果
      return {
        analysis: `这是一首${request.depth}级别的诗词分析。诗词展现了丰富的意境和深刻的情感表达。`,
        keyPoints: ['意境优美', '情感真挚', '语言精炼'],
        relatedPoems: ['1', '2'],
        suggestedQuestions: ['这首诗的创作背景是什么？', '诗中使用了哪些修辞手法？']
      }
    } finally {
      isAnalyzing.value = false
    }
  }

  const generateAIResponse = (userInput: string, type: AIMessage['type']): string => {
    // 简单的响应生成逻辑 - 实际项目中应该调用AI API
    switch (type) {
      case 'question':
        return `关于您的问题"${userInput}"，这首诗表达了诗人深切的思乡之情。诗中通过明月意象，营造出宁静而深远的意境。`
      case 'interaction':
        return `我们来对诗吧！您刚才说的是"${userInput}"，我对：${generateCouplet(userInput)}`
      default:
        return `这首诗展现了诗人高超的艺术造诣。语言简练而意境深远，值得细细品味。`
    }
  }

  const generateCouplet = (_userLine: string): string => {
    // 简单的对诗生成 - 实际项目中应该使用更复杂的AI模型
    const responses = [
      '春风又绿江南岸',
      '明月何时照我还',
      '桃花潭水深千尺',
      '不及汪伦送我情'
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const getConversationHistory = () => {
    return conversationHistory.value.sort((a, b) => 
      b.updatedAt.getTime() - a.updatedAt.getTime()
    )
  }

  return {
    // 状态
    currentConversation,
    isAnalyzing,
    conversationHistory,
    
    // Actions
    startNewConversation,
    sendMessage,
    analyzePoem,
    getConversationHistory
  }
})