import axios from 'axios'
// 微信用户-提交订单
// export function physicalorderWechat (openId, data) {
//   return axios.post(`/apis/v1/order/physicalorder/wechat?openId=${openId}`, data)
// }
// 公网用户-提交订单
// export function physicalorder (data) {
//   return axios.post(`/apis/v1/order/physicalorder`, data)
// }

// 用户确认收货
export function confirmReceipt (orderId) {
  return axios.put(`/apis/v1/order/receiving/${orderId}`)
}

// 订单支付成功回调-实体
export function physicalorderPaymentSuccess (orderSn) {
  return axios.put(`/apis/v1/order/physicalorder/payment/success/${orderSn}`)
}
// 订单支付成功回调-虚拟
export function physicalorderPaymentSuccessVirtual (orderSn) {
  return axios.put(`/apis/v1/order/virtualorder/payment/success/${orderSn}`)
}
// 用户申请退货退款
export function returnRequest ({ orderId, operationType, type, refundModel, expressInfoModel }) {
  return axios.put(`/apis/v1/order/physicalorder/refundment/${orderId}?operationType=${operationType}&serviceType=${type}`, { refundModel, expressInfoModel })
}
// 用户取消订单 userType：1 用户取消  2 商户取消
export function cancelOrder (orderId, cancelReason) {
  return axios.put(`/apis/v1/order/cancel/${orderId}?userType=1&cancelReason=${cancelReason}`)
}
// 用户删除订单
export function deleteOrder (orderId) {
  return axios.delete(`/apis/v1/order/current/user/order/${orderId}`)
}
// PUT 用户发货
export function physicalorderShipmentPublic (orderSn) {
  return axios.put(`/apis/v1/order/physicalorder/shipment/public/${orderSn}`)
}
// 获取订单列表
// NEW:待提交 WAIT_PAY:待支付 WAIT_SHIP:待发货 WAIT_RECEIVE:待收货 FINISHED:订单完成 WAIT_REFUND:待退款 WAIT_RETURN:等待买家发货 RETURN_RECEIVE:等待商家收货 CLOSED:订单关闭
export const getOrderList = ({ current, size, orderStatus }) => {
  return axios.get(`/apis/v1/order/current/user/page?current=${current}&size=${size}&orderStatus=${orderStatus}`)
}
// 查看每种订单的数量
export function orderPhysicalorderSummary (userId) {
  // return axios.get(`/apis/v1/order/ordermanager/summary/${userId}`)
  return axios.get(`/apis/v1/order/current/user`)
}
// 订单详情
export function getOrderDetail (orderSn) {
  return axios.get(`/apis/v1/order/detail/${orderSn}`)
}
// 申请发票
export const applyOrderInvoice = (data) => axios.post(`/apis/v1/invoice/OrderInvoice/add/v2`, data)
// 发票详情
export const invoiceDetail = (orderNo) => axios.get(`/apis/v1/invoice/OrderInvoice/findByOrderSn?orderSn=${orderNo}`)
// 提交订单-实体商品   openId 存在时表示供应商商品
// export const submitPhysicalOrder = (data, openId = '') => {
//   return axios.post(`/apis/v1/order/physicalorder/wechat?openId=${openId}`, data)
// }
// 提交订单-虚拟 openId 存在时表示供应商商品
// export const submitVirtualOrder = (data, openId = '') => {
//   return axios.post(`/apis/v1/order/virtualorder/wechat?openId=${openId}`, data)
// }

// 获取待支付商品支付需要的数据（二次支付）
export const getAwaitPayInfo = orderId => axios.post(`/apis/v1/order/secondaryPayment/${orderId}`)

/* GET 商城端-获取订单物流信息 */
export const getFreightData = orderId => axios.get(`/apis/v1/order/logistics/${orderId}`)

// GET 获取数据字典
export const getMap = code => axios.get(`/apis/v1/systemctl/sysdictionary/detail/list/${code}`)

// 申请售后
export const applyRefund = params => axios.post(`/apis/v1/refund/refund/customer/apply`, params)

// 更改退单
export const modifyRefund = params => axios.post(`/apis/v1/refund/refund/customer/modifyRefund`, params)

// 售后列表查询
export const getRefundOrderList = params => axios.post(`/apis/v1/refund/refund/consumer/selectRefund`, params)

// 售后详情查询
export const getRefundOrderDetail = params => axios.post(`/apis/v1/refund/refund/admin/selectRefundDetail`, params)

// 售后数量汇总
export const refundOrderSummary = () => axios.get(`/apis/v1/refund/refund/consumer/selectRefundCountTotal`)

// 售后提交物流信息
export const submitExpressInfo = params => axios.post(`/apis/v1/refund/refund/consumer/shipModify`, params)

// 取消售后申请
export const cancelRefundApplication = params => axios.post(`/apis/v1/refund/refund/admin/cancel`, params)

// 查看申请helper进度
export const getHelperApplicationProgress = () => axios.get(`/apis/v1/agent/user/info/audit/status`)
// 获取是否核销
export const getVerificationStatus = orderId => axios.get(`/apis/v1/redeem/jumpafter?orderId=${orderId}`)
export const setVerificationStatus = orderId => axios.get(`/apis/v1/redeem/jumpbefore?orderId=${orderId}`)
