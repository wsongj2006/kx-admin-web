<template>
    <div id="mainDiv">
        <leftSide-view></leftSide-view>
        <div id="mainBlankDiv"></div>
        <div id="mainDataDiv">
            <div id="searchAllDeviceStatusDiv">
                <table class="searchFormTable">
                    <tr>
                        <td align="right" width="60px">用户</td>
                        <td align="left" width="210px">
                            <select v-model="searchForm.customerId" class="searchSelect"
                                    @change="handleOnCustomerChange">
                                <option :value="item.id" v-for="item in allCustomers" v-bind:key="item">{{item.name}}
                                </option>
                            </select>
                        </td>
                        <td align="right" width="80px">楼栋</td>
                        <td align="left" width="205px">
                            <select v-model="searchForm.building" class="searchSelect"
                                    @change="handleOnBuildingChange()">
                                <option value="">请选择</option>
                                <option :value="item.id" v-for="item in allBuildingList" v-bind:key="item">
                                    {{item.name}}
                                </option>
                            </select>
                        </td>
                        <td align="right" width="80px">区域</td>
                        <td align="left" width="200px">
                            <select v-model="searchForm.section" class="searchSelect">
                                <option value="">请选择</option>
                                <option :value="item.id" v-for="item in allSectionList" v-bind:key="item">
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
                        <td align="right" width="80px">每页显示数</td>
                        <td align="left" width="300px">
                            <select v-model="searchForm.pageSize" placeholder="请选择" class="searchSelect" @change="handleOnPageSizeChange">
                                <option :value="item.value" v-for="item in pageSizeOptions" v-bind:key="item">
                                    {{item.label}}
                                </option>
                            </select>
                        </td>

                        <td align="left" width="300px" colspan="6">
                            <el-button size="mini" type="primary" @click="find">查询</el-button>
                        </td>
                    </tr>

                </table>
            </div>

            <div id="allDevicesStatusListDiv">
                <table width="100%" class="listTable">
                    <tr>
                        <th width="50px" align="center">序列号</th>
                        <th width="100px">设备名称</th>
                        <th width="200px">用户</th>
                        <th width="100px">楼栋</th>
                        <th width="100px">区域</th>
                        <th width="50px" align="center">运行状态</th>
                        <th width="50px" align="center">拉闸状态</th>
                        <th width="50px" align="center">当前电压</th>
                        <th width="50px" align="center">当前电流</th>
                        <th width="50px" align="center">当前电量</th>
                        <th width="50px" align="center">当月电费</th>
                        <th width="100px" align="center">更新时间</th>
                        <th width="100px" align="center">操作</th>
                    </tr>
                    <tr v-for="item in allDeviceStatusList" v-bind:key="item">
                        <td align="center" width="50px">{{item.sid}}</td>
                        <td width="100px">{{item.name}}</td>
                        <td width="200px">{{ getCustomerName(item.customerId) }}</td>
                        <td width="100px">{{item.buildingName}}</td>
                        <td width="100px">{{item.sectionName}}</td>
                        <td width="50px" v-if="item.online==0" bgcolor="#FF0000" align="center">{{item.onlineStr}}</td>
                        <td width="50px" v-if="item.online==1" bgcolor="#00FF00" align="center">{{item.onlineStr}}</td>
                        <td width="50px" align="center">{{getSwitchStatus(item.switchStatus)}}</td>
                        <td align="center">{{item.voltage}}</td>
                        <td align="center">{{item.electric}}</td>
                        <td align="center">{{item.electConsumption}}</td>
                        <td align="center">{{item.currentMonthCharge}}</td>
                        <td align="center">{{formatDateFromLong(item.receiveTimeNumber)}}</td>
                        <td align="center">
                            <select name="moreActionSelect" v-model="moreAction" class="actionSelect" placeholder="更多操作"  @change="handleOnActionChange(item)">
                                <option value="0" >更多操作</option>
                                <option value="history" >历史上报数据</option>
                                <option value="price" >电价设置</option>
                                <option value="switchout" >拉闸</option>
                                <option value="switchon" >合闸</option>
                            </select>
                        </td>
                    </tr>

                </table>
            </div>

            <div id="pageDiv">
                <el-pagination
                        small="true"
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-size="this.searchForm.pageSize"
                        layout="total, prev, pager, next"
                        :total="total">
                </el-pagination>
            </div>

            <div id="historyDataDiv">
                <div id="historyDataTitleDiv">
                    <span class="fontSpan">
                        设备历史上报数据查询
                    </span>
                </div>
                <div id="historyDataSearchDiv">
                    <span class="fontSpan">开始时间</span>
                    <el-date-picker
                            size="mini"
                            v-model="historyStartDate"
                            type="datetime"
                            placeholder="选择日期">
                    </el-date-picker>
                    <span class="fontSpan">结束时间</span>
                    <el-date-picker
                            size="mini"
                            v-model="historyEndDate"
                            type="datetime"
                            placeholder="选择日期">
                    </el-date-picker>
                    <el-button type="primary" @click="searchHistoryData()" size="mini">搜索</el-button>
                    <el-button type="primary" @click="exportHistoryData()" size="mini">导出</el-button>
                </div>
                <div id="historyDataListDiv">
                    <table width="100%" class="listTable">
                        <tr>
                            <th width="130px" style='word-wrap: break-word'>上报时间</th>
                            <th width="60px" style='word-wrap: break-word'>上报电量</th>
                            <th  style='word-wrap: break-word'>设备上报数据</th>
                        </tr>
                        <tr v-for="item in historyDataList" v-bind:key="item">
                            <td style='word-wrap: break-word'>{{formatDateFromLong(item.receiveTimeNumber)}}</td>
                            <td style='word-wrap: break-word'>{{item.electConsumption}}</td>
                            <td style='word-wrap: break-word'>{{item.originData}}</td>
                        </tr>
                    </table>

                </div>
                <div id="historyPageDiv">
                    <el-pagination
                            small="true"
                            @current-change="handleHistoryCurrentChange"
                            :current-page.sync="historyCurrentPage"
                            :page-size="historyPageSize"
                            layout="total, prev, pager, next"
                            :total="historyTotal">
                    </el-pagination>
                </div>
                <div id="historyDataButtonDiv">
                    <button v-on:click="closeHistoryData()">关闭</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getBuilding } from '@/api/admin'
