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
            <el-form-item label="处置形式" prop="handleType">
              <el-radio v-model="listQuery.handleType" label="1">报废/出售</el-radio>
              <el-radio v-model="listQuery.handleType" label="2">抵款</el-radio>	
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
          <el-table-column prop="storeAddress" align="center" label="存放地点" >
          </el-table-column>
          <el-table-column prop="originalUsedDepartmentName" align="center" label="原使用部门" >
          </el-table-column>
          <el-table-column align="center" label="申请日期" >
            <template slot-scope="scope">
              <span>{{scope.row.applyDate}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="handleType" align="center" label="处置形式">
          </el-table-column>
          <el-table-column prop="auditingType" align="center" label="审核状态" >
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
			<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" v-dialogDrag width="70%" :close-on-click-modal="false" v-loading="listLoading"> 
				<el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="表单信息" name="first">
            <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="100px">
              <el-form-item>
                <span class="equip-title">电机处置评审单</span>
              </el-form-item>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="单据编号" prop="formCode">
                    <el-input v-model="temp.formCode" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="存放地点" prop="storeAddress">
                    <el-input v-model="temp.storeAddress" :disabled="tzsqTask"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="10" style="padding-right:0px;">
                  <el-form-item label="原使用部门" prop="originalUsedDepartmentName">
                    <el-input v-model="temp.originalUsedDepartmentName" disabled></el-input>
                  </el-form-item>
                </el-col>
                 <el-col :span="2" style="padding-left:0px;">
                  <el-button type="primary" @click="changeDivision" :disabled="tzsqTask">选择</el-button>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="申请日期" prop="applyDate">
                    <el-date-picker style="width:100%"
                      v-model="temp.applyDate"
                      type="date" disabled>
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-table :data="temp.equipMachineInfoList" ref="dataForm" :rules="rules" tooltip-effect="dark" border stripe 
                style="width: 100%;margin-bottom:10px;">
                <el-table-column width="60px" v-if="!tzsqTask">
                  <template slot-scope="scope">
                    <span style="color:#409EFF;font-size:16px" @click.prevent="addRow()"><i class="el-icon-plus"></i></span>
                    <span style="color:red;font-size:16px" @click.prevent="delRow(scope.row)" v-if="delShow"><i class="el-icon-minus"></i></span>
                  </template>
                </el-table-column>
                <el-table-column label="名称" align="center" min-width="90" :render-header="renderName">
                  <template slot-scope="scope">
                    <el-form-item label-width="1x" :prop="'equipMachineInfoList.' + scope.$index + '.machineName'" :rules='rules.machineName'>
                      <el-input v-model="scope.row.machineName" :disabled="tzsqTask"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="型号规格（功率）" min-width="170" :render-header="render1">
                  <template slot-scope="scope">
                    <el-form-item label-width="1x" :prop="'equipMachineInfoList.' + scope.$index + '.model'" :rules='rules.model'>
                      <el-input v-model="scope.row.model" :disabled="tzsqTask" maxlength="32"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="数量" align="center" min-width="90" :render-header="render2">
                  <template slot-scope="scope">
                    <el-form-item label-width="1x" :prop="'equipMachineInfoList.' + scope.$index + '.number'" :rules='rules.number'>
                    <el-input v-model="scope.row.number" :disabled="tzsqTask"  oninput="value=value.replace(/[^\d]/g,'')" maxlength="4"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="购置时间" prop="buyTime" min-width="150" :render-header="render3">
                  <template slot-scope="scope">
                    <el-form-item label-width="1x" :prop="'equipMachineInfoList.' + scope.$index + '.buyTime'" :rules='rules.buyTime'>
                    <el-date-picker style="width:100%"
                      v-model="scope.row.buyTime"
                      type="date"
                      placeholder="选择时间"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                       :disabled="tzsqTask">
                    </el-date-picker>
                    <!-- <el-input v-model="scope.row.buyTime"></el-input> -->
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="购置金额（元）" min-width="160" :render-header="render4">
                  <template slot-scope="scope">
                    <el-form-item label-width="1x" :prop="'equipMachineInfoList.' + scope.$index + '.buyMoney'" :rules='rules.buyMoney'>
                    <el-input v-model="scope.row.buyMoney" :disabled="tzsqTask" oninput="this.value=this.value.replace(/[^\d.]/g,'')" maxlength="10"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="备注" align="center"  min-width="100">
                  <template slot-scope="scope">
                    <el-form-item label-width="1x">
                      <el-input v-model="scope.row.remark" maxlength="30" :disabled="tzsqTask"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
              </el-table>
              <el-row>
                <el-col :span="1" style="width:2px;color:red;padding:8px 10px 8px 1px" v-if="!finance">
                  <span>*</span>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="处置形式" prop="handleType">
                    <el-radio v-model="temp.handleType" label="1" :disabled="finance">报废/出售</el-radio>
                    <el-radio v-model="temp.handleType" label="2" :disabled="finance">抵款</el-radio>	
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="处置原因及说明（详细说明）" prop="handleReason" label-width="130px">
                <el-input type="textarea" maxlength="200" v-model="temp.handleReason" :disabled="tzsqTask"></el-input>
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
      <!-- 选择使用部门 -->
      <el-dialog width="50%" title="选择使用部门" :visible.sync="divisionVisible" append-to-body :close-on-click-modal="false" v-dialogDrag>
        <el-container>
          <el-aside width="500px">
            <!-- <span style="margin-left:20px;color:red">{{getOrgName}}</span> -->
            <el-tree 
              :data="orgData" 
              :props="defaultProps1"
              ref="tree"
              show-checkbox 
              node-key="orgCode"
              check-strictly
              @check-change="handleChange"><!-- 当前节点变化时处理事件 -->
            </el-tree>
          </el-aside>
        </el-container>
        <div slot="footer" class="dialog-footer">
          <el-button @click="divisionVisible = false">取消</el-button>
          <el-button @click="handleClick2" type="primary">确定</el-button>
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
import { fetchNeedList, getDetail, agreeApply, submitForm } from '@/api/idleProcess/motorDisReview'
import { getCurrentTask, recordList, getCurrentUser, fetchChooseTree, endProcess, processChart, choosePersonList, transferList } from '@/api/common/common'
export default {
  name: 'motorDisReviewNeed',
  data() {
    return {
      // 节点判断是否可输入
      finance: true, // 资产部
      tzsqTask: true, // 调整申请
      delShow: false,
      chartData: null, // 流程图
      // 弹框组
      dialogFormVisible: false, // 查看
      agreeDialogVisible: false, // 同意/退回
      // 选择部门
      i: 0,
      divisionVisible: false,
      orgData: [],
      defaultProps1: {
        children: 'children',
        label: 'orgFullName'
      },
      getOrgCode: undefined,
      getOrgName: undefined,
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
        storeAddress: undefined, // 存放地址
        originalUsedDepartmentCode: undefined, // 原使用部门编号
        originalUsedDepartmentName: undefined, // 原使用部门名称
        formCode: undefined, // 单据编号
        applyDate: undefined, // 申请日期

        handleType: undefined, // 处置形式
        handleReason: undefined, // 处置原因

        equipMachineInfoList: [{
          machineName: null,
          model: null,
          number: null,
          buyTime: null,
          buyMoney: null,
          remark: null
        }] // 电机信息集合
      },
      // 任务审批
      popData: {
        flag: undefined,
        opetion: undefined,
        taskId: undefined, // 任务id
        handleType: null,
        id: undefined
      },
      taskId: undefined,
      dialogStatus: '',
      textMap: {
        detail: '查看电机处置评审单',
        agree: '同意办理',
        unagree: '退回办理'
      },
      // 流程
      nodeKey: undefined, // 节点key
      nodeName: undefined, // 节点名称
      processInstanceId: undefined, // 流程实例id
      // 流转记录
      recordData: null,
      activeName: 'first',
      rules: {
        // formCode: [{ required: true, message: '请输入单据编号', trigger: 'change' }],
        storeAddress: [{ required: true, message: '请输入存放地点', trigger: 'change' }],
        originalUsedDepartmentName: [{ required: true, message: '请选择原使用部门', trigger: 'change' }],

        machineName: [{ required: true, message: '请输入名称', trigger: 'change' }],
        number: [{ required: true, message: '请输入数量', trigger: 'change' }],
        model: [{ required: true, message: '请输入型号规格(功率)', trigger: 'change' }],
        buyTime: [{ required: true, message: '请选择购置时间', trigger: 'change' }],
        buyMoney: [{ required: true, message: '请输入购置金额', trigger: 'change' }],

        // handleType: [{ required: true, message: '请选择处置形式', trigger: 'change' }],
        handleReason: [{ required: true, message: '请输入处置原因及说明（详细说明）', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    renderName(h) {
      return (
        <div>
          <i style='color:red;padding:5px;'>*</i>
          <span>名称</span>
        </div>
      )
    },
    render1(h) {
      return (
        <div>
          <i style='color:red;padding:5px;'>*</i>
          <span>型号规格（功率）</span>
        </div>
      )
    },
    render2(h) {
      return (
        <div>
          <i style='color:red;padding:5px;'>*</i>
          <span>数量</span>
        </div>
      )
    },
    render3(h) {
      return (
        <div>
          <i style='color:red;padding:5px;'>*</i>
          <span>购置时间</span>
        </div>
      )
    },
    render4(h) {
      return (
        <div>
          <i style='color:red;padding:5px;'>*</i>
          <span>购置金额（元）</span>
        </div>
      )
    },
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
            if (this.tableData[i].handleType == 1) {
              this.tableData[i].handleType = '报废/出售'
            } else if (this.tableData[i].handleType == 2) {
              this.tableData[i].handleType = '抵款'
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
      this.tzsqTask = true
      this.delShow = false
      this.dialogFormVisible = true
      this.popData.taskId = row.taskId
      this.processInstanceId = row.processInstanceId
      const id = row.id
      this.id = row.id
      getDetail(id).then(response => {
        if (response.data.code === 200) {
          this.temp = Object.assign({}, response.data.data)
          this.temp.applyDate = row.applyDate
          this.temp.taskId = row.taskId
          if (this.temp.handleType != null) {
            this.temp.handleType = this.temp.handleType.toString()
          }
        } else {
          this.$notify({
            title: '警告',
            message: response.data.msg,
            type: 'warning',
            duration: 3000
          })
        }
      })
      this.getNodeKey() // 获取当前任务信息
    },
    // 选择使用部门
    changeDivision() {
      this.getOrgCode = undefined
      this.getOrgName = undefined
      fetchChooseTree().then(response => {
        this.orgData = []
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
      })
      this.divisionVisible = true
    },
    // 设置部门组织树状图单选
    handleChange(data, checked, node) {
      this.i++
      if (this.i % 2 == 0) {
        if (checked) {
          this.$refs.tree.setCheckedNodes([])
          this.$refs.tree.setCheckedNodes([data])
          // 交叉点击节点
        } else {
          this.$refs.tree.setCheckedNodes([])
          // 点击已经选中的节点，置空
        }
      }
    },
    // 点击选择部门确认
    handleClick2() {
      this.treeData = this.$refs.tree.getCheckedNodes()
      this.temp.originalUsedDepartmentName = this.treeData[0].orgFullName
      this.temp.originalUsedDepartmentCode = this.treeData[0].orgCode
      this.divisionVisible = false
    },
    // 表单里表格新增和删除
    addRow() {
      this.delShow = true
      var list = {
        machineName: this.machineName,
        model: this.model,
        number: this.number,
        buyTime: this.buyTime,
        buyMoney: this.buyMoney,
        remark: this.remark
      }
      this.temp.equipMachineInfoList.unshift(list)
    },
    delRow(row) {
      const index = this.temp.equipMachineInfoList.indexOf(row)
      this.temp.equipMachineInfoList.splice(index, 1)
      if (this.temp.equipMachineInfoList.length == 1) {
        this.delShow = false
      }
    },
    // 获取当前用户信息
    getUser() {
      getCurrentUser().then(response => {
        this.userId = response.data.data.id
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
            if (this.temp.equipMachineInfoList.length == 1) {
              this.delShow = false
            } else {
              this.delShow = true
            }
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
      this.popData.opetion = null
      this.popData.flag = true
      this.popData.id = this.id
      this.popData.handleType = this.temp.handleType
      if (this.nodeName == '资产部') { // 判断是否是资产部审核节点
        if (this.popData.handleType == null) {
          this.$notify({
            title: '警告',
            message: '请选择处置形式',
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
      this.popData.id = this.id
      this.popData.handleType = this.temp.handleType
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
          const tempData = Object.assign({}, this.temp)
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
      const moduleTypeId = 17
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
.el-tree-node__content:hover {
  background-color: #6dc6fa;
  border-radius:3%
} 
#pic{
  width: 100%;
}
</style>