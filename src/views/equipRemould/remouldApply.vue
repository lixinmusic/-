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
        <el-button class="filter-item" @click="handleCreate" type="primary" v-if="addShow">新增</el-button>
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
          <el-table-column align="center" label="操作" width="140px" fixed="right">
            <template slot-scope="scope">
              <el-button title="编辑" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-if="editShow" :disabled="scope.row.editDisabled?true:false"></el-button>
              <el-button title="删除" type="danger" icon="el-icon-delete" size="mini"  @click="deleteBtn(scope.row)" v-if="deleteShow" :disabled="scope.row.deleteDisabled?true:false"></el-button>
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
      <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" :visible.sync="dialogFormVisible"
        width="1200px" v-dialogDrag v-loading="listLoading">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="表单信息" name="first">
            <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="135px">
              <el-form-item>
                <span class="equip-title">设备改造项目备案通知书</span>
              </el-form-item>
              <el-row :gutter="20">
                <el-col :span="11">
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
                <el-col :span="11">
                  <el-form-item label="项目内部名称" prop="projectInsideName">
                    <el-input v-model="temp.projectInsideName" maxlength="40" :disabled="!chooseShow"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="9" style="padding-right:0px;">
                  <el-form-item label="项目组长" prop="projectLeaderName">
                    <el-input v-model="temp.projectLeaderName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="3" style="padding-left:0px;">
                  <el-button type="primary" @click="handleChooseLeader" :disabled="!chooseShow">选择</el-button>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <!-- 只能内勤报董事长并处理节点填写 -->
                <el-col :span="11">
                  <el-form-item label="项目外部名称" prop="projectOutsideName">
                    <el-input v-model="temp.projectOutsideName" maxlength="30" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="项目要求完成时间" prop="requirementCompleteTime">
                    <el-date-picker style="width:100%"
                      v-model="temp.requirementCompleteTime"
                      type="date"
                      placeholder="选择时间"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      
                      :picker-options="pickerOptions0" :disabled="!chooseShow">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="9" style="padding-right:0px;">
                  <el-form-item label="技术负责人" prop="technologyLeaderName">
                    <el-input v-model="temp.technologyLeaderName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2" style="padding-left:0px;">
                  <el-button type="primary" @click="handleChooseTech" :disabled="!chooseShow">选择</el-button>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="设备改造建议" prop="equipReformSuggest">
                    <el-radio v-model="temp.equipReformSuggest" label="内部改造" :disabled="!chooseShow">内部改造</el-radio>
                    <el-radio v-model="temp.equipReformSuggest" label="外部改造" :disabled="!chooseShow">外部改造</el-radio>	
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <!-- 只能集团技改办主任节点填写 -->
                <el-col :span="11">
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
                    <el-table-column width="60px" v-if="chooseShow">
                      <template slot-scope="scope">
                        <span style="color:#409EFF;font-size:16px" @click.prevent="addRow()"><i class="el-icon-plus"></i></span>
                        <span style="color:red;font-size:16px" @click.prevent="delRow(scope.row)" v-if="delShow"><i class="el-icon-minus"></i></span>
                      </template>
                    </el-table-column>
                    <el-table-column label="固定资产编号" align="center" min-width="120">
                      <template slot-scope="scope">
                        <el-form-item label-width="1x" :prop="'equipReformContentList.' + scope.$index + '.fixedAssetCode'" :rules='rules.fixedAssetCode'> 
                          <el-input v-model="scope.row.fixedAssetCode" disabled>
                            <el-button style="padding:5px;" slot="append" @click="handleChooseEquip(scope.$index)" :disabled="!chooseShow">选择</el-button>
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
                          <el-input type="textarea" maxlength="200" placeholder="请填写改造内容" v-model="scope.row.reformContent" :disabled="!chooseShow"></el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column label="预计改造金额(元)" align="center" min-width="80">
                      <template slot-scope="scope">
                        <el-form-item label-width="1x" :prop="'equipReformContentList.' + scope.$index + '.estimateMoney'" :rules='rules.estimateMoney'> 
                          <el-input v-model="scope.row.estimateMoney" maxlength="9" oninput="value=value.replace(/[^\d]/g,'')" :disabled="!chooseShow1" @input="getAllMoney"></el-input>
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
                <el-col :span="1" style="width:1px;color:red;padding:8px">
                  <span>*</span>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="改造方案附件上传" prop="projectProgrammeFileList">
                    <input id="uploadImg1" type="file" @change="fileUpload1" v-if="chooseShow">
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
                    <el-button title="删除" type="danger" icon="el-icon-delete" size="mini"  @click="xmfaFileDelete(scope.row)" v-if="chooseShow"></el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-row>
                <el-col :span="10">
                  <el-form-item label="附件" prop="sbgzFileData">
                    <input id="uploadImg" type="file" @change="fileUpload" v-if="chooseShow">
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
            <el-button v-if="dialogStatus=='detail'&&printShow" type="primary" @click="printData">打印</el-button>
          </el-form-item>
        </el-form>
        <!-- 选择弹框组 -->
        <el-dialog width="60%" :close-on-click-modal="false" title="项目组长" :visible.sync="innerVisibleLeader" append-to-body v-dialogDrag>
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
              <el-tree :data="personOrgData" :props="defaultProps" @node-click="handleNodeClick" v-loading="diaLoading" :render-content="renderContent"></el-tree>
            </el-aside>
            <el-main>
              <span style="margin-left:20px;color:red">{{temp.projectLeaderName}}</span>
              <el-table height='300' :data="orgListData" border fit highlight-current-row
                style="width:100%;min-height:300px;margin-top:8px">
                <el-table-column prop="orgName" align="center" label="部门" min-width="50">
                </el-table-column>
                <el-table-column prop="perName" align="center" label="人员" min-width="50">
                </el-table-column>
                <el-table-column align="center" label="工号" min-width="50">
                  <template slot-scope="scope">
                    <a class="look-detail" @click="chooseData(scope.row)">{{scope.row.workNumber}}</a>
                  </template>
                </el-table-column>
              </el-table>
            </el-main>
          </el-container>
          <div slot="footer" class="dialog-footer">
            <el-button @click="innerVisibleLeader = false" type="primary">确定</el-button>
          </div>
        </el-dialog>
        <el-dialog width="60%" :close-on-click-modal="false" title="技术负责人" :visible.sync="innerVisibleTech" append-to-body v-dialogDrag>
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
            <el-aside style="width:380px;">
              <el-tree :data="personOrgData" :props="defaultProps" @node-click="handleNodeClick" v-loading="diaLoading" :render-content="renderContent"></el-tree>
            </el-aside>
            <el-main>
              <span style="margin-left:20px;color:red">{{temp.technologyLeaderName}}</span>
              <el-table height='300' :data="orgListData" border fit highlight-current-row
                style="width:100%;min-height:300px;margin-top:8px">
                <el-table-column prop="orgName" align="center" label="部门" min-width="50">
                </el-table-column>
                <el-table-column prop="perName" align="center" label="人员" min-width="50">
                </el-table-column>
                <el-table-column align="center" label="工号" min-width="50">
                  <template slot-scope="scope">
                    <a class="look-detail" @click="chooseData1(scope.row)">{{scope.row.workNumber}}</a>
                  </template>
                </el-table-column>
              </el-table>
            </el-main>
          </el-container>
          <div slot="footer" class="dialog-footer">
            <el-button @click="innerVisibleTech = false" type="primary">确定</el-button>
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
      </el-dialog>
      <el-dialog title="选择设备" :visible.sync="equipDialogVisible" width="80%" :close-on-click-modal="false" v-dialogDrag>
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
          @select="handleSelect" class="checkboxNoShow">
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
          <el-button @click="equipDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="importOk">确定</el-button>
        </div>
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
                  <span style="position: absolute;left:-100px;bottom:1px;">签字：{{printList.zcbahk}}</span>
                  <span style="position: absolute;right:10px;bottom:1px;">日期：{{printList.zcbahkDate!=null?printList.zcbahkDate.substring(0,10):''}}</span>
                </td>
              </tr>
              <tr style="height:60px;">
                <td>工厂厂长意见</td>
                <td colspan="2" style="border-right:0px solid white;">{{printList.gcczOpinion}}</td>
                <td style="position: relative;border-left:0px solid white;">
                  <span style="position: absolute;left:-100px;bottom:1px;">签字：{{printList.gccz}}</span>
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
                  1、设备改造完成时间：{{printList.equipReformCompleteTime!=null?printList.equipReformCompleteTime.substring(0,10):''}}</td>
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
                  <span style="position: absolute;right:10px;bottom:1px;">日期：{{printList.dszDate!==null?printList.dszDate.substring(0,10):''}}</span></td>
              </tr>
            </tbody>
          </table>
				</div>
			</el-dialog>
    </el-container>
  </div>
