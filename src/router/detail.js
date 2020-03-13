export default [
    {
        path: '/detail/product/:productId/:brokerId?',
        name: 'Product',
        component: () => import('../views/detail/Product-Detail.vue'),
        props: true,
        meta: {
            title: '商品详情'
        }
    },
    {
        path: '/detail/curriculum/:productId/:brokerId?',
        name: 'Curriculum',
        component: () => import('../views/detail/Curriculum-Detail.vue'),
        props: true,
        meta: {
            title: '课程详情'
        }
    },
    {
        path: '/detail/comments/detail',
        name: 'CommentDetail',
        component: () => import('../views/detail/Comment-Detail.vue'),
        props: true,
        meta: {
            title: '评论详情'
        }
    },
    {
        path: '/detail/sold-out',
        name: 'SoldOut',
        component: () => import('../views/detail/Sold-Out.vue'),
        props: true,
        meta: {
            title: '商品详情'
        }
    }
]
