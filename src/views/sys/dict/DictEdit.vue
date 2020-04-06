<template>
  <el-dialog
    title="修改用户"
    @close="dialogClose"
    :visible.sync="dialogFormVisible"
    width="40%">
    <!--内容主体区域-->
    <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="80px" class="demo-ruleForm">
      <el-form-item label="字典值" prop="code">
        <el-input v-model="editForm.code"></el-input>
      </el-form-item>
      <el-form-item label="字典名称" prop="value">
        <el-input v-model="editForm.value"></el-input>
      </el-form-item>
      <el-form-item label="字典类型" prop="fieldName">
        <el-input v-model="editForm.fieldName"></el-input>
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
  name: 'DictEdit',
  props: {
    editDialogVisible: {
      default: false
    }
  },
  data () {
    return {
      dialogFormVisible: false,
      editForm: {
        fieldName: '',
        code: '',
        value: ''
      },
      editRules: {
        fieldName: [
          { required: true, message: '请输入字典类型', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入字典值', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '请输入字典名称', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    editDialogVisible(newVal, oldVal) {
      this.dialogFormVisible = newVal
    }
  },
  methods: {
    // 查询需要修改的原始数据
    setFormValues(val) {
      // 表单数据
      let fields = []
      Object.keys(this.editForm).forEach((key) => {
        fields.push(key)
      })
      // console.log(fields)
      Object.keys(val).forEach((key) => {
        if (fields.indexOf(key) !== -1) {
          this.editForm[key] = val[key]
        }
      })
      // console.log(this.editForm)
    },
    handleSubmit() {
      this.$refs.editFormRef.validate(valid => {
        if (valid) {
          this.$put('/system/dict', this.editForm).then(res => {
            // console.log(res)
            if (res.status !== 200) {
              this.$emit('close')
              return this.$msg.error('修改字典失败!')
            }
            this.$emit('success')
          })
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.$refs.editFormRef.resetFields()
    },
    dialogClose() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" coped>

</style>
