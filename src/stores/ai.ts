import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AIConversation, AIMessage, AIAnalysisRequest } from '@/types/ai'
import { supabase } from '@/services/supabase'
import { chatCompletion, hasLLMConfig } from '@/services/llm'

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
      updatedAt: new Date(),
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
      type,
    }

    currentConversation.value!.messages.push(userMessage)
    currentConversation.value!.updatedAt = new Date()

    // 基于 Supabase 的规则检索响应
    isAnalyzing.value = true
    try {
      const { intent, title } = detectIntentAndTitle(content)
      let aiResponse = ''

      if (intent === 'read' && title) {
        const poem = await fetchPoemByTitle(title)
        if (poem && shouldUseLLM()) {
          aiResponse = await callLLMForPoem('read', poem, content)
        } else {
          aiResponse = poem
            ? buildReadingReply(poem)
            : `未找到标题为“${title}”的诗歌。您可以尝试使用更准确的标题或关键词。`
        }
      } else if (intent === 'analyze' && title) {
        const poem = await fetchPoemByTitle(title)
        if (poem && shouldUseLLM()) {
          aiResponse = await callLLMForPoem('analyze', poem, content)
        } else {
          aiResponse = poem
            ? buildAnalysisReply(poem)
            : `未找到标题为“${title}”的诗歌，无法进行赏析。`
        }
      } else {
        // 通用聊天：若已配置 LLM，调用大模型进行自由问答/比较/推荐；否则回退到关键词检索建议
        if (shouldUseLLM()) {
          aiResponse = await callLLMGeneral(content)
        } else {
          const results = await searchPoemsByQuery(content)
          if (results.length === 0) {
            aiResponse =
              '我可以和你聊天、比较诗歌、推荐作品，也可以阅读与赏析诗词。试试说：“比较《静夜思》和《春晓》”或“推荐思乡主题的诗”。'
          } else {
            const suggestions = results
              .slice(0, 5)
              .map((p) => `· ${p.title}（${p.poet?.name || ''}，${p.dynasty || ''}）`)
              .join('\n')
            aiResponse = `我找到了以下相关诗歌，您可以说“阅读《标题》”“赏析《标题》”或“比较《甲》《乙》”：\n${suggestions}`
          }
        }
      }

      const aiMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        type: 'analysis',
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
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // 模拟AI分析结果
      return {
        analysis: `这是一首${request.depth}级别的诗词分析。诗词展现了丰富的意境和深刻的情感表达。`,
        keyPoints: ['意境优美', '情感真挚', '语言精炼'],
        relatedPoems: ['1', '2'],
        suggestedQuestions: ['这首诗的创作背景是什么？', '诗中使用了哪些修辞手法？'],
      }
    } finally {
      isAnalyzing.value = false
    }
  }

  // LLM 接入：辅助函数
  const shouldUseLLM = (): boolean => {
    return hasLLMConfig()
  }

  const buildSystemPrompt = (mode: 'read' | 'analyze', poem: any): string => {
    const header = `${poem.title} / ${poem.poet?.name || ''}（${poem.dynasty || ''}）`
    const content = poem.content?.trim() || ''
    const type = (poem.tags && poem.tags[0]) || '诗歌'
    const base =
      mode === 'read'
        ? '你是中文诗词助手，请以准确、整洁的排版输出原文，必要时补充简要注释（不杜撰）。'
        : '你是中文诗词赏析助手，请从意象、修辞、结构、情感与时代背景等角度做深入但克制的赏析，避免编造无数据支撑的细节。'
    return [
      base,
      `作品：${header}`,
      `类型：${type}`,
      `原文：\n${content}`,
      '要求：保持中文输出，分点表达，避免过长段落。如缺乏可靠背景，请说明不确定。',
    ].join('\n')
  }

  const callLLMForPoem = async (
    mode: 'read' | 'analyze',
    poem: any,
    userText: string,
  ): Promise<string> => {
    try {
      const system = buildSystemPrompt(mode, poem)
      const messages = [
        { role: 'system', content: system },
        { role: 'user', content: userText },
      ] as any
      const answer = await chatCompletion(messages, {
        provider: (import.meta as any).env.VITE_DEEPSEEK_API_KEY ? 'deepseek' : 'openai',
        temperature: mode === 'read' ? 0.2 : 0.7,
        maxTokens: 800,
      })
      return answer
    } catch (err: any) {
      console.warn('LLM调用失败，回退到本地模板：', err?.message || err)
      return mode === 'read' ? buildReadingReply(poem) : buildAnalysisReply(poem)
    }
  }

  // 通用 LLM：一般对话与比较
  const extractTitles = (text: string): string[] => {
    const matches = Array.from(text.matchAll(/《([^》]+)》/g)).map((m) => m[1])
    return Array.from(new Set(matches))
  }

  const fetchMultiplePoemsByTitles = async (titles: string[]) => {
    if (!titles.length) return []
    const { data, error } = await supabase.from('poetry_view').select('*').in('title', titles)
    if (error) {
      console.error('批量查询诗歌失败:', error)
      return []
    }
    return (data || []).map((item: any) => ({
      id: item.id?.toString(),
      title: item.title,
      content: item.content,
      poet: { name: item.poet_name, dynasty: item.dynasty_name },
      dynasty: item.dynasty_name,
      tags: [item.poem_type || '未知类型'],
    }))
  }

  const buildGeneralSystemPrompt = (poems: any[]): string => {
    const header =
      '你是中文诗词助手，支持一般聊天、诗歌比较、推荐与科普。回答要自然、准确、克制，不编造无依据细节。'
    const context = poems.length
      ? '上下文诗歌：\n' +
        poems
          .slice(0, 3)
          .map(
            (p) =>
              `${p.title}（${p.poet?.name || ''}，${p.dynasty || ''}）\n${(p.content || '').slice(0, 300)}`,
          )
          .join('\n\n')
      : '无特定诗歌上下文。'
    const req =
      '要求：若比较，请分点对比主题、意象、语言与时代背景；若问候，亲切简短；若推荐，说明理由；避免过长段落。'
    return [header, context, req].join('\n')
  }

  const callLLMGeneral = async (userText: string): Promise<string> => {
    try {
      const titles = extractTitles(userText)
      const poems = titles.length ? await fetchMultiplePoemsByTitles(titles) : []
      const system = buildGeneralSystemPrompt(poems)
      const messages = [
        { role: 'system', content: system },
        { role: 'user', content: userText },
      ] as any
      const answer = await chatCompletion(messages, {
        provider: (import.meta as any).env.VITE_DEEPSEEK_API_KEY ? 'deepseek' : 'openai',
        temperature: 0.7,
        maxTokens: 800,
      })
      return answer
    } catch (err: any) {
      console.warn('LLM通用调用失败，回退搜索建议：', err?.message || err)
      const results = await searchPoemsByQuery(userText)
      if (!results.length) {
        return '我可以和你聊天、比较诗歌、推荐作品，也可以阅读与赏析诗词。试试说：“比较《静夜思》和《春晓》”或“推荐思乡主题的诗”。'
      }
      const suggestions = results
        .slice(0, 5)
        .map((p) => `· ${p.title}（${p.poet?.name || ''}，${p.dynasty || ''}）`)
        .join('\n')
      return `我找到了这些相关诗歌，您可以继续提问或指定比较对象：\n${suggestions}`
    }
  }

  // 意图识别与标题抽取
  const detectIntentAndTitle = (
    text: string,
  ): { intent: 'read' | 'analyze' | 'unknown'; title?: string } => {
    const normalized = text.trim()
    const hasRead = /阅读|读一下|原文|显示诗歌|看一下|朗读/.test(normalized)
    const hasAnalyze = /赏析|分析|解读|鉴赏|点评/.test(normalized)
    const titleMatch =
      normalized.match(/《([^》]+)》/) || normalized.match(/(?:阅读|赏析|分析|解读)\s*([^\s《》]+)/)

    return {
      intent: hasRead ? 'read' : hasAnalyze ? 'analyze' : 'unknown',
      title: titleMatch ? titleMatch[1] || titleMatch[0] : undefined,
    }
  }

  // 从 Supabase 按标题查询诗歌（poetry_view）
  const fetchPoemByTitle = async (title: string) => {
    const { data, error } = await supabase.from('poetry_view').select('*').ilike('title', title)

    if (error) {
      console.error('查询诗歌失败:', error)
      return null
    }
    const item = (data || [])[0]
    if (!item) return null

    return {
      id: item.id?.toString(),
      title: item.title,
      content: item.content,
      poetId: `poet_${item.poet_name}_${item.dynasty_name}`.replace(/\s+/g, '_'),
      poet: {
        id: `poet_${item.poet_name}_${item.dynasty_name}`.replace(/\s+/g, '_'),
        name: item.poet_name,
        dynasty: item.dynasty_name,
        biography: item.poet_description || '',
        tags: [],
      },
      dynasty: item.dynasty_name,
      tags: [item.poem_type || '未知类型'],
      createdAt: item.created_at ? new Date(item.created_at) : new Date(),
      updatedAt: item.created_at ? new Date(item.created_at) : new Date(),
    } as any
  }

  // 关键词通用搜索
  const searchPoemsByQuery = async (query: string) => {
    const q = query.trim().toLowerCase()
    const { data, error } = await supabase
      .from('poetry_view')
      .select('*')
      .or(`title.ilike.%${q}%,content.ilike.%${q}%,poet_name.ilike.%${q}%`)
      .order('title')

    if (error) {
      console.error('搜索错误:', error)
      return []
    }
    return (data || []).map((item: any) => ({
      id: item.id?.toString(),
      title: item.title,
      content: item.content,
      poetId: `poet_${item.poet_name}_${item.dynasty_name}`.replace(/\s+/g, '_'),
      poet: {
        id: `poet_${item.poet_name}_${item.dynasty_name}`.replace(/\s+/g, '_'),
        name: item.poet_name,
        dynasty: item.dynasty_name,
        biography: item.poet_description || '',
        tags: [],
      },
      dynasty: item.dynasty_name,
      tags: [item.poem_type || '未知类型'],
      createdAt: item.created_at ? new Date(item.created_at) : new Date(),
      updatedAt: item.created_at ? new Date(item.created_at) : new Date(),
    }))
  }

  // 构建“阅读原文”回复
  const buildReadingReply = (poem: any): string => {
    const header = `${poem.title} / ${poem.poet?.name || ''}（${poem.dynasty || ''}）`
    const content = poem.content?.trim() || '（无内容）'
    return `${header}

${content}`
  }

  // 构建“赏析”回复（基于数据库字段的模板化赏析）
  const buildAnalysisReply = (poem: any): string => {
    const type = (poem.tags && poem.tags[0]) || '诗歌'
    const poetName = poem.poet?.name || ''
    const dynasty = poem.dynasty || ''
    const bg = poem.poet?.biography ? `诗人背景：${poem.poet.biography}` : ''
    const lengthInfo = poem.content
      ? `全诗约${poem.content.length}字，语言${poem.content.length > 60 ? '较为舒展' : '精炼凝练'}。`
      : ''
    const imageryHints = ['月', '风', '雨', '江', '山', '花', '酒'].filter((k) =>
      poem.content?.includes(k),
    )
    const imageryText = imageryHints.length ? `意象：${imageryHints.join('、')}。` : ''
    return [
      `${poem.title}（${poetName}，${dynasty}）赏析`,
      `类型：${type}。${lengthInfo}`,
      imageryText,
      bg,
      '总体来看，诗作通过典型意象与凝练语言，传达出鲜明的情感与画面感，结构清晰，层次分明，耐人寻味。',
    ]
      .filter(Boolean)
      .join('\n')
  }

  const generateCouplet = (_userLine: string): string => {
    // 简单的对诗生成 - 实际项目中应该使用更复杂的AI模型
    const responses = ['春风又绿江南岸', '明月何时照我还', '桃花潭水深千尺', '不及汪伦送我情']
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const getConversationHistory = () => {
    return conversationHistory.value.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
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
    getConversationHistory,
  }
})
