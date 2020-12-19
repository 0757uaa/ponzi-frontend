<template>
  <div v-loading.fullscreen.lock="fullscreenLoading">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>菜单权限设置</span>
        <el-button v-check-opt="'role:button:save_set'" type="primary" size="mini" style="float: right;" @click="saveSetting">保存设置</el-button>
      </div>
      <div class="text item">
        <el-table
          ref="multipleTable"
          v-loading="loading"
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
              <el-checkbox :indeterminate="scope.row.indeterminate" v-model="scope.row.checkAll" @change="handleMenuCheckedChange(scope.row)">{{ scope.row.menuName }}</el-checkbox>
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="left"
            label="权限类型">
            <template slot-scope="scope">
              <el-checkbox-group v-if="scope.row.permissions && scope.row.permissions.length > 0" v-model="scope.row.checkedPermissions" @change="handlePermissionCheckedChange(scope.row)" style="width: 100%">
                <el-checkbox v-for="permission in scope.row.permissions" :label="permission.id" :key="permission.id" style="width: 30%">{{permission.permissionName}}</el-checkbox>
              </el-checkbox-group>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import { treeAllRoleMenuPermission, saveOrUpdateRoleMenuPermission } from '@/api/role.js'

export default {
  name: 'roleMenuPermission',
  data () {
    return {
      fullscreenLoading: false,
      loading: false,
      selectedMenuIds: [], // 已选中菜单id
      selectedPermissionIds: [], // 已选中权限id
      tableData: [
        //   {
        //   id: 1,
        //   menuName: '系统管理',
        //   checkAll: false,
        //   isIndeterminate: false,
        //   children: [{
        //     id: 11,
        //     menuName: '用户管理',
        //     checkAll: false,
        //     isIndeterminate: false,
        //     checkedPermissions: [111, 112], // 已选中的权限
        //     permissions: [{
        //       id: 111,
        //       permissionName: '管理员-按钮-查询'
        //     }, {
        //       id: 112,
        //       permissionName: '管理员-链接-查询'
        //     }, {
        //       id: 113,
        //       permissionName: '管理员-按钮-禁用'
        //     }, {
        //       id: 114,
        //       permissionName: '管理员-链接-禁用'
        //     }]
        //   }, {
        //     id: 12,
        //     menuName: '角色管理',
        //     checkAll: false,
        //     isIndeterminate: false
        //   }, {
        //     id: 13,
        //     menuName: '菜单管理',
        //     checkAll: false,
        //     isIndeterminate: false
        //   }]
        // }, {
        //   id: 2,
        //   menuName: '2016-05-03',
        //   checkAll: false,
        //   isIndeterminate: false
        // }, {
        //   id: 3,
        //   menuName: '2016-05-04',
        //   checkAll: false,
        //   isIndeterminate: false
        // }
      ]
    }
  },
  props: {
    roleId: String
  },
  watch: {
    roleId: {
      handler (newVal) {
        this.loadData()
      },
      deep: true
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    loadData () {
      this.loading = true
      new Promise((resolve, reject) => {
        treeAllRoleMenuPermission(this.roleId).then(res => {
          resolve(res.data)
        })
      }).then(data => {
        this.tableData = data.data
      }).finally(() => {
        this.loading = false
      })
    },
    // 菜单点击后处理其拥有的权限状态
    handleMenuCheckedChange (row) {
      row.indeterminate = false
      row.checkedPermissions = []
      if (row.checkAll) {
        if (row.permissions && row.permissions.length > 0) {
          row.permissions.forEach(value => {
            row.checkedPermissions.push(value.id)
          })
        }
      }
      this.handleChildrenMenuState(row, row.checkAll)
      this.handleTopMenuState()
    },
    // 单个权限触发后,判断当前菜单的isIndeterminate和checkAll状态
    handlePermissionCheckedChange (row) {
      row.indeterminate = row.checkedPermissions.length > 0 && row.checkedPermissions.length < row.permissions.length
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
            if (child.indeterminate) {
              childrenIsIndeterminate = true
            }
          })
          if (childrenCheckAllLength === top.children.length) {
            top.indeterminate = false
            top.checkAll = true
          } else if (childrenIsIndeterminate || childrenCheckAllLength > 0) {
            top.indeterminate = true
            top.checkAll = false
          } else {
            top.indeterminate = false
            top.checkAll = false
          }
        }
      })
    },
    // 当父菜单状态变更后,统一改变子菜单的状态
    handleChildrenMenuState (parentRow, parentMenuState) {
      if (parentRow.children && parentRow.children.length > 0) {
        parentRow.children.forEach(child => {
          child.indeterminate = false
          child.checkAll = parentMenuState
          this.handleMenuCheckedChange(child)
        })
      }
    },
    // 保存设置
    saveSetting () {
      if (!this.roleId || this.roleId === '00') {
        this.$message({
          message: '请选择角色',
          type: 'error',
          duration: 3 * 1000
        })
        return false
      }
      this.selectedMenuIds = []
      this.selectedPermissionIds = []
      this.tableData.forEach(top => {
        this.cycleMenu(top)
      })
      this.fullscreenLoading = true
      new Promise((resolve, reject) => {
        saveOrUpdateRoleMenuPermission(this.roleId, this.selectedMenuIds.join(','), this.selectedPermissionIds.join(',')).then(res => {
          resolve(res.data)
        })
      }).then(data => {
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 3 * 1000
        })
      }).finally(() => {
        this.fullscreenLoading = false
      })
    },
    // 循环获取
    cycleMenu (menu) {
      if (menu.checkAll || (menu.indeterminate && !menu.checkAll)) {
        this.selectedMenuIds.push(menu.id)
        if (menu.checkedPermissions && menu.checkedPermissions.length > 0) {
          menu.checkedPermissions.forEach(permissionId => {
            this.selectedPermissionIds.push(permissionId)
          })
        }
        if (menu.children && menu.children.length > 0) {
          menu.children.forEach(child => {
            this.cycleMenu(child)
          })
        }
      }
    }
  }
}
</script>

<style>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .box-card {
    width: 100%;
  }
</style>
