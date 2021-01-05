<template>
    <div id="mainDiv">
        <leftSide-view></leftSide-view>
        <div id="mainBlankDiv"></div>
        <div id="mainDataDiv">
            <div class="oneLineSearchDiv">
                <table class="searchFormTable">
                    <tr>
                        <td align="right" width="50px">角色</td>
                        <td align="left" width="200px">
                            <select v-model="searchForm.roleId" class="searchSelect" @change="getAccountList">
                                <option value="">请选择</option>
                                <option :value="item.id" v-for="item in roleList" v-bind:key="item">{{item.roleName}}
                                </option>
                            </select>
                        </td>

                        <td align="right" width="80px">每页显示数</td>
                        <td align="left" width="200px">
                            <select v-model="searchForm.pageSize" placeholder="请选择" class="searchSelect" @change="handleOnPageSizeChange">
                                <option :value="item.value" v-for="item in pageSizeOptions" v-bind:key="item">
                                    {{item.label}}
                                </option>
                            </select>
                        </td>
                        <td align="center" width="300px">
                            <el-button size="mini" type="primary" @click="find">查询</el-button>
                            <el-button size="mini" type="primary" @click="openAddRoleResourcePop">新增</el-button>
                        </td>
                    </tr>

                </table>
            </div>

            <div class="oneLineSearchOutListDiv">
                <table width="100%" class="listTable">
                    <tr>
                        <th width="50px" align="center">No.</th>
                        <th width="200px">资源名称</th>
                        <th align="left">更多操作</th>
                    </tr>
                    <tr v-for="item in roleResourceList" v-bind:key="item">
                        <td align="center">{{item.id}}</td>
                        <td>{{item.resourceName}}</td>
                        <td align="left">
                            <a href="#" v-on:click="deleteRoleResource(item)">删除</a>
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

            <div id="addRoleResourceDiv">
                <table class="inputFormTable">
                    <tr>
                        <td colspan="2" align="center">新增角色权限</td>
                    </tr>
                    <tr>
                        <td width="100px" align="right">角色:</td>
                        <td>
                            <select v-model="addRoleResourceForm.roleId" class="searchSelect">
                                <option value="">请选择</option>
                                <option :value="item.id" v-for="item in roleList" v-bind:key="item">{{item.roleName}}
                                </option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td width="100px" align="right">资源:</td>
                        <td>
                            <select v-model="addRoleResourceForm.resourceId" class="searchSelect">
                                <option value="">请选择</option>
                                <option :value="item.id" v-for="item in resourceList" v-bind:key="item">{{item.resourceName}}
                                </option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" align="center">
                            <button v-on:click="saveRoleResource">确定</button>
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
import { getRoleResource } from '@/api/admin'
import { getResource } from '@/api/admin'
import { saveRoleResource } from '@/api/admin'
import { deleteRoleResource } from '@/api/admin'
import { checkRolePermission } from '@/api/admin'

export default {

    data () {
        return {
            currentPage: 1,
            total: 0,

            roleResourceList: [],
            roleList: [],
            resourceList: [],

            searchForm: {
                roleId: '',
                pageSize: 20
            },

            addRoleResourceForm: {
                id: '',
                roleId: '',
                resourceId: ''
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
            childMenu: '角色权限',
            parentMenuCode: 'permission'
        }
        this.$store.commit('updateMenu',menus)
        this.checkRolePermission()
    },

    methods: {

        checkRolePermission(){
            checkRolePermission().then(
                response => {
                    if (response.data.statusCode.code == 403){
                        this.$router.push("/noPermission");
                    }else {
                        this.getAllRoleList()
                    }
                }
            )
        },

        getAllRoleList() {
            let params = {
                roleName: '',
                pageNum: 1,
                counts: 1000
            }
            getRole(params).then(
                response => {
                    this.roleList = response.data.data
                }
            )
        },

        find() {
            if (this.searchForm.roleId == '') {
                this.$message(
                {
                    type:"error",
                    message:"请选择角色"
                })
                return;
            }
            let params = {
                roleId: this.searchForm.roleId,
                counts: this.searchForm.pageSize,
                pageNum: this.currentPage
            }

            if (this.searchForm.accountId == '') {
                this.$message(
                {
                    type:"error",
                    message:"请选择账户"
                })
                return;
            }

            getRoleResource(params).then(
                response => {
                    if (response.data.statusCode.code == 200) {
                        this.roleResourceList = response.data.data
                        this.total = response.data.paging.total
                        this.currentPage = response.data.paging.pageNo
                    }else if (response.data.statusCode.code == 403) {
                        this.$router.push("/noPermission");
                    }
                }
            )

        },

        openAddRoleResourcePop(){
            hideBg()
            displayPop('addRoleResourceDiv')
            this.getAllResourceList()
            this.isAddFlag = 1
            this.addRoleResourceForm.id = ''
            this.addRoleResourceForm.resourceId = ''
            this.addRoleResourceForm.roleId = ''
        },

        closeAdd(){
            hidePop('addRoleResourceDiv')
            activeBg()
            this.isAddFlag = 0

        },

        handleCurrentChange(val) {
            this.currentPage = val
            this.find()
        },

        getAllResourceList() {
            let params = {
                resourceName: '',
                counts: 1000,
                pageNum: 1
            }

            getResource(params).then(
                response => {
                    this.resourceList = response.data.data
                }
            )
        },

        saveRoleResource(){
            let params = [{
                resourceId: this.addRoleResourceForm.resourceId,
                roleId: this.addRoleResourceForm.roleId
            }]
            saveRoleResource(params).then(
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
        },

        deleteRoleResource(item){
            let params = {
                id: item.id
            }
            deleteRoleResource(params).then(
                response => {
                    if (response.data.statusCode.code == 200) {
                        this.$message(
                        {
                            type:"success",
                            message:response.data.statusCode.message
                        })
                        this.find()
                    }else {
                        this.$message(
                        {
                            type:"error",
                            message:response.data.statusCode.message
                        })
                    }
                }
            )
        },

        handleOnPageSizeChange(){
            this.currentPage = 1
            this.find()
        }
    }
}

</script>