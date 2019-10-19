import { axios } from '../assets/js/axios'
/*
* 获取购物车列表
* */
export const getCartList = () => axios.get('/apis/v1/mall/shopping_cart/query/current')
/*
* 新增购物车信息
* @data object {productId, skuCode, count}
* */
export const addToCart = data => axios.post('/apis/v1/mall/shopping_cart/insert', data)
/*
* 更新购物车商品的规格
* @data object {id, skuCode, number}
* */
export const updateCartProductSku = data => axios.put('/apis/v1/mall/shopping_cart/update/sku', data)
/*
* 更新购物车商品的数量
* @data object {id, number}
* */
export const updateCartProductCount = data => axios.put('/apis/v1/mall/shopping_cart/update/number', data)
/*
* 删除购物车信息
* @ids array
* */
export const deleteCartProducts = ids => axios.post('/apis/v1/mall/shopping_cart/deletes', ids)
/*
* 结算
* @products array { cartProducts: [{productId, optionCode, count}] }
* */
export const confirmCart = products => axios.post('/apis/v1/order/cart/confirm', products)
/*
* 提交订单
* @data object { cartProducts: [ {productId,optionCode,productType,count,message} ] }
* */
export const submitOrder = data => axios.post('/apis/v1/order/unifiedOrder', data)
