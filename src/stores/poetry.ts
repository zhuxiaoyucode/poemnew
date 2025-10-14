import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Poem, Poet, PoetrySearchParams } from '@/types/poetry'

// 模拟数据 - 实际项目中应该从API获取
const mockPoets: Poet[] = [
  {
    id: '1',
    name: '李白',
    dynasty: '唐',
    biography: '唐代伟大的浪漫主义诗人，被后人誉为"诗仙"。',
    tags: ['浪漫主义', '豪放', '山水'],
  },
  {
    id: '2',
    name: '杜甫',
    dynasty: '唐',
    biography: '唐代伟大的现实主义诗人，被后人誉为"诗圣"。',
    tags: ['现实主义', '沉郁', '社会'],
  },
  {
    id: '3',
    name: '王维',
    dynasty: '唐',
    biography: '唐代著名诗人、画家，被誉为"诗佛"。',
    tags: ['山水', '田园', '禅意'],
  },
  {
    id: '4',
    name: '王之涣',
    dynasty: '唐',
    biography: '唐代边塞诗人，以《登鹳雀楼》闻名。',
    tags: ['边塞', '豪放', '壮丽'],
  },
  {
    id: '5',
    name: '孟浩然',
    dynasty: '唐',
    biography: '唐代山水田园诗人，与王维并称"王孟"。',
    tags: ['山水', '田园', '自然'],
  },
  {
    id: '6',
    name: '王昌龄',
    dynasty: '唐',
    biography: '唐代边塞诗人，被誉为"七绝圣手"。',
    tags: ['边塞', '战争', '豪情'],
  },
  {
    id: '7',
    name: '李商隐',
    dynasty: '唐',
    biography: '晚唐著名诗人，以无题诗和爱情诗著称。',
    tags: ['爱情', '隐晦', '唯美'],
  },
  {
    id: '8',
    name: '杜牧',
    dynasty: '唐',
    biography: '晚唐诗人，与李商隐并称"小李杜"。',
    tags: ['咏史', '抒情', '豪放'],
  },
]