</template>

<script>
import { fetchList, saveArticle, createArticle, updateArticle, updateArticleSubmit, delById, fetchDetail, fetchPrint, fetchInfoList } from '@/api/equipRemould/remouldApply'
import { commonOptions, fetchChooseTree, choosePersonList, uploadlist, deleteFile, fileList, getCurrentUser, insertFile, deleteFileById, recordList, processChart, getProxyOrgList } from '@/api/common/common'
import { fetchButton } from '@/api/common/button'
import { menuList } from '@/store/modules/permission'// 按钮权限
import { baseUrl } from '@/api/common/fileBaseUrl'

export default {
  name: 'remouldApply',
  data() {
    return {
      // 代理组织
      ifSave: false,
      userCode: undefined, // 用户编码
      changeOrgVisible: undefined,
      proxyOrgList: [],
      comName: undefined,
      comCode: undefined,
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      activeName: 'first',
      // 判断新增、编辑、删除按钮权限显示隐藏
      menuCode: undefined,
      addShow: false,
      editShow: false,
      deleteShow: false,
      chooseShow: true, // 选择按钮
      chooseShow1: false,// 新增修改预计改造金额不可编辑
      printShow: false,
      chartData: null, // 流程图
      delShow: false,
      // 弹框显示
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增',
        detail: '查看'
      },
      // 审核状态下拉框
      options: commonOptions,
      // 关联人员
      defaultProps: {
        children: 'children',
        label: 'orgFullName'
      },
      diaLoading: false,
      orgListData: null,
      innerVisibleLeader: false, // 项目组长选择弹框
      personOrgData: [],
      innerVisibleTech: false, // 技术负责人弹框
      listQuery2: {
        pageNum: 1,
        pageSize: 1000,
        perName: undefined,
        workNumber: undefined
      },
      // 选择设备名称
      equipDialogVisible: false,
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
      equipIndex: 0,
      // 表格数据
      tableKey: 0,
      tableData: [],
      listLoading: false,
      total: null,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        reformCode: undefined,
        projectInsideName: undefined,
        projectOutsideName: undefined,
        auditingType: null
      },
      // 文件数据
      projectProgrammeFileList: [],
      sbgzFileData: [],
      documentWordCode: undefined, // 单据编码
      userId: undefined, // 用户id
      processInstanceId: undefined, // 流程实例id
      // 流转记录
      recordShow: false,
      recordData: null,
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
        equipReformSuggest: '内部改造',
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
          estimateMoney: null
        }], // 主要内容集合
        totalMoney: 0, // 总计金额
        proxyOrgCode: undefined, // 代理组织
        proxyOrgName: undefined,
        // 附件列表
        list: [],
        projectProgrammeFileList: []
      },
      // 是否立项
      checkList: [],
      // 打印
      printDialogVisible: false,
      printList: {
        // xmzgbmrDate: null,
        // gcsbkzDate: null,
        // zcbahkDate: null,
        // gcczDate: null,
        // sbfzDate: null,
        // sybzjlDate: null,
        // jtjgbDate:null,
        dszDate: null,
        requirementCompleteTime: null,
        equipReformCompleteTime: null
      },
      equipReformSuggest: false,
      setupShow: false,
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
    this.getButton()
  },
  methods: {
    renderContent(h, { node, data, store }) {
      return (
        <span>
          <span title={node.label}>{node.label}</span>
        </span>)
    },
    getButton() {
      menuList.forEach(item => {
        item.children.forEach(e => {
          if (e.name == 'remouldApply') {
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
    getAllMoney() {
      this.temp.totalMoney = 0
      this.temp.equipReformContentList.forEach((item, index) => {
        // if (item.estimateMoney == '' || item.estimateMoney == null) {
        //   item.estimateMoney = 0
        // }
        this.temp.totalMoney += parseInt(item.estimateMoney)
      })
      this.$forceUpdate()
    },
    getList() {
      this.tableData = []
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        if (response.data.code === 200) {
          if (response.data.data != null && response.data.data.list != null) {
            this.tableData = response.data.data.list
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
    // 项目组长选择
    handleChooseLeader() {
      this.choosePerson()
      this.innerVisibleLeader = true
    },
    choosePerson() {
      this.listQuery2 = {
        pageNum: 1,
        pageSize: 1000,
        perName: undefined,
        workNumber: undefined
      }
      this.orgListData = null
      this.diaLoading = true
      fetchChooseTree().then(response => {
        this.personOrgData = []
        this.personOrgData.push(response.data.data)
        setTimeout(() => {
          this.diaLoading = false
        }, 1 * 1000)
      })
    },
    chooseData(row) {
      this.temp.projectLeaderName = row.perName
      this.temp.projectLeaderWorkNumber = row.workNumber
    },
    // 技术负责人选择
    handleChooseTech() {
      this.choosePerson()
      this.innerVisibleTech = true
    },
    handleNodeClick(data) {
      const params = {
        orgCode: data.orgCode,
        pageNum: 1,
        pageSize: 2000
      }
      choosePersonList(params).then(response => {
        this.orgListData = response.data.data.list
      })
    },
    handlePerson() {
      this.orgListData = []
      choosePersonList(this.listQuery2).then(response => {
        this.orgListData = response.data.data.list
      })
    },
    chooseData1(row) {
      this.temp.technologyLeaderName = row.perName
      this.temp.technologyLeaderWorkNumber = row.workNumber
    },
    // 设备名称选择
    handleChooseEquip(index) {
      this.equipIndex = index
      this.equipDialogVisible = true
      this.listQuery1 = {
        pageNum: 1,
        pageSize: 10,
        equipmentName: undefined,
        fixedAssetCode: undefined,
        model: undefined
      }
      this.getInfoList()
    },
    // 弹框页面表格加载
    getInfoList() {
      this.multipleSelection = ''
      this.checkedIndex = ''
      this.listLoading = true
      fetchInfoList(this.listQuery1).then(response => {
        if (response.data.code === 200) {
          if (response.data.data != null && response.data.data.list != null) {
            this.infoList = response.data.data.list
            this.total1 = response.data.data.total
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
      this.equipDialogVisible = false
      this.temp.equipReformContentList[this.equipIndex].fixedAssetCode = this.multipleSelection.fixedAssetCode
      this.temp.equipReformContentList[this.equipIndex].equipmentName = this.multipleSelection.equipmentName
      this.temp.equipReformContentList[this.equipIndex].factoryCode = this.multipleSelection.factoryCode
      this.temp.equipReformContentList[this.equipIndex].factoryName = this.multipleSelection.factoryName
      this.temp.equipReformContentList[this.equipIndex].divisionCode = this.multipleSelection.divisionCode
      this.temp.equipReformContentList[this.equipIndex].divisionName = this.multipleSelection.divisionName
      this.temp.equipReformContentList[this.equipIndex].reformContent = null
      this.temp.equipReformContentList[this.equipIndex].estimateMoney = null
      this.getAllMoney()
      // this.temp.equipReformContentList[this.equipIndex].equipCode = this.multipleSelection.equipCode
    },
    // 表单里表格新增和删除
    addRow() {
      this.delShow = true
      var list = {
        fixedAssetCode: null,
        // equipCode: null,
        equipmentName: null,
        factoryCode: null,
        factoryName: null,
        divisionCode: null,
        divisionName: null,
        reformContent: null,
        estimateMoney: null
      }
      this.temp.equipReformContentList.unshift(list)
    },
    delRow(row) {
      const index = this.temp.equipReformContentList.indexOf(row)
      this.temp.equipReformContentList.splice(index, 1)
      if (this.temp.equipReformContentList.length == 1) {
        this.delShow = false
      }
      this.getAllMoney()
    },
    resetTemp() {
      this.temp = {
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
        equipReformSuggest: '内部改造',
        setupProject: undefined, // 是否立项
        equipReformContentList: [{
          fixedAssetCode: null,
          // equipCode: null,
          equipmentName: null,
          factoryCode: null,
          factoryName: null,
          divisionCode: null,
          divisionName: null,
          reformContent: null,
          estimateMoney: null
        }], // 主要内容集合
        totalMoney: 0, // 总计金额
        proxyOrgCode: undefined, // 代理组织
        proxyOrgName: undefined,
        // 附件列表
        list: [],
        projectProgrammeFileList: []
      }
      this.sbgzFileData = []
      this.projectProgrammeFileList = []
      this.checkList = []
      this.userId = undefined
      this.documentWordCode = undefined
      this.getOrgName = ''
      this.getOrgCode = ''
    },
    // 新增
    handleCreate() {
      this.resetTemp()
      this.delShow = false
      this.dialogStatus = 'create'
      this.chooseShow = true
      this.chooseShow1 = false
      this.recordShow = false
      this.activeName = 'first'
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
          if (this.projectProgrammeFileList.length == 0) {
            this.$notify({
              title: '警告',
              message: '请上传改造方案附件',
              type: 'warning',
              duration: 2000
            })
            return
          }
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
      this.temp.list = []
      this.listLoading = true
      this.sbgzFileData.forEach(item => {
        this.temp.list.push(item)
      })
      this.projectProgrammeFileList.forEach(item => {
        this.temp.list.push(item)
      })
      createArticle(this.temp).then(response => {
        if (response.data.code == 200) {
          this.tableData.unshift(this.temp)
          this.dialogFormVisible = false
          setTimeout(() => {
            this.listLoading = false
          }, 1 * 500)
          this.$message({
            title: '成功',
            message: '提交成功',
            type: 'success',
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
      this.temp.list = []
      this.listLoading = true
      this.sbgzFileData.forEach(item => {
        this.temp.list.push(item)
      })
      this.projectProgrammeFileList.forEach(item => {
        this.temp.list.push(item)
      })
      saveArticle(this.temp).then(response => {
        if (response.data.code == 200) {
          this.dialogFormVisible = false
          setTimeout(() => {
            this.listLoading = false
          }, 1 * 500)
          this.$message({
            title: '成功',
            message: '保存成功',
            type: 'success',
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
          this.listLoading = false
        }
      })
    },
    // 编辑
    handleUpdate(row) {
      this.checkList = []
      this.dialogStatus = 'update'
      this.chooseShow = true
      this.chooseShow1 = false
      this.recordShow = false
      this.activeName = 'first'
      this.dialogFormVisible = true
      this.documentWordCode = row.reformCode
      const id = row.id
      // 根据id获取详情
      fetchDetail(id).then(response => {
        this.temp = Object.assign({}, response.data.data)
        this.temp.equipReformContentList.forEach(item=>{
            console.log(item.estimateMoney)
            if(item.estimateMoney == 0){
                item.estimateMoney = null
            }
        })
        if (this.temp.equipReformContentList.length == 1) {
          this.delShow = false
        } else {
          this.delShow = true
        }
      })
      this.getUser()
      this.getFileList() // 获取文件
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    getUser() {
      // 获取当前用户信息
      getCurrentUser().then(response => {
        if (response.data.code == 200) {
          this.userId = response.data.data.id
          this.userCode = response.data.data.userCode
          if (this.dialogStatus == 'create') {
            getProxyOrgList(this.userCode).then(response => {
              if (response.data.code == 200) {
                this.proxyOrgList = []
                this.comName = response.data.data.orgName
                this.comCode = response.data.data.orgCode
                if (this.proxyOrgList != null) {
                  this.proxyOrgList = response.data.data.list
                }
              }
            })
          }
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
    // 修改提交
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.projectProgrammeFileList.length == 0) {
            this.$notify({
              title: '警告',
              message: '请上传改造方案附件',
              type: 'warning',
              duration: 2000
            })
            return
          }
          this.updataSubmit()
        }
      })
    },
    updataSubmit() {
      this.listLoading = true
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
    // 修改保存
    updateSaveData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.listLoading = true
          const tempData = Object.assign({}, this.temp)
          updateArticle(tempData).then(response => {
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
    // 根据编号查看
    handleDetail(row) {
      this.delShow = false
      this.activeName = 'first'
      this.chooseShow = false
      this.recordShow = true
      this.printShow = false
      this.dialogStatus = 'detail'
      this.dialogFormVisible = true
      const id = row.id
      this.documentWordCode = row.reformCode // 单据编号
      if (row.auditingType == '审核通过') {
        this.printShow = true
      }
      // 表单信息
      fetchDetail(id).then(response => {
        if (response.data.code == 200) {
          this.temp = Object.assign({}, response.data.data)
          this.checkList = []
          this.checkList.push(this.temp.setupProject)
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
    // 文件上传
    fileUpload(e) {
      const file = e.target.files[0]
      const fileData1 = {
        attachmentCode: 'SBGZBADFJ',
        code: this.documentWordCode,
        moduleType: '19',
        fileName: undefined,
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
                  this.sbgzFileData.push(fileData1)
                }
              })
            } else if (this.dialogStatus == 'create') {
              this.sbgzFileData.push(fileData1)
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
          const fileInput = document.getElementById('uploadImg')
          fileInput.value = ''
        })
      }
    },
    fileUpload1(e) {
      const file = e.target.files[0]
      const fileData1 = {
        attachmentCode: 'SBGZBADGZFAFJ',
        code: this.documentWordCode,
        moduleType: '19',
        fileName: undefined,
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
                  this.projectProgrammeFileList.push(fileData1)
                }
              })
            } else if (this.dialogStatus == 'create') {
              this.projectProgrammeFileList.push(fileData1)
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
          const fileInput1 = document.getElementById('uploadImg1')
          fileInput1.value = ''
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
    // 项目方案文件删除
    xmfaFileDelete(row) {
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
              const index = this.projectProgrammeFileList.indexOf(row)
              this.projectProgrammeFileList.splice(index, 1)
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
              const index = this.projectProgrammeFileList.indexOf(row)
              this.projectProgrammeFileList.splice(index, 1)
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
            const index = this.sbgzFileData.indexOf(row)
            this.sbgzFileData.splice(index, 1)
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
            const index = this.sbgzFileData.indexOf(row)
            this.sbgzFileData.splice(index, 1)
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
      this.chartData = null
      this.recordData = null
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
<style>
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
</style>

