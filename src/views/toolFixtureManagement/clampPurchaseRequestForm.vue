<template>
    <div class='app-container'>
        <el-container>
            <div class="formSearch">
                <el-form :inline="true">
                    <el-form-item label="单据编号">
                        <el-input class="filter-item input" clearable placeholder="请输入单据编号" v-model="listQuery.documentWordCode">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="夹具名称">
                        <el-input class="filter-item input" clearable placeholder="请输入夹具名称" v-model="listQuery.equipName">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="使用部门">
                        <el-input class="filter-item input" clearable placeholder="请输入使用部门" v-model="listQuery.dctualOrgName">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="审核状态">
                        <el-select v-model="listQuery.auditingType" clearable placeholder="请选择">
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
                    <el-table-column prop="equipmentName" align="center" label="夹具名称">
                        <template slot-scope="scope">
                            <span>{{scope.row.equipmentName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="dctualOrgName" align="center" label="使用部门">
                        <template slot-scope="scope">
                            <span>{{scope.row.dctualOrgName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="purchaseQuantity" align="center" label="台数">
                        <template slot-scope="scope">
                            <span>{{scope.row.purchaseQuantity}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="applicationTime" align="center" label="申请时间">
                        <template slot-scope="scope">
                            <span>{{scope.row.applicationTime!=null?scope.row.applicationTime.substring(0,10):''}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="requirementDeliveryTime" align="center" label="要求交货时间">
                        <template slot-scope="scope">
                            <span>{{scope.row.requirementDeliveryTime!=null?scope.row.requirementDeliveryTime.substring(0,10):''}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="equipBuySuggest" align="center" label="夹具采购建议">
                        <template slot-scope="scope">
                            <span>{{scope.row.equipBuySuggest}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="auditingType" align="center" label="审核状态">
                        <template slot-scope="scope">
                            <span>{{scope.row.auditingType}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="assignee" align="center" label="当前处理人">
                        <template slot-scope="scope">
                            <span>{{scope.row.assignee}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="140px">
                        <template slot-scope="scope">
                            <el-button title="编辑" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-if="editShow" :disabled="scope.row.editDisabled?true:false"></el-button>
                            <el-button title="删除" type="danger" icon="el-icon-delete" size="mini" @click="deleteBtn(scope.row)" v-if="deleteShow" :disabled="scope.row.deleteDisabled?true:false"></el-button>
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
                        <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="120px">
                            <el-form-item>
                                <span class="equip-title">夹具采购申请单</span>
                            </el-form-item>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="单据编号" prop="documentWordCode">
                                        <el-input v-model="temp.documentWordCode" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="夹具名称" prop="equipmentName">
                                        <el-input v-model="temp.equipmentName" :disabled="!chooseShow" maxlength="20"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="10" style="padding-right:0px;">
                                    <el-form-item label="使用公司" prop="companyName">
                                        <el-input v-model="temp.companyName" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2" style="padding:0px;">
                                    <el-button type="primary" @click="changeCompany" :disabled="!chooseShow">选择</el-button>
                                </el-col>
                                <el-col :span="10" style="padding-right:0px;">
                                    <el-form-item label="使用工厂" prop="factoryName">
                                        <el-input v-model="temp.factoryName" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2" style="padding:0px;">
                                    <el-button type="primary" @click="changeFactory" :disabled="!chooseShow">选择</el-button>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="10" style="padding-right:0px;">
                                    <el-form-item label="使用部门" prop="dctualOrgName">
                                        <el-input v-model="temp.dctualOrgName" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2" style="padding-left:0px;">
                                    <el-button type="primary" @click="changeDivision" :disabled="!chooseShow">选择</el-button>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="台数" prop="purchaseQuantity">
                                        <el-input type="text" v-model="temp.purchaseQuantity" maxlength="5" oninput="value=value.replace(/[^\d]/g,'')" :disabled="!chooseShow"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="申请时间" prop="applicationTime">
                                        <el-date-picker v-model="temp.applicationTime" type="date" disabled style="width:100%">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="要求交货时间" prop="requirementDeliveryTime">
                                        <el-date-picker style="width:100%" v-model="temp.requirementDeliveryTime" type="date" placeholder="选择时间" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :picker-options="pickerOptions0" :disabled="!chooseShow">
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
                                    <el-form-item label="夹具采购建议" prop="equipBuySuggest">
                                        <el-radio v-model="temp.equipBuySuggest" label="内部制造" disabled>内部制造</el-radio>
                                        <el-radio v-model="temp.equipBuySuggest" label="外部制造" disabled>外部制造</el-radio>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="11">
                                    <el-form-item label="金额" prop="budget">
                                        <el-input type="text" v-model="temp.budget" maxlength="11" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="1" style="padding:0px;font-size:20px;font-weight:800;">
                                    <span>元</span>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="10" style="padding-right:0px;">
                                    <el-form-item label="技术负责人" prop="technologyLeaderName">
                                        <el-input v-model="temp.technologyLeaderName" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2" style="padding-left:0px;">
                                    <el-button type="primary" @click="handleChooseTech" :disabled="!chooseShow">选择</el-button>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="10" v-if="chooseShow">
                                    <el-form-item label="技术资料" prop="fileData">
                                        <input id="uploadImg" type="file" @change="fileUpload">
                                    </el-form-item>
                                </el-col>
                            </el-row>
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
                            <el-row>
                                <el-col :span="10">
                                    <el-form-item label="审核附件" prop="xmfaFileData">
                                        <!-- <input id="uploadImg1" type="file" @change="fileUpload1" v-if="chooseShow"> -->
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
                        </el-form>
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
            <!-- 选择公司/工厂 -->
            <el-dialog width="40%" :title="textMap1[dialogStatus1]" :visible.sync="companyVisible" append-to-body :close-on-click-modal="false" v-dialogDrag>
                <el-container>
                    <el-aside width="500px">
                        <span style="margin-left:20px;color:red">{{getCompanyName}}</span>
                        <el-tree :data="companyData" :props="defaultProps1" ref="comtree" show-checkbox node-key='orgCode' check-strictly @check-change="handleChange1"></el-tree>
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
                        <el-tree :data="orgData" :props="defaultProps1" ref="tree" show-checkbox node-key="orgCode" check-strictly @check-change="handleChange">
                            <!-- 当前节点变化时处理事件 -->
                        </el-tree>
                    </el-aside>
                </el-container>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="divisionVisible = false">取消</el-button>
                    <el-button @click="handleClick2" type="primary">确定</el-button>
                </div>
            </el-dialog>
            <!-- 技术负责人 -->
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
                            <el-tree :data="personOrgData" :props="defaultProps" @node-click="handleNodeClick" v-loading="diaLoading"></el-tree>
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
            <!-- 打印 -->
            <el-dialog title="打印预览" :close-on-click-modal="false" :visible.sync="printDialogVisible" width="60%" v-loading="printLoading" v-dialogDrag>
                <el-button type="primary" @click="printDialogVisible = false">返回</el-button>
                <el-button type="success" v-print="'#printTest'">
                    <svg-icon icon-class="print" />打印</el-button>
                <div id="printTest">
                    <table border="0" style="border-right:1px solid black">
                        <caption style="font-size: 24px;padding-bottom:20px; font-weight:800">夹具采购申请单</caption>
                        <thead>
                            <tr style="border-right: 1px solid white;">
                                <th>{{ctime!=null?ctime.substring(0,10):''}}&nbsp;</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="border-right: 1px solid black;">夹具名称</td>
                                <td colspan="3">{{printList.equipmentName}}</td>
                            </tr>
                            <tr>
                                <td style="border-right: 1px solid black;">使用公司</td>
                                <td style="border-right: 1px solid black;">{{printList.companyName}}</td>
                                <td style="border-right: 1px solid black;">使用工厂</td>
                                <td>{{printList.factoryName}}</td>
                            </tr>
                            <tr>
                                <td style="border-right: 1px solid black;">使用部门</td>
                                <td style="border-right: 1px solid black;">{{printList.dctualOrgName}}</td>
                                <td style="border-right: 1px solid black;">台数</td>
                                <td>{{printList.purchaseQuantity}}</td>
                            </tr>
                            <tr>
                                <td style="border-right: 1px solid black;">申请时间</td>
                                <td style="border-right: 1px solid black;">{{printList.applicationTime!=null?printList.applicationTime.substring(0,10):''}}</td>
                                <td style="border-right: 1px solid black;">要求交货时间</td>
                                <td>{{printList.requirementDeliveryTime!=null?printList.requirementDeliveryTime.substring(0,10):''}}</td>
                            </tr>
                            <tr style="border-bottom:0px solid white;">
                                <td colspan="4">
                                    申请原因：
                                    <span style="font-size:14px;">{{printList.applicationReason}}</span>
                                </td>
                            </tr>
                            <tr style="border-top:0px solid white;border-bottom:0px solid white;height:90px;">
                                <td colspan="4" style="position: relative;">
                                    <span style="position: absolute;left:1px;top:1px;">
                                        具体要求：
                                        <span style="font-size:14px;">{{printList.detailRequirement}}</span>
                                    </span>
                                </td>
                            </tr>
                            <tr style="border-top:0px solid white;border-bottom:0px solid white;">
                                <td colspan="4" align="right">
                                    <span>使用部门签字：{{printList.xmzgbmr}}</span>
                                    <span>日期：{{printList.xmzgbmrDate!=null?printList.xmzgbmrDate.substring(0,10):''}}</span>
                                </td>
                            </tr>
                            <tr style="border-bottom:0px solid white;">
                                <td colspan="4" style="height:60px;position: relative;">
                                    <span style="position: absolute;left:1px;top:5px;">
                                        技术项目负责人意见（附技术要求）：
                                        <span style="font-size:14px;">{{printList.technologyLeaderOpinion}}</span>
                                    </span>
                                </td>
                            </tr>
                            <tr style="border-top:0px solid white;">
                                <td colspan="4" align="right">
                                    <span>技术负责人：{{printList.technologyLeaderName}}</span>
                                    <span>日期：{{printList.technologyLeaderDate!=null?printList.technologyLeaderDate.substring(0,10):''}}</span>
                                </td>
                            </tr>
                            <tr style="border-bottom:0px solid white;">
                                <td colspan="4" style="height:60px;">工厂厂长意见：{{printList.gcczOpinion}}</td>
                            </tr>
                            <tr style="border-top:0px solid white;">
                                <td colspan="4" align="right">
                                    <span>工厂厂长：{{printList.gccz}}</span>
                                    <span>日期：{{printList.gcczDate!=null?printList.gcczDate.substring(0,10):''}}</span>
                                </td>
                            </tr>
                            <tr style="border-bottom:0px solid white;">
                                <td colspan="4" style="height:60px;">事业部意见：{{printList.sybzjlOpinion}}</td>
                            </tr>
                            <tr style="border-top:0px solid white;">
                                <td colspan="4" align="right">
                                    <span>设备副总：{{printList.sybzjl}}</span>
                                    <span>日期：{{printList.sybzjlDate!=null?printList.sybzjlDate.substring(0,10):''}}</span>
                                </td>
                            </tr>
                            <tr style="border-bottom:0px solid white;">
                                <td colspan="4" style="height:60px;">资产部初审意见：{{printList.zcbOpinion}}</td>
                            </tr>
                            <tr style="border-top:0px solid white;">
                                <td colspan="4" align="right">
                                    <span>签字：{{printList.zcb}}</span>
                                    <span>日期：{{printList.zcbDate!=null?printList.zcbDate.substring(0,10):''}}</span>
                                </td>
                            </tr>
                            <tr style="border-bottom:0px solid white;">
                                <td colspan="4" style="height:60px;">董事长审批：{{printList.dszOpinion}}</td>
                            </tr>
                            <tr style="border-top:0px solid white;">
                                <td colspan="4" align="right">
                                    <span>签字：{{printList.dsz}}</span>
                                    <span>日期：{{printList.dszDate!=null?printList.dszDate.substring(0,10):''}}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
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
        </el-container>
    </div>
</template>

<script>
import { fetchList, delById, getDetail, fetchDetail, createArticle, saveArticle, updateArticleSubmit, updateSaveArticle,
  fetchPrint, fetchEquiplist } from '@/api/toolFixtureManagement/clampPurchaseRequestForm'
import { commonOptions, fetchChooseTree, choosePersonList, fetchComTree, fetchComByCode, fetchOrgTree, fetchEquipName,
  uploadlist, deleteFile, fileList, deleteFileById, insertFile, recordList, getCurrentUser, processChart, getProxyOrgList } from '@/api/common/common'
import { fetchButton } from '@/api/common/button'
import { menuList } from '@/store/modules/permission'
import { baseUrl } from '@/api/common/fileBaseUrl'
import { validateNumber1, validateNumber2 } from '@/utils/validate'
export default {
    name: "clampPurchaseRequestForm",
    data() {
        const validateNumber = (rule, value, callback) => {
            if (!validateNumber1(value)) {
                callback(new Error("请输入正确格式的台数"));
            } else {
                callback();
            }
        };
        const validateNumberJE = (rule, value, callback) => {
            if (value != undefined || value != null) {
                if (!validateNumber2(value)) {
                    callback(new Error("请输入正确格式的金额"));
                } else {
                    callback();
                }
            } else {
                callback();
            }
        };
        return {
            ctime: null,
            // 代办审核
            ifSave: false,
            changeOrgVisible: undefined,
            proxyOrgList: [],
            comName: undefined,
            comCode: undefined,
            userCode: undefined, // 用户编码
            activeName: "first",
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
                children: "children",
                label: "orgFullName"
            },
            getCompanyName: undefined,
            getCompanyCode: undefined,
            getOrgName: undefined,
            getOrgCode: undefined,
            dialogStatus1: "",
            textMap1: {
                company: "选择公司",
                factory: "选择工厂"
            },
            j: 0,
            branchEquipData: [],
            getEquipTypeName: "",
            getEquipTypeCode: "",

            // 要求交货时间
            requirementDeliveryTime: "",
            pickerOptions0: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            // 审核状态下拉框
            options: commonOptions,
            auditingType: "",
            // 表格数据
            tableKey: 0,
            listLoading: false,
            tableData: [],
            total: null,
            listQuery: {
                pageNum: 1,
                pageSize: 10,
                documentWordCode: undefined,
                equipName: undefined,
                dctualOrgName: undefined,
                auditingType: null
            },
            // 文件数据
            fileData: [],
            xmfaFileData: [],
            innerVisibleTech: false, // 技术负责人弹框
            diaLoading: false,
            personOrgData: [],
            defaultProps: {
                children: "children",
                label: "orgFullName"
            },
            orgListData: null,
            documentWordCode: undefined, // 单据编码
            userId: undefined, // 用户id
            processInstanceId: undefined, // 流程实例id
            // 流转记录
            recordShow: false,
            recordData: null,
            temp: {
                applicationReason: undefined,
                companyCode: undefined,
                companyName: undefined,
                dctualOrgCode: undefined,
                dctualOrgName: undefined,
                detailRequirement: undefined,
                documentWordCode: undefined,
                equipmentName: undefined,
                factoryCode: undefined,
                factoryName: undefined,
                // 附件列表
                list: [],
                recordCode: null,
                proxyOrgCode: undefined, // 代理组织
                proxyOrgName: undefined,
                purchaseQuantity: undefined,
                requirementDeliveryTime: undefined,
                technologyLeaderName: undefined,
                technologyLeaderWorkNumber: undefined,
                budget: undefined
            },
            listQuery1: {
                pageNum: 1,
                pageSize: 1000,
                perName: undefined,
                workNumber: undefined
            },
            equipShow: false, // 夹具名称是否选择
            dialogFormVisible: false,
            dialogStatus: "",
            textMap: {
                update: "编辑",
                create: "新增",
                detail: "查看"
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
                equipmentName: [{ required: true, message: '此项为必填项', trigger: 'change' }],
                companyName: [{ required: true, message: '此项为必填项', trigger: 'change' }],
                factoryName: [{ required: true, message: '此项为必填项', trigger: 'change' }],
                dctualOrgName: [{ required: true, message: '此项为必填项', trigger: 'change' }],
                purchaseQuantity: [{ required: true, trigger: 'change', validator: validateNumber }],
                requirementDeliveryTime: [{ required: true, message: '此项为必填项', trigger: 'change' }],
                applicationReason: [{ required: true, message: '此项为必填项', trigger: 'change' }],
                detailRequirement: [{ required: true, message: '此项为必填项', trigger: 'change' }],
                budget: [{ required: false, trigger: 'change', validator: validateNumberJE }],
                technologyLeaderName: [{ required: true, message: '此项为必填项', trigger: 'change' }]
            }
        };
    },
    created() {
        this.getList();
        this.getButton();
    },
    methods: {
        getButton() {
            menuList.forEach(item => {
                item.children.forEach(e => {
                    if (e.name == "clampPurchaseRequestForm") {
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
        getList() {
            this.tableData = []
            this.listLoading = true;
            if(this.listQuery.equipName == ''){
                this.listQuery = {
                    pageNum: 1,
                    pageSize: 10,
                    documentWordCode: this.listQuery.documentWordCode,
                    dctualOrgName: this.listQuery.dctualOrgName,
                    auditingType: this.listQuery.auditingType
                }
            }
            fetchList(this.listQuery).then(response => {
                if (response.data.code === 200) {
                    if (response.data.data != null && response.data.data.list != null) {
                        this.tableData = response.data.data.list;
                        for (var i = 0; i < this.tableData.length; i++) {
                            if (this.tableData[i].auditingType == 2) {
                                this.tableData[i].auditingType = "审核中";
                                this.tableData[i].editDisabled = true;
                                this.tableData[i].deleteDisabled = true;
                            } else if (this.tableData[i].auditingType == 1) {
                                this.tableData[i].auditingType = "未提交";
                            } else if (this.tableData[i].auditingType == 3) {
                                this.tableData[i].auditingType = "审核通过";
                                this.tableData[i].editDisabled = true;
                                this.tableData[i].deleteDisabled = true;
                            } else if (this.tableData[i].auditingType == 4) {
                                this.tableData[i].auditingType = "审核不通过";
                                this.tableData[i].deleteDisabled = true;
                                this.tableData[i].editDisabled = true;
                            } else if (this.tableData[i].auditingType == 5) {
                                this.tableData[i].auditingType = "流程关闭";
                                this.tableData[i].deleteDisabled = true;
                                this.tableData[i].editDisabled = true;
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
        // 设置公司/工厂组织树状图单选
        handleChange1(data, checked, node) {
            this.n++;
            if (this.n % 2 == 0) {
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
            this.n = 0;
            this.dialogStatus1 = "company";
            this.getCompanyCode = undefined;
            this.getCompanyName = undefined;
            this.companyData = [];
            fetchComTree().then(response => {
                if (response.data.code === 200) {
                    this.companyData.push(response.data.data);
                }
            });
            this.companyVisible = true;
        },
        // 选择公司确认
        handleClickCompany() {
            this.treeData1 = this.$refs.comtree.getCheckedNodes();
            this.getCompanyCode = this.treeData1[0].orgCode;
            this.getCompanyName = this.treeData1[0].orgFullName;
            this.temp.companyName = this.getCompanyName;
            this.temp.companyCode = this.getCompanyCode;
            this.temp.factoryName = undefined;
            this.temp.factoryCode = undefined;
            this.companyVisible = false;
        },
        // 选择使用工厂
        changeFactory() {
            this.n = 0;
            this.dialogStatus1 = "factory";
            this.getCompanyCode = undefined;
            this.getCompanyName = undefined;
            this.companyData = [];
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
                        if (this.companyData[i].children != null) {
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
                                        const child1 = child.children[p];
                                        if (child1.orgType == "部门") {
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
                                                if (child2.orgType == "部门") {
                                                    child2.disabled = true;
                                                }
                                                if (child2.children != null) {
                                                    for (
                                                        var q = 0;
                                                        q <
                                                        child2.children.length;
                                                        q++
                                                    ) {
                                                        const child3 =
                                                            child2.children[q];
                                                        if (
                                                            child3.orgType ==
                                                            "部门"
                                                        ) {
                                                            child3.disabled = true;
                                                        }
                                                        if (
                                                            child3.children !=
                                                            null
                                                        ) {
                                                            for (
                                                                var n = 0;
                                                                n <
                                                                child3.children
                                                                    .length;
                                                                n++
                                                            ) {
                                                                const child4 =
                                                                    child3
                                                                        .children[
                                                                        n
                                                                    ];
                                                                if (
                                                                    child4.orgType ==
                                                                    "部门"
                                                                ) {
                                                                    child4.disabled = true;
                                                                }
                                                                if (
                                                                    child4.children !=
                                                                    null
                                                                ) {
                                                                    for (
                                                                        var m = 0;
                                                                        m <
                                                                        child4
                                                                            .children
                                                                            .length;
                                                                        m++
                                                                    ) {
                                                                        const child5 =
                                                                            child4
                                                                                .children[
                                                                                n
                                                                            ];
                                                                        if (
                                                                            child5.orgType ==
                                                                            "部门"
                                                                        ) {
                                                                            child5.disabled = true;
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
            });
            this.companyVisible = true;
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
                                                if (child2.orgType == "公司") {
                                                    child2.disabled = true;
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
            this.divisionVisible = true;
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
        // 点击选择部门确认
        handleClick2() {
            // 获取部门被选择的节点
            this.treeData = this.$refs.tree.getCheckedNodes();
            this.getOrgCode = this.treeData[0].orgCode;
            this.getOrgName = this.treeData[0].orgFullName;
            this.temp.dctualOrgName = this.getOrgName;
            this.temp.dctualOrgCode = this.getOrgCode;
            this.divisionVisible = false;
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
        // 搜索
        handleFilter() {
            this.listQuery.pageNum = 1;
            this.getList();
        },
        // 分页
        handleSizeChange(val) {
            this.listQuery.pageSize = val;
            this.getList();
        },
        handleCurrentChange(val) {
            this.listQuery.pageNum = val;
            this.getList();
        },
        resetTemp() {
            this.temp = {
                applicationReason: undefined,
                companyCode: undefined,
                companyName: undefined,
                dctualOrgCode: undefined,
                dctualOrgName: undefined,
                detailRequirement: undefined,
                documentWordCode: undefined,
                equipmentName: undefined,
                factoryCode: undefined,
                factoryName: undefined,
                // 附件列表
                list: [],
                recordCode: null,
                proxyOrgCode: undefined, // 代理组织
                proxyOrgName: undefined,
                purchaseQuantity: undefined,
                requirementDeliveryTime: undefined,
                technologyLeaderName: undefined,
                technologyLeaderWorkNumber: undefined,
                budget: undefined
            };
            this.fileData = [];
            this.xmfaFileData = [];
            this.userId = undefined;
            this.documentWordCode = undefined;
            this.getCompanyName = "";
            this.getCompanyCode = "";
            this.getOrgName = "";
            this.getOrgCode = "";
            this.getEquipTypeCode = "";
            this.getEquipTypeName = "";
        },
        // 新增
        handleCreate() {
            this.resetTemp();
            this.dialogStatus = "create";
            this.chooseShow = true;
            this.recordShow = false;
            this.activeName = "first";
            this.equipShow = false;
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
            this.temp.list = this.fileData;
            this.xmfaFileData.forEach(item => {
                this.temp.list.push(item);
            });
            createArticle(this.temp).then(response => {
                if (response.data.code == 200) {
                    this.dialogFormVisible = false;
                    this.getList();
                    setTimeout(() => {
                        this.listLoading = false;
                    }, 1 * 500);
                    this.$message({
                        title: "成功",
                        message: "添加成功",
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
            this.temp.list = this.fileData;
            this.xmfaFileData.forEach(item => {
                this.temp.list.push(item);
            });
            saveArticle(this.temp).then(response => {
                if (response.data.code == 200) {
                    // this.tableData.unshift(this.temp)
                    this.dialogFormVisible = false;
                    this.getList();
                    setTimeout(() => {
                        this.listLoading = false;
                    }, 1 * 500);
                    this.$message({
                        title: "成功",
                        message: "添加成功",
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
            this.ctime = row.ctime
            this.listLoading = true;
            this.dialogStatus = "update";
            this.chooseShow = true;
            this.recordShow = false;
            this.activeName = "first";
            this.documentWordCode = row.documentWordCode;
            const id = row.id;
            // 获取详情
            getDetail(id).then(response => {
                this.temp = Object.assign({}, response.data.data);
                setTimeout(() => {
                    this.listLoading = false;
                }, 1 * 500);
            });
            this.dialogFormVisible = true;
            this.getUser();
            this.getFileList(); // 获取文件
            this.$nextTick(() => {
                this.$refs["dataForm"].clearValidate();
            });
        },
        // 获取当前用户信息
        getUser() {
            getCurrentUser().then(response => {
                if (response.data.code == 200) {
                    this.userId = response.data.data.id;
                    this.userCode = response.data.data.userCode;
                    getProxyOrgList(this.userCode).then(response => {
                        if (response.data.code == 200) {
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
                    this.updataSubmit();
                }
            });
        },
        updataSubmit() {
            this.listLoading = true;
            this.temp.list = this.fileData;
            this.xmfaFileData.forEach(item => {
                this.temp.list.push(item);
            });
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
                        message: "修改成功",
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
                    this.temp.list = this.fileData;
                    this.xmfaFileData.forEach(item => {
                        this.temp.list.push(item);
                    });
                    const tempData = Object.assign({}, this.temp);
                    updateSaveArticle(tempData).then(response => {
                        if (response.data.code == 200) {
                            // for (const v of this.tableData) {
                            //   if (v.id === this.temp.id) {
                            //     const index = this.tableData.indexOf(v)
                            //     this.tableData.splice(index, 1, this.temp)
                            //     break
                            //   }
                            // }
                            this.dialogFormVisible = false;
                            this.getList();
                            setTimeout(() => {
                                this.listLoading = false;
                            }, 1 * 500);
                            this.$message({
                                title: "成功",
                                message: "修改成功",
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
        // 根据编号查看
        handleDetail(row) {
            this.ctime = row.ctime
            this.activeName = "first";
            this.dialogStatus = "detail";
            this.chooseShow = false;
            this.recordShow = true;
            this.printShow = false;
            this.equipShow = false;
            this.dialogFormVisible = true;
            this.documentWordCode = row.documentWordCode;
            if (row.auditingType == "审核通过") {
                this.printShow = true;
            }
            const id = row.id;
            fetchDetail(id).then(response => {
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
                            this.$message({
                                title: "成功",
                                type: "success",
                                message: "删除成功!",
                                duration: 2000
                            });
                            this.getList();
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
        // 获取文件列表
        getFileList() {
            // 技术资料
            const find = {
                moduleType: "26", // 模块类别
                attachmentCode: "JJCGSQDJSZLFJ", // 附件编码
                documentWordCode: this.documentWordCode // 单据编码
            };
            fileList(find).then(response => {
                this.fileData = response.data.data;
            });
            // 审核附件
             const find1 = {
                moduleType: "26", // 模块类别
                attachmentCode: "JJCGSQDQTFJ", 
                documentWordCode: this.documentWordCode 
            };
            fileList(find1).then(response => {
                this.xmfaFileData = response.data.data; 
            });
        },
        // 技术资料上传
        fileUpload(e) {
            const file = e.target.files[0];
            const fileData1 = {
                attachmentCode: "JJCGSQDJSZLFJ",
                code: this.documentWordCode,
                moduleType: "26",
                fileName: undefined,
                filePath: undefined, // 文件URL
                node: "开始",
                fileNameSC: undefined, // 文件名称
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
                    if (resp.data.code === 200) {
                        fileData1.fileNameSC = resp.data.data.remoteFilename;
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
                                    this.getFileList(); // 获取文件
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
                    } else if (resp.data.code === 402) {
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
        // 文件下载
        fileDown(row) {
            if (this.dialogStatus == "create") {
                window.location.href = row.fileUrl + "?attname=" + row.fileName;
            } else {
                window.location.href =
                    row.filePath + "?attname=" + row.fileName;
            }
        },
        // 技术资料删除
        fileDelete(row) {
            this.$confirm("是否确认删除?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    const find1 = {
                        fileName: row.fileNameSC
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
        // 审核附件上传
        fileUpload1(e) {
            const file = e.target.files[0];
            const fileData1 = {
                attachmentCode: "JJCGSQDQTFJ",
                code: this.documentWordCode,
                moduleType: "26",
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
        // 审核附件删除
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
        // 打印
        printData() {
            this.printDialogVisible = true;
            this.printLoading = true;
            const params = {
                purchaseId: this.temp.id,
                processInstanceId: this.processInstanceId
            };
            fetchPrint(params).then(response => {
                if (response.data.code == 200) {
                    this.printList = response.data.data;
                } else {
                    this.$notify({
                        title: "警告",
                        message: response.data.msg,
                        type: "warning",
                        duration: 2000
                    });
                }
                setTimeout(() => {
                    this.printLoading = false;
                }, 1 * 500);
            });
        },
        // tabs 点击事件
        handleClick(tab, event) {
            this.recordData = null;
            this.chartData = null;
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
.equip-title,
.equip-title1 {
    margin-left: -100px;
    text-align: center;
    display: block;
}
.equip-title {
    font-size: 20px;
    font-weight: 600;
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
    height: 50px;
    text-align: left;
}
#printTest table tbody td {
    width: 25%;
    /* border: 1px solid black; */
}
#printTest table tbody td span {
    margin-right: 20px;
}
#pic {
    width: 100%;
}
</style>

