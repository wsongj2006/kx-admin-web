<template>
    <div id="headerDiv">
        <div id="logoDiv">
            <p id="logoFont">阚讯电表管理系统</p>
        </div>

        <div id="naviDiv">
            <a href="#" id="runningStatusButton" v-if="this.$store.state.parentMenuCode!='status'" v-on:click="goTo('status')">运行状态</a>
            <a href="#" id="runningStatusButtonActive" v-if="this.$store.state.parentMenuCode=='status'" v-on:click="goTo('status')">运行状态</a>

            <a href="#" id="deviceManagerButton" v-if="this.$store.state.parentMenuCode!='device'"  v-on:click="goTo('device')">设备管理</a>
            <a href="#" id="deviceManagerButtonActive" v-if="this.$store.state.parentMenuCode=='device'"  v-on:click="goTo('device')">设备管理</a>

            <a href="#" id="dataManagerButton" v-if="this.$store.state.parentMenuCode!='data'"  v-on:click="goTo('data')">数据统计</a>
            <a href="#" id="dataManagerButtonActive" v-if="this.$store.state.parentMenuCode=='data'"  v-on:click="goTo('data')">数据统计</a>

            <a href="#" id="systemSetButton" v-if="this.$store.state.parentMenuCode!='setup'" v-on:click="goTo('setup')">系统设置</a>
            <a href="#" id="systemSetButtonActive" v-if="this.$store.state.parentMenuCode=='setup'" v-on:click="goTo('setup')">系统设置</a>

            <a href="#" id="permissionSetButton" v-if="this.$store.state.parentMenuCode!='permission'" v-on:click="goTo('permission')">权限管理</a>
            <a href="#" id="permissionSetButtonActive" v-if="this.$store.state.parentMenuCode=='permission'" v-on:click="goTo('permission')">权限管理</a>
        </div>

        <div id="avatarDiv">
            <img :src="imgUrl" id="avatarPic" >
        </div>

        <div id="loginUserDiv">
            <p class="loginUserAndOutFont">{{this.customerName}}：{{this.roleName}}</p>
        </div>
        <div id="loginOutDiv">
            <p class="loginUserAndOutFont">
                {{this.userName}} &nbsp;&nbsp;&nbsp;&nbsp;<a href="#" class="loginUserAndOutFont" @click="logout">点击退出</a>
            </p>
        </div>

    </div>
</template>

<script>
    import { logout } from '@/api/admin'
    export default {
        name: 'Home',
        data () {
            return {
              imgUrl:'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
              customerName: localStorage.getItem("loginCustomerName"),
              userName: localStorage.getItem("loginUser"),
              roleName: localStorage.getItem("roleName")
            }
        },

        methods: {
            goTo(action) {
                if(action == 'status') {
                    this.activeRunningStatus="Y"
                    this.activeDeviceManager="N"
                    this.$router.push("/allDeviceStatus");
                }

                if(action == 'device') {
                    this.activeRunningStatus="N"
                    this.activeDeviceManager="Y"
                    this.$router.push("/bindDevice");
                }

                if(action == 'data') {
                    this.$router.push("/currentUsage");
                }

                if(action == 'setup') {
                    this.$router.push("/account");
                }

                if(action == 'permission') {
                    this.$router.push("/resource");
                }
            },

            logout(){
                logout().then(
                    res => {
                        if (res.status == 200) {
                            localStorage.removeItem("token")
                            localStorage.removeItem("loginUser")
                            localStorage.removeItem("loginCustomerName")
                            localStorage.removeItem("userId")
                            localStorage.removeItem("isSupperAdmin")
                            localStorage.removeItem("customerId")
                            localStorage.removeItem("roleName")
                            this.$router.push("/login");
                        }else {
                            this.$message(
                            {   type:"error",
                                message: res.data
                            })
                        }
                    }
                )






            }
        }
    }
</script>

<style>
    @import '../assets/kx-iot.css'
</style>