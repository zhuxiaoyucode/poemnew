import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref<'light' | 'dark' | 'auto'>('light')

  // 初始化主题
  const initTheme = () => {
    const savedTheme = localStorage.getItem('poetry-theme')
    if (savedTheme) {
      currentTheme.value = savedTheme as 'light' | 'dark' | 'auto'
    } else {
      // 检查系统偏好
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (prefersDark) {
        currentTheme.value = 'auto'
      }
    }
    applyTheme()
  }

  // 应用主题
  const applyTheme = () => {
    let themeToApply = currentTheme.value
    
    if (themeToApply === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      themeToApply = prefersDark ? 'dark' : 'light'
    }

    const htmlElement = document.documentElement
    if (themeToApply === 'dark') {
      htmlElement.classList.add('dark-theme')
      htmlElement.classList.remove('light-theme')
    } else {
      htmlElement.classList.add('light-theme')
      htmlElement.classList.remove('dark-theme')
    }
  }

  // 切换主题
  const setTheme = (theme: 'light' | 'dark' | 'auto') => {
    currentTheme.value = theme
    localStorage.setItem('poetry-theme', theme)
    applyTheme()
  }

  // 监听系统主题变化
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', () => {
    if (currentTheme.value === 'auto') {
      applyTheme()
    }
  })

  return {
    currentTheme,
    initTheme,
    setTheme,
    applyTheme
  }
})