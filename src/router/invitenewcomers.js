export default [
  {
    path: '/invitenewcomers/:activityId',
    name: 'InviteNewcomers',
    component: () => import('../views/invitenewcomers/InviteNewcomers.vue'),
    meta: {
      title: '双十二疯狂助力'
    }
  },
  {
    path: '/invitenewcomers/:activityId/help/:userId',
    name: 'InviteNewcomersHelper',
    component: () => import('../views/invitenewcomers/InviteNewcomersHelp.vue'),
    meta: {
      title: '双十二疯狂助力'
    }
  }
]
