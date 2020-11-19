export default [
    {
        path: '/spring-ploughing/:brokerId?',
        name: 'SpringPloughing',
        component: () => import('../../views/marketing-activity/spring/Spring-Ploughing.vue'),
        props: true,
        meta: {
            title: '春耘计划'
        }
    },
    {
        path: '/spring-group',
        name: 'SpringGroup',
        component: () => import('../../views/marketing-activity/spring/Spring-Group.vue'),
        meta: {
            title: '新春团购'
        }
    },
    {
        path: '/spring-book',
        name: 'SpringBook',
        component: () => import('../../views/marketing-activity/spring/Spring-Book.vue'),
        meta: {
            title: '新春预购'
        }
    }
]
