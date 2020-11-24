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
                    </tr>
                </table>
            </div>
            <div id="usageChartsDiv">

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
import { getStartOfToday } from '@/util/dateTime'
import { getNowOfToday } from '@/util/dateTime'
import echarts from 'echarts'
import { getHourUsages } from '@/api/admin'
export default {

    data () {
        return {
            total: 0,
            currentPage: 1,
            customerList: [],
            searchFormBuildingList: [],
            searchFormSectionList: [],
            allUsageList: [],
            periodUsageDateArray: [],
            periodUsageValueArray: [],

            searchForm: {
                customerId: '',
                buildingId: '',
                sectionId: '',
                deviceName: '',
                periodRange: '',
                startTime: '',
                endTime: '',
                pageSize: 20
            }
        }

    },

    created() {

        let menus = {
            parentMenu: '数据统计',
            childMenu: '时分图',
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
                        this.searchForm.startTime = getStartOfToday()
                        this.searchForm.endTime = getNowOfToday()
                        this.find()
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
        },

        find() {
            this.periodUsageDateArray = []
            this.periodUsageValueArray = []
            this.allUsageList = []
            if (this.searchForm.customerId == '') {
                this.$message(
                {
                    type:"error",
                    message:'请选择用户'
                })
                return;
            }

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
                endTime: this.formateDateToString(this.searchForm.endTime, "yyyy-MM-dd hh:mm:ss")
            }
            getHourUsages(params).then(response => {
                if (response.data.statusCode.code == 200) {
                    this.allUsageList = response.data.data
                    this.drawLine();
                }else {
                    this.drawLine();
                    this.$message(
                    {
                        type:"error",
                        message:response.data.statusCode.message
                    })
                }
            })
        },

        drawLine() {
            for (let i = 0; i < this.allUsageList.length; i++) {
                this.periodUsageDateArray[i] = this.allUsageList[i].timeStr
                this.periodUsageValueArray[i] = this.allUsageList[i].usageValue
            }

            let titleStr = this.formateDateToString(this.searchForm.startTime, "yyyy-MM-dd hh:mm:ss") + "  到  " + this.formateDateToString(this.searchForm.endTime, "yyyy-MM-dd hh:mm:ss")

            this.charts = echarts.init(document.getElementById("usageChartsDiv"))
            this.charts.setOption({
                tooltip: {
                    trigger: 'axis'
                },
                title: {text: titleStr},
                legend: {
                    data: ['时分图']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },

                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    data: this.periodUsageDateArray
                },
                yAxis: {},

                series: [{
                    name: '时分图',
                    type: 'bar',
                    stack: '总量',
                    data: this.periodUsageValueArray
                }]
            })
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