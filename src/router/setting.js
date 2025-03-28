export default [
    {
        path: '/my/setting',
        name: 'Setting',
        component: () => import('../views/my/setting/Index.vue'),
        meta: {
            title: '设置'
        }
    },
    {
        path: '/my/edit',
        name: 'SettingEdit',
        component: () => import('../views/my/setting/Edit.vue'),
        meta: {
            title: '设置'
        }
    },
    {
        path: '/my/setting/bind-mobile',
        name: 'BindMobile',
        component: () => import('../views/my/setting/Bind-Mobile.vue'),
        meta: {
            title: '设置手机'
        }
    },
    {
        path: '/my/address',
        name: 'Address',
        component: () => import('../views/my/address/Index.vue'),
        meta: {
            title: '我的地址'
        }
    },
    {
        path: '/my/address/add/:addressId?',
        name: 'AddAddress',
        component: () => import('../views/my/address/Add.vue'),
        props: true,
        meta: {
            title: '地址管理'
        }
    },
    {
        path: '/my/setting/invoice',
        name: 'Invoice',
        component: () => import('../views/my/invoice/Invoice.vue'),
        meta: {
            title: '我的发票'
        }
    },
    {
        path: '/my/setting/invoice/edit/:id?',
        name: 'AddInvoice',
        props: true,
        component: () => import('../views/my/invoice/Add-Invoice.vue'),
        meta: {
            title: '发票管理'
        }
    },
    {
        path: '/my/setting/invoice/apply',
        name: 'ApplyInvoice',
        props: true,
        component: () => import('../views/my/invoice/Apply-Invoice.vue'),
        meta: {
            title: '发票管理'
        }
    },
    {
        path: '/my/setting/student',
        name: 'StudentList',
        props: true,
        component: () => import('../views/my/student/List.vue'),
        meta: {
            title: '学员管理'
        }
    },
    {
        path: '/my/setting/student/add/:id?',
        name: 'AddStudent',
        props: true,
        component: () => import('../views/my/student/Add.vue'),
        meta: {
            title: '新增学员'
        }
    },
    {
        path: '/my/setting/student/edit/:id',
        name: 'EditStudent',
        props: true,
        component: () => import('../views/my/student/Add.vue'),
        meta: {
            title: '编辑学员'
        }
    }
]
