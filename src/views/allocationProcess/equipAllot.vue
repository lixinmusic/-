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
        <el-button class="filter-item" @click="handleCreate" type="primary" v-if="addShow">新增</el-button>
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
          <el-table-column align="center" label="调出公司" prop="transferOutCompanyName">
          </el-table-column>
          <el-table-column align="center" label="调出工厂" prop="transferOutFactoryName">
          </el-table-column>
          <el-table-column align="center" label="调出部门" prop="transferOutDepartmentName">
          </el-table-column>
          <el-table-column align="center" label="调入公司" prop="transferInCompanyName">
          </el-table-column>
          <el-table-column align="center" label="调入工厂" prop="transferInFactoryName">
          </el-table-column>
          <el-table-column align="center" label="调入部门" prop="transferInDepartmentName">
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
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="60%" v-loading="listLoading" 
        v-dialogDrag :close-on-click-modal="false"> 
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="表单信息" name="first">
            <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="110px">
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
                <el-col :span="9" style="padding-right:0px;">
                  <el-form-item label="调入公司" prop="transferInCompanyName">
                    <el-input v-model="temp.transferInCompanyName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2" style="padding:0px;">
                  <el-button type="primary" @click="changeCompany" :disabled="!chooseShow">选择</el-button>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="10" style="padding-right:0px;">
                  <el-form-item label="调入工厂" prop="transferInFactoryName">
                    <el-input v-model="temp.transferInFactoryName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2" style="padding:0px;">
                  <el-button type="primary" @click="changeFactory" :disabled="!chooseShow">选择</el-button>
                </el-col>
                <el-col :span="9" style="padding-right:0px;">
                  <el-form-item label="调入部门" prop="transferInDepartmentName">
                    <el-input v-model="temp.transferInDepartmentName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2" style="padding:0px;">
                  <el-button type="primary" @click="changeDivision" :disabled="!chooseShow">选择</el-button>
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
                <el-input type="textarea" maxlength="200" v-model="temp.remark" :disabled="!chooseShow"></el-input>
              </el-form-item>
              <el-form-item label="调拨原因" prop="reason">
                <el-input type="textarea" maxlength="200" v-model="temp.reason" :disabled="!chooseShow"></el-input>
              </el-form-item>
              <el-form-item label="其他说明" prop="otherDescription">
                <el-input type="textarea" maxlength="200" v-model="temp.otherDescription" :disabled="!chooseShow"></el-input>
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
            <el-button v-if="chooseShow" type="primary" @click="quoteEvaluate">选择设备</el-button>
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
      <!-- 引用台账 -->
      <el-dialog title="选择设备" :visible.sync="centerDialogVisible" width="80%" :close-on-click-modal="false" v-dialogDrag >
        <el-form :inline="true">
          <el-form-item label="设备名称">
            <el-input class="filter-item input" v-model="listQuery1.equipName">
            </el-input>
          </el-form-item>
          <el-form-item label="固定资产编号">
            <el-input class="filter-item input" v-model="listQuery1.fixedAssetCode">
            </el-input>
          </el-form-item>
          <el-form-item label="型号规格">
            <el-input class="filter-item input" v-model="listQuery1.equipType">
            </el-input>
          </el-form-item>
          <el-form-item label="出厂编号">
            <el-input class="filter-item input" v-model="listQuery1.serialNumber">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="filter-item" type="primary" style="float:right" icon="el-icon-search" @click="handleFilter1">搜索</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="infoList" height="360" v-loading="listLoading" 
          ref="multipleTable"
          border fit highlight-current-row
          @select="handleSelect"
          @select-all="handleSelectAll" class="checkboxNoShow">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column  align="center" label="序号" min-width="80" type="index"></el-table-column>
          <el-table-column prop="equipmentName" align="center" label="设备名称"  min-width="120">
          </el-table-column>
          <el-table-column prop="fixedAssetCode" align="center" label="固定资产编号" min-width="80">
          </el-table-column>
          <el-table-column prop="model" align="center" label="型号规格" min-width="80">
          </el-table-column>
          <el-table-column prop="serialNumber" align="center" label="出厂编号" min-width="80">
          </el-table-column>
          <el-table-column prop="companyName" align="center" label="使用公司" min-width="120">
          </el-table-column>
          <el-table-column prop="factoryName" align="center" label="使用工厂" min-width="120">
          </el-table-column>
          <el-table-column prop="divisionName" align="center" label="使用部门" min-width="120">
          </el-table-column>
          <el-table-column prop="equipmentLocation" align="center" label="设备所在地" min-width="80">
          </el-table-column>
          <el-table-column prop="projectExternalName" align="center" label="项目外部名称" min-width="80">
          </el-table-column>
          <el-table-column prop="purchaseEntity" align="center" label="采购主体" min-width="80">
          </el-table-column> 
          <el-table-column prop="purchaseChannel" align="center" label="采购渠道" min-width="80">
          </el-table-column>
          <el-table-column prop="buyers" align="center" label="采购商" min-width="80">
          </el-table-column>
          <el-table-column prop="manufacturer" align="center" label="制造厂家" min-width="80">
          </el-table-column>
          <el-table-column prop="purchaseDate" align="center" label="采购时间" min-width="80">
            <template slot-scope="scope">
            {{scope.row.purchaseDate!=null?scope.row.purchaseDate.substring(0,10):''}}
            </template>
          </el-table-column> 
          <el-table-column prop="equipmentPrice" align="center" label="采购金额" min-width="80">
          </el-table-column>
          <el-table-column prop="changeFixedDate" align="center" label="时间（财务转固）" min-width="80">
            <template slot-scope="scope">
              {{scope.row.changeFixedDate!=null?scope.row.changeFixedDate.substring(0,10):''}}
            </template>
          </el-table-column> 
          <el-table-column prop="depreciationPeriod" align="center" label="折旧年限（财务）" min-width="80">
          </el-table-column>
          <el-table-column prop="isShare" align="center" label="是否共用" min-width="80">
            <template slot-scope="scope">
            {{scope.row.isShare ==0?'否':'是'}}
            </template>
          </el-table-column> 
          <el-table-column prop="equipmentType" align="center" label="设备等级" min-width="80">
            <template slot-scope="scope">
              {{scope.row.equipmentType}}
            </template>
          </el-table-column>
          <el-table-column prop="equipmentStatus" align="center" label="设备状态" min-width="80">
            <template slot-scope="scope">
              {{scope.row.equipmentStatus}}
            </template>
          </el-table-column>    
          <el-table-column prop="applyLdleTime" align="center" label="申请闲置时间" min-width="80">
            <template slot-scope="scope">
              {{scope.row.applyLdleTime!=null?scope.row.applyLdleTime.substring(0,10):''}}
            </template>
          </el-table-column>
          <el-table-column prop="scrapTime" align="center" label="报废时间" min-width="80">
            <template slot-scope="scope">
              {{scope.row.scrapTime!=null?scope.row.scrapTime.substring(0,10):''}}
            </template>
          </el-table-column>
          <el-table-column prop="renovationFee" align="center" label="改造费" min-width="80">
          </el-table-column>
          <el-table-column prop="originalFinancialValue" align="center" label="财务原值" min-width="80">
          </el-table-column>
          <el-table-column prop="netBookValue" align="center" label="账面净值" min-width="80">
          </el-table-column>
          <el-table-column prop="transferDate" align="center" label="调拨日期" min-width="80">
          <template slot-scope="scope">
            {{scope.row.transferDate!=null?scope.row.transferDate.substring(0,10):''}}
            </template>
          </el-table-column>
          <el-table-column prop="transferCompany" align="center" label="调拨后所在公司" min-width="80">
          </el-table-column>
          <el-table-column prop="transferDivision" align="center" label="调拨使用部门" min-width="80">
          </el-table-column>
          <el-table-column prop="cTime" align="center" label="生成时间" min-width="80">
          </el-table-column>           
        </el-table>
        <div class="pagination-container">
          <el-pagination background 
          @size-change="handleSizeChange1" 
          @current-change="handleCurrentChange1" 
          :current-page="listQuery1.pageNum" 
          :page-sizes="[5,10,15, 20]" 
          :page-size="listQuery1.pageSize" 
          layout="total, sizes, prev, pager, next, jumper" 
          :total="total1">
          </el-pagination>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="importOk">确定</el-button>
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
      <el-dialog title="设备调拨单打印预览" v-dialogDrag :close-on-click-modal="false" :visible.sync="printDialogVisible" width="70%">
        <el-button type="primary" @click="printDialogVisible = false">返回</el-button>
        <el-button type="success" v-print="'#printTest'"><svg-icon icon-class="print"/>打印</el-button>
        <div id="printTest">
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
                <!-- <td colspan="2">经办部门/部门领导签字</td> -->
                <td colspan="2">调出厂设备科长签字</td>
                <td colspan="2">设备副总签字</td>
                <td colspan="2">资产部副部长签字</td>
                <td colspan="2">资产部盖章</td>
                <td colspan="2">调入厂设备科长签字</td>
              </tr>
              <tr style="height:80px;text-align:left">
                <td colspan="2" style="border-bottom:1px solid #fff"></td>
                <!-- <td colspan="2" style="border-bottom:1px solid #fff">{{printList.bmjlOpinion}}</td> -->
                <td colspan="2" style="border-bottom:1px solid #fff">{{printList.dcsbkzOpinion}}</td>
                <td colspan="2" style="border-bottom:1px solid #fff">{{printList.sbfzOpinion}}</td>
                <td colspan="2" style="border-bottom:1px solid #fff">{{printList.zcbfbzOpinion}}</td>
                <td colspan="2" style="border-bottom:1px solid #fff"></td>
                <td colspan="2" style="border-bottom:1px solid #fff">{{printList.drbmOpinion}}</td>
              </tr>
              <tr style="text-align:left">
                <td colspan="2">经办人：{{printList.fqr}}</td>
                <!-- <td colspan="2">经办人：{{printList.bmjl}}</td> -->
                <td colspan="2">经办人：{{printList.dcsbkz}}</td>
                <td colspan="2">经办人：{{printList.sbfz}}</td>
                <td colspan="2">经办人：{{printList.zcbfbz}}</td>
                <td colspan="2">经办人：</td>
                <td colspan="2">经办人：{{printList.drbm}}</td>
              </tr>
              <tr style="text-align:left">
                <td colspan="2" style="border-top:1px solid #fff">
                  日期：{{printList.fqrDate!=null?printList.fqrDate.substring(0,10):''}}</td>
                <!-- <td colspan="2" style="border-top:1px solid #fff">
                  日期：{{printList.bmjlDate!=null?printList.bmjlDate.substring(0,10):''}}</td> -->
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
	    </el-dialog>
    </el-container>
  </div>
