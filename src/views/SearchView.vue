<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePoetryStore } from '@/stores/poetry'
import { useUserStore } from '@/stores/user'
import type { Poem, PoetrySearchParams } from '@/types/poetry'

const route = useRoute()
const router = useRouter()
const poetryStore = usePoetryStore()
const userStore = useUserStore()

const searchQuery = ref('')
const searchResults = ref<Poem[]>([])
const activeFilter = ref('all') // all, poems, poets
const isLoading = ref(false)
const hasSearched = ref(false)

const searchFilters = [
  { value: 'all', label: '全部' },
  { value: 'poems', label: '诗作' },
  { value: 'poets', label: '诗人' }
]

const popularTags = [
  '唐诗', '宋词', '李白', '杜甫', '苏轼', '思乡', '山水', '爱情'
]

onMounted(() => {
  // 从URL参数中获取搜索查询
  if (route.query.q) {
    searchQuery.value = route.query.q as string
    performSearch()
  }
})

watch(() => route.query.q, (newQuery) => {
  if (newQuery && newQuery !== searchQuery.value) {
    searchQuery.value = newQuery as string
    performSearch()
  }
})

const performSearch = async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    hasSearched.value = false
    return
  }

  isLoading.value = true
  hasSearched.value = true

  try {
    const params: PoetrySearchParams = { query: searchQuery.value }
    
    // 根据筛选条件调整搜索参数
    if (activeFilter.value === 'poets') {
      params.poet = searchQuery.value
    }

    await poetryStore.searchPoems(params)
    searchResults.value = poetryStore.searchResults
    
    // 记录搜索活动
    userStore.recordActivity(`search:${searchQuery.value}`, 'view')
  } finally {
    isLoading.value = false
  }
}

const handleSearch = () => {
  // 更新URL参数
  router.push({
    name: 'search',
    query: { q: searchQuery.value }
  })
}

const searchByTag = (tag: string) => {
  searchQuery.value = tag
  handleSearch()
}

const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
  hasSearched.value = false
  router.push({ name: 'search' })
}

const viewPoem = (poemId: string) => {
  userStore.recordActivity(poemId, 'view')
  router.push({ name: 'poem', params: { id: poemId } })
}

const viewPoet = (poetName: string) => {
  router.push({ name: 'poet', params: { id: poetName } })
}

