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
            <el-form-item label="申请时间">
              <el-date-picker
                v-model="value02"
                type="daterange"
                unlink-panels
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                clearable  @change="searchChange02()">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="验收情况" prop="acceptanceType">
              <el-radio v-model="listQuery.acceptanceType" label="0">验收不通过</el-radio>
              <el-radio v-model="listQuery.acceptanceType" label="1">验收通过</el-radio>	
            </el-form-item>
            <el-form-item label="使用公司">
              <el-input v-model="listQuery.companyName" disabled>
                <el-button slot="append" @click="changeCompany">选择</el-button>
                <el-button slot="append" @click="deleteCompany">清空</el-button>
              </el-input>
            </el-form-item>
            <el-form-item label="使用工厂">
              <el-input v-model="listQuery.factoryName" disabled>
                <el-button slot="append" @click="changeFactory">选择</el-button>
                <el-button slot="append" @click="deleteFactory">清空</el-button>
              </el-input>
            </el-form-item>
            <el-form-item label="使用部门">
              <el-input v-model="listQuery.divisionName" disabled>
                <el-button slot="append" @click="changeDivision">选择</el-button>
                <el-button slot="append" @click="deleteDivision">清空</el-button>
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
                       disabled>
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
                       disabled>
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
                       disabled>
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="验收情况" prop="acceptanceSituation">
                    <el-radio v-model="temp.acceptanceSituation" label="1" disabled>验收通过</el-radio>
                    <el-radio v-model="temp.acceptanceSituation" label="0" disabled>验收不通过</el-radio>	
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  <el-form-item label="新设备评价表附件" prop="fileData" label-width="130px">
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <el-table :data="fileData"
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
                </template>
              </el-table-column>
            </el-table>
            <el-row>
              <el-col :span="10">
                <el-form label-position="left" label-width="150px">
                <el-form-item label="设备检修记录单附件" prop="jxfileData">
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
          </el-form-item>
        </el-form>
      </el-dialog>
       <!-- 选择公司/工厂 -->
      <el-dialog width="40%" :title="textMap1[dialogStatus1]" :visible.sync="companyVisible" :close-on-click-modal="false" v-dialogDrag >
        <el-container>
          <el-aside width="500px">
            <span style="margin-left:20px;color:red">{{getCompanyName}}</span>
            <el-tree 
              :data="companyData" 
              :props="defaultProps1" 
              node-key='orgCode' 
              @node-click="handleClick1" v-loading="diaLoading"></el-tree>
          </el-aside>
        </el-container>
        <div slot="footer" class="dialog-footer">
          <el-button @click="companyVisible = false" type="default">取消</el-button>
          <el-button v-if="dialogStatus1=='company'" type="primary" @click="handleClickCompany">确定</el-button>
          <el-button v-if="dialogStatus1=='factory'" type="primary" @click="handleClickFactory">确定</el-button>
        </div>
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
import { fetchAllList, getDetail, fetchExportList } from '@/api/equipMent/equipEvaluateForm/equipEvaluateForm'
import { commonOptions1, recordList, fileList, processChart, fetchComTree, fetchChooseTree } from '@/api/common/common'
import { baseUrl } from '@/api/common/fileBaseUrl'
export default {
  name: 'index',
  data() {
    return {
      routMsg: '',
      value02: null,
      // 表格数据
      chartData: null, // 流程图
      tableKey: 0,
      listLoading: false,
      tableData: [],
      total: null,
      value01: undefined,
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
      auditingType: '',
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        equipmentName: undefined,
        fixedAssetCode: undefined,
        evaluateDateStart: undefined,
        evaluateDateEnd: undefined,
        acceptanceType: undefined,
        auditingType: undefined,
        startDate: undefined,
        endDate: undefined,
        companyName: undefined,
        companyCode: undefined,
        factoryName: undefined,
        factoryCode: undefined,
        divisionCode: undefined,
        divisionName: undefined
      },
      id: undefined,
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
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        detail: '查看设备质量信息报告'
      },
      // 文件数据
      chooseShow: true, // 选择按钮
      fileData: [], // 设备质量
      jxfileData: [], // 设备检修
      documentWordCode: undefined, // 单据编码
      userId: undefined, // 用户id
      processInstanceId: undefined, // 流程实例id
      // 公司（工厂）
      diaLoading: false,
      companyVisible: false,
      companyData: [],
      // 部门
      i: 0,
      divisionVisible: false,
      orgData: [],
      defaultProps1: {
        children: 'children',
        label: 'orgFullName'
      },
      getCompanyName: undefined,
      getCompanyCode: undefined,
      getOrgName: undefined,
      getOrgCode: undefined,
      dialogStatus1: '',
      textMap1: {
        company: '选择公司',
        factory: '选择工厂'
      },
      // 流转记录
      activeName: 'first',
      recordData: null,
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
    this.getRoutParams()
    this.getList()
  },
  methods: {
    // ******* 文件预览**********
    handlePreview(row) {
      console.log(row)
      var url = baseUrl + 'onlinePreview?url=' + encodeURIComponent(row.filePath)
      var winHeight = window.document.documentElement.clientHeight - 10
      window.open(url, '_blank', 'height=' + winHeight + ',top=80,left=80,toolbar=no, menubar=no, scrollbars=yes, resizable=yes')
    },
    // ******* 文件预览结束**********
    // 获取处理路由
    getRoutParams() {
      this.routMsg = this.$route.params.dataObj
      this.listQuery.auditingType = this.routMsg.checkStatus
      this.listQuery.startDate = this.routMsg.startDate
      this.listQuery.endDate = this.routMsg.endDate
      if (this.listQuery.startDate != undefined && this.listQuery.startDate != '') {
        this.value02 = []
        this.value02.push(this.listQuery.startDate)
        this.value02.push(this.listQuery.endDate)
      }
    },
    getList() {
      this.listLoading = true
      fetchAllList(this.listQuery).then(response => {
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
    searchChange02() {
      // 日期转换
      if (this.value02 == null) {
        this.listQuery.startDate = ''
        this.listQuery.endDate = ''
      } else {
        this.listQuery.startDate = this.value02[0]// 开始时间
        this.listQuery.endDate = this.value02[1]
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
    // 公司/工厂树被选择
    handleClick1(data) {
      this.getCompanyName = data.orgFullName
      this.getCompanyCode = data.orgCode
    },
    // 选择使用公司
    changeCompany() {
      this.dialogStatus1 = 'company'
      this.getCompanyCode = undefined
      this.getCompanyName = undefined
      this.companyVisible = true
      this.diaLoading = true
      this.companyData = []
      fetchComTree().then(response => {
        if (response.data.code === 200) {
          this.companyData.push(response.data.data)
        }
        this.diaLoading = false
      })
    },
    deleteCompany() {
      this.listQuery.companyName = undefined
      this.listQuery.companyCode = undefined
    },
    deleteFactory() {
      this.listQuery.factoryName = undefined
      this.listQuery.factoryCode = undefined
    },
    // 选择公司确认
    handleClickCompany() {
      this.listQuery.companyName = this.getCompanyName
      this.listQuery.companyCode = this.getCompanyCode
      this.companyVisible = false
    },
    // 选择使用工厂
    changeFactory() {
      this.dialogStatus1 = 'factory'
      this.getCompanyCode = undefined
      this.getCompanyName = undefined
      this.companyVisible = true
      this.diaLoading = true
      this.companyData = []
      fetchComTree().then(response => {
        if (response.data.code === 200) {
          this.companyData.push(response.data.data)
        }
        this.diaLoading = false
      })
    },
    // 选择工厂确认
    handleClickFactory() {
      this.listQuery.factoryName = this.getCompanyName
      this.listQuery.factoryCode = this.getCompanyCode
      this.companyVisible = false
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
      this.documentWordCode = row.documentWordCode
      const id = row.id
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
      // 流转记录
      this.processInstanceId = row.processInstanceId
      this.getFileList()
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
      })
      // 设备检修记录附件
      const find1 = {
        moduleType: '5', // 模块类别
        attachmentCode: 'SBJXJLFJ', // 附件编码
        documentWordCode: this.documentWordCode // 单据编码
      }
      fileList(find1).then(response => {
        this.jxfileData = response.data.data
      })
    },
    // 文件下载
    fileDown(row) {
      window.location.href = row.filePath + '?attname=' + row.fileName
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
</style>

