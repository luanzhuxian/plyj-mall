export default [
    {
        path: '/red-package/:activityId',
        name: 'RedPackage',
        component: () => import('../../views/marketing-activity/red-package/Index.vue'),
        props: true,
        meta: {
            title: '福利红包'
        }
    },
    {
        path: '/red-package-detail/:id',
        name: 'RedPackageDetail',
        component: () => import('../../views/marketing-activity/red-package/Detail.vue'),
        props: true,
        meta: {
            title: '福利红包详情'
        }
    },
    {
        path: '/red-package-detail/:id',
        name: 'RedPackageDetail',
        component: () => import('../../views/marketing-activity/red-package/Detail.vue'),
        props: true,
        meta: {
            title: '福利红包'
        }
    }
]
