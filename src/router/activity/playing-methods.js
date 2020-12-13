export default [
    {
        path: '/activity',
        name: 'Activity',
        component: () => import('../../views/activity/Index.vue'),
        meta: {
            title: '主会场'
        }
    },

    /* 营销中心常规方案 start */
    {
        path: '/sec-kill',
        alias: '/second',
        name: 'SecKillActivity',
        component: () => import('../../views/marketing-activity/playing-methods/sec-kill/Index.vue'),
        meta: {
            title: '秒杀'
        }
    },
    {
        path: '/group',
        name: 'GroupActivity',
        component: () => import('../../views/marketing-activity/playing-methods/group-purchase/Group-Activity.vue'),
        meta: {
            title: '团购'
        }
    },
    {
        path: '/purchase-in-advance',
        alias: '/book',
        name: 'PurchaseInAdvance',
        component: () => import('../../views/marketing-activity/playing-methods/purchase-in-advance/Index.vue'),
        meta: {
            title: '预购'
        }
    },
    {
        path: '/helper',
        name: 'HelperActivity',
        component: () => import('../../views/marketing-activity/playing-methods/helper/Helper-Activity.vue'),
        meta: {
            title: '全民来分销'
        }
    },
    {
        path: '/course-package/:brokerId?',
        name: 'CoursePackage',
        component: () => import('../../views/marketing-activity/playing-methods/combination-of-class/Course-Package.vue'),
        props: true,
        meta: {
            title: '组合聚惠学'
        }
    },
    {
        path: '/newcomers/:id/:shareId?',
        name: 'Newcomers',
        component: () => import('../../views/marketing-activity/playing-methods/newcomers/Index.vue'),
        props: true,
        meta: {
            title: '新人有礼'
        }
    }
]
