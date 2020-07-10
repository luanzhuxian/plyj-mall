export default [
    {
        path: '/my',
        name: 'My',
        component: () => import('../views/my/Index.vue'),
        meta: {
            title: '个人中心'
        }
    },
    {
        path: '/my/apply-helper',
        name: 'ApplyHelper',
        component: () => import('../views/my/Apply-Helper.vue'),
        meta: {
            title: '申请Helper'
        }
    },
    {
        path: '/my/coffers',
        name: 'Coffers',
        component: () => import('../views/my/coffers/Coffers.vue'),
        meta: {
            title: '小金库'
        }
    },
    {
        path: '/my/withdraw',
        name: 'WithdrawCash',
        component: () => import('../views/my/coffers/Withdraw-Cash.vue'),
        meta: {
            title: '提现'
        }
    },
    {
        path: '/my/withdraw/success',
        name: 'WithdrawCashSuccess',
        component: () => import('../views/my/coffers/Withdraw-Cash-Success.vue'),
        meta: {
            title: '提现申请成功'
        }
    },
    {
        path: '/my/withdraw/list',
        name: 'WithdrawList',
        component: () => import('../views/my/coffers/Withdraw-List.vue'),
        meta: {
            title: '提现列表'
        }
    },
    {
        path: '/my/withdraw/list/:id',
        name: 'WithdrawDetail',
        component: () => import('../views/my/coffers/Withdraw-Detail.vue'),
        meta: {
            title: '提现详情'
        }
    },
    {
        path: '/my/accumulated-rebate',
        name: 'AccumulatedRebate',
        component: () => import('../views/my/coffers/Accumulated-Rebate.vue'),
        meta: {
            title: '累计润笔'
        }
    },
    {
        path: '/my/shop/helper-poster',
        name: 'HelperPoster',
        component: () => import('../views/my/shop/Helper-Poster.vue'),
        meta: {
            title: 'Helper邀请'
        }
    },
    {
        path: '/my/shop/poster',
        name: 'ShopPoster',
        component: () => import('../views/my/shop/Shop-Poster.vue'),
        meta: {
            title: '店铺海报'
        }
    },
    {
        path: '/my/shop/qrcode',
        name: 'ShopQrcode',
        component: () => import('../views/my/shop/Shop-Qrcode.vue'),
        meta: {
            title: '店铺二维码'
        }
    },
    {
        path: '/my/rebate/list',
        name: 'RebateList',
        component: () => import('../views/my/coffers/Rebate-List.vue'),
        meta: {
            title: '润笔明细'
        }
    },
    {
        path: '/my/welfare/couponCenter',
        name: 'CouponCenter',
        component: () => import('../views/my/welfare/Coupon-Center.vue'),
        meta: {
            title: '领券中心'
        }
    },
    {
        path: '/my/welfare/couponActivity/:couponId',
        name: 'CouponActivity',
        props: true,
        component: () => import('../views/my/welfare/Coupon-Activity.vue'),
        meta: {
            title: '满减活动'
        }
    },
    {
        path: '/my/welfare/historyCoupon',
        name: 'HistoryCoupon',
        component: () => import('../views/my/welfare/History-Coupon.vue'),
        meta: {
            title: '优惠劵历史记录'
        }
    },

    /* ************************************ 我 的 资 源 *********************************** */
    {
        path: '/my/course',
        alias: '/lived/library',
        name: 'CourseLibrary',
        component: () => import('../views/my/video-course/Index.vue'),
        redirect: '/my/course/live',
        meta: {
            title: '视频库'
        },
        children: [
            {
                path: 'live',
                name: 'MyLive',
                component: () => import('../views/my/video-course/Live.vue'),
                meta: {
                    title: '直播课'
                }
            },
            {
                alias: 'courses/:courseType',
                path: 'video/:courseType',
                name: 'VideoCourses',
                component: () => import('../views/my/video-course/Courses.vue'),
                redirect: '/my/course/video/:courseType/single-course-learning/1',
                meta: {
                    // 单课，系列课
                    title: '我的课程'
                },
                children: [
                    {
                        path: 'single-course-learning/:learnStatus',
                        name: 'CourseLearning',
                        component: () => import('../views/my/video-course/Course-Learning.vue'),
                        meta: {
                            title: '课程学习'
                        }
                    }
                ]
            },
            {
                path: 'image-text',
                name: 'MyImageText',
                component: () => import('../views/my/image-text/Index.vue'),
                meta: {
                    title: '我的资料'
                }
            }
        ]
    },
    {
        alias: '/lived/course-watch/:courseId',
        path: '/my/video/watch/:courseId',
        name: 'CourseWatch',
        props: true,
        component: () => import('../views/my/video-course/Course-Watch.vue'),
        meta: {
            title: '观看课程'
        }
    },
    {
        path: '/my/welfare/coupon',
        name: 'MyCoupon',
        component: () => import('../views/my/welfare/Coupon.vue'),
        meta: {
            title: '我的卡券'
        }
    },
    {
        path: '/my/welfare/present',
        name: 'MyPresent',
        component: () => import('../views/my/welfare/Present.vue'),
        meta: {
            title: '我的礼品'
        }
    },
    {
        path: '/my/welfare/burse',
        name: 'MyBurse',
        component: () => import('../views/my/welfare/Burse.vue'),
        meta: {
            title: '我的奖学金'
        }
    },
    {
        path: '/my/welfare/burseRecord',
        name: 'MyBurseRecord',
        component: () => import('../views/my/welfare/Burse-Record.vue'),
        meta: {
            title: '我的奖学金使用记录'
        }
    },
    {
        path: '/my/welfare/burseDetail/:id',
        name: 'MyBurseDetail',
        component: () => import('../views/my/welfare/Burse-Detail.vue'),
        meta: {
            title: '我的奖学金详情'
        }
    },
    {
        path: '/my/welfare/redemption/:status',
        name: 'MyRedemption',
        props: true,
        component: () => import('../views/my/welfare/redemption/Index.vue'),
        meta: {
            title: '我的兑换码'
        }
    },
    {
        path: '/my/welfare/redemption-activative/:code',
        name: 'RedemptionActivative',
        props: true,
        component: () => import('../views/my/welfare/redemption/Activative.vue'),
        meta: {
            // 激活兑换码 使用code激活
            title: '确认激活'
        }
    },
    {
        path: '/my/welfare/redemption-center/:codeId',
        name: 'RedemptionCenter',
        props: true,
        component: () => import('../views/my/welfare/redemption/Center.vue'),
        meta: {
            // 兑换中心
            title: '我的兑换码'
        }
    },
    {
        path: '/my/welfare/redeemed/:codeId',
        name: 'RedeemedProductList',
        props: true,
        component: () => import('../views/my/welfare/redemption/Redeemed.vue'),
        meta: {
            // 已兑换
            title: '我的兑换码'
        }
    }
]
