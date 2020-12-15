<template>
  <el-dialog
    :visible.sync="isVisible"
    :title="title"
    :close-on-click-modal='false'
    :close-on-press-escape='false'
    :modal-append-to-body="false"
    @close="closeDialog">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="菜单权限" name="menuPermission">
        <el-table
          v-loading="tableData.loading"
          :data="tableData.permissionList"
          border
          stripe
          highlight-current-row
          header-cell-class-name="table-header-class"
          style="width:100%">
          <el-table-column
            property="permissionName"
            label="权限名称"
            width="280"
            header-align="center"
            align='left'>
          </el-table-column>
          <el-table-column
            property="permissionCode"
            label="权限代码"
            header-align="center"
            align='left'>
          </el-table-column>
          <el-table-column
            property="permissionType"
            label="权限类型"
            width="120"
            align='center'
            :formatter="formatterPermissionType">
          </el-table-column>
          <el-table-column
            label="操作"
            width="100"
            align='center'>
            <template slot-scope="scope">
              <el-popconfirm
                confirm-button-text='确定'
                cancel-button-text='取消'
                icon="el-icon-info"
                icon-color="red"
                title="确定删除？"
                @confirm="deleteMenu(scope.row.id)">
                <el-button slot="reference" type="danger" size="mini" style="margin-left: 10px;">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="添加权限" name="addPermission">
        <div class="form">
          <el-form
            ref="form"
            :model="form"
            :rules="form_rules"
            style="width: 100%;">
            <el-form-item prop='permissionName'  label="权限名称:">
              <el-input v-model="form.permissionName" placeholder="请填写权限名称"></el-input>
            </el-form-item>

            <el-form-item prop='permissionCode' label="权限代码:">
              <el-input v-model="form.permissionCode" placeholder="请填写权限代码"></el-input>
            </el-form-item>

            <el-form-item prop='permissionType' label="权限类型:">
              <el-input v-model="form.permissionType" placeholder="请填写权限类型(0:链接, 1:按钮)"></el-input>
            </el-form-item>

            <el-form-item  class="text_right">
              <el-button @click="isVisible = false">取 消</el-button>
              <el-button type="primary" @click='onSubmit("form")'>提  交</el-button>
            </el-form-item>

          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
import { listPermissionByMenuId, deletePermission, addPermission } from '@/api/permission.js'
export default {
  name: 'dialogMenuPermission',
  data () {
    return {
      isVisible: this.isShow,
      title: '菜单权限',
      activeName: 'menuPermission',
      tableData: {
        loading: false,
        permissionList: []
      },
      form: {
        permissionName: '',
        permissionCode: '',
        permissionType: ''
      },
      form_rules: {
        permissionName: [
          { required: true, message: '权限名称不能为空！', trigger: 'blur' }
        ],
        permissionCode: [
          { required: true, message: '权限代码不能为空！', trigger: 'blur' }
        ],
        permissionType: [
          { required: true, message: '请选择权限类型！', trigger: 'blur' }
        ]
      }
    }
  },
  props: {
    isShow: Boolean,
    menuId: String // 菜单id
  },
  created () {
  },
  mounted () {
    this.clearFormData()
    this.loadData()
  },
  methods: {
    closeDialog () {
      this.$emit('closeDialog')
    },
    showTableDataLoading () {
      this.tableData.loading = true
    },
    hideTableDataLoading () {
      this.tableData.loading = false
    },
    // 加载数据
    loadData () {
      this.showTableDataLoading()
      new Promise((resolve, reject) => {
        listPermissionByMenuId(this.menuId).then(res => {
          return resolve(res.data)
        })
      }).then(data => {
        if (data.status === 200 && data.data) {
          this.tableData.permissionList = data.data
        }
      }).finally(() => {
        this.hideTableDataLoading()
      })
    },
    // 权限类型
    formatterPermissionType (item) {
      return (item.permissionType === 0 ? '链接' : '按钮')
    },
    // 删除权限
    deleteMenu (permissionId) {
      new Promise((resolve, reject) => {
        deletePermission(permissionId, this.menuId).then(res => {
          return resolve(res.data)
        })
      }).then(data => {
      }).finally(() => {
        this.loadData()
      })
    },
    // 清空表单数据
    clearFormData () {
      this.$nextTick(() => {
        this.$refs['form'].resetFields()
      })
    },
    onSubmit (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          const reqData = Object.assign({}, this[form], { sysMenuId: this.menuId })
          new Promise((resolve, reject) => {
            addPermission(reqData).then(res => {
              resolve(res.data)
            })
          }).then(data => {
            if (data.status === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.clearFormData()
              this.loadData()
            } else {
              this.$message({
                message: '操作失败',
                type: 'danger',
                duration: 3 * 1000
              })
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
