export default [
    {
        path: '/new-year-activity/:id?',
        name: 'NewYearActivity',
        component: () => import('../../views/marketing-activity/new-year/new-year-activity/New-Year-Activity.vue'),
        props: true,
        meta: {
            title: '我心中的年味'
        }
    },
    {
        path: '/road-learning/:id?',
        name: 'RoadLearning',
        component: () => import('../../views/marketing-activity/double-12/road-learning/road-learning.vue'),
        props: true,
        meta: {
            title: '见学之旅'
        }
    },
    {
        path: '/yx/:activityId/:shareUserId?',
        name: 'InviteNewcomers',
        alias: '/invitenewcomers/:activityId/:shareUserId?',
        component: () => import('../../views/marketing-activity/double-12/invitenewcomers/InviteNewcomers.vue'),
        props: true,
        meta: {
            title: '赢取豪礼'
        }
    }
]
