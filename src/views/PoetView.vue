<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePoetryStore } from '@/stores/poetry'
import { useUserStore } from '@/stores/user'
import type { Poet, Poem } from '@/types/poetry'

const route = useRoute()
const router = useRouter()
const poetryStore = usePoetryStore()
const userStore = useUserStore()

const poet = ref<Poet | null>(null)
const poetPoems = ref<Poem[]>([])
const isLoading = ref(false)

const poetId = ref(route.params.id as string)

onMounted(async () => {
  await loadPoetData()
})

const loadPoetData = async () => {
  isLoading.value = true
  try {
    const foundPoet = await poetryStore.getPoetById(poetId.value)
    if (foundPoet) {
      poet.value = foundPoet

      // 使用 Set 来去重，确保每首诗只显示一次
      const uniquePoems = new Map()
      poetryStore.poems.forEach((poem) => {
        // 修复诗人ID匹配问题：使用诗人姓名匹配而不是ID匹配
        if (poem.poet?.name === poet.value?.name && !uniquePoems.has(poem.id)) {
          uniquePoems.set(poem.id, poem)
        }
      })

      poetPoems.value = Array.from(uniquePoems.values())
    }
  } finally {
    isLoading.value = false
  }
}

const viewPoem = (poemId: string) => {
  userStore.recordActivity(poemId, 'view')
  router.push({ name: 'poem', params: { id: poemId } })
}
</script>

<template>
  <div class="poet-view" v-if="poet && !isLoading">
    <div class="container">
      <!-- 诗人基本信息 -->
      <section class="poet-header">
        <div class="poet-avatar">
          {{ poet.name.charAt(0) }}
        </div>
        <div class="poet-info">
          <h1 class="poet-name">{{ poet.name }}</h1>
          <div class="poet-meta">
            <span class="dynasty">{{ poet.dynasty }}</span>
            <span class="poem-count">{{ poetPoems.length }} 首诗作</span>
          </div>
          <p class="poet-biography">{{ poet.biography }}</p>
        </div>
      </section>

      <!-- 诗人标签 -->
      <section class="poet-tags" v-if="poet.tags.length > 0">
        <h3>风格标签</h3>
        <div class="tags-container">
          <span v-for="tag in poet.tags" :key="tag" class="tag">
            {{ tag }}
          </span>
        </div>
      </section>

      <!-- 诗作列表 -->
      <section class="poems-section">
        <h2 class="section-title">{{ poet.name }}的诗作</h2>
        <div class="poems-grid">
          <div
            v-for="poem in poetPoems"
            :key="poem.id"
            class="poem-card"
            @click="viewPoem(poem.id)"
          >
            <h4 class="poem-title">{{ poem.title }}</h4>
            <p class="poem-excerpt">{{ poem.content.substring(0, 60) }}...</p>
            <div class="poem-meta">
              <span class="dynasty">{{ poem.dynasty }}</span>
              <div class="poem-tags">
                <span v-for="tag in poem.tags.slice(0, 2)" :key="tag" class="tag">
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 相关诗人推荐 -->
      <section class="related-poets" v-if="poetryStore.poets.length > 1">
        <h3>同时代诗人</h3>
        <div class="poets-grid">
          <div
            v-for="relatedPoet in poetryStore.poets.filter(
              (p) => p.name !== poet?.name && p.dynasty === (poet?.dynasty || ''),
            )"
            :key="relatedPoet.id"
            class="poet-card"
          >
            <div class="poet-avatar-small">
              {{ relatedPoet.name.charAt(0) }}
            </div>
            <h4>{{ relatedPoet.name }}</h4>
            <p>{{ relatedPoet.dynasty }}</p>
          </div>
        </div>
      </section>
    </div>
  </div>

  <div v-else-if="isLoading" class="loading">
    <p>加载中...</p>
  </div>

  <div v-else class="not-found">
    <p>诗人信息未找到</p>
  </div>
