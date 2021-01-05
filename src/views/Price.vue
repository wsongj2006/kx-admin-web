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
                            <select v-model="searchForm.customerId" class="searchSelect" @change="find">
                                <option :value="item.id" v-for="item in customerList" v-bind:key="item">{{item.name}}
                                </option>
                            </select>
                        </td>

                        <td align="right" width="80px">每页显示数</td>
                        <td align="left" width="200px">
                            <select v-model="searchForm.pageSize" placeholder="请选择" class="searchSelect"
                                    @change="handleOnPageSizeChange">
                                <option :value="item.value" v-for="item in pageSizeOptions" v-bind:key="item">
                                    {{item.label}}
                                </option>
                            </select>
                        </td>
                        <td align="center" width="300px">
                            <el-button size="mini" type="primary" @click="find">查询</el-button>
                            <el-button size="mini" type="primary" @click="openSetPricePop">新增</el-button>
                        </td>
                    </tr>

                </table>
            </div>


            <div class="oneLineSearchOutListDiv">
                <table width="100%" class="listTable">
                    <tr>
                        <th width="50px" align="center">序列号</th>
                        <th width="100px">用户</th>
                        <th width="100px" align="center">设备名</th>
                        <th width="100px" align="center">价格类型</th>
                        <th width="100px" align="center">起始时间</th>
                        <th width="100px" align="center">结束时间</th>
                        <th width="100px" align="center">价格</th>
                        <th width="100px" align="center">操作</th>
                    </tr>
                    <tr v-for="item in priceList" v-bind:key="item">
                        <td align="center">{{item.sid}}</td>
                        <td>{{getCustomerName(item.customerId)}}</td>
                        <td align="center">{{item.deviceName}}</td>
                        <td align="center">{{item.priceTypeName}}</td>
                        <td align="center">{{item.fromTime}}</td>
                        <td align="center">{{item.toTime}}</td>
                        <td align="center">{{item.price}}</td>
                        <td align="center">
                            <a href="#" v-on:click="openModifyPricePop(item)">修改</a>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <a href="#" v-on:click="deletePrice(item)">删除</a>
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


            <div id="setPricePopDiv">
                <table class="inputFormTable">
                    <tr>
                        <td colspan="2" align="center">电价设置</td>
                    </tr>
                    <tr>
                        <td align="right" width="100px">用户</td>
                        <td align="left" width="200px">
                            <select v-model="priceForm.customerId" class="searchSelect" @change="fetchDeviceInSet()">
                                <option :value="item.id" v-for="item in customerList" v-bind:key="item">{{item.name}}
                                </option>
                            </select>
                        </td>
                    </tr>

                    <tr>
                        <td align="right">设备名</td>
                        <td align="left" width="200px">
                            <select v-model="priceForm.deviceId" class="searchSelect" >
                                <option :value="item.id" v-for="item in customerDeviceList" v-bind:key="item">{{item.name}}
                                </option>
                            </select>
                        </td>
                    </tr>

                    <tr>
                        <td align="right" width="100px">电价类型</td>
                        <td align="left" width="200px">
                            <select v-model="priceForm.priceType" class="searchSelect" >
                                <option :value="item.code" v-for="item in priceTypeList" v-bind:key="item">{{item.name}}
                                </option>
                            </select>
                        </td>
                    </tr>

                    <tr>
                        <td align="right">开始时间</td>
                        <td align="left" width="200px">
                            <select v-model="priceForm.fromTime" class="searchSelect" >
                                <option :value="item.value" v-for="item in timeList" v-bind:key="item">{{item.name}}
                                </option>
                            </select>
                        </td>
                    </tr>

                    <tr>
                        <td align="right">结束时间</td>
                        <td align="left" width="200px">
                            <select v-model="priceForm.toTime" class="searchSelect" >
                                <option :value="item.value" v-for="item in timeList" v-bind:key="item">{{item.name}}
                                </option>
                            </select>
                        </td>
                    </tr>

                    <tr>
                        <td align="right">价格</td>
                        <td align="left" width="200px">
                            <input type="text" v-model="priceForm.price" placeholder="" class="searchInput">
                        </td>
                    </tr>

                    <tr>
                        <td align="center" width="200px" colspan="2">
                            <el-button type="primary" @click="closeSetPricePop" size="mini">取消</el-button>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <el-button type="primary" @click="savePrice" size="mini">确定</el-button>
                        </td>
                    </tr>


                </table>

            </div>

            <div id="modifyPricePopDiv">
                <input type="hidden" v-model="modifyPriceForm.id">
                <table class="inputFormTable">
                    <tr>
                        <td colspan="2" align="center">电价设置</td>
                    </tr>
                    <tr>
                        <td align="right" width="100px">用户</td>
                        <td align="left" width="200px">
                            <select v-model="modifyPriceForm.customerId" class="searchSelect" @change="fetchDeviceInModify()">
                                <option :value="item.id" v-for="item in customerList" v-bind:key="item">{{item.name}}
                                </option>
                            </select>
                        </td>
                    </tr>

                    <tr>
                        <td align="right">设备名</td>
                        <td align="left" width="200px">
                            <select v-model="modifyPriceForm.deviceId" class="searchSelect" >
                                <option :value="item.id" v-for="item in customerDeviceList" v-bind:key="item">{{item.name}}
                                </option>
                            </select>
                        </td>
                    </tr>

                    <tr>
                        <td align="right" width="100px">电价类型</td>
                        <td align="left" width="200px">
                            <select v-model="modifyPriceForm.priceType" class="searchSelect" >
                                <option :value="item.code" v-for="item in priceTypeList" v-bind:key="item">{{item.name}}
                                </option>
                            </select>
                        </td>
                    </tr>

                    <tr>
                        <td align="right">开始时间</td>
                        <td align="left" width="200px">
                            <select v-model="modifyPriceForm.fromTime" class="searchSelect" >
                                <option :value="item.value" v-for="item in timeList" v-bind:key="item">{{item.name}}
                                </option>
                            </select>
                        </td>
                    </tr>

                    <tr>
                        <td align="right">结束时间</td>
                        <td align="left" width="200px">
                            <select v-model="modifyPriceForm.toTime" class="searchSelect" >
                                <option :value="item.value" v-for="item in timeList" v-bind:key="item">{{item.name}}
                                </option>
                            </select>
                        </td>
                    </tr>

                    <tr>
                        <td align="right">价格</td>
                        <td align="left" width="200px">
                            <input type="text" v-model="modifyPriceForm.price" placeholder="" class="searchInput">
                        </td>
                    </tr>

                    <tr>
                        <td align="center" width="200px" colspan="2">
                            <el-button type="primary" @click="closeModifyPricePop" size="mini">取消</el-button>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <el-button type="primary" @click="updatePrice" size="mini">确定</el-button>
                        </td>
                    </tr>


                </table>

            </div>

        </div>

    </div>


