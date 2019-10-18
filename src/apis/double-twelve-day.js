import { axios } from '../assets/js/axios'

// 获取首页模块数据
export const getTemplate = (params) => axios.get('/apis/v1/mall/template/current', { params })
