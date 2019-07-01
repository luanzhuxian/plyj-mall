export default [
  {
    path: '/detail/lesson/:productId/:brokerId?',
    name: 'Lesson',
    component: () => import('../views/detail/Lesson.vue'),
    props: true,
    meta: {
      title: '商品详情'
    }
  },
  {
    path: '/detail/comments/:productId',
    name: 'Comments',
    component: () => import('../views/detail/Comments.vue'),
    props: true,
    meta: {
      title: '评论专区'
    }
  },
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
