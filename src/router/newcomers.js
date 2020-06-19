export default [
    {
        path: '/newcomers/:shareId',
        name: 'Newcomers',
        component: () => import('../views/marketing-activity/newcomers/Newcomers.vue'),
        props: true,
        meta: {
            title: '新人有礼'
        }
    }
]
