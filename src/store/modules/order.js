const refundGoodsInfo = JSON.parse(sessionStorage.getItem('REFUND_GOODS'))
const orderOperatedList = JSON.parse(sessionStorage.getItem('UPDATE_ORDER_LIST') || '[]')
const refundOperatedList = JSON.parse(sessionStorage.getItem('UPDATE_REFUND_LIST') || '[]')
export default {
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
            7: '公益助力',
            8: '兑换码'
        },
        // 商品活动类型关键字
        skuSourceKeyMap: {
            // 普通商品
            NORMAL: 1,
            // 团购商品
            GROUP: 2,
            // 秒杀商品
            SECOND: 3,
            // 预购商品
            BOOKING: 4,
            // 春耘
            SPRINGPLOUGHING: 5,
            // 组合聚惠学
            COURSEPACKAGE: 6,
            // 公益助力
            WELFARE: 7,
            // 兑换码
            EXCHANGECODE: 8
        },
        // 订单状态
        orderStatusMap: {
            NEW: '待提交',
            WAIT_PAY: '待付款',
            WAIT_PAY_TAIL_MONEY: '待付尾款',
            WAIT_SHIP: '待发货',
            WAIT_RECEIVE: '待收货',
            WAIT_RECEIVE_OF_VIRTUAL: '待使用',
            FINISHED: '已完成',
            // 取消订单/申请售后 后的订单
            CLOSED: '订单关闭'
        },
        // 订单状态关键字
        orderStatuskeyMap: {
            WAIT_PAY: 'WAIT_PAY',
            WAIT_PAY_TAIL_MONEY: 'WAIT_PAY_TAIL_MONEY',
            WAIT_SHIP: 'WAIT_SHIP',
            WAIT_RECEIVE: 'WAIT_RECEIVE',
            WAIT_RECEIVE_OF_VIRTUAL: 'WAIT_RECEIVE_OF_VIRTUAL',
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
            VIDEO_GOODS: '录播',
            GRAPHIC_DATA: '图文资料'
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
            VIDEO_GOODS: 'VIDEO_GOODS',
            GRAPHIC_DATA: 'GRAPHIC_DATA'
        },
        // 课程类
        courseTypeMap: {
            1: 'KNOWLEDGE_COURSE',
            2: 'SERIES_OF_COURSE'
        },
        auditStatusMap: {
            0: '售后关闭',
            1: '待审核',
            // 审核通过显示业务状态
            2: '',
            3: '售后驳回'
        },
        // 售后状态 退货退款时，可能有以下所有状态；仅退款时，无1，2，3状态
        refundStatusMap: {
            1: '待退货',
            // 待收货
            2: '待退款',
            // 退货完成
            3: '待退款',
            // 待退款
            4: '待退款',
            5: '退款中',
            6: '退款成功',
            7: '退款失败'
        },
        refundTypeMap: {
            1: '退货退款',
            2: '仅退款'
        },
        // 申请售后后的状态
        aftersaleStatusKeyMap: {
            // 无售后
            NO_AFTER_SALES: 'NO_AFTER_SALES',
            // 处理中
            PROCESSING: 'PROCESSING',
            // 处理完成
            PROCESSING_COMPLETED: 'PROCESSING_COMPLETED'
        },
        aftersaleStatusMap: {
            // 无售后
            NO_AFTER_SALES: '',
            // 处理中
            PROCESSING: '售后中',
            // 处理完成
            PROCESSING_COMPLETED: '退款完成'
        },
        // 要申请售后的商品信息
        refundGoodsInfo,
        // 订单操作方式
        orderActionMap: {
            // 支付订单
            pay: 'pay',
            // 确认收货
            receive: 'receive',
            // 取消订单
            cancel: 'cancel',
            // 删除订单
            delete: 'delete',
            // 已评论
            comment: 'comment',
            // 已发货
            ship: 'ship'
        },
        orderOperatedList,
        refundOperatedList
    },
    mutations: {
        // 缓存要申请售后的商品信息
        setRefundGoods: (state, goods) => {
            const goodsStr = JSON.stringify(goods)
            state.refundGoodsInfo = JSON.parse(goodsStr)
            sessionStorage.setItem('REFUND_GOODS', goodsStr)
        },
        // 在订单列表子页面操作记录，返回子元素列表后原地更新
        setOrderOperatedList: (state, actionInfo) => {
            const arr = JSON.parse(localStorage.getItem('UPDATE_ORDER_LIST') || '[]')
            arr.push(actionInfo)
            state.orderOperatedList = arr
            localStorage.setItem('UPDATE_ORDER_LIST', JSON.stringify(arr))
        },
        // 更新订单列表后，清楚配置项
        clearOrderOperatedList: state => {
            localStorage.removeItem('UPDATE_ORDER_LIST')
        },
        // 在订单列表子页面操作记录，返回子元素列表后原地更新
        setRefundOperatedList: (state, actionInfo) => {
            const arr = JSON.parse(localStorage.getItem('UPDATE_REFUND_LIST') || '[]')
            arr.push(actionInfo)
            state.refundOperatedList = arr
            console.log(arr)
            localStorage.setItem('UPDATE_REFUND_LIST', JSON.stringify(arr))
        },
        // 更新订单列表后，清楚配置项
        clearRefundOperatedList: state => {
            localStorage.removeItem('UPDATE_REFUND_LIST')
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
        auditStatusMap: state => state.auditStatusMap,
        refundTypeMap: state => state.refundTypeMap,
        aftersaleStatusKeyMap: state => state.aftersaleStatusKeyMap,
        aftersaleStatusMap: state => state.aftersaleStatusMap,
        refundGoodsInfo: state => state.refundGoodsInfo,
        orderActionMap: state => state.orderActionMap,
        orderOperatedList: state => state.orderOperatedList,
        refundOperatedList: state => state.refundOperatedList,
        courseTypeMap: state => state.courseTypeMap
    }
}
