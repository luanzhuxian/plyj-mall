export default [
  {
    path: '/new-year-activity/:id?',
    name: 'NewYearActivity',
    props: true,
    component: () => import('../views/new-year/new-year--activity/New-Year-Activity.vue'),
    meta: {
      title: '我心中的年味'
    }
  }
]
