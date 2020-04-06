<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>地区管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input placeholder="请输入地区名" v-model="areaInfo.areaName" style="width: 60%">
            <el-button slot="append" icon="el-icon-search" @click="getAreaList"></el-button>
          </el-input>
          <el-button @click="toAdd" type="primary" style="margin-left: 20px">新增</el-button>
          <el-button @click="toDelete" type="danger" style="margin-left: 20px">删除</el-button>
          <el-divider></el-divider>
          <div class="el-menu-table">
            <el-tree
              ref="areaTree"
              :data="areaData"
              show-checkbox
              node-key="id"
              @check-change="handleCheckChange"
              @node-click="nodeClick"
              draggable>
            </el-tree>
          </div>
        </el-col>
        <el-col :xs="5" :sm="12">
          <el-card class="box-card" style="height: 350px">
            <div slot="header" class="clearfix">
              <span>{{ area.id === '' ? '新增' : '编辑' }}</span>
            </div>
              <el-form ref="form" :model="area" :rules="rules" label-position="right" label-width="100px">
                <el-form-item label="上级地区" prop="parentId">
                  <treeselect
                    v-model="area.parentId"
                    :multiple="false"
                    :options="areaData"
                    clear-value-text
                    placeholder=" "
                    style="width:100%"
                  />
                </el-form-item>
                <el-form-item label="地区名称" prop="areaName">
                  <el-input v-model="area.areaName" />
                </el-form-item>
                <el-form-item label="地区编号" prop="areaCode">
                  <el-input v-model="area.areaCode" />
                </el-form-item>
                <el-form-item label="序号" prop="orderNum">
                  <el-input v-model="area.orderNum" />
                </el-form-item>
              </el-form>
          </el-card>
          <el-card class="box-card" style="margin-top: -2rem;">
            <el-row>
              <el-col :span="24" style="text-align: right">
                <el-button type="primary" plain :loading="false" @click="handleSubmit">{{ area.id === '' ? '新增' : '修改' }}</el-button>
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
      areaInfo: {
        areaName: '',
        id: null
      },
      area: this.initArea(),
      rules: {
        areaName: [
          { required: true, trigger: 'blur' },
          { min: 2, max: 10, trigger: 'blur' }
        ]
      },
      areaData: [],
      multipleSelection: [],
      ids: ''
    }
  },
  mounted() {
    this.getAreaList()
  },
  methods: {
    initArea() {
      return {
        id: '',
        areaName: '',
        parentId: null,
        orderNum: null,
        areaCode: ''
      }
    },
    nodeClick(data) {
      this.area.parentId = data.parentId
      if (this.area.parentId === '0') {
        this.area.parentId = null
      }
      this.area.areaName = data.label
      this.area.id = data.id
      this.area.areaCode = data.areaCode
      this.area.orderNum = data.orderNum
      this.$refs.form.clearValidate()
    },
    handleCheckChange() {
      let res = this.$refs.areaTree.getCheckedNodes()
      let arr = []
      res.forEach((item) => {
        arr.push(item.id)
      })
      return arr
    },
    // 获取列表
    getAreaList() {
      this.$get('/system/area', this.areaInfo).then(res => {
        if (res.data.code !== 200) return this.$msg.error('获取地区失败！')
        this.areaData = res.data.data.list
      })
    },
    toAdd() {
      this.resetForm()
    },
    handleSubmit() {
      let that = this
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.area.id) {
            this.$put('/system/area', this.area).then(res => {
              if (res.status !== 200) {
                return that.$msg.error('修改地区失败!')
              }
              that.$msg.success('修改地区成功！')
              this.reset()
            })
          } else {
            this.$post('/system/area', this.area).then(res => {
              if (res.status !== 200) {
                return that.$msg.error('新增地区失败!')
              }
              that.$msg.success('新增地区成功!')
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
      this.$confirm('此操作将永久删除该地区及下属地区, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        that.$delete('/system/area?areaIds=' + this.ids).then(res => {
          if (res.status !== 200) return this.$msg.error('删除地区失败!')
          that.$msg.success('删除地区成功！')
          this.ids = ''
          that.getAreaList()
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
      this.area = this.initArea()
    },
    reset() {
      this.getAreaList()
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
