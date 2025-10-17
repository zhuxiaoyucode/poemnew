import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 创建模拟客户端，避免环境变量缺失导致应用崩溃
let supabaseClient

// 检查环境变量是否包含占位符
const hasValidConfig =
  supabaseUrl &&
  supabaseKey &&
  !supabaseUrl.includes('your_project_url') &&
  !supabaseKey.includes('your_anon_key_here')

if (!hasValidConfig) {
  console.warn('Supabase环境变量缺失或包含占位符，使用模拟客户端')
  // 创建极简的模拟客户端，只返回基本结构
  const mockResponse = { data: null, error: new Error('模拟客户端') }
  const mockAuthResponse = { data: { user: null, session: null }, error: new Error('模拟客户端') }

  supabaseClient = {
    from: () => ({
      select: () => mockResponse,
      insert: () => mockResponse,
      update: () => mockResponse,
      delete: () => mockResponse,
      // 添加链式查询方法支持
      eq: () => ({
        select: () => mockResponse,
        single: () => mockResponse,
      }),
      single: () => mockResponse,
    }),
    auth: {
      signUp: () => Promise.resolve(mockAuthResponse),
      signIn: () => Promise.resolve(mockAuthResponse),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    rpc: () => Promise.resolve(mockResponse),
  }
} else {
  console.log('使用真实的Supabase客户端连接')
  supabaseClient = createClient(supabaseUrl, supabaseKey)
}

export const supabase = supabaseClient

export default supabase
