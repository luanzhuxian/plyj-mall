import { axios } from '../assets/js/axios'

/*
* 新增发票信息
* @data object {userId, entName, tin}
* */
export const addInvoice = data => axios.post('/apis/v1/base/baseUserInvoice/add', data)

/*
* 获取发票信息列表
* @userId string
* */
export const getInvoiceList = (userId, id = '') => axios.post('/apis/v1/base/baseUserInvoice/select', { userId, id })

/*
* 修改发票信息
* @userId string
* */
export const updateInvoice = data => axios.post('/apis/v1/base/baseUserInvoice/update', data)

/*
* 删除
* @userId string
* */
export const removeInvoice = id => axios.post('/apis/v1/base/baseUserInvoice/delete', { id })

/*
* 申请发票
* @data object {invoiceType, invoiceTitle, tin, orderDetails:[], receiverMobile, userId}
* @orderDetails array [{"orderId":"","orderDetailId":""}]
* */
export const applyInvoice = data => axios.post('/apis/v1/invoice/invoice/consumer/applyInvoice', data)
