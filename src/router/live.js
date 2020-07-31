export default [
    {
        path: '/lived/room/:id',
        name: 'LiveRoom',
        component: () => import('../views/live/Live-Room.vue'),
        meta: {
            title: '直播'
        },
        props: true
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
