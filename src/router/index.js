import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login'
import AllDeviceStatus from '@/views/AllDeviceStatus'
import OfflineDeviceStatus from '@/views/OfflineDeviceStatus'
import OnlineDeviceStatus from '@/views/OnlineDeviceStatus'
import ImportDevice from '@/views/ImportDevice'
import BindDevice from '@/views/BindDevice'
import Home from '@/components/Home'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
        path: '/home',
        component: Home,
        redirect: '/allDeviceStatus',
          children: [{
            path: '/allDeviceStatus',
            name: '设备管理',
            component: AllDeviceStatus
          },
          {
            path: '/offlineDeviceStatus',
            component: OfflineDeviceStatus
          },
          {
            path: '/onlineDeviceStatus',
            component: OnlineDeviceStatus
          },
          {
            path: '/importDevice',
            component: ImportDevice
          },
          {
            path: '/bindDevice',
            component: BindDevice
          }
          ]
  },
  {
    path: '/allDeviceStatus',
    name: 'allDeviceStatus',
    component: AllDeviceStatus
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
