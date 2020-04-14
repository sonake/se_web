<template>
  <el-dialog
    :title=dialogFormTitle
    @close="dialogClose"
    :visible.sync="dialogFormVisible"
    width="40%">
    <!--内容主体区域-->
    <el-form :model="form" :rules="rules" ref="formRef" label-width="150px" class="demo-ruleForm">
      <el-form-item label="数据权限分组名称" prop="accessName">
        <el-input v-model="form.accessName"></el-input>
      </el-form-item>
      <el-form-item label="数据权限控制主体" prop="accessSubject" >
        <el-select v-model="form.accessSubject" placeholder="请选择" @change="currentSel" style="width: 100%">
          <el-option
            v-for="item in tableNames"
            :key="item.value"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据权限资源" prop="accessResource">
        <el-select v-model="form.accessResource" placeholder="请选择" style="width: 100%">
          <el-option
            v-for="item in tableNames"
            :key="item.value"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据权限关联字段" prop="accessResourceField" >
        <el-input v-model="form.accessResourceField" placeholder="重命名该关联字段注意不要与表内已有字段重复">
          <template slot="append">{{this.columnType}}</template>
        </el-input>
      </el-form-item>
      <el-form-item label="数据权限自定义规则" prop="dataPermissionRule">
        <el-input v-model="form.dataPermissionRule"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="resetForm">重置</el-button>
<!--    <el-button type="info" @click="addDialogVisible = false">取 消</el-button>-->
    <el-button type="primary" @click="handleSubmit">确 定</el-button>
  </span>
  </el-dialog>
</template>
<script>
export default {
  name: 'DataEdit',
  props: {
    dialogTitle: {
      default: ''
    },
    editDialogVisible: {
      default: false
    }
  },
  data () {
    return {
      dialogFormVisible: false,
      dialogFormTitle: '',
      tableNames: [],
      columnType: '',
      form: {
        id: null,
        accessName: '',
        accessSubject: '',
        accessResource: '',
        accessResourceField: '',
        dataPermissionRule: ''
      },
      rules: {
        accessName: [
          { required: true, message: '数据权限分组名称', trigger: 'blur' }
        ],
        accessSubject: [
          { required: true, message: '数据权限控制主体', trigger: 'blur' }
        ],
        accessResource: [
          { required: true, message: '数据权限资源', trigger: 'blur' }
        ],
        accessResourceField: [
          { required: true, message: '数据权限关联字段', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getTableList()
  },
  watch: {
    editDialogVisible(newVal, oldVal) {
      this.dialogFormVisible = newVal
    },
    dialogTitle(newVal, oldVal) {
      this.dialogFormTitle = newVal
    }
  },
  methods: {
    getTableList() {
      this.$get('/system/data/access/tableList').then(res => {
        if (res.data.code !== 200) return this.$msg.error('获取数据库表名信息失败！')
        this.tableNames = res.data.data
      })
    },
    currentSel(val) {
      this.$get('/system/data/access/tableId?tableName=' + val).then(res => {
        debugger
        if (res.data.code !== 200) return this.$msg.error('获取数据库表主键信息失败！')
        this.form.accessResourceField = res.data.data.columnName
        this.columnType = res.data.data.columnType
      })
    },
    // 查询需要修改的原始数据
    setFormValues(val) {
      // 表单数据
      let fields = []
      Object.keys(this.form).forEach((key) => {
        fields.push(key)
      })
      // console.log(fields)
      Object.keys(val).forEach((key) => {
        if (fields.indexOf(key) !== -1) {
          this.form[key] = val[key]
        }
      })
      // console.log(this.editForm)
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
    resetForm() {
      this.$refs.formRef.resetFields()
    },
    dialogClose() {
      this.$refs.formRef.resetFields()
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
