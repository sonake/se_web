<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入菜单名" v-model="menuInfo.menuName">
            <el-button slot="append" icon="el-icon-search" @click="getMenuList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="handleAdd">新增</el-button>
          <el-button
            type="danger"
            @click="handleDelete()">删除
          </el-button>
        </el-col>
      </el-row>
      <div class="el-menu-table">
      <el-table
        :data="tableData"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        border
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          prop="label"
          label="菜单"
          sortable
          width="180">
        </el-table-column>
        <el-table-column
          prop="type"
          label="类型"
          sortable
          width="180">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type==='0'"
              type="success"
              disable-transitions>菜单</el-tag>
            <el-tag v-else
                    type="danger"
                    disable-transitions>按钮</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="component"
          label="路由">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!--修改-->
            <el-button
              size="mini"
              type="primary"
              @click="handleEdit(scope.$index, scope.row)" icon="el-icon-edit"></el-button>
            <!--删除-->
            <!-- <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)" icon="el-icon-delete"></el-button> -->
            <!--分配角色-->
            <el-tooltip effect="dark" content="分配角色" placement="top-end" :enterable="false">
              <el-button
                size="mini"
                type="warning"
                @click="handleEdit(scope.$index, scope.row)" icon="el-icon-setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      </div>
    </el-card>
    <!--菜单添加-->
    <menu-add
      :addDialogVisible="menuAddVisible"
      @close="handleMenuAddClose"
      @success="handleMenuAddSuccess">
    </menu-add>
    <menu-edit
      ref="menuEdit"
      :editDialogVisible="menuEditVisible"
      @close="handleMenuEditClose"
      @success="handleMenuEditSuccess">
    </menu-edit>
  </div>
</template>

<script>
import MenuAdd from './MenuAdd'
import MenuEdit from './MenuEdit'

export default {
  components: { MenuAdd, MenuEdit },
  data() {
    return {
      // 查询参数
      menuInfo: {
        menuName: '',
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      multipleSelection: [],
      ids: '',
      // 新增模态框是否显示
      menuAddVisible: false,
      // 修改模态框是否显示
      menuEditVisible: false
    }
  },
  mounted() {
    this.getMenuList()
  },
  methods: {
    // 获取菜单列表
    getMenuList() {
      this.$get('/system/menu', this.menuInfo).then(res => {
        if (res.data.code !== 200) return this.$msg.error('获取菜单列表失败！')
        this.menuInfo.total = res.data.data.total
        this.tableData = res.data.data.list
      })
    },
    // 多选
    handleSelectionChange(val) {
      this.ids = ''
      // console.log(val)
      this.multipleSelection = val
      for (let i = 0; i < this.multipleSelection.length; i++) {
        this.ids += this.multipleSelection[i].id + ','
      }
      // console.log(this.ids)
    },
    // 当前页显示的数据量
    handleSizeChange(val) {
      this.menuInfo.pageSize = val
      this.getMenuList()
    },
    // 页数改变发起请求
    handleCurrentChange(val) {
      this.menuInfo.pageNo = val
      this.getMenuList()
    },
    // 新增菜单
    handleAdd() {
      this.menuAddVisible = true
    },
    handleMenuAddClose() {
      this.menuAddVisible = false
    },
    handleMenuAddSuccess() {
      this.menuAddVisible = false
      this.$msg.success('新增菜单成功！')
      this.getMenuList()
    },
    // 修改用户信息
    handleEdit(index, row) {
      this.menuEditVisible = true
      this.$refs.menuEdit.setFormValues(row)
    },
    handleMenuEditClose() {
      this.menuEditVisible = false
    },
    handleMenuEditSuccess() {
      this.menuEditVisible = false
      this.$msg.success('修改菜单成功')
      this.getMenuList()
    },
    handleDelete() {
      if (this.ids === '' || this.ids === undefined) {
        return this.$msg('请选择要删除的数据')
      }
      let that = this
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        that.$delete('/system/menu?menuIds=' + this.ids).then(res => {
          if (res.status !== 200) return this.$msg.error('删除菜单失败!')
          that.$msg.success('删除菜单成功！')
          this.ids = ''
          that.getMenuList()
        })
      }).catch(() => {
        that.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 修改菜单禁用状态
    ChangeState(val) {
      this.$put('/system/menu', {
        id: val.id,
        status: val.status,
        sex: val.sex,
        roleId: val.roleId
      }).then(res => {
        if (res.status !== 200) {
          // 修改失败保持原状态
          val.status = !val.status
          return this.$msg.error('更新菜单状态失败！')
        }
        this.$msg.success('更新菜单状态成功!')
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .el-menu-table{
    height: 450px;
    overflow: auto;
  }
</style>
