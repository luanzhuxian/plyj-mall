export default [
  {
    path: '/newcomers/:activityId',
    name: 'Newcomers',
    component: () => import('../views/newcomers/Newcomers.vue'),
    meta: {
      title: '新人有礼'
    }
  }
]
