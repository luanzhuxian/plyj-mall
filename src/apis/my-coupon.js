import { axios } from '../assets/js/axios'

// C端用户查询我礼品列表
export const getCityListByParentId = (params) => axios.get(`/apis/v1/gift/me/list`, { params })

// C端用户删除我的礼品
export const deleteGift = data => axios.post('/apis/v1/gift/me/delete', data)
