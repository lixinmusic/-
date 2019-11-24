<template>
    <div class='app-container'>
        <el-container>
            <div class="formSearch">
                <el-form :inline="true">
                    <el-form-item label="单据编号">
                        <el-input class="filter-item input" v-model="listQuery.documnetCode">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="固定资产编号">
                        <el-input class="filter-item input" v-model="listQuery.fixedAssetCode">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="设备名称">
                        <el-input class="filter-item input" v-model="listQuery.equipmentName">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="报修时间">
                        <el-date-picker v-model="value01" type="daterange" unlink-panels start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" clearable @change="searchChange()">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="审核状态">
                        <el-select v-model="listQuery.checkStart" clearable placeholder="请选择">
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
                <el-button class="filter-item" @click="handleCreate" type="primary" v-if="addShow">新增</el-button>
                <el-table :key='tableKey' :data="tableData" height="200" row-key="id" v-loading="listLoading" border fit highlight-current style="width: 100%;margin-top:10px;min-height:500px" :header-cell-style="{background:'oldlace'}">
                    <el-table-column align="center" label="单据编号">
                        <template slot-scope="scope">
                            <span class="look-detail" @click="handleDetail(scope.row)">{{scope.row.documentCode}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="reportDocumnetCode" label="报修单编号">
                    </el-table-column>
                    <el-table-column align="center" label="固定资产编号" prop="fixedAssetCode">
                    </el-table-column>
                    <el-table-column align="center" label="设备名称" prop="equipName" min-width="110px">
                    </el-table-column>
                    <el-table-column align="center" label="要求完成时间" prop="requestDate">
                    </el-table-column>
                    <el-table-column align="center" label="维修商名称" prop="repairerName">
                    </el-table-column>
                    <el-table-column align="center" label="维修商进厂时间" prop="repairTime" min-width="120px">
                    </el-table-column>
                    <el-table-column align="center" label="维修完成时间" prop="repairFinishTime" min-width="120px">
                    </el-table-column>
                    <el-table-column align="center" label="审核状态" prop="checkStart">
                    </el-table-column>
                    <el-table-column align="center" label="当前处理人" prop="processingPerson">
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="140px" fixed="right">
                        <template slot-scope="scope">
                            <el-button title="编辑" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-if="editShow" :disabled="scope.row.editDisabled?true:false"></el-button>
                            <el-button title="删除" type="danger" icon="el-icon-delete" size="mini" @click="deleteBtn(scope.row)" v-if="deleteShow" :disabled="scope.row.deleteDisabled?true:false"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-main>
            <el-footer>
                <div class="pagination-container">
                    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="this.pageNum" :page-sizes="[5,10,15, 20]" :page-size="this.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                    </el-pagination>
                </div>
            </el-footer>
            <!-- 新增编辑弹框 -->
            <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="60%" v-loading="listLoading" v-dialogDrag :close-on-click-modal="false">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="表单信息" name="first">
                        <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="110px">
                            <el-form-item>
                                <span class="equip-title">进厂维修记录单</span>
                            </el-form-item>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="单据编号" prop="documentCode">
                                        <el-input v-model="temp.documentCode" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="报修单编号" prop="reportDocumentCode">
                                        <el-input v-model="temp.reportDocumentCode" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="报修时间" prop="repairDate">
                                        <el-date-picker style="width:100%" v-model="temp.repairDate" type="date" disabled></el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="设备名称" prop="equipName">
                                        <el-input v-model="temp.equipName" disabled></el-input>
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
                                    <el-form-item label="要求完成时间" prop="requestDate">
                                        <el-date-picker style="width:100%" v-model="temp.requestDate" type="date" disabled></el-date-picker>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="24">
                                    <el-form-item label="故障原因" prop="causeReason">
                                        <el-input type="textarea" maxlength="200" v-model="temp.causeReason" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="维修商名称" prop="repairerName">
                                        <el-input v-model="temp.repairerName" :disabled="!chooseShow"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="维修进厂时间" prop="repairTime">
                                        <el-date-picker :disabled="!chooseShow" style="width:100%" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" v-model="temp.repairTime"  type="datetime" placeholder="请选择">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="维修完成时间" prop="repairFinishTime">
                                        <el-date-picker :disabled="!chooseShow" style="width:100%" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" v-model="temp.repairFinishTime" type="datetime" placeholder="请选择">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="24">
                                    <el-form-item label="维修内容" prop="repairContent">
                                        <el-input type="textarea" :disabled="!chooseShow" maxlength="200" v-model="temp.repairContent"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="1" style="width:1px;color:red;padding:8px" v-if="fileshow">
                                    <span>*</span>
                                </el-col>
                                <el-col :span="10">
                                    <el-form-item label="维修记录上传">
                                        <input id="uploadImg" type="file" @change="fileUpload" v-if="fileshow">
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-table :data="fileData" border fit highlight-current style="width: 80%; margin-left:100px;">
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
                                        <el-button title="删除" type="danger" icon="el-icon-delete" size="mini" :disabled="!chooseShow"  @click="fileDelete(scope.row)"></el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="流转记录" name="second" v-if="recordShow">
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
                    <el-tab-pane label="流程图" name="three" v-if="recordShow">
                        <div id="imgcontainer">
                            <img id="pic" :src="chartData" />
                        </div>
                    </el-tab-pane>
                </el-tabs>
                <!-- 按钮组 -->
                <el-form class="formDw">
                    <el-form-item>
                        <el-button type="primary" @click="dialogFormVisible = false">返回</el-button>
                        <el-button v-if="dialogStatus=='create'" type="primary" @click="saveData">保存</el-button>
                        <el-button v-if="dialogStatus=='update'" type="primary" @click="updateSaveData">保存</el-button>
                        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">提交</el-button>
                        <el-button v-if="dialogStatus=='update'" type="primary" @click="updateData">提交</el-button>
                        <el-button v-if="chooseShow" type="primary" @click="quoteEvaluate">选择设备</el-button>
                        <el-button v-if="dialogStatus=='detail'&&printShow" type="primary" @click="printData">打印</el-button>
                    </el-form-item>
                </el-form>
                <el-dialog width="40%" title="选择发起组织" :visible.sync="changeOrgVisible" append-to-body :close-on-click-modal="false" v-dialogDrag>
                    <el-container>
                        <el-aside style="width:100%">
                            <span style="font-weight:800">当前登录用户所在组织：{{comName}}</span>
                            <el-form>
                                <el-form-item>
                                    <el-select v-model="temp.proxyOrgName" clearable placeholder="请选择组织" @change='proxyOrgChange' style="width:100%">
                                        <el-option v-for="item in proxyOrgList" :key="item.orgCode" :label="item.orgName" :value="item.orgName">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-form>
                        </el-aside>
                    </el-container>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="changeOrgVisible = false" type="default">取消</el-button>
                        <el-button type="primary" @click="changeOrgOk">确定</el-button>
                    </div>
                </el-dialog>
            </el-dialog>
            <!-- 选择设备 -->
            <el-dialog title="选择设备" :visible.sync="centerDialogVisible" width="80%" :close-on-click-modal="false" v-dialogDrag>
                <el-form :inline="true">
                    <el-form-item label="设备名称">
                        <el-input class="filter-item input" v-model="listQuery1.equipName" clearable>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="固定资产编号">
                        <el-input class="filter-item input" v-model="listQuery1.fixedAssetCode" clearable>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="型号规格">
                        <el-input class="filter-item input" v-model="listQuery1.equipType" clearable>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="出厂编号">
                        <el-input class="filter-item input" v-model="listQuery1.serialNumber" clearable>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="filter-item" type="primary" style="float:right" icon="el-icon-search" @click="handleFilter1">搜索</el-button>
                    </el-form-item>
                </el-form>
                <el-table :header-cell-style="{background:'oldlace'}" :data="infoList" height="360" v-loading="listLoading" ref="multipleTable" border fit highlight-current-row @select="handleSelect" @select-all="handleSelectAll" class="checkboxNoShow">
                    <el-table-column align="center" type="selection" width="55"></el-table-column>
                    <el-table-column align="center" label="序号" width="55" type="index"></el-table-column>
                    <el-table-column prop="equipName" align="center" label="设备名称">
                    </el-table-column>
                    <el-table-column prop="equipType" align="center" label="型号规格">
                    </el-table-column>
                    <el-table-column prop="fixedAssetCode" align="center" label="固定资产编号">
                    </el-table-column>
                    <el-table-column prop="serialNumber" align="center" label="出厂编号">
                    </el-table-column>
                    <el-table-column prop="manufacturer" align="center" label="制造厂家">
                    </el-table-column> 
                    <el-table-column prop="reportDocumentCode" align="center" label="报修单编号">
                    </el-table-column>
                    <el-table-column prop="requestDate" align="center" label="报修时间">
                        <template slot-scope="scope">
                            {{scope.row.requestDate!==null?scope.row.requestDate.substring(0,10):''}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="repairDate" align="center" label="要求完成时间">
                        <template slot-scope="scope">
                            {{scope.row.repairDate!==null?scope.row.repairDate.substring(0,10):''}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="repariCauseReason" align="center" label="故障原因">
                    </el-table-column>
                </el-table>
                <div class="pagination-container">
                    <el-pagination background @size-change="handleSizeChange1" @current-change="handleCurrentChange1" :current-page="listQuery1.pageNum" :page-sizes="[5,10,15, 20]" :page-size="listQuery1.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total1">
                    </el-pagination>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="centerDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="importOk">确定</el-button>
                </div>
            </el-dialog>
            <!-- 打印 -->
            <el-dialog title="进厂维修记录打印预览" v-dialogDrag :close-on-click-modal="false" :visible.sync="printDialogVisible" width="70%">
                <el-button type="primary" @click="printDialogVisible = false">返回</el-button>
                <el-button type="success" v-print="'#printTest'">
                    <svg-icon icon-class="print" />打印</el-button>
                <div id="printTest">
                    <table border="0">
                        <caption style="font-family:SimHei;font-size: 16px;">
                            <p>{{printList.companyName}}</p>
                            <p>进厂维修记录单</p>
                        </caption>
                        <thead>
                            <tr>
                                <th colspan="12" style="float:left">单据编号:{{printObj.documentCode}}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colspan="2">固定资产编号</td>
                                <td colspan="2">设备名称</td>
                                <td colspan="2">报修单编号</td>
                                <td colspan="2">报修时间</td>
                                <td colspan="2">要求完成时间</td>
                                <td colspan="2">故障原因</td>
                            </tr>
                            <tr>
                                <td style="width:80px" colspan="2">{{printObj.fixedAssetCode}}</td>
                                <td style="width:80px" colspan="2">{{printObj.equipName}}</td>
                                <td style="width:80px" colspan="2">{{printObj.reportDocumnetCode}}</td>
                                <td style="width:80px" colspan="2">{{printObj.repairDate}}</td>
                                <td style="width:80px" colspan="2">{{printObj.requestDate}}</td>
                                <td style="width:80px" colspan="2">{{printObj.causeReason}}</td>
                            </tr>
                            <tr>
                                <td colspan="2">维修商名称</td>
                                <td style="width:160px" colspan="4">{{printObj.repairerName}}</td>
                                <td colspan="2">维修商进厂时间</td>
                                <td style="width:160px" colspan="4">{{printObj.repairTime}}</td>                                
                            </tr>
                            <tr>
                                <td colspan="2">维修完成时间</td>
                                <td style="width:160px" colspan="4">{{printObj.repairFinishTime}}</td>
                                <td colspan="2">维修内容</td>
                                <td style="width:160px" colspan="4">{{printObj.repairContent}}</td>                                
                            </tr>
                            <tr style="height:40px;">
                                <td colspan="4">经办人签字</td>
                                <td colspan="4">设备科科长</td>
                                <td colspan="4">资产部</td>
                            </tr>
                            <tr style="height:80px;text-align:left">
                                <td colspan="4" style="border-bottom:1px solid #fff"></td>
                                <td colspan="4" style="border-bottom:1px solid #fff">{{printList.dcsbkzOpinion}}</td>
                                <td colspan="4" style="border-bottom:1px solid #fff">{{printList.zcbfbzOpinion}}</td>
                            </tr>
                            <tr style="text-align:left">
                                <td colspan="4">经办人：{{printList.fqr}}</td>
                                <td colspan="4">经办人：{{printList.dcsbkz}}</td>
                                <td colspan="4">经办人：{{printList.zcbfbz}}</td>
                            </tr>
                            <tr style="text-align:left">
                                <td colspan="4" style="border-top:1px solid #fff">
                                    日期：{{printList.fqrDate!=null?printList.fqrDate.substring(0,10):''}}</td>
                                <td colspan="4" style="border-top:1px solid #fff">
                                    日期：{{printList.dcsbkzDate!=null?printList.dcsbkzDate.substring(0,10):''}}</td>
                                <td colspan="4" style="border-top:1px solid #fff">
                                    日期：{{printList.zcbfbzDate!=null?printList.zcbfbzDate.substring(0,10):''}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </el-dialog>
        </el-container>
    </div>
</template>

<script>
import { fetchList, getDetail, saveFrom, submitForm, delById, fetchInfoList, fetchPrint} from "@/api/equipOutInHouse/entryMaintenance";
import { menuList } from "@/store/modules/permission";
import { fetchButton } from "@/api/common/button";
import { commonOptions, fileList, recordList, processChart, getProxyOrgList, getCurrentUser, uploadlist, insertFile, deleteFileById} from "@/api/common/common";
import { baseUrl } from "@/api/common/fileBaseUrl";
export default {
    name: "entryMaintenance",
    data() {
        return {
            fileshow: false,
            // 代办审核
            ifSave: false,
            changeOrgVisible: undefined,
            proxyOrgList: [],
            comName: undefined,
            comCode: undefined,
            userCode: undefined, // 用户编码
            userId: undefined,
            // 判断新增、编辑、删除按钮权限显示隐藏
            menuCode: undefined,
            addShow: false,
            editShow: false,
            deleteShow: false,
            chooseShow: true, // 选择按钮
            printShow: false,
            chartData: null, // 流程图
            // 表格数据
            tableKey: 0,
            listLoading: false,
            tableData: [],
            total: null,
            value01: undefined,
            // 定义当前时间
            year: undefined,
            // 弹框表格数据
            infoList: [],
            total1: null,
            listQuery1: {
                pageNum: 1,
                pageSize: 10,
                type: 4,
                equipName: undefined,
                fixedAssetCode: undefined,
                equipType: undefined,
                serialNumber: undefined
            },
            // 选中的导入信息
            selectionArr: [],
            multipleSelection: null,
            checkedIndex: "",
            // 审核状态下拉框
            options: commonOptions,
            checkStart: '0',
            pageNum: 1,
            pageSize: 10,
            listQuery: {
                documnetCode: '',
                fixedAssetCode: '',
                equipmentName: '',
                checkStart: '',
                requestDateUp: '',
                requestDateEnd: '',
            },
            id: undefined,
            temp: {
                isPost: false,
                proxyOrgCode: undefined,
                repairContent: undefined,
                repairFinishTime: undefined,
                repairTime: undefined,
                repairerName: undefined,
                reportDocumnetCode: undefined,
                list: []
            },
            dialogFormVisible: false,
            centerDialogVisible: false,

            dialogStatus: "",
            textMap: {
                update: "编辑",
                create: "新增",
                detail: "查看"
            },
            // 文件数据
            fileData: [],
            documentWordCode: undefined, // 单据编号
            processInstanceId: undefined, // 流程实例id
            printDialogVisible: false,
            printList: {
                fqr: null,
                fqrDate: null,
                zcbfbz: null,
                zcbfbzDate: null,
                zcbfbzOpinion: null,
                dcsbkz: null,
                dcsbkzOpinion: null,
                dcsbkzDate: null
            },
            printObj: {},
            printId: "",
            lcData: [],
            // 流转记录
            activeName: "first",
            recordShow: false,
            recordData: null,
            rules: {
                repairerName: [{ required: true, message: "此项为必填项", trigger: "change"}],
                repairTime: [{ required: true, message: "此项为必填项", trigger: "change"}],
                repairFinishTime: [{ required: true, message: "此项为必填项", trigger: "change" }],
                repairContent: [{ required: true, message: "此项为必填项", trigger: "change"}]
            }
        };
    },
    created() {
        this.getList();
        this.getButton();
        this.getDate();
    },
    methods: {
        // 获取当前时间
        getDate() {
            var date = new Date();
            this.year = date.getFullYear();
        },
        getButton() {
            menuList.forEach(item => {
                item.children.forEach(e => {
                    if (e.name == "entryMaintenance") {
                        this.menuCode = e.code;
                    }
                });
            });
            // 查询按钮信息
            const params = {
                menuCode: this.menuCode,
                type: "web"
            };
            fetchButton(params).then(response => {
                if (response.data.code == 200) {
                    const getBtns = response.data.data;
                    for (var i = 0; i < getBtns.length; i++) {
                        if (getBtns[i].buttonName == "新增") {
                            this.addShow = true;
                        } else if (getBtns[i].buttonName == "编辑") {
                            this.editShow = true;
                        } else if (getBtns[i].buttonName == "删除") {
                            this.deleteShow = true;
                        }
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
        getList() {
            this.listLoading = true;
            fetchList(this.pageNum,this.pageSize,this.listQuery).then(response => {
                if (response.data.code === 200) {
                    this.tableData = response.data.data.list;
                    for (var i = 0; i < this.tableData.length; i++) {
                        if (this.tableData[i].checkStart == 2) {
                            this.tableData[i].checkStart = "审核中";
                            this.tableData[i].editDisabled = true;
                            this.tableData[i].deleteDisabled = true;
                        } else if (this.tableData[i].checkStart == 1) {
                            this.tableData[i].checkStart = "未提交";
                        } else if (this.tableData[i].checkStart == 3) {
                            this.tableData[i].checkStart = "审核通过";
                            this.tableData[i].editDisabled = true;
                            this.tableData[i].deleteDisabled = true;
                        } else if (this.tableData[i].checkStart == 4) {
                            this.tableData[i].checkStart = "审核不通过";
                            this.tableData[i].deleteDisabled = true;
                            this.tableData[i].editDisabled = true;
                        } else if (this.tableData[i].checkStart == 5) {
                            this.tableData[i].checkStart = "流程关闭";
                            this.tableData[i].deleteDisabled = true;
                            this.tableData[i].editDisabled = true;
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
                this.listQuery.requestDateUp = "";
                this.listQuery.requestDateEnd = "";
            } else {
                this.listQuery.requestDateUp = this.value01[0]; // 开始时间
                this.listQuery.requestDateEnd = this.value01[1];
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
        // 弹框页面表格加载
        getInfoList() {
            this.multipleSelection = "";
            this.checkedIndex = "";
            this.listLoading = true;
            fetchInfoList(this.listQuery1).then(response => {
                if (response.data.code === 200) {
                    this.infoList = response.data.data.results;
                    this.total1 = response.data.data.total;
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
        // 搜索
        handleFilter1() {
            this.listQuery1.pageNum = 1;
            this.getInfoList();
        },
        // 分页
        handleSizeChange1(val) {
            this.listQuery1.pageSize = val;
            this.getInfoList();
        },
        handleCurrentChange1(val) {
            this.listQuery1.pageNum = val;
            this.getInfoList();
        },
        // 弹框表格被选择
        handleSelect(val, row) {
            if (val.length > 1) {
                this.$refs.multipleTable.clearSelection(); // 清空所有选择
                val.shift();
                this.$refs.multipleTable.toggleRowSelection(row); //  选中当前选择
            }
            this.selectionArr = val;
            this.multipleSelection = row;
            this.checkedIndex = val.length;
        },
        handleSelectAll(val) {
            this.$message({
                title: "警告",
                message: "请选择一条要引用的信息",
                type: "warning",
                duration: 2000
            });
        },
        // 选择设备--> 确定
        importOk() {
            if (this.checkedIndex != 1) {
                this.$notify({
                    title: "警告",
                    message: "请选择一条要引用的信息",
                    type: "warning",
                    duration: 2000
                });
                return;
            }
            this.centerDialogVisible = false;
            this.temp.reportDocumentCode = this.multipleSelection.reportDocumentCode // 报修单编号
            this.temp.repairDate = this.multipleSelection.repairDate // 报修时间
            this.temp.equipName = this.multipleSelection.equipName // 设备名称
            this.temp.fixedAssetCode = this.multipleSelection.fixedAssetCode // 固定资产编号
            this.temp.requestDate = this.multipleSelection.requestDate // 要求完成时间
            this.temp.causeReason = this.multipleSelection.repariCauseReason // 故障原因
        },
        // 根据编号查看
        handleDetail(row) {
            const id = row.id;
            this.printId = row.id;
            // 根据id获取详情
            getDetail(id).then(response => {
                if (response.data.code == 200) {
                    const details = response.data.data;
                    this.temp = Object.assign({}, details);
                    this.temp.reportDocumentCode = details.reportDocumnetCode
                } else {
                    this.$notify({
                        title: "警告",
                        message: response.data.msg,
                        type: "warning",
                        duration: 2000
                    });
                }
            });
            this.activeName = "first";
            this.dialogStatus = "detail";
            this.recordShow = true;
            this.chooseShow = false;
            this.printShow = false;
            this.documentWordCode = row.documentCode; // 单据编号  
            if (row.checkStart == "审核通过") {
                this.printShow = true;
            }
            this.dialogFormVisible = true;
            this.id = row.id;
            // 流转记录
            this.processInstanceId = row.processInstanceId;
            this.getFileList();
        },
        // 维修记录附件上传
        fileUpload(e) {
            const file = e.target.files[0]
            const fileData1 = {
                attachmentCode: 'WXJLSCFJ',
                code: this.documentWordCode,
                moduleType: '24',
                fileName: undefined, // 文件名称
                filePath: undefined, // 文件URL
                node: '开始',
                fileUrl: undefined,
                userId: this.userId,
            }
            if (file != null) {
                this.listLoading = true
                const param = new FormData() // 创建form对象
                param.append('file', file, file.name) // 通过append向form对象添加数据
                fileData1.fileName = file.name
                uploadlist(param).then(resp => { // 调用上传接口
                if (resp.data.code == 200) {
                    fileData1.filePath = resp.data.data.remoteFilename
                    fileData1.fileUrl = resp.data.data.fileUrl
                    // 编辑时新增文件
                    if (this.dialogStatus == 'update') {
                    insertFile(fileData1).then(response => {
                        if (response.data.code == 200) {
                        fileData1.id = response.data.data
                        this.$message({
                            title: '成功',
                            message: '上传成功',
                            type: 'success',
                            duration: 2000
                        })
                        this.fileData.push(fileData1)
                        }
                    })
                    } else if (this.dialogStatus == 'create') {
                    this.fileData.push(fileData1)
                    this.$message({
                        title: '成功',
                        message: '上传成功',
                        type: 'success',
                        duration: 2000
                    })
                    }
                    setTimeout(() => {
                    this.listLoading = false
                    }, 1 * 500)
                } else if (resp.data.code === 402) {
                    this.$notify({
                    title: '警告',
                    message: resp.data.msg,
                    type: 'warning',
                    duration: 2000
                    })
                } else {
                    this.$notify({
                    title: '警告',
                    message: '上传失败',
                    type: 'warning',
                    duration: 2000
                    })
                }
                this.listLoading = false
                const fileInput = document.getElementById('uploadImg')
                fileInput.value = ''
                })
            }
        },
        // 获取文件列表
        getFileList() {
            const find = {
                moduleType: "24", // 模块类别
                attachmentCode: "WXJLSCFJ", // 附件编码
                documentWordCode: this.documentWordCode // 单据编码
            };
            fileList(find).then(response => {
                this.fileData = response.data.data;
            });
        },
        // 文件下载
        fileDown(row) {
            window.location.href = row.filePath + "?attname=" + row.fileName;
        },
        // 文件删除
        fileDelete(row) {
            this.$confirm('是否确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const id = row.id
                deleteFileById(id).then(response => {
                if (response.data.code === 200) {
                    const index = this.fileData.indexOf(row)
                    this.fileData.splice(index, 1)
                    this.$message({
                    title: '成功',
                    type: 'success',
                    message: '删除成功!',
                    duration: 2000
                    })
                } else {
                    this.$notify({
                    title: '警告',
                    message: response.data.msg,
                    type: 'warning',
                    duration: 2000
                    })
                }
                })
            }).catch(() => {
                this.$message({
                type: 'info',
                message: '已取消删除'
                })
            })
        },
        // 删除
        deleteBtn(row) {
            this.$confirm("是否确认删除?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    const id = row.id;
                    delById(id).then(response => {
                        if (response.data.code === 200) {
                            const index = this.tableData.indexOf(row);
                            this.tableData.splice(index, 1);
                            this.getList();
                            this.$message({
                                title: "成功",
                                type: "success",
                                message: "删除成功!",
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
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        },
        resetTemp() {
            this.temp = {
                proxyOrgCode: undefined,
                repairContent: undefined,
                repairFinishTime: undefined,
                repairTime: undefined,
                repairerName: undefined,
                reportDocumnetCode: undefined,
                list: []
            };
            this.fileData = [];
        },
        // 新增
        handleCreate() {
            this.fileshow = true
            this.resetTemp();
            this.activeName = "first";
            this.dialogStatus = "create";
            this.chooseShow = true;
            this.recordShow = false;
            this.dialogFormVisible = true;
            this.getUser();
            this.$nextTick(() => {
                this.$refs["dataForm"].clearValidate();
            });
        },
        // 选择设备
        quoteEvaluate() {
            this.listQuery1 = {
                pageNum: 1,
                pageSize: 10,
                type: 4,
                equipName: undefined,
                fixedAssetCode: undefined,
                equipType: undefined,
                serialNumber: undefined
            };
            this.centerDialogVisible = true;
            this.getInfoList();
        },
        // 新增保存
        saveData() {
            this.ifSave = true;
            this.$refs["dataForm"].validate(valid => {
                if (valid) {
                    if (this.proxyOrgList.length != 0) {
                        this.changeOrgVisible = true;
                    } else {
                        this.temp.proxyOrgCode = this.comCode;
                        this.createSave();
                    }
                }
            });
        },
        // 新增保存
        createSave() {
            if(this.fileData.length == 0){
                this.$notify({
                    title: "警告",
                    message: '请上传维修记录',
                    type: "warning",
                    duration: 3000
                });
                return
            }else{
                this.listLoading = true;
                const tempData = {
                    isPost: false,
                    list: this.fileData,
                    proxyOrgCode: this.temp.proxyOrgCode,
                    repairContent: this.temp.repairContent,
                    repairFinishTime: this.temp.repairFinishTime,
                    repairTime: this.temp.repairTime,
                    repairerName: this.temp.repairerName,
                    reportDocumnetCode: this.temp.reportDocumentCode
                }
                saveFrom(tempData).then(response => {
                    if (response.data.code == 200) {
                        this.dialogFormVisible = false;
                        this.getList();
                        setTimeout(() => {
                            this.listLoading = false;
                        }, 1 * 500);
                        this.$message({
                            title: "成功",
                            message: "保存成功",
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
        },
        // 新增提交
        createData() {
            this.ifSave = false;
            this.$refs["dataForm"].validate(valid => {
                if (valid) {
                    if (this.proxyOrgList.length != 0) {
                        this.changeOrgVisible = true;
                    } else {
                        this.temp.proxyOrgCode = this.comCode;
                        this.createSubmit();
                    }
                }
            });
        },
        // 新增提交
        createSubmit() {
            if(this.fileData.length == 0){
                this.$notify({
                    title: "警告",
                    message: '请上传维修记录',
                    type: "warning",
                    duration: 3000
                });
                return
            }else{
                this.listLoading = true;
                const tempData = {
                    isPost: true,
                    list: this.fileData,
                    proxyOrgCode: this.temp.proxyOrgCode,
                    repairContent: this.temp.repairContent,
                    repairFinishTime: this.temp.repairFinishTime,
                    repairTime: this.temp.repairTime,
                    repairerName: this.temp.repairerName,
                    reportDocumnetCode: this.temp.reportDocumentCode
                }
                saveFrom(tempData).then(response => {
                    if (response.data.code == 200) {
                        this.dialogFormVisible = false;
                        this.getList();
                        setTimeout(() => {
                            this.listLoading = false;
                        }, 1 * 500);
                        this.$message({
                            title: "成功",
                            message: "保存成功",
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
        },
        // 编辑
        handleUpdate(row) {
            this.fileshow = true
            this.fileData = []
            const id = row.id;
            // 根据id获取详情
            getDetail(id).then(response => {
                if (response.data.code == 200) {
                    const details = response.data.data;
                    this.temp = Object.assign({}, details);
                    this.temp.reportDocumentCode = details.reportDocumnetCode
                } else {
                    this.$notify({
                        title: "警告",
                        message: response.data.msg,
                        type: "warning",
                        duration: 2000
                    });
                }
            });
            this.documentWordCode = row.documentCode; // 单据编号 
            this.activeName = "first";
            this.dialogStatus = "update";
            this.recordShow = false;
            this.chooseShow = true;
            this.dialogFormVisible = true;
            this.id = row.id;
            this.getUser();
            this.getFileList();
            this.$nextTick(() => {
                this.$refs["dataForm"].clearValidate();
            });
        },
        // 获取当前用户信息
        getUser() {
            getCurrentUser().then(response => {
                if (response.data.code == 200) {
                    this.userCode = response.data.data.userCode;
                    this.userId = response.data.data.id;
                    getProxyOrgList(this.userCode).then(response => {
                        if (response.data.code == 200) {
                            this.comName = response.data.data.orgName;
                            this.comCode = response.data.data.orgCode;
                            if (this.proxyOrgList != null) {
                                this.proxyOrgList = response.data.data.list;
                            }
                        }
                    });
                }
            });
        },
        proxyOrgChange() {
            this.proxyOrgList.forEach(item => {
                if (item.orgName == this.temp.proxyOrgName) {
                    this.temp.proxyOrgCode = item.orgCode;
                }
            });
        },
        changeOrgOk() {
            if (
                this.temp.proxyOrgName == undefined ||
                this.temp.proxyOrgName == "" ||
                this.temp.proxyOrgName == null
            ) {
                this.temp.proxyOrgCode = this.comCode;
                if (this.ifSave == true) {
                    this.createSave();
                } else if (this.ifSave == false) {
                    this.createSubmit();
                }
            } else {
                if (this.ifSave == true) {
                    this.createSave();
                } else if (this.ifSave == false) {
                    this.createSubmit();
                }
            }
            this.changeOrgVisible = false;
        },
        // 修改保存
        updateSaveData() {
            this.$refs["dataForm"].validate(valid => {
                if (valid) {
                    if(this.fileData.length == 0){
                        this.$notify({
                            title: "警告",
                            message: '请上传维修记录',
                            type: "warning",
                            duration: 3000
                        });
                        return
                    }else{
                        this.listLoading = true;
                        const tempData = {
                            id: this.temp.id,
                            documentCode: this.temp.documentCode,
                            isPost: false,
                            proxyOrgCode: this.temp.proxyOrgCode,
                            repairContent: this.temp.repairContent,
                            repairFinishTime: this.temp.repairFinishTime,
                            repairTime: this.temp.repairTime,
                            repairerName: this.temp.repairerName,
                            reportDocumnetCode: this.temp.reportDocumentCode
                        }
                        submitForm(tempData).then(response => {
                            if (response.data.code == 200) {
                                this.dialogFormVisible = false;
                                this.getList();
                                setTimeout(() => {
                                    this.listLoading = false;
                                }, 1 * 500);
                                this.$message({
                                    title: "成功",
                                    message: "保存成功",
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
                }
            });
        },
        // 修改提交
        updateData() {
            this.$refs["dataForm"].validate(valid => {
                this.updataSubmit();
            });
        },
        updataSubmit() {
            if(this.fileData.length == 0){
                this.$notify({
                    title: "警告",
                    message: '请上传维修记录',
                    type: "warning",
                    duration: 3000
                });
                return
            }else{
                this.listLoading = true;
                const tempData = {
                    id: this.temp.id,
                    documentCode: this.temp.documentCode,
                    isPost: true,
                    proxyOrgCode: this.temp.proxyOrgCode,
                    repairContent: this.temp.repairContent,
                    repairFinishTime: this.temp.repairFinishTime,
                    repairTime: this.temp.repairTime,
                    repairerName: this.temp.repairerName,
                    reportDocumnetCode: this.temp.reportDocumentCode
                }
                submitForm(tempData).then(response => {
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
        },
        // tabs 点击事件
        handleClick(tab, event) {
            if (tab.label == "流转记录") {
                this.recordData = null;
                // 请求流转记录
                if (this.processInstanceId != null && this.processInstanceId != "") {
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
                if ( this.processInstanceId != null && this.processInstanceId != "" ) {
                    this.listLoading = true;
                    processChart(this.processInstanceId).then(response => {
                        if ( response.data.code != 803 && response.data.code != 808 ) {
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
                        }  else if (item.taskName == "设备科长") {
                            this.printList.dcsbkz = item.userName;
                            this.printList.dcsbkzOpinion = item.opinion;
                            this.printList.dcsbkzDate = item.dateTime;
                        }  else if (item.taskName == "资产部设备主管") {
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

