import { axios } from '../assets/js/axios'

// 微信用户-提交订单
// export function physicalorderWechat (openId, data) {
//   return axios.post(`/apis/v1/order/physicalorder/wechat?openId=${openId}`, data)
// }
// 公网用户-提交订单
// export function physicalorder (data) {
//   return axios.post(`/apis/v1/order/physicalorder`, data)
// }

// 用户确认收货
// export const confirmReceipt = orderId => axios.put(`/apis/v1/order/receiving/${ orderId }`)

// 订单支付成功回调-实体
export const physicalorderPaymentSuccess = orderSn => axios.put(`/apis/v1/order/physicalorder/payment/success/${ orderSn }`)

// 订单支付成功回调-虚拟
export const physicalorderPaymentSuccessVirtual = orderSn => axios.put(`/apis/v1/order/virtualorder/payment/success/${ orderSn }`)

// 用户申请退货退款
export const returnRequest = ({ orderId, operationType, type, refundModel, expressInfoModel }) => axios.put(`/apis/v1/order/physicalorder/refundment/${ orderId }?operationType=${ operationType }&serviceType=${ type }`, { refundModel, expressInfoModel })
// 用户删除订单
// export const deleteOrder = orderId => axios.delete(`/apis/v1/order/current/user/order/${ orderId }`)

// PUT 用户发货
export const physicalorderShipmentPublic = orderSn => axios.put(`/apis/v1/order/physicalorder/shipment/public/${ orderSn }`)

// 获取订单列表
// ALL_ORDER:所有订单 NEW:待提交 WAIT_PAY:待支付 WAIT_SHIP:待发货 WAIT_RECEIVE:待收货 FINISHED:订单完成 WAIT_REFUND:待退款 WAIT_RETURN:等待买家发货 RETURN_RECEIVE:等待商家收货 CLOSED:订单关闭
export const getOrderList = ({ current, size, orderStatus }) => axios.get(`/apis/v2/order/user/page?current=${ current }&size=${ size }&orderStatus=${ orderStatus }`)

// 获取待评论订单列表
export const getWaitCommentOrderList = ({ current, size }) => axios.get(`/apis/v2/order/user/waitComment/page?current=${ current }&size=${ size }`)

// 查看每种订单的数量
// export const orderPhysicalorderSummary = () => axios.get(`/apis/v1/order/current/user`)
// 发票详情
export const invoiceDetail = orderNo => axios.get(`/apis/v1/invoice/OrderInvoice/findByOrderSn?orderSn=${ orderNo }`)

// 提交订单-实体商品   openId 存在时表示供应商商品
// export const submitPhysicalOrder = (data, openId = '') => {
//   return axios.post(`/apis/v1/order/physicalorder/wechat?openId=${openId}`, data)
// }
// 提交订单-虚拟 openId 存在时表示供应商商品
// export const submitVirtualOrder = (data, openId = '') => {
//   return axios.post(`/apis/v1/order/virtualorder/wechat?openId=${openId}`, data)
// }

// 获取待支付商品支付需要的数据（二次支付）
// export const getAwaitPayInfo = orderId => axios.post(`/apis/v1/order/secondaryPayment/${ orderId }`)

/* GET 商城端-获取订单物流信息 */
export const getFreightData = orderId => axios.get(`/apis/v1/order/logistics/${ orderId }`)

// GET 获取数据字典
export const getMap = code => axios.get(`/apis/v1/systemctl/sysdictionary/detail/list/${ code }`)

// 获取最大退款值
// export const getMaxRefund = orderProductRId => axios.get(`/apis/v1/refund/refund/getAmountOfRefundable/${ orderProductRId }`)

// 申请售后
// export const applyRefund = params => axios.post(`/apis/v1/refund/refund/customer/apply`, params)

// 更改退单
export const modifyRefund = params => axios.post(`/apis/v2/order/refunds/update/refund`, params)

// 售后列表查询
// export const getRefundOrderList = params => axios.post(`/apis/v1/refund/refund/consumer/selectRefund`, params)

// 售后详情查询
// export const getRefundOrderDetail = params => axios.post(`/apis/v1/refund/refund/admin/selectRefundDetail`, params)

// 售后数量汇总
export const refundOrderSummary = () => axios.get(`/apis/v1/refund/refund/consumer/selectRefundCountTotal`)

// 售后提交物流信息
export const submitExpressInfo = params => axios.post(`/apis/v2/order/refunds/return/goods`, params)

// 取消售后申请
// export const cancelRefundApplication = params => axios.post(`/apis/v1/refund/refund/admin/cancel`, params)

// 删除售后申请
// export const deleteRefundOrder = params => axios.post(`/apis/v1/refund/refund/admin/delete`, params)

// 查看申请helper进度
export const getHelperApplicationProgress = () => axios.get(`/apis/v1/agent/user/info/audit/status`)

// 获取是否核销
export const getVerificationStatus = orderId => axios.get(`/apis/v2/redeem/jumpafter?orderId=${ orderId }`)
export const setVerificationStatus = orderId => axios.get(`/apis/v2/redeem/jumpbefore?orderId=${ orderId }`)

/**
 * 获取待付尾款订单列表
 * @param params
 * @property {number} params.current
 * @property {number} params.size
 * @return {Promise<*>}
 */
// export const waitPayBalance = params => axios.get(`/apis/v1/order/current/user/pre/page`, { params })

