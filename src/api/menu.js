import service from '@/utils/request'

/**
 * 获取所有菜单
 */
export function treeAllMenu () {
  return service({
    url: '/api/sys_menu/tree_all_menu'
  })
}

/**
 * 添加菜单
 * @param reqData
 */
export function addMenu (reqData) {
  return service({
    url: '/api/sys_menu/add',
    params: reqData
  })
}

/**
 * 删除菜单
 * @param id
 */
export function deleteMenu (id) {
  return service({
    url: '/api/sys_menu/delete',
    params: {
      menuId: id
    }
  })
}
