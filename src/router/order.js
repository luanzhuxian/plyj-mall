export default [
  {
    path: '/my/orders',
    name: 'Orders',
    component: () => import('../views/my/order/order-list/Index.vue'),
    meta: {
      title: '我的订单'
    },
    children: [
      {
        path: 'all',
        name: 'AllOrders',
        component: () => import('../views/my/order/order-list/All.vue'),
        meta: {
          title: '我的订单-全部'
        }
      },
      {
        path: 'wait-pay',
        name: 'waitPay',
        component: () => import('../views/my/order/order-list/Wait-Pay.vue'),
        meta: {
          title: '我的订单-待付款'
        }
      },
      {
        path: 'wait-ship',
        name: 'waitShip',
        component: () => import('../views/my/order/order-list/Wait-Ship.vue'),
        meta: {
          title: '我的订单-待发货'
        }
      },
      {
        path: 'wait-receive',
        name: 'waitReceive',
        component: () => import('../views/my/order/order-list/Wait-Receive.vue'),
        meta: {
          title: '我的订单-待收货'
        }
      },
      {
        path: 'wait-comment',
        name: 'waitComment',
        component: () => import('../views/my/order/order-list/Wait-Comment.vue'),
        meta: {
          title: '我的订单-待评价'
        }
      }
    ]
  },
  {
    path: '/my/order/submit/:productSeq/:optionCode/:count/:brokerId?',
    name: 'Cart',
    component: () => import('../views/cart/Cart.vue'),
    props: true,
    meta: {
      title: '提交订单'
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
  {
    path: '/my/orders/invoice/:orderId',
    name: 'Invoice',
    component: () => import('../views/my/order/Invoice.vue'),
    props: true,
    meta: {
      title: '申请发票'
    }
  },
  {
    path: '/my/orders/invoice/:id/content',
    name: 'InvoiceContent',
    component: () => import('../views/my/order/Invoice-Content.vue'),
    meta: {
      title: '选择发票内容'
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
    path: '/my/orders/refund-list',
    name: 'RefundList',
    component: () => import('../views/my/order/Refund-List.vue'),
    meta: {
      title: '售后列表'
    }
  }
]
