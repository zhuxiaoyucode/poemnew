<template>
  <div class="chat-view">
    <h2>诗歌问答</h2>
    <ChatPanel />
  </div>
</template>

<script setup lang="ts">
import ChatPanel from '@/components/ai/ChatPanel.vue'
</script>

<style scoped>
.chat-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 16px;
}
</style>
