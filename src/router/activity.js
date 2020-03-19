export default [
    {
        path: '/activity',
        name: 'Activity',
        component: () => import('../views/activity/Index.vue'),
        meta: {
            title: '主会场'
        }
    },
    {
        path: '/second',
        name: 'SecondList',
        component: () => import('../views/activity-list/Second-List.vue'),
        meta: {
            title: '限时秒杀'
        }
    },
    {
        path: '/tuan',
        name: 'TuanList',
        component: () => import('../views/activity-list/Tuan-List.vue'),
        meta: {
            title: '多人拼团'
        }
    },
    {
        path: '/book',
        name: 'BookList',
        component: () => import('../views/activity-list/Book-List.vue'),
        meta: {
            title: '预购'
        }
    },
    {
        path: '/spring-ploughing',
        name: 'SpringPloughing',
        component: () => import('../views/activity-list/Spring-Ploughing.vue'),
        meta: {
            title: '春耘计划'
        }
    },
    {
        path: '/spring-group',
        name: 'SpringGroup',
        component: () => import('../views/activity-list/Spring-Group.vue'),
        meta: {
            title: '新春团购'
        }
    },
    {
        path: '/spring-book',
        name: 'SpringBook',
        component: () => import('../views/activity-list/Spring-Book.vue'),
        meta: {
            title: '新春预购'
        }
    },
    {
        path: '/course-package',
        name: 'CoursePackage',
        component: () => import('../views/activity-list/Course-Package.vue'),
        meta: {
            title: '组合课'
        }
    }
]
