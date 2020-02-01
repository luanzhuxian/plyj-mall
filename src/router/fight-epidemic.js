export default [
  {
    path: '/fight-epidemic/battlefield-report',
    name: 'BattlefieldReport',
    component: () => import('../views/fight-epidemic/Battlefield-Report.vue'),
    meta: {
      title: '防疫情报站'
    }
  },
  // 报名页面
  {
    path: '/fight-epidemic/sign-up',
    name: 'EpidemicSignUp',
    component: () => import('../views/fight-epidemic/Sign-Up.vue'),
    meta: {
      title: '共携手，抗战“疫”'
    }
  },
  // 签到首页
  {
    path: '/fight-epidemic/sign-in',
    name: 'EpidemicSignUp',
    component: () => import('../views/fight-epidemic/Sign-In.vue'),
    meta: {
      title: '共携手，抗战“疫”'
    }
  }
]
