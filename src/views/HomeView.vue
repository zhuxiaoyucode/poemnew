<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePoetryStore } from '@/stores/poetry'

const router = useRouter()
const poetryStore = usePoetryStore()

// 加载状态
const isLoading = ref(true)
const error = ref('')

// 真实的诗歌类型数据（从数据库获取）
const categories = ref([
  {
    id: 1,
    name: '思乡诗',
    count: 0,
    color: '#8b5a2b',
    icon: '🏠',
    description: '表达对故乡、亲人的思念之情',
  },
  {
    id: 2,
    name: '山水诗',
    count: 0,
    color: '#4a90e2',
    icon: '⛰️',
    description: '描写自然山水风光',
  },
  { id: 3, name: '送别诗', count: 0, color: '#d0021b', icon: '👋', description: '表达离别之情' },
  { id: 4, name: '爱国诗', count: 0, color: '#ff6b6b', icon: '🇨🇳', description: '表达爱国情怀' },
  {
    id: 5,
    name: '田园诗',
    count: 0,
    color: '#4ecdc4',
    icon: '🌾',
    description: '描写田园生活和自然风光',
  },
  { id: 6, name: '爱情诗', count: 0, color: '#ff9ff3', icon: '💕', description: '表达爱情情感' },
  {
    id: 7,
    name: '边塞诗',
    count: 0,
    color: '#ff9f43',
    icon: '⚔️',
    description: '描写边塞生活和战争',
  },
  { id: 8, name: '哲理诗', count: 0, color: '#2bcbba', icon: '💭', description: '蕴含人生哲理' },
])

const featuredPoems = ref([
  {
    id: '1',
    title: '静夜思',
    author: '李白',
    dynasty: '唐代',
    excerpt: '床前明月光，疑是地上霜。举头望明月，低头思故乡。',
    tags: ['思乡', '月亮', '夜晚'],
  },
  {
    id: '2',
    title: '春晓',
    author: '孟浩然',
    dynasty: '唐代',
    excerpt: '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。',
    tags: ['春天', '自然', '生活'],
  },
  {
    id: '3',
    title: '登鹳雀楼',
    author: '王之涣',
    dynasty: '唐代',
    excerpt: '白日依山尽，黄河入海流。欲穷千里目，更上一层楼。',
    tags: ['登高', '壮丽', '哲理'],
  },
])

const navigateToCategory = (categoryId: number) => {
  router.push({ name: 'categories', query: { typeId: categoryId } })
}

const navigateToPoem = (poemId: string) => {
  router.push({ name: 'poem', params: { id: poemId } })
}

const navigateToCategories = () => {
  router.push({ name: 'categories' })
}

const navigateToSearch = () => {
  // 跳转到搜索页面并显示所有诗歌
  router.push({
    name: 'search',
    query: { q: '', showAll: 'true' },
  })
}

const navigateToRegister = () => {
  router.push({ name: 'register' })
}

// 初始化数据
const initializeData = async () => {
  try {
    error.value = ''
    await poetryStore.initializeData()

    // 更新分类数据
    const realCategories = poetryStore.categories.slice(0, 8) // 取前8个分类
    categories.value = realCategories.map((cat) => ({
      ...cat,
      icon: getCategoryIcon(cat.name),
      description: cat.description || '探索该主题的诗词作品',
    }))
  } catch (err: any) {
    console.error('初始化数据失败:', err)
    error.value = err.message || '数据加载失败，请稍后重试'
  } finally {
    isLoading.value = false
  }
}

// 重试函数
const retry = () => {
  error.value = ''
  isLoading.value = true
  initializeData()
}

// 获取分类图标
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

onMounted(async () => {
  console.log('诗词网站首页加载完成')
  await initializeData()
})
</script>

