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
           <el-table-column prop="" align="center" label="当前处理人" >
            <template slot-scope="scope">
              <span>{{scope.row.checkingUserName}}</span>
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
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="60%" v-dialogDrag :close-on-click-modal="false" v-loading="listLoading"> 
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
                <el-col :span="12">
                  <el-form-item label="闲置位置" prop="unusedPlace">
                    <el-input v-model="temp.unusedPlace" disabled></el-input>
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
              <el-row :gutter="20">
                <el-col :span="11">
                  <el-form-item label="闲置天数" prop="unusedDays">
                    <el-input v-model="temp.unusedDays" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="1" style="padding:0px;font-size:20px;font-weight:800;">
                  <span>天</span>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="设备完好情况" prop="equipStatus">
                    <el-radio v-model="temp.equipStatus" label="1" disabled>闲置可用</el-radio>
                    <el-radio v-model="temp.equipStatus" label="2" disabled>闲置待报废</el-radio>	
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="申请闲置理由" prop="applyUnusedReason">
                <el-input v-model="temp.applyUnusedReason" disabled></el-input>
              </el-form-item>
              <el-row>
                <el-col :span="10">
                  <el-form-item label="附件上传" prop="">
                    <input id="uploadImg1" type="file" @change="fileUpload1" v-if="false">
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
            <el-button type="primary" @click="printData" v-if="printShow">打印</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 打印 -->
			<el-dialog title="设备闲置申请单打印预览" :close-on-click-modal="false" :visible.sync="printDialogVisible" width="60%" v-dialogDrag>
        <el-button type="primary" @click="printDialogVisible = false">返回</el-button>
        <el-button type="success" v-print="'#printTest'"><svg-icon icon-class="print"/>打印</el-button>
				<div id="printTest">
          <center>
					<table border= "0">
            <caption style="font-size: 26px;padding-top:20px;padding-bottom:20px; font-weight:800">设备闲置申请单</caption>
            <thead>
              <tr>
                <th colspan="2">使用公司：{{printList.companyName}}</th>
                <th colspan="2">使用工厂：{{printList.factoryName}}</th>
                <th colspan="2">日期：{{unusedData.applyDate!=null?unusedData.applyDate.substring(0,10):''}}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>设备名称</td>
                <td>{{printList.equipmentName}}</td>
                <td>型号规格</td>
                <td>{{printList.model}}</td>
                <td>数量</td>
                <td >{{unusedData.number}}</td>
              </tr>
              <tr>
                <td>使用部门</td>
                <td>{{printList.divisionName}}</td>
                <td>闲置位置</td>
                <td>{{unusedData.unusedPlace}}</td>
                <td>固定资产编号</td>
                <td>{{printList.fixedAssetCode}}</td>
              </tr>
              <tr style="height:80px;">
                <td>制造厂家（制作部门）</td>
                <td colspan="3">{{printList.manufacturer}}</td>
                <td>出厂编号</td>
                <td>{{printList.serialNumber}}</td>
              </tr>
              <tr style="height:150px;text-align:left;">
                <td style="position: relative;" colspan="6"><span style="position: absolute;left:5px;top:5px;">申请闲置理由及闲置天数：<span style="font-size:14px;">{{unusedData.applyUnusedReason}};{{unusedData.unusedDays}}</span>{{unusedData.applyUnusedReason}};{{unusedData.unusedDays}}</span></td>
              </tr>
              <tr style="height:30px;text-align:left;border-bottom:0px solid white;">
                <td style="border:0px solid white;" colspan="6"><span>设备完好情况：</span></td>
              </tr>
              <tr style="height:90px;text-align:left;border-top:0px solid white;">
                <td style="border:0px solid white;" colspan="6">闲置可用（<span v-if="suggestShow">√</span>）闲置待报废（<span v-if="!suggestShow">√</span> ）</td>
              </tr>
              <tr style="height:60px;">
                <td>负责人</td>
                <td style="width:100px;">使用部门负责人</td>
                <td>设备科</td>
                <td>工厂厂长</td>
                <td>事业部</td>
                <td>资产部</td>
              </tr>
              <tr style="height:150px;">
                <td>意见</td>
                <td>{{printList.sybmOpinion}}</td>
                <td>{{printList.sbkOpinion}}</td>
                <td>{{printList.gcczOpinion}}</td>
                <td>{{printList.sybOpinion}}</td>
                <td>{{printList.zcbOpinion}}</td>
              </tr>
              <tr style="height:70px;">
                <td>签名</td>
                <td>{{printList.sybm}}</td>
                <td>{{printList.sbk}}</td>
                <td>{{printList.gccz}}</td>
                <td>{{printList.syb}}</td>
                <td>{{printList.zcb}}</td>
              </tr>
              <tr style="height:70px;">
                <td>日期</td>
                <td>{{printList.sybmDate!=null?printList.sybmDate.substring(0,10):''}}</td>
                <td>{{printList.sbkDate!=null?printList.sbkDate.substring(0,10):''}}</td>
                <td>{{printList.gcczDate!=null?printList.gcczDate.substring(0,10):''}}</td>
                <td>{{printList.sybDate!=null?printList.sybDate.substring(0,10):''}}</td>
                <td>{{printList.zcbDate!=null?printList.zcbDate.substring(0,10):''}}</td>
              </tr>
            </tbody>
          </table>
          </center>
				</div>
			</el-dialog>
    </el-container>
  </div>
