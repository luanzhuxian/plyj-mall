export default [
    {
        path: '/detail/product/:productId/:brokerId?',
        alias: '/detail/lesson/:productId/:brokerId?',
        name: 'Product',
        component: () => import('../views/product-detail/Product-Detail.vue'),
        props: true,
        meta: {
            title: '商品详情'
        }
    },
    {
        path: '/detail/curriculum/:productId/:brokerId?',
        name: 'Curriculum',
        component: () => import('../views/product-detail/Curriculum-Detail.vue'),
        props: true,
        meta: {
            title: '课程详情'
        }
    },
    {
        path: '/detail/image-text/:productId/:brokerId?',
        name: 'ImageTextDetail',
        component: () => import('../views/product-detail/Image-Text-Detail.vue'),
        props: true,
        meta: {
            title: '图文资料详情'
        }
    },
    {
        path: '/detail/comments/detail',
        name: 'CommentDetail',
        component: () => import('../views/product-detail/Comment-Detail.vue'),
        props: true,
        meta: {
            title: '评论详情'
        }
    },
    {
        path: '/detail/sold-out',
        name: 'SoldOut',
        component: () => import('../views/product-detail/Sold-Out.vue'),
        props: true,
        meta: {
            title: '商品详情'
        }
    }
]
