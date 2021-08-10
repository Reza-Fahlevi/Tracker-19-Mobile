'use strict'

import API from '../constants/listAPI' //buat import api (?)
import {
  GET_ALL_CASES, GET_ALL_CASES_START, GET_ALL_CASES_STOP, 
  GET_ALL_COUNTRIES_START, GET_ALL_COUNTRIES, GET_ALL_COUNTRIES_STOP,
  GET_COUNTRIES_START, GET_COUNTRIES, GET_COUNTRIES_STOP
} from '../constants' //import variabel dari constant/index

let api = API.create()

//buat dapetin data dari api vv
//prosedur 3 dibawah ini buat negara kah ? kinda curious dimana yang indo :''
export const getAllCases = () => {
  return async (dispatch: any) => {
    try {
      dispatch(showLoading())
      
      let result = await api.getAllCases()         
      dispatch(fetchAllCases(result.data))
      
      dispatch(hideLoading())
    } catch (e) {
      throw e
    }
  }
}

export const getAllCountriesCases = () => {
  return async (dispatch: any) => {
    try {
      dispatch(showAllLoadingCountries())

      let result = await api.getAllCountriesCases()
      dispatch(fetchAllCountriesCases(result.data))

      dispatch(hideAllLoadingCountries())

    } catch (e) {
      throw e
    }
  }
}

export const getCountriesCases = (country: string) => {
  return async (dispatch: any) => {
    try {
      dispatch(showLoadingCountries())
  
      let result = await api.getCountriesCases(country)
      dispatch(fetchCountriesCases(result.data))
  
      dispatch(hideLoadingCountries())
  
    } catch (e) {
      throw e
    }
  }
}

function fetchAllCases(listAllCases: object) {
  return {
    type: GET_ALL_CASES,
    listAllCases
  }
}

function fetchAllCountriesCases(listAllCountriesCases: object) {
  return {
    type: GET_ALL_COUNTRIES,
    listAllCountriesCases
  }
}

function fetchCountriesCases(listCountriesCases: object) {
  return {
    type: GET_COUNTRIES,
    listCountriesCases
  }
}

function showLoading() {
  return {
    type: GET_ALL_CASES_START
  }
}

function hideLoading() {
  return {
    type: GET_ALL_CASES_STOP
  }
}

function showAllLoadingCountries() {
  return {
    type: GET_ALL_COUNTRIES_START
  }
}

function hideAllLoadingCountries() {
  return {
    type: GET_ALL_COUNTRIES_STOP
  }
}

function showLoadingCountries() {
  return {
    type: GET_COUNTRIES_START
  }
}

function hideLoadingCountries() {
  return {
    type: GET_COUNTRIES_STOP
  }
}