</template>

<script>
import { fetchDoneList, getDetail, fetchPrint } from '@/api/idleProcess/equipIdleApply/equipIdleApply'
import { commonOptions1, recordList, fileList, processChart } from '@/api/common/common'
import { baseUrl } from '@/api/common/fileBaseUrl'
export default {
  name: 'equipIdleApplyDone',
  data() {
    return {
      chartData: null, // 流程图
      // 表格数据
      tableKey: 0,
      listLoading: false,
      tableData: [],
      total: null,
      value01: undefined,
      printShow: false,
      // 审核状态下拉框
      options: commonOptions1,
      auditingType: '',
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        formCode: undefined,
        fixedAssetCode: undefined,
        equipmentName: undefined,
        auditingType: undefined,
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
        equipStatus: undefined, // 闲置完好状态

        files: []
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        detail: '查看设备闲置申请单'
      },
      printDialogVisible: false, // 打印
      printList: {
        sybm: null,
        sybmOpinion: null,
        sybmDate: null,
        sbk: null,
        sbkOpinion: null,
        sbkDate: null,
        gccz: null,
        gcczOpinion: null,
        gcczDate: null,
        syb: null,
        sybOpinion: null,
        sybDate: null,
        zcb: null,
        zcbOpinion: null,
        zcbDate: null
      },
      unusedData: {
        applyDate: null
      },
      lcData: [],
      suggestShow: false,
      // 文件数据
      fileData: [],
      documentWordCode: undefined, // 单据编码
      userId: undefined, // 用户id
      processInstanceId: undefined, // 流程实例id

      // 流转记录
      activeName: 'first',
      recordData: null,
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
        unusedDays: [{ required: true, message: '请输入闲置天数', trigger: 'change' }],
        unusedPlace: [{ required: true, message: '请选择闲置位置', trigger: 'change' }],
        // applyDate: [{ required: true, message: '请选择申请日期', trigger: 'change' }],
        equipStatus: [{ required: true, message: '请选择闲置完好状态', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchDoneList(this.listQuery).then(response => {
        if (response.data.code === 200) {
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
      this.printShow = false
      if (row.auditingType == '审核通过') {
        this.printShow = true
      }
      this.dialogFormVisible = true
      this.id = row.id
      this.documentWordCode = row.formCode
      // 流转记录
      this.processInstanceId = row.processInstanceId
      this.getFileList()
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
      })
    },
    // 文件下载
    fileDown(row) {
      window.location.href = row.filePath + '?attname=' + row.fileName
    },
    lookFile(row) {
      const url = baseUrl + 'onlinePreview?url=' + encodeURIComponent(row.filePath)
      var winHeight = window.document.documentElement.clientHeight
      window.open(url, '_blank', 'height=' + winHeight + ',top=10,left=10,toolbar=no,menubar=no,scrollbars=yes,resizable=yes')
    },
    // 打印
    printData() {
      this.printDialogVisible = true
      const params = {
        id: this.id
      }
      fetchPrint(params).then(response => {
        if (response.data.code == 200) {
          this.printList = response.data.data.equipAccount
          this.unusedData = response.data.data.unused
          this.lcData = response.data.data.rt
          this.lcData.forEach(item => {
            if (item.taskName == '使用部门负责人') {
              this.printList.sybm = item.userName
              this.printList.sybmOpinion = item.opinion
              this.printList.sybmDate = item.dateTime
            } else if (item.taskName == '设备科') {
              this.printList.sbk = item.userName
              this.printList.sbkOpinion = item.opinion
              this.printList.sbkDate = item.dateTime
            } else if (item.taskName == '厂长') {
              this.printList.gccz = item.userName
              this.printList.gcczOpinion = item.opinion
              this.printList.gcczDate = item.dateTime
            } else if (item.taskName == '设备副总') {
              this.printList.syb = item.userName
              this.printList.sybOpinion = item.opinion
              this.printList.sybDate = item.dateTime
            } else if (item.taskName == '资产部') {
              this.printList.zcb = item.userName
              this.printList.zcbOpinion = item.opinion
              this.printList.zcbDate = item.dateTime
            }
          })
          if (this.unusedData.equipStatus == '1') {
            this.suggestShow = true
          } else if (this.unusedData.equipStatus == '2') {
            this.suggestShow = false
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
.formDw{
	position: absolute;
	right: 20px;
	top: 80px;
}
#printTest table{
  font-family:"宋体";
  border-collapse:collapse;
  width:99.5%;
}
#printTest table thead th{
  height: 80px;
  font-size: 16px;
  text-align: left;
}
#printTest table tbody tr{
  font-size:16px;
  border: 1px solid black;
  height: 90px;
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