</template>

<script>
import { getCustomer } from '@/api/admin'
import { getCustomerForUser } from '@/api/admin'
import { getPrice } from '@/api/admin'
import { savePrice } from '@/api/admin'
import { updatePrice } from '@/api/admin'
import { deletePrice } from '@/api/admin'
import { getCustomerDevice } from '@/api/admin'
import { hideBg } from '@/util/util'
import { activeBg } from '@/util/util'
import { displayPop } from '@/util/util'
import { hidePop } from '@/util/util'

export default {
    data () {
        return {
            customerList: [],
            priceList: [],
            currentPage: 1,
            total: 0,
            customerDeviceList: [],

            searchForm: {
                customerId: '',
                pageSize: 20
            },

            priceForm: {
                customerId: '',
                deviceId: '',
                priceType: '',
                fromTime: '',
                toTime: '',
                price: ''
            },

            modifyPriceForm: {
                id: '',
                customerId: '',
                deviceId: '',
                priceType: '',
                fromTime: '',
                toTime: '',
                price: ''
            },

            priceTypeList: [
                {code: 'FULLTIME', name: '全时段'},
                {code: 'DURATION', name: '分时段'}
            ],

            timeList: [
                {value: '00:00', name: '00:00'},
                {value: '01:00', name: '01:00'},
                {value: '02:00', name: '02:00'},
                {value: '03:00', name: '03:00'},
                {value: '04:00', name: '04:00'},
                {value: '05:00', name: '05:00'},
                {value: '06:00', name: '06:00'},
                {value: '07:00', name: '07:00'},
                {value: '08:00', name: '08:00'},
                {value: '09:00', name: '09:00'},
                {value: '10:00', name: '10:00'},
                {value: '11:00', name: '11:00'},
                {value: '12:00', name: '12:00'},
                {value: '13:00', name: '13:00'},
                {value: '14:00', name: '14:00'},
                {value: '15:00', name: '15:00'},
                {value: '16:00', name: '16:00'},
                {value: '17:00', name: '17:00'},
                {value: '18:00', name: '18:00'},
                {value: '19:00', name: '19:00'},
                {value: '20:00', name: '20:00'},
                {value: '21:00', name: '21:00'},
                {value: '22:00', name: '22:00'},
                {value: '23:00', name: '23:00'}
            ],

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
            parentMenu: '设备管理',
            childMenu: '电价设置',
            parentMenuCode: 'device'
        }
        this.$store.commit('updateMenu',menus)
        this.getAllCustomer()
    },

    methods: {
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
                customerId: this.searchForm.customerId,
                pageNum: this.currentPage,
                counts: this.searchForm.pageSize
            }
            getPrice(params).then(
                response => {
                    this.priceList = response.data.data
                    for (let i = 0; i < this.priceList.length; i++) {
                        this.priceList[i].sid = i+1
                    }
                    this.total = response.data.paging.total
                    this.currentPage = response.data.paging.pageNo
                }
            )
        },

        openSetPricePop() {
            this.priceForm.customerId = ''
            this.priceForm.deviceId = ''
            this.priceForm.priceType = ''
            this.priceForm.fromTime = ''
            this.priceForm.toTime = ''
            this.priceForm.price = ''
            this.customerDeviceList = []
            hideBg()
            displayPop('setPricePopDiv')
        },

        closeSetPricePop() {
            this.priceForm.customerId = ''
            this.priceForm.deviceId = ''
            this.priceForm.priceType = ''
            this.priceForm.fromTime = ''
            this.priceForm.toTime = ''
            this.priceForm.price = ''
            this.customerDeviceList = []
            hidePop('setPricePopDiv')
            activeBg()
        },

        getCustomerName(customerId) {
            for (let i = 0; i < this.customerList.length; i++) {
                if(this.customerList[i].id == customerId) {
                    return this.customerList[i].name
                }
            }
        },

        handleCurrentChange(val) {
            this.currentPage = val
            this.find()
        },

        handleOnPageSizeChange(){
            this.currentPage = 1
            this.find()
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
                    this.find()
                }
            )
        },

        savePrice(){
            if (this.priceForm.customerId == '') {
                this.$message(
                {
                    type:"error",
                    message:"用户不能为空"
                })
                return;
            }

            if (this.priceForm.priceType == '') {
                this.$message(
                {
                    type:"error",
                    message:"电价类型不能为空"
                })
                return;
            }

            if (this.priceForm.priceType == 'DURATION') {
                if (this.priceForm.fromTime == '') {
                    this.$message(
                    {
                        type:"error",
                        message:"开始时间不能为空"
                    })
                    return;
                }
                if (this.priceForm.toTime == '') {
                    this.$message(
                    {
                        type:"error",
                        message:"结束时间不能为空"
                    })
                    return;
                }
            }

            if (this.priceForm.priceType == 'FULLTIME') {
                this.priceForm.fromTime = ''
                this.priceForm.toTime = ''
            }

            if (this.priceForm.price == '') {
                this.$message(
                {
                    type:"error",
                    message:"电价不能为空"
                })
                return;
            }

            let params = {
                customerId: this.priceForm.customerId,
                deviceId: this.priceForm.deviceId,
                priceType: this.priceForm.priceType,
                fromTime:  this.priceForm.fromTime,
                toTime:  this.priceForm.toTime,
                price:  this.priceForm.price
            }

            savePrice(params).then(
                response => {
                    if (response.data.statusCode.code == 200) {
                        this.$message(
                        {
                            type:"success",
                            message:response.data.statusCode.message
                        })
                        this.find()
                        this.closeSetPricePop()
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

        openModifyPricePop(item) {
            this.modifyPriceForm.id = item.id
            this.modifyPriceForm.customerId = item.customerId
            this.modifyPriceForm.deviceId = item.deviceId
            this.modifyPriceForm.priceType = item.priceType
            this.modifyPriceForm.fromTime = item.fromTime
            this.modifyPriceForm.toTime = item.toTime
            this.modifyPriceForm.price = item.price
            this.customerDeviceList = []
            this.getDeviceListByCustomer(item.customerId)
            hideBg()
            displayPop('modifyPricePopDiv')
        },

        closeModifyPricePop() {
            this.modifyPriceForm.id = ''
            this.modifyPriceForm.customerId = ''
            this.modifyPriceForm.deviceId = ''
            this.modifyPriceForm.priceType = ''
            this.modifyPriceForm.fromTime = ''
            this.modifyPriceForm.toTime = ''
            this.modifyPriceForm.price = ''
            this.customerDeviceList = []
            hidePop('modifyPricePopDiv')
            activeBg()
        },

        updatePrice(){
            if (this.modifyPriceForm.customerId == '') {
                this.$message(
                {
                    type:"error",
                    message:"用户不能为空"
                })
                return;
            }

            if (this.modifyPriceForm.priceType == '') {
                this.$message(
                {
                    type:"error",
                    message:"电价类型不能为空"
                })
                return;
            }

            if (this.modifyPriceForm.priceType == 'DURATION') {
                if (this.modifyPriceForm.fromTime == '') {
                    this.$message(
                    {
                        type:"error",
                        message:"开始时间不能为空"
                    })
                    return;
                }
                if (this.modifyPriceForm.toTime == '') {
                    this.$message(
                    {
                        type:"error",
                        message:"结束时间不能为空"
                    })
                    return;
                }
            }

            if (this.priceForm.priceType == 'FULLTIME') {
                this.priceForm.fromTime = ''
                this.priceForm.toTime = ''
            }

            if (this.modifyPriceForm.price == '') {
                this.$message(
                {
                    type:"error",
                    message:"电价不能为空"
                })
                return;
            }

            let params = {
                id: this.modifyPriceForm.id,
                customerId: this.modifyPriceForm.customerId,
                deviceId: this.modifyPriceForm.deviceId,
                priceType: this.modifyPriceForm.priceType,
                fromTime:  this.modifyPriceForm.fromTime,
                toTime:  this.modifyPriceForm.toTime,
                price:  this.modifyPriceForm.price
            }

            updatePrice(params).then(
                response => {
                    if (response.data.statusCode.code == 200) {
                        this.$message(
                        {
                            type:"success",
                            message:response.data.statusCode.message
                        })
                        this.find()
                        this.closeModifyPricePop()
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

        deletePrice(item) {
            let params = {
                id: item.id
            }
            deletePrice(params).then(
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

        fetchDeviceInSet(){
            this.getDeviceListByCustomer(this.priceForm.customerId)
        },

        fetchDeviceInModify(){
            this.getDeviceListByCustomer(this.modifyPriceForm.customerId)
        },

        getDeviceListByCustomer(customerId){
            let params = {
                customerId: customerId
            }
            getCustomerDevice(params).then(
                response => {
                    this.customerDeviceList = response.data.data
                }
            )
        }
    }

}


</script>