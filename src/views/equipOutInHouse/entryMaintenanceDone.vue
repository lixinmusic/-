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
            </el-table>
        </el-main>
        <el-footer>
            <div class="pagination-container">
                <el-pagination background 
                    @size-change="handleSizeChange" 
                    @current-change="handleCurrentChange" 
                    :current-page="listQuery.pageNum" 
                    :page-sizes="[5,10,15, 20]" 
                    :page-size="listQuery.pageSize" 
                    layout="total, sizes, prev, pager, next, jumper" 
                    :total="total">
                </el-pagination>
            </div>
        </el-footer>
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
							<el-col :span="10">
								<el-form-item label="维修记录上传">
									<!-- <input id="uploadImg" type="file" @change="fileUpload"> -->
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
									<el-button title="删除" type="danger" icon="el-icon-delete" disabled size="mini"  @click="fileDelete(scope.row)"></el-button>
								</template>
							</el-table-column>
						</el-table>
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
                <el-button type="primary" @click="printData" v-if="printShow">打印</el-button>
            </el-form-item>
            </el-form>
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
							<th style="float: right;">单据编号:{{printObj.documentCode}}</th>
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
import { fetchDoneList, getDetail, fetchPrint } from '@/api/equipOutInHouse/entryMaintenance'
import { commonOptions1, recordList, fileList, processChart } from '@/api/common/common'
import { baseUrl } from '@/api/common/fileBaseUrl'
export default {
    name: 'entryMaintenance',
    data() {
        return {
            chooseShow: true,
            printObj: {},
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
            checkStart: '',
            pageNum: 1,
            pageSize: 10,
            listQuery: {
                documnetCode: '',
                fixedAssetCode: '',
                equipmentName: '',
                requestDateUp: '',
                requestDateEnd: '',
                checkStart: ''
            },
            // 选择人
            diaLoading: false,
            orgListData: null,
            personOrgData: [],
            //   innerVisiblePerson: false, // 技术负责人弹框
            defaultProps: {
                children: 'children',
                label: 'orgFullName'
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
            dialogStatus: '',
            textMap: {
                detail: '查看'
            },
            // 文件数据
            fileData: [],
            documentWordCode: undefined, // 单据编号
            processInstanceId: undefined, // 流程实例id
            printShow: false,
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
            printId: '',
            lcData: [],
            // 流转记录
            activeName: 'first',
            recordData: null,
            rules: {
                repairerName: [{ required: true, message: "此项为必填项", trigger: "change"}],
                repairTime: [{ required: true, message: "此项为必填项", trigger: "change"}],
                repairFinishTime: [{ required: true, message: "此项为必填项", trigger: "change" }],
                repairContent: [{ required: true, message: "此项为必填项", trigger: "change"}]
            }
        }
    },
    created() {
        this.getList()
    },
    methods: {
        renderContent(h, { node, data, store }) {
            return (
                <span>
                <span title={node.label}>{node.label}</span>
                </span>)
        },
        getList() {
            this.listLoading = true
            fetchDoneList(this.pageNum,this.pageSize,this.listQuery).then(response => {
                if (response.data.code === 200) {
                    this.tableData = response.data.data.list
                    for (var i = 0; i < this.tableData.length; i++) {
                        if (this.tableData[i].checkStart == 2) {
                            this.tableData[i].checkStart = '审核中'
                        } else if (this.tableData[i].checkStart == 3) {
                            this.tableData[i].checkStart = '审核通过'
                        } else if (this.tableData[i].checkStart == 4) {
                            this.tableData[i].checkStart = '审核不通过'
                        } else if (this.tableData[i].checkStart == 5) {
                            this.tableData[i].checkStart = '流程关闭'
                        }
                        if (this.tableData[i].isEquipmanagerPass == 0) {
                            this.tableData[i].noticeShow = true
                        } else if (this.tableData[i].isEquipmanagerPass == 1) {
                            this.tableData[i].noticeShow = false
                        }
                    }
                    this.total = response.data.data.total
                    setTimeout(() => {
                        this.listLoading = false
                    }, 1 * 500)
                } else {
                    this.$notify({
                        title: '警告',
                        message: response.data.msg,
                        type: 'warning',
                        duration: 2000
                    })
                    this.listLoading = false
                }
            })
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
            this.pageNum = 1
            this.getList()
        },
        // 分页
        handleSizeChange(val) {
            this.pageSize = val
            this.getList()
        },
        handleCurrentChange(val) {
            this.pageNum = val
            this.getList()
        },
        // 根据编号查看
        handleDetail(row) {
            this.chooseShow = false
            const id = row.id
            this.printId = row.id
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
            this.activeName = 'first'
            this.dialogStatus = 'detail'
            this.printShow = false
            if (row.checkStart == '审核通过') {
                this.printShow = true
            }
            this.dialogFormVisible = true
            this.id = row.id
            // 流转记录
            this.processInstanceId = row.processInstanceId
            this.documentWordCode = row.documentCode // 单据编号
            this.getFileList()
        },
        // 获取文件列表
        getFileList() {
            // 获取文件列表
            const find = {
                moduleType: '24', // 模块类别
                attachmentCode: 'WXJLSCFJ', // 附件编码
                documentWordCode: this.documentWordCode // 单据编码
            }
            fileList(find).then(response => {
                this.fileData = response.data.data
            })
        },
        // 文件下载
        fileDown(row) {
            window.location.href = row.filePath + '?attname=' + row.fileName
        },
        // 打印
        printData() {
			const params = this.printId
			fetchPrint(params).then(response => {
				if (response.data.code == 200) {
					this.printList = response.data.data
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
            if (tab.label == '流转记录') {
                this.recordData = null
                // 请求流转记录
                if (this.processInstanceId != null && this.processInstanceId != '') {
                    this.listLoading = true
                    recordList(this.processInstanceId).then(response => {
                        if (response.data.code === 200) {
                            this.recordData = response.data.data
                            setTimeout(() => {
                                this.listLoading = false
                            }, 1 * 500)
                        } else {
                            this.$notify({
                                title: '警告',
                                message: response.data.msg,
                                type: 'warning',
                                duration: 2000
                            })
                            this.listLoading = false
                        }
                    })
                }
            } else if (tab.label == '流程图') {
                this.chartData = null
                if (this.processInstanceId != null && this.processInstanceId != '') {
                    this.listLoading = true
                    processChart(this.processInstanceId).then(response => {
                        if (response.data.code != 803 && response.data.code != 808) {
                            this.chartData = response.request.responseURL
                            document.getElementById('pic').src = this.chartData
                            setTimeout(() => {
                                this.listLoading = false
                            }, 1 * 500)
                        } else {
                            this.$notify({
                                title: '警告',
                                message: response.data.msg,
                                type: 'warning',
                                duration: 2000
                            })
                            this.listLoading = false
                        }
                    })
                }
            }
        },
        lookFile(row) {
            let url
            if (row.fileUrl !== undefined) {
                url = baseUrl + 'onlinePreview?url=' + encodeURIComponent(row.fileUrl)
            } else {
                url = baseUrl + 'onlinePreview?url=' + encodeURIComponent(row.filePath)
            }
            var winHeight = window.document.documentElement.clientHeight
            window.open(url, '_blank', 'height=' + winHeight + ',top=10,left=10,toolbar=no,menubar=no,scrollbars=yes,resizable=yes')
        },
    }
}
</script>
<style scoped>
.formSearch {
    width: 100%;
    background: #fafafa;
    border: 1px solid #e9e9e9;
    border-radius: 3px;
    padding: 18px 10px 0;
}
.equip-title{
    margin-left: -100px;
    text-align: center;
    display: block;
    font-size: 20px;
    font-weight: 600;
}
.look-detail {
    text-decoration:underline;
    cursor: pointer;
}
.formDw{
	position: absolute;
	right: 20px;
	top: 80px;
}
#printTest table{
  font-family:"宋体";
  width:99.5%;
  border-collapse:collapse;
  text-align: center;
}
#printTest table thead th{
  font-family:'SimHei';
  font-size: 14px;
}
#printTest table tbody tr{
  height: 60px;
  font-size:14px;
}
#printTest table tbody tr td{
  border: 1px solid black;
}

#pic{
  width: 100%;
}
</style>

