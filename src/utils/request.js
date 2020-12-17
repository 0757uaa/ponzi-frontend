import axios from 'axios'
import { Message } from 'element-ui'

import { logoutHandler } from './errorHandler'

// base setting
// const BASE_URL = process.env.NODE_ENV === 'production'
//   ? 'production api'
//   : 'development api'
const BASE_URL = 'http://127.0.0.1:8080'

const service = axios.create({
  // baseURL: BASE_URL,
  timeout: 10000,
  method: 'post'
})

service.interceptors.request.use(config => {
  config.headers['Content-Type'] = 'application/json; charset=UTF-8'
  // config.headers['Authorization'] = localStorage.getItem('token')
  return config
}, error => {
  Promise.reject(error)
})
// TODO 需要改造
// 2. 权限不足处理
// 3. 资源不存在处理
// 4. 服务器响应超时处理
service.interceptors.response.use(response => {
  /**
  * 这里可以做接口相关的拦截设置
  */
  const res = response.data
  if (res.status === 401) {
    Message({
      message: res.message,
      type: 'error',
      duration: 6 * 1000
    })
  } else if (res.status === 4000) {
    Message({
      message: '登录失效,请先登录',
      type: 'error',
      duration: 6 * 1000
    })
    logoutHandler()
  }
  return response
}, error => {
  Message({
    message: error.message,
    type: 'error',
    duration: 6 * 1000
  })
  return Promise.reject(error)
})

export default service
