import axios from 'axios'
// 创建地址
export const createAddress = (data) => axios.post('/apis/v1/publicuser/address', data)
// 获取地址列表
export const getAddress = agencyCode =>
  axios.get(`/apis/v1/publicuser/address/me/list?agencyCode=${agencyCode}`)

export const updateAddress = (data, sequenceNbr) => axios.put(`/apis/v1/publicuser/address/${sequenceNbr}`, data)

export const setDefaultAddress = (sequenceNbr) => axios.put(`/apis/v1/publicuser/address/default/${sequenceNbr}`)

export const deleteAddress = (sequenceNbr) => axios.delete(`/apis/v1/publicuser/address/${sequenceNbr}`)

export const getCityListByParentId = parentCode => axios.get(`/apis/v1/systemctl/location/parent/${parentCode}`)
