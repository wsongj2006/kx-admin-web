<template>
    <div id="mainDiv">
        <leftSide-view></leftSide-view>
        <div id="mainBlankDiv"></div>
        <div id="mainDataDiv">
            <div class="twoLineSearchDiv">
                <table class="searchFormTable">
                    <tr>
                        <td align="right" width="60px">用户</td>
                        <td align="left" width="220px">
                            <select v-model="searchForm.customerId" class="searchSelect"
                                    @change="getAllBuildingForSearchForm()">
                                <option value="">请选择</option>
                                <option :value="item.id" v-for="item in customerList" v-bind:key="item">{{item.name}}
                                </option>
                            </select>
                        </td>

                        <td align="right" width="40px">楼栋</td>
                        <td align="left" width="220px">
                            <select v-model="searchForm.buildingId" class="searchSelect">
                                <option value="">请选择</option>
                                <option :value="item.id" v-for="item in searchFormBuildingList" v-bind:key="item">
                                    {{item.name}}
                                </option>
                            </select>
                        </td>

                        <td align="right" width="60px">区域名称</td>
                        <td align="left" width="200px">
                            <input type="text" v-model="searchForm.sectionName" placeholder="" class="searchInput">
                        </td>
                    </tr>
                    <tr>
                        <td align="right" width="80px">每页显示数</td>
                        <td align="left" width="200px">
                            <select v-model="searchForm.pageSize" placeholder="请选择" class="searchSelect">
                                <option :value="item.value" v-for="item in pageSizeOptions" v-bind:key="item">
                                    {{item.label}}
                                </option>
                            </select>
                        </td>
                        <td align="left" width="300px" colspan="4">
                            <el-button size="mini" type="primary" @click="find">查询</el-button>
                            <el-button size="mini" type="primary" @click="openAddSectionPop">新增</el-button>
                        </td>
                    </tr>

                </table>
            </div>

            <div class="twoLineSearchOutDiv">
                <table width="100%" class="listTable">
                    <tr>
                        <th width="50px" align="center">No.</th>
                        <th width="100px">用户</th>
                        <th width="100px" align="left">楼栋名称</th>
                        <th width="100px" align="left">区域名称</th>
                        <th width="100px" align="center">更多操作</th>
                    </tr>
                    <tr v-for="item in sectionList" v-bind:key="item">
                        <td align="center">{{item.id}}</td>
                        <td>{{getCustomerName(item.customerId)}}</td>
                        <td>{{item.buildingName}}</td>
                        <td>{{item.name}}</td>
                        <td align="center">
                            <a href="#" v-on:click="openModifySection(item)">修改</a>
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

            <div id="addSectionDiv">
                <input type="hidden" v-model="addSectionForm.id">
                <table class="inputFormTable">
                    <tr>
                        <td colspan="2" align="center">新增区域</td>
                    </tr>
                    <tr>
                        <td width="100px" align="right">用户:</td>
                        <td>
                            <select v-model="addSectionForm.customerId" class="searchSelect" @change="getAllBuilding">
                                <option value="">请选择</option>
                                <option :value="item.id" v-for="item in customerList" v-bind:key="item">{{item.name}}
                                </option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td width="100px" align="right">楼栋:</td>
                        <td>
                            <select v-model="addSectionForm.buildingId" class="searchSelect">
                                <option value="">请选择</option>
                                <option :value="item.id" v-for="item in buildingList" v-bind:key="item">{{item.name}}
                                </option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td width="100px" align="right">区域名称:</td>
                        <td>
                            <input type="text" v-model="addSectionForm.sectionName">
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" align="center">
                            <button v-on:click="saveSection">确定</button>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <button v-on:click="closeAdd">取消</button>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import { hideBg } from '@/util/util'
import { activeBg } from '@/util/util'
import { displayPop } from '@/util/util'
import { hidePop } from '@/util/util'
import { getCustomer } from '@/api/admin'
import { getBuilding } from '@/api/admin'
import { getSection } from '@/api/admin'
import { addSection } from '@/api/admin'
import { updateSection } from '@/api/admin'
import { checkAccessible } from '@/api/admin'

