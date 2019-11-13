export default [
  {
    path: '/moon/cake',
    name: 'MoonCake',
    component: () => import('../views/wwec/Moon-Cake.vue'),
    meta: {
      title: '朋来雅集'
    }
  },
  {
    path: '/moon/sign-up',
    name: 'SignUp',
    component: () => import('../views/wwec/Wwec.vue'),
    meta: {
      title: '免费部署线上学校'
    }
  },
  {
    path: '/820/code',
    name: 'Code820',
    props: true,
    component: () => import('../views/wwec/Code.vue'),
    meta: {
      title: '免费部署线上学校'
    }
  },
  {
    path: '/820/get-success',
    name: 'GetSuccess',
    component: () => import('../views/wwec/Get-Success.vue'),
    meta: {
      title: '免费部署线上学校'
    }
  }
]
