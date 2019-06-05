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
// 用户取消订单
export function cancelOrder (orderId) {
  return axios.put(`/apis/v1/order/cancel/${orderId}`)
}
// 用户删除订单
export function deleteOrder (orderId) {
  return axios.get(`/apis/v1/order/current/user/order/${orderId}`)
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
  return axios.get(`/apis/v1/order/ordermanager/detail/${orderSn}`)
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

// 售后详情
export const getRefundDetail = orderSn => axios.get(`/apis/v1/order/ordermanager/refund/detail/${orderSn}`)

// 算钱
export const getMoney = (productSeq, optionCode, number, addressSeq) => axios.get(`/apis/v1/product/productinfo/price?productSeq=${productSeq}&optionCode=${optionCode}&number=${number}&addressSeq=${addressSeq}`)
// 算供应商商品的运费
export const getFreight = ({ productSeq, productCount, addressSeq, optionCode }) =>
  axios.post('/apis/v1/order/physicalorder/wechat/freight', null, { params: { productSeq, productCount, addressSeq, optionCode } })
/* GET 商城端-获取订单物流信息 */
export const getFreightData = orderId => axios.get(`/apis/v1/order/logistics/${orderId}`)
