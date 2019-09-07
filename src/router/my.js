export default [
  {
    path: '/my',
    name: 'My',
    component: () => import('../views/my/Index.vue'),
    meta: {
      title: '个人中心'
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
    path: '/my/withdraw/success',
    name: 'WithdrawCashSuccess',
    component: () => import('../views/my/coffers/Withdraw-Cash-Success.vue'),
    meta: {
      title: '提现申请成功'
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
    path: '/my/shop/helper-poster',
    name: 'HelperPoster',
    component: () => import('../views/my/shop/Helper-Poster.vue'),
    meta: {
      title: 'Helper邀请'
    }
  },
  {
    path: '/my/shop/poster',
    name: 'ShopPoster',
    component: () => import('../views/my/shop/Shop-Poster.vue'),
    meta: {
      title: '店铺海报'
    }
  },
  {
    path: '/my/shop/qrcode',
    name: 'ShopQrcode',
    component: () => import('../views/my/shop/Shop-Qrcode.vue'),
    meta: {
      title: '店铺二维码'
    }
  },
  {
    path: '/my/rebate/list',
    name: 'RebateList',
    component: () => import('../views/my/coffers/Rebate-List.vue'),
    meta: {
      title: '润笔明细'
    }
  }
]
