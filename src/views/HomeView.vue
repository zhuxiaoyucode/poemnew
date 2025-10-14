<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePoetryStore } from '@/stores/poetry'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const poetryStore = usePoetryStore()
const userStore = useUserStore()

const searchQuery = ref('')
const featuredPoems = ref(poetryStore.featuredPoems)
const popularPoets = ref(poetryStore.popularPoets)

const dailyPoem = ref({
  id: '1',
  title: '静夜思',
  content: '床前明月光，疑是地上霜。举头望明月，低头思故乡。',
  poet: '李白',
  dynasty: '唐'
})

const specialTopics = ref([
  { id: 1, title: '边塞诗精选', description: '感受边塞将士的豪情壮志', count: 15 },
  { id: 2, title: '山水田园诗', description: '品味自然山水的宁静美好', count: 20 },
  { id: 3, title: '思乡怀人诗', description: '体会游子思乡的深切情感', count: 18 }
])

const handleSearch = async () => {
  if (searchQuery.value.trim()) {
    await poetryStore.searchPoems({ query: searchQuery.value })
    // 跳转到搜索结果页面
    router.push({
      name: 'search',
      query: { q: searchQuery.value }
    })
  }
}

const viewPoem = (poemId: string) => {
  userStore.recordActivity(poemId, 'view')
  // 跳转到诗作详情页
  router.push({ name: 'poem', params: { id: poemId } })
}

const viewTopic = (topicId: string) => {
  userStore.recordActivity(`topic_${topicId}`, 'view')
  // 跳转到专题详情页
  router.push({ name: 'topic', params: { id: topicId } })
}

const viewPoet = (poetId: string) => {
  userStore.recordActivity(`poet_${poetId}`, 'view')
  // 跳转到诗人详情页
  router.push({ name: 'poet', params: { id: poetId } })
}

onMounted(() => {
  // 初始化数据
  poetryStore.searchPoems({ limit: 10 })
})
</script>

<template>
  <div class="home-view">
    <!-- 顶部搜索区域 -->
    <section class="hero-section">
      <div class="container">
        <h1 class="hero-title">诗海寻梦</h1>
        <p class="hero-subtitle">AI赋能的诗词赏析平台</p>
        
        <div class="search-container">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索诗词、诗人或主题..."
            class="search-input"
            @keyup.enter="handleSearch"
          />
          <button @click="handleSearch" class="search-button">
            <span class="search-icon">🔍</span>
            搜索
          </button>
        </div>
      </div>
    </section>

    <!-- 每日一诗 -->
    <section class="daily-poem-section">
      <div class="container">
        <h2 class="section-title">今日推荐</h2>
        <div class="daily-poem-card">
          <div class="poem-content">
            <h3 class="poem-title">{{ dailyPoem.title }}</h3>
            <p class="poem-author">{{ dailyPoem.poet }} · {{ dailyPoem.dynasty }}</p>
            <div class="poem-text">
              {{ dailyPoem.content }}
            </div>
            <button @click="viewPoem(dailyPoem.id)" class="read-more-btn">
              阅读全文
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 专题策划 -->
    <section class="topics-section">
      <div class="container">
        <h2 class="section-title">专题策划</h2>
        <div class="topics-grid">
          <div
            v-for="topic in specialTopics"
            :key="topic.id"
            class="topic-card"
            @click="viewTopic(topic.id.toString())"
          >
            <h4 class="topic-title">{{ topic.title }}</h4>
            <p class="topic-description">{{ topic.description }}</p>
            <span class="topic-count">{{ topic.count }}首诗</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 热门诗作 -->
    <section class="featured-poems-section">
      <div class="container">
        <h2 class="section-title">热门诗作</h2>
        <div class="poems-grid">
          <div
            v-for="poem in featuredPoems"
            :key="poem.id"
            class="poem-card"
            @click="viewPoem(poem.id)"
          >
            <h4 class="poem-card-title">{{ poem.title }}</h4>
            <p class="poem-card-author">{{ poem.poet?.name || '未知' }} · {{ poem.dynasty }}</p>
            <p class="poem-card-excerpt">
              {{ poem.content.substring(0, 30) }}...
            </p>
            <div class="poem-tags">
              <span
                v-for="tag in poem.tags.slice(0, 2)"
                :key="tag"
                class="tag"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 热门诗人 -->
    <section class="popular-poets-section">
      <div class="container">
        <h2 class="section-title">热门诗人</h2>
        <div class="poets-grid">
          <div
            v-for="poet in popularPoets"
            :key="poet.id"
            class="poet-card"
            @click="viewPoet(poet.id)"
          >
            <div class="poet-avatar">
              {{ poet.name.charAt(0) }}
            </div>
            <h4 class="poet-name">{{ poet.name }}</h4>
            <p class="poet-dynasty">{{ poet.dynasty }}</p>
            <p class="poet-bio">{{ poet.biography.substring(0, 50) }}...</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 80px 0;
  text-align: center;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  font-family: 'SimSun', serif;
}

