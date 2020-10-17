<template>
    <div id="mainDiv">
        <leftSide-view></leftSide-view>
        <div id="mainBlankDiv"></div>
        <div id="mainDataDiv">
            <div class="oneLineSearchDiv">
                <table class="searchFormTable">
                    <tr>
                        <td align="right" width="60px">用户名</td>
                        <td align="left" width="200px">
                            <input type="text" v-model="searchForm.customerName" placeholder="" class="searchInput">
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
                            <el-button size="mini" type="primary" @click="openAddCustomerPop">新增</el-button>
                        </td>
                    </tr>

                </table>
            </div>
            <div class="oneLineSearchOutListDiv">
                <table width="100%" class="listTable">
                    <tr>
                        <th width="50px" align="center">No.</th>
                        <th width="100px">用户</th>
                        <th width="100px" align="center">联系人</th>
                        <th width="100px" align="center">联系电话</th>
                        <th width="60px" align="center">设备数量</th>
                        <th width="100px" align="center">营业执照</th>
                        <th width="100px" align="center">更多操作</th>
                    </tr>
                    <tr v-for="item in customerList" v-bind:key="item">
                        <td align="center">{{item.id}}</td>
                        <td>{{item.name}}</td>
                        <td align="center">{{item.contacts}}</td>
                        <td align="center">{{item.phone}}</td>
                        <td align="center">{{item.maxDevices}}</td>
                        <td align="center">{{item.license}}</td>
                        <td align="center">
                            <a href="#"  v-on:click="openModifyCustomerPop(item)">修改</a>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <a href="#" >删除</a>
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

            <div id="addCustomerDiv">
                <input type="hidden" v-model="addCustomerForm.id">
                <table class="inputFormTable">
                    <tr>
                        <td colspan="2" align="center">新增用户</td>
                    </tr>

                    <tr>
                        <td width="100px" align="right">用户名:</td>
                        <td>
                            <input type="text" v-model="addCustomerForm.customerName">
                        </td>
                    </tr>
                    <tr>
                        <td width="100px" align="right">联系人:</td>
                        <td>
                            <input type="text" v-model="addCustomerForm.contacts">
                        </td>
                    </tr>
                    <tr>
                        <td align="right">电话:</td>
                        <td>
                            <input type="text" v-model="addCustomerForm.phone">
                        </td>
                    </tr>
                    <tr>
                        <td align="right">营业执照:</td>
                        <td>
                            <input type="text" v-model="addCustomerForm.license">
                        </td>
                    </tr>
                    <tr>
                        <td align="right">地址:</td>
                        <td>
                            <input type="text" v-model="addCustomerForm.address">
                        </td>
                    </tr>
                    <tr>
                        <td width="100px" align="right">设备数量:</td>
                        <td>
                            <input type="text" v-model="addCustomerForm.maxDevices">
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" align="center">
                            <button v-on:click="saveCustomer">确定</button>
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
import { getCustomer } from '@/api/admin'
import { addCustomer } from '@/api/admin'
import { updateCustomer } from '@/api/admin'
import { checkAccessible } from '@/api/admin'

export default {

    data () {
        return {
            searchForm: {
                customerName: '',
                pageSize: 20
            },
            addCustomerForm: {
                id: '',
                customerName: '',
                contacts: '',
                phone: '',
                license: '',
                address: '',
                maxDevices: ''
            },

            customerList: [],
            currentPage: 1,
            total: 0,

            isAddFlag: '0',

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
            ]
        }

    },

    created() {

        let menus = {
            parentMenu: '系统设置',
            childMenu: '用户管理',
            parentMenuCode: 'setup'
        }
        this.$store.commit('updateMenu',menus)
        this.checkAccessible()
    },

    methods: {

        checkAccessible(){
            checkAccessible('customer').then(
                response => {
                    if (response.data.statusCode.code == 403) {
                        this.$router.push("/noPermission");
                    }else {
                        this.find()
                    }
                }
            )
        },

        find() {
            let params = {
                customerName: this.searchForm.customerName,
                pageNum: this.currentPage,
                counts: this.searchForm.pageSize
            }
            getCustomer(params).then(
                response => {
                    this.customerList = response.data.data
                    this.total = response.data.paging.total
                    this.currentPage = response.data.paging.pageNo
                }
            )
        },

        openAddCustomerPop() {
            hideBg()
            displayPop('addCustomerDiv')
            this.isAddFlag = 1
            this.addCustomerForm.id=''
            this.addCustomerForm.address=''
            this.addCustomerForm.contacts=''
            this.addCustomerForm.license=''
            this.addCustomerForm.maxDevices=''
            this.addCustomerForm.customerName=''
            this.addCustomerForm.phone=''
        },

        closeAdd(){
            hidePop('addCustomerDiv')
            activeBg()
            this.isAddFlag = 0
            this.addCustomerForm.id=''
            this.addCustomerForm.address=''
            this.addCustomerForm.contacts=''
            this.addCustomerForm.license=''
            this.addCustomerForm.maxDevices=''
            this.addCustomerForm.customerName=''
            this.addCustomerForm.phone=''
        },

        saveCustomer() {
            let params = {
                id: this.addCustomerForm.id,
                address: this.addCustomerForm.address,
                contacts: this.addCustomerForm.contacts,
                license: this.addCustomerForm.license,
                maxDevices: this.addCustomerForm.maxDevices,
                name: this.addCustomerForm.customerName,
                phone: this.addCustomerForm.phone
            }
            if (this.isAddFlag == 1) {
                addCustomer(params).then(
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
                updateCustomer(params).then(
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

        openModifyCustomerPop(item) {
            hideBg()
            displayPop('addCustomerDiv')
            this.isAddFlag = 0
            this.addCustomerForm.id=item.id
            this.addCustomerForm.address=item.address
            this.addCustomerForm.contacts=item.contacts
            this.addCustomerForm.license=item.license
            this.addCustomerForm.maxDevices=item.maxDevices
            this.addCustomerForm.customerName=item.name
            this.addCustomerForm.phone=item.phone
        },

        handleCurrentChange(val) {
            this.currentPage = val
            this.find()
        }

    }
}

</script>

<style>
    @import '../assets/kx-iot.css'
</style>