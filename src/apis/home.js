import axios from 'axios'

// 获取首页模块数据
export const getTemplate = (params) => axios.get('/apis/v1/mall/template/current', { params })

// 根据ids查询出售中的商品
export const getProduct = (data) => axios({ method: 'post', url: '/apis/v1/product/find/sale', data })
