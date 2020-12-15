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

        <el-form-item prop='username'  label="用户名:">
          <el-input v-model="form.username" placeholder="请填写用户名"></el-input>
        </el-form-item>

        <el-form-item prop='dencryptPassword' label="登录密码:">
          <el-input show-password v-model="form.dencryptPassword" placeholder="请填写登录密码"></el-input>
        </el-form-item>

        <el-form-item prop='confirmPassword' label="确认密码:">
          <el-input show-password v-model="form.confirmPassword" placeholder="请填写确认密码"></el-input>
        </el-form-item>

        <el-form-item prop="roleId" label="选择角色">
          <el-radio-group v-model="form.roleId">
            <el-radio v-for="role in roles" :label="role.id" :key="role.id">{{role.roleName}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item  class="text_right">
          <el-button @click="isVisible = false">取 消</el-button>
          <el-button v-check-opt="'admin:button:add:save'" type="primary" @click='onSubmit("form")'>提  交</el-button>
        </el-form-item>

      </el-form>
    </div>
  </el-dialog>
</template>

<script>
import { allRoles } from '@/api/role.js'
import { checkExistsUsername, addUser } from '@/api/admin.js'

export default {
  name: 'dialogAddUser',
  data () {
    const validateCheckUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请填写用户名'))
        return false
      }
      new Promise((resolve, reject) => {
        checkExistsUsername(value).then(res => {
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
    const validateConfirmPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入确认密码'))
        return false
      }
      if (value === this.form.dencryptPassword) {
        callback()
      } else {
        callback(new Error('登录密码与确认密码不一致'))
        return false
      }
    }
    return {
      isVisible: this.isShow,
      title: '添加用户',
      roles: [], // 所有角色
      form: {
        username: '',
        dencryptPassword: '',
        confirmPassword: '',
        sex: 0,
        roleId: '' // 被选中的角色
      },
      form_rules: {
        username: [{
          validator: validateCheckUsername,
          trigger: 'blur'
        }],
        dencryptPassword: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ],
        confirmPassword: [{
          validator: validateConfirmPassword,
          trigger: 'blur'
        }],
        roleId: [{ required: true, message: '请选择角色', trigger: 'blur' }]
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
    this.loadAllRole()
  },
  methods: {
    closeDialog () {
      this.$emit('closeDialog')
    },
    callReloadData () {
      this.$emit('reloadAll')
    },
    // 加载所有角色
    loadAllRole () {
      new Promise((resolve, reject) => {
        allRoles().then(res => {
          resolve(res.data)
        })
      }).then(data => {
        this.roles = data.data
      })
    },
    // 提交数据
    onSubmit (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          const reqData = Object.assign({}, this[form])
          new Promise((resolve, reject) => {
            addUser(reqData).then(res => {
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
