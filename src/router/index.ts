import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { title: '诗海寻梦 - AI赋能诗词赏析' },
    },
    {
      path: '/home',
      redirect: '/',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { title: '登录 - 诗海寻梦' },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { title: '注册 - 诗海寻梦' },
    },
    {
      path: '/poem/:id',
      name: 'poem',
      component: () => import('@/views/PoemDetailView.vue'),
      meta: { title: '诗词详情 - 诗海寻梦' },
    },
    {
      path: '/poet/:id',
      name: 'poet',
      component: () => import('@/views/PoetView.vue'),
      meta: { title: '诗人主页 - 诗海寻梦' },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { title: '个人中心 - 诗海寻梦' },
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/views/SearchView.vue'),
      meta: { title: '搜索 - 诗海寻梦' },
    },
    {
      path: '/topic/:id',
      name: 'topic',
      component: () => import('@/views/TopicView.vue'),
      meta: { title: '专题详情 - 诗海寻梦' },
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('@/views/CategoryView.vue'),
      meta: { title: '诗歌分类 - 诗海寻梦' },
    },
    {
      path: '/chat',
      name: 'chat',
      component: () => import('@/views/ChatView.vue'),
      meta: { title: '诗歌问答 - 诗海寻梦' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { title: '未找到 - 诗海寻梦' },
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})

/**
 * 路由守卫
 * - 设置页面标题
 * - 开启/关闭顶栏进度条
 */
router.beforeEach((to, _from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
  // 开启轻量进度条（通过 body class 控制样式动画）
  document.body.classList.add('route-loading-active')
  next()
})

// 成功后关闭进度条
router.afterEach(() => {
  document.body.classList.remove('route-loading-active')
})

// 导航异常时关闭进度条
router.onError(() => {
  document.body.classList.remove('route-loading-active')
})

export default router