const getFilteredResults = () => {
  if (activeFilter.value === 'all') {
    return searchResults.value
  } else if (activeFilter.value === 'poets') {
    // 在实际项目中，这里应该搜索诗人
    return searchResults.value.filter(poem => 
      poem.poet?.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  return searchResults.value
}
</script>

<template>
  <div class="search-view">
    <div class="container">
      <!-- 搜索框 -->
      <section class="search-section">
        <div class="search-header">
          <h1>搜索诗词</h1>
          <p>探索中华诗词的博大精深</p>
        </div>
        
        <div class="search-container">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="输入诗词、诗人或主题关键词..."
            class="search-input"
            @keyup.enter="handleSearch"
          />
          <button @click="handleSearch" class="search-button" :disabled="isLoading">
            <span v-if="isLoading">⏳</span>
            <span v-else>🔍</span>
            {{ isLoading ? '搜索中...' : '搜索' }}
          </button>
          <button v-if="hasSearched" @click="clearSearch" class="clear-button">
            清除
          </button>
        </div>

        <!-- 搜索筛选 -->
        <div class="search-filters">
          <button
            v-for="filter in searchFilters"
            :key="filter.value"
            :class="['filter-button', { active: activeFilter === filter.value }]"
            @click="activeFilter = filter.value"
          >
            {{ filter.label }}
          </button>
        </div>
      </section>

      <!-- 热门标签 -->
      <section v-if="!hasSearched" class="popular-tags">
        <h3>热门标签</h3>
        <div class="tags-container">
          <button
            v-for="tag in popularTags"
            :key="tag"
            class="tag-button"
            @click="searchByTag(tag)"
          >
            {{ tag }}
          </button>
        </div>
      </section>

      <!-- 搜索结果 -->
      <section v-if="hasSearched" class="results-section">
        <div class="results-header">
          <h2>搜索结果</h2>
          <span class="results-count">
            找到 {{ getFilteredResults().length }} 个结果
          </span>
        </div>

        <div v-if="isLoading" class="loading">
          <p>搜索中...</p>
        </div>

        <div v-else-if="getFilteredResults().length === 0" class="no-results">
          <p>没有找到相关结果，请尝试其他关键词</p>
        </div>

        <div v-else class="results-grid">
          <div
            v-for="poem in getFilteredResults()"
            :key="poem.id"
            class="result-card"
            @click="viewPoem(poem.id)"
          >
            <div class="result-content">
              <h3 class="poem-title">{{ poem.title }}</h3>
              <p class="poem-author">{{ poem.poet?.name }} · {{ poem.dynasty }}</p>
              <p class="poem-excerpt">
                {{ poem.content.substring(0, 80) }}...
              </p>
              <div class="poem-tags">
                <span
                  v-for="tag in poem.tags.slice(0, 3)"
                  :key="tag"
                  class="tag"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 相关诗人推荐 -->
        <div v-if="getFilteredResults().length > 0" class="related-poets">
          <h3>相关诗人</h3>
          <div class="poets-list">
            <div
              v-for="poet in Array.from(new Set(getFilteredResults().map(p => p.poet?.name).filter(Boolean)))"
              :key="poet"
              class="poet-item"
              @click="viewPoet(poet || '')"
            >
              <span class="poet-name">{{ poet }}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.search-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 40px 0;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 搜索区域 */
.search-section {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.search-header {
  text-align: center;
  margin-bottom: 30px;
}

.search-header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 8px;
}

.search-header p {
  color: #666;
  font-size: 1.1rem;
}

.search-container {
  display: flex;
  gap: 12px;
  max-width: 600px;
  margin: 0 auto 20px;
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #667eea;
}

.search-button {
  padding: 12px 24px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;
}

.search-button:disabled {
  background: #a8b1e1;
  cursor: not-allowed;
}

.search-button:not(:disabled):hover {
  background: #5a6fd8;
}

.clear-button {
  padding: 12px 16px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.clear-button:hover {
  background: #5a6268;
}

/* 搜索筛选 */
.search-filters {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.filter-button {
  padding: 8px 16px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-button.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.filter-button:hover:not(.active) {
  background: #e9ecef;
}

/* 热门标签 */
.popular-tags {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.popular-tags h3 {
  text-align: center;
  margin-bottom: 20px;
  color: #2c3e50;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.tag-button {
  padding: 8px 16px;
  background: #e3f2fd;
  color: #1976d2;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.tag-button:hover {
  background: #bbdefb;
  transform: translateY(-1px);
}

/* 搜索结果 */
.results-section {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e9ecef;
}

.results-header h2 {
  color: #2c3e50;
  margin: 0;
}

.results-count {
  color: #666;
  font-size: 0.9rem;
}

/* 结果网格 */
.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.result-card {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.result-card:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.poem-title {
  font-size: 1.2rem;
  color: #2c3e50;
  margin-bottom: 8px;
}

.poem-author {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 12px;
}

.poem-excerpt {
  color: #555;
  line-height: 1.5;
  margin-bottom: 12px;
}

.poem-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
}

/* 相关诗人 */
.related-poets {
  border-top: 1px solid #e9ecef;
  padding-top: 20px;
}

.related-poets h3 {
  color: #2c3e50;
  margin-bottom: 16px;
}

.poets-list {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.poet-item {
  padding: 8px 16px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.poet-item:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

/* 加载和空状态 */
.loading, .no-results {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .search-container {
    flex-direction: column;
  }
  
  .results-grid {
    grid-template-columns: 1fr;
  }
  
  .search-filters {
    flex-wrap: wrap;
  }
}

/* 深色主题样式 */
.dark-theme .search-view {
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
}

.dark-theme .search-section,
.dark-theme .popular-tags,
.dark-theme .results-section {
  background: var(--bg-card);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.dark-theme .search-header h1,
.dark-theme .results-header h2,
.dark-theme .related-poets h3,
.dark-theme .popular-tags h3 {
  color: var(--text-primary);
}

.dark-theme .search-header p,
.dark-theme .results-count {
  color: var(--text-secondary);
}

.dark-theme .search-input {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-color: var(--border-color);
}

.dark-theme .search-input:focus {
  border-color: var(--accent-color);
}

.dark-theme .filter-button {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-color: var(--border-color);
}

.dark-theme .filter-button.active {
  background: var(--accent-color);
  border-color: var(--accent-color);
}

.dark-theme .filter-button:hover:not(.active) {
  background: var(--border-color);
}

.dark-theme .tag-button {
  background: var(--bg-secondary);
  color: var(--accent-color);
}

.dark-theme .tag-button:hover {
  background: var(--border-color);
}

.dark-theme .result-card {
  background: var(--bg-secondary);
  border-color: var(--border-color);
  color: var(--text-primary);
}

.dark-theme .result-card:hover {
  border-color: var(--accent-color);
}

.dark-theme .poem-title {
  color: var(--text-primary);
}

.dark-theme .poem-author,
.dark-theme .poem-excerpt {
  color: var(--text-secondary);
}

.dark-theme .tag {
  background: var(--bg-primary);
  color: var(--accent-color);
}

.dark-theme .poet-item {
  background: var(--bg-secondary);
  border-color: var(--border-color);
  color: var(--text-primary);
}

.dark-theme .poet-item:hover {
  background: var(--accent-color);
  color: white;
}

.dark-theme .results-header,
.dark-theme .related-poets {
  border-color: var(--border-color);
}

.dark-theme .loading,
.dark-theme .no-results {
  color: var(--text-secondary);
}
</style>