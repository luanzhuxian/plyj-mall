export default [
  {
    path: '/newcomers/:activityId',
    name: 'Newcomers',
    component: () => import('../views/double-twelve-day/newcomers/Newcomers.vue'),
    meta: {
      title: '新人有礼'
    }
  }
]
