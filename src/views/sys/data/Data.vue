<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>数据权限管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入权限分组名称" v-model="dataAccessInfo.accessName">
            <el-button slot="append" icon="el-icon-search" @click="getList"></el-button>
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
        <el-table-column prop="accessName" label="数据权限分组名称"></el-table-column>
        <el-table-column prop="accessSubject" label="数据权限控制主体"></el-table-column>
        <el-table-column prop="accessResource" label="数据权限资源"></el-table-column>
        <el-table-column prop="accessResourceField" label="数据权限关联字段"></el-table-column>
        <el-table-column prop="dataPermissionRule" label="数据权限自定义规则"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!--修改-->
            <el-button
              size="mini"
              type="primary"
              @click="handleEdit(scope.$index, scope.row)" icon="el-icon-edit"></el-button>
            <!--分配角色-->
<!--            <el-tooltip effect="dark" content="分配角色" placement="top-end" :enterable="false">-->
<!--              <el-button-->
<!--                size="mini"-->
<!--                type="warning"-->
<!--                @click="handleEdit(scope.$index, scope.row)" icon="el-icon-setting"></el-button>-->
<!--            </el-tooltip>-->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="dataAccessInfo.pageNo"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="1"
        layout="total, sizes, prev, pager, next, jumper"
        :total="dataAccessInfo.total">
      </el-pagination>
    </el-card>
    <data-edit
      ref="dataAccessEdit"
      :editDialogVisible="editVisible"
      :dialogTitle="editDialogTitle"
      @close="handleEditClose"
      @success="handleEditSuccess">
    </data-edit>
  </div>
</template>

<script>
import DataEdit from './DataEdit'
export default {
  components: { DataEdit },
  data() {
    return {
      // 查询参数
      dataAccessInfo: {
        accessName: '',
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      multipleSelection: [],
      roleData: [],
      ids: '',
      editVisible: false,
      editDialogTitle: ''
    }
  },
  mounted () {
    this.getList()
  },

  methods: {
    // 获取列表
    getList() {
      this.$get('/system/data/access', this.dataAccessInfo).then(res => {
        if (res.data.code !== 200) return this.$msg.error('获取数据权限信息失败！')
        this.dataAccessInfo.total = res.data.data.total
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
      this.dictInfo.pageSize = val
      this.getDictList()
    },
    // 页数改变发起请求
    handleCurrentChange(val) {
      this.dictInfo.pageNo = val
      this.getDictList()
    },
    // 新增
    handleAdd () {
      this.editVisible = true
      this.editDialogTitle = '新增'
    },
    // 修改
    handleEdit(index, row) {
      this.editVisible = true
      this.$refs.dataAccessEdit.setFormValues(row)
      this.editDialogTitle = '修改'
    },
    handleEditClose() {
      this.editVisible = false
    },
    handleEditSuccess(val) {
      this.editVisible = false
      this.$msg.success(val)
      this.getList()
    },
    handleDelete() {
      if (this.ids === '' || this.ids === undefined) {
        return this.$msg('请选择要删除的数据')
      }
      let that = this
      this.$confirm('此操作将永久删除该字典数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        that.$delete('/system/dict?dictIds=' + this.ids).then(res => {
          if (res.status !== 200) return this.$msg.error('删除字典数据失败!')
          that.$msg.success('删除字典数据成功！')
          this.ids = ''
          that.getDictList()
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
