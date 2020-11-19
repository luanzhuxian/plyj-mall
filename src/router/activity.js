export default [
    {
        path: '/activity',
        name: 'Activity',
        component: () => import('../views/activity/Index.vue'),
        meta: {
            title: '主会场'
        }
    },

    /* 营销中心常规方案 start */
    {
        path: '/second',
        name: 'SecondActivity',
        component: () => import('../views/marketing-activity/second/Second-Activity.vue'),
        meta: {
            title: '秒杀'
        }
    },
    {
        path: '/group',
        name: 'GroupActivity',
        component: () => import('../views/marketing-activity/group-purchase/Group-Activity.vue'),
        meta: {
            title: '团购'
        }
    },
    {
        path: '/book',
        name: 'BookActivity',
        component: () => import('../views/marketing-activity/purchase-in-advance/Book-Activity.vue'),
        meta: {
            title: '预购'
        }
    },
    {
        path: '/helper',
        name: 'HelperActivity',
        component: () => import('../views/marketing-activity/helper/Helper-Activity.vue'),
        meta: {
            title: '全民来分销'
        }
    },
    {
        path: '/course-package/:brokerId?',
        name: 'CoursePackage',
        component: () => import('../views/marketing-activity/combination-of-class/Course-Package.vue'),
        props: true,
        meta: {
            title: '组合聚惠学'
        }
    },
    {
        path: '/newcomers/:id/:shareId?',
        name: 'Newcomers',
        component: () => import('../views/marketing-activity/newcomers/Newcomers.vue'),
        props: true,
        meta: {
            title: '新人有礼'
        }
    },
    {
        path: '/newcomers/:activityId',
        name: 'newYearNewcomers',
        component: () => import('../views/marketing-activity/new-year/newcomers/Newcomers.vue'),
        props: true,
        meta: {
            title: '新人有礼'
        }
    },
    {
        path: '/red-package/:activityId',
        name: 'RedPackage',
        component: () => import('../views/marketing-activity/red-package/Index.vue'),
        props: true,
        meta: {
            title: '福利红包'
        }
    },
    {
        path: '/red-package-detail/:id',
        name: 'RedPackageDetail',
        component: () => import('../views/marketing-activity/red-package/Detail.vue'),
        props: true,
        meta: {
            title: '福利红包详情'
        }
    },

    /* 营销中心常规方案 end */

    /* 新春 start */
    {
        path: '/spring-ploughing/:brokerId?',
        name: 'SpringPloughing',
        component: () => import('../views/marketing-activity/spring/Spring-Ploughing.vue'),
        props: true,
        meta: {
            title: '春耘计划'
        }
    },
    {
        path: '/spring-group',
        name: 'SpringGroup',
        component: () => import('../views/marketing-activity/spring/Spring-Group.vue'),
        meta: {
            title: '新春团购'
        }
    },
    {
        path: '/spring-book',
        name: 'SpringBook',
        component: () => import('../views/marketing-activity/spring/Spring-Book.vue'),
        meta: {
            title: '新春预购'
        }
    },

    /* 新春 end */

    /* 龙门节 start */
    {
        path: '/longmen-festival/lottery/:id',
        name: 'LongmenLottery',
        component: () => import('../views/marketing-activity/longmen-festival/lottery/Lottery.vue'),
        props: true,
        meta: {
            title: '龙门抽大奖，有粽你就来'
        }
    },
    {
        path: '/longmen-festival/sign-in/:id',
        name: 'LongmenSignIn',
        component: () => import('../views/marketing-activity/longmen-festival/sign-in/Index.vue'),
        meta: {
            title: '端午佳话，粽粽有礼'
        }
    },
    {
        path: '/longmen-festival/action/:id',
        name: 'LongmenAction',
        component: () => import('../views/marketing-activity/longmen-festival/action/Index.vue'),
        props: true,
        meta: {
            title: '公益行动'
        }
    },

    /* 龙门节 end */

    /* 其他活动 start */
    {
        path: '/new-year-activity/:id?',
        name: 'NewYearActivity',
        component: () => import('../views/marketing-activity/new-year/new-year-activity/New-Year-Activity.vue'),
        props: true,
        meta: {
            title: '我心中的年味'
        }
    },
    {
        path: '/road-learning/:id?',
        name: 'RoadLearning',
        component: () => import('../views/marketing-activity/double-12/road-learning/road-learning.vue'),
        props: true,
        meta: {
            title: '见学之旅'
        }
    },
    {
        path: '/yx/:activityId/:shareUserId?',
        name: 'InviteNewcomers',
        alias: '/invitenewcomers/:activityId/:shareUserId?',
        component: () => import('../views/marketing-activity/double-12/invitenewcomers/InviteNewcomers.vue'),
        props: true,
        meta: {
            title: '赢取豪礼'
        }
    }

    /* 其他活动 end */
]
