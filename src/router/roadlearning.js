export default [
  {
    path: '/road-learning/:id?',
    name: 'RoadLearning',
    props: true,
    component: () => import('../views/road-learning/road-learning.vue'),
    meta: {
      title: '见学之旅'
    }
  }
]
