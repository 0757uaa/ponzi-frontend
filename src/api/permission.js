import service from '@/utils/request'

/**
 * 根据菜单id查找相应的权限
 * @param menuId 菜单id
 */
export function listPermissionByMenuId (menuId) {
  return service({
    url: '/api/sys_permission/list_by_menuid',
    params: {
      menuId: menuId
    }
  })
}

/**
 * 删除权限
 * @param permissionId 权限id
 * @param menuId 菜单id
 */
export function deletePermission (permissionId, menuId) {
  return service({
    url: '/api/sys_permission/delete_permission',
    params: {
      permissionId: permissionId,
      menuId: menuId
    }
  })
}

/**
 * 添加权限
 * @param reqData
 */
export function addPermission (reqData) {
  return service({
    url: '/api/sys_permission/add',
    params: reqData
  })
}
