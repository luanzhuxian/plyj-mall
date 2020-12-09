import axios from 'axios'

// 获取福利红包列表
export const getRedPackageList = params => axios.get('/apis/v2/red-package-activities', { params })

// 获取福利红包列表(排序后的)
export const getRedPackageListAfterSort = params => axios.get('/apis/v2/red-package-activities/sortList', { params })

// 获取福利红包活动信息
export const getRedPackage = id => axios.get(`/apis/v2/red-package-activities/${ id }`)

// 查询福利红包弹幕
export const getRedPackageBarrage = () => axios.get('/apis/v2/red-package-activities/barrage')
