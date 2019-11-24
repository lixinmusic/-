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
                    <el-table-column align="center" label="操作" width="140px">
                        <template slot-scope="scope">
                            <el-button title="转办" type="success" icon="el-icon-share" size="mini" @click="changeHandle(scope.row)"></el-button>
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
            <!-- 查看采购申请书 -->
            <el-dialog title="查看" :close-on-click-modal="false" :visible.sync="dialogFormVisible" v-dialogDrag :modal-append-to-body="false" width="60%" v-loading="listLoading">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="表单信息" name="first">
                        <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="110px">
                            <el-form-item>
                                <span class="equip-title">夹具采购申请单</span>
                            </el-form-item>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="单据编号" prop="documentWordCode">
                                        <el-input v-model="temp.documentWordCode" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="11">
                                    <el-form-item label="夹具名称" prop="equipmentName">
                                        <el-input v-model="temp.equipmentName" :disabled="tzsqTask"></el-input>
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
                                    <el-button type="primary" @click="changeCompany" :disabled="tzsqTask">选择</el-button>
                                </el-col>
                                <el-col :span="9" style="padding-right:0px;">
                                    <el-form-item label="使用工厂" prop="factoryName">
                                        <el-input v-model="temp.factoryName" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2" style="padding:0px;">
                                    <el-button type="primary" @click="changeFactory" :disabled="tzsqTask">选择</el-button>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="10" style="padding-right:0px;">
                                    <el-form-item label="使用部门" prop="dctualOrgName">
                                        <el-input v-model="temp.dctualOrgName" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2" style="padding-left:0px;">
                                    <el-button type="primary" @click="changeDivision" :disabled="tzsqTask">选择</el-button>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="台数" prop="purchaseQuantity">
                                        <el-input type="text" v-model="temp.purchaseQuantity" maxlength="5" oninput="value=value.replace(/[^\d]/g,'')" :disabled="tzsqTask"></el-input>
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
                                        <el-date-picker style="width:100%" v-model="temp.requirementDeliveryTime" type="date" placeholder="选择时间" format="yyyy-MM-dd" value-format="yyyy-MM-dd"  :picker-options="pickerOptions0" :disabled="tzsqTask">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-form-item label="申请原因" prop="applicationReason">
                                <el-input v-model="temp.applicationReason" maxlength="200" :disabled="tzsqTask"></el-input>
                            </el-form-item>
                            <el-form-item label="具体要求" prop="detailRequirement">
                                <el-input v-model="temp.detailRequirement" maxlength="200" :disabled="tzsqTask"></el-input>
                            </el-form-item>
                            <el-row>
                                <el-col :span="1" style="width:4px;color:red;padding:8px 8px 8px 1px" v-if="!jgbTask">
                                    <span>*</span>
                                </el-col>
                                <el-col :span="11">
                                    <el-form-item label="夹具采购建议" prop="equipBuySuggest">
                                        <!-- 资产部审核节点 -->
                                        <el-radio v-model="temp.equipBuySuggest" label="内部制造" :disabled="jgbTask">内部制造</el-radio>
                                        <el-radio v-model="temp.equipBuySuggest" label="外部制造" :disabled="jgbTask">外部制造</el-radio>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="1" style="width:4px;color:red;padding:8px 8px 8px 1px" v-if="!jgbTask">
                                    <span>*</span>
                                </el-col>
                                <el-col :span="11">
                                    <el-form-item label="金额" prop="budget">
                                        <el-input type="text" v-model="temp.budget" maxlength="11" :disabled="jgbTask"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="1" style="padding:0px;font-size:20px;font-weight:800;">
                                    <span>元</span>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="1" v-if="chairman" style="width:1px;color:red;padding:8px">
                                    <span>*</span>
                                </el-col>
                                <el-col :span="9">
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
                                        <el-button title="删除" type="danger" icon="el-icon-delete" size="mini" @click="updatefileDelete(scope.row)" :disabled="scope.row.deleteDisabled?true:false"></el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <el-row>
                                <el-col :span="1" v-if="!dszShow" style="width:1px;color:red;padding:8px">
                                    <span>*</span>
                                </el-col>
                                <el-col :span="9">
                                    <el-form-item label="审核附件" prop="xmfaFileData">
                                        <input id="uploadImg1" type="file" @change="fileUpload1" v-if="!dszShow">
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
                                        <el-button title="删除" type="danger" icon="el-icon-delete" size="mini" @click="xmfaFileDelete(scope.row)" :disabled="scope.row.deleteDisabled?true:false"></el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-form>
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
            <!-- 查看台账（闲置） -->
            <el-dialog title="查看闲置" :visible.sync="centerDialogVisible" width="80%" :close-on-click-modal="false" v-dialogDrag>
                <el-form :inline="true">
                    <el-form-item label="夹具名称">
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
                <el-table :data="infoList" height="500" v-loading="listLoading" ref="multipleTable" border fit highlight-current-row>
                    <el-table-column align="center" label="序号" min-width="80" type="index"></el-table-column>
                    <el-table-column prop="equipmentName" align="center" label="夹具名称" min-width="120">
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
                    <el-pagination background @size-change="handleSizeChange1" @current-change="handleCurrentChange1" :current-page="listQuery1.pageNum" :page-sizes="[5,10,15, 20]" :page-size="listQuery1.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total1">
                    </el-pagination>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="centerDialogVisible = false">取消</el-button>
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
                        <el-table height='500' :data="orgListData" v-loading="listLoading" border fit highlight-current-row style="width: 100%;min-height:300px;margin-top:8px">
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
import { fetchNeedList, fetchDetail, agreeApply, fetchPrint, reCommit, fetchInfoList } from '@/api/toolFixtureManagement/clampPurchaseRequestForm'
import { fetchComTree, fetchComByCode, fetchOrgTree, fetchChooseTree, choosePersonList,
  uploadlist, fileList, deleteFileById, insertFile, recordList, getCurrentUser, processChart, endProcess, getCurrentTask, transferList } from '@/api/common/common'
