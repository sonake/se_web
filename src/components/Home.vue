<template>
  <el-container class="home-container">
    <el-header style="height: 80px">
      <div>
        <img src="../assets/img/logo-head.jpg" alt="">
        <span>SC 管理后台</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px': '300px'">
        <div class="toggle-button" @click="toggleCollSpace">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened :collapse="isCollapse" :collapse-transition="false">
          <el-submenu :index="item.id" v-for="item in menuList" :key="item.id">
            <!--一级菜单模板区-->
            <template slot="title">
              <!--图标-->
              <i class="iconObjs[item.id]"></i>
              <span>{{item.menuName}}}</span>
            </template>
            <!--二级菜单-->
            <el-menu-item :index="subItem.id" v-for="subItem in item.childrenNemuList" :key="subItem.id">
              <template slot="title">
                <!--图标-->
                <i class="el-icon-menu"></i>
                <span>{{subItem.menuItem}}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!--路由占位符-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    // 左侧菜单数据
    return {
      menuList: [],
      iconObjs: {
        125: 'el-icon-setting'
      },
      isCollapse: false
    }
  },
  name: 'Home',
  // 生命周期函数，也可用created
  mounted () {
    // 获取权限菜单
    this.getMenuList()
  },
  methods: {
    logout () {
      // 清空token
      window.sessionStorage.clear()
      // 重定向至登录页
      this.$router.push('/login').then(res => {
        // 打印获取到的菜单信息
        console.log(res)
        if (res.code !== 200) return this.$msg.error(res.msg)
        this.menuList = res.data
      })
    },
    // 点击按钮切换菜单是否折叠
    toggleCollSpace () {
      this.isCollapse = !this.isCollapse
    }
  },
  // 获取所有菜单
  getMenuList () {
    this.$get('/menus')
  }
}
</script>

<style lang="less" scoped>
.el-header{
  background-color: #393E46;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    img {
      width: 300px;
      height: 80px;
    }
    span {
      margin-left: 15px;
    }
  }
}
.el-aside{
  background-color: #393E46;
  .el-menu{
    border-right: none;
  }
}
.el-main{
  background-color: #F8F8F8;
}
.home-container{
  height: 100%;
}
  .iconfont{
    margin-right: 10px;
  }
  .toggle-button{
    background-color: #cccccc;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>
