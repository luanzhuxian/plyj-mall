import axios from 'axios'
/*
 * 发送验证码
 * smstype AGENCY_MOBILE_REGISTER | AGENCY_MOBILE_UPDATE | AGENCY_MOBILE_PASSWD_REST
 * */
export const sendCode = (smsType, mobile) => axios.post(`/apis/v1/systemctl/sms/${smsType}/verify/${mobile}`)
// 验证手机短信
export const checkMobileCode = (smsType, mobile, verifyCode) => axios.get(`/apis/v1/systemctl/sms/${smsType}/verify/${mobile}/${verifyCode}/verification`)
// 根据域名获取商城id
export const getMallInfo = domainName => axios.get(`/apis/v1/base/baseMall/query/appid?domainName=${domainName}`)

export const getOpenId = (appid, code) => axios.post(`/apis/v1/base/baseUserInfo/${appid}/greet?code=${code}`)
// openId登录
export const login = openId => axios.post(`/apis/v1/privilege/auth/openId`, { openId: openId })
// cookie登录
// export const loginByCookie = () => axios.post(`/apis/v1/privilege/auth/cookie`)
// 获取jsapi
export const getJSApi = appid => axios.get(`/apis/v1/base/baseMall/query/js/api?appid=${appid}`)

// 获取当前用户信息
export function getUserInfo () {
  return axios.get(`/apis/v1/account/account/info`)
}
// 获取TST数据
export const getSTS = () => axios.get('/apis/v1/oss/upload/sts')

// 获取猜你喜欢商品
export const getYouLikeData = (productId) => axios.get(`/apis/v1/product/likes?productId=${productId}`)
// 根据code获取openId (供应商支付时使用)
export const getOpenIdByCode = code => axios.get(`/apis/v1/agency/AgencyMall/penglai/user/openid?code=${code}`)
// 获取朋来appid
export const getPenglaiAppid = () => axios.get(`/apis/v1/agency/AgencyMall/penglai/appid`)

// 用户绑定手机号
export const bindMobile = data => axios.put('/apis/v1/base/baseUserInfo/mobile/bind', data)
// 用户修改手机号
export function updateMobile (data) {
  return axios.put('/apis/v1/base/baseUserInfo/mobile/update', data)
}
//
export const saveLog = data =>
  axios.post('/apis/v1/systemctl/log', data)

// 获取当前用户信息
export const refreshToken = refreshToken => axios.get(`/apis/v1/privilege/auth/refresh?refreshToken=${refreshToken}`)

// 修改用户头像，昵称
export const userInfoSettings = data =>
  axios.post('/apis/v1/base/baseUserInfo/settings', data)
// 获取购物车数量
export const getCartCount = () =>
  axios.get('/apis/v1/mall/shopping_cart/query/count')
// 收集用户信息
export const collectUserInfo = data =>
  axios.post('/apis/v1/base/baseIntentionUser/collectinfo', data)
