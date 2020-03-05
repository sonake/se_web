<template>
  <el-dialog
    title="修改用户"
    @close="dialogClose"
    :visible.sync="dialogFormVisible"
    width="40%">
    <!--内容主体区域-->
    <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="80px" class="demo-ruleForm">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="editForm.username"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="editForm.nickname"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="editForm.password" show-password></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="editForm.email"></el-input>
      </el-form-item>
      <!--        <el-form-item label="活动区域" prop="region">-->
      <!--          <el-select v-model="addForm.region" placeholder="请选择活动区域">-->
      <!--            <el-option label="区域一" value="shanghai"></el-option>-->
      <!--            <el-option label="区域二" value="beijing"></el-option>-->
      <!--          </el-select>-->
      <!--        </el-form-item>-->
      <!-- <el-form-item label="创建时间" required>
        <el-col :span="11">
          <el-form-item prop="createTime">
            <el-date-picker type="datetime" placeholder="选择创建时间" v-model="editForm.createTime" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item> -->
      <el-form-item label="是否禁用" prop="status">
        <el-switch
          v-model="editForm.status"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-value="1"
          inactive-value="0">
        </el-switch>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="editForm.sex">
          <el-radio label="0">男性</el-radio>
          <el-radio label="1">女性</el-radio>
          <el-radio label="2">保密</el-radio>
        </el-radio-group>
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
  name: 'UserEdit',
  props: {
    editDialogVisible: {
      default: false
    }
  },
  data () {
    // 校验邮箱
    let checkEmail = (rule, val, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(val)) {
        return callback()
      }
      callback(new Error('请输入合法的邮箱!'))
    }
    return {
      dialogFormVisible: false,
      editForm: {
        username: 'test123',
        password: '123456',
        nickname: 'test',
        email: '1@qq.cc',
        status: '1',
        sex: '2',
        id: ''
      },
      editRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 4, max: 10, message: '长度在 4 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        email: [
          { validator: checkEmail, trigger: 'blur' }
        ],
        // createTime: [
        //   { type: 'date', required: true, message: '请选择创建时间', trigger: 'change' }
        // ],
        status: [
          { required: true, message: '请选择活动禁用状态', trigger: 'change' }
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
    setFormValues(user) {
      // 表单数据
      let fields = []
      Object.keys(this.editForm).forEach((key) => {
        fields.push(key)
      })
      console.log(fields)
      Object.keys(user).forEach((key) => {
        if (fields.indexOf(key) !== -1) {
          this.editForm[key] = user[key]
        }
      })
      console.log(this.editForm)
    },
    handleSubmit() {
      this.$refs.editFormRef.validate(valid => {
        if (valid) {
          this.$put('/system/user', this.editForm).then(res => {
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
