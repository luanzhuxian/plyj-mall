export default [
    {
        path: '/lived/room/:id',
        name: 'LiveRoom',
        component: () => import('../views/online-classroom/live-room/Live-Room.vue'),
        meta: {
            title: '直播'
        },
        props: true
    },
    {
        path: '/lived/play-back/:id/:activityId/:isValidateEndTime',
        name: 'LivePlayBack',
        props: true,
        component: () => import('../views/online-classroom/live-room/Live-Play-Back.vue'),
        meta: {
            title: '直播回放'
        }
    }
]
