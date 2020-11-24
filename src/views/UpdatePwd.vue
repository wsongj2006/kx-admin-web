<template>
    <div id="mainDiv">
        <leftSide-view></leftSide-view>
        <div id="mainBlankDiv"></div>
        <div id="mainDataDiv">
            <div id="updatePwdDiv">
                <table class="inputFormTable">
                    <tr>
                        <td width="100px" align="right">原密码:</td>
                        <td>
                            <input type="password" v-model="updatePwdForm.originPwd">
                        </td>
                    </tr>

                    <tr>
                        <td width="100px" align="right">新密码:</td>
                        <td>
                            <input type="password" v-model="updatePwdForm.newPwd">
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" align="center">
                            <button v-on:click="updatePwd">确定</button>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import { updatePwd } from '@/api/admin'

export default {

    data () {
        return {
            updatePwdForm: {
                originPwd: '',
                newPwd: ''
            }
        }

    },

    created() {

        let menus = {
            parentMenu: '系统设置',
            childMenu: '修改密码',
            parentMenuCode: 'setup'
        }
        this.$store.commit('updateMenu',menus)
    },

    methods: {
        updatePwd() {
            let params = {
                id: localStorage.getItem("userId"),
                originPassword: this.updatePwdForm.originPwd,
                newPassword: this.updatePwdForm.newPwd
            }
            updatePwd(params).then(
                response => {
                    if (response.data.statusCode.code == 200) {
                        this.$message(
                        {
                            type:"success",
                            message:'密码修改成功'
                        })
                    }else {
                        this.$message(
                        {
                            type:"error",
                            message:response.data.statusCode.message
                        })
                    }
                }
            )
        }
    }

}
</script>