export default [
    {
        path: '/appointment',
        name: 'Appointment',
        component: () => import('../views/appointment/Appointment.vue'),
        props: true,
        meta: {
            title: ''
        }
    },
    {
        path: '/appointment/school-show',
        name: 'SchoolShow',
        component: () => import('../views/appointment/School-Show.vue'),
        props: true,
        meta: {
            title: ''
        }
    },
    {
        path: '/appointment/student-show',
        name: 'StudentShow',
        component: () => import('../views/appointment/Student-Show.vue'),
        props: true,
        meta: {
            title: ''
        }
    }
]
