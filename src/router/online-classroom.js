export default [
  {
    path: '/online-classroom',
    name: 'OnlineClassroomIndex',
    redirect: '/online-classroom/interactive-live',
    component: () => import('../views/online-classroom/Index.vue'),
    meta: {
      title: '首页'
    },
    children: [
      {
        path: 'list',
        name: 'OnlineClassroom',
        component: () => import('../views/online-classroom/Online-Classroom.vue'),
        meta: {
          title: '首页' // 线上课程
        }
      },
      {
        path: 'interactive-live',
        name: 'InteractiveLive',
        component: () => import('../views/online-classroom/Interactive-Live.vue'),
        meta: {
          title: '首页' // 互动直播
        }
      }
    ]
  }
]
