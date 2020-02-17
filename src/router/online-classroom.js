export default [
  {
    path: '/online-classroom/:activeTabId',
    name: 'OnlineClassroomIndex',
    component: () => import('../views/online-classroom/Index.vue'),
    meta: {
      title: '首页'
    }
  }
]
