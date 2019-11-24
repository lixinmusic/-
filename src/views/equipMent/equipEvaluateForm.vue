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
            <el-form-item label="验收情况" prop="acceptanceType">
              <el-radio v-model="listQuery.acceptanceType" label="0">验收不通过</el-radio>
              <el-radio v-model="listQuery.acceptanceType" label="1">验收通过</el-radio>	
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
              <span class="look-detail" @click="assetCodeDetail(scope.row)">{{scope.row.fixedAssetCode}}</span>
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
          <el-table-column prop="" align="center" label="审核状态">
            <template slot-scope="scope">
              <span>{{scope.row.auditingType}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="140px" fixed="right">
            <template slot-scope="scope">
              <el-button title="编辑" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)" 
               :disabled="scope.row.editDisabled?true:false"></el-button>
              <el-button title="转办" type="success" icon="el-icon-share" size="mini"  @click="changeHandle(scope.row)"
               :disabled="scope.row.changeDisabled?true:false"></el-button>
              <!-- <el-button title="删除" type="danger" icon="el-icon-delete" size="mini" @click="deleteBtn(scope.row)" 
                :disabled="scope.row.deleteDisabled?true:false"></el-button> -->
              <!-- <el-button title="重新验收" type="danger" icon="el-icon-refresh" size="mini" @click="refreshBtn(scope.row)" 
                :disabled="scope.row.refreshDisabled?true:false"></el-button>
              <el-button title="生成新设备验收单" type="primary" size="mini" icon="el-icon-document" @click="createAcceptance(scope.row)"
                :disabled="scope.row.createDisabled?true:false"></el-button> -->
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
      <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" :visible.sync="dialogFormVisible" width="60%" v-loading="listLoading" v-dialogDrag> 
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
                       :disabled="!chooseShow">
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
                       :disabled="!chooseShow">
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
                       :disabled="!chooseShow"> 
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="验收情况" prop="acceptanceSituation">
                    <el-radio v-model="temp.acceptanceSituation" label="1" :disabled="!chooseShow" @change="changeType()">验收通过</el-radio>
                    <el-radio v-model="temp.acceptanceSituation" label="0" :disabled="!chooseShow" @change="changeType()">验收不通过</el-radio>	
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="不通过原因" prop="noPassReason">
                    <el-input v-model="temp.noPassReason" type="textarea" style="margin-bottom:5px" :disabled="!noPassReasonShow"></el-input>
                    <!-- <el-button type="primary" size="mini">确认</el-button>
                    <el-button type="primary" size="mini">打印</el-button> -->
                  </el-form-item>
                </el-col>
              </el-row>
              
              <el-row>
                <el-col :span="1" style="width:1px;color:red;padding:8px;">
                  <span>*</span>
                </el-col>
                <el-col :span="9">
                  <el-form-item label="新设备评价表附件" prop="fileData" label-width="130px">
                    <input id="uploadImg" type="file" @change="fileUpload" v-if="chooseShow">
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
                  <el-button title="删除" type="danger" icon="el-icon-delete" size="mini"  @click="pjFileDelete(scope.row)" v-if="chooseShow"></el-button>
                  <!-- <el-button v-if="dialogStatus=='update'" title="删除1" type="danger" icon="el-icon-delete" size="mini"  @click="updatefileDelete(scope.row)"></el-button> -->
                </template>
              </el-table-column>
            </el-table>
            <el-row>
              <el-col :span="10">
                <el-form label-position="left" label-width="150px">
                <el-form-item label="设备检修记录单附件" prop="jxfileData">
                  <input id="uploadImg1" type="file" @change="fileUpload1" v-if="chooseShow">
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
                  <el-button title="删除" type="danger" icon="el-icon-delete" size="mini"  @click="jxFileDelete(scope.row)" v-if="chooseShow"></el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 发函记录 -->
            <el-row>
              <el-col :span="10">
                <el-form label-position="left" label-width="150px">
                <el-form-item label="发函记录" prop="fhfileData">
                  <input id="uploadImg2" type="file" @change="fileUpload2" v-if="chooseShow1">
                </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-table :data="fhfileData"
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
                  <el-button title="删除" type="danger" icon="el-icon-delete" size="mini"  @click="fhFileDelete(scope.row)" v-if="chooseShow"></el-button>
                </template>
              </el-table-column>
            </el-table>


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
      <!-- 生成新设备验收单 -->
      <el-dialog title="提示" :close-on-click-modal="false" :visible.sync="centerDialogVisible" width="30%">
        <span>已生成新设备验收单，请到新设备验收单页面处理</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="centerDialogVisible=false">确定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="固定资产编号" :close-on-click-modal="false" :visible.sync="tableDialogVisible" width="80%">
        <el-table :data="assetCodeList" height="200" v-loading="listLoading" 
          border fit highlight-current style="width: 100%;margin-top:10px;min-height:500px" 
          :header-cell-style="{background:'oldlace'}">
          <el-table-column prop="documentWordCode" align="center" label="单据编码">
          </el-table-column>
          <el-table-column prop="equipmentName" align="center" label="设备名称">
          </el-table-column>
          <el-table-column prop="supplier" align="center" label="供应商">
          </el-table-column>
          <el-table-column prop="useCompanyName" align="center" label="使用公司">
          </el-table-column>
          <el-table-column prop="useFactoryName" align="center" label="使用工厂">
          </el-table-column>
          <el-table-column prop="useWorkshopName" align="center" label="使用车间">
          </el-table-column>
          <el-table-column prop="outFactoryTime" align="center" label="出厂日期">
          </el-table-column>
          <el-table-column prop="typeSpecification" align="center" label="型号规格">
          </el-table-column>
          <el-table-column prop="fixedAssetCode" align="center" label="固定资产编号">
          </el-table-column>
          <el-table-column prop="inFactoryTime" align="center" label="进厂日期">
          </el-table-column>
          <el-table-column prop="outFactoryCode" align="center" label="出厂编号">
          </el-table-column>
          <el-table-column prop="evaluateTime" align="center" label="评价日期">
          </el-table-column>
          <el-table-column prop="acceptanceSituationName" align="center" label="验收情况">
          </el-table-column>
          <el-table-column prop="auditingType" align="center" label="审核状态">
            <template slot-scope="scope">
              <span>{{scope.row.auditingType}}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination background 
          @size-change="handleSizeChange2" 
          @current-change="handleCurrentChange2" 
          :current-page="listQuery2.pageNum" 
          :page-sizes="[5,10,15, 20]" 
          :page-size="listQuery2.pageSize" 
          layout="total, sizes, prev, pager, next, jumper" 
          :total="total2">
          </el-pagination>
        </div>
      </el-dialog>
      <!-- 选择人员 -->
      <el-dialog width="60%" :close-on-click-modal="false" title="请选择转办接收人员" :visible.sync="innerVisiblePerson" append-to-body v-dialogDrag>
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
import { fetchList, getDetail, updateQualityInfo, delById, createAcceptanceReport, createArticle, fetchAssetCodeList } from '@/api/equipMent/equipEvaluateForm/equipEvaluateForm'
import { commonOptions, recordList, uploadlist, deleteFile, fileList, deleteFileById, insertFile, getCurrentUser, processChart, getProxyOrgList, fetchChooseTree, choosePersonList, transferReplace } from '@/api/common/common'
import { fetchButton } from '@/api/common/button'
import { baseUrl } from '@/api/common/fileBaseUrl'
export default {
  name: 'equipEvaluateForm',
  data() {
    return {
      // 代办审核
      changeOrgVisible: undefined,
      proxyOrgList: [],
      comName: undefined,
      comCode: undefined,
      userCode: undefined, // 用户编码
      chartData: null, // 流程图
      // 表格数据
      tableKey: 0,
      listLoading: false,
      tableData: [],
      total: null,
      value01: undefined,
      // 审核状态下拉框
      options: [{
        value: '1',
        label: '未提交'
      }, {
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
        auditingType: undefined
      },
      // 弹框表格数据
      tableDialogVisible: false,
      assetCodeList: [],
      total2: null,
      listQuery2: {
        pageNum: 1,
        pageSize: 10,
        fixedAssetCode: undefined
      },
      // 选择人员
      defaultProps1: {
        children: 'children',
        label: 'orgFullName'
      },
      innerVisiblePerson: false,
      listQuery1: {
        pageNum: 1,
        pageSize: 1000,
        perName: undefined,
        workNumber: undefined
      },
      personOrgData: [],
      orgListData: [],
      treeLoading: false,
      changeFormIds: undefined,
      id: undefined,
      isCreateAcceptance: undefined, // 是否生成新设备验收单
      isReAcceptance: undefined, // 是否验收
      temp: {
        id: undefined,
        equId: undefined,
        documentWordCode: undefined,

        acceptanceSituation: undefined,
        auditingType: undefined,

        equipmentName: undefined,
        evaluateTime: undefined,

        fixedAssetCode: undefined,
        inFactoryTime: undefined,

        outFactoryCode: undefined,
        outFactoryTime: undefined,

        supplier: undefined,
        typeSpecification: undefined,

        useCompanyName: undefined,
        useFactoryName: undefined,
        useWorkshopName: undefined,
        list: [],
        proxyOrgCode: undefined, // 代理组织
        proxyOrgName: undefined
      },
      dialogFormVisible: false,
      centerDialogVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '重新验收',
        detail: '查看新设备评价表'
      },
      // 文件数据
      chooseShow: true, // 选择按钮
      chooseShow1:false,
      noPassReasonShow: false,
      fileData: [], // 设备质量
      jxfileData: [], // 设备检修
      fhfileData: [],
      fileDataAll: [],
      documentWordCode: undefined, // 单据编码
      userId: undefined, // 用户id
      processInstanceId: undefined, // 流程实例id

      // 流转记录
      activeName: 'first',
      recordShow: false,
      recordData: null,
      rules: {
        // documentWordCode: [{ required: true, message: '请输入单据编码', trigger: 'change' }],
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
    this.getList()
  },
  methods: {
    // ******* 文件预览**********
    handlePreview(row) {
      var url = baseUrl + 'onlinePreview?url=' + encodeURIComponent(row.filePath)
      var winHeight = window.document.documentElement.clientHeight - 10
      window.open(url, '_blank', 'height=' + winHeight + ',top=80,left=80,toolbar=no, menubar=no, scrollbars=yes, resizable=yes')
    },
    // ******* 文件预览结束**********
    renderContent(h, { node, data, store }) {
      return (
        <span>
          <span title={node.label}>{node.label}</span>
        </span>)
    },
    // 切换验收情况
    changeType(){
        if(this.temp.acceptanceSituation == 0){
            this.noPassReasonShow = true
        }else{
            this.noPassReasonShow = false
            this.temp.noPassReason = ''
        }
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        if (response.data.code === 200) {
          if (response.data.data != null && response.data.data.list != null) {
            this.tableData = response.data.data.list
            for (var i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].auditingType == 1) {
                this.tableData[i].auditingType = '未提交'

                // this.tableData[i].refreshDisabled = true
                // this.tableData[i].createDisabled = true
              } else if (this.tableData[i].auditingType == 2) {
                this.tableData[i].auditingType = '审核中'

                this.tableData[i].editDisabled = true
                this.tableData[i].changeDisabled = true
                // this.tableData[i].deleteDisabled = true
                // this.tableData[i].refreshDisabled = true
                // this.tableData[i].createDisabled = true
              } else if (this.tableData[i].auditingType == 3) {
                this.tableData[i].auditingType = '审核通过'

                this.tableData[i].editDisabled = true
                this.tableData[i].changeDisabled = true
                // this.tableData[i].deleteDisabled = true
                // if (this.tableData[i].acceptanceSituation == 0) { // 验收不通过
                //   this.tableData[i].createDisabled = true
                //   if (this.tableData[i].isReAcceptance == 1) { // 已重新验收
                //     this.tableData[i].refreshDisabled = true
                //   } else if (this.tableData[i].isReAcceptance == 0) { // 未重新验收
                //     this.tableData[i].refreshDisabled = false
                //   }
                // } else if (this.tableData[i].acceptanceSituation == 1) { // 验收通过
                //   this.tableData[i].refreshDisabled = true
                //   if (this.tableData[i].isCreateAcceptance == 1) {
                //     this.tableData[i].createDisabled = true
                //   } else if (this.tableData[i].isCreateAcceptance == 0) {
                //     this.tableData[i].createDisabled = false
                //   }
                // }
              } else if (this.tableData[i].auditingType == 4) {
                this.tableData[i].auditingType = '审核不通过'

                this.tableData[i].editDisabled = true
                this.tableData[i].changeDisabled = true
                // this.tableData[i].deleteDisabled = true
                // this.tableData[i].refreshDisabled = true
                // this.tableData[i].createDisabled = true
              } else if (this.tableData[i].auditingType == 5) {
                this.tableData[i].auditingType = '流程关闭'

                this.tableData[i].editDisabled = true
                this.tableData[i].changeDisabled = true
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
      this.recordShow = true
      this.chooseShow = false
      this.chooseShow1 = false
      this.noPassReasonShow = false;
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
    // 编辑
    handleUpdate(row) {
      this.activeName = 'first'
      this.dialogStatus = 'update'
      this.recordShow = false
      this.chooseShow = true
      this.chooseShow1 = false
      this.noPassReasonShow = false
      this.dialogFormVisible = true
      this.documentWordCode = row.documentWordCode
      const id = row.id
      // 根据id获取详情
      getDetail(id).then(response => {
        this.temp = Object.assign({}, response.data.data)
        if (this.temp.acceptanceSituation != null) {
          this.temp.acceptanceSituation = response.data.data.acceptanceSituation.toString()
          if(this.temp.acceptanceSituation == 0){
              this.noPassReasonShow = true
          }else{
              this.noPassReasonShow = false
          }
        }
      })
      this.getUser()
      this.getFileList() // 获取文件
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 获取当前用户信息
    getUser() {
      getCurrentUser().then(response => {
        if (response.data.code == 200) {
          this.userId = response.data.data.id
          // this.userCode = response.data.data.userCode
          // getProxyOrgList(this.userCode).then(response => {
          //   if (response.data.code == 200) {
          //     this.comName = response.data.data.orgName
          //     this.comCode = response.data.data.orgCode
          //     if (this.proxyOrgList != null) {
          //       this.proxyOrgList = response.data.data.list
          //     }
          //   }
          // })
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
        this.updataSubmit()
      } else {
        this.updataSubmit()
      }
      this.changeOrgVisible = false
    },
    updataSubmit() {
      this.listLoading = true
      const tempData = {
        id: this.temp.id,
        acceptanceSituation: this.temp.acceptanceSituation,
        auditingType: 2,
        evaluateTime: this.temp.evaluateTime,
        inFactoryTime: this.temp.inFactoryTime,
        outFactoryTime: this.temp.outFactoryTime,
        noPassReason: this.temp.noPassReason
        // proxyOrgCode: this.temp.proxyOrgCode, // 代理组织
        // proxyOrgName: this.temp.proxyOrgName
      }
      updateQualityInfo(tempData).then(response => {
        if (response.data.code == 200) {
          this.dialogFormVisible = false
          this.getList()
          this.$message({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
          this.listLoading = false
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
    // 修改保存
    updateSaveData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.fileData.length == 0) {
            this.$notify({
              title: '警告',
              message: '请上传新设备评价表附件',
              type: 'warning',
              duration: 2000
            })
            return
          }
          // v1.4.0验收不通过发起人须填写不通过原因
          if(this.temp.noPassReason == null || this.temp.noPassReason == undefined){
              this.temp.noPassReason = ''
          }
          if(this.temp.acceptanceSituation == 0 && this.temp.noPassReason == ''){
              this.$notify({
              title: '警告',
              message: '请填写不通过原因',
              type: 'warning',
              duration: 2000
            })
            return
          }
          this.listLoading = true
          const tempData = {
            id: this.temp.id,
            acceptanceSituation: this.temp.acceptanceSituation,
            auditingType: 1,
            evaluateTime: this.temp.evaluateTime,
            inFactoryTime: this.temp.inFactoryTime,
            outFactoryTime: this.temp.outFactoryTime,
            noPassReason: this.temp.noPassReason
          }
          updateQualityInfo(tempData).then(response => {
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
          if (this.fileData.length == 0) {
            this.$notify({
              title: '警告',
              message: '请上传新设备评价表附件',
              type: 'warning',
              duration: 2000
            })
            return
          }
          // v1.4.0验收不通过发起人须填写不通过原因
          if(this.temp.noPassReason == null || this.temp.noPassReason == undefined){
              this.temp.noPassReason = ''
          }
          if(this.temp.acceptanceSituation == 0 && this.temp.noPassReason == ''){
              this.$notify({
              title: '警告',
              message: '请填写不通过原因',
              type: 'warning',
              duration: 2000
            })
            return
          }
          this.updataSubmit()
          // if (this.proxyOrgList.length != 0) {
          //   this.changeOrgVisible = true
          // } else {
          //   this.temp.proxyOrgCode = this.comCode
          //   this.updataSubmit()
          // }
        }
      })
    },
    resetTemp() {
      // 附件列表
      this.fileData = []
      this.jxfileData = []
      this.fileDataAll = []
      this.userId = undefined
      this.documentWordCode = undefined
    },
    // 重新验收
    refreshBtn(row) {
      const id = row.id
      // 根据id获取详情
      getDetail(id).then(response => {
        this.temp = Object.assign({}, response.data.data)
        this.temp.list = []
        this.temp.acceptanceSituation = undefined
        this.temp.evaluateTime = undefined
        this.temp.inFactoryTime = undefined
        this.temp.outFactoryTime = undefined
        this.temp.documentWordCode = undefined
      })
      this.resetTemp()
      this.activeName = 'first'
      this.dialogStatus = 'create'
      this.chooseShow = true
      this.recordShow = false
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 重新验收保存
    saveData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.fileData.length == 0) {
            this.$notify({
              title: '警告',
              message: '请上传新设备评价表附件',
              type: 'warning',
              duration: 2000
            })
            return
          }
          this.listLoading = true
          this.fileDataAll = this.fileData
          this.jxfileData.forEach(item => {
            this.fileDataAll.push(item)
          })
          this.temp.list = this.fileDataAll
          this.temp.auditingType = 1
          createArticle(this.temp).then(response => {
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
    // 重新验收提交
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.fileData.length == 0) {
            this.$notify({
              title: '警告',
              message: '请上传新设备评价表附件',
              type: 'warning',
              duration: 2000
            })
            return
          }
          this.listLoading = true
          this.fileDataAll = this.fileData
          this.jxfileData.forEach(item => {
            this.fileDataAll.push(item)
          })
          this.temp.list = this.fileDataAll
          this.temp.auditingType = 2
          createArticle(this.temp).then(response => {
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
      // 发函记录
      const find2 = {
        moduleType: '5', // 模块类别
        attachmentCode: 'XSBPJFHJLFJ', // 附件编码
        documentWordCode: this.documentWordCode // 单据编码
      }
      fileList(find2).then(response => {
        this.fhfileData = response.data.data
      })
    },
    // 文件上传
    fileUpload(e) {
      const file = e.target.files[0]
      const fileData1 = {
        attachmentCode: 'XSBPJBFJ',
        code: this.documentWordCode,
        moduleType: '5',
        fileName: undefined, // 文件名称
        filePath: undefined, // 文件URL
        node: '开始',
        fileUrl: undefined,
        userId: this.userId,
        id: undefined
      }
      if (file != null) {
        this.listLoading = true
        const param = new FormData() // 创建form对象
        param.append('file', file, file.name) // 通过append向form对象添加数据
        fileData1.fileName = file.name
        uploadlist(param).then(resp => { // 调用上传接口
          if (resp.data.code == 200) {
            fileData1.filePath = resp.data.data.remoteFilename
            fileData1.fileUrl = resp.data.data.fileUrl
            // 编辑时新增文件
            if (this.dialogStatus == 'update') {
              insertFile(fileData1).then(response => {
                if (response.data.code == 200) {
                  fileData1.id = response.data.data
                  this.$message({
                    title: '成功',
                    message: '上传成功',
                    type: 'success',
                    duration: 2000
                  })
                  this.fileData.push(fileData1)
                }
              })
            } else if (this.dialogStatus == 'create') {
              this.fileData.push(fileData1)
              this.$message({
                title: '成功',
                message: '上传成功',
                type: 'success',
                duration: 2000
              })
            }
            setTimeout(() => {
              this.listLoading = false
            }, 1 * 500)
          } else if (resp.data.code === 402) {
            this.$notify({
              title: '警告',
              message: resp.data.msg,
              type: 'warning',
              duration: 2000
            })
          } else {
            this.$notify({
              title: '警告',
              message: '上传失败',
              type: 'warning',
              duration: 2000
            })
          }
          this.listLoading = false
          const fileInput = document.getElementById('uploadImg')
          fileInput.value = ''
        })
      }
    },
    // 文件上传设备检修
    fileUpload1(e) {
      const file = e.target.files[0]
      const fileData1 = {
        attachmentCode: 'SBJXJLFJ',
        code: this.documentWordCode,
        moduleType: '5',
        fileName: undefined,
        filePath: undefined, // 文件URL
        node: '开始',
        fileUrl: undefined,
        userId: this.userId,
        id: undefined
      }
      if (file != null) {
        this.listLoading = true
        const param = new FormData() // 创建form对象
        param.append('file', file, file.name) // 通过append向form对象添加数据
        fileData1.fileName = file.name
        uploadlist(param).then(resp => { // 调用上传接口
          if (resp.data.code == 200) {
            fileData1.filePath = resp.data.data.remoteFilename
            fileData1.fileUrl = resp.data.data.fileUrl
            // 编辑新增文件
            if (this.dialogStatus == 'update') {
              insertFile(fileData1).then(response => {
                if (response.data.code == 200) {
                  fileData1.id = response.data.data
                  this.$message({
                    title: '成功',
                    message: '上传成功',
                    type: 'success',
                    duration: 2000
                  })
                  this.jxfileData.push(fileData1)
                }
              })
            } else if (this.dialogStatus == 'create') {
              this.jxfileData.push(fileData1)
              this.$message({
                title: '成功',
                message: '上传成功',
                type: 'success',
                duration: 2000
              })
            }
            setTimeout(() => {
              this.listLoading = false
            }, 1 * 500)
          } else if (resp.data.code === 402) {
            this.$notify({
              title: '警告',
              message: resp.data.msg,
              type: 'warning',
              duration: 2000
            })
          } else {
            this.$notify({
              title: '警告',
              message: '上传失败',
              type: 'warning',
              duration: 2000
            })
          }
          this.listLoading = false
          const fileInput1 = document.getElementById('uploadImg1')
          fileInput1.value = ''
        })
      }
    },
    // 发函记录文件上传
    fileUpload2(e) {
      const file = e.target.files[0]
      const fileData1 = {
        attachmentCode: 'XSBPJFHJLFJ',
        code: this.documentWordCode,
        moduleType: '5',
        fileName: undefined,
        filePath: undefined, // 文件URL
        node: '开始',
        fileUrl: undefined,
        userId: this.userId,
        id: undefined
      }
      if (file != null) {
        this.listLoading = true
        const param = new FormData() // 创建form对象
        param.append('file', file, file.name) // 通过append向form对象添加数据
        fileData1.fileName = file.name
        uploadlist(param).then(resp => { // 调用上传接口
          if (resp.data.code == 200) {
            fileData1.filePath = resp.data.data.remoteFilename
            fileData1.fileUrl = resp.data.data.fileUrl
            // 编辑新增文件
            if (this.dialogStatus == 'update') {
              insertFile(fileData1).then(response => {
                if (response.data.code == 200) {
                  fileData1.id = response.data.data
                  this.$message({
                    title: '成功',
                    message: '上传成功',
                    type: 'success',
                    duration: 2000
                  })
                  this.fhfileData.push(fileData1)
                }
              })
            } else if (this.dialogStatus == 'create') {
              this.fhfileData.push(fileData1)
              this.$message({
                title: '成功',
                message: '上传成功',
                type: 'success',
                duration: 2000
              })
            }
            setTimeout(() => {
              this.listLoading = false
            }, 1 * 500)
          } else if (resp.data.code === 402) {
            this.$notify({
              title: '警告',
              message: resp.data.msg,
              type: 'warning',
              duration: 2000
            })
          } else {
            this.$notify({
              title: '警告',
              message: '上传失败',
              type: 'warning',
              duration: 2000
            })
          }
          this.listLoading = false
          const fileInput2 = document.getElementById('uploadImg2')
          fileInput2.value = ''
        })
      }
    },
    // 文件下载
    fileDown(row) {
      if (row.fileUrl !== undefined) {
        window.location.href = row.fileUrl + '?attname=' + row.fileName
      } else {
        window.location.href = row.filePath + '?attname=' + row.fileName
      }
    },
    // 评价文件删除
    pjFileDelete(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 新增时 删除
        if (this.dialogStatus == 'create') {
          const find1 = {
            fileName: row.filePath
          }
          deleteFile(find1).then(response => {
            if (response.data.code === 200) {
              const index = this.fileData.indexOf(row)
              this.fileData.splice(index, 1)
              this.$message({
                title: '成功',
                type: 'success',
                message: '删除成功!',
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
        } else if (this.dialogStatus == 'update') {
          const id = row.id
          deleteFileById(id).then(response => {
            if (response.data.code === 200) {
              const index = this.fileData.indexOf(row)
              this.fileData.splice(index, 1)
              this.$message({
                title: '成功',
                type: 'success',
                message: '删除成功!',
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 检修文件删除
    jxFileDelete(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 新增时 删除
        if (this.dialogStatus == 'create') {
          const find1 = {
            fileName: row.filePath
          }
          deleteFile(find1).then(response => {
            if (response.data.code === 200) {
              const index = this.jxfileData.indexOf(row)
              this.jxfileData.splice(index, 1)
              this.$message({
                title: '成功',
                type: 'success',
                message: '删除成功!',
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
        } else if (this.dialogStatus == 'update') {
          const id = row.id
          deleteFileById(id).then(response => {
            if (response.data.code === 200) {
              const index = this.jxfileData.indexOf(row)
              this.jxfileData.splice(index, 1)
              this.$message({
                title: '成功',
                type: 'success',
                message: '删除成功!',
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 发函记录文件删除
    fhFileDelete(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 新增时 删除
        if (this.dialogStatus == 'create') {
          const find1 = {
            fileName: row.filePath
          }
          deleteFile(find1).then(response => {
            if (response.data.code === 200) {
              const index = this.fhfileData.indexOf(row)
              this.fhfileData.splice(index, 1)
              this.$message({
                title: '成功',
                type: 'success',
                message: '删除成功!',
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
        } else if (this.dialogStatus == 'update') {
          const id = row.id
          deleteFileById(id).then(response => {
            if (response.data.code === 200) {
              const index = this.fhfileData.indexOf(row)
              this.fhfileData.splice(index, 1)
              this.$message({
                title: '成功',
                type: 'success',
                message: '删除成功!',
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 生成新设备验收单
    createAcceptance(row) {
      const id = row.id
      createAcceptanceReport(id).then(response => {
        if (response.data.code === 200) {
          this.centerDialogVisible = true
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
    assetCodeDetail(row) {
      this.listQuery2 = {
        pageNum: 1,
        pageSize: 10,
        fixedAssetCode: row.fixedAssetCode
      }
      this.tableDialogVisible = true
      this.getAssetCodeList()
    },
    getAssetCodeList() {
      this.listLoading = true
      fetchAssetCodeList(this.listQuery2).then(response => {
        if (response.data.code === 200) {
          if (response.data.data != null && response.data.data.list != null) {
            this.assetCodeList = response.data.data.list
            for (var i = 0; i < this.assetCodeList.length; i++) {
              if (this.assetCodeList[i].auditingType == 1) {
                this.assetCodeList[i].auditingType = '未提交'
              } else if (this.tableData[i].auditingType == 2) {
                this.assetCodeList[i].auditingType = '审核中'
              } else if (this.assetCodeList[i].auditingType == 3) {
                this.assetCodeList[i].auditingType = '审核通过'
              } else if (this.assetCodeList[i].auditingType == 4) {
                this.assetCodeList[i].auditingType = '审核不通过'
              }
            }
            this.total2 = response.data.data.total
          }
        } else {
          this.$notify({
            title: '警告',
            message: response.data.msg,
            type: 'warning',
            duration: 2000
          })
        }
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 500)
      })
    },
    // 分页
    handleSizeChange2(val) {
      this.listQuery2.pageSize = val
      this.getAssetCodeList()
    },
    handleCurrentChange2(val) {
      this.listQuery2.pageNum = val
      this.getAssetCodeList()
    },
    // tabs 点击事件
    handleClick(tab, event) {
      this.recordData = null
      this.chartData = null
      if (this.processInstanceId != null && this.processInstanceId != '') {
        if (tab.label == '流转记录') {
          this.listLoading = true
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
      // this.changeFormIds = []
      // this.changeFormIds.push(row.id)
      this.changeFormIds = row.id
      this.choosePerson()
    },
    choosePerson() {
      this.listQuery1 = {
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
      choosePersonList(this.listQuery1).then(response => {
        this.orgListData = response.data.data.list
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 1000)
      })
    },
    // 转办人员提交
    chooseReplace(row) {
      const finds = {
        type: 2,
        ids: this.changeFormIds,
        workNumber: row.workNumber
      }
      transferReplace(finds).then(response => {
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
  #pic{
    width: 100%;
  }
</style>