</template>

<style scoped>
.poet-view {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 2rem 0;
}

.container {
  width: 100%;
  max-width: none;
  margin: 0 auto;
  padding: 0 2rem;
}

/* 诗人头部 */
.poet-header {
  display: flex;
  gap: 30px;
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.poet-avatar {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: 700;
  flex-shrink: 0;
}

.poet-info {
  flex: 1;
}

.poet-name {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  font-family: 'SimSun', serif;
}

.poet-meta {
  display: flex;
  gap: 20px;
  align-items: center;
  margin-bottom: 1.5rem;
}

.dynasty {
  background: #e3f2fd;
  color: #1976d2;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.9rem;
  font-weight: 500;
}

.poem-count {
  color: #666;
  font-size: 0.9rem;
}

.poet-biography {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #555;
}

/* 标签 */
.poet-tags {
  background: white;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.tags-container {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.9rem;
}

/* 诗作列表 */
.poems-section {
  background: white;
  padding: 30px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.section-title {
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  text-align: center;
}

.poems-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.poem-card {
  padding: 20px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.poem-card:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.poem-title {
  font-size: 1.2rem;
  color: #2c3e50;
  margin-bottom: 8px;
  font-weight: 600;
}

.poem-excerpt {
  color: #666;
  line-height: 1.6;
  margin-bottom: 12px;
}

.poem-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.poem-tags {
  display: flex;
  gap: 4px;
}

/* 相关诗人 */
.related-poets {
  background: white;
  padding: 24px;
  border-radius: 8px;
}

.poets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.poet-card {
  text-align: center;
  padding: 20px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.poet-card:hover {
  border-color: #667eea;
}

.poet-avatar-small {
  width: 50px;
  height: 50px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin: 0 auto 12px;
}

.poet-card h4 {
  color: #2c3e50;
  margin-bottom: 4px;
}

.poet-card p {
  color: #666;
  font-size: 0.9rem;
}

/* 加载和错误状态 */
.loading,
.not-found {
  text-align: center;
  padding: 60px;
  font-size: 1.2rem;
  color: #666;
}

@media (max-width: 768px) {
  .poet-header {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }

  .poet-name {
    font-size: 2rem;
  }

  .poems-grid {
    grid-template-columns: 1fr;
  }

  .poet-meta {
    justify-content: center;
  }
}

/* 深色主题样式 */
.dark-theme .poet-view {
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
}

.dark-theme .poet-header,
.dark-theme .poet-tags,
.dark-theme .poems-section,
.dark-theme .related-poets {
  background: var(--bg-card);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.dark-theme .poet-name {
  color: var(--text-primary);
}

.dark-theme .dynasty {
  background: var(--bg-secondary);
  color: var(--accent-color);
}

.dark-theme .poem-count {
  color: var(--text-secondary);
}

.dark-theme .poet-biography {
  color: var(--text-secondary);
}

.dark-theme .tag {
  background: var(--bg-secondary);
  color: var(--accent-color);
}

.dark-theme .section-title {
  color: var(--text-primary);
}

.dark-theme .poem-card {
  background: var(--bg-secondary);
  border-color: var(--border-color);
  color: var(--text-primary);
}

.dark-theme .poem-card:hover {
  border-color: var(--accent-color);
}

.dark-theme .poem-title {
  color: var(--text-primary);
}

.dark-theme .poem-excerpt {
  color: var(--text-secondary);
}

.dark-theme .poet-card {
  background: var(--bg-secondary);
  border-color: var(--border-color);
  color: var(--text-primary);
}

.dark-theme .poet-card:hover {
  border-color: var(--accent-color);
}

.dark-theme .poet-card h4 {
  color: var(--text-primary);
}

.dark-theme .poet-card p {
  color: var(--text-secondary);
}

.dark-theme .loading,
.dark-theme .not-found {
  color: var(--text-secondary);
}
</style>
