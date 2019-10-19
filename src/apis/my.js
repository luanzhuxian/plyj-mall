import { axios } from '../assets/js/axios'
export const getNewFreight = () => axios.get('/apis/v1/order/logistics/order/waitReceive')
