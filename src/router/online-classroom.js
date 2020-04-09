export default [
    {
        path: '/online-classroom',
        name: 'OnlineClassroomIndex',
        redirect: '/online-classroom/interactive-live',
        component: () => import('../views/online-classroom/Index.vue'),
        meta: {
            title: '云课堂'
        },
        children: [
            {
                path: 'list',
                name: 'OnlineClassroom',
                component: () => import('../views/online-classroom/Online-Classroom.vue'),
                meta: {
                    // 精选单课
                    title: '云课堂'
                }
            },
            {
                path: 'list',
                name: 'seriesOfCourses',
                component: () => import('../views/online-classroom/Series-Of-Courses.vue'),
                meta: {
                    // 系列精品课
                    title: '云课堂'
                }
            },
            {
                path: 'interactive-live',
                name: 'InteractiveLive',
                component: () => import('../views/online-classroom/Interactive-Live.vue'),
                meta: {
                    // 互动直播
                    title: '云课堂'
                }
            }
        ]
    }
]
