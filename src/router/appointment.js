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
    path: '/appointment/detail',
    name: 'AppointmentDetail',
    component: () => import('../views/appointment/Appointment-Detail.vue'),
    props: true,
    meta: {
      title: '朋来雅集'
    }
  }
]
