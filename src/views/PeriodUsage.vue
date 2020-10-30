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
                                    @change="searchAllBuildingForSearchForm">
                                <option :value="item.id" v-for="item in customerList" v-bind:key="item">{{item.name}}
                                </option>
                            </select>
                        </td>
                        <td align="right" width="80px">楼栋</td>
                        <td align="left" width="205px">
                            <select v-model="searchForm.buildingId" class="searchSelect"
                                    @change="getAllSectionForSearchForm()">
                                <option value="">请选择</option>
                                <option :value="item.id" v-for="item in searchFormBuildingList" v-bind:key="item">
                                    {{item.name}}
                                </option>
                            </select>
                        </td>
                        <td align="right" width="80px">区域</td>
                        <td align="left" width="200px">
                            <select v-model="searchForm.sectionId" class="searchSelect">
                                <option value="">请选择</option>
                                <option :value="item.id" v-for="item in searchFormSectionList" v-bind:key="item">
                                    {{item.name}}
                                </option>
                            </select>
                        </td>
                        <td align="right" width="60px">设备名称</td>
                        <td align="left" width="200px">
                            <input type="text" v-model="searchForm.deviceName" placeholder="" class="searchInput">
                        </td>
                    </tr>
                    <tr>
                        <td align="right" width="60px">开始时间</td>
                        <td align="left">
                            <el-date-picker
                                    size="mini"
                                    prefix-icon="none"
                                    v-model="searchForm.startTime"
                                    type="datetime"
                                    placeholder="选择日期">
                            </el-date-picker>
                        </td>
                        <td align="right" width="60px">结束时间</td>
                        <td align="left">
                            <el-date-picker
                                    size="mini"
                                    prefix-icon="none"
                                    v-model="searchForm.endTime"
                                    type="datetime"
                                    placeholder="选择日期">
                            </el-date-picker>
                        </td>

                        <td align="center" width="300px" colspan="4">
                            <el-button size="mini" type="primary" @click="queryFromButton">查询</el-button>
                        </td>
                        <!--
                        <td colspan="4">
                            <span class="fontSpan">时间范围</span>
                            <el-date-picker
                                    size="mini"
                                    v-model="searchForm.periodRange"
                                    type="datetimerange"
                                    :picker-options="pickerOptions"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    align="right">
                            </el-date-picker>
                        </td>

                        -->
                        <!--<td align="right" width="60px">开始时间</td>
                        <td align="left">
                            <input type="datetime-local" v-model="searchForm.startTime" placeholder="" style="width:203px;height:20px">
                        </td>
                        <td align="right" width="60px">结束时间</td>
                        <td align="left">
                            <input type="datetime-local" v-model="searchForm.endTime" placeholder="" style="width:203px;height:20px">
                        </td>

                        <td align="left" width="300px" colspan="4">
                            <el-button size="mini" type="primary" @click="queryFromButton">查询</el-button>
                        </td>

                    -->
                    </tr>
                </table>
            </div>
            <div id="deviceUsageListDiv">
                <table width="100%" class="listTable">
                    <tr>
                        <th width="100px">用户</th>
                        <th width="80px" align="center">楼栋</th>
                        <th width="80px" align="center">区域</th>
                        <th width="100px">设备名称</th>
                        <th width="70px" align="center">开始时间</th>
                        <th width="70px" align="center">结束时间</th>
                        <th width="40px" align="center">开始电量</th>
                        <th width="40px" align="center">结束电量</th>
                        <th width="40px" align="center">使用电量</th>
                    </tr>
                    <tr v-for="item in allUsageList" v-bind:key="item">
                        <td align="left">{{getCustomerName(item.customerId)}}</td>
                        <td align="center">{{getBuildingName(item.buildingId)}}</td>
                        <td align="center">{{getSectionName(item.sectionId)}}</td>
                        <td>{{item.name}}</td>
                        <td align="center">{{searchStartTime}}</td>
                        <td align="center">{{searchEndTime}}</td>
                        <td align="center">{{item.startUsage}}</td>
                        <td align="center">{{item.endUsage}}</td>
                        <td align="center">{{item.usage}}</td>
                    </tr>

                </table>
            </div>
        </div>

    </div>

