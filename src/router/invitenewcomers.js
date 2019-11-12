export default [
  {
    path: '/yx/:activityId/:shareUserId?',
    name: 'InviteNewcomers',
    alias: '/invitenewcomers/:activityId/:shareUserId?',
    props: true,
    component: () => import('../views/invitenewcomers/InviteNewcomers.vue'),
    meta: {
      title: '双十二疯狂助力'
    }
  }
]
// /invitenewcomers/1189072602236780544
