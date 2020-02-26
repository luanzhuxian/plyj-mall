import Axios from 'axios'

export const axios = Axios.create({
  timeout: 150000000000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})
