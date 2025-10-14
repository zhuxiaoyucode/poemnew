import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Poem, Poet, PoetrySearchParams } from '@/types/poetry'

// 模拟数据 - 实际项目中应该从API获取
const mockPoets: Poet[] = [
  {
    id: '1',
    name: '李白',
    dynasty: '唐',
    biography: '唐代伟大的浪漫主义诗人，被后人誉为"诗仙"。',
    tags: ['浪漫主义', '豪放', '山水']
  },
  {
    id: '2',
    name: '杜甫',
    dynasty: '唐',
    biography: '唐代伟大的现实主义诗人，被后人誉为"诗圣"。',
    tags: ['现实主义', '沉郁', '社会']
  }
]

const mockPoems: Poem[] = [
  {
    id: '1',
    title: '静夜思',
    content: '床前明月光，疑是地上霜。举头望明月，低头思故乡。',
    poetId: '1',
    dynasty: '唐',
    tags: ['思乡', '月亮', '夜晚'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    title: '春望',
    content: '国破山河在，城春草木深。感时花溅泪，恨别鸟惊心。',
    poetId: '2',
    dynasty: '唐',
    tags: ['爱国', '战争', '春天'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export const usePoetryStore = defineStore('poetry', () => {
  // 状态
  const poems = ref<Poem[]>(mockPoems)
  const poets = ref<Poet[]>(mockPoets)
  const currentPoem = ref<Poem | null>(null)
  const currentPoet = ref<Poet | null>(null)
  const searchResults = ref<Poem[]>([])
  const isLoading = ref(false)

  // Getter
  const featuredPoems = computed(() => poems.value.slice(0, 5))
  const popularPoets = computed(() => poets.value.slice(0, 3))

  // Actions
  const searchPoems = async (params: PoetrySearchParams) => {
    isLoading.value = true
    try {
      // 模拟搜索延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      let results = poems.value
      
      if (params.query) {
        const query = params.query.toLowerCase()
        results = results.filter(poem => 
          poem.title.toLowerCase().includes(query) ||
          poem.content.includes(query) ||
          poem.poetId.toLowerCase().includes(query)
        )
      }
      
      if (params.poet) {
        results = results.filter(poem => poem.poetId === params.poet)
      }
      
      if (params.dynasty) {
        results = results.filter(poem => poem.dynasty === params.dynasty)
      }
      
      if (params.tags && params.tags.length > 0) {
        results = results.filter(poem => 
          params.tags!.some(tag => poem.tags.includes(tag))
        )
      }
      
      searchResults.value = results
      return results
    } finally {
      isLoading.value = false
    }
  }

  const getPoemById = (id: string) => {
    const poem = poems.value.find(p => p.id === id)
    if (poem) {
      currentPoem.value = poem
      // 关联诗人信息
      const poet = poets.value.find(p => p.id === poem.poetId)
      if (poet) {
        currentPoet.value = poet
      }
    }
    return poem
  }

  const getPoetById = (id: string) => {
    const poet = poets.value.find(p => p.id === id)
    if (poet) {
      currentPoet.value = poet
      // 获取诗人的所有诗作
      const poetPoems = poems.value.filter(p => p.poetId === id)
      poems.value = [...poems.value, ...poetPoems]
    }
    return poet
  }

  const getRelatedPoems = (poem: Poem) => {
    return poems.value.filter(p => 
      p.id !== poem.id && 
      p.tags.some(tag => poem.tags.includes(tag))
    ).slice(0, 3)
  }

  return {
    // 状态
    poems,
    poets,
    currentPoem,
    currentPoet,
    searchResults,
    isLoading,
    
    // Getter
    featuredPoems,
    popularPoets,
    
    // Actions
    searchPoems,
    getPoemById,
    getPoetById,
    getRelatedPoems
  }
})