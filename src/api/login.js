import service from '@/utils/request'

// 登录
export const login = ({ username, password }) => {
  return service({
    url: '/api/sys_user/login/noauth/login',
    params: {
      username: username,
      password: password
    }
  })
}
