<template>
    <div id="mainDiv">
        <leftSide-view></leftSide-view>
        <div id="mainBlankDiv"></div>
        <div id="mainDataDiv">
            <div class="oneLineSearchDiv">
                <table class="searchFormTable">
                    <tr>
                        <td align="right" width="60px">角色名称</td>
                        <td align="left" width="200px">
                            <input type="text" v-model="searchForm.roleName" placeholder="" class="searchInput">
                        </td>
                        <td align="right" width="80px">每页显示数</td>
                        <td align="left" width="200px">
                            <select v-model="searchForm.pageSize" placeholder="请选择" class="searchSelect">
                                <option :value="item.value" v-for="item in pageSizeOptions" v-bind:key="item">
                                    {{item.label}}
                                </option>
                            </select>
                        </td>
                        <td align="center" width="300px">
                            <el-button size="mini" type="primary" @click="find">查询</el-button>
                            <el-button size="mini" type="primary" @click="openAddRolePop">新增</el-button>
                        </td>
                    </tr>

                </table>
            </div>

            <div class="oneLineSearchOutListDiv">
                <table width="100%" class="listTable">
                    <tr>
                        <th width="50px" align="center">No.</th>
                        <th width="100px">角色名称</th>
                        <th width="100px">描述</th>
                        <th width="100px" align="center">更多操作</th>
                    </tr>
                    <tr v-for="item in roleList" v-bind:key="item">
                        <td align="center">{{item.id}}</td>
                        <td>{{item.roleName}}</td>
                        <td>{{item.description}}</td>
                        <td align="center">
                            <a href="#"  v-on:click="openModifyRole(item)">修改</a>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <a href="#" v-on:click="deleteRole(item)">>删除</a>
                        </td>
                    </tr>

                </table>
            </div>

            <div id="pageDiv">
                <el-pagination
                        small="true"
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-size="searchForm.pageSize"
                        layout="total, prev, pager, next"
                        :total="total">
                </el-pagination>
            </div>

            <div id="addRoleDiv">
                <input type="hidden" v-model="addRoleForm.id">
                <table class="inputFormTable">
                    <tr>
                        <td colspan="2" align="center">新增角色</td>
                    </tr>

                    <tr>
                        <td width="100px" align="right">角色名称:</td>
                        <td>
                            <input type="text" v-model="addRoleForm.roleName">
                        </td>
                    </tr>
                    <tr>
                        <td width="100px" align="right">描述:</td>
                        <td>
                            <input type="text" v-model="addRoleForm.description">
                        </td>
                    </tr>

                    <tr>
                        <td colspan="2" align="center">
                            <button v-on:click="saveRole">确定</button>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <button v-on:click="closeAdd">取消</button>
                        </td>
                    </tr>
                </table>
            </div>

        </div>
    </div>
</template>

<script>

import { hideBg } from '@/util/util'
import { activeBg } from '@/util/util'
import { displayPop } from '@/util/util'
import { hidePop } from '@/util/util'
import { getRole } from '@/api/admin'
import { deleteRole } from '@/api/admin'
import { saveRole } from '@/api/admin'
import { updateRole } from '@/api/admin'

export default {

    data () {
        return {
            currentPage: 1,
            total: 0,

            roleList: [],

            searchForm: {
                roleName: '',
                pageSize: 20
            },

            addRoleForm: {
                id: '',
                roleName: ''
            },

            pageSizeOptions: [
                {value: 2, label: '2'},
                {value: 10, label: '10'},
                {value: 15, label: '15'},
                {value: 20, label: '20'},
                {value: 25, label: '25'},
                {value: 30, label: '30'},
                {value: 35, label: '35'},
                {value: 40, label: '40'},
                {value: 45, label: '45'},
                {value: 50, label: '50'},
                {value: 55, label: '55'},
                {value: 60, label: '60'},
                {value: 65, label: '65'},
                {value: 70, label: '70'},
                {value: 75, label: '75'},
                {value: 80, label: '80'},
            ],

            isAddFlag: 0

        }

    },
    created() {

        let menus = {
            parentMenu: '权限管理',
            childMenu: '角色管理',
            parentMenuCode: 'permission'
        }
        this.$store.commit('updateMenu',menus)

        this.find()
    },

    methods: {
        find() {
            let params = {
                roleName: this.searchForm.roleName,
                counts: this.searchForm.pageSize,
                pageNum: this.currentPage
            }

            getRole(params).then(
                response => {
                    if (response.data.statusCode.code == 200){
                        this.roleList = response.data.data
                        this.total = response.data.paging.total
                        this.currentPage = response.data.paging.pageNo
                    }else if (response.data.statusCode.code == 403) {
                        this.$router.push("/noPermission");
                    }
                }
            )
        },

        openAddRolePop(){
            this.isAddFlag = 1
            hideBg()
            displayPop('addRoleDiv')
            this.addRoleForm.id = ''
            this.addRoleForm.roleName = ''
            this.addRoleForm.description = ''
        },

        handleCurrentChange(val) {
            this.currentPage = val
            this.find()
        },

        saveRole(){
            let params = {
                id: this.addRoleForm.id,
                roleName: this.addRoleForm.roleName,
                description: this.addRoleForm.description
            }
            if (this.isAddFlag == 1) {
                saveRole(params).then(
                    response => {
                        if (response.data.statusCode.code == 200) {
                            this.$message(
                            {
                                type:"success",
                                message:response.data.statusCode.message
                            })
                            this.find()
                            this.closeAdd()
                        }else {
                            this.$message(
                            {
                                type:"error",
                                message:response.data.statusCode.message
                            })
                        }
                    }
                )
            }else {
                updateRole(params).then(
                    response => {
                        if (response.data.statusCode.code == 200) {
                            this.$message(
                            {
                                type:"success",
                                message:response.data.statusCode.message
                            })
                            this.find()
                            this.closeAdd()
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
        },

        closeAdd(){
            hidePop('addRoleDiv')
            activeBg()
            this.addRoleForm.id = ''
            this.addRoleForm.roleName = ''
            this.addRoleForm.description = ''
        },

        openModifyRole(item) {
            this.isAddFlag = 0
            hideBg()
            displayPop('addRoleDiv')
            this.addRoleForm.id = item.id
            this.addRoleForm.roleName = item.roleName
            this.addRoleForm.description = item.description
        },

        deleteRole(item) {
            let params = {
                id: item.id
            }
            deleteRole(params).then(
                response => {
                    if (response.data.statusCode.code == 200) {
                            this.$message(
                            {
                                type:"success",
                                message:response.data.statusCode.message
                            })
                            this.find()
                            this.closeAdd()
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