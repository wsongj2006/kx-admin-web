<template>
    <div id="mainDiv">
        <leftSide-view></leftSide-view>
        <div id="mainBlankDiv"></div>
        <div id="mainDataDiv">
            <div id="importDeivceFromFileDiv">
                <el-form :inline="true" size="mini">
                    <el-form-item label="用户" class="itemlabel ">
                        <el-select v-model="importForm.customerId" placeholder="请选择" autocomplete="off" @change="getAllBuilding()">
                            <el-option v-for="(item,index) in customerList"
                                       :key="index"
                                       :label="item.name"
                                       :value="item.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="楼栋" class="itemlabel ">
                        <el-select v-model="importForm.buildingId" placeholder="请选择" autocomplete="off" @change="getAllSection()">
                            <el-option v-for="(item,index) in buildingList"
                                       :key="index"
                                       :label="item.name"
                                       :value="item.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="区域" class="itemlabel ">
                        <el-select v-model="importForm.sectionId" placeholder="请选择" autocomplete="off" >
                            <el-option v-for="(item,index) in sectionList"
                                       :key="index"
                                       :label="item.name"
                                       :value="item.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="downloadTemplate">模板下载</el-button>
                    </el-form-item>
                    <el-form-item>
                        <a href="javascript:;" class="file">
                            <el-button type="primary" @click="batchImport()">批量绑定<i
                                    class="el-icon-upload el-icon-right"></i>
                            </el-button>
                            <input id="upload" type="file" ref="uploadExcel" @change="readExcel"
                                   accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
                        </a>
                    </el-form-item>
                </el-form>

            </div>

            <div id="searchImportedDeviceDiv">
                <el-form :inline="true" :model="searchForm" size="mini" id="searchAllImportedDeviceForm">
                    <el-form-item label="用户" class="itemlabel ">
                        <el-select v-model="searchForm.customerId" placeholder="请选择" autocomplete="off" @change="getAllBuildingForSearchForm()">
                            <el-option v-for="(item,index) in customerList"
                                       :key="index"
                                       :label="item.name"
                                       :value="item.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="楼栋" class="itemlabel ">
                        <el-select v-model="searchForm.buildingId" placeholder="请选择" autocomplete="off" @change="getAllSectionForSearchForm()">
                            <el-option v-for="(item,index) in searchFormBuildingList"
                                       :key="index"
                                       :label="item.name"
                                       :value="item.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="区域" class="itemlabel ">
                        <el-select v-model="searchForm.sectionId" placeholder="请选择" autocomplete="off" >
                            <el-option v-for="(item,index) in searchFormSectionList"
                                       :key="index"
                                       :label="item.name"
                                       :value="item.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="设备名称" class="itemlabel ">
                        <el-input v-model="searchForm.deviceName" placeholder="设备名称"></el-input>
                    </el-form-item>

                    <el-form-item label="每页显示条数" class="itemlabel ">
                        <el-select v-model="searchForm.pageSize" autocomplete="off" size="mini">
                            <el-option key="10" label="10" value="10"></el-option>
                            <el-option key="20" label="20" value="20"></el-option>
                            <el-option key="30" label="30" value="30"></el-option>
                            <el-option key="40" label="40" value="40"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="find">查询</el-button>
                        <el-button type="primary">导出</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <div id="importedDeviceListDiv">
                <table width="100%" class="listTable">
                    <tr>
                        <th width="50px" align="center">No.</th>
                        <th width="200px">设备名称</th>
                        <th width="200px" align="center">设备编码</th>
                        <th width="200px" align="center">楼栋</th>
                        <th width="200px" align="center">区间</th>
                        <th>操作</th>
                    </tr>
                    <tr v-for="item in allBindedList" v-bind:key="item">
                        <td align="center">{{item.id}}</td>
                        <td>{{item.name}}</td>
                        <td align="center">{{item.code}}</td>
                        <td align="center">{{item.buildingName}}</td>
                        <td align="center">{{item.sectionName}}</td>
                        <td>
                            <a href="#" v-on:click="openModifyDevicePop(item)">修改</a>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <a href="#">删除</a>
                        </td>
                    </tr>

                </table>

            </div>

            <div id="pageDiv">
                <el-pagination
                        small="true"
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-size="20"
                        layout="total, prev, pager, next"
                        :total="total">
                </el-pagination>
            </div>

            <div id="modifyDeviceDiv">
                <input type="hidden" v-model="modifyDeviceForm.id">
                <table class="inputFormTable">
                    <tr>
                        <td colspan="2" align="center">设备信息修改</td>
                    </tr>
                    <tr>
                        <td width="100px" align="right">设备名称:</td>
                        <td>
                            <input type="text" v-model="modifyDeviceForm.deviceName">
                        </td>
                    </tr>
                    <tr>
                        <td align="right">设备编码:</td>
                        <td>
                            {{modifyDeviceForm.deviceCode}}
                        </td>
                    </tr>
                    <tr>
                        <td align="right">用户:</td>
                        <td>
                            <el-select size="mini" v-model="modifyDeviceForm.customerId" placeholder="请选择" autocomplete="off" @change="getAllBuildingForModifyForm()">
                                <el-option v-for="(item,index) in customerList"
                                           :key="index"
                                           :label="item.name"
                                           :value="item.id"
                                ></el-option>
                            </el-select>
                        </td>
                    </tr>
                    <tr>
                        <td align="right">楼栋:</td>
                        <td>
                            <el-select size="mini" v-model="modifyDeviceForm.buildingId" placeholder="请选择" autocomplete="off" @change="getAllSectionForModifyForm()">
                                <el-option v-for="(item,index) in modifyFormBuildingList"
                                           :key="index"
                                           :label="item.name"
                                           :value="item.id"
                                ></el-option>
                            </el-select>
                        </td>
                    </tr>
                    <tr>
                        <td align="right">区域:</td>
                        <td>
                            <el-select size="mini" v-model="modifyDeviceForm.sectionId" placeholder="请选择" autocomplete="off">
                                <el-option v-for="(item,index) in modifyFormSectionList"
                                           :key="index"
                                           :label="item.name"
                                           :value="item.id"
                                ></el-option>
                            </el-select>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" align="center">
                            <button v-on:click="saveDeviceModification">确定</button>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <button v-on:click="closeHistoryData">取消</button>
                        </td>
                    </tr>
                </table>
            </div>

        </div>
    </div>

