<template>
  <div v-loading.fullscreen.lock="fullscreenLoading01">
    <el-card class="box-card">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>角色管理</span>
          <el-button type="primary" size="mini" style="float: right;" @click="onAdd">添加角色</el-button>
        </div>
        <el-table
          v-loading="loading"
          :data="tableData"
          highlight-current-row
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column
            label="序号"
            align="center"
            type="index"
            width="60">
          </el-table-column>
          <el-table-column
            label="角色名称"
            prop="roleName"
            header-align="center"
            align="center"
            width="160">
          </el-table-column>
          <el-table-column
            label="角色编码"
            prop="roleCode"
            header-align="center"
            align="center"
            width="200">
          </el-table-column>
          <el-table-column
            label="操作"
            header-align="center"
            align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" style="margin-left: 10px;" @click="setMenuPermission(scope.row.id)">设置菜单权限</el-button>
              <el-popconfirm
                v-if="scope.row.disabled == false"
                confirm-button-text='确认'
                cancel-button-text='取消'
                icon="el-icon-info"
                icon-color="red"
                title="确认删除？"
                @confirm="deleteRole(scope.row.id)">
                <el-button slot="reference" type="danger" size="mini" style="margin-left: 10px;" @click="suspendDelete($event)">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-card>
    <div style="margin-top: 0px;"></div>
    <el-card class="box-card">
      <role-menu-permission :roleId="selectedRoleId"></role-menu-permission>
    </el-card>
    <dialog-add-role v-if="dialogAddRole.show" :isShow="dialogAddRole.show" @reloadAll="loadAllRoles" @closeDialog="hideDialogAddRole"></dialog-add-role>
  </div>
</template>

<script>
import { allRoles, deleteRole } from '@/api/role.js'
import roleMenuPermission from './components/roleMenuPermission'
import dialogAddRole from './components/dialogAddRole'

export default {
  components: { roleMenuPermission, dialogAddRole },
  data () {
    return {
      fullscreenLoading01: false,
      loading: false,
      tableData: [],
      selectedRoleId: '00',
      dialogAddRole: {
        show: false
      }
    }
  },
  created () {
  },
  mounted () {
    this.$nextTick(() => {
      this.loadAllRoles()
    })
  },
  methods: {
    // 加载所有角色
    loadAllRoles () {
      this.selectedRoleId = '00'
      this.loading = true
      new Promise((resolve, reject) => {
        allRoles().then(res => {
          resolve(res.data)
        })
      }).then(data => {
        this.tableData = data.data
      }).finally(() => {
        this.loading = false
      })
    },
    // 弹出添加角色弹框
    onAdd () {
      this.showDialogAddRole()
    },
    // 显示添加角色弹框
    showDialogAddRole () {
      this.dialogAddRole.show = true
    },
    // 隐藏添加角色弹框
    hideDialogAddRole () {
      this.dialogAddRole.show = false
    },
    // 切换加载角色菜单权限
    setMenuPermission (roleId) {
      this.selectedRoleId = roleId
    },
    deleteRole (roleId) {
      console.log('删除的角色id: ' + roleId)
      if (!roleId) {
        this.$message({
          message: '请选择角色',
          type: 'error',
          duration: 3 * 1000
        })
        return false
      }
      this.fullscreenLoading01 = true
      new Promise((resolve, reject) => {
        deleteRole(roleId).then(res => {
          resolve(res.data)
        })
      }).then(data => {
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 3 * 1000
        })
      }).finally(() => {
        this.fullscreenLoading01 = false
        this.loadAllRoles()
      })
    },
    suspendDelete ($event) {
      console.log('当前点击的事件: ' + JSON.stringify($event))
    }
  }
}
</script>