/**
 * 获取待付尾款订单支付信息
 * @param orderSn {string}
 * @return {Promise<*>}
 */
// export const getWaitPayBalanceInfo = orderSn => axios.post(`/apis/v1/order/preOrderSecondaryPayment/${ orderSn }`)

/**
 * 检查购买后是否领到礼物
 * @param orderSn
 * @return {Promise<*>}
 */
export const checkGetGift = orderSn => axios.get(`/apis/v1/order/gift?orderId=${ orderSn }`)

/* ***************************************************************************** v2 ********************************************************************************** */
/**
 * 订单确认，用于计算订单金额，获取钉钉商品详情等，进入提交页面时最先调用的接口
 * @param data {Object}
 * @return {Promise<*>}
 */
export const confirmOrder = data => axios.post(`/apis/v2/order/confirm`, data)

/**
 * 提交订单，参数于confirmOrder相同
 * @param data {Object}
 * @return {Promise<*>}
 */
export const submitOrder = data => axios.post(`/apis/v2/order/uniformly`, data)

/**
 * 获取支付数据
 * @param orderBatchNumber {String} 批次号
 * @return {Promise<*>}
 */
export const getOrderPayData = orderBatchNumber => axios.post(`/apis/v2/order/pay/paymentCode?orderBatchNumber=${ orderBatchNumber }`)

/**
 * 因为支付失败，根据批次号取消订单
 * @param batchNumber {String} 批次号
 * @return {Promise<*>}
 */
export const cancleOrderListByBatchNumber = batchNumber => axios.get(`/apis/v2/order/cancel/batch?batchNumber=${ batchNumber }`)

/**
 * 订单详情
 * @param orderId {String}
 * @return {Promise<*>}
 */
export const getOrderDetail = orderId => axios.get(`/apis/v2/order/detail?orderId=${ orderId }`)

/**
 * 申请发票
 * @param data {Object}
 * @return {Promise<*>}
 */
export const applyOrderInvoice = data => axios.post(`/apis/v1/invoice/OrderInvoice/add/v2`, data)

/**
 * 用户取消订单
 * @param orderId {String}
 * @param cancelReason {String} 取消订单理由
 * @return {*}
 */
export const cancelOrder = (orderId, cancelReason) => axios.get(`/apis/v2/order/cancel?orderId=${ orderId }&message=${ cancelReason }`)

/**
 * 申请售后
 * @param {Object} data - 订单数据
 * @param {number} data.amount - 退款金额
 * @param {string} data.content - 退款描述
 * @param {boolean} data.freightRefund - 是否退运费
 * @param {string[]} data.images - 图片地址列表
 * @param {string} data.orderId - 订单id
 * @param {Number} data.type
 * @return {Promise<Object>}
 */
export const applyRefund = data => axios.post('/apis/v2/order/refunds/apply/refund', data)

/**
 * 获取待支付商品支付需要的数据（二次支付）
 * @param {string} orderId - 订单id
 * @return {Promise<Object>}
 */
export const getAwaitPayInfo = orderId => axios.post(`/apis/v2/order/pay/sub/paymentCode/${ orderId }`)

/**
 * 获取待付尾款商品支付需要的数据（尾款）
 * @param {string} orderId - 订单id
 * @return {Promise<Object>}
 */
export const getAwaitTailPayInfo = orderId => axios.post(`/apis/v2/order/pay/tail/money/${ orderId }`)

/**
 * 计算可退款最大金额
 * @param {string} orderId - 订单id
 * @param {string} type - 售后类型
 * @return {*}
 */
export const getMaxRefund = (orderId, type) => axios.post('/apis/v2/order/refunds/max/amount', { orderId, type })

/**
 * 确认收货
 * @param {string} orderId - 订单id
 * @return {*}
 */
export const confirmReceipt = orderId => axios.get(`/apis/v2/order/confirm/receipt?orderId=${ orderId }`)

/**
 * 删除订单
 * @param {string} orderId - 订单id
 * @return {*}
 */
export const deleteOrder = orderId => axios.get(`/apis/v2/order/delete?orderId=${ orderId }`)

/**
 * 获取售后订单列表
 * @param {Object} params - 分页参数 + 页签
 * @return {*}
 */
export const getRefundOrderList = params => axios.get(`/apis/v2/order/refunds/orderRefund/consumer/page`, { params })

/**
 * 售后详情查询
 * @param {Object} id - 售后单id
 * @return {*}
 */
export const getRefundOrderDetail = id => axios.get(`/apis/v2/order/refunds/detail?id=${ id }`)

/**
 * 取消售后
 * @param {Object} id - 售后单id
 * @return {*}
 */
export const cancelRefundApplication = id => axios.get(`/apis/v2/order/refunds/cancel?id=${ id }`)

/**
 * 删除售后
 * @param {Object} id - 售后单id
 * @return {*}
 */
export const deleteRefundOrder = id => axios.post(`/apis/v2/order/refunds/delete?orderId=${ id }`)

/**
 * 查看每种订单的数量
 * @param {}
 * @return {*}
 */
export const orderPhysicalorderSummary = () => axios.get(`/apis/v2/order/statistics/user`)

/**
 * 获取退货地址
 * @param {}
 * @return {*}
 */
export const getRefundAdress = goodId => axios.get(`/apis/v2/product/return/address?goodId=${ goodId }`)
