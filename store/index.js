import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { vuexfireMutations } from 'vuexfire'

export const strict = false

export const state = () => ({
  user: null,
  userinfo: null,
})

export const mutations = { 
    setUser (state, payload) {
        state.user = payload
    },

    setUserInfo (state, payload) {
        state.userinfo = payload
    },

    ...vuexfireMutations
}

export const actions = {
  setUser ({ commit }, payload) {
    commit('setUser', payload)
  },

  setUserInfo ({ commit }, payload) {
    commit('setUserInfo', payload)
  },

  callApi: async (context, payload) => {
    let api = axios.create()
    api.defaults.baseURL = 'http://localhost:3000/api/'

    await api({
        url: payload.url,
        method: payload.method,
        params: payload.params
    })
    .then((res) => {
        console.log(res)
    })
}
}

export const getters = {
  isAuthenticated (state) {
    return !!state.user
  }
}