export default {

    data () {
        return {
            currentPage: 1,
            total: 0,

            customerList: [],
            buildingList: [],
            sectionList: [],
            searchFormBuildingList: [],

            searchForm: {
                customerId: '',
                buildingId: '',
                sectionName: '',
                pageSize: 20
            },

            addSectionForm: {
                id: '',
                customerId: '',
                buildingId: '',
                sectionName: ''
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

            isAddFlag: 0

        }

    },
    created() {

        let menus = {
            parentMenu: '系统设置',
            childMenu: '区域管理',
            parentMenuCode: 'setup'
        }
        this.$store.commit('updateMenu',menus)

        this.checkAccessible()
    },

    methods: {
        checkAccessible(){
            checkAccessible('section').then(
                response => {
                    if (response.data.statusCode.code == 403) {
                        this.$router.push("/noPermission");
                    }else {
                        this.getCustomerList()
                        this.find()
                    }
                }
            )
        },

        find() {
            let params = {
                name: this.searchForm.sectionName,
                customerId: this.searchForm.customerId,
                buildingId: this.searchForm.buildingId,
                counts: this.searchForm.pageSize,
                pageNum: this.currentPage
            }
            getSection(params).then(
                response => {
                    this.sectionList = response.data.data
                    this.total = response.data.paging.total
                    this.currentPage = response.data.paging.pageNo
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

        getAllBuildingForSearchForm(){
            this.searchForm.buildingId = ''
            this.searchFormBuildingList = []
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

        getAllBuilding(){
            this.buildingList = []
            this.addSectionForm.buildingId=''
            let params = {
                name: '',
                customerId: this.addSectionForm.customerId,
                pageNum: 1,
                counts: 1000
            }
            getBuilding(params).then(response => {
                this.buildingList = response.data.data
            })
        },

        openAddSectionPop(){
            hideBg()
            displayPop('addSectionDiv')
            this.isAddFlag = 1
            this.addSectionForm.id = ''
            this.addSectionForm.customerId = ''
            this.addSectionForm.buildingId = ''
            this.addSectionForm.sectionName = ''
        },

        openModifySection(item) {
            hideBg()
            displayPop('addSectionDiv')
            this.isAddFlag = 0
            this.addSectionForm.id = item.id
            this.addSectionForm.customerId = item.customerId
            this.getAllBuilding()

            this.addSectionForm.buildingId = item.buildingId
            this.addSectionForm.sectionName = item.name
        },

        closeAdd(){
            hidePop('addSectionDiv')
            activeBg()
            this.isAddFlag = 0
            this.addSectionForm.id = ''
            this.addSectionForm.customerId = ''
            this.addSectionForm.buildingId = ''
            this.addSectionForm.sectionName = ''
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

        saveSection(){
            let params = {
                id: this.addSectionForm.id,
                customerId: this.addSectionForm.customerId,
                buildingId: this.addSectionForm.buildingId,
                name: this.addSectionForm.sectionName
            }
            if (this.isAddFlag == 1) {
                addSection(params).then(
                    response => {
                        if (response.data.statusCode.code == 200) {
                            this.$message(
                            {
                                type:"success",
                                message:response.data.statusCode.message
                            })
                            this.find()
                            this.closeAdd()
                        }else {
                            this.$message(
                            {
                                type:"error",
                                message:response.data.statusCode.message
                            })
                        }
                    }
                )
            }else {
                updateSection(params).then(
                    response => {
                        if (response.data.statusCode.code == 200) {
                            this.$message(
                            {
                                type:"success",
                                message:response.data.statusCode.message
                            })
                            this.find()
                            this.closeAdd()
                        }else {
                            this.$message(
                            {
                                type:"error",
                                message:response.data.statusCode.message
                            })
                        }
                    }
                )
            }
        }
    }
}

</script>