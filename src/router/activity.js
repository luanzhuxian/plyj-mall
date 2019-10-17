export default [
  {
    path: '/activity',
    name: 'Activity',
    component: () => import('../views/activity/Index.vue'),
    meta: {
      title: '主会场'
    }
  },
  {
    path: '/second',
    name: 'Second',
    component: () => import('../views/second-list/List.vue'),
    meta: {
      title: '限时秒杀'
    }
  }
]
