import { axios } from '../assets/js/axios'

/**
 * 获取购物车列表
 * @return {*}
 */
export const getCartList = () => axios.get('/apis/v1/mall/shopping_cart/query/current')

/**
 * 新增购物车信息
 * @param data
 * @property data.productId
 * @property data.skuCode
 * @property data.count
 * @return {*}
 */
export const addToCart = data => axios.post('/apis/v1/mall/shopping_cart/insert', data)

/**
 * 更新购物车商品的规格
 * @param data
 * @property data.id
 * @property data.skuCode
 * @property data.number
 * @return {Promise<*|*>|Promise<*|*>|Promise<AxiosResponse<T>>|IDBRequest<IDBValidKey>|Promise<void>}
 */
export const updateCartProductSku = data => axios.put('/apis/v1/mall/shopping_cart/update/sku', data)

/**
 * 更新购物车商品的数量
 * @param data {object}
 * @property data.id {string}
 * @property data.number {number}
 * @return {Promise<*|*>|Promise<*|*>|Promise<AxiosResponse<T>>|IDBRequest<IDBValidKey>|Promise<void>}
 */
export const updateCartProductCount = data => axios.put('/apis/v1/mall/shopping_cart/update/number', data)

/**
 * 删除购物车信息
 * @param ids {Array}
 * @return {*}
 */
export const deleteCartProducts = ids => axios.post('/apis/v1/mall/shopping_cart/deletes', ids)

/**
 * 结算
 * @param products {Object}
 * @property products.cartProducts {Array}
 * @return {*}
 */
export const confirmCart = products => axios.post('/apis/v1/order/cart/confirm', products)

/**
 * 提交订单（获取订单号）
 * @param data {Object}
 * @return {*}
 */
export const submitOrder = data => axios.post('/apis/v1/order/unifiedOrder', data)

/**
 * 根据上面那个接口返回的订单号，获取支付码
 * @param id {String} 订单id
 * @return {*}
 */
export const submitOrderPay = id => axios.post(`/apis/v1/order/paymentCode?orderSn=${ id }`)
