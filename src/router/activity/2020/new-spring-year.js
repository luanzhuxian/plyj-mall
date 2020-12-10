export default [
    {
        path: '/2020/new-year-activity/:id?',
        name: 'NewYearActivity',
        component: () => import('../../../views/marketing-activity/new-year/new-year-activity/New-Year-Activity.vue'),
        props: true,
        meta: {
            title: '我心中的年味'
        }
    },
    {
        path: '/2020/spring-ploughing/:brokerId?',
        name: 'SpringPloughing',
        component: () => import('../../../views/marketing-activity/new-year/Spring-Ploughing.vue'),
        props: true,
        meta: {
            title: '春耘计划'
        }
    },
    {
        path: '/2020/spring-group',
        name: 'SpringGroup',
        component: () => import('../../../views/marketing-activity/new-year/Spring-Group.vue'),
        meta: {
            title: '新春团购'
        }
    },
    {
        path: '/2020/spring-book',
        name: 'SpringBook',
        component: () => import('../../../views/marketing-activity/new-year/Spring-Book.vue'),
        meta: {
            title: '新春预购'
        }
    },
    {
        path: '/2020/newcomers/:activityId',
        name: 'newYearNewcomers',
        component: () => import('../../../views/marketing-activity/new-year/newcomers/Newcomers.vue'),
        props: true,
        meta: {
            title: '新人有礼'
        }
    }
]
