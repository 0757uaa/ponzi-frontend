<template>
  <el-table
    ref="multipleTable"
    :data="tableData"
    tooltip-effect="dark"
    style="width: 100%"
    row-key="id"
    default-expand-all
    :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
    <el-table-column
      label="菜单名称"
      header-align="center"
      width="240">
      <template slot-scope="scope">
        <el-checkbox :indeterminate="scope.row.isIndeterminate" v-model="scope.row.checkAll" @change="handleMenuCheckedChange(scope.row)">{{ scope.row.name }}</el-checkbox>
      </template>
    </el-table-column>
    <el-table-column
      label="权限类型">
      <template slot-scope="scope">
        <el-checkbox-group v-if="scope.row.permissions && scope.row.permissions.length > 0" v-model="scope.row.checkedPermissions" @change="handlePermissionCheckedChange(scope.row)">
          <el-checkbox v-for="permission in scope.row.permissions" :label="permission" :key="permission.id">{{permission.name}}</el-checkbox>
        </el-checkbox-group>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  data () {
    return {
      tableData: [{
        id: 1,
        name: '系统管理',
        checkAll: false,
        isIndeterminate: false,
        children: [{
          id: 11,
          name: '用户管理',
          checkAll: false,
          isIndeterminate: false,
          checkedPermissions: [], // 已选中的权限
          permissions: [{
            id: 111,
            name: '管理员-按钮-查询'
          }, {
            id: 112,
            name: '管理员-链接-查询'
          }, {
            id: 113,
            name: '管理员-按钮-禁用'
          }, {
            id: 114,
            name: '管理员-链接-禁用'
          }]
        }, {
          id: 12,
          name: '角色管理',
          checkAll: false,
          isIndeterminate: false
        }, {
          id: 13,
          name: '菜单管理',
          checkAll: false,
          isIndeterminate: false
        }]
      }, {
        id: 2,
        name: '2016-05-03',
        checkAll: false,
        isIndeterminate: false
      }, {
        id: 3,
        name: '2016-05-04',
        checkAll: false,
        isIndeterminate: false
      }]
    }
  },
  methods: {
    // 菜单点击后处理其拥有的权限状态
    handleMenuCheckedChange (row) {
      row.isIndeterminate = false
      row.checkedPermissions = []
      if (row.checkAll) {
        if (row.permissions && row.permissions.length > 0) {
          row.permissions.forEach(value => {
            row.checkedPermissions.push(value)
          })
        }
      }
      this.handleChildrenMenuState(row, row.checkAll)
      this.handleTopMenuState()
    },
    // 单个权限触发后,判断当前菜单的isIndeterminate和checkAll状态
    handlePermissionCheckedChange (row) {
      row.isIndeterminate = row.checkedPermissions.length > 0 && row.checkedPermissions.length < row.permissions.length
      row.checkAll = row.checkedPermissions.length === row.permissions.length
      this.handleTopMenuState()
    },
    // 遍历所有子菜单的checkAll状态,更改父菜单的isIndeterminate和checkAll状态
    handleTopMenuState () {
      this.tableData.forEach(top => {
        if (top.children) {
          let childrenCheckAllLength = 0
          let childrenIsIndeterminate = false
          top.children.forEach(child => {
            if (child.checkAll) {
              childrenCheckAllLength++
            }
            if (child.isIndeterminate) {
              childrenIsIndeterminate = true
            }
          })
          if (childrenCheckAllLength === top.children.length) {
            top.isIndeterminate = false
            top.checkAll = true
          } else if (childrenIsIndeterminate || childrenCheckAllLength > 0) {
            top.isIndeterminate = true
            top.checkAll = false
          } else {
            top.isIndeterminate = false
            top.checkAll = false
          }
        }
      })
    },
    // 当父菜单状态变更后,统一改变子菜单的状态
    handleChildrenMenuState (parentRow, parentMenuState) {
      if (parentRow.children && parentRow.children.length > 0) {
        parentRow.children.forEach(child => {
          child.isIndeterminate = false
          child.checkAll = parentMenuState
          this.handleMenuCheckedChange(child)
        })
      }
    }
  }
}
</script>
