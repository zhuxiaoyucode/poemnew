<template>
  <div class="about-view">
    <div class="container">
      <!-- 页面标题 -->
      <section class="page-header">
        <h1 class="page-title">关于诗海寻梦</h1>
        <p class="page-subtitle">传承中华诗词文化，探索古典文学之美</p>
      </section>

      <!-- 项目介绍 -->
      <section class="about-content">
        <div class="content-card">
          <h2>项目简介</h2>
          <p>
            诗海寻梦是一个致力于传承和推广中华古典诗词文化的在线平台。我们汇集了从先秦到清代的经典诗词作品，为诗词爱好者提供学习、欣赏和交流的空间。
          </p>
        </div>

        <div class="content-card">
          <h2>我们的使命</h2>
          <p>让古典诗词在现代社会中焕发新的生命力，让更多人了解和喜爱中华优秀传统文化。</p>
        </div>

        <div class="content-card">
          <h2>特色功能</h2>
          <ul class="feature-list">
            <li>📚 丰富的诗词库 - 涵盖各个朝代的经典作品</li>
            <li>🤖 AI诗词助手 - 智能解读和赏析</li>
            <li>🎵 诗词朗读 - 感受诗词的音韵之美</li>
            <li>📖 创作背景 - 深入了解诗词背后的故事</li>
            <li>💝 个性化推荐 - 根据兴趣发现更多好诗</li>
          </ul>
        </div>

        <div class="content-card">
          <h2>联系我们</h2>
          <p>如果您有任何建议或合作意向，欢迎通过以下方式联系我们：</p>
          <div class="contact-info">
            <p>📧 邮箱：contact@shihai.com</p>
            <p>📱 微信：shihai-xunmeng</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.about-view {
  min-height: 100vh;
  background: var(--bg-primary);
  color: var(--text-primary);
  padding: 2rem 0;
}

.container {
  width: 100%;
  max-width: none;
  padding: 0 2rem;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem 0;
}

.page-title {
  font-size: 3rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
  font-family: 'SimSun', serif;
  font-weight: 600;
}

.page-subtitle {
  font-size: 1.2rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.about-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.content-card {
  background: var(--bg-card);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-color);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.content-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.content-card h2 {
  font-size: 1.5rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
  font-family: 'SimSun', serif;
  border-bottom: 2px solid var(--accent-color);
  padding-bottom: 0.5rem;
}

.content-card p {
  line-height: 1.6;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.feature-list {
  list-style: none;
  padding: 0;
}

.feature-list li {
  padding: 0.5rem 0;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-color);
}

.feature-list li:last-child {
  border-bottom: none;
}

.contact-info {
  margin-top: 1rem;
}

.contact-info p {
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .about-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .content-card {
    padding: 1.5rem;
  }
}
</style>
