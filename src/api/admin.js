import service from '@/utils/request'

/**
 * 获取用户数据
 * @param reqData
 */
export function getUserList (reqData) {
  return service({
    url: '/api/sys_user/page_query_user',
    params: reqData
  })
}

/**
 * 启用用户
 * @param id
 */
export function enableUser (id) {
  return service({
    url: '/api/sys_user/enable_user',
    params: {
      id: id
    }
  })
}

/**
 * 禁用用户
 * @param id
 */
export function disableUser (id) {
  return service({
    url: '/api/sys_user/disabled_user',
    params: {
      id: id
    }
  })
}

/**
 * 检查是否存在用户名
 * @param roleName 用户名
 */
export function checkExistsUsername (username) {
  return service({
    url: '/api/sys_user/check_exists_username',
    params: {
      username: username
    }
  })
}

/**
 * 添加用户
 * @param reqData
 */
export function addUser (reqData) {
  return service({
    url: '/api/sys_user/add',
    params: reqData
  })
}

/**
 * 查找用户信息及其拥有的角色
 * @param userId 用户id
 */
export function findUserAndRole (userId) {
  return service({
    url: '/api/sys_user/find_user_and_role',
    params: {
      id: userId
    }
  })
}

/**
 * 保存编辑用户
 * @param reqData
 */
export function editUser (reqData) {
  return service({
    url: '/api/sys_user/edit_user',
    params: reqData
  })
}
