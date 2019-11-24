<template>
  <div class='app-container'>
    <el-container>
      <!-- <el-header> -->
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
          <el-table-column align="center" label="操作" width="140px">
            <template slot-scope="scope">
              <el-button title="转办" type="success" icon="el-icon-share" size="mini"  @click="changeHandle(scope.row)"></el-button>
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
          layout="total, sizes, prev, pager, next, jumper" :total="total">
					</el-pagination>
				</div>
      </el-footer>
      <!-- 查看闲置设备启动申请单 -->
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
                  <el-button type="primary" @click="changeCompany" :disabled="tzsqTask">选择</el-button>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="10" style="padding-right:0px;">
                  <el-form-item label="调入工厂" prop="transferInFactoryName">
                    <el-input v-model="temp.transferInFactoryName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2" style="padding:0px;">
                  <el-button type="primary" @click="changeFactory" :disabled="tzsqTask">选择</el-button>
                </el-col>
                <el-col :span="9" style="padding-right:0px;">
                  <el-form-item label="调入部门" prop="transferInDepartmentName">
                    <el-input v-model="temp.transferInDepartmentName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2" style="padding:0px;">
                  <el-button type="primary" @click="changeDivision" :disabled="tzsqTask">选择</el-button>
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
                <el-input type="textarea" maxlength="200" v-model="temp.remark" :disabled="tzsqTask"></el-input>
              </el-form-item>
              <el-form-item label="调拨原因" prop="reason">
                <el-input type="textarea" maxlength="200" v-model="temp.reason" :disabled="tzsqTask"></el-input>
              </el-form-item>
              <el-form-item label="其他说明" prop="otherDescription">
                <el-input type="textarea" maxlength="200" v-model="temp.otherDescription" :disabled="tzsqTask"></el-input>
              </el-form-item>
              <el-row>
                <el-col :span="1" style="width:1px;color:red;padding:8px" v-if="fileshow">
                  <span>*</span>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="附件">
                    <input id="uploadImg" type="file" @change="fileUpload" v-if="fileshow">
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
                    <el-button title="删除" type="danger" icon="el-icon-delete" size="mini"  @click="fileDelete(scope.row)" 
                    :disabled="scope.row.deleteDisabled?true:false"></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form>
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
						<el-button type="primary" @click="agreeData" v-if="tzsqTask">同意</el-button>
            <el-button type="primary" @click="againSubmit" v-if="!tzsqTask">提交</el-button>
            <el-button type="primary" @click="endbtn" v-if="!tzsqTask">结束流程</el-button>
						<el-button type="primary" @click="unAgreeData" v-if="tzsqTask">退回</el-button>
            <el-button type="primary" @click="printData" v-if="zcbfbzShow">打印</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
			<!-- 同意/退回 -->
			<el-dialog :title="textMap[dialogStatus]" :visible.sync="agreeDialogVisible" width="30%" :close-on-click-modal="false" v-dialogDrag>
				<el-form :model="popData" label-position="left" label-width="50px">
          <span style="color:red;position:absolute;top:90px;left:13px">*</span>
					<el-form-item label="意见" prop="opinion">
						<el-input type="textarea" maxlength="128" v-model="popData.opinion"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="agreeDialogVisible = false">取消</el-button>
					<el-button v-if="dialogStatus=='agree'" type="primary" @click="createData">同意</el-button>
          <el-button v-if="dialogStatus=='unagree'" type="primary" @click="updateData">确定</el-button>
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
                <td colspan="2">资产部副部长签章</td>
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
                <td colspan="2" style="border-bottom:1px solid #fff"></td>
              </tr>
              <tr style="text-align:left">
                <td colspan="2">经办人：{{printList.fqr}}</td>
                <!-- <td colspan="2">经办人：{{printList.bmjl}}</td> -->
                <td colspan="2">经办人：{{printList.dcsbkz}}</td>
                <td colspan="2">经办人：{{printList.sbfz}}</td>
                <td colspan="2">经办人：{{printList.zcbfbz}}</td>
                <td colspan="2">经办人：</td>
                <td colspan="2">经办人：</td>
              </tr>
              <tr style="text-align:left">
                <td colspan="2" style="border-top:1px solid #fff">
                  日期：{{printList.fqrDate!=null?printList.fqrDate.substring(0,10):''}}</td>
                <!-- <td colspan="2" style="text-align:left;border-top:1px solid #fff">
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
                  日期：</td>
              </tr>
            </tbody>
          </table>
        </div>
	    </el-dialog>
      <!-- 选择人员 -->
      <el-dialog width="60%" :close-on-click-modal="false" title="请选择转办接收人员" :visible.sync="innerVisiblePerson" append-to-body v-dialogDrag>
        <el-header>
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="姓名">
              <el-input v-model="listQuery2.perName" placeholder="请输入姓名">
              </el-input>
            </el-form-item>
            <el-form-item label="工号">
              <el-input v-model="listQuery2.workNumber" placeholder="请输入工号">
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
import { fetchNeedList, getDetail, agreeApply, reCommit, fetchPrint } from '@/api/allocationProcess/equipRepairAllot'
import { endProcess, uploadlist, fileList, deleteFileById, getCurrentUser, insertFile, recordList, getCurrentTask, processChart, fetchComTree, fetchComByCode, fetchOrgTree, fetchChooseTree, choosePersonList, transferList } from '@/api/common/common'
import { baseUrl } from '@/api/common/fileBaseUrl'
export default {
  name: 'equipAllotNeed',
  data() {
    return {
      chartData: null, // 流程图
      // 节点判断是否可输入
      tzsqTask: true, // 调整申请
      zcbfbzShow: false, // 资产部副部长审核
      fileshow: false,
      // 弹框组
      dialogFormVisible: false, // 查看
      agreeDialogVisible: false, // 同意/退回
      // 表格数据
      tableData: [],
      tableKey: 0,
      listLoading: false,
      total: null,
      value01: undefined,
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
        type: 2,
        handleType: 1
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
        type: 2
      },
      // 任务审批
      popData: {
        leaderPass: undefined,
        opinion: undefined,
        taskId: undefined, // 任务id
        processInstanceId: undefined
      },
      taskId: undefined,
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
      // 选择人员
      innerVisiblePerson: false,
      listQuery2: {
        pageNum: 1,
        pageSize: 1000,
        perName: undefined,
        workNumber: undefined
      },
      personOrgData: [],
      orgListData: [],
      treeLoading: false,
      changeProcessId: undefined,
      dialogStatus: '',
      textMap: {
        detail: '查看设备调拨单',
        agree: '同意办理',
        unagree: '退回办理'
      },
      dialogStatus1: '',
      textMap1: {
        company: '选择公司',
        factory: '选择工厂'
      },
      // 文件数据
      fileData: [],
      userId: undefined, // 用户id
      documentWordCode: undefined, // 单据编号
      // 流程
      nodeKey: undefined, // 节点key
      nodeName: undefined, // 节点名称
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
        zcbfbzDate: null
      },
      printId: '',
      lcData: [],
      // 流转记录
      recordData: null,
      activeName: 'first',
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
  },
  methods: {
    renderContent(h, { node, data, store }) {
      return (
        <span>
          <span title={node.label}>{node.label}</span>
        </span>)
    },
    getList() {
      this.listLoading = true
      fetchNeedList(this.listQuery).then(response => {
        if (response.data.code === 200) {
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
                if (child.children !== null) {
                  for (var p = 0; p < child.children.length; p++) {
                    if (child.children[p].orgType == '公司') {
                      child.children[p].disabled = true
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
      this.activeName = 'first'
      this.dialogStatus = 'detail'
      this.tzsqTask = true
      this.zcbfbzShow = false
      this.fileshow = false
      this.dialogFormVisible = true
      this.popData.taskId = row.taskId
      this.popData.processInstanceId = row.processInstanceId
      this.processInstanceId = row.processInstanceId
      this.id = row.id
      this.printId = row.id
      this.documentWordCode = row.formCode // 单据编号
      getDetail(this.id).then(response => {
        if (response.data.code === 200) {
          this.temp = Object.assign({}, response.data.data)
        } else {
          this.$notify({
            title: '警告',
            message: response.data.msg,
            type: 'warning',
            duration: 3000
          })
        }
      })
      this.getUser()
      this.getNodeKey() // 获取当前任务信息
    },
    // 获取当前用户信息
    getUser() {
      getCurrentUser().then(response => {
        if (response.data.code == 200) {
          this.userId = response.data.data.id
          console.log(this.userId)
          this.getFileList() // 获取文件信息
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
    // 查询当前任务信息（获取节点key值）
    getNodeKey() {
      getCurrentTask(this.processInstanceId).then(response => {
        if (response.data.code === 200) {
          this.nodeKey = response.data.data.definitionKey
          this.nodeName = response.data.data.name
          console.log(this.nodeKey)
          if (this.nodeName == '调整申请') { // 判断是否为调整申请
            this.tzsqTask = false
          } else if (this.nodeKey == 'equipAllocation_asset_vp' || this.nodeKey == 'equipAllocation_in_factory') { // 资产部副部长 // 调入部门/厂
            this.zcbfbzShow = true
            this.fileshow = true
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
    // 同意
    agreeData() {
      if (this.nodeKey == 'equipAllocation_asset_vp' && this.fileData.length == 0) {
        this.$notify({
          title: '警告',
          message: '请上传附件',
          type: 'warning',
          duration: 2000
        })
        return
      }
      this.popData.opinion = null
      this.popData.leaderPass = true
      this.dialogStatus = 'agree'
      this.agreeDialogVisible = true
    },
    createData() {
      if (this.popData.opinion == null || this.popData.opinion == '') {
        this.$notify({
          title: '警告',
          message: '请填写意见',
          type: 'warning',
          duration: 3000
        })
        return
      }
      const tempData = Object.assign({}, this.popData)
      agreeApply(tempData).then(response => {
        if (response.data.code == 200) {
          this.agreeDialogVisible = false
          this.dialogFormVisible = false
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
    // 退回
    unAgreeData() {
      this.popData.opinion = null
      this.dialogStatus = 'unagree'
      this.agreeDialogVisible = true
      this.popData.leaderPass = false
    },
    updateData() {
      if (this.popData.opinion == null || this.popData.opinion == '') {
        this.$notify({
          title: '警告',
          message: '请填写意见',
          type: 'warning',
          duration: 3000
        })
        return
      }
      const tempData = Object.assign({}, this.popData)
      agreeApply(tempData).then(response => {
        if (response.data.code == 200) {
          this.agreeDialogVisible = false
          this.dialogFormVisible = false
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
    // 重新提交
    againSubmit() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.listLoading = true
          const tempData = {
            taskId: this.popData.taskId,
            id: this.temp.id,
            remark: this.temp.remark,
            reason: this.temp.reason,
            otherDescription: this.temp.otherDescription,
            transferInCompany: this.temp.transferInCompany,
            transferInCompanyName: this.temp.transferInCompanyName,
            transferInFactory: this.temp.transferInFactory,
            transferInFactoryName: this.temp.transferInFactoryName,
            transferInDepartment: this.temp.transferInDepartment,
            transferInDepartmentName: this.temp.transferInDepartmentName,
            type: 2
          }
          reCommit(tempData).then(response => {
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
        }
      })
    },
    endbtn() {
      const taskId = this.popData.taskId
      const val = 3
      const id = this.id
      const moduleTypeId = 8
      this.listLoading = true
      endProcess(taskId, val, id, moduleTypeId).then(response => {
        if (response.data.code == 200) {
          this.listLoading = false
          this.dialogFormVisible = false
          this.getList()
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
    // 文件上传
    fileUpload(e) {
      const file = e.target.files[0]
      const fileData1 = {
        attachmentCode: 'SBDBDFJ',
        code: this.documentWordCode,
        moduleType: '18',
        fileName: undefined,
        filePath: undefined, // 文件URL
        node: this.nodeName, // 节点名称
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
            // 调用新增文件
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
              } else {
                this.$notify({
                  title: '警告',
                  message: response.data.msg,
                  type: 'warning',
                  duration: 2000
                })
              }
              this.listLoading = false
            })
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
          const fileInput = document.getElementById('uploadImg')
          fileInput.value = ''
        })
      }
    },
    // 文件下载
    fileDown(row) {
      window.location.href = row.filePath + '?attname=' + row.fileName
    },
    // 文件删除
    fileDelete(row) {
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
    // 获取文件列表
    getFileList() {
      // 获取文件列表
      const find = {
        moduleType: '18', // 模块类别
        attachmentCode: 'SBDBDFJ', // 附件编码
        documentWordCode: this.documentWordCode // 单据编码
      }
      fileList(find).then(response => {
        this.fileData = response.data.data
        for (var i = 0; i < this.fileData.length; i++) {
          if (this.fileData[i].userId == this.userId) {
            this.fileData[i].deleteDisabled = false
          } else {
            this.fileData[i].deleteDisabled = true
          }
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
              document.getElementById('pic').src = this.chartData
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
      this.changeProcessId = row.processInstanceId
      this.choosePerson()
    },
    choosePerson() {
      this.listQuery2 = {
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
      choosePersonList(this.listQuery2).then(response => {
        this.orgListData = response.data.data.list
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 1000)
      })
    },
    // 转办人员提交
    chooseReplace(row) {
      const finds = {
        processInstanceId: this.changeProcessId,
        workNumber: row.workNumber
      }
      transferList(finds).then(response => {
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
	/* color: #337ab7; */
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