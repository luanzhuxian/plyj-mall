export default [
  {
    path: '/my/orders/:status?',
    name: 'Orders',
    component: () => import('../views/my/order/Order-List.vue'),
    props: true,
    meta: {
      title: '我的订单'
    }
  },
  {
    path: '/my/orders/detail/:orderId',
    name: 'OrderDetail',
    component: () => import('../views/my/order/Detail.vue'),
    props: true,
    meta: {
      title: '订单详情'
    }
  },
  {
    path: '/my/orders/comment/:orderId/:productId',
    name: 'CommentOrder',
    component: () => import('../views/my/order/Comment.vue'),
    props: true,
    meta: {
      title: '发表评论'
    }
  },
  {
    path: '/my/orders/invoice/:orderId/detail',
    name: 'InvoiceDetail',
    component: () => import('../views/my/order/Invoice-Detail.vue'),
    props: true,
    meta: {
      title: '发票详情'
    }
  },
  {
    path: '/my/orders/refund/:orderId/:orderProductRId',
    name: 'Refund',
    component: () => import('../views/my/order/Refund.vue'),
    props: true,
    meta: {
      title: '申请退款'
    }
  },
  {
    path: '/my/orders/refund-apply/:orderId/:orderProductRId/:refundType/:type/:refundId?',
    name: 'RefundApply',
    component: () => import('../views/my/order/Refund-Apply.vue'),
    props: true,
    meta: {
      title: '申请退款'
    }
  },
  {
    path: '/my/orders/refund-list/:status?',
    name: 'RefundList',
    component: () => import('../views/my/order/Refund-List.vue'),
    props: true,
    meta: {
      title: '售后列表'
    }
  },
  {
    path: '/my/orders/refund-detail/:id',
    name: 'RefundDetail',
    component: () => import('../views/my/order/Refund-Detail.vue'),
    props: true,
    meta: {
      title: '退款详情'
    }
  },
  {
    path: '/my/orders/freight/:orderId',
    name: 'Freight',
    component: () => import('../views/my/order/Freight.vue'),
    props: true,
    meta: {
      title: '物流信息'
    }
  },
  {
    path: '/my/orders/complete/:orderId',
    name: 'OrderComplete',
    component: () => import('../views/my/order/Order-Complete.vue'),
    props: true,
    meta: {
      title: '交易完成'
    }
  },
  {
    path: '/my/helper',
    name: 'HelperManagement',
    component: () => import('../views/my/helper/Index.vue'),
    props: true,
    meta: {
      title: 'helper管理'
    }
  },
  {
    path: '/my/helper/list',
    name: 'HelperList',
    component: () => import('../views/my/helper/Helper-List.vue'),
    props: true,
    meta: {
      title: 'helper列表'
    }
  },
  {
    path: '/my/helper/list-apply/:status?',
    name: 'HelperListApply',
    component: () => import('../views/my/helper/Helper-List-Apply.vue'),
    props: true,
    meta: {
      title: 'helper列表'
    }
  },
  {
    path: '/my/helper/detail/:id',
    name: 'HelperDetail',
    component: () => import('../views/my/helper/Helper-Detail.vue'),
    props: true,
    meta: {
      title: 'helper详情'
    }
  }
]
