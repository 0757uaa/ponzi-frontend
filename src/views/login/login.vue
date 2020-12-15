<template>
  <div class="login-wrap">
    <el-form :model="formItem" :rules="rules2" ref="ruleForm" class="login-main">
      <h3 class="login-title">登录系统</h3>
      <el-form-item prop="account">
        <el-input type="text" class="el-input-mine" placeholder="username" v-model="formItem.account" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item prop="pass">
        <el-input type="password" class="el-input-mine" placeholder="password" v-model="formItem.pass"></el-input>
      </el-form-item>
      <el-select v-if="false" v-model="userRole" placeholder="请选择" class="role-class" @change="getRoleChange">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
<!--      <el-button type="primary" v-check-opt="'admin:btn:add'" style="width:100%;" :loading="loading" @click="loginIn('ruleForm')">登录</el-button>-->
      <el-button type="primary" style="width:100%;" :loading="loading" @click="loginIn('ruleForm')">登录</el-button>
    </el-form>
  </div>
</template>
<script>
import Cookie from 'js-cookie'
// import { passCheck } from '@/utils/validate'
import { login } from '@/api/login'

export default {
  data () {
    const validAccount = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('账号不能为空'))
      } else {
        callback()
      }
    }
    const validPass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('密码不能为空'))
      } else {
        callback()
      }
      // else if (passCheck(value)) {
      //   return callback(new Error('密码不能少于6位,且必须有数字字母组合'))
      // }
    }
    return {
      formItem: {
        // account: '1803999999',
        // pass: '11111000kkk'
        account: 'admin',
        pass: '123456'
      },
      rules2: {
        account: [
          {
            validator: validAccount,
            trigger: 'blur'
          }
        ],
        pass: [
          {
            validator: validPass,
            trigger: 'blur'
          }
        ]
      },
      cliboard: '',
      options: [
        {
          label: '管理员',
          value: 'admin'
        },
        {
          label: '普通用户',
          value: 'user'
        }
      ],
      userRole: 'admin', // static role
      loading: false
    }
  },
  methods: {
    loginIn (formName) {
      this.loading = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let username = this.formItem.account
          let password = this.formItem.pass
          let that = this
          login({ username: username, password: password }).then(res => {
            that.loading = false
            let data = res.data
            if (data.status === 200) {
              // 获取菜单
              const menus = data.data.menus
              if (menus) {
                Cookie.set('menus', JSON.stringify(menus))
              }
              // 获取操作权限
              const permissions = data.data.permissions
              if (permissions) {
                Cookie.set('permissions', JSON.stringify(permissions))
              }
              that.$message({
                message: '成功登录',
                type: 'success',
                duration: 3 * 1000
              })
              Cookie.set('user', username)
              Cookie.set('role', that.userRole) // 用于拉取用户可支配的路由权限
              that.$store.commit('setCurrentUserInfo', username) // manage user info
              that.$router.push({
                path: 'dashboard'
              })
            } else {
              that.$message({
                message: data.tips,
                type: 'error',
                duration: 3 * 1000
              })
            }
          }).catch((err) => {
            that.loading = false
            if (err) {
            }
            that.$message({
              message: '网络出错,请重新访问',
              type: 'error',
              duration: 3 * 1000
            })
          })
        } else {
          return false
        }
      })
    },
    getRoleChange (val) {
      this.userRole = val
    }
  }
}
</script>
<style lang="scss">
  @import './login.scss';
  .role-class{
    width: 100%;
    margin-bottom: 30px;
    .el-input__inner{
      background-color: #2d3a4b;
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, .6);
    }
  }
</style>
