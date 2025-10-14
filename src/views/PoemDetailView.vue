<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePoetryStore } from '@/stores/poetry'
import { useUserStore } from '@/stores/user'
import { useAIStore } from '@/stores/ai'
import type { Poem } from '@/types/poetry'

const route = useRoute()
const poetryStore = usePoetryStore()
const userStore = useUserStore()
const aiStore = useAIStore()

const poem = ref<Poem | null>(null)
const relatedPoems = ref<Poem[]>([])
const showAIChat = ref(false)
const userQuestion = ref('')
const isPlayingAudio = ref(false)

const poemId = ref(route.params.id as string)

onMounted(async () => {
  await loadPoemData()
  userStore.recordActivity(poemId.value, 'view')
})

const loadPoemData = async () => {
  const foundPoem = poetryStore.getPoemById(poemId.value)
  if (foundPoem) {
    poem.value = foundPoem
    relatedPoems.value = poetryStore.getRelatedPoems(foundPoem)
    
    // 自动开始AI对话
    aiStore.startNewConversation(poemId.value, `关于《${foundPoem.title}》的探讨`)
  }
}

const toggleAIChat = () => {
  showAIChat.value = !showAIChat.value
}

const askAIQuestion = async () => {
  if (!userQuestion.value.trim()) return
  
  await aiStore.sendMessage(userQuestion.value, 'question')
  userQuestion.value = ''
}

const playAudio = () => {
  if (poem.value?.audioUrl) {
    isPlayingAudio.value = true
    // 实际项目中应该播放音频
    setTimeout(() => {
      isPlayingAudio.value = false
    }, 3000)
  }
}

const likePoem = () => {
  userStore.recordActivity(poemId.value, 'like')
  // 实际项目中应该更新后端
}

const sharePoem = () => {
  userStore.recordActivity(poemId.value, 'share')
  // 实际项目中应该调用分享API
}
</script>

<template>
  <div class="poem-detail-view" v-if="poem">
    <div class="container">
      <!-- 诗作基本信息 -->
      <section class="poem-header">
        <div class="poem-meta">
          <h1 class="poem-title">{{ poem.title }}</h1>
          <div class="poet-info">
            <span class="poet-name">{{ poem.poet?.name }}</span>
            <span class="dynasty">{{ poem.dynasty }}</span>
          </div>
        </div>
        
        <div class="action-buttons">
          <button @click="playAudio" class="audio-btn" :disabled="!poem.audioUrl">
            <span v-if="isPlayingAudio">⏹️</span>
            <span v-else>🔊</span>
            朗读
          </button>
          <button @click="likePoem" class="like-btn">❤️ 喜欢</button>
          <button @click="sharePoem" class="share-btn">📤 分享</button>
          <button @click="toggleAIChat" class="ai-chat-btn">
            🤖 与AI探讨
          </button>
        </div>
      </section>

      <!-- 诗作内容 -->
      <section class="poem-content">
        <div class="poem-text">
          <pre>{{ poem.content }}</pre>
        </div>
        
        <div v-if="poem.translation" class="translation">
          <h3>译文</h3>
          <p>{{ poem.translation }}</p>
        </div>
        
        <div v-if="poem.background" class="background">
          <h3>创作背景</h3>
          <p>{{ poem.background }}</p>
        </div>
      </section>

      <!-- 标签 -->
      <section class="poem-tags">
        <h3>标签</h3>
        <div class="tags-container">
          <span
            v-for="tag in poem.tags"
            :key="tag"
            class="tag"
          >
            {{ tag }}
          </span>
        </div>
      </section>

      <!-- AI聊天窗口 -->
      <section v-if="showAIChat" class="ai-chat-section">
        <div class="ai-chat-container">
          <h3>AI诗词助手</h3>
          <div class="chat-messages">
            <div
              v-for="message in aiStore.currentConversation?.messages"
              :key="message.id"
              :class="['message', message.role]"
            >
              <div class="message-content">
                {{ message.content }}
              </div>
              <div class="message-time">
                {{ message.timestamp.toLocaleTimeString() }}
              </div>
            </div>
          </div>
          
          <div class="chat-input">
            <input
              v-model="userQuestion"
              placeholder="向AI提问关于这首诗的问题..."
              @keyup.enter="askAIQuestion"
            />
            <button @click="askAIQuestion" :disabled="aiStore.isAnalyzing">
              {{ aiStore.isAnalyzing ? '思考中...' : '发送' }}
            </button>
          </div>
        </div>
      </section>

      <!-- 相关诗作 -->
      <section class="related-poems">
        <h3>相关诗作</h3>
        <div class="related-grid">
          <div
            v-for="relatedPoem in relatedPoems"
            :key="relatedPoem.id"
            class="related-poem-card"
          >
            <h4>{{ relatedPoem.title }}</h4>
            <p>{{ relatedPoem.poet?.name }} · {{ relatedPoem.dynasty }}</p>
            <p class="excerpt">{{ relatedPoem.content.substring(0, 40) }}...</p>
          </div>
        </div>
      </section>
    </div>
  </div>
  
  <div v-else class="loading">
    <p>加载中...</p>
  </div>
