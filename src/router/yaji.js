export default [
  {
    path: '/yaji',
    name: 'Yaji',
    component: () => import('../views/yaji/Index.vue'),
    meta: {
      title: '雅集'
    }
  },
  {
    path: '/yaji/whats-helper',
    name: 'WhatsHelper',
    component: () => import('../views/yaji/Whats-Helper.vue'),
    meta: {
      title: '什么是Helper'
    }
  }
]
