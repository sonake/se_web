<template>
  <el-dialog
    title="修改角色"
    @close="dialogClose"
    :visible.sync="dialogFormVisible"
    width="40%">
    <!--内容主体区域-->
    <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="80px" class="demo-ruleForm">
      <el-form-item label="角色名" prop="roleName">
        <el-input v-model="editForm.roleName"></el-input>
      </el-form-item>
      <el-form-item label="是否禁用" prop="status">
        <el-switch
          v-model="editForm.status"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-value="1"
          inactive-value="0">
        </el-switch>
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
  name: 'roleEdit',
  props: {
    editDialogVisible: {
      default: false
    }
  },
  data () {
    return {
      dialogFormVisible: false,
      editForm: {
        roleName: '',
        status: ''
      },
      editRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
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
    setFormValues(role) {
      // 表单数据
      let fields = []
      Object.keys(this.editForm).forEach((key) => {
        fields.push(key)
      })
      console.log(fields)
      Object.keys(role).forEach((key) => {
        if (fields.indexOf(key) !== -1) {
          this.editForm[key] = role[key]
        }
      })
      console.log(this.editForm)
    },
    handleSubmit() {
      this.$refs.editFormRef.validate(valid => {
        if (valid) {
          this.$put('/system/role', this.editForm).then(res => {
            console.log(res)
            if (res.status !== 200) {
              this.$emit('close')
              return this.$msg.error('修改用户失败!')
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
