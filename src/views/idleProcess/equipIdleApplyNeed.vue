<template>
  <div class='app-container'>
    <el-container>
      <!-- <el-header> -->
        <div class="formSearch">
					<el-form :inline="true">
            <el-form-item label="单据编号">
              <el-input class="filter-item input" v-model="listQuery.formCode">
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
            <el-form-item label="申请日期">
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
            <el-form-item>
              <el-button class="filter-item" type="primary" style="float:right"  icon="el-icon-search" @click="handleFilter">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
      <!-- </el-header> -->
      <el-main style="padding:20px 0">
        <el-table :key='tableKey' :data="tableData" height="200" row-key="id" v-loading="listLoading" 
          border fit highlight-current style="width: 100%;margin-top:10px;min-height:500px" 
          :header-cell-style="{background:'oldlace'}">
          <el-table-column align="center" label="单据编号">
            <template slot-scope="scope">
              <span class="look-detail" @click="handleDetail(scope.row)">{{scope.row.formCode}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="固定资产编号" >
            <template slot-scope="scope">
              <span>{{scope.row.fixedAssetCode}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="使用公司" >
            <template slot-scope="scope">
              <span>{{scope.row.companyName}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="使用工厂" >
            <template slot-scope="scope">
              <span>{{scope.row.factoryName}}</span>
            </template>
          </el-table-column>
          
          <el-table-column align="center" label="申请日期" >
            <template slot-scope="scope">
              <span>{{scope.row.applyDate}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="设备名称" >
            <template slot-scope="scope">
              <span>{{scope.row.equipmentName}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="型号规格" >
            <template slot-scope="scope">
              <span>{{scope.row.model}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="出厂编号" >
            <template slot-scope="scope">
              <span>{{scope.row.serialNumber}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="" align="center" label="审核状态" >
            <template slot-scope="scope">
              <span>{{scope.row.auditingType}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="140px">
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
      <!-- 查看设备闲置申请单 -->
			<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" v-dialogDrag width="60%" :close-on-click-modal="false" v-loading="listLoading"> 
				<el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="表单信息" name="first">
            <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="110px">
              <el-form-item>
                <span class="equip-title">设备闲置申请单</span>
              </el-form-item>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="单据编号" prop="formCode">
                    <el-input v-model="temp.formCode" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="固定资产编号" prop="fixedAssetCode">
                    <el-input v-model="temp.fixedAssetCode" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="使用公司" prop="companyName">
                    <el-input v-model="temp.companyName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="使用工厂" prop="factoryName">
                    <el-input v-model="temp.factoryName" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="申请日期" prop="applyDate">
                    <el-date-picker style="width:100%"
                      v-model="temp.applyDate"
                      type="date" disabled>
                    </el-date-picker>
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
                  <el-form-item label="数量" prop="number">
                    <el-input v-model="temp.number" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="使用部门" prop="divisionName">
                    <el-input v-model="temp.divisionName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="9" style="padding-right:0px;">
                  <el-form-item label="闲置位置" prop="unusedPlace">
                    <el-input v-model="temp.unusedPlace" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="3" style="padding-left:0px;">
                  <el-button type="primary" @click="changePlace" :disabled="tzsqTask">选择</el-button>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="制造厂家(制造部门)" prop="manufacturer">
                    <el-input v-model="temp.manufacturer" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="出厂编号" prop="serialNumber">
                    <el-input v-model="temp.serialNumber" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="11">
                  <el-form-item label="闲置天数" prop="unusedDays">
                    <el-input v-model="temp.unusedDays" :disabled="tzsqTask"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="1" style="padding:0px;font-size:20px;font-weight:800;">
                  <span>天</span>
                </el-col>
                <el-col :span="1" style="width:2px;color:red;padding:8px 10px 8px 1px" v-if="!finance">
                  <span>*</span>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="设备完好情况" prop="equipStatus">
                    <el-radio v-model="temp.equipStatus" label="1" :disabled="finance">闲置可用</el-radio>
                    <el-radio v-model="temp.equipStatus" label="2" :disabled="finance">闲置待报废</el-radio>	
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="申请闲置理由" prop="applyUnusedReason">
                <el-input v-model="temp.applyUnusedReason" :disabled="tzsqTask"></el-input>
              </el-form-item>
              <el-row>
                <el-col :span="1" v-if="sbkShow" style="width:1px;color:red;padding:8px">
                  <span>*</span>
                </el-col>
                <el-col :span="9"><!-- 设备科节点文件必传 -->
                  <el-form-item label="附件上传" prop="fileData">
                    <input id="uploadImg1" type="file" @change="fileUpload1">
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <el-table :data="fileData"
              border fit highlight-current style="width: 60%; margin-left:100px;">
              <el-table-column align="center" label="文件名" >
                <template slot-scope="scope">
                  <span class="look-detail" @click="lookFile(scope.row)">{{scope.row.fileName}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="上传节点" >
                <template slot-scope="scope">
                  <span>{{scope.row.node}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <el-button title="下载" type="primary" size="mini" icon="el-icon-download" @click="fileDown(scope.row)"></el-button>
                  <el-button title="删除" type="danger" icon="el-icon-delete" size="mini"  @click="updatefileDelete(scope.row)" 
                   :disabled="scope.row.deleteDisabled?true:false"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="流转记录" name="second">
            <el-table :data="recordData" height="500" border fit highlight-current style="width: 100%;">
              <el-table-column align="center" type="index" label="序号" min-width="100">
              </el-table-column>
              <el-table-column prop="taskName" align="center" label="步骤名称" >
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
              <img id="pic" :src="chartData"/>
            </div>
          </el-tab-pane>
        </el-tabs>
				<el-form class="formDw">
          <el-form-item>
            <el-button type="primary" @click="dialogFormVisible = false">返回</el-button>
						<el-button type="primary" @click="agreeData" v-if="tzsqTask">同意</el-button>
            <el-button type="primary" @click="againSubmit" v-if="!tzsqTask">提交</el-button>
            <el-button type="primary" @click="endbtn" v-if="!tzsqTask">结束流程</el-button>
						<el-button type="primary" @click="unAgreeData" v-if="tzsqTask">退回</el-button>
          </el-form-item>
        </el-form>
			</el-dialog>
			<!-- 同意/退回 -->
			<el-dialog :title="textMap[dialogStatus]" :visible.sync="agreeDialogVisible" width="30%" :close-on-click-modal="false" v-dialogDrag>
				<el-form :model="popData" label-position="left" label-width="50px">
          <span style="color:red;position:absolute;top:90px;left:13px">*</span>
					<el-form-item label="意见" prop="opetion">
						<el-input type="textarea" maxlength="128" v-model="popData.opetion"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="agreeDialogVisible = false">取消</el-button>
					<el-button v-if="dialogStatus=='agree'" type="primary" @click="createData">同意</el-button>
          <el-button v-if="dialogStatus=='unagree'" type="primary" @click="updateData">确定</el-button>
				</div>
			</el-dialog>
       <!-- 选择设备地址 -->
      <el-dialog width="50%" title="选择闲置位置" :visible.sync="equipVisible" append-to-body :close-on-click-modal="false" v-dialogDrag>
        <el-container>
          <el-aside width="500px">
            <span style="margin-left:20px;color:red" prop='getEquipTypeName'>{{getEquipTypeName}}</span>
            <el-tree 
            :data="equipData" 
            :props="defaultProps" 
            @node-click="handleNodeClick"></el-tree>
          </el-aside>
        </el-container>
        <div slot="footer" class="dialog-footer">
          <el-button @click="equipVisible= false">取消</el-button>
          <el-button @click="handleClickOk" type="primary">确定</el-button>
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
            <el-tree :data="personOrgData" :props="defaultProps1" @node-click="handleNodeClick2" v-loading="treeLoading" :render-content="renderContent"></el-tree>
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
import { fetchNeedList, getDetail, fetchTree, agreeApply, submitForm } from '@/api/idleProcess/equipIdleApply/equipIdleApply'
import { getCurrentUser, getCurrentTask, fileList, recordList, uploadlist, deleteFileById, insertFile, endProcess, processChart, fetchChooseTree, choosePersonList, transferList } from '@/api/common/common'
import { validateNumber1 } from '@/utils/validate'
import { baseUrl } from '@/api/common/fileBaseUrl'
export default {
  name: 'equipIdleApplyNeed',
  data() {
    const validateNumber = (rule, value, callback) => {
      if (!validateNumber1(value)) {
        callback(new Error('请输入正确格式的天数'))
      } else {
        callback()
      }
    }
    return {
      chartData: null, // 流程图
      // 节点判断是否可输入
      finance: true, // 资产部
      tzsqTask: true, // 调整申请
      sbkShow: false, // 设备科节点
      // 弹框组
      dialogFormVisible: false, // 查看
      agreeDialogVisible: false, // 同意/退回
      // 设备地址
      equipVisible: false,
      equipData: [],
      defaultProps: {
        children: 'children',
        label: 'addressName'
      },
      getEquipTypeCode: undefined,
      getEquipTypeName: undefined,
      // 表格数据
      tableData: [],
      tableKey: 0,
      listLoading: false,
      total: null,
      value01: undefined,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        formCode: undefined,
        fixedAssetCode: undefined,
        equipmentName: undefined,
        applyDateStart: undefined,
        applyDateEnd: undefined
      },
      id: undefined,
      temp: {
        id: undefined,
        accountId: undefined, // 台账id
        applyUnusedReason: undefined, // 申请闲置理由
        formCode: undefined, // 单据编号
        applyDate: undefined, // 申请日期

        number: 1, // 数量
        unusedDays: undefined, // 闲置天数
        unusedPlace: undefined, // 闲置位置

        fixedAssetCode: undefined, // 固定资产编码
        equipmentName: undefined, // 设备名称
        companyName: undefined, // 使用公司
        factoryName: undefined, // 使用工厂
        divisionName: undefined, // 使用部门
        model: undefined, // 规格型号
        manufacturer: undefined, // 制造厂家
        serialNumber: undefined, // 出厂编码
        equipStatus: null, // 闲置完好状态

        files: []
      },
      // 选择人员
      defaultProps1: {
        children: 'children',
        label: 'orgFullName'
      },
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
      // 任务审批
      popData: {
        flag: undefined,
        opetion: undefined,
        taskId: undefined, // 任务id
        equipStatus: null,
        documentWordCode: undefined,
        id: undefined
      },
      taskId: undefined,
      dialogStatus: '',
      textMap: {
        detail: '查看设备闲置申请单',
        agree: '同意办理',
        unagree: '退回办理'
      },
      // 文件数据
      fileData: [],
      userId: undefined, // 用户id
      nodeKey: undefined, // 节点key
      nodeName: undefined, // 节点名称
      processInstanceId: undefined, // 流程实例id
      documentWordCode: undefined, // 单据编码
      // 流转记录
      recordData: null,
      activeName: 'first',
      rules: {
        formCode: [{ required: true, message: '请输入单据编号', trigger: 'change' }],
        equipmentName: [{ required: true, message: '请输入设备名称', trigger: 'change' }],
        model: [{ required: true, message: '请输入型号规格', trigger: 'change' }],
        fixedAssetCode: [{ required: true, message: '请输入固定资产编号', trigger: 'change' }],

        serialNumber: [{ required: true, message: '请输入出厂编号', trigger: 'change' }],
        // manufacturer: [{ required: true, message: '请输入制造厂家', trigger: 'change' }],

        companyName: [{ required: true, message: '请输入使用公司', trigger: 'change' }],
        factoryName: [{ required: true, message: '请输入使用工厂', trigger: 'change' }],
        divisionName: [{ required: true, message: '请输入使用部门', trigger: 'change' }],

        number: [{ required: true, message: '请输入数量', trigger: 'change' }],
        applyUnusedReason: [{ required: true, message: '请输入申请闲置理由', trigger: 'change' }],
        transferTime: [{ required: true, message: '请选择移交时间', trigger: 'change' }],
        unusedDays: [{ required: true, trigger: 'change', validator: validateNumber }],
        unusedPlace: [{ required: true, message: '请选择闲置位置', trigger: 'change' }]
        // applyDate: [{ required: true, message: '请选择申请日期', trigger: 'change' }]
        // equipStatus: [{ required: true, message: '请选择闲置完好状态', trigger: 'change' }]
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
      fetchNeedList(this.listQuery).then(response => {
        if (response.data.code === 200) {
          this.tableData = response.data.data.list
          for (var i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].auditingType == 2) {
              this.tableData[i].auditingType = '审核中'
            } else if (this.tableData[i].auditingType == 1) {
              this.tableData[i].auditingType = '未提交'
            } else if (this.tableData[i].auditingType == 3) {
              this.tableData[i].auditingType = '审核通过'
            } else if (this.tableData[i].auditingType == 4) {
              this.tableData[i].auditingType = '审核不通过'
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
        this.listQuery.applyDateStart = ''
        this.listQuery.applyDateEnd = ''
      } else {
        this.listQuery.applyDateStart = this.value01[0]// 开始时间
        this.listQuery.applyDateEnd = this.value01[1]
      }
    },
    // 搜索
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    // 分页
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    },
    // 根据编号查看
    handleDetail(row) {
      this.activeName = 'first'
      this.dialogStatus = 'detail'
      this.finance = true
      this.sbkShow = false
      this.dialogFormVisible = true
      this.popData.taskId = row.taskId
      this.id = row.id
      this.documentWordCode = row.formCode // 单据编号
      this.processInstanceId = row.processInstanceId
      getDetail(this.id).then(response => {
        if (response.data.code === 200) {
          this.temp = Object.assign({}, response.data.data)
          this.temp.applyDate = row.applyDate
        } else {
          this.$notify({
            title: '警告',
            message: response.data.msg,
            type: 'warning',
            duration: 3000
          })
        }
      })
      this.getUser() // 获取当前用户
      this.getNodeKey() // 获取当前任务信息
    },
    // 选择设备地址
    changePlace() {
      fetchTree().then(response => {
        this.equipData = []
        this.equipData = response.data.data[0].children
      })
      this.equipVisible = true
    },
    // 设备地址树
    handleNodeClick(data) {
      this.getEquipTypeCode = data.addressCode
      this.getEquipTypeName = data.addressName
    },
    // 选择设备地址确认
    handleClickOk() {
      this.temp.unusedPlace = this.getEquipTypeName
      this.equipVisible = false
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
          if (this.nodeName == '资产部') { // 判断是否是资产部审核节点
            this.finance = false
          } else if (this.nodeName == '调整申请') { // 判断是否为调整申请
            this.tzsqTask = false
          } else if (this.nodeName == '设备科') {
            this.sbkShow = true
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
    // 获取文件列表
    getFileList() {
      const find = {
        moduleType: '10', // 模块类别
        attachmentCode: 'SBXZSQDFJ', // 附件编码
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

    // 文件上传
    fileUpload1(e) {
      const file = e.target.files[0]
      const fileData1 = {
        attachmentCode: 'SBXZSQDFJ',
        code: this.documentWordCode, // 单据编码
        moduleType: '10',
        fileName: undefined, // 文件名称
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
            })
            setTimeout(() => {
              this.listLoading = false
            }, 1 * 500)
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
          const fileInput = document.getElementById('uploadImg1')
          fileInput.value = ''
        })
      }
    },
    // 文件下载
    fileDown(row) {
      window.location.href = row.filePath + '?attname=' + row.fileName
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
    // 编辑查看文件删除
    updatefileDelete(row) {
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
    // 同意
    agreeData() {
      this.popData.opetion = null
      this.popData.flag = true
      this.popData.equipStatus = this.temp.equipStatus// 设备采购完成时间
      this.popData.documentWordCode = this.documentWordCode
      this.popData.id = this.id
      if (this.nodeName == '资产部') { // 判断是否是资产部审核节点
        if (this.popData.equipStatus == null) {
          this.$notify({
            title: '警告',
            message: '请选择设备完好情况',
            type: 'warning',
            duration: 2000
          })
        } else {
          this.dialogStatus = 'agree'
          this.agreeDialogVisible = true
        }
      } else {
        this.dialogStatus = 'agree'
        this.agreeDialogVisible = true
      }
    },
    createData() {
      if (this.popData.opetion == null || this.popData.opetion == '') {
        this.$notify({
          title: '警告',
          message: '请填写意见',
          type: 'warning',
          duration: 3000
        })
        return
      }
      const tempData = Object.assign({}, this.popData)
      agreeApply(tempData).then(response => {
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
      this.popData.opetion = null
      this.dialogStatus = 'unagree'
      this.agreeDialogVisible = true
      this.popData.flag = false
      this.popData.equipStatus = this.temp.equipStatus
      this.popData.documentWordCode = this.documentWordCode
      this.popData.id = this.id
    },
    updateData() {
      if (this.popData.opetion == null || this.popData.opetion == '') {
        this.$notify({
          title: '警告',
          message: '请填写意见',
          type: 'warning',
          duration: 3000
        })
        return
      }
      const tempData = Object.assign({}, this.popData)
      agreeApply(tempData).then(response => {
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
          this.listLoading = true
          const tempData = {
            id: this.id,
            formCode: this.temp.formCode,
            accountId: this.temp.accountId,
            applyUnusedReason: this.temp.applyUnusedReason,
            number: this.temp.number,
            unusedDays: this.temp.unusedDays,
            unusedPlace: this.temp.unusedPlace,
            processInstanceId: this.processInstanceId,
            taskId: this.popData.taskId
          }
          submitForm(tempData).then(response => {
            if (response.data.code == 200) {
              this.dialogFormVisible = false
              this.getList()
              setTimeout(() => {
                this.listLoading = false
              }, 1 * 500)
              this.$message({
                title: '成功',
                message: '修改成功',
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
      })
    },
    endbtn() {
      const taskId = this.popData.taskId
      const val = 1
      const id = this.id
      const moduleTypeId = 16
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
    // tabs 点击事件
    handleClick(tab, event) {
      if (tab.label == '流转记录') {
        this.listLoading = true
        this.recordData = null
        // 请求流转记录
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
      } else if (tab.label == '流程图') {
        this.chartData = null
        if (this.processInstanceId != null) {
          this.listLoading = true
          processChart(this.processInstanceId).then(response => {
            if (response.data.code != 803 && response.data.code != 808) {
              this.chartData = response.request.responseURL
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
    handleNodeClick2(data) {
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
    }
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
	/* color: #337ab7; */
}
.formDw{
	position: absolute;
	right: 20px;
	top: 80px;
}
.el-tree-node__content:hover {
  background-color: #6dc6fa;
  border-radius:3%
} 
#pic{
  width: 100%;
}
</style>

