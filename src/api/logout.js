import service from '@/utils/request'

// 退出登录
export const logout = () => {
  return service({
    url: '/api/logout'
  })
}
