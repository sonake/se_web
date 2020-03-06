<template>
  <el-dialog
    title="添加角色"
    :visible.sync="dialogFormVisible"
    @close="dialogClose"
    width="40%">
    <!--内容主体区域-->
    <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="80px" class="demo-ruleForm">
      <el-form-item label="角色名" prop="roleName">
        <el-input v-model="addForm.roleName"></el-input>
      </el-form-item>
      <el-form-item label="是否禁用" prop="status">
        <el-switch
          v-model="addForm.status"
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
import { RandomNumBoth } from '../../../util'
export default {
  name: 'RoleAdd',
  props: {
    addDialogVisible: {
      default: false
    }
  },
  data () {
    return {
      addForm: {
        roleName: 'test' + RandomNumBoth(1, 100),
        status: '1'
      },
      addRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
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
          this.$post('/system/role', this.addForm).then(res => {
            if (res.status !== 200) {
              that.$emit('close')
              return that.$msg.error('新增角色失败!')
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
