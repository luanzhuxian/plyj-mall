export default [
    {
        path: '/longmen-festival/lottery/:id',
        name: 'LongmenLottery',
        component: () => import('../../../views/marketing-activity/longmen-festival-2020/lottery/Lottery.vue'),
        props: true,
        meta: {
            title: '龙门抽大奖，有粽你就来'
        }
    },
    {
        path: '/longmen-festival/sign-in/:id',
        name: 'LongmenSignIn',
        component: () => import('../../../views/marketing-activity/longmen-festival-2020/sign-in/Index.vue'),
        meta: {
            title: '端午佳话，粽粽有礼'
        }
    },
    {
        path: '/longmen-festival/action/:id',
        name: 'LongmenAction',
        component: () => import('../../../views/marketing-activity/longmen-festival-2020/action/Index.vue'),
        props: true,
        meta: {
            title: '公益行动'
        }
    }
]
