<template>
  <div class='app-container'>
    <el-container>
      <!-- <el-header> -->
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
                <el-form-item>
                    <el-button class="filter-item" type="primary" style="float:right" icon="el-icon-search" @click="handleFilter">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
      	<!-- </el-header> -->
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
				<el-table-column align="center" label="操作" width="140px" fixed="right">
					<template slot-scope="scope">
						<el-button title="转办" type="success" icon="el-icon-share" size="mini"  @click="changeHandle(scope.row)"></el-button>
					</template>
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
					layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div>
		</el-footer>
        <!-- 查看 -->
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
									<el-input :disabled="!chooseShow" type="textarea" maxlength="200" v-model="temp.repairContent"></el-input>
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
									<el-button title="删除" type="danger" :disabled="!chooseShow" icon="el-icon-delete" size="mini"  @click="fileDelete(scope.row)"></el-button>
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
            <el-table height='500' :data="orgListData" v-loading="listLoading" border fit highlight-current-row
              style="width: 100%;min-height:300px;margin-top:8px">
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
import { fetchNeedList, getDetail, agreeApply, reCommit, fetchPrint } from '@/api/equipOutInHouse/entryMaintenance'
import { endProcess, uploadlist, fileList, deleteFileById, getCurrentUser, insertFile, recordList, getCurrentTask, processChart, fetchChooseTree, choosePersonList, transferList } from '@/api/common/common'
import { baseUrl } from '@/api/common/fileBaseUrl'
export default {
    name: 'entryMaintenanceNeed',
    data() {
        return {
            chooseShow: true,
			printObj: {},
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
                documnetCode: '',
                fixedAssetCode: '',
                equipmentName: '',
                requestDateUp: '',
                requestDateEnd: '',
            },
            id: undefined,
            temp: {
                id: undefined,
                repairDocumentId: undefined, // 维修单id
                formCode: undefined, // 单据编号
                applicationTime: undefined, // 申请时间

                nums: undefined, // 数量
                transferOutCompany: undefined, // 调出公司
                transferOutCompanyName: undefined, // 调出公司名称
                transferOutFactory: undefined,
                transferOutFactoryName: undefined,
                transferOutDepartment: undefined,
                transferOutDepartmentName: undefined,
                transferInCompany: undefined,
                transferInCompanyName: undefined,
                transferInFactory: undefined,
                transferInFactoryName: undefined,
                transferInDepartment: undefined,
                transferInDepartmentName: undefined,
                fixedAssetCode: undefined, // 固定资产编码
                equipName: undefined, // 设备名称
                equipType: undefined, // 规格型号
                depreciationPeriod: undefined, // 折旧年限
                usedPeriod: undefined, // 已用年限
                serialNumber: undefined, // 出厂编号
                manufacturer: undefined, // 制造厂家
                originalFinancialValue: undefined, // 财务原值
                netBookValue: undefined, // 账面净值

                remark: undefined, // 备注
                reason: undefined,
                otherDescription: undefined,
                type: 2
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
                children: 'children',
                label: 'orgFullName'
            },
            getOrgName: undefined,
            getOrgCode: undefined,
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
            dialogStatus: '',
            textMap: {
                detail: '查看',
                agree: '同意办理',
                unagree: '退回办理'
            },
            dialogStatus1: '',
            textMap1: {
                company: '选择公司',
                factory: '选择工厂'
            },
            // 文件数据
            fileData: [],
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
            recordData: null,
            activeName: 'first',
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
            fetchNeedList(this.pageNum,this.pageSize,this.listQuery).then(response => {
                if (response.data.code === 200) {
                    this.tableData = response.data.data.list
                    for (var i = 0; i < this.tableData.length; i++) {
                        if (this.tableData[i].checkStart == 2) {
                            this.tableData[i].checkStart = '审核中'
                        } else if (this.tableData[i].checkStart == 1) {
                            this.tableData[i].checkStart = '未提交'
                        } else if (this.tableData[i].checkStart == 3) {
                            this.tableData[i].checkStart = '审核通过'
                        } else if (this.tableData[i].checkStart == 4) {
                            this.tableData[i].checkStart = '审核不通过'
                        } else if (this.tableData[i].checkStart == 5) {
                            this.tableData[i].checkStart = '流程关闭'
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
			this.activeName = 'first'
			this.dialogStatus = 'detail'
			this.tzsqTask = true
			this.zcbfbzShow = false
			this.fileshow = false
			this.dialogFormVisible = true
			this.popData.taskId = row.taskId
			this.popData.processInstanceId = row.processInstanceId
			this.processInstanceId = row.processInstanceId
			this.id = row.id
			this.printId = row.id
			this.documentWordCode = row.documentCode // 单据编号
			const id = row.id
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
			this.getUser()
			this.getNodeKey() // 获取当前任务信息
        },
        // 获取当前用户信息
        getUser() {
			getCurrentUser().then(response => {
				if (response.data.code == 200) {
					this.userId = response.data.data.id
					this.getFileList() // 获取文件信息
				} else {
					this.$notify({
						title: '警告',
						message: response.data.msg,
						type: 'warning',
						duration: 2000
					})
				}
			})
        },
        // 查询当前任务信息（获取节点key值）
        getNodeKey() {
			getCurrentTask(this.processInstanceId).then(response => {
				if (response.data.code === 200) {
					this.nodeKey = response.data.data.definitionKey
					this.nodeName = response.data.data.name
					if (this.nodeName == '调整申请') { // 判断是否为调整申请
                        this.tzsqTask = false
                        this.fileshow = true
                        this.chooseShow = true
					} 
				} else {
					this.$notify({
						title: '警告',
						message: response.data.msg,
						type: 'warning',
						duration: 2000
					})
				}
			})
        },
        // 同意
        agreeData() {
			// if (this.nodeKey == 'sbjcwxjl_tzsq' && this.fileData.length == 0) {
			// 	this.$notify({
            //         title: '警告',
            //         message: '请上传维修记录',
            //         type: 'warning',
            //         duration: 2000
			// 	})
			// 	return
			// }
			this.popData.opinion = null
			this.popData.leaderPass = true
			this.dialogStatus = 'agree'
			this.agreeDialogVisible = true
        },
        createData() {
			if (this.popData.opinion == null || this.popData.opinion == '') {
				this.$notify({
					title: '警告',
					message: '请填写意见',
					type: 'warning',
					duration: 3000
				})
				return
			}
			const leaderPass = true
			agreeApply(this.popData.taskId,this.popData.opinion,leaderPass,this.userId,this.id).then(response => {
				if (response.data.code == 200) {
					this.agreeDialogVisible = false
					this.dialogFormVisible = false
					this.getList()
				} else {
					this.$notify({
						title: '警告',
						message: response.data.msg,
						type: 'warning',
						duration: 2000
					})
				}
			})
        },
        // 退回
        unAgreeData() {
			this.popData.opinion = null
			this.dialogStatus = 'unagree'
			this.agreeDialogVisible = true
			this.popData.leaderPass = false
        },
        updateData() {
			if (this.popData.opinion == null || this.popData.opinion == '') {
				this.$notify({
					title: '警告',
					message: '请填写意见',
					type: 'warning',
					duration: 3000
				})
				return
			}
			const leaderPass = false
			agreeApply(this.popData.taskId,this.popData.opinion,leaderPass,this.userId,this.id).then(response => {
				if (response.data.code == 200) {
					this.agreeDialogVisible = false
					this.dialogFormVisible = false
					this.getList()
				} else {
					this.$notify({
						title: '警告',
						message: response.data.msg,
						type: 'warning',
						duration: 2000
					})
				}
			})
        },
        // 重新提交
        againSubmit() {
			this.$refs['dataForm'].validate(valid => {
				if (valid) {
                    if (this.nodeKey == 'sbjcwxjl_tzsq' && this.fileData.length == 0) {
                        this.$notify({
                            title: '警告',
                            message: '请上传维修记录',
                            type: 'warning',
                            duration: 2000
                        })
                        return
                    }else{
                        this.listLoading = true
                        reCommit(this.popData.taskId,this.temp.fixedAssetCode,this.id).then(response => {
                            if (response.data.code == 200) {
                                this.dialogFormVisible = false
                                this.getList()
                                setTimeout(() => {
                                    this.listLoading = false
                                }, 1 * 500)
                                this.$message({
                                    title: '成功',
                                    message: response.data.msg,
                                    type: 'success',
                                    duration: 2000
                                })
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
			})
		},
		// 结束流程
        endbtn() {
			const taskId = this.popData.taskId
			const val = 1
			const id = this.id
			const moduleTypeId = 28
			this.listLoading = true
			endProcess(taskId, val, id, moduleTypeId).then(response => {
				if (response.data.code == 200) {
					this.listLoading = false
					this.dialogFormVisible = false
					this.getList()
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
        // 文件上传
        fileUpload(e) {
			const file = e.target.files[0]
			const fileData1 = {
				attachmentCode: 'WXJLSCFJ',
				code: this.documentWordCode,
				moduleType: '24',
				fileName: undefined,
				filePath: undefined, // 文件URL
				node: this.nodeName, // 节点名称
				userId: this.userId
			}
			if (file != null) {
				this.listLoading = true
				const param = new FormData() // 创建form对象
				param.append('file', file, file.name) // 通过append向form对象添加数据
				fileData1.fileName = file.name
				uploadlist(param).then(resp => { // 调用上传接口
				if (resp.data.code == 200) {
					fileData1.filePath = resp.data.data.remoteFilename
					// 调用新增文件
					insertFile(fileData1).then(response => {
					if (response.data.code == 200) {
						fileData1.id = response.data.data
						this.$message({
						title: '成功',
						message: '上传成功',
						type: 'success',
						duration: 2000
						})
						this.getFileList() // 获取文件
					} else {
						this.$notify({
						title: '警告',
						message: response.data.msg,
						type: 'warning',
						duration: 2000
						})
					}
					this.listLoading = false
					})
				} else if (resp.data.code == 402) {
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
        // 文件下载
        fileDown(row) {
        	window.location.href = row.filePath + '?attname=' + row.fileName
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
				for (var i = 0; i < this.fileData.length; i++) {
					if (this.fileData[i].userId == this.userId) {
						this.fileData[i].deleteDisabled = false
					} else {
						this.fileData[i].deleteDisabled = true
					}
				}
			})
        },
        // tabs 点击事件
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
        changeHandle(row) {
			this.changeProcessId = row.processInstanceId
			this.choosePerson()
        },
        choosePerson() {
			this.listQuery2 = {
				pageNum: 1,
				pageSize: 1000,
				perName: undefined,
				workNumber: undefined
			}
			this.orgListData = []
			this.innerVisiblePerson = true
			this.treeLoading = true
			// 查询组织树结构
			fetchChooseTree().then(response => {
				this.personOrgData = []
				this.personOrgData.push(response.data.data)
				setTimeout(() => {
					this.treeLoading = false
				}, 1 * 1000)
			})
        },
        // 组织树点击事件加载表格数据
        handleNodeClick(data) {
			this.listLoading = true
			const params = {
				orgCode: data.orgCode,
				pageNum: 1,
				pageSize: 1000
			}
			choosePersonList(params).then(response => {
				this.orgListData = response.data.data.list
				setTimeout(() => {
					this.listLoading = false
				}, 1 * 1000)
			})
        },
        handlePerson() {
			this.listLoading = true
			choosePersonList(this.listQuery2).then(response => {
				this.orgListData = response.data.data.list
				setTimeout(() => {
					this.listLoading = false
				}, 1 * 1000)
			})
        },
        // 转办人员提交
        chooseReplace(row) {
			const finds = {
				processInstanceId: this.changeProcessId,
				workNumber: row.workNumber
			}
			transferList(finds).then(response => {
				if (response.data.code === 200) {
					this.getList()
					this.innerVisiblePerson = false
					this.$message({
						title: '成功',
						type: 'success',
						message: '请求成功!',
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
        }
    }
}
</script>
<style>
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
	/* color: #337ab7; */
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