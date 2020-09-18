<template>
    <div id="mainDiv">
        <leftSide-view></leftSide-view>
        <div id="mainBlankDiv"></div>
        <div id="mainDataDiv">
            <div id="searchAllDeviceStatusDiv">
                <el-form :inline="true" :model="searchForm" size="mini" id="searchAllDeviceStatusForm">
                    <el-form-item label="楼栋" class="itemlabel ">
                        <el-select v-model="searchForm.building" placeholder="楼栋" autocomplete="off"
                                   @change="handleOnBuildingChange()">
                            <el-option key="all" label="所有" value=""></el-option>
                            <el-option v-for="(item,index) in allBuildingList"
                                       :key="index"
                                       :label="item.name"
                                       :value="item.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="区域" class="itemlabel ">
                        <el-select v-model="searchForm.section" placeholder="区域" autocomplete="off">
                            <el-option key="all" label="所有" value=""></el-option>
                            <el-option v-for="(item,index) in allSectionList"
                                       :key="index"
                                       :label="item.name"
                                       :value="item.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="仪表名称" class="itemlabel ">
                        <el-input v-model="searchForm.deviceName" placeholder="仪表名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="find">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <div id="allDevicesStatusListDiv">
                <table width="100%" class="table">
                    <tr>
                        <th width="50px" align="center">No.</th>
                        <th width="100px">设备名称</th>
                        <th width="100px">楼栋</th>
                        <th width="100px">区域</th>
                        <th width="50px" align="center">运行状态</th>
                        <th width="100px" align="center">当前电压</th>
                        <th width="100px" align="center">当前电流</th>
                        <th width="100px" align="center">当前电量</th>
                        <th width="100px" align="center">更新时间</th>
                        <th width="100px" align="center">操作</th>
                    </tr>
                    <tr v-for="item in allDeviceStatusList" v-bind:key="item">
                        <td align="center">{{item.id}}</td>
                        <td>{{item.name}}</td>
                        <td>{{item.buildingName}}</td>
                        <td>{{item.sectionName}}</td>
                        <td v-if="item.online==0" bgcolor="#FF0000" align="center">{{item.onlineStr}}</td>
                        <td v-if="item.online==1" bgcolor="#00FF00" align="center">{{item.onlineStr}}</td>
                        <td align="center">{{item.voltage}}</td>
                        <td align="center">{{item.electric}}</td>
                        <td align="center">{{item.electConsumption}}</td>
                        <td align="center">{{formatDateFromLong(item.receiveTimeNumber)}}</td>
                        <td align="center">
                            <a href="#" v-on:click="openHistoryData(item.iotDeviceId)">历史上报数据</a>
                        </td>
                    </tr>

                </table>
            </div>

            <div id="pageDiv">
                <el-pagination
                        small="true"
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-size="pageSize"
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
                    <span class="fontSpan">时间范围</span>
                    <el-date-picker
                            size="mini"
                            v-model="historyDateValueRange"
                            type="datetimerange"
                            :picker-options="pickerOptions"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            align="right">
                    </el-date-picker>
                    <el-button type="primary" @click="searchHistoryData()" size="mini">搜索</el-button>
                    <el-button type="primary" @click="exportHistoryData()" size="mini">导出</el-button>
                </div>
                <div id="historyDataListDiv">
                    <table width="100%" class="table">
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
import { formatDate } from '@/util/dateTime'
import { formateDateFromLong } from '@/util/dateTime'


export default {
    name: 'Home',
    data () {
        return {
            searchForm: {
                building: '',
                section: '',
                deviceName: ''
            },
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
              historyDateValueRange: ''
            }

    },

    created(){
        let menus = {
            parentMenu: '运行状态',
            childMenu: '全部设备',
            parentMenuCode: 'status'
        }
        this.$store.commit('updateMenu',menus)

        this.getAllBuilding()

        this.find()
    },

    methods: {
        getAllBuilding(){
            let params = {
                name: '',
                customerId: '',
                pageNum: 1,
                counts: 100
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
                counts: 100
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
                buildingId: this.searchForm.building,
                sectionId: this.searchForm.section,
                online: 0,
                pageNum: this.currentPage,
                counts: this.pageSize
            }
            console.log(this.$store.state.subAction)

            getDeviceStatus(params).then(response => {
                this.allDeviceStatusList = response.data.data
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
            this.historyDateValueRange = ''
            this.selectedIotDeviceIdForHistory = iotDeviceId;
        },

        closeHistoryData() {
            hidePop('historyDataDiv')
            activeBg()
            this.historyDateValueRange = ''
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
            if (this.historyDateValueRange == '') {
                this.$message(
                {   type:"error",
                    message:"请选择时间范围"
                })
                return
            }
            let params = {
                iotDeviceId: this.selectedIotDeviceIdForHistory,
                startDate: this.formateDateToString(this.historyDateValueRange[0], "yyyy-MM-dd hh:mm:ss"),
                endDate: this.formateDateToString(this.historyDateValueRange[1], "yyyy-MM-dd hh:mm:ss"),
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
         }
    }
}

</script>

<style>
    @import '../assets/kx-iot.css'

</style>