.hero-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 2rem;
}

.search-container {
  display: flex;
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  gap: 10px;
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
}

.search-button {
  padding: 12px 24px;
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-button:hover {
  background: #ff5252;
}

/* Sections */
.section-title {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 2rem;
  color: #2c3e50;
  font-family: 'SimSun', serif;
}

/* Daily Poem */
.daily-poem-section {
  padding: 80px 0;
  background: white;
}

.daily-poem-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px;
  border-radius: 16px;
  text-align: center;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
}

.poem-title {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.poem-author {
  opacity: 0.8;
  margin-bottom: 2rem;
}

.poem-text {
  font-size: 1.2rem;
  line-height: 2;
  margin-bottom: 2rem;
  white-space: pre-line;
}

.read-more-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
}

.read-more-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Topics */
.topics-section {
  padding: 80px 0;
  background: #f8f9fa;
}

.topics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
  justify-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.topic-card {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;
  width: 100%;
  max-width: 350px;
  margin: 0 auto;
}

.topic-card:hover {
  transform: translateY(-2px);
}

.topic-title {
  font-size: 1.2rem;
  margin-bottom: 8px;
  color: #2c3e50;
}

.topic-description {
  color: #666;
  margin-bottom: 12px;
}

.topic-count {
  color: #667eea;
  font-size: 0.9rem;
}

/* Poems Grid */
.featured-poems-section {
  padding: 80px 0;
  background: white;
}

.poems-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
  justify-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.poem-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #e9ecef;
  width: 100%;
  max-width: 350px;
  margin: 0 auto;
}

.poem-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.poem-card-title {
  font-size: 1.1rem;
  margin-bottom: 8px;
  color: #2c3e50;
}

.poem-card-author {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 12px;
}

.poem-card-excerpt {
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

/* Poets Grid */
.popular-poets-section {
  padding: 80px 0;
  background: #f8f9fa;
}

.poets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  justify-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.poet-card {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
}

.poet-avatar {
  width: 60px;
  height: 60px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin: 0 auto 16px;
}

.poet-name {
  font-size: 1.2rem;
  margin-bottom: 4px;
  color: #2c3e50;
}

.poet-dynasty {
  color: #666;
  margin-bottom: 12px;
  font-size: 0.9rem;
}

.poet-bio {
  color: #555;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .search-container {
    flex-direction: column;
  }
  
  .topics-grid,
  .poems-grid,
  .poets-grid {
    grid-template-columns: 1fr;
    padding: 0 16px;
  }
  
  .container {
    padding: 0 16px;
  }
  
  .daily-poem-card {
    padding: 40px 20px;
  }
  
  .topic-card,
  .poem-card,
  .poet-card {
    max-width: 100%;
  }
}

/* 深色主题样式 */
.dark-theme .home-view {
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
}

.dark-theme .hero-section {
  background: linear-gradient(135deg, var(--accent-color) 0%, var(--accent-hover) 100%);
}

.dark-theme .section-title {
  color: var(--text-primary);
}

.dark-theme .daily-poem-section,
.dark-theme .featured-poems-section {
  background: var(--bg-primary);
}

.dark-theme .topics-section,
.dark-theme .popular-poets-section {
  background: var(--bg-secondary);
}

.dark-theme .topic-card,
.dark-theme .poem-card,
.dark-theme .poet-card {
  background: var(--bg-card);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.dark-theme .topic-card:hover,
.dark-theme .poem-card:hover {
  border-color: var(--accent-color);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.dark-theme .topic-title,
.dark-theme .poem-card-title,
.dark-theme .poet-name,
.dark-theme .poem-title {
  color: var(--text-primary);
}

.dark-theme .topic-description,
.dark-theme .poem-card-author,
.dark-theme .poet-dynasty,
.dark-theme .poem-card-excerpt,
.dark-theme .poet-bio,
.dark-theme .poem-author {
  color: var(--text-secondary);
}

.dark-theme .topic-count {
  color: var(--accent-color);
}

.dark-theme .tag {
  background: var(--bg-secondary);
  color: var(--accent-color);
}

.dark-theme .daily-poem-card {
  background: linear-gradient(135deg, var(--accent-color) 0%, var(--accent-hover) 100%);
}

.dark-theme .read-more-btn {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: var(--text-primary);
}

.dark-theme .read-more-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.dark-theme .search-input {
  background: var(--bg-card);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.dark-theme .search-input::placeholder {
  color: var(--text-secondary);
}

.dark-theme .search-button {
  background: var(--accent-color);
  color: var(--text-primary);
}

.dark-theme .search-button:hover {
  background: var(--accent-hover);
}

.dark-theme .poet-avatar {
  background: var(--accent-color);
  color: var(--text-primary);
}
</style>