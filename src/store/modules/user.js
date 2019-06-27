/*eslint-disable */
import { login, logout } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import vue from 'vue'
const that = vue.prototype
const jwt = require('jsonwebtoken')
import qs from 'qs'
const state = {
  token: getToken(),
  name: '',
  avatar: '',
  roles: [],
  user_id: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ID: (state, user_id) => {
    state.user_id = user_id
  }
}

const actions = {
  // user login
  login({ commit }, ...userInfo) {
    return new Promise((resolve, reject) => {
      login(qs.stringify(...userInfo))
        .then(response => {
          const { data } = response
          commit('SET_TOKEN', data.access_token)
          setToken(data.access_token)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      if (!getToken()) {
        reject('token error')
      }
      const decodeToken = jwt.decode(getToken())
      const roles = decodeToken.authorities
      if (!roles || roles.length <= 0) {
        reject('getInfo: roles must be a non-null array!')
      }
      commit('SET_ID', decodeToken['userId'])
      commit('SET_ROLES', roles)
      commit('SET_NAME', decodeToken['user_name'])
      commit('SET_AVATAR', 'avatar')
      resolve(decodeToken)
    })
  },

  // user logout 前端自己登出
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resetRouter()
      resolve()
    })
  },
  // 结合后端做单点登出
  logout_sso({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout()
        .then(_ => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resetRouter()
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
