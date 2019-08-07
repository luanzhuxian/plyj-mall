export default [
  {
    path: '/appointment',
    name: 'Appointment',
    component: () => import('../views/appointment/Appointment.vue'),
    props: true,
    meta: {
      title: '朋来雅集'
    }
  },
  {
    path: '/appointment/school-show',
    name: 'SchoolShow',
    component: () => import('../views/appointment/School-Show.vue'),
    props: true,
    meta: {
      title: '朋来雅集'
    }
  }
]
