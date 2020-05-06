export default [
    {
        path: '/newcomers/:activityId',
        name: 'Newcomers',
        component: () => import('../views/marketing-activity/double-12/newcomers/Newcomers.vue'),
        meta: {
            title: '新人有礼'
        }
    }
]
