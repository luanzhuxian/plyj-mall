export default [
    {
        path: '/order/shopping-cart',
        name: 'ShoppingCart',
        component: () => import('../views/shopping-car/Shopping-Cart.vue'),
        props: true,
        meta: {
            title: '购物车'
        }
    },
    {
        path: '/order/submit/:brokerId?/:activeProduct?',
        name: 'SubmitOrder',
        component: () => import('../views/submit-order/Submit-Order.vue'),
        props: true,
        meta: {
            title: '提交订单'
        }
    },
    {
        path: '/order/submit/success/:orderId/:orderCount?',
        name: 'PaySuccess',
        component: () => import('../views/submit-order/Pay-Success.vue'),
        props: true,
        meta: {
            title: '支付成功'
        }
    }
]

// /order/submit/success/1208311982485225472/123
