import Axios from 'axios'

export const axios = Axios.create({
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    },
    responseType: 'text'
})
