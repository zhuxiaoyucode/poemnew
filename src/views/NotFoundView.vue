<template>
  <div class="container not-found">
    <h1>404</h1>
    <p>抱歉，页面未找到。</p>
    <router-link to="/" class="btn btn-primary">返回首页</router-link>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.not-found {
  min-height: 50vh;
  display: grid;
  place-items: center;
  text-align: center;
  gap: 12px;
}
h1 {
  font-size: 48px;
  color: #8b5a2b;
}
</style>
