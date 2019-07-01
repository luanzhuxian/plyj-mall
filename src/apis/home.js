import axios from 'axios'

// 获取首页模块数据
export const getHomeData = () => axios({ method: 'get', url: `/apis/v1/agency/mall/home/template/public/list` })
// 获取首页商品信息
export const getHomeProduct = (data) => axios({ method: 'post', url: `/apis/v1/product/find/sale`, data })
