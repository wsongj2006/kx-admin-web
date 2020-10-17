<template>
    <div id="leftSideDiv">
        <a href="#" class="firstButtonInLeftSide" v-if="this.$store.state.parentMenuCode=='status'" v-on:click="goToFromLeftSide('allDeviceStatus')">全部设备</a>
        <br v-if="this.$store.state.parentMenuCode=='status'" >
        <a href="#" class="secondButtonInLeftSide" v-if="this.$store.state.parentMenuCode=='status'" v-on:click="goToFromLeftSide('onlineDeviceStatus')">在线设备</a>
        <br v-if="this.$store.state.parentMenuCode=='status'" >
        <a href="#" class="thirdButtonInLeftSide" v-if="this.$store.state.parentMenuCode=='status'" v-on:click="goToFromLeftSide('offLineDeviceStatus')">离线设备</a>
        <br v-if="this.$store.state.parentMenuCode=='status'" >
        <a href="#" class="firstButtonInLeftSide" v-if="this.$store.state.parentMenuCode=='device'" v-on:click="goToFromLeftSide('importDevice')">设备导入</a>
        <br v-if="this.$store.state.parentMenuCode=='device'" >
        <a href="#" class="secondButtonInLeftSide" v-if="this.$store.state.parentMenuCode=='device'" v-on:click="goToFromLeftSide('bindDevice')">设备绑定</a>

        <br v-if="this.$store.state.parentMenuCode=='data'" >
        <a href="#" class="firstButtonInLeftSide" v-if="this.$store.state.parentMenuCode=='data'" v-on:click="goToFromLeftSide('currentUsage')">当前用电</a>

        <br v-if="this.$store.state.parentMenuCode=='data'" >
        <a href="#" class="secondButtonInLeftSide" v-if="this.$store.state.parentMenuCode=='data'" v-on:click="goToFromLeftSide('periodUsage')">时段用电</a>

        <br v-if="this.$store.state.parentMenuCode=='setup'" >
        <a href="#" class="firstButtonInLeftSide" v-if="this.$store.state.parentMenuCode=='setup'" v-on:click="goToFromLeftSide('account')">账户管理</a>

        <br v-if="this.$store.state.parentMenuCode=='setup'" >
        <a href="#" class="secondButtonInLeftSide" v-if="this.$store.state.parentMenuCode=='setup'" v-on:click="goToFromLeftSide('customer')">用户管理</a>

        <br v-if="this.$store.state.parentMenuCode=='setup'" >
        <a href="#" class="thirdButtonInLeftSide" v-if="this.$store.state.parentMenuCode=='setup'" v-on:click="goToFromLeftSide('building')">楼栋管理</a>

        <br v-if="this.$store.state.parentMenuCode=='setup'" >
        <a href="#" class="forthButtonInLeftSide" v-if="this.$store.state.parentMenuCode=='setup'" v-on:click="goToFromLeftSide('section')">区域管理</a>

        <br v-if="this.$store.state.parentMenuCode=='setup'" >
        <a href="#" class="fifthButtonInLeftSide" v-if="this.$store.state.parentMenuCode=='setup'" v-on:click="goToFromLeftSide('password')">修改密码</a>

        <br v-if="this.$store.state.parentMenuCode=='permission'" >
        <a href="#" class="firstButtonInLeftSide" v-if="this.$store.state.parentMenuCode=='permission'" v-on:click="goToFromLeftSide('resource')">资源管理</a>

        <br v-if="this.$store.state.parentMenuCode=='permission'" >
        <a href="#" class="secondButtonInLeftSide" v-if="this.$store.state.parentMenuCode=='permission'" v-on:click="goToFromLeftSide('role')">角色管理</a>

        <br v-if="this.$store.state.parentMenuCode=='permission'" >
        <a href="#" class="thirdButtonInLeftSide" v-if="this.$store.state.parentMenuCode=='permission'" v-on:click="goToFromLeftSide('account_role')">账户角色</a>

        <br v-if="this.$store.state.parentMenuCode=='permission'" >
        <a href="#" class="forthButtonInLeftSide" v-if="this.$store.state.parentMenuCode=='permission'" v-on:click="goToFromLeftSide('role_resource')">角色权限</a>
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

                this.$router.push("/bindDevice");
            }

            if (action == 'currentUsage') {
                let menus = {
                    parentMenu: '数据统计',
                    childMenu: '当前用电',
                    parentMenuCode: 'data'
                }
                this.$store.commit('updateMenu',menus)
                this.$router.push("/currentUsage");
            }

            if (action == 'periodUsage') {
                let menus = {
                    parentMenu: '数据统计',
                    childMenu: '时段用电',
                    parentMenuCode: 'data'
                }
                this.$store.commit('updateMenu',menus)

                this.$router.push("/periodUsage");
            }

            if (action == 'account') {
                let menus = {
                    parentMenu: '系统设置',
                    childMenu: '账户管理',
                    parentMenuCode: 'setup'
                }
                this.$store.commit('updateMenu',menus)

                this.$router.push("/account");
            }

            if (action == 'customer') {
                let menus = {
                    parentMenu: '系统设置',
                    childMenu: '用户管理',
                    parentMenuCode: 'setup'
                }
                this.$store.commit('updateMenu',menus)

                this.$router.push("/customer");
            }

            if (action == 'building') {
                let menus = {
                    parentMenu: '系统设置',
                    childMenu: '楼栋管理',
                    parentMenuCode: 'setup'
                }
                this.$store.commit('updateMenu',menus)

                this.$router.push("/building");
            }

            if (action == 'section') {
                let menus = {
                    parentMenu: '系统设置',
                    childMenu: '区域管理',
                    parentMenuCode: 'setup'
                }
                this.$store.commit('updateMenu',menus)

                this.$router.push("/section");
            }

            if (action == 'password') {
                let menus = {
                    parentMenu: '系统设置',
                    childMenu: '修改密码',
                    parentMenuCode: 'setup'
                }
                this.$store.commit('updateMenu',menus)

                this.$router.push("/updatePwd");
            }

            if (action == 'resource') {
                let menus = {
                    parentMenu: '权限管理',
                    childMenu: '资源管理',
                    parentMenuCode: 'permission'
                }
                this.$store.commit('updateMenu',menus)

                this.$router.push("/resource");
            }

            if (action == 'role') {
                let menus = {
                    parentMenu: '权限管理',
                    childMenu: '角色管理',
                    parentMenuCode: 'permission'
                }
                this.$store.commit('updateMenu',menus)

                this.$router.push("/role");
            }

            if (action == 'account_role') {
                let menus = {
                    parentMenu: '权限管理',
                    childMenu: '账户角色',
                    parentMenuCode: 'permission'
                }
                this.$store.commit('updateMenu',menus)

                this.$router.push("/accountRole");
            }

            if (action == 'role_resource') {
                let menus = {
                    parentMenu: '权限管理',
                    childMenu: '角色权限',
                    parentMenuCode: 'permission'
                }
                this.$store.commit('updateMenu',menus)

                this.$router.push("/roleResource");
            }
        }
    }
}
</script>

<style>
    @import '../assets/kx-iot.css'
</style>