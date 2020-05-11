const selectedAddress = JSON.parse(localStorage.getItem('selectedAddress'))
const SHARE_ID = sessionStorage.getItem('SHARE_ID')

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
        serverTime: '',
        realName: '',
        idCardFlag: false
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
    // 主会场信息
    activityData: {},
    // 皮肤id
    skinId: null,
    // 直播
    liveInfo: null,
    // 线上课程
    courseInfo: null,
    // 待领优惠卷
    couponToReceive: null,
    // // 邀新有礼
    // invitingEvent: null,
    // // 见学之路
    // jxEvent: null,
    // 新春年味
    nwEvent: null,
    // 龙门节公益
    dragonGateCharity: null,
    // 龙门节签到
    dragonGateSign: null,
    // 龙门节抽奖
    dragonGatePlay: null,
    // 疫情战报
    campaignReport: null,
    // 疫情签到
    campaignBook: null,
    // 服务器时间
    currentTime: 0,
    // 链接中携带的分享人id
    SHARE_ID: SHARE_ID || '',
    // 不允许支付的商城
    theMallForbiddenPay: [
        '1187288967105314816',
        '1071966573238960128'
    ]
}
