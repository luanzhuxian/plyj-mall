export default [
    {
        path: '/red-packet/home',
        name: 'RedPackage',
        component: () => import('../../views/marketing-activity/playing-methods/red-packet/Index.vue'),
        meta: {
            title: '福利红包'
        }
    },
    {
        path: '/red-packet/detail/:activityId',
        name: 'RedPackageDetail',
        component: () => import('../../views/marketing-activity/playing-methods/red-packet/Detail.vue'),
        props: true,
        meta: {
            title: '福利红包详情'
        }
    },
    {
        path: '/red-packet/intro',
        name: 'RedPackageIntro',
        component: () => import('../../views/marketing-activity/playing-methods/red-packet/Intro.vue'),
        props: true,
        meta: {
            title: '福利红包'
        }
    }
]
