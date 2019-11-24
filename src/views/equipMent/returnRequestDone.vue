<template>
    <div class='app-container'>
        <el-container>
            <div class="formSearch">
                <el-form :inline="true">
                    <el-form-item label="单据编号">
                        <el-input class="filter-item input" v-model="recordCode" clearable>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="固定资产编号">
                        <el-input class="filter-item input" v-model="fixedAssetCode" clearable>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="设备名称">
                        <el-input class="filter-item input" v-model="equipmentName" clearable>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="型号规格">
                        <el-input class="filter-item input" v-model="model" clearable>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="申请时间">
                        <el-date-picker
                        v-model="value01"
                        type="daterange"
                        unlink-panels
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        clearable  @change="searchChange()">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="审核状态">
                        <el-select v-model="auditingType" clearable  placeholder="请选择">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="filter-item" type="primary" style="float:right"  icon="el-icon-search" @click="handleFilter">搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-main style="padding:20px 0">
                <el-table :key='tableKey' :data="tableData" height="200" row-key="id" v-loading="listLoading" border fit highlight-current style="width: 100%;margin-top:10px;min-height:500px" :header-cell-style="{background:'oldlace'}">
                    <el-table-column align="center" label="单据编号">
                        <template slot-scope="scope">
                            <span class="look-detail" @click="handleDetail(scope.row)">{{scope.row.documentWordCode}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="fixedAssetCode" label="固定资产编号" min-width="110px">
                    </el-table-column>
                    <el-table-column align="center" label="设备名称" prop="equipmentName">
                    </el-table-column>
                    <el-table-column align="center" label="型号规格" prop="model">
                    </el-table-column>
                    <el-table-column align="center" label="使用公司" prop="companyName">
                    </el-table-column>
                    <el-table-column align="center" label="使用工厂" prop="factoryName">
                    </el-table-column>
                    <el-table-column align="center" label="使用部门" prop="divisionName">
                    </el-table-column>
                    <el-table-column align="center" label="采购主体" prop="purchaseEntity">
                    </el-table-column>
                    <el-table-column align="center" label="采购商" prop="buyers">
                    </el-table-column> 
                    <el-table-column align="center" label="审核状态" prop="auditingType">
                    </el-table-column>
                    <el-table-column align="center" label="当前处理人" prop="assignee" min-width="100px">
                    </el-table-column>
                </el-table>
            </el-main>
            <el-footer>
                <div class="pagination-container">
                    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[5,10,15, 20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                    </el-pagination>
                </div>
            </el-footer>
            <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="60%" v-loading="listLoading" v-dialogDrag :close-on-click-modal="false">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="表单信息" name="first">
                        <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="110px">
                            <el-form-item>
                                <span class="equip-title">退货申请单</span>
                            </el-form-item>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="单据编号" prop="documentWordCode">
                                        <el-input v-model="temp.documentWordCode" disabled></el-input>
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
                                <el-col :span="12" style="padding-right:0px;">
                                    <el-form-item label="使用公司" prop="companyName">
                                        <el-input v-model="temp.companyName" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12" style="padding-right:0px;">
                                    <el-form-item label="使用工厂" prop="factoryName">
                                        <el-input v-model="temp.factoryName" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12" style="padding-right:0px;">
                                    <el-form-item label="使用部门" prop="divisionName">
                                        <el-input v-model="temp.divisionName" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="采购主体" prop="purchaseEntity">
                                        <el-input v-model="temp.purchaseEntity" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="采购商" prop="buyers">
                                        <el-input v-model="temp.buyers" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="合同编号" prop="contractNumber">
                                        <el-input v-model="temp.contractNumber" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="位置" prop="position">
                                        <el-input v-model="temp.position" :disabled="!chooseShow"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="24">
                                    <el-form-item label="退货原因" prop="returnReason">
                                        <el-input type="textarea" v-model="temp.returnReason" :disabled="!chooseShow"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="24">
                                    <el-form-item label="备注" prop="remark">
                                        <el-input type="textarea" v-model="temp.remark" :disabled="!chooseShow"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="流转记录" name="second">
                        <el-table :data="recordData" height="500" border fit highlight-current style="width: 100%;">
                            <el-table-column align="center" type="index" label="序号" width="55">
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
                        <el-button type="primary" @click="printData" v-if="printShow">打印</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <!-- 打印 -->
            <el-dialog title="退货申请单打印预览" v-dialogDrag :close-on-click-modal="false" :visible.sync="printDialogVisible" width="70%">
                <el-button type="primary" @click="printDialogVisible = false">返回</el-button>
                <el-button type="success" v-print="'#printTest'"><svg-icon icon-class="print"/>打印</el-button>
                <div id="printTest">
                    <table border= "0">
                        <caption style="font-family:SimHei;font-size: 16px;">
                            <p>{{printList.companyName}}</p>
                            <p>退货申请单</p>
                        </caption>
                        <thead>
                        <tr>
                            <th colspan="8" style="text-align: left;">{{printList.companyName + ' / ' + printList.factoryName + ' / ' + printList.divisionName }}</th>
                            <th colspan="4" style="text-align: right;">单据编号:{{printList.documentWordCode}}&nbsp;&nbsp;&nbsp;&nbsp;</th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colspan="2">固定资产编号</td>
                                <td colspan="2">设备名称</td>
                                <td colspan="2">型号规格</td>
                                <td colspan="2">采购主体</td>
                                <td colspan="2">采购商</td>
                                <td colspan="2">合同编号</td>
                            </tr>
                            <tr>
                                <td style="width:80px" colspan="2">{{printList.fixedAssetCode}}</td>
                                <td style="width:80px" colspan="2">{{printList.equipmentName}}</td>
                                <td style="width:80px" colspan="2">{{printList.model}}</td>
                                <td style="width:80px" colspan="2">{{printList.purchaseEntity}}</td>
                                <td style="width:80px" colspan="2">{{printList.buyers}}</td>
                                <td style="width:80px" colspan="2">{{printList.contractNumber}}</td>
                            </tr>
                            <tr>
                                <td colspan="2" style="width:80px">退货原因</td>
                                <td colspan="10">{{printList.returnReason}}</td>
                            </tr>
                            <tr>
                                <td colspan="2">位置</td>
                                <td style="width:160px" colspan="4">{{printList.position}}</td>
                                <td colspan="2">备注</td>
                                <td style="width:160px" colspan="4">{{printList.remark}}</td>
                            </tr>
                            <tr style="height:40px;">
                                <td colspan="4">经办人签字</td>
                                <td colspan="4">设备副总</td>
                                <td colspan="4">技改办主任</td>
                            </tr>
                            <tr style="height:80px;text-align:left">
                                <td colspan="4" style="border-bottom:1px solid #fff">{{printList.jbrOpinion}}</td>
                                <td colspan="4" style="border-bottom:1px solid #fff">{{printList.sbfzOpinion}}</td>
                                <td colspan="4" style="border-bottom:1px solid #fff">{{printList.jtjgbOpinion}}</td>
                            </tr>
                            <tr style="text-align:left">
                                <td colspan="4">经办人：{{printList.jbr}}</td>
                                <td colspan="4">经办人：{{printList.sbfz}}</td>
                                <td colspan="4">经办人：{{printList.jtjgb}}</td>
                            </tr>
                            <tr style="text-align:left">
                                <td colspan="4" style="border-top:1px solid #fff">
                                    日期：{{printList.jbrDate!=null?printList.jbrDate.substring(0,10):''}}</td>
                                <td colspan="4" style="border-top:1px solid #fff">
                                    日期：{{printList.sbfzDate!=null?printList.sbfzDate.substring(0,10):''}}</td>
                                <td colspan="4" style="border-top:1px solid #fff">
                                    日期：{{printList.jtjgbDate!=null?printList.jtjgbDate.substring(0,10):''}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </el-dialog>
        </el-container>
    </div>
</template>

<script>
import { fetchDoneList, getDetail, fetchPrint} from "@/api/equipMent/returnRequest";
import { commonOptions1, recordList, processChart} from "@/api/common/common";
import { baseUrl } from "@/api/common/fileBaseUrl";
export default {
    name: "returnRequestDone",
    data() {
        return {
            chooseShow: true,
            noticeShow: true,
            chartData: null, // 流程图
            // 表格数据
            tableKey: 0,
            listLoading: false,
            tableData: [],
            total: null,
            value01: undefined,

            // 审核状态下拉框
            options: commonOptions1,
            auditingType: "",
            pageNum: 1,
            pageSize: 10,
            recordCode: '',
            fixedAssetCode: '',
            equipmentName: '',
            model: '',
            auditingType: '',
            startDate: '',
            endDate: '',
            // 选择人
            diaLoading: false,
            orgListData: null,
            personOrgData: [],
            innerVisiblePerson: false, // 技术负责人弹框
            defaultProps: {
                children: "children",
                label: "orgFullName"
            },
            listQuery1: {
                pageNum: 1,
                pageSize: 1000,
                perName: undefined,
                workNumber: undefined
            },
            choosePerName: undefined,
            listQuery2: {
                id: undefined,
                workNumber: undefined,
                type: 2
            },
            id: undefined,
            temp: {
                id: undefined,
                buyers: undefined,
                companyCode: undefined,
                companyName: undefined,
                contractNumber: undefined,
                divisionCode: undefined,
                divisionName: undefined,
                equipmentName: undefined,
                factoryCode: undefined,
                factoryName: undefined,
                fixedAssetCode: undefined,
                model: undefined,
                position: undefined,
                proxyOrgCode: undefined,
                purchaseApplicationDate: undefined,
                purchaseEntity: undefined,
                remark: undefined,
                returnReason: undefined
            },
            dialogFormVisible: false,
            dialogStatus: "",
            textMap: {
                detail: "查看设备调拨单"
            },
            // 文件数据
            fileData: [],
            documentWordCode: undefined, // 单据编号
            processInstanceId: undefined, // 流程实例id
            printShow: false,
            printDialogVisible: false,
            printList: {
                jbr: null,
                sbfz: null,
                jtjgb: null,
                jbrDate: null,
                sbfzDate: null,
                jtjgbDate: null,
                jbrOpinion: null,
                sbfzOpinion: null,
                jtjgbOpinion: null
            },
            printId: "",
            // 流转记录
            activeName: "first",
            recordData: null,
            rules: {
                position: [{ required: true, message: '此项为必填项', trigger: 'change' }],
                returnReason: [{ required: true, message: '此项为必填项', trigger: 'change' }]
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
            fetchDoneList(this.pageNum,this.pageSize,this.recordCode,this.fixedAssetCode,this.equipmentName,this.model,this.startDate,this.endDate,this.auditingType).then(response => {
                if (response.data.code === 200) {
                    if(response.data.data.list != null){
                        this.tableData = response.data.data.list;
                        for (var i = 0; i < this.tableData.length; i++) {
                            if (this.tableData[i].auditingType == 2) {
                                this.tableData[i].auditingType = "审核中";
                            } else if (this.tableData[i].auditingType == 3) {
                                this.tableData[i].auditingType = "审核通过";
                            } else if (this.tableData[i].auditingType == 4) {
                                this.tableData[i].auditingType = "审核不通过";
                            } else if (this.tableData[i].auditingType == 5) {
                                this.tableData[i].auditingType = "流程关闭";
                            }
                            if (this.tableData[i].isEquipmanagerPass == 0) {
                                this.tableData[i].noticeShow = true;
                            } else if (this.tableData[i].isEquipmanagerPass == 1) {
                                this.tableData[i].noticeShow = false;
                            }
                        }
                    }else{
                        this.listLoading = false;
                        this.tableData = []
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
                this.startDate = ''
                this.endDate = ''
            } else {
                this.startDate = this.value01[0]// 开始时间
                this.endDate = this.value01[1]
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
            this.chooseShow = false
            const id = row.id;
            this.printId = row.id;
            this.recordId = row.id
            // 根据id获取详情
            getDetail(id).then(response => {
                if (response.data.code == 200) {
                    const details = response.data.data;
                    this.temp = Object.assign({}, details);
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
            this.printShow = false;
            if (row.auditingType == "审核通过") {
                this.printShow = true;
            }
            this.dialogFormVisible = true;
            this.id = row.id;
            // 流转记录
            this.processInstanceId = row.processInstanceId;
            this.documentWordCode = row.formCode; // 单据编号
        },
        // 打印
        printData() {
            // const params = this.printId
            fetchPrint(this.recordId,this.processInstanceId).then(response => {
                if (response.data.code == 200) {
                    this.printList = response.data.data
                } else {
                    this.$notify({
                        title: '警告',
                        message: response.data.msg,
                        type: 'warning',
                        duration: 2000
                    })
                }
            })
            this.printDialogVisible = true
        },
        // tabs 点击事件流转记录
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