</template>

<script>
import { fetchList, getDetail, saveFrom, submitForm, delById, fetchInfoList, fetchPrint } from '@/api/allocationProcess/equipRepairAllot'
import { menuList } from '@/store/modules/permission'
import { fetchButton } from '@/api/common/button'
import { commonOptions, fileList, recordList, processChart, fetchComTree, fetchOrgTree, fetchComByCode, getProxyOrgList, getCurrentUser } from '@/api/common/common'
import { baseUrl } from '@/api/common/fileBaseUrl'
export default {
  name: 'equipAllot',
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
      printShow: false,
      chartData: null, // 流程图
      // 表格数据
      tableKey: 0,
      listLoading: false,
      tableData: [],
      total: null,
      value01: undefined,
      // 定义当前时间
      year: undefined,
      // 弹框表格数据
      infoList: [],
      total1: null,
      listQuery1: {
        pageNum: 1,
        pageSize: 10,
        type: 2,
        equipName: undefined,
        fixedAssetCode: undefined,
        equipType: undefined,
        serialNumber: undefined
      },
      // 选中的导入信息
      selectionArr: [],
      multipleSelection: null,
      checkedIndex: '',
      // 审核状态下拉框
      options: commonOptions,
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
        type: 2
      },
      id: undefined,
      temp: {
        id: undefined,
        repairDocumentId: undefined, // 维修单id
        formCode: undefined, // 单据编号
        applicationTime: undefined, // 申请时间

        nums: undefined, // 数量
        transferOutCompany: undefined, // 调出公司
        transferOutCompanyName: undefined, // 调出公司名称
        transferOutFactory: undefined,
        transferOutFactoryName: undefined,
        transferOutDepartment: undefined,
        transferOutDepartmentName: undefined,
        transferInCompany: undefined,
        transferInCompanyName: undefined,
        transferInFactory: undefined,
        transferInFactoryName: undefined,
        transferInDepartment: undefined,
        transferInDepartmentName: undefined,
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
        type: 2,
        proxyOrgCode: undefined, // 代理组织
        proxyOrgName: undefined
      },
      dialogFormVisible: false,
      centerDialogVisible: false,
      // 公司（工厂）
      j: 0,
      companyVisible: false,
      factoryVisible: false,
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
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增',
        detail: '查看设备调拨单'
      },
      dialogStatus1: '',
      textMap1: {
        company: '选择公司',
        factory: '选择工厂'
      },
      // 文件数据
      fileData: [],
      documentWordCode: undefined, // 单据编号
      processInstanceId: undefined, // 流程实例id
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
        zcbfbzDate: null,
        drbm: null,
        drbmOpinion: null,
        drbmDate: null
      },
      printId: '',
      lcData: [],
      // 流转记录
      activeName: 'first',
      recordShow: false,
      recordData: null,
      rules: {
        transferOutCompanyName: [{ required: true, message: '请选择设备', trigger: 'change' }],
        transferOutFactoryName: [{ required: true, message: '请选择设备', trigger: 'change' }],
        transferOutDepartmentName: [{ required: true, message: '请选择设备', trigger: 'change' }],
        transferInCompanyName: [{ required: true, message: '请选择调入公司', trigger: 'change' }],
        transferInFactoryName: [{ required: true, message: '请选择调入工厂', trigger: 'change' }],
        transferInDepartmentName: [{ required: true, message: '请选择调入部门', trigger: 'change' }],
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
    this.getButton()
    this.getDate()
  },
  methods: {
    // 获取当前时间
    getDate() {
      var date = new Date()
      this.year = date.getFullYear()
    },
    getButton() {
      menuList.forEach(item => {
        item.children.forEach(e => {
          if (e.name == 'equipAllot') {
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
    // 弹框页面表格加载
    getInfoList() {
      this.multipleSelection = ''
      this.checkedIndex = ''
      this.listLoading = true
      fetchInfoList(this.listQuery1).then(response => {
        if (response.data.code === 200) {
          this.infoList = response.data.data.results
          this.total1 = response.data.data.total
          for (var i = 0; i < this.infoList.length; i++) {
            if (this.infoList[i].equipmentStatus == '2') {
              this.infoList[i].equipmentStatus = '完好'
            } else if (this.infoList[i].equipmentStatus == '4') {
              this.infoList[i].equipmentStatus = '闲置完好'
            }
            if (this.infoList[i].equipmentType == 1) {
              this.infoList[i].equipmentType = '一般设备'
            } else if (this.infoList[i].equipmentType == 2) {
              this.infoList[i].equipmentType = '关键设备'
            } else if (this.infoList[i].equipmentType == 3) {
              this.infoList[i].equipmentType = '特殊设备'
            }
            if (this.infoList[i].purchaseChannel == 1) {
              this.infoList[i].purchaseChannel = '自制设备'
            } else if (this.infoList[i].purchaseChannel == 2) {
              this.infoList[i].purchaseChannel = '外购设备'
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
    handleFilter1() {
      this.listQuery1.pageNum = 1
      this.getInfoList()
    },
    // 分页
    handleSizeChange1(val) {
      this.listQuery1.pageSize = val
      this.getInfoList()
    },
    handleCurrentChange1(val) {
      this.listQuery1.pageNum = val
      this.getInfoList()
    },
    // 弹框表格被选择
    handleSelect(val, row) {
      if (val.length > 1) {
        this.$refs.multipleTable.clearSelection() // 清空所有选择
        val.shift()
        this.$refs.multipleTable.toggleRowSelection(row) //  选中当前选择
      }
      this.selectionArr = val
      this.multipleSelection = row
      this.checkedIndex = val.length
    },
    handleSelectAll(val) {
      this.$message({
        title: '警告',
        message: '请选择一条要引用的信息',
        type: 'warning',
        duration: 2000
      })
    },
    // 引入确认
    importOk() {
      if (this.checkedIndex != 1) {
        this.$message({
          title: '警告',
          message: '请选择一条要引用的信息',
          type: 'warning',
          duration: 2000
        })
        return
      }
      this.centerDialogVisible = false
      this.temp.repairDocumentId = this.multipleSelection.id
      this.temp.fixedAssetCode = this.multipleSelection.fixedAssetCode
      this.temp.transferOutCompanyName = this.multipleSelection.companyName
      this.temp.transferOutCompany = this.multipleSelection.companyCode
      this.temp.transferOutFactoryName = this.multipleSelection.factoryName
      this.temp.transferOutFactory = this.multipleSelection.factoryCode
      this.temp.transferOutDepartmentName = this.multipleSelection.divisionName
      this.temp.transferOutDepartment = this.multipleSelection.divisionCode

      this.temp.equipName = this.multipleSelection.equipmentName
      this.temp.equipType = this.multipleSelection.model
      this.temp.nums = 1
      this.temp.manufacturer = this.multipleSelection.manufacturer
      this.temp.serialNumber = this.multipleSelection.serialNumber
      this.temp.depreciationPeriod = this.multipleSelection.depreciationPeriod
      this.temp.usedPeriod = this.multipleSelection.usedPeriod
      this.temp.originalFinancialValue = this.multipleSelection.originalFinancialValue
      this.temp.netBookValue = this.multipleSelection.netBookValue
    },
    // 设置公司/工厂组织树状图单选
    handleChange1(data, checked, node) {
      this.j++
      if (this.j % 2 == 0) {
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
      this.j = 0
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
      this.temp.transferInCompanyName = this.getCompanyName
      this.temp.transferInCompany = this.getCompanyCode
      this.temp.transferInFactoryName = undefined
      this.temp.transferInDepartmentName = undefined
      this.companyVisible = false
    },
    // 选择使用工厂
    changeFactory() {
      this.j = 0
      this.dialogStatus1 = 'factory'
      this.getCompanyCode = undefined
      this.getCompanyName = undefined
      this.companyData = []
      const find = {
        orgCode: this.temp.transferInCompany
      }
      fetchComByCode(find).then(response => {
        if (response.data.code === 200) {
          this.companyData.push(response.data.data)
          for (var i = 0; i < this.companyData.length; i++) {
            if (this.companyData[i].orgType == '部门') {
              this.companyData[i].disabled = true
            }
            for (var j = 0; j < this.companyData[i].children.length; j++) {
              const child = this.companyData[i].children[j]
              if (child.orgType == '部门') {
                child.disabled = true
              }
              if (child.children !== null) {
                for (var p = 0; p < child.children.length; p++) {
                  if (child.children[p].orgType == '部门') {
                    child.children[p].disabled = true
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
      this.temp.transferInFactoryName = this.getCompanyName
      this.temp.transferInFactory = this.getCompanyCode

      this.temp.transferInDepartmentName = undefined
      this.companyVisible = false
    },
    // 选择使用部门
    changeDivision() {
      this.getOrgCode = undefined
      this.getOrgName = undefined
      this.orgData = []
      const find1 = {
        orgCode: this.temp.transferInFactory
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
    // 获取部门被选择的节点
    getCheckedNodes() {
      this.treeData = this.$refs.tree.getCheckedNodes()
      this.getOrgCode = this.treeData[0].orgCode
      this.getOrgName = this.treeData[0].orgFullName
    },
    // 点击选择部门确认
    handleClick2() {
      this.getCheckedNodes()
      this.temp.transferInDepartmentName = this.getOrgName
      this.temp.transferInDepartment = this.getOrgCode
      this.divisionVisible = false
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
      this.recordShow = true
      this.chooseShow = false
      this.printShow = false
      this.documentWordCode = row.formCode // 单据编号
      if (row.auditingType == '审核通过') {
        this.printShow = true
      }
      this.dialogFormVisible = true
      this.id = row.id
      // 流转记录
      this.processInstanceId = row.processInstanceId
      this.getFileList()
    },
    // 获取文件列表
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
        repairDocumentId: undefined, // 维修单id
        formCode: undefined, // 单据编号
        applicationTime: undefined, // 申请时间

        nums: undefined, // 数量
        transferOutCompany: undefined, // 调出公司
        transferOutCompanyName: undefined, // 调出公司名称
        transferOutFactory: undefined,
        transferOutFactoryName: undefined,
        transferOutDepartment: undefined,
        transferOutDepartmentName: undefined,
        transferInCompany: undefined,
        transferInCompanyName: undefined,
        transferInFactory: undefined,
        transferInFactoryName: undefined,
        transferInDepartment: undefined,
        transferInDepartmentName: undefined,
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
        type: 2,
        proxyOrgCode: undefined, // 代理组织
        proxyOrgName: undefined
      }
      this.fileData = []
    },
    // 新增
    handleCreate() {
      this.resetTemp()
      this.activeName = 'first'
      this.dialogStatus = 'create'
      this.chooseShow = true
      this.recordShow = false
      this.dialogFormVisible = true
      this.getUser()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 引用台账
    quoteEvaluate() {
      this.listQuery1 = {
        pageNum: 1,
        pageSize: 10,
        type: 2,
        equipName: undefined,
        fixedAssetCode: undefined,
        equipType: undefined,
        serialNumber: undefined
      }
      this.centerDialogVisible = true
      this.getInfoList()
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
    // 新增保存
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
    // 新增提交
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
    // 编辑
    handleUpdate(row) {
      const id = row.id
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
      this.dialogStatus = 'update'
      this.recordShow = false
      this.chooseShow = true
      this.dialogFormVisible = true
      this.id = row.id
      this.getUser()
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
        this.updataSubmit()
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
    // tabs 点击事件
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

