<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入角色名" v-model="roleInfo.roleName">
            <el-button slot="append" icon="el-icon-search" @click="getRoleList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="handleAdd">新增</el-button>
          <el-button
            type="danger"
            @click="handleDelete()" >删除</el-button>
        </el-col>
      </el-row>
      <el-table
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        :data="tableData"
        border
        stripe>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="roleName" label="角色名"></el-table-column>
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
            <!-- <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)" icon="el-icon-delete"></el-button> -->
            <!--查看权限-->
            <el-tooltip effect="dark" content="查看权限" placement="top-end" :enterable="false">
              <el-button
                size="mini"
                type="warning"
                @click="handleViewPerm(scope.$index, scope.row)" icon="el-icon-setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="roleInfo.pageNo"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="1"
        layout="total, sizes, prev, pager, next, jumper"
        :total="roleInfo.total">
      </el-pagination>
    </el-card>
    <!--查看权限-->
    <Perms
      ref="rolePerm"
      :permDialogVisible="permVisible"
      @close="handlePermClose">
    </Perms>
    <!--角色添加-->
    <role-add
      :addDialogVisible="roleAddVisible"
      @close="handleRoleAddClose"
      @success="handleRoleAddSuccess">
    </role-add>
    <role-edit
      ref="roleEdit"
      :editDialogVisible="roleEditVisible"
      @close="handleRoleEditClose"
      @success="handleRoleEditSuccess">
    </role-edit>
  </div>
</template>

<script>
import RoleAdd from './RoleAdd'
import RoleEdit from './RoleEdit'
import Perms from './Perms'
export default {
  components: { RoleAdd, RoleEdit, Perms },
  data() {
    return {
      // 查询参数
      roleInfo: {
        roleName: '',
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      multipleSelection: [],
      ids: '',
      // 新增模态框是否显示
      roleAddVisible: false,
      // 修改模态框是否显示
      roleEditVisible: false,
      // 权限查看
      permVisible: false

    }
  },
  mounted () {
    this.getRoleList()
  },

  methods: {
    // 获取用户列表
    getRoleList() {
      this.$get('/system/role', this.roleInfo).then(res => {
        if (res.data.code !== 200) return this.$$msg.error('获取角色列表失败！')
        this.roleInfo.total = res.data.data.total
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
      this.userInfo.pageSize = val
      this.getRoleList()
    },
    // 页数改变发起请求
    handleCurrentChange(val) {
      this.userInfo.pageNo = val
      this.getRoleList()
    },
    // 新增角色
    handleAdd () {
      this.roleAddVisible = true
    },
    handleRoleAddClose () {
      this.roleAddVisible = false
    },
    handleRoleAddSuccess (val) {
      this.roleAddVisible = false
      this.$msg.success('新增角色成功!')
      this.getRoleList()
    },
    // 修改角色信息
    handleEdit(index, row) {
      // console.log(index, row)
      this.roleEditVisible = true
      this.$refs.roleEdit.setFormValues(row)
    },
    handleRoleEditClose() {
      this.roleEditVisible = false
    },
    handleRoleEditSuccess() {
      this.roleEditVisible = false
      this.$msg.success('修改角色成功')
      this.getRoleList()
    },
    // 查看权限
    handleViewPerm(index, row) {
      debugger
      // console.log(index, row)
      this.permVisible = true
      this.$refs.rolePerm.setPermFormValues(row)
    },
    handlePermClose() {
      this.permVisible = false
    },
    handleDelete() {
      if (this.ids === '' || this.ids === undefined) {
        return this.$msg('请选择要删除的数据')
      }
      let that = this
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        that.$delete('/system/role?roleIds=' + this.ids).then(res => {
          if (res.status !== 200) return this.$msg.error('删除用户失败!')
          that.$msg.success('删除角色成功！')
          this.ids = ''
          that.getRoleList()
        })
      }).catch(() => {
        that.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 修改角色禁用状态
    ChangeState (val) {
      this.$put('/system/role', {
        id: val.id,
        status: val.status
      }).then(res => {
        if (res.status !== 200) {
          // 修改失败保持原状态
          val.status = !val.status
          return this.$msg.error('更新角色状态失败！')
        }
        this.$msg.success('更新角色状态成功!')
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
