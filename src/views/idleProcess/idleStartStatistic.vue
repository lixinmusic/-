<template>
  <div class='app-container'>
    <el-container>
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
          <el-table-column align="center" label="使用部门" >
            <template slot-scope="scope">
              <span>{{scope.row.divisionName}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="启动安装位置" >
            <template slot-scope="scope">
              <span>{{scope.row.installPlaceName}}</span>
            </template>
          </el-table-column>
          
          <el-table-column prop="" align="center" label="审核状态" >
            <template slot-scope="scope">
              <span>{{scope.row.auditingType}}</span>
            </template>
          </el-table-column>
           <el-table-column prop="" align="center" label="当前处理人" >
            <template slot-scope="scope">
              <span>{{scope.row.auditingUser}}</span>
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
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="60%" v-loading="listLoading"
       v-dialogDrag :close-on-click-modal="false"> 
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="表单信息" name="first">
            <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="110px">
              <el-form-item>
                <span class="equip-title">闲置设备启动申请单</span>
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
                  <el-form-item label="原使用工厂" prop="originalFactoryName">
                    <el-input v-model="temp.originalFactoryName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="原使用部门" prop="originalDivisionName">
                    <el-input v-model="temp.originalDivisionName" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="使用部门" prop="divisionName">
                    <el-input v-model="temp.divisionName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="启动安装位置" prop="installPlaceName">
                    <el-input v-model="temp.installPlaceName" disabled></el-input>
                  </el-form-item>
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
              <el-form-item label="申请启动理由" prop="applyReason">
                <el-input type="textarea" maxlength="200" v-model="temp.applyReason" disabled></el-input>
              </el-form-item>
            </el-form>
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
            <!-- <el-button type="primary" @click="printData" v-if="printShow">打印</el-button> -->
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 打印 -->
			<el-dialog title="闲置设备启动申请单打印预览" :close-on-click-modal="false" :visible.sync="printDialogVisible" width="60%" v-dialogDrag>
        <el-button type="primary" @click="printDialogVisible = false">返回</el-button>
        <el-button type="success" v-print="'#printTest'"><svg-icon icon-class="print"/>打印</el-button>
				<div id="printTest">
          <center>
					<table border= "0">
            <caption style="font-size: 30px;padding-top:20px;padding-bottom:20px; font-weight:800">闲置设备启用申请单</caption>
            <thead>
              <tr>
                <th colspan="2">使用公司：{{printList.companyName}}</th>
                <th colspan="2">使用工厂：{{printList.factoryName}}</th>
                <th colspan="2">日期：{{printList.applyDate!=null?printList.applyDate.substring(0,10):''}}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>设备名称</td>
                <td>{{printList.equipmentName}}</td>
                <td>型号规格</td>
                <td>{{printList.model}}</td>
                <td>数量</td>
                <td >{{printList.number}}</td>
              </tr>
              <tr>
                <td>原使用工厂/车间</td>
                <td>{{printList.originalFactoryName}}</td>
                <td>使用部门</td>
                <td>{{printList.divisionName}}</td>
                <td>启动安装位置</td>
                <td>{{printList.installPlaceName}}</td>
              </tr>
              <tr>
                <td>制造厂家（制作部门）</td>
                <td>{{printList.manufacturer}}</td>
                <td>固定资产编号</td>
                <td>{{printList.fixedAssetCode}}</td>
                <td>出厂编码</td>
                <td>{{printList.serialNumber}}</td>
              </tr>
              <tr style="height:150px;">
                <td style="position: relative;" colspan="6">
                  <span style="position: absolute;left:5px;top:5px;">申请启动理由：{{printList.applyReason}}</span>
                  <span style="position: absolute;right:50px;bottom:20px;">申请人：{{printList.sqr}}</span>
                </td>
              </tr>
              <tr style="height:60px;">
                <td>负责人</td>
                <td colspan="3">申请部门</td>
                <td colspan="2">资产部</td>
              </tr>
              <tr style="height:130px;">
                <td>意见</td>
                <td colspan="3"></td>
                <td colspan="2">{{printList.zcbOpinion}}</td>
              </tr>
              <tr style="height:70px;">
                <td>签名</td>
                <td colspan="3">{{printList.sqr}}</td>
                <td colspan="2">{{printList.zcb}}</td>
              </tr>
              <tr style="height:70px;">
                <td>日期</td>
                <td colspan="3">{{printList.applyDate!=null?printList.applyDate.substring(0,10):''}}</td>
                <td colspan="2">{{printList.zcbDate!=null?printList.zcbDate.substring(0,10):''}}</td>
              </tr>
            </tbody>
          </table>
          </center>
				</div>
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
import { fetchAllList, getDetail, fetchPrint, fetchExportList } from '@/api/idleProcess/idleStartApply'
import { commonOptions1, recordList, processChart, fetchComTree, fetchChooseTree } from '@/api/common/common'
export default {
  name: 'index',
  data() {
    return {
      routMsg: '',
      chartData: null, // 流程图
      printShow: false,
      // 表格数据
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
        formCode: undefined,
        fixedAssetCode: undefined,
        equipmentName: undefined,
        auditingType: undefined,
        applyDateStart: undefined,
        applyDateEnd: undefined,
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
        accountId: undefined,
        unusedFormId: undefined, // 设备闲置单id
        formCode: undefined, // 单据编号
        applyDate: undefined, // 申请日期
        companyCode: undefined,
        companyName: undefined,
        factoryCode: undefined,
        factoryName: undefined,
        divisionCode: undefined,
        divisionName: undefined,
        installPlaceCode: undefined,
        installPlaceName: undefined,

        applyReason: undefined, // 申请启动理由
        number: 1, // 数量

        fixedAssetCode: undefined, // 固定资产编码
        equipmentName: undefined, // 设备名称
        originalFactoryName: undefined, // 原使用工厂
        originalDivisionName: undefined, // 原使用部门
        originalDivisionCode: undefined,
        model: undefined, // 规格型号
        manufacturer: undefined, // 制造厂家
        serialNumber: undefined// 出厂编码
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        detail: '查看闲置设备启动申请单'
      },
      processInstanceId: undefined, // 流程实例id
      printDialogVisible: false, // 打印
      printList: {
        sqr: null,
        zcb: null,
        zcbOpinion: null,
        zcbDate: null,
        applyDate: null
      },
      lcData: [],
      // 流转记录
      activeName: 'first',
      recordData: null,
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
      rules: {
        // formCode: [{ required: true, message: '请输入单据编号', trigger: 'change' }],
        equipmentName: [{ required: true, message: '请输入设备名称', trigger: 'change' }],
        model: [{ required: true, message: '请输入型号规格', trigger: 'change' }],
        fixedAssetCode: [{ required: true, message: '请输入固定资产编号', trigger: 'change' }],
        serialNumber: [{ required: true, message: '请输入出厂编号', trigger: 'change' }],
        manufacturer: [{ required: true, message: '请输入制造厂家', trigger: 'change' }],
        originalFactoryName: [{ required: true, message: '请引入闲置设备', trigger: 'change' }],
        originalDivisionName: [{ required: true, message: '请引入闲置设备', trigger: 'change' }],

        companyName: [{ required: true, message: '请选择使用公司', trigger: 'change' }],
        factoryName: [{ required: true, message: '请选择使用工厂', trigger: 'change' }],
        divisionName: [{ required: true, message: '请选择使用部门', trigger: 'change' }],

        number: [{ required: true, message: '请输入数量', trigger: 'change' }],
        applyReason: [{ required: true, message: '请输入申请启动理由', trigger: 'change' }],
        installPlaceName: [{ required: true, message: '请选择安装位置', trigger: 'change' }]
        // applyDate:[{ required: true, message: '请选择申请日期', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getRoutParams()
    this.getList()
  },
  methods: {
    // 获取处理路由
    getRoutParams() {
      this.routMsg = this.$route.params.dataObj
      this.listQuery.auditingType = this.routMsg.checkStatus
      this.listQuery.applyDateStart = this.routMsg.startDate
      this.listQuery.applyDateEnd = this.routMsg.endDate
      if (this.listQuery.applyDateStart != undefined && this.listQuery.applyDateStart != '') {
        this.value01 = []
        this.value01.push(this.listQuery.applyDateStart)
        this.value01.push(this.listQuery.applyDateEnd)
      }
    },
    getList() {
      this.listLoading = true
      fetchAllList(this.listQuery).then(response => {
        if (response.data.code === 200) {
          this.tableData = response.data.data.results
          for (var i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].auditingType == 2) {
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
      const id = row.id
      // 根据id获取详情
      getDetail(id).then(response => {
        if (response.data.code == 200) {
          const details = response.data.data
          this.temp = Object.assign({}, details)
          this.temp.applyDate = row.applyDate
        } else {
          this.$notify({
            title: '警告',
            message: response.data.msg,
            type: 'warning',
            duration: 2000
          })
        }
      })
      this.activeName = 'first'
      this.dialogStatus = 'detail'
      // this.printShow = false
      // if (row.auditingType == '审核通过') {
      //   this.printShow = true
      // }
      this.dialogFormVisible = true
      this.id = row.id
      // 流转记录
      this.processInstanceId = row.processInstanceId
    },
    // 打印
    printData() {
      this.printDialogVisible = true
      const id = this.id
      fetchPrint(id).then(response => {
        if (response.data.code == 200) {
          this.printList = response.data.data
          this.lcData = response.data.data.list
          this.lcData.forEach(item => {
            if (item.taskName == '资产部') {
              this.printList.zcb = item.userName
              this.printList.zcbOpinion = item.opinion
              this.printList.zcbDate = item.dateTime
            } else if (item.taskName == '流程开始') {
              this.printList.sqr = item.userName
            }
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
.look-detail:hover{
  color:#20a0ff;
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
  height: 80px;
  font-size: 18px;
  text-align: left;
}
#printTest table tbody tr{
  font-size:18px;
  border: 1px solid black;
  height: 130px;
  text-align: center;
}
#printTest table tbody td{
  border: 1px solid black;
  width: 16.6%;
}
#pic{
  width: 100%;
}
</style>

