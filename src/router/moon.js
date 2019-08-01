export default [
  {
    path: '/moon/sign-up',
    name: 'SignUp',
    component: () => import('../views/moon/Sign-Up.vue'),
    meta: {
      title: '朋来雅集'
    }
  },
  {
    path: '/moon/cake',
    name: 'MoonCake',
    component: () => import('../views/moon/Moon-Cake.vue'),
    meta: {
      title: '朋来雅集'
    }
  }
]
