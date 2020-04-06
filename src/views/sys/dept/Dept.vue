<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>部门管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input placeholder="请输入部门名" v-model="deptInfo.deptName" style="width: 60%">
            <el-button slot="append" icon="el-icon-search" @click="getDeptList"></el-button>
          </el-input>
          <el-button @click="toAdd" type="primary" style="margin-left: 20px">新增</el-button>
          <el-button @click="toDelete" type="danger" style="margin-left: 20px">删除</el-button>
          <el-divider></el-divider>
          <div class="el-menu-table">
            <el-tree
              ref="deptTree"
              :data="deptData"
              show-checkbox
              node-key="id"
              @check-change="handleCheckChange"
              @node-click="nodeClick"
              draggable
              :default-expand-all="true">
            </el-tree>
          </div>
        </el-col>
        <el-col :xs="5" :sm="12">
          <el-card class="box-card" style="height: 300px">
            <div slot="header" class="clearfix">
              <span>{{ dept.id === '' ? '新增' : '编辑' }}</span>
            </div>
              <el-form ref="form" :model="dept" :rules="rules" label-position="right" label-width="100px">
                <el-form-item label="上级部门" prop="parentId">
                  <treeselect
                    v-model="dept.parentId"
                    :multiple="false"
                    :options="deptData"
                    clear-value-text
                    placeholder=" "
                    style="width:100%"
                  />
                </el-form-item>
                <el-form-item label="部门名称" prop="deptName">
                  <el-input v-model="dept.deptName" />
                </el-form-item>
              </el-form>
          </el-card>
          <el-card class="box-card" style="margin-top: -2rem;">
            <el-row>
              <el-col :span="24" style="text-align: right">
                <el-button type="primary" plain :loading="false" @click="handleSubmit">{{ dept.id === '' ? '新增' : '修改' }}</el-button>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  components: { Treeselect },
  data() {
    return {
      // 查询参数
      deptInfo: {
        deptName: '',
        id: null
      },
      dept: this.initDept(),
      rules: {
        deptName: [
          { required: true, trigger: 'blur' },
          { min: 3, max: 10, trigger: 'blur' }
        ]
      },
      deptData: [],
      multipleSelection: [],
      ids: ''
    }
  },
  mounted() {
    this.getDeptList()
  },
  methods: {
    initDept() {
      return {
        id: '',
        deptName: '',
        parentId: null
      }
    },
    nodeClick(data) {
      this.dept.parentId = data.parentId
      if (this.dept.parentId === '0') {
        this.dept.parentId = null
      }
      this.dept.deptName = data.label
      this.dept.id = data.id
      this.$refs.form.clearValidate()
    },
    handleCheckChange() {
      let res = this.$refs.deptTree.getCheckedNodes()
      let arr = []
      res.forEach((item) => {
        arr.push(item.id)
      })
      return arr
    },
    // 获取菜单列表
    getDeptList() {
      this.$get('/system/dept', this.deptInfo).then(res => {
        if (res.data.code !== 200) return this.$msg.error('获取部门失败！')
        this.deptData = res.data.data.list
      })
    },
    toAdd() {
      this.resetForm()
    },
    handleSubmit() {
      let that = this
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.dept.id) {
            this.$put('/system/dept', this.dept).then(res => {
              if (res.status !== 200) {
                return that.$msg.error('修改部门失败!')
              }
              that.$msg.success('修改部门成功！')
              this.reset()
            })
          } else {
            this.$post('/system/dept', this.dept).then(res => {
              if (res.status !== 200) {
                return that.$msg.error('新增部门失败!')
              }
              that.$msg.success('新增部门成功!')
              this.reset()
            })
          }
        } else {
          return false
        }
      })
    },
    toDelete() {
      debugger
      this.ids = this.handleCheckChange()
      if (this.ids === '' || this.ids === undefined || this.ids.length === 0) {
        return this.$msg('请选择要删除的数据')
      }
      let that = this
      this.$confirm('此操作将永久删除该部门及下属部门, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        that.$delete('/system/dept?deptIds=' + this.ids).then(res => {
          if (res.status !== 200) return this.$msg.error('删除部门失败!')
          that.$msg.success('删除部门成功！')
          this.ids = ''
          that.getDeptList()
        })
      }).catch(() => {
        that.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    resetForm() {
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
      this.dept = this.initDept()
    },
    reset() {
      this.getDeptList()
      this.resetForm()
    }
  }
}
</script>

<style lang="less" >
  .el-menu-table{
    height: 450px;
    overflow: auto;
  }
  .vue-treeselect__menu {
    max-height: 165px !important;
  }
</style>
