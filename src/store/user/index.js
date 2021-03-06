/**
 * 此为用户模块
 */
import * as types from './types.js'
import { fetchUserInfo } from '@/api/userInfo'

const state = {
  role: [], // 存储角色信息
  token: '' // 用户登录成功的token凭证
}

const mutations = {
  [types.USER_INFO] (state, res) {
    state.role = res.data.role
  },
  [types.RESET_ROLE] (state) {
    state.role.length = 0
  }
}

const actions = {
  GetUserInfoAction ({ state }, data) {
    return new Promise((resolve, reject) => {
      fetchUserInfo(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

const getters = {
  role: state => {
    return state.role
  },
  token: state => {
    return state.token
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
