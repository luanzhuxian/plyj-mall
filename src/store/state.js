import Cookie from 'js-cookie'
const token = Cookie.get('token') || ''
const openId = Cookie.get('openId') || ''
const refresh_token = Cookie.get('refresh_token') || ''

export default {
  theme: 'base-theme',
  userInfo: {},
  loginInfo: {},
  mallInfo: {},
  token,
  openId,
  refresh_token,
  addressList: [],
  selectedAddress: null, // 选中的地址
  // 短信类型
  smstype: {
    AGENCY_MOBILE_REGISTER: 'AGENCY_MOBILE_REGISTER', // 商户后台-免费注册验证码
    AGENCY_MOBILE_UPDATE: 'AGENCY_MOBILE_UPDATE', // 商户后台-更新资料信息验证码
    AGENCY_MOBILE_PASSWD_REST: 'AGENCY_MOBILE_PASSWD_REST', // 商户后台-忘记密码验证码
    AGENT_USER_INFO: 'AGENT_USER_INFO', // 申请Helper短信验证码
    PUBLIC_USER_INFO: 'PUBLIC_USER_INFO', // 商城端-公网用户短信验证码
    RDSERVER_MOBILE_REGISTER: 'RDSERVER_MOBILE_REGISTER', // 研发服务端-免费注册验证码
    PUBLIC_USER_UPDATE_MOBILE: 'PUBLIC_USER_UPDATE_MOBILE'// 研发服务端-免费注册验证码
  },
  orderStatusMap: {
    NEW: '待提交',
    WAIT_PAY: '待支付',
    WAIT_SHIP: '待发货',
    WAIT_RECEIVE: '待收货',
    FINISHED: '订单完成',
    CLOSED: '订单关闭',
    // POST_SALE_SERVICE  售后状态
    // WAIT_REFUND: '待退款',
    // WAIT_RETURN: '等待买家发货',
    // RETURN_RECEIVE: '等待商家收货',
    // 待发货的待退款
    WAIT_SHIP_REFUND: '待退款',
    // 待收货的待退款
    WAIT_RECEIVE_REFUND: '待退款',
    // 订单完成的待退款
    FINISHED_REFUND: '待退款'
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
  }
}
