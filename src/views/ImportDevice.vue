<template>
    <div id="mainDiv">
        <leftSide-view></leftSide-view>
        <div id="mainBlankDiv"></div>
        <div id="mainDataDiv">
            <div id="importDeivceFromFileDiv">
                <el-form :inline="true" size="mini">
                    <el-form-item>
                        <el-button type="primary" @click="downloadTemplate">模板下载</el-button>
                    </el-form-item>
                    <el-form-item>
                        <a href="javascript:;" class="file">
                            <el-button type="primary" @click="batchImport()">批量导入<i
                                    class="el-icon-upload el-icon-right"></i>
                            </el-button>
                            <input id="upload" type="file" ref="uploadExcel" @change="readExcel"
                                   accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
                        </a>
                    </el-form-item>
                </el-form>

            </div>

            <div id="searchImportedDeviceDiv">
                <table class="searchFormTable">
                    <tr>
                        <td align="right" width="60px">设备名称</td>
                        <td align="left" width="200px">
                            <input type="text" v-model="searchForm.deviceName" placeholder="" class="searchInput">
                        </td>
                        <td align="right" width="80px">设备编码</td>
                        <td align="left" width="200px" >
                            <input type="text" v-model="searchForm.deviceCode" placeholder="" class="searchInput">
                        </td>
                        <td align="right" width="60px">IMEI</td>
                        <td width="200px">
                            <input type="text" v-model="searchForm.imei" placeholder="" class="searchInput">
                        </td>
                    </tr>
                    <tr>
                        <td align="right" width="60px">用户状态</td>
                        <td align="left" width="200px">
                            <select v-model="searchForm.sellStatus" placeholder="请选择" class="searchSelect">
                                <option :value="item.value" v-for="item in sellStatusOptions" v-bind:key="item">{{item.label}}</option>
                            </select>
                        </td>
                        <td align="right" width="80px">每页显示数</td>
                        <td align="left" width="200px">
                            <select v-model="searchForm.pageSize" placeholder="请选择" class="searchSelect" @change="handleOnPageSizeChange">
                                <option :value="item.value" v-for="item in pageSizeOptions" v-bind:key="item">{{item.label}}</option>
                            </select>
                        </td>
                        <td align="center" width="300px" colspan="2">
                            <el-button size="mini" type="primary" @click="find">查询</el-button>
                        </td>
                    </tr>

                </table>


            </div>

            <div id="importedDeviceListDiv">
                <table width="100%" class="listTable">
                    <tr>
                        <th width="50px" align="center">序列号</th>
                        <th width="200px">设备名称</th>
                        <th width="200px" align="center">设备编码</th>
                        <th width="200px" align="center">IMEI</th>
                        <th width="200px" align="center">用户状态</th>
                        <th>操作</th>
                    </tr>
                    <tr v-for="item in allImportedList" v-bind:key="item">
                        <td align="center">{{item.sid}}</td>
                        <td>{{item.name}}</td>
                        <td align="center">{{item.code}}</td>
                        <td align="center">{{item.imei}}</td>
                        <td align="center">{{item.sellStatusStr}}</td>
                        <td>
                            <a href="#" v-on:click="openModifyDevicePop(item)">修改</a>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <a href="#" v-on:click="deleteDevice(item)">删除</a>
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
                            <input type="text" v-model="modifyDeviceForm.deviceCode">
                        </td>
                    </tr>
                    <tr>
                        <td align="right">IMEI:</td>
                        <td>
                            <input type="text" v-model="modifyDeviceForm.imei" readonly>
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
import { deleteDevice } from '@/api/admin'
import { patchImport } from '@/api/admin'
import { checkAccessible } from '@/api/admin'

import XLSX from 'xlsx'
export default {
    data () {
        return {
            sellStatusOptions: [
                {value: '', label: '请选择'},
                {value: 0, label: '未绑定'},
                {value: 1, label: '已绑定'}
            ],

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
                deviceName: '',
                deviceCode: '',
                imei: '',
                sellStatus: '',
                pageSize: 20
            },
            modifyDeviceForm: {
                id: '',
                deviceName: '',
                deviceCode: '',
                imei: ''
            },
            currentPage: 1,
            total: 100,
            allImportedList: [],
            arrList: [],

            dialogVisible: false
        }

    },
    created(){
        let menus = {
            parentMenu: '设备管理',
            childMenu: '设备导入',
            parentMenuCode: 'device'
        }
        this.$store.commit('updateMenu',menus)

        this.checkAccessible()
    },

    methods: {
        find() {
            let params = {
                deviceName: this.searchForm.deviceName,
                deviceCode: this.searchForm.deviceCode,
                imei: this.searchForm.imei,
                sellStatus: this.searchForm.sellStatus,
                customerId: '',
                buildingId: '',
                sectionId: '',
                pageNum: this.currentPage,
                counts: this.searchForm.pageSize
            }
            getImportedDevice(params).then(response => {
                this.allImportedList = response.data.data
                for (let i = 0; i < this.allImportedList.length; i++) {
                    this.allImportedList[i].sid = i+1
                }
                this.total = response.data.paging.total
                this.currentPage = response.data.paging.pageNo
            })

        },
        checkAccessible(){
            checkAccessible('building').then(
                response => {
                    if (response.data.statusCode.code == 403) {
                        this.$router.push("/noPermission");
                    }else {
                        this.find()
                    }
                }
            )
        },
        openModifyDevicePop(item) {
            hideBg()
            displayPop('modifyDeviceDiv')
            this.modifyDeviceForm.id=item.id
            this.modifyDeviceForm.deviceName=item.name
            this.modifyDeviceForm.deviceCode=item.code
            this.modifyDeviceForm.imei=item.imei
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
                imei: this.modifyDeviceForm.imei
            }
            if (this.modifyDeviceForm.deviceCode == '') {
                this.$message(
                {
                    type:"error",
                    message:"设备编码不能为空"
                })
                return;
            }
            if (this.modifyDeviceForm.imei == '') {
                this.$message(
                {
                    type:"error",
                    message:"imei不能为空"
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
                            imei: ws[index]["IMEI"] + "",
                            imsi: ws[index]["IMSI"] + ""
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

        batchImport() {
            if (this.arrList.length == 0) {
                this.$message(
                {   type:"error",
                    message:"未选择文件"
                })
                return;
            }
            let params = this.arrList
            patchImport(params).then(
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

        downloadTemplate() {
            require.ensure([], () => {
                const {
                        export_json_to_excel
                       } = require('../util/Export2Excel');
                const tHeader = ['NAME','IMEI','IMSI','CODE'];
                const filterVal = ['name','imei', 'imsi','code'];
                const list = [];
                const data = this.formatJson(filterVal, list);
                export_json_to_excel(tHeader, data, '导入设备的模板');
            })
        },

        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => v[j]))
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.find()
        },

        deleteDevice(item) {
            let params = {
                id: item.id
            }
            deleteDevice(params).then(
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