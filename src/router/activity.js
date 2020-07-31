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
        path: '/spring-ploughing/:brokerId?',
        name: 'SpringPloughing',
        props: true,
        component: () => import('../views/marketing-activity/spring/Spring-Ploughing.vue'),
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
    {
        path: '/course-package/:brokerId?',
        name: 'CoursePackage',
        props: true,
        component: () => import('../views/marketing-activity/combination-of-class/Course-Package.vue'),
        meta: {
            title: '组合聚惠学'
        }
    }
]
