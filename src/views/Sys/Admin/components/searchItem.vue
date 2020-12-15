<template>
  <div class="search_container searchArea">
    <el-card class="box-card">
      <el-form
        :inline="true"
        :model='search_data'
        :rules="rules"
        ref="search_data"
        class="demo-form-inline search-form">
        <el-form-item label="">
          <el-input v-model="search_data.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-check-opt="'admin:button:query'"  type="primary" size ="mini" icon="search" @click='onSearch("search_data")'>查询</el-button>
        </el-form-item>

        <el-form-item class="btnRight">
          <el-button v-check-opt="'admin:button:add'"  type="primary" size ="mini" icon="view" @click='onAdd()'>添加用户</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'searchItem',
  data () {
    return {
      search_data: {
        username: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
  },
  methods: {
    onSearch (searchForm) {
      this.$refs[searchForm].validate((valid) => {
        if (valid) {
          this.$store.commit('SET_INDEX_SEARCH', this.search_data)
          this.$emit('searchUserList')
        }
      })
    },
    onAdd () {
      this.$emit('showDialogAddUser')
    }
  }
}
</script>

<style lang="less" scoped>
  .search_container{
    margin-bottom: 10px;
  }
  .btnRight{
    float: right;
    margin-right: 0px !important;
  }
  .searchArea{
    background:rgba(255,255,255,1);
    border-radius:2px;
    /*padding: 18px 18px 0;*/
  }
</style>
