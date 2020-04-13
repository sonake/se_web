import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home'
import { getToken } from '../util/auth'
import Welcome from '../components/Welcome'
import User from '../views/sys/user/User'
import Role from '../views/sys/role/Role'
import Menu from '../views/sys/menu/Menu'
import Dict from '../views/sys/dict/Dict'
import Dept from '../views/sys/dept/Dept'
import Area from '../views/sys/area/Area'
import Data from '../views/sys/data/Data'
// import {User, Role, Menu, Dict} from '../views/sys'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/sys/user',
        component: User
      },
      {
        path: '/sys/role',
        component: Role
      },
      {
        path: '/sys/menu',
        component: Menu
      },
      {
        path: '/sys/dict',
        component: Dict
      },
      {
        path: '/sys/Dept',
        component: Dept
      },
      {
        path: '/sys/Area',
        component: Area
      },
      {
        path: '/sys/Data',
        component: Data
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径来
  // next 一个函数，代表放行 next()放行，next('/login')强制跳转
  if (to.path === '/login') return next()
  // 获取token
  const token = getToken()
  if (!token) return next('/login')
  next()
})

export default router
