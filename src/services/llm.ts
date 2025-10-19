/**
 * 简单的 LLM 服务封装：支持 DeepSeek 与 OpenAI Chat Completions
 * 优先使用代理（VITE_LLM_PROXY_URL），否则使用官方 API。
 * 警告：在前端直接使用密钥会暴露到浏览器，请尽量使用代理。
 */

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ChatOptions {
  provider?: 'deepseek' | 'openai'
  model?: string
  temperature?: number
  maxTokens?: number
}

const env = (import.meta as any).env || {}

const DEEPSEEK_KEY = env.VITE_DEEPSEEK_API_KEY
const OPENAI_KEY = env.VITE_OPENAI_API_KEY
const LLM_PROXY_URL = env.VITE_LLM_PROXY_URL // 例如你的后端代理地址

const defaults = {
  deepseek: { url: 'https://api.deepseek.com/v1/chat/completions', model: 'deepseek-chat' },
  openai: { url: 'https://api.openai.com/v1/chat/completions', model: 'gpt-4o-mini' },
}

export async function chatCompletion(
  messages: ChatMessage[],
  options: ChatOptions = {},
): Promise<string> {
  // 选择提供方与模型
  const provider: 'deepseek' | 'openai' =
    options.provider || (DEEPSEEK_KEY ? 'deepseek' : OPENAI_KEY ? 'openai' : 'deepseek') // 优先 deepseek
  const base = defaults[provider]
  const model = options.model || base.model
  const temperature = options.temperature ?? 0.7
  const max_tokens = options.maxTokens ?? 800

  // 选择请求 URL：优先代理
  const url = LLM_PROXY_URL || base.url
  const key = provider === 'deepseek' ? DEEPSEEK_KEY : OPENAI_KEY

  if (!LLM_PROXY_URL && !key) {
    throw new Error('LLM 未配置：缺少代理或 API Key')
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (!LLM_PROXY_URL) {
    headers['Authorization'] = `Bearer ${key}`
  }

  const body = {
    model,
    messages,
    temperature,
    max_tokens,
  }

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`LLM 请求失败: ${res.status} ${text}`)
  }

  const data = await res.json()
  // OpenAI/DeepSeek 兼容的返回结构
  const content =
    data?.choices?.[0]?.message?.content || data?.data?.choices?.[0]?.message?.content || ''
  return content
}

export function hasLLMConfig(): boolean {
  return Boolean(LLM_PROXY_URL || DEEPSEEK_KEY || OPENAI_KEY)
}
