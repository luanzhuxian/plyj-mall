export default [
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/home/Index.vue'),
    meta: {
      title: '首页'
    }
  //   children: [
  //     {
  //       path: 'template-a',
  //       name: 'TemplateA',
  //       component: () => import('../views/home/Template-A.vue'),
  //       meta: {
  //         title: '首页'
  //       }
  //     },
  //     {
  //       path: 'template-b',
  //       name: 'TemplateB',
  //       component: () => import('../views/home/Template-B.vue'),
  //       meta: {
  //         title: '首页'
  //       }
  //     }
  //   ]
  }
]
