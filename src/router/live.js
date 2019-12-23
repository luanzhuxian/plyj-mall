export default [
  // {
  //   path: '/lived',
  //   name: 'Live',
  //   component: () => import('../views/live/Index.vue'),
  //   meta: {
  //     title: '直播'
  //   }
  // },
  {
    path: '/lived/room',
    name: 'LiveRoom',
    component: () => import('../views/live/Live-Room.vue'),
    meta: {
      title: '直播'
    }
  },
  {
    path: '/lived/library',
    name: 'LiveLibrary',
    component: () => import('../views/live/Live-Library.vue'),
    meta: {
      title: '视频库'
    }
  },
  {
    path: '/lived/play-back/:id',
    name: 'LivePlayBack',
    component: () => import('../views/live/Live-Play-Back.vue'),
    meta: {
      title: '直播回放'
    }
  }
]
