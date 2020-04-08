export default {
    theme: state => state.theme,
    smstype: state => state.smstype,
    addressList: state => state.addressList,
    selectedAddress: state => state.selectedAddress ||
      state.addressList.find(item => item.defaultAddress === 'YES') ||
      state.addressList[0] ||
      {},
    orderStatusMap: state => state.orderStatusMap,
    orderTypeMap: state => state.orderTypeMap,
    refundTypeMap: state => state.refundTypeMap,

    avatar: state => state.userInfo.img,
    userName: state => state.userInfo.userName,
    realName: state => state.userInfo.realName,
    idCardFlag: state => state.userInfo.idCardFlag,
    // helper
    agentUser: state => state.userInfo.isAgentUser,
    // 企业管理员
    isAdmin: state => state.userInfo.roleCode === 'ENTERPRISE_ADMIN',
    // 启用状态
    lockStatus: state => state.userInfo.lockStatus,
    mobile: state => state.userInfo.mobile,
    serverTime: state => state.userInfo.serverTime,
    openId: state => state.openId,
    userId: state => state.userInfo.userId,
    // 可提现金额
    balance: state => state.userInfo.balance,
    // 今日润笔
    currentBalance: state => state.userInfo.currentBalance,
    // 累计润笔
    cumulativeBalance: state => state.userInfo.cumulativeBalance,
    // 个人角色
    roleCode: state => state.userInfo.roleCode,
    roleMap: state => state.roleMap,
    roleName: state => state.roleMap[state.userInfo.roleCode] || '',

    appId: state => state.mallInfo.appid,
    mchId: state => state.mallInfo.mchId,
    address: state => state.mallInfo.address,
    mallDomain: state => state.mallInfo.mallDomain,
    mallName: state => state.mallInfo.mallName,
    mallUrl: state => state.mallInfo.mallUrl,
    mallDesc: state => state.mallInfo.mallDesc,
    logoUrl: state => state.mallInfo.logoUrl,
    mallStatus: state => state.mallInfo.status,

    // supportPhone: state => state.mallInfo.supportPhone,
    servicePhoneModels: state => state.mallInfo.servicePhoneModels,
    mallId: state => state.mallInfo.sequenceNbr,
    liveRoomEnable: state => state.mallInfo.liveRoomEnable,
    cartCount: state => state.cartCount,
    noticeStatus: state => state.aduitNotice.noticeStatus,
    aduitStatus: state => state.aduitNotice.status,

    // 首页 / 主会场活动数据
    activityData: state => state.activityData,
    activityId: state => state.activityData.type,
    isActivityAuth: state => !!state.activityData.type,
    skinId: state => state.skinId,
    liveInfo: state => state.liveInfo,
    courseInfo: state => state.courseInfo,
    d12CouponTotal: state => state.d12CouponTotal,
    xinchunCouponTotal: state => state.xinchunCouponTotal,
    invitingEvent: state => state.invitingEvent,
    jxEvent: state => state.jxEvent,
    nwEvent: state => state.nwEvent,
    campaignReport: state => state.campaignReport,
    campaignBook: state => state.campaignBook,
    // 服务器时间
    currentTime: state => state.currentTime,

    // 全局数据
    shareId: state => state.SHARE_ID,

    // 杂项
    // 是否禁止支付
    forbiddenPay: state => state.theMallForbiddenPay.includes(state.mallInfo.sequenceNbr)
}
