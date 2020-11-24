<template>
    <div id="appRootDiv">
        <router-view/>
        <div id="hidebgDiv">
            <div id="hidebgMsgDiv">
                <p id="hidebgMsgText">指令下发中，请稍后......</p>
            </div>
        </div>
    </div>
</template>

<script>
</script>

<style>
    #appRootDiv{
        height: 100%;
        width: 100%
    }
</style>
