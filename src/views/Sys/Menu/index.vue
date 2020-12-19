<template>
  <div class="fillcontain" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="contain">
      <div class="search_container searchArea">
        <el-form
          :inline="true"
          class="demo-form-inline search-form">
          <el-form-item class="btnRight">
            <el-button v-check-opt="'menu:button:add'" type="primary" size ="mini" icon="view" @click='onAddMenu("#", "#")'>添加菜单</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table_container">
        <el-table
          :data="tableData"
          style="width: 100%;margin-bottom: 20px;"
          row-key="id"
          border
          default-expand-all
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="menuName"
            label="菜单名称"
            width="180">
          </el-table-column>
          <el-table-column
            label="图标"
            align="center"
            width="120">
            <template v-if="scope.row.menuIcon" slot-scope="scope">
              <svg-icon :name="scope.row.menuIcon" :size="16"></svg-icon>
            </template>
          </el-table-column>
          <el-table-column
            prop="routePath"
            label="路由路径"
            width="180">
          </el-table-column>
          <el-table-column
            prop="routeName"
            label="路由名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="routeComponent"
            label="路由组件"
            width="180">
          </el-table-column>
          <el-table-column
            header-align="center"
            prop="orders"
            label="排序"
            width="80">
          </el-table-column>
          <el-table-column
            align="left"
            header-align="center"
            label="操作">
            <template slot-scope="scope">
              <el-button v-check-opt="'menu:button:add_sub'" v-if="scope.row.pid === '#'" type="primary" size="mini" style="margin-left: 10px;" @click="onAddMenu(scope.row.id, scope.row.menuName)">添加子菜单</el-button>
              <el-button v-check-opt="'menu:button:permission_set'" v-if="scope.row.pid != '#'" type="success" size="mini" style="margin-left: 10px;" @click="onShowMenuPermission(scope.row.id)">权限设置</el-button>
              <el-popconfirm
                confirm-button-text='确定'
                cancel-button-text='取消'
                icon="el-icon-info"
                icon-color="red"
                title="确定删除？"
                @confirm="onDeleteMenu(scope.row.id)">
                <el-button v-check-opt="'menu:button:delete'" slot="reference" type="danger" size="mini" style="margin-left: 10px;">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <dialog-add-menu v-if="dialogAddMenu.show" :isShow="dialogAddMenu.show" :parentMenu="dialogAddMenu.parentMenu" @closeDialog="hideDialogAddMenu" @reloadAllMenu="loadAllMenu"></dialog-add-menu>
      <dialog-menu-permission v-if="dialogMenuPermission.show" :isShow="dialogMenuPermission.show" :menuId="dialogMenuPermission.menuId" @closeDialog="hideDialogMenuPermission"></dialog-menu-permission>
    </div>
  </div>
</template>

<script>
import dialogAddMenu from './components/dialogAddMenu'
import dialogMenuPermission from './components/dialogMenuPermission'
import { treeAllMenu, deleteMenu } from '@/api/menu.js'

export default {
  components: { dialogMenuPermission, dialogAddMenu },
  data () {
    return {
      fullscreenLoading: false,
      tableData: [],
      dialogAddMenu: {
        show: false,
        parentMenu: {}
      },
      dialogMenuPermission: {
        show: false,
        menuId: 0
      }
    }
  },
  created () {
  },
  mounted () {
    this.loadAllMenu()
  },
  methods: {
    // 加载所有菜单
    loadAllMenu () {
      this.fullscreenLoading = true
      new Promise((resolve, reject) => {
        treeAllMenu().then(res => {
          resolve(res.data)
        })
      }).then(data => {
        this.tableData = data.data
      }).finally(() => {
        this.fullscreenLoading = false
      })
    },
    // 添加菜单
    onAddMenu (pid, menuName) {
      // console.log('添加菜单,父菜单id = ' + pid + ', 父菜单名称menuName = ' + menuName)
      this.dialogAddMenu.parentMenu.id = pid
      this.dialogAddMenu.parentMenu.menuName = menuName
      this.showDialogAddMenu()
    },
    // 删除菜单
    onDeleteMenu (id) {
      // console.log('删除的菜单id = ' + id)
      this.fullscreenLoading = true
      new Promise((resolve, reject) => {
        deleteMenu(id).then(res => {
          resolve(res.data)
        })
      }).then(data => {
        this.loadAllMenu()
      }).finally(() => {
        this.fullscreenLoading = false
      })
    },
    // 显示弹框
    showDialogAddMenu () {
      this.dialogAddMenu.show = true
    },
    // 隐藏弹框
    hideDialogAddMenu () {
      this.dialogAddMenu.show = false
    },
    //
    onShowMenuPermission (menuId) {
      this.dialogMenuPermission.menuId = menuId
      this.showDialogMenuPermission()
    },
    // 显示
    showDialogMenuPermission () {
      this.dialogMenuPermission.show = true
    },
    // 隐藏
    hideDialogMenuPermission () {
      this.dialogMenuPermission.show = false
    }
  }
}
</script>

<style lang="less" scoped>
  .search_container{
    margin-bottom: 20px;
  }
  .btnRight{
    float: left;
    margin-right: 0px !important;
  }
  .searchArea{
    background:rgba(255,255,255,1);
    border-radius:2px;
    padding: 18px 18px 0;
  }
</style>
