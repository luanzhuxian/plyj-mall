export default [
  // {
  //   path: '/home',
  //   name: 'Home',
  //   component: () => import('../views/home/Index.vue'),
  //   meta: {
  //     title: '首页'
  //   }
  // },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/old-home/Index.vue'),
    meta: {
      title: '首页'
    }
  }
]
