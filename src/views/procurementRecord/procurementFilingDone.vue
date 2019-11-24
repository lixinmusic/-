<template>
    <div class='app-container'>
        <el-container>
            <div class="formSearch">
                <el-form :inline="true">
                    <el-form-item label="单据编号">
                        <el-input class="filter-item input" placeholder="请输入单据编号" maxlength="32" v-model="documentWordCode1">
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
                <el-table :key='tableKey' :data="tableData" height="200" row-key="id" v-loading="listLoading" border fit highlight-current style="width: 100%;margin-top:10px;min-height:500px" :header-cell-style="{background:'oldlace'}">
                    <el-table-column prop="documentWordCode" align="center" label="单据编号" width="160px">
                        <template slot-scope="scope">
                            <span class="look-detail" @click="handleDetail(scope.row)">{{scope.row.documentWordCode}}</span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="projectLeaderName" align="center" label="项目组长">
                    </el-table-column> -->
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
                </el-table>
            </el-main>
            <el-footer>
                <div class="pagination-container">
                    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[5,10,15, 20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                    </el-pagination>
                </div>
            </el-footer>
            <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" :visible.sync="dialogFormVisible" v-dialogDrag width="60%" v-loading="listLoading">
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
                                <el-col :span="12" style="padding-right:0px;">
                                    <el-form-item label="公司名称(付款主体)" prop="orgName">
                                        <el-input v-model="temp.orgName" maxlength="6" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="11" style="padding-right:0px;">
                                    <el-form-item label="使用公司" prop="companyName">
                                        <el-input v-model="temp.companyName" maxlength="6" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12" style="padding-right:0px;">
                                    <el-form-item label="使用工厂" prop="factoryName">
                                        <el-input v-model="temp.factoryName" maxlength="6" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="11" style="padding-right:0px;">
                                    <el-form-item label="使用部门" prop="dctualOrgName">
                                        <el-input v-model="temp.dctualOrgName" maxlength="6" disabled></el-input>
                                    </el-form-item>
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
                                        <el-input v-model="temp.projectInsideName" maxlength="30" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="项目外部名称" prop="projectOutsideName">
                                        <el-input v-model="temp.projectOutsideName" maxlength="30" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="11" style="padding-right:0px;">
                                    <el-form-item label="项目组长" prop="projectLeaderName">
                                        <el-input v-model="temp.projectLeaderName" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12" style="padding-right:0px;">
                                    <el-form-item label="技术负责人" prop="technologyLeaderName">
                                        <el-input v-model="temp.technologyLeaderName" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="11">
                                    <el-form-item label="使用地址" prop="useAddress">
                                        <el-input v-model="temp.useAddress" placeholder="例：浙江金华市婺城仙华南街800号" maxlength="40" disabled></el-input>
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
                                        <el-date-picker style="width:100%" v-model="temp.requirementCompleteTime" type="date" placeholder="选择时间" format="yyyy-MM-dd" value-format="yyyy-MM-dd" disabled>
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="设备采购完成时间" prop="equipBuyCompleteTime">
                                        <el-date-picker style="width:100%" v-model="temp.equipBuyCompleteTime" type="date" placeholder="选择时间" format="yyyy-MM-dd" value-format="yyyy-MM-dd" disabled>
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
                                        <el-table-column width="60px">
                                            <template slot-scope="scope">
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="设备名称" align="center" min-width="90">
                                            <template slot-scope="scope">
                                                <el-form-item label-width="1x" :prop="'equipRecordNumList.' + scope.$index + '.equipName'" :rules='rules.equipName'>
                                                    <el-input v-model="scope.row.equipName" disabled>
                                                        <el-button slot="append" @click="handleChooseEquip(scope.$index)" disabled>选择</el-button>
                                                    </el-input>
                                                </el-form-item>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="设备数量" align="center" min-width="80">
                                            <template slot-scope="scope">
                                                <el-form-item label-width="1x" :prop="'equipRecordNumList.' + scope.$index + '.equipNum'" :rules='rules.equipNum'>
                                                    <el-input v-model="scope.row.equipNum" oninput="value=value.replace(/[^\d]/g,'')" maxlength="4" disabled></el-input>
                                                </el-form-item>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="主要内容" align="center" min-width="90">
                                            <template slot-scope="scope">
                                                <el-form-item label-width="1x" :prop="'equipRecordNumList.' + scope.$index + '.primaryCoverage'" :rules='rules.primaryCoverage'>
                                                    <el-input type="textarea" placeholder="请填写主要内容" v-model="scope.row.primaryCoverage" maxlength="30" disabled></el-input>
                                                </el-form-item>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="11">
                                    <el-form-item label="预算" prop="budget">
                                        <el-input v-model="temp.budget" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="要求交货时间" prop="requirementDeliveryTime">
                                        <el-date-picker style="width:100%" v-model="temp.requirementDeliveryTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" placeholder="选择时间" disabled>
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="23">
                                    <el-form-item label="申请原因" prop="applicationReason">
                                        <el-input type="textarea" disabled maxlength="200" v-model="temp.applicationReason"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="23">
                                    <el-form-item label="具体要求" prop="detailRequirement">
                                        <el-input type="textarea" disabled maxlength="200" v-model="temp.detailRequirement"></el-input>
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
                                        <!-- <el-button title="删除" type="danger" icon="el-icon-delete" size="mini" @click="jszlFileDelete(scope.row)"></el-button> -->
                                    </template>
                                </el-table-column>
                            </el-table>
                            <el-row>
                                <el-col :span="10">
                                    <el-form-item label="项目方案附件" prop="xmfaFileData">
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
                                        <!-- <el-button title="删除" type="danger" icon="el-icon-delete" size="mini" @click="xmfaFileDelete(scope.row)"></el-button> -->
                                    </template>
                                </el-table-column>
                            </el-table>
                            <el-row>
                                <el-col :span="10">
                                    <el-form-item label="审核附件" prop="fileData">
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
                                    <!-- <el-button v-if="dialogStatus=='create'" title="删除" type="danger" icon="el-icon-delete" size="mini" @click="fileDelete(scope.row)"></el-button>
                                    <el-button v-if="dialogStatus=='update'" title="删除1" type="danger" icon="el-icon-delete" size="mini" @click="updatefileDelete(scope.row)"></el-button> -->
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="流转记录" name="second">
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
                    <el-tab-pane label="流程图" name="three">
                        <div id="imgcontainer">
                            <img id="pic" :src="chartData" />
                        </div>
                    </el-tab-pane>
                </el-tabs>
                <el-form class="formDw">
                    <el-form-item>
                        <el-button type="primary" @click="dialogFormVisible = false">返回</el-button>
                        <el-button type="primary" @click="printData" v-if="printShow">打印</el-button>
                    </el-form-item>
                </el-form>
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
                                <td colspan="2" style="border-right:0px solid white;" align="left">{{printList.technologyLeaderOpinion}}</td>
                                <td colspan="2" style="position: relative;border-left:0px solid white;">
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
                            <!-- <tr style="height:60px;">
                                <td>资产部</td>
                                <td colspan="2" style="border-right:0px solid white;">检查有无附技术标准，未附不给予签字，同时审核采购原因是否充分</td>
                                <span style="border-right:0px solid white;float:left">{{printList.zcbOpinion}}</span>
                                <td colspan="2" style="position: relative;border-left:0px solid white;">
                                    <span style="position: absolute;left:-100px;bottom:1px;">签字：{{printList.zcb}}</span>
                                    <span style="position: absolute;right:10px;bottom:1px;">日期：{{printList.zcbDate!=null?printList.zcbDate.substring(0,10):''}}</span>
                                </td>
                            </tr> -->
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
import { fetchDoneList, getDetail, fetchPrint } from '@/api/procurementRecord/procurementFiling'
import { commonOptions1, fileList, recordList, processChart } from '@/api/common/common'
import { baseUrl } from '@/api/common/fileBaseUrl'
export default {
    name: "procurementFilingDone",
    data() {
        return {
            activeName: "first",
            printShow: false,
            chartData: null, // 流程图
            // 弹框组
            dialogFormVisible: false,
            printDialogVisible: false, // 打印
            // 日期选择
            requirementCompleteTime: "",
            equipBuyCompleteTime: "",

            // 审核状态下拉框
            options: commonOptions1,
            // 表格数据
            tableData: [],
            tableKey: 0,
            listLoading: false,
            total: null,
            pageNum: 1,
            pageSize: 10,
            dctualOrgName:'',
            auditingType: '',
            documentWordCode1: '',
            // listQuery: {
            //     pageNum: 1,
            //     pageSize: 10,
            //     recordCode: undefined,
            //     projectInsideName: undefined,
            //     auditingType: undefined
            // },

            // 文件数据
            xmfaFileData: [],
            jszlFileData: [],
            fileData: [],
            documentWordCode: undefined, // 单据编号
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
            temp: {
                companyCode: undefined,
                companyName: undefined,
                factoryCode: undefined,
                factoryName: undefined,
                dctualOrgCode: undefined, // 实际使用部门
                dctualOrgName: undefined, // 实际使用部门名
                equipBuySuggest: "内部制造",
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
                budget: undefined, // 预算
                equipBuyCompleteTime: undefined, // 设备采购完成时间
                equipRecordNumList: [
                    {
                        equipCode: null,
                        equipName: null,
                        equipNum: null,
                        primaryCoverage: null
                    }
                ] // 主要内容集合
            },
            checkList: [],
            dialogStatus: "",
            textMap: {
                detail: "查看"
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
    },
    methods: {
        getList() {
            this.tableData = [];
            this.listLoading = true;
            fetchDoneList(this.pageNum,this.pageSize,this.documentWordCode1,this.dctualOrgName,this.auditingType).then(response => {
                if (response.data.code === 200) {
                    if (
                        response.data.data != null &&
                        response.data.data.list != null
                    ) {
                        this.tableData = response.data.data.list;
                        for (var i = 0; i < this.tableData.length; i++) {
                            if (this.tableData[i].auditingType == 2) {
                                this.tableData[i].auditingType = "审核中";
                            } else if (this.tableData[i].auditingType == 1) {
                                this.tableData[i].auditingType = "未提交";
                            } else if (this.tableData[i].auditingType == 3) {
                                this.tableData[i].auditingType = "审核通过";
                            } else if (this.tableData[i].auditingType == 4) {
                                this.tableData[i].auditingType = "审核不通过";
                            } else if (this.tableData[i].auditingType == 5) {
                                this.tableData[i].auditingType = "流程关闭";
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
        // 根据编号查看
        handleDetail(row) {
            this.activeName = "first";
            this.dialogStatus = "detail";
            this.printShow = false;
            this.dialogFormVisible = true;
            const id = row.id;
            this.documentWordCode = row.documentWordCode; // 单据编号
            if (row.auditingType == "审核通过") {
                this.printShow = true;
            }
            getDetail(id).then(response => {
                if (response.data.code === 200) {
                    this.temp = Object.assign({}, response.data.data);
                } else {
                    this.$notify({
                        title: "警告",
                        message: response.data.msg,
                        type: "warning",
                        duration: 3000
                    });
                }
            });
            this.getFileList(); // 获取文件信息
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
        // 文件下载
        fileDown(row) {
            window.location.href = row.filePath + "?attname=" + row.fileName;
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
            console.log(tab, event);
            if (tab.label == "流转记录") {
                this.listLoading = true;
                this.recordData = null;
                // 请求流转记录
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
                this.chartData = null;
                if (this.processInstanceId != null) {
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

