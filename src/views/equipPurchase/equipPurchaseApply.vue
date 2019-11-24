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
            <el-form-item label="使用部门">
              <el-input class="filter-item input" placeholder="请输入使用部门" v-model="listQuery.useOrgName">
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
        <el-button class="filter-item" @click="handleCreate" type="primary" v-if="addShow">新增</el-button>
        <el-table :key='tableKey' :data="tableData" height="200" row-key="id" v-loading="listLoading" border fit highlight-current 
          style="width: 100%;margin-top:10px;min-height:500px" :header-cell-style="{background:'oldlace'}">
          <el-table-column prop="purchaseApplicationCode" align="center" label="单据编号" width="160px" >
            <template slot-scope="scope">
              <span class="look-detail" @click="handleDetail(scope.row)">{{scope.row.purchaseApplicationCode}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="equipTypeName" align="center" label="设备名称" >
            <template slot-scope="scope">
              <span>{{scope.row.equipTypeName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="useOrgName" align="center" label="使用部门">
            <template slot-scope="scope">
              <span>{{scope.row.useOrgName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="equipNum" align="center" label="台数" >
            <template slot-scope="scope">
              <span>{{scope.row.equipNum}}</span>
            </template>
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
            <template slot-scope="scope">
              <span>{{scope.row.equipBuySuggest}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="auditingType" align="center" label="审核状态" >
              <template slot-scope="scope">
                <span>{{scope.row.auditingType}}</span>
              </template>
          </el-table-column>
          <el-table-column prop="orgName" align="center" label="当前处理人" >
            <template slot-scope="scope">
              <span>{{scope.row.assignee}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="140px">
            <template slot-scope="scope">
              <el-button title="编辑" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-if="editShow" 
              :disabled="scope.row.editDisabled?true:false"></el-button>
              <el-button title="删除" type="danger" icon="el-icon-delete" size="mini"  @click="deleteBtn(scope.row)" v-if="deleteShow"
               :disabled="scope.row.deleteDisabled?true:false"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <div class="pagination-container">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[5,10,15, 20]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </el-footer>
      <!-- 新增编辑弹框 -->
      <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" :visible.sync="dialogFormVisible" width="60%" v-dialogDrag v-loading="listLoading"> 
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="表单信息" name="first">
            <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="110px">
              <el-form-item>
                <span class="equip-title">设备采购申请单</span>
                <span class="equip-title1" v-if="temp.recordCode!= null">根据编号为{{temp.recordCode}}的备案单生成</span>
              </el-form-item>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="单据编号" prop="purchaseApplicationCode">
                    <el-input v-model="temp.purchaseApplicationCode" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="equipShow">
                  <el-form-item label="设备名称" prop="equipTypeName">
                    <el-select v-model="temp.equipTypeName" clearable placeholder="请选择设备" @change='equipChange'>
                      <el-option
                        v-for="item in equipRecordNumList"
                        :key="item.equipCode"
                        :label="item.equipName"
                        :value="item.equipName">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="9" style="padding-right:0px;" v-if="!equipShow">
                  <el-form-item label="设备名称" prop="equipTypeName">
                    <el-input v-model="temp.equipTypeName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="3" style="padding-left:0px;" v-if="!equipShow">
                  <el-button type="primary" @click="handleChooseEquip" :disabled="!chooseShow">选择</el-button>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="10" style="padding-right:0px;">
                  <el-form-item label="使用公司" prop="useCompanyName">
                    <el-input v-model="temp.useCompanyName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2" style="padding:0px;">
                  <el-button type="primary" @click="changeCompany" :disabled="!chooseShow">选择</el-button>
                </el-col>
                <el-col :span="9" style="padding-right:0px;">
                  <el-form-item label="使用工厂" prop="useFactoryName">
                    <el-input v-model="temp.useFactoryName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2" style="padding:0px;">
                  <el-button type="primary" @click="changeFactory" :disabled="!chooseShow">选择</el-button>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="10" style="padding-right:0px;">
                  <el-form-item label="使用部门" prop="useOrgName">
                    <el-input v-model="temp.useOrgName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2" style="padding-left:0px;">
                  <el-button type="primary" @click="changeDivision" :disabled="!chooseShow">选择</el-button>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="台数" prop="equipNum">
                    <el-input type="text" v-model="temp.equipNum" maxlength="5" oninput="value=value.replace(/[^\d]/g,'')" :disabled="!chooseShow"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="申请时间" prop="applicationTime">
                    <!-- <el-input v-model="temp.applicationTime" disabled></el-input> -->
                    <el-date-picker v-model="temp.applicationTime" type="date" disabled style="width:100%">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="要求交货时间" prop="requirementDeliveryTime">
                    <el-date-picker style="width:100%"
                      v-model="temp.requirementDeliveryTime"
                      type="date"
                      placeholder="选择时间"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      
                      :picker-options="pickerOptions0" :disabled="!chooseShow">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="申请原因" prop="applicationReason">
                  <el-input v-model="temp.applicationReason" maxlength="200" :disabled="!chooseShow"></el-input>
              </el-form-item>
              <el-form-item label="具体要求" prop="detailRequirement">
                <el-input v-model="temp.detailRequirement" maxlength="200" :disabled="!chooseShow"></el-input>
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
                <el-col :span="10" v-if="chooseShow">
                  <el-form-item label="技术资料" prop="fileData">
                    <input id="uploadImg" type="file" @change="fileUpload">
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
                  <el-button v-if="dialogStatus=='create'" title="删除" type="danger" icon="el-icon-delete" size="mini"  @click="fileDelete(scope.row)"></el-button>
                  <el-button v-if="dialogStatus=='update'" title="删除1" type="danger" icon="el-icon-delete" size="mini"  @click="updatefileDelete(scope.row)"></el-button>
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
        <el-form class="formDw">
          <el-form-item>
            <el-button @click="dialogFormVisible = false" type="primary">返回</el-button>
            <el-button v-if="dialogStatus=='create'" type="primary" @click="saveData">保存</el-button>
            <el-button v-if="dialogStatus=='update'" type="primary" @click="updateSaveData">保存</el-button>
            <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">提交</el-button>
            <el-button v-if="dialogStatus=='update'" type="primary" @click="updateData">提交</el-button>
            <el-button v-if="dialogStatus=='detail'&&printShow" type="primary" @click="printData">打印</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog width="30%" :close-on-click-modal="false" title="选择设备名称" :visible.sync="innerVisibleUseBranch1" append-to-body>
        <el-container>
          <el-tree 
            :data="branchEquipData" 
            :props="defaultPropsBranch1" 
            ref="treeEquip"
            show-checkbox 
            node-key="categoryCode"
            check-strictly
            @check-change="handleChangeEquip">
          </el-tree>
        </el-container>
        <div slot="footer" class="dialog-footer">
          <el-button @click="innerVisibleUseBranch1 = false">取消</el-button>
          <el-button @click="handleClickVisibleBranch1" type="primary">确定</el-button>
        </div>
      </el-dialog>
      <!-- 选择公司/工厂 -->
      <el-dialog width="40%" :title="textMap1[dialogStatus1]" :visible.sync="companyVisible" append-to-body :close-on-click-modal="false" v-dialogDrag >
        <el-container>
          <el-aside width="500px">
            <span style="margin-left:20px;color:red">{{getCompanyName}}</span>
            <el-tree 
              :data="companyData" 
              :props="defaultProps1" 
              ref="comtree"
              show-checkbox
              node-key='orgCode' 
              check-strictly
              @check-change="handleChange1"></el-tree>
          </el-aside>
        </el-container>
        <div slot="footer" class="dialog-footer">
          <el-button @click="companyVisible = false" type="default">取消</el-button>
          <el-button v-if="dialogStatus1=='company'" type="primary" @click="handleClickCompany">确定</el-button>
          <el-button v-if="dialogStatus1=='factory'" type="primary" @click="handleClickFactory">确定</el-button>
        </div>
      </el-dialog>
      <!-- 选择使用部门 -->
      <el-dialog width="50%" title="选择使用部门" :visible.sync="divisionVisible" append-to-body :close-on-click-modal="false" v-dialogDrag >
        <el-container>
          <el-aside width="500px">
            <span style="margin-left:20px;color:red">{{getOrgName}}</span>
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
			<el-dialog title="设备采购申请单打印预览" :close-on-click-modal="false" :visible.sync="printDialogVisible" width="60%" v-loading="printLoading" v-dialogDrag>
        <el-button type="primary" @click="printDialogVisible = false">返回</el-button>
        <el-button type="success" v-print="'#printTest'"><svg-icon icon-class="print"/>打印</el-button>
				<div id="printTest">
					<table border= "0" style="border-right:1px solid black">
            <caption style="font-size: 24px;padding-bottom:20px; font-weight:800">设备采购申请单</caption>
            <thead>
              <tr style="border-right: 1px solid white;">
                <th colspan="3"><span v-if="temp.recordCode!= null">备案单号：{{printList.recordCode}}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>采购单号：{{printList.purchaseApplicationCode}}</span></th>
                <th v-if="temp.recordCode!= null" style="text-align: right;">{{printList.ctime!=null?printList.ctime.substring(0,10):''}}&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="border-right: 1px solid black;">设备名称</td>
                <td colspan="3">{{printList.equipTypeName}}</td>
              </tr>
              <tr>
                <td style="border-right: 1px solid black;">使用公司</td>
                <td style="border-right: 1px solid black;">{{printList.useCompanyName}}</td>
                <td style="border-right: 1px solid black;">使用工厂</td>
                <td>{{printList.useFactoryName}}</td>
              </tr>
              <tr>
                <td style="border-right: 1px solid black;">使用部门</td>
                <td style="border-right: 1px solid black;">{{printList.useOrgName}}</td>
                <td style="border-right: 1px solid black;">台数</td>
                <td>{{printList.equipNum}}</td>
              </tr>
              <tr>
                <td style="border-right: 1px solid black;">申请时间</td>
                <td style="border-right: 1px solid black;">{{printList.applicationTime!=null?printList.applicationTime.substring(0,10):''}}</td>
                <td style="border-right: 1px solid black;">要求交货时间</td>
                <td>{{printList.requirementDeliveryTime!=null?printList.requirementDeliveryTime.substring(0,10):''}}</td>
              </tr>
              <tr style="border-bottom:0px solid white;">
                <td colspan="4">
                  申请原因：<span style="font-size:14px;">{{printList.applicationReason}}</span>
                </td>
              </tr>
              <tr style="border-top:0px solid white;border-bottom:0px solid white;height:90px;">
                <td colspan="4" style="position: relative;">
                  <span style="position: absolute;left:1px;top:1px;">
                    具体要求：<span style="font-size:14px;">{{printList.detailRequirement}}</span>
                  </span>
                </td>
              </tr>
              <tr style="border-top:0px solid white;border-bottom:0px solid white;">
                <td colspan="4" align="right">
                  <span>使用部门签字：{{printList.sybumr}}</span>
                  <span>日期：{{printList.sybumrDate!=null?printList.sybumrDate.substring(0,10):''}}</span>
                </td>
              </tr>
              <tr style="border-bottom:0px solid white;">
                <td colspan="4" style="height:60px;position: relative;">
                  <span style="position: absolute;left:1px;top:5px;">
                    技术项目负责人意见（附技术要求）：<span style="font-size:14px;">{{printList.jsfzrOpinion}}</span>
                  </span>
                </td>
              </tr>
              <tr style="border-top:0px solid white;">
                <td colspan="4" align="right">
                  <span>技术负责人：{{printList.jsfzr}}</span>
                  <span>日期：{{printList.jsfzrDate!=null?printList.jsfzrDate.substring(0,10):''}}</span></td>
              </tr>
              <tr style="border-bottom:0px solid white;">
                <td colspan="4" style="height:60px;">工厂厂长意见：{{printList.gcczOpinion}}</td>
              </tr>
              <tr style="border-top:0px solid white;">
                <td colspan="4" align="right"><span>工厂厂长：{{printList.gccz}}</span>
                <span>日期：{{printList.gcczDate!=null?printList.gcczDate.substring(0,10):''}}</span></td>
              </tr>
              <tr style="border-bottom:0px solid white;">
                <td colspan="4" style="height:60px;">事业部意见：{{printList.sbfzOpinion}}</td>
              </tr>
              <tr style="border-top:0px solid white;">
                <td colspan="4" align="right"><span>设备副总：{{printList.sbfz}}</span>
                <span>日期：{{printList.sbfzDate!=null?printList.sbfzDate.substring(0,10):''}}</span></td>
              </tr>
              <tr style="border-bottom:0px solid white;">
                <td colspan="4" style="height:60px;">资产部初审意见：{{printList.zcbOpinion}}</td>
              </tr>
              <tr style="border-top:0px solid white;">
                <td colspan="4" align="right"><span>签字：{{printList.zcb}}</span>
                <span>日期：{{printList.zcbDate!=null?printList.zcbDate.substring(0,10):''}}</span></td>
              </tr>
              <tr style="border-bottom:0px solid white;">
                <td colspan="4" style="height:60px;">董事长审批：{{printList.dszOpinion}}</td>
              </tr>
              <tr style="border-top:0px solid white;">
                <td colspan="4" align="right"><span>签字：{{printList.dsz}}</span>
                <span>日期：{{printList.dszDate!=null?printList.dszDate.substring(0,10):''}}</span></td>
              </tr>
            </tbody>
          </table>
				</div>
			</el-dialog>
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
    </el-container>
  </div>
</template>

<script>
import { fetchList, delById, getDetail, fetchDetail, createArticle, saveArticle, updateArticleSubmit, updateSaveArticle,
  fetchPrint, fetchEquiplist } from '@/api/equipPurchase/equipPurchaseApply'
import { commonOptions, fetchComTree, fetchComByCode, fetchOrgTree, fetchEquipName,
  uploadlist, deleteFile, fileList, deleteFileById, insertFile, recordList, getCurrentUser, processChart, getProxyOrgList } from '@/api/common/common'
import { fetchButton } from '@/api/common/button'
import { menuList } from '@/store/modules/permission'
import { baseUrl } from '@/api/common/fileBaseUrl'
import { validateNumber1, validateNumber2 } from '@/utils/validate'
import elDragDialog from '@/directive/el-dragDialog'
export default {
  name: 'equipPurchaseApply',
  directives: { elDragDialog },
  data() {
    const validateNumber = (rule, value, callback) => {
      if (!validateNumber1(value)) {
        callback(new Error('请输入正确格式的台数'))
      } else {
        callback()
      }
    }
    const validateNumberJE = (rule, value, callback) => {
      if (value != undefined || value != null) {
        if (!validateNumber2(value)) {
          callback(new Error('请输入正确格式的设备金额'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      // 代办审核
      ifSave: false,
      changeOrgVisible: undefined,
      proxyOrgList: [],
      comName: undefined,
      comCode: undefined,
      userCode: undefined, // 用户编码
      activeName: 'first',
      // 判断新增、编辑、删除按钮权限显示隐藏
      menuCode: undefined,
      addShow: false,
      editShow: false,
      deleteShow: false,
      chooseShow: true, // 选择按钮
      chartData: null, // 流程图
      // 公司（工厂）
      n: 0,
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
      // 选择设备名称
      defaultPropsBranch1: {
        children: 'children',
        label: 'categoryName'
      },
      j: 0,
      innerVisibleUseBranch1: false,
      branchEquipData: [],
      getEquipTypeName: '',
      getEquipTypeCode: '',

      // 要求交货时间
      requirementDeliveryTime: '',
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      // 审核状态下拉框
      options: commonOptions,
      auditingType: '',
      // 表格数据
      tableKey: 0,
      listLoading: false,
      tableData: [],
      total: null,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        purchaseApplicationCode: undefined,
        equipTypeName: undefined,
        useOrgName: undefined,
        auditingType: null
      },
      // 文件数据
      fileData: [],
      documentWordCode: undefined, // 单据编码
      userId: undefined, // 用户id
      processInstanceId: undefined, // 流程实例id
      // 流转记录
      recordShow: false,
      recordData: null,
      temp: {
        applicationReason: undefined, // 申请原因
        applicationTime: undefined, // 申请时间
        detailRequirement: undefined, // 具体要求
        equipBuySuggest: undefined, // 设备采购建议
        equipNum: undefined, // 设备台数
        equipTypeCode: undefined,
        equipTypeName: undefined,
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
        // 附件列表
        list: [],
        recordCode: null,
        proxyOrgCode: undefined, // 代理组织
        proxyOrgName: undefined
      },
      equipShow: false, // 设备名称是否选择
      equipRecordNumList: [], // 备案单--设备名称数组
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增',
        detail: '查看设备采购申请单'
      },
      printLoading: false,
      printDialogVisible: false, // 打印
      printList: {
        sybumrDate: null,
        jsfzrDate: null,
        gcczDate: null,
        sbfzDate: null,
        dszDate: null,
        zcbDate: null,
        applicationTime: null,
        ctime: null,
        requirementDeliveryTime: null
      },
      printShow: false,
      rules: {
        // purchaseApplicationCode: [{ required: true, message: '请输入单据编号', trigger: 'change' }],
        equipTypeName: [{ required: true, message: '请选择设备名称', trigger: 'change' }],
        useCompanyName: [{ required: true, message: '请选择使用公司', trigger: 'change' }],
        useFactoryName: [{ required: true, message: '请选择使用工厂', trigger: 'change' }],
        useOrgName: [{ required: true, message: '请选择使用部门', trigger: 'change' }],

        equipNum: [{ required: true, trigger: 'change', validator: validateNumber }],
        // applicationTime: [{ required: true, message: '请输入申请时间', trigger: 'change' }],
        requirementDeliveryTime: [{ required: true, message: '请选择要求交货时间', trigger: 'change' }],
        applicationReason: [{ required: true, message: '请输入申请原因', trigger: 'change' }],
        detailRequirement: [{ required: true, message: '请输入具体要求', trigger: 'change' }],
        // equipBuySuggest: [{ required: true, message: '请选择设备采购建议', trigger: 'change' }]
        purchaseSum: [{ required: false, trigger: 'change', validator: validateNumberJE }]
      }
    }
  },
  created() {
    this.getList()
    this.getButton()
  },
  methods: {
    getButton() {
      menuList.forEach(item => {
        item.children.forEach(e => {
          if (e.name == 'equipPurchaseApply') {
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
      this.tableData = []
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        if (response.data.code === 200) {
          if (response.data.data != null && response.data.data.list != null) {
            this.tableData = response.data.data.list
            for (var i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].auditingType == 2) {
                this.tableData[i].auditingType = '审核中'
                this.tableData[i].editDisabled = true
                this.tableData[i].deleteDisabled = true
              } else if (this.tableData[i].auditingType == 1) {
                this.tableData[i].auditingType = '未提交'
              } else if (this.tableData[i].auditingType == 3) {
                this.tableData[i].auditingType = '审核通过'
                this.tableData[i].editDisabled = true
                this.tableData[i].deleteDisabled = true
              } else if (this.tableData[i].auditingType == 4) {
                this.tableData[i].auditingType = '审核不通过'
                this.tableData[i].deleteDisabled = true
                this.tableData[i].editDisabled = true
              } else if (this.tableData[i].auditingType == 5) {
                this.tableData[i].auditingType = '流程关闭'
                this.tableData[i].deleteDisabled = true
                this.tableData[i].editDisabled = true
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
    // 设置公司/工厂组织树状图单选
    handleChange1(data, checked, node) {
      this.n++
      if (this.n % 2 == 0) {
        if (checked) {
          this.$refs.comtree.setCheckedNodes([])
          this.$refs.comtree.setCheckedNodes([data])
          // 交叉点击节点
        } else {
          this.$refs.comtree.setCheckedNodes([])
          // 点击已经选中的节点，置空
        }
      }
    },
    // 选择使用公司
    changeCompany() {
      this.n = 0
      this.dialogStatus1 = 'company'
      this.getCompanyCode = undefined
      this.getCompanyName = undefined
      this.companyData = []
      fetchComTree().then(response => {
        if (response.data.code === 200) {
          this.companyData.push(response.data.data)
        }
      })
      this.companyVisible = true
    },
    // 选择公司确认
    handleClickCompany() {
      this.treeData1 = this.$refs.comtree.getCheckedNodes()
      this.getCompanyCode = this.treeData1[0].orgCode
      this.getCompanyName = this.treeData1[0].orgFullName
      this.temp.useCompanyName = this.getCompanyName
      this.temp.useCompanyCode = this.getCompanyCode
      this.temp.useFactoryName = undefined
      this.temp.useFactoryCode = undefined
      this.companyVisible = false
    },
    // 选择使用工厂
    changeFactory() {
      this.n = 0
      this.dialogStatus1 = 'factory'
      this.getCompanyCode = undefined
      this.getCompanyName = undefined
      this.companyData = []
      const find = {
        orgCode: this.temp.useCompanyCode
      }
      fetchComByCode(find).then(response => {
        if (response.data.code === 200) {
          this.companyData.push(response.data.data)
          for (var i = 0; i < this.companyData.length; i++) {
            if (this.companyData[i].orgType == '部门') {
              this.companyData[i].disabled = true
            }
            if (this.companyData[i].children != null) {
              for (var j = 0; j < this.companyData[i].children.length; j++) {
                const child = this.companyData[i].children[j]
                if (child.orgType == '部门') {
                  child.disabled = true
                }
                if (child.children !== null) {
                  for (var p = 0; p < child.children.length; p++) {
                    const child1 = child.children[p]
                    if (child1.orgType == '部门') {
                      child1.disabled = true
                    }
                    if (child1.children != null) {
                      for (var o = 0; o < child1.children.length; o++) {
                        const child2 = child1.children[o]
                        if (child2.orgType == '部门') {
                          child2.disabled = true
                        }
                        if (child2.children != null) {
                          for (var q = 0; q < child2.children.length; q++) {
                            const child3 = child2.children[q]
                            if (child3.orgType == '部门') {
                              child3.disabled = true
                            }
                            if (child3.children != null) {
                              for (var n = 0; n < child3.children.length; n++) {
                                const child4 = child3.children[n]
                                if (child4.orgType == '部门') {
                                  child4.disabled = true
                                }
                                if (child4.children != null) {
                                  for (var m = 0; m < child4.children.length; m++) {
                                    const child5 = child4.children[n]
                                    if (child5.orgType == '部门') {
                                      child5.disabled = true
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
                }
              }
            }
          }
        }
      })
      this.companyVisible = true
    },
    // 选择工厂确认
    handleClickFactory() {
      this.treeData1 = this.$refs.comtree.getCheckedNodes()
      this.getCompanyCode = this.treeData1[0].orgCode
      this.getCompanyName = this.treeData1[0].orgFullName
      this.temp.useFactoryName = this.getCompanyName
      this.temp.useFactoryCode = this.getCompanyCode
      this.temp.useOrgName = undefined
      this.companyVisible = false
    },
    // 选择使用部门
    changeDivision() {
      this.getOrgCode = undefined
      this.getOrgName = undefined
      this.orgData = []
      const find1 = {
        orgCode: this.temp.useFactoryCode
      }
      fetchOrgTree(find1).then(response => {
        if (response.data.code === 200) {
          this.orgData = response.data.data
          for (var i = 0; i < this.orgData.length; i++) {
            if (this.orgData[i].orgType == '公司') {
              this.orgData[i].disabled = true
            }
            if (this.orgData[i].children !== null) {
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
      // 获取部门被选择的节点
      this.treeData = this.$refs.tree.getCheckedNodes()
      this.getOrgCode = this.treeData[0].orgCode
      this.getOrgName = this.treeData[0].orgFullName
      this.temp.useOrgName = this.getOrgName
      this.temp.useOrgCode = this.getOrgCode
      this.divisionVisible = false
    },
    // 设备名称选择
    handleChooseEquip() {
      this.innerVisibleUseBranch1 = true
      fetchEquipName().then(response => {
        this.branchEquipData = []
        this.branchEquipData = response.data.data
        for (var i = 0; i < this.branchEquipData.length; i++) {
          this.branchEquipData[i].disabled = true
          for (var j = 0; j < this.branchEquipData[i].children.length; j++) {
            const child = this.branchEquipData[i].children[j]
            child.disabled = true
          }
        }
      })
    },
    // 设备名称树被选中
    handleChangeEquip(data, checked, node) {
      this.j++
      if (this.j % 2 == 0) {
        if (checked) {
          this.$refs.treeEquip.setCheckedNodes([])
          this.$refs.treeEquip.setCheckedNodes([data])
          // 交叉点击节点
        } else {
          this.$refs.treeEquip.setCheckedNodes([])
          // 点击已经选中的节点，置空
        }
      }
    },
    // 设备名称点击确认
    handleClickVisibleBranch1() {
      this.treeData1 = this.$refs.treeEquip.getCheckedNodes()
      this.temp.equipTypeName = this.treeData1[0].categoryName
      this.temp.equipTypeCode = this.treeData1[0].categoryCode
      this.innerVisibleUseBranch1 = false
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
    resetTemp() {
      this.temp = {
        applicationReason: undefined,
        applicationTime: undefined,
        detailRequirement: undefined,
        equipBuySuggest: undefined,
        equipNum: undefined,
        equipTypeCode: undefined,
        equipTypeName: undefined,
        id: undefined,
        requirementDeliveryTime: undefined,
        useCompanyName: undefined, // 使用公司
        useCompanyCode: undefined,
        useFactoryName: undefined, // 使用工厂
        useFactoryCode: undefined,
        useOrgCode: undefined, // 使用部门
        useOrgName: undefined,
        purchaseSum: undefined, // 设备金额
        purchaseApplicationCode: undefined, // 采购申请单号
        // 附件列表
        list: [],
        recordCode: null,
        proxyOrgCode: undefined, // 代理组织
        proxyOrgName: undefined
      }
      this.fileData = []
      this.userId = undefined
      this.documentWordCode = undefined
      this.getCompanyName = ''
      this.getCompanyCode = ''
      this.getOrgName = ''
      this.getOrgCode = ''
      this.getEquipTypeCode = ''
      this.getEquipTypeName = ''
    },
    // 新增
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.chooseShow = true
      this.recordShow = false
      this.activeName = 'first'
      this.equipShow = false
      this.getUser()
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
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
      this.temp.list = this.fileData
      createArticle(this.temp).then(response => {
        if (response.data.code == 200) {
          this.dialogFormVisible = false
          this.getList()
          setTimeout(() => {
            this.listLoading = false
          }, 1 * 500)
          this.$message({
            title: '成功',
            message: '添加成功',
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
    // 新增保存请求
    createSave() {
      this.listLoading = true
      this.temp.list = this.fileData
      saveArticle(this.temp).then(response => {
        if (response.data.code == 200) {
          // this.tableData.unshift(this.temp)
          this.dialogFormVisible = false
          this.getList()
          setTimeout(() => {
            this.listLoading = false
          }, 1 * 500)
          this.$message({
            title: '成功',
            message: '添加成功',
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
      this.listLoading = true
      this.dialogStatus = 'update'
      this.chooseShow = true
      this.recordShow = false
      this.activeName = 'first'
      this.documentWordCode = row.purchaseApplicationCode
      const id = row.id
      // 获取详情
      getDetail(id).then(response => {
        this.temp = Object.assign({}, response.data.data)
        if (this.temp.recordCode == null) {
          this.equipShow = false
        } else {
          this.equipShow = true
          const params = {
            recordCode: this.temp.recordCode
          }
          fetchEquiplist(params).then(response => {
            this.equipRecordNumList = response.data.data
          })
        }
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 500)
      })
      this.dialogFormVisible = true
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
    // 设备名称改变
    equipChange() {
      console.log(this.temp.equipTypeName)
      this.equipRecordNumList.forEach(item => {
        if (item.equipName == this.temp.equipTypeName) {
          this.temp.equipTypeCode = item.equipCode
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
      this.temp.list = this.fileData
      const tempData = Object.assign({}, this.temp)
      updateArticleSubmit(tempData).then(response => {
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
    },
    // 修改保存
    updateSaveData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.listLoading = true
          this.temp.list = this.fileData
          const tempData = Object.assign({}, this.temp)
          updateSaveArticle(tempData).then(response => {
            if (response.data.code == 200) {
              // for (const v of this.tableData) {
              //   if (v.id === this.temp.id) {
              //     const index = this.tableData.indexOf(v)
              //     this.tableData.splice(index, 1, this.temp)
              //     break
              //   }
              // }
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
    // 根据编号查看
    handleDetail(row) {
      this.activeName = 'first'
      this.dialogStatus = 'detail'
      this.chooseShow = false
      this.recordShow = true
      this.printShow = false
      this.equipShow = false
      this.dialogFormVisible = true
      this.documentWordCode = row.purchaseApplicationCode
      if (row.auditingType == '审核通过') {
        this.printShow = true
      }
      const id = row.id
      fetchDetail(id).then(response => {
        if (response.data.code == 200) {
          this.temp = Object.assign({}, response.data.data)
        } else {
          this.$notify({
            title: '警告',
            message: response.data.msg,
            type: 'warning',
            duration: 2000
          })
        }
      })
      this.getFileList() // 获取文件
      // 流转记录
      this.processInstanceId = row.processInstanceId
    },
    // 删除
    deleteBtn(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
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
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
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
    // 文件上传
    fileUpload(e) {
      const file = e.target.files[0]
      const fileData1 = {
        attachmentCode: 'CGSQDFJ',
        code: this.documentWordCode,
        moduleType: '2',
        fileName: undefined,
        filePath: undefined, // 文件URL
        node: '开始',
        fileNameSC: undefined, // 文件名称
        fileUrl: undefined,
        userId: this.userId
      }
      if (file != null) {
        this.listLoading = true
        const param = new FormData() // 创建form对象
        param.append('file', file, file.name) // 通过append向form对象添加数据
        fileData1.fileName = file.name
        uploadlist(param).then(resp => { // 调用上传接口
          if (resp.data.code === 200) {
            fileData1.fileNameSC = resp.data.data.remoteFilename
            fileData1.filePath = resp.data.data.remoteFilename
            fileData1.fileUrl = resp.data.data.fileUrl
            // 新增文件
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
                  this.getFileList() // 获取文件
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
    // 文件下载
    fileDown(row) {
      if (this.dialogStatus == 'create') {
        window.location.href = row.fileUrl + '?attname=' + row.fileName
      } else {
        window.location.href = row.filePath + '?attname=' + row.fileName
      }
    },
    // 文件删除
    fileDelete(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const find1 = {
          fileName: row.fileNameSC
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 编辑文件删除
    updatefileDelete(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 打印
    printData() {
      this.printDialogVisible = true
      this.printLoading = true
      const params = {
        purchaseId: this.temp.id,
        processInstanceId: this.processInstanceId
      }
      fetchPrint(params).then(response => {
        if (response.data.code == 200) {
          this.printList = response.data.data
        } else {
          this.$notify({
            title: '警告',
            message: response.data.msg,
            type: 'warning',
            duration: 2000
          })
        }
        setTimeout(() => {
          this.printLoading = false
        }, 1 * 500)
      })
    },
    // tabs 点击事件
    handleClick(tab, event) {
      this.recordData = null
      this.chartData = null
      if (this.processInstanceId != null && this.processInstanceId != '') {
        if (tab.label == '流转记录') {
          // 请求流转记录
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
  height: 50px;
  text-align: left;
}
#printTest table tbody td{
  width:25%;
  /* border: 1px solid black; */
}
#printTest table tbody td span{
  margin-right:20px;
}
#pic{
  width: 100%;
}
</style>

