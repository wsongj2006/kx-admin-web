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
                <el-form :inline="true" :model="searchForm" size="mini" id="searchAllImportedDeviceForm">
                    <el-form-item label="设备名称" class="itemlabel ">
                        <el-input v-model="searchForm.deviceName" placeholder="设备名称"></el-input>
                    </el-form-item>

                    <el-form-item label="设备编码" class="itemlabel ">
                        <el-input v-model="searchForm.deviceCode" placeholder="设备编码"></el-input>
                    </el-form-item>

                    <el-form-item label="IMEI" class="itemlabel ">
                        <el-input v-model="searchForm.imei" placeholder="IMEI"></el-input>
                    </el-form-item>

                    <el-form-item label="用户状态" class="itemlabel ">
                        <el-select v-model="searchForm.sellStatus" placeholder="用户状态" autocomplete="off">
                            <el-option key="all" label="所有" value=""></el-option>
                            <el-option
                                    v-for="item in sellStatusOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
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
                    </el-form-item>
                </el-form>

            </div>

            <div id="importedDeviceListDiv">
                <table width="100%" class="listTable">
                    <tr>
                        <th width="50px" align="center">No.</th>
                        <th width="200px">设备名称</th>
                        <th width="200px" align="center">设备编码</th>
                        <th width="200px" align="center">IMEI</th>
                        <th width="200px" align="center">用户状态</th>
                        <th>操作</th>
                    </tr>
                    <tr v-for="item in allImportedList" v-bind:key="item">
                        <td align="center">{{item.id}}</td>
                        <td>{{item.name}}</td>
                        <td align="center">{{item.code}}</td>
                        <td align="center">{{item.imei}}</td>
                        <td align="center">{{item.sellStatusStr}}</td>
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
export default {
    data () {
        return {
            sellStatusOptions: [
                {value: 0, label: '未绑定'},
                {value: 1, label: '已绑定'}
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

        this.find()
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