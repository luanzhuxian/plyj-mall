const order = {
    state: {
        // 短信类型
        smstype: {
            // 商户后台-免费注册验证码
            AGENCY_MOBILE_REGISTER: 'AGENCY_MOBILE_REGISTER',
            // 商户后台-更新资料信息验证码
            AGENCY_MOBILE_UPDATE: 'AGENCY_MOBILE_UPDATE',
            // 商户后台-忘记密码验证码
            AGENCY_MOBILE_PASSWD_REST: 'AGENCY_MOBILE_PASSWD_REST',
            // 申请Helper短信验证码
            AGENT_USER_INFO: 'AGENT_USER_INFO',
            // 商城端-公网用户短信验证码
            PUBLIC_USER_INFO: 'PUBLIC_USER_INFO',
            // 研发服务端-免费注册验证码
            RDSERVER_MOBILE_REGISTER: 'RDSERVER_MOBILE_REGISTER',
            // 研发服务端-免费注册验证码
            PUBLIC_USER_UPDATE_MOBILE: 'PUBLIC_USER_UPDATE_MOBILE'
        },
        // 商品活动类型
        skuSourceMap: {
            1: '普通商品',
            2: '团购',
            3: '限时秒杀',
            4: '预购',
            5: '春耘计划',
            6: '组合聚惠学',
            7: '公益助力'
        },
        // 商品活动类型关键字
        skuSourceKeyMap: {
            NORMAL: 1,
            GROUP: 2,
            SECOND: 3,
            BOOKING: 4,
            SPRINGPLOUGHING: 5,
            COURSEPACKAGE: 6,
            WELFARE: 7
        },
        // 订单状态
        orderStatusMap: {
            NEW: '待提交',
            WAIT_PAY: '待付款',
            WAIT_PAY_TAIL_MONEY: '待付尾款',
            WAIT_SHIP: '待发货',
            WAIT_RECEIVE: '待收货',
            FINISHED: '交易成功',
            CLOSED: '订单关闭',
            // AFTER_SALE  售后状态
            // WAIT_REFUND: '待退款',
            // WAIT_RETURN: '等待买家发货',
            // RETURN_RECEIVE: '等待商家收货',
            // 待发货的待退款
            WAIT_SHIP_REFUND: '待退款',
            // 待收货的待退款
            WAIT_RECEIVE_REFUND: '待退款',
            // 交易成功的待退款
            FINISHED_REFUND: '待退款'
        },
        // 订单状态关键字
        orderStatuskeyMap: {
            WAIT_PAY: 'WAIT_PAY',
            WAIT_PAY_TAIL_MONEY: 'WAIT_PAY_TAIL_MONEY',
            WAIT_SHIP: 'WAIT_SHIP',
            WAIT_RECEIVE: 'WAIT_RECEIVE',
            FINISHED: 'FINISHED',
            CLOSED: 'CLOSED'
        },
        // 订单类型
        orderTypeMap: {
            PHYSICAL_GOODS: '实体商品',
            VIRTUAL_GOODS: '虚拟商品',
            FORMAL_CLASS: '正式课',
            EXPERIENCE_CLASS: '体验课',
            KNOWLEDGE_COURSE: '知识课程',
            SERIES_OF_COURSE: '系列课程',
            LIVE_GOODS: '直播',
            VIDEO_GOODS: '录播'
        },
        // 订单类型关键字
        orderTypeKeyMap: {
            PHYSICAL_GOODS: 'PHYSICAL_GOODS',
            VIRTUAL_GOODS: 'VIRTUAL_GOODS',
            FORMAL_CLASS: 'FORMAL_CLASS',
            EXPERIENCE_CLASS: 'EXPERIENCE_CLASS',
            KNOWLEDGE_COURSE: 'KNOWLEDGE_COURSE',
            SERIES_OF_COURSE: 'SERIES_OF_COURSE',
            LIVE_GOODS: 'LIVE_GOODS',
            VIDEO_GOODS: 'VIDEO_GOODS'
        },
        // 售后状态
        refundStatusMap: {
            1: '退款中',
            2: '退款成功',
            3: '退款驳回',
            //  退换货-已退货
            4: '退款中',
            //  退换货-待退货
            5: '待退货',
            9: '退款中'
        },
        refundTypeMap: {
            1: '仅退款',
            2: '退款退货'
        },
        // 申请售后后的状态
        aftersaleStatusKeyMap: {
        // 无售后
            NO_AFTER_SALES: 'NO_AFTER_SALES',
            // 处理中
            PROCESSING: 'PROCESSING',
            // 处理完成
            PROCESSING_COMPLETED: 'PROCESSING_COMPLETED'

        }
    },
    getters: {
        smstype: state => state.smstype,
        skuSourceMap: state => state.skuSourceMap,
        skuSourceKeyMap: state => state.skuSourceKeyMap,
        orderStatusMap: state => state.orderStatusMap,
        orderStatuskeyMap: state => state.orderStatuskeyMap,
        orderTypeMap: state => state.orderTypeMap,
        orderTypeKeyMap: state => state.orderTypeKeyMap,
        refundStatusMap: state => state.refundStatusMap,
        refundTypeMap: state => state.refundTypeMap,
        aftersaleStatusKeyMap: state => state.aftersaleStatusKeyMap
    }
}
export default order
