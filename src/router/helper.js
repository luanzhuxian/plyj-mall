export default [
  {
    path: '/my/helper',
    name: 'HelperManagement',
    component: () => import('../views/my/helper/Index.vue'),
    props: true,
    meta: {
      title: 'Helper管理'
    }
  },
  {
    path: '/my/helper/list/:status?',
    name: 'HelperList',
    component: () => import('../views/my/helper/Helper-List.vue'),
    props: true,
    meta: {
      title: 'Helper列表'
    }
  },
  {
    path: '/my/helper/list-apply/:status?',
    name: 'HelperListApply',
    component: () => import('../views/my/helper/Helper-List-Apply.vue'),
    props: true,
    meta: {
      title: 'Helper列表'
    }
  },
  {
    path: '/my/helper/detail/:id',
    name: 'HelperDetail',
    component: () => import('../views/my/helper/Helper-Detail.vue'),
    props: true,
    meta: {
      title: 'Helper详情'
    }
  }
]
