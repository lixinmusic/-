<template>
  <div class='app-container'>
    <el-container>
      <!-- <el-header> -->
        <div class="formSearch">
          <el-form :inline="true">
            <el-form-item label="编号">
              <el-input class="filter-item input" placeholder="请输入编号" maxlength="32" v-model="listQuery.recordCode">
              </el-input>
            </el-form-item>
            <el-form-item label="项目内部名称">
              <el-input class="filter-item input" placeholder="请输入项目内部名称" maxlength="50" v-model="listQuery.projectInsideName">
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
            <el-form-item label="使用部门">
              <el-input v-model="listQuery.divisionName" disabled>
                <el-button slot="append" @click="changeDivision" >选择</el-button>
                <el-button slot="append" @click="deleteDivision" >清空</el-button>
              </el-input>
            </el-form-item>
            <el-form-item label="审核状态">
              <el-select v-model="listQuery.auditingType" clearable  placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button class="filter-item" type="primary" style="float:right;margin-left: 15px;" icon="el-icon-download" @click="handleExport">导出</el-button>
              <el-button class="filter-item" type="primary" style="float:right;"  icon="el-icon-search" @click="handleFilter">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
      <!-- </el-header> -->
      <el-main style="padding:20px 0">
        <el-table :key='tableKey' :data="tableData" height="200" row-key="id" 
          v-loading="listLoading" border fit highlight-current style="width: 100%;margin-top:10px;min-height:500px" 
          :header-cell-style="{background:'oldlace'}">
            <el-table-column align="center" label="编号" width="160px">
              <template slot-scope="scope">
                <span class="look-detail" @click="handleDetail(scope.row)">{{scope.row.recordCode}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="projectInsideName" align="center" label="项目内部名称" >
            </el-table-column>
            <el-table-column prop="projectLeaderName" align="center" label="项目组长" >
            </el-table-column>
            <el-table-column prop="dctualOrgName" align="center" label="使用部门">
            </el-table-column>
            <el-table-column prop="projectOutsideName" align="center" label="项目外部名称" >
            </el-table-column>
            <el-table-column prop="technologyLeaderName" align="center" label="技术负责人" >
            </el-table-column>
            <el-table-column prop="requirementCompleteTime" align="center" label="项目要求完成时间" width="140px">
              <template slot-scope="scope">
                <span>{{scope.row.requirementCompleteTime.substring(0,10)}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="equipBuySuggest" align="center" label="设备采购建议" >
            </el-table-column>
            <el-table-column prop="auditingType" align="center" label="审核状态" >
            </el-table-column>
            <el-table-column prop="purchaseCode" align="center" label="生成采购单" >
            </el-table-column>
            <el-table-column prop="assignee" align="center" label="当前处理人" >
            </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <div class="pagination-container">
          <el-pagination background @size-change="handleSizeChange" 
          @current-change="handleCurrentChange" 
          :current-page="listQuery.pageNum" 
          :page-sizes="[5,10,15, 20]" 
          :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </el-footer>
      <!-- 查看备案通知书 -->
      <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" :visible.sync="dialogFormVisible" v-dialogDrag width="80%" v-loading="listLoading"> 
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="表单信息" name="first">
            <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="150px">
              <el-form-item>
                <span class="equip-title">设备采购项目备案通知书</span>
              </el-form-item>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="编号" prop="recordCode">
                    <el-input v-model="temp.recordCode" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="公司名称(付款主体)" prop="orgName">
                    <el-input v-model="temp.orgName" maxlength="6" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="项目内部名称" prop="projectInsideName">
                    <el-input v-model="temp.projectInsideName" maxlength="50" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="项目组长" prop="projectLeaderName">
                    <el-input v-model="temp.projectLeaderName" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12" style="padding-right:0px;">
                  <el-form-item label="设备实际使用公司" prop="companyName">
                    <el-input v-model="temp.companyName" maxlength="6" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" style="padding-right:0px;">
                  <el-form-item label="设备实际使用工厂" prop="factoryName">
                    <el-input v-model="temp.factoryName" maxlength="6" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="设备实际使用部门" prop="dctualOrgName">
                      <el-input v-model="temp.dctualOrgName" maxlength="6" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="项目外部名称" prop="projectOutsideName">
                      <el-input v-model="temp.projectOutsideName" maxlength="50" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="技术负责人" prop="technologyLeaderName">
                      <el-input v-model="temp.technologyLeaderName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="项目要求完成时间" prop="requirementCompleteTime">
                    <el-date-picker style="width:100%"
                      v-model="temp.requirementCompleteTime"
                      type="date"
                      placeholder="选择时间" disabled>
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="使用地址" prop="useAddress">
                    <el-input v-model="temp.useAddress" maxlength="100" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="设备采购建议" prop="equipBuySuggest">
                    <el-radio v-model="temp.equipBuySuggest" label="内部制造" disabled>内部制造</el-radio>
                    <el-radio v-model="temp.equipBuySuggest" label="外部制造" disabled>外部制造</el-radio>	
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="3">
                  <span style="width:1px;color:red;padding:1px">*</span>
                  <span style="font-weight:600;">主要内容</span>
                </el-col>
                <el-col :span="21">
                  <el-table :data="temp.equipRecordNumList" border stripe 
                    style="width: 100%;margin-bottom:10px;">
                    <el-table-column label="设备名称" align="center" min-width="90">
                      <template slot-scope="scope">
                        <el-form-item label-width="1x" :prop="'equipRecordNumList.' + scope.$index + '.equipName'" :rules='rules.equipName'> 
                          <el-input v-model="scope.row.equipName" disabled>
                            <el-button slot="append" @click="handleChooseEquip(scope.$index)" disabled>选择</el-button>
                          </el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column label="设备数量" align="center" min-width="80">
                      <template slot-scope="scope">
                        <el-form-item label-width="1x" :prop="'equipRecordNumList.' + scope.$index + '.equipNum'" :rules='rules.equipNum'> 
                          <el-input v-model="scope.row.equipNum" oninput="value=value.replace(/[^\d]/g,'')" maxlength="4" disabled></el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column label="主要内容" align="center" min-width="90">
                      <template slot-scope="scope">
                        <el-form-item label-width="1x" :prop="'equipRecordNumList.' + scope.$index + '.primaryCoverage'" :rules='rules.primaryCoverage'>
                          <el-input type="textarea" placeholder="请填写主要内容" v-model="scope.row.primaryCoverage" maxlength="30" disabled></el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
              <!-- <el-form-item label="主要内容" prop="primaryCoverage">
                <el-input v-model="temp.primaryCoverage" maxlength="200" disabled></el-input>
              </el-form-item> -->
              <el-row :gutter="20">
                <!-- <el-col :span="12">
                  <el-form-item label="设备改造(填上原设备编码)" prop="equipReform">
                    <el-input v-model="temp.equipReform" maxlength="200" disabled></el-input>
                  </el-form-item>
                </el-col> -->
                <el-col :span="12">
                  <el-form-item label="预算" prop="budget">
                    <el-input v-model="temp.budget" maxlength="200" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="设备采购完成时间" prop="equipBuyCompleteTime">
                    <el-date-picker style="width:100%"
                      v-model="temp.equipBuyCompleteTime"
                      type="date"
                      placeholder="选择时间" disabled>
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="是否立项" prop="setupProject">
                    <el-checkbox-group v-model="checkList">
                      <el-checkbox label="是" disabled></el-checkbox>
                      <el-checkbox label="否" disabled></el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  <el-form-item label="项目方案附件上传" prop="xmfaFileData">
                  </el-form-item>
                </el-col>
              </el-row>
              <el-table :data="xmfaFileData"
                border fit highlight-current style="width: 60%; margin-left:100px;">
                <el-table-column prop="fileName" align="center" label="文件名" >
                  <template slot-scope="scope">
                    <span class="look-detail" @click="lookFile(scope.row)">{{scope.row.fileName}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                  <template slot-scope="scope">
                    <el-button title="下载" type="primary" size="mini" icon="el-icon-download" @click="fileDown(scope.row)"></el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-row>
                <el-col :span="10">
                  <el-form-item label="附件" prop="fileData">
                    <input id="uploadImg" type="file" @change="fileUpload" v-if="false">
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <el-table :data="fileData"
              border fit highlight-current style="width: 60%; margin-left:100px;">
              <el-table-column prop="fileName" align="center" label="文件名" >
                <template slot-scope="scope">
                  <span class="look-detail" @click="lookFile(scope.row)">{{scope.row.fileName}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="node" align="center" label="上传节点" >
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
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 选择使用部门 -->
      <el-dialog width="50%" title="选择使用部门" :visible.sync="divisionVisible" :close-on-click-modal="false" v-dialogDrag >
        <el-container>
          <el-aside width="500px">
            <span style="margin-left:20px;color:red">{{getOrgName}}</span>
            <el-tree 
              :data="orgData" 
              :props="defaultProps1"
              ref="orgTree"
              show-checkbox 
              node-key="orgCode"
              check-strictly
              @check-change="handleChange" v-loading="diaLoading"><!-- 当前节点变化时处理事件 -->
            </el-tree>
          </el-aside>
        </el-container>
        <div slot="footer" class="dialog-footer">
          <el-button @click="divisionVisible = false">取消</el-button>
          <el-button @click="handleClick2" type="primary">确定</el-button>
        </div>
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
import { fetchAllList, fetchDetail, fetchExportList } from '@/api/equipRecord/equipRecordNotice'
import { fileList, recordList, processChart, fetchChooseTree } from '@/api/common/common'
import { baseUrl } from '@/api/common/fileBaseUrl'
export default {
  name: 'index',
  data() {
    return {
      routMsg: '',
      value01: null,
      activeName: 'first',
      chartData: null, // 流程图
      // 弹框组
      dialogFormVisible: false,
      printDialogVisible: false, // 打印
      // 审核状态下拉框
      options: [{
        value: '2',
        label: '审核中'
      }, {
        value: '3',
        label: '审核通过'
      }, {
        value: '4',
        label: '审核不通过'
      }],
      // 表格数据
      tableData: [],
      tableKey: 0,
      listLoading: false,
      total: null,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        recordCode: undefined,
        projectInsideName: undefined,
        auditingType: undefined,
        startDate: undefined,
        endDate: undefined,
        divisionCode: undefined,
        divisionName: undefined
      },
      // 文件数据
      xmfaFileData: [],
      fileData: [],
      documentWordCode: undefined, // 单据编号
      processInstanceId: undefined, // 流程实例id
      // 部门
      diaLoading: false,
      i: 0,
      divisionVisible: false,
      orgData: [],
      defaultProps1: {
        children: 'children',
        label: 'orgFullName'
      },
      getOrgName: undefined,
      getOrgCode: undefined,
      // 流转记录
      recordShow: false,
      recordData: null,
      temp: {
        companyCode: undefined,
        companyName: undefined,
        factoryCode: undefined,
        factoryName: undefined,
        dctualOrgCode: undefined, // 实际使用部门
        dctualOrgName: undefined, // 实际使用部门名
        equipBuySuggest: '内部制造',
        equipReform: undefined, // 设备改造
        // 附件列表
        list: [],
        id: undefined, // ID
        orgCode: undefined, // 公司编号（付款主体）
        orgName: undefined, // 公司名称（付款主体）
        primaryCoverage: undefined, // 主要内容
        projectInsideName: undefined, // 项目内部名称
        projectLeaderName: undefined, // 项目组长名
        projectLeaderWorkNumber: undefined, // 项目组长
        requirementCompleteTime: undefined, // 要求完成时间
        technologyLeaderName: undefined, // 技术负责人名
        technologyLeaderWorkNumber: undefined, // 技术负责人
        useAddress: undefined, // 使用地址
        // recordCode: undefined,//编号
        projectOutsideName: null, // 项目外部名称
        budget: undefined, // 预算
        equipBuyCompleteTime: undefined, // 设备采购完成时间
        setupProject: undefined, // 是否立项
        equipRecordNumList: [{
          equipCode: null,
          equipName: null,
          equipNum: null,
          primaryCoverage: null
        }] // 主要内容集合
      },
      checkList: [],
      dialogStatus: '',
      textMap: {
        detail: '查看设备采购项目备案通知书'
      },
      rules: {
        // orgName: [{ required: true, message: '请选择公司名称', trigger: 'change' }],
        projectInsideName: [{ required: true, message: '请输入项目内部名称', trigger: 'change' }],
        projectLeaderName: [{ required: true, message: '请选择项目组长', trigger: 'change' }],
        companyName: [{ required: true, message: '请选择设备实际使用公司', trigger: 'change' }],
        factoryName: [{ required: true, message: '请选择设备实际使用工厂', trigger: 'change' }],
        dctualOrgName: [{ required: true, message: '请选择设备实际使用部门', trigger: 'change' }],
        // projectOutsideName: [{ required: true, message: '请输入项目外部名称', trigger: 'change' }],
        technologyLeaderName: [{ required: true, message: '请选择技术负责人', trigger: 'change' }],
        requirementCompleteTime: [{ required: true, message: '请输入项目要求完成时间', trigger: 'change' }],
        useAddress: [{ required: true, message: '请输入使用地址', trigger: 'change' }],
        equipBuySuggest: [{ required: true, message: '请选择设备采购建议', trigger: 'change' }],
        primaryCoverage: [{ required: true, message: '请输入主要内容', trigger: 'change' }],
        equipName: [{ required: true, message: '请输入设备名称', trigger: 'change' }],
        equipNum: [{ required: true, message: '请输入设备数量', trigger: 'change' }]
        // budget: [{ required: true, message: '请输入预算', trigger: 'change' }],
        // equipBuyCompleteTime: [{ required: true, message: '请输入设备采购完成时间', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getRoutParams()
    this.getList()
  },
  methods: {
    searchChange() {
      // 日期转换
      if (this.value01 == null) {
        this.listQuery.startDate = ''
        this.listQuery.endDate = ''
      } else {
        this.listQuery.startDate = this.value01[0]// 开始时间
        this.listQuery.endDate = this.value01[1]
      }
    },
    // 获取处理路由
    getRoutParams() {
      this.routMsg = this.$route.params.dataObj
      this.listQuery.auditingType = this.routMsg.checkStatus
      this.listQuery.startDate = this.routMsg.startDate
      this.listQuery.endDate = this.routMsg.endDate
      if (this.listQuery.startDate != undefined && this.listQuery.startDate != '') {
        this.value01 = []
        this.value01.push(this.listQuery.startDate)
        this.value01.push(this.listQuery.endDate)
      }
    },
    getList() {
      this.tableData = []
      this.listLoading = true
      fetchAllList(this.listQuery).then(response => {
        if (response.data.code === 200) {
          if (response.data.data != null && response.data.data.list != null) {
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
              } else if (this.tableData[i].auditingType == 5) {
                this.tableData[i].auditingType = '流程关闭'
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
    // 搜索
    handleFilter() {
      if (this.listQuery.divisionName == '' || this.listQuery.divisionName == undefined) {
        this.listQuery.divisionCode = ''
      }
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
    // 选择使用部门
    changeDivision() {
      this.getOrgCode = undefined
      this.getOrgName = undefined
      this.divisionVisible = true
      this.diaLoading = true
      this.orgData = []
      fetchChooseTree().then(response => {
        if (response.data.code == 200) {
          this.orgData.push(response.data.data)
          for (var i = 0; i < this.orgData.length; i++) {
            if (this.orgData[i].orgType == '公司') {
              this.orgData[i].disabled = true
            }
            for (var j = 0; j < this.orgData[i].children.length; j++) {
              const child = this.orgData[i].children[j]
              if (child.orgType == '公司') {
                child.disabled = true
              }
              if (child.children != null) {
                for (var p = 0; p < child.children.length; p++) {
                  const child1 = child.children[p]
                  if (child1.orgType == '公司') {
                    child1.disabled = true
                  }
                  if (child1.children != null) {
                    for (var o = 0; o < child1.children.length; o++) {
                      const child2 = child1.children[o]
                      if (child2.orgType == '公司') {
                        child2.disabled = true
                      }
                      if (child2.children != null) {
                        for (var q = 0; q < child2.children.length; q++) {
                          const child3 = child2.children[q]
                          if (child3.orgType == '公司') {
                            child3.disabled = true
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      })
      this.diaLoading = false
    },
    deleteDivision() {
      this.listQuery.divisionName = undefined
      this.listQuery.divisionCode = undefined
    },
    // 设置部门组织树状图单选
    handleChange(data, checked, node) {
      this.i++
      if (this.i % 2 == 0) {
        if (checked) {
          this.$refs.orgTree.setCheckedNodes([])
          this.$refs.orgTree.setCheckedNodes([data])
          // 交叉点击节点
        } else {
          this.$refs.orgTree.setCheckedNodes([])
          // 点击已经选中的节点，置空
        }
      }
    },
    // 获取部门被选择的节点
    getCheckedNodes() {
      this.treeData = this.$refs.orgTree.getCheckedNodes()
      this.getOrgCode = this.treeData[0].orgCode
      this.getOrgName = this.treeData[0].orgFullName
    },
    // 点击选择部门确认
    handleClick2() {
      this.getCheckedNodes()
      this.listQuery.divisionName = this.getOrgName
      this.listQuery.divisionCode = this.getOrgCode
      this.divisionVisible = false
    },
    // 根据编号查看
    handleDetail(row) {
      this.activeName = 'first'
      this.dialogStatus = 'detail'
      this.dialogFormVisible = true
      const id = row.id
      this.documentWordCode = row.recordCode // 单据编号
      fetchDetail(id).then(response => {
        if (response.data.code === 200) {
          this.temp = Object.assign({}, response.data.data)
          this.checkList = []
          this.checkList.push(this.temp.setupProject)
        } else {
          this.$notify({
            title: '警告',
            message: response.data.msg,
            type: 'warning',
            duration: 3000
          })
        }
      })
      this.getFileList() // 获取文件信息
      // 流转记录
      this.processInstanceId = row.processInstanceId
    },
    // 获取文件列表
    getFileList() {
      // 获取文件列表
      const find = {
        moduleType: '1', // 模块类别
        attachmentCode: 'SBBADFJ', // 附件编码
        documentWordCode: this.documentWordCode // 单据编码
      }
      fileList(find).then(response => {
        this.fileData = response.data.data
      })
      const find1 = {
        moduleType: '1', // 模块类别
        attachmentCode: 'SBBADXMFAFJ', // 附件编码
        documentWordCode: this.documentWordCode // 单据编码
      }
      fileList(find1).then(response => {
        this.xmfaFileData = response.data.data
      })
    },
    // 文件下载
    fileDown(row) {
      window.location.href = row.filePath + '?attname=' + row.fileName
    },
    // tabs 点击事件
    handleClick(tab, event) {
      console.log(tab, event)
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
    handleExport() {
      fetchExportList(this.listQuery).then(response => {
        if (response.data.code == 200) {
          window.location.href = response.data.data
        } else {
          this.$notify({
            title: '警告',
            message: response.data.msg,
            type: 'warning',
            duration: 3000
          })
        }
      })
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
#printTest{
  margin-top:10px;
}
#printTest table{
  font-family:"宋体";
  border-collapse:collapse;
  width:99.5%;
}
#printTest table thead th{
  font-size: 16px;
  text-align: left;
}
#printTest table tbody tr{
  font-size:16px;
  border: 1px solid black;
  height: 33px;
  text-align: center;
}
#printTest table tbody td{
  width:25%;
  border: 1px solid black;
}
#pic{
  width: 100%;
}
</style>

