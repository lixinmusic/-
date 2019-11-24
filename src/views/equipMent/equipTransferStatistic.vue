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
            <el-form-item label="移交时间">
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
            <el-form-item label="申请时间">
              <el-date-picker
                v-model="value02"
                type="daterange"
                unlink-panels
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                clearable  @change="searchChange02()">
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
        <el-table :key='tableKey' :data="tableData" height="200" row-key="id" v-loading="listLoading" 
          border fit highlight-current style="width: 100%;margin-top:10px;min-height:500px" 
          :header-cell-style="{background:'oldlace'}">
          <el-table-column align="center" label="单据编码">
            <template slot-scope="scope">
              <span class="look-detail" @click="handleDetail(scope.row)">{{scope.row.documentWordCode}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="equipmentName" align="center" label="设备名称">
          </el-table-column>
          <el-table-column prop="typeSpecification" align="center" label="型号规格">
          </el-table-column>
          <el-table-column prop="supplier" align="center" label="供应商">
          </el-table-column>
          <el-table-column prop="fixedAssetCode" align="center" label="固定资产编号">
          </el-table-column>
          <el-table-column prop="outFactoryCode" align="center" label="出厂编号">
          </el-table-column>
          <el-table-column prop="contractCode" align="center" label="合同编号">
          </el-table-column>
          <el-table-column prop="recordCode" align="center" label="备案编号">
          </el-table-column>
          <el-table-column prop="useCompanyName" align="center" label="使用公司">
          </el-table-column>
          <el-table-column prop="useFactoryName" align="center" label="使用工厂">
          </el-table-column>
          <el-table-column prop="useDeptName" align="center" label="使用部门">
          </el-table-column>
          <el-table-column prop="transferTime" align="center" label="移交时间">
          </el-table-column>
          <el-table-column prop="itemOutName" align="center" label="项目外部名称">
          </el-table-column>
          <el-table-column prop="purchaseSubject" align="center" label="采购主体">
          </el-table-column>
          <el-table-column prop="" align="center" label="审核状态" >
            <template slot-scope="scope">
              <span>{{scope.row.auditingType}}</span>
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
      <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" :visible.sync="dialogFormVisible" width="60%" v-dialogDrag v-loading="listLoading"> 
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="表单信息" name="first">
            <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="110px">
              <el-form-item>
                <span class="equip-title">新设备移交单</span>
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
                  <el-form-item label="型号规格" prop="typeSpecification">
                    <el-input v-model="temp.typeSpecification" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="供应商" prop="supplier"  >
                    <el-input v-model="temp.supplier" disabled></el-input>
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
                  <el-form-item label="出厂编号" prop="outFactoryCode">
                    <el-input v-model="temp.outFactoryCode" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="合同编号" prop="contractCode">
                    <el-input v-model="temp.contractCode" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="备案编号" prop="recordCode">
                    <el-input v-model="temp.recordCode" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="使用公司" prop="useCompanyName">
                    <el-input v-model="temp.useCompanyName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="使用工厂" prop="useFactoryName">
                    <el-input v-model="temp.useFactoryName" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="使用部门" prop="useDeptName">
                    <el-input v-model="temp.useDeptName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="移交时间" prop="transferTime">
                    <el-date-picker style="width:100%"
                      v-model="temp.transferTime"
                      type="date"
                      placeholder="选择日期"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                       disabled>
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="项目外部名称" prop="itemOutName">
                    <el-input v-model="temp.itemOutName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="采购主体" prop="purchaseSubject">
                   <el-input v-model="temp.purchaseSubject" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="移交资料清单" prop="transferDataBill">
                <el-checkbox-group v-model="checkboxArr">
                  <el-checkbox label="合同、设备三包(技术协议)" disabled></el-checkbox>
                  <el-checkbox label="供货商送货单" disabled></el-checkbox>
                  <el-checkbox label="开箱验收单" disabled></el-checkbox>
                  <el-checkbox label="新设备评价表" disabled></el-checkbox>
                  <el-checkbox label="质量问题通知函" disabled></el-checkbox>
                  <el-checkbox label="设备检修记录单" disabled></el-checkbox>
                  <el-checkbox label="设备使用说明书、操作规程" disabled></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="其他资料" prop="otherData">
                <el-input v-model="temp.otherData" maxlength="200" disabled></el-input>
              </el-form-item>
              <el-row>
                <el-col :span="10">
                  <el-form-item label="合同、设备三包附件" prop="htfileData" label-width="140px">>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <el-table :data="htfileData"
              border fit highlight-current style="width: 60%; margin-left:100px;">
              <el-table-column align="center" label="文件名" >
                <template slot-scope="scope">
                  <span style="cursor:pointer;text-decoration:underline " @click="handlePreview(scope.row)">{{scope.row.fileName}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="上传节点" >
                <template slot-scope="scope">
                  <span >{{scope.row.node}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <el-button title="下载" type="primary" size="mini" icon="el-icon-download" @click="fileDown(scope.row)"></el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row style="margin-top:10px">
              <el-col :span="10">
                <el-form label-position="left" label-width="130px">
                <el-form-item label="供货商送货单附件" prop="ghsfileData">
                </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-table :data="ghsfileData"
              border fit highlight-current style="width: 60%; margin-left:100px;">
              <el-table-column align="center" label="文件名" >
                <template slot-scope="scope">
                  <span style="cursor:pointer;text-decoration:underline " @click="handlePreview(scope.row)">{{scope.row.fileName}}</span>
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
            <el-row style="margin-top:10px">
              <el-col :span="10">
                <el-form label-position="left" label-width="120px">
                <el-form-item label="开箱验收单附件" prop="ysdfileData">
                </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-table :data="ysdfileData"
              border fit highlight-current style="width: 60%; margin-left:100px;">
              <el-table-column align="center" label="文件名" >
                <template slot-scope="scope">
                  <span style="cursor:pointer;text-decoration:underline " @click="handlePreview(scope.row)">{{scope.row.fileName}}</span>
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
            <el-row style="margin-top:10px">
              <el-col :span="10">
                <el-form label-position="left" label-width="130px">
                <el-form-item label="新设备评价表附件" prop="pjfileData">
                </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-table :data="pjfileData"
              border fit highlight-current style="width: 60%; margin-left:100px;">
              <el-table-column align="center" label="文件名" >
                <template slot-scope="scope">
                  <span style="cursor:pointer;text-decoration:underline " @click="handlePreview(scope.row)">{{scope.row.fileName}}</span>
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
            <el-row style="margin-top:10px">
              <el-col :span="10">
                <el-form label-position="left" label-width="140px">
                <el-form-item label="质量问题通知函附件" prop="zlwtfileData">
                  <input id="uploadImg6" type="file" @change="fileUpload6" v-if="false">
                </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-table :data="zlwtfileData"
              border fit highlight-current style="width: 60%; margin-left:100px;">
              <el-table-column align="center" label="文件名" >
                <template slot-scope="scope">
                  <span style="cursor:pointer;text-decoration:underline " @click="handlePreview(scope.row)">{{scope.row.fileName}}</span>
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
            <el-row style="margin-top:10px">
              <el-col :span="10">
                <el-form label-position="left" label-width="140px">
                <el-form-item label="设备检修记录单附件" prop="jxjlfileData">
                </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-table :data="jxjlfileData"
              border fit highlight-current style="width: 60%; margin-left:100px;">
              <el-table-column align="center" label="文件名" >
                <template slot-scope="scope">
                  <span style="cursor:pointer;text-decoration:underline " @click="handlePreview(scope.row)">{{scope.row.fileName}}</span>
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
            <el-row style="margin-top:10px">
              <el-col :span="10">
                <el-form label-position="left" label-width="130px">
                <el-form-item label="设备使用说明书、操作规程附件" prop="smczfileData">
                  <input id="uploadImg8" type="file" @change="fileUpload8" v-if="false">
                </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-table :data="smczfileData"
              border fit highlight-current style="width: 60%; margin-left:100px;">
              <el-table-column align="center" label="文件名" >
                <template slot-scope="scope">
                  <span style="cursor:pointer;text-decoration:underline " @click="handlePreview(scope.row)">{{scope.row.fileName}}</span>
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
import { fetchAllList, getDetail, getAllFile, fetchExportList } from '@/api/equipMent/equipTransferForm/equipTransferForm'
import { commonOptions1, recordList, fileList, processChart, fetchComTree, fetchChooseTree } from '@/api/common/common'
import { baseUrl } from '@/api/common/fileBaseUrl'
export default {
  name: 'index',
  data() {
    return {
      routMsg: '',
      value02: null,
      chartData: null, // 流程图
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
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        equipmentName: undefined,
        fixedAssetCode: undefined,
        acceptanceDateStart: undefined,
        acceptanceDateEnd: undefined,
        auditingType: undefined, // 审核通过
        startDate: undefined,
        endDate: undefined,
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
        equEvaluateId: undefined, // 评价表id
        equId: undefined, // 一览表id
        documentWordCode: undefined,

        auditingType: undefined, // 审核状态
        contractCode: undefined, // 合同编码

        equipmentName: undefined, // 设备名称
        fixedAssetCode: undefined, // 固定资产编码

        itemOutName: undefined, // 项目外部名称
        otherData: undefined, // 其他数据

        outFactoryCode: undefined, // 出厂编码
        purchaseSubject: undefined, // 采购主体

        recordCode: undefined, // 备案编码
        supplier: undefined, // 供应商

        transferDataBill: undefined, // 移交资料清单
        transferTime: undefined, // 移交时间
        typeSpecification: undefined, // 规格型号

        useCompanyName: undefined, // 使用公司
        useCompany: undefined,
        useFactoryName: undefined, // 使用工厂
        useFactory: undefined,
        useDeptName: undefined, // 使用部门
        useDept: undefined, // 使用部门
        list: []
      },
      // 移交资料清单选中数组
      checkboxArr: [],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        detail: '查看新设备移交单'
      },
      // 文件数据
      htfileData: [], // 合同、设备三包
      ghsfileData: [], // 供应商送货单
      ysdfileData: [], // 开箱验收单
      zlfileData: [], // 设备质量信息报告
      pjfileData: [], // 新设备评价表
      zlwtfileData: [], // 质量问题通知函
      jxjlfileData: [], // 设备检修记录单
      smczfileData: [], // 设备使用说明书、操作规程
      documentWordCode: undefined, // 单据编码
      userId: undefined, // 用户id
      processInstanceId: undefined, // 流程实例id
      equEvaluateId: undefined, // 评价表id
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
      activeName: 'first',
      recordData: null,
      rules: {
        // documentWordCode: [{ required: true, message: '请输入单据编码', trigger: 'change' }],
        // recordCode: [{ required: true, message: '请输入备案编号', trigger: 'change' }],
        equipmentName: [{ required: true, message: '请输入设备名称', trigger: 'change' }],
        typeSpecification: [{ required: true, message: '请输入型号规格', trigger: 'change' }],
        fixedAssetCode: [{ required: true, message: '请输入固定资产编号', trigger: 'change' }],

        outFactoryCode: [{ required: true, message: '请输入出厂编号', trigger: 'change' }],
        supplier: [{ required: true, message: '请输入供应商', trigger: 'change' }],

        useCompanyName: [{ required: true, message: '请输入使用公司', trigger: 'change' }],
        useFactoryName: [{ required: true, message: '请输入使用工厂', trigger: 'change' }],
        useDeptName: [{ required: true, message: '请输入使用部门', trigger: 'change' }],

        contractCode: [{ required: true, message: '请输入合同编号', trigger: 'change' }],
        // itemOutName: [{ required: true, message: '请输入项目外部名称', trigger: 'change' }],
        purchaseSubject: [{ required: true, message: '请输入采购主体', trigger: 'change' }],
        transferTime: [{ required: true, message: '请选择移交时间', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getRoutParams()
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
    // 获取处理路由
    getRoutParams() {
      this.routMsg = this.$route.params.dataObj
      this.listQuery.auditingType = this.routMsg.checkStatus
      this.listQuery.startDate = this.routMsg.startDate
      this.listQuery.endDate = this.routMsg.endDate
      if (this.listQuery.startDate != undefined && this.listQuery.startDate != '') {
        this.value02 = []
        this.value02.push(this.listQuery.startDate)
        this.value02.push(this.listQuery.endDate)
      }
    },
    getList() {
      this.listLoading = true
      fetchAllList(this.listQuery).then(response => {
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
                this.tableData[i].auditingType = '流程关闭'
              }
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
        this.listQuery.acceptanceDateStart = ''
        this.listQuery.acceptanceDateEnd = ''
      } else {
        this.listQuery.acceptanceDateStart = this.value01[0]// 开始时间
        this.listQuery.acceptanceDateEnd = this.value01[1]
      }
    },
    searchChange02() {
      // 日期转换
      if (this.value02 == null) {
        this.listQuery.startDate = ''
        this.listQuery.endDate = ''
      } else {
        this.listQuery.startDate = this.value02[0]// 开始时间
        this.listQuery.endDate = this.value02[1]
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
          this.checkboxArr = details.transferDataBill.split(',')
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
      this.dialogFormVisible = true
      this.documentWordCode = row.documentWordCode
      // 流转记录
      this.processInstanceId = row.processInstanceId
      this.equEvaluateId = row.equEvaluateId
      this.getFileList() // 获取移交单文件
      this.getFiles() // 获取其它文件
    },

    // 通过评价表id获取所有附件信息
    getFiles() {
      getAllFile(this.equEvaluateId).then(response => {
        if (response.data.code == 200) {
          const files = response.data.data
          files.forEach(item => {
            if (item.attachmentCode == 'KXYSDFJ') { // 开箱验收单
              this.ysdfileData.push(item)
            } else if (item.attachmentCode == 'SBZLXXBGFJ') { // 设备质量信息报告
              this.zlfileData.push(item)
            } else if (item.attachmentCode == 'XSBPJBFJ') { // 新设备评价表
              this.pjfileData.push(item)
            } else if (item.attachmentCode == 'SBJXJLFJ') { // 设备检修记录单
              this.jxjlfileData.push(item)
            } else if (item.attachmentCode == 'AZWCQRDCZGC') { // 操作规程
              this.smczfileData.push(item)
            } else if (item.attachmentCode == 'AZWCQRDSYSMS') { // 使用说明书
              this.smczfileData.push(item)
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
    // 获取设备移交单文件列表
    getFileList() {
      // 附件列表
      this.htfileData = [] // 合同、设备三包
      this.ghsfileData = [] // 供应商送货单
      this.ysdfileData = [] // 开箱验收单
      this.zlfileData = [] // 设备质量信息报告
      this.pjfileData = [] // 新设备评价表
      this.zlwtfileData = []// 质量问题通知函
      this.jxjlfileData = [] // 设备检修记录单
      this.smczfileData = [] // 设备使用说明书、操作规程
      const find = {
        moduleType: '6', // 模块类别
        documentWordCode: this.documentWordCode // 单据编码
      }
      fileList(find).then(response => {
        const files1 = response.data.data
        files1.forEach(item => {
          if (item.attachmentCode == 'HTSBSBFJ') { // 合同、设备三包（技术协议）
            this.htfileData.push(item)
          } else if (item.attachmentCode == 'GYSSHDFJ') { // 供应商送货单
            this.ghsfileData.push(item)
          } else if (item.attachmentCode == 'KXYSDFJ') { // 开箱验收单
            this.ysdfileData.push(item)
          } else if (item.attachmentCode == 'SBZLXXBGFJ') { // 设备质量信息报告
            this.zlfileData.push(item)
          } else if (item.attachmentCode == 'XSBPJBFJ') { // 新设备评价表
            this.pjfileData.push(item)
          } else if (item.attachmentCode == 'ZLWTTZH') { // 质量问题通知函
            this.zlwtfileData.push(item)
          } else if (item.attachmentCode == 'SBJXJLFJ') { // 设备检修记录单
            this.jxjlfileData.push(item)
          } else if (item.attachmentCode == 'SBSYSMSFJ') { // 设备使用说明书、操作规程
            this.smczfileData.push(item)
          }
        })
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
</style>

