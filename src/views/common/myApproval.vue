<template>
  <div class='app-container'>
    <el-container>
      <!-- <h2 class="title-header">我的审批</h2> -->
      <div class="formSearch">
        <el-form :inline="true">
          <el-form-item label="标题：">
            <el-input class="filter-item input" v-model="listQuery.title">
            </el-input>
          </el-form-item>
          <el-form-item label="时间范围：">
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
      <el-main style="padding:20px 30px;">
        <el-tabs v-model="activeName1" @tab-click="handleClick">
          <el-tab-pane label="待办" name="first">
            <span slot="label" v-if="needFlag">待办
              <span class="red-point">&nbsp;{{total}}&nbsp;</span>
            </span>
            <el-table :data="needList" :show-header="false" height="500" style="width:91%;font-size:15px;" v-loading="listLoading">
              <el-table-column prop="title">
                <template slot-scope="scope">
                  <span class="look-detail" @click="needDetail(scope.row)">{{scope.row.title}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" align="right">
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="已办" name="second">
            <span slot="label" v-if="!needFlag">已办
              <span class="red-point">&nbsp;{{total}}&nbsp;</span>
            </span>
            <el-table :data="doneList" :show-header="false" height="500" style="width:91%;font-size:15px;" v-loading="listLoading">
              <el-table-column prop="title">
                <template slot-scope="scope">
                  <span class="look-detail" @click="doneDetail(scope.row)">{{scope.row.title}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" align="right">
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
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
      <!-- 详情弹框 -->
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="60%" v-loading="listLoading"
        v-dialogDrag :close-on-click-modal="false"> 
        <el-tabs v-model="activeName" >
          <el-tab-pane label="表单信息" name="first">
            <!-- 调拨单 -->
            <el-form :rules="rules" :model="temp" label-position="left" label-width="110px" v-if="dialogStatus=='allot'">
              <el-form-item>
                <span class="equip-title">设备调拨单</span>
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
                  <el-form-item label="调出公司" prop="transferOutCompanyName">
                    <el-input v-model="temp.transferOutCompanyName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="调出工厂" prop="transferOutFactoryName">
                    <el-input v-model="temp.transferOutFactoryName" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="调出部门" prop="transferOutDepartmentName">
                    <el-input v-model="temp.transferOutDepartmentName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" style="padding-right:0px;">
                  <el-form-item label="调入公司" prop="transferInCompanyName">
                    <el-input v-model="temp.transferInCompanyName" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12" style="padding-right:0px;">
                  <el-form-item label="调入工厂" prop="transferInFactoryName">
                    <el-input v-model="temp.transferInFactoryName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" style="padding-right:0px;">
                  <el-form-item label="调入部门" prop="transferInDepartmentName">
                    <el-input v-model="temp.transferInDepartmentName" disabled></el-input>
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
                  <el-form-item label="设备名称" prop="equipName">
                    <el-input v-model="temp.equipName" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="型号规格" prop="equipType">
                    <el-input v-model="temp.equipType" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="出厂编号" prop="serialNumber">
                    <el-input v-model="temp.serialNumber" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="制造厂家" prop="manufacturer">
                    <el-input v-model="temp.manufacturer" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="数量" prop="nums">
                    <el-input v-model="temp.nums" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="1" style="padding:0px;font-size:20px;font-weight:800;">
                  <span>台</span>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="11">
                  <el-form-item label="折旧年限" prop="depreciationPeriod">
                    <el-input v-model="temp.depreciationPeriod" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="1" style="padding:0px;font-size:20px;font-weight:800;">
                  <span>年</span>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="已用年限" prop="usedPeriod">
                    <el-input v-model="temp.usedPeriod" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="1" style="padding:0px;font-size:20px;font-weight:800;">
                  <span>年</span>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="11">
                  <el-form-item label="财务原值" prop="originalFinancialValue">
                    <el-input v-model="temp.originalFinancialValue" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="1" style="padding:0px;font-size:20px;font-weight:800;">
                  <span>元</span>
                </el-col>
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
              <el-form-item label="调拨原因" prop="reason">
                <el-input type="textarea" maxlength="200" v-model="temp.reason" disabled></el-input>
              </el-form-item>
              <el-form-item label="其他说明" prop="otherDescription">
                <el-input type="textarea" maxlength="200" v-model="temp.otherDescription" disabled></el-input>
              </el-form-item>
              <el-row>
                <el-col :span="10">
                  <el-form-item label="附件">
                  </el-form-item>
                </el-col>
              </el-row>
              <el-table :data="fileData"
                border fit highlight-current style="width: 80%; margin-left:100px;">
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
            </el-form>
            <!-- 维修出厂单 -->
            <el-form :rules="rules" :model="temp" label-position="left" label-width="110px" v-if="dialogStatus=='repair'">
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
            <!-- 厂内迁移单 -->
            <el-form :rules="rules" label-position="left" :model="temp" label-width="110px" v-if="dialogStatus=='migration'">
              <el-form-item>
                <span class="equip-title">设备厂内迁移单</span>
              </el-form-item>
              <el-row :gutter="20">
                <el-col :span="11">     
                  <el-form-item label="单据编号" prop="formCode">
                  <el-input v-model="temp.formCode" disabled maxlength="32"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">     
                  <el-form-item label="申请时间" prop="applicationTime">
                  <el-input v-model="temp.applicationTime" disabled maxlength="32"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="11">     
                  <el-form-item label="调出部门" prop="transferOutDepartmentName">
                  <el-input v-model="temp.transferOutDepartmentName" disabled maxlength="32"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="调入部门" prop="transferInDepartmentName"> 
                  <el-input v-model="temp.transferInDepartmentName" disabled maxlength="8"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="11">     
                <el-form-item label="固定资产编号" prop="fixedAssetCode">
                <el-input v-model="temp.fixedAssetCode" maxlength="8" disabled></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="设备名称" prop="equipName">
                <el-input v-model="temp.equipName" maxlength="8" disabled></el-input>
                </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="11">     
                <el-form-item label="型号规格" prop="equipType"> 
                <el-input v-model="temp.equipType" disabled maxlength="8"></el-input>   
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="出厂编号" prop="serialNumber"> 
                <el-input v-model="temp.serialNumber" maxlength="8" disabled></el-input>   
                </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="11">
                <el-form-item label="制造厂家" prop="manufacturer"> 
                <el-input v-model="temp.manufacturer" disabled maxlength="8"></el-input>   
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="数量" prop="nums"> 
                <el-input v-model="temp.nums" disabled maxlength="8"></el-input>   
                </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="10">
                <el-form-item label="折旧年限" prop="depreciationPeriod"> 
                <el-input v-model="temp.depreciationPeriod" disabled maxlength="8"></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="1" style="padding:0px;font-size:20px;font-weight:800;">
                  <span>年</span>
                </el-col>
                <el-col :span="11">
                <el-form-item label="已用年限" prop="usedPeriod"> 
                <el-input v-model="temp.usedPeriod" disabled maxlength="8"></el-input> 
                </el-form-item>
                </el-col>
                <el-col :span="1" style="padding:0px;font-size:20px;font-weight:800;">
                  <span>年</span>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="10">
                <el-form-item label="财务原值" prop="originalFinancialValue"> 
                <el-input v-model="temp.originalFinancialValue" disabled maxlength="8"></el-input>  
                </el-form-item>
                </el-col>
                <el-col :span="1" style="padding:0px;font-size:20px;font-weight:800;">
                  <span>元</span>
                </el-col>
                <el-col :span="11">
                <el-form-item label="账面净值" prop="netBookValue"> 
                <el-input v-model="temp.netBookValue" disabled maxlength="8"></el-input> 
                </el-form-item>
                </el-col>
                <el-col :span="1" style="padding:0px;font-size:20px;font-weight:800;">
                  <span>元</span>
                </el-col>
              </el-row>
              <el-form-item label="备注" prop="remark" label-width="120px">
                <el-input type="textarea" disabled maxlength="200" v-model="temp.remark">
                </el-input>
              </el-form-item>
              <el-form-item label="调拨原因" prop="reason" label-width="120px">
                <el-input type="textarea" disabled maxlength="200" v-model="temp.reason">
                </el-input>
              </el-form-item>
              <el-form-item label="其他说明" prop="otherDescription" label-width="120px">
                <el-input type="textarea" disabled maxlength="200" v-model="temp.otherDescription">
                </el-input>
              </el-form-item>
            </el-form>
            <!-- 设备报修单-->
            <el-form :rules="rules1" label-position="left" :model="temp" label-width="110px" v-if="dialogStatus=='toRepairs'">
              <el-form-item>
                <span class="equip-title">设备报修单</span>
              </el-form-item>
              <el-row :gutter="20">
                <el-col :span="11">     
                <el-form-item label="单据编码"  prop="documnetCode">
                <el-input v-model="temp.documnetCode" disabled ></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="12">     
                <el-form-item label="设备名称"  prop="equipmentName">
                <el-input v-model="temp.equipmentName" disabled></el-input>
                </el-form-item>
                </el-col>
              </el-row>
              
              <el-row :gutter="20">
                <el-col :span="11">     
                <el-form-item label="固定资产编号"  prop="fixedAssetCode">
                <el-input v-model="temp.fixedAssetCode" disabled></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="型号规格" prop="model"> 
                <el-input v-model="temp.model" disabled></el-input>
                </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="11">
                <el-form-item label="报修时间"  prop="repariDate">
                <el-input v-model="temp.repariDate" disabled></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="电路板名称" prop="circuitBoardName">
                <el-input v-model="temp.circuitBoardName" disabled></el-input>
                </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="11">     
                <el-form-item label="电路板型号" prop="circuitBoardModel"> 
                <el-input v-model="temp.circuitBoardModel" disabled></el-input>   
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="报修公司" prop="repairCompany"> 
                <el-input v-model="temp.repairCompany" disabled></el-input>   
                </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="11">
                <el-form-item label="报修工厂" prop="repairFactory"> 
                <el-input v-model="temp.repairFactory" disabled></el-input>   
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="报修部门" prop="repairDivision"> 
                <el-input v-model="temp.repairDivision" disabled></el-input>   
                </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="11">
                <el-form-item label="要求完成时间" prop="requestDate">
                  <div class="block">
                  <el-date-picker
                    v-model="temp.requestDate"
                    type="date"
                    placeholder="选择日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    
                    disabled>
                  </el-date-picker>
                  </div>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="设备维修建议" prop="repairSuggest"> 
                <el-radio v-model="temp.repairSuggest" disabled label="2">外部维修</el-radio>
                <el-radio v-model="temp.repairSuggest" disabled label="1">内部维修</el-radio>
                </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="故障原因及内容" prop="causeReason" label-width="120px">
                <el-input type="textarea" disabled v-model="temp.causeReason">
                </el-input>
              </el-form-item>
              <el-row>
                <el-col :span="18">
                <el-form-item label="附件" label-width="40px">
                </el-form-item>
                </el-col>
              </el-row> 
              <!-- 第一个小表格 -->
              <el-table :data="smallslist" v-loading="listLoading" border fit highlight-current-row
                style="width: 100%;min-height:auto;margin-top:8px" :header-cell-style="{background:'oldlace'}">
                <el-table-column prop="fileName" align="center" label="文件名" min-width="323">
                  <template slot-scope="scope">
                  <span style="cursor:pointer;text-decoration:underline " @click="lookFile(scope.row)">{{scope.row.fileName}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="node" align="center" label="上传节点" min-width="318">
                  <template slot-scope="scope">
                  <span>{{scope.row.node}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="操作" min-width="318"  class-name="small-padding fixed-width">
                  <template slot-scope="scope">
                    <el-button title="下载" type="primary" @click="fileDown(scope.row)" size="small" icon="el-icon-download"></el-button>
                    </template>
                </el-table-column>
              </el-table>
            </el-form>
          </el-tab-pane>
        </el-tabs>
        <!-- 按钮组 -->
        <el-form class="formDw"> 
          <el-form-item>
            <el-button type="primary" v-if="dialogStatus!='toRepairs'" @click="printData">打印</el-button>
            <el-button type="primary" v-if="dialogStatus=='toRepairs'" @click="printData1">打印</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 打印 -->
      <el-dialog :title="textMap[dialogStatus]" v-dialogDrag :close-on-click-modal="false" :visible.sync="printDialogVisible" width="70%">
        <el-button type="primary" @click="printDialogVisible = false">返回</el-button>
        <el-button type="success" v-print="'#printTest'"><svg-icon icon-class="print"/>打印</el-button>
        <div id="printTest" v-if="dialogStatus=='allot'">
          <table border= "0">
            <caption style="font-family:SimHei;font-size: 16px;">
              <p>{{printList.transferOutCompanyName}}</p>
              <p>设备调拨单</p>
            </caption>
            <thead>
              <tr>
                <th colspan="12" style="text-align: left;">
                  调出单位:{{printList.transferOutCompanyName + ' / ' + printList.transferOutFactoryName + ' / ' + printList.transferOutDepartmentName }}</th>
              </tr>
              <tr>
                <th colspan="7" style="text-align: left;">
                  调入单位:{{printList.transferInCompanyName + ' / ' +printList.transferInFactoryName + ' / ' + printList.transferInDepartmentName }}</th>
                <th colspan="5" style="text-align: right;">编号:{{printList.formCode}}&nbsp;&nbsp;&nbsp;&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              <tr>
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
                <td style="width:105px;">{{printList.fixedAssetCode}}</td>
                <td style="width:80px;">{{printList.equipName}}</td>
                <td style="width:90px;">{{printList.equipType}}</td>
                <td style="width:80px;">{{printList.serialNumber}}</td>
                <td style="width:100px;">{{printList.manufacturer}}</td>
                <td style="width:80px;">{{printList.nums}}</td>
                <td style="width:90px;">元</td>
                <td style="width:80px;">{{printList.depreciationPeriod}}</td>
                <td>{{printList.usedPeriod}}</td>
                <td>{{printList.originalFinancialValue}}</td>
                <td style="width:80px;">{{printList.netBookValue}}</td>
                <td style="width:80px;">{{printList.remark}}</td>
              </tr>
              <tr>
                <td colspan="1" style="text-align:left">调拨原因</td>
                <td colspan="11" style="text-align:left">{{printList.reason}}</td>
              </tr>
              <tr>
                <td colspan="1" style="text-align:left">其他说明</td>
                <td colspan="11" style="text-align:left">{{printList.otherDescription}}</td>
              </tr>
              <tr style="height:40px;">
                <td colspan="2">经办人签字</td>
                <td colspan="2">调出厂设备科长签字</td>
                <td colspan="2">设备副总签字</td>
                <td colspan="2">资产部副部长签章</td>
                <td colspan="2">资产部盖章</td>
                <td colspan="2">调入厂签字</td>
              </tr>
              <tr style="height:80px;text-align:left">
                <td colspan="2" style="border-bottom:1px solid #fff"></td>
                <td colspan="2" style="border-bottom:1px solid #fff">{{printList.dcsbkzOpinion}}</td>
                <td colspan="2" style="border-bottom:1px solid #fff">{{printList.sbfzOpinion}}</td>
                <td colspan="2" style="border-bottom:1px solid #fff">{{printList.zcbfbzOpinion}}</td>
                <td colspan="2" style="border-bottom:1px solid #fff"></td>
                <td colspan="2" style="border-bottom:1px solid #fff">{{printList.drbmOpinion}}</td>
              </tr>
              <tr style="text-align:left">
                <td colspan="2">经办人：{{printList.fqr}}</td>
                <td colspan="2">经办人：{{printList.dcsbkz}}</td>
                <td colspan="2">经办人：{{printList.sbfz}}</td>
                <td colspan="2">经办人：{{printList.zcbfbz}}</td>
                <td colspan="2">经办人：</td>
                <td colspan="2">经办人：{{printList.drbm}}</td>
              </tr>
              <tr style="text-align:left">
                <td colspan="2" style="border-top:1px solid #fff">
                  日期：{{printList.fqrDate!=null?printList.fqrDate.substring(0,10):''}}</td>
                <td colspan="2" style="border-top:1px solid #fff">
                  日期：{{printList.dcsbkzDate!=null?printList.dcsbkzDate.substring(0,10):''}}</td>
                <td colspan="2" style="border-top:1px solid #fff">
                  日期：{{printList.sbfzDate!=null?printList.sbfzDate.substring(0,10):''}}</td>
                <td colspan="2" style="border-top:1px solid #fff">
                  日期：{{printList.zcbfbzDate!=null?printList.zcbfbzDate.substring(0,10):''}}</td>
                <td colspan="2" style="border-top:1px solid #fff">
                  日期：</td>
                <td colspan="2" style="border-top:1px solid #fff">
                  日期：{{printList.drbmDate!=null?printList.drbmDate.substring(0,10):''}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div id="printTest" v-if="dialogStatus=='repair'">
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
              <tr>
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
                <td colspan="3">设备科长签字</td>
                <td colspan="2">设备副总签字</td>
                <td colspan="3">资产部副部长签字</td>
                <td colspan="2">资产部盖章</td>
              </tr>
              <tr style="height:80px;text-align:left">
                <td colspan="2" style="border-bottom:1px solid #fff"></td>
                <td colspan="3" style="border-bottom:1px solid #fff">{{printList.dcsbkzOpinion}}</td>
                <td colspan="2" style="border-bottom:1px solid #fff">{{printList.sbfzOpinion}}</td>
                <td colspan="3" style="border-bottom:1px solid #fff">{{printList.zcbfbzOpinion}}</td>
                <td colspan="2" style="border-bottom:1px solid #fff"></td>
              </tr>
              <tr style="text-align:left">
                <td colspan="2">经办人：{{printList.fqr}}</td>
                <td colspan="3">经办人：{{printList.dcsbkz}}</td>
                <td colspan="2">经办人：{{printList.sbfz}}</td>
                <td colspan="3">经办人：{{printList.zcbfbz}}</td>
                <td colspan="2">经办人：</td>
              </tr>
              <tr style="text-align:left">
                <td colspan="2" style="border-top:1px solid #fff">
                  日期：{{printList.fqrDate!=null?printList.fqrDate.substring(0,10):''}}</td>
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
        <div id="printTest" v-if="dialogStatus=='migration'">
          <table border= "0">
            <caption style="font-family:SimHei;font-size: 16px;">
              <p>{{printList.transferInCompanyName}}</p>
              <p>设备厂内迁移单</p>
            </caption>
            <thead>
              <tr>
                <th colspan="12" style="text-align: left;">
                  调出单位:{{printList.transferOutCompanyName + ' / ' + printList.transferOutFactoryName + ' / ' + printList.transferOutDepartmentName }}</th>
              </tr>
              <tr>
                <th colspan="7" style="text-align: left;">
                  调入单位:{{printList.transferInCompanyName + ' / ' +printList.transferInFactoryName + ' / ' + printList.transferInDepartmentName }}</th>
                <th colspan="5" style="text-align: right;">编号:{{printList.formCode}}&nbsp;&nbsp;&nbsp;&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              <tr>
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
                <td style="width:105px;">{{printList.fixedAssetCode}}</td>
                <td style="width:80px;">{{printList.equipName}}</td>
                <td style="width:90px;">{{printList.equipType}}</td>
                <td style="width:80px;">{{printList.serialNumber}}</td>
                <td style="width:100px;">{{printList.manufacturer}}</td>
                <td style="width:80px;">{{printList.nums}}</td>
                <td style="width:90px;">元</td>
                <td style="width:80px;">{{printList.depreciationPeriod}}</td>
                <td>{{printList.usedPeriod}}</td>
                <td>{{printList.originalFinancialValue}}</td>
                <td style="width:80px;">{{printList.netBookValue}}</td>
                <td style="width:80px;">{{printList.remark}}</td>
              </tr>
              <tr>
                <td colspan="1" style="text-align:left">调拨原因</td>
                <td colspan="11" style="text-align:left">{{printList.reason}}</td>
              </tr>
              <tr>
                <td colspan="1" style="text-align:left">其他说明</td>
                <td colspan="11" style="text-align:left">{{printList.otherDescription}}</td>
              </tr>
              <tr>
                <td colspan="2">经办人签字</td>
                <td colspan="3">设备科长签字</td>
                <td colspan="2">设备副总签字</td>
                <td colspan="3">资产部副部长签字</td>
                <td colspan="2">资产部盖章</td>
              </tr>
              <tr style="height:80px;text-align:left">
                <td colspan="2" style="border-bottom:1px solid #fff"></td>
                <td colspan="3" style="border-bottom:1px solid #fff">{{printList.dcsbkzOpinion}}</td>
                <td colspan="2" style="border-bottom:1px solid #fff">{{printList.sbfzOpinion}}</td>
                <td colspan="3" style="border-bottom:1px solid #fff">{{printList.zcbfbzOpinion}}</td>
                <td colspan="2" style="border-bottom:1px solid #fff"></td>
              </tr>
              <tr style="text-align:left">
                <td colspan="2">经办人：{{printList.fqr}}</td>
                <td colspan="3">经办人：{{printList.dcsbkz}}</td>
                <td colspan="2">经办人：{{printList.sbfz}}</td>
                <td colspan="3">经办人：{{printList.zcbfbz}}</td>
                <td colspan="2">经办人：</td>
              </tr>
              <tr style="text-align:left">
                <td colspan="2" style="border-top:1px solid #fff">
                  日期：{{printList.fqrDate!=null?printList.fqrDate.substring(0,10):''}}</td>
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
        <div id="printTest" v-if="dialogStatus=='toRepairs'">
          <table border= "0">
            <thead>
              <tr>
                <th colspan="8">{{srintList.repairCompany}}设备报修单</th>
              </tr>
            </thead>
            <tbody class="toRepairs">
              <tr style="height:60px">
                <td style="border:1px solid black">设备名称</td>
                <td style="border:1px solid black" colspan="3">{{srintList.equipmentName}}</td>
                <td style="border:1px solid black" colspan="3">固定资产编号</td>
                <td style="border:1px solid black" colspan="1">{{srintList.fixedAssetCode}}</td>
              </tr>
              
              <tr style="height:60px">
                <td style="border:1px solid black">型号规格</td>
                <td style="border:1px solid black" colspan="3">{{srintList.model}}</td>
                <td style="border:1px solid black" colspan="3">报修时间</td>
                <td style="border:1px solid black" colspan="1">{{srintList.repariDate}}</td>
              </tr>
                <tr style="height:60px">
                <td style="border:1px solid black">电路板名称</td>
                <td style="border:1px solid black" colspan="3">{{srintList.circuitBoardName}}</td>
                <td style="border:1px solid black" colspan="3">电路板型号</td>
                <td style="border:1px solid black" colspan="1">{{srintList.circuitBoardModel}}</td>
              </tr >
                <tr style="height:60px">
                <td style="border:1px solid black">报修部门</td>
                <td style="border:1px solid black" colspan="3">{{srintList.repairDivision}}</td>
                <td style="border:1px solid black" colspan="3">要求完成时间</td>
                <td style="border:1px solid black" colspan="1">{{srintList.requestDate}}</td>
              </tr>
              <tr>
                <td colspan="8" style="height:40px;border:1px solid black">
                  <span style="margin-left:170px">外部维修(<span v-if="suggestShow">√</span>)</span><span style="margin-left:120px">内部维修(<span v-if="sugg">√</span>)</span>
                </td>
              </tr>
              <tr style="height:100px">
                <td colspan="8" style="border:1px solid black" align="left" valign="top">
                  <div>故障原因及内容：{{srintList.causeReason}}</div>
                  </td>
              </tr>
              <tr style="height:100px">
                <td colspan="8" align="left" valign="top" style="height:50px;border:1px solid black;border-bottom:none">设备科审核意见：{{fixing}}</td>
              </tr>
              <tr style="border-top:0px solid white;">    
                <td colspan="8" align="right" style="border:1px solid black;border-top:none"><span>签字：{{fixingName}}</span><span>日期：{{fixingDate}}</span></td>
              </tr>
              <tr style="height:100px">
                <td colspan="8" align="left" valign="top" style="height:50px;border:1px solid black;border-bottom:none">厂长审核意见：{{factoryst}}</td>
              </tr>
              <tr style="border-top:0px solid white;"> 
                <td colspan="8" align="right" style="border:1px solid black;border-top:none"><span>签字：{{factorystName}}</span><span>日期：{{factorystDate}}</span></td>
              </tr>
                <tr style="height:100px">
                <td colspan="8" align="left" valign="top" style="height:50px;border:1px solid black;border-bottom:none">事业部分管副总意见：{{enterprise}}</td>
              </tr>
              <tr style="border-top:0px solid white;">
                <td colspan="8" align="right" style="border:1px solid black;border-top:none"><span>签字：{{enterpriseName}}</span><span>日期：{{enterpriseDate}}</span></td>
              </tr>
              <tr style="height:100px">
                <td colspan="8" align="left" valign="top" style="height:50px;border:1px solid black;border-bottom:none">资产部意见：{{propertyst}}</td>
              </tr>
              <tr style="border-top:0px solid white;">  
                <td colspan="8" align="right" style="border:1px solid black;border-top:none"><span>签字：{{propertystName}}</span><span>日期：{{propertystDate}}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
import { getFormList, updateFormMessage } from '@/api/common/approvalMessages'
import { evaluate, smilelist } from '@/api/servicingManage/declareDone'
import { getDetail, fetchPrint } from '@/api/allocationProcess/equipRepairAllot'
import { fileList } from '@/api/common/common'
import { baseUrl } from '@/api/common/fileBaseUrl'
export default {
  name: 'myApproval',
  data() {
    return {
      needFlag: true,
      // 表格数据
      tableKey: 0,
      needList: [],
      doneList: [],
      listLoading: false,
      total: 0,
      value01: undefined,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        startDate: undefined,
        endDate: undefined,
        handleType: 0
      },
      activeName1: 'first',
      // 调拨单
      temp: {},
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        allot: '查看设备调拨单',
        repair: '查看设备维修出厂单',
        migration: '查看设备厂内迁移单',
        toRepairs: '查看设备报修单'
      },
      printDialogVisible: false, // 打印
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
        zcbfbzDate: null,
        drbm: null,
        drbmOpinion: null,
        drbmDate: null
      },
      lcData: [],
      activeName: 'first',
      formId: undefined,
      formMessageId: undefined,
      // 文件数据
      fileData: [],
      documentWordCode: undefined, // 单据编号
      // 设备报修单
      smallslist: [], // 第一个小表格
      srintList: {
        repairSuggest: ''
      },
      dtoList: {},
      fixing: '', // 设备科
      fixingName: '', // 设备科签字
      fixingDate: '',

      factoryst: '', // 厂长
      factorystName: '', // 厂长签字
      factorystDate: '',

      propertyst: '', // 资产
      propertystName: '', // 资产签字
      propertystDate: '',

      enterprise: '', // 事业部
      enterpriseName: '', // 事业部签字
      enterpriseDate: '',
      suggestShow: false,
      sugg: false,
      rules: {
        transferOutCompanyName: [{ required: true, message: '请引用报修设备', trigger: 'change' }],
        transferOutFactoryName: [{ required: true, message: '请引用报修设备', trigger: 'change' }],
        transferOutDepartmentName: [{ required: true, message: '请引用报修设备', trigger: 'change' }],
        transferInCompanyName: [{ required: true, message: '请选择调入公司', trigger: 'change' }],
        transferInFactoryName: [{ required: true, message: '请选择调入工厂', trigger: 'change' }],
        transferInDepartmentName: [{ required: true, message: '请选择调入部门', trigger: 'change' }],
        equipName: [{ required: true, message: '请输入设备名称', trigger: 'change' }],
        equipType: [{ required: true, message: '请输入型号规格', trigger: 'change' }],
        fixedAssetCode: [{ required: true, message: '请输入固定资产编号', trigger: 'change' }],
        serialNumber: [{ required: true, message: '请输入出厂编号', trigger: 'change' }],
        manufacturer: [{ required: true, message: '请输入制造厂家', trigger: 'change' }],
        usedPeriod: [{ required: true, message: '请输入已用年限', trigger: 'change' }],
        nums: [{ required: true, message: '请输入数量', trigger: 'change' }],
        reason: [{ required: true, message: '请输入出厂原因', trigger: 'change' }]
      },
      rules1: {
        equipmentName: [{ required: true, message: '请填写', trigger: 'change' }],
        model: [{ required: true, message: '请填写', trigger: 'change' }],
        repairCompany: [{ required: true, message: '请填写', trigger: 'change' }],
        repairFactory: [{ required: true, message: '请填写', trigger: 'change' }],
        repairDivision: [{ required: true, message: '请填写', trigger: 'change' }],
        causeReason: [{ required: true, message: '请填写', trigger: 'change' }],
        fixedAssetCode: [{ required: true, message: '请填写', trigger: 'change' }],
        requestDate: [{ required: true, message: '请填写', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 日期搜索
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
    getList() {
      this.tableData = []
      this.listLoading = true
      getFormList(this.listQuery).then(response => {
        if (response.data.code === 200) {
          if (response.data.data != null) {
            if (this.listQuery.handleType == 0) {
              this.needList = response.data.data.list
              this.total = response.data.data.total
            } else if (this.listQuery.handleType == 1) {
              this.doneList = response.data.data.list
              this.total = response.data.data.total
            }
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
    handleClick(tab, event) {
      this.total = 0
      if (tab.label == '已办') {
        this.listQuery = {
          pageNum: 1,
          pageSize: 10,
          title: undefined,
          startDate: undefined,
          endDate: undefined,
          handleType: 1
        }
        this.needFlag = false
        this.getList()
      } else if (tab.label == '待办') {
        this.listQuery = {
          pageNum: 1,
          pageSize: 10,
          title: undefined,
          startDate: undefined,
          endDate: undefined,
          handleType: 0
        }
        this.needFlag = true
        this.getList()
      }
    },
    needDetail(row) {
      console.log(row)
      switch (row.moduleType) {
        case 1: // 设备备案单
          this.$router.push({ path: '/equipRecord/equipGtask', name: 'equipGtask' })
          break
        case 2: // 设备采购单
          this.$router.push({ path: '/equipPurchase/equipPurchaseGtask', name: 'equipPurchaseGtask' })
          break
        case 3: // 设备报修单
          this.$router.push({ path: '/servicingManage/declarecTobedone', name: 'declarecTobedone' })
          break
        case 4: // 设备维修验收记录单
          this.$router.push({ path: '/servicingManage/labelsheetTobedone', name: 'labelsheetTobedone' })
          break
        case 5: // 设备维修质保确认单
          this.$router.push({ path: '/servicingManage/hconfirmsheetTobedone', name: 'hconfirmsheetTobedone' })
          break
        // case 6:
        //   this.$router.push({path: '',name: ''})
        // break;
        case 7: // 设备维修出厂单
          this.$router.push({ path: '/allocationProcess/equipRepairNeed', name: 'equipRepairNeed' })
          break
        case 8: // 设备调拨单
          this.$router.push({ path: '/allocationProcess/equipAllotNeed', name: 'equipAllotNeed' })
          break
        case 9: // 设备厂内迁移单
          this.$router.push({ path: '/allocationProcess/migrationbTobedone', name: 'migrationbTobedone' })
          break
        case 10: // 设备调拨质量信息报告
          this.$router.push({ path: '/allocationProcess/qualitybTobedone', name: 'qualitybTobedone' })
          break
        case 11: // 设备配件
          this.$router.push({ path: '/equipSpareParts/addPartsApplyNeed', name: 'addPartsApplyNeed' })
          break
        case 12: // 新设备评价表
          this.$router.push({ path: '/equipMent/equipEvaluateGtask', name: 'equipEvaluateGtask' })
          break
        case 13: // 新设备移交单
          this.$router.push({ path: '/equipMent/equipTransferGtask', name: 'equipTransferGtask' })
          break
        case 14: // 新设备验收单
          this.$router.push({ path: '/equipMent/newSeconduct', name: 'newSeconduct' })
          break
        case 15: // 设备质保验收单
          this.$router.push({ path: '/equipMent/pfixSeconduct', name: 'pfixSeconduct' })
          break
        case 16: // 设备闲置申请单
          this.$router.push({ path: '/idleProcess/equipIdleApplyNeed', name: 'equipIdleApplyNeed' })
          break
        case 17: // 电机处置评审单
          this.$router.push({ path: '/idleProcess/motorDisReviewNeed', name: 'motorDisReviewNeed' })
          break
        case 18: // 闲置设备启动申请单
          this.$router.push({ path: '/idleProcess/idleStartApplyNeed', name: 'idleStartApplyNeed' })
          break
        case 19: // 闲置设备处置申请单
          this.$router.push({ path: '/idleProcess/idleaTobedone', name: 'idleaTobedone' })
          break
        case 23: // 设备改造备案单
          this.$router.push({ path: '/equipRemould/remouldNeed', name: 'remouldNeed' })
          break
        case 24: // 设备改造质保验收单
          this.$router.push({ path: '/equipRemould/remakevwatoBedone', name: 'remakevwatoBedone' })
          break
        case 25: // 设备改造验收单
          this.$router.push({ path: '/equipRemould/remakeTobedone', name: 'remakeTobedone' })
          break
        // v1.4.0添加开箱验收单审核流程zrj
        case 27: // 开箱验收单待办
          this.$router.push({ path: '/equipMent/openboxTodo', name: 'openboxTodo' })
          break
        case 28: // 进厂维修记录
          this.$router.push({ path: '/equipOutInHouse/entryMaintenanceNeed', name: 'entryMaintenanceNeed' })
          break
        case 29: // 退货出厂
          this.$router.push({ path: '/equipMent/returnRequestNeed', name: 'returnRequestNeed' })
          break
        case 30: // 设备采购备案
          this.$router.push({ path: '/equipOutInHouse/procurementFilingNeed', name: 'procurementFilingNeed' })
          break
        case 31: // 闲置设备出厂单
          this.$router.push({ path: '/equipMent/outOfFactoryNeed', name: 'outOfFactoryNeed' })
          break
        case 32: // 夹具采购申请单
          this.$router.push({ path: '/toolFixtureManagement/clampPurchaseRequestFormNeed', name: 'clampPurchaseRequestFormNeed' })
          break
        case 33: // 夹具开箱验收单
          this.$router.push({ path: '/toolFixtureManagement/openBoxAcceptanceNeed', name: 'openBoxAcceptanceNeed' })
          break
        case 20: // 调拨单发送通知
          this.dialogStatus = 'allot'
          this.formId = row.formId
          this.formMessageId = row.id
          this.documentWordCode = row.formCode // 单据编号
          this.handleDetail()
          this.getFileList()
          break
        case 21: // 厂内迁移单发送通知
          this.dialogStatus = 'migration'
          this.formId = row.formId
          this.formMessageId = row.id
          this.handleDetail()
          break
        case 22: // 维修出厂单发送通知
          this.dialogStatus = 'repair'
          this.formId = row.formId
          this.formMessageId = row.id
          this.handleDetail()
          break
        case 26: // 报修单发送通知
          this.dialogStatus = 'toRepairs'
          this.formId = row.formId
          this.formMessageId = row.id
          this.documentWordCode = row.formCode // 单据编号
          this.checkDetails()
          break
      }
    },
    doneDetail(row) {
      switch (row.moduleType) {
        case 1:
          this.$router.push({ path: '/equipRecord/equipHaveDone', name: 'equipHaveDone' })
          break
        case 2:
          this.$router.push({ path: '/equipPurchase/equipPurchaseHaveDone', name: 'equipPurchaseHaveDone' })
          break
        case 3:
          this.$router.push({ path: '/servicingManage/declareDone', name: 'declareDone' })
          break
        case 4:
          this.$router.push({ path: '/servicingManage/labelsheetuDone', name: 'labelsheetuDone' })
          break
        case 5:
          this.$router.push({ path: '/servicingManage/hconfirmsheetuDone', name: 'hconfirmsheetuDone' })
          break
        // case 6:
        //   this.$router.push({path: '',name: ''})
        // break;
        case 7:
          this.$router.push({ path: '/allocationProcess/equipRepairDone', name: 'equipRepairDone' })
          break
        case 8:
          this.$router.push({ path: '/allocationProcess/equipAllotDone', name: 'equipAllotDone' })
          break
        case 9:
          this.$router.push({ path: '/allocationProcess/migrationcDone', name: 'migrationcDone' })
          break
        case 10:
          this.$router.push({ path: '/allocationProcess/qualitycDone', name: 'qualitycDone' })
          break
        case 11:
          this.$router.push({ path: '/equipSpareParts/addPartsApplyDone', name: 'addPartsApplyDone' })
          break
        case 12:
          this.$router.push({ path: '/equipMent/equipEvaluateHaveDone', name: 'equipEvaluateHaveDone' })
          break
        case 13:
          this.$router.push({ path: '/equipMent/equipTransferHaveDone', name: 'equipTransferHaveDone' })
          break
        case 14:
          this.$router.push({ path: '/equipMent/newTedone', name: 'newTedone' })
          break
        case 15:
          this.$router.push({ path: '/equipMent/rfixTedone', name: 'rfixTedone' })
          break
        case 16:
          this.$router.push({ path: '/idleProcess/equipIdleApplyDone', name: 'equipIdleApplyDone' })
          break
        case 17:
          this.$router.push({ path: '/idleProcess/motorDisReviewDone', name: 'motorDisReviewDone' })
          break
        case 18:
          this.$router.push({ path: '/idleProcess/idleStartApplyDone', name: 'idleStartApplyDone' })
          break
        case 19:
          this.$router.push({ path: '/idleProcess/idleauDone', name: 'idleauDone' })
          break
        case 23: // 设备改造备案单
          this.$router.push({ path: '/equipRemould/remouldHaveDone', name: 'remouldHaveDone' })
          break
        case 24: // 设备改造质保验收单
          this.$router.push({ path: '/equipRemould/remakevwavDone', name: 'remakevwavDone' })
          break
        case 25: // 设备改造验收单
          this.$router.push({ path: '/equipRemould/remakeuDone', name: 'remakeuDone' })
          break
        case 27: // 开箱验收单已办
          this.$router.push({ path: '/equipMent/pacceptanceDone', name: 'pacceptanceDone' })
          break
        case 28: // 进厂维修记录
          this.$router.push({ path: '/equipOutInHouse/entryMaintenanceDone', name: 'entryMaintenanceDone' })
          break
        case 29: // 退货出厂
          this.$router.push({ path: '/equipMent/returnRequestDone', name: 'returnRequestDone' })
          break
        case 30: // 设备采购备案
          this.$router.push({ path: '/equipMent/procurementFilingDone', name: 'procurementFilingDone' })
          break
        case 31: // 闲置设备出厂单
          this.$router.push({ path: '/equipMent/outOfFactoryDone', name: 'outOfFactoryDone' })
          break
        case 32: // 夹具采购申请单
          this.$router.push({ path: '/toolFixtureManagement/clampPurchaseRequestFormDone', name: 'clampPurchaseRequestFormDone' })
          break
        case 33: // 夹具开箱验收单
          this.$router.push({ path: '/toolFixtureManagement/openBoxAcceptanceDone', name: 'openBoxAcceptanceDone' })
          break
        case 20: // 调拨单发送通知
          this.dialogStatus = 'allot'
          this.formId = row.formId
          this.formMessageId = row.id
          this.documentWordCode = row.formCode // 单据编号
          this.handleDetail()
          this.getFileList()
          break
        case 21: // 厂内迁移单发送通知
          this.dialogStatus = 'migration'
          this.formId = row.formId
          this.formMessageId = row.id
          this.handleDetail()
          break
        case 22: // 维修出厂单发送通知
          this.dialogStatus = 'repair'
          this.formId = row.formId
          this.formMessageId = row.id
          this.handleDetail()
          break
        case 26: // 报修单发送通知
          this.dialogStatus = 'toRepairs'
          this.formId = row.formId
          this.formMessageId = row.id
          this.documentWordCode = row.formCode // 单据编号
          this.checkDetails()
          break
      }
    },
    // 根据编号查看
    handleDetail() {
      // 根据id获取详情
      getDetail(this.formId).then(response => {
        if (response.data.code == 200) {
          this.temp = {}
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
      this.dialogFormVisible = true
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
    // 获取调拨单文件列表
    getFileList() {
      const find = {
        moduleType: '18', // 模块类别
        attachmentCode: 'SBDBDFJ', // 附件编码
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
    // 打印
    printData() {
      this.printList = []
      this.lcData = []
      const params = this.formId
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
            } else if (item.taskName == '调入部门/厂') {
              this.printList.drbm = item.userName
              this.printList.drbmOpinion = item.opinion
              this.printList.drbmDate = item.dateTime
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
      if (this.needFlag == true) {
        this.updateFormData()
      }
    },
    // 报修单
    checkDetails() {
      const find1 = { id: this.formId }
      evaluate(find1).then(response => {
        if (response.data.code == 200) {
          this.temp = {}
          this.lookout = response.data.data.doucument
          this.temp = Object.assign({}, this.lookout)
          if (this.temp.repariDate !== null) {
            this.temp.repariDate = this.temp.repariDate.substring(0, 10)
          }
          if (this.temp.repairSuggest !== null) {
            this.temp.repairSuggest = this.temp.repairSuggest.toString()
          }
        }
      })
      // 附件
      const samllblist = {
        moduleType: 20,
        attachmentCode: 'SBBXDXGZ',
        documentWordCode: this.documentWordCode
      }
      fileList(samllblist).then(response => {
        this.smallslist = response.data.data
      })
      this.activeName = 'first'
      this.dialogFormVisible = true
    },
    // 报修单打印
    printData1() {
      const params = this.documentWordCode
      smilelist(params).then(response => {
        if (response.data.code == 200) {
          this.dtoList = response.data.data.dto
          this.srintList = response.data.data.equipReportDoucument
          this.srintList.repariDate = this.srintList.repariDate.substring(0, 10)
          this.srintList.requestDate = this.srintList.requestDate.substring(0, 10)
          if (this.srintList.repairSuggest == 1) {
            this.suggestShow = false// 不显示
            this.sugg = true
          } else if (this.srintList.repairSuggest == 2) {
            this.suggestShow = true
            this.sugg = false
          } else if (this.srintList.repairSuggest == null) {
            this.suggestShow = false
            this.sugg = false
          }
          for (var i = 0; i < this.dtoList.length; i++) {
            if (this.dtoList[i].taskName == '流程开始') {
              this.fixing = this.dtoList[i].opinion
              this.fixingName = this.dtoList[i].userName
              this.fixingDate = this.dtoList[i].dateTime.substring(0, 10)
            } else if (this.dtoList[i].taskName == '工厂厂长') {
              this.factoryst = this.dtoList[i].opinion
              this.factorystName = this.dtoList[i].userName
              this.factorystDate = this.dtoList[i].dateTime.substring(0, 10)
            } else if (this.dtoList[i].taskName == '资产部审核') {
              this.propertyst = this.dtoList[i].opinion
              this.propertystName = this.dtoList[i].userName
              this.propertystDate = this.dtoList[i].dateTime.substring(0, 10)
            } else if (this.dtoList[i].taskName == '设备副总审核') {
              this.enterprise = this.dtoList[i].opinion
              this.enterpriseName = this.dtoList[i].userName
              this.enterpriseDate = this.dtoList[i].dateTime.substring(0, 10)
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
      this.printDialogVisible = true
      if (this.needFlag == true) {
        this.updateFormData()
      }
    },
    updateFormData() {
      const find2 = {
        id: this.formMessageId // 消息id
        // handleType: 1, // 处理状态 0待办1已办
      }
      updateFormMessage(find2).then(response => {
        if (response.data.code == 200) {
          this.$message({
            title: '成功',
            message: '请求成功',
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
        }
      })
    }
  }
}
</script>
<style scoped>
  .title-header {
    font-size: 20px;
    color: #409eff;
    margin: 20px 0;
    padding-bottom: 10px;
    border-bottom: 1px solid #ddd;
  }
  .formSearch {
    width: 100%;
    background: #fafafa;
    border: 1px solid #e9e9e9;
    border-radius: 3px;
    padding: 18px 10px 0;
  }
  .look-detail:hover{
    font-size: 16px;
  }
  .red-point{
    margin-left: 5px;
    background-color: red; 
    color:white;
    border-radius: 50%;
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
    width:99.5%;
    border-collapse:collapse;
    text-align: center;
  }
  #printTest table thead th{
    font-family:'SimHei';
    font-size: 14px;
  }
  #printTest table tbody tr{
    height: 50px;
    font-size:14px;
  }
  #printTest table tbody tr td{
    border: 1px solid black;
  }
  #printTest table .toRepairs td span{
    margin-right:20px;
  }
</style>