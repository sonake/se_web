<template>
  <el-dialog
    :title=dialogTitle
    :visible.sync="dialogVisible"
    @close="dialogClose"
    width="40%">
    <!--内容主体区域-->
    <el-card class="box-card">
      <el-row :gutter="20">
<!--        <el-col :span="8">-->
<!--          <el-input placeholder="请输入权限分组名称" v-model="dataAccessInfo.accessName">-->
<!--            <el-button slot="append" icon="el-icon-search" @click="getList"></el-button>-->
<!--          </el-input>-->
<!--        </el-col>-->
        <el-col :span="4">
          <el-button type="success">权限配发</el-button>
        </el-col>
      </el-row>
      <el-table
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        :data="tableData"
        border
        stripe
        height="450">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="ID" width="150" >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click.native="getDataInfo(scope.row)">{{scope.row.id}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="部门" prop="dept_id">
          <el-cascader
            ref="ecPid"
            @change="getCurrentNode"
            placeholder="请选择部门"
            :props="{checkStrictly: true, value: 'id'}"
            :options="sub"
            clearable>
          </el-cascader>
        </el-table-column>
      </el-table>
<!--      <el-pagination-->
<!--        @size-change="handleSizeChange"-->
<!--        @current-change="handleCurrentChange"-->
<!--        :current-page="detailInfo.pageNo"-->
<!--        :page-sizes="[10, 20, 50, 100]"-->
<!--        :page-size="1"-->
<!--        layout="total, sizes, prev, pager, next, jumper"-->
<!--        :total="detailInfo.total">-->
<!--      </el-pagination>-->
    </el-card>
  </el-dialog>
</template>
<script>
export default {
  name: 'DataEditDetail',
  props: {
    dialogDetailVisible: {
      default: ''
    },
    dialogDetailTitle: {
      default: false
    },
    accessResource: {
      default: ''
    }
  },
  data () {
    return {
      detailInfo: {
        id: null
      },
      dataInfo: [],
      sub: [],
      dialogVisible: false,
      dialogTitle: '',
      tableData: [],
      subAccessName: '',
      multipleSelection: []
    }
  },
  mounted() {
    this.getTableList()
    this.getAccessList()
  },
  watch: {
    dialogDetailVisible(newVal, oldVal) {
      this.dialogVisible = newVal
    },
    dialogDetailTitle(newVal, oldVal) {
      this.dialogTitle = newVal
    },
    accessResource(newVal, oldVal) {
      this.subAccessResource = newVal
    }
  },
  methods: {
    // 多选
    handleSelectionChange(val) {
      debugger
      // this.ids = ''
      console.log(val)
      this.multipleSelection = val
      // for (let i = 0; i < this.multipleSelection.length; i++) {
      //   this.ids += this.multipleSelection[i].id + ','
      // }
      // console.log(this.ids)
    },
    // 查看具体的数据详情
    getDataInfo(row) {
      this.detailInfo.id = row.id
      this.$get('/system/dict', this.detailInfo).then(res => {
        debugger
        if (res.data.code !== 200) return this.$msg.error('获取数据权限信息失败！')
        this.dataInfo = res.data.data.list
        this.$alert(JSON.stringify(this.dataInfo), '数据详情', {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'info',
              message: `action: ${action}`
            })
          }
        })
      })
    },
    getCurrentNode(val) {
      let nodesObj = this.$refs['ecPid'].getCheckedNodes()
      console.log(nodesObj[0].data.id)
    },
    getAccessList() {
      this.$get('/system/dept').then(res => {
        if (res.data.code !== 200) return this.$msg.error('获取菜单失败！')
        this.sub = res.data.data.list
        // console.log(this.menuData)
      })
    },
    getTableList() {
      this.$get('/system/data/access/detail?accessResource=t_dict').then(res => {
        debugger
        if (res.data.code !== 200) return this.$msg.error('获取资源数据信息失败！')
        this.tableData = res.data.data
      })
    },
    handleSubmit() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          this.form.accessResourceField = this.form.accessResourceField + ' ' + this.columnType
          if (this.dialogFormTitle === '新增') {
            this.$post('/system/data/access', this.form).then(res => {
              if (res.status !== 200) {
                this.$emit('close')
                return this.$msg.error('新增失败!')
              }
              this.$emit('success', '新增成功')
            })
          } else {
            this.$put('/system/data/access', this.form).then(res => {
              // console.log(res)
              if (res.status !== 200) {
                this.$emit('close')
                return this.$msg.error('修改失败!')
              }
              this.$emit('success', '修改成功')
            })
          }
        } else {
          return false
        }
      })
    },
    dialogClose() {
      // this.$refs.formRef.resetFields()
      this.$emit('close')
    }
  }
}
</script>

<style lang="less">
  .el-input-group__append, .el-input-group__prepend {
    width: 100px;
  }
</style>
