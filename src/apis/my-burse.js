// 我的奖学金
import { axios } from '../assets/js/axios'

// 主页弹窗奖学金列表
export const getDelayBurseList = () => axios.get('/apis/v1/scholarship/waitReveive')

// 主页弹窗瓜分奖学金
export const dispatchBurse = data => axios.post('/apis/v1/scholarship/reveive', data)

// 奖学金管理
export const getBurseMes = () => axios.get('/apis/v1/scholarship/manager')

// 奖学金详情
export const getBurseDetail = id => axios.get(`/apis/v1/scholarship/${ id }`)

// 删除奖学金
export const deleteBurse = ids => axios.put('/apis/v1/scholarship/delete', ids)

// 获取奖学金列表
export const getBurseList = params => axios.get('/apis/v1/scholarship/page', { params })
