<template>
  <el-dialog
    :title=dialogTitle
    :visible.sync="dialogVisible"
    width="40%">
    <!--内容主体区域-->
    <el-card class="box-card">
      <el-row :gutter="20">
<!--        <el-col :span="8">-->
<!--          <el-input placeholder="请输入权限分组名称" v-model="dataAccessInfo.accessName">-->
<!--            <el-button slot="append" icon="el-icon-search" @click="getList"></el-button>-->
<!--          </el-input>-->
<!--        </el-col>-->
<!--        <el-col :span="4">-->
<!--          <el-button type="primary" @click="handleAdd">新增</el-button>-->
<!--          <el-button-->
<!--            type="danger"-->
<!--            @click="handleDelete()" >删除</el-button>-->
<!--        </el-col>-->
      </el-row>
      <el-table
        ref="multipleTable"
        :data="tableData"
        border
        stripe>
        <el-table-column type="selection" width="55"></el-table-column>
<!--        <el-table-column prop="" label="数据权限分组名称"></el-table-column>-->
<!--        <el-table-column prop="accessSubject" label="数据权限控制主体"></el-table-column>-->
<!--        <el-table-column prop="accessResource" label="数据权限资源"></el-table-column>-->
<!--        <el-table-column prop="accessResourceField" label="数据权限关联字段"></el-table-column>-->
<!--        <el-table-column prop="dataPermissionRule" label="数据权限自定义规则"></el-table-column>-->
<!--        <el-table-column label="操作">-->
<!--          <template slot-scope="scope">-->
<!--            &lt;!&ndash;修改&ndash;&gt;-->
<!--            <el-button-->
<!--              size="mini"-->
<!--              type="primary"-->
<!--              @click="handleEdit(scope.$index, scope.row)" icon="el-icon-edit"></el-button>-->
<!--            <el-button-->
<!--              size="mini"-->
<!--              type="success"-->
<!--              @click="handleSet(scope.$index, scope.row)" icon="el-icon-setting"></el-button>-->
<!--          </template>-->
<!--        </el-table-column>-->
      </el-table>
<!--      <el-pagination-->
<!--        @size-change="handleSizeChange"-->
<!--        @current-change="handleCurrentChange"-->
<!--        :current-page="dataAccessInfo.pageNo"-->
<!--        :page-sizes="[10, 20, 50, 100]"-->
<!--        :page-size="1"-->
<!--        layout="total, sizes, prev, pager, next, jumper"-->
<!--        :total="dataAccessInfo.total">-->
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
      dialogVisible: false,
      dialogTitle: '',
      tableData: [],
      subAccessName: ''
    }
  },
  mounted() {
    this.getTableList()
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
    getTableList() {
      debugger
      this.$get('/system/data/access/detail?accessResource=t_dict').then(res => {
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
    }
  }
}
</script>

<style lang="less">
  .el-input-group__append, .el-input-group__prepend {
    width: 100px;
  }
</style>
