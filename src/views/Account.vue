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
                            <select v-model="searchForm.customerId" class="searchSelect">
                                <option value="">请选择</option>
                                <option :value="item.id" v-for="item in customerList" v-bind:key="item">{{item.name}}
                                </option>
                            </select>
                        </td>

                        <td align="right" width="60px">账号名称</td>
                        <td align="left" width="200px">
                            <input type="text" v-model="searchForm.accountName" placeholder="" class="searchInput">
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
                            <el-button size="mini" type="primary" @click="openAddAccountPop">新增</el-button>
                        </td>
                    </tr>

                </table>
            </div>

            <div class="oneLineSearchOutListDiv">
                <table width="100%" class="listTable">
                    <tr>
                        <th width="50px" align="center">No.</th>
                        <th width="100px">用户</th>
                        <th width="100px" align="center">账户名</th>
                        <th width="100px" align="center">联系电话</th>
                        <th width="100px" align="center">真实姓名</th>
                        <th width="100px" align="center">更多操作</th>
                    </tr>
                    <tr v-for="item in accountList" v-bind:key="item">
                        <td align="center">{{item.id}}</td>
                        <td>{{getCustomerName(item.customerId)}}</td>
                        <td align="center">{{item.userName}}</td>
                        <td align="center">{{item.phone}}</td>
                        <td align="center">{{item.realName}}</td>
                        <td align="center">
                            <a href="#"  v-on:click="openModifyAccountPop(item)">修改</a>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <a href="#" >删除</a>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <a href="#" v-on:click="resetPassword(item)">密码重置</a>

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

            <div id="modifyAccountDiv">
                <input type="hidden" v-model="modifyAccountForm.id">
                <table class="inputFormTable">
                    <tr>
                        <td colspan="2" align="center">账户信息修改</td>
                    </tr>
                    <tr>
                        <td width="100px" align="right">账户名:</td>
                        <td>
                            <input type="text" v-model="modifyAccountForm.accountName">
                        </td>
                    </tr>
                    <tr>
                        <td align="right">电话:</td>
                        <td>
                            <input type="text" v-model="modifyAccountForm.phone">
                        </td>
                    </tr>
                    <tr>
                        <td align="right">真实姓名:</td>
                        <td>
                            <input type="text" v-model="modifyAccountForm.realName">
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" align="center">
                            <button v-on:click="saveAccountModification">确定</button>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <button v-on:click="closeModify">取消</button>
                        </td>
                    </tr>
                </table>
            </div>

            <div id="addAccountDiv">
                <table class="inputFormTable">
                    <tr>
                        <td colspan="2" align="center">新增账户</td>
                    </tr>
                    <tr>
                        <td width="100px" align="right">用户:</td>
                        <td>
                            <select v-model="addAccountForm.customerId" class="searchSelect">
                                <option value="">请选择</option>
                                <option :value="item.id" v-for="item in customerList" v-bind:key="item">{{item.name}}
                                </option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td width="100px" align="right">账户名:</td>
                        <td>
                            <input type="text" v-model="addAccountForm.accountName">
                        </td>
                    </tr>
                    <tr>
                        <td align="right">电话:</td>
                        <td>
                            <input type="text" v-model="addAccountForm.phone">
                        </td>
                    </tr>
                    <tr>
                        <td align="right">真实姓名:</td>
                        <td>
                            <input type="text" v-model="addAccountForm.realName">
                        </td>
                    </tr>
                    <tr>
                        <td align="right">Email:</td>
                        <td>
                            <input type="text" v-model="addAccountForm.email">
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" align="center">
                            <button v-on:click="addAccount">确定</button>
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
import { getAccountList } from '@/api/admin'
import { getCustomer } from '@/api/admin'
import { hideBg } from '@/util/util'
import { activeBg } from '@/util/util'
import { displayPop } from '@/util/util'
import { hidePop } from '@/util/util'
import { updateAccount } from '@/api/admin'
import { addAccount } from '@/api/admin'
import { resetPwd } from '@/api/admin'
import { checkAccount } from '@/api/admin'


