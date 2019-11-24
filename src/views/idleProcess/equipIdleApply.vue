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
          <el-table-column align="center" label="出厂编号" >
            <template slot-scope="scope">
              <span>{{scope.row.serialNumber}}</span>
            </template>
          </el-table-column>
          
          <el-table-column prop="" align="center" label="审核状态" >
            <template slot-scope="scope">
              <span>{{scope.row.auditingType}}</span>
            </template>
          </el-table-column>
           <el-table-column prop="" align="center" label="当前处理人" >
            <template slot-scope="scope">
              <span>{{scope.row.checkingUserName}}</span>
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
                <span class="equip-title">设备闲置申请单</span>
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
                <el-col :span="12">
                  <el-form-item label="使用工厂" prop="factoryName">
                    <el-input v-model="temp.factoryName" disabled></el-input>
                  </el-form-item>
                </el-col>
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
                  <el-form-item label="使用部门" prop="divisionName">
                    <el-input v-model="temp.divisionName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="9" style="padding-right:0px;">
                  <el-form-item label="闲置位置" prop="unusedPlace">
                    <el-input v-model="temp.unusedPlace" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="3" style="padding-left:0px;">
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
              <el-row :gutter="20">
                <el-col :span="11">
                  <el-form-item label="闲置天数" prop="unusedDays">
                    <el-input v-model="temp.unusedDays" :disabled="!chooseShow"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="1" style="padding:0px;font-size:20px;font-weight:800;">
                  <span>天</span>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="设备完好情况" prop="equipStatus">
                    <el-radio v-model="temp.equipStatus" label="1" disabled>闲置可用</el-radio>
                    <el-radio v-model="temp.equipStatus" label="2" disabled>闲置待报废</el-radio>	
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="申请闲置理由" prop="applyUnusedReason">
                <el-input type="textarea" maxlength="200" v-model="temp.applyUnusedReason" :disabled="!chooseShow"></el-input>
              </el-form-item>
              <el-row>
                <el-col :span="10">
                  <el-form-item label="附件上传" prop="">
                    <input id="uploadImg1" type="file" @change="fileUpload1" v-if="chooseShow">
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <el-table :data="fileData"
              border fit highlight-current style="width: 60%; margin-left:100px;">
              <el-table-column align="center" label="文件名" >
                <template slot-scope="scope">
                  <span class="look-detail" @click="lookFile(scope.row)">{{scope.row.fileName}}</span>
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
                  <el-button v-if="dialogStatus=='create'" title="删除" type="danger" icon="el-icon-delete" size="mini"  @click="fileDelete(scope.row)"></el-button>
                  <el-button v-if="dialogStatus=='update'" title="删除" type="danger" icon="el-icon-delete" size="mini"  @click="updatefileDelete(scope.row)"></el-button>
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
      <el-dialog title="选择设备" :visible.sync="centerDialogVisible" width="80%" :close-on-click-modal="false" v-dialogDrag>
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
          @select-all="handleSelectAll">
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
          <el-table-column prop="applyLdleTime" align="center" label="申请闲置日期" min-width="80">
          <template slot-scope="scope">
            {{scope.row.applyLdleTime!=null?scope.row.applyLdleTime.substring(0,10):''}}
            </template>
          </el-table-column>
          <el-table-column prop="scrapTime" align="center" label="报废日期" min-width="80">
          <template slot-scope="scope">
            {{scope.row.scrapTime!=null?scope.row.scrapTime.substring(0,10):''}}
            </template>
          </el-table-column>
          <el-table-column prop="renovationFee" align="center" label="改造费（元）" min-width="80">
          </el-table-column>
          <el-table-column prop="originalFinancialValue" align="center" label="财务原值（元）" min-width="80">
          </el-table-column>
          <el-table-column prop="netBookValue" align="center" label="账面净值（元）" min-width="80">
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
            <!-- <template slot-scope="scope">
              {{scope.row.cTime!==null?scope.row.cTime.substring(0,10):''}}
            </template> -->
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
      <!-- 选择设备地址 -->
      <el-dialog width="50%" title="选择闲置位置" :visible.sync="equipVisible" append-to-body :close-on-click-modal="false" v-dialogDrag>
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
			<el-dialog title="设备闲置申请单打印预览" :close-on-click-modal="false" :visible.sync="printDialogVisible" width="60%" v-dialogDrag>
        <el-button type="primary" @click="printDialogVisible = false">返回</el-button>
        <el-button type="success" v-print="'#printTest'"><svg-icon icon-class="print"/>打印</el-button>
				<div id="printTest">
          <center>
					<table border= "0">
            <caption style="font-size: 30px;padding-top:20px;padding-bottom:20px; font-weight:800">设备闲置申请单</caption>
            <thead>
              <tr>
                <th colspan="2">使用公司：{{printList.companyName}}</th>
                <th colspan="2">使用工厂：{{printList.factoryName}}</th>
                <th colspan="2">日期：{{unusedData.applyDate!=null?unusedData.applyDate.substring(0,10):''}}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>设备名称</td>
                <td>{{printList.equipmentName}}</td>
                <td>型号规格</td>
                <td>{{printList.model}}</td>
                <td>数量</td>
                <td >{{unusedData.number}}</td>
              </tr>
              <tr>
                <td>使用部门</td>
                <td>{{printList.divisionName}}</td>
                <td>闲置位置</td>
                <td>{{unusedData.unusedPlace}}</td>
                <td>固定资产编号</td>
                <td>{{printList.fixedAssetCode}}</td>
              </tr>
              <tr style="height:80px;">
                <td>制造厂家（制作部门）</td>
                <td colspan="3">{{printList.manufacturer}}</td>
                <td>出厂编号</td>
                <td>{{printList.serialNumber}}</td>
              </tr>
              <tr style="height:150px;text-align:left;">
                <td style="position: relative;" colspan="6"><span style="position: absolute;left:5px;top:5px;">申请闲置理由及闲置天数：<span style="font-size:14px;">{{unusedData.applyUnusedReason}};{{unusedData.unusedDays}}</span></span></td>
              </tr>
              <tr style="height:30px;text-align:left;border-bottom:0px solid white;">
                <td style="border:0px solid white;" colspan="6"><span>设备完好情况：</span></td>
              </tr>
              <tr style="height:90px;text-align:left;border-top:0px solid white;">
                <td style="border:0px solid white;" colspan="6">闲置可用（<span v-if="suggestShow">√</span>）闲置待报废（<span v-if="!suggestShow">√</span> ）</td>
              </tr>
              <tr style="height:60px;">
                <td>负责人</td>
                <td style="width:100px;">使用部门负责人</td>
                <td>设备科</td>
                <td>工厂厂长</td>
                <td>事业部</td>
                <td>资产部</td>
              </tr>
              <tr style="height:150px;">
                <td>意见</td>
                <td>{{printList.sybmOpinion}}</td>
                <td>{{printList.sbkOpinion}}</td>
                <td>{{printList.gcczOpinion}}</td>
                <td>{{printList.sybOpinion}}</td>
                <td>{{printList.zcbOpinion}}</td>
              </tr>
              <tr style="height:70px;">
                <td>签名</td>
                <td>{{printList.sybm}}</td>
                <td>{{printList.sbk}}</td>
                <td>{{printList.gccz}}</td>
                <td>{{printList.syb}}</td>
                <td>{{printList.zcb}}</td>
              </tr>
              <tr style="height:70px;">
                <td>日期</td>
                <td>{{printList.sybmDate!=null?printList.sybmDate.substring(0,10):''}}</td>
                <td>{{printList.sbkDate!=null?printList.sbkDate.substring(0,10):''}}</td>
                <td>{{printList.gcczDate!=null?printList.gcczDate.substring(0,10):''}}</td>
                <td>{{printList.sybDate!=null?printList.sybDate.substring(0,10):''}}</td>
                <td>{{printList.zcbDate!=null?printList.zcbDate.substring(0,10):''}}</td>
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
import { fetchList, getDetail, saveFrom, submitForm, delById, fetchInfoList, fetchTree, fetchPrint } from '@/api/idleProcess/equipIdleApply/equipIdleApply'
import { commonOptions, recordList, uploadlist, deleteFile, fileList, insertFile, deleteFileById, getCurrentUser, processChart, getProxyOrgList } from '@/api/common/common'
import { menuList } from '@/store/modules/permission'
import { fetchButton } from '@/api/common/button'
import { validateNumber1 } from '@/utils/validate'
import { baseUrl } from '@/api/common/fileBaseUrl'
export default {
  name: 'equipIdleApply',
  data() {
    const validateNumber = (rule, value, callback) => {
      if (!validateNumber1(value)) {
        callback(new Error('请输入正确格式的天数'))
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
        accountId: undefined, // 台账id
        applyUnusedReason: undefined, // 申请闲置理由
        formCode: undefined, // 单据编号
        applyDate: undefined, // 申请日期

        number: undefined, // 数量
        unusedDays: undefined, // 闲置天数
        unusedPlace: undefined, // 闲置位置

        fixedAssetCode: undefined, // 固定资产编码
        equipmentName: undefined, // 设备名称
        companyName: undefined, // 使用公司
        factoryName: undefined, // 使用工厂
        divisionName: undefined, // 使用部门
        model: undefined, // 规格型号
        manufacturer: undefined, // 制造厂家
        serialNumber: undefined, // 出厂编码
        equipStatus: undefined, // 闲置完好状态
        files: [],
        proxyOrgCode: undefined, // 代理组织
        proxyOrgName: undefined
      },
      dialogFormVisible: false,
      centerDialogVisible: false,
      printDialogVisible: false, // 打印
      printList: {
        sybm: null,
        sybmOpinion: null,
        sybmDate: null,
        sbk: null,
        sbkOpinion: null,
        sbkDate: null,
        gccz: null,
        gcczOpinion: null,
        gcczDate: null,
        syb: null,
        sybOpinion: null,
        sybDate: null,
        zcb: null,
        zcbOpinion: null,
        zcbDate: null
      },
      unusedData: {
        applyDate: null
      },
      lcData: [],
      suggestShow: false,
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
        detail: '查看设备闲置申请单'
      },
      // 文件数据
      fileData: [], // 附件上传
      documentWordCode: undefined, // 单据编码
      userId: undefined, // 用户id
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

        companyName: [{ required: true, message: '请输入使用公司', trigger: 'change' }],
        factoryName: [{ required: true, message: '请输入使用工厂', trigger: 'change' }],
        divisionName: [{ required: true, message: '请输入使用部门', trigger: 'change' }],

        number: [{ required: true, message: '请输入数量', trigger: 'change' }],
        applyUnusedReason: [{ required: true, message: '请输入申请闲置理由', trigger: 'change' }],
        unusedDays: [{ required: true, trigger: 'change', validator: validateNumber }],
        unusedPlace: [{ required: true, message: '请选择闲置位置', trigger: 'change' }]
        // applyDate:[{ required: true, message: '请选择申请日期', trigger: 'change' }],
        // equipStatus: [{ required: true, message: '请选择闲置完好状态', trigger: 'change' }]
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
          if (e.name == 'equipIdleApply') {
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
          if (response.data.data != null && response.data.data.results != null) {
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
          if (response.data.data != null && response.data.data.results != null) {
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
      this.temp.accountId = this.multipleSelection.id
      this.temp.fixedAssetCode = this.multipleSelection.fixedAssetCode
      this.temp.equipmentName = this.multipleSelection.equipmentName

      this.temp.companyName = this.multipleSelection.companyName
      this.temp.factoryName = this.multipleSelection.factoryName
      this.temp.divisionName = this.multipleSelection.divisionName
      this.temp.divisionCode = this.multipleSelection.divisionCode

      this.temp.serialNumber = this.multipleSelection.serialNumber
      this.temp.model = this.multipleSelection.model
      this.temp.manufacturer = this.multipleSelection.manufacturer
      this.temp.number = 1
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
      this.temp.unusedPlace = this.getEquipTypeName
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
      this.documentWordCode = row.formCode
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
    resetTemp() {
      this.temp = {
        id: undefined,
        accountId: undefined, // 台账id
        applyUnusedReason: undefined, // 申请闲置理由
        formCode: undefined, // 单据编号
        applyDate: undefined, // 申请日期

        number: undefined, // 数量
        unusedDays: undefined, // 闲置天数
        unusedPlace: undefined, // 闲置位置

        fixedAssetCode: undefined, // 固定资产编码
        equipmentName: undefined, // 设备名称
        companyName: undefined, // 使用公司
        factoryName: undefined, // 使用工厂
        divisionName: undefined, // 使用部门
        model: undefined, // 规格型号
        manufacturer: undefined, // 制造厂家
        serialNumber: undefined, // 出厂编码
        equipStatus: undefined, // 闲置完好状态
        files: [],
        proxyOrgCode: undefined, // 代理组织
        proxyOrgName: undefined
      }
      // 附件列表
      this.fileData = []
      this.documentWordCode = undefined
      this.userId = undefined
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
    // 引用台账
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
      this.temp.files = this.fileData
      const tempData = {
        accountId: this.temp.accountId,
        applyUnusedReason: this.temp.applyUnusedReason,
        number: this.temp.number,
        unusedDays: this.temp.unusedDays,
        unusedPlace: this.temp.unusedPlace,
        files: this.temp.files,
        proxyOrgCode: this.temp.proxyOrgCode, // 代理组织
        proxyOrgName: this.temp.proxyOrgName
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
      this.temp.files = this.fileData
      const tempData = {
        accountId: this.temp.accountId,
        applyUnusedReason: this.temp.applyUnusedReason,
        number: this.temp.number,
        unusedDays: this.temp.unusedDays,
        unusedPlace: this.temp.unusedPlace,
        files: this.temp.files,
        divisionCode: this.temp.divisionCode,
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
      this.documentWordCode = row.formCode
      this.getFileList() // 获取文件
      this.getUser()
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
    // 修改保存
    updateSaveData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.listLoading = true
          this.temp.files = this.fileData
          const tempData = {
            id: this.id,
            formCode: this.temp.formCode,
            accountId: this.temp.accountId,
            applyUnusedReason: this.temp.applyUnusedReason,
            number: this.temp.number,
            unusedDays: this.temp.unusedDays,
            unusedPlace: this.temp.unusedPlace,
            files: this.temp.files
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
      this.temp.files = this.fileData
      const tempData = {
        id: this.id,
        formCode: this.temp.formCode,
        accountId: this.temp.accountId,
        applyUnusedReason: this.temp.applyUnusedReason,
        number: this.temp.number,
        unusedDays: this.temp.unusedDays,
        unusedPlace: this.temp.unusedPlace,
        files: this.temp.files,
        divisionCode: this.temp.divisionCode,
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
    // 获取文件列表
    getFileList() {
      const find = {
        moduleType: '10', // 模块类别
        attachmentCode: 'SBXZSQDFJ', // 附件编码
        documentWordCode: this.documentWordCode // 单据编码
      }
      fileList(find).then(response => {
        this.fileData = response.data.data
      })
    },
    // 文件上传
    fileUpload1(e) {
      const file = e.target.files[0]
      const fileData1 = {
        attachmentCode: 'SBXZSQDFJ',
        code: this.documentWordCode,
        moduleType: '10',
        fileName: undefined, // 文件名称
        filePath: undefined, // 文件URL
        node: '开始',
        fileUrl: undefined,
        userId: this.userId
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
          } else if (resp.data.code == 402) {
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
          const fileInput = document.getElementById('uploadImg1')
          fileInput.value = ''
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
    // 文件删除
    fileDelete(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
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
            this.getFileList() // 获取文件
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
      const params = {
        id: this.id
      }
      fetchPrint(params).then(response => {
        if (response.data.code == 200) {
          this.printList = response.data.data.equipAccount
          this.unusedData = response.data.data.unused
          this.lcData = response.data.data.rt
          this.lcData.forEach(item => {
            if (item.taskName == '使用部门负责人') {
              this.printList.sybm = item.userName
              this.printList.sybmOpinion = item.opinion
              this.printList.sybmDate = item.dateTime
            } else if (item.taskName == '设备科') {
              this.printList.sbk = item.userName
              this.printList.sbkOpinion = item.opinion
              this.printList.sbkDate = item.dateTime
            } else if (item.taskName == '厂长') {
              this.printList.gccz = item.userName
              this.printList.gcczOpinion = item.opinion
              this.printList.gcczDate = item.dateTime
            } else if (item.taskName == '设备副总') {
              this.printList.syb = item.userName
              this.printList.sybOpinion = item.opinion
              this.printList.sybDate = item.dateTime
            } else if (item.taskName == '资产部') {
              this.printList.zcb = item.userName
              this.printList.zcbOpinion = item.opinion
              this.printList.zcbDate = item.dateTime
            }
          })
          if (this.unusedData.equipStatus == '1') {
            this.suggestShow = true
          } else if (this.unusedData.equipStatus == '2') {
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
  height: 90px;
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

