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
            <el-table-column align="center" label="项目内部名称" >
              <template slot-scope="scope">
                <span>{{scope.row.projectInsideName}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="项目组长" >
              <template slot-scope="scope">
                <span>{{scope.row.projectLeaderName}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="使用部门">
              <template slot-scope="scope">
                <span>{{scope.row.dctualOrgName}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="项目外部名称" >
              <template slot-scope="scope">
                <span>{{scope.row.projectOutsideName}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="技术负责人" >
              <template slot-scope="scope">
                <span>{{scope.row.technologyLeaderName}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="项目要求完成时间" width="140px">
              <template slot-scope="scope">
                <span>{{scope.row.requirementCompleteTime.substring(0,10)}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="设备采购建议" >
              <template slot-scope="scope">
                <span>{{scope.row.equipBuySuggest}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="审核状态" >
              <template slot-scope="scope">
                <span>{{scope.row.auditingType}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="当前处理人" >
              <template slot-scope="scope">
                <span>{{scope.row.assignee}}</span>
            </template>
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
            <el-button type="primary" @click="printData" v-if="printShow">打印</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
       <!-- 打印 -->
			<el-dialog title="备案通知打印预览" :close-on-click-modal="false" :visible.sync="printDialogVisible" width="810px">
        <el-button type="primary" @click="printDialogVisible = false">返回</el-button>
        <el-button type="success" v-print="'#printTest'"><svg-icon icon-class="print"/>打印</el-button>
				<div id="printTest">
					<table border= "0">
            <caption style="font-size: 24px;padding-bottom:10px;font-weight:800">设备采购项目备案通知书</caption>
            <thead>
              <tr>
                <th colspan="3">公司名称(付款主体)：{{printList.orgName}}</th>
                <th>编号：{{printList.recordCode}}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td align="left">项目内部名称</td>
                <td>{{printList.projectInsideName}}</td>
                <td rowspan="2" align="center">项目组长（负责人）</td>
                <td rowspan="2">{{printList.projectLeaderName}}</td>
              </tr>
              <tr>
                <td align="left">设备实际使用公司</td>
                <td>{{printList.companyName}}</td>
              </tr>
              <tr>
                <td align="left">设备实际使用工厂</td>
                <td>{{printList.factoryName}}</td>
                <td align="center">设备实际使用部门</td>
                <td>{{printList.dctualOrgName}}</td>
              </tr>
              <tr>
                <td align="left">项目外部名称</td>
                <td>{{printList.projectOutsideName}}</td>
                <td align="center">技术负责人</td>
                <td>{{printList.technologyLeaderName}}</td>
              </tr>
              <tr>
                <td align="left">使用地址</td>
                <td>{{printList.useAddress}}</td>
                <td align="center">项目要求完成时间</td>
                <td>{{printList.requirementCompleteTime!=null?printList.requirementCompleteTime.substring(0,10):''}}</td>
              </tr>
              <tr>
                <td align="left">设备采购建议</td>
                <td  align="left" colspan="3">内部制造（<span v-if="suggestShow">√</span>）外部制造（<span v-if="!suggestShow">√</span> ）</td>
              </tr>
              <tr style="height:90px;border-bottom:0px solid white;">
                <td rowspan="2" align="center">主要内容（备案部门填写）</td>
                <td align="left" colspan="3" style="border-bottom:0px solid white;">
                  <span>主要内容及规模：
                    <span style="font-size:14px;" v-for="(item,index) in printList.equipRecordNumList" :key="item.id">
                      {{index + 1 }}、<u>设备名称</u>：{{item.equipName}}，<u>设备数量</u>：{{item.equipNum}}，<u>主要内容</u>：{{item.primaryCoverage}}；<br /></span>
                  </span>
                </td>
              </tr>
              <!-- <tr style="border-top:0px solid white;border-bottom:0px solid white;">
                <td style="border-top:0px solid white;border-bottom:0px solid white;" colspan="3" align="left">设备改造（填上原设备编码）{{printList.equipReform}}</td>
              </tr> -->
              <tr style="border-top:0px solid white;">
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
                <td rowspan="4" align="left">项目总资产（技改办预算）</td>
                <td align="left" colspan="3" style="border-bottom:0px solid white;">1、预算{{printList.budget}}</td>
              </tr>
              <tr style="height:20px;border-bottom:0px solid white;border-top:0px solid white;">
                <td align="left" colspan="3" style="border-bottom:0px solid white;border-top:0px solid white;">
                  2、设备采购完成时间{{printList.equipBuyCompleteTime!=null?printList.equipBuyCompleteTime.substring(0,10):''}}</td>
              </tr>
              <tr style="height:20px;border-bottom:0px solid white;border-top:0px solid white;">
                <td align="left" colspan="3" style="border-bottom:0px solid white;border-top:0px solid white;">
                  3、确认是否立项：是：（<span v-if="setupShow">√</span>）否：（<span v-if="!setupShow">√</span> ）</td>
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
              <tr style="border-bottom:0px solid white;border-left:0px solid white;border-right:0px solid white;font-size:16px;">
                <td colspan="4" align="left" style="border-bottom:0px solid white;border-left:0px solid white;border-right:0px solid white;">
                  说明：1、项目内部名称：技改项目立项名称；项目外部名称：技改项目申报名称，由技改办填写。<br/>    
                  2、需要立项解决的项目，技改办在董事长批准后，必须在1周内完成组长确认，并进行立项。<br/> 
                  2.1在公司年度经营计划之内的项目工作，必须立项；<br/> 
                  2.2新工艺技术或者新设备第一次在公司内应用的，投资额5万以上，必须立项；<br/> 
                  2.3可以在全公司进行推广，具有明显经济效益的，必须立项；<br/> 
                  2.4其他项目总投资5万元以上，参与部门3个以上，可以申请立项。<br/> 
                </td>
              </tr>
            </tbody>
          </table>
				</div>
			</el-dialog>
    </el-container>
  </div>
</template>

<script>
import { fetchDoneList, fetchDetail, fetchPrint } from '@/api/equipRecord/equipRecordNotice'
import { commonOptions1, fileList, recordList, processChart } from '@/api/common/common'
import { baseUrl } from '@/api/common/fileBaseUrl'
export default {
  name: 'equipHaveDone',
  data() {
    return {
      activeName: 'first',
      // 判断新增、编辑、删除按钮权限显示隐藏
      addShow: false,
      editShow: false,
      deleteShow: false,
      printShow: false,
      chartData: null, // 流程图
      // 弹框组
      dialogFormVisible: false,
      printDialogVisible: false, // 打印
      // 日期选择
      requirementCompleteTime: '',
      equipBuyCompleteTime: '',

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
        recordCode: undefined,
        projectInsideName: undefined,
        auditingType: undefined
      },

      // 文件数据
      xmfaFileData: [],
      fileData: [],
      documentWordCode: undefined, // 单据编号
      processInstanceId: undefined, // 流程实例id

      // 流转记录
      recordShow: false,
      recordData: null,
      printList: {
        xmzgbmrDate: null,
        gcsbkzDate: null,
        zcbahkDate: null,
        gcczDate: null,
        sbfzDate: null,
        jtjgbDate: null,
        sybzjlDate: null,
        dszDate: null,
        zcbDate: null,
        requirementCompleteTime: null,
        equipBuyCompleteTime: null
      },
      suggestShow: false,
      setupShow: false,
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
      this.documentWordCode = row.recordCode // 单据编号
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
    // 打印
    printData() {
      const params = {
        recordId: this.temp.id,
        processInstanceId: this.processInstanceId
      }
      fetchPrint(params).then(response => {
        if (response.data.code == 200) {
          this.printList = response.data.data
          if (response.data.data.equipBuySuggest == '内部制造') {
            this.suggestShow = true
          } else {
            this.suggestShow = false
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
/* #printTest{
  margin-top:10px;
} */
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