<template>
  <div class="home-view">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>正在加载...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-container">
      <div class="error-icon">⚠️</div>
      <h3>加载失败</h3>
      <p>{{ error }}</p>
      <button @click="retry" class="btn-primary">重试</button>
    </div>

    <!-- 内容区域 -->
    <div v-else>
      <!-- 英雄区域 -->
      <section class="hero-section">
        <div class="container">
          <div class="hero-content">
            <h1 class="hero-title">品味千年诗意<br />探索文化瑰宝</h1>
            <p class="hero-subtitle">
              诗海寻梦带您领略中华诗词的博大精深，从古典诗词中汲取智慧，感受文字之美
            </p>
            <div class="hero-actions">
              <button class="btn-primary" @click="navigateToSearch">开始探索</button>
              <button class="btn-secondary" @click="navigateToRegister">加入我们</button>
            </div>
          </div>
        </div>
      </section>

      <!-- 诗歌分类 -->
      <section id="categories" class="categories-section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">诗歌分类</h2>
            <button class="view-all-btn" @click="navigateToCategories">查看全部分类</button>
          </div>
          <p class="section-subtitle">按主题探索不同风格的诗词作品</p>

          <div class="categories-grid">
            <div
              v-for="category in categories.slice(0, 8)"
              :key="category.id"
              class="category-card"
              :style="{
                backgroundColor: category.color + '20',
                borderColor: category.color,
              }"
              @click="navigateToCategory(category.id)"
            >
              <div class="category-icon" :style="{ color: category.color }">
                <span class="icon">{{ category.icon }}</span>
              </div>
              <div class="category-info">
                <h3 class="category-name">{{ category.name }}</h3>
                <p class="category-description">{{ category.description }}</p>
                <span class="category-count">{{ category.count }} 首</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 诗歌精选 -->
      <section id="featured" class="featured-section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">诗歌精选</h2>
            <button class="view-all-btn" @click="navigateToSearch">查看全部</button>
          </div>

          <div class="poems-grid">
            <div
              v-for="poem in featuredPoems"
              :key="poem.id"
              class="poem-card"
              @click="navigateToPoem(poem.id)"
            >
              <div class="poem-header">
                <h3 class="poem-title">{{ poem.title }}</h3>
                <div class="poem-meta">
                  <span class="poem-author">{{ poem.author }}</span>
                  <span class="poem-dynasty">{{ poem.dynasty }}</span>
                </div>
              </div>
              <div class="poem-content">
                <p class="poem-excerpt">{{ poem.excerpt }}</p>
              </div>
              <div class="poem-tags">
                <span v-for="tag in poem.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  min-height: calc(100vh - 80px);
  background: #f8f9fa;
  color: #2c3e50;
  font-family: 'SimSun', serif;
  width: 100%;
  margin-top: 80px; /* 为AppHeader留出空间 */
}

.container {
  width: 100%;
  max-width: 1200px;
  padding: 0 2rem;
  margin: 0 auto;
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #8b5a2b;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.loading-container p {
  color: #666;
  font-size: 1.1rem;
}

/* 错误状态 */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 2rem;
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.error-container h3 {
  color: #d32f2f;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.error-container p {
  color: #666;
  margin-bottom: 2rem;
  font-size: 1.1rem;
  max-width: 400px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 英雄区域 */
.hero-section {
  padding: 120px 0 80px;
  background: linear-gradient(135deg, #f5f5dc 0%, #d2b48c 100%);
  text-align: center;
}

.hero-container {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  color: #8b5a2b;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

.hero-subtitle {
  font-size: 1.3rem;
  color: #2c3e50;
  margin-bottom: 2.5rem;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* 使用全局样式，移除重复定义 */

/* 分类区域 */
.categories-section {
  padding: 100px 0;
  background: white;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  color: #8b5a2b;
  margin-bottom: 1.5rem;
}

.section-subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 4rem;
  font-size: 1.1rem;
  line-height: 1.6;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.category-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid;
  display: flex;
  align-items: center;
  gap: 1rem;
  min-height: 100px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.category-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.category-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.category-card:hover .category-icon {
  transform: scale(1.1);
}

.category-info {
  flex: 1;
  text-align: left;
}

.category-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.3rem;
}

.category-description {
  font-size: 0.85rem;
  color: #7f8c8d;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.category-count {
  color: #95a5a6;
  font-size: 0.8rem;
  font-weight: 500;
}

/* 精选诗歌 */
.featured-section {
  padding: 80px 0;
  background: #f8f9fa;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.view-all-btn {
  background: #8b5a2b;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.view-all-btn:hover {
  background: #7a4a1f;
}

.poems-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.poem-card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.poem-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
}

.poem-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.poem-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.poem-author,
.poem-dynasty {
  color: #666;
  font-size: 0.9rem;
}

.poem-excerpt {
  color: #555;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.poem-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.2rem 0.5rem;
  border-radius: 0.3rem;
  font-size: 0.8rem;
}

/* 页脚 */
.footer {
  background: #2c3e50;
  color: white;
  padding: 60px 0 20px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto 3rem;
}

.footer-section h3,
.footer-section h4 {
  margin-bottom: 1rem;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul li {
  margin-bottom: 0.5rem;
}

.footer-section a {
  color: #bdc3c7;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-section a:hover {
  color: white;
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid #34495e;
  max-width: 1200px;
  margin: 0 auto;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .categories-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }

  .poems-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .poems-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .category-card {
    min-height: 80px;
    padding: 1rem;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .hero-actions .btn-primary,
  .hero-actions .btn-secondary {
    width: 200px;
  }
}

@media (max-width: 480px) {
  .categories-grid {
    grid-template-columns: 1fr;
  }

  .hero-title {
    font-size: 2rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .container {
    padding: 0 1rem;
  }

  .hero-section {
    padding: 80px 0 60px;
  }

  .categories-section {
    padding: 60px 0;
  }

  .featured-section {
    padding: 60px 0;
  }
}

/* 深色主题下的错误状态 */
.dark-theme .error-container h3 {
  color: #ff6b6b;
}

.dark-theme .error-container p {
  color: var(--text-secondary);
}
</style>