</template>

<script>
import { getCustomer } from '@/api/admin'
import { getCustomerForUser } from '@/api/admin'
import { getBuilding } from '@/api/admin'
import { getSection } from '@/api/admin'
import { formatDate } from '@/util/dateTime'
import { formateDateFromLong } from '@/util/dateTime'
import { getCurrentUsage } from '@/api/admin'
import { getPeriodUsage } from '@/api/admin'
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
                periodRange: '',
                startTime: '',
                endTime: '',
                pageSize: 20
            },
            searchStartTime: '',
            searchEndTime: '',
            totalUsage: 0,
            totalUsageField: '',

            pickerOptions: {
                shortcuts: [{
                  text: '最近一周',
                  onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                  }
                }, {
                  text: '最近一个月',
                  onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                  }
                }, {
                  text: '最近三个月',
                  onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                  }
                }]
            }
        }

    },

    created() {

        let menus = {
            parentMenu: '数据统计',
            childMenu: '时段用电',
            parentMenuCode: 'data'
        }
        this.$store.commit('updateMenu',menus)

        this.getAllCustomer()
        this.getAllBuilding()

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
                    }
                )
            }
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

        getCustomerName(customerId) {
            if (customerId == '-1') {
                return '合计'
            }
            for (let i = 0; i < this.customerList.length; i++) {
                if(this.customerList[i].id == customerId) {
                    return this.customerList[i].name
                }
            }
        },

        getBuildingName(buildingId) {
            for (let i = 0; i < this.searchFormBuildingList.length; i++) {
                if(this.searchFormBuildingList[i].id == buildingId) {
                    return this.searchFormBuildingList[i].name
                }
            }
        },

        getSectionName(sectionId) {
            for (let i = 0; i < this.searchFormSectionList.length; i++) {
                if(this.searchFormSectionList[i].id == sectionId) {
                    return this.searchFormSectionList[i].name
                }
            }
        },

        getAllBuilding(){
            let isSupperAdmin = localStorage.getItem("isSupperAdmin")
            if (isSupperAdmin == 0) {
                this.searchForm.customerId = localStorage.getItem("customerId")
                this.searchAllBuildingForSearchForm()
            }
        },

        searchAllBuildingForSearchForm(){
            this.searchFormBuildingList = []
            this.searchForm.buildingId=''
            this.searchFormSectionList = []
            this.searchForm.sectionId = ''
            if (this.searchForm.customerId == '') {
                return
            }
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

        queryFromButton(){
            this.find()
            this.totalUsage = 0
        },

        find() {
            this.searchStartTime = ''
            this.searchEndTime = ''
            if (this.searchForm.startTime == '') {
                this.$message(
                {
                    type:"error",
                    message:'请选择开始时间'
                })
                return;
            }
            if (this.searchForm.endTime == '') {
                this.$message(
                {
                    type:"error",
                    message:'请选择结束时间'
                })
                return;
            }

            let params = {
                customerId: this.searchForm.customerId,
                buildingId: this.searchForm.buildingId,
                sectionId: this.searchForm.sectionId,
                deviceName: this.searchForm.deviceName,
                startTime: this.formateDateToString(this.searchForm.startTime, "yyyy-MM-dd hh:mm:ss"),
                endTime: this.formateDateToString(this.searchForm.endTime, "yyyy-MM-dd hh:mm:ss"),
                pageNum: this.currentPage,
                counts: this.searchForm.pageSize
            }

            this.searchStartTime = params.startTime
            this.searchEndTime = params.endTime
            getPeriodUsage(params).then(response => {
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

<style scoped lang="scss">
    .el-input__inner{
        width:200px;
        height:20px;
        font-size:12px;
      }
</style>