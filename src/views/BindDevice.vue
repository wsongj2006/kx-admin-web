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
                                    @change="searchBuildingForSearchForm">
                                <option :value="item.id" v-for="item in customerList" v-bind:key="item">{{item.name}}
                                </option>
                            </select>
                        </td>
                        <td align="right" width="80px">楼栋</td>
                        <td align="left" width="200px">
                            <select v-model="searchForm.buildingId" class="searchSelect"
                                    @change="getAllSectionForSearchForm()">
                                <option value="" label="所有"></option>
                                <option :value="item.id" v-for="item in searchFormBuildingList" v-bind:key="item">
                                    {{item.name}}
                                </option>
                            </select>
                        </td>
                        <td align="right" width="40px">区域</td>
                        <td align="left" width="400px">
                            <select v-model="searchForm.sectionId" class="searchSelect">
                                <option value="" label="所有"></option>
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
                            <select v-model="searchForm.pageSize" placeholder="请选择" class="searchSelect" @change="handleOnPageSizeChange">
                                <option :value="item.value" v-for="item in pageSizeOptions" v-bind:key="item">
                                    {{item.label}}
                                </option>
                            </select>
                        </td>
                        <td align="center" colspan="2">
                            <el-button size="mini" type="primary" @click="find">查询</el-button>
                            <el-button size="mini" type="primary" @click="openBindDevicePop">批量绑定</el-button>
                            <el-button size="mini" type="primary" @click="openBindSingleDevicePop">单个绑定</el-button>
                            <el-button type="primary" @click="downloadTemplate" size="mini">模板下载</el-button>
                        </td>
                    </tr>

                </table>

            </div>

            <div id="bindedDeviceListDiv">
                <table width="100%" class="listTable">
                    <tr>
                        <th width="50px" align="center">序列号</th>
                        <th width="300px">用户</th>
                        <th width="200px">设备名称</th>
                        <th width="200px" align="center">设备编码</th>
                        <th width="200px" align="center">楼栋</th>
                        <th width="200px" align="center">区间</th>
                        <th>操作</th>
                    </tr>
                    <tr v-for="item in allBindedList" v-bind:key="item">
                        <td align="center">{{item.sid}}</td>
                        <td>{{getCustomerName(item.customerId)}}</td>
                        <td>{{item.name}}</td>
                        <td align="center">{{item.code}}</td>
                        <td align="center">{{item.buildingName}}</td>
                        <td align="center">{{item.sectionName}}</td>
                        <td>
                            <a href="#" v-on:click="openModifyDevicePop(item)">修改</a>
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
                            <el-select size="mini" v-model="modifyDeviceForm.customerId" placeholder="请选择"
                                       autocomplete="off" @change="getAllBuildingForModifyForm()">
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
                            <el-select size="mini" v-model="modifyDeviceForm.buildingId" placeholder="请选择"
                                       autocomplete="off" @change="getAllSectionForModifyForm()">
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
                            <el-select size="mini" v-model="modifyDeviceForm.sectionId" placeholder="请选择"
                                       autocomplete="off">
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
                            <button v-on:click="closeDeviceModification">取消</button>
                        </td>
                    </tr>
                </table>
            </div>

            <div id="bindDevicePopDiv">
                <table class="inputFormTable">
                    <tr>
                        <td colspan="2" align="center">批量绑定</td>
                    </tr>
                    <tr>
                        <td align="right" width="100px">用户</td>
                        <td align="left" width="200px">
                            <select v-model="importForm.customerId" class="searchSelect" @change="getAllBuilding">
                                <option :value="item.id" v-for="item in customerList" v-bind:key="item">{{item.name}}
                                </option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td align="right">楼栋</td>
                        <td align="left" width="200px">
                            <select v-model="importForm.buildingId" class="searchSelect" @change="getAllSection()">
                                <option :value="item.id" v-for="item in buildingList" v-bind:key="item">{{item.name}}
                                </option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td align="right">区域</td>
                        <td align="left" width="200px">
                            <select v-model="importForm.sectionId" class="searchSelect">
                                <option :value="item.id" v-for="item in sectionList" v-bind:key="item">{{item.name}}
                                </option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td align="right" width="200px" colspan="2">
                            <el-button type="primary" @click="closeBindDevicePop" size="mini">取消</el-button>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <a href="javascript:;" class="file">
                                <el-button type="primary" @click="batchImport()" size="mini">批量绑定<i
                                        class="el-icon-upload el-icon-right"></i>
                                </el-button>
                                <input id="upload" type="file" ref="uploadExcel" @change="readExcel"
                                       accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" align="left">
                            <p class="errorMsgFont">{{this.bindErrorMsg}}</p>
                        </td>
                    </tr>
                </table>

            </div>

            <div id="bindSingleDevicePopDiv">
                <table class="inputFormTable">
                    <tr>
                        <td colspan="2" align="center">设备绑定</td>
                    </tr>
                    <tr>
                        <td align="right" width="100px">用户</td>
                        <td align="left" width="200px">
                            <select v-model="singleBindForm.customerId" class="searchSelect" @change="getAllBuildingForSingleBind">
                                <option :value="item.id" v-for="item in customerList" v-bind:key="item">{{item.name}}
                                </option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td align="right">楼栋</td>
                        <td align="left" width="200px">
                            <select v-model="singleBindForm.buildingId" class="searchSelect" @change="getAllSectionForSingleBind()">
                                <option :value="item.id" v-for="item in buildingList" v-bind:key="item">{{item.name}}
                                </option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td align="right">区域</td>
                        <td align="left" width="200px">
                            <select v-model="singleBindForm.sectionId" class="searchSelect">
                                <option :value="item.id" v-for="item in sectionList" v-bind:key="item">{{item.name}}
                                </option>
                            </select>
                        </td>
                    </tr>

                    <tr>
                        <td align="right">设备编码</td>
                        <td align="left" width="200px">
                            <input type="text" v-model="singleBindForm.code" placeholder="" class="searchInput">
                        </td>
                    </tr>

                    <tr>
                        <td align="center" width="200px" colspan="2">
                            <el-button type="primary" @click="closeBindSingleDevicePop" size="mini">取消</el-button>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <el-button type="primary" @click="singleBind" size="mini">确定</el-button>
                        </td>
                    </tr>

                    <tr>
                        <td colspan="2" align="left">
                            <p class="errorMsgFont">{{this.bindErrorMsg}}</p>
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
import { getCustomerForUser } from '@/api/admin'
import { getBuilding } from '@/api/admin'
import { getSection } from '@/api/admin'
import { patchBind } from '@/api/admin'
import { singleBind } from '@/api/admin'

