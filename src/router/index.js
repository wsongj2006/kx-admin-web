import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login'
import AllDeviceStatus from '@/views/AllDeviceStatus'
import OfflineDeviceStatus from '@/views/OfflineDeviceStatus'
import OnlineDeviceStatus from '@/views/OnlineDeviceStatus'
import ImportDevice from '@/views/ImportDevice'
import BindDevice from '@/views/BindDevice'
import CurrentUsage from '@/views/CurrentUsage'
import PeriodUsage from '@/views/PeriodUsage'
import Account from '@/views/Account'
import Customer from '@/views/Customer'
import Building from '@/views/Building'
import Section from '@/views/Section'
import UpdatePwd from '@/views/UpdatePwd'
import Resource from '@/views/Resource'
import Role from '@/views/Role'
import AccountRole from '@/views/AccountRole'
import RoleResource from '@/views/RoleResource'
import NoPermission from '@/views/NoPermission'
import Home from '@/components/Home'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
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
          },
          {
            path: '/currentUsage',
            component: CurrentUsage
          },
          {
            path: '/periodUsage',
            component: PeriodUsage
          },
          {
            path: '/account',
            component: Account
          },
          {
            path: '/customer',
            component: Customer
          },
          {
            path: '/building',
            component: Building
          },
          {
            path: '/section',
            component: Section
          },
          {
            path: '/updatePwd',
            component: UpdatePwd
          },
          {
            path: '/resource',
            component: Resource
          },
          {
            path: '/role',
            component: Role
          },
          {
            path: '/accountRole',
            component: AccountRole
          },
          {
            path: '/roleResource',
            component: RoleResource
          },
          {
            path: '/noPermission',
            component: NoPermission
          }
          ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