</template>

<style scoped>
.poem-detail-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 40px 0;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Poem Header */
.poem-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 40px;
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.poem-title {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  font-family: 'SimSun', serif;
}

.poet-info {
  display: flex;
  gap: 16px;
  align-items: center;
}

.poet-name {
  font-size: 1.2rem;
  color: #667eea;
  font-weight: 600;
}

.dynasty {
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.9rem;
}

.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.action-buttons button {
  padding: 10px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.action-buttons button:hover {
  background: #f8f9fa;
  transform: translateY(-1px);
}

.ai-chat-btn {
  background: #667eea !important;
  color: white !important;
  border-color: #667eea !important;
}

/* Poem Content */
.poem-content {
  background: white;
  padding: 40px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.poem-text pre {
  font-size: 1.4rem;
  line-height: 2;
  text-align: center;
  white-space: pre-wrap;
  font-family: 'SimSun', serif;
  margin-bottom: 30px;
}

.translation, .background {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.translation h3, .background h3 {
  color: #2c3e50;
  margin-bottom: 12px;
}

.translation p, .background p {
  line-height: 1.6;
  color: #555;
}

/* Tags */
.poem-tags {
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
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.9rem;
}

/* AI Chat */
.ai-chat-section {
  background: white;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 30px;
  border: 1px solid #e0e0e0;
}

.chat-messages {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 16px;
}

.message {
  margin-bottom: 16px;
  padding: 12px;
  border-radius: 8px;
}

.message.user {
  background: #e3f2fd;
  margin-left: 40px;
}

.message.assistant {
  background: #f5f5f5;
  margin-right: 40px;
}

.message-content {
  line-height: 1.4;
}

.message-time {
  font-size: 0.8rem;
  color: #666;
  margin-top: 4px;
}

.chat-input {
  display: flex;
  gap: 8px;
}

.chat-input input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.chat-input button {
  padding: 8px 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* Related Poems */
.related-poems {
  background: white;
  padding: 24px;
  border-radius: 8px;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.related-poem-card {
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.related-poem-card:hover {
  border-color: #667eea;
  transform: translateY(-2px);
}

.related-poem-card h4 {
  color: #2c3e50;
  margin-bottom: 8px;
}

.related-poem-card p {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 8px;
}

.excerpt {
  color: #888 !important;
  font-size: 0.8rem !important;
}

.loading {
  text-align: center;
  padding: 60px;
  font-size: 1.2rem;
  color: #666;
}

@media (max-width: 768px) {
  .poem-header {
    flex-direction: column;
    gap: 20px;
  }
  
  .poem-title {
    font-size: 2rem;
  }
  
  .action-buttons {
    justify-content: center;
  }
  
  .related-grid {
    grid-template-columns: 1fr;
  }
}

/* 深色主题样式 */
.dark-theme .poem-detail-view {
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
}

.dark-theme .poem-header,
.dark-theme .poem-content,
.dark-theme .poem-tags,
.dark-theme .ai-chat-section,
.dark-theme .related-poems {
  background: var(--bg-card);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.dark-theme .poem-title {
  color: var(--text-primary);
}

.dark-theme .poet-name {
  color: var(--accent-color);
}

.dark-theme .dynasty {
  background: var(--bg-secondary);
  color: var(--accent-color);
}

.dark-theme .action-buttons button {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-color: var(--border-color);
}

.dark-theme .action-buttons button:hover {
  background: var(--border-color);
}

.dark-theme .ai-chat-btn {
  background: var(--accent-color) !important;
  border-color: var(--accent-color) !important;
}

.dark-theme .poem-text pre {
  color: var(--text-primary);
}

.dark-theme .translation h3,
.dark-theme .background h3,
.dark-theme .poem-tags h3,
.dark-theme .related-poems h3 {
  color: var(--text-primary);
}

.dark-theme .translation p,
.dark-theme .background p {
  color: var(--text-secondary);
}

.dark-theme .translation,
.dark-theme .background {
  border-top-color: var(--border-color);
}

.dark-theme .tag {
  background: var(--bg-secondary);
  color: var(--accent-color);
}

.dark-theme .chat-messages {
  background: var(--bg-secondary);
}

.dark-theme .message.user {
  background: var(--bg-primary);
}

.dark-theme .message.assistant {
  background: var(--bg-secondary);
}

.dark-theme .message-content {
  color: var(--text-primary);
}

.dark-theme .message-time {
  color: var(--text-muted);
}

.dark-theme .chat-input input {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-color: var(--border-color);
}

.dark-theme .chat-input button {
  background: var(--accent-color);
}

.dark-theme .related-poem-card {
  background: var(--bg-secondary);
  border-color: var(--border-color);
  color: var(--text-primary);
}

.dark-theme .related-poem-card:hover {
  border-color: var(--accent-color);
}

.dark-theme .related-poem-card h4 {
  color: var(--text-primary);
}

.dark-theme .related-poem-card p {
  color: var(--text-secondary);
}

.dark-theme .excerpt {
  color: var(--text-muted) !important;
}

.dark-theme .loading {
  color: var(--text-secondary);
}
</style>