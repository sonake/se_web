<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.jpg">
      </div>
      <div>
        <div class="login-info">
          <div class="title">Hc Cloud</div>
          <div class="sub-title">分布式微服务权限系统</div>
          <div class="desc">1. 基于Spring Boot 2.1.8 & Spring Cloud Greenwich.SR3</div>
          <div class="desc">2. 使用Spring Cloud OAuth2统一认证</div>
          <div class="desc">3. 认证服务器资源服务器分离，方便拓展</div>
          <div class="desc">4. 前后端分离架构，提高软件开发效率</div>
          <div class="desc">5. 集成多种监控，为微服务保驾护航</div>
          <div class="desc">6. 提供详细的文档，手把手教你从零搭建到部署</div>
        </div>
        <el-form ref="loginFormRef" label-width="0px" class="login_form" :model="loginForm" :rules="ruleForm">
          <div class="title-container">
            <h3 class="title">
              欢迎登陆
            </h3>
            <lang-select class="set-language" />
          </div>
          <!--账户-->
          <el-form-item prop="account">
            <el-input prefix-icon="iconfont icon-account" v-model="loginForm.account"></el-input>
          </el-form-item>
          <!--密码-->
          <el-form-item prop="password">
            <el-input type="password" prefix-icon="iconfont icon-password" v-model="loginForm.password"></el-input>
          </el-form-item>
          <!--验证码-->
          <!--          <el-form-item prop="code">-->
          <!--            <el-input v-model="loginForm.code"></el-input>-->
          <!--          </el-form-item>-->
          <!--按钮区域-->
          <el-form-item class="login_button">
            <el-button type="primary" @click="login">登陆</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
          </el-form-item>
          <span class="login-footer">
            Copyright © 2019 <a target="_blank" href="https://sonake.com">Sonake</a>
          </span>
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
          { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
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
    background-image: url('../assets/img/light-streaks-32906012.jpg');
  }
  .login-info {
    position: absolute;
    left: -300%;
    top: 44%;
    margin-top: -100px;
    color: #fff;
    .title {
      font-size: 1.8rem;
      font-weight: 600;
    }
    .sub-title {
      font-size: 1.5rem;
      margin: .3rem 0 .7rem 1rem;
    }
    .desc {
      font-size: .96rem;
      line-height: 1.9rem;
    }
  }

  .login_box {
    width: 350px;
    height: 380px;
    background-color: #eeeeee;
    border-radius: 3px;
    position: absolute;
    left: 80%;
    top: 65%;
    transform: translate(-50%, -50%);

    .avatar_box {
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eeeeee
      }
    }
  }

  .login_button {
    display: flex;
    justify-content: flex-end;
  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }

  .login-footer {
    text-align: center;
    display: inline-block;
    width: 100%;
    font-size: 14px;
    color: #0086b3;
  }
  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: rgba(0, 0, 0, .85);
      margin: 0 auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }
</style>
