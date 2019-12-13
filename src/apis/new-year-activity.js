import { axios } from '../assets/js/axios'

export const getNewYearActivityDetail = (id) => axios.get(`/apis/v1/newcomerActivitys/${id}`)
