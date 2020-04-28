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
        name: 'SecondActivity',
        component: () => import('../views/activity-list/Second-Activity.vue'),
        meta: {
            title: '秒杀'
        }
    },
    {
        path: '/group',
        name: 'GroupActivity',
        component: () => import('../views/activity-list/Group-Activity.vue'),
        meta: {
            title: '团购'
        }
    },
    {
        path: '/book',
        name: 'BookActivity',
        component: () => import('../views/activity-list/Book-Activity.vue'),
        meta: {
            title: '预购'
        }
    },
    {
        path: '/helper',
        name: 'HelperActivity',
        component: () => import('../views/activity-list/Helper-Activity.vue'),
        meta: {
            title: '全民来分销'
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
        path: '/course-package/:brokerId?',
        name: 'CoursePackage',
        props: true,
        component: () => import('../views/activity-list/Course-Package.vue'),
        meta: {
            title: '组合课'
        }
    }
]
