export default [
    {
        path: '/road-learning/:id?',
        name: 'RoadLearning',
        props: true,
        component: () => import('../views/marketing-activity/double-12/road-learning/road-learning.vue'),
        meta: {
            title: '见学之旅'
        }
    }
]
