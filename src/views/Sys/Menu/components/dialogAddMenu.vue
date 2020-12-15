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

        <el-form-item label="父级菜单:">
          <el-select disabled value="parentMenu.id" v-model="parentMenu.menuName" placeholder="请选择父级菜单">
          </el-select>
        </el-form-item>

        <el-form-item prop='menuName'  label="菜单名称:">
          <el-input v-model="form.menuName" placeholder="请填写菜单名称"></el-input>
        </el-form-item>

<!--        <el-form-item label="图标:">-->
<!--          <el-input v-model="form.menuIcon"></el-input>-->
<!--        </el-form-item>-->

        <el-form-item prop='routePath' label="路由路径:">
          <el-input v-model="form.routePath" placeholder="请填写路由路径"></el-input>
        </el-form-item>

        <el-form-item prop='routeName' label="路由名称:">
          <el-input v-model="form.routeName" placeholder="请填写路由名称"></el-input>
        </el-form-item>

        <el-form-item prop='routeComponent' label="路由组件:">
          <el-input v-model="form.routeComponent" placeholder="请填写路由组件"></el-input>
        </el-form-item>

        <el-form-item prop='orders' label="排序:">
          <el-input v-model="form.orders" placeholder="请填写排序"></el-input>
        </el-form-item>

<!--        <el-form-item label="备注:">-->
<!--          <el-input type="textarea" v-model="form.remarks"></el-input>-->
<!--        </el-form-item>-->

        <el-form-item  class="text_right">
          <el-button @click="isVisible = false">取 消</el-button>
          <el-button type="primary" @click='onSubmit("form")'>提  交</el-button>
        </el-form-item>

      </el-form>
    </div>
  </el-dialog>
</template>

<script>
import { addMenu } from '@/api/menu.js'

export default {
  name: 'dialogAddMenu',
  data () {
    return {
      isVisible: this.isShow,
      title: '添加菜单',
      form: {
        menuName: '',
        menuIcon: '',
        routePath: '',
        routeName: '',
        routeComponent: '',
        orders: 0
      },
      form_rules: {
        menuName: [
          { required: true, message: '菜单名称不能为空！', trigger: 'blur' }
        ],
        routePath: [
          { required: true, message: '路由路径不能为空！', trigger: 'blur' }
        ],
        routeName: [
          { required: true, message: '路由名称不能为空！', trigger: 'blur' }
        ],
        routeComponent: [
          { required: true, message: '路由组件不能为空！', trigger: 'blur' }
        ],
        orders: [
          { required: true, message: '排序不能为空！', trigger: 'blur' }
        ]
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
    parentMenu: Object // {id: '', menuName: ''}
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
      this.$emit('reloadAllMenu')
    },
    onSubmit (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          const reqData = Object.assign({}, this[form], { pid: this.parentMenu.id })
          new Promise((resolve, reject) => {
            addMenu(reqData).then(res => {
              resolve(res.data)
            })
          }).then(data => {
            console.log('添加菜菜单返回的数据: ' + JSON.stringify(data))
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
