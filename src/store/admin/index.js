import { getUserList, enableUser, disableUser } from '@/api/admin'

const admin = {
  state: {
    index_search: { // 首页的搜索条件
      username: ''
    }
  },
  getters: {
    indexSearch: state => state.index_search // 首页的搜索条件
  },
  mutations: {
    SET_INDEX_SEARCH: (state, payload) => {
      state.index_search = payload
    }
  },
  actions: {
    // 条件分页获取用户数据
    pageAdminList ({ commit }, reqData) {
      return new Promise((resolve, reject) => {
        getUserList(reqData).then(response => {
          resolve(response.data)
        })
      })
    },
    // 启用用户
    enableUser ({ commit }, id) {
      return new Promise((resolve, reject) => {
        enableUser(id).then(response => {
          resolve(response.data)
        })
      })
    },
    // 禁用用户
    disableUser ({ commit }, id) {
      return new Promise((resolve, reject) => {
        disableUser(id).then(response => {
          resolve(response.data)
        })
      })
    }
  }
}

export default admin
