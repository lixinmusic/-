<template>
  <div class='app-container'>
    <el-container>
      <!-- <el-header style="height:115px"> -->
        <div class="formSearch">
          <el-form :inline="true">
            <el-form-item label="设备名称">
              <el-input class="filter-item input" v-model="listQuery.equipmentName">
              </el-input>
            </el-form-item>
            <el-form-item label="固定资产编号">
              <el-input class="filter-item input" v-model="listQuery.fixedAssetCode">
              </el-input>
            </el-form-item>
            <el-form-item label="评价日期">
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
            <el-form-item label="验收情况" prop="acceptanceType">
              <el-radio v-model="listQuery.acceptanceType" label="0">验收不通过</el-radio>
              <el-radio v-model="listQuery.acceptanceType" label="1">验收通过</el-radio>	
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
          <el-table-column align="center" label="单据编码">
            <template slot-scope="scope">
              <span class="look-detail" @click="handleDetail(scope.row)">{{scope.row.documentWordCode}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="设备名称">
            <template slot-scope="scope">
              <span>{{scope.row.equipmentName}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="供应商">
            <template slot-scope="scope">
              <span>{{scope.row.supplier}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="使用公司">
            <template slot-scope="scope">
              <span>{{scope.row.useCompanyName}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="使用工厂">
            <template slot-scope="scope">
              <span>{{scope.row.useFactoryName}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="使用车间">
            <template slot-scope="scope">
              <span>{{scope.row.useWorkshopName}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="出厂日期">
            <template slot-scope="scope">
              <span>{{scope.row.outFactoryTime}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="型号规格">
            <template slot-scope="scope">
              <span>{{scope.row.typeSpecification}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="固定资产编号">
            <template slot-scope="scope">
              <span>{{scope.row.fixedAssetCode}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="进厂日期">
            <template slot-scope="scope">
              <span>{{scope.row.inFactoryTime}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="出厂编号">
            <template slot-scope="scope">
              <span>{{scope.row.outFactoryCode}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="评价日期">
            <template slot-scope="scope">
              <span>{{scope.row.evaluateTime}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="验收情况">
            <template slot-scope="scope">
              <span>{{scope.row.acceptanceSituationName}}</span>
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
          layout="total, sizes, prev, pager, next, jumper" 
          :total="total">
          </el-pagination>
        </div>
      </el-footer>
      <!-- 新增编辑弹框 -->
      <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" :visible.sync="dialogFormVisible" width="60%" v-dialogDrag v-loading="listLoading"> 
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="表单信息" name="first">
            <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="110px">
              <el-form-item>
                <span class="equip-title">新设备评价表</span>
              </el-form-item>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="单据编码" prop="documentWordCode">
                    <el-input v-model="temp.documentWordCode" disabled></el-input>
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
                  <el-form-item label="供应商" prop="supplier">
                    <el-input v-model="temp.supplier" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="使用公司" prop="useCompanyName">
                    <el-input v-model="temp.useCompanyName" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="使用工厂" prop="useFactoryName">
                    <el-input v-model="temp.useFactoryName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="使用车间" prop="useWorkshopName">
                    <el-input v-model="temp.useWorkshopName" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="出厂日期" prop="outFactoryTime">
                    <el-date-picker style="width:100%"
                      v-model="temp.outFactoryTime"
                      type="date"
                      placeholder="选择日期"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                       :disabled="tzsqTask">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="型号规格" prop="typeSpecification">
                    <el-input v-model="temp.typeSpecification" disabled></el-input>
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
                  <el-form-item label="进厂日期" prop="inFactoryTime">
                    <el-date-picker style="width:100%"
                      v-model="temp.inFactoryTime"
                      type="date"
                      placeholder="选择日期"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                       :disabled="tzsqTask">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="出厂编号" prop="outFactoryCode">
                    <el-input v-model="temp.outFactoryCode" disabled></el-input>
                  </el-form-item>
                </el-col>
                 <el-col :span="12">
                  <el-form-item label="评价日期" prop="evaluateTime">
                    <el-date-picker style="width:100%"
                      v-model="temp.evaluateTime"
                      type="date"
                      placeholder="选择日期"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                       :disabled="tzsqTask">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="验收情况" prop="acceptanceSituation">
                    <el-radio v-model="temp.acceptanceSituation" label="1" :disabled="tzsqTask" @change="changeType()">验收通过</el-radio>
                    <el-radio v-model="temp.acceptanceSituation" label="0" :disabled="tzsqTask" @change="changeType()">验收不通过</el-radio>	
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="不通过原因" prop="noPassReason">
                    <el-input v-model="temp.noPassReason" type="textarea" style="margin-bottom:5px" :disabled="!noPassReasonShow"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  <el-form-item label="新设备评价表附件" prop="fileData" label-width="130px">
                    <input id="uploadImg" type="file" @change="fileUpload">
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <el-table :data="fileData"
              border fit highlight-current style="width: 60%; margin-left:100px;">
              <el-table-column align="center" label="文件名" >
                <template slot-scope="scope">
                  <span style="cursor:pointer;text-decoration:underline " @click="handlePreview(scope.row)">{{scope.row.fileName}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="上传节点">
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
            <el-row>
              <el-col :span="10">
                <el-form label-position="left" label-width="150px">
                <el-form-item label="设备检修记录单附件" prop="jxfileData">
                  <input id="uploadImg1" type="file" @change="fileUpload1">
                </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-table :data="jxfileData"
              border fit highlight-current style="width: 60%; margin-left:100px;">
              <el-table-column align="center" label="文件名">
                <template slot-scope="scope">
                  <span style="cursor:pointer;text-decoration:underline " @click="handlePreview(scope.row)">{{scope.row.fileName}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="上传节点">
                <template slot-scope="scope">
                  <span>{{scope.row.node}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <el-button title="下载" type="primary" size="mini" icon="el-icon-download" @click="fileDown(scope.row)"></el-button>
                  <el-button title="删除" type="danger" icon="el-icon-delete" size="mini"  @click="updatefileDelete(scope.row)"
                  :disabled="scope.row.deleteDisabled1?true:false"></el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 发函记录 v1.4.0 -->
            <el-row>
              <el-col :span="10">
                <el-form label-position="left" label-width="150px">
                <el-form-item label="发函记录" prop="fhfileData">
                  <input id="uploadImg2" type="file" @change="fileUpload2">
                </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-table :data="fhfileData"
              border fit highlight-current style="width: 60%; margin-left:100px;">
              <el-table-column align="center" label="文件名">
                <template slot-scope="scope">
                  <span style="cursor:pointer;text-decoration:underline " @click="handlePreview(scope.row)">{{scope.row.fileName}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="上传节点">
                <template slot-scope="scope">
                  <span>{{scope.row.node}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <el-button title="下载" type="primary" size="mini" icon="el-icon-download" @click="fileDown(scope.row)"></el-button>
                  <el-button title="删除" type="danger" icon="el-icon-delete" size="mini"  @click="updatefileDelete(scope.row)"
                  :disabled="scope.row.deleteDisabled2?true:false"></el-button>
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
        <!-- 按钮组 -->
        <el-form class="formDw">
          <el-form-item>
            <el-button type="primary" @click="dialogFormVisible = false">返回</el-button>
						<el-button type="primary" @click="agreeData" v-if="thShow">同意</el-button>
            <el-button type="primary" @click="againSubmit" v-if="!thShow">提交</el-button>
						<el-button type="primary" @click="unAgreeData" v-if="thShow">退回</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 同意/退回 -->
			<el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" :visible.sync="agreeDialogVisible" width="30%">
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
import { fetchNeedList, getDetail, agreeApply, reCommit } from '@/api/equipMent/equipEvaluateForm/equipEvaluateForm'
import { baseUrl } from '@/api/common/fileBaseUrl'
import { getCurrentUser, getCurrentTask, fileList, recordList, uploadlist, deleteFileById, insertFile, processChart, fetchChooseTree, choosePersonList, transferList } from '@/api/common/common'
export default {
  name: 'equipEvaluateGtask',
  data() {
    return {
      chartData: null, // 流程图
      noPassReasonShow: false,
      // 表格数据
      tableKey: 0,
      listLoading: false,
      tableData: [],
      total: null,
      value01: undefined,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        equipmentName: undefined,
        fixedAssetCode: undefined,
        evaluateDateStart: undefined,
        evaluateDateEnd: undefined,
        acceptanceType: undefined
      },
      id: undefined,
      installShow: undefined,
      isCreateAcceptance: undefined, // 是否生成报告
      temp: {
        id: undefined,
        equId: undefined,
        documentWordCode: undefined,

        acceptanceFinishTime: undefined,
        acceptanceSituation: undefined,

        auditingType: undefined,
        contractCode: undefined,

        equipmentName: undefined,
        fixedAssetCode: undefined,

        outFactoryCode: undefined,
        recordCode: undefined,

        supplier: undefined,
        typeSpecification: undefined,

        useCompanyName: undefined,
        useFactoryName: undefined,
        useWorkshopName: undefined,
        list: []
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
      dialogFormVisible: false,
      agreeDialogVisible: false, // 同意/退回
      dialogStatus: '',
      textMap: {
        detail: '查看新设备评价表',
        agree: '同意办理',
        unagree: '退回办理'
      },
      // 文件数据
      fileData: [], // 设备质量
      jxfileData: [], // 设备检修
      fhfileData: [],// 发函记录
      nodeKey: undefined, // 节点key
      nodeName: undefined, // 节点名称
      documentWordCode: undefined, // 单据编码
      userId: undefined, // 用户id
      processInstanceId: undefined, // 流程实例id
      thShow: true,
      tzsqTask: true,
      // 流转记录
      activeName: 'first',
      recordData: null,
      // 任务审批
      popData: {
        opetion: undefined,
        auditingType: undefined,
        taskId: undefined, // 任务id
        id: undefined
      },
      rules: {
        documentWordCode: [{ required: true, message: '请输入单据编码', trigger: 'change' }],
        equipmentName: [{ required: true, message: '请输入设备名称', trigger: 'change' }],

        outFactoryTime: [{ required: true, message: '请输入出厂日期', trigger: 'change' }],
        inFactoryTime: [{ required: true, message: '请输入进厂日期', trigger: 'change' }],
        evaluateTime: [{ required: true, message: '请输入评价日期', trigger: 'change' }],

        typeSpecification: [{ required: true, message: '请输入型号规格', trigger: 'change' }],
        fixedAssetCode: [{ required: true, message: '请输入固定资产编号', trigger: 'change' }],

        outFactoryCode: [{ required: true, message: '请输入出厂编号', trigger: 'change' }],
        supplier: [{ required: true, message: '请输入供应商', trigger: 'change' }],

        useCompanyName: [{ required: true, message: '请输入使用公司', trigger: 'change' }],

        useFactoryName: [{ required: true, message: '请输入使用工厂', trigger: 'change' }],
        useWorkshopName: [{ required: true, message: '请输入使用车间', trigger: 'change' }],

        acceptanceSituation: [{ required: true, message: '请选择验收情况', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // ******* 文件预览**********
    handlePreview(row) {
      var url = baseUrl + 'onlinePreview?url=' + encodeURIComponent(row.filePath)
      var winHeight = window.document.documentElement.clientHeight - 10
      window.open(url, '_blank', 'height=' + winHeight + ',top=80,left=80,toolbar=no, menubar=no, scrollbars=yes, resizable=yes')
    },
    // ******* 文件预览结束**********
    renderContent(h, { node, data, store }) {
      return (
        <span>
          <span title={node.label}>{node.label}</span>
        </span>)
    },
    // 切换验收情况
    changeType(){
        if(this.temp.acceptanceSituation == 0){
            this.noPassReasonShow = true
        }else{
            this.noPassReasonShow = false
            this.temp.noPassReason = ''
        }
    },
    getList() {
      this.listLoading = true
      fetchNeedList(this.listQuery).then(response => {
        if (response.data.code === 200) {
          if (response.data.data != null && response.data.data.list != null) {
            this.tableData = response.data.data.list
            for (var i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].auditingType == 1) {
                this.tableData[i].auditingType = '未提交'
              } else if (this.tableData[i].auditingType == 2) {
                this.tableData[i].auditingType = '审核中'
              } else if (this.tableData[i].auditingType == 3) {
                this.tableData[i].auditingType = '审核通过'
              } else if (this.tableData[i].auditingType == 4) {
                this.tableData[i].auditingType = '审核不通过'
              }
            }
            this.total = response.data.data.total
          }
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
        this.listQuery.evaluateDateStart = ''
        this.listQuery.evaluateDateEnd = ''
      } else {
        this.listQuery.evaluateDateStart = this.value01[0]// 开始时间
        this.listQuery.evaluateDateEnd = this.value01[1]
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
      this.thShow = true
      this.tzsqTask = true
      this.dialogFormVisible = true
      const id = row.id
      this.popData.taskId = row.taskId
      this.documentWordCode = row.documentWordCode // 单据编号
      this.processInstanceId = row.processInstanceId // 流程实例id
      // 表单信息
      getDetail(id).then(response => {
        if (response.data.code == 200) {
          this.temp = Object.assign({}, response.data.data)
          this.temp.acceptanceSituation = response.data.data.acceptanceSituation.toString()
        } else {
          this.$notify({
            title: '警告',
            message: response.data.msg,
            type: 'warning',
            duration: 2000
          })
        }
      })

      this.getUser()
      this.getNodeKey() // 获取当前任务信息
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
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
    getNodeKey() { //this.temp.acceptanceSituation
      getCurrentTask(this.processInstanceId).then(response => {
        if (response.data.code === 200) {
          this.nodeKey = response.data.data.definitionKey
          this.nodeName = response.data.data.name
          if (this.nodeName == '调整申请') {
            this.thShow = false
            this.tzsqTask = false
            this.noPassReasonShow = true
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
      // 新设备评价表附件
      const find = {
        moduleType: '5', // 模块类别
        attachmentCode: 'XSBPJBFJ', // 附件编码
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
      // 设备检修记录附件
      const find1 = {
        moduleType: '5', // 模块类别
        attachmentCode: 'SBJXJLFJ', // 附件编码
        documentWordCode: this.documentWordCode // 单据编码
      }
      fileList(find1).then(response => {
        this.jxfileData = response.data.data
        for (var i = 0; i < this.jxfileData.length; i++) {
          if (this.jxfileData[i].userId == this.userId) {
            this.jxfileData[i].deleteDisabled1 = false
          } else {
            this.jxfileData[i].deleteDisabled1 = true
          }
        }
      })
      // 发函记录
      const find2 = {
        moduleType: '5', // 模块类别
        attachmentCode: 'XSBPJFHJLFJ', // 附件编码
        documentWordCode: this.documentWordCode // 单据编码
      }
      fileList(find2).then(response => {
        this.fhfileData = response.data.data
        for (var i = 0; i < this.fhfileData.length; i++) {
          if (this.fhfileData[i].userId == this.userId) {
            this.fhfileData[i].deleteDisabled2 = false
          } else {
            this.fhfileData[i].deleteDisabled2 = true
          }
        }

      })
    },
    // 文件上传新设备评价表
    fileUpload(e) {
      const file = e.target.files[0]
      const fileData1 = {
        attachmentCode: 'XSBPJBFJ',
        code: this.documentWordCode,
        moduleType: '5',
        fileName: undefined, // 文件名称
        filePath: undefined, // 文件URL
        node: this.nodeName, // 节点名称
        fileUrl: undefined,
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
            fileData1.fileUrl = resp.data.data.fileUrl
            // 新增文件
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
    // 文件上传设备检修
    fileUpload1(e) {
      const file = e.target.files[0]
      const fileData1 = {
        attachmentCode: 'SBJXJLFJ',
        code: this.documentWordCode,
        moduleType: '5',
        fileName: undefined,
        filePath: undefined, // 文件URL
        node: this.nodeName, // 节点名称
        fileUrl: undefined,
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
            fileData1.fileUrl = resp.data.data.fileUrl
            // 新增文件
            insertFile(fileData1).then(response => {
              if (response.data.code == 200) {
                fileData1.id = response.data.data
                this.$message({
                  title: '成功',
                  message: '上传成功',
                  type: 'success',
                  duration: 2000
                })
                this.jxfileData.push(fileData1)
              }
            })
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
          const fileInput1 = document.getElementById('uploadImg1')
          fileInput1.value = ''
        })
      }
    },
    // 发函记录文件上传
    fileUpload2(e) {
      const file = e.target.files[0]
      const fileData1 = {
        attachmentCode: 'XSBPJFHJLFJ',
        code: this.documentWordCode,
        moduleType: '5',
        fileName: undefined,
        filePath: undefined,
        node: '开始',
        fileUrl: undefined,
        userId: this.userId,
        id: undefined
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
            insertFile(fileData1).then(response => {
              if (response.data.code == 200) {
                fileData1.id = response.data.data
                this.$message({
                  title: '成功',
                  message: '上传成功',
                  type: 'success',
                  duration: 2000
                })
                this.fhfileData.push(fileData1)
              }
            })
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
          const fileInput2 = document.getElementById('uploadImg2')
          fileInput2.value = ''
        })
      }
    },
    // 文件下载
    fileDown(row) {
      if (row.fileUrl !== undefined) {
        window.location.href = row.fileUrl + '?attname=' + row.fileName
      } else {
        window.location.href = row.filePath + '?attname=' + row.fileName
      }
    },
    // 编辑文件删除
    updatefileDelete(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const id = row.id
        deleteFileById(id).then(response => {
          if (response.data.code === 200) {
            this.getFileList() // 获取文件
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
      this.popData.auditingType = 3
      this.popData.id = this.temp.id
      // v1.4.0验收不通过且技改办节点需上传发函记录
      if(this.temp.acceptanceSituation == 0 && this.nodeKey == 'pjjh_jgbcgzg' && this.fhfileData.length == 0){
        this.$notify({
            title: '警告',
            message: '请上传发函记录附件',
            type: 'warning',
            duration: 3000
        })
        return
      }
        // if(this.popData.noPassReason == null || this.popData.noPassReason == undefined){
        //     this.popData.noPassReason = ''
        // }
        // if(this.popData.acceptanceSituation == 0 && this.popData.noPassReason == ''){
        //     this.$notify({
        //         title: '警告',
        //         message: '请填写不通过原因',
        //         type: 'warning',
        //         duration: 2000
        //     })
        //     return
        // }
      this.dialogStatus = 'agree'
      this.agreeDialogVisible = true
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
      this.popData.auditingType = 4
      this.popData.id = this.temp.id
      this.dialogStatus = 'unagree'
      this.agreeDialogVisible = true
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
          const find = {
            id: this.temp.id, // 设备备案id
            taskId: this.popData.taskId,
            evaluateTime: this.temp.evaluateTime,
            acceptanceSituation: this.temp.acceptanceSituation,
            inFactoryTime: this.temp.inFactoryTime,
            outFactoryTime: this.temp.outFactoryTime
          }
          if(this.temp.acceptanceSituation == 0 && this.temp.noPassReason == ''){
            this.$notify({
            title: '警告',
            message: '请填写不通过原因',
            type: 'warning',
            duration: 2000
            })
            return
          }
          reCommit(find).then(response => {
            if (response.data.code == 200) {
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
        }
      })
    },
    // tabs 点击事件流转记录
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
  /* margin-bottom: 15px; */
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
 #pic{
  width: 100%;
}
</style>

