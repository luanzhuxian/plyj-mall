import axios from 'axios'

// 获取首页模块数据
// export const getHomeData = () => axios({ method: 'get', url: '/apis/v1/agency/mall/home/template/public/list' })
export const getTemplate = () => axios.get('/apis/v1/mall/template/current')

// 根据ids查询出售中的商品
export const getProduct = (data) => axios({ method: 'post', url: '/apis/v1/product/find/sale', data })
