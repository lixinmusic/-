<template>
    <div class="app-container">
        <!--外部容器 -->
        <el-container>
            <!-- 顶部搜索 -->
            <div class="filter-container">
                <div class="formSearch">
                    <el-form :inline="true">

                        <el-form-item label="设备名称">
                            <el-input v-model="listQuery.equipmentName" placeholder="请输入设备名称" clearable></el-input>
                        </el-form-item>

                        <el-form-item label="固定资产编号">
                            <el-input class="minier-input" v-model="listQuery.fixedAssetCode" placeholder="请输入固定资产编号" clearable></el-input>
                        </el-form-item>

                        <el-form-item label="验收日期">
                            <div class="block">
                                <el-date-picker style="width:250px" v-model="value13" type="daterange" unlink-panels start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" clearable @change="searchsty()">
                                </el-date-picker>
                            </div>
                        </el-form-item>

                        <el-form-item label="验收情况" prop="acceptanceType">
                            <el-radio v-model="listQuery.acceptanceType" label="1">验收通过</el-radio>
                            <el-radio v-model="listQuery.acceptanceType" label="0">验收不通过</el-radio>

                        </el-form-item>

                        <el-form-item>
                            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
                        </el-form-item>

                    </el-form>
                </div>

            </div>
            <!-- 内容容器 -->

            <!-- 主要区域容器 -->
            <el-main style="padding:20px 0px">

                <el-table :data="listyst" v-loading="listLoading" border fit highlight-current-row style="width: 100%;min-height:auto;margin-top:0px" height="500" :header-cell-style="{background:'oldlace'}">

                    <el-table-column prop="documentWordCode" align="center" label="单据编码" min-width="100">
                        <template slot-scope="scope">
                            <span class="link-type futiop" @click='checkDetails(scope.row)'>{{scope.row.documentWordCode}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="supplier" align="center" label="供应商" min-width="80">
                    </el-table-column>
                    <el-table-column prop="equipmentName" align="center" label="设备名称" min-width="80">
                    </el-table-column>
                    <el-table-column prop="serialNumber" align="center" label="出厂编号" min-width="80">
                    </el-table-column>
                    <el-table-column prop="typeSpecification" align="center" label="型号规格" min-width="80">
                    </el-table-column>
                    <el-table-column prop="fixedAssetCode" align="center" label="固定资产编号" min-width="80">
                    </el-table-column>
                    <el-table-column prop="acceptanceDate" align="center" label="验收日期" min-width="80">
                    </el-table-column>
                    <el-table-column prop="missPieceTypeName" align="center" label="是否缺件" min-width="80">
                    </el-table-column>
                    <el-table-column prop="acceptanceTypeName" align="center" label="验收情况" min-width="80">
                    </el-table-column>
                    <el-table-column prop="auditingTypeName" align="center" label="审核状态" min-width="80">
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="140px">
                        <template slot-scope="scope">
                            <el-button title="转办" type="success" icon="el-icon-share" size="mini" @click="changeHandle(scope.row)"></el-button>
                        </template>
                    </el-table-column>

                </el-table>
            </el-main>
            <!-- 底栏容器 -->
            <el-footer>
                <!-- 分页 -->
                <div class="pagination-container">
                    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[5,10,15,20]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                    </el-pagination>
                </div>
            </el-footer>

            <!-- 新增和编辑是同一个弹出框 -->
            <el-dialog title="查看详情" :close-on-click-modal="false" top="8vh" v-dialogDrag width="700px" :visible.sync="dialogFormVisible">
                <!-- 选项卡 -->
                <el-tabs v-model="activeName" v-loading="fromLoading" @tab-click="fathClick">
                    <!-- @tab-click="handleClick" -->
                    <el-tab-pane label="表单信息" name="first">
                        <!-- 选项卡表格 -->
                        <el-form :rules="rules" ref="dataForm" :model="temp" label-width="110px">
                            <el-form-item>
                                <span class="equip-title">开箱验收单</span>
                            </el-form-item>
                            <el-row>
                                <el-col :span="8">
                                    <el-form-item label="单据编码" prop="documentWordCode">
                                        <el-input style="width:190px" v-model="temp.documentWordCode" disabled oninput="this.value=this.value.replace(/[^0-9A-z\.]/g,'')" class="enter medium-input" placeholder="空"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="16">
                                    <el-form-item label="供应商" prop="supplier" style="margin-left:100px;">
                                        <el-input v-model="temp.supplier" :disabled='siteCodeState?true:false' onkeyup="this.value=this.value.replace(/[^\u4e00-\u9fa5]/g,'')" style="width:190px" class="enter medium-input" placeholder="请引用新增设备一览表"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>

                            <el-row>
                                <el-col :span="8">
                                    <el-form-item label="设备名称" prop="equipmentName">
                                        <el-input v-model="temp.equipmentName" :disabled='siteCodeState?true:false' style="width:190px" class="enter medium-input" placeholder="请引用新增设备一览表"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="16">
                                    <el-form-item label="出厂编号" prop="serialNumber" style="margin-left:100px;">
                                        <el-input v-model="temp.serialNumber" :disabled='!chooseShow' style="width:190px" class="enter medium-input" placeholder="请引用新增设备一览表"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>

                            <el-row>
                                <el-col :span="8">
                                    <el-form-item label="型号规格" prop="typeSpecification">
                                        <el-input v-model="temp.typeSpecification" :disabled='siteCodeState?true:false' style="width:190px" class="enter medium-input" placeholder="请引用新增设备一览表"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="16">
                                    <el-form-item label="固定资产编号" prop="fixedAssetCode" style="margin-left:100px;">
                                        <el-input v-model="temp.fixedAssetCode" :disabled='siteCodeState?true:false' style="width:190px" class="enter medium-input" placeholder="请引用新增设备一览表"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>

                            <el-row>
                                <el-col :span="8">
                                    <el-form-item label="验收日期" prop="acceptanceDate">
                                        <div class="block">
                                            <el-date-picker style="width:190px" v-model="temp.acceptanceDate" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd"  :disabled='!chooseShow'>
                                            </el-date-picker>
                                        </div>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="16">
                                    <el-form-item label="送货单号" prop="deliveryCode" style="margin-left:100px;">
                                        <el-input v-model="temp.deliveryCode" :disabled='!chooseShow' style="width:190px" class="enter medium-input" placeholder="请引用新增设备一览表"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>

                            <el-form-item label="送货单内容" prop="deliveryCodeContent">
                                <el-input type="textarea" :disabled='!chooseShow' style="width:510px" maxlength="200" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入送货单内容..." v-model="temp.deliveryCodeContent">
                                </el-input>
                            </el-form-item>
                            <el-form-item label="实际验收情况" prop="actualAcceptSituation">
                                <el-input type="textarea" :disabled='!chooseShow' style="width:510px" maxlength="200" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入实际验收情况..." v-model="temp.actualAcceptSituation">
                                </el-input>
                            </el-form-item>

                            <el-row>
                                <el-col :span="10">
                                    <el-form-item label="是否缺件" prop="missPieceType">
                                        <el-radio v-model="temp.missPieceType" :disabled='!chooseShow' label="1">是</el-radio>
                                        <el-radio v-model="temp.missPieceType" :disabled='!chooseShow' label="0">否</el-radio>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="14">
                                    <el-form-item label="验收情况" prop="acceptanceType">
                                        <el-radio v-model="temp.acceptanceType" :disabled='!chooseShow' label="1">验收通过</el-radio>
                                        <el-radio v-model="temp.acceptanceType" :disabled='!chooseShow' label="0">验收不通过</el-radio>

                                    </el-form-item>
                                </el-col>
                            </el-row>

                            <el-row>
                                <!-- <span style="color:red;position:absolute;bottom:30px;left:0px">*</span> -->
                                <el-form-item label="开箱验收单附件" class="sepost" style="margin-left:10px">
                                    <!--  <el-upload
                class="upload-demo"
                action=""
                style="margin-left:20px"
                :on-change="handsty"
                :file-list="fileList3"
                :before-upload="beforeAvatarUpload5">
                <el-button class="line_btn w_h">
                <div>
                <span class="apply_img1"></span>
                 <el-button size="small" type="primary">点击上传</el-button>
                <span class="apply_crile"></span>
                </div>
                </el-button>
                </el-upload> -->
                                    <input class="uploadInput" id="uploadImg" ref="uploadImg" type="file" @change="noticeUpload">

                                </el-form-item>
                            </el-row>
                            <!-- 小表格 -->
                            <el-table :data="smallslist" v-loading="listLoading" border fit highlight-current-row style="width: 100%;min-height:auto;margin-top:8px" :header-cell-style="{background:'oldlace'}" doLayout>

                                <el-table-column prop="fileName" align="center" label="文件名" min-width="221">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.fileName}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="node" align="center" label="上传节点" min-width="219">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.node}}</span>
                                    </template>
                                </el-table-column>

                                <el-table-column align="center" label="操作" min-width="219" class-name="small-padding fixed-width">
                                    <template slot-scope="scope">
                                        <el-button title="下载" type="primary" @click="downloadsty(scope.row)" size="small" icon="el-icon-download"></el-button>
                                        <el-button title="删除" type="danger" @click="smalldelest(scope.row)" icon="el-icon-delete" size="small" :disabled="scope.row.deleteDisabled?true:false"></el-button>

                                    </template>
                                </el-table-column>

                            </el-table>

                        </el-form>
                    </el-tab-pane>

                    <!-- 选项卡流转记录 -->
                    <el-tab-pane label="流转记录" name="second">
                        <!-- 流转记录表格 -->
                        <el-table :data="circulation" v-loading="listLoading" border fit highlight-current-row style="width: 100%;min-height:auto;margin-top:8px" :header-cell-style="{background:'oldlace'}">

                            <el-table-column align="center" label="序号" min-width="50" type="index"></el-table-column>

                            <el-table-column prop="taskName" align="center" label="步骤名" min-width="83">

                                <template slot-scope="scope">
                                    <span>{{scope.row.taskName}}</span>
                                </template>
                            </el-table-column>

                            <el-table-column prop="userName" align="center" label="操作人" min-width="80">

                                <template slot-scope="scope">
                                    <span>{{scope.row.userName}}</span>
                                </template>
                            </el-table-column>

                            <el-table-column prop="orgName" align="center" label="所在部门" min-width="80">

                                <template slot-scope="scope">
                                    <span>{{scope.row.orgName}}</span>
                                </template>
                            </el-table-column>

                            <el-table-column prop="stationName" align="center" label="岗位" min-width="80">

                                <template slot-scope="scope">
                                    <span>{{scope.row.stationName}}</span>
                                </template>
                            </el-table-column>

                            <el-table-column prop="state" align="center" label="状态" min-width="80">

                                <template slot-scope="scope">
                                    <span>{{scope.row.state}}</span>
                                </template>
                            </el-table-column>

                            <el-table-column prop="opinion" align="center" label="意见" min-width="80">

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
                    <el-tab-pane label="流程图" name="three">
                        <div id="imgcontainer">
                            <img id="pic" :src="chartData" />
                        </div>
                    </el-tab-pane>

                </el-tabs>

                <el-form class="buttonlist">
                    <el-form-item>
                        <el-button @click="dialogFormVisible = false" type="primary" size="mini">返回</el-button>
                        <el-button type="primary" @click="saveData" size="mini" v-show="consent">同意</el-button>
                        <el-button type="primary" @click="updateSaveData" size="mini" v-show="retrnsty">退回</el-button>
                        <el-button type="primary" @click="submitData" size="mini" v-show="submitlist">提交</el-button>

                    </el-form-item>
                </el-form>
            </el-dialog>

            <!-- 同意和退回弹窗  consent retrnsty submitlist  submitData-->

            <el-dialog :close-on-click-modal="false" :title="textMap[dialogStatus]" top="8vh" width="700px" :visible.sync="postylitys">
                <el-form :rules="rules" ref="dataFormsty" :model="noeli" label-width="110px">
                    <el-form-item label="意见" prop="opetion">
                        <el-input type="textarea" style="width:510px" maxlength="128" :autosize="{ minRows: 2, maxRows: 4}" placeholder="" v-model="noeli.opetion">
                        </el-input>
                    </el-form-item>

                </el-form>

                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="poslist1" v-show="affirmshow1">同意</el-button>
                    <el-button type="primary" @click="poslist2" v-show="affirmshow2">退回</el-button>
                    <el-button @click="postylitys = false" type="primary">返回</el-button>
                </div>

            </el-dialog>
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
import {
    fetchList,
    smallAblist,
    samllDelete,
    uploadlist,
    circuList,
    updateAuditing,
    insertFile,
    getCurrentUser,
    getNodeTask,
    newlYupdate
} from "@/api/equipMent/openboxTodo";
import { flowsheet } from "@/api/equipMent/acceptanceSheet";
import waves from "@/directive/waves"; // 水波纹指
import {
    fetchChooseTree,
    choosePersonList,
    transferList
} from "@/api/common/common";
export default {
    name: "openboxTodo",
    directives: {
        waves
    },
    data() {
        return {
            // 选择人员
            defaultProps1: {
                children: "children",
                label: "orgFullName"
            },
            orgListData: [],
            listQuery2: {
                pageNum: 1,
                pageSize: 1000,
                perName: undefined,
                workNumber: undefined
            },
            personOrgData: [],
            treeLoading: false,
            innerVisiblePerson: false,
            chooseShow:false,
            value13: [],
            smallslist: [], //这个是新增里的小表格
            documentWordCode: "", //单据编码赋值
            userId: "", //用户id
            nodeName: "", //节点的名字
            nodetaskId: "", //接口参数
            listyst: [],
            lookList: [],
            circulation: [], //流转记录
            consent: false,
            retrnsty: false,
            submitlist: false,

            porisgid: "",
            grite: "",
            total: null,
            listQuery: {
                pageNum: 1,
                pageSize: 10
            },
            activeName: "first", //选项卡默认选项
            // 编辑和新增的字段设置
            temp: {},
            noeli: {
                opetion: "" //同意里的意见字段
            },
            chartData: "", //流程图
            // 弹框显示
            dialogFormVisible: false,
            postylitys: false,
            affirmshow1: false,
            affirmshow2: false,
            popTitle: "",
            dialogStatus: "",
            textMap: {
                update: "同意办理",
                create: "退回办理"
            },

            isAdd: false, // 新增or编辑
            siteDetail: false, // 新增、编辑弹窗
            editLoading: false, // 提交按钮加载动画
            showStatus: true, // 表单项显示状态
            formSearch_send: false, // 查询条件点选
            listLoading: true, // 远程搜索加载动画
            fromLoading: true, //弹出框加载动画

            dialogPvVisible: false,
            dialoglookVisible: false, // 弹窗属性
            siteCodeState: "", // 岗位编码禁用状态
            // 弹框内输入框不填显示的提示信息

            rules: {
                acceptanceDate: [
                    { required: true, message: "请选择...", trigger: "change" }
                ],
                deliveryCodeContent: [
                    { required: true, message: "请填写...", trigger: "change" }
                ],
                actualAcceptSituation: [
                    { required: true, message: "请填写...", trigger: "change" }
                ],
                missPieceType: [
                    { required: true, message: "请选择...", trigger: "change" }
                ],
                acceptanceType: [
                    { required: true, message: "请选择...", trigger: "change" }
                ]
            },
            downloadLoading: false
        };
    },
    filters: {
        statusFilter(status) {
            const statusMap = {
                published: "success",
                draft: "info",
                deleted: "danger"
            };
            return statusMap[status];
        }
    },
    created() {
        this.getAA();
    },
    methods: {
        // 表格的接口
        getAA() {
            this.listLoading = true;
            fetchList(this.listQuery).then(response => {
                if (response.data.code == 200) {
                    this.listyst = response.data.data.list;
                    this.total = response.data.data.total;
                    //   this.listLoading = false
                    setTimeout(() => {
                        this.listLoading = false;
                    }, 1 * 100);
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
        // 转办
        changeHandle(row) {
            this.changeProcessId = row.processInstanceId;
            this.choosePerson();
        },
        choosePerson() {
            this.listQuery2 = {
                pageNum: 1,
                pageSize: 1000,
                perName: undefined,
                workNumber: undefined
            };
            this.orgListData = [];
            this.innerVisiblePerson = true;
            this.treeLoading = true;
            // 查询组织树结构
            fetchChooseTree().then(response => {
                this.personOrgData = [];
                this.personOrgData.push(response.data.data);
                setTimeout(() => {
                    this.treeLoading = false;
                }, 1 * 1000);
            });
        },
        // 组织树点击事件加载表格数据
        handleNodeClick(data) {
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
        handlePerson() {
            this.listLoading = true;
            choosePersonList(this.listQuery2).then(response => {
                this.orgListData = response.data.data.list;
                setTimeout(() => {
                    this.listLoading = false;
                }, 1 * 1000);
            });
        },
        // 转办人员提交
        chooseReplace(row) {
            const finds = {
                processInstanceId: this.changeProcessId,
                workNumber: row.workNumber
            };
            transferList(finds).then(response => {
                if (response.data.code === 200) {
                    this.getAA();
                    this.innerVisiblePerson = false;
                    this.$message({
                        title: "成功",
                        type: "success",
                        message: "请求成功!",
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
        },
        renderContent(h, { node, data, store }) {
            return (
                <span>
                <span title={node.label}>{node.label}</span>
                </span>)
        },

        // 日期  搜索
        searchsty() {
            // 申请闲置时间  搜索
            if (this.value13 == null) {
                this.listQuery.acceptanceDateStart = "";
                this.listQuery.acceptanceDateEnd = "";
            } else {
                this.listQuery.acceptanceDateStart = this.value13[0]; // 开始时间
                this.listQuery.acceptanceDateEnd = this.value13[1];
            }
        },
        // 小表格接口
        getlistone() {
            const samllblist = {
                moduleType: 3,
                attachmentCode: "KXYSDFJ",
                documentWordCode: this.documentWordCode
            };
            smallAblist(samllblist).then(response => {
                this.smallslist = response.data.data;
                for (var i = 0; i < this.smallslist.length; i++) {
                    if (this.smallslist[i].userId == this.userId) {
                        this.smallslist[i].deleteDisabled = false;
                    } else {
                        this.smallslist[i].deleteDisabled = true;
                    }
                }
            });
        },
        // 查看
        checkDetails(row) {
            this.dialogFormVisible = true;
            this.porisgid = row.processInstanceId;
            this.documentWordCode = row.documentWordCode; //单据编码的赋值
            this.getlistone();
            this.nodetaskId = row.taskId;
            this.getnodeNames(); //获取node节点名字接口
            this.temp = Object.assign({}, row);
            this.dialoglookVisible = true;
            this.siteCodeState = true;
            this.fromLoading = false; //弹窗加载动画
            this.temp.acceptanceType = row.acceptanceType.toString();
            this.temp.missPieceType = row.missPieceType.toString();
            
            // 判断taskName是否是调整申请显示的按钮不一样
            this.circulationlist();
            if (row.taskName == "调整申请") {
                this.consent = false; //同意按钮显隐
                this.retrnsty = false; //退回按钮显隐
                this.submitlist = true; //提交按钮显隐
                this.chooseShow = true
            } else {
                this.consent = true;
                this.retrnsty = true;
                this.submitlist = false;
                this.chooseShow = false
            }
            this.getUser();
            this.$nextTick(() => {
                this.$refs["dataForm"].clearValidate();
            });
        },
        // 流转记录
        circulationlist() {
            let processInstanceId = this.porisgid;
            circuList(processInstanceId).then(response => {
                this.circulation = response.data.data;
            });
        },

        //  流程图
        fathClick(tab, event) {
            if (tab.label == "流程图") {
                if (this.porisgid == null) {
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
                    flowsheet(this.porisgid).then(response => {
                        if (
                            response.data.code !== 803 &&
                            response.data.code !== 808
                        ) {
                            this.chartData = response.request.responseURL;
                            document.getElementById("pic").src = this.chartData;
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

        // 小表格删除按钮
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

        //    同意按钮
        saveData() {
            // if (this.smallslist == "") {
            //     this.$notify({
            //         title: "提示",
            //         message: "请上传附件",
            //         type: "warning",
            //         duration: 3000
            //     });
            //     // this.fromLoading = false //加载动画
            //     return;
            // } 
            // else {
                this.dialogStatus = "update";
                this.postylitys = true;
                this.affirmshow1 = true;
                this.affirmshow2 = false;
                this.$nextTick(() => {
                    this.$refs["dataFormsty"].clearValidate();
                });
            // }
        },
        // 确认
        poslist1() {
            this.$refs["dataForm"].validate(valid => {
                if (valid) {
                    const noeliData = Object.assign({}, this.noeli);
                    noeliData.id = this.temp.id;
                    noeliData.auditingType = 3;
                    noeliData.taskId = this.temp.taskId;
                    updateAuditing(noeliData).then(response => {
                        if (response.data.code == 200) {
                            this.postylitys = false;
                            this.dialogFormVisible = false;
                            this.getAA();

                            this.$message({
                                title: "成功",
                                message: "同意成功",
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
                    });
                }
            });
        },

        //   退回按钮
        updateSaveData() {
            // if (this.smallslist == "") {
            //     this.$notify({
            //         title: "提示",
            //         message: "请上传附件",
            //         type: "warning",
            //         duration: 3000
            //     });
            //     // this.fromLoading = false //加载动画
            //     return;
            // } 
            // else {
                this.dialogStatus = "create";
                this.postylitys = true;
                this.affirmshow1 = false;
                this.affirmshow2 = true;
                this.$nextTick(() => {
                    this.$refs["dataFormsty"].clearValidate();
                });
            // }
        },
        // 确认
        poslist2() {
            this.$refs["dataForm"].validate(valid => {
                if (valid) {
                    const noeliData = Object.assign({}, this.noeli);
                    noeliData.id = this.temp.id;
                    noeliData.auditingType = 4;
                    noeliData.taskId = this.temp.taskId;
                    updateAuditing(noeliData).then(response => {
                        if (response.data.code == 200) {
                            this.postylitys = false;
                            this.dialogFormVisible = false;
                            this.getAA();

                            this.$message({
                                title: "成功",
                                message: "退回成功",
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
                    });
                }
            });
        },
        // 获取当前用户信息
        getUser() {
            getCurrentUser().then(response => {
                this.userId = response.data.data.id;
            });
        },
        

        // 获取node节点名字 this.nodetaskId
        getnodeNames() {
            getNodeTask(this.nodetaskId).then(response => {
                if (response.data.code == 200) {
                    this.nodeName = response.data.data.name;
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
        //  退回的时候就要能编辑而且按钮变为提交按钮
        submitData() {
            this.$refs["dataForm"].validate(valid => {
                if (valid) {
                    const tempData = Object.assign({}, this.temp);
                        if(this.nodeName=='调整申请' && this.smallslist.length==0){
                            this.$notify({
                                title: "提示",
                                message: "请上传开箱验收单附件",
                                type: "warning",
                                duration: 3000
                            })
                            return
                        }
                        newlYupdate(tempData).then(response => {
                            const msg = response.data.msg;
                            if (response.data.code == 200) {
                                for (const v of this.listyst) {
                                    if (v.id === this.temp.id) {
                                        const index = this.listyst.indexOf(v);
                                        this.listyst.splice(
                                            index,
                                            1,
                                            this.temp
                                        );
                                        this.getAA();
                                        break;
                                    }
                                }
                                this.dialogFormVisible = false;
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
                        });
                    // }
                }
            });
        },

        // 上传的按钮
        noticeUpload(e) {
            let file = e.target.files[0];
            const fileData1 = {
                attachmentCode: "KXYSDFJ",
                moduleType: "3",
                fileName: undefined,
                filePath: undefined, // 文件URL
                node: this.nodeName,
                userId: this.userId,
                code: this.documentWordCode
            };

            if (file != null) {
                this.fromLoading = true;
                let param = new FormData(); //创建form对象
                param.append("file", file, file.name); //通过append向form对象添加数据
                this.filenamesty = file.name;
                fileData1.fileName = file.name;
                uploadlist(param).then(resp => {
                    //调用上传接口
                    if (resp.data.code == 200) {
                        fileData1.filePath = resp.data.data.remoteFilename; //文件地址
                        // 调用新增文件（陈状）
                        insertFile(fileData1).then(response => {
                            if (response.data.code == 200) {
                                this.$message({
                                    title: "成功",
                                    message: "上传成功",
                                    type: "success",
                                    duration: 2000
                                });
                                this.getlistone(); // 获取文件
                                const test = document.getElementById(
                                    "uploadImg"
                                );
                                test.value = "";
                                this.fromLoading = false;
                            } else {
                                this.$notify({
                                    title: "警告",
                                    message: response.data.msg,
                                    type: "warning",
                                    duration: 2000
                                });
                            }
                        });
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
        // 下载按钮
        downloadsty(row) {
            const att = row.fileName;
            window.location.href = row.filePath + "?attname=" + att;

            this.$message({
                title: "成功",
                message: "下载成功",
                type: "success",
                duration: 2000
            });
        },

        // 搜索
        handleFilter() {
            this.listQuery.pageNum = 1;
            this.getAA();
        },
        handleSizeChange(val) {
            this.listQuery.pageSize = val;
            this.getAA();
        },
        handleCurrentChange(val) {
            this.listQuery.pageNum = val;
            this.getAA();
        },

        formatJson(filterVal, jsonData) {
            return jsonData.map(v =>
                filterVal.map(j => {
                    if (j === "timestamp") {
                        return parseTime(v[j]);
                    } else {
                        return v[j];
                    }
                })
            );
        }
    }
};
</script>
<style scoped>
.fiutr {
    float: left;
}
.seat {
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
.equip-title {
    margin-left: -100px;
    text-align: center;
    display: block;
    font-size: 20px;
    font-weight: 600;
}
#pic {
    width: 100%;
}
</style>
