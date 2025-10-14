<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="app-footer">
    <div class="container">
      <div class="footer-content">
        <!-- 网站信息 -->
        <div class="footer-section">
          <div class="footer-logo">
            <span class="logo-icon">📚</span>
            <span class="logo-text">诗海寻梦</span>
          </div>
          <p class="footer-description">
            AI赋能的诗词赏析平台，让古典诗词在数字时代焕发新的生命力
          </p>
          <div class="social-links">
            <a href="#" class="social-link">📱</a>
            <a href="#" class="social-link">📧</a>
            <a href="#" class="social-link">🐦</a>
          </div>
        </div>

        <!-- 快速链接 -->
        <div class="footer-section">
          <h4 class="section-title">快速导航</h4>
          <ul class="footer-links">
            <li><router-link to="/" class="footer-link">首页</router-link></li>
            <li><router-link to="/search" class="footer-link">探索诗词</router-link></li>
            <li><router-link to="/search?tag=唐诗" class="footer-link">唐诗精选</router-link></li>
            <li><router-link to="/search?tag=宋词" class="footer-link">宋词精选</router-link></li>
          </ul>
        </div>

        <!-- 诗人分类 -->
        <div class="footer-section">
          <h4 class="section-title">热门诗人</h4>
          <ul class="footer-links">
            <li><router-link to="/poet/李白" class="footer-link">李白</router-link></li>
            <li><router-link to="/poet/杜甫" class="footer-link">杜甫</router-link></li>
            <li><router-link to="/poet/苏轼" class="footer-link">苏轼</router-link></li>
            <li><router-link to="/poet/李清照" class="footer-link">李清照</router-link></li>
          </ul>
        </div>

        <!-- 关于我们 -->
        <div class="footer-section">
          <h4 class="section-title">关于我们</h4>
          <ul class="footer-links">
            <li><a href="#" class="footer-link">项目介绍</a></li>
            <li><a href="#" class="footer-link">团队介绍</a></li>
            <li><a href="#" class="footer-link">联系我们</a></li>
            <li><a href="#" class="footer-link">帮助中心</a></li>
          </ul>
        </div>
      </div>

      <!-- 版权信息 -->
      <div class="footer-bottom">
        <div class="copyright">
          &copy; {{ currentYear }} 诗海寻梦 - AI赋能诗词赏析平台. 保留所有权利.
        </div>
        <div class="footer-links-bottom">
          <a href="#" class="footer-link">隐私政策</a>
          <a href="#" class="footer-link">服务条款</a>
          <a href="#" class="footer-link">免责声明</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: white;
  padding: 40px 0 20px;
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-bottom: 30px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.footer-section {
  display: flex;
  flex-direction: column;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  font-size: 1.5rem;
  font-weight: 700;
}

.footer-description {
  color: #bdc3c7;
  line-height: 1.6;
  margin-bottom: 20px;
}

.social-links {
  display: flex;
  gap: 12px;
}

.social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  text-decoration: none;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: #ecf0f1;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 8px;
}

.footer-link {
  color: #bdc3c7;
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: 0.95rem;
}

.footer-link:hover {
  color: #ecf0f1;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.copyright {
  color: #95a5a6;
  font-size: 0.9rem;
}

.footer-links-bottom {
  display: flex;
  gap: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 30px;
    text-align: center;
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .footer-links-bottom {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .app-footer {
    padding: 30px 0 15px;
  }
  
  .footer-content {
    gap: 20px;
  }
}
</style>