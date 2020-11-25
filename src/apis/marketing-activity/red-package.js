import axios from 'axios'

// 创建地址
export const getRedPackageActivities = params => axios.get('/apis/v2/red-package-activities', { params })
