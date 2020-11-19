export default [
    {
        // 全部订单:ALL_ORDERS 待付款:WAIT_PAY 待发货:WAIT_SHIP 待收货:WAIT_RECEIVE 待评价:FINISHED
        path: '/my/orders/:status?',
        name: 'Orders',
        component: () => import('../views/my/order/Order-List.vue'),
        props: true,
        meta: {
            title: '我的订单'
        }
    },
    {
        path: '/my/order/balance',
        name: 'WaitPayBalance',
        component: () => import('../views/my/order/Wait-Pay-Balance.vue'),
        props: true,
        meta: {
            title: '待付尾款订单'
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
        path: '/my/orders/red-packet-detail/:orderId',
        name: 'RedPacketOrderDetail',
        component: () => import('../views/my/order/Red-Packet-Detail.vue'),
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
        path: '/my/orders/refund/:orderId',
        name: 'Refund',
        component: () => import('../views/my/order/Refund.vue'),
        props: true,
        meta: {
            title: '申请退款'
        }
    },
    {
        path: '/my/orders/refund-apply/:orderId/:refundType/:type/:refundId?',
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
    }
]
