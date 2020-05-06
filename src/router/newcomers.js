export default [
    {
        path: '/newcomers/:activityId',
        name: 'Newcomers',
        component: () => import('../views/activity/2019-double-12/newcomers/Newcomers.vue'),
        meta: {
            title: '新人有礼'
        }
    }
]
