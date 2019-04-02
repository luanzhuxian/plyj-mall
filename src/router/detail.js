export default [
  // {
  //   path: '/detail/feature/:productSeq/:brokerId?',
  //   name: 'FeatureLesson',
  //   component: () => import('../views/detail/Feature-Lesson.vue'),
  //   meta: {
  //     title: '特色课详情'
  //   }
  // },
  // {
  //   path: '/detail/audition/:productSeq/:brokerId?',
  //   name: 'Audition',
  //   component: () => import('../views/detail/Audition.vue'),
  //   meta: {
  //     title: '试听课详情'
  //   }
  // },
  // {
  //   path: '/detail/group-buying/:productSeq/:brokerId?',
  //   name: 'GroupBuying',
  //   component: () => import('../views/detail/Group-Buying.vue'),
  //   meta: {
  //     title: '特惠团购详情'
  //   }
  // },
  {
    path: '/detail/lesson/:productSeq/:brokerId?',
    name: 'Lesson',
    component: () => import('../views/detail/Lesson.vue'),
    props: true,
    meta: {
      title: '商品详情'
    }
  },
  {
    path: '/detail/comments/:productSeq',
    name: 'Comments',
    component: () => import('../views/detail/Comments.vue'),
    props: true,
    meta: {
      title: '评论专区'
    }
  },
  // {
  //   path: '/detail/lessons',
  //   name: 'AllLesson',
  //   component: () => import('../views/detail/All-Lesson.vue'),
  //   meta: {
  //     title: '全部课程'
  //   }
  // }
  {
    path: '/detail/sold-out',
    name: 'SoldOut',
    component: () => import('../views/detail/Sold-Out.vue'),
    props: true,
    meta: {
      title: '朋来雅集'
    }
  }
]
