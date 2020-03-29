<template>
  <el-container class='home-container'>
    <el-header style='height: 80px'>
      <div >
        <img src='../assets/logo.png' alt='' :width="isCollapse ? '64px' : '200px'">
      </div>
      <div class="toggle-button" @click="toggleCollapse" style="margin-right:auto">
        <i :class='icon' style="font-size: xx-large"></i>
      </div>
      <div style="color: #222222">{{opp}}</div>
      <iframe id="geoPage" width=0 height=0 frameborder=0 style="display:none;" scrolling="no"
              src="https://apis.map.qq.com/tools/geolocation?key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&referer=myapp">
      </iframe>
      <el-button type='info' @click='logout'>退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <el-menu
          :default-active="activePath"
          :router="true"
          background-color='#333744'
          text-color='#fff'
          active-text-color='#409EFF' :unique-opened="true"
          :collapse="isCollapse" :collapse-transition="false">
          <el-submenu :index='item.path' v-for='item in menuList' :key='item.id'>
            <!--一级菜单-->
            <template slot='title'>
              <!--图标-->
              <i :class='item.icon'></i>
              <span>{{item.name}}</span>
            </template>
            <!--二级菜单-->
            <el-menu-item
              :index='subItem.path'
              v-for='subItem in item.children'
              :key='subItem.id'
              @click="saveNavstate(subItem.path)">
              <template slot='title'>
                <!--图标-->
                <i :class='subItem.icon'></i>
                <span>{{subItem.name}}</span>
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
import db from '../util/localstorage'
export default {
  data () {
    // 左侧菜单数据
    return {
      icon: 'el-icon-s-unfold',
      menuList: [ ],
      isCollapse: false,
      activePath: '/home',
      opp: ''
    }
  },
  name: 'Home',
  // 生命周期函数，也可用created
  mounted () {
    // 获取权限菜单
    this.getMenuList()
    this.activePath = db.get('ACTIVEPATH')
    this.Tmap()
  },
  methods: {
    Tmap() {
      window.addEventListener('message', function(event) {
        let loc = event.data
        this.opp = '您当前位于' + loc.city
        // 显示你当前位置
        // console.log(this.opp)
      }, false)
    },
    logout () {
      // 清空token
      db.clear()
      // 重定向至登录页
      this.$router.push('/login')
    },
    // 获取所有菜单
    getMenuList () {
      // 获取用户id，调用该方法回去用户的权限列表
      const user = db.get('USER')
      if (user) {
        let that = this
        this.$get('/system/menu/' + user.id).then(res => {
          that.menuList = res.data.data
        })
      }
    },
    // 侧边栏切换
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
      if (this.isCollapse) {
        this.icon = 'el-icon-s-fold'
      } else {
        this.icon = 'el-icon-s-unfold'
      }
    },
    // 保存菜单的激活状态
    saveNavstate (activePath) {
      this.$store.commit('account/setActivePath', activePath)
      this.activePath = activePath
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
      height: 80px;
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
.toggle-button{
 background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
  /*.iconfont {*/
  /*  margin-right: 10px;*/
  /*}*/
</style>
