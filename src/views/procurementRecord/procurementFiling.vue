<template>
    <div class='app-container'>
        <el-container>
            <div class="formSearch">
                <el-form :inline="true">
                    <el-form-item label="单据编号">
                        <el-input class="filter-item input" placeholder="请输入单据编号" clearable v-model="documentWordCode1">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="使用部门">
                        <el-input class="filter-item input" placeholder="请输入使用部门" clearable v-model="dctualOrgName">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="审核状态">
                        <el-select v-model="auditingType" clearable placeholder="请选择">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="filter-item" type="primary" style="float:right" icon="el-icon-search" @click="handleFilter">搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-main style="padding:20px 0">
                <el-button class="filter-item" @click="handleCreate" type="primary" v-if="addShow">新增</el-button>
                <el-table :key='tableKey' :data="tableData" height="200" row-key="id" v-loading="listLoading" border fit highlight-current style="width: 100%;margin-top:10px;min-height:500px" :header-cell-style="{background:'oldlace'}">
                    <el-table-column prop="documentWordCode" align="center" label="单据编号" width="160px">
                        <template slot-scope="scope">
                            <span class="look-detail" @click="handleDetail(scope.row)">{{scope.row.documentWordCode}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="projectLeaderName" align="center" label="项目组长">
                    </el-table-column>
                    <el-table-column prop="dctualOrgName" align="center" label="使用部门">
                    </el-table-column>
                    <el-table-column prop="applyDate" align="center" label="申请时间">
                        <template slot-scope="scope">
                            <span>{{scope.row.applyDate!=null?scope.row.applyDate.substring(0,10):scope.row.applyDate}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="requirementDeliveryTime" align="center" label="要求交货时间">
                        <template slot-scope="scope">
                            <span>{{scope.row.requirementDeliveryTime.substring(0,10)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="equipBuySuggest" align="center" label="设备采购建议">
                    </el-table-column>
                    <el-table-column prop="auditingType" align="center" label="审核状态">
                        <template slot-scope="scope">
                            <span>{{scope.row.auditingType}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="assignee" align="center" label="当前处理人">
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="150px" fixed="right">
                        <template slot-scope="scope">
                            <el-button title="编辑" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-if="editShow" :disabled="scope.row.editDisabled?true:false"></el-button>
                            <el-button title="删除" type="danger" icon="el-icon-delete" size="mini" @click="deleteBtn(scope.row)" v-if="deleteShow" :disabled="scope.row.deleteDisabled?true:false"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-main>
            <el-footer>
                <div class="pagination-container">
                    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[5,10,15, 20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                    </el-pagination>
                </div>
            </el-footer>
            <!-- 新增编辑弹框 -->
            <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" :visible.sync="dialogFormVisible" width="60%" v-dialogDrag v-loading="listLoading">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="表单信息" name="first">
                        <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="145px">
                            <el-form-item>
                                <span class="equip-title">设备采购备案申请单</span>
                            </el-form-item>
                            <el-row :gutter="20">
                                <el-col :span="11">
                                    <el-form-item label="单据编号" prop="documentWordCode">
                                        <el-input v-model="temp.documentWordCode" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="10" style="padding-right:0px;">
                                    <el-form-item label="公司名称(付款主体)" prop="orgName">
                                        <el-input v-model="temp.orgName" maxlength="6" disabled>{{getOrgName}}</el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="3" style="padding-left:0px;">
                                    <el-button type="primary" @click="handleChooseCompany" :disabled="!chooseShow">选择</el-button>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="9" style="padding-right:0px;">
                                    <el-form-item label="使用公司" prop="companyName">
                                        <el-input v-model="temp.companyName" maxlength="6" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2" style="padding-left:0px;">
                                    <el-button type="primary" @click="changeCompany" :disabled="!chooseShow">选择</el-button>
                                </el-col>
                                <el-col :span="10" style="padding-right:0px;">
                                    <el-form-item label="使用工厂" prop="factoryName">
                                        <el-input v-model="temp.factoryName" maxlength="6" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2" style="padding-left:0px;">
                                    <el-button type="primary" @click="changeFactory" :disabled="!chooseShow">选择</el-button>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="9" style="padding-right:0px;">
                                    <el-form-item label="使用部门" prop="dctualOrgName">
                                        <el-input v-model="temp.dctualOrgName" maxlength="6" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2" style="padding-left:0px;">
                                    <el-button type="primary" @click="changeDivision" :disabled="!chooseShow">选择</el-button>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="项目号" prop="projectCode">
                                        <el-input v-model="temp.projectCode" maxlength="30" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="11">
                                    <el-form-item label="项目内部名称" prop="projectInsideName">
                                        <el-input v-model="temp.projectInsideName" maxlength="30" :disabled="!chooseShow"></el-input>
                                    </el-form-item>
                                </el-col>
                                <!-- 只能内勤报董事长并处理节点填写 -->
                                <el-col :span="12">
                                    <el-form-item label="项目外部名称" prop="projectOutsideName">
                                        <el-input v-model="temp.projectOutsideName" maxlength="30" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="9" style="padding-right:0px;">
                                    <el-form-item label="项目组长" prop="projectLeaderName">
                                        <el-input v-model="temp.projectLeaderName" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2" style="padding-left:0px;">
                                    <el-button type="primary" @click="handleChooseLeader" :disabled="!chooseShow">选择</el-button>
                                </el-col>
                                <el-col :span="10" style="padding-right:0px;">
                                    <el-form-item label="技术负责人" prop="technologyLeaderName">
                                        <el-input v-model="temp.technologyLeaderName" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2" style="padding-left:0px;">
                                    <el-button type="primary" @click="handleChooseTech" :disabled="!chooseShow">选择</el-button>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="11">
                                    <el-form-item label="使用地址" prop="useAddress">
                                        <el-input v-model="temp.useAddress" placeholder="例：浙江金华市婺城仙华南街800号" maxlength="40" :disabled="!chooseShow"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="申请时间" prop="applicationTime">
                                        <el-date-picker style="width:100%" v-model="temp.applicationTime" type="date" placeholder="选择时间" format="yyyy-MM-dd" value-format="yyyy-MM-dd" disabled>
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="11">
                                    <el-form-item label="项目要求完成时间" prop="requirementCompleteTime">
                                        <el-date-picker style="width:100%" v-model="temp.requirementCompleteTime" type="date" placeholder="选择时间" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :picker-options="pickerOptions0" :disabled="!chooseShow">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="设备采购完成时间" prop="equipBuyCompleteTime">
                                        <el-date-picker style="width:100%" v-model="temp.equipBuyCompleteTime" type="date" placeholder="选择时间" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :picker-options="pickerOptions0" disabled>
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="3">
                                    <span style="width:1px;color:red;padding:1px">*</span>
                                    <span >主要内容</span>
                                </el-col>
                                <el-col :span="20">
                                    <el-table :data="temp.equipRecordNumList" border stripe style="width: 100%;margin-bottom:10px;">
                                        <el-table-column width="60px" v-if="chooseShow">
                                            <template slot-scope="scope">
                                                <span style="color:#409EFF;font-size:16px" @click.prevent="addRow()">
                                                    <i class="el-icon-plus"></i>
                                                </span>
                                                <span style="color:red;font-size:16px" @click.prevent="delRow(scope.row)" v-if="delShow">
                                                    <i class="el-icon-minus"></i>
                                                </span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="设备名称" align="center" min-width="90">
                                            <template slot-scope="scope">
                                                <el-form-item label-width="1x" :prop="'equipRecordNumList.' + scope.$index + '.equipName'" :rules='rules.equipName'>
                                                    <el-input v-model="scope.row.equipName" disabled>
                                                        <el-button slot="append" @click="handleChooseEquip(scope.$index)" :disabled="!chooseShow">选择</el-button>
                                                    </el-input>
                                                </el-form-item>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="设备数量" align="center" min-width="80">
                                            <template slot-scope="scope">
                                                <el-form-item label-width="1x" :prop="'equipRecordNumList.' + scope.$index + '.equipNum'" :rules='rules.equipNum'>
                                                    <el-input v-model="scope.row.equipNum" oninput="value=value.replace(/[^\d]/g,'')" maxlength="4" :disabled="!chooseShow"></el-input>
                                                </el-form-item>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="主要内容" align="center" min-width="90">
                                            <template slot-scope="scope">
                                                <el-form-item label-width="1x" :prop="'equipRecordNumList.' + scope.$index + '.primaryCoverage'" :rules='rules.primaryCoverage'>
                                                    <el-input type="textarea" placeholder="请填写主要内容" v-model="scope.row.primaryCoverage" maxlength="30" :disabled="!chooseShow"></el-input>
                                                </el-form-item>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="11">
                                    <!-- 需要集团技改办主任填写预算节点 -->
                                    <el-form-item label="预算" prop="budget">
                                        <el-input v-model="temp.budget" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="要求交货时间" prop="requirementDeliveryTime">
                                        <el-date-picker style="width:100%" v-model="temp.requirementDeliveryTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :picker-options="pickerOptions0" type="date" placeholder="选择时间" :disabled="!chooseShow">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="23">
                                    <el-form-item label="申请原因" prop="applicationReason">
                                        <el-input type="textarea" :disabled="!chooseShow" maxlength="200" v-model="temp.applicationReason"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="23">
                                    <el-form-item label="具体要求" prop="detailRequirement">
                                        <el-input type="textarea" :disabled="!chooseShow" maxlength="200" v-model="temp.detailRequirement"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="11">
                                    <el-form-item label="设备采购建议" prop="equipBuySuggest">
                                        <el-radio v-model="temp.equipBuySuggest" label="内部制造" disabled>内部制造</el-radio>
                                        <el-radio v-model="temp.equipBuySuggest" label="外部制造" disabled>外部制造</el-radio>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="10">
                                    <el-form-item label="技术资料" prop="jszlFileData">
                                        <input id="uploadImg2" type="file" @change="fileUpload2" v-if="chooseShow">
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-table :data="jszlFileData" border fit highlight-current style="width: 60%; margin-left:100px;">
                                <el-table-column prop="fileName" align="center" label="文件名">
                                    <template slot-scope="scope">
                                        <span class="look-detail" @click="lookFile(scope.row)">{{scope.row.fileName}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="node" align="center" label="上传节点">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.node}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="操作">
                                    <template slot-scope="scope">
                                        <el-button title="下载" type="primary" size="mini" icon="el-icon-download" @click="fileDown(scope.row)"></el-button>
                                        <el-button title="删除" type="danger" icon="el-icon-delete" size="mini" @click="jszlFileDelete(scope.row)" v-if="chooseShow"></el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <el-row>
                                <el-col :span="10">
                                    <el-form-item label="项目方案附件" prop="xmfaFileData">
                                        <input id="uploadImg1" type="file" @change="fileUpload1" v-if="chooseShow">
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-table :data="xmfaFileData" border fit highlight-current style="width: 60%; margin-left:100px;">
                                <el-table-column prop="fileName" align="center" label="文件名">
                                    <template slot-scope="scope">
                                        <span class="look-detail" @click="lookFile(scope.row)">{{scope.row.fileName}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="node" align="center" label="上传节点">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.node}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="操作">
                                    <template slot-scope="scope">
                                        <el-button title="下载" type="primary" size="mini" icon="el-icon-download" @click="fileDown(scope.row)"></el-button>
                                        <el-button title="删除" type="danger" icon="el-icon-delete" size="mini" @click="xmfaFileDelete(scope.row)" v-if="chooseShow"></el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <el-row>
                                <el-col :span="10">
                                    <el-form-item label="审核附件" prop="fileData">
                                        <!-- <input id="uploadImg" type="file" @change="fileUpload" v-if="chooseShow"> -->
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                        <el-table :data="fileData" border fit highlight-current style="width: 60%; margin-left:100px;">
                            <el-table-column prop="fileName" align="center" label="文件名">
                                <template slot-scope="scope">
                                    <span class="look-detail" @click="lookFile(scope.row)">{{scope.row.fileName}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="node" align="center" label="上传节点">
                                <template slot-scope="scope">
                                    <span>{{scope.row.node}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="操作">
                                <template slot-scope="scope">
                                    <el-button title="下载" type="primary" size="mini" icon="el-icon-download" @click="fileDown(scope.row)"></el-button>
                                    <el-button v-if="dialogStatus=='create'" title="删除" type="danger" icon="el-icon-delete" size="mini" @click="fileDelete(scope.row)"></el-button>
                                    <el-button v-if="dialogStatus=='update'" title="删除1" type="danger" icon="el-icon-delete" size="mini" @click="updatefileDelete(scope.row)"></el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="流转记录" name="second" v-if="recordShow">
                        <el-table :data="recordData" height="500" border fit highlight-current style="width: 100%;">
                            <el-table-column align="center" type="index" label="序号" min-width="100">
                            </el-table-column>
                            <el-table-column prop="taskName" align="center" label="步骤名称">
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
                            <img id="pic" :src="chartData" />
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
                <el-dialog width="40%" :title="textMap1[dialogStatus1]" :visible.sync="companyVisible" append-to-body :close-on-click-modal="false" v-dialogDrag>
                    <el-container>
                        <el-aside width="500px">
                            <span style="margin-left:20px;color:red">{{getCompanyName}}</span>
                            <el-tree :data="companyData" :props="defaultProps" ref="comtree" show-checkbox node-key='orgCode' check-strictly @check-change="handleChange1" v-loading="diaLoading"></el-tree>
                        </el-aside>
                    </el-container>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="companyVisible = false" type="default">取消</el-button>
                        <el-button v-if="dialogStatus1=='company'" type="primary" @click="handleClickCompany">确定</el-button>
                        <el-button v-if="dialogStatus1=='factory'" type="primary" @click="handleClickFactory">确定</el-button>
                    </div>
                </el-dialog>
                <!-- 选择部门 -->
                <el-dialog width="50%" title="选择部门" :visible.sync="divisionVisible" append-to-body :close-on-click-modal="false" v-dialogDrag>
                    <el-container>
                        <el-aside width="500px">
                            <span style="margin-left:20px;color:red">{{getOrgName}}</span>
                            <el-tree :data="orgData" :props="defaultProps" ref="tree" show-checkbox node-key="orgCode" check-strictly @check-change="handleChange" v-loading="diaLoading">
                                <!-- 当前节点变化时处理事件 -->
                            </el-tree>
                        </el-aside>
                    </el-container>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="divisionVisible = false">取消</el-button>
                        <el-button @click="handleClick2" type="primary">确定</el-button>
                    </div>
                </el-dialog>
                <!-- 项目组长 -->
                <el-dialog width="60%" :close-on-click-modal="false" title="项目组长" :visible.sync="innerVisibleLeader" append-to-body v-dialogDrag>
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
                            <el-tree :data="personOrgData" :props="defaultProps" @node-click="handleNodeClick" v-loading="diaLoading" :render-content="renderContent"></el-tree>
                        </el-aside>
                        <el-main>
                            <span style="margin-left:20px;color:red">{{temp.projectLeaderName}}</span>
                            <el-table height='300' :data="orgListData" border fit highlight-current-row style="width:100%;min-height:300px;margin-top:8px">
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
                        <el-aside style="width:380px;">
                            <el-tree :data="personOrgData" :props="defaultProps" @node-click="handleNodeClick" v-loading="diaLoading" :render-content="renderContent"></el-tree>
                        </el-aside>
                        <el-main>
                            <span style="margin-left:20px;color:red">{{temp.technologyLeaderName}}</span>
                            <el-table height='300' :data="orgListData" border fit highlight-current-row style="width:100%;min-height:300px;margin-top:8px">
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
                <el-dialog width="30%" :close-on-click-modal="false" title="选择设备名称" :visible.sync="equipDialogVisible" append-to-body v-dialogDrag>
                    <el-container>
                        <el-aside>
                            <el-tree :data="branchEquipData" :props="equipDefaultProps" ref="treeEquip" show-checkbox node-key="categoryCode" check-strictly @check-change="handleChangeEquip">
                            </el-tree>
                        </el-aside>
                    </el-container>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="equipDialogVisible = false">取消</el-button>
                        <el-button @click="handleClickEquip" type="primary">确定</el-button>
                    </div>
                </el-dialog>
                <el-dialog width="40%" title="选择发起组织" :visible.sync="changeOrgVisible" append-to-body :close-on-click-modal="false" v-dialogDrag>
                    <el-container>
                        <el-aside style="width:100%">
                            <span style="font-weight:800">当前登录用户所在组织：{{comName}}</span>
                            <el-form>
                                <el-form-item>
                                    <el-select v-model="temp.proxyOrgName" clearable placeholder="请选择组织" @change='proxyOrgChange' style="width:100%">
                                        <el-option v-for="item in proxyOrgList" :key="item.orgCode" :label="item.orgName" :value="item.orgName">
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
            <!-- 打印 -->
            <el-dialog title="打印预览" :close-on-click-modal="false" :visible.sync="printDialogVisible" width="810px">
                <el-button type="primary" @click="printDialogVisible = false">返回</el-button>
                <el-button type="success" v-print="'#printTest'">
                    <svg-icon icon-class="print" />打印</el-button>
                <div id="printTest">
                    <table border="0">
                        <caption style="font-size: 24px;padding-bottom:10px; font-weight:800">设备采购备案申请单</caption>
                        <thead>
                            <tr>
                                <th colspan="3">公司名称(付款主体)：{{printList.orgName}}</th>
                                <th>编号：{{printList.documentWordCode}}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td align="left">项目内部名称</td>
                                <td>{{printList.projectInsideName}}</td>
                                <td align="left">项目号</td>
                                <td>{{printList.projectCode}}</td>
                                
                            </tr>
                            <tr>
                                <td align="left">设备实际使用部门</td>
                                <td>{{printList.dctualOrgName}}</td>
                                <td align="left">项目组长（负责人）</td>
                                <td>{{printList.projectLeaderName}}</td>
                            </tr>
                            <tr>
                                <td align="left">项目外部名称</td>
                                <td>{{printList.projectOutsideName}}</td>
                                <td align="left">技术负责人</td>
                                <td>{{printList.technologyLeaderName}}</td>
                            </tr>
                            <tr>
                                <td align="left">申请时间</td>
                                <td>{{printList.applicationTime!=null?printList.applicationTime.substring(0,10):''}}</td>
                                <td align="left">项目要求交货时间</td>
                                <td>{{printList.requirementDeliveryTime!=null?printList.requirementDeliveryTime.substring(0,10):''}}</td>
                            </tr>
                            <tr>
                                <td align="left">使用地址</td>
                                <td>{{printList.useAddress}}</td>
                                <td align="left">项目要求完成时间</td>
                                <td>{{printList.requirementCompleteTime!=null?printList.requirementCompleteTime.substring(0,10):''}}</td>
                            </tr>
                            <tr>
                                <td align="left">设备采购建议</td>
                                <td align="left" colspan="3">内部制造（
                                    <span v-if="suggestShow">√</span>）外部制造（
                                    <span v-if="!suggestShow">√</span> ）</td>
                            </tr>
                            <tr style="height:90px;border-bottom:0px solid white;">
                                <td rowspan="2" align="center">主要内容（申请部门填写）</td>
                                <td align="left" colspan="3" style="border-bottom:0px solid white;">
                                    <span>主要内容及规模：
                                        <span style="font-size:14px;" v-for="(item,index) in printList.equipRecordNumList" :key="item.id">
                                            {{index + 1 }}、
                                            <u>设备名称</u>：{{item.equipName}}，
                                            <u>设备数量</u>：{{item.equipNum}}，
                                            <u>主要内容</u>：{{item.primaryCoverage}}；<br /></span>
                                    </span>
                                </td>
                            </tr>
                            <tr style="border-top:0px solid white;">
                                <td style="border-top:0px solid white;border-bottom:0px solid white;" colspan="3" align="right">
                                    <span>台数：{{printList.num}}&nbsp;&nbsp;</span>
                                    <span>项目主管部门签字：{{printList.xmzgbmr}}&nbsp;&nbsp;</span>
                                    <span>日期：{{printList.xmzgbmrDate!=null?printList.xmzgbmrDate.substring(0,10):''}}&nbsp;</span>
                                </td>
                            </tr>
                            <tr style="height:60px;">
                                <td>技术项目负责人</td>
                                <!-- <span style="border-right:0px solid white;float:left">附技术要求</span> -->
                                <td colspan="2" style="border-right:0px solid white;">{{printList.technologyLeaderOpinion}}</td>
                                <td style="position: relative;border-left:0px solid white;">
                                    <span style="position: absolute;left:-100px;bottom:1px;">技术负责人：{{printList.technologyLeaderName}}</span>
                                    <span style="position: absolute;right:10px;bottom:1px;">日期：{{printList.technologyLeaderDate!=null?printList.technologyLeaderDate.substring(0,10):''}}</span>
                                </td>
                            </tr>
                            <tr style="height:80px;">
                                <td rowspan="2">安全、环保要求审核（非工厂项目无需工厂签字</td>
                                <td colspan="2" style="border-right:0px solid white;" align="left">工厂设备科长（安环内容）:{{printList.sbkkzOpinion}}</td>
                                <td style="position: relative;border-left:0px solid white;">
                                    <span style="position: absolute;left:-100px;bottom:1px;">签字：{{printList.sbkkz}}</span>
                                    <span style="position: absolute;right:10px;bottom:1px;">日期：{{printList.sbkkzDate!=null?printList.sbkkzDate.substring(0,10):''}}</span>
                                </td>
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
                            <tr style="height:60px;border-bottom:0px solid white;" >
                                <td rowspan="2" align="center">资产部</td>
                                <td align="left" colspan="3" style="border-bottom:0px solid white;">
                                    <span>检查有无附技术标准，未附不给予签字，同时审核采购原因是否充分</span>
                                </td>
                                
                                <!-- <td>资产部</td>
                                <td colspan="2" style="border-right:0px solid white;font-size:16px" align='left'>检查有无附技术标准，未附不给予签字，同时审核采购原因是否充分</td>
                                <span style="border-right:0px solid white;float:left">{{printList.zcbOpinion}}</span>
                                <td colspan="2" style="position: relative;border-left:0px solid white;">
                                    <span style="position: absolute;left:-100px;bottom:1px;">签字：{{printList.zcb}}</span>
                                    <span style="position: absolute;right:10px;bottom:1px;">日期：{{printList.zcbDate!=null?printList.zcbDate.substring(0,10):''}}</span>
                                </td> -->
                            </tr>
                            <tr style="border-top:0px solid white;">
                                <td style="border-top:0px solid white;border-bottom:0px solid white;" colspan="3" align="right">
                                    <span>签字：{{printList.zcb}}&nbsp;&nbsp;</span>
                                    <span>日期：{{printList.xmzgbmrDate!=null?printList.xmzgbmrDate.substring(0,10):''}}&nbsp;</span>
                                </td>
                            </tr>
                            <tr style="height:30px;border-bottom:0px solid white;">
                                <td rowspan="4" align="left">项目总投资（集团技改办预算）</td>
                                <td align="left" colspan="3" style="border-bottom:0px solid white;">1、预算：{{printList.budget}}</td>
                            </tr>
                            <tr style="height:20px;border-bottom:0px solid white;border-top:0px solid white;">
                                <td align="left" colspan="3" style="border-bottom:0px solid white;border-top:0px solid white;">
                                    2、设备采购完成时间：{{printList.equipBuyCompleteTime!=null?printList.equipBuyCompleteTime.substring(0,10):''}}</td>
                            </tr>
                            <tr style="height:20px;border-bottom:0px solid white;border-top:0px solid white;">
                                <td align="left" colspan="3" style="border-bottom:0px solid white;border-top:0px solid white;">
                                    </td>
                            </tr>
                            <tr style="height:20px;border-top:0px solid white;">
                                <td align="right" colspan="3" style="border-top:0px solid white;">
                                    <span>集团技改办签字：{{printList.jtjgb}}&nbsp;&nbsp;</span>
                                    <span>日期：{{printList.jtjgbDate!=null?printList.jtjgbDate.substring(0,10):''}}</span>
                                </td>
                            </tr>
                            <tr style="height:60px;">
                                <td>董事长审批</td>
                                <td colspan="2" style="border-right:0px solid white;">{{printList.dszOpinion}}</td>
                                <td style="position: relative;border-left:0px solid white;">
                                    <span style="position: absolute;left:-100px;bottom:1px;">签字：{{printList.dsz}}</span>
                                    <span style="position: absolute;right:10px;bottom:1px;">日期：{{printList.dszDate!==null?printList.dszDate.substring(0,10):''}}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </el-dialog>
        </el-container>
    </div>
</template>

<script>
import { fetchList, saveArticle, createArticle, getDetail, updateArticle, updateArticleSubmit, delById, fetchPrint } from '@/api/procurementRecord/procurementFiling'
import { fetchComTree, fetchComByCode, fetchOrgTree, fetchChooseTree, choosePersonList,
  uploadlist, deleteFile, fileList, getCurrentUser, insertFile, deleteFileById, recordList, processChart, fetchEquipName, getProxyOrgList,
  commonOptions } from '@/api/common/common'
import { fetchButton } from "@/api/common/button";
import { menuList } from "@/store/modules/permission"; // 按钮权限
import { baseUrl } from "@/api/common/fileBaseUrl";

export default {
    name: "procurementFiling",
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
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            // 定义当前时间
            year: undefined,
            month: undefined,
            day: undefined,
            activeName: "first",
            // 判断新增、编辑、删除按钮权限显示隐藏
            menuCode: undefined,
            addShow: false,
            editShow: false,
            deleteShow: false,
            chooseShow: true, // 选择按钮
            printShow: false,
            chartData: null, // 流程图
            delShow: false,
            // 弹框显示
            dialogFormVisible: false,
            // centerDialogVisible: false,
            // dialogTableVisible: false,
            printDialogVisible: false, // 打印
            dialogStatus: "",
            textMap: {
                update: "编辑",
                create: "新增",
                detail: "查看"
            },
            dialogStatus1: "",
            textMap1: {
                company: "选择公司",
                factory: "选择工厂"
            },
            // 审核状态下拉框
            options: commonOptions,
            auditingType: "",
            // 关联人员
            diaLoading: false,
            orgListData: null,
            innerVisibleCompany: false, // 公司名称选择弹框
            innerVisibleLeader: false, // 项目组长选择弹框
            personOrgData: [],
            innerVisibleTech: false, // 技术负责人弹框
            // 选择公司
            defaultProps: {
                children: "children",
                label: "orgFullName"
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
                children: "children",
                label: "categoryName"
            },
            p: 0,
            equipDialogVisible: false,
            branchEquipData: [],
            equipIndex: 0,
            // 表格数据
            tableKey: 0,
            tableData: [],
            listLoading: false,
            total: null,
            pageNum: 1,
            pageSize: 10,
            documentWordCode: '',
            documentWordCode1: '',
            dctualOrgName: '',
            auditingType: '',
            // listQuery: {
            //     documentWordCode: undefined,
            //     dctualOrgName: undefined,
            //     auditingType: undefined
            // },
            listQuery1: {
                pageNum: 1,
                pageSize: 1000,
                perName: undefined,
                workNumber: undefined
            },
            // 文件数据
            xmfaFileData: [],
            fileData: [],
            jszlFileData: [],
            userId: undefined, // 用户id
            processInstanceId: undefined, // 流程实例id
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
            // 查看采购申请单
            gridData: [],
            temp: {
                companyCode: undefined,
                companyName: undefined,
                factoryCode: undefined,
                factoryName: undefined,
                dctualOrgCode: undefined, // 实际使用部门
                dctualOrgName: undefined, // 实际使用部门名
                // equipBuySuggest: "内部制造",
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
                documentWordCode: '', // 编号
                projectOutsideName: undefined, // 项目外部名称
                budget: undefined, // 预算
                equipBuyCompleteTime: undefined, // 设备采购完成时间
                equipRecordNumList: [
                    {
                        equipCode: null,
                        equipName: null,
                        equipNum: null,
                        primaryCoverage: null
                    }
                ], // 主要内容集合
                proxyOrgCode: undefined, // 代理组织
                proxyOrgName: undefined
            },
            rules: {
                // orgName: [{ required: true, message: '此项为必填项', trigger: 'change' }],
                companyName: [{ required: true, message: '此项为必填项', trigger: 'change' }],
                factoryName: [{ required: true, message: '此项为必填项', trigger: 'change' }],
                technologyLeaderName: [{ required: true, message: '此项为必填项', trigger: 'change' }],
                dctualOrgName: [{ required: true, message: '此项为必填项', trigger: 'change' }],
                requirementCompleteTime: [{ required: true, message: '此项为必填项', trigger: 'change' }],
                applicationReason: [{ required: true, message: '此项为必填项', trigger: 'change' }],
                detailRequirement: [{ required: true, message: '此项为必填项', trigger: 'change' }],
                requirementDeliveryTime: [{ required: true, message: '此项为必填项', trigger: 'change' }],
                primaryCoverage: [{ required: true, message: '此项为必填项', trigger: 'change' }],
                equipName: [{ required: true, message: '此项为必填项', trigger: 'change' }],
                equipNum: [{ required: true, message: '此项为必填项', trigger: 'change' }]
            }
        };
    },
    created() {
        this.getList();
        this.getButton();
        this.getDate();
    },
    methods: {
        renderContent(h, { node, data, store }) {
            return (
                <span>
                    <span title={node.label}>{node.label}</span>
                </span>
            );
        },
        getButton() {
            menuList.forEach(item => {
                item.children.forEach(e => {
                    if (e.name == "procurementFiling") {
                        this.menuCode = e.code;
                    }
                });
            });
            // 查询按钮信息
            const params = {
                menuCode: this.menuCode,
                type: "web"
            };
            fetchButton(params).then(response => {
                if (response.data.code == 200) {
                    const getBtns = response.data.data;
                    for (var i = 0; i < getBtns.length; i++) {
                        if (getBtns[i].buttonName == "新增") {
                            this.addShow = true;
                        } else if (getBtns[i].buttonName == "编辑") {
                            this.editShow = true;
                        } else if (getBtns[i].buttonName == "删除") {
                            this.deleteShow = true;
                        }
                    }
                } else {
                    this.$notify({
                        title: "警告",
                        message: response.data.msg,
                        type: "warning",
                        duration: 2000
                    });
                }
            });
        },
        // 获取当前时间
        getDate() {
            var date = new Date();
            this.year = date.getFullYear();
            this.month = date.getMonth() + 1;
            this.day = date.getDate();
            if (this.month < 10) {
                this.month = "0" + this.month;
            }
            if (this.day < 10) {
                this.day = "0" + this.day;
            }
            var nowDate = this.year + "-" + this.month + "-" + this.day;
        },
        getList() {
            this.tableData = [];
            this.listLoading = true;
            fetchList(this.pageNum,this.pageSize,this.documentWordCode1,this.dctualOrgName,this.auditingType).then(response => {
                if (response.data.code === 200) {
                    if (response.data.data != null && response.data.data.list != null) {
                        this.tableData = response.data.data.list;
                        for (var i = 0; i < this.tableData.length; i++) {
                            if (this.tableData[i].auditingType == 1) {
                                this.tableData[i].auditingType = "未提交";
                            } else if (this.tableData[i].auditingType == 2) {
                                this.tableData[i].auditingType = "审核中";
                                this.tableData[i].editDisabled = true;
                                this.tableData[i].deleteDisabled = true;
                            } else if (this.tableData[i].auditingType == 3) {
                                this.tableData[i].auditingType = "审核通过";
                                this.tableData[i].editDisabled = true;
                                this.tableData[i].deleteDisabled = true;
                            } else if (this.tableData[i].auditingType == 4) {
                                this.tableData[i].auditingType = "审核不通过";
                                this.tableData[i].editDisabled = true;
                                this.tableData[i].deleteDisabled = true;
                                this.tableData[i].lookDisabled = true;
                            } else if (this.tableData[i].auditingType == 5) {
                                this.tableData[i].auditingType = "流程关闭";
                                this.tableData[i].editDisabled = true;
                                this.tableData[i].deleteDisabled = true;
                            }
                        }
                        this.total = response.data.data.total;
                    }
                    setTimeout(() => {
                        this.listLoading = false;
                    }, 1 * 500);
                } else {
                    this.$notify({
                        title: "警告",
                        message: response.data.msg,
                        type: "warning",
                        duration: 2000
                    });
                    this.listLoading = false;
                }
            });
        },
        // 搜索
        handleFilter() {
            this.pageNum = 1;
            this.getList();
        },
        // 分页
        handleSizeChange(val) {
            this.pageSize = val;
            this.getList();
        },
        handleCurrentChange(val) {
            this.pageNum = val;
            this.getList();
        },
        // 公司名称选择
        handleChooseCompany() {
            this.getOrgCode = undefined;
            this.getOrgName = undefined;
            this.innerVisibleCompany = true;
            this.diaLoading = true;
            fetchComTree().then(response => {
                this.orgData = [];
                this.orgData.push(response.data.data);
            });
            setTimeout(() => {
                this.diaLoading = false;
            }, 1 * 1000);
        },
        handleNodeClick1(data) {
            this.getOrgName = data.orgFullName;
            this.getOrgCode = data.orgCode;
        },
        // 公司名称选择确认
        handleClickVisibleCompany() {
            this.temp.orgName = this.getOrgName;
            this.temp.orgCode = this.getOrgCode;
            this.innerVisibleCompany = false;
        },
        // 项目组长选择
        handleChooseLeader() {
            this.choosePerson();
            this.innerVisibleLeader = true;
        },
        choosePerson() {
            this.listQuery1 = {
                pageNum: 1,
                pageSize: 1000,
                perName: undefined,
                workNumber: undefined
            };
            this.orgListData = null;
            this.diaLoading = true;
            fetchChooseTree().then(response => {
                this.personOrgData = [];
                this.personOrgData.push(response.data.data);
                setTimeout(() => {
                    this.diaLoading = false;
                }, 1 * 1000);
            });
        },
        chooseData(row) {
            this.temp.projectLeaderName = row.perName;
            this.temp.projectLeaderWorkNumber = row.workNumber;
        },
        // 技术负责人选择
        handleChooseTech() {
            this.choosePerson();
            this.innerVisibleTech = true;
        },
        handleNodeClick(data) {
            const params = {
                orgCode: data.orgCode,
                pageNum: 1,
                pageSize: 2000
            };
            choosePersonList(params).then(response => {
                this.orgListData = response.data.data.list;
            });
        },
        handlePerson() {
            this.orgListData = [];
            choosePersonList(this.listQuery1).then(response => {
                this.orgListData = response.data.data.list;
            });
        },
        chooseData1(row) {
            this.temp.technologyLeaderName = row.perName;
            this.temp.technologyLeaderWorkNumber = row.workNumber;
        },
        // 设备名称选择
        handleChooseEquip(index) {
            this.equipIndex = index;
            this.equipDialogVisible = true;
            fetchEquipName().then(response => {
                this.branchEquipData = [];
                this.branchEquipData = response.data.data;
                for (var i = 0; i < this.branchEquipData.length; i++) {
                    this.branchEquipData[i].disabled = true;
                    for (
                        var j = 0;
                        j < this.branchEquipData[i].children.length;
                        j++
                    ) {
                        const child = this.branchEquipData[i].children[j];
                        child.disabled = true;
                    }
                }
            });
        },
        // 设备名称树被选中
        handleChangeEquip(data, checked, node) {
            this.p++;
            if (this.p % 2 == 0) {
                if (checked) {
                    this.$refs.treeEquip.setCheckedNodes([]);
                    this.$refs.treeEquip.setCheckedNodes([data]);
                    // 交叉点击节点
                } else {
                    this.$refs.treeEquip.setCheckedNodes([]);
                    // 点击已经选中的节点，置空
                }
            }
        },
        // 设备名称点击确认
        handleClickEquip() {
            this.treeData1 = this.$refs.treeEquip.getCheckedNodes();
            for (var item of this.temp.equipRecordNumList) {
                if (item.equipCode == this.treeData1[0].categoryCode) {
                    this.$notify({
                        title: "警告",
                        message: "设备名称重复，请重新选择",
                        type: "warning",
                        duration: 2000
                    });
                    return;
                }
            }
            this.temp.equipRecordNumList[
                this.equipIndex
            ].equipName = this.treeData1[0].categoryName;
            this.temp.equipRecordNumList[
                this.equipIndex
            ].equipCode = this.treeData1[0].categoryCode;
            this.equipDialogVisible = false;
        },
        // 设置公司/工厂组织树状图单选
        handleChange1(data, checked, node) {
            this.j++;
            if (this.j % 2 == 0) {
                if (checked) {
                    this.$refs.comtree.setCheckedNodes([]);
                    this.$refs.comtree.setCheckedNodes([data]);
                    // 交叉点击节点
                } else {
                    this.$refs.comtree.setCheckedNodes([]);
                    // 点击已经选中的节点，置空
                }
            }
        },
        // 选择使用公司
        changeCompany() {
            this.j = 0;
            this.dialogStatus1 = "company";
            this.getCompanyCode = undefined;
            this.getCompanyName = undefined;
            this.companyData = [];
            this.companyVisible = true;
            this.diaLoading = true;
            fetchComTree().then(response => {
                if (response.data.code === 200) {
                    this.companyData.push(response.data.data);
                }
            });
            setTimeout(() => {
                this.diaLoading = false;
            }, 1 * 1000);
        },
        // 选择公司确认
        handleClickCompany() {
            this.treeData1 = this.$refs.comtree.getCheckedNodes();
            this.getCompanyCode = this.treeData1[0].orgCode;
            this.getCompanyName = this.treeData1[0].orgFullName;
            this.temp.companyName = this.getCompanyName;
            this.temp.companyCode = this.getCompanyCode;
            this.temp.factoryCode = undefined;
            this.temp.factoryName = undefined;
            this.companyVisible = false;
        },
        // 选择使用工厂
        changeFactory() {
            this.j = 0;
            this.dialogStatus1 = "factory";
            this.getCompanyCode = undefined;
            this.getCompanyName = undefined;
            this.companyData = [];
            this.companyVisible = true;
            this.diaLoading = true;
            if (
                this.temp.companyCode != undefined &&
                this.temp.companyCode != null &&
                this.temp.companyCode != ""
            ) {
                const find = {
                    orgCode: this.temp.companyCode
                };
                fetchComByCode(find).then(response => {
                    if (response.data.code === 200) {
                        this.companyData.push(response.data.data);
                        for (var i = 0; i < this.companyData.length; i++) {
                            if (this.companyData[i].orgType == "部门") {
                                this.companyData[i].disabled = true;
                            }
                            for (
                                var j = 0;
                                j < this.companyData[i].children.length;
                                j++
                            ) {
                                const child = this.companyData[i].children[j];
                                if (child.orgType == "部门") {
                                    child.disabled = true;
                                }
                                if (child.children !== null) {
                                    for (
                                        var p = 0;
                                        p < child.children.length;
                                        p++
                                    ) {
                                        if (
                                            child.children[p].orgType == "部门"
                                        ) {
                                            child.children[p].disabled = true;
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
            }
            setTimeout(() => {
                this.diaLoading = false;
            }, 1 * 1000);
        },
        // 选择工厂确认
        handleClickFactory() {
            this.treeData1 = this.$refs.comtree.getCheckedNodes();
            this.getCompanyCode = this.treeData1[0].orgCode;
            this.getCompanyName = this.treeData1[0].orgFullName;
            this.temp.factoryName = this.getCompanyName;
            this.temp.factoryCode = this.getCompanyCode;
            this.temp.dctualOrgName = undefined;
            this.companyVisible = false;
        },
        // 选择使用部门
        changeDivision() {
            this.getOrgCode = undefined;
            this.getOrgName = undefined;
            this.orgData = [];
            this.divisionVisible = true;
            this.diaLoading = true;
            if (
                this.temp.factoryCode != undefined &&
                this.temp.factoryCode != null &&
                this.temp.factoryCode != ""
            ) {
                const find1 = {
                    orgCode: this.temp.factoryCode
                };
                fetchOrgTree(find1).then(response => {
                    if (response.data.code === 200) {
                        this.orgData = response.data.data;
                        for (var i = 0; i < this.orgData.length; i++) {
                            if (this.orgData[i].orgType == "公司") {
                                this.orgData[i].disabled = true;
                            }
                            if (this.orgData[i].children !== null) {
                                for (
                                    var j = 0;
                                    j < this.orgData[i].children.length;
                                    j++
                                ) {
                                    const child = this.orgData[i].children[j];
                                    if (child.orgType == "公司") {
                                        child.disabled = true;
                                    }
                                    if (child.children != null) {
                                        for (
                                            var p = 0;
                                            p < child.children.length;
                                            p++
                                        ) {
                                            const child1 = child.children[p];
                                            if (child1.orgType == "公司") {
                                                child1.disabled = true;
                                            }
                                            if (child1.children != null) {
                                                for (
                                                    var o = 0;
                                                    o < child1.children.length;
                                                    o++
                                                ) {
                                                    const child2 =
                                                        child1.children[o];
                                                    if (
                                                        child2.orgType == "公司"
                                                    ) {
                                                        child2.disabled = true;
                                                    }
                                                    if (
                                                        child2.children != null
                                                    ) {
                                                        for (
                                                            var q = 0;
                                                            q <
                                                            child2.children
                                                                .length;
                                                            q++
                                                        ) {
                                                            const child3 =
                                                                child2.children[
                                                                    q
                                                                ];
                                                            if (
                                                                child3.orgType ==
                                                                "公司"
                                                            ) {
                                                                child3.disabled = true;
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
                });
            }

            setTimeout(() => {
                this.diaLoading = false;
            }, 1 * 1000);
        },
        // 设置部门组织树状图单选
        handleChange(data, checked, node) {
            this.i++;
            if (this.i % 2 == 0) {
                if (checked) {
                    this.$refs.tree.setCheckedNodes([]);
                    this.$refs.tree.setCheckedNodes([data]);
                    // 交叉点击节点
                } else {
                    this.$refs.tree.setCheckedNodes([]);
                    // 点击已经选中的节点，置空
                }
            }
        },
        // 获取部门被选择的节点
        getCheckedNodes() {
            this.treeData = this.$refs.tree.getCheckedNodes();
            this.getOrgCode = this.treeData[0].orgCode;
            this.getOrgName = this.treeData[0].orgFullName;
        },
        // 点击选择部门确认
        handleClick2() {
            this.getCheckedNodes();
            this.temp.dctualOrgName = this.getOrgName;
            this.temp.dctualOrgCode = this.getOrgCode;
            this.divisionVisible = false;
        },
        // 表单里表格新增和删除
        addRow() {
            this.delShow = true;
            var list = {
                equipCode: null,
                equipName: null,
                equipNum: null,
                primaryCoverage: null
            };
            this.temp.equipRecordNumList.unshift(list);
        },
        delRow(row) {
            const index = this.temp.equipRecordNumList.indexOf(row);
            this.temp.equipRecordNumList.splice(index, 1);
            if (this.temp.equipRecordNumList.length == 1) {
                this.delShow = false;
            }
        },
        resetTemp() {
            this.temp = {
                companyCode: undefined,
                companyName: undefined,
                factoryCode: undefined,
                factoryName: undefined,
                dctualOrgCode: undefined, // 实际使用部门
                dctualOrgName: undefined, // 实际使用部门名
                // equipBuySuggest: "内部制造",
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
                equipRecordNumList: [
                    {
                        equipCode: null,
                        equipName: null,
                        equipNum: null,
                        primaryCoverage: null
                    }
                ], // 主要内容集合
                proxyOrgCode: undefined, // 代理组织
                proxyOrgName: undefined
            };
            this.fileData = [];
            this.xmfaFileData = [];
            this.jszlFileData = [];
            this.userId = undefined;
            this.documentWordCode = '';
            this.getOrgName = "";
            this.getOrgCode = "";
        },
        // 新增
        handleCreate() {
            this.resetTemp();
            this.delShow = false;
            this.dialogStatus = "create";
            this.chooseShow = true;
            this.recordShow = false;
            this.activeName = "first";
            this.getUser();
            this.dialogFormVisible = true;
            this.$nextTick(() => {
                this.$refs["dataForm"].clearValidate();
            });
        },
        // 新增提交
        createData() {
            this.ifSave = false;
            this.$refs["dataForm"].validate(valid => {
                if (valid) {
                    // if (this.xmfaFileData.length == 0) {
                    //     this.$notify({
                    //         title: "警告",
                    //         message: "请上传项目方案附件",
                    //         type: "warning",
                    //         duration: 2000
                    //     });
                    //     return;
                    // }
                    if (this.proxyOrgList.length != 0) {
                        this.changeOrgVisible = true;
                    } else {
                        this.temp.proxyOrgCode = this.comCode;
                        this.createSubmit();
                    }
                }
            });
        },
        createSubmit() {
            this.listLoading = true;
            this.fileData.forEach(item=>{
                this.temp.list.push(item)
            })
            this.xmfaFileData.forEach(item => {
                this.temp.list.push(item);
            });
            this.jszlFileData.forEach(item1=>{
                this.temp.list.push(item1)
            })
            createArticle(this.temp).then(response => {
                if (response.data.code == 200) {
                    this.tableData.unshift(this.temp);
                    this.dialogFormVisible = false;
                    this.getList();
                    setTimeout(() => {
                        this.listLoading = false;
                    }, 1 * 500);
                    this.$message({
                        title: "成功",
                        message: "提交成功",
                        type: "success",
                        duration: 2000
                    });
                } else {
                    this.$notify({
                        title: "警告",
                        message: response.data.msg,
                        type: "warning",
                        duration: 2000
                    });
                    this.listLoading = false;
                }
            });
        },
        // 新增保存
        saveData() {
            this.ifSave = true;
            this.$refs["dataForm"].validate(valid => {
                if (valid) {
                    if (this.proxyOrgList.length != 0) {
                        this.changeOrgVisible = true;
                    } else {
                        this.temp.proxyOrgCode = this.comCode;
                        this.createSave();
                    }
                }
            });
        },
        // 新增保存请求
        createSave() {
            this.listLoading = true;
            this.fileData.forEach(item=>{
                this.temp.list.push(item)
            })
            this.xmfaFileData.forEach(item => {
                this.temp.list.push(item);
            });
            this.jszlFileData.forEach(item1=>{
                this.temp.list.push(item1)
            })
            saveArticle(this.temp).then(response => {
                if (response.data.code == 200) {
                    this.dialogFormVisible = false;
                    this.getList();
                    setTimeout(() => {
                        this.listLoading = false;
                    }, 1 * 500);
                    this.$message({
                        title: "成功",
                        message: "保存成功",
                        type: "success",
                        duration: 2000
                    });
                } else {
                    this.$notify({
                        title: "警告",
                        message: response.data.msg,
                        type: "warning",
                        duration: 2000
                    });
                    this.listLoading = false;
                }
            });
        },
        // 编辑
        handleUpdate(row) {
            this.dialogStatus = "update";
            this.chooseShow = true;
            this.recordShow = false;
            this.activeName = "first";
            this.dialogFormVisible = true;
            this.documentWordCode = row.documentWordCode;
            const id = row.id;
            // 根据id获取详情
            getDetail(id).then(response => {
                this.temp = Object.assign({}, response.data.data);
                // this.temp.equipRecordNumList = this.temp.list
                if (this.temp.equipRecordNumList.length == 1) {
                    this.delShow = false;
                } else {
                    this.delShow = true;
                }
            });
            this.getUser();
            this.getFileList(); // 获取文件
            this.$nextTick(() => {
                this.$refs["dataForm"].clearValidate();
            });
        },
        getUser() {
            // 获取当前用户信息
            getCurrentUser().then(response => {
                if (response.data.code == 200) {
                    this.userId = response.data.data.id;
                    this.userCode = response.data.data.userCode;
                    getProxyOrgList(this.userCode).then(response => {
                        if (response.data.code == 200) {
                            this.proxyOrgList = [];
                            this.comName = response.data.data.orgName;
                            this.comCode = response.data.data.orgCode;
                            if (this.proxyOrgList != null) {
                                this.proxyOrgList = response.data.data.list;
                            }
                        }
                    });
                }
            });
        },
        proxyOrgChange() {
            this.proxyOrgList.forEach(item => {
                if (item.orgName == this.temp.proxyOrgName) {
                    this.temp.proxyOrgCode = item.orgCode;
                }
            });
        },
        changeOrgOk() {
            if (
                this.temp.proxyOrgName == undefined ||
                this.temp.proxyOrgName == "" ||
                this.temp.proxyOrgName == null
            ) {
                this.temp.proxyOrgCode = this.comCode;
                if (this.ifSave == true) {
                    this.createSave();
                } else if (this.ifSave == false) {
                    this.createSubmit();
                }
            } else {
                if (this.ifSave == true) {
                    this.createSave();
                } else if (this.ifSave == false) {
                    this.createSubmit();
                }
            }
            this.changeOrgVisible = false;
        },
        // 修改提交
        updateData() {
            this.$refs["dataForm"].validate(valid => {
                if (valid) {
                    // if (this.xmfaFileData.length == 0) {
                    //     this.$notify({
                    //         title: "警告",
                    //         message: "请上传项目方案附件",
                    //         type: "warning",
                    //         duration: 2000
                    //     });
                    //     return;
                    // }
                    this.updataSubmit();
                }
            });
        },
        updataSubmit() {
            this.listLoading = true;
            const tempData = Object.assign({}, this.temp);
            updateArticleSubmit(tempData).then(response => {
                if (response.data.code == 200) {
                    this.dialogFormVisible = false;
                    this.getList();
                    setTimeout(() => {
                        this.listLoading = false;
                    }, 1 * 500);
                    this.$message({
                        title: "成功",
                        message: "提交成功",
                        type: "success",
                        duration: 2000
                    });
                } else {
                    this.$notify({
                        title: "警告",
                        message: response.data.msg,
                        type: "warning",
                        duration: 2000
                    });
                    this.listLoading = false;
                }
            });
        },
        // 修改保存
        updateSaveData() {
            this.$refs["dataForm"].validate(valid => {
                if (valid) {
                    this.listLoading = true;
                    const tempData = Object.assign({}, this.temp);
                    updateArticle(tempData).then(response => {
                        if (response.data.code == 200) {
                            this.dialogFormVisible = false;
                            this.getList();
                            setTimeout(() => {
                                this.listLoading = false;
                            }, 1 * 500);
                            this.$message({
                                title: "成功",
                                message: "保存成功",
                                type: "success",
                                duration: 2000
                            });
                        } else {
                            this.$notify({
                                title: "警告",
                                message: response.data.msg,
                                type: "warning",
                                duration: 2000
                            });
                            this.listLoading = false;
                        }
                    });
                }
            });
        },
        // 删除
        deleteBtn(row) {
            this.$confirm("是否确认删除?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    const id = row.id;
                    delById(id).then(response => {
                        if (response.data.code === 200) {
                            const index = this.tableData.indexOf(row);
                            this.tableData.splice(index, 1);
                            this.getList();
                            this.$message({
                                title: "成功",
                                type: "success",
                                message: "删除成功!",
                                duration: 2000
                            });
                        } else {
                            this.$notify({
                                title: "警告",
                                message: response.data.msg,
                                type: "warning",
                                duration: 2000
                            });
                        }
                    });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        },
        // 根据编号查看
        handleDetail(row) {
            this.delShow = false;
            this.activeName = "first";
            this.chooseShow = false;
            this.recordShow = true;
            this.printShow = false;
            this.dialogStatus = "detail";
            this.dialogFormVisible = true;
            const id = row.id;
            this.documentWordCode = row.documentWordCode; // 单据编号
            if (row.auditingType == "审核通过") {
                this.printShow = true;
            }
            // 表单信息
            getDetail(id).then(response => {
                if (response.data.code == 200) {
                    this.temp = Object.assign({}, response.data.data);
                } else {
                    this.$notify({
                        title: "警告",
                        message: response.data.msg,
                        type: "warning",
                        duration: 2000
                    });
                }
            });
            this.getFileList(); // 获取文件
            // 流转记录
            this.processInstanceId = row.processInstanceId;
        },
        // 获取文件列表
        getFileList() {
            // 审核附件
            const find = {
                moduleType: "25", 
                attachmentCode: "SBBACGSQDQTFJ", 
                documentWordCode: this.documentWordCode 
            };
            fileList(find).then(response => {
                this.fileData = response.data.data; 
            });
            // 项目方案
            const find1 = {
                moduleType: "25", // 模块类别
                attachmentCode: "SBBACGSQDXMFAFJ", 
                documentWordCode: this.documentWordCode 
            };
            fileList(find1).then(response => {
                this.xmfaFileData = response.data.data; 
            });
            // 技术资料
            const find2 = {
                moduleType: "25", // 模块类别
                attachmentCode: "SBBACGSQDJSZLFJ", 
                documentWordCode: this.documentWordCode 
            };
            fileList(find2).then(response => {
                this.jszlFileData = response.data.data; 
            });
        },
        // 审核附件
        fileUpload(e) {
            const file = e.target.files[0];
            const fileData1 = {
                attachmentCode: "SBBACGSQDQTFJ",
                code: this.documentWordCode,
                moduleType: "25",
                fileName: undefined,
                filePath: undefined, // 文件URL
                node: "开始",
                fileUrl: undefined,
                userId: this.userId
            };
            if (file != null) {
                this.listLoading = true;
                const param = new FormData(); // 创建form对象
                param.append("file", file, file.name); // 通过append向form对象添加数据
                fileData1.fileName = file.name;
                uploadlist(param).then(resp => {
                    // 调用上传接口
                    if (resp.data.code == 200) {
                        fileData1.filePath = resp.data.data.remoteFilename;
                        fileData1.fileUrl = resp.data.data.fileUrl;
                        // 新增文件
                        if (this.dialogStatus == "update") {
                            insertFile(fileData1).then(response => {
                                if (response.data.code == 200) {
                                    fileData1.id = response.data.data;
                                    this.$message({
                                        title: "成功",
                                        message: "上传成功",
                                        type: "success",
                                        duration: 2000
                                    });
                                    this.fileData.push(fileData1);
                                }
                            });
                        } else if (this.dialogStatus == "create") {
                            this.fileData.push(fileData1);
                            this.$message({
                                title: "成功",
                                message: "上传成功",
                                type: "success",
                                duration: 2000
                            });
                        }
                        setTimeout(() => {
                            this.listLoading = false;
                        }, 1 * 500);
                    } else if (resp.data.code == 402) {
                        this.$notify({
                            title: "警告",
                            message: resp.data.msg,
                            type: "warning",
                            duration: 2000
                        });
                    } else {
                        this.$notify({
                            title: "警告",
                            message: "上传失败",
                            type: "warning",
                            duration: 2000
                        });
                    }
                    this.listLoading = false;
                    const fileInput = document.getElementById("uploadImg");
                    fileInput.value = "";
                });
            }
        },
        // 项目方案
        fileUpload1(e) {
            const file = e.target.files[0];
            const fileData1 = {
                attachmentCode: "SBBACGSQDXMFAFJ",
                code: this.documentWordCode,
                moduleType: "25",
                fileName: undefined,
                filePath: undefined, // 文件URL
                node: "开始",
                fileUrl: undefined,
                userId: this.userId
            };
            if (file != null) {
                this.listLoading = true;
                const param = new FormData(); // 创建form对象
                param.append("file", file, file.name); // 通过append向form对象添加数据
                fileData1.fileName = file.name;
                uploadlist(param).then(resp => {
                    // 调用上传接口
                    if (resp.data.code == 200) {
                        fileData1.filePath = resp.data.data.remoteFilename;
                        fileData1.fileUrl = resp.data.data.fileUrl;
                        // 新增文件
                        if (this.dialogStatus == "update") {
                            insertFile(fileData1).then(response => {
                                if (response.data.code == 200) {
                                    fileData1.id = response.data.data;
                                    this.$message({
                                        title: "成功",
                                        message: "上传成功",
                                        type: "success",
                                        duration: 2000
                                    });
                                    this.xmfaFileData.push(fileData1);
                                }
                            });
                        } else if (this.dialogStatus == "create") {
                            this.xmfaFileData.push(fileData1);
                            this.$message({
                                title: "成功",
                                message: "上传成功",
                                type: "success",
                                duration: 2000
                            });
                        }
                        setTimeout(() => {
                            this.listLoading = false;
                        }, 1 * 500);
                    } else if (resp.data.code == 402) {
                        this.$notify({
                            title: "警告",
                            message: resp.data.msg,
                            type: "warning",
                            duration: 2000
                        });
                    } else {
                        this.$notify({
                            title: "警告",
                            message: "上传失败",
                            type: "warning",
                            duration: 2000
                        });
                    }
                    this.listLoading = false;
                    const fileInput1 = document.getElementById("uploadImg1");
                    fileInput1.value = "";
                });
            }
        },
        // 技术资料
        fileUpload2(e) {
            const file = e.target.files[0];
            const fileData2 = {
                attachmentCode: "SBBACGSQDJSZLFJ",
                code: this.documentWordCode,
                moduleType: "25",
                fileName: undefined,
                filePath: undefined, // 文件URL
                node: "开始",
                fileUrl: undefined,
                userId: this.userId
            };
            if (file != null) {
                this.listLoading = true;
                const param = new FormData(); // 创建form对象
                param.append("file", file, file.name); // 通过append向form对象添加数据
                fileData2.fileName = file.name;
                uploadlist(param).then(resp => {
                    // 调用上传接口
                    if (resp.data.code == 200) {
                        fileData2.filePath = resp.data.data.remoteFilename;
                        fileData2.fileUrl = resp.data.data.fileUrl;
                        // 新增文件
                        if (this.dialogStatus == "update") {
                            insertFile(fileData2).then(response => {
                                if (response.data.code == 200) {
                                    fileData2.id = response.data.data;
                                    this.$message({
                                        title: "成功",
                                        message: "上传成功",
                                        type: "success",
                                        duration: 2000
                                    });
                                    this.jszlFileData.push(fileData2);
                                }
                            });
                        } else if (this.dialogStatus == "create") {
                            this.jszlFileData.push(fileData2);
                            this.$message({
                                title: "成功",
                                message: "上传成功",
                                type: "success",
                                duration: 2000
                            });
                        }
                        setTimeout(() => {
                            this.listLoading = false;
                        }, 1 * 500);
                    } else if (resp.data.code == 402) {
                        this.$notify({
                            title: "警告",
                            message: resp.data.msg,
                            type: "warning",
                            duration: 2000
                        });
                    } else {
                        this.$notify({
                            title: "警告",
                            message: "上传失败",
                            type: "warning",
                            duration: 2000
                        });
                    }
                    this.listLoading = false;
                    const fileInput2 = document.getElementById("uploadImg2");
                    fileInput2.value = "";
                });
            }
        },
        // 文件下载
        fileDown(row) {
            if (row.fileUrl !== undefined) {
                window.location.href = row.fileUrl + "?attname=" + row.fileName;
            } else {
                window.location.href =
                    row.filePath + "?attname=" + row.fileName;
            }
        },
        // 技术资料
        jszlFileDelete(row) {
            this.$confirm("是否确认删除?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    // 新增时 删除
                    if (this.dialogStatus == "create") {
                        const find2 = {
                            fileName: row.filePath
                        };
                        deleteFile(find2).then(response => {
                            if (response.data.code === 200) {
                                const index = this.jszlFileData.indexOf(row);
                                this.jszlFileData.splice(index, 1);
                                this.$message({
                                    title: "成功",
                                    type: "success",
                                    message: "删除成功!",
                                    duration: 2000
                                });
                            } else {
                                this.$notify({
                                    title: "警告",
                                    message: response.data.msg,
                                    type: "warning",
                                    duration: 2000
                                });
                            }
                        });
                    } else if (this.dialogStatus == "update") {
                        const id = row.id;
                        deleteFileById(id).then(response => {
                            if (response.data.code === 200) {
                                const index = this.jszlFileData.indexOf(row);
                                this.jszlFileData.splice(index, 1);
                                this.$message({
                                    title: "成功",
                                    type: "success",
                                    message: "删除成功!",
                                    duration: 2000
                                });
                            } else {
                                this.$notify({
                                    title: "警告",
                                    message: response.data.msg,
                                    type: "warning",
                                    duration: 2000
                                });
                            }
                        });
                    }
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        },
        // 项目方案文件删除
        xmfaFileDelete(row) {
            this.$confirm("是否确认删除?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    // 新增时 删除
                    if (this.dialogStatus == "create") {
                        const find1 = {
                            fileName: row.filePath
                        };
                        deleteFile(find1).then(response => {
                            if (response.data.code === 200) {
                                const index = this.xmfaFileData.indexOf(row);
                                this.xmfaFileData.splice(index, 1);
                                this.$message({
                                    title: "成功",
                                    type: "success",
                                    message: "删除成功!",
                                    duration: 2000
                                });
                            } else {
                                this.$notify({
                                    title: "警告",
                                    message: response.data.msg,
                                    type: "warning",
                                    duration: 2000
                                });
                            }
                        });
                    } else if (this.dialogStatus == "update") {
                        const id = row.id;
                        deleteFileById(id).then(response => {
                            if (response.data.code === 200) {
                                const index = this.xmfaFileData.indexOf(row);
                                this.xmfaFileData.splice(index, 1);
                                this.$message({
                                    title: "成功",
                                    type: "success",
                                    message: "删除成功!",
                                    duration: 2000
                                });
                            } else {
                                this.$notify({
                                    title: "警告",
                                    message: response.data.msg,
                                    type: "warning",
                                    duration: 2000
                                });
                            }
                        });
                    }
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        },
        // 审核附件删除
        fileDelete(row) {
            this.$confirm("是否确认删除?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    const find1 = {
                        fileName: row.filePath
                    };
                    deleteFile(find1).then(response => {
                        if (response.data.code === 200) {
                            const index = this.fileData.indexOf(row);
                            this.fileData.splice(index, 1);
                            this.$message({
                                title: "成功",
                                type: "success",
                                message: "删除成功!",
                                duration: 2000
                            });
                        } else {
                            this.$notify({
                                title: "警告",
                                message: response.data.msg,
                                type: "warning",
                                duration: 2000
                            });
                        }
                    });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        },
        // 编辑文件删除
        updatefileDelete(row) {
            this.$confirm("是否确认删除?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    const id = row.id;
                    deleteFileById(id).then(response => {
                        if (response.data.code === 200) {
                            const index = this.fileData.indexOf(row);
                            this.fileData.splice(index, 1);
                            this.$message({
                                title: "成功",
                                type: "success",
                                message: "删除成功!",
                                duration: 2000
                            });
                        } else {
                            this.$notify({
                                title: "警告",
                                message: response.data.msg,
                                type: "warning",
                                duration: 2000
                            });
                        }
                    });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        },
        // 打印
        printData() {
            const params = {
                purchaseId: this.temp.id,
                processInstanceId: this.processInstanceId
            };
            fetchPrint(params).then(response => {
                if (response.data.code == 200) {
                    this.printList = response.data.data;
                    this.printList.num = 0
                    this.printList.equipRecordNumList.forEach(item=>{
                        this.printList.num += parseInt(item.equipNum)
                    })
                    if (response.data.data.equipBuySuggest == "内部制造") {
                        this.suggestShow = true;
                    } else {
                        this.suggestShow = false;
                    }
                } else {
                    this.$notify({
                        title: "警告",
                        message: response.data.msg,
                        type: "warning",
                        duration: 2000
                    });
                }
            });
            this.printDialogVisible = true;
        },
        // tabs 点击事件
        handleClick(tab, event) {
            this.chartData = null;
            this.recordData = null;
            if (
                this.processInstanceId != null &&
                this.processInstanceId != ""
            ) {
                if (tab.label == "流转记录") {
                    // 请求流转记录
                    this.listLoading = true;
                    recordList(this.processInstanceId).then(response => {
                        if (response.data.code === 200) {
                            this.recordData = response.data.data;
                            setTimeout(() => {
                                this.listLoading = false;
                            }, 1 * 500);
                        } else {
                            this.$notify({
                                title: "警告",
                                message: response.data.msg,
                                type: "warning",
                                duration: 2000
                            });
                            this.listLoading = false;
                        }
                    });
                } else if (tab.label == "流程图") {
                    this.listLoading = true;
                    processChart(this.processInstanceId).then(response => {
                        if (
                            response.data.code != 803 &&
                            response.data.code != 808
                        ) {
                            this.chartData = response.request.responseURL;
                            setTimeout(() => {
                                this.listLoading = false;
                            }, 1 * 500);
                        } else {
                            this.$notify({
                                title: "警告",
                                message: response.data.msg,
                                type: "warning",
                                duration: 2000
                            });
                            this.listLoading = false;
                        }
                    });
                }
            }
        },
        lookFile(row) {
            // let baseUrl = "http://192.168.85.172:8012/"
            // let url = baseUrl + "onlinePreview?url=" +  encodeURIComponent(baseUrl + "/or/"+row.fileName)
            let url;
            if (row.fileUrl !== undefined) {
                url =
                    baseUrl +
                    "onlinePreview?url=" +
                    encodeURIComponent(row.fileUrl);
            } else {
                url =
                    baseUrl +
                    "onlinePreview?url=" +
                    encodeURIComponent(row.filePath);
            }
            var winHeight = window.document.documentElement.clientHeight;
            window.open(
                url,
                "_blank",
                "height=" +
                    winHeight +
                    ",top=10,left=10,toolbar=no,menubar=no,scrollbars=yes,resizable=yes"
            );
        }
    }
};
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
.equip-title {
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
.formDw {
    position: absolute;
    right: 20px;
    top: 80px;
}
/* #printTest{
  margin-top:10px;
} */
#printTest table {
    font-family: "宋体";
    border-collapse: collapse;
    width: 99.5%;
}
#printTest table thead th {
    font-size: 16px;
    text-align: left;
}
#printTest table tbody tr {
    font-size: 16px;
    border: 1px solid black;
    height: 33px;
    text-align: center;
}
#printTest table tbody td {
    width: 25%;
    border: 1px solid black;
}
#pic {
    width: 100%;
}
</style>

