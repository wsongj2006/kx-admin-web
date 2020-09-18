<template>
    <div id="headerDiv">
        <div id="logoDiv">
            <p id="logoFont">阚讯电表控制系统</p>
        </div>

        <div id="naviDiv">
            <a href="#" id="runningStatusButton" v-on:click="goTo('status')">运行状态</a>
            <a href="#" id="deviceManagerButton" v-on:click="goTo('device')">设备管理</a>
            <a href="#" id="dataManagerButton" v-on:click="goTo('data')">数据统计</a>
            <a href="#" id="systemSetButton" v-on:click="goTo('setup')">系统设置</a>
            <a href="#" id="permissionSetButton" v-on:click="goTo('permission')">权限管理</a>
        </div>

        <div id="loginUserDiv">
            <p id="logoUserFont">上海阚讯科技：User001</p>
        </div>

        <div id="avatarDiv">
            <img :src="imgUrl" id="avatarPic">
        </div>

    </div>
</template>

<script>
    export default {
        name: 'Home',
        data () {
            return {
              imgUrl:'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
            }
        },

        methods: {
            goTo(action) {
                if(action == 'status') {
                    this.$router.push("/allDeviceStatus");
                }

                if(action == 'device') {
                    this.$router.push("/importDevice");
                }
            }
        }
    }
</script>

<style>
    @import '../assets/kx-iot.css'
</style>