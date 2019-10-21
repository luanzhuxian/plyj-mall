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
    name: 'SecondList',
    component: () => import('../views/activity-list/Second-List.vue'),
    meta: {
      title: '限时秒杀'
    }
  },
  {
    path: '/tuan',
    name: 'TuanList',
    component: () => import('../views/activity-list/Tuan-List.vue'),
    meta: {
      title: '多人拼团'
    }
  },
  {
    path: '/book',
    name: 'BookList',
    component: () => import('../views/activity-list/Book-List.vue'),
    meta: {
      title: '预购'
    }
  }
]
