<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.jpg">
      </div>
      <div>
        <el-form ref="loginFormRef" label-width="0px" class="login_form" :model="loginForm" :rules="ruleForm">
          <!--账户-->
          <el-form-item prop="account">
            <el-input prefix-icon="iconfont icon-account" v-model="loginForm.account" ></el-input>
          </el-form-item>
          <!--密码-->
          <el-form-item prop="password">
            <el-input type="password" prefix-icon="iconfont icon-password" v-model="loginForm.password" ></el-input>
          </el-form-item>
          <!--按钮区域-->
          <el-form-item class="login_button">
            <el-button type="primary" @click="login" plain>登陆</el-button>
            <el-button type="info" @click="resetLoginForm" plain>重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 登陆表单绑定数据
      loginForm: {
        account: 'admin',
        password: '123456'
      },
      // 表单验证
      ruleForm: {
        account: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }

    }
  },
  methods: {
    // 点击重置按钮，重置表单数据
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(valid => {
        if (!valid) return 0
        this.$http.post('login', this.loginForm)
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .login_container {
    background-color: #2b4b6b;
    height: 100%;
  }

  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);

    .avatar_box{
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%,-50%);
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee
      }
    }
  }
  .login_button{
    display: flex;
    justify-content: flex-end;
  }
  .login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
</style>
