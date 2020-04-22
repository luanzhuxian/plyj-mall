export default [
    {
        path: '/longmen-festival/lottery/:id?',
        name: 'LongmenLottery',
        props: true,
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
    },
    {
        path: '/longmen-festival/action/:id',
        name: 'LongmenAction',
        props: true,
        component: () => import('../views/longmen-festival/action/Index.vue'),
        meta: {
            title: '公益粽行动'
        }
    },
    {
        path: '/longmen-festival/helper',
        name: 'LongMenHelper',
        component: () => import('../views/longmen-festival/helper/Index.vue'),
        meta: {
            title: '全民来分销'
        }
    }
]
