<template>
    <div class="app-container">
        <el-container>
            <div class="formSearch">
                <el-form :inline="true">
                    <el-form-item label="夹具名称">
                        <el-input v-model="listQuery.equipmentName" placeholder="请输入夹具名称" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="固定资产编号">
                        <el-input class="minier-input" v-model="listQuery.fixedAssetCode" placeholder="请输入固定资产编号" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="验收日期">
                        <el-date-picker style="width:250px" v-model="value13" type="daterange" unlink-panels start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" clearable @change="changeDate()">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="验收情况" prop="acceptanceType">
                        <el-radio v-model="listQuery.acceptanceType" label="1">验收通过</el-radio>
                        <el-radio v-model="listQuery.acceptanceType" label="0">验收不通过</el-radio>
                    </el-form-item>
                    <el-form-item label="审核状态">
                        <el-select v-model="listQuery.auditingType" clearable placeholder="请选择">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="filter-item" type="primary" size="small" icon="el-icon-search" @click="handleFilter">搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-main style="padding:20px 0px">
                <el-button class="filter-item" style="margin-left: 10px;" size="small" @click="handleCreate" type="primary" icon="el-icon-plus" v-if="addShow">新增</el-button>
                <el-table :data="tableData" v-loading="listLoading" border fit highlight-current-row style="width: 100%;min-height:auto;margin-top:20px" height="500" :header-cell-style="{background:'oldlace'}">
                    <el-table-column prop="documentWordCode" align="center" label="单据编码" min-width="100">
                        <template slot-scope="scope">
                            <span class="link-type futiop" @click='handleLook(scope.row)'>{{scope.row.documentWordCode}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="supplier" align="center" label="供应商">
                    </el-table-column>
                    <el-table-column prop="equipmentName" align="center" label="夹具名称">
                    </el-table-column>
                    <el-table-column prop="serialNumber" align="center" label="出厂编号">
                    </el-table-column>
                    <el-table-column prop="typeSpecification" align="center" label="型号规格">
                    </el-table-column>
                    <el-table-column prop="fixedAssetCode" align="center" label="固定资产编号" min-width="110px">
                        <template slot-scope="scope">
                            <span class="link-type futiop" @click='fpoyss(scope.row)'>{{scope.row.fixedAssetCode}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="acceptanceDate" align="center" label="验收日期">
                    </el-table-column>
                    <el-table-column prop="missPieceTypeName" align="center" label="是否缺件">
                    </el-table-column>
                    <el-table-column prop="acceptanceTypeName" align="center" label="验收情况">
                    </el-table-column>
                    <el-table-column prop="auditingTypeName" align="center" label="审核状态">
                    </el-table-column>
                    <el-table-column align="center" label="操作" min-width="180" class-name="small-padding fixed-width">
                        <template slot-scope="scope">
                            <el-button title="编辑" type="primary" :disabled="scope.row.editDisabled?true:false" size="small" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-if="editShow"></el-button>
                            <el-button title="删除" type="danger" :disabled="scope.row.deleteDisabled?true:false" icon="el-icon-delete" size="small" @click="deleteBtn(scope.row)" v-if="delShow"></el-button>
                            <el-button title="转办" type="success" :disabled="scope.row.stshow?true:false" size="mini" icon="el-icon-share" @click="transfer(scope.row)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-main>
            <el-footer>
                <div class="pagination-container">
                    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[5,10,15,20]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                    </el-pagination>
                </div>
            </el-footer>
            <!-- 新增和编辑 -->
            <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" v-dialogDrag width="60%" :visible.sync="dialogFormVisible">
                <el-tabs v-model="activeName" v-loading="fromLoading" @tab-click="fathClick">
                    <el-tab-pane label="表单信息" name="first">
                        <el-form :rules="rules" ref="dataForm" :model="temp" label-width="120px">
                            <el-form-item>
                                <span class="equip-title">开箱验收单</span>
                            </el-form-item>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="单据编码" prop="documentWordCode">
                                        <el-input v-model="temp.documentWordCode" disabled oninput="this.value=this.value.replace(/[^0-9A-z\.]/g,'')"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="制造厂家" prop="supplier">
                                        <el-input v-model="temp.supplier" :disabled='chooseShow?true:false' onkeyup="this.value=this.value.replace(/[^\u4e00-\u9fa5]/g,'')"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="夹具名称" prop="equipmentName">
                                        <el-input v-model="temp.equipmentName" :disabled='chooseShow?true:false'></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="出厂编号" prop="serialNumber">
                                        <el-input v-model="temp.serialNumber" :disabled='!filshow' maxlength="20"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="型号规格" prop="typeSpecification">
                                        <el-input v-model="temp.typeSpecification" :disabled='chooseShow?true:false'></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="固定资产编号" prop="fixedAssetCode">
                                        <el-input v-model="temp.fixedAssetCode" :disabled='chooseShow?true:false'></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="验收日期" prop="acceptanceDate">
                                        <el-date-picker style="width:100%" v-model="temp.acceptanceDate" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :disabled='!filshow'>
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="采购入库仓库" prop="purchaseStorehouseName">
                                        <el-select v-model="temp.purchaseStorehouseName" style="width:100%" clearable placeholder="请选择仓库" @change='lbChange' :disabled="!chooseShow">
                                            <el-option v-for="item in lbList" :key="item.wordCode" :label="item.wordName" :value="item.wordName">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="送货单号" prop="deliveryCode">
                                        <el-input v-model="temp.deliveryCode" :disabled='!filshow' placeholder="若无单号，请填写“无”并上传图片"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="1" style="width:1px;color:red;padding:8px" v-if="filshow">
                                    <span>*</span>
                                </el-col>
                                <el-col :span="11">
                                    <el-form-item label="送货单附件">
                                        <input id="deliveryNumberPic" type="file" @change="imgUpload" accept="image/gif,image/jpg,image/png,/image/gif,image/jpeg" v-show="filshow">
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <!-- 第二个小表格 -->
                            <el-table :data="towlistdata" border fit highlight-current-row style="width: 100%;min-height:auto;margin-bottom:10px" :header-cell-style="{background:'oldlace'}">
                                <el-table-column prop="fileName" align="center" label="文件名">
                                    <template slot-scope="scope">
                                        <span style="cursor:pointer;text-decoration:underline " @click="handlePreview(scope.row)">{{scope.row.fileName}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="node" align="center" label="上传节点">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.node}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
                                    <template slot-scope="scope">
                                        <el-button title="下载" type="primary" @click="downty(scope.row)" size="small" icon="el-icon-download"></el-button>
                                        <el-button title="删除" type="danger" @click="twosmalldelest(scope.row)" icon="el-icon-delete" size="small" v-show="deleadds"></el-button>
                                        <el-button title="删除" type="danger" @click="twoupdatadelest(scope.row)" icon="el-icon-delete" size="small" v-show="deleuplet"></el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <el-row>
                                <el-col :span="11">
                                    <el-form-item label="夹具编码图片" prop="pictureUrl">
                                        <input id="pic" type="file" @change="picUpload" accept="image/gif,image/jpg,image/png,/image/gif,image/jpeg" v-show="picShow">
                                        <img v-if="isShow" :src="temp.pictureUrl" alt="" style="width: 150px;height:50px;cursor: pointer" @click="handleBig">
                                        <el-button type="primary" v-if="isShow" icon="el-icon-download" @click="downLoadPic"></el-button>
                                        <el-button type="danger" v-if="isShow" icon="el-icon-delete" @click="delPic"></el-button>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20" style="margin-top:20px">
                                <el-col :span="24">
                                    <el-form-item label="送货单内容" prop="deliveryCodeContent">
                                        <el-input type="textarea" :disabled='!filshow' maxlength="200" v-model="temp.deliveryCodeContent">
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="24">
                                    <el-form-item label="实际验收情况" prop="actualAcceptSituation">
                                        <el-input type="textarea" :disabled='!filshow' maxlength="200" v-model="temp.actualAcceptSituation">
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="是否缺件" prop="missPieceType">
                                        <el-radio v-model="temp.missPieceType" label="1" :disabled='!filshow'>是</el-radio>
                                        <el-radio v-model="temp.missPieceType" label="0" :disabled='!filshow'>否</el-radio>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="验收情况" prop="acceptanceType" class="seat">
                                        <el-radio v-model="temp.acceptanceType" label="1" :disabled='!filshow'>验收通过</el-radio>
                                        <el-radio v-model="temp.acceptanceType" label="0" :disabled='!filshow'>验收不通过</el-radio>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="1" style="width:1px;color:red;padding:8px" v-if="filshow">
                                    <span>*</span>
                                </el-col>
                                <el-col :span="11">
                                    <el-form-item label="开箱验收单附件">
                                        <input class="uploadInput" id="uploadImg" ref="uploadImg" type="file" @change="noticeUpload" v-show="filshow">
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <!-- 第一个小表格 -->
                            <el-table :data="smallslist" border fit highlight-current-row style="width: 100%;min-height:auto;margin-top:8px" :header-cell-style="{background:'oldlace'}">
                                <el-table-column prop="fileName" align="center" label="文件名">
                                    <template slot-scope="scope">
                                        <span style="cursor:pointer;text-decoration:underline " @click="handlePreview(scope.row)">{{scope.row.fileName}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="node" align="center" label="上传节点">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.node}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="操作" min-width="130px" class-name="small-padding fixed-width">
                                    <template slot-scope="scope">
                                        <el-button title="下载" type="primary" @click="downloadsty(scope.row)" size="small" icon="el-icon-download"></el-button>
                                        <el-button title="删除" type="danger" @click="addsmalldelest(scope.row)" icon="el-icon-delete" size="small" v-show="deleadds"></el-button>
                                        <el-button title="删除" type="danger" @click="smalldelest(scope.row)" icon="el-icon-delete" size="small" v-show="deleuplet"></el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-form>
                    </el-tab-pane>
                    <!-- 流转记录 -->
                    <el-tab-pane label="流转记录" name="second" v-if="exchange">
                        <el-table :data="circulation" v-loading="listLoading" border fit highlight-current-row style="width: 100%;min-height:auto;margin-top:8px" :header-cell-style="{background:'oldlace'}">
                            <el-table-column align="center" label="序号" width="50" type="index"></el-table-column>
                            <el-table-column prop="taskName" align="center" label="步骤名">
                                <template slot-scope="scope">
                                    <span>{{scope.row.taskName}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="userName" align="center" label="操作人">
                                <template slot-scope="scope">
                                    <span>{{scope.row.userName}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="orgName" align="center" label="所在部门">
                                <template slot-scope="scope">
                                    <span>{{scope.row.orgName}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="stationName" align="center" label="岗位">
                                <template slot-scope="scope">
                                    <span>{{scope.row.stationName}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="state" align="center" label="状态">
                                <template slot-scope="scope">
                                    <span>{{scope.row.state}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="opinion" align="center" label="意见">
                                <template slot-scope="scope">
                                    <span>{{scope.row.opinion}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="dateTime" align="center" label="时间" min-width="128">
                                <template slot-scope="scope">
                                    <span>{{scope.row.dateTime}}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="流程图" name="three" v-if="exchange">
                        <div id="imgcontainer">
                            <img id="pic" :src="chartData" />
                        </div>
                    </el-tab-pane>
                </el-tabs>
                <el-form class="buttonlist">
                    <el-form-item>
                        <el-button @click="dialogFormVisible = false" type="primary" size="small">返回</el-button>
                        <el-button type="primary" @click="saveData" v-show="xzbc" size="small">保存</el-button>
                        <el-button type="primary" @click="updateSaveData" v-show="bjbc" size="small">保存</el-button>
                        <el-button type="primary" @click="createData" v-show="xztj" size="small">提交</el-button>
                        <el-button type="primary" @click="updateData" v-show="bjtj" size="small">提交</el-button>
                        <el-button type="primary" @click="sheetData" v-show="fastener" size="small">引用夹具台账</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <!-- 夹具台账弹框 -->
            <el-dialog title="" :close-on-click-modal="false" width="60%" :visible.sync="dialoglookVisible" v-dialogDrag>
                <div style="height:20px"></div>
                <div style="height:30px"></div>
                <div class="filter-container">
                    <el-form :inline="true">
                        <el-form-item label="夹具名称">
                            <el-input v-model="listQueryst.equipmentName" placeholder="请输入夹具名称" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="固定资产编号" style="margin-left:23px">
                            <el-input class="minier-input" v-model="listQueryst.fixedAssetCode" placeholder="请输入固定资产编号" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="型号规格">
                            <el-input class="minier-input" v-model="listQueryst.model" placeholder="请输入型号规格" clearable></el-input>
                        </el-form-item>
                        <el-form-item style="margin-left:70px">
                            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilterst">搜索</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <el-main>
                    <el-table :data="listydatast" ref="ftlpsty" v-loading="listLoading" border fit highlight-current-row style="width: 100%;min-height:auto;margin-top:8px" height="500" :header-cell-style="{background:'#D8E3F2',color:'#626264'}" @select="handleSelect" @select-all="handleSelectAll" @selection-change="handleSelectionChange">
                        <el-table-column align="center" type="selection" width="60"></el-table-column>
                        <el-table-column align="center" label="序号" width="50px" type="index">
                        </el-table-column>
                        <el-table-column prop="equipmentName" align="center" label="夹具名称">
                        </el-table-column>
                        <el-table-column prop="fixedAssetCode" align="center" label="固定资产编号" min-width="110px">
                        </el-table-column>
                        <el-table-column prop="companyName" align="center" label="使用公司">
                        </el-table-column>
                        <el-table-column prop="factoryName" align="center" label="使用工厂">
                        </el-table-column>
                        <el-table-column prop="divisionName" align="center" label="使用部门">
                        </el-table-column>
                        <el-table-column prop="purchaseApplyDate" align="center" label="采购申请日期" min-width="130px">
                        </el-table-column>
                        <el-table-column prop="purchasePrice" align="center" label="采购金额">
                        </el-table-column>
                        <el-table-column prop="manufacturer" align="center" label="制造厂家">
                        </el-table-column>
                    </el-table>
                </el-main>
                <el-footer>
                    <div class="pagination-container">
                        <el-pagination background @size-change="handleSizeChangest" @current-change="handleCurrentChangest" :current-page="listQueryst.pageNum" :page-sizes="[10,20,50,100]" :page-size="listQueryst.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalst">
                        </el-pagination>
                    </div>
                </el-footer>
                <!-- 使用公司的弹框 -->
                <el-dialog width="40%" title="使用公司" :close-on-click-modal="false" :visible.sync="treeFormVisible" append-to-body>
                    <el-container>
                        <el-aside width="500px">
                            <span style="margin-left:20px;color:red">{{radio}}</span>
                            <el-tree :data="datast" :props="defaultProps" default-expand-all @node-click="handleNodeClick" check-strictly ref="tree" node-key="orgCode" show-checkbox highlight-current @check-change="handleClick"></el-tree>
                        </el-aside>
                    </el-container>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="treeFormVisible = false">取消</el-button>
                        <el-button type="primary" @click="treeFormVisible = false">确认</el-button>
                    </div>
                </el-dialog>
                <!-- 使用部门的弹框 -->
                <el-dialog width="50%" title="使用部门" :close-on-click-modal="false" :visible.sync="treeDepartment" append-to-body>
                    <el-container>
                        <el-aside width="500px">
                            <span style="margin-left:20px;color:red">{{postyly}}</span>
                            <el-tree :data="datalisy" :props="terrdef" @node-click="handleNodeClickst" check-strictly ref="treefrom" node-key="orgCode" show-checkbox highlight-current @check-change="hlsoClick"></el-tree>
                        </el-aside>
                    </el-container>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="treeDepartment = false">取消</el-button>
                        <el-button type="primary" @click="treeDepartment = false">确认</el-button>
                    </div>
                </el-dialog>
                <!-- 使用工厂的弹框 -->
                <el-dialog width="50%" title="使用工厂" :close-on-click-modal="false" :visible.sync="treeworks" append-to-body>
                    <el-container>
                        <el-aside width="500px">
                            <span style="margin-left:20px;color:red">{{yesno}}</span>
                            <el-tree :data="plantlisy" :props="terrplant" @node-click="handleNodeClickworks" check-strictly ref="treeplisy" node-key="orgCode" show-checkbox highlight-current @check-change="hocheckck"></el-tree>
                        </el-aside>
                    </el-container>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="treeworks = false">取消</el-button>
                        <el-button type="primary" @click="treeworks = false">确认</el-button>
                    </div>
                </el-dialog>
                <el-button @click="affirmlist" type="primary" style="float:right;margin-top:-40px;">确定</el-button>
                <el-button @click="dialoglookVisible = false" style="float:right;margin-top:-40px;margin-right:80px">取消</el-button>
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
                    <el-button type="primary" @click="changeOrgOk" v-if="posyl">确定</el-button>
                    <el-button type="primary" @click="chanDpol" v-if="posyRpo">确定</el-button>
                </div>
            </el-dialog>
            <!-- 转办弹框 -->
            <el-dialog title="请选择转办接收人员" :close-on-click-modal="false" v-dialogDrag :visible.sync="innerVisible" width="60%" append-to-body>
                <el-row :gutter="20">
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
                </el-row>
                <el-container>
                    <el-col :span="8">
                        <el-aside width="280px">
                            <h4>组织</h4>
                            <el-tree :data="orgData" :props="defaultProps" @node-click="handleNodeClick1" v-loading="treeLoading" style="width:380px;height:500px;"></el-tree>
                        </el-aside>
                    </el-col>
                    <el-col :span="16">
                        <el-table height='578' :data="orgListData" v-loading="listLoading" border fit highlight-current-row style="width: 100%;min-height:500px;margin-top:8px" @current-change="hanhange">
                            <el-table-column prop="orgName" align="center" label="部门" min-width="60" style="cursor:pointer">
                                <template slot-scope="scope">
                                    <a class="text-detail">{{scope.row.orgName}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column prop="perName" align="center" label="人员" min-width="50" style="cursor:pointer">
                                <template slot-scope="scope">
                                    <a class="text-detail">{{scope.row.perName}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="工号" min-width="50">
                                <template slot-scope="scope">
                                    <a class="text-detail" style="text-decoration:underline">{{scope.row.workNumber}}</a>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-container>
                <div slot="footer" class="dialog-footer">
                </div>
            </el-dialog>
            <!-- 夹具图片放大 -->
            <el-dialog width="40%" title="夹具编码图片预览" :visible.sync="dialogBig" append-to-body :close-on-click-modal="false" v-dialogDrag>
                <div>
                    <img :src="temp.pictureUrl" alt="" style="width: 100%;height:100%">
                </div>
            </el-dialog>
            <el-dialog title="固定资产编号" :close-on-click-modal="false" width="60%" :visible.sync="dialogcodeVisible">
                <div class="filter-container">
                    <el-main>
                        <el-table :data="fixelistcode" v-loading="fromLoading" border fit highlight-current-row style="width: 100%;min-height:auto;margin-top:20px" height="500" :header-cell-style="{background:'oldlace'}">

                            <el-table-column prop="documentWordCode" align="center" label="单据编码">
                                <template slot-scope="scope">
                                    <span class="link-type futiop" @click='handleLook(scope.row)'>{{scope.row.documentWordCode}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="supplier" align="center" label="供应商">
                            </el-table-column>
                            <el-table-column prop="equipmentName" align="center" label="设备名称">
                            </el-table-column>
                            <el-table-column prop="serialNumber" align="center" label="出厂编号">
                            </el-table-column>
                            <el-table-column prop="typeSpecification" align="center" label="型号规格">
                            </el-table-column>
                            <el-table-column prop="fixedAssetCode" align="center" label="固定资产编号">
                            </el-table-column>
                            <el-table-column prop="acceptanceDate" align="center" label="验收日期">
                            </el-table-column>
                            <el-table-column prop="missPieceTypeName" align="center" label="是否缺件">
                            </el-table-column>
                            <el-table-column prop="acceptanceTypeName" align="center" label="验收情况">
                            </el-table-column>
                            <el-table-column prop="auditingTypeName" align="center" label="审核状态">
                            </el-table-column>
                        </el-table>
                    </el-main>
                    <!-- 分页 -->
                    <el-footer>
                        <div class="pagination-container">
                            <el-pagination background @size-change="handleSizeCode" @current-change="handleCurrentCode" :current-page="fixecodelist.pageNum" :page-sizes="[5,10,15,20]" :page-size="fixecodelist.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalstcode">
                            </el-pagination>
                        </div>
                    </el-footer>
                </div>
            </el-dialog>
        </el-container>
    </div>
</template>

<script>
import {
    fetchList,
    fixedascode,
    createArticlest,
    updateArticle,
    delById,
    fetchDetail,
    fileList,
    dendrogram,
    section,
    uploadlist,
    samllDelete,
    circuList,
    samllapp,
    works,
    insertFile,
    getCurrentUser,
    getschList,
    flowsheet,
    fetchlbList,
    transferReplace
} from "@/api/toolFixtureManagement/openBoxAcceptance";
import { fetchButton } from "@/api/common/button";
import { menuList } from "@/store/modules/permission"; // 按钮权限
import {
    commonOptions2,
    getProxyOrgList,
    choosePersonList,
    fetchChooseTree
} from "@/api/common/common";
import { baseUrl } from "@/api/common/fileBaseUrl";
export default {
    name: "openBoxAcceptance",
    data() {
        return {
            fixecodelist: {
                pageNum: 1,
                pageSize: 10
            },
            totalstcode: null,
            fixelistcode: [],
            dialogcodeVisible: false,
            innerVisible: false,
            dialogBig: false,
            picShow: true,
            isShow: false,
            treeLoading: false,
            orgData: [],
            listQuery1: {
                pageNum: 1,
                pageSize: 1000,
                perName: undefined,
                workNumber: undefined
            },
            orgListData: null,
            stshow: true,
            // 代办审核
            changeOrgVisible: undefined,
            proxyOrgList: [],
            comName: undefined,
            comCode: undefined,
            userCode: undefined, // 用户编码
            posyl: false, // 发起组织保存
            posyRpo: false, // 发起组织提交

            exchange: true, // 流转记录的隐藏
            processId: "",
            // 审核状态下拉框
            activeName: "first", // 选项卡默认选项
            options: commonOptions2,
            value13: [],
            tableData: [],
            smallslist: [], // 这个是新增里的小表格
            deleadds: false, // 小表格删除的显示隐藏
            deleuplet: false, // 小表格在编辑里的删除
            circulation: [], // 流转记录
            documentW: "", // 单据编码赋值
            userId: undefined, // 用户id
            filshow: true, // 文件上传框显示隐藏

            towlistdata: [], // 第二个小表格
            newdatale: false, // 二号小表格删除按钮
            updelestdaat: false, // 二号小表格删除按钮

            total: null,
            listQuery: {
                pageNum: 1,
                pageSize: 10
                // equipmentName: undefined,
                // fixedAssetCode: undefined,
                // acceptanceDateStart: undefined,
            },
            temp: {
                acceptanceDate: undefined,
                acceptanceType: undefined,
                actualAcceptSituation: undefined,
                auditingType: null,
                deliveryCode: undefined,
                deliveryCodeContent: undefined,
                equId: undefined,
                equipmentName: undefined,
                fixedAssetCode: undefined,
                list: [],
                missPieceType: undefined,
                pictureUrl: undefined,
                proxyOrgCode: undefined,
                purchaseStorehouseCode: undefined,
                purchaseStorehouseName: undefined,
                serialNumber: undefined,
                supplier: undefined,
                typeSpecification: undefined
            },
            // 按钮权限
            menuCode: "",
            addShow: false,
            editShow: false,
            delShow: false,
            // 弹框显示
            dialogFormVisible: false,
            popTitle: "",
            dialogStatus: "",
            textMap: {
                update: "编辑",
                create: "新增",
                detail: "查看"
            },
            // 引用夹具台账的字段
            fastener: false, // 新增里的按钮一览表的
            dialoglookVisible: false, // 弹窗属性(引用夹具台账)
            radio: "", // 使用公司树的数组
            yesno: "", // 使用工厂
            postyly: "", // 使用部门

            listydatast: [],
            checkid: "", // 一览id
            equipst: "",
            fixedsCode: "",
            typefition: "", // 型号规格
            suppl: "", // 供应商
            seriabersty: "", // 出厂编号
            deiumber: "", // 送货单号
            editDisabled: "",
            lookList: [],
            totalst: null,
            listQueryst: {
                pageNum: 1,
                pageSize: 10,
                equipmentName: "",
                fixedAssetCode: "",
                model: "",
                equipmentStatus: ""
            },
            treeFormVisible: false, // 使用公司树选择
            treeDepartment: false, // 使用部门树选择
            treeworks: false, // 使用工厂树选择
            siCode: true, // 禁止树的输入框输入
            // 使用公司树的数据
            i: 0,
            datast: [],
            defaultProps: {
                children: "children",
                label: "orgFullName"
            },
            // 使用部门树的数据
            datalisy: [],
            terrdef: {
                children: "children",
                label: "orgFullName"
            },
            chartData: "", // 流程图
            // 使用工厂树的数据
            plantlisy: [],
            terrplant: {
                children: "children",
                label: "orgFullName"
            },
            orgwork: "", // 使用工厂的编号
            orgsection: "", // 使用部门的编号
            checkedId: null,
            checkedIds: null,
            checkedIdst: null,
            // 选中的导入信息
            secArr: [],
            multipleSelection: null,
            checkedIndex: "",
            xztj: false,
            bjtj: false,
            xzbc: false,
            bjbc: false,
            listLoading: true,
            fromLoading: true,
            chooseShow: "",
            lbList: [],
            rules: {
                // supplier: [
                //     {
                //         required: true,
                //         message: "此项为必填项",
                //         trigger: "change"
                //     }
                // ], // 供应厂商
                equipmentName: [
                    {
                        required: true,
                        message: "此项为必填项",
                        trigger: "change"
                    }
                ], // 夹具名称
                serialNumber: [
                    {
                        required: true,
                        message: "此项为必填项",
                        trigger: "change"
                    }
                ],
                typeSpecification: [
                    {
                        required: true,
                        message: "此项为必填项",
                        trigger: "change"
                    }
                ],
                fixedAssetCode: [
                    {
                        required: true,
                        message: "此项为必填项",
                        trigger: "change"
                    }
                ],
                deliveryCode: [
                    {
                        required: true,
                        message: "此项为必填项",
                        trigger: "change"
                    }
                ], // 固定资产编号
                deliveryCodeContent: [
                    {
                        required: true,
                        message: "此项为必填项",
                        trigger: "change"
                    }
                ],
                actualAcceptSituation: [
                    {
                        required: true,
                        message: "此项为必填项",
                        trigger: "change"
                    }
                ],
                missPieceType: [
                    {
                        required: true,
                        message: "此项为必填项",
                        trigger: "change"
                    }
                ],
                acceptanceType: [
                    {
                        required: true,
                        message: "此项为必填项",
                        trigger: "change"
                    }
                ],
                acceptanceDate: [
                    {
                        required: true,
                        message: "此项为必填项",
                        trigger: "change"
                    }
                ],
                purchaseStorehouseName: [
                    {
                        required: true,
                        message: "此项为必填项",
                        trigger: "change"
                    }
                ] // 采购入库仓库
            }
        };
    },
    created() {
        this.getList();
        this.getButton();
        this.getlbList();
    },

    methods: {
        // 模糊查询采购入库仓库
        getlbList() {
            const find = {
                parCode: "CK",
                pageNum: 1,
                pageSize: 200
            };
            fetchlbList(find).then(response => {
                this.lbList = [];
                this.lbList = response.data.data.list;
            });
        },
        lbChange() {
            this.lbList.forEach(item => {
                if (item.wordName == this.temp.purchaseStorehouseName) {
                    this.temp.purchaseStorehouseCode = item.wordCode;
                }
            });
        },
        transfer(row) {
            this.transt = row.id;
            this.listQuery1 = {
                pageNum: 1,
                pageSize: 1000,
                perName: undefined,
                workNumber: undefined
            };
            this.innerVisible = true;
            this.treeLoading = true;
            // 查询组织树结构
            fetchChooseTree().then(response => {
                this.orgData = [];
                this.orgData.push(response.data.data);
                setTimeout(() => {
                    this.treeLoading = false;
                }, 1 * 1000);
            });
        },
        // 组织树点击事件加载表格数据
        handleNodeClick1(data) {
            this.listLoading = true;
            const params = {
                orgCode: data.orgCode,
                pageNum: 1,
                pageSize: 1000
            };
            choosePersonList(params).then(response => {
                this.orgListData = response.data.data.list;
                setTimeout(() => {
                    this.listLoading = false;
                }, 1 * 1000);
            });
        },
        //  搜索
        handlePerson() {
            this.listLoading = true;
            choosePersonList(this.listQuery1).then(response => {
                this.orgListData = response.data.data.list;
                setTimeout(() => {
                    this.listLoading = false;
                }, 1 * 1000);
            });
        },
        // 关联人员提交
        hanhange(val) {
            const data = {
                type: 1,
                workNumber: val.workNumber,
                ids: this.transt
            };
            transferReplace(data).then(response => {
                if (response.data.code == 200) {
                    this.$notify({
                        title: "成功",
                        message: response.data.msg,
                        type: "success",
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
                    this.getList();
                }
            });
            this.innerVisible = false;
        },
        // 文件预览
        handlePreview(row) {
            if (this.dialogStatus == "create") {
                var url =
                    baseUrl +
                    "onlinePreview?url=" +
                    encodeURIComponent(row.fileUrl);
            } else {
                var url =
                    baseUrl +
                    "onlinePreview?url=" +
                    encodeURIComponent(row.filePath);
            }
            var winHeight = window.document.documentElement.clientHeight - 10;
            window.open(
                url,
                "_blank",
                "height=" +
                    winHeight +
                    ",top=80,left=80,toolbar=no, menubar=no, scrollbars=yes, resizable=yes"
            );
        },
        // 复选勾选触发的事件
        handleSelect(val, row) {
            if (val.length > 1) {
                this.$refs.ftlpsty.clearSelection(); // 清空所有选择
                val.shift();
                this.$refs.ftlpsty.toggleRowSelection(row); //  选中当前选择
            }
            this.secArr = val;
            this.multipleSelection = row;
            this.checkedIndex = val.length;
        },
        handleSelectionChange(val) {},
        // 引用台账->确定
        affirmlist() {
            if (this.checkedIndex == 0) {
                this.$message({
                    title: "警告",
                    message: "请选择一条要引用的数据",
                    type: "warning",
                    duration: 2000
                });
                return;
            }
            this.checkid = this.multipleSelection.id;
            this.temp.equipmentName = this.multipleSelection.equipmentName;
            this.temp.fixedAssetCode = this.multipleSelection.fixedAssetCode;
            this.temp.supplier = this.multipleSelection.manufacturer;
            this.temp.typeSpecification = this.multipleSelection.model;
            this.dialoglookVisible = false;
        },
        // 获取按钮权限
        getButton() {
            menuList.forEach(item => {
                item.children.forEach(e => {
                    if (e.name == "openBoxAcceptance") {
                        this.menuCode = e.code;
                    }
                });
            });
            // 查询按钮信息
            const determine = {
                menuCode: this.menuCode,
                type: "web"
            };
            fetchButton(determine).then(response => {
                if (response.data.code == 200) {
                    const authority = response.data.data;
                    for (var i = 0; i < authority.length; i++) {
                        if (authority[i].buttonName == "新增") {
                            this.addShow = true;
                        } else if (authority[i].buttonName == "编辑") {
                            this.editShow = true;
                        } else if (authority[i].buttonName == "删除") {
                            this.delShow = true;
                        }
                    }
                } else {
                    this.$notify({
                        title: "警告",
                        message: response.data.msg,
                        type: "warning",
                        duration: 3000
                    });
                }
            });
        },
        // 查询列表
        getList() {
            this.listLoading = true;
            fetchList(this.listQuery).then(response => {
                if (response.data.code == 200) {
                    this.tableData = response.data.data.list;
                    for (var i = 0; i < this.tableData.length; i++) {
                        if (this.tableData[i].auditingType == 2) {
                            this.tableData[i].auditingTypeName = "审核中";
                            this.tableData[i].editDisabled = true;
                            this.tableData[i].deleteDisabled = true;
                            this.tableData[i].stshow = true;
                        } else if (this.tableData[i].auditingType == 1) {
                            this.tableData[i].auditingTypeName = "未提交";
                            this.tableData[i].editDisabled = false;
                            this.tableData[i].deleteDisabled = false;
                            this.tableData[i].stshow = false;
                        } else if (this.tableData[i].auditingType == 3) {
                            this.tableData[i].auditingTypeName = "审核通过";
                            this.tableData[i].editDisabled = true;
                            this.tableData[i].deleteDisabled = true;
                            this.tableData[i].stshow = true;
                        } else if (this.tableData[i].auditingType == 4) {
                            this.tableData[i].auditingTypeName = "审核不通过";
                            this.tableData[i].editDisabled = true;
                            this.tableData[i].deleteDisabled = true;
                            this.tableData[i].stshow = true;
                        } else if (this.tableData[i].auditingType == 5) {
                            this.tableData[i].auditingTypeName = "流程关闭";
                            this.tableData[i].editDisabled = true;
                            this.tableData[i].deleteDisabled = true;
                            this.tableData[i].stshow = true;
                        }
                        // 判断删除
                        if (
                            this.tableData[i].auditingType == 1 &&
                            this.tableData[i].enableDelete == 0
                        ) {
                            this.tableData[i].deleteDisabled = true;
                        } else if (
                            this.tableData[i].auditingType == 1 &&
                            this.tableData[i].enableDelete == 1
                        ) {
                            this.tableData[i].deleteDisabled = false;
                        }
                    }
                    this.total = response.data.data.total;
                    setTimeout(() => {
                        this.listLoading = false;
                    }, 1 * 500);
                } else {
                    this.$notify({
                        title: "警告",
                        message: response.data.msg,
                        type: "warning",
                        duration: 3000
                    });
                    this.listLoading = false;
                }
            });
        },
        // 固定资产编号折叠弹框
        fpoyss(row) {
            this.fixecodelist = {
                pageNum: 1,
                pageSize: 10,
                fixedAssetCode: row.fixedAssetCode
            };
            this.dialogcodeVisible = true;
            this.fix();
        },
        // 固定资产编号折叠
        fix() {
            this.fromLoading = true;
            fixedascode(this.fixecodelist).then(response => {
                if (response.data.code == 200) {
                    this.fixelistcode = response.data.data.list;
                    for (var i = 0; i < this.fixelistcode.length; i++) {
                        if (this.fixelistcode[i].auditingType == 3) {
                            this.fixelistcode[i].auditingTypeName = "审核通过";
                        }
                        if (this.fixelistcode[i].acceptanceType == 0) {
                            this.fixelistcode[i].acceptanceTypeName =
                                "验收不通过";
                        } else if (this.fixelistcode[i].acceptanceType == 1) {
                            this.fixelistcode[i].acceptanceTypeName =
                                "验收通过";
                        }
                        if (this.fixelistcode[i].missPieceType == 0) {
                            this.fixelistcode[i].missPieceTypeName = "不缺件";
                        } else if (this.fixelistcode[i].missPieceType == 1) {
                            this.fixelistcode[i].missPieceTypeName = "缺件";
                        }
                    }
                    this.totalstcode = response.data.data.total;
                    setTimeout(() => {
                        this.fromLoading = false;
                    }, 1 * 500);
                } else {
                    this.$notify({
                        title: "警告",
                        message: response.data.msg,
                        type: "warning",
                        duration: 3000
                    });
                    this.fromLoading = false;
                }
            });
        },

        handleSizeCode(vals) {
            this.fixecodelist.pageSize = vals;
            this.fix();
        },
        handleCurrentCode(vals) {
            this.fixecodelist.pageNum = vals;
            this.fix();
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
        // 代理组织
        proxyOrgChange() {
            this.proxyOrgList.forEach(item => {
                if (item.orgName == this.temp.proxyOrgName) {
                    this.temp.proxyOrgCode = item.orgCode;
                }
            });
        },
        // 确认按钮（新增）
        changeOrgOk() {
            if (
                this.temp.proxyOrgName == undefined ||
                this.temp.proxyOrgName == "" ||
                this.temp.proxyOrgName == null
            ) {
                this.temp.proxyOrgCode = this.comCode;
                if (this.dialogStatus == "create") {
                    this.createSubmit();
                }
            } else {
                if (this.dialogStatus == "create") {
                    this.createSubmit();
                }
            }
            this.changeOrgVisible = false;
        },
        // 确认按钮（保存）
        chanDpol() {
            if (
                this.temp.proxyOrgName == undefined ||
                this.temp.proxyOrgName == "" ||
                this.temp.proxyOrgName == null
            ) {
                this.temp.proxyOrgCode = this.comCode;
                if (this.dialogStatus == "create") {
                    this.savPstot();
                }
            } else {
                if (this.dialogStatus == "create") {
                    this.savPstot();
                }
            }
            this.changeOrgVisible = false;
        },
        // 验收日期
        changeDate() {
            if (this.value13 == null) {
                this.listQuery.acceptanceDateStart = "";
                this.listQuery.acceptanceDateEnd = "";
            } else {
                this.listQuery.acceptanceDateStart = this.value13[0]; // 开始时间
                this.listQuery.acceptanceDateEnd = this.value13[1];
            }
        },
        // 第一个上传的按钮
        noticeUpload(e) {
            const file = e.target.files[0];
            const fileData1 = {
                attachmentCode: "JJKXYSDFJ",
                moduleType: "28",
                fileName: undefined,
                filePath: undefined, // 文件URL
                fileNameSC: undefined,
                node: "开始",
                fileUrl: undefined,
                userId: this.userId, // 获取用户id,
                code: this.documentW // 单据编码
            };
            if (file != null) {
                this.fromLoading = true;
                const param = new FormData(); // 创建form对象
                param.append("file", file, file.name); // 通过append向form对象添加数据
                fileData1.fileName = file.name;
                uploadlist(param).then(resp => {
                    // 调用上传接口
                    if (resp.data.code == 200) {
                        fileData1.filePath = resp.data.data.remoteFilename; // 文件地址
                        fileData1.fileUrl = resp.data.data.fileUrl;
                        fileData1.fileNameSC = resp.data.data.remoteFilename;
                        if (this.dialogStatus == "update") {
                            insertFile(fileData1).then(response => {
                                if (response.data.code == 200) {
                                    this.$message({
                                        title: "成功",
                                        message: "上传成功",
                                        type: "success",
                                        duration: 2000
                                    });
                                    this.smalldast(); // 小表格列表
                                }
                                const test = document.getElementById(
                                    "uploadImg"
                                );
                                test.value = "";
                                this.fromLoading = false;
                            });
                        } else if (this.dialogStatus == "create") {
                            this.smallslist.push(fileData1);
                            this.$message({
                                title: "成功",
                                message: "上传成功",
                                type: "success",
                                duration: 2000
                            });
                            const test = document.getElementById("uploadImg");
                            test.value = "";
                        }
                        setTimeout(() => {
                            this.fromLoading = false;
                        }, 1 * 500);
                    } else if (resp.data.code == 402) {
                        this.$notify({
                            title: "警告",
                            message: resp.data.msg,
                            type: "warning",
                            duration: 3000
                        });
                        this.fromLoading = false;
                        const test = document.getElementById("uploadImg");
                        test.value = "";
                    } else {
                        this.$notify({
                            title: "警告",
                            message: "上传失败",
                            type: "warning",
                            duration: 3000
                        });
                        this.fromLoading = false;
                        const test = document.getElementById("uploadImg");
                        test.value = "";
                    }
                });
            }
        },
        // 第二个上传的按钮（送货单号上传图片）
        imgUpload(e) {
            const file = e.target.files[0];
            const fileData1 = {
                attachmentCode: "JJKXYSSHFJ",
                moduleType: "28",
                fileName: undefined,
                filePath: undefined, // 文件URL
                fileNameSC: undefined,
                node: "开始",
                fileUrl: undefined,
                userId: this.userId, // 获取用户id,
                code: this.documentW // 单据编码
            };
            if (file != null) {
                this.fromLoading = true;
                const param = new FormData(); // 创建form对象
                param.append("file", file, file.name); // 通过append向form对象添加数据
                fileData1.fileName = file.name;
                uploadlist(param).then(resp => {
                    // 调用上传接口
                    if (resp.data.code == 200) {
                        fileData1.filePath = resp.data.data.remoteFilename; // 文件地址
                        fileData1.fileUrl = resp.data.data.fileUrl;
                        fileData1.fileNameSC = resp.data.data.remoteFilename;
                        if (this.dialogStatus == "update") {
                            insertFile(fileData1).then(response => {
                                if (response.data.code == 200) {
                                    this.$message({
                                        title: "成功",
                                        message: "上传成功",
                                        type: "success",
                                        duration: 2000
                                    });
                                    this.smalldast1(); // 小表格列表
                                }
                                const test = document.getElementById(
                                    "deliveryNumberPic"
                                );
                                test.value = "";
                                this.fromLoading = false;
                            });
                        } else if (this.dialogStatus == "create") {
                            this.towlistdata.push(fileData1);
                            this.$message({
                                title: "成功",
                                message: "上传成功",
                                type: "success",
                                duration: 2000
                            });
                            const test = document.getElementById(
                                "deliveryNumberPic"
                            );
                            test.value = "";
                        }
                        setTimeout(() => {
                            this.fromLoading = false;
                        }, 1 * 500);
                    } else if (resp.data.code == 402) {
                        this.$notify({
                            title: "警告",
                            message: resp.data.msg,
                            type: "warning",
                            duration: 3000
                        });
                        this.fromLoading = false;
                        const test = document.getElementById(
                            "deliveryNumberPic"
                        );
                        test.value = "";
                    } else {
                        this.$notify({
                            title: "警告",
                            message: "上传失败",
                            type: "warning",
                            duration: 3000
                        });
                        this.fromLoading = false;
                        const test = document.getElementById(
                            "deliveryNumberPic"
                        );
                        test.value = "";
                    }
                });
            }
        },
        // 夹具图片上传
        picUpload(e) {
            const file = e.target.files[0];
            const fileData1 = {
                fileName: undefined,
                filePath: undefined, // 文件URL
                fileUrl: undefined
            };
            if (file != null) {
                this.fromLoading = true;
                const param = new FormData(); // 创建form对象
                param.append("file", file, file.name); // 通过append向form对象添加数据
                fileData1.fileName = file.name;
                uploadlist(param).then(resp => {
                    // 调用上传接口
                    if (resp.data.code == 200) {
                        this.picShow = false;
                        this.isShow = true;
                        fileData1.filePath = resp.data.data.remoteFilename; // 文件地址
                        fileData1.fileUrl = resp.data.data.fileUrl;
                        // if (this.dialogStatus == 'update') {
                        //   insertFile(fileData1).then(response => {
                        //     this.temp.pictureUrl = fileData1.fileUrl
                        //     if (response.data.code == 200) {
                        //       this.$message({
                        //         title: '成功',
                        //         message: '上传成功',
                        //         type: 'success',
                        //         duration: 2000
                        //       })
                        //       // this.smalldast1(); // 小表格列表
                        //     }
                        //     const test = document.getElementById('pic')
                        //     // test.value = "";
                        //     this.fromLoading = false
                        //   })
                        // } else if (this.dialogStatus == 'create') {
                        this.temp.pictureUrl = fileData1.fileUrl;
                        this.$message({
                            title: "成功",
                            message: "上传成功",
                            type: "success",
                            duration: 2000
                        });
                        // const test = document.getElementById("pic");
                        // test.value = "";
                        // }
                        setTimeout(() => {
                            this.fromLoading = false;
                        }, 1 * 500);
                    } else if (resp.data.code == 402) {
                        this.picShow = true;
                        this.isShow = false;
                        this.$notify({
                            title: "警告",
                            message: resp.data.msg,
                            type: "warning",
                            duration: 3000
                        });
                        this.fromLoading = false;
                    } else {
                        this.picShow = true;
                        this.isShow = false;
                        this.$notify({
                            title: "警告",
                            message: "上传失败",
                            type: "warning",
                            duration: 3000
                        });
                        this.fromLoading = false;
                    }
                });
            }
        },
        // 删除夹具图片
        delPic() {
            this.temp.pictureUrl = "";
            document.getElementById("pic").value = "";
            this.picShow = true;
            this.isShow = false;
        },
        //夹具图片放大
        handleBig() {
            this.dialogBig = true;
        },
        // 下载夹具图片
        downLoadPic() {
            const att = "picture.jpg";
            window.location.href = this.temp.pictureUrl + "?attname=" + att;
            this.$message({
                title: "成功",
                message: "下载成功",
                type: "success",
                duration: 2000
            });
        },
        // 重置表单
        resetTemp() {
            this.temp = {
                acceptanceDate: undefined,
                acceptanceType: undefined,
                actualAcceptSituation: undefined,
                auditingType: null,
                deliveryCode: undefined,
                deliveryCodeContent: undefined,
                equId: undefined,
                equipmentName: undefined,
                fixedAssetCode: undefined,
                list: [],
                missPieceType: undefined,
                pictureUrl: undefined,
                proxyOrgCode: undefined,
                purchaseStorehouseCode: undefined,
                purchaseStorehouseName: undefined,
                serialNumber: undefined,
                supplier: undefined,
                typeSpecification: undefined
            };
            this.smallslist = [];
            this.towlistdata = [];
            this.userId = undefined;
        },
        // 新增点击打开弹窗事件
        handleCreate() {
            this.picShow = true;
            this.isShow = false;
            this.resetTemp();
            this.fastener = true;
            this.fromLoading = false; // 加载动画
            this.exchange = false;
            this.xzbc = true;
            this.xztj = true;
            this.bjbc = false;
            this.bjtj = false;
            this.chooseShow = true;
            this.dialogStatus = "create";
            this.dialogFormVisible = true;
            this.deleadds = true;
            this.deleuplet = false;
            this.filshow = true; // 文件上传框显隐
            this.activeName = "first"; // 选项卡默认选
            this.getUser();
            this.$nextTick(() => {
                this.$refs["dataForm"].clearValidate();
            });
        },
        // 小表格下载 samllapp
        downloadsty(row) {
            if (this.dialogStatus == "create") {
                window.location.href = row.fileUrl + "?attname=" + row.fileName;
                this.$message({
                    title: "成功",
                    message: "下载成功",
                    type: "success",
                    duration: 2000
                });
            } else {
                const att = row.fileName;
                window.location.href = row.filePath + "?attname=" + att;
                this.$message({
                    title: "成功",
                    message: "下载成功",
                    type: "success",
                    duration: 2000
                });
            }
        },
        // 送货单号上传图片下载
        downty(row) {
            if (this.dialogStatus == "create") {
                window.location.href = row.fileUrl + "?attname=" + row.fileName;

                this.$message({
                    title: "成功",
                    message: "下载成功",
                    type: "success",
                    duration: 2000
                });
            } else {
                const att = row.fileName;
                window.location.href = row.filePath + "?attname=" + att;
                this.$message({
                    title: "成功",
                    message: "下载成功",
                    type: "success",
                    duration: 2000
                });
            }
        },
        // 新增和重新验收小表格删除
        addsmalldelest(row) {
            this.$confirm("是否确认删除?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$message({
                        type: "success",
                        message: "删除成功!"
                    });
                    const ids = {
                        fileName: row.filePath
                    };
                    samllapp(ids).then(response => {
                        const index = this.smallslist.indexOf(row);
                        this.smallslist.splice(index, 1);
                    });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        },
        // 送货单号上传图片 新增和重新验收小表格删除
        twosmalldelest(row) {
            this.$confirm("是否确认删除?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$message({
                        type: "success",
                        message: "删除成功!"
                    });
                    const ids = {
                        fileName: row.filePath
                    };
                    samllapp(ids).then(response => {
                        const index = this.towlistdata.indexOf(row);
                        this.towlistdata.splice(index, 1);
                    });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        },
        //  新增保存
        saveData(row) {
            this.$refs["dataForm"].validate(valid => {
                if (valid) {
                    if (this.proxyOrgList.length != 0) {
                        this.changeOrgVisible = true;
                        this.posyl = false; // 提交时候
                        this.posyRpo = true;
                    } else {
                        this.temp.proxyOrgCode = this.comCode;
                        this.savPstot();
                    }
                }
            });
        },
        // 新增的保存
        savPstot() {
            if (this.dialogStatus == "create") {
                this.temp.isReAcceptance = false; // 重新验收的标识true是重新false是新增
                this.temp.auditingType = 1;
                this.temp.equId = this.checkid;
                if (this.towlistdata.length == 0) {
                    this.$notify({
                        title: "提示",
                        message: "请上传送货单附件",
                        type: "warning",
                        duration: 2000
                    });
                    this.fromLoading = false; // 加载动画
                    return;
                }
                if (this.smallslist.length == 0) {
                    this.$notify({
                        title: "提示",
                        message: "请上传开箱验收单附件",
                        type: "warning",
                        duration: 2000
                    });
                    this.fromLoading = false;
                    return;
                }
                const op = this.smallslist;
                const lo = this.towlistdata;
                for (var i = 0; i < lo.length; i++) {
                    op.push(lo[i]);
                }
                this.temp.list = op;
                createArticlest(this.temp).then(response => {
                    if (response.data.code == 200) {
                        this.tableData.unshift(this.temp);
                        this.dialogFormVisible = false;
                        this.getList();
                        this.$message({
                            title: "成功",
                            message: "创建成功",
                            type: "success",
                            duration: 2000
                        });
                    } else {
                        this.$notify({
                            title: "警告",
                            message: response.data.msg,
                            type: "warning",
                            duration: 3000
                        });
                    }
                    setTimeout(() => {
                        this.fromLoading = false;
                    }, 1 * 500);
                });
                // }
            }
        },
        // 新增提交按钮
        createData() {
            this.$refs["dataForm"].validate(valid => {
                if (valid) {
                    if (this.proxyOrgList.length != 0) {
                        this.changeOrgVisible = true;
                        this.posyl = true; // 提交时候
                        this.posyRpo = false;
                    } else {
                        this.temp.proxyOrgCode = this.comCode;
                        this.createSubmit();
                    }
                }
            });
        },
        // 新增提交按钮
        createSubmit() {
            if (this.dialogStatus == "create") {
                // 新增
                this.temp.isReAcceptance = false; // 重新验收的标识true是重新false是新增
                this.temp.auditingType = 2;
                this.temp.equId = this.checkid;

                this.fromLoading = true; // 加载动画
                if (this.towlistdata.length == 0) {
                    this.$notify({
                        title: "提示",
                        message: "请上传送货单附件",
                        type: "warning",
                        duration: 2000
                    });
                    this.fromLoading = false; // 加载动画
                    return;
                }
                if (this.smallslist.length == 0) {
                    this.$notify({
                        title: "提示",
                        message: "请上传开箱验收单附件",
                        type: "warning",
                        duration: 2000
                    });
                    this.fromLoading = false;
                    return;
                }
                const op = this.smallslist;
                const lo = this.towlistdata;
                for (var i = 0; i < lo.length; i++) {
                    op.push(lo[i]);
                }
                this.temp.list = op;
                createArticlest(this.temp).then(response => {
                    if (response.data.code == 200) {
                        this.tableData.unshift(this.temp);
                        this.dialogFormVisible = false;
                        this.getList();
                        this.$message({
                            title: "成功",
                            message: "创建成功",
                            type: "success",
                            duration: 2000
                        });
                    } else {
                        this.$notify({
                            title: "警告",
                            message: response.data.msg,
                            type: "warning",
                            duration: 3000
                        });
                    }
                    setTimeout(() => {
                        this.fromLoading = false;
                    }, 1 * 500);
                });
            }
        },
        // 编辑
        handleUpdate(row) {
            const id = row.id;
            this.fastener = true;
            this.exchange = false;
            this.bjbc = true;
            this.bjtj = true;
            this.xzbc = false;
            this.xztj = false;
            this.fromLoading = false; // 加载动画
            this.documentW = row.documentWordCode; // 单据编码
            this.activeName = "first"; // 选项卡默认选项
            fetchDetail(id).then(response => {
                this.popTitle = response.data.data;
                this.temp = Object.assign({}, this.popTitle); // copy obj 复制obj
                if (this.popTitle.acceptanceType !== null) {
                    this.temp.acceptanceType = this.popTitle.acceptanceType.toString();
                }
                if (this.popTitle.missPieceType !== null) {
                    this.temp.missPieceType = this.popTitle.missPieceType.toString();
                }
                if (
                    this.temp.pictureUrl == "" ||
                    this.temp.pictureUrl == null ||
                    this.temp.pictureUrl == undefined
                ) {
                    this.picShow = true;
                    this.isShow = false;
                } else {
                    this.isShow = true;
                    this.picShow = false;
                }
            });
            this.chooseShow = true;
            this.dialogStatus = "update";
            this.dialogFormVisible = true;
            this.filshow = true; // 文件上传框显隐
            // 小表格删除按钮显隐
            this.deleadds = false;
            this.deleuplet = true;
            // 获取当前用户信息
            getCurrentUser().then(response => {
                this.userId = response.data.data.id;
            });
            this.smalldast();
            this.smalldast1();
            this.getUser();
            this.$nextTick(() => {
                this.$refs["dataForm"].clearValidate();
            });
        },
        // 编辑里的第一个小表格接口
        smalldast() {
            const samllblist = {
                moduleType: 28,
                attachmentCode: "JJKXYSDFJ",
                documentWordCode: this.documentW
            };
            fileList(samllblist).then(response => {
                this.smallslist = response.data.data;
            });
        },
        // 第二个小表格数据 towlistdata
        smalldast1() {
            const samblist = {
                moduleType: 28,
                attachmentCode: "JJKXYSSHFJ",
                documentWordCode: this.documentW
            };
            fileList(samblist).then(response => {
                this.towlistdata = response.data.data;
            });
            this.$nextTick(() => {
                this.$refs["dataForm"].clearValidate();
            });
        },
        // 小表格删除（编辑里的）
        smalldelest(row) {
            this.$confirm("是否确认删除?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$message({
                        type: "success",
                        message: "删除成功!"
                    });
                    const ids = row.id;
                    samllDelete(ids).then(response => {
                        this.smalldast();
                        const index = this.smallslist.indexOf(row);
                        this.smallslist.splice(index, 1);
                    });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        },
        // 小表格删除（编辑里的）送货单号上传图片
        twoupdatadelest(row) {
            this.$confirm("是否确认删除?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$message({
                        type: "success",
                        message: "删除成功!"
                    });
                    const ids = row.id;
                    samllDelete(ids).then(response => {
                        this.smalldast();
                        const index = this.towlistdata.indexOf(row);
                        this.towlistdata.splice(index, 1);
                    });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        },
        // 编辑的保存
        updateSaveData() {
            this.$refs["dataForm"].validate(valid => {
                if (valid) {
                    const tempData = Object.assign({}, this.temp);
                    tempData.auditingType = 1;
                    this.fromLoading = true; // 加载动画
                    if (this.smallslist == "" || this.towlistdata == "") {
                        this.$notify({
                            title: "提示",
                            message: "请上传图片和附件",
                            type: "warning",
                            duration: 3000
                        });
                        this.fromLoading = false; // 加载动画
                        return;
                    } else {
                        updateArticle(tempData).then(response => {
                            const msg = response.data.msg;
                            if (response.data.code == 200) {
                                for (const v of this.tableData) {
                                    if (v.id === this.temp.id) {
                                        const index = this.tableData.indexOf(v);
                                        this.tableData.splice(
                                            index,
                                            1,
                                            this.temp
                                        );
                                        break;
                                    }
                                }
                                this.dialogFormVisible = false;
                                this.getList();
                                this.$notify({
                                    title: "成功",
                                    message: msg,
                                    type: "success",
                                    duration: 2000
                                });
                            } else {
                                this.$notify({
                                    title: "错误",
                                    message: msg,
                                    type: "error",
                                    duration: 2000
                                });
                            }
                            setTimeout(() => {
                                this.fromLoading = false;
                            }, 1 * 500);
                        });
                    }
                }
            });
        },

        // 编辑提交按钮
        updateData() {
            this.$refs["dataForm"].validate(valid => {
                if (valid) {
                    const tempData = Object.assign({}, this.temp);
                    tempData.auditingType = 2;
                    this.fromLoading = true; // 加载动画
                    if (this.smallslist == "" || this.towlistdata == "") {
                        this.$notify({
                            title: "提示",
                            message: "请上传图片和附件",
                            type: "warning",
                            duration: 3000
                        });
                        this.fromLoading = false; // 加载动画
                        return;
                    } else {
                        updateArticle(tempData).then(response => {
                            const msg = response.data.msg;
                            if (response.data.code == 200) {
                                for (const v of this.tableData) {
                                    if (v.id === this.temp.id) {
                                        const index = this.tableData.indexOf(v);
                                        this.tableData.splice(
                                            index,
                                            1,
                                            this.temp
                                        );
                                        break;
                                    }
                                }
                                this.dialogFormVisible = false;
                                this.getList();
                                this.$notify({
                                    title: "成功",
                                    message: msg,
                                    type: "success",
                                    duration: 2000
                                });
                            } else {
                                this.$notify({
                                    title: "错误",
                                    message: msg,
                                    type: "error",
                                    duration: 2000
                                });
                            }
                            setTimeout(() => {
                                this.fromLoading = false;
                            }, 1 * 500);
                        });
                    }
                }
            });
        },
        // 引用夹具台账
        sheetData() {
            this.dialoglookVisible = true;
            this.listQueryst.equipmentName = "";
            this.listQueryst.fixedAssetCode = "";
            this.listQueryst.model = "";
            this.listQueryst.pageNum = 1;
            this.listQueryst.pageSize = 10;
            this.getlistdatast();
            this.multipleSelection = "";
            this.checkedIndex = "";
        },
        handleSelectAll(val) {
            this.$message({
                title: "警告",
                message: "请选择一条要引用的信息",
                type: "warning",
                duration: 3000
            });
        },
        //  引用夹具台账表格接口
        getlistdatast() {
            this.lookList = [];
            this.listLoading = true;
            getschList(this.listQueryst).then(response => {
                this.listydatast = response.data.data.list;
                this.totalst = response.data.data.total;
                this.$nextTick(() => {
                    this.listLoading = false;
                });
            });
        },
        // 应用台账 搜索
        handleFilterst() {
            this.listQueryst.pageNum = 1;
            this.getlistdatast();
        },
        handleSizeChangest(vals) {
            this.listQueryst.pageSize = vals;
            this.getlistdatast();
        },
        handleCurrentChangest(vals) {
            this.listQueryst.pageNum = vals;
            this.getlistdatast();
        },
        // 使用公司清空按钮
        clears() {
            this.radio = "";
            this.listQuery.companyCode = "";
            this.treeFormVisible = false;
        },
        // 使用部门清空按钮
        clearssyo() {
            this.postyly = "";
            this.listQueryst.divisionCode = "";
            this.treeDepartment = false;
        },
        // 使用工厂清空按钮
        clearssyosytp() {
            this.yesno = "";
            this.listQueryst.factoryCode = "";
            this.treeworks = false;
        },
        // 使用公司树的接口
        // 树状图的接口
        treecostypo() {
            this.datast.splice(0);
            dendrogram("").then(response => {
                this.datast.push(response.data.data);

                for (var i = 0; i < this.datast.length; i++) {
                    if (this.datast[i].orgType == "部门") {
                        this.datast[i].disabled = true;
                    }
                    for (var j = 0; j < this.datast[i].children.length; j++) {
                        const child = this.datast[i].children[j];
                        if (child.orgType == "部门") {
                            child.disabled = true;
                        }
                        if (child.children !== null) {
                            for (var p = 0; p < child.children.length; p++) {
                                if (child.children[p].orgType == "部门") {
                                    child.children[p].disabled = true;
                                }
                            }
                        }
                    }
                }
            });
        },
        // 使用公司的树选择按钮
        treeco() {
            this.treeFormVisible = true;
            this.treecostypo();
        },
        // 设置树状图单选
        handleClick(data, checked, node) {
            this.i++;
            if (this.i % 1 == 0) {
                if (checked == true) {
                    this.$refs.tree.setCheckedNodes([]);
                    this.$refs.tree.setCheckedNodes([data]);
                    this.listQueryst.companyCode = data.orgCode;
                    this.radio = data.orgFullName;
                    this.orgwork = data.orgCode;
                } else {
                    this.$refs.tree.setCheckedNodes([]);
                }
            }
        },
        // 树状图的点击方法
        handleNodeClick(data, checked, node) {
            this.checkedId = data.id;
        },
        // 使用工厂
        manuftory() {
            this.plantlisy.splice(0);
            const orgCodes = {
                orgCode: this.orgwork
            };
            works(orgCodes).then(response => {
                this.plantlisy.push(response.data.data);
                for (var i = 0; i < this.plantlisy.length; i++) {
                    if (this.plantlisy[i].orgType == "部门") {
                        this.plantlisy[i].disabled = true;
                    }
                    for (
                        var j = 0;
                        j < this.plantlisy[i].children.length;
                        j++
                    ) {
                        const child = this.plantlisy[i].children[j];
                        if (child.orgType == "部门") {
                            child.disabled = true;
                        }
                        if (child.children !== null) {
                            for (var p = 0; p < child.children.length; p++) {
                                if (child.children[p].orgType == "部门") {
                                    child.children[p].disabled = true;
                                }
                            }
                        }
                    }
                }
            });
        },
        manufactory() {
            if (this.radio == "") {
                this.$notify({
                    title: "提示",
                    message: "请选择使用公司",
                    type: "warning",
                    duration: 3000
                });
                return;
            } else {
                this.treeworks = true;
                this.manuftory();
            }
        },
        //  工厂设置树状图单选
        hocheckck(data, checked, node) {
            this.i++;
            if (this.i % 1 == 0) {
                if (checked == true) {
                    this.checkedIds = data.id;
                    this.$refs.treeplisy.setCheckedNodes([]);
                    this.$refs.treeplisy.setCheckedNodes([data]);
                    this.listQueryst.factoryCode = data.orgCode;
                    this.yesno = data.orgFullName;
                    this.orgsection = data.orgCode;
                }
            }
        },
        handleNodeClickworks(data) {
            this.checkedIds = data.id;
        },
        // 使用部门树接口
        sectionst() {
            this.datalisy.splice(0);
            const orgCodest = {
                orgCode: this.orgsection
            };
            section(orgCodest).then(response => {
                this.setlist.push(response.data.data);
                this.setlist.children = response.data.data;
                this.datalisy = [
                    {
                        orgFullName: "今飞控股集团",
                        children: this.setlist.children,
                        orgType: "公司"
                    }
                ];
                for (var i = 0; i < this.datalisy.length; i++) {
                    if (this.datalisy[i].orgType == "公司") {
                        this.datalisy[i].disabled = true;
                    }
                    for (var j = 0; j < this.datalisy[i].children.length; j++) {
                        const childsty = this.datalisy[i].children[j];
                        if (childsty.orgType == "公司") {
                            childsty.disabled = true;
                        }
                        if (childsty.children !== null) {
                            for (var p = 0; p < childsty.children.length; p++) {
                                const rosyt = childsty.children[p];
                                if (rosyt.orgType == "公司") {
                                    rosyt.disabled = true;
                                }
                                if (rosyt.children !== null) {
                                    for (
                                        var k = 0;
                                        k < rosyt.children.length;
                                        k++
                                    ) {
                                        const postdis = rosyt.children[k];
                                        if (postdis.orgType == "公司") {
                                            postdis.disabled = true;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });
        },
        // 使用部门树按钮
        treesection() {
            if (this.yesno == "") {
                this.$notify({
                    title: "提示",
                    message: "请选择使用工厂",
                    type: "warning",
                    duration: 3000
                });
                return;
            } else {
                this.treeDepartment = true;
                this.sectionst();
            }
        },
        hlsoClick(data, checked, node) {
            this.i++;
            if (this.i % 1 == 0) {
                if (checked == true) {
                    this.checkedIdst = data.id;
                    this.$refs.treefrom.setCheckedNodes([data]);
                    this.listQueryst.divisionCode = data.orgCode;
                    this.postyly = data.orgFullName;
                }
            }
        },
        handleNodeClickst(data) {
            this.checkedIdst = data.id;
        },
        // 查看
        handleLook(row) {
            this.fastener = false;
            this.xzbc = false;
            this.exchange = true; // 流转记录隐藏
            this.xztj = false;
            this.bjbc = false;
            this.bjtj = false;
            this.fromLoading = false; // 加载动画
            this.documentW = row.documentWordCode; // 单据编码
            this.activeName = "first"; // 选项卡默认选项
            this.processId = row.processInstanceId;
            this.temp = Object.assign({}, row);
            this.dialogStatus = "detail";
            this.chooseShow = true;
            this.dialogFormVisible = true;
            if (row.acceptanceType !== null) {
                this.temp.acceptanceType = row.acceptanceType.toString();
            }
            if (row.missPieceType !== null) {
                this.temp.missPieceType = row.missPieceType.toString();
            }
            this.deleadds = false;
            this.deleuplet = false;
            this.filshow = false; // 文件上传框显隐
            this.smalldast();
            this.smalldast1();
            this.circulationlist();
            this.$nextTick(() => {
                this.$refs["dataForm"].clearValidate();
            });
        },
        // 流转记录
        circulationlist() {
            const processInstanceId = this.processId;
            circuList(processInstanceId).then(response => {
                this.circulation = response.data.data;
            });
        },
        //  流程图
        fathClick(tab, event) {
            if (tab.label == "流程图") {
                if (this.processId == null) {
                    this.$notify({
                        title: "提示",
                        message: "流程还未开始，没有流程图",
                        type: "warning",
                        duration: 3000
                    });
                    this.chartData = "";
                    return;
                } else {
                    this.fromLoading = true; // 弹窗加载动画
                    flowsheet(this.processId).then(response => {
                        if (
                            response.data.code !== 803 &&
                            response.data.code !== 808
                        ) {
                            this.chartData = response.request.responseURL;
                        } else {
                            this.$notify({
                                title: "警告",
                                message: response.data.msg,
                                type: "warning",
                                duration: 2000
                            });
                            this.chartData = "";
                        }
                        setTimeout(() => {
                            this.fromLoading = false;
                        }, 1 * 500);
                    });
                }
            }
        },
        // 删除事件
        deleteBtn(row) {
            this.$confirm("是否确认删除?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$message({
                        type: "success",
                        message: "删除成功!"
                    });
                    const deleteid = row.id;
                    delById(deleteid).then(response => {
                        this.getList();
                        const index = this.tableData.indexOf(row);
                        this.tableData.splice(index, 1);
                    });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        },
        // 搜索
        handleFilter() {
            this.listQuery.pageNum = 1;
            this.getList();
        },
        handleSizeChange(val) {
            this.listQuery.pageSize = val;
            this.getList();
        },
        handleCurrentChange(val) {
            this.listQuery.pageNum = val;
            this.getList();
        }
    }
};
</script>
<style>
.buttonplace {
    height: 36px;
    background: #409eff;
    color: #fff;
    border: 1px solid #fff;
    position: absolute;
    right: 0;
    top: 0;
    border-radius: 5px;
}
.buttonplacesy {
    height: 36px;
    background: #409eff;
    color: #fff;
    border: 1px solid #fff;
    position: absolute;
    right: -50px;
    top: 0px;

    border-radius: 5px;
}
.buonplce {
    height: 36px;
    background: #409eff;
    color: #fff;
    border: 1px solid #fff;
    position: absolute;
    right: -50px;
    top: 0px;
    border-radius: 5px;
}

.bnplce {
    height: 36px;
    background: #409eff;
    color: #fff;
    border: 1px solid #fff;
    position: absolute;
    right: -50px;
    top: 0px;
    border-radius: 5px;
}

.fiutr {
    float: left;
}
.seat {
    margin-left: 50px;
    padding-right: 15px;
}
.sepost {
    width: 150px;
    margin-left: 50px;
    padding-right: 15px;
}
.inline-input {
    width: 200px;
}
.futiop {
    text-decoration: underline;
}
.formSearch {
    width: 100%;
    background: #fafafa;
    border: 1px solid #e9e9e9;
    border-radius: 3px;
    padding: 18px 10px 0;
    margin-bottom: 15px;
}
.buttonlist {
    position: absolute;
    right: 20px;
    top: 80px;
}
#buttstyps {
    width: 42px;
    height: 36px;
    cursor: pointer;
    text-align: center;
}
.equip-title {
    margin-left: -100px;
    text-align: center;
    display: block;
    font-size: 20px;
    font-weight: 600;
}
.el-tree-node__content:hover {
    background-color: #6dc6fa;
    border-radius: 3%;
}
.el-table thead tr .el-checkbox__input {
    display: none;
}
#pic {
    width: 100%;
}
</style>
