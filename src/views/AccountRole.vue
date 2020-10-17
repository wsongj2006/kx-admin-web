<template>
    <div id="mainDiv">
        <leftSide-view></leftSide-view>
        <div id="mainBlankDiv"></div>
        <div id="mainDataDiv">
            <div class="oneLineSearchDiv">
                <table class="searchFormTable">
                    <tr>
                        <td align="right" width="50px">用户</td>
                        <td align="left" width="200px">
                            <select v-model="searchForm.customerId" class="searchSelect" @change="getAccountList">
                                <option value="">请选择</option>
                                <option :value="item.id" v-for="item in customerList" v-bind:key="item">{{item.name}}
                                </option>
                            </select>
                        </td>

                        <td align="right" width="50px">账户</td>
                        <td align="left" width="200px">
                            <select v-model="searchForm.accountId" class="searchSelect">
                                <option value="">请选择</option>
                                <option :value="item.id" v-for="item in accountList" v-bind:key="item">{{item.userName}}
                                </option>
                            </select>
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
                            <el-button size="mini" type="primary" @click="openAddAccountRolePop">新增</el-button>
                        </td>
                    </tr>

                </table>
            </div>

            <div class="oneLineSearchOutListDiv">
                <table width="100%" class="listTable">
                    <tr>
                        <th width="50px" align="center">No.</th>
                        <th width="200px">角色名称</th>
                        <th align="left">更多操作</th>
                    </tr>
                    <tr v-for="item in accountRoleList" v-bind:key="item">
                        <td align="center">{{item.id}}</td>
                        <td>{{item.roleName}}</td>
                        <td align="left">
                            <a href="#" v-on:click="deleteAccountRole(item)">删除</a>
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

            <div id="addAccountRoleDiv">
                <table class="inputFormTable">
                    <tr>
                        <td colspan="2" align="center">新增账户角色</td>
                    </tr>
                    <tr>
                        <td width="100px" align="right">用户:</td>
                        <td>
                            <select v-model="addAccountRoleForm.customerId" class="searchSelect" @change="getAccountListForAdd">
                                <option value="">请选择</option>
                                <option :value="item.id" v-for="item in customerList" v-bind:key="item">{{item.name}}
                                </option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td width="100px" align="right">账户:</td>
                        <td>
                            <select v-model="addAccountRoleForm.accountId" class="searchSelect">
                                <option value="">请选择</option>
                                <option :value="item.id" v-for="item in accountListForAdd" v-bind:key="item">{{item.userName}}
                                </option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td width="100px" align="right">角色:</td>
                        <td>
                            <select v-model="addAccountRoleForm.roleId" class="searchSelect">
                                <option value="">请选择</option>
                                <option :value="item.id" v-for="item in roleList" v-bind:key="item">{{item.roleName}}
                                </option>
                            </select>
                        </td>
                    </tr>

                    <tr>
                        <td colspan="2" align="center">
                            <button v-on:click="saveAccount">确定</button>
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
import { getAccountList } from '@/api/admin'
import { getCustomer } from '@/api/admin'

import { getAccountRole } from '@/api/admin'
import { getRole } from '@/api/admin'
import { saveAccountRole } from '@/api/admin'
import { deleteAccountRole } from '@/api/admin'
import { checkAccountRole } from '@/api/admin'

export default {

    data () {
        return {
            currentPage: 1,
            total: 0,

            accountRoleList: [],
            customerList: [],
            accountList: [],
            accountListForAdd: [],
            roleList: [],

            searchForm: {
                customerId: '',
                accountId: '',
                pageSize: 20
            },

            addAccountRoleForm: {
                id: '',
                customerId: '',
                accountId: '',
                roleId: ''
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
            childMenu: '账户角色',
            parentMenuCode: 'permission'
        }
        this.$store.commit('updateMenu',menus)
        this.checkAccountRole()
    },

    methods: {

        checkAccountRole(){
            checkAccountRole().then(
                response => {
                    if (response.data.statusCode.code == 403) {
                        this.$router.push("/noPermission");
                    }else {
                        this.getCustomerList()
                    }
                }
            )
        },

        getCustomerList() {
            let params = {
                customerName: '',
                pageNum: 1,
                counts: 1000
            }
            getCustomer(params).then(
                response => {
                    this.customerList = response.data.data
                }
            )
        },

        getAccountList() {
            let params = {
                customerId: this.searchForm.customerId,
                accountName: '',
                pageNum: 1,
                counts: 1000
            }
            getAccountList(params).then(
                response => {
                    this.accountList = response.data.data
                }
            )
        },

        getAccountListForAdd() {
            let params = {
                customerId: this.searchForm.customerId,
                accountName: '',
                pageNum: 1,
                counts: 1000
            }
            getAccountList(params).then(
                response => {
                    this.accountListForAdd = response.data.data
                }
            )
        },

        find() {
            let params = {
                accountId: this.searchForm.accountId,
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

            getAccountRole(params).then(
                response => {
                    if (response.data.statusCode.code == 200) {
                        this.accountRoleList = response.data.data
                        this.total = response.data.paging.total
                        this.currentPage = response.data.paging.pageNo
                    }else if (response.data.statusCode.code == 403) {
                        this.$router.push("/noPermission");
                    }
                }
            )

        },

        openAddAccountRolePop(){
            hideBg()
            displayPop('addAccountRoleDiv')
            this.getAllRoleList()
            this.isAddFlag = 1
            this.addResourceForm.id = ''
            this.addResourceForm.customerId = ''
            this.addResourceForm.accountId = ''
            this.addResourceForm.roleId = ''
        },

        openModifyAccountRole(item) {
            hideBg()
            displayPop('addAccountRoleDiv')
            this.isAddFlag = 0

        },

        closeAdd(){
            hidePop('addAccountRoleDiv')
            activeBg()
            this.isAddFlag = 0

        },

        handleCurrentChange(val) {
            this.currentPage = val
            this.find()
        },

        getAllRoleList() {
            let params = {
                roleName: '',
                counts: 1000,
                pageNum: 1
            }

            getRole(params).then(
                response => {
                    this.roleList = response.data.data
                }
            )
        },

        saveAccount(){
            let params = [{
                userId: this.addAccountRoleForm.accountId,
                roleId: this.addAccountRoleForm.roleId
            }]
            saveAccountRole(params).then(
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

        deleteAccountRole(item){
            let params = {
                id: item.id
            }
            deleteAccountRole(params).then(
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
        }
    }
}
</script>