export default [
    {
        path: '/classify/:optionId?',
        name: 'Classify',
        component: () => import('../views/classify/Index.vue'),
        props: true,
        meta: {
            title: '分类'
        }
    },
    {
        path: '/search',
        name: 'Search',
        component: () => import('../views/classify/Search.vue'),
        meta: {
            title: '搜索'
        }
    }
]
