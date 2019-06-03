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
    path: '/my/orders/comment/:orderId',
    name: 'CommentOrder',
    component: () => import('../views/my/order/Comment.vue'),
    props: true,
    meta: {
      title: '发表评论'
    }
  },
  // {
  //   path: '/my/orders/invoice/:orderId',
  //   name: 'Invoice',
  //   component: () => import('../views/my/order/Invoice.vue'),
  //   props: true,
  //   meta: {
  //     title: '申请发票'
  //   }
  // },
  // {
  //   path: '/my/orders/invoice/:id/content',
  //   name: 'InvoiceContent',
  //   component: () => import('../views/my/order/Invoice-Content.vue'),
  //   meta: {
  //     title: '选择发票内容'
  //   }
  // },
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
    path: '/my/orders/refund-apply/:orderId',
    name: 'RefundApply',
    component: () => import('../views/my/order/Refund-Apply.vue'),
    props: true,
    meta: {
      title: '申请退款'
    }
  },
  {
    path: '/my/orders/refund/:orderSn',
    name: 'RefundDetail',
    component: () => import('../views/my/order/Refund-Detail.vue'),
    props: true,
    meta: {
      title: '退款详情'
    }
  },
  {
    path: '/my/order/refund-list',
    name: 'RefundList',
    component: () => import('../views/my/order/Refund-List.vue'),
    meta: {
      title: '售后列表'
    }
  },
  {
    path: '/my/order/freight/:orderId',
    name: 'Freight',
    component: () => import('../views/my/order/Freight.vue'),
    props: true,
    meta: {
      title: '物流信息'
    }
  }
]
