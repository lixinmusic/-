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
						<el-form-item>
							<el-button class="filter-item" type="primary" style="float:right"  icon="el-icon-search" @click="handleFilter">搜索</el-button>
						</el-form-item>
					</el-form>
        </div>
      <!-- </el-header> -->
      <el-main style="padding:20px 0">
        <el-table :key='tableKey' :data="tableData" height="200" row-key="id" v-loading="listLoading" border fit highlight-current 
         style="width: 100%;margin-top:10px;min-height:500px" :header-cell-style="{background:'oldlace'}">
          <el-table-column prop="recordCode" align="center" label="编号" width="160px">
            <template slot-scope="scope">
              <span class="look-detail" @click="handleDetail(scope.row)">{{scope.row.recordCode}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="projectInsideName" align="center" label="项目内部名称">
          </el-table-column>
          <el-table-column prop="projectLeaderName" align="center" label="项目组长">
          </el-table-column>
          <el-table-column prop="dctualOrgName" align="center" label="使用部门">
          </el-table-column>
          <el-table-column prop="projectOutsideName" align="center" label="项目外部名称">
          </el-table-column>
          <el-table-column prop="technologyLeaderName" align="center" label="技术负责人">
          </el-table-column>
          <el-table-column prop="requirementCompleteTime" align="center" label="项目要求完成时间" width="140px">
            <template slot-scope="scope">
              <span>{{scope.row.requirementCompleteTime.substring(0,10)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="equipBuySuggest" align="center" label="设备采购建议">
          </el-table-column>
          <el-table-column align="center" label="审核状态" >
            <template slot-scope="scope">
              <span>{{scope.row.auditingType}}</span>
            </template>
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
			<!-- 查看备案通知书 -->
			<el-dialog title="查看设备采购项目备案通知书" :close-on-click-modal="false" width="80%" :visible.sync="dialogFormVisible" v-dialogDrag :modal-append-to-body="false" v-loading="listLoading"> 
				<el-tabs v-model="activeName" @tab-click="handleClick">
					<el-tab-pane label="表单信息" name="first">
						<el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="150px">
							<el-form-item>
								<span class="equip-title">设备采购项目备案通知书</span>
							</el-form-item>
							<el-row :gutter="20">
								<el-col :span="11">
									<el-form-item label="编号" prop="recordCode">
										<el-input v-model="temp.recordCode" disabled></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="10" style="padding-right:0px;">
                  <el-form-item label="公司名称(付款主体)" prop="orgName">
                    <el-input v-model="temp.orgName" maxlength="6" disabled>{{getOrgName}}</el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="3" style="padding-left:0px;">
                  <el-button type="primary" @click="handleChooseCompany" :disabled="tzsqTask">选择</el-button>
                </el-col>
							</el-row>
							<el-row :gutter="20">
								<el-col :span="11">
                  <el-form-item label="项目内部名称" prop="projectInsideName">
                    <el-input v-model="temp.projectInsideName" maxlength="40" :disabled="tzsqTask"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="10" style="padding-right:0px;">
                  <el-form-item label="项目组长" prop="projectLeaderName">
                    <el-input v-model="temp.projectLeaderName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="3" style="padding-left:0px;">
                  <el-button type="primary" @click="handleChooseLeader" :disabled="tzsqTask">选择</el-button>
                </el-col>
							</el-row>
              <el-row :gutter="20">
                <el-col :span="9" style="padding-right:0px;">
                  <el-form-item label="设备实际使用公司" prop="companyName">
                    <el-input v-model="temp.companyName" maxlength="6" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2" style="padding-left:0px;">
                  <el-button type="primary" @click="changeCompany" :disabled="tzsqTask">选择</el-button>
                </el-col>
                <el-col :span="10" style="padding-right:0px;">
                  <el-form-item label="设备实际使用工厂" prop="factoryName">
                    <el-input v-model="temp.factoryName" maxlength="6" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2" style="padding-left:0px;">
                  <el-button type="primary" @click="changeFactory" :disabled="tzsqTask">选择</el-button>
                </el-col>
              </el-row>
							<el-row :gutter="20">
								<el-col :span="9" style="padding-right:0px;">
                  <el-form-item label="设备实际使用部门" prop="dctualOrgName">
                    <el-input v-model="temp.dctualOrgName" maxlength="6" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2" style="padding-left:0px;">
                  <el-button type="primary" @click="changeDivision" :disabled="tzsqTask">选择</el-button>
                </el-col>
                <el-col :span="1" style="width:1px;color:red;padding:8px 5px;" v-if="!dszShow">
                  <span>*</span>
                </el-col>
                <el-col :span="11">
									<el-form-item label="项目外部名称" prop="projectOutsideName"><!-- 内勤报董事长并处理节点 -->
										<el-input v-model="temp.projectOutsideName" maxlength="30" :disabled="dszShow"></el-input>
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
                  <el-button type="primary" @click="handleChooseTech" :disabled="tzsqTask">选择</el-button>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="项目要求完成时间" prop="requirementCompleteTime">
                    <el-date-picker style="width:100%"
                      v-model="temp.requirementCompleteTime"
                      type="date"
                      placeholder="选择时间"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      
                      :picker-options="pickerOptions0" :disabled="tzsqTask">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
							</el-row>
              <el-row :gutter="20">
                <el-col :span="11">
                  <el-form-item label="使用地址" prop="useAddress">
                    <el-input v-model="temp.useAddress" maxlength="30" :disabled="tzsqTask"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="设备采购建议" prop="equipBuySuggest">
                    <el-radio v-model="temp.equipBuySuggest" label="内部制造" :disabled="tzsqTask">内部制造</el-radio>
                    <el-radio v-model="temp.equipBuySuggest" label="外部制造" :disabled="tzsqTask">外部制造</el-radio>	
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
                    <el-table-column width="60px" v-if="!tzsqTask">
                      <template slot-scope="scope">
                        <span style="color:#409EFF;font-size:16px" @click.prevent="addRow()"><i class="el-icon-plus"></i></span>
                        <span style="color:red;font-size:16px" @click.prevent="delRow(scope.row)" v-if="delShow"><i class="el-icon-minus"></i></span>
                      </template>
                    </el-table-column>
                    <el-table-column label="设备名称" align="center" min-width="90">
                      <template slot-scope="scope">
                        <el-form-item label-width="1x" :prop="'equipRecordNumList.' + scope.$index + '.equipName'" :rules='rules.equipName'> 
                          <el-input v-model="scope.row.equipName" disabled>
                            <el-button slot="append" @click="handleChooseEquip(scope.$index)" :disabled="tzsqTask">选择</el-button>
                          </el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column label="设备数量" align="center" min-width="80">
                      <template slot-scope="scope">
                        <el-form-item label-width="1x" :prop="'equipRecordNumList.' + scope.$index + '.equipNum'" :rules='rules.equipNum'> 
                          <el-input v-model="scope.row.equipNum" oninput="value=value.replace(/[^\d]/g,'')" maxlength="4" :disabled="tzsqTask"></el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column label="主要内容" align="center" min-width="90">
                      <template slot-scope="scope">
                        <el-form-item label-width="1x" :prop="'equipRecordNumList.' + scope.$index + '.primaryCoverage'" :rules='rules.primaryCoverage'>
                          <el-input type="textarea" placeholder="请填写主要内容" v-model="scope.row.primaryCoverage" maxlength="30" :disabled="tzsqTask"></el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
              <!-- <el-form-item label="主要内容" prop="primaryCoverage">
                <el-input v-model="temp.primaryCoverage" maxlength="200" :disabled="tzsqTask"></el-input>
              </el-form-item> -->
              <el-row :gutter="20">
                <!-- <el-col :span="11">
                  <el-form-item label="设备改造(填上原设备编码)" prop="equipReform">
                    <el-input v-model="temp.equipReform" maxlength="200" :disabled="tzsqTask"></el-input>
                  </el-form-item>
                </el-col> -->
              	<el-col :span="1" style="width:1px;color:red;padding:8px" v-if="!finance">
                  <span>*</span>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="预算" prop="budget"><!-- 需要技改办主任填写预算节点 -->
                    <el-input v-model="temp.budget" maxlength="200" :disabled="finance"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
              	<el-col :span="1" style="width:1px;color:red;padding:8px" v-if="!finance">
                  <span>*</span>
                </el-col>
                <el-col :span="11" style="margin-right:20px;">
                  <el-form-item label="设备采购完成时间" prop="equipBuyCompleteTime"><!-- 需要技改办主任填写预算节点 -->
                    <el-date-picker style="width:100%"
                      v-model="temp.equipBuyCompleteTime"
                      type="date"
                      placeholder="选择时间" 
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      
                      :picker-options="pickerOptions0"
                      :disabled="finance">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="1" style="width:1px;color:red;padding:8px" v-if="!finance">
                  <span>*</span>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="是否立项" prop="setupProject"><!-- 需要技改办主任填写预算节点 -->
                    <el-checkbox-group v-model="checkList" @change="bindCheckBox">
                      <el-checkbox label="是" :disabled="finance"></el-checkbox>
                      <el-checkbox label="否" :disabled="finance"></el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="1" style="width:1px;color:red;padding:8px" v-if="!tzsqTask">
                  <span>*</span>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="项目方案附件上传" prop="xmfaFileData">
                    <input id="uploadImg1" type="file" @change="fileUpload1" v-if="!tzsqTask">
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
                    <el-button title="删除" type="danger" icon="el-icon-delete" size="mini"  @click="xmfaFileDelete(scope.row)" v-if="!tzsqTask"></el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-row>
                <el-col :span="1" v-if="!dszShow" style="width:1px;color:red;padding:8px">
                  <span>*</span>
                </el-col>
                <el-col :span="9">
                  <el-form-item label="附件" prop="fileData">
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
                  <el-button title="删除" type="danger" icon="el-icon-delete" size="mini"  @click="updatefileDelete(scope.row)" 
                  :disabled="scope.row.deleteDisabled?true:false"></el-button>
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
						<!-- 内勤报董事长并处理节点 -->
						<el-button type="primary" @click="dszAgreeData" v-if="!dszShow">代董事长审核</el-button>
						<el-button type="primary" @click="agreeData" v-if="dszShow && tzsqTask">同意</el-button>
						<el-button type="primary" @click="unAgreeData" v-if="tzsqTask">退回</el-button>
            <el-button type="primary" @click="againSubmit" v-if="!tzsqTask">提交</el-button>
            <el-button type="primary" @click="endbtn" v-if="!tzsqTask">结束流程</el-button>
						<!-- 内勤报董事长并处理节点 -->
						<el-button type="primary" @click="printData" v-if="!dszShow">打印</el-button>
						<!-- 事业部设备副总审核节点 & 资产部审核节点 -->
						<el-button type="primary" @click="lookUnused" v-if="xzShow">查看闲置</el-button>
          </el-form-item>
        </el-form>
         <!-- 选择弹框组 -->
        <el-dialog width="40%" :close-on-click-modal="false" title="选择公司" :visible.sync="innerVisibleCompany" append-to-body v-dialogDrag>
          <el-container>
            <el-aside width="500px">
              <span style="margin-left:20px;color:red" prop='getOrgName'>{{getOrgName}}</span>
              <el-tree :data="orgData" :props="defaultProps" node-key='orgFullName' @node-click="handleNodeClick1" v-loading="diaLoading"></el-tree>
            </el-aside>
          </el-container>
          <div slot="footer" class="dialog-footer">
            <el-button @click="innerVisibleCompany = false" type="default">取消</el-button>
            <el-button @click="handleClickVisibleCompany" type="primary">确定</el-button>
          </div>
        </el-dialog>
        <!-- 选择公司/工厂 -->
        <el-dialog width="40%" :title="textMap1[dialogStatus1]" :visible.sync="companyVisible" append-to-body :close-on-click-modal="false" v-dialogDrag >
          <el-container>
            <el-aside width="500px">
              <span style="margin-left:20px;color:red">{{getCompanyName}}</span>
              <el-tree 
                :data="companyData" 
                :props="defaultProps" 
                ref="comtree"
                show-checkbox
                node-key='orgCode' 
                check-strictly
                @check-change="handleChange1" v-loading="diaLoading"></el-tree>
            </el-aside>
          </el-container>
          <div slot="footer" class="dialog-footer">
            <el-button @click="companyVisible = false" type="default">取消</el-button>
            <el-button v-if="dialogStatus1=='company'" type="primary" @click="handleClickCompany">确定</el-button>
            <el-button v-if="dialogStatus1=='factory'" type="primary" @click="handleClickFactory">确定</el-button>
          </div>
        </el-dialog>
        <!-- 选择部门 -->
        <el-dialog width="50%" title="选择部门" :visible.sync="divisionVisible" append-to-body :close-on-click-modal="false" v-dialogDrag >
          <el-container>
            <el-aside width="500px">
              <span style="margin-left:20px;color:red">{{getOrgName}}</span>
              <el-tree 
                :data="orgData" 
                :props="defaultProps"
                ref="tree"
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
        <el-dialog width="30%" :close-on-click-modal="false" title="选择设备名称" :visible.sync="equipDialogVisible" append-to-body v-dialogDrag>
          <el-container>
            <el-aside>
              <el-tree 
                :data="branchEquipData" 
                :props="equipDefaultProps" 
                ref="treeEquip"
                show-checkbox 
                node-key="categoryCode"
                check-strictly
                @check-change="handleChangeEquip">
              </el-tree>
            </el-aside>
          </el-container>
          <div slot="footer" class="dialog-footer">
            <el-button @click="equipDialogVisible = false">取消</el-button>
            <el-button @click="handleClickEquip" type="primary">确定</el-button>
          </div>
        </el-dialog>
			</el-dialog>
			<!-- 同意/退回 -->
			<el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" :visible.sync="agreeDialogVisible" width="30%">
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
                <td align="left" colspan="3">内部制造（<span v-if="suggestShow">√</span>）外部制造（<span v-if="!suggestShow">√</span> ）</td>
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
                <td  style="border-top:0px solid white;border-bottom:0px solid white;" colspan="3" align="right">
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
                <td  align="right" colspan="3" style="border-top:0px solid white;">
                  <span>技改办签字：{{printList.jtjgb}}&nbsp;&nbsp;</span>
                  <span>日期：{{printList.jtjgbDate!=null?printList.jtjgbDate.substring(0,10):''}}&nbsp;</span>
                </td>
              </tr>
              <tr style="height:60px;">
                <td>董事长审批</td>
                <td colspan="2" style="border-right:0px solid white;"></td>
                <td style="position: relative;border-left:0px solid white;">
                  <span style="position: absolute;left:-100px;bottom:1px;">签字：</span>
                  <span style="position: absolute;right:100px;bottom:1px;">日期：</span></td>
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
      <!-- 查看台账（闲置） -->
      <el-dialog title="查看闲置" :visible.sync="centerDialogVisible" width="80%" :close-on-click-modal="false" v-dialogDrag>
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
          border fit highlight-current-row>
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
        </div>
      </el-dialog>
      <el-dialog width="60%" :close-on-click-modal="false" :title="textMapPer[dialogStatusPer]" :visible.sync="innerVisiblePerson" append-to-body v-dialogDrag>
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
            <span style="margin-left:20px;color:red">{{personName}}</span>
            <el-table height='300' :data="orgListData" border fit highlight-current-row
              style="width: 100%;min-height:300px;margin-top:8px">
              <el-table-column prop="orgName" align="center" label="部门" min-width="50">
              </el-table-column>
              <el-table-column prop="perName" align="center" label="人员" min-width="50">
              </el-table-column>
              <el-table-column align="center" label="工号" min-width="50">
                <template slot-scope="scope">
                  <a class="look-detail" @click="chooseData(scope.row)" v-if="dialogStatusPer=='leader'">{{scope.row.workNumber}}</a>
                  <a class="look-detail" @click="chooseData1(scope.row)" v-if="dialogStatusPer=='technology'">{{scope.row.workNumber}}</a>
                  <a class="look-detail" @click="chooseReplace(scope.row)" v-if="dialogStatusPer=='taskPerson'">{{scope.row.workNumber}}</a>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
        </el-container>
        <div slot="footer" class="dialog-footer">
          <el-button @click="innerVisiblePerson = false" type="primary">确定</el-button>
        </div>
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
import { fetchNeedList, fetchDetail, agreeApply, fetchPrint, reCommit, fetchInfoList } from '@/api/equipRecord/equipRecordNotice'
import { fetchButton } from '@/api/common/button'
import { fetchComTree, fetchComByCode, fetchOrgTree, fetchChooseTree, choosePersonList, transferList,
  getCurrentUser, getCurrentTask, fileList, recordList, uploadlist, deleteFileById, fetchEquipName, insertFile, endProcess, processChart } from '@/api/common/common'
import { baseUrl } from '@/api/common/fileBaseUrl'
export default {
  name: 'equipGtask',
  data() {
    return {
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      activeName: 'first',
      // 判断新增、编辑、删除按钮权限显示隐藏
      addShow: false,
      editShow: false,
      deleteShow: false,
      chartData: null, // 流程图
      // 是否可输入&按钮是否显示
      dszShow: true, // 董事长审核
      finance: true, // 技改主任
      tzsqTask: true, // 调整申请&提交
      xzShow: false, // 查看闲置
      delShow: false,
      // 关联人员
      dialogStatusPer: '',
      textMapPer: {
        leader: '项目组长',
        technology: '技术负责人',
        taskPerson: '请选择转办接收人员'
      },
      innerVisiblePerson: false,
      personOrgData: [],
      diaLoading: false,
      orgListData: null,
      changeProcessId: undefined,
      personName: undefined,
      innerVisibleCompany: false, // 公司名称选择弹框
      // 选择公司
      defaultProps: {
        children: 'children',
        label: 'orgFullName'
      },
      // 公司（工厂）
      j: 0,
      companyVisible: false,
      factoryVisible: false,
      companyData: [],
      // 部门
      i: 0,
      divisionVisible: false,
      orgData: [],
      getCompanyName: undefined,
      getCompanyCode: undefined,
      getOrgName: undefined,
      getOrgCode: undefined,
      // 选择设备名称
      equipDefaultProps: {
        children: 'children',
        label: 'categoryName'
      },
      p: 0,
      equipDialogVisible: false,
      branchEquipData: [],
      equipIndex: 0,
      // 弹框组
      dialogFormVisible: false, // 查看
      agreeDialogVisible: false, // 同意/退回
      printDialogVisible: false, // 打印
      centerDialogVisible: false, // 查看闲置
      // 表格数据
      tableData: [],
      tableKey: 0,
      listLoading: false,
      total: null,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        recordCode: undefined,
        projectInsideName: undefined
      },
      listQuery2: {
        pageNum: 1,
        pageSize: 1000,
        perName: undefined,
        workNumber: undefined
      },
      id: undefined,
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
        budget: null, // 预算
        equipBuyCompleteTime: null, // 设备采购完成时间
        setupProject: null, // 是否立项
        equipRecordNumList: [{
          equipCode: null,
          equipName: null,
          equipNum: null,
          primaryCoverage: null
        }] // 主要内容集合
      },
      checkList: [],
      // 任务审批
      popData: {
        opinion: undefined,
        leaderPass: undefined,
        taskId: undefined, // 任务id
        projectOutsideName: null,
        budget: null,
        equipBuyCompleteTime: null,
        setupProject: null, // 是否立项
        recordId: undefined // 设备备案id
      },
      // 弹框表格数据
      infoList: [],
      total1: null,
      listQuery1: {
        pageNum: 1,
        pageSize: 10,
        equipmentName: undefined,
        fixedAssetCode: undefined,
        model: undefined,
        equipmentStatus: 4
      },
      dialogStatus: '',
      textMap: {
        agree: '同意办理',
        unagree: '退回办理'
      },
      dialogStatus1: '',
      textMap1: {
        company: '选择公司',
        factory: '选择工厂'
      },
      taskId: undefined,
      // 文件数据
      xmfaFileData: [],
      fileData: [],
      userId: undefined, // 用户id
      documentWordCode: undefined, // 单据编号
      nodeKey: undefined, // 节点key
      nodeName: undefined, // 节点名称
      processInstanceId: undefined, //

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
    // this.getButton()
  },
  methods: {
    renderContent(h, { node, data, store }) {
      return (
        <span>
          <span title={node.label}>{node.label}</span>
        </span>)
    },
    getButton() {
      const params = {
        menuCode: 'WM_015',
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
      // this.total = 0
      this.listLoading = true
      fetchNeedList(this.listQuery).then(response => {
        if (response.data.code === 200) {
          if (response.data.data != null && response.data.data.list != null) {
            this.tableData = response.data.data.list
            for (var i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].auditingType == 2) {
                this.tableData[i].auditingType = '审核中'
              } else if (this.tableData[i].auditingType == 4) {
                this.tableData[i].auditingType = '审核不通过'
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
    // 弹框页面表格加载
    getInfoList() {
      this.listLoading = true
      this.infoList = []
      fetchInfoList(this.listQuery1).then(response => {
        if (response.data.code === 200) {
          if (response.data.data != null && response.data.data.list != null) {
            this.infoList = response.data.data.list
            this.total1 = response.data.data.total
            for (var i = 0; i < this.infoList.length; i++) {
              // if (this.infoList[i].equipmentType == 1) {
              //   this.infoList[i].equipmentType = '一般设备'
              // } else if (this.infoList[i].equipmentType == 2) {
              //   this.infoList[i].equipmentType = '关键设备'
              // } else if (this.infoList[i].equipmentType == 3) {
              //   this.infoList[i].equipmentType = '特殊设备'
              // }
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
    // 实现多选框单选
    bindCheckBox(value) {
      this.checkList = []
      this.checkList.push(value[1])
    },
    // 公司名称选择
    handleChooseCompany() {
      this.getOrgCode = undefined
      this.getOrgName = undefined
      this.innerVisibleCompany = true
      this.diaLoading = true
      fetchComTree().then(response => {
        this.orgData = []
        this.orgData.push(response.data.data)
      })
      setTimeout(() => {
        this.diaLoading = false
      }, 1 * 1000)
    },
    handleNodeClick1(data) {
      this.getOrgName = data.orgFullName
      this.getOrgCode = data.orgCode
    },
    // 公司名称选择确认
    handleClickVisibleCompany() {
      this.temp.orgName = this.getOrgName
      this.temp.orgCode = this.getOrgCode
      this.innerVisibleCompany = false
    },
    // 项目组长选择
    handleChooseLeader() {
      this.dialogStatusPer = 'leader'
      this.choosePerson()
    },
    // 技术负责人选择
    handleChooseTech() {
      this.dialogStatusPer = 'technology'
      this.choosePerson()
    },
    changeHandle(row) {
      this.dialogStatusPer = 'taskPerson'
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
      this.personName = undefined
      this.orgListData = []
      this.innerVisiblePerson = true
      this.diaLoading = true
      // 查询组织树结构
      fetchChooseTree().then(response => {
        this.personOrgData = []
        this.personOrgData.push(response.data.data)
        setTimeout(() => {
          this.diaLoading = false
        }, 1 * 1000)
      })
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
      choosePersonList(this.listQuery2).then(response => {
        this.orgListData = response.data.data.list
      })
    },
    chooseData(row) {
      this.personName = row.perName
      this.temp.projectLeaderName = row.perName
      this.temp.projectLeaderWorkNumber = row.workNumber
    },
    chooseData1(row) {
      this.personName = row.perName
      this.temp.technologyLeaderName = row.perName
      this.temp.technologyLeaderWorkNumber = row.workNumber
    },
    // 转办人员提交
    chooseReplace(row) {
      this.personName = row.perName
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
    // 设备名称选择
    handleChooseEquip(index) {
      this.equipIndex = index
      this.equipDialogVisible = true
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
      this.p++
      if (this.p % 2 == 0) {
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
    handleClickEquip() {
      this.treeData1 = this.$refs.treeEquip.getCheckedNodes()
      for (var item of this.temp.equipRecordNumList) {
        if (item.equipCode === this.treeData1[0].categoryCode) {
          this.$notify({
            title: '警告',
            message: '设备名称重复，请重新选择',
            type: 'warning',
            duration: 2000
          })
          return
        }
      }
      this.temp.equipRecordNumList[this.equipIndex].equipName = this.treeData1[0].categoryName
      this.temp.equipRecordNumList[this.equipIndex].equipCode = this.treeData1[0].categoryCode
      this.equipDialogVisible = false
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
      this.companyVisible = true
      this.diaLoading = true
      fetchComTree().then(response => {
        if (response.data.code === 200) {
          this.companyData.push(response.data.data)
        }
      })
      setTimeout(() => {
        this.diaLoading = false
      }, 1 * 1000)
    },
    // 选择公司确认
    handleClickCompany() {
      this.treeData1 = this.$refs.comtree.getCheckedNodes()
      this.getCompanyCode = this.treeData1[0].orgCode
      this.getCompanyName = this.treeData1[0].orgFullName
      this.temp.companyName = this.getCompanyName
      this.temp.companyCode = this.getCompanyCode
      this.temp.factoryCode = undefined
      this.temp.factoryName = undefined
      this.companyVisible = false
    },
    // 选择使用工厂
    changeFactory() {
      this.j = 0
      this.dialogStatus1 = 'factory'
      this.getCompanyCode = undefined
      this.getCompanyName = undefined
      this.companyData = []
      this.companyVisible = true
      this.diaLoading = true
      if (this.temp.companyCode != undefined && this.temp.companyCode != null && this.temp.companyCode != '') {
        const find = {
          orgCode: this.temp.companyCode
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
      }
      setTimeout(() => {
        this.diaLoading = false
      }, 1 * 1000)
    },
    // 选择工厂确认
    handleClickFactory() {
      this.treeData1 = this.$refs.comtree.getCheckedNodes()
      this.getCompanyCode = this.treeData1[0].orgCode
      this.getCompanyName = this.treeData1[0].orgFullName
      this.temp.factoryName = this.getCompanyName
      this.temp.factoryCode = this.getCompanyCode
      this.temp.dctualOrgName = undefined
      this.companyVisible = false
    },
    // 选择使用部门
    changeDivision() {
      this.getOrgCode = undefined
      this.getOrgName = undefined
      this.orgData = []
      this.divisionVisible = true
      this.diaLoading = true
      if (this.temp.factoryCode != undefined && this.temp.factoryCode != null && this.temp.factoryCode != '') {
        const find1 = {
          orgCode: this.temp.factoryCode
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
      }
      setTimeout(() => {
        this.diaLoading = false
      }, 1 * 1000)
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
      this.temp.dctualOrgName = this.getOrgName
      this.temp.dctualOrgCode = this.getOrgCode
      this.divisionVisible = false
    },
    // 表单里表格新增和删除
    addRow() {
      this.delShow = true
      var list = {
        equipCode: null,
        equipName: null,
        equipNum: null,
        primaryCoverage: null
      }
      this.temp.equipRecordNumList.unshift(list)
    },
    delRow(row) {
      const index = this.temp.equipRecordNumList.indexOf(row)
      this.temp.equipRecordNumList.splice(index, 1)
      if (this.temp.equipRecordNumList.length == 1) {
        this.delShow = false
      }
    },
    // 根据编号查看
    handleDetail(row) {
      this.activeName = 'first'
      this.dialogStatus = 'detail'
      this.finance = true
      this.dszShow = true
      this.tzsqTask = true
      this.xzShow = false // 查看闲置
      this.dialogFormVisible = true
      this.id = row.id
      this.popData.taskId = row.taskId
      this.documentWordCode = row.recordCode // 单据编号
      this.processInstanceId = row.processInstanceId // 流程实例id
      // 表单信息
      fetchDetail(this.id).then(response => {
        if (response.data.code === 200) {
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
      this.getUser()
      this.getNodeKey() // 获取当前任务信息
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 重新提交
    againSubmit() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.xmfaFileData.length == 0) {
            this.$notify({
              title: '警告',
              message: '请上传项目方案附件',
              type: 'warning',
              duration: 2000
            })
            return
          }
          this.listLoading = true
          const tempData = Object.assign({}, this.temp)
          const taskId = this.popData.taskId
          reCommit(taskId, tempData).then(response => {
            if (response.data.code == 200) {
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
            setTimeout(() => {
              this.listLoading = false
            }, 1 * 500)
          })
        }
      })
    },
    // 获取当前用户信息
    getUser() {
      getCurrentUser().then(response => {
        this.userId = response.data.data.id
        this.getFileList() // 获取文件信息
      })
    },
    // 查询当前任务信息（获取节点key值）
    getNodeKey() {
      getCurrentTask(this.processInstanceId).then(response => {
        if (response.data.code === 200) {
          this.nodeKey = response.data.data.definitionKey
          this.nodeName = response.data.data.name
          if (this.nodeKey == 'record_dszTask') {
            this.dszShow = false
          } else if (this.nodeName == '调整申请') {
            this.tzsqTask = false
            if (this.temp.equipRecordNumList.length === 1) {
              this.delShow = false
            } else {
              this.delShow = true
            }
          } else if (this.nodeKey == 'record_jtjgbzrTask') {
            this.finance = false
          } else if (this.nodeKey == 'record_sybsbfzTask' || this.nodeKey == 'record_zcbTask') {
            this.xzShow = true
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
    // 获取文件列表
    getFileList() {
      const find = {
        moduleType: '1', // 模块类别
        attachmentCode: 'SBBADFJ', // 附件编码
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
      const find1 = {
        moduleType: '1', // 模块类别
        attachmentCode: 'SBBADXMFAFJ', // 附件编码
        documentWordCode: this.documentWordCode // 单据编码
      }
      fileList(find1).then(response => {
        this.xmfaFileData = response.data.data
      })
    },
    // 文件上传
    fileUpload(e) {
      const file = e.target.files[0]
      const fileData1 = {
        attachmentCode: 'SBBADFJ',
        code: this.documentWordCode,
        moduleType: '1',
        fileName: undefined,
        filePath: undefined, // 文件URL
        node: this.nodeName, // 节点名称
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
                this.fileData.push(fileData1)
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
    fileUpload1(e) {
      const file = e.target.files[0]
      const fileData1 = {
        attachmentCode: 'SBBADXMFAFJ',
        code: this.documentWordCode,
        moduleType: '1',
        fileName: undefined,
        filePath: undefined, // 文件URL
        node: this.nodeName, // 节点名称
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
                this.xmfaFileData.push(fileData1)
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
    // 编辑查看文件删除
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
    xmfaFileDelete(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const id = row.id
        deleteFileById(id).then(response => {
          if (response.data.code === 200) {
            const index = this.xmfaFileData.indexOf(row)
            this.xmfaFileData.splice(index, 1)
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
    // 董事长审核
    dszAgreeData() {
      this.popData.opinion = null
      this.popData.leaderPass = true
      this.popData.projectOutsideName = this.temp.projectOutsideName // 项目外部名称
      this.popData.budget = this.temp.budget // 预算
      this.popData.equipBuyCompleteTime = this.temp.equipBuyCompleteTime // 设备采购完成时间
      this.popData.recordId = this.temp.id // 设备备案id
      if (this.nodeKey == 'record_dszTask') {
        if (this.popData.projectOutsideName == null || this.popData.projectOutsideName == '') {
          this.$notify({
            title: '警告',
            message: '请输入项目外部名称',
            type: 'warning',
            duration: 2000
          })
        } else {
          this.dialogStatus = 'agree'
          this.agreeDialogVisible = true
        }
      } else {
        this.dialogStatus = 'agree'
        this.agreeDialogVisible = true
      }
    },
    // 同意
    agreeData() {
      this.popData.opinion = null
      this.popData.leaderPass = true
      this.popData.projectOutsideName = this.temp.projectOutsideName // 项目外部名称
      this.popData.budget = this.temp.budget // 预算
      this.popData.equipBuyCompleteTime = this.temp.equipBuyCompleteTime// 设备采购完成时间
      this.popData.recordId = this.temp.id // 设备备案id
      if (this.nodeKey == 'record_jtjgbzrTask') {
        this.popData.setupProject = this.checkList[0]
        if (this.popData.budget == null || this.popData.budget == '') {
          this.$notify({
            title: '警告',
            message: '请输入预算',
            type: 'warning',
            duration: 2000
          })
        } else if (this.popData.equipBuyCompleteTime == null || this.popData.equipBuyCompleteTime == '') {
          this.$notify({
            title: '警告',
            message: '请选择设备采购完成时间',
            type: 'warning',
            duration: 2000
          })
        } else if (this.popData.setupProject == null || this.popData.setupProject == '') {
          this.$notify({
            title: '警告',
            message: '请选择是否立项',
            type: 'warning',
            duration: 2000
          })
        } else {
          this.dialogStatus = 'agree'
          this.agreeDialogVisible = true
        }
      } else {
        this.dialogStatus = 'agree'
        this.agreeDialogVisible = true
      }
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
      this.popData.recordId = this.temp.id // 设备备案id
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
    // 查看闲置
    lookUnused() {
      this.listQuery1 = {
        pageNum: 1,
        pageSize: 10,
        equipmentName: undefined,
        fixedAssetCode: undefined,
        model: undefined,
        equipmentStatus: 4
      }
      this.centerDialogVisible = true
      this.getInfoList()
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
            if (response.data.code !== 803 && response.data.code !== 808) {
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
    endbtn() {
      const taskId = this.popData.taskId
      const val = 1
      const id = this.id
      const moduleTypeId = 1
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

