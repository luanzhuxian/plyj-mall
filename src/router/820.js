export default [
  // {
  //   path: '/moon/sign-up',
  //   name: 'SignUp',
  //   component: () => import('../views/moon/Sign-Up.vue'),
  //   meta: {
  //     title: '朋来雅集'
  //   }
  // },
  {
    path: '/moon/cake',
    name: 'MoonCake',
    component: () => import('../views/moon/Moon-Cake.vue'),
    meta: {
      title: '朋来雅集'
    }
  },
  {
    path: '/moon/sign-up',
    name: 'SignUp',
    component: () => import('../views/moon/Wwec.vue'),
    meta: {
      title: '免费部署线上学校'
    }
  },
  {
    path: '/820/code',
    name: 'Code820',
    props: true,
    component: () => import('../views/moon/Code.vue'),
    meta: {
      title: '免费部署线上学校'
    }
  },
  {
    path: '/820/get-success',
    name: 'GetSuccess',
    component: () => import('../views/moon/Get-Success.vue'),
    meta: {
      title: '免费部署线上学校'
    }
  }
]
