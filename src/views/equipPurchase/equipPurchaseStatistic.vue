<template>
  <div class='app-container'>
    <el-container>
      <!-- <el-header style="height:115px"> -->
        <div class="formSearch">
          <el-form :inline="true">
            <el-form-item label="单据编号">
              <el-input class="filter-item input" placeholder="请输入单据编号" v-model="listQuery.purchaseApplicationCode">
              </el-input>
            </el-form-item>
            <el-form-item label="设备名称">
              <el-input class="filter-item input" placeholder="请输入设备名称" v-model="listQuery.equipTypeName">
              </el-input>
            </el-form-item>
            <!-- <el-form-item label="使用部门">
              <el-input class="filter-item input" placeholder="请输入使用部门" v-model="listQuery.useOrgName">
              </el-input>
            </el-form-item> -->
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
        <el-table :key='tableKey' :data="tableData" height="200" row-key="id" v-loading="listLoading" border fit highlight-current 
          style="width: 100%;margin-top:10px;min-height:500px" :header-cell-style="{background:'oldlace'}">
          <el-table-column prop="purchaseApplicationCode" align="center" label="单据编号" width="160px" >
            <template slot-scope="scope">
              <span class="look-detail" @click="handleDetail(scope.row)">{{scope.row.purchaseApplicationCode}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="equipTypeName" align="center" label="设备名称" > 
          </el-table-column>
          <el-table-column prop="useOrgName" align="center" label="使用部门">
          </el-table-column>
          <el-table-column prop="equipNum" align="center" label="台数" >
          </el-table-column>
          <el-table-column prop="applicationTime" align="center" label="申请时间" >
            <template slot-scope="scope">
              <span>{{scope.row.applicationTime!=null?scope.row.applicationTime.substring(0,10):''}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="requirementDeliveryTime" align="center" label="要求交货时间" >
            <template slot-scope="scope">
                <span>{{scope.row.requirementDeliveryTime!=null?scope.row.requirementDeliveryTime.substring(0,10):''}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="equipBuySuggest" align="center" label="设备采购建议" >
          </el-table-column>
          <el-table-column prop="auditingType" align="center" label="审核状态" >
            <template slot-scope="scope">
                <span>{{scope.row.auditingType}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="recordCode" align="center" label="关联备案单" >
          </el-table-column>
          <el-table-column prop="assignee" align="center" label="当前处理人" >
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
      <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" v-loading="listLoading" :visible.sync="dialogFormVisible" v-dialogDrag width="60%"> 
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="表单信息" name="first">
            <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="110px">
              <el-form-item>
                <span class="equip-title">设备采购申请单</span>
                <span class="equip-title1" v-if="temp.recordCode!== null">根据编号为{{temp.recordCode}}的备案单生成</span>
              </el-form-item>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="单据编号" prop="purchaseApplicationCode">
                    <el-input v-model="temp.purchaseApplicationCode" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="设备名称" prop="equipTypeCode"  >
                    <el-input v-model="temp.equipTypeName" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12" style="padding-right:0px;">
                  <el-form-item label="使用公司" prop="useCompanyName">
                    <el-input v-model="temp.useCompanyName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" style="padding-right:0px;">
                  <el-form-item label="使用工厂" prop="useFactoryName">
                    <el-input v-model="temp.useFactoryName" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="使用部门" prop="useOrgCode">
                    <el-input v-model="temp.useOrgName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="台数" prop="equipNum">
                    <el-input type="number" v-model="temp.equipNum" maxlength="5" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="申请时间" prop="applicationTime">
                      <el-date-picker v-model="temp.applicationTime" type="date" disabled style="width:100%">
                      </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="要求交货时间" prop="requirementDeliveryTime">
                      <el-date-picker style="width:100%"
                          v-model="temp.requirementDeliveryTime"
                          type="date"
                          placeholder="选择时间" disabled>
                      </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="申请原因" prop="applicationReason">
                <el-input v-model="temp.applicationReason" maxlength="200" disabled></el-input>
              </el-form-item>
              <el-form-item label="具体要求" prop="detailRequirement">
                <el-input v-model="temp.detailRequirement" maxlength="200" disabled></el-input>
              </el-form-item>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="设备采购建议" prop="equipBuySuggest">
                    <el-radio v-model="temp.equipBuySuggest" label="内部制造" disabled>内部制造</el-radio>
                    <el-radio v-model="temp.equipBuySuggest" label="外部制造" disabled>外部制造</el-radio>	
                  </el-form-item>
                </el-col>  
                <el-col :span="11">
                  <el-form-item label="设备金额" prop="purchaseSum">
                    <el-input type="text" v-model="temp.purchaseSum" maxlength="11" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="1" style="padding:0px;font-size:20px;font-weight:800;">
                  <span>元</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  <el-form-item label="技术资料" prop="fileData">
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
import { fetchAllList, fetchDetail, fetchExportList } from '@/api/equipPurchase/equipPurchaseApply'
import { recordList, processChart, fileList, fetchComTree, fetchChooseTree } from '@/api/common/common'
import { baseUrl } from '@/api/common/fileBaseUrl'
export default {
  name: 'index',
  data() {
    return {
      routMsg: '',
      value01: null,
      activeName: 'first',
      // 弹框组
      dialogFormVisible: false,
      chartData: null, // 流程图
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
        purchaseApplicationCode: undefined,
        equipTypeName: undefined,
        // useOrgName: undefined,
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
      // 文件数据
      fileData: [],
      documentWordCode: undefined, // 单据编号
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
      recordShow: false,
      recordData: null,
      temp: {
        applicationReason: undefined,
        applicationTime: undefined,
        detailRequirement: undefined,
        equipBuySuggest: undefined,
        equipNum: undefined,
        equipTypeCode: undefined,
        equipTypeName: undefined,
        orgFullName: undefined,
        id: undefined,
        requirementDeliveryTime: undefined,
        useCompanyName: undefined, // 使用公司
        useCompanyCode: undefined,
        useFactoryName: undefined, // 使用工厂
        useFactoryCode: undefined,
        useOrgCode: undefined,
        useOrgName: undefined,
        purchaseSum: undefined, // 设备金额
        purchaseApplicationCode: undefined, // 采购申请单号
        recordCode: null
      },
      dialogStatus: '',
      textMap: {
        detail: '查看设备采购申请单'
      },
      rules: {
        equipTypeName: [{ required: true, message: '请选择设备名称', trigger: 'change' }],
        useCompanyName: [{ required: true, message: '请选择使用公司', trigger: 'change' }],
        useFactoryName: [{ required: true, message: '请选择使用工厂', trigger: 'change' }],
        useOrgName: [{ required: true, message: '请选择使用部门', trigger: 'change' }],
        equipNum: [{ required: true, message: '请输入台数(数字)', trigger: 'change' }],
        requirementDeliveryTime: [{ required: true, message: '请选择要求交货时间', trigger: 'change' }],
        applicationReason: [{ required: true, message: '请输入申请原因', trigger: 'change' }],
        detailRequirement: [{ required: true, message: '请输入具体要求', trigger: 'change' }],
        equipBuySuggest: [{ required: true, message: '请选择设备采购建议', trigger: 'change' }]
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
      const routerParams = this.$route.params.dataObj
      this.routMsg = routerParams
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
    // 根据编号查看
    handleDetail(row) {
      this.activeName = 'first'
      this.dialogStatus = 'detail'
      this.dialogFormVisible = true
      const id = row.id
      this.documentWordCode = row.purchaseApplicationCode // 单据编号
      fetchDetail(id).then(response => {
        if (response.data.code === 200) {
          this.temp.budget = response.data.data.budget
          this.temp = Object.assign({}, response.data.data)
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
    // 搜索
    handleFilter() {
      if (this.listQuery.companyName == '' || this.listQuery.companyName == undefined) {
        this.listQuery.companyCode = ''
      }
      if (this.listQuery.factoryName == '' || this.listQuery.factoryName == undefined) {
        this.listQuery.factoryCode = ''
      }
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
    // 获取文件列表
    getFileList() {
      const find = {
        moduleType: '2', // 模块类别
        attachmentCode: 'CGSQDFJ', // 附件编码
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
<style scoped>
.formSearch {
  width: 100%;
  background: #fafafa;
  border: 1px solid #e9e9e9;
  border-radius: 3px;
  padding: 18px 10px 0;
  /* margin-bottom: 15px; */
}
.equip-title,.equip-title1{
  margin-left: -100px;
  text-align: center;
  display: block;
}
.equip-title{
  font-size: 20px;
  font-weight: 600;
}
.formDw{
	position: absolute;
	right: 20px;
	top: 80px;
}
</style>

