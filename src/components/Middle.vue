<template>
    <div id="middleDiv">
        <div id="naviInfoDiv">
            <p id="naviInfoFont">---- 导航栏 ----</p>
        </div>
        <div id="naviBlankDiv"></div>

        <div id="naviTitleDiv">
            <p id="naviTitleFont">{{this.$store.state.parentMenu}} -> {{this.$store.state.childMenu}}</p>
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

        props: [
            'parentMenu',
            'childMenu'
        ],

        methods: {

        }
    }
</script>

<style>
    @import '../assets/kx-iot.css'
</style>