const mockPoems: Poem[] = [
  // 李白诗作
  {
    id: '1',
    title: '静夜思',
    content: '床前明月光，疑是地上霜。举头望明月，低头思故乡。',
    poetId: '1',
    dynasty: '唐',
    tags: ['思乡', '月亮', '夜晚'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '17',
    title: '望庐山瀑布',
    content: '日照香炉生紫烟，遥看瀑布挂前川。飞流直下三千尺，疑是银河落九天。',
    poetId: '1',
    dynasty: '唐',
    tags: ['山水', '壮丽', '自然'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '18',
    title: '早发白帝城',
    content: '朝辞白帝彩云间，千里江陵一日还。两岸猿声啼不住，轻舟已过万重山。',
    poetId: '1',
    dynasty: '唐',
    tags: ['旅行', '山水', '豪放'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '19',
    title: '赠汪伦',
    content: '李白乘舟将欲行，忽闻岸上踏歌声。桃花潭水深千尺，不及汪伦送我情。',
    poetId: '1',
    dynasty: '唐',
    tags: ['友情', '离别', '抒情'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // 杜甫诗作
  {
    id: '2',
    title: '春望',
    content: '国破山河在，城春草木深。感时花溅泪，恨别鸟惊心。',
    poetId: '2',
    dynasty: '唐',
    tags: ['爱国', '战争', '春天'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '20',
    title: '春夜喜雨',
    content: '好雨知时节，当春乃发生。随风潜入夜，润物细无声。',
    poetId: '2',
    dynasty: '唐',
    tags: ['春天', '自然', '喜悦'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '21',
    title: '登高',
    content: '风急天高猿啸哀，渚清沙白鸟飞回。无边落木萧萧下，不尽长江滚滚来。',
    poetId: '2',
    dynasty: '唐',
    tags: ['秋天', '登高', '感怀'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '22',
    title: '绝句',
    content: '两个黄鹂鸣翠柳，一行白鹭上青天。窗含西岭千秋雪，门泊东吴万里船。',
    poetId: '2',
    dynasty: '唐',
    tags: ['春天', '自然', '写景'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    title: '登鹳雀楼',
    content: '白日依山尽，黄河入海流。欲穷千里目，更上一层楼。',
    poetId: '4',
    dynasty: '唐',
    tags: ['边塞', '壮丽', '哲理'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    title: '出塞',
    content: '秦时明月汉时关，万里长征人未还。但使龙城飞将在，不教胡马度阴山。',
    poetId: '6',
    dynasty: '唐',
    tags: ['边塞', '战争', '爱国'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    title: '凉州词',
    content: '黄河远上白云间，一片孤城万仞山。羌笛何须怨杨柳，春风不度玉门关。',
    poetId: '4',
    dynasty: '唐',
    tags: ['边塞', '壮丽', '思乡'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '6',
    title: '从军行',
    content: '青海长云暗雪山，孤城遥望玉门关。黄沙百战穿金甲，不破楼兰终不还。',
    poetId: '6',
    dynasty: '唐',
    tags: ['边塞', '战争', '豪情'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // 山水田园诗
  {
    id: '7',
    title: '山居秋暝',
    content: '空山新雨后，天气晚来秋。明月松间照，清泉石上流。',
    poetId: '3',
    dynasty: '唐',
    tags: ['山水', '田园', '自然'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '8',
    title: '过故人庄',
    content: '故人具鸡黍，邀我至田家。绿树村边合，青山郭外斜。',
    poetId: '5',
    dynasty: '唐',
    tags: ['田园', '友情', '自然'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '9',
    title: '鹿柴',
    content: '空山不见人，但闻人语响。返景入深林，复照青苔上。',
    poetId: '3',
    dynasty: '唐',
    tags: ['山水', '禅意', '宁静'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '10',
    title: '春晓',
    content: '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。',
    poetId: '5',
    dynasty: '唐',
    tags: ['春天', '自然', '田园'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '11',
    title: '鸟鸣涧',
    content: '人闲桂花落，夜静春山空。月出惊山鸟，时鸣春涧中。',
    poetId: '3',
    dynasty: '唐',
    tags: ['山水', '宁静', '自然'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // 思乡怀人诗
  {
    id: '12',
    title: '九月九日忆山东兄弟',
    content: '独在异乡为异客，每逢佳节倍思亲。遥知兄弟登高处，遍插茱萸少一人。',
    poetId: '3',
    dynasty: '唐',
    tags: ['思乡', '怀人', '节日'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '13',
    title: '夜雨寄北',
    content: '君问归期未有期，巴山夜雨涨秋池。何当共剪西窗烛，却话巴山夜雨时。',
    poetId: '7',
    dynasty: '唐',
    tags: ['思乡', '爱情', '离别'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '14',
    title: '望月怀远',
    content: '海上生明月，天涯共此时。情人怨遥夜，竟夕起相思。',
    poetId: '5',
    dynasty: '唐',
    tags: ['思乡', '月亮', '怀人'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '15',
    title: '秋思',
    content: '洛阳城里见秋风，欲作家书意万重。复恐匆匆说不尽，行人临发又开封。',
    poetId: '8',
    dynasty: '唐',
    tags: ['思乡', '秋天', '离别'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '16',
    title: '无题',
    content: '相见时难别亦难，东风无力百花残。春蚕到死丝方尽，蜡炬成灰泪始干。',
    poetId: '7',
    dynasty: '唐',
    tags: ['爱情', '离别', '思念'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export const usePoetryStore = defineStore('poetry', () => {
  // 状态
  const poems = ref<Poem[]>(mockPoems)
  const poets = ref<Poet[]>(mockPoets)
  const currentPoem = ref<Poem | null>(null)
  const currentPoet = ref<Poet | null>(null)
  const searchResults = ref<Poem[]>([])
  const isLoading = ref(false)

  // Getter
  const featuredPoems = computed(() => poems.value.slice(0, 5))
  const popularPoets = computed(() => poets.value.slice(0, 3))

  // Actions
  const searchPoems = async (params: PoetrySearchParams) => {
    isLoading.value = true
    try {
      // 模拟搜索延迟
      await new Promise((resolve) => setTimeout(resolve, 500))

      let results = poems.value

      if (params.query) {
        const query = params.query.toLowerCase()
        results = results.filter(
          (poem) =>
            poem.title.toLowerCase().includes(query) ||
            poem.content.toLowerCase().includes(query) ||
            // 通过诗人姓名搜索
            poets.value.some(
              (poet) => poet.id === poem.poetId && poet.name.toLowerCase().includes(query),
            ) ||
            // 通过标签搜索
            poem.tags.some((tag) => tag.toLowerCase().includes(query)),
        )
      }

      if (params.poet) {
        results = results.filter((poem) => poem.poetId === params.poet)
      }

      if (params.dynasty) {
        results = results.filter((poem) => poem.dynasty === params.dynasty)
      }

      if (params.tags && params.tags.length > 0) {
        // 专题搜索：诗词必须包含至少一个指定的标签
        results = results.filter((poem) => params.tags!.some((tag) => poem.tags.includes(tag)))
      }

      searchResults.value = results
      return results
    } finally {
      isLoading.value = false
    }
  }

  const getPoemById = (id: string) => {
    const poem = poems.value.find((p) => p.id === id)
    if (poem) {
      // 关联诗人信息
      const poet = poets.value.find((p) => p.id === poem.poetId)
      currentPoem.value = {
        ...poem,
        poet: poet || null,
      }
      if (poet) {
        currentPoet.value = poet
      }
    }
    return currentPoem.value
  }

  const getPoetById = (id: string) => {
    const poet = poets.value.find((p) => p.id === id)
    if (poet) {
      currentPoet.value = poet
    }
    return poet
  }

  const getRelatedPoems = (poem: Poem) => {
    return poems.value
      .filter((p) => p.id !== poem.id && p.tags.some((tag) => poem.tags.includes(tag)))
      .slice(0, 3)
  }

  return {
    // 状态
    poems,
    poets,
    currentPoem,
    currentPoet,
    searchResults,
    isLoading,

    // Getter
    featuredPoems,
    popularPoets,

    // Actions
    searchPoems,
    getPoemById,
    getPoetById,
    getRelatedPoems,
  }
})
