<template>
    <div id="homeRootDiv">
        <headerNavi-view></headerNavi-view>

        <middle-view :parentMenu="parentMenu" :childMenu="childMenu"></middle-view>

        <router-view/>

        <bottom-view></bottom-view>
    </div>
</template>

<script>
import { checkSession } from '@/api/admin'
export default {
    name: 'Home',
    data () {
        return {
          parentMenu: '运行状态',
          childMenu: '全部设备'
        }
    },

    created(){
        this.checkSession()
    },

    methods: {
        checkSession() {
            checkSession().then(
                response => {
                    if (response.data.statusCode.code != 200) {
                        console.log(response.statusCode)
                        this.$router.push("/login");
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