export default [
  {
    path: '/my/setting',
    name: 'Setting',
    component: () => import('../views/my/setting/index.vue'),
    meta: {
      title: '朋来雅集'
    }
  },
  {
    path: '/my/edit',
    name: 'SettingEdit',
    component: () => import('../views/my/setting/edit.vue'),
    meta: {
      title: '设置'
    }
  },
  {
    path: '/my/setting/bind-mobile',
    name: 'BindMobile',
    component: () => import('../views/my/setting/Bind-Mobile.vue'),
    meta: {
      title: '设置手机'
    }
  }
]
