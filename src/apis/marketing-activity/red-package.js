import axios from 'axios'

// 创建地址
export const getRedPackageActivities = params => axios.get('/apis/v2/red-package-activities', { params })

// 获取福利红包活动信息
export const getRedPackage = id => axios.get(`/apis/v2/red-package-activities/${ id }`)

// 查询活动统计数据
export const getRedPackageStat = id => axios.get(`/apis/v2/red-package-activities/stat/${ id }`)
