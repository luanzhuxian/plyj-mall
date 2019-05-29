export default [
  {
    path: '/order/shopping-cart',
    name: 'ShoppingCart',
    component: () => import('../views/cart/Shopping-Cart.vue'),
    props: true,
    meta: {
      title: '购物车'
    }
  },
  {
    path: '/order/submit/:productSeq/:optionCode/:count/:brokerId?',
    name: 'Cart',
    component: () => import('../views/cart/Cart.vue'),
    props: true,
    meta: {
      title: '提交订单'
    }
  },
  {
    path: '/order/submit/success/:orderId',
    name: 'PaySuccess',
    component: () => import('../views/cart/Pay-Success.vue'),
    props: true,
    meta: {
      title: '支付成功'
    }
  }
]
