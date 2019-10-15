import axios from 'axios'
// 获取商品详情
export const getProductDetail = goodsId => axios.get(`/apis/v1/product/detail/${goodsId}?source=1`)
// 创建分享连接
export const createBrokerShare = productId => axios.post(`/apis/v1/agent/user/share/record/create`, { productId })
// C 端用户进入商品详情优惠券列表
export const getCouponInDetail = () => axios.get('/apis/v1/coupon/list/productDetail')
