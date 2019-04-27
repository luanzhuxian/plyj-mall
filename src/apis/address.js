import axios from 'axios'
// 创建地址
export const createAddress = (data) => axios.post('/apis/v1/publicuser/address', Object.assign(data, { type: 2 }))
// 获取地址列表
export const getAddress = ({ agencyCode, mallSeq, type = 2 }) =>
  axios.get(`/apis/v1/publicuser/address/me/list?agencyCode=${agencyCode}&mallSeq=${mallSeq}&type=${type}`)

export const updateAddress = (data, sequenceNbr) => axios.put(`/apis/v1/publicuser/address/${sequenceNbr}`, Object.assign(data, { type: 2 }))

// export const setDefaultAddress = (sequenceNbr) => axios.put(`/apis/v1/publicuser/address/default/${sequenceNbr}`)

export const deleteAddress = (sequenceNbr) => axios.delete(`/apis/v1/publicuser/address/${sequenceNbr}?type=2`)

export const getCityListByParentId = parentCode => axios.get(`/apis/v1/systemctl/location/parent/${parentCode}`)