</template>

<script>
import { getImportedDevice } from '@/api/admin'
import { hideBg } from '@/util/util'
import { activeBg } from '@/util/util'
import { displayPop } from '@/util/util'
import { hidePop } from '@/util/util'
import { updateDevice } from '@/api/admin'
import { getCustomer } from '@/api/admin'
import { getBuilding } from '@/api/admin'
import { getSection } from '@/api/admin'

export default {
    data () {
        return {
            importForm: {
                customerId: '',
                buildingId: '',
                sectionId: ''
            },
            searchForm: {
                customerId: '',
                buildingId: '',
                sectionId: '',
                deviceName: '',
                pageSize: 20
            },
            modifyDeviceForm: {
                id: '',
                deviceName: '',
                deviceCode: '',
                customerId: '',
                buildingId: '',
                sectionId: ''
            },
            currentPage: 1,
            total: 0,
            allBindedList: [],
            customerList: [],
            buildingList: [],
            searchFormBuildingList: [],
            modifyFormBuildingList: [],
            sectionList: [],
            searchFormSectionList: [],
            modifyFormSectionList: []
        }

    },
    created(){
        let menus = {
            parentMenu: '设备管理',
            childMenu: '设备绑定',
            parentMenuCode: 'device'
        }
        this.$store.commit('updateMenu',menus)
        this.getCustomerList()
        this.find()
    },

    methods: {
        find() {
            let params = {
                customerId: this.searchForm.customerId,
                buildingId: this.searchForm.buildingId,
                sectionId: this.searchForm.sectionId,
                deviceName: this.searchForm.deviceName,
                deviceCode: '',
                imei: '',
                sellStatus: 1,
                pageNum: this.currentPage,
                counts: this.searchForm.pageSize
            }
            getImportedDevice(params).then(response => {
                this.allBindedList = response.data.data
                this.total = response.data.paging.total
                this.currentPage = response.data.paging.pageNo
            })

        },
        openModifyDevicePop(item) {
            hideBg()
            displayPop('modifyDeviceDiv')
            this.modifyDeviceForm.id=item.id
            this.modifyDeviceForm.deviceName=item.name
            this.modifyDeviceForm.deviceCode=item.code
            this.modifyDeviceForm.customerId=item.customerId

            this.getAllBuildingForModifyForm()
            this.modifyDeviceForm.buildingId=item.buildingId

            this.getAllSectionForModifyForm()
            this.modifyDeviceForm.sectionId=item.sectionId
        },

        closeHistoryData() {
            hidePop('modifyDeviceDiv')
            activeBg()
            this.modifyDeviceForm.deviceName=''
            this.modifyDeviceForm.deviceCode=''
            this.modifyDeviceForm.imei=''
        },

        saveDeviceModification() {
            let params = {
                id: this.modifyDeviceForm.id,
                name: this.modifyDeviceForm.deviceName,
                code: this.modifyDeviceForm.deviceCode,
                customerId: this.modifyDeviceForm.customerId,
                buildingId: this.modifyDeviceForm.buildingId,
                sectionId: this.modifyDeviceForm.sectionId
            }
            if (this.modifyDeviceForm.customerId == '') {
                this.$message(
                {
                    type:"error",
                    message:"用户不能为空"
                })
                return;
            }
            if (this.modifyDeviceForm.buildingId == '') {
                this.$message(
                {
                    type:"error",
                    message:"楼栋不能为空"
                })
                return;
            }
            if (this.modifyDeviceForm.sectionId == '') {
                this.$message(
                {
                    type:"error",
                    message:"区域不能为空"
                })
                return;
            }
            updateDevice(params).then(
                response => {
                    if (response.data.statusCode.code == 200) {
                        this.$message(
                        {
                            type:"success",
                            message:response.data.statusCode.message
                        })
                        this.find()
                        this.closeHistoryData()
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

        getAllBuilding(){
            this.buildingList = []
            this.importForm.buildingId=''
            this.sectionList = []
            this.importForm.sectionId = ''
            let params = {
                name: '',
                customerId: this.importForm.customerId,
                pageNum: 1,
                counts: 1000
            }
            getBuilding(params).then(response => {
                this.buildingList = response.data.data
            })
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

        getAllBuildingForModifyForm(){
            this.modifyFormBuildingList = []
            this.modifyDeviceForm.buildingId=''
            this.modifyFormSectionList = []
            this.modifyDeviceForm.sectionId = ''
            let params = {
                name: '',
                customerId: this.modifyDeviceForm.customerId,
                pageNum: 1,
                counts: 1000
            }
            getBuilding(params).then(response => {
                this.modifyFormBuildingList = response.data.data
            })
        },

        getAllSection() {
            this.sectionList = []
            this.importForm.sectionId = ''
            let params = {
                name: '',
                customerId: '',
                buildingId: this.importForm.buildingId,
                pageNum: 1,
                counts: 1000
            }
            if (this.importForm.building == '') {
                this.sectionList = []
            }else {
                getSection(params).then(response => {
                    this.sectionList = response.data.data
                })
            }
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

        getAllSectionForModifyForm() {
            this.modifyFormSectionList = []
            this.modifyDeviceForm.sectionId = ''
            let params = {
                name: '',
                customerId: '',
                buildingId: this.modifyDeviceForm.buildingId,
                pageNum: 1,
                counts: 1000
            }
            if (this.modifyDeviceForm.building == '') {
                this.modifyFormSectionList = []
            }else {
                getSection(params).then(response => {
                    this.modifyFormSectionList = response.data.data
                })
            }
        },

        readExcel() {},
        downloadTemplate() {},
        batchImport() {},
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