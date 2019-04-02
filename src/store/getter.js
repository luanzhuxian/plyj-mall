export default {
  theme: state => state.theme,
  token: state => state.token,
  smstype: state => state.smstype,
  addressList: state => state.addressList,
  selectedAddress: state => {
    return state.selectedAddress ||
      state.addressList.filter(item => item.defaultAddress === 'YES')[0] ||
      state.addressList[0] ||
      {}
  },
  orderStatus: state => state.orderStatus,

  avatar: state => state.userInfo.img,
  userName: state => state.userInfo.userName,
  agentUser: state => state.userInfo.agentUser, // helper
  isAdmin: state => state.userInfo.roleCode === 'ENTERPRISE_ADMIN', // 企业管理员
  mobile: state => state.userInfo.mobile,
  openId: state => state.userInfo.openId,
  userId: state => state.userInfo.userId,
  balance: state => state.userInfo.balance, // 可提现金额
  currentBalance: state => state.userInfo.currentBalance, // 今日返利
  cumulativeBalance: state => state.userInfo.cumulativeBalance, // 累计返利
  roleCode: state => state.userInfo.roleCode, // 累计返利
  roleMap: state => state.roleMap,
  roleName: state => state.roleMap[state.userInfo.roleCode] || '',

  mallSeq: state => state.mallInfo.sequenceNbr,
  appId: state => state.mallInfo.appid,
  mallDomain: state => state.mallInfo.mallDomain,
  mallName: state => state.mallInfo.mallName,
  mallStatus: state => state.mallInfo.status,
  agencyCode: state => state.mallInfo.agencyCode,
  supportPhone: state => state.mallInfo.supportPhone
}
