<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入用户名" v-model="userInfo.username">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="handleAdd">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        :data="tableData"
        border
        stripe>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="nickname" label="昵称"></el-table-column>
        <el-table-column prop="deptName" label="部门"></el-table-column>
<!--        <el-table-column prop="email" label="邮箱"></el-table-column>-->
        <el-table-column prop="roleName" label="角色"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="1"
              inactive-value="0"
              @change="ChangeState(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!--修改-->
            <el-button
              size="mini"
              type="primary"
              @click="handleEdit(scope.$index, scope.row)" icon="el-icon-edit"></el-button>
            <!--删除-->
            <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)" icon="el-icon-delete"></el-button>
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
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="userInfo.pageNo"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="1"
        layout="total, sizes, prev, pager, next, jumper"
        :total="userInfo.total">
      </el-pagination>
    </el-card>
    <!--用户添加-->
    <user-add
      :addDialogVisible="userAdd.visible"
      @close="handleUserAddClose"
      @success="handleUserAddSuccess">
    </user-add>
    <user-edit
      ref="userEdit"
      :editDialogVisible="userEdit.visible"
      @close="handleUserEditClose"
      @success="handleUserEditSuccess">
    </user-edit>
  </div>
</template>

<script>
import UserAdd from './UserAdd'
import UserEdit from './UserEdit'
export default {
  components: { UserEdit, UserAdd },
  data() {
    return {
      // 查询参数
      userInfo: {
        username: '',
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      multipleSelection: [],
      // 新增模态框是否显示
      userAdd: {
        visible: false
      },
      // 修改模态框是否显示
      userEdit: {
        visible: false
      }
    }
  },
  mounted () {
    this.getUserList()
  },

  methods: {
    // 获取用户列表
    getUserList() {
      this.$get('/system/user', this.userInfo).then(res => {
        if (res.data.code !== 200) return this.$message.error('获取用户列表失败！')
        this.userInfo.total = res.data.data.total
        this.tableData = res.data.data.list
      })
    },
    // 多选
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val
    },
    // 当前页显示的数据量
    handleSizeChange(val) {
      this.userInfo.pageSize = val
      this.getUserList()
    },
    // 页数改变发起请求
    handleCurrentChange(val) {
      this.userInfo.pageNo = val
      this.getUserList()
    },
    // 新增用户
    handleAdd () {
      this.userAdd.visible = true
    },
    handleUserAddClose () {
      debugger
      this.userAdd.visiable = false
    },
    handleUserAddSuccess () {
      this.userAdd.visible = false
      this.$msg.success('新增用户成功，初始密码为123456')
      this.getUserList()
    },
    // 修改用户信息
    handleEdit(index, row) {
      console.log(index, row)
      this.userEdit.visible = true
      this.$refs.userEdit.setFormValues(row)
    },
    handleUserEditClose() {
      this.userEdit.visible = false
    },
    handleUserEditSuccess() {
      this.userEdit.visiable = false
      this.$msg.success('修改用户成功')
      this.getUserList()
    },
    handleDelete(index, row) {
      let that = this
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
      that.$delete('/system/user?userIds=' + row.id).then(res => {
      if (res.status !== 200) return this.$msg.error('删除用户失败!')
      that.$msg.success('删除用户成功！')
      that.getUserList()
      })
      }).catch(() => {
        that.$message({
        type: 'info',
        message: '已取消删除'
      })
    })
    },
    // 修改用户禁用状态
    ChangeState (val) {
      this.$put('/system/user', {
        id: val.id,
        status: val.status,
        sex: val.sex,
        roleId: val.roleId
      }).then(res => {
        if (res.status !== 200) {
          // 修改失败保持原状态
          val.status = !val.status
          return this.$msg.error('更新用户状态失败！')
        }
        this.$msg.success('更新用户状态成功!')
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
