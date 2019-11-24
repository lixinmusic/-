<template>
    <div class='app-container'>
        <el-container>
            <div class="formSearch">
                <el-form :inline="true">
                    <el-form-item label="单据编号">
                        <el-input class="filter-item input" clearable placeholder="请输入单据编号" v-model="listQuery.documentWordCode">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="夹具名称">
                        <el-input class="filter-item input" clearable placeholder="请输入夹具名称" v-model="listQuery.equipName">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="使用部门">
                        <el-input class="filter-item input" clearable placeholder="请输入使用部门" v-model="listQuery.dctualOrgName">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="审核状态">
                        <el-select v-model="listQuery.auditingType" clearable placeholder="请选择">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="filter-item" type="primary" style="float:right" icon="el-icon-search" @click="handleFilter">搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-main style="padding:20px 0">
                <el-table :key='tableKey' :data="tableData" height="200" row-key="id" v-loading="listLoading" border fit highlight-current style="width: 100%;margin-top:10px;min-height:500px" :header-cell-style="{background:'oldlace'}">
                    <el-table-column prop="documentWordCode" align="center" label="单据编号" width="160px">
                        <template slot-scope="scope">
                            <span class="look-detail" @click="handleDetail(scope.row)">{{scope.row.documentWordCode}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="equipmentName" align="center" label="夹具名称">
                        <template slot-scope="scope">
                            <span>{{scope.row.equipmentName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="dctualOrgName" align="center" label="使用部门">
                        <template slot-scope="scope">
                            <span>{{scope.row.dctualOrgName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="purchaseQuantity" align="center" label="台数">
                        <template slot-scope="scope">
                            <span>{{scope.row.purchaseQuantity}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="applicationTime" align="center" label="申请时间">
                        <template slot-scope="scope">
                            <span>{{scope.row.applicationTime!=null?scope.row.applicationTime.substring(0,10):''}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="requirementDeliveryTime" align="center" label="要求交货时间">
                        <template slot-scope="scope">
                            <span>{{scope.row.requirementDeliveryTime!=null?scope.row.requirementDeliveryTime.substring(0,10):''}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="equipBuySuggest" align="center" label="夹具采购建议">
                        <template slot-scope="scope">
                            <span>{{scope.row.equipBuySuggest}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="auditingType" align="center" label="审核状态">
                        <template slot-scope="scope">
                            <span>{{scope.row.auditingType}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="assignee" align="center" label="当前处理人">
                        <template slot-scope="scope">
                            <span>{{scope.row.assignee}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-main>
            <el-footer>
                <div class="pagination-container">
                    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[5,10,15, 20]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                    </el-pagination>
                </div>
            </el-footer>
            <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" v-loading="listLoading" :visible.sync="dialogFormVisible" v-dialogDrag width="60%">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="表单信息" name="first">
                        <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="110px">
                            <el-form-item>
                                <span class="equip-title">夹具采购申请单</span>
                            </el-form-item>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="单据编号" prop="documentWordCode">
                                        <el-input v-model="temp.documentWordCode" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="夹具名称" prop="equipmentName">
                                        <el-input v-model="temp.equipmentName" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12" style="padding-right:0px;">
                                    <el-form-item label="使用公司" prop="companyName">
                                        <el-input v-model="temp.companyName" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12" style="padding-right:0px;">
                                    <el-form-item label="使用工厂" prop="factoryName">
                                        <el-input v-model="temp.factoryName" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="使用部门" prop="dctualOrgName">
                                        <el-input v-model="temp.dctualOrgName" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="台数" prop="purchaseQuantity">
                                        <el-input type="number" v-model="temp.purchaseQuantity" maxlength="5" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="申请时间" prop="applicationTime">
                                        <el-date-picker v-model="temp.applicationTime" type="date" disabled style="width:100%">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="要求交货时间" prop="requirementDeliveryTime">
                                        <el-date-picker style="width:100%" v-model="temp.requirementDeliveryTime" type="date" placeholder="选择时间" disabled>
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-form-item label="申请原因" prop="applicationReason">
                                <el-input v-model="temp.applicationReason" maxlength="200" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="具体要求" prop="detailRequirement">
                                <el-input v-model="temp.detailRequirement" maxlength="200" disabled></el-input>
                            </el-form-item>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="夹具采购建议" prop="equipBuySuggest">
                                        <el-radio v-model="temp.equipBuySuggest" label="内部制造" disabled>内部制造</el-radio>
                                        <el-radio v-model="temp.equipBuySuggest" label="外部制造" disabled>外部制造</el-radio>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="1" v-if="chairman" style="width:1px;color:red;padding:8px">
                                    <span>*</span>
                                </el-col>
                                <el-col :span="10">
                                    <el-form-item label="金额" prop="budget">
                                        <el-input type="text" v-model="temp.budget" maxlength="11" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="1" style="padding:0px;font-size:20px;font-weight:800;">
                                    <span>元</span>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="10">
                                    <el-form-item label="技术资料" prop="fileData">
                                        <input id="uploadImg" type="file" @change="fileUpload" v-if="false">
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                        <el-table :data="fileData" border fit highlight-current style="width: 60%; margin-left:100px;">
                            <el-table-column prop="fileName" align="center" label="文件名">
                                <template slot-scope="scope">
                                    <span class="look-detail" @click="lookFile(scope.row)">{{scope.row.fileName}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="node" align="center" label="上传节点">
                                <template slot-scope="scope">
                                    <span>{{scope.row.node}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="操作">
                                <template slot-scope="scope">
                                    <el-button title="下载" type="primary" size="mini" icon="el-icon-download" @click="fileDown(scope.row)"></el-button>
                                </template>
                            </el-table-column>
                        </el-table>
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
                <el-form class="formDw">
                    <el-form-item>
                        <el-button type="primary" @click="dialogFormVisible = false">返回</el-button>
                        <el-button type="primary" @click="printData" v-if="printShow">打印</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <!-- 打印 -->
             <el-dialog title="打印预览" :close-on-click-modal="false" :visible.sync="printDialogVisible" width="60%" v-loading="printLoading" v-dialogDrag>
                <el-button type="primary" @click="printDialogVisible = false">返回</el-button>
                <el-button type="success" v-print="'#printTest'">
                    <svg-icon icon-class="print" />打印</el-button>
                <div id="printTest">
                    <table border="0" style="border-right:1px solid black">
                        <caption style="font-size: 24px;padding-bottom:20px; font-weight:800">夹具采购申请单</caption>
                        <thead>
                            <tr style="border-right: 1px solid white;">
                                <th>{{ctime!=null?ctime.substring(0,10):''}}&nbsp;</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="border-right: 1px solid black;">夹具名称</td>
                                <td colspan="3">{{printList.equipmentName}}</td>
                            </tr>
                            <tr>
                                <td style="border-right: 1px solid black;">使用公司</td>
                                <td style="border-right: 1px solid black;">{{printList.companyName}}</td>
                                <td style="border-right: 1px solid black;">使用工厂</td>
                                <td>{{printList.factoryName}}</td>
                            </tr>
                            <tr>
                                <td style="border-right: 1px solid black;">使用部门</td>
                                <td style="border-right: 1px solid black;">{{printList.dctualOrgName}}</td>
                                <td style="border-right: 1px solid black;">台数</td>
                                <td>{{printList.purchaseQuantity}}</td>
                            </tr>
                            <tr>
                                <td style="border-right: 1px solid black;">申请时间</td>
                                <td style="border-right: 1px solid black;">{{printList.applicationTime!=null?printList.applicationTime.substring(0,10):''}}</td>
                                <td style="border-right: 1px solid black;">要求交货时间</td>
                                <td>{{printList.requirementDeliveryTime!=null?printList.requirementDeliveryTime.substring(0,10):''}}</td>
                            </tr>
                            <tr style="border-bottom:0px solid white;">
                                <td colspan="4">
                                    申请原因：
                                    <span style="font-size:14px;">{{printList.applicationReason}}</span>
                                </td>
                            </tr>
                            <tr style="border-top:0px solid white;border-bottom:0px solid white;height:90px;">
                                <td colspan="4" style="position: relative;">
                                    <span style="position: absolute;left:1px;top:1px;">
                                        具体要求：
                                        <span style="font-size:14px;">{{printList.detailRequirement}}</span>
                                    </span>
                                </td>
                            </tr>
                            <tr style="border-top:0px solid white;border-bottom:0px solid white;">
                                <td colspan="4" align="right">
                                    <span>使用部门签字：{{printList.xmzgbmr}}</span>
                                    <span>日期：{{printList.xmzgbmrDate!=null?printList.xmzgbmrDate.substring(0,10):''}}</span>
                                </td>
                            </tr>
                            <tr style="border-bottom:0px solid white;">
                                <td colspan="4" style="height:60px;position: relative;">
                                    <span style="position: absolute;left:1px;top:5px;">
                                        技术项目负责人意见（附技术要求）：
                                        <span style="font-size:14px;">{{printList.technologyLeaderOpinion}}</span>
                                    </span>
                                </td>
                            </tr>
                            <tr style="border-top:0px solid white;">
                                <td colspan="4" align="right">
                                    <span>技术负责人：{{printList.technologyLeaderName}}</span>
                                    <span>日期：{{printList.technologyLeaderDate!=null?printList.technologyLeaderDate.substring(0,10):''}}</span>
                                </td>
                            </tr>
                            <tr style="border-bottom:0px solid white;">
                                <td colspan="4" style="height:60px;">工厂厂长意见：{{printList.gcczOpinion}}</td>
                            </tr>
                            <tr style="border-top:0px solid white;">
                                <td colspan="4" align="right">
                                    <span>工厂厂长：{{printList.gccz}}</span>
                                    <span>日期：{{printList.gcczDate!=null?printList.gcczDate.substring(0,10):''}}</span>
                                </td>
                            </tr>
                            <tr style="border-bottom:0px solid white;">
                                <td colspan="4" style="height:60px;">事业部意见：{{printList.sybzjlOpinion}}</td>
                            </tr>
                            <tr style="border-top:0px solid white;">
                                <td colspan="4" align="right">
                                    <span>设备副总：{{printList.sybzjl}}</span>
                                    <span>日期：{{printList.sybzjlDate!=null?printList.sybzjlDate.substring(0,10):''}}</span>
                                </td>
                            </tr>
                            <tr style="border-bottom:0px solid white;">
                                <td colspan="4" style="height:60px;">资产部初审意见：{{printList.zcbOpinion}}</td>
                            </tr>
                            <tr style="border-top:0px solid white;">
                                <td colspan="4" align="right">
                                    <span>签字：{{printList.zcb}}</span>
                                    <span>日期：{{printList.zcbDate!=null?printList.zcbDate.substring(0,10):''}}</span>
                                </td>
                            </tr>
                            <tr style="border-bottom:0px solid white;">
                                <td colspan="4" style="height:60px;">董事长审批：{{printList.dszOpinion}}</td>
                            </tr>
                            <tr style="border-top:0px solid white;">
                                <td colspan="4" align="right">
                                    <span>签字：{{printList.dsz}}</span>
                                    <span>日期：{{printList.dszDate!=null?printList.dszDate.substring(0,10):''}}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </el-dialog>
        </el-container>
    </div>
</template>

<script>
import { fetchDoneList, fetchDetail, fetchPrint } from '@/api/toolFixtureManagement/clampPurchaseRequestForm'
import { commonOptions1, fileList, recordList, processChart } from '@/api/common/common'
import { baseUrl } from '@/api/common/fileBaseUrl'
export default {
    name: "clampPurchaseRequestFormDone",
    data() {
        return {
            chairman: true,
            ctime: null,
            activeName: "first",
            // 弹框组
            dialogFormVisible: false,
            printDialogVisible: false,
            printShow: false,
            chartData: null, // 流程图
            // 审核状态下拉框
            options: commonOptions1,
            // 表格数据
            tableData: [],
            tableKey: 0,
            listLoading: false,
            total: null,
            listQuery: {
                pageNum: 1,
                pageSize: 10,
                documentWordCode: undefined,
                equipName: undefined,
                dctualOrgName: undefined,
                auditingType: undefined
            },
            // 文件数据
            fileData: [],
            documentWordCode: undefined, // 单据编号
            processInstanceId: undefined, // 流程实例id
            // 流转记录
            recordShow: false,
            recordData: null,
            printLoading: false,
            printList: {
                sybumrDate: null,
                jsfzrDate: null,
                gcczDate: null,
                sbfzDate: null,
                dszDate: null,
                zcbDate: null,
                applicationTime: null,
                ctime: null,
                requirementDeliveryTime: null
            },
            temp: {
                applicationReason: undefined,
                applicationTime: undefined,
                detailRequirement: undefined,
                equipBuySuggest: undefined,
                purchaseQuantity: undefined,
                equipTypeCode: undefined,
                equipTypeName: undefined,
                orgFullName: undefined,
                id: undefined,
                requirementDeliveryTime: undefined,
                useCompanyName: undefined, // 使用公司
                useCompanyCode: undefined,
                useFactoryName: undefined, // 使用工厂
                useFactoryCode: undefined,
                useOrgCode: undefined,
                useOrgName: undefined,
                budget: undefined, // 金额
                documentWordCode: undefined, // 采购申请单号
                recordCode: null
            },
            dialogStatus: "",
            textMap: {
                detail: "查看"
            },
            rules: {
                equipmentName: [{ required: true, message: '此项为必填项', trigger: 'change' }],
                companyName: [{ required: true, message: '此项为必填项', trigger: 'change' }],
                factoryName: [{ required: true, message: '此项为必填项', trigger: 'change' }],
                dctualOrgName: [{ required: true, message: '此项为必填项', trigger: 'change' }],
                purchaseQuantity: [{ required: true, message: '此项为必填项', trigger: 'change' }],
                requirementDeliveryTime: [{ required: true, message: '此项为必填项', trigger: 'change' }],
                applicationReason: [{ required: true, message: '此项为必填项', trigger: 'change' }],
                detailRequirement: [{ required: true, message: '此项为必填项', trigger: 'change' }],
                equipBuySuggest: [{ required: true, message: '此项为必填项', trigger: 'change' }],
                applicationTime: [{ required: true, message: '此项为必填项', trigger: 'change' }],
                // budget: [{ required: true, message: '此项为必填项', trigger: 'change' }]
            }
        };
    },
    created() {
        this.getList();
    },
    methods: {
        getList() {
            this.tableData = [];
            this.listLoading = true;
            if(this.listQuery.equipName == ''){
                this.listQuery = {
                    pageNum: 1,
                    pageSize: 10,
                    documentWordCode: this.listQuery.documentWordCode,
                    dctualOrgName: this.listQuery.dctualOrgName,
                    auditingType: this.listQuery.auditingType
                }
            }
            fetchDoneList(this.listQuery).then(response => {
                if (response.data.code === 200) {
                    if (response.data.data != null && response.data.data.list != null) {
                        this.tableData = response.data.data.list;
                        for (var i = 0; i < this.tableData.length; i++) {
                            if (this.tableData[i].auditingType == 2) {
                                this.tableData[i].auditingType = "审核中";
                            } else if (this.tableData[i].auditingType == 1) {
                                this.tableData[i].auditingType = "未提交";
                            } else if (this.tableData[i].auditingType == 3) {
                                this.tableData[i].auditingType = "审核通过";
                            } else if (this.tableData[i].auditingType == 4) {
                                this.tableData[i].auditingType = "审核不通过";
                            } else if (this.tableData[i].auditingType == 5) {
                                this.tableData[i].auditingType = "流程关闭";
                            }
                        }
                        this.total = response.data.data.total;
                    }
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
        // 根据编号查看
        handleDetail(row) {
            this.ctime = row.ctime
            this.activeName = "first";
            this.dialogStatus = "detail";
            this.printShow = false;
            this.dialogFormVisible = true;
            if (row.auditingType == "审核通过") {
                this.printShow = true;
            }
            const id = row.id;
            this.documentWordCode = row.documentWordCode; // 单据编号
            fetchDetail(id).then(response => {
                if (response.data.code === 200) {
                    this.temp.budget = response.data.data.budget;
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
            this.getFileList(); // 获取文件信息
            // 流转记录
            this.processInstanceId = row.processInstanceId;
        },
        // 搜索
        handleFilter() {
            this.listQuery.pageNum = 1;
            this.getList();
        },
        // 分页
        handleSizeChange(val) {
            this.listQuery.pageSize = val;
            this.getList();
        },
        handleCurrentChange(val) {
            this.listQuery.pageNum = val;
            this.getList();
        },
        // 获取文件列表
        getFileList() {
            const find = {
                moduleType: "26", // 模块类别
                attachmentCode: "JJCGSQDJSZLFJ", // 附件编码
                documentWordCode: this.documentWordCode // 单据编码
            };
            fileList(find).then(response => {
                this.fileData = response.data.data;
            });
            // 审核附件
            const find1 = {
                moduleType: "26", // 模块类别
                attachmentCode: "JJCGSQDQTFJ", 
                documentWordCode: this.documentWordCode 
            };
            fileList(find1).then(response => {
                this.xmfaFileData = response.data.data; 
            });
        },
        // 文件下载
        fileDown(row) {
            window.location.href = row.filePath + "?attname=" + row.fileName;
        },
        // tabs 点击事件
        handleClick(tab, event) {
            if (tab.label == "流转记录") {
                this.listLoading = true;
                this.recordData = null;
                // 请求流转记录
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
            } else if (tab.label == "流程图") {
                this.chartData = null;
                if (this.processInstanceId != null) {
                    this.listLoading = true;
                    processChart(this.processInstanceId).then(response => {
                        if (
                            response.data.code != 803 &&
                            response.data.code != 808
                        ) {
                            this.chartData = response.request.responseURL;
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
        // 打印
        printData() {
            this.printDialogVisible = true;
            this.printLoading = true;
            const params = {
                purchaseId: this.temp.id,
                processInstanceId: this.processInstanceId
            };
            fetchPrint(params).then(response => {
                if (response.data.code == 200) {
                    this.printList = response.data.data;
                } else {
                    this.$notify({
                        title: "警告",
                        message: response.data.msg,
                        type: "warning",
                        duration: 2000
                    });
                }
                setTimeout(() => {
                    this.printLoading = false;
                }, 1 * 500);
            });
        },
        lookFile(row) {
            let url;
            if (row.fileUrl !== undefined) {
                url =
                    baseUrl +
                    "onlinePreview?url=" +
                    encodeURIComponent(row.fileUrl);
            } else {
                url =
                    baseUrl +
                    "onlinePreview?url=" +
                    encodeURIComponent(row.filePath);
            }
            var winHeight = window.document.documentElement.clientHeight;
            window.open(
                url,
                "_blank",
                "height=" +
                    winHeight +
                    ",top=10,left=10,toolbar=no,menubar=no,scrollbars=yes,resizable=yes"
            );
        }
    }
};
</script>
<style scoped>
.formSearch {
    width: 100%;
    background: #fafafa;
    border: 1px solid #e9e9e9;
    border-radius: 3px;
    padding: 18px 10px 0;
    /* margin-bottom: 15px; */
}
.equip-title,
.equip-title1 {
    margin-left: -100px;
    text-align: center;
    display: block;
}
.equip-title {
    font-size: 20px;
    font-weight: 600;
}
.formDw {
    position: absolute;
    right: 20px;
    top: 80px;
}
/* #printTest{
  margin-top:10px;
} */
#printTest table {
    font-family: "宋体";
    border-collapse: collapse;
    width: 99.5%;
}
#printTest table thead th {
    font-size: 16px;
    text-align: left;
}
#printTest table tbody tr {
    font-size: 16px;
    border: 1px solid black;
    height: 50px;
    text-align: left;
}
#printTest table tbody td {
    width: 25%;
    /* border: 1px solid black; */
}
#printTest table tbody td span {
    margin-right: 20px;
}
#pic {
    width: 100%;
}
</style>

