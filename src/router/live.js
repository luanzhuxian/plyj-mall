export default [
  {
    path: '/living-room',
    name: 'Live',
    component: () => import('../views/live/Index.vue'),
    meta: {
      title: '直播'
    }
  }
]
