<template>
    <div id="mainDiv">
        <leftSide-view></leftSide-view>
        <div id="mainBlankDiv"></div>
        <div id="mainDataDiv">
            <div id="searchBindedDeviceDiv">
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
                        <td align="right" width="80px">楼栋</td>
                        <td align="left" width="200px">
                            <select v-model="searchForm.buildingId" class="searchSelect"
                                    @change="getAllSectionForSearchForm()">
                                <option value="">请选择</option>
                                <option :value="item.id" v-for="item in searchFormBuildingList" v-bind:key="item">
                                    {{item.name}}
                                </option>
                            </select>
                        </td>
                        <td align="right" width="40px">区域</td>
                        <td align="left" width="200px">
                            <select v-model="searchForm.sectionId" class="searchSelect">
                                <option value="">请选择</option>
                                <option :value="item.id" v-for="item in searchFormSectionList" v-bind:key="item">
                                    {{item.name}}
                                </option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td align="right" width="60px">设备名称</td>
                        <td align="left" width="200px">
                            <input type="text" v-model="searchForm.deviceName" placeholder="" class="searchInput">
                        </td>
                        <td align="right" width="80px">每页显示数</td>
                        <td align="left" width="200px">
                            <select v-model="searchForm.pageSize" placeholder="请选择" class="searchSelect">
                                <option :value="item.value" v-for="item in pageSizeOptions" v-bind:key="item">
                                    {{item.label}}
                                </option>
                            </select>
                        </td>
                        <td align="center" width="300px" colspan="2">
                            <el-button size="mini" type="primary" @click="find">查询</el-button>
                        </td>
                    </tr>

                </table>
            </div>

            <div id="bindedDeviceListDiv">
                <table width="100%" class="listTable">
                    <tr>
                        <th width="50px" align="center">No.</th>
                        <th width="100px">设备名称</th>
                        <th width="100px" align="center">设备编码</th>
                        <th width="100px" align="center">楼栋</th>
                        <th width="100px" align="center">区域</th>
                        <th width="40px" align="center">运行状态</th>
                        <th width="40px" align="center">当前电量</th>
                        <th width="40px" align="center">当月用电</th>
                        <th width="100px" align="center">更新时间</th>
                    </tr>
                    <tr v-for="item in allUsageList" v-bind:key="item">
                        <td align="center">{{item.id}}</td>
                        <td>{{item.name}}</td>
                        <td align="center">{{item.code}}</td>
                        <td align="center">{{item.buildingName}}</td>
                        <td align="center">{{item.sectionName}}</td>
                        <td align="center">{{item.onlineStr}}</td>
                        <td align="center">{{item.electConsumption}}</td>
                        <td align="center">{{item.currentMonthUsage}}</td>
                        <td align="center">{{formatDateFromLong(item.receiveTimeNumber)}}</td>
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
        </div>

    </div>

</template>

<script>
import { getCustomer } from '@/api/admin'
import { getBuilding } from '@/api/admin'
import { getSection } from '@/api/admin'
import { formatDate } from '@/util/dateTime'
import { formateDateFromLong } from '@/util/dateTime'
import { getCurrentUsage } from '@/api/admin'
export default {

    data () {
        return {
            total: 0,
            currentPage: 1,
            customerList: [],
            searchFormBuildingList: [],
            searchFormSectionList: [],
            allUsageList: [],
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
            searchForm: {
                customerId: '',
                buildingId: '',
                sectionId: '',
                deviceName: '',
                pageSize: 20
            }
        }

    },

    created() {

        let menus = {
            parentMenu: '数据统计',
            childMenu: '当前用电',
            parentMenuCode: 'data'
        }
        this.$store.commit('updateMenu',menus)

        this.getCustomerList()

        this.find()

    },

    methods: {
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

        getAllBuildingForSearchForm(){
            this.searchFormBuildingList = []
            this.searchForm.buildingId=''
            this.searchFormSectionList = []
            this.searchForm.sectionId = ''
            let params = {
                name: '',
                customerId: this.searchForm.customerId,
                pageNum: 1,
                counts: 1000
            }
            getBuilding(params).then(response => {
                this.searchFormBuildingList = response.data.data
            })
        },

        getAllSectionForSearchForm() {
            this.searchFormSectionList = []
            this.searchForm.sectionId = ''
            let params = {
                name: '',
                customerId: '',
                buildingId: this.searchForm.buildingId,
                pageNum: 1,
                counts: 1000
            }
            if (this.searchForm.building == '') {
                this.searchFormSectionList = []
            }else {
                getSection(params).then(response => {
                    this.searchFormSectionList = response.data.data
                })
            }
        },

        formateDateToString(value) {
            return formatDate(value, 'yyyy-MM-dd hh:mm:ss')
        },

        formatDateFromLong(value) {
            return formateDateFromLong(value)
        },

        find() {
            let params = {
                customerId: this.searchForm.customerId,
                buildingId: this.searchForm.buildingId,
                sectionId: this.searchForm.sectionId,
                deviceName: this.searchForm.deviceName,
                pageNum: this.currentPage,
                counts: this.searchForm.pageSize
            }
            getCurrentUsage(params).then(response => {
                this.allUsageList = response.data.data
                this.total = response.data.paging.total
                this.currentPage = response.data.paging.pageNo
            })

        },

        handleCurrentChange(val){
            this.currentPage = val
            this.find()
        }
    }



}



</script>

<style>
    @import '../assets/kx-iot.css'

</style>