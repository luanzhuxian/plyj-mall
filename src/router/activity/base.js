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
        path: '/second',
        name: 'SecondActivity',
        component: () => import('../../views/marketing-activity/second/Second-Activity.vue'),
        meta: {
            title: '秒杀'
        }
    },
    {
        path: '/group',
        name: 'GroupActivity',
        component: () => import('../../views/marketing-activity/group-purchase/Group-Activity.vue'),
        meta: {
            title: '团购'
        }
    },
    {
        path: '/book',
        name: 'BookActivity',
        component: () => import('../../views/marketing-activity/purchase-in-advance/Book-Activity.vue'),
        meta: {
            title: '预购'
        }
    },
    {
        path: '/helper',
        name: 'HelperActivity',
        component: () => import('../../views/marketing-activity/helper/Helper-Activity.vue'),
        meta: {
            title: '全民来分销'
        }
    },
    {
        path: '/course-package/:brokerId?',
        name: 'CoursePackage',
        component: () => import('../../views/marketing-activity/combination-of-class/Course-Package.vue'),
        props: true,
        meta: {
            title: '组合聚惠学'
        }
    },
    {
        path: '/newcomers/:id/:shareId?',
        name: 'Newcomers',
        component: () => import('../../views/marketing-activity/newcomers/Newcomers.vue'),
        props: true,
        meta: {
            title: '新人有礼'
        }
    },
    {
        path: '/newcomers/:activityId',
        name: 'newYearNewcomers',
        component: () => import('../../views/marketing-activity/new-year/newcomers/Newcomers.vue'),
        props: true,
        meta: {
            title: '新人有礼'
        }
    }
]
