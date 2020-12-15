import service from '@/utils/request'

/**
 * 获取所有角色
 */
export function allRoles () {
  return service({
    url: '/api/sys_role/all_roles'
  })
}

/**
 * 获取角色的菜单
 * @param roleId 角色id
 */
export function treeAllRoleMenuPermission (roleId) {
  return service({
    url: '/api/sys_role/tree_all_role_menu_permission',
    params: {
      roleId: roleId
    }
  })
}

/**
 * 添加或修改角色的菜单权限
 * @param roleId 角色id
 * @param menuIds 菜单id，以','连接
 * @param permissionIds 权限id，以','连接
 */
export function saveOrUpdateRoleMenuPermission (roleId, menuIds, permissionIds) {
  return service({
    url: '/api/sys_role/save_or_update_rolemenupermission',
    params: {
      roleId: roleId,
      menuIds: menuIds,
      permissionIds: permissionIds
    }
  })
}

/**
 * 删除角色
 * @param roleId 角色id
 */
export function deleteRole (roleId) {
  return service({
    url: '/api/sys_role/delete_role',
    params: {
      roleId: roleId
    }
  })
}

/**
 * 检查是否存在角色名称
 * @param roleName 角色名称
 */
export function checkExistsRoleName (roleName) {
  return service({
    url: '/api/sys_role/check_exists_rolename',
    params: {
      roleName: roleName
    }
  })
}

/**
 * 检查是否存在角色编号
 * @param roleName 角色编号
 */
export function checkExistsRoleCode (roleCode) {
  return service({
    url: '/api/sys_role/check_exists_rolecode',
    params: {
      roleCode: roleCode
    }
  })
}

/**
 * 添加角色
 * @param reqData
 */
export function addRole (reqData) {
  return service({
    url: '/api/sys_role/add',
    params: reqData
  })
}
