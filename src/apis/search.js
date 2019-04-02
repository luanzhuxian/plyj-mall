import axios from 'axios'

// 全局搜索商品
export const searchProduct = params => axios.get(`/apis/v1/product/productinfo/search`, { params })

// 获取热门关键词
export const getHotKeyword = () => axios.get('/apis/v1/product/productinfo/popular/search')

// 获取历史关键词
export const getHistoryKeyword = userId => axios.get(`/apis/v1/product/productinfo/history/search?userId=${userId}`)

// 获取历史关键词
export const deleteHistoryKeyword = userId => axios.delete(`/apis/v1/product/productinfo/history?userId=${userId}`)