export default {

    data () {
        return {
            searchForm: {
                customerId: '',
                accountName: '',
                pageSize: 20
            },

            customerList: [],

            accountList: [],

            currentPage: 1,
            total: 0,

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

            addAccountForm: {
                customerId: '',
                accountName: '',
                phone: '',
                realName: '',
                email: ''
            },

            modifyAccountForm: {
                id: '',
                accountName: '',
                phone: '',
                realName: ''
            }
        }

    },

    created() {

        let menus = {
            parentMenu: '系统设置',
            childMenu: '账号管理',
            parentMenuCode: 'setup'
        }
        this.$store.commit('updateMenu',menus)
        this.checkAccount()
    },

    methods: {

        checkAccount(){
            checkAccount().then(
                response => {
                    if (response.data.statusCode.code == 403) {
                        this.$router.push("/noPermission");
                    }else {
                        this.getCustomerList()
                        this.find()
                    }
                }
            )
        },

        find() {
            let params = {
                customerId: this.searchForm.customerId,
                accountName: this.searchForm.accountName,
                pageNum: this.currentPage,
                counts: this.searchForm.pageSize
            }
            getAccountList(params).then(
                response => {
                    this.accountList = response.data.data
                    this.total = response.data.paging.total
                    this.currentPage = response.data.paging.pageNo
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

        handleCurrentChange(val){
            this.currentPage = val
            this.find()
        },

        getCustomerName(customerId) {
            for (let i = 0; i < this.customerList.length; i++) {
                if(this.customerList[i].id == customerId) {
                    return this.customerList[i].name
                }
            }
        },

        openModifyAccountPop(item) {
            hideBg()
            displayPop('modifyAccountDiv')
            this.modifyAccountForm.id=item.id
            this.modifyAccountForm.accountName=item.userName
            this.modifyAccountForm.phone=item.phone
            this.modifyAccountForm.realName=item.realName
        },

        saveAccountModification(){
            let params = {
                id: this.modifyAccountForm.id,
                userName: this.modifyAccountForm.accountName,
                phone: this.modifyAccountForm.phone,
                realName: this.modifyAccountForm.realName
            }
            updateAccount(params).then(
                response => {
                    if (response.data.statusCode.code == 200) {
                        this.$message(
                        {
                            type:"success",
                            message:response.data.statusCode.message
                        })
                        this.find()
                        this.closeModify()
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

        closeModify(){
            hidePop('modifyAccountDiv')
            activeBg()
            this.modifyAccountForm.id=''
            this.modifyAccountForm.accountName=''
            this.modifyAccountForm.phone=''
            this.modifyAccountForm.realName=''
        },

        openAddAccountPop(item) {
            hideBg()
            displayPop('addAccountDiv')
            this.addAccountForm.email=''
            this.addAccountForm.accountName=''
            this.addAccountForm.phone=''
            this.addAccountForm.realName=''
            this.addAccountForm.customerId=this.searchForm.customerId
        },

        closeAdd() {
            hidePop('addAccountDiv')
            activeBg()
            this.addAccountForm.email=''
            this.addAccountForm.accountName=''
            this.addAccountForm.phone=''
            this.addAccountForm.realName=''
            this.addAccountForm.customerId=''
        },

        addAccount() {
            if (this.addAccountForm.customerId == '') {
                this.$message(
                {
                    type:"error",
                    message:"用户不能为空"
                })
                return
            }
            if (this.addAccountForm.accountName == '') {
                this.$message(
                {
                    type:"error",
                    message:"账户名不能为空"
                })
                return
            }
            let params = {
                userName: this.addAccountForm.accountName,
                realName: this.addAccountForm.realName,
                customerId: this.addAccountForm.customerId,
                email: this.addAccountForm.email,
                phone: this.addAccountForm.phone
            }
            addAccount(params).then(
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

        resetPassword(item){
            let params = {
                id: item.id
            }
            resetPwd(params).then(
                response => {
                    if (response.data.statusCode.code == 200) {
                        this.$message(
                        {
                            type:"success",
                            message:'密码已重置为888888'
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

<style>
    @import '../assets/kx-iot.css'

</style>