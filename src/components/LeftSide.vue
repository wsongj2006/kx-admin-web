<template>
    <div id="leftSideDiv">
        <a href="#" id="allDeviceStatusButton" v-if="this.$store.state.parentMenuCode=='status'" v-on:click="goToFromLeftSide('allDeviceStatus')">全部设备</a>
        <br v-if="this.$store.state.parentMenuCode=='status'" >
        <a href="#" id="onlineDeviceStatusButton" v-if="this.$store.state.parentMenuCode=='status'" v-on:click="goToFromLeftSide('onlineDeviceStatus')">在线设备</a>
        <br v-if="this.$store.state.parentMenuCode=='status'" >
        <a href="#" id="offlineDeviceStatusButton" v-if="this.$store.state.parentMenuCode=='status'" v-on:click="goToFromLeftSide('offLineDeviceStatus')">离线设备</a>
        <br v-if="this.$store.state.parentMenuCode=='status'" >
        <a href="#" id="importDeviceButton" class="firstButtonInLeftSide" v-if="this.$store.state.parentMenuCode=='device'" v-on:click="goToFromLeftSide('importDevice')">设备导入</a>
        <br v-if="this.$store.state.parentMenuCode=='device'" >
        <a href="#" id="bindDeviceButton" class="secondButtonInLeftSide" v-if="this.$store.state.parentMenuCode=='device'" v-on:click="goToFromLeftSide('bindDevice')">设备绑定</a>
    </div>
</template>

<script>
export default {
    methods: {
        goToFromLeftSide(action) {
            if (action == 'allDeviceStatus') {
                console.log(this.parentMenu)
                let menus = {
                    parentMenu: '运行状态',
                    childMenu: '全部设备',
                    parentMenuCode: 'status'
                }
                this.$store.commit('updateMenu',menus)

                let subAction = {subAction: 'allDeviceStatus'}
                this.$store.commit('updateSubAction',subAction)

                this.$router.push("/allDeviceStatus");
            }

            if (action == 'onlineDeviceStatus') {
                let menus = {
                    parentMenu: '运行状态',
                    childMenu: '全部设备',
                    parentMenuCode: 'status'
                }
                this.$store.commit('updateMenu',menus)

                let subAction = {subAction: 'onlineDeviceStatus'}
                this.$store.commit('updateSubAction',subAction)
                this.$router.push("/onlineDeviceStatus");
            }

            if (action == 'offLineDeviceStatus') {
                let menus = {
                    parentMenu: '运行状态',
                    childMenu: '离线设备',
                    parentMenuCode: 'status'
                }
                this.$store.commit('updateMenu',menus)

                let subAction = {subAction: 'offLineDeviceStatus'}
                this.$store.commit('updateSubAction',subAction)

                this.$router.push("/offLineDeviceStatus");
            }

            if (action == 'importDevice') {
                let menus = {
                    parentMenu: '设备管理',
                    childMenu: '设备导入',
                    parentMenuCode: 'device'
                }
                this.$store.commit('updateMenu',menus)

                let subAction = {subAction: 'importDevice'}
                this.$store.commit('updateSubAction',subAction)

                this.$router.push("/importDevice");
            }

            if (action == 'bindDevice') {
                let menus = {
                    parentMenu: '设备管理',
                    childMenu: '设备绑定',
                    parentMenuCode: 'device'
                }
                this.$store.commit('updateMenu',menus)

                let subAction = {subAction: 'bindDevice'}
                this.$store.commit('updateSubAction',subAction)

                this.$router.push("/importDevice");
            }
        }
    }
}
</script>

<style>
    @import '../assets/kx-iot.css'
</style>