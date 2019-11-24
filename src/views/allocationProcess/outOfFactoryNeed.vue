<template>
    <div class='app-container'>
        <el-container>
            <div class="formSearch">
                <el-form :inline="true">
                    <el-form-item label="单据编号">
                        <el-input class="filter-item input" v-model="listQuery.documnetCode" clearable>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="固定资产编号">
                        <el-input class="filter-item input" v-model="listQuery.fixedAssetCode" clearable>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="设备名称">
                        <el-input class="filter-item input" v-model="listQuery.equipmentName" clearable>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="型号规格">
                        <el-input class="filter-item input" v-model="listQuery.model" clearable>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="申请时间">
                        <el-date-picker v-model="value01" type="daterange" unlink-panels start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" clearable @change="searchChange()">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="filter-item" type="primary" style="float:right" icon="el-icon-search" @click="handleFilter">搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-main style="padding:20px 0">
                <el-table :key='tableKey' :data="tableData" height="200" row-key="id" v-loading="listLoading" border fit highlight-current style="width: 100%;margin-top:10px;min-height:500px" :header-cell-style="{background:'oldlace'}">
                    <el-table-column align="center" label="单据编号">
                        <template slot-scope="scope">
                            <span class="look-detail" @click="handleDetail(scope.row)">{{scope.row.documentCode}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="applyDate" label="申请时间">
                        <template slot-scope="scope">
                            {{scope.row.applyDate!==null?scope.row.applyDate.substring(0,10):''}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="固定资产编号" prop="fixedAssetCode">
                    </el-table-column>
                    <el-table-column align="center" label="设备名称" prop="equipmentName">
                    </el-table-column>
                    <el-table-column align="center" label="型号规格" prop="model">
                    </el-table-column>
                    <el-table-column align="center" label="折旧年限" prop="depreciationPeriod">
                    </el-table-column>
                    <el-table-column align="center" label="新设备位置" prop="newUnusedLocality">
                    </el-table-column>
                    <el-table-column align="center" label="审核状态" prop="checkStart">
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="140px">
                        <template slot-scope="scope">
                            <el-button title="转办" type="success" icon="el-icon-share" size="mini" @click="changeHandle(scope.row)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-main>
            <el-footer>
                <div class="pagination-container">
                    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[5,10,15, 20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                    </el-pagination>
                </div>
            </el-footer>
            <!-- 查看 -->
            <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="60%" v-loading="listLoading" v-dialogDrag :close-on-click-modal="false">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="表单信息" name="first">
                        <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="110px">
                            <el-form-item>
                                <span class="equip-title">闲置设备出厂单</span>
                            </el-form-item>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="单据编号" prop="documentCode">
                                        <el-input v-model="temp.documentCode" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="申请时间" prop="applyDate">
                                        <el-date-picker style="width:100%" v-model="temp.applyDate" type="date" disabled>
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="固定资产编号" prop="fixedAssetCode">
                                        <el-input v-model="temp.fixedAssetCode" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="设备名称" prop="equipmentName">
                                        <el-input v-model="temp.equipmentName" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="型号规格" prop="model">
                                        <el-input v-model="temp.model" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="使用公司" prop="companyName">
                                        <el-input v-model="temp.companyName" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="使用工厂" prop="factoryName">
                                        <el-input v-model="temp.factoryName" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="使用部门" prop="divisionNode">
                                        <el-input v-model="temp.divisionNode" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="闲置申请单编号" prop="unusedFormCode">
                                        <el-input v-model="temp.unusedFormCode" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="11">
                                    <el-form-item label="账面净值" prop="netBookValue">
                                        <el-input v-model="temp.netBookValue" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="1" style="padding:0px;font-size:20px;font-weight:800;">
                                    <span>元</span>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="11">
                                    <el-form-item label="折旧年限" prop="depreciationPeriod">
                                        <el-input v-model="temp.depreciationPeriod" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="1" style="padding:0px;font-size:20px;font-weight:800;">
                                    <span>年</span>
                                </el-col>
                                <el-col :span="11">
                                    <el-form-item label="财务原值" prop="originalFinancialValue">
                                        <el-input v-model="temp.originalFinancialValue" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="1" style="padding:0px;font-size:20px;font-weight:800;">
                                    <span>元</span>
                                </el-col>
                            </el-row>
                            <el-form-item label="出厂原因" prop="reasons">
                                <el-input type="textarea" maxlength="200" v-model="temp.reasons" :disabled="tzsqTask"></el-input>
                            </el-form-item>
                            <el-form-item label="新闲置位置" prop="newUnusedLocality">
                                <el-input type="textarea" maxlength="200" v-model="temp.newUnusedLocality" :disabled="tzsqTask"></el-input>
                            </el-form-item>
                            <el-form-item label="备注" prop="remark">
                                <el-input type="textarea" maxlength="200" v-model="temp.remark" :disabled="tzsqTask"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="流转记录" name="second">
                        <el-table :data="recordData" height="500" border fit highlight-current style="width: 100%;">
                            <el-table-column align="center" type="index" label="序号" min-width="100">
                            </el-table-column>
                            <el-table-column prop="taskName" align="center" label="步骤名称">
                            </el-table-column>
                            <el-table-column prop="userName" align="center" label="操作人">
                            </el-table-column>
                            <el-table-column prop="orgName" align="center" label="所在部门">
                            </el-table-column>
                            <el-table-column prop="stationName" align="center" label="岗位">
                            </el-table-column>
                            <el-table-column prop="state" align="center" label="状态">
                            </el-table-column>
                            <el-table-column prop="opinion" align="center" label="意见">
                            </el-table-column>

                            <el-table-column prop="dateTime" align="center" label="时间">
                            </el-table-column>
                            <el-table-column prop="remark" align="center" label="备注">
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="流程图" name="three">
                        <div id="imgcontainer">
                            <img id="pic" :src="chartData" />
                        </div>
                    </el-tab-pane>
                </el-tabs>
                <!-- 按钮组 -->
                <el-form class="formDw">
                    <el-form-item>
                        <el-button type="primary" @click="dialogFormVisible = false">返回</el-button>
                        <el-button type="primary" @click="agreeData" v-if="tzsqTask">同意</el-button>
                        <el-button type="primary" @click="againSubmit" v-if="!tzsqTask">提交</el-button>
                        <el-button type="primary" @click="endbtn" v-if="!tzsqTask">结束流程</el-button>
                        <el-button type="primary" @click="unAgreeData" v-if="tzsqTask">退回</el-button>
                        <!-- <el-button type="primary" @click="printData" v-if="zcbfbzShow">打印</el-button> -->
                    </el-form-item>
                </el-form>
            </el-dialog>
            <!-- 同意/退回 -->
            <el-dialog :title="textMap[dialogStatus]" :visible.sync="agreeDialogVisible" width="30%" :close-on-click-modal="false" v-dialogDrag>
                <el-form :model="popData" label-position="left" label-width="50px">
                    <span style="color:red;position:absolute;top:90px;left:13px">*</span>
                    <el-form-item label="意见" prop="opinion">
                        <el-input type="textarea" maxlength="128" v-model="popData.opinion"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="agreeDialogVisible = false">取消</el-button>
                    <el-button v-if="dialogStatus=='agree'" type="primary" @click="createData">同意</el-button>
                    <el-button v-if="dialogStatus=='unagree'" type="primary" @click="updateData">确定</el-button>
                </div>
            </el-dialog>
            <!-- 打印 -->
            <el-dialog title="闲置设备出厂单打印预览" v-dialogDrag :close-on-click-modal="false" :visible.sync="printDialogVisible" width="70%">
                <el-button type="primary" @click="printDialogVisible = false">返回</el-button>
                <el-button type="success" v-print="'#printTest'">
                    <svg-icon icon-class="print" />打印</el-button>
                <div id="printTest">
                    <table border="0">
                        <caption style="font-family:SimHei;font-size: 16px;">
                            <p>{{printList.companyName}}</p>
                            <p>闲置设备出厂单</p>
                        </caption>
                        <thead>
                            <tr>
                                <th colspan="8" style="text-align: left;">{{'使用公司：' + printObj.companyName + '　　' +'使用工厂：' +  printObj.factoryName + '　　' + '使用部门：' + printObj.divisionNode }}</th>
                                <th colspan="4" style="text-align: right;">单据编号:{{printObj.documentCode}}&nbsp;&nbsp;&nbsp;&nbsp;</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td rowspan="2" colspan="2">固定资产编号</td>
                                <td rowspan="2" colspan="2">设备名称</td>
                                <td rowspan="2" colspan="2">型号规格</td>
                                <td rowspan="2" colspan="2">闲置申请单编号</td>
                                <td rowspan="2" colspan="2">折旧年限</td>
                                <td colspan="2">固定资产价值(元)</td>
                            </tr>
                            <tr>
                                <td>财务原值</td>
                                <td>账面净值</td>
                            </tr>
                            <tr>
                                <td style="width:80px;" colspan="2">{{printObj.fixedAssetCode}}</td>
                                <td style="width:80px;" colspan="2">{{printObj.equipmentName}}</td>
                                <td style="width:80px;" colspan="2">{{printObj.model}}</td>
                                <td style="width:80px;" colspan="2">{{printObj.unusedFormCode}}</td>
                                <td style="width:80px;" colspan="2">{{printObj.depreciationPeriod}}</td>
                                <td style="width:80px;">{{printObj.originalFinancialValue}}</td>
                                <td style="width:80px;">{{printObj.netBookValue}}</td>
                            </tr>
                            <tr>
                                <td colspan="2" style="text-align:left">出厂原因</td>
                                <td colspan="10" style="text-align:left">{{printObj.reasons}}</td>
                            </tr>
                            <tr>
                                <td colspan="2" style="width:80px;text-align:left">新闲置位置</td>
                                <td style="width:160px;text-align:left" colspan="4">{{printObj.newUnusedLocality}}</td>
                                <td colspan="2" style="width:80px;text-align:left">备注</td>
                                <td style="width:160px;text-align:left" colspan="4">{{printObj.remark}}</td>                                
                            </tr>
                            <tr style="height:40px;">
                                <td colspan="3">经办人签字</td>
                                <td colspan="3">设备科科长</td>
                                <td colspan="3">设备副总</td>
                                <td colspan="3">资产部</td>
                            </tr>
                            <tr style="height:80px;text-align:left">
                                <td colspan="3" style="border-bottom:1px solid #fff"></td>
                                <td colspan="3" style="border-bottom:1px solid #fff">{{printList.sbkkzOpinion}}</td>
                                <td colspan="3" style="border-bottom:1px solid #fff">{{printList.sbfzOpinion}}</td>
                                <td colspan="3" style="border-bottom:1px solid #fff">{{printList.zcbfbzOpinion}}</td>
                            </tr>
                            <tr style="text-align:left">
                                <td colspan="3">经办人：{{printList.fqr}}</td>
                                <td colspan="3">经办人：{{printList.sbkkz}}</td>
                                <td colspan="3">经办人：{{printList.sbfz}}</td>
                                <td colspan="3">经办人：{{printList.zcbfbz}}</td>
                            </tr>
                            <tr style="text-align:left">
                                <td colspan="3" style="border-top:1px solid #fff">
                                    日期：{{printList.fqrDate!=null?printList.fqrDate.substring(0,10):''}}</td>
                                <td colspan="3" style="border-top:1px solid #fff">
                                    日期：{{printList.sbkkzDate!=null?printList.sbkkzDate.substring(0,10):''}}</td>
                                <td colspan="3" style="border-top:1px solid #fff">
                                    日期：{{printList.sbfzDate!=null?printList.sbfzDate.substring(0,10):''}}</td>
                                <td colspan="3" style="border-top:1px solid #fff">
                                    日期：{{printList.zcbfbzDate!=null?printList.zcbfbzDate.substring(0,10):''}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </el-dialog>
            <!-- 选择人员 -->
            <el-dialog width="60%" :close-on-click-modal="false" title="请选择转办接收人员" :visible.sync="innerVisiblePerson" append-to-body v-dialogDrag>
                <el-header>
                    <el-form :inline="true" class="demo-form-inline">
                        <el-form-item label="姓名">
                            <el-input v-model="listQuery2.perName" placeholder="请输入姓名">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="工号">
                            <el-input v-model="listQuery2.workNumber" placeholder="请输入工号">
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" @click="handlePerson">搜索</el-button>
                        </el-form-item>
                    </el-form>
                </el-header>
                <el-container>
                    <el-aside>
                        <el-tree :data="personOrgData" :props="defaultProps1" @node-click="handleNodeClick" v-loading="treeLoading" :render-content="renderContent"></el-tree>
                    </el-aside>
                    <el-main>
                        <el-table height='500' :data="orgListData" v-loading="listLoading" border fit highlight-current-row style="width: 100%;min-height:300px;margin-top:8px">
                            <el-table-column prop="orgName" align="center" label="部门" min-width="50">
                            </el-table-column>
                            <el-table-column prop="perName" align="center" label="人员" min-width="50">
                            </el-table-column>
                            <el-table-column align="center" label="工号" min-width="50">
                                <template slot-scope="scope">
                                    <a class="look-detail" @click="chooseReplace(scope.row)">{{scope.row.workNumber}}</a>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-main>
                </el-container>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="innerVisiblePerson = false">取消</el-button>
                </div>
            </el-dialog>
        </el-container>
    </div>
</template>

<script>
import { fetchNeedList, getDetail, agreeApply, reCommit, fetchPrint } from '@/api/allocationProcess/outOfFactory'
import { endProcess, uploadlist, fileList, deleteFileById, getCurrentUser, insertFile, recordList, getCurrentTask, processChart, fetchComTree, fetchComByCode, fetchOrgTree, fetchChooseTree, choosePersonList, transferList } from '@/api/common/common'
import { baseUrl } from '@/api/common/fileBaseUrl'
export default {
    name: "outOfFactoryNeed",
    data() {
        return {
            chartData: null, // 流程图
            // 节点判断是否可输入
            tzsqTask: true, // 调整申请
            zcbfbzShow: false, // 资产部副部长审核
            fileshow: false,
            // 弹框组
            dialogFormVisible: false, // 查看
            agreeDialogVisible: false, // 同意/退回
            // 表格数据
            tableData: [],
            tableKey: 0,
            listLoading: false,
            total: null,
            value01: undefined,
            pageNum: 1,
            pageSize: 10,
            listQuery: {
                documnetCode: undefined,
                fixedAssetCode: undefined,
                model: undefined,
                equipmentName: undefined,
                applyDateStart: undefined,
                applyDateEnd: undefined
            },
            id: undefined,
            temp: {
                id: undefined,
                companyCode: undefined,
                companyName: undefined,
                depreciationPeriod: undefined,
                divisionCode: undefined,
                divisionNode: undefined,
                equipmentName: undefined,
                factoryCode: undefined,
                factoryName: undefined,
                fixedAssetCode: undefined,
                model: undefined,
                netBookValue: undefined,
                newUnusedLocality: undefined,
                originalFinancialValue: undefined,
                reasons: undefined,
                remark: undefined,
                unusedFormCode: undefined,
                proxyOrgCode: undefined
            },
            // 任务审批
            popData: {
                leaderPass: undefined,
                opinion: undefined,
                taskId: undefined, // 任务id
                processInstanceId: undefined
            },
            taskId: undefined,
            defaultProps1: {
                children: "children",
                label: "orgFullName"
            },
            // 选择人员
            innerVisiblePerson: false,
            listQuery2: {
                pageNum: 1,
                pageSize: 1000,
                perName: undefined,
                workNumber: undefined
            },
            personOrgData: [],
            orgListData: [],
            treeLoading: false,
            changeProcessId: undefined,
            dialogStatus: "",
            textMap: {
                detail: "查看",
                agree: "同意办理",
                unagree: "退回办理"
            },
            dialogStatus1: "",
            userId: undefined, // 用户id
            documentWordCode: undefined, // 单据编号
            // 流程
            nodeKey: undefined, // 节点key
            nodeName: undefined, // 节点名称
            processInstanceId: undefined, // 流程实例id
            printDialogVisible: false,
            printList: {
                fqr: null,
                fqrDate: null,
                sbkkz: null,
                sbkkzOpinion: null,
                sbkkzDate: null,
                sbfz: null,
                sbfzOpinion: null,
                sbfzDate: null,
                zcbfbz: null,
                zcbfbzOpinion: null,
                zcbfbzDate: null
            },
            printId: "",
            printObj: {},
            lcData: [],
            // 流转记录
            recordData: null,
            activeName: "first",
            rules: {
                reasons: [{ required: true, message: '此项为必填项', trigger: 'change' }],
                newUnusedLocality: [{ required: true, message: '此项为必填项', trigger: 'change' }],
            }
        };
    },
    created() {
        this.getList();
    },
    methods: {
        renderContent(h, { node, data, store }) {
            return (
                <span>
                    <span title={node.label}>{node.label}</span>
                </span>
            );
        },
        getList() {
            this.listLoading = true;
            fetchNeedList(this.pageNum,this.pageSize,this.listQuery).then(response => {
                if (response.data.code === 200) {
                    this.tableData = response.data.data.list;
                    for (var i = 0; i < this.tableData.length; i++) {
                        if (this.tableData[i].checkStart == 2) {
                            this.tableData[i].checkStart = "审核中";
                        } else if (this.tableData[i].checkStart == 1) {
                            this.tableData[i].checkStart = "未提交";
                        } else if (this.tableData[i].checkStart == 3) {
                            this.tableData[i].checkStart = "审核通过";
                        } else if (this.tableData[i].checkStart == 4) {
                            this.tableData[i].checkStart = "审核不通过";
                        }
                    }
                    this.total = response.data.data.total;
                    setTimeout(() => {
                        this.listLoading = false;
                    }, 1 * 500);
                } else {
                    this.$notify({
                        title: "警告",
                        message: response.data.msg,
                        type: "warning",
                        duration: 2000
                    });
                    this.listLoading = false;
                }
            });
        },
        // 日期搜索
        searchChange() {
            // 日期转换
            if (this.value01 == null) {
                this.listQuery.applyDateStart = "";
                this.listQuery.applyDateEnd = "";
            } else {
                this.listQuery.applyDateStart = this.value01[0]; // 开始时间
                this.listQuery.applyDateEnd = this.value01[1];
            }
        },
        // 搜索
        handleFilter() {
            this.pageNum = 1;
            this.getList();
        },
        // 分页
        handleSizeChange(val) {
            this.pageSize = val;
            this.getList();
        },
        handleCurrentChange(val) {
            this.pageNum = val;
            this.getList();
        },
        // 根据编号查看
        handleDetail(row) {
            this.fixedAssetCode = row.fixedAssetCode
            this.activeName = "first";
            this.dialogStatus = "detail";
            this.tzsqTask = true;
            this.zcbfbzShow = false;
            this.dialogFormVisible = true;
            this.popData.taskId = row.taskId;
            this.popData.processInstanceId = row.processInstanceId;
            this.processInstanceId = row.processInstanceId;
            this.id = row.id;
            this.printId = row.id;
            this.documentWordCode = row.formCode; // 单据编号
            getDetail(this.id).then(response => {
                if (response.data.code === 200) {
                    this.temp = Object.assign({}, response.data.data);
                } else {
                    this.$notify({
                        title: "警告",
                        message: response.data.msg,
                        type: "warning",
                        duration: 3000
                    });
                }
            });
            this.getUser();
            this.getNodeKey(); // 获取当前任务信息
        },
        // 获取当前用户信息
        getUser() {
            getCurrentUser().then(response => {
                if (response.data.code == 200) {
                    this.userId = response.data.data.id;
                } else {
                    this.$notify({
                        title: "警告",
                        message: response.data.msg,
                        type: "warning",
                        duration: 2000
                    });
                }
            });
        },
        // 查询当前任务信息（获取节点key值）
        getNodeKey() {
            getCurrentTask(this.processInstanceId).then(response => {
                if (response.data.code === 200) {
                    this.nodeKey = response.data.data.definitionKey;
                    this.nodeName = response.data.data.name;
                    if (this.nodeName == "调整申请") {
                        // 判断是否为调整申请
                        this.tzsqTask = false;
                    } 
                } else {
                    this.$notify({
                        title: "警告",
                        message: response.data.msg,
                        type: "warning",
                        duration: 2000
                    });
                }
            });
        },
        // 同意
        agreeData() {
            this.popData.opinion = null;
            this.popData.leaderPass = true;
            this.dialogStatus = "agree";
            this.agreeDialogVisible = true;
        },
        createData() {
            if (this.popData.opinion == null || this.popData.opinion == "") {
                this.$notify({
                    title: "警告",
                    message: "请填写意见",
                    type: "warning",
                    duration: 3000
                });
                return;
            }
            agreeApply(this.popData.taskId,this.popData.opinion,this.popData.leaderPass,this.userId,this.id).then(response => {
                if (response.data.code == 200) {
                    this.agreeDialogVisible = false;
                    this.dialogFormVisible = false;
                    this.getList();
                } else {
                    this.$notify({
                        title: "警告",
                        message: response.data.msg,
                        type: "warning",
                        duration: 2000
                    });
                }
            });
        },
        // 退回
        unAgreeData() {
            this.popData.opinion = null;
            this.dialogStatus = "unagree";
            this.agreeDialogVisible = true;
            this.popData.leaderPass = false;
        },
        updateData() {
            if (this.popData.opinion == null || this.popData.opinion == "") {
                this.$notify({
                    title: "警告",
                    message: "请填写意见",
                    type: "warning",
                    duration: 3000
                });
                return;
            }
            // const tempData = Object.assign({}, this.popData);
            agreeApply(this.popData.taskId,this.popData.opinion,this.popData.leaderPass,this.userId,this.id).then(response => {
                if (response.data.code == 200) {
                    this.agreeDialogVisible = false;
                    this.dialogFormVisible = false;
                    this.getList();
                } else {
                    this.$notify({
                        title: "警告",
                        message: response.data.msg,
                        type: "warning",
                        duration: 2000
                    });
                }
            });
        },
        // 重新提交
        againSubmit() {
            this.$refs["dataForm"].validate(valid => {
                if (valid) {
                    this.listLoading = true;
                    reCommit(this.popData.taskId,this.fixedAssetCode,this.id).then(response => {
                        if (response.data.code == 200) {
                            this.dialogFormVisible = false;
                            this.getList();
                            setTimeout(() => {
                                this.listLoading = false;
                            }, 1 * 500);
                            this.$message({
                                title: "成功",
                                message: "修改成功",
                                type: "success",
                                duration: 2000
                            });
                        } else {
                            this.$notify({
                                title: "警告",
                                message: response.data.msg,
                                type: "warning",
                                duration: 2000
                            });
                            this.listLoading = false;
                        }
                    });
                }
            });
        },
        endbtn() {
            const taskId = this.popData.taskId;
            const val = 1;
            const id = this.id;
            const moduleTypeId = 31;
            this.listLoading = true;
            endProcess(taskId, val, id, moduleTypeId).then(response => {
                if (response.data.code == 200) {
                    this.listLoading = false;
                    this.dialogFormVisible = false;
                    this.getList();
                } else {
                    this.$notify({
                        title: "警告",
                        message: response.data.msg,
                        type: "warning",
                        duration: 2000
                    });
                    this.listLoading = false;
                }
            });
        },
        // 打印
        printData() {
            const params = this.printId;
            fetchPrint(params).then(response => {
                if (response.data.code == 200) {
                    this.printList = response.data.data;
                    this.printObj = response.data.data.info
                    this.lcData = response.data.data.tasks;
                    this.lcData.forEach(item => {
                        if (item.taskName == "流程开始") {
                            this.printList.fqr = item.userName;
                            this.printList.fqrDate = item.dateTime;
                        } else if (item.taskName == "设备科科长") {
                            this.printList.sbkkz = item.userName;
                            this.printList.sbkkzOpinion = item.opinion;
                            this.printList.sbkkzDate = item.dateTime;
                        } else if (item.taskName == "设备副总") {
                            this.printList.sbfz = item.userName;
                            this.printList.sbfzOpinion = item.opinion;
                            this.printList.sbfzDate = item.dateTime;
                        } else if (item.taskName == "资产部副部长") {
                            this.printList.zcbfbz = item.userName;
                            this.printList.zcbfbzOpinion = item.opinion;
                            this.printList.zcbfbzDate = item.dateTime;
                        } 
                    });
                } else {
                    this.$notify({
                        title: "警告",
                        message: response.data.msg,
                        type: "warning",
                        duration: 2000
                    });
                }
            });
            this.printDialogVisible = true;
        },
        // tabs 点击事件
        handleClick(tab, event) {
            if (tab.label == "流转记录") {
                this.recordData = null;
                // 请求流转记录
                if (
                    this.processInstanceId != null &&
                    this.processInstanceId != ""
                ) {
                    this.listLoading = true;
                    recordList(this.processInstanceId).then(response => {
                        if (response.data.code === 200) {
                            this.recordData = response.data.data;
                            setTimeout(() => {
                                this.listLoading = false;
                            }, 1 * 500);
                        } else {
                            this.$notify({
                                title: "警告",
                                message: response.data.msg,
                                type: "warning",
                                duration: 2000
                            });
                            this.listLoading = false;
                        }
                    });
                }
            } else if (tab.label == "流程图") {
                this.chartData = null;
                if (
                    this.processInstanceId != null &&
                    this.processInstanceId != ""
                ) {
                    this.listLoading = true;
                    processChart(this.processInstanceId).then(response => {
                        if (
                            response.data.code != 803 &&
                            response.data.code != 808
                        ) {
                            this.chartData = response.request.responseURL;
                            document.getElementById("pic").src = this.chartData;
                            setTimeout(() => {
                                this.listLoading = false;
                            }, 1 * 500);
                        } else {
                            this.$notify({
                                title: "警告",
                                message: response.data.msg,
                                type: "warning",
                                duration: 2000
                            });
                            this.listLoading = false;
                        }
                    });
                }
            }
        },
        changeHandle(row) {
            this.changeProcessId = row.processInstanceId;
            this.choosePerson();
        },
        choosePerson() {
            this.listQuery2 = {
                pageNum: 1,
                pageSize: 1000,
                perName: undefined,
                workNumber: undefined
            };
            this.orgListData = [];
            this.innerVisiblePerson = true;
            this.treeLoading = true;
            // 查询组织树结构
            fetchChooseTree().then(response => {
                this.personOrgData = [];
                this.personOrgData.push(response.data.data);
                setTimeout(() => {
                    this.treeLoading = false;
                }, 1 * 1000);
            });
        },
        // 组织树点击事件加载表格数据
        handleNodeClick(data) {
            this.listLoading = true;
            const params = {
                orgCode: data.orgCode,
                pageNum: 1,
                pageSize: 1000
            };
            choosePersonList(params).then(response => {
                this.orgListData = response.data.data.list;
                setTimeout(() => {
                    this.listLoading = false;
                }, 1 * 1000);
            });
        },
        handlePerson() {
            this.listLoading = true;
            choosePersonList(this.listQuery2).then(response => {
                this.orgListData = response.data.data.list;
                setTimeout(() => {
                    this.listLoading = false;
                }, 1 * 1000);
            });
        },
        // 转办人员提交
        chooseReplace(row) {
            const finds = {
                processInstanceId: this.changeProcessId,
                workNumber: row.workNumber
            };
            transferList(finds).then(response => {
                if (response.data.code === 200) {
                    this.getList();
                    this.innerVisiblePerson = false;
                    this.$message({
                        title: "成功",
                        type: "success",
                        message: "请求成功!",
                        duration: 2000
                    });
                } else {
                    this.$notify({
                        title: "警告",
                        message: response.data.msg,
                        type: "warning",
                        duration: 2000
                    });
                }
            });
        },
    }
};
</script>
<style>
.formSearch {
    width: 100%;
    background: #fafafa;
    border: 1px solid #e9e9e9;
    border-radius: 3px;
    padding: 18px 10px 0;
}
.equip-title {
    margin-left: -100px;
    text-align: center;
    display: block;
    font-size: 20px;
    font-weight: 600;
}
.look-detail {
    text-decoration: underline;
    cursor: pointer;
    /* color: #337ab7; */
}
.formDw {
    position: absolute;
    right: 20px;
    top: 80px;
}
#printTest table {
    font-family: "宋体";
    width: 99.5%;
    border-collapse: collapse;
    text-align: center;
}
#printTest table thead th {
    font-family: "SimHei";
    font-size: 14px;
}
#printTest table tbody tr {
    height: 60px;
    font-size: 14px;
}
#printTest table tbody tr td {
    border: 1px solid black;
}
#pic {
    width: 100%;
}
</style>