export default [
    {
        path: '/red-package/home/',
        name: 'RedPackage',
        component: () => import('../../views/marketing-activity/red-package/Index.vue'),
        meta: {
            title: '福利红包'
        }
    },
    {
        path: '/red-package/detail/:activityId',
        name: 'RedPackageDetail',
        component: () => import('../../views/marketing-activity/red-package/Detail.vue'),
        props: true,
        meta: {
            title: '福利红包详情'
        }
    },
    {
        path: '/red-package/intro',
        name: 'RedPackageIntro',
        component: () => import('../../views/marketing-activity/red-package/Intro.vue'),
        props: true,
        meta: {
            title: '福利红包'
        }
    }
]
