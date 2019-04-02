export default [
  {
    path: '/my',
    name: 'My',
    component: () => import('../views/my/Index.vue'),
    meta: {
      title: '我的'
    }
  },
  {
    path: '/my/apply-helper',
    name: 'ApplyHelper',
    component: () => import('../views/my/Apply-Helper.vue'),
    meta: {
      title: '申请Helper'
    }
  },
  {
    path: '/my/coffers',
    name: 'Coffers',
    component: () => import('../views/my/coffers/Coffers.vue'),
    meta: {
      title: '小金库'
    }
  },
  {
    path: '/my/withdraw',
    name: 'WithdrawCash',
    component: () => import('../views/my/coffers/Withdraw-Cash.vue'),
    meta: {
      title: '提现'
    }
  },
  {
    path: '/my/withdraw/list',
    name: 'WithdrawList',
    component: () => import('../views/my/coffers/Withdraw-List.vue'),
    meta: {
      title: '提现列表'
    }
  },
  {
    path: '/my/withdraw/list/:id',
    name: 'WithdrawDetail',
    component: () => import('../views/my/coffers/Withdraw-Detail.vue'),
    meta: {
      title: '提现详情'
    }
  },
  {
    path: '/my/accumulated-rebate',
    name: 'AccumulatedRebate',
    component: () => import('../views/my/coffers/Accumulated-Rebate.vue'),
    meta: {
      title: '累计润笔'
    }
  },
  {
    path: '/my/rebate/list',
    name: 'RebateList',
    component: () => import('../views/my/coffers/Rebate-List.vue'),
    meta: {
      title: '润笔明细'
    }
  },
  {
    path: '/my/address',
    name: 'Address',
    component: () => import('../views/my/address/Index.vue'),
    meta: {
      title: '地址管理'
    }
  },
  {
    path: '/my/address/add/:addressId?',
    name: 'AddAddress',
    component: () => import('../views/my/address/Add.vue'),
    props: true,
    meta: {
      title: '添加地址'
    }
  }
]
