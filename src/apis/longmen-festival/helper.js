import { axios } from '../../assets/js/axios'

export const getHelperProductList = _ => axios.get('/apis/v1/marketing/activity/product/list')
