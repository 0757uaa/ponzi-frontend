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
          <el-input v-model="form.username" placeholder="请填写用户名" disabled></el-input>
        </el-form-item>

        <el-form-item prop='dencryptPassword' label="登录密码:">
          <el-input show-password v-model="form.dencryptPassword" placeholder="请填写登录密码,不填写不修改"></el-input>
        </el-form-item>

        <el-form-item prop='confirmPassword' label="确认密码:">
          <el-input show-password v-model="form.confirmPassword" placeholder="请填写确认密码,不填写不修改"></el-input>
        </el-form-item>

        <el-form-item prop="roleId" label="选择角色">
          <el-radio-group v-model="form.roleId">
            <el-radio v-for="role in roles" :label="role.id" :key="role.id">{{role.roleName}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item  class="text_right">
          <el-button @click="isVisible = false">取 消</el-button>
          <el-button v-check-opt="'admin:button:edit:save'" type="primary" @click='onSubmit("form")'>提  交</el-button>
        </el-form-item>

      </el-form>
    </div>
  </el-dialog>
</template>

<script>
import { allRoles } from '@/api/role.js'
import { findUserAndRole, editUser } from '@/api/admin.js'

export default {
  name: 'dialogEditUser',
  data () {
    const validateCheckUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请填写用户名'))
        return false
      }
    }
    const validateConfirmPassword = (rule, value, callback) => {
      if (value === this.form.dencryptPassword) {
        callback()
      } else {
        callback(new Error('登录密码与确认密码不一致'))
        return false
      }
    }
    return {
      isVisible: this.isShow,
      title: '编辑用户',
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
        // dencryptPassword: [
        //   { required: true, message: '请输入登录密码', trigger: 'blur' },
        //   { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        // ],
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
    isShow: Boolean,
    userId: String
  },
  mounted () {
    // 先清空表单数据
    this.$nextTick(() => {
      this.$refs['form'].resetFields()
    })
    this.loadAllRole()
    this.loadUserInfo()
  },
  watch: {
    userId: {
      handler (newVal) {
        this.loadUserInfo()
      },
      deep: true
    }
  },
  methods: {
    closeDialog () {
      this.$emit('closeDialog')
    },
    callReloadData () {
      this.$emit('reloadAll')
    },
    // 加载用户数据
    loadUserInfo () {
      new Promise((resolve, reject) => {
        findUserAndRole(this.userId).then(res => {
          resolve(res.data)
        })
      }).then(data => {
        const user = data.data
        this.form.username = user.username
        this.form.sex = user.sex
        if (user.roleDtoList && user.roleDtoList.length > 0) {
          this.form.roleId = user.roleDtoList[0].id
        }
      })
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
      // this.$refs[form].validate((valid) => {
      //   console.log('校验' + valid)
      //   if (valid) {
      const reqData = Object.assign({ id: this.userId }, this[form])
      new Promise((resolve, reject) => {
        editUser(reqData).then(res => {
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
      //   }
      // })
    }
  }
}
</script>

<style scoped>

</style>
