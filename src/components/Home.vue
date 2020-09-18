<template>
    <div id="homeRootDiv">
        <headerNavi-view></headerNavi-view>

        <middle-view :parentMenu="parentMenu" :childMenu="childMenu"></middle-view>

        <router-view/>

        <bottom-view></bottom-view>
    </div>
</template>

<script>
export default {
    name: 'Home',
    data () {
        return {
          parentMenu: '运行状态',
          childMenu: '全部设备'
        }
    },

    created(){

    },

    methods: {

    }
}


</script>

<style>
    @import '../assets/kx-iot.css'
</style>