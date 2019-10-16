import { axios } from '../assets/js/axios'

// 全局搜索商品
export const searchProduct = params => axios.get('/apis/v1/product/search', { params })

// 获取热门关键词
export const getHotKeyword = () => axios.get('/apis/v1/product/popular/search')

// 获取历史关键词
export const getHistoryKeyword = () => axios.get('/apis/v1/product/history/record')

// 删除历史关键词
export const deleteHistoryKeyword = () => axios.delete('/apis/v1/product/history')
