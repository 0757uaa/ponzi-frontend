<template>
  <el-dialog
    :visible.sync="isVisible"
    :title="title"
    :close-on-click-modal='false'
    :close-on-press-escape='false'
    :modal-append-to-body="false"
    @close="closeDialog">
    <div class="form">
      <el-form
        ref="form"
        :model="form"
        :rules="form_rules"
        :label-width="dialog.formLabelWidth"
        style="margin:10px;width:auto;">

        <el-form-item prop='roleName'  label="角色名称:">
          <el-input v-model="form.roleName" placeholder="请填写角色名称"></el-input>
        </el-form-item>

        <el-form-item prop='roleCode' label="角色编码:">
          <el-input v-model="form.roleCode" placeholder="请填写角色编码"></el-input>
        </el-form-item>

        <el-form-item  class="text_right">
          <el-button @click="isVisible = false">取 消</el-button>
          <el-button v-check-opt="'role:button:add:save'" type="primary" @click='onSubmit("form")'>提  交</el-button>
        </el-form-item>

      </el-form>
    </div>
  </el-dialog>
</template>

<script>
import { checkExistsRoleName, checkExistsRoleCode, addRole } from '@/api/role.js'

export default {
  name: 'dialogAddRole',
  data () {
    const validateCheckRoleCode = (rule, value, callback) => {
      if (!value) {
        callback(new Error('角色编号不能为空!'))
        return false
      }
      new Promise((resolve, reject) => {
        checkExistsRoleCode(value).then(res => {
          resolve(res.data)
        })
      }).then(data => {
        if (data.status === 200) {
          callback()
        } else if (data.status === 400) {
          callback(new Error(data.tips))
        }
      })
    }
    const validateCheckRoleName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('角色名称不能为空!'))
        return false
      }
      new Promise((resolve, reject) => {
        checkExistsRoleName(value).then(res => {
          resolve(res.data)
        })
      }).then(data => {
        if (data.status === 200) {
          callback()
        } else if (data.status === 400) {
          callback(new Error(data.tips))
        }
      })
    }
    return {
      isVisible: this.isShow,
      title: '添加角色',
      form: {
        roleName: '',
        roleCode: ''
      },
      form_rules: {
        roleName: [{
          validator: validateCheckRoleName,
          trigger: 'blur'
        }],
        roleCode: [{
          validator: validateCheckRoleCode,
          trigger: 'blur'
        }]
      },
      // 详情弹框信息
      dialog: {
        width: '400px',
        formLabelWidth: '120px'
      }
    }
  },
  props: {
    isShow: Boolean
  },
  mounted () {
    // 先清空表单数据
    this.$nextTick(() => {
      this.$refs['form'].resetFields()
    })
  },
  methods: {
    closeDialog () {
      this.$emit('closeDialog')
    },
    callReloadData () {
      this.$emit('reloadAll')
    },
    onSubmit (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          const reqData = Object.assign({}, this[form])
          new Promise((resolve, reject) => {
            addRole(reqData).then(res => {
              resolve(res.data)
            })
          }).then(data => {
            if (data.status === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.callReloadData()
              this.closeDialog()
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
