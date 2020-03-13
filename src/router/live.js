export default [

    // {
    //   path: '/lived',
    //   name: 'Live',
    //   component: () => import('../views/live/Index.vue'),
    //   meta: {
    //     title: '直播'
    //   }
    // },
    {
        path: '/lived/room',
        name: 'LiveRoom',
        component: () => import('../views/live/Live-Room.vue'),
        meta: {
            title: '直播'
        }
    },
    {
        path: '/lived/library',
        name: 'LiveLibrary',
        component: () => import('../views/live/live-library/Index.vue'),
        redirect: '/lived/library/live',
        meta: {
            title: '视频库'
        },
        children: [
            {
                path: '/lived/library/live',
                name: 'MyLive',
                component: () => import('../views/live/live-library/Live.vue'),
                meta: {
                    title: '我的直播'
                }
            },
            {
                path: '/lived/library/courses',
                name: 'MyCourses',
                component: () => import('../views/live/live-library/Courses.vue'),
                redirect: '/lived/library/courses/course-learning/1',
                meta: {
                    title: '我的课程'
                },
                children: [
                    {
                        path: '/lived/library/courses/course-learning/:learnStatus',
                        name: 'CourseLearning',
                        component: () => import('../views/live/live-library/Course-Learning.vue'),
                        meta: {
                            title: '课程学习'
                        }
                    }
                ]
            }
        ]
    },
    {
        path: '/lived/course-watch/:id',
        name: 'CourseWatch',
        component: () => import('../views/live/live-library/Course-Watch.vue'),
        meta: {
            title: '观看课程'
        }
    },
    {
        path: '/lived/play-back/:id/:activityId/:isValidateEndTime',
        name: 'LivePlayBack',
        props: true,
        component: () => import('../views/live/Live-Play-Back.vue'),
        meta: {
            title: '直播回放'
        }
    }
]
