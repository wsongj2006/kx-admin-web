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
                            <select v-model="searchForm.customerId" class="searchSelect"
                                    @change="getAllBuildingForSearchForm">
                                <option :value="item.id" v-for="item in customerList" v-bind:key="item">{{item.name}}
                                </option>
                            </select>
                        </td>

                        <td align="right" width="60px">楼栋名称</td>
                        <td align="left" width="200px">
                            <input type="text" v-model="searchForm.buildingName" placeholder="" class="searchInput">
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
                            <el-button size="mini" type="primary" @click="openAddBuildingPop">新增</el-button>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="oneLineSearchOutListDiv">
                <table width="100%" class="listTable">
                    <tr>
                        <th width="50px" align="center">No.</th>
                        <th width="100px">用户</th>
                        <th width="100px" align="left">楼栋名称</th>
                        <th width="100px" align="center">更多操作</th>
                    </tr>
                    <tr v-for="item in buildingList" v-bind:key="item">
                        <td align="center">{{item.id}}</td>
                        <td>{{getCustomerName(item.customerId)}}</td>
                        <td>{{item.name}}</td>
                        <td align="center">
                            <a href="#"  v-on:click="openModifyBuilding(item)">修改</a>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <a href="#" v-on:click="deleteBuilding(item)">删除</a>
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

            <div id="addBuildingDiv">
                <input type="hidden" v-model="addBuildingForm.id">
                <table class="inputFormTable">
                    <tr>
                        <td colspan="2" align="center">新增楼栋</td>
                    </tr>
                    <tr>
                        <td width="100px" align="right">用户:</td>
                        <td>
                            <select v-model="addBuildingForm.customerId" class="searchSelect">
                                <option value="">请选择</option>
                                <option :value="item.id" v-for="item in customerList" v-bind:key="item">{{item.name}}
                                </option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td width="100px" align="right">楼栋名称:</td>
                        <td>
                            <input type="text" v-model="addBuildingForm.buildingName">
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" align="center">
                            <button v-on:click="saveBuilding">确定</button>
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
import { getBuilding } from '@/api/admin'
import { deleteBuilding } from '@/api/admin'
import { addBuilding } from '@/api/admin'
import { updateBuilding } from '@/api/admin'
import { checkAccessible } from '@/api/admin'
import { getCustomerForUser } from '@/api/admin'

export default {

    data () {
        return {
            currentPage: 1,
            total: 0,

            customerList: [],
            buildingList: [],

            searchForm: {
                customerId: '',
                buildingName: '',
                pageSize: 20
            },

            addBuildingForm: {
                id: '',
                customerId: '',
                buildingName: ''
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
            parentMenu: '系统设置',
            childMenu: '楼栋管理',
            parentMenuCode: 'setup'
        }
        this.$store.commit('updateMenu',menus)

        this.checkAccessible()
    },

     methods: {

        checkAccessible(){
            checkAccessible('building').then(
                response => {
                    if (response.data.statusCode.code == 403) {
                        this.$router.push("/noPermission");
                    }else {
                        this.getAllCustomer()
                        this.find()
                    }
                }
            )
        },

        getAllCustomer(){
            let isSupperAdmin = localStorage.getItem("isSupperAdmin")
            if (isSupperAdmin == 1) {
                this.getCustomerList()
            }else {
                let params = {
                    id: localStorage.getItem("customerId")
                }
                getCustomerForUser(params).then(
                    response => {
                        this.customerList = response.data.data
                        this.searchForm.customerId = parseInt(localStorage.getItem("customerId"))
                        this.find()
                    }
                )
            }
        },

        find() {
            let params = {
                name: this.searchForm.buildingName,
                customerId: this.searchForm.customerId,
                counts: this.searchForm.pageSize,
                pageNum: this.currentPage
            }
            getBuilding(params).then(
                response => {
                    this.buildingList = response.data.data
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

        openAddBuildingPop(){
            hideBg()
            displayPop('addBuildingDiv')
            this.isAddFlag = 1
            this.addBuildingForm.id = ''
            this.addBuildingForm.customerId = ''
            this.addBuildingForm.buildingName = ''
        },

        openModifyBuilding(item) {
            hideBg()
            displayPop('addBuildingDiv')
            this.isAddFlag = 0
            this.addBuildingForm.id = item.id
            this.addBuildingForm.customerId = item.customerId
            this.addBuildingForm.buildingName = item.name
        },

        closeAdd(){
            hidePop('addBuildingDiv')
            activeBg()
            this.addBuildingForm.id = ''
            this.addBuildingForm.customerId = ''
            this.addBuildingForm.buildingName = ''
        },

        saveBuilding() {
            let params = {
                id: this.addBuildingForm.id,
                customerId: this.addBuildingForm.customerId,
                name: this.addBuildingForm.buildingName
            }
            if (this.isAddFlag == 1) {
                addBuilding(params).then(
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
                updateBuilding(params).then(
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

        handleCurrentChange(val) {
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

        deleteBuilding(item){
            let params = {
                id: item.id
            }
            deleteBuilding(params).then(
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

<style>
    @import '../assets/kx-iot.css'

</style>