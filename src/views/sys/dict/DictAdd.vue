<template>
  <el-dialog
    title="添加字典"
    :visible.sync="dialogFormVisible"
    @close="dialogClose"
    width="40%">
    <!--内容主体区域-->
    <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="80px" class="demo-ruleForm">
      <el-form-item label="字典值" prop="code">
        <el-input v-model="addForm.code"></el-input>
      </el-form-item>
      <el-form-item label="字典名称" prop="value">
        <el-input v-model="addForm.value"></el-input>
      </el-form-item>
      <el-form-item label="字典类型" prop="fieldName">
        <el-input v-model="addForm.fieldName"></el-input>
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
import { RandomNumBoth } from '../../../util'
export default {
  name: 'DictAdd',
  props: {
    addDialogVisible: {
      default: false
    }
  },
  data () {
    return {
      addForm: {
        value: 'test' + RandomNumBoth(1, 100),
        code: '',
        fieldName: ''
      },
      addRules: {
        value: [
          { required: true, message: '请输入字典名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入字典值', trigger: 'blur' }
        ],
        fieldName: [
          { required: true, message: '请字典类型', trigger: 'blur' }
        ]
      },
      dialogFormVisible: false
    }
  },
  watch: {
    addDialogVisible(newVal, oldVal) {
      this.dialogFormVisible = newVal
    }
  },
  methods: {
    handleSubmit() {
      let that = this
      this.$refs.addFormRef.validate(valid => {
        if (valid) {
          this.$post('/system/dict', this.addForm).then(res => {
            if (res.status !== 200) {
              that.$emit('close')
              return that.$msg.error('新增字典失败!')
            }
            that.$emit('success')
            that.resetForm()
          })
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.$refs.addFormRef.resetFields()
    },
    dialogClose() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" coped>

</style>
