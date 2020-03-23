const selectedAddress = JSON.parse(localStorage.getItem('selectedAddress'))
export default {
    theme: 'base-theme',
    cartCount: 0,
    aduitNotice: {
        noticeStatus: '',
        status: ''
    },
    userInfo: {
        isAgentUser: false,
        applyBalance: 0,
        awaitBalance: 0,
        balance: 0,
        cumulativeBalance: 0,
        currentBalance: 0,
        img: '',
        mobile: null,
        openId: '',
        rejectBalance: 0,
        roleCode: '',
        lockStatus: '',
        status: null,
        successBalance: 0,
        userId: '',
        userName: '',
        serverTime: ''
    },
    loginInfo: {
        SESSION_ID: '',
        expire: '',
        refresh_token: '',
        refresh_token_expire: '',
        token: '',
        userId: ''
    },
    mallInfo: {
        appid: '',
        componentAppid: '',
        address: '',
        logoUrl: '',
        mallDesc: '',
        mallDomain: '',
        mallName: '',
        mallUrl: '',
        sequenceNbr: '',
        servicePhoneModels: [],
        // 是否开通云课堂，开通了房间就算
        liveRoomEnable: false,
        mchId: '',
        // 是否是老方法授权的
        appSecret: false
    },
    openId: '',
    addressList: [],
    students: [],
    // 选中的地址
    selectedAddress,
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
    roleMap: {
        SUPER_ADMIN: '超级管理员',
        ENTERPRISE_ADMIN: '企业级管理',
        ADMIN: '高级管理员',
        EMPLOYEE: '子账号',
        HELPER: 'Helper',
        MEMBERSHIP: '普通会员',
        SUPER_ADMIN_EMPLOYEE: '朋来雅集商户中心员工账号',
        VISITOR: '游客'
    },
    orderStatusMap: {
        NEW: '待提交',
        WAIT_PAY: '待付款',
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
    orderTypeMap: {
        PHYSICAL: '实体商品',
        VIRTUAL: '虚拟商品',
        FORMAL_CLASS: '课程商品',
        EXPERIENCE_CLASS: '课程商品',
        KNOWLEDGE_COURSE: '知识课程'
    },
    refundTypeMap: {
        1: '仅退款',
        2: '退款退货'
    },

    // 主会场信息
    activityData: {},
    // 皮肤id
    skinId: null,
    // 直播
    liveInfo: null,
    // 线上课程
    courseInfo: null,
    // 已领双十二优惠卷
    d12CouponTotal: null,
    // 已领新春优惠卷
    xinchunCouponTotal: null,
    // 邀新有礼
    invitingEvent: null,
    // 见学之路
    jxEvent: null,
    // 新春年味
    nwEvent: null,
    // 服务器时间
    currentTime: 0
}
