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
      <el-aside width="300px">
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-submenu :index="item.id" v-for="item in menuList" :key="item.id">
            <!--一级菜单模板区-->
            <template slot="title">
              <!--图标-->
              <i class="el-icon-location"></i>
              <span>{{item.menuName}}}</span>
            </template>
            <!--二级菜单-->
            <el-menu-item :index="subItem.id" v-for="subItem in item.childrenNemuList" :key="subItem.id">
              <template slot="title">
                <!--图标-->
                <i class="el-icon-location"></i>
                <span>{{subItem.menuItem}}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    // 左侧菜单数据
    return {
      menuList: []
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
}
.el-main{
  background-color: #F8F8F8;
}
.home-container{
  height: 100%;
}
</style>
