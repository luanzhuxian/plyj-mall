export default [
    {
        path: '/longmen-festival/lottery',
        name: 'LongmenLottery',
        component: () => import('../views/longmen-festival/Lottery.vue'),
        meta: {
            title: '龙门抽大奖，有粽你就来'
        }
    },
    {
        path: '/longmen-festival/sign-in/:id',
        name: 'LongmenSignIn',
        component: () => import('../views/longmen-festival/sign-in/Index.vue'),
        meta: {
            title: '端午佳话，粽粽有礼'
        }
    }
]
