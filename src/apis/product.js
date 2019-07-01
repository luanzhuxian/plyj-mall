import axios from 'axios'
// 获取商品详情
export const getProductDetail = goodsId => axios.get(`/apis/v1/product/detail/${goodsId}?source=1`)
// 创建分享连接
export const createBrokerShare = productId => axios.post(`/apis/v1/agent/user/share/record/create`, { productId })
