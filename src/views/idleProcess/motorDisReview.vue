<template>
  <div class='app-container'>
    <el-container>
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
        <el-button class="filter-item" @click="handleCreate" type="primary" v-if="addShow">新增</el-button>
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
          <el-table-column prop="handleType" align="center" label="处置形式" >
             <template slot-scope="scope">
              <span>{{scope.row.handleType}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="auditingType" align="center" label="审核状态" >
          </el-table-column>
          <el-table-column prop="auditingUserName" align="center" label="当前处理人" >
          </el-table-column>
          <el-table-column align="center" label="操作" width="140px" fixed="right">
            <template slot-scope="scope">
              <el-button title="编辑" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)" 
               v-if="editShow" :disabled="scope.row.editDisabled?true:false"></el-button>
              <el-button title="删除" type="danger" icon="el-icon-delete" size="mini"  @click="deleteBtn(scope.row)" 
               v-if="deleteShow" :disabled="scope.row.deleteDisabled?true:false"></el-button>
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
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="70%" v-loading="listLoading" v-dialogDrag :close-on-click-modal="false"> 
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
                    <el-input v-model="temp.storeAddress" :disabled="!chooseShow"></el-input>
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
                  <el-button type="primary" @click="changeDivision" :disabled="!chooseShow">选择</el-button>
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
              <el-table :data="temp.equipMachineInfoList" border stripe 
               style="width: 100%;margin-bottom:10px;">
                <el-table-column width="60px" v-if="chooseShow">
                  <template slot-scope="scope">
                    <span style="color:#409EFF;font-size:16px" @click.prevent="addRow()"><i class="el-icon-plus"></i></span>
                    <span style="color:red;font-size:16px" @click.prevent="delRow(scope.row)" v-if="delShow"><i class="el-icon-minus"></i></span>
                    <!-- <el-button type="primary" circle icon="el-icon-plus" @click.prevent="addRow()"></el-button>
                    <el-button type="danger" circle icon="el-icon-minus" @click.prevent="delRow(scope.row)" v-if="delShow"></el-button> -->
                  </template>
                </el-table-column>
                <el-table-column label="名称" align="center" min-width="90" :render-header="renderName">
                  <template slot-scope="scope">
                    <el-form-item label-width="1x" :prop="'equipMachineInfoList.' + scope.$index + '.machineName'" :rules='rules.machineName'> 
                      <el-input v-model="scope.row.machineName" :disabled="!chooseShow"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="型号规格（功率）" min-width="150" :render-header="render1">
                  <template slot-scope="scope">
                    <el-form-item label-width="1x" :prop="'equipMachineInfoList.' + scope.$index + '.model'" :rules='rules.model'> 
                      <el-input v-model="scope.row.model" maxlength="32" :disabled="!chooseShow"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="数量" align="center" min-width="90" :render-header="render2">
                  <template slot-scope="scope">
                    <el-form-item label-width="1x" :prop="'equipMachineInfoList.' + scope.$index + '.number'" :rules='rules.number'> 
                      <el-input v-model="scope.row.number" oninput="value=value.replace(/[^\d]/g,'')" maxlength="4" :disabled="!chooseShow"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="购置时间" min-width="150" align="center" :render-header="render3">
                  <template slot-scope="scope">
                    <el-form-item label-width="1x" :prop="'equipMachineInfoList.' + scope.$index + '.buyTime'" :rules='rules.buyTime'> 
                      <el-date-picker style="width:100%"
                        v-model="scope.row.buyTime"
                        type="date"
                        placeholder="选择时间"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                         :disabled="!chooseShow">
                      </el-date-picker>
                    </el-form-item>
                    <!-- <el-input v-model="scope.row.buyTime"></el-input> -->
                  </template>
                </el-table-column>
                <el-table-column label="购置金额（元）" min-width="160" :render-header="render4">
                  <template slot-scope="scope">
                    <el-form-item label-width="1x" :prop="'equipMachineInfoList.' + scope.$index + '.buyMoney'" :rules='rules.buyMoney'>
                      <el-input v-model="scope.row.buyMoney" oninput="this.value=this.value.replace(/[^\d.]/g,'')" maxlength="10" :disabled="!chooseShow"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="备注" align="center" min-width="100">
                  <template slot-scope="scope">
                    <el-form-item label-width="1x">
                      <el-input v-model="scope.row.remark" maxlength="30" :disabled="!chooseShow"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
              </el-table>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="处置形式" prop="handleType">
                    <el-radio v-model="temp.handleType" label="1" disabled>报废/出售</el-radio>
                    <el-radio v-model="temp.handleType" label="2" disabled>抵款</el-radio>	
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="处置原因及说明（详细说明）" prop="handleReason" label-width="130px">
                <el-input type="textarea" maxlength="200" v-model="temp.handleReason" :disabled="!chooseShow"></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="流转记录" name="second" v-if="recordShow">
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
          <el-tab-pane label="流程图" name="three" v-if="recordShow">
            <div id="imgcontainer">
              <img id="pic" :src="chartData"/>
            </div>
          </el-tab-pane>
        </el-tabs>
        <!-- 按钮组 -->
        <el-form class="formDw"> 
          <el-form-item>
            <el-button type="primary" @click="dialogFormVisible = false">返回</el-button>
            <el-button v-if="dialogStatus=='create'" type="primary" @click="saveData">保存</el-button>
            <el-button v-if="dialogStatus=='update'" type="primary" @click="updateSaveData">保存</el-button>
            <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">提交</el-button>
            <el-button v-if="dialogStatus=='update'" type="primary" @click="updateData">提交</el-button>
            <el-button v-if="dialogStatus=='detail'&&printShow" type="primary" @click="printData">打印</el-button>
          </el-form-item>
        </el-form>
        <el-dialog width="40%" title="选择发起组织" :visible.sync="changeOrgVisible" append-to-body :close-on-click-modal="false" v-dialogDrag >
          <el-container>
            <el-aside style="width:100%">
              <span style="font-weight:800">当前登录用户所在组织：{{comName}}</span>
              <el-form>
                <el-form-item>
                <el-select v-model="temp.proxyOrgName" clearable  placeholder="请选择组织" @change='proxyOrgChange' style="width:100%">
                  <el-option
                    v-for="item in proxyOrgList"
                    :key="item.orgCode"
                    :label="item.orgName"
                    :value="item.orgName">
                  </el-option>
                </el-select>
                </el-form-item>
              </el-form>
            </el-aside>
          </el-container>
          <div slot="footer" class="dialog-footer">
            <el-button @click="changeOrgVisible = false" type="default">取消</el-button>
            <el-button type="primary" @click="changeOrgOk">确定</el-button>
          </div>
        </el-dialog>
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
      <!-- 打印 -->
			<el-dialog title="电机处置评审单打印预览" :close-on-click-modal="false" :visible.sync="printDialogVisible" width="60%" v-dialogDrag>
        <el-button type="primary" @click="printDialogVisible = false">返回</el-button>
        <el-button type="success" v-print="'#printTest'"><svg-icon icon-class="print"/>打印</el-button>
				<div id="printTest">
          <center>
					<table border= "0">
            <caption style="font-size: 30px;padding-top:20px;padding-bottom:20px; font-weight:800">电机处置评审单</caption>
            <thead>
              <tr>
                <th colspan="2">存放地点：{{printList.storeAddress}}</th>
                <th colspan="2">原使用部门:{{printList.originalUsedDepartmentName}}</th>
                <th colspan="2" style="text-align:right">{{printList.applyDate!=null?printList.applyDate.substring(0,4):''}}年
                  {{printList.applyDate!=null?printList.applyDate.substring(5,7):''}}月
                  {{printList.applyDate!=null?printList.applyDate.substring(8,10):''}}日</th>
                <th>金额单位：元</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>名称</td>
                <td colspan="2">型号规格（功率）</td>
                <td>数量</td>
                <td>购置时间</td>
                <td>购置金额</td>
                <td>备注</td>
              </tr>
              <tr v-for="item in equipMachineInfos" :key="item.id">
                <td>{{item.machineName}}</td>
                <td colspan="2">{{item.model}}</td>
                <td>{{item.number}}</td>
                <td>{{item.buyTime!=null?item.buyTime.substring(0,10):''}}</td>
                <td>{{item.buyMoney}}</td>
                <td>{{item.remark}}</td>
              </tr>
              <tr style="height:70px;">
                <td><span>处置形式</span></td>
                <td colspan="6">报废/出售（<span v-if="suggestShow">√</span>）抵款（<span v-if="!suggestShow">√</span> ）</td>
              </tr>
              <tr style="height:150px;">
                <td><span>处置原因及目的(详细说明）</span></td>
                <td colspan="6" style="text-align:left"><span style="font-size:14px;">{{printList.handleReason}} </span></td>
              </tr>
              <tr style="height:50px;">
                <td colspan="7"><span>评审部门意见</span></td>
              </tr>
              <tr style="height:60px;">
                <td>申请人</td>
                <td colspan="3" style="text-align:left;border-right:0px solid white;">意见：</td>
                <td style="text-align:right;border:0px solid white;">签名：{{printList.sqr}}</td>
                <td colspan="2" style="text-align:right;border-left:0px solid white;">日期：{{printList.applyDate!=null?printList.applyDate.substring(0,10):''}}&nbsp;&nbsp;</td>
              </tr>
              <tr style="height:60px;">
                <td>设备科负责人</td>
                <td colspan="3" style="text-align:left;border-right:0px solid white;">意见：{{printList.sbkOpinion}}</td>
                <td style="text-align:right;border:0px solid white;">签名：{{printList.sbk}}</td>
                <td colspan="2" style="text-align:right;border-left:0px solid white;">日期：{{printList.sbkDate!=null?printList.sbkDate.substring(0,10):''}}&nbsp;&nbsp;</td>
              </tr>
              <tr style="height:60px;">
                <td>工厂厂长</td>
                <td colspan="3" style="text-align:left;border-right:0px solid white;">意见：{{printList.gcczOpinion}}&nbsp;&nbsp;</td>
                <td style="text-align:right;border:0px solid white;">签名：{{printList.gccz}}</td>
                <td colspan="2" style="text-align:right;border-left:0px solid white;">日期：{{printList.gcczDate!=null?printList.gcczDate.substring(0,10):''}}&nbsp;&nbsp;</td>
              </tr>
              <tr style="height:60px;">
                <td>资产部</td>
                <td colspan="3" style="text-align:left;border-right:0px solid white;">意见：{{printList.zcbOpinion}}</td>
                <td style="text-align:right;border:0px solid white;">签名：{{printList.zcb}}</td>
                <td colspan="2" style="text-align:right;border-left:0px solid white;">日期：{{printList.zcbDate!=null?printList.zcbDate.substring(0,10):''}}&nbsp;&nbsp;</td>
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
import { fetchList, getDetail, saveFrom, submitForm, delById, fetchPrint } from '@/api/idleProcess/motorDisReview'
import { commonOptions, recordList, fetchChooseTree, processChart, getProxyOrgList, getCurrentUser } from '@/api/common/common'
import { menuList } from '@/store/modules/permission'
import { fetchButton } from '@/api/common/button'
export default {
  name: 'motorDisReview',
  data() {
    return {
      // 代办审核
      ifSave: false,
      changeOrgVisible: undefined,
      proxyOrgList: [],
      comName: undefined,
      comCode: undefined,
      userCode: undefined, // 用户编码
      // 判断新增、编辑、删除按钮权限显示隐藏
      menuCode: undefined,
      addShow: false,
      editShow: false,
      deleteShow: false,
      chooseShow: true, // 选择按钮
      delShow: false,
      printShow: false,
      chartData: null, // 流程图
      // 表格数据
      tableKey: 0,
      listLoading: false,
      tableData: [],
      total: null,
      value01: undefined,
      // 审核状态下拉框
      options: commonOptions,
      auditingType: '',
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        formCode: undefined,
        handleType: undefined,
        auditingType: undefined,
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
        }], // 电机信息集合
        proxyOrgCode: undefined, // 代理组织
        proxyOrgName: undefined
      },
      formTableData: [{
        machineName: null,
        model: null,
        number: null,
        buyTime: null,
        buyMoney: null,
        remark: null
      }],
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
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增',
        detail: '查看'
      },
      printDialogVisible: false, // 打印
      printList: {
        sqr: null,
        sbk: null,
        sbkOpinion: null,
        sbkDate: null,
        gccz: null,
        gcczOpinion: null,
        gcczDate: null,
        zcb: null,
        zcbOpinion: null,
        zcbDate: null,
        applyDate: null
      },
      equipMachineInfos: [{
        machineName: null,
        model: null,
        number: null,
        buyTime: null,
        buyMoney: null
      }],
      lcData: [],
      suggestShow: false,
      processInstanceId: undefined, // 流程实例id
      // 流转记录
      activeName: 'first',
      recordShow: false,
      recordData: null,
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
    this.getButton()
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
    getButton() {
      menuList.forEach(item => {
        item.children.forEach(e => {
          if (e.name == 'motorDisReview') {
            this.menuCode = e.code
          }
        })
      })
      // 查询按钮信息
      const params = {
        menuCode: this.menuCode,
        type: 'web'
      }
      fetchButton(params).then(response => {
        if (response.data.code == 200) {
          const getBtns = response.data.data
          for (var i = 0; i < getBtns.length; i++) {
            if (getBtns[i].buttonName == '新增') {
              this.addShow = true
            } else if (getBtns[i].buttonName == '编辑') {
              this.editShow = true
            } else if (getBtns[i].buttonName == '删除') {
              this.deleteShow = true
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
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        if (response.data.code === 200) {
          this.tableData = response.data.data.results
          for (var i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].auditingType == 1) {
              this.tableData[i].auditingType = '未提交'
            } else if (this.tableData[i].auditingType == 2) {
              this.tableData[i].auditingType = '审核中'

              this.tableData[i].editDisabled = true
              this.tableData[i].deleteDisabled = true
            } else if (this.tableData[i].auditingType == 3) {
              this.tableData[i].auditingType = '审核通过'

              this.tableData[i].editDisabled = true
              this.tableData[i].deleteDisabled = true
            } else if (this.tableData[i].auditingType == 4) {
              this.tableData[i].auditingType = '审核不通过'

              this.tableData[i].editDisabled = true
              this.tableData[i].deleteDisabled = true
            } else if (this.tableData[i].auditingType == 5) {
              this.tableData[i].auditingType = '流程关闭'

              this.tableData[i].editDisabled = true
              this.tableData[i].deleteDisabled = true
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
    // 根据编号查看
    handleDetail(row) {
      const id = row.id
      // 根据id获取详情
      getDetail(id).then(response => {
        if (response.data.code == 200) {
          const details = response.data.data
          this.temp = Object.assign({}, details)
          this.temp.applyDate = row.applyDate
          if (this.temp.handleType != null) {
            this.temp.handleType = this.temp.handleType.toString()
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
      this.activeName = 'first'
      this.dialogStatus = 'detail'
      this.recordShow = true
      this.delShow = false
      this.chooseShow = false
      this.id = row.id
      this.printShow = false
      if (row.auditingType == '审核通过') {
        this.printShow = true
      }
      this.dialogFormVisible = true
      // 流转记录
      this.processInstanceId = row.processInstanceId
    },
    // 删除
    deleteBtn(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const id = row.id
        delById(id).then(response => {
          if (response.data.code === 200) {
            const index = this.tableData.indexOf(row)
            this.tableData.splice(index, 1)
            this.$message({
              title: '成功',
              type: 'success',
              message: '删除成功!',
              duration: 2000
            })
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    resetTemp() {
      this.temp = {
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
        }], // 电机信息集合
        proxyOrgCode: undefined, // 代理组织
        proxyOrgName: undefined
      }
    },
    // 新增
    handleCreate() {
      this.resetTemp()
      this.delShow = false
      this.activeName = 'first'
      this.dialogStatus = 'create'
      this.chooseShow = true
      this.recordShow = false
      this.getUser()
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 新增保存
    saveData() {
      this.ifSave = true
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.proxyOrgList.length != 0) {
            this.changeOrgVisible = true
          } else {
            this.temp.proxyOrgCode = this.comCode
            this.createSave()
          }
        }
      })
    },
    createSave() {
      this.listLoading = true
      const tempData = Object.assign({}, this.temp)
      saveFrom(tempData).then(response => {
        if (response.data.code == 200) {
          this.dialogFormVisible = false
          this.getList()
          setTimeout(() => {
            this.listLoading = false
          }, 1 * 500)
          this.$message({
            title: '成功',
            message: '保存成功',
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
    },
    // 新增提交
    createData() {
      this.ifSave = false
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.proxyOrgList.length != 0) {
            this.changeOrgVisible = true
          } else {
            this.temp.proxyOrgCode = this.comCode
            this.createSubmit()
          }
        }
      })
    },
    createSubmit() {
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
            message: '提交成功',
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
    },
    // 编辑
    handleUpdate(row) {
      const id = row.id
      // 根据id获取详情
      getDetail(id).then(response => {
        if (response.data.code == 200) {
          const details = response.data.data
          this.temp = Object.assign({}, details)
          this.temp.applyDate = row.applyDate
          if (this.temp.equipMachineInfoList.length == 1) {
            this.delShow = false
          } else {
            this.delShow = true
          }
          if (this.temp.handleType != null) {
            this.temp.handleType = this.temp.handleType.toString()
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
      this.activeName = 'first'
      this.dialogStatus = 'update'
      this.recordShow = false
      this.chooseShow = true
      this.getUser()
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 获取当前用户信息
    getUser() {
      getCurrentUser().then(response => {
        if (response.data.code == 200) {
          this.userCode = response.data.data.userCode
          getProxyOrgList(this.userCode).then(response => {
            if (response.data.code == 200) {
              this.comName = response.data.data.orgName
              this.comCode = response.data.data.orgCode
              if (this.proxyOrgList != null) {
                this.proxyOrgList = response.data.data.list
              }
            }
          })
        }
      })
    },
    proxyOrgChange() {
      this.proxyOrgList.forEach(item => {
        if (item.orgName == this.temp.proxyOrgName) {
          this.temp.proxyOrgCode = item.orgCode
        }
      })
    },
    changeOrgOk() {
      if (this.temp.proxyOrgName == undefined || this.temp.proxyOrgName == '' || this.temp.proxyOrgName == null) {
        this.temp.proxyOrgCode = this.comCode
        if (this.ifSave == true) {
          this.createSave()
        } else if (this.ifSave == false) {
          this.createSubmit()
        }
      } else {
        if (this.ifSave == true) {
          this.createSave()
        } else if (this.ifSave == false) {
          this.createSubmit()
        }
      }
      this.changeOrgVisible = false
    },
    // 修改保存
    updateSaveData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.listLoading = true
          const tempData = Object.assign({}, this.temp)
          saveFrom(tempData).then(response => {
            if (response.data.code == 200) {
              this.dialogFormVisible = false
              this.getList()
              setTimeout(() => {
                this.listLoading = false
              }, 1 * 500)
              this.$message({
                title: '成功',
                message: '保存成功',
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
    // 修改提交
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.updataSubmit()
        }
      })
    },
    updataSubmit() {
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
            message: '提交成功',
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
    },
    // 打印
    printData() {
      this.printDialogVisible = true
      const params = {
        id: this.id
      }
      fetchPrint(params).then(response => {
        if (response.data.code == 200) {
          this.printList = response.data.data.equipMachineReviewForm
          this.equipMachineInfos = response.data.data.equipMachineInfos
          this.lcData = response.data.data.rt
          this.lcData.forEach(item => {
            if (item.taskName == '流程开始') {
              this.printList.sqr = item.userName
            } else if (item.taskName == '设备科负责人') {
              this.printList.sbk = item.userName
              this.printList.sbkOpinion = item.opinion
              this.printList.sbkDate = item.dateTime
            } else if (item.taskName == '工厂厂长') {
              this.printList.gccz = item.userName
              this.printList.gcczOpinion = item.opinion
              this.printList.gcczDate = item.dateTime
            } else if (item.taskName == '资产部') {
              this.printList.zcb = item.userName
              this.printList.zcbOpinion = item.opinion
              this.printList.zcbDate = item.dateTime
            }
          })
          if (this.printList.handleType == '1') {
            this.suggestShow = true
          } else if (this.printList.handleType == '2') {
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
  height: 60px;
  text-align: center;
}
#printTest table tbody td{
  border: 1px solid black;
  width: 14.2%;
}
#pic{
  width: 100%;
}
</style>

