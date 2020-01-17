<template>
  <el-container class='home-container'>
    <el-header style='height: 80px'>
      <div>
        <img src='../assets/logo.pngv' alt=''>
      </div>
      <el-button type='info' @click='logout'>退出</el-button>
    </el-header>
    <el-container>
      <el-aside width='250px'>
        <el-menu
          background-color='#333744'
          text-color='#fff'
          active-text-color='#ffd04b'>
          <el-submenu :index='item.id' v-for='item in menuList' :key='item.id'>
            <!--一级菜单-->
            <template slot='title'>
              <!--图标-->
              <i class='el-icon-location'></i>
              <span>{{item.name}}</span>
            </template>
            <!--二级菜单-->
            <el-menu-item :index='subItem.id' v-for='subItem in item.children' :key='subItem.id'>
              <template slot='title'>
                <!--图标-->
                <i class='el-icon-location'></i>
                <span>{{subItem.name}}</span>
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
import db from '../util/localstorage'
export default {
  data () {
    // 左侧菜单数据
    return {
      menuList: [ ]
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
      db.clear()
      // 重定向至登录页
      this.$router.push('/login')
    },
    // 获取所有菜单
    getMenuList () {
      // 获取用户id，调用该方法回去用户的权限列表
      debugger
      const user = db.get('USER')
      if (user) {
        let that = this
        this.$get('/system/menu/' + user.id).then(res => {
          console.dir(res)
          console.dir(res.data.data)
          that.menuList = res.data.data
        })
      }
    }
  }
}
</script>

<style lang='less' scoped>
.el-header{
  background-color: #F8F8F8;
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
      width: 250px;
      height: 80px;
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
