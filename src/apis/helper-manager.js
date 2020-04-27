import { axios } from '../assets/js/axios'

// Helper管理统计数据
export const getHelperData = () => axios.get('/apis/v1/systemctl/memberManager/helper/manager')

// helper商品列表
export const getHelperProductList = _ => axios.get('/apis/v1/marketing/activity/product/list')
