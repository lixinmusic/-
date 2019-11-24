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
            <el-input class="filter-item input" v-model="listQuery.equipmentName">
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
          <el-table-column align="center" label="固定资产编号" >
            <template slot-scope="scope">
              <span>{{scope.row.fixedAssetCode}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="使用公司" >
            <template slot-scope="scope">
              <span>{{scope.row.companyName}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="使用工厂" >
            <template slot-scope="scope">
              <span>{{scope.row.factoryName}}</span>
            </template>
          </el-table-column>
          
          <el-table-column align="center" label="申请日期" >
            <template slot-scope="scope">
              <span>{{scope.row.applyDate}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="设备名称" >
            <template slot-scope="scope">
              <span>{{scope.row.equipmentName}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="型号规格" >
            <template slot-scope="scope">
              <span>{{scope.row.model}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="使用部门" >
            <template slot-scope="scope">
              <span>{{scope.row.divisionName}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="启动安装位置" >
            <template slot-scope="scope">
              <span>{{scope.row.installPlaceName}}</span>
            </template>
          </el-table-column>
          
          <el-table-column prop="" align="center" label="审核状态" >
            <template slot-scope="scope">
              <span>{{scope.row.auditingType}}</span>
            </template>
          </el-table-column>
           <el-table-column prop="" align="center" label="当前处理人" >
            <template slot-scope="scope">
              <span>{{scope.row.auditingUser}}</span>
            </template>
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
                <span class="equip-title">闲置设备启动申请单</span>
              </el-form-item>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="单据编号" prop="formCode">
                    <el-input v-model="temp.formCode" disabled></el-input>
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
                  <el-form-item label="使用公司" prop="companyName">
                    <el-input v-model="temp.companyName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="2" style="padding:0px;">
                  <el-button type="primary" @click="changeCompany" :disabled="!chooseShow">选择</el-button>
                </el-col> -->
                <el-col :span="12">
                  <el-form-item label="使用工厂" prop="factoryName">
                    <el-input v-model="temp.factoryName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="2" style="padding-left:0px;">
                  <el-button type="primary" @click="changeFactory" :disabled="!chooseShow">选择</el-button>
                </el-col> -->
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="申请日期" prop="applyDate">
                    <el-date-picker style="width:100%"
                      v-model="temp.applyDate"
                      type="date" disabled>
                    </el-date-picker>
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
                  <el-form-item label="型号规格" prop="model">
                    <el-input v-model="temp.model" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="数量" prop="number">
                    <el-input v-model="temp.number" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="原使用工厂" prop="originalFactoryName">
                    <el-input v-model="temp.originalFactoryName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="原使用部门" prop="originalDivisionName">
                    <el-input v-model="temp.originalDivisionName" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="10" style="padding-right:0px;">
                  <el-form-item label="使用部门" prop="divisionName">
                    <el-input v-model="temp.divisionName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2" style="padding:0px;">
                  <el-button type="primary" @click="changeDivision" :disabled="!chooseShow">选择</el-button>
                </el-col>
                <el-col :span="9" style="padding-right:0px;">
                  <el-form-item label="启动安装位置" prop="installPlaceName">
                    <el-input v-model="temp.installPlaceName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2" style="padding:0px;">
                  <el-button type="primary" @click="changePlace" :disabled="!chooseShow">选择</el-button>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="制造厂家(制造部门)" prop="manufacturer">
                    <el-input v-model="temp.manufacturer" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="出厂编号" prop="serialNumber">
                    <el-input v-model="temp.serialNumber" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="申请启动理由" prop="applyReason">
                <el-input type="textarea" maxlength="200" v-model="temp.applyReason" :disabled="!chooseShow"></el-input>
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
            <el-button v-if="chooseShow" type="primary" @click="quoteEvaluate">引用闲置设备</el-button>
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
      <!-- 引用闲置设备 -->
      <el-dialog title="引用闲置设备" :visible.sync="centerDialogVisible" width="80%" :close-on-click-modal="false" v-dialogDrag>
        <el-form :inline="true">
          <el-form-item label="设备名称">
            <el-input class="filter-item input" v-model="listQuery1.equipmentName">
            </el-input>
          </el-form-item>
          <el-form-item label="固定资产编号">
            <el-input class="filter-item input" v-model="listQuery1.fixedAssetCode">
            </el-input>
          </el-form-item>
          <el-form-item label="型号规格">
            <el-input class="filter-item input" v-model="listQuery1.model">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="filter-item" type="primary" style="float:right" icon="el-icon-search" @click="handleFilter1">搜索</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="infoList" height="500" v-loading="listLoading" 
          ref="multipleTable"
          border fit highlight-current-row
          @select="handleSelect"
          @select-all="handleSelectAll"
          @selection-change="handleSelectionChange">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" label="序号" min-width="80" type="index"></el-table-column>
          <el-table-column prop="equipmentName" align="center" label="设备名称"  min-width="120">
          </el-table-column>
          <el-table-column prop="fixedAssetCode" align="center" label="固定资产编号" min-width="80">
          </el-table-column>
          <el-table-column prop="model" align="center" label="型号规格" min-width="80">
          </el-table-column>
          <el-table-column prop="serialNumber" align="center" label="出厂编号" min-width="80">
          </el-table-column>
          <el-table-column prop="assetOwnershipCompanyName" align="center" label="资产归属公司" min-width="80">
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
            <template slot-scope="scope">
            {{scope.row.purchaseChannel==1?'自制设备':'外购设备'}}
            </template>
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
          </el-table-column>
          <el-table-column prop="equipmentStatus" align="center" label="设备状态" min-width="80">
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
      <el-dialog width="40%" :title="textMap1[dialogStatus1]" :visible.sync="companyVisible" append-to-body :close-on-click-modal="false" v-dialogDrag>
        <el-container>
          <el-aside width="500px">
            <span style="margin-left:20px;color:red">{{getCompanyName}}</span>
            <el-tree :data="companyData" :props="defaultProps1" node-key='orgCode' @node-click="handleNodeClick1"></el-tree>
          </el-aside>
        </el-container>
        <div slot="footer" class="dialog-footer">
          <el-button @click="companyVisible = false" type="default">取消</el-button>
          <el-button v-if="dialogStatus1=='company'" type="primary" @click="handleClickCompany">确定</el-button>
          <el-button v-if="dialogStatus1=='factory'" type="primary" @click="handleClickFactory">确定</el-button>
        </div>
      </el-dialog>
      <!-- 选择使用部门 -->
      <el-dialog width="50%" title="选择使用部门" :visible.sync="divisionVisible" append-to-body :close-on-click-modal="false" v-dialogDrag>
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
      <!-- 选择设备地址 -->
      <el-dialog width="50%" title="选择位置" :visible.sync="equipVisible" append-to-body :close-on-click-modal="false" v-dialogDrag>
        <el-container>
          <el-aside width="500px">
            <span style="margin-left:20px;color:red" prop='getEquipTypeName'>{{getEquipTypeName}}</span>
            <el-tree 
            :data="equipData" 
            :props="defaultProps" 
            @node-click="handleNodeClick"></el-tree>
          </el-aside>
        </el-container>
        <div slot="footer" class="dialog-footer">
          <el-button @click="equipVisible= false">取消</el-button>
          <el-button @click="handleClickOk" type="primary">确定</el-button>
        </div>
      </el-dialog>
      <!-- 打印 -->
			<el-dialog title="闲置设备启动申请单打印预览" :close-on-click-modal="false" :visible.sync="printDialogVisible" width="60%" v-dialogDrag>
        <el-button type="primary" @click="printDialogVisible = false">返回</el-button>
        <el-button type="success" v-print="'#printTest'"><svg-icon icon-class="print"/>打印</el-button>
				<div id="printTest">
          <center>
					<table border= "0">
            <caption style="font-size: 30px;padding-top:20px;padding-bottom:20px; font-weight:800">闲置设备启用申请单</caption>
            <thead>
              <tr>
                <th colspan="2">使用公司：{{printList.companyName}}</th>
                <th colspan="2">使用工厂：{{printList.factoryName}}</th>
                <th colspan="2">日期：{{printList.applyDate!=null?printList.applyDate.substring(0,10):''}}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>设备名称</td>
                <td>{{printList.equipmentName}}</td>
                <td>型号规格</td>
                <td>{{printList.model}}</td>
                <td>数量</td>
                <td >{{printList.number}}</td>
              </tr>
              <tr>
                <td>原使用工厂/车间</td>
                <td>{{printList.originalFactoryName}}</td>
                <td>使用部门</td>
                <td>{{printList.divisionName}}</td>
                <td>启动安装位置</td>
                <td>{{printList.installPlaceName}}</td>
              </tr>
              <tr>
                <td>制造厂家（制作部门）</td>
                <td>{{printList.manufacturer}}</td>
                <td>固定资产编号</td>
                <td>{{printList.fixedAssetCode}}</td>
                <td>出厂编码</td>
                <td>{{printList.serialNumber}}</td>
              </tr>
              <tr style="height:150px;">
                <td style="position: relative;" colspan="6">
                  <span style="position: absolute;left:5px;top:5px;">申请启动理由：<span style="font-size:14px;">{{printList.applyReason}}</span></span>
                  <span style="position: absolute;right:50px;bottom:20px;">申请人：{{printList.sqr}}</span>
                  </td>
              </tr>
              <tr style="height:60px;">
                <td>负责人</td>
                <td colspan="2">申请部门</td>
                <td colspan="3">资产部</td>
              </tr>
              <tr style="height:130px;">
                <td>意见</td>
                <td colspan="2"></td>
                <td colspan="3">{{printList.zcbOpinion}}</td>
              </tr>
              <tr style="height:70px;">
                <td>签名</td>
                <td colspan="2">{{printList.sqr}}</td>
                <td colspan="3">{{printList.zcb}}</td>
              </tr>
              <tr style="height:70px;">
                <td>日期</td>
                <td colspan="2">{{printList.applyDate!=null?printList.applyDate.substring(0,10):''}}</td>
                <td colspan="3">{{printList.zcbDate!=null?printList.zcbDate.substring(0,10):''}}</td>
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
import { fetchList, getDetail, saveFrom, submitForm, delById, fetchInfoList, fetchTree, fetchPrint } from '@/api/idleProcess/idleStartApply'
import { commonOptions, recordList, getCurrentUser, fetchComTree, fetchChooseTree, processChart, getProxyOrgList } from '@/api/common/common'
import { menuList } from '@/store/modules/permission'
import { fetchButton } from '@/api/common/button'
export default {
  name: 'idleStartApply',
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

      // 弹框表格数据
      infoList: [],
      total1: null,
      listQuery1: {
        pageNum: 1,
        pageSize: 10,
        equipmentName: undefined,
        fixedAssetCode: undefined,
        model: undefined
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
        equipmentName: undefined,
        auditingType: undefined,
        applyDateStart: undefined,
        applyDateEnd: undefined
      },
      id: undefined,
      temp: {
        id: undefined,
        accountId: undefined,
        unusedFormId: undefined, // 设备闲置单id
        formCode: undefined, // 单据编号
        applyDate: undefined, // 申请日期
        companyCode: undefined,
        companyName: undefined,
        factoryCode: undefined,
        factoryName: undefined,
        divisionCode: undefined,
        divisionName: undefined,
        installPlaceCode: undefined,
        installPlaceName: undefined,

        applyReason: undefined, // 申请启动理由
        number: undefined, // 数量

        fixedAssetCode: undefined, // 固定资产编码
        equipmentName: undefined, // 设备名称
        originalFactoryName: undefined, // 原使用工厂
        originalDivisionName: undefined, // 原使用部门
        originalDivisionCode: undefined,
        model: undefined, // 规格型号
        manufacturer: undefined, // 制造厂家
        serialNumber: undefined, // 出厂编码
        proxyOrgCode: undefined, // 代理组织
        proxyOrgName: undefined
      },
      dialogFormVisible: false,
      centerDialogVisible: false,

      // 公司（工厂）
      companyVisible: false,
      factoryVisible: false,
      printDialogVisible: false, // 打印
      printList: {
        sqr: null,
        zcb: null,
        zcbOpinion: null,
        zcbDate: null,
        applyDate: null
      },
      lcData: [],
      // 部门
      i: 0,
      divisionVisible: false,
      companyData: [],
      orgData: [],
      defaultProps1: {
        children: 'children',
        label: 'orgFullName'
      },
      getCompanyName: undefined,
      getCompanyCode: undefined,
      getOrgName: undefined,
      getOrgCode: undefined,
      // 设备地址
      equipVisible: false,
      equipData: [],
      defaultProps: {
        children: 'children',
        label: 'addressName'
      },
      getEquipTypeCode: undefined,
      getEquipTypeName: undefined,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增',
        detail: '查看闲置设备启动申请单',
        company: '选择公司',
        factory: '选择工厂'
      },
      dialogStatus1: '',
      textMap1: {
        company: '选择公司',
        factory: '选择工厂'
      },
      processInstanceId: undefined, // 流程实例id
      // 流转记录
      activeName: 'first',
      recordShow: false,
      recordData: null,
      rules: {
        // formCode: [{ required: true, message: '请输入单据编号', trigger: 'change' }],
        equipmentName: [{ required: true, message: '请输入设备名称', trigger: 'change' }],
        model: [{ required: true, message: '请输入型号规格', trigger: 'change' }],
        fixedAssetCode: [{ required: true, message: '请输入固定资产编号', trigger: 'change' }],
        serialNumber: [{ required: true, message: '请输入出厂编号', trigger: 'change' }],
        // manufacturer: [{ required: true, message: '请输入制造厂家', trigger: 'change' }],
        originalFactoryName: [{ required: true, message: '请引入原使用工厂', trigger: 'change' }],
        originalDivisionName: [{ required: true, message: '请引入原使用部门', trigger: 'change' }],

        companyName: [{ required: true, message: '请选择使用公司', trigger: 'change' }],
        factoryName: [{ required: true, message: '请选择使用工厂', trigger: 'change' }],
        divisionName: [{ required: true, message: '请选择使用部门', trigger: 'change' }],

        number: [{ required: true, message: '请输入数量', trigger: 'change' }],
        applyReason: [{ required: true, message: '请输入申请启动理由', trigger: 'change' }],
        installPlaceName: [{ required: true, message: '请选择安装位置', trigger: 'change' }]
        // applyDate:[{ required: true, message: '请选择申请日期', trigger: 'change' }]
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
          if (e.name == 'idleStartApply') {
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
            if (this.infoList[i].equipmentStatus == '1') {
              this.infoList[i].equipmentStatus = '新设备'
            } else if (this.infoList[i].equipmentStatus == '2') {
              this.infoList[i].equipmentStatus = '完好'
            } else if (this.infoList[i].equipmentStatus == '3') {
              this.infoList[i].equipmentStatus = '维修'
            } else if (this.infoList[i].equipmentStatus == '4') {
              this.infoList[i].equipmentStatus = '闲置完好'
            } else if (this.infoList[i].equipmentStatus == '5') {
              this.infoList[i].equipmentStatus = '闲置待报废'
            } else if (this.infoList[i].equipmentStatus == '6') {
              this.infoList[i].equipmentStatus = '报废'
            } else if (this.infoList[i].equipmentStatus == '7') {
              this.infoList[i].equipmentStatus = '在建工程'
            }
            if (this.infoList[i].equipmentType == 1) {
              this.infoList[i].equipmentType = '一般设备'
            } else if (this.infoList[i].equipmentType == 2) {
              this.infoList[i].equipmentType = '关键设备'
            } else if (this.infoList[i].equipmentType == 3) {
              this.infoList[i].equipmentType = '特殊设备'
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
    handleSelectionChange(val) {

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
      this.temp.accountId = this.multipleSelection.id
      this.temp.unusedFormId = this.multipleSelection.id
      this.temp.fixedAssetCode = this.multipleSelection.fixedAssetCode
      this.temp.equipmentName = this.multipleSelection.equipmentName
      this.temp.originalFactoryName = this.multipleSelection.factoryName // 原使用工厂
      this.temp.originalDivisionName = this.multipleSelection.divisionName // 原使用部门
      this.temp.originalDivisionCode = this.multipleSelection.divisionCode
      this.temp.serialNumber = this.multipleSelection.serialNumber
      this.temp.model = this.multipleSelection.model
      this.temp.manufacturer = this.multipleSelection.manufacturer
      this.temp.number = 1
      this.temp.companyName = this.multipleSelection.companyName // 使用公司
      this.temp.companyCode = this.multipleSelection.companyCode
      this.temp.factoryName = this.multipleSelection.factoryName // 使用工厂
      this.temp.factoryCode = this.multipleSelection.factoryCode
    },
    // 选择使用公司
    changeCompany() {
      this.dialogStatus1 = 'company'
      this.getCompanyCode = undefined
      this.getCompanyName = undefined
      fetchComTree().then(response => {
        this.companyData = []
        this.companyData.push(response.data.data)
      })
      this.companyVisible = true
    },
    // 选择使用工厂
    changeFactory() {
      this.dialogStatus1 = 'factory'
      this.getCompanyCode = undefined
      this.getCompanyName = undefined
      fetchComTree().then(response => {
        this.companyData = []
        this.companyData.push(response.data.data)
      })
      this.companyVisible = true
    },
    // 公司树被点击
    handleNodeClick1(data) {
      this.getCompanyCode = data.orgCode
      this.getCompanyName = data.orgFullName
    },
    // 选择公司确认
    handleClickCompany() {
      this.temp.companyName = this.getCompanyName
      this.temp.companyCode = this.getCompanyCode
      this.companyVisible = false
    },
    // 选择工厂确认
    handleClickFactory() {
      this.temp.factoryName = this.getCompanyName
      this.temp.factoryCode = this.getCompanyCode
      this.companyVisible = false
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
    // 获取部门被选择的节点
    getCheckedNodes() {
      this.treeData = this.$refs.tree.getCheckedNodes()
      this.getOrgCode = this.treeData[0].orgCode
      this.getOrgName = this.treeData[0].orgFullName
    },
    // 点击选择部门确认
    handleClick2() {
      this.getCheckedNodes()
      this.temp.divisionName = this.getOrgName
      this.temp.divisionCode = this.getOrgCode
      this.divisionVisible = false
    },
    // 选择设备地址
    changePlace() {
      fetchTree().then(response => {
        this.equipData = []
        this.equipData = response.data.data[0].children
      })
      this.equipVisible = true
    },
    // 设备地址树
    handleNodeClick(data) {
      this.getEquipTypeCode = data.addressCode
      this.getEquipTypeName = data.addressName
    },
    // 选择设备地址确认
    handleClickOk() {
      this.temp.installPlaceName = this.getEquipTypeName
      this.temp.installPlaceCode = this.getEquipTypeCode
      this.equipVisible = false
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
      if (row.auditingType == '审核通过') {
        this.printShow = true
      }
      this.dialogFormVisible = true
      this.id = row.id
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
        accountId: undefined, // 台账id
        unusedFormId: undefined, // 设备闲置单id
        formCode: undefined, // 单据编号
        applyDate: undefined, // 申请日期
        companyCode: undefined,
        companyName: undefined,
        factoryCode: undefined,
        factoryName: undefined,
        divisionCode: undefined,
        divisionName: undefined,
        installPlaceCode: undefined,
        installPlaceName: undefined,

        applyReason: undefined, // 申请启动理由
        number: undefined, // 数量

        fixedAssetCode: undefined, // 固定资产编码
        equipmentName: undefined, // 设备名称
        originalFactoryName: undefined, // 原使用工厂
        originalDivisionName: undefined, // 原使用部门
        originalDivisionCode: undefined,
        model: undefined, // 规格型号
        manufacturer: undefined, // 制造厂家
        serialNumber: undefined, // 出厂编码
        proxyOrgCode: undefined, // 代理组织
        proxyOrgName: undefined
      }
    },
    // 新增
    handleCreate() {
      this.resetTemp()
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
    // 引用闲置台账
    quoteEvaluate() {
      this.listQuery1 = {
        pageNum: 1,
        pageSize: 10,
        equipmentName: undefined,
        fixedAssetCode: undefined,
        model: undefined
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
          const tempData = {
            id: this.id,
            formCode: this.temp.formCode,
            accountId: this.temp.accountId,
            unusedFormId: this.temp.unusedFormId,
            applyReason: this.temp.applyReason,
            companyCode: this.temp.companyCode,
            companyName: this.temp.companyName,
            factoryCode: this.temp.factoryCode,
            factoryName: this.temp.factoryName,
            divisionCode: this.temp.divisionCode,
            divisionName: this.temp.divisionName,
            installPlaceCode: this.temp.installPlaceCode,
            installPlaceName: this.temp.installPlaceName,
            number: this.temp.number,
            originalDivisionName: this.temp.originalDivisionName,
            originalDivisionCode: this.temp.originalDivisionCode
          }
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
      const tempData = {
        id: this.id,
        formCode: this.temp.formCode,
        accountId: this.temp.accountId,
        unusedFormId: this.temp.unusedFormId,
        applyReason: this.temp.applyReason,
        companyCode: this.temp.companyCode,
        companyName: this.temp.companyName,
        factoryCode: this.temp.factoryCode,
        factoryName: this.temp.factoryName,
        divisionCode: this.temp.divisionCode,
        divisionName: this.temp.divisionName,
        installPlaceCode: this.temp.installPlaceCode,
        installPlaceName: this.temp.installPlaceName,
        number: this.temp.number,
        originalDivisionName: this.temp.originalDivisionName,
        originalDivisionCode: this.temp.originalDivisionCode,
        proxyOrgCode: this.temp.proxyOrgCode, // 代理组织
        proxyOrgName: this.temp.proxyOrgName
      }
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
      const id = this.id
      fetchPrint(id).then(response => {
        if (response.data.code == 200) {
          this.printList = response.data.data
          this.lcData = response.data.data.list
          this.lcData.forEach(item => {
            if (item.taskName == '资产部') {
              this.printList.zcb = item.userName
              this.printList.zcbOpinion = item.opinion
              this.printList.zcbDate = item.dateTime
            } else if (item.taskName == '流程开始') {
              this.printList.sqr = item.userName
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
  text-decoration: underline;
  cursor: pointer;
}
.look-detail:hover{
  color:#20a0ff;
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
  height: 130px;
  text-align: center;
}
#printTest table tbody td{
  border: 1px solid black;
  width: 16.6%;
}
.el-table thead tr .el-checkbox__input{
  display: none;
}
#pic{
  width: 100%;
}
</style>