import { getSection } from '@/api/admin'
import { getDeviceStatus } from '@/api/admin'
import { getDeviceHistory } from '@/api/admin'
import { hideBg } from '@/util/util'
import { activeBg } from '@/util/util'
import { displayPop } from '@/util/util'
import { hidePop } from '@/util/util'
import { displayBgMsg } from '@/util/util'
import { hideBgMsg } from '@/util/util'
import { formatDate } from '@/util/dateTime'
import { formateDateFromLong } from '@/util/dateTime'
import { getCustomerForUser } from '@/api/admin'
import { getCustomer } from '@/api/admin'
import { switchOut } from '@/api/admin'
import { switchOn } from '@/api/admin'

export default {
    name: 'Home',
    data () {
        return {
            searchForm: {
                customerId: '',
                building: '',
                section: '',
                deviceName: '',
                pageSize: 20
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
            currentPage: 1,
            pageSize: 30,
            total: 0,
            historyCurrentPage: 1,
            historyPageSize: 20,
            historyTotal: 0,
            allBuildingList: [],
            allSectionList: [],
            allDeviceStatusList: [],
            historyDataList: [],
            selectedIotDeviceIdForHistory: '',
            allCustomers: [],
            moreAction: 0,

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
              },
              historyStartDate: '',
              historyEndDate: ''
            }

    },

    created(){
        let menus = {
            parentMenu: '运行状态',
            childMenu: '在线设备',
            parentMenuCode: 'status'
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
                        this.allCustomers = response.data.data
                        this.searchForm.customerId = parseInt(localStorage.getItem("customerId"))
                        this.find();
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
                    this.allCustomers = response.data.data
                    this.find();
                }
            )
        },

        handleOnCustomerChange(){
            this.allBuildingList = []
            this.allSectionList = []
            this.searchForm.section = ''
            this.searchForm.building = ''
            this.searchAllBuilding()
        },

        getAllBuilding(){
            let isSupperAdmin = localStorage.getItem("isSupperAdmin")
            if (isSupperAdmin == 0) {
                this.searchForm.customerId = localStorage.getItem("customerId")
                this.searchAllBuilding()
            }
        },

        searchAllBuilding(){
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
                this.allBuildingList = response.data.data
            })
        },

        handleOnBuildingChange() {
            this.allSectionList = []
            this.searchForm.section = ''
            let params = {
                name: '',
                customerId: '',
                buildingId: this.searchForm.building,
                pageNum: 1,
                counts: 1000
            }
            if (this.searchForm.building == '') {
                this.allSectionList = []
            }else {
                getSection(params).then(response => {
                    this.allSectionList = response.data.data
                })
            }
        },

        handleCurrentChange(val) {
            this.currentPage = val
            this.find()
        },

        find() {
            let params = {
                name: this.searchForm.deviceName,
                customerId: this.searchForm.customerId,
                buildingId: this.searchForm.building,
                sectionId: this.searchForm.section,
                online: 1,
                pageNum: this.currentPage,
                counts: this.searchForm.pageSize
            }
            getDeviceStatus(params).then(response => {
                this.allDeviceStatusList = response.data.data
                for (let i = 0; i < this.allDeviceStatusList.length; i++) {
                    this.allDeviceStatusList[i].sid = i+1
                }
                this.total = response.data.paging.total
                this.currentPage = response.data.paging.pageNo
            })
        },

        formateDateToString(value) {
            return formatDate(value, 'yyyy-MM-dd hh:mm:ss')
        },

        formatDateFromLong(value) {
            return formateDateFromLong(value)
        },

        openHistoryData(iotDeviceId) {
            hideBg()
            displayPop('historyDataDiv')
            this.historyStartDate = ''
            this.historyEndDate = ''
            this.selectedIotDeviceIdForHistory = iotDeviceId;
        },

        closeHistoryData() {
            hidePop('historyDataDiv')
            activeBg()
            this.historyStartDate = ''
            this.historyEndDate = ''
            this.selectedIotDeviceIdForHistory = ''
            this.historyDataList = []
            this.historyTotal = 0
            this.historyCurrentPage = 1
        },

        handleHistoryCurrentChange(val) {
            this.historyCurrentPage = val
            this.searchHistoryData()
        },

        async searchHistoryData() {
            if (this.historyStartDate == '') {
                this.$message(
                {   type:"error",
                    message:"请选择开始时间"
                })
                return
            }
            if (this.historyEndDate == '') {
                this.$message(
                {   type:"error",
                    message:"请选择结束时间"
                })
                return
            }
            let params = {
                iotDeviceId: this.selectedIotDeviceIdForHistory,
                startDate: this.formateDateToString(this.historyStartDate, "yyyy-MM-dd hh:mm:ss"),
                endDate: this.formateDateToString(this.historyEndDate, "yyyy-MM-dd hh:mm:ss"),
                pageNum: this.historyCurrentPage,
                counts: this.historyPageSize
            }
            console.log(params)
            let response = await getDeviceHistory(params);
            if (response.data.statusCode.code == 200){
                this.historyDataList = response.data.data
                this.historyTotal = response.data.paging.total
                this.historyCurrentPage = response.data.paging.pageNo
            }
        },

        async switchout(id){
            hideBg()
            displayBgMsg("正在下发指令，请稍后。。。。。。")
            let params = {
                id: id
            }
            let response = await switchOut(params);
            if (response.data.statusCode.code == 200){
                hideBgMsg()
                activeBg()
                this.$message(
                {
                    type:"success",
                    message:"指令下发成功"
                })
                this.find()
            }else {
                hideBgMsg()
                activeBg()
                this.$message(
                {
                    type:"error",
                    message:"指令下发失败"
                })
            }

        },

        async switchon(id){
            hideBg()
            displayBgMsg("正在下发指令，请稍后。。。。。。")
            let params = {
                id: id
            }
            let response = await switchOn(params);
            if (response.data.statusCode.code == 200){
                hideBgMsg()
                activeBg()
                this.$message(
                {
                    type:"success",
                    message:"指令下发成功"
                })
                this.find()
            }else {
                hideBgMsg()
                activeBg()
                this.$message(
                {
                    type:"error",
                    message:"指令下发失败"
                })
            }
        },

        getSwitchStatus(switchStatusValue) {
            if (switchStatusValue == "0") {
                return "合闸"
            }else {
                return "拉闸"
            }
        },

        getCustomerName(customerId) {
            if (customerId == '-1') {
                return '合计'
            }
            for (let i = 0; i < this.allCustomers.length; i++) {
                if(this.allCustomers[i].id == customerId) {
                    return this.allCustomers[i].name
                }
            }
        },

        handleOnPageSizeChange(){
            this.currentPage = 1
            this.find()
        },

        handleOnActionChange(item){
            if (this.moreAction == 'history') {
                this.openHistoryData(item.iotDeviceId)
            }
            if (this.moreAction == 'switchout') {
                this.switchout(item.id)
            }
            if (this.moreAction == 'switchon') {
                this.switchon(item.id)
            }
            this.moreAction = 0
        }
    }
}










</script>

<style>
    @import '../assets/kx-iot.css'

</style>