<template>
  <div class="category-view">
    <!-- 分类标题 -->
    <div class="category-header">
      <h1 class="category-title">诗歌分类</h1>
      <p class="category-description">探索不同主题的古诗词，感受中华文化的博大精深</p>
    </div>

    <!-- 分类网格（没有typeId参数时显示） -->
    <div v-if="!hasTypeIdParam" class="categories-grid">
      <div
        v-for="category in categoriesList"
        :key="category.id"
        class="category-card"
        :style="{ backgroundColor: category.color + '20', borderColor: category.color }"
        @click="goToCategory(category)"
      >
        <div class="category-icon" :style="{ color: category.color }">
          {{ getCategoryIcon(category.name) }}
        </div>
        <div class="category-info">
          <h3 class="category-name">{{ category.name }}</h3>
          <p class="category-description">{{ category.description }}</p>
          <span class="poem-count">{{ category.count }} 首</span>
        </div>
      </div>
    </div>

    <!-- 分类详情页面（有typeId参数或已选择分类时显示） -->
    <div v-if="selectedCategory" class="category-detail">
      <div class="detail-header">
        <button class="back-button" @click="selectedCategory = null">← 返回分类</button>
        <h2 class="detail-title">{{ selectedCategory.name }}</h2>
        <p class="detail-description">{{ selectedCategory.description }}</p>
      </div>

      <!-- 诗歌列表 -->
      <div class="poems-grid">
        <div v-for="poem in categoryPoems" :key="poem.id" class="poem-card">
          <div class="poem-header">
            <h3 class="poem-title">{{ poem.title }}</h3>
            <span class="poem-dynasty">{{ poem.dynasty }}</span>
          </div>
          <div class="poem-content">
            {{ formatPoemContent(poem.content) }}
          </div>
          <div class="poem-footer">
            <span class="poet-name">{{ poem.poet?.name }}</span>
            <button class="view-details-btn" @click="viewPoemDetails(poem)">查看详情</button>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="categoryPoems.length === 0" class="empty-state">
        <p>暂无该分类的诗歌数据</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePoetryStore } from '@/stores/poetry'
import type { PoemType, Poem } from '@/types/poetry'

const router = useRouter()
const route = useRoute()
const poetryStore = usePoetryStore()

const selectedCategory = ref<PoemType | null>(null)
const categoryPoems = ref<Poem[]>([])
const hasTypeIdParam = ref(false)

// 计算属性
const categoriesList = computed(() => poetryStore.categories)

// 图标映射
const getCategoryIcon = (categoryName: string): string => {
  const iconMap: Record<string, string> = {
    思乡诗: '🏠',
    山水诗: '⛰️',
    记行诗: '🚶',
    送别诗: '👋',
    抒情诗: '💖',
    咏物诗: '🌸',
    爱国诗: '🇨🇳',
    田园诗: '🌾',
    怀古诗: '📜',
    爱情诗: '💕',
    酬赠诗: '🎁',
    边塞诗: '⚔️',
    叙事诗: '📖',
    讽喻诗: '🎭',
    亲情诗: '👨‍👩‍👧‍👦',
    哲理诗: '💭',
    节日诗: '🎉',
    咏史怀古: '🏛️',
  }
  return iconMap[categoryName] || '📚'
}

// 格式化诗歌内容（限制行数）
const formatPoemContent = (content: string): string => {
  const lines = content.split('。').filter((line) => line.trim())
  return lines.slice(0, 2).join('。') + (lines.length > 2 ? '...' : '')
}

// 方法
const goToCategory = async (category: PoemType) => {
  selectedCategory.value = category
  categoryPoems.value = await poetryStore.fetchPoemsByType(category.id)
  // 更新URL参数
  router.push({ query: { typeId: category.id.toString() } })
}

const viewPoemDetails = (poem: Poem) => {
  router.push(`/poem/${poem.id}`)
}

// 根据类型ID查找分类
const findCategoryById = (typeId: number): PoemType | undefined => {
  return categoriesList.value.find((cat) => cat.id === typeId)
}

// 处理路由参数变化
watch(
  () => route.query.typeId,
  async (newTypeId) => {
    if (newTypeId) {
      hasTypeIdParam.value = true
      const typeId = parseInt(newTypeId as string)
      const category = findCategoryById(typeId)
      if (category) {
        selectedCategory.value = category
        categoryPoems.value = await poetryStore.fetchPoemsByType(typeId)
      }
    } else {
      hasTypeIdParam.value = false
      selectedCategory.value = null
      categoryPoems.value = []
    }
  },
  { immediate: true },
)

// 生命周期
onMounted(async () => {
  await poetryStore.initializeData()

  // 初始化hasTypeIdParam状态
  hasTypeIdParam.value = !!route.query.typeId
})
</script>

<style scoped>
.category-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.category-header {
  text-align: center;
  margin-bottom: 3rem;
}

.category-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.category-description {
  font-size: 1.1rem;
  color: #7f8c8d;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.category-card {
  border: 2px solid;
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.category-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.category-info {
  flex: 1;
}

.category-name {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.category-description {
  font-size: 0.9rem;
  color: #7f8c8d;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.poem-count {
  font-size: 0.8rem;
  color: #95a5a6;
  font-weight: 500;
}

.category-detail {
  animation: fadeIn 0.3s ease;
}

.detail-header {
  margin-bottom: 2rem;
  text-align: center;
}

.back-button {
  background: none;
  border: none;
  color: #3498db;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.back-button:hover {
  background-color: #ecf0f1;
}

.detail-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.detail-description {
  font-size: 1.1rem;
  color: #7f8c8d;
}

.poems-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.poem-card {
  background: white;
  border: 1px solid #e1e8ed;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.poem-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.poem-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.poem-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.poem-dynasty {
  background: #ecf0f1;
  color: #7f8c8d;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.poem-content {
  font-size: 1rem;
  line-height: 1.6;
  color: #34495e;
  margin-bottom: 1rem;
  min-height: 3.2rem;
}

.poem-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.poet-name {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.view-details-btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.view-details-btn:hover {
  background: #2980b9;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .category-view {
    padding: 1rem;
  }

  .categories-grid {
    grid-template-columns: 1fr;
  }

  .poems-grid {
    grid-template-columns: 1fr;
  }

  .category-title {
    font-size: 2rem;
  }
}
</style>
