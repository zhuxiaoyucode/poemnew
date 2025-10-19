<template>
  <div class="chat-panel">
    <div class="messages">
      <div v-for="m in conversation?.messages || []" :key="m.id" class="message" :class="m.role">
        <div class="meta">
          <span class="role">{{ m.role === 'user' ? '我' : '助手' }}</span>
          <span class="time">{{ formatTime(m.timestamp) }}</span>
        </div>
        <pre class="content">{{ m.content }}</pre>
      </div>
      <div v-if="isAnalyzing" class="loading">正在分析...</div>
    </div>

    <form class="input-bar" @submit.prevent="onSend">
      <input v-model="input" type="text" placeholder="例如：阅读《静夜思》 或 赏析《静夜思》" />
      <button :disabled="!input.trim()" type="submit">发送</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAIStore } from '@/stores/ai'

const ai = useAIStore()
const input = ref('')
const conversation = computed(() => ai.currentConversation)
const isAnalyzing = computed(() => ai.isAnalyzing)

if (!conversation.value) {
  ai.startNewConversation(undefined, '诗歌问答')
}

const onSend = async () => {
  const text = input.value.trim()
  if (!text) return
  await ai.sendMessage(text, 'question')
  input.value = ''
}

const formatTime = (d: Date) => {
  try {
    return new Date(d).toLocaleString()
  } catch {
    return ''
  }
}
</script>

<style scoped>
.chat-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 12px;
}
.messages {
  flex: 1;
  overflow: auto;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 12px;
  background: #fff;
}
.message {
  margin-bottom: 12px;
}
.message.user .content {
  background: #f0f9ff;
}
.message.assistant .content {
  background: #f9f9f9;
}
.meta {
  font-size: 12px;
  color: #888;
  margin-bottom: 4px;
}
.content {
  white-space: pre-wrap;
  padding: 8px;
  border-radius: 6px;
}
.input-bar {
  display: flex;
  gap: 8px;
}
input {
  flex: 1;
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
}
button {
  padding: 8px 12px;
  border: none;
  background: #4a90e2;
  color: white;
  border-radius: 6px;
  cursor: pointer;
}
button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
.loading {
  color: #999;
  font-size: 13px;
}
</style>