import { validateNumber1, validateNumber2 } from '@/utils/validate'
import { baseUrl } from '@/api/common/fileBaseUrl'
export default {
  name: 'clampPurchaseRequestFormNeed',
  data() {
    const validateNumber = (rule, value, callback) => {
      if (!validateNumber1(value)) {
        callback(new Error('请输入正确格式的台数'))
      } else {
        callback()
      }
    }
    const validateNumberJE = (rule, value, callback) => {
      if (value != undefined || value != null) {
        if (!validateNumber2(value)) {
          callback(new Error('请输入正确格式的金额'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      ctime: null,
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
      // finance: true, // 资产部
      tzsqTask: true, // 调整申请&提交
      jgbTask: true, // 技改办
      xzShow: false, // 查看闲置
      chairman: false, // 技术资料 技术负责人节点上传
      // 公司（工厂）
      n: 0,
      companyVisible: false,
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
      dialogStatus1: '',
      textMap1: {
        company: '选择公司',
        factory: '选择工厂'
      },
      j: 0,
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
        documentWordCode: undefined,
        equipName: undefined,
        dctualOrgName: undefined
      },
      id: undefined,
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
      // 任务审批
      popData: {
        opinion: undefined,
        leaderPass: undefined,
        taskId: undefined, // 任务id
        equipBuySuggest: null,
        recordId: undefined, // 设备备案id
        budget: null
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
        detail: '查看',
        agree: '同意办理',
        unagree: '退回办理'
      },

      taskId: undefined,
      // 文件数据
      fileData: [], // 技术资料
      xmfaFileData: [], // 审核附件
      userId: undefined, // 用户id
      nodeKey: undefined, // 节点key
      nodeName: undefined, // 节点名称
      documentWordCode: undefined, // 单据编号
      processInstanceId: undefined, // 流程实例id
      // 流转记录
      recordShow: false,
      recordData: null,
      printLoading: false,
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
        </span>
      )
    },
    getList() {
      this.tableData = []
      this.listLoading = true
      if (this.listQuery.equipName == '') {
        this.listQuery = {
          pageNum: 1,
          pageSize: 10,
          documentWordCode: this.listQuery.documentWordCode,
          dctualOrgName: this.listQuery.dctualOrgName,
          auditingType: this.listQuery.auditingType
        }
      }
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
      this.infoList = []
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
    // 设置公司/工厂组织树状图单选
    handleChange1(data, checked, node) {
      this.n++
      if (this.n % 2 == 0) {
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
      this.n = 0
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
      this.temp.companyName = this.getCompanyName
      this.temp.companyCode = this.getCompanyCode
      this.temp.factoryName = undefined
      this.temp.factoryCode = undefined
      this.companyVisible = false
    },
    // 选择使用工厂
    changeFactory() {
      this.n = 0
      this.dialogStatus1 = 'factory'
      this.getCompanyCode = undefined
      this.getCompanyName = undefined
      this.companyData = []
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
            if (this.companyData[i].children != null) {
              for (
                var j = 0;
                j < this.companyData[i].children.length;
                j++
              ) {
                const child = this.companyData[i].children[j]
                if (child.orgType == '部门') {
                  child.disabled = true
                }
                if (child.children !== null) {
                  for (
                    var p = 0;
                    p < child.children.length;
                    p++
                  ) {
                    const child1 = child.children[p]
                    if (child1.orgType == '部门') {
                      child1.disabled = true
                    }
                    if (child1.children != null) {
                      for (
                        var o = 0;
                        o < child1.children.length;
                        o++
                      ) {
                        const child2 =
                                                    child1.children[o]
                        if (child2.orgType == '部门') {
                          child2.disabled = true
                        }
                        if (child2.children != null) {
                          for (
                            var q = 0;
                            q <
                                                        child2.children.length;
                            q++
                          ) {
                            const child3 =
                                                            child2.children[q]
                            if (
                              child3.orgType ==
                                                            '部门'
                            ) {
                              child3.disabled = true
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
                                                                      ]
                                if (
                                  child4.orgType ==
                                                                    '部门'
                                ) {
                                  child4.disabled = true
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
                                                                              ]
                                    if (
                                      child5.orgType ==
                                                                            '部门'
                                    ) {
                                      child5.disabled = true
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
      })
      this.companyVisible = true
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
            if (this.orgData[i].children != null) {
              for (
                var j = 0;
                j < this.orgData[i].children.length;
                j++
              ) {
                const child = this.orgData[i].children[j]
                if (child.orgType == '公司') {
                  child.disabled = true
                }
                if (child.children != null) {
                  for (
                    var p = 0;
                    p < child.children.length;
                    p++
                  ) {
                    const child1 = child.children[p]
                    if (child1.orgType == '公司') {
                      child1.disabled = true
                    }
                    if (child1.children != null) {
                      for (
                        var o = 0;
                        o < child1.children.length;
                        o++
                      ) {
                        const child2 =
                                                    child1.children[o]
                        if (child2.orgType == '公司') {
                          child2.disabled = true
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
    // 点击选择部门确认
    handleClick2() {
      // 获取部门被选择的节点
      this.treeData = this.$refs.tree.getCheckedNodes()
      this.getOrgCode = this.treeData[0].orgCode
      this.getOrgName = this.treeData[0].orgFullName
      this.temp.dctualOrgName = this.getOrgName
      this.temp.dctualOrgCode = this.getOrgCode
      this.divisionVisible = false
    },
    // 根据编号查看
    handleDetail(row) {
      this.ctime = row.ctime
      this.listLoading = true
      this.activeName = 'first'
      this.dialogStatus = 'detail'
      this.dszShow = true
      // this.finance = true;
      this.chairman = false
      this.tzsqTask = true
      this.xzShow = false // 查看闲置
      this.id = row.id
      this.popData.taskId = row.taskId
      this.documentWordCode = row.documentWordCode // 单据编号
      this.processInstanceId = row.processInstanceId
      fetchDetail(this.id).then(response => {
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
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 500)
      })
      this.dialogFormVisible = true
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
          const tempData = Object.assign({}, this.temp)
          const taskId = this.popData.taskId
          this.listLoading = true
          reCommit(taskId, tempData).then(response => {
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
        }
      })
    },
    // 获取当前用户信息
    getUser() {
      getCurrentUser().then(response => {
        if (response.data.code == 200) {
          this.userId = response.data.data.id
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
          if (this.nodeKey == 'fixturepurchase_dsz') {
            // 判断是否是董事长审核节点
            this.dszShow = false
            // this.chairman = true;
          } else if (this.nodeKey == 'fixturepurchase_zcb') {
            // 判断是否是资产部审核节点
            // this.finance = false;
            this.xzShow = true
          } else if (this.nodeName == '调整申请') {
            // 判断是否为调整申请
            this.tzsqTask = false
          } else if (this.nodeKey == 'fixturepurchase_jsfzr') {
            // 判断是否为技术负责人
            this.chairman = true
          } else if (this.nodeKey == 'fixturepurchase_sbfz') {
            // 设备副总
            this.xzShow = true
          } else if (this.nodeKey == 'fixturepurchase_jtjgb') {
            // 集团技改办
            this.jgbTask = false
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
      // 技术资料
      const find = {
        moduleType: '26', // 模块类别
        attachmentCode: 'JJCGSQDJSZLFJ', // 附件编码
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
      // 审核附件
      const find1 = {
        moduleType: '26', // 模块类别
        attachmentCode: 'JJCGSQDQTFJ',
        documentWordCode: this.documentWordCode
      }
      fileList(find1).then(response => {
        this.xmfaFileData = response.data.data
        for (var i = 0; i < this.xmfaFileData.length; i++) {
          if (this.xmfaFileData[i].userId == this.userId) {
            this.xmfaFileData[i].deleteDisabled = false
          } else {
            this.xmfaFileData[i].deleteDisabled = true
          }
        }
      })
    },
    // 技术资料上传
    fileUpload(e) {
      const file = e.target.files[0]
      const fileData1 = {
        attachmentCode: 'JJCGSQDJSZLFJ',
        code: this.documentWordCode, // 单据编码
        moduleType: '26',
        fileName: undefined, // 文件名称
        filePath: undefined, // 文件URL
        node: this.nodeName, // 节点名称
        userId: this.userId
      }
      if (file != null) {
        this.listLoading = true
        const param = new FormData() // 创建form对象
        param.append('file', file, file.name) // 通过append向form对象添加数据
        fileData1.fileName = file.name
        uploadlist(param).then(resp => {
          // 调用上传接口
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
    // 编辑查看文件删除
    updatefileDelete(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
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
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 审核附件删除
    xmfaFileDelete(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
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
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 审核附件
    fileUpload1(e) {
      const file = e.target.files[0]
      const fileData1 = {
        attachmentCode: 'JJCGSQDQTFJ',
        code: this.documentWordCode,
        moduleType: '26',
        fileName: undefined,
        filePath: undefined, // 文件URL
        node: this.nodeName,
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
    // 董事长审核
    dszAgreeData() {
      this.popData.opinion = null
      this.popData.leaderPass = true
      this.popData.recordId = this.temp.id // 设备备案id
      if (this.nodeKey == 'fixturepurchase_dsz') {
        if (this.xmfaFileData.length == 0) {
          this.$notify({
            title: '警告',
            message: '请上传审核附件',
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
      this.popData.equipBuySuggest = this.temp.equipBuySuggest
      this.popData.budget = this.temp.budget
      this.popData.recordId = this.temp.id // 设备备案id
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.nodeKey == 'fixturepurchase_jtjgb') {
            // 技改办
            if (this.popData.budget == null || this.popData.budget == '') {
              this.$notify({
                title: '警告',
                message: '金额不能为空',
                type: 'warning',
                duration: 2000
              })
            } else if (this.popData.equipBuySuggest == null) {
              this.$notify({
                title: '警告',
                message: '请选择夹具采购建议',
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
        }
      })
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
        } else if (response.data.code == 706 && this.nodeKey == 'fixturepurchase_jsfzr') {
          this.$notify({
            title: '警告',
            message: '请上传技术资料',
            type: 'warning',
            duration: 3000
          })
          return
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
      this.popData.budget = this.temp.budget
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
      this.printDialogVisible = true
      this.printLoading = true
      const params = {
        purchaseId: this.temp.id,
        processInstanceId: this.processInstanceId
      }
      fetchPrint(params).then(response => {
        if (response.data.code == 200) {
          this.printList = response.data.data
        } else {
          this.$notify({
            title: '警告',
            message: response.data.msg,
            type: 'warning',
            duration: 2000
          })
        }
        setTimeout(() => {
          this.printLoading = false
        }, 1 * 500)
      })
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
            if (
              response.data.code != 803 &&
                            response.data.code != 808
            ) {
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
      const moduleTypeId = 32
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
      const url =
                baseUrl +
                'onlinePreview?url=' +
                encodeURIComponent(row.filePath)
      var winHeight = window.document.documentElement.clientHeight
      window.open(
        url,
        '_blank',
        'height=' +
                    winHeight +
                    ',top=10,left=10,toolbar=no,menubar=no,scrollbars=yes,resizable=yes'
      )
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

