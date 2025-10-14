<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePoetryStore } from '@/stores/poetry'
import { useUserStore } from '@/stores/user'
import type { Poem } from '@/types/poetry'

const route = useRoute()
const router = useRouter()
const poetryStore = usePoetryStore()
const userStore = useUserStore()

const topicId = ref(route.params.id as string)
const topicPoems = ref<Poem[]>([])
const currentTopic = ref({
  id: '',
  title: '',
  description: '',
  count: 0
})

// 专题分类映射
const topicMap = {
  '1': { title: '边塞诗精选', description: '感受边塞将士的豪情壮志', tags: ['边塞', '战争', '豪情'] },
  '2': { title: '山水田园诗', description: '品味自然山水的宁静美好', tags: ['山水', '田园', '自然'] },
  '3': { title: '思乡怀人诗', description: '体会游子思乡的深切情感', tags: ['思乡', '怀人', '离别'] }
}

onMounted(async () => {
  await loadTopicData()
  userStore.recordActivity(`topic_${topicId.value}`, 'view')
})

const loadTopicData = async () => {
  // 设置专题信息
  const topicInfo = topicMap[topicId.value as keyof typeof topicMap]
  if (topicInfo) {
    currentTopic.value = {
      id: topicId.value,
      title: topicInfo.title,
      description: topicInfo.description,
      count: 0
    }
    
    // 根据专题标签搜索相关诗词
    const searchResults = await poetryStore.searchPoems({
      query: topicInfo.tags.join(' '),
      limit: 50
    })
    
    topicPoems.value = searchResults || []
    currentTopic.value.count = topicPoems.value.length
  }
}

const viewPoem = (poemId: string) => {
  userStore.recordActivity(poemId, 'view')
  router.push({ name: 'poem', params: { id: poemId } })
}

const backToHome = () => {
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="topic-view">
    <div class="container">
      <!-- 专题头部 -->
      <section class="topic-header">
        <button @click="backToHome" class="back-button">
          ← 返回首页
        </button>
        <div class="topic-info">
          <h1 class="topic-title">{{ currentTopic.title }}</h1>
          <p class="topic-description">{{ currentTopic.description }}</p>
          <div class="topic-stats">
            <span class="poem-count">{{ currentTopic.count }} 首诗</span>
          </div>
        </div>
      </section>

      <!-- 诗词列表 -->
      <section class="poems-section">
        <div class="poems-grid">
          <div
            v-for="poem in topicPoems"
            :key="poem.id"
            class="poem-card"
            @click="viewPoem(poem.id)"
          >
            <div class="poem-content">
              <h3 class="poem-title">{{ poem.title }}</h3>
              <p class="poem-author">{{ poem.poet?.name || '未知' }} · {{ poem.dynasty }}</p>
              <div class="poem-text">
                {{ poem.content }}
              </div>
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
            <button class="read-button" @click.stop="viewPoem(poem.id)">
              阅读全文
            </button>
          </div>
        </div>

        <div v-if="topicPoems.length === 0" class="empty-state">
          <p>暂无相关诗词</p>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.topic-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 40px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Topic Header */
.topic-header {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
  position: relative;
}

.back-button {
  background: #667eea;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 20px;
}

.back-button:hover {
  background: #5a6fd8;
}

.topic-title {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  font-family: 'SimSun', serif;
}

.topic-description {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.topic-stats {
  display: flex;
  gap: 20px;
}

.poem-count {
  background: #e3f2fd;
  color: #1976d2;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
}

/* Poems Section */
.poems-section {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.poems-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.poem-card {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.poem-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}

.poem-content {
  flex: 1;
}

.poem-title {
  font-size: 1.3rem;
  color: #2c3e50;
  margin-bottom: 8px;
  font-weight: 600;
}

.poem-author {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 12px;
}

.poem-text {
  color: #555;
  line-height: 1.6;
  margin-bottom: 16px;
  font-family: 'SimSun', serif;
  white-space: pre-line;
  max-height: 120px;
  overflow: hidden;
}

.poem-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
}

.read-button {
  background: #667eea;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
  font-weight: 600;
  transition: background 0.2s;
}

.read-button:hover {
  background: #5a6fd8;
}

.empty-state {
  text-align: center;
  padding: 60px;
  color: #666;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .topic-title {
    font-size: 2rem;
  }
  
  .poems-grid {
    grid-template-columns: 1fr;
  }
  
  .poem-card {
    padding: 20px;
  }
}
</style>