import XLSX from 'xlsx'

export default {
    data () {
        return {
            importForm: {
                customerId: '',
                buildingId: '',
                sectionId: ''
            },
            singleBindForm: {
                customerId: '',
                buildingId: '',
                sectionId: '',
                code: ''
            },
            pageSizeOptions: [
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
            modifyFormSectionList: [],
            arrList: [],
            bindErrorMsg: ''
        }

    },
    created(){
        let menus = {
            parentMenu: '设备管理',
            childMenu: '设备绑定',
            parentMenuCode: 'device'
        }
        this.$store.commit('updateMenu',menus)
        this.getAllCustomer()
        this.getAllBuildingForSearchForm();

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
                for (let i = 0; i < this.allBindedList.length; i++) {
                    this.allBindedList[i].sid = i+1
                }
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

        closeDeviceModification() {
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
                        this.closeDeviceModification()
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

        getAllBuildingForSingleBind(){
            this.buildingList = []
            this.singleBindForm.buildingId=''
            this.sectionList = []
            this.singleBindForm.sectionId = ''
            let params = {
                name: '',
                customerId: this.singleBindForm.customerId,
                pageNum: 1,
                counts: 1000
            }
            getBuilding(params).then(response => {
                this.buildingList = response.data.data
            })
        },

        getAllBuildingForSearchForm(){
            let isSupperAdmin = localStorage.getItem("isSupperAdmin")
            if (isSupperAdmin == 0) {
                this.searchForm.customerId = localStorage.getItem("customerId")
                this.searchBuildingForSearchForm()
            }
        },

        searchBuildingForSearchForm(){
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

        getAllSectionForSingleBind() {
            this.sectionList = []
            this.singleBindForm.sectionId = ''
            let params = {
                name: '',
                customerId: '',
                buildingId: this.singleBindForm.buildingId,
                pageNum: 1,
                counts: 1000
            }
            if (this.singleBindForm.building == '') {
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

        openBindDevicePop(item) {
            this.bindErrorMsg = ''
            hideBg()
            this.importForm.customerId=''
            this.importForm.buildingId=''
            this.importForm.sectionId=''
            this.arrayList = []
            displayPop('bindDevicePopDiv')
        },

        closeBindDevicePop() {
            this.bindErrorMsg = ''
            hidePop('bindDevicePopDiv')
            activeBg()
            this.importForm.customerId=''
            this.importForm.buildingId=''
            this.importForm.sectionId=''
            this.arrayList = []
        },

        openBindSingleDevicePop(item) {
            this.bindErrorMsg = ''
            hideBg()
            this.singleBindForm.customerId=''
            this.singleBindForm.buildingId=''
            this.singleBindForm.sectionId=''
            this.singleBindForm.code=''
            displayPop('bindSingleDevicePopDiv')
        },

        closeBindSingleDevicePop(item) {
            this.bindErrorMsg = ''
            hidePop('bindSingleDevicePopDiv')
            activeBg()
            this.singleBindForm.customerId=''
            this.singleBindForm.buildingId=''
            this.singleBindForm.sectionId=''
            this.singleBindForm.code=''
        },

        readExcel(e){
            const files = e.target.files;
            if (files.length <= 0) {
                return false;
            }
            const fileReader = new FileReader();
            fileReader.onload = ev => {
                try {
                    const data = ev.target.result;
                    const workbook = XLSX.read(data, {
                        type: "binary"
                    });
                    const wsname = workbook.SheetNames[0]; //取第一张表
                    const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]); //获取到XLSX表格中的数据,并生成json格式的数据类型
                    console.log(ws)
                    let arr = [];
                    ws.forEach((value, index, ws) => {
                        arr.push({
                            name: ws[index]["NAME"] + "",
                            code: ws[index]["CODE"] + "",
                        });
                    })
                    this.arrList=arr//给arrList赋值,确定导入时传入

                    for(let i in arr){
                        let item = arr[i]
                        for(let key in item){
                            if(item[key] == "undefined"){
                                delete item[key]
                            }
                        }
                    }

                } catch (e) {
                    return false;
                }
            };
            fileReader.readAsBinaryString(files[0]);
        },

        downloadTemplate() {
            require.ensure([], () => {
                const {
                        export_json_to_excel
                       } = require('../util/Export2Excel');
                const tHeader = ['NAME','CODE'];
                const filterVal = ['name','code'];
                const list = [];
                const data = this.formatJson(filterVal, list);
                export_json_to_excel(tHeader, data, '设备绑定的模板');
            })
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => v[j]))
        },

        batchImport() {
            if (this.importForm.customerId == '') {
                this.$message(
                {   type:"error",
                    message:"用户不能为空"
                })
                return;
            }

            if (this.arrList.length == 0) {
                this.$message(
                {   type:"error",
                    message:"未选择文件"
                })
                return;
            }
            let params = {
                list: this.arrList,
                customerId: this.importForm.customerId,
                buildingId: this.importForm.buildingId,
                sectionId: this.importForm.sectionId
            }
            patchBind(params).then(
                response => {
                    if (response.data.statusCode.code == 200) {
                        this.$message(
                        {
                            type:"success",
                            message:response.data.statusCode.message
                        })
                        this.closeBindDevicePop()
                        this.find()
                    }else if (response.data.statusCode.code == 2061) {
                        this.$message(
                        {
                            type:"error",
                            message:"绑定失败！"
                        })
                        this.bindErrorMsg = "如下设备不正确，请修正文件：" + response.data.statusCode.message

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

        singleBind() {
            if (this.singleBindForm.customerId == '') {
                this.$message(
                {   type:"error",
                    message:"用户不能为空"
                })
                return;
            }

            if (this.singleBindForm.code == '') {
                this.$message(
                {   type:"error",
                    message:"设备编号不能为空"
                })
                return;
            }
            let params = {
                customerId: this.singleBindForm.customerId,
                buildingId: this.singleBindForm.buildingId,
                sectionId: this.singleBindForm.sectionId,
                code: this.singleBindForm.code
            }
            singleBind(params).then(
                response => {
                    if (response.data.statusCode.code == 200) {
                        this.$message(
                        {
                            type:"success",
                            message:response.data.statusCode.message
                        })
                        this.closeBindSingleDevicePop()
                        this.find()
                    }else {
                        this.$message(
                        {
                            type:"error",
                            message:"设备号不正确！"
                        })
                    }
                }
            )
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