export default [
  {
    path: '/lived',
    name: 'Live',
    component: () => import('../views/live/Index.vue'),
    meta: {
      title: '直播'
    }
  },
  {
    path: '/lived/room',
    name: 'LiveRoom',
    component: () => import('../views/live/Live-Room.vue'),
    meta: {
      title: '直播'
    }
  }
]
