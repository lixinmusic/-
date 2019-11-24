<template>
  <div class='app-container'>
    <el-container>
      <div class="formSearch">
        <el-form :inline="true">
          <el-form-item label="编号">
            <el-input class="filter-item input" placeholder="请输入编号" maxlength="32" v-model="listQuery.reformCode">
            </el-input>
          </el-form-item>
          <el-form-item label="项目外部名称">
            <el-input class="filter-item input" placeholder="请输入项目外部名称" maxlength="50" v-model="listQuery.projectOutsideName">
            </el-input>
          </el-form-item>
          <el-form-item label="项目内部名称">
            <el-input class="filter-item input" placeholder="请输入项目内部名称" maxlength="50" v-model="listQuery.projectInsideName">
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
            <el-button class="filter-item" type="primary" style="float:right"  icon="el-icon-search" @click="handleFilter">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-main style="padding:20px 0">
        <el-table :key='tableKey' :data="tableData" height="200" row-key="id" v-loading="listLoading" 
          border fit highlight-current style="width: 100%;margin-top:10px;min-height:500px" 
          :header-cell-style="{background:'oldlace'}">
          <el-table-column prop="reformCode" align="center" label="编号" width="160px">
            <template slot-scope="scope">
              <span class="look-detail" @click="handleDetail(scope.row)">{{scope.row.reformCode}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="projectInsideName" align="center" label="项目内部名称" min-width="105">
          </el-table-column>
          <el-table-column prop="projectLeaderName" align="center" label="项目组长">
          </el-table-column>
          <el-table-column prop="projectOutsideName" align="center" label="项目外部名称" min-width="105">
          </el-table-column>
          <el-table-column prop="technologyLeaderName" align="center" label="技术负责人" >
          </el-table-column>
          <el-table-column prop="requirementCompleteTime" align="center" label="项目要求完成时间" min-width="140">
            <template slot-scope="scope">
              <span>{{scope.row.requirementCompleteTime.substring(0,10)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="equipReformSuggest" align="center" label="设备改造建议" >
          </el-table-column>
          <el-table-column prop="setupProject" align="center" label="是否立项" >
          </el-table-column>
          <el-table-column prop="auditingType" align="center" label="审核状态" >
            <template slot-scope="scope">
              <span>{{scope.row.auditingType}}</span>
            </template>
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
      <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" :visible.sync="dialogFormVisible" v-dialogDrag width="1200px" v-loading="listLoading"> 
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="表单信息" name="first">
            <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="150px">
              <el-form-item>
                <span class="equip-title">设备采购项目备案通知书</span>
              </el-form-item>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="编号" prop="reformCode">
                    <el-input v-model="temp.reformCode" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="改造项目备案时间" prop="applyDate">
                    <el-date-picker style="width:100%"
                      v-model="temp.applyDate" disabled
                      type="date"
                      placeholder="选择时间"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      >
                    </el-date-picker>
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
                <el-col :span="12">
                  <el-form-item label="项目外部名称" prop="projectOutsideName">
                      <el-input v-model="temp.projectOutsideName" maxlength="50" disabled></el-input>
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
                  <el-form-item label="技术负责人" prop="technologyLeaderName">
                      <el-input v-model="temp.technologyLeaderName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="设备采购建议" prop="equipReformSuggest">
                    <el-radio v-model="temp.equipReformSuggest" label="内部改造" disabled>内部改造</el-radio>
                    <el-radio v-model="temp.equipReformSuggest" label="外部改造" disabled>外部改造</el-radio>	
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="是否立项" prop="setupProject">
                    <el-checkbox-group v-model="checkList">
                      <el-checkbox label="是" disabled></el-checkbox>
                      <el-checkbox label="否" disabled></el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="设备改造完成时间" prop="equipReformCompleteTime">
                    <el-date-picker style="width:100%"
                      v-model="temp.equipReformCompleteTime"
                      type="date"
                      placeholder="选择时间" disabled>
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="3">
                  <span style="width:1px;color:red;padding:1px">*</span>
                  <span style="font-weight:600;">改造内容</span>
                </el-col>
                <el-col :span="20" style="border:1px solid #999;padding:10px;">
                  <el-table :data="temp.equipReformContentList" border stripe 
                    style="width: 100%;margin-bottom:10px;">
                    <el-table-column label="固定资产编号" align="center" min-width="120">
                      <template slot-scope="scope">
                        <el-form-item label-width="1x" :prop="'equipReformContentList.' + scope.$index + '.fixedAssetCode'" :rules='rules.fixedAssetCode'> 
                          <el-input v-model="scope.row.fixedAssetCode" disabled>
                            <el-button style="padding:5px;" slot="append" @click="handleChooseEquip(scope.$index)" disabled>选择</el-button>
                          </el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column label="设备名称" align="center" min-width="90">
                      <template slot-scope="scope">
                        <el-form-item label-width="1x" :prop="'equipReformContentList.' + scope.$index + '.equipmentName'" :rules='rules.equipmentName'> 
                          <el-input type="textarea" v-model="scope.row.equipmentName" disabled></el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column label="使用工厂" align="center" min-width="90">
                      <template slot-scope="scope">
                        <el-form-item label-width="1x" :prop="'equipReformContentList.' + scope.$index + '.factoryName'" :rules='rules.factoryName'> 
                          <el-input type="textarea" v-model="scope.row.factoryName" disabled></el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column label="使用部门" align="center" min-width="90">
                      <template slot-scope="scope">
                        <el-form-item label-width="1x" :prop="'equipReformContentList.' + scope.$index + '.divisionName'" :rules='rules.divisionName'> 
                          <el-input type="textarea" v-model="scope.row.divisionName" disabled></el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column label="改造内容" align="center" min-width="110">
                      <template slot-scope="scope">
                        <el-form-item label-width="1x" :prop="'equipReformContentList.' + scope.$index + '.reformContent'" :rules='rules.reformContent'>
                          <el-input type="textarea" maxlength="200" placeholder="请填写改造内容" v-model="scope.row.reformContent" disabled></el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column label="预计改造金额(元)" align="center" min-width="80">
                      <template slot-scope="scope">
                        <el-form-item label-width="1x" :prop="'equipReformContentList.' + scope.$index + '.estimateMoney'" :rules='rules.estimateMoney'> 
                          <el-input v-model="scope.row.estimateMoney" maxlength="9" oninput="value=value.replace(/[^\d]/g,'')" disabled></el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div style="font-size:16px;font-weight:500;position: relative;height:25px;">
                    <span style="position: absolute;right:10px;bottom:1px;">总计金额：{{temp.totalMoney}}元</span>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  <el-form-item label="项目方案附件上传" prop="projectProgrammeFileList">
                  </el-form-item>
                </el-col>
              </el-row>
              <el-table :data="projectProgrammeFileList"
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
                  <el-form-item label="附件" prop="sbgzFileData">
                    <input id="uploadImg" type="file" @change="fileUpload" v-if="false">
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <el-table :data="sbgzFileData"
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
            <el-button type="primary" @click="printData" v-if="printShow">打印</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
       <!-- 打印 -->
			<el-dialog title="改造备案通知书打印预览" :close-on-click-modal="false" :visible.sync="printDialogVisible" width="810px">
        <el-button type="primary" @click="printDialogVisible = false">返回</el-button>
        <el-button type="success" v-print="'#printTest'"><svg-icon icon-class="print"/>打印</el-button>
				<div id="printTest">
					<table border= "0">
            <caption style="font-family:SimHei;font-size: 20px;padding-bottom:10px;">设备改造项目备案通知书</caption>
            <thead>
              <tr>
                <th colspan="3"></th>
                <th>编号：{{printList.reformCode}}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>项目内部名称</td>
                <td>{{printList.projectInsideName}}</td>
                <td>项目组长（负责人）</td>
                <td>{{printList.projectLeaderName}}</td>
              </tr>
              <tr>
                <td>项目外部名称</td>
                <td>{{printList.projectOutsideName}}</td>
                <td>技术负责人</td>
                <td>{{printList.technologyLeaderName}}</td>
              </tr>
              <tr>
                <td>项目要求完成时间</td>
                <td>{{printList.requirementCompleteTime!=null?printList.requirementCompleteTime.substring(0,10):''}}</td>
                <td>项目发起公司</td>
                <td>{{printList.companyName}}</td>
              </tr>
              <tr>
                <td>设备采购建议</td>
                <td colspan="3">内部改造（<span v-if="equipReformSuggest">√</span>）外部改造（<span v-if="!equipReformSuggest">√</span> ）</td>
              </tr>
              <tr style="height:90px;">
                <td rowspan="2" align="center">主要内容</td>
                <td colspan="3" style="border-bottom:0px solid white;">
                  <el-table :data="printList.equipReformContentList" style="width: 100%">
                    <el-table-column prop="fixedAssetCode" label="固定资产编号">
                    </el-table-column>
                    <el-table-column prop="equipmentName" label="设备名称">
                    </el-table-column>
                    <el-table-column prop="factoryName" label="使用工厂">
                    </el-table-column>
                    <el-table-column prop="divisionName" label="使用部门">
                    </el-table-column>
                    <el-table-column prop="reformContent" label="改造内容">
                    </el-table-column>
                    <el-table-column prop="estimateMoney" label="预计改造金额">
                    </el-table-column>
                  </el-table>
                </td>
              </tr>
              <tr style="border-top:0px solid white;">
                <td>总计：{{printList.totalMoney}}</td>
                <td style="border-top:0px solid white;border-bottom:0px solid white;" colspan="3" align="right">
                  <span>项目主管部门签字：{{printList.xmzgbmr}}&nbsp;&nbsp;</span>
                  <span>日期：{{printList.xmzgbmrDate!=null?printList.xmzgbmrDate.substring(0,10):''}}&nbsp;</span>
                </td>
              </tr>
              <tr style="height:80px;">
                <td rowspan="2">安全、环保要求审核（非工厂项目无需工厂签字</td>
                <td colspan="2" style="border-right:0px solid white;"  align="left">工厂设备科长（安环内容）:{{printList.gcsbkzOpinion}}</td>
                <td style="position: relative;border-left:0px solid white;">
                  <span style="position: absolute;left:-100px;bottom:1px;">签字：{{printList.gcsbkz}}</span>
                  <span style="position: absolute;right:10px;bottom:1px;">日期：{{printList.gcsbkzDate!=null?printList.gcsbkzDate.substring(0,10):''}}</span></td>
              </tr>
              <tr style="height:80px;">
                <td colspan="2" style="border-right:0px solid white;" align="left">资产部安环科意见：{{printList.zcbahkOpinion}}</td>
                <td style="position: relative;border-left:0px solid white;">
                  <span style="position: absolute;left:-100px;bottom:1px;">签字：{{printList.zcbahk}}&nbsp;&nbsp;</span>
                  <span style="position: absolute;right:10px;bottom:1px;">日期：{{printList.zcbahkDate!=null?printList.zcbahkDate.substring(0,10):''}}</span>
                </td>
              </tr>
              <tr style="height:60px;">
                <td>工厂厂长意见</td>
                <td colspan="2" style="border-right:0px solid white;">{{printList.gcczOpinion}}</td>
                <td style="position: relative;border-left:0px solid white;">
                  <span style="position: absolute;left:-100px;bottom:1px;">签字：{{printList.gccz}}&nbsp;&nbsp;</span>
                  <span style="position: absolute;right:10px;bottom:1px;">日期：{{printList.gcczDate!=null?printList.gcczDate.substring(0,10):''}}</span>
                </td>
              </tr>
              <tr style="height:60px;">
                <td>设备副总意见</td>
                <td colspan="2" style="border-right:0px solid white;">{{printList.sbfzOpinion}}</td>
                <td style="position: relative;border-left:0px solid white;">
                  <span style="position: absolute;left:-100px;bottom:1px;">签字：{{printList.sbfz}}</span>
                  <span style="position: absolute;right:10px;bottom:1px;">日期：{{printList.sbfzDate!=null?printList.sbfzDate.substring(0,10):''}}</span>
                </td>
              </tr>
              <tr style="height:60px;">
                <td>事业部总经理</td>
                <td colspan="2" style="border-right:0px solid white;">{{printList.sybzjlOpinion}}</td>
                <td style="position: relative;border-left:0px solid white;">
                  <span style="position: absolute;left:-100px;bottom:1px;">签字：{{printList.sybzjl}}</span>
                  <span style="position: absolute;right:10px;bottom:1px;">日期：{{printList.sybzjlDate!=null?printList.sybzjlDate.substring(0,10):''}}</span>
                </td>
              </tr>
              <tr style="height:30px;border-bottom:0px solid white;">
                <td rowspan="4" align="left">技改办意见</td>
                <td align="left" colspan="3" style="border-bottom:0px solid white;"></td>
              </tr>
              <tr style="height:20px;border-bottom:0px solid white;border-top:0px solid white;">
                <td align="left" colspan="3" style="border-bottom:0px solid white;border-top:0px solid white;">
                  1、设备备案完成时间：{{printList.equipReformCompleteTime!=null?printList.equipReformCompleteTime.substring(0,10):''}}</td>
              </tr>
              <tr style="height:20px;border-bottom:0px solid white;border-top:0px solid white;">
                <td align="left" colspan="3" style="border-bottom:0px solid white;border-top:0px solid white;">
                  2、确认是否立项：是：（<span v-if="setupShow">√</span>）否：（<span v-if="!setupShow">√</span> ）</td>
              </tr>
              <tr style="height:20px;border-top:0px solid white;">
                <td align="right" colspan="3" style="border-top:0px solid white;">
                  <span>技改办签字：{{printList.jtjgb}}&nbsp;&nbsp;</span>
                  <span>日期：{{printList.jtjgbDate!=null?printList.jtjgbDate.substring(0,10):''}}&nbsp;</span>
                </td>
              </tr>
              <tr style="height:60px;">
                <td>董事长审批</td>
                <td colspan="2" style="border-right:0px solid white;">{{printList.dszOpinion}}</td>
                <td style="position: relative;border-left:0px solid white;">
                  <span style="position: absolute;left:-100px;bottom:1px;">签字：{{printList.dsz}}</span>
                  <span style="position: absolute;right:10px;bottom:1px;">日期：{{printList.dszDate!=null?printList.dszDate.substring(0,10):''}}</span></td>
              </tr>
            </tbody>
          </table>
				</div>
			</el-dialog>
    </el-container>
  </div>
</template>

<script>
import { fetchDoneList, fetchDetail, fetchPrint } from '@/api/equipRemould/remouldApply'
import { commonOptions1, fileList, recordList, processChart } from '@/api/common/common'
import { baseUrl } from '@/api/common/fileBaseUrl'
export default {
  name: 'remouldHaveDone',
  data() {
    return {
      activeName: 'first',
      printShow: false,
      chartData: null, // 流程图
      // 弹框组
      dialogFormVisible: false,
      printDialogVisible: false, // 打印
      // 审核状态下拉框
      options: commonOptions1,
      // 表格数据
      tableData: [],
      tableKey: 0,
      listLoading: false,
      total: null,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        reformCode: undefined,
        projectInsideName: undefined,
        projectOutsideName: undefined,
        auditingType: undefined
      },
      // 文件数据
      projectProgrammeFileList: [],
      sbgzFileData: [],
      documentWordCode: undefined, // 单据编号
      processInstanceId: undefined, // 流程实例id

      // 流转记录
      recordShow: false,
      recordData: null,
      printList: {
        dszDate: null,
        requirementCompleteTime: null,
        equipReformCompleteTime: null
      },
      equipReformSuggest: false,
      setupShow: false,
      temp: {
        id: undefined,
        reformCode: undefined, // 编号
        applyDate: undefined, // 申请备案时间
        projectInsideName: undefined, // 项目内部名称
        projectLeaderName: undefined, // 项目组长名
        projectLeaderWorkNumber: undefined, // 项目组长
        projectOutsideName: undefined, // 项目外部名称
        requirementCompleteTime: undefined, // 要求完成时间
        technologyLeaderName: undefined, // 技术负责人名
        technologyLeaderWorkNumber: undefined, // 技术负责人
        equipReformSuggest: undefined,
        setupProject: undefined, // 是否立项
        equipReformCompleteTime: null,
        equipReformContentList: [{
          fixedAssetCode: null,
          // equipCode: null,
          equipmentName: null,
          factoryCode: null,
          factoryName: null,
          divisionCode: null,
          divisionName: null,
          reformContent: null,
          estimateMoney: 0
        }], // 主要内容集合
        totalMoney: 0, // 总计金额
        // 附件列表
        list: []
      },
      checkList: [],
      dialogStatus: '',
      textMap: {
        detail: '查看设备改造项目备案通知书'
      },
      rules: {
        projectLeaderName: [{ required: true, message: '请选择项目组长', trigger: 'change' }],
        technologyLeaderName: [{ required: true, message: '请选择技术负责人', trigger: 'change' }],
        requirementCompleteTime: [{ required: true, message: '请输入项目要求完成时间', trigger: 'change' }],
        equipReformSuggest: [{ required: true, message: '请选择设备改造建议', trigger: 'change' }],
        fixedAssetCode: [{ required: true, message: '请输入固定资产编号', trigger: 'change' }],
        equipmentName: [{ required: true, message: '请输入设备名称', trigger: 'change' }],
        reformContent: [{ required: true, message: '请输入改造内容', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.tableData = []
      // this.total = 0
      this.listLoading = true
      fetchDoneList(this.listQuery).then(response => {
        if (response.data.code === 200) {
          if (response.data.data != null && response.data.data.list != null) {
            this.tableData = response.data.data.list
            for (var i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].auditingType == 2) {
                this.tableData[i].auditingType = '审核中'
              } else if (this.tableData[i].auditingType == 3) {
                this.tableData[i].auditingType = '审核通过'
              } else if (this.tableData[i].auditingType == 4) {
                this.tableData[i].auditingType = '审核不通过'
              } else if (this.tableData[i].auditingType == 5) {
                this.tableData[i].auditingType = '关闭流程'
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
      this.printShow = false
      this.dialogFormVisible = true
      const id = row.id
      this.documentWordCode = row.reformCode // 单据编号
      if (row.auditingType == '审核通过') {
        this.printShow = true
      }
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
      const find = {
        moduleType: '19', // 模块类别
        attachmentCode: 'SBGZBADFJ', // 附件编码
        documentWordCode: this.documentWordCode // 单据编码
      }
      fileList(find).then(response => {
        this.sbgzFileData = response.data.data
      })
      const find1 = {
        moduleType: '19', // 模块类别
        attachmentCode: 'SBGZBADGZFAFJ', // 附件编码
        documentWordCode: this.documentWordCode // 单据编码
      }
      fileList(find1).then(response => {
        this.projectProgrammeFileList = response.data.data
      })
    },
    // 文件下载
    fileDown(row) {
      window.location.href = row.filePath + '?attname=' + row.fileName
    },
    // 打印
    printData() {
      const params = {
        reformId: this.temp.id,
        processInstanceId: this.processInstanceId
      }
      fetchPrint(params).then(response => {
        if (response.data.code == 200) {
          this.printList = response.data.data
          if (response.data.data.equipReformSuggest == '内部改造') {
            this.equipReformSuggest = true
          } else {
            this.equipReformSuggest = false
          }
          if (response.data.data.setupProject == '是') {
            this.setupShow = true
          } else if ((response.data.data.setupProject == '否')) {
            this.setupShow = false
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
      this.printDialogVisible = true
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
  font-size: 14px;
  text-align: left;
}
#printTest table tbody tr{
  font-size:14px;
  border-bottom: 1px solid black;
  height: 35px;
  text-align: left;
}
#printTest table tbody td{
  width:25%;
  border: 1px solid black;
}
#pic{
  width: 100%;
}
#printTest .el-table,
#printTest .el-table thead{
  color:black;
}
#printTest .el-table__header thead th{
  border-right: 1px solid black;
}
#printTest .el-table__header thead th,
#printTest .el-table__body tbody td{
  border-left: 1px solid white
}
#pic{
  width: 100%;
}
</style>