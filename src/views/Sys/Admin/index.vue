<template>
  <div class="fillcontain" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="contain">
        <search-item @showDialogAddUser="showDialogAddUser" @searchUserList="reloadUserList"></search-item>
      <div class="table_container">
        <el-card class="box-card">
          <el-table
            v-loading="loading"
            :data="tableData"
            border
            stripe
            highlight-current-row
            header-cell-class-name="table-header-class"
            style="width:100%">
            <el-table-column
              label="序号"
              width="60"
              align='center'>
              <template slot-scope="scope">
                <span>{{scope.$index+(pagedata.pageIndex - 1) * pagedata.pageSize + 1}} </span>
              </template>
            </el-table-column>
            <el-table-column
              property="username"
              label="用户名"
              width="180"
              align='center'>
            </el-table-column>
            <el-table-column
              label="状态"
              align='center'>
              <template slot-scope="scope">
                <el-tag size="small" v-if="!scope.row.disabled">正常</el-tag>
                <el-tag size="small" type="danger" v-if="scope.row.disabled">已禁用</el-tag>
                <el-link style="margin-left: 10px;" disabled v-if="scope.row.disabled">禁用时间:{{scope.row.disabledTime}}</el-link>
              </template>
            </el-table-column>
            <el-table-column
              property="createTime"
              label="创建时间"
              width="260"
              align='center'>
            </el-table-column>
            <el-table-column
              property="updateTime"
              label="更新时间"
              width="260"
              align='center'>
            </el-table-column>
            <el-table-column
              label="操作"
              width="280"
              align='center'>
              <template slot-scope="scope">
                <el-button v-check-opt="'admin:button:edit'" size="mini" @click="showDialogEditUser(scope.row.id)">编辑</el-button>
                <el-popconfirm
                  v-if="scope.row.disabled == true"
                  confirm-button-text='确定'
                  cancel-button-text='取消'
                  icon="el-icon-info"
                  icon-color="red"
                  title="确定启用？"
                  @confirm="enableAdmin(scope.row.id)">
                  <el-button v-check-opt="'admin:button:enable'" slot="reference" type="primary" size="mini" style="margin-left: 10px;">启用</el-button>
                </el-popconfirm>
                <el-popconfirm
                  v-if="scope.row.disabled == false"
                  confirm-button-text='确定'
                  cancel-button-text='取消'
                  icon="el-icon-info"
                  icon-color="red"
                  title="确定禁用？"
                  @confirm="disableAdmin(scope.row.id)">
                  <el-button v-check-opt="'admin:button:disable'" slot="reference" type="danger" size="mini" style="margin-left: 10px;">禁用</el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
          <el-row>
            <el-col :span="24">
              <template-pagination :pageIndex="pagedata.pageIndex" :pageTotal="pagedata.total" @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange"></template-pagination>
            </el-col>
          </el-row>
        </el-card>
      </div>
    </div>
    <!--弹框-添加用户-->
    <dialog-add-user v-if="dialogAddUser.show" :isShow="dialogAddUser.show" @closeDialog="hideDialogAddUser" @reloadAll="reloadUserList"></dialog-add-user>
    <!--弹框-编辑用户-->
    <dialog-edit-user v-if="dialogEditUser.show" :userId="dialogEditUser.userId" :isShow="dialogEditUser.show" @closeDialog="hideDialogEditUser" @reloadAll="reloadUserList"></dialog-edit-user>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import templatePagination from '@/components/pagination/index.vue'
import searchItem from './components/searchItem'
import dialogAddUser from './components/dialogAddUser'
import dialogEditUser from './components/dialogEditUser'

export default {
  data () {
    return {
      fullscreenLoading: false, // 全屏遮罩
      tableData: [],
      loading: true,
      // 需要给分页组件传的信息
      pagedata: {
        total: 0, // 总数
        pageIndex: 1, // 当前位于哪页
        pageSize: 20 // 1页显示多少条
      },
      dialogAddUser: {
        show: false
      },
      dialogEditUser: {
        show: false,
        userId: ''
      }
    }
  },
  components: {
    templatePagination,
    searchItem,
    dialogAddUser,
    dialogEditUser
  },
  created () {
  },
  mounted () {
    this.getUserList()
  },
  computed: {
    ...mapGetters({
      paramSearch: 'indexSearch' // 把 /src/store/admin.js里的getters的indexSearch转换为paramSearch,直接可在此页面调用
    })
  },
  methods: {
    // 显示添加用户弹框
    showDialogAddUser () {
      this.dialogAddUser.show = true
    },
    // 隐藏添加用户弹框
    hideDialogAddUser () {
      this.dialogAddUser.show = false
    },
    // 获取用户数据
    getUserList () {
      if (this.paramSearch) {
        // console.log('paramSearch = ' + JSON.stringify(this.paramSearch))
      }
      let paraPage = {
        size: this.pagedata.pageSize,
        current: this.pagedata.pageIndex
      }
      const params = Object.assign({}, paraPage, this.paramSearch)
      this.$store.dispatch('pageAdminList', params).then(result => {
        const data = result.data
        const records = data.records
        const total = data.total
        if (records) {
          this.tableData = records
        }
        this.pagedata.total = total
      }).finally(() => {
        this.loading = false
      })
    },
    // 重新获取用户数据
    reloadUserList () {
      this.pagedata.pageIndex = 1
      this.getUserList()
    },
    // 每页多少条切换
    handleSizeChange (pageSize) {
      this.pagedata.pageSize = pageSize
      this.getUserList()
    },
    // 上下分页
    handleCurrentChange (page) {
      this.pagedata.pageIndex = page
      this.getUserList()
    },
    // 显示编辑用户弹框
    showDialogEditUser (id) {
      console.log('编辑用户id: ' + id)
      this.dialogEditUser.userId = id
      this.dialogEditUser.show = true
    },
    // 隐藏编辑用户弹框
    hideDialogEditUser () {
      this.dialogEditUser.show = false
    },
    // 启用
    enableAdmin (id) {
      this.openOrCloseFullLoading(true)
      this.$store.dispatch('enableUser', id).then(data => {
        if (data.status === 200) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 3 * 1000
          })
          this.pagedata.pageIndex = 1
          this.getUserList()
        } else {
          this.$message({
            message: '操作失败',
            type: 'success',
            duration: 3 * 1000
          })
        }
      }).finally(() => {
        this.openOrCloseFullLoading(false)
      })
    },
    // 禁用
    disableAdmin (id) {
      this.openOrCloseFullLoading(true)
      this.$store.dispatch('disableUser', id).then(data => {
        if (data.status === 200) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 3 * 1000
          })
          this.pagedata.pageIndex = 1
          this.getUserList()
        } else {
          this.$message({
            message: '操作失败',
            type: 'danger',
            duration: 3 * 1000
          })
        }
      }).finally(() => {
        this.openOrCloseFullLoading(false)
      })
    },
    // 开启、关闭全屏遮罩
    openOrCloseFullLoading (openOrClose) {
      this.fullscreenLoading = openOrClose
    }
  }
}
</script>

<style lang="less" scoped>
  .fillcontain{
    padding-bottom: 0;
  }
  .contain{
    background: #fff;
    padding: 10px;
    margin-bottom: 20px;
  }
  .pagination{
    padding: 10px 20px;
    text-align: right;
  }
</style>
