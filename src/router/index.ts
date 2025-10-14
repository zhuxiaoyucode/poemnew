import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PoemDetailView from '../views/PoemDetailView.vue'
import TopicView from '../views/TopicView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: '诗海寻梦 - AI赋能诗词赏析' }
    },
    {
      path: '/poem/:id',
      name: 'poem',
      component: PoemDetailView,
      meta: { title: '诗词详情 - 诗海寻梦' }
    },
    {
      path: '/poet/:id',
      name: 'poet',
      component: () => import('../views/PoetView.vue'),
      meta: { title: '诗人主页 - 诗海寻梦' }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { title: '个人中心 - 诗海寻梦' }
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/SearchView.vue'),
      meta: { title: '搜索 - 诗海寻梦' }
    },
    {
      path: '/topic/:id',
      name: 'topic',
      component: TopicView,
      meta: { title: '专题详情 - 诗海寻梦' }
    }
  ]
})

// 路由守卫 - 设置页面标题
router.beforeEach((to, _from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
  next()
})

export default router
