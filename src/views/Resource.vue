<template>
    <div id="mainDiv">
        <leftSide-view></leftSide-view>
        <div id="mainBlankDiv"></div>
        <div id="mainDataDiv">
            <div class="oneLineSearchDiv">
                <table class="searchFormTable">
                    <tr>
                        <td align="right" width="60px">资源名称</td>
                        <td align="left" width="200px">
                            <input type="text" v-model="searchForm.resourceName" placeholder="" class="searchInput">
                        </td>
                        <td align="right" width="80px">每页显示数</td>
                        <td align="left" width="200px">
                            <select v-model="searchForm.pageSize" placeholder="请选择" class="searchSelect">
                                <option :value="item.value" v-for="item in pageSizeOptions" v-bind:key="item">
                                    {{item.label}}
                                </option>
                            </select>
                        </td>
                        <td align="center" width="300px">
                            <el-button size="mini" type="primary" @click="find">查询</el-button>
                            <el-button size="mini" type="primary" @click="openAddResourcePop">新增</el-button>
                        </td>
                    </tr>

                </table>
            </div>

            <div class="oneLineSearchOutListDiv">
                <table width="100%" class="listTable">
                    <tr>
                        <th width="50px" align="center">No.</th>
                        <th width="100px">资源名称</th>
                        <th width="60px" align="left">模块</th>
                        <th width="100px" align="left">Path</th>
                        <th width="40px" align="left">Action</th>
                        <th width="100px" align="center">更多操作</th>
                    </tr>
                    <tr v-for="item in resourceList" v-bind:key="item">
                        <td align="center">{{item.id}}</td>
                        <td>{{item.resourceName}}</td>
                        <td>{{item.module}}</td>
                        <td>{{item.path}}</td>
                        <td>{{item.httpMethod}}</td>
                        <td align="center">
                            <a href="#"  v-on:click="openModifyResource(item)">修改</a>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <a href="#" v-on:click="deleteResource(item)">删除</a>
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

            <div id="addResourceDiv">
                <input type="hidden" v-model="addResourceForm.id">
                <table class="inputFormTable">
                    <tr>
                        <td colspan="2" align="center">新增资源</td>
                    </tr>

                    <tr>
                        <td width="100px" align="right">资源名称:</td>
                        <td>
                            <input type="text" v-model="addResourceForm.resourceName">
                        </td>
                    </tr>
                    <tr>
                        <td width="100px" align="right">模块:</td>
                        <td>
                            <input type="text" v-model="addResourceForm.module">
                        </td>
                    </tr>
                    <tr>
                        <td width="100px" align="right">Path:</td>
                        <td>
                            <input type="text" v-model="addResourceForm.path">
                        </td>
                    </tr>
                    <tr>
                        <td width="100px" align="right">Action:</td>
                        <td>
                            <input type="text" v-model="addResourceForm.httpMethod">
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" align="center">
                            <button v-on:click="saveResource">确定</button>
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
import { getResource } from '@/api/admin'
import { saveResource } from '@/api/admin'
import { updateResource } from '@/api/admin'
import { deleteResource } from '@/api/admin'

export default {

    data () {
        return {
            currentPage: 1,
            total: 0,

            resourceList: [],

            searchForm: {
                resourceName: '',
                pageSize: 20
            },

            addResourceForm: {
                id: '',
                resourceName: '',
                module: '',
                path: '',
                httpMethod: ''
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
            parentMenu: '权限管理',
            childMenu: '资源管理',
            parentMenuCode: 'permission'
        }
        this.$store.commit('updateMenu',menus)

        this.find()
    },

    methods: {
        find() {
            let params = {
                resourceName: this.searchForm.resourceName,
                counts: this.searchForm.pageSize,
                pageNum: this.currentPage
            }
            getResource(params).then(
                response => {
                    if (response.data.statusCode.code == 200){
                        this.resourceList = response.data.data
                        this.total = response.data.paging.total
                        this.currentPage = response.data.paging.pageNo
                    }else if (response.data.statusCode.code == 403) {
                        this.$router.push("/noPermission");
                    }
                }
            )
        },

        openAddResourcePop(){
            hideBg()
            displayPop('addResourceDiv')
            this.isAddFlag = 1
            this.addResourceForm.id = ''
            this.addResourceForm.resourceName = ''
            this.addResourceForm.module = ''
            this.addResourceForm.path = ''
            this.addResourceForm.httpMethod = ''
        },

        openModifyResource(item) {
            hideBg()
            displayPop('addResourceDiv')
            this.isAddFlag = 0
            this.addResourceForm.id = item.id
            this.addResourceForm.resourceName = item.resourceName
            this.addResourceForm.module = item.module
            this.addResourceForm.path = item.path
            this.addResourceForm.httpMethod = item.httpMethod
        },

        closeAdd(){
            hidePop('addResourceDiv')
            activeBg()
            this.isAddFlag = 0
            this.addResourceForm.id = ''
            this.addResourceForm.resourceName = ''
            this.addResourceForm.path = ''
            this.addResourceForm.httpMethod = ''
            this.addResourceForm.module = ''
        },

        handleCurrentChange(val) {
            this.currentPage = val
            this.find()
        },

        deleteResource(item) {
            let params = {
                id: item.id
            }
            deleteResource(params).then(
                response => {
                    if (response.data.statusCode.code == 200) {
                        this.$message(
                        {
                            type:"success",
                            message:response.data.statusCode.message
                        })
                        this.find(response.data.statusCode.code == 200)
                    }else{
                        this.$message(
                        {
                            type:"error",
                            message:response.data.statusCode.message
                        })
                    }
                }
            )
        },

        saveResource(){
            let params = {
                id: this.addResourceForm.id,
                resourceName: this.addResourceForm.resourceName,
                path: this.addResourceForm.path,
                httpMethod: this.addResourceForm.httpMethod,
                module: this.addResourceForm.module
            }
            if (this.isAddFlag == 1) {
                saveResource(params).then(
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
                updateResource(params).then(
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