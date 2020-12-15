/**
 * 此为路由、权限模块
 */
import * as types from './types'

const state = {
  routers: [], // 路由
  permissions: [] // 权限
}

const mutations = {
  [types.RM_ROUTES] (state) { // 清除角色
    state.routers.length = 0
  },
  [types.SET_ROUTES] (state, res) { // 设置路由
    state.routers = res
  },
  [types.SET_PERMISSIONS] (state, permissions) { // 设置权限
    state.permissions = permissions
  }
}

const actions = {
  setFilterRoutes ({ state }, data) { // TODO 过滤路由,此为旧方法,但有被引用,待被改造
    return new Promise((resolve, reject) => {
      const result = state.routers
      resolve(result)
    })
  },
  setRoutes ({ commit }, res) { // 设置路由
    commit(types.SET_ROUTES, res)
  },
  setPermissions ({ commit }, permissions) { // 设置权限
    commit(types.SET_PERMISSIONS, permissions)
  }
}

const getters = {
  routers: state => {
    return state.routers
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
