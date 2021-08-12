'use strict'

import axios from 'axios'
import { baseURL } from './index'

export const create = () => {
  let API = axios.create({
    baseURL: baseURL,
    timeout: 30000
  })

  //ini buat get global ?
  const getAllCases = () => {
    return API.get('all')
  }

  //ini buat get semua negara
  const getAllCountriesCases = () => {
    return API.get('countries')
  }

  //ini buat get negara tertentu
  const getCountriesCases = (country: string) => {
    return API.get(`countries/${country}`)
  }

  return {
    getAllCases,
    getAllCountriesCases,
    getCountriesCases
  }
}

export default { create }