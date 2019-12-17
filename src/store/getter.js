export default {
  theme: state => state.theme,
  smstype: state => state.smstype,
  addressList: state => state.addressList,
  selectedAddress: state => {
    return state.selectedAddress ||
      state.addressList.find(item => item.defaultAddress === 'YES') ||
      state.addressList[0] ||
      {}
  },
  orderStatusMap: state => state.orderStatusMap,
  orderTypeMap: state => state.orderTypeMap,
  refundTypeMap: state => state.refundTypeMap,

  avatar: state => state.userInfo.img,
  userName: state => state.userInfo.userName,
  realName: state => state.userInfo.realName,
  agentUser: state => state.userInfo.isAgentUser, // helper
  isAdmin: state => state.userInfo.roleCode === 'ENTERPRISE_ADMIN', // 企业管理员
  lockStatus: state => state.userInfo.lockStatus, // 启用状态
  mobile: state => state.userInfo.mobile,
  serverTime: state => state.userInfo.serverTime,
  openId: state => state.openId,
  userId: state => state.userInfo.userId,
  balance: state => state.userInfo.balance, // 可提现金额
  currentBalance: state => state.userInfo.currentBalance, // 今日润笔
  cumulativeBalance: state => state.userInfo.cumulativeBalance, // 累计润笔
  roleCode: state => state.userInfo.roleCode, // 个人角色
  roleMap: state => state.roleMap,
  roleName: state => state.roleMap[state.userInfo.roleCode] || '',

  appId: state => state.mallInfo.appid,
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
  cartCount: state => state.cartCount,
  noticeStatus: state => state.aduitNotice.noticeStatus,
  aduitStatus: state => state.aduitNotice.status,
  activityData: state => state.activityData,
  activityId: state => state.activityData.type,
  isActivityAuth: state => !!state.activityData.type,
  skinId: state => state.skinId,
  liveInfo: state => state.liveInfo,
  d12CouponTotal: state => state.d12CouponTotal,
  xinchunCouponTotal: state => state.xinchunCouponTotal,
  invitingEvent: state => state.invitingEvent,
  jxEvent: state => state.jxEvent,
  nwEvent: state => state.nwEvent
}
