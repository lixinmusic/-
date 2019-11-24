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
            <el-input class="filter-item input" v-model="listQuery.equipName">
            </el-input>
          </el-form-item>
          <el-form-item label="型号规格">
            <el-input class="filter-item input" v-model="listQuery.equipType">
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
          <el-table-column align="center" prop="applicationTime" label="申请时间" >
             <template slot-scope="scope">
                  {{scope.row.applicationTime!==null?scope.row.applicationTime.substring(0,10):''}}
          </template>
          </el-table-column>
          <el-table-column align="center" label="调出公司" prop="transferOutCompany">
          </el-table-column>
          <el-table-column align="center" label="固定资产编号" prop="fixedAssetCode">
          </el-table-column> 
          <el-table-column align="center" label="设备名称" prop="equipName">
          </el-table-column>
          <el-table-column align="center" label="型号规格" prop="equipType">
          </el-table-column>
          <el-table-column align="center" label="折旧年限" prop="depreciationPeriod">
          </el-table-column>
          <el-table-column align="center" label="已用年限" prop="usedPeriod">
          </el-table-column>
          <el-table-column align="center" label="审核状态" prop="auditingType">
          </el-table-column>
          <el-table-column align="center" label="当前处理人" prop="currentOpUser">
          </el-table-column>
          <el-table-column align="center" label="操作" width="140px">
            <template slot-scope="scope">
              <el-button title="通知" type="success" icon="el-icon-message" size="mini"  @click="sendMessage(scope.row)"
               :disabled="scope.row.noticeShow?true:false"></el-button>
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
                <span class="equip-title">设备维修出厂单</span>
              </el-form-item>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="单据编号" prop="formCode">
                    <el-input v-model="temp.formCode" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="申请时间" prop="applicationTime">
                    <el-date-picker style="width:100%"
                      v-model="temp.applicationTime"
                      type="date" disabled>
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="调出公司" prop="transferOutCompany">
                    <el-input v-model="temp.transferOutCompany" disabled></el-input>
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
                  <el-form-item label="设备名称" prop="equipName">
                    <el-input v-model="temp.equipName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="型号规格" prop="equipType">
                    <el-input v-model="temp.equipType" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="出厂编号" prop="serialNumber">
                    <el-input v-model="temp.serialNumber" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="制造厂家" prop="manufacturer">
                    <el-input v-model="temp.manufacturer" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="11">
                  <el-form-item label="数量" prop="nums">
                    <el-input v-model="temp.nums" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="1" style="padding:0px;font-size:20px;font-weight:800;">
                  <span>台</span>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="折旧年限" prop="depreciationPeriod">
                    <el-input v-model="temp.depreciationPeriod" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="1" style="padding:0px;font-size:20px;font-weight:800;">
                  <span>年</span>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="11">
                  <el-form-item label="已用年限" prop="usedPeriod">
                    <el-input v-model="temp.usedPeriod" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="1" style="padding:0px;font-size:20px;font-weight:800;">
                  <span>年</span>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="财务原值" prop="originalFinancialValue">
                    <el-input v-model="temp.originalFinancialValue" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="1" style="padding:0px;font-size:20px;font-weight:800;">
                  <span>元</span>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="11">
                  <el-form-item label="账面净值" prop="netBookValue">
                    <el-input v-model="temp.netBookValue" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="1" style="padding:0px;font-size:20px;font-weight:800;">
                  <span>元</span>
                </el-col>
              </el-row>
              <el-form-item label="备注" prop="remark">
                <el-input type="textarea" maxlength="200" v-model="temp.remark" disabled></el-input>
              </el-form-item>
              <el-form-item label="出厂原因" prop="reason">
                <el-input type="textarea" maxlength="200" v-model="temp.reason" disabled></el-input>
              </el-form-item>
              <el-form-item label="其他说明" prop="otherDescription">
                <el-input type="textarea" maxlength="200" v-model="temp.otherDescription" disabled></el-input>
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
            <el-button type="primary" @click="printData" v-if="printShow">打印</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 打印 -->
      <el-dialog title="设备维修出厂单打印预览" v-dialogDrag :close-on-click-modal="false" :visible.sync="printDialogVisible" width="70%">
        <el-button type="primary" @click="printDialogVisible = false">返回</el-button>
        <el-button type="success" v-print="'#printTest'"><svg-icon icon-class="print"/>打印</el-button>
        <div id="printTest">
          <table border= "0">
            <caption style="font-family:SimHei;font-size: 16px;">
              <p>{{printList.transferOutCompany}}</p>
              <p>设备维修出厂单</p>
            </caption>
            <thead>
              <tr>
                <th colspan="7" style="text-align: left;">调出公司:{{printList.transferOutCompany + ' / ' + printList.transferOutFactoryName + ' / ' + printList.transferOutDepartmentName}}</th>
                <th colspan="5" style="text-align: right;">编号:{{printList.formCode}}&nbsp;&nbsp;&nbsp;&nbsp;</th>
              </tr>
            </thead>
            <tbody>
                <tr >
                    <td rowspan="2">固定资产编号</td>
                    <td rowspan="2">设备名称</td>
                    <td rowspan="2">型号规格</td>
                    <td rowspan="2">出厂编号</td>
                    <td rowspan="2">制造厂家</td>
                    <td rowspan="2">数量</td>
                    <td rowspan="2">单位</td>
                    <td colspan="2">年限</td>
                    <td colspan="2">固定资产价值(元)</td>
                    <td rowspan="2">备注</td>
                </tr>
                <tr>
                    <td>折旧</td>
                    <td>已用</td>
                    <td>财务原值</td>
                    <td>账面净值</td>
                </tr>
                <tr>
                    <td>{{printList.fixedAssetCode}}</td>
                    <td>{{printList.equipName}}</td>
                    <td style="width:80px;">{{printList.equipType}}</td>
                    <td style="width:80px;">{{printList.serialNumber}}</td>
                    <td style="width:80px;">{{printList.manufacturer}}</td>
                    <td style="width:80px;">{{printList.nums}}</td>
                    <td style="width:80px;">元</td>
                    <td style="width:80px;">{{printList.depreciationPeriod}}</td>
                    <td style="width:80px;">{{printList.usedPeriod}}</td>
                    <td style="width:80px;">{{printList.originalFinancialValue}}</td>
                    <td>{{printList.netBookValue}}</td>
                    <td>{{printList.remark}}</td>
                </tr>
                <tr>
                    <td colspan="1" style="text-align:left">出厂原因</td>
                    <td colspan="11" style="text-align:left">{{printList.reason}}</td>
                </tr>
                    <tr>
                    <td colspan="1" style="text-align:left">其他说明</td>
                    <td colspan="11" style="text-align:left">{{printList.otherDescription}}</td>
                </tr>
                <tr>
                    <td colspan="2">经办人签字</td>
                    <!-- <td colspan="2">经办部门/部门领导签字</td> -->
                    <td colspan="3">设备科长签字</td>
                    <td colspan="2">设备副总签字</td>
                    <td colspan="3">资产部副部长签字</td>
                    <td colspan="2">资产部盖章</td>
                </tr>
                <tr style="height:80px;text-align:left">
                <td colspan="2" style="border-bottom:1px solid #fff"></td>
                <!-- <td colspan="2" style="border-bottom:1px solid #fff">{{printList.bmjlOpinion}}</td> -->
                <td colspan="3" style="border-bottom:1px solid #fff">{{printList.dcsbkzOpinion}}</td>
                <td colspan="2" style="border-bottom:1px solid #fff">{{printList.sbfzOpinion}}</td>
                <td colspan="3" style="border-bottom:1px solid #fff">{{printList.zcbfbzOpinion}}</td>
                <td colspan="2" style="border-bottom:1px solid #fff"></td>
              </tr>
              <tr style="text-align:left">
                <td colspan="2">经办人：{{printList.fqr}}</td>
                <!-- <td colspan="2" >经办人：{{printList.bmjl}}</td> -->
                <td colspan="3">经办人：{{printList.dcsbkz}}</td>
                <td colspan="2">经办人：{{printList.sbfz}}</td>
                <td colspan="3">经办人：{{printList.zcbfbz}}</td>
                <td colspan="2">经办人：</td>
              </tr>
              <tr style="text-align:left">
                <td colspan="2" style="border-top:1px solid #fff">
                  日期：{{printList.fqrDate!=null?printList.fqrDate.substring(0,10):''}}</td>
                <!-- <td colspan="2" style="border-top:1px solid #fff">
                  日期：{{printList.bmjlDate!=null?printList.bmjlDate.substring(0,10):''}}</td> -->
                <td colspan="3" style="border-top:1px solid #fff">
                  日期：{{printList.dcsbkzDate!=null?printList.dcsbkzDate.substring(0,10):''}}</td>
                <td colspan="2" style="border-top:1px solid #fff">
                  日期：{{printList.sbfzDate!=null?printList.sbfzDate.substring(0,10):''}}</td>
                <td colspan="3" style="border-top:1px solid #fff">
                  日期：{{printList.zcbfbzDate!=null?printList.zcbfbzDate.substring(0,10):''}}</td>
                <td colspan="2" style="border-top:1px solid #fff">
                  日期：</td>
              </tr>
            </tbody>
          </table>
        </div>
	    </el-dialog>
      <!-- 选择通知的人 -->
      <el-dialog width="60%" :close-on-click-modal="false" title="请选择要通知的人员" :visible.sync="innerVisiblePerson" append-to-body v-dialogDrag>
        <el-header>
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="姓名">
              <el-input v-model="listQuery1.perName" placeholder="请输入姓名">
              </el-input>
            </el-form-item>
            <el-form-item label="工号">
              <el-input v-model="listQuery1.workNumber" placeholder="请输入工号">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="handlePerson">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-header>
        <el-container>
          <el-aside style="width:380px;">
            <el-tree :data="personOrgData" :props="defaultProps" @node-click="handleNodeClick" v-loading="diaLoading" :render-content="renderContent"></el-tree>
          </el-aside>
          <el-main>
            <span style="margin-left:20px;color:red">{{choosePerName}}</span>
            <el-table height='300' :data="orgListData" border fit highlight-current-row
              style="width:100%;min-height:300px;margin-top:8px">
              <el-table-column prop="orgName" align="center" label="部门" min-width="50">
              </el-table-column>
              <el-table-column prop="perName" align="center" label="人员" min-width="50">
              </el-table-column>
              <el-table-column align="center" label="工号" min-width="50">
                <template slot-scope="scope">
                  <a class="look-detail" @click="chooseData1(scope.row)">{{scope.row.workNumber}}</a>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
        </el-container>
        <div slot="footer" class="dialog-footer">
          <el-button @click="choosePersonOk()" type="primary">确定</el-button>
          <el-button @click="innerVisiblePerson = false" type="info">取消</el-button>
        </div>
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
import { fetchNeedList, getDetail, fetchPrint, postMessage } from '@/api/allocationProcess/equipRepairAllot'
import { commonOptions1, recordList, processChart, fetchChooseTree, choosePersonList } from '@/api/common/common'
export default {
  name: 'equipRepairDone',
  data() {
    return {
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
      auditingType: '',
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        formCode: undefined,
        fixedAssetCode: undefined,
        equipName: undefined,
        equipType: undefined,
        auditingType: undefined,
        applyStartTime: undefined,
        applyEndTime: undefined,
        type: 1,
        handleType: 2
      },
      // 选择人
      diaLoading: false,
      orgListData: null,
      personOrgData: [],
      innerVisiblePerson: false, // 技术负责人弹框
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
        type: 1
      },
      id: undefined,
      temp: {
        id: undefined,
        repairDocumentId: undefined, // 维修单id
        formCode: undefined, // 单据编号
        applicationTime: undefined, // 申请时间

        nums: 1, // 数量
        transferOutCompany: undefined, // 调出公司
        transferOutCompanyName: undefined, // 调出公司名称
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
        type: 1
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        detail: '查看设备维修出厂单'
      },
      processInstanceId: undefined, // 流程实例id
      printShow: false,
      printDialogVisible: false,
      printList: {
        fqr: null,
        fqrDate: null,
        bmjl: null,
        bmjlOpinion: null,
        bmjlDate: null,
        dcsbkz: null,
        dcsbkzOpinion: null,
        dcsbkzDate: null,
        sbfz: null,
        sbfzOpinion: null,
        sbfzDate: null,
        zcbfbz: null,
        zcbfbzOpinion: null,
        zcbfbzDate: null
      },
      printId: '',
      lcData: [],
      // 流转记录
      activeName: 'first',
      recordData: null,
      rules: {
        transferOutCompany: [{ required: true, message: '请引用报修设备', trigger: 'change' }],
        equipName: [{ required: true, message: '请输入设备名称', trigger: 'change' }],
        equipType: [{ required: true, message: '请输入型号规格', trigger: 'change' }],
        fixedAssetCode: [{ required: true, message: '请输入固定资产编号', trigger: 'change' }],
        serialNumber: [{ required: true, message: '请输入出厂编号', trigger: 'change' }],
        // manufacturer: [{ required: true, message: '请输入制造厂家', trigger: 'change' }],
        // depreciationPeriod: [{ required: true, message: '请输入折旧年限', trigger: 'change' }],
        usedPeriod: [{ required: true, message: '请输入已用年限', trigger: 'change' }],
        nums: [{ required: true, message: '请输入数量', trigger: 'change' }],
        // originalFinancialValue: [{ required: true, message: '请输入财务原值', trigger: 'change' }],
        // netBookValue: [{ required: true, message: '请输入账面净值', trigger: 'change' }],

        reason: [{ required: true, message: '请输入出厂原因', trigger: 'change' }]
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
            } else if (this.tableData[i].auditingType == 3) {
              this.tableData[i].auditingType = '审核通过'
            } else if (this.tableData[i].auditingType == 4) {
              this.tableData[i].auditingType = '审核不通过'
            } else if (this.tableData[i].auditingType == 5) {
              this.tableData[i].auditingType = '流程关闭'
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
        this.listQuery.applyStartTime = ''
        this.listQuery.applyEndTime = ''
      } else {
        this.listQuery.applyStartTime = this.value01[0]// 开始时间
        this.listQuery.applyEndTime = this.value01[1]
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
      this.printId = row.id
      // 根据id获取详情
      getDetail(id).then(response => {
        if (response.data.code == 200) {
          const details = response.data.data
          this.temp = Object.assign({}, details)
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
      // 流转记录
      this.processInstanceId = row.processInstanceId
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
    // 打印
    printData() {
      const params = this.printId
      fetchPrint(params).then(response => {
        if (response.data.code == 200) {
          this.printList = response.data.data
          this.lcData = response.data.data.historyList
          this.lcData.forEach(item => {
            if (item.taskName == '流程开始') {
              this.printList.fqr = item.userName
              this.printList.fqrDate = item.dateTime
            } else if (item.taskName == '部门经理') {
              this.printList.bmjl = item.userName
              this.printList.bmjlOpinion = item.opinion
              this.printList.bmjlDate = item.dateTime
            } else if (item.taskName == '设备科长') {
              this.printList.dcsbkz = item.userName
              this.printList.dcsbkzOpinion = item.opinion
              this.printList.dcsbkzDate = item.dateTime
            } else if (item.taskName == '设备副总') {
              this.printList.sbfz = item.userName
              this.printList.sbfzOpinion = item.opinion
              this.printList.sbfzDate = item.dateTime
            } else if (item.taskName == '资产部副部长') {
              this.printList.zcbfbz = item.userName
              this.printList.zcbfbzOpinion = item.opinion
              this.printList.zcbfbzDate = item.dateTime
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
      this.printDialogVisible = true
    },
    sendMessage(row) {
      this.listQuery2.id = row.id
      this.choosePerson()
      this.innerVisiblePerson = true
    },
    choosePerson() {
      this.listQuery1 = {
        pageNum: 1,
        pageSize: 2000,
        perName: undefined,
        workNumber: undefined
      }
      this.choosePerName = undefined
      this.orgListData = null
      this.diaLoading = true
      fetchChooseTree().then(response => {
        this.personOrgData = []
        this.personOrgData.push(response.data.data)
        setTimeout(() => {
          this.diaLoading = false
        }, 1 * 1000)
      })
    },
    handleNodeClick(data) {
      const params = {
        orgCode: data.orgCode,
        pageNum: 1,
        pageSize: 2000
      }
      choosePersonList(params).then(response => {
        this.orgListData = response.data.data.list
      })
    },
    handlePerson() {
      this.orgListData = []
      choosePersonList(this.listQuery1).then(response => {
        this.orgListData = response.data.data.list
      })
    },
    chooseData1(row) {
      this.choosePerName = row.perName
      this.listQuery2.workNumber = row.workNumber
    },
    choosePersonOk() {
      postMessage(this.listQuery2).then(response => {
        if (response.data.code === 200) {
          this.innerVisiblePerson = false
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

