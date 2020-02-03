export default [
  {
    path: '/fight-epidemic/battlefield-report/:id?',
    name: 'BattlefieldReport',
    props: true,
    component: () => import('../views/fight-epidemic/Battlefield-Report.vue'),
    meta: {
      title: '防疫情报站'
    }
  },
  // 报名页面
  {
    path: '/fight-epidemic/sign-up/:id',
    name: 'EpidemicSignUp',
    props: true,
    component: () => import('../views/fight-epidemic/Sign-Up.vue'),
    meta: {
      title: '共携手，抗战“疫”'
    }
  },
  // 签到首页
  {
    path: '/fight-epidemic/sign-in',
    name: 'EpidemicSignIn',
    component: () => import('../views/fight-epidemic/Sign-In.vue'),
    meta: {
      title: '共携手，抗战“疫”'
    }
  }
]
