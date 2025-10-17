import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Poem, Poet, PoetrySearchParams } from '@/types/poetry'
import { supabase } from '@/services/supabase'

// 诗歌类型定义
export interface PoemType {
  id: number
  name: string
  description: string
  count: number
  color: string
}

// 从数据库获取的诗歌类型（已注释，因为使用动态获取）
// const poemTypes: PoemType[] = [
//   { id: 1, name: '思乡诗', description: '表达对故乡、亲人的思念之情', count: 0, color: '#8b5a2b' },
//   { id: 2, name: '山水诗', description: '描写自然山水风光', count: 0, color: '#4a90e2' },
//   { id: 3, name: '记行诗', description: '记录旅行见闻和感受', count: 0, color: '#f5a623' },
//   { id: 4, name: '送别诗', description: '表达离别之情', count: 0, color: '#d0021b' },
//   { id: 5, name: '抒情诗', description: '抒发个人情感', count: 0, color: '#7ed321' },
//   { id: 6, name: '咏物诗', description: '通过描写事物表达情感', count: 0, color: '#bd10e0' },
//   { id: 7, name: '爱国诗', description: '表达爱国情怀', count: 0, color: '#ff6b6b' },
//   { id: 8, name: '田园诗', description: '描写田园生活和自然风光', count: 0, color: '#4ecdc4' },
//   { id: 9, name: '怀古诗', description: '怀念历史人物或事件', count: 0, color: '#45b7d1' },
//   { id: 10, name: '爱情诗', description: '表达爱情情感', count: 0, color: '#ff9ff3' },
//   { id: 11, name: '酬赠诗', description: '朋友间的赠答诗', count: 0, color: '#54a0ff' },
//   { id: 12, name: '边塞诗', description: '描写边塞生活和战争', count: 0, color: '#ff9f43' },
//   { id: 13, name: '叙事诗', description: '叙述故事或事件', count: 0, color: '#a55eea' },
//   { id: 14, name: '讽喻诗', description: '通过讽刺表达观点', count: 0, color: '#fd9644' },
//   { id: 15, name: '亲情诗', description: '表达亲情', count: 0, color: '#26de81' },
//   { id: 16, name: '哲理诗', description: '蕴含人生哲理', count: 0, color: '#2bcbba' },
//   { id: 17, name: '节日诗', description: '描写节日习俗和情感', count: 0, color: '#ff7f50' },
//   { id: 18, name: '咏史怀古', description: '咏史怀古类诗歌', count: 0, color: '#778beb' },
// ]

