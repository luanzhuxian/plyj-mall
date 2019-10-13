export default [
  {
    path: '/activity',
    name: 'Activity',
    component: () => import('../views/activity/Index.vue'),
    meta: {
      title: '主会场'
    }
  }
]
