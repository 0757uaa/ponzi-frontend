import { logout } from '@/api/logout.js'

import Cookie from 'js-cookie'
import NProgress from 'nprogress'
import store from '@/store'

/**
 * 登录失效的处理
 */
export const logoutHandler = () => {
  new Promise((resolve, reject) => {
    logout().then(res => {
      resolve()
    })
  }).then(data => {}).finally(() => {
    Cookie.remove('menus')
    Cookie.remove('permissions')
    Cookie.remove('user')
    Cookie.remove('role')
    store.commit('clearAllTags')
    store.commit('user/RESET_ROLE') // 清除角色
    store.commit('permiss/RM_ROUTES') // 清空routes for sidebar
    localStorage.removeItem('pageOpenedList')
    setTimeout(() => {
      // 为了修复直接通过vue-router 无刷新退出 导致 Duplicate named routes definition bug
      // 刷新是为了清空 路由源保留的路由状态
      location.reload()
    }, 0)
    NProgress.done()
  })
}