export const usePoetryStore = defineStore('poetry', () => {
  // 状态
  const poems = ref<Poem[]>([])
  const poets = ref<Poet[]>([])
  const poemTypes = ref<PoemType[]>([])
  const currentPoem = ref<Poem | null>(null)
  const currentPoet = ref<Poet | null>(null)
  const searchResults = ref<Poem[]>([])
  const isLoading = ref(false)

  // Getter
  const featuredPoems = computed(() => poems.value.slice(0, 5))
  const popularPoets = computed(() => poets.value.slice(0, 3))
  const categories = computed(() => poemTypes.value)

  // Actions
  const fetchPoemTypes = async () => {
    try {
      const { data, error } = await supabase.from('poem_types').select('*')

      if (error) throw error

      // 获取所有诗歌数据用于统计数量
      const { data: allPoems, error: poemsError } = await supabase.from('poems').select('*')

      if (poemsError) throw poemsError

      // 获取每个类型的诗歌数量
      const typesWithCount = data.map((type: any) => {
        const count = allPoems ? allPoems.filter((poem: any) => poem.type_id === type.id).length : 0

        return {
          id: type.id,
          name: type.name,
          description: type.description,
          count: count,
          color: getTypeColor(type.name),
        }
      })

      // 按名称排序
      typesWithCount.sort((a, b) => a.name.localeCompare(b.name))

      poemTypes.value = typesWithCount
      return typesWithCount
    } catch (error) {
      console.error('获取诗歌类型失败:', error)
      return []
    }
  }

  const fetchPoemsByType = async (typeId: number) => {
    isLoading.value = true
    try {
      console.log(`开始查询类型ID: ${typeId}的诗歌`)

      // 获取所有类型数据
      const { data: allTypes, error: typesError } = await supabase.from('poem_types').select('*')

      if (typesError) {
        console.error('获取类型数据错误:', typesError)
        throw typesError
      }

      // 在客户端查找类型名称
      const typeData = allTypes?.find((type: any) => type.id === typeId)

      if (!typeData) {
        console.error('未找到对应的诗歌类型')
        return []
      }

      console.log(`类型名称: ${typeData.name}`)

      // 获取所有诗歌数据
      const { data, error } = await supabase.from('poetry_view').select('*')

      if (error) {
        console.error('查询错误:', error)
        throw error
      }

      // 在客户端过滤对应类型的诗歌
      const filteredData = data?.filter((item: any) => item.poem_type === typeData.name) || []

      console.log(`查询结果:`, filteredData)

      // 按标题排序
      const sortedData = filteredData.sort((a: any, b: any) => a.title.localeCompare(b.title))

      const poemsData = sortedData.map((item: any) => ({
        id: item.id.toString(),
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
        tags: [item.poem_type],
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.created_at),
      }))

      console.log(`获取到类型"${typeData.name}"的诗歌: ${poemsData.length}首`)
      return poemsData
    } catch (error) {
      console.error('获取诗歌失败:', error)
      return []
    } finally {
      isLoading.value = false
    }
  }

  const fetchAllPoems = async () => {
    isLoading.value = true
    try {
      const { data, error } = await supabase.from('poetry_view').select('*').order('title')

      if (error) throw error

      const poemsData =
        data?.map((item: any) => ({
          id: item.id.toString(),
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
          tags: [item.poem_type],
          createdAt: new Date(item.created_at),
          updatedAt: new Date(item.created_at),
        })) || []

      poems.value = poemsData
      return poemsData
    } catch (error) {
      console.error('获取诗歌失败:', error)
      return []
    } finally {
      isLoading.value = false
    }
  }

  const searchPoems = async (params: PoetrySearchParams) => {
    isLoading.value = true
    try {
      console.log('开始搜索，参数:', params)

      // 参数验证和类型安全
      if (!params || (typeof params !== 'object')) {
        console.error('搜索参数无效')
        return []
      }

      let query = supabase.from('poetry_view').select('*')

      // 构建查询条件
      if (params.query && typeof params.query === 'string') {
        const searchQuery = params.query.toLowerCase()
        // 使用Supabase的查询构建器进行多字段搜索
        query = query.or(
          `title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%,poet_name.ilike.%${searchQuery}%`,
        )
      }

      if (params.poet && typeof params.poet === 'string') {
        query = query.eq('poet_name', params.poet)
      }

      if (params.dynasty && typeof params.dynasty === 'string') {
        query = query.eq('dynasty_name', params.dynasty)
      }

      if (params.tags && Array.isArray(params.tags) && params.tags.length > 0) {
        query = query.in('poem_type', params.tags)
      }

      const { data, error } = await query.order('title')

      if (error) {
        console.error('搜索错误:', error)
        throw error
      }

      console.log('搜索到数据:', data?.length || 0, '条')

      // 类型安全的数据转换
      const results = (data || []).map((item: any) => {
        // 确保必要字段存在
        if (!item.id || !item.title || !item.content || !item.poet_name || !item.dynasty_name) {
          console.warn('跳过无效的诗歌数据:', item)
          return null
        }

        return {
          id: item.id.toString(),
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
        }
      }).filter(Boolean) as Poem[] // 过滤掉null值

      searchResults.value = results
      console.log('搜索结果:', results)
      return results
    } catch (error) {
      console.error('搜索诗歌失败:', error)
      // 返回空数组而不是抛出错误，避免UI崩溃
      return []
    } finally {
      isLoading.value = false
    }
  }

  const getPoemById = async (id: string) => {
    try {
      const { data, error } = await supabase.from('poetry_view').select('*')

      if (error) throw error

      // 在客户端过滤
      const poemData = data.find((item: any) => item.id === parseInt(id))

      if (poemData) {
        const poetId = `poet_${poemData.poet_name}_${poemData.dynasty_name}`.replace(/\s+/g, '_')
        const poet = {
          id: poetId,
          name: poemData.poet_name,
          dynasty: poemData.dynasty_name,
          biography: poemData.poet_description || '',
          tags: [],
        }

        const poem = {
          id: poemData.id.toString(),
          title: poemData.title,
          content: poemData.content,
          poetId,
          poet,
          dynasty: poemData.dynasty_name,
          tags: [poemData.poem_type],
          createdAt: new Date(poemData.created_at),
          updatedAt: new Date(poemData.created_at),
        }

        currentPoem.value = poem
        return poem
      }
    } catch (error) {
      console.error('获取诗歌详情失败:', error)
    }
    return null
  }

  const getPoetById = async (id: string) => {
    try {
      const { data, error } = await supabase.from('poets').select('*')

      if (error) throw error

      if (data) {
        // 在客户端查找诗人
        const poetData = data.find((item: any) => item.id === parseInt(id))

        if (poetData) {
          const dynasty = poetData.dynasty_id ? await getDynastyName(poetData.dynasty_id) : ''

          const poet = {
            id: poetData.id.toString(),
            name: poetData.name,
            dynasty,
            biography: poetData.description || '',
            tags: [],
          }

          currentPoet.value = poet
          return poet
        }
      }
    } catch (error) {
      console.error('获取诗人详情失败:', error)
    }
    return null
  }

  const getRelatedPoems = async (poem: Poem) => {
    try {
      // 检查tags是否存在且有内容
      if (!poem.tags || poem.tags.length === 0) {
        console.warn('诗歌没有标签，无法获取相关诗歌')
        return []
      }

      // 获取所有诗歌数据
      const { data, error } = await supabase.from('poetry_view').select('*')

      if (error) throw error

      if (data) {
        // 在客户端过滤相同类型的诗歌
        const relatedPoems = data
          .filter((item: any) => item.id !== parseInt(poem.id) && item.poem_type === poem.tags[0])
          .slice(0, 3)

        return relatedPoems.map((item: any) => ({
          id: item.id.toString(),
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
          tags: [item.poem_type],
          createdAt: new Date(item.created_at),
          updatedAt: new Date(item.created_at),
        }))
      }
    } catch (error) {
      console.error('获取相关诗歌失败:', error)
    }
    return []
  }

  // 辅助函数
  const getTypeColor = (typeName: string): string => {
    const colorMap: Record<string, string> = {
      思乡诗: '#8b5a2b',
      山水诗: '#4a90e2',
      记行诗: '#f5a623',
      送别诗: '#d0021b',
      抒情诗: '#7ed321',
      咏物诗: '#bd10e0',
      爱国诗: '#ff6b6b',
      田园诗: '#4ecdc4',
      怀古诗: '#45b7d1',
      爱情诗: '#ff9ff3',
      酬赠诗: '#54a0ff',
      边塞诗: '#ff9f43',
      叙事诗: '#a55eea',
      讽喻诗: '#fd9644',
      亲情诗: '#26de81',
      哲理诗: '#2bcbba',
      节日诗: '#ff7f50',
      咏史怀古: '#778beb',
    }
    return colorMap[typeName] || '#8b5a2b'
  }

  // 获取诗人ID
  const getPoetIdByName = async (poetName: string, dynasty: string): Promise<string> => {
    // 直接返回基于名称和朝代的唯一ID，避免数据库查询
    return `poet_${poetName}_${dynasty}`.replace(/\s+/g, '_')
  }

  // 获取诗人信息
  const getPoetInfo = async (poetName: string, dynasty: string, description?: string) => {
    // 直接返回默认诗人信息，避免数据库查询
    return {
      id: `poet_${poetName}_${dynasty}`.replace(/\s+/g, '_'),
      name: poetName,
      dynasty: dynasty,
      biography: description || '',
      tags: [],
    }
  }

  const getDynastyName = async (dynastyId: number): Promise<string> => {
    try {
      const { data, error } = await supabase.from('dynasties').select('*')

      if (error) throw error

      if (data) {
        // 在客户端查找朝代
        const dynastyData = data.find((item: any) => item.id === dynastyId)
        return dynastyData?.name || ''
      }
      return ''
    } catch (error) {
      console.error('获取朝代名称失败:', error)
      return ''
    }
  }

  // 初始化数据
  const initializeData = async () => {
    await fetchPoemTypes()
    await fetchAllPoems()
  }

  return {
    // 状态
    poems,
    poets,
    poemTypes,
    currentPoem,
    currentPoet,
    searchResults,
    isLoading,

    // Getter
    featuredPoems,
    popularPoets,
    categories,

    // Actions
    fetchPoemTypes,
    fetchPoemsByType,
    fetchAllPoems,
    searchPoems,
    getPoemById,
    getPoetById,
    getRelatedPoems,
    initializeData,
  }
})
