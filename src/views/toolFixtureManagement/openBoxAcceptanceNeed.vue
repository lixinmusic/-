<template>
    <div class="app-container">
        <el-container>
            <div class="filter-container">
                <div class="formSearch">
                    <el-form :inline="true">
                        <el-form-item label="夹具名称">
                            <el-input v-model="listQuery.equipmentName" placeholder="请输入夹具名称" clearable></el-input>
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
            <!-- 主要区域容器 -->
            <el-main style="padding:20px 0px">
                <el-table :data="listyst" v-loading="listLoading" border fit highlight-current-row style="width: 100%;min-height:auto;margin-top:0px" height="500" :header-cell-style="{background:'oldlace'}">
                    <el-table-column prop="documentWordCode" align="center" label="单据编码" min-width="100">
                        <template slot-scope="scope">
                            <span class="link-type futiop" @click='checkDetails(scope.row)'>{{scope.row.documentWordCode}}</span>
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
                    <el-table-column align="center" label="操作" width="140px">
                        <template slot-scope="scope">
                            <el-button title="转办" type="success" icon="el-icon-share" size="small" @click="changeHandle(scope.row)"></el-button>
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
            <!-- 新增编辑 -->
            <el-dialog title="查看详情" :close-on-click-modal="false" top="8vh" v-dialogDrag width="60%" :visible.sync="dialogFormVisible">
                <el-tabs v-model="activeName" v-loading="fromLoading" @tab-click="fathClick">
                    <el-tab-pane label="表单信息" name="first">
                        <el-form :rules="rules" ref="dataForm" :model="temp" label-width="110px">
                            <el-form-item>
                                <span class="equip-title">开箱验收单</span>
                            </el-form-item>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="单据编码" prop="documentWordCode">
                                        <el-input v-model="temp.documentWordCode" disabled class="enter medium-input"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="制造厂家" prop="supplier">
                                        <el-input v-model="temp.supplier" :disabled='siteCodeState?true:false' class="enter medium-input"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="夹具名称" prop="equipmentName">
                                        <el-input v-model="temp.equipmentName" :disabled='siteCodeState?true:false' class="enter medium-input"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="出厂编号" prop="serialNumber">
                                        <el-input v-model="temp.serialNumber" :disabled='!chooseShow' class="enter medium-input"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="型号规格" prop="typeSpecification">
                                        <el-input v-model="temp.typeSpecification" :disabled='siteCodeState?true:false' class="enter medium-input"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="固定资产编号" prop="fixedAssetCode">
                                        <el-input v-model="temp.fixedAssetCode" :disabled='siteCodeState?true:false' class="enter medium-input"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="验收日期" prop="acceptanceDate">
                                        <div class="block">
                                            <el-date-picker style="width:100%" v-model="temp.acceptanceDate" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :disabled='!chooseShow'>
                                            </el-date-picker>
                                        </div>
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
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="送货单号" prop="deliveryCode">
                                        <el-input v-model="temp.deliveryCode" :disabled='!chooseShow' class="enter medium-input" placeholder="若无单号，请填写“无”并上传图片"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="11">
                                    <el-col :span="1" style="width:1px;color:red;padding:8px" v-if="chooseShow">
                                        <span>*</span>
                                    </el-col>
                                    <el-form-item label="送货单附件">
                                        <input id="deliveryNumberPic" type="file" @change="imgUpload" accept="image/gif,image/jpg,image/png,/image/gif,image/jpeg">
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-table :data="towlistdata" border fit highlight-current-row style="width: 100%;min-height:auto;margin-top:8px" :header-cell-style="{background:'oldlace'}">
                                <el-table-column prop="fileName" align="center" label="文件名">
                                    <template slot-scope="scope">
                                        <span style="cursor:pointer;text-decoration:underline " @click="lookFile(scope.row)">{{scope.row.fileName}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="node" align="center" label="上传节点">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.node}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
                                    <template slot-scope="scope">
                                        <el-button title="下载" type="primary" @click="downloadsty(scope.row)" size="small" icon="el-icon-download"></el-button>
                                        <el-button title="删除" type="danger" @click="twosmalldelest(scope.row)" icon="el-icon-delete" size="small" :disabled="scope.row.deleteDisabled?true:false"></el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="夹具编码图片" prop="pictureUrl">
                                        <input id="pic" type="file" @change="picUpload" accept="image/gif,image/jpg,image/png,/image/gif,image/jpeg" v-show="picShow">
                                        <img v-if="isShow" :src="temp.pictureUrl" alt="" style="width: 150px;height:50px;cursor: pointer" @click="handleBig">
                                        <el-button type="primary" v-if="isShow" icon="el-icon-download" @click="downLoadPic"></el-button>
                                        <el-button type="danger" v-if="isShow" icon="el-icon-delete" @click="delPic" :disabled="!schooseShow"></el-button>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-form-item label="送货单内容" prop="deliveryCodeContent">
                                <el-input type="textarea" :disabled='!chooseShow' maxlength="200" v-model="temp.deliveryCodeContent">
                                </el-input>
                            </el-form-item>
                            <el-form-item label="实际验收情况" prop="actualAcceptSituation">
                                <el-input type="textarea" :disabled='!chooseShow' maxlength="200" v-model="temp.actualAcceptSituation">
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
                                <el-col :span="1" style="width:1px;color:red;padding:8px" v-if="chooseShow">
                                        <span>*</span>
                                    </el-col>
                                <el-form-item label="开箱验收单附件" class="sepost" style="margin-left:10px">
                                    <input class="uploadInput" id="uploadImg" ref="uploadImg" type="file" @change="noticeUpload">
                                </el-form-item>
                            </el-row>
                            <!-- 开箱验收单附件 -->
                            <el-table :data="smallslist" v-loading="listLoading" border fit highlight-current-row style="width: 100%;min-height:auto;margin-top:8px" :header-cell-style="{background:'oldlace'}" doLayout>
                                <el-table-column prop="fileName" align="center" label="文件名" min-width="221">
                                    <template slot-scope="scope">
                                        <span style="cursor:pointer;text-decoration:underline " @click="lookFile(scope.row)">{{scope.row.fileName}}</span>
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
                    <el-tab-pane label="流转记录" name="second">
                        <el-table :data="circulation" v-loading="listLoading" border fit highlight-current-row style="width: 100%;min-height:auto;margin-top:8px" :header-cell-style="{background:'oldlace'}">
                            <el-table-column align="center" label="序号" min-width="50" type="index"></el-table-column>
                            <el-table-column prop="taskName" align="center" label="步骤名" min-width="83">
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
                    <el-tab-pane label="流程图" name="three">
                        <div id="imgcontainer">
                            <img id="pic" :src="chartData" />
                        </div>
                    </el-tab-pane>
                </el-tabs>
                <el-form class="buttonlist">
                    <el-form-item>
                        <el-button @click="dialogFormVisible = false" type="primary" size="small">返回</el-button>
                        <el-button type="primary" @click="saveData" size="small" v-show="consent">同意</el-button>
                        <el-button type="primary" @click="updateSaveData" size="small" v-show="retrnsty">退回</el-button>
                        <el-button type="primary" @click="submitData" size="small" v-show="submitlist">提交</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <!-- 同意和退回弹窗 -->
            <el-dialog :close-on-click-modal="false" :title="textMap[dialogStatus]" top="8vh" width="30%" :visible.sync="postylitys">
                <el-form :rules="rules" ref="dataFormsty" :model="noeli" label-width="110px">
                    <el-form-item label="意见" prop="opetion">
                        <el-input type="textarea" maxlength="128" v-model="noeli.opetion">
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
            <el-dialog width="40%" title="夹具编码图片预览" :visible.sync="dialogBig" append-to-body :close-on-click-modal="false" v-dialogDrag>
                <div>
                    <img :src="temp.pictureUrl" alt="" style="width: 100%;height:100%">
                </div>
            </el-dialog>
        </el-container>
    </div>
</template>

<script>
import { fetchNeedList, fetchlbList, fileList, flowsheet, samllDelete, uploadlist, circuList, updateAuditing, insertFile, getCurrentUser, getNodeTask, newlYupdate } from '@/api/toolFixtureManagement/openBoxAcceptance'
import { fetchChooseTree, choosePersonList, transferList } from '@/api/common/common'
import { baseUrl } from '@/api/common/fileBaseUrl'
export default {
  name: 'openBoxAcceptanceNeed',
  data() {
    return {
      lbList: [],
      dialogBig: false,
      picShow: true,
      isShow: false,
      picName: '',
      // 选择人员
      defaultProps1: {
        children: 'children',
        label: 'orgFullName'
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
      chooseShow: false,
      value13: [],
      smallslist: [], // 开箱验收单附件
      towlistdata: [], // 送货单图片上传
      documentWordCode: '', // 单据编码赋值
      userId: '',
      nodeName: '',
      nodetaskId: '', // 接口参数
      listyst: [],
      circulation: [], // 流转记录
      consent: false,
      retrnsty: false,
      submitlist: false,

      porisgid: '',
      grite: '',
      total: null,
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      activeName: 'first', // 选项卡默认选项
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
      noeli: {
        opetion: '' // 同意里的意见字段
      },
      chartData: '', // 流程图
      // 弹框显示
      dialogFormVisible: false,
      postylitys: false,
      affirmshow1: false,
      affirmshow2: false,
      popTitle: '',
      dialogStatus: '',
      textMap: {
        update: '同意办理',
        create: '退回办理'
      },

      isAdd: false, // 新增or编辑
      siteDetail: false, // 新增、编辑弹窗
      editLoading: false, // 提交按钮加载动画
      showStatus: true, // 表单项显示状态
      formSearch_send: false, // 查询条件点选
      listLoading: true, // 远程搜索加载动画
      fromLoading: true, // 弹出框加载动画
      dialogPvVisible: false,
      dialoglookVisible: false, // 弹窗属性
      siteCodeState: '', // 岗位编码禁用状态
      rules: {
        // supplier: [{ required: true, message: '此项为必填项', trigger: 'change' }], // 供应厂商
        equipmentName: [{ required: true, message: '此项为必填项', trigger: 'change' }], // 夹具名称
        serialNumber: [{ required: true, message: '此项为必填项', trigger: 'change' }],
        typeSpecification: [{ required: true, message: '此项为必填项', trigger: 'change' }],
        fixedAssetCode: [{ required: true, message: '此项为必填项', trigger: 'change' }],
        deliveryCode: [{ required: true, message: '此项为必填项', trigger: 'change' }], // 固定资产编号
        deliveryCodeContent: [{ required: true, message: '此项为必填项', trigger: 'change' }],
        actualAcceptSituation: [{ required: true, message: '此项为必填项', trigger: 'change' }],
        missPieceType: [{ required: true, message: '此项为必填项', trigger: 'change' }],
        acceptanceType: [{ required: true, message: '此项为必填项', trigger: 'change' }],
        acceptanceDate: [{ required: true, message: '此项为必填项', trigger: 'change' }],
        purchaseStorehouseName: [{ required: true, message: '此项为必填项', trigger: 'change' }] // 采购入库仓库
      }
    }
  },
  created() {
    this.getList()
    this.getlbList()
  },
  methods: {
    // 模糊查询采购入库仓库
    getlbList() {
      const find = {
        parCode: 'CK',
        pageNum: 1,
        pageSize: 200
      }
      fetchlbList(find).then(response => {
        this.lbList = []
        this.lbList = response.data.data.list
      })
    },
    lbChange() {
      this.lbList.forEach(item => {
        if (item.wordName == this.temp.purchaseStorehouseName) {
          this.temp.purchaseStorehouseCode = item.wordCode
        }
      })
    },
    // 表格的接口
    getList() {
      this.listLoading = true
      fetchNeedList(this.listQuery).then(response => {
        if (response.data.code == 200) {
          this.listyst = response.data.data.list
          this.total = response.data.data.total
          setTimeout(() => {
            this.listLoading = false
          }, 1 * 100)
        } else {
          this.$notify({
            title: '警告',
            message: response.data.msg,
            type: 'warning',
            duration: 3000
          })
          this.listLoading = false
        }
      })
    },
    // 转办
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
    renderContent(h, { node, data, store }) {
      return (
        <span>
          <span title={node.label}>{node.label}</span>
        </span>
      )
    },
    // 日期  搜索
    searchsty() {
      // 申请闲置时间  搜索
      if (this.value13 == null) {
        this.listQuery.acceptanceDateStart = ''
        this.listQuery.acceptanceDateEnd = ''
      } else {
        this.listQuery.acceptanceDateStart = this.value13[0] // 开始时间
        this.listQuery.acceptanceDateEnd = this.value13[1]
      }
    },
    // 开箱验收单附件接口
    getFileList() {
      // 开箱验收单附件
      const samllblist = {
        moduleType: 28,
        attachmentCode: 'JJKXYSDFJ',
        documentWordCode: this.documentWordCode
      }
      fileList(samllblist).then(response => {
        this.smallslist = response.data.data
        for (var i = 0; i < this.smallslist.length; i++) {
          if (this.smallslist[i].userId == this.userId) {
            this.smallslist[i].deleteDisabled = false
          } else {
            this.smallslist[i].deleteDisabled = true
          }
        }
      })
      // 送货单附件
      const find = {
        moduleType: 28,
        attachmentCode: 'JJKXYSSHFJ',
        documentWordCode: this.documentWordCode
      }
      fileList(find).then(response => {
        this.towlistdata = response.data.data
        for (var i = 0; i < this.towlistdata.length; i++) {
          if (this.towlistdata[i].userId == this.userId) {
            this.towlistdata[i].deleteDisabled = false
          } else {
            this.towlistdata[i].deleteDisabled = true
          }
        }
      })
    },
    // 查看
    checkDetails(row) {
      this.dialogFormVisible = true
      this.porisgid = row.processInstanceId
      this.documentWordCode = row.documentWordCode // 单据编码的赋值
      this.getFileList()
      this.nodetaskId = row.taskId
      this.getnodeNames() // 获取node节点名字接口
      this.temp = Object.assign({}, row)
      if(this.temp.pictureUrl == '' || this.temp.pictureUrl == null || this.temp.pictureUrl == undefined){
            this.picShow = true;
            this.isShow = false;
        }else{
            this.isShow = true;
            this.picShow = false;
      }
      this.dialoglookVisible = true
      this.siteCodeState = true
      this.fromLoading = false // 弹窗加载动画
      this.temp.acceptanceType = row.acceptanceType.toString()
      this.temp.missPieceType = row.missPieceType.toString()
      // 判断taskName是否是调整申请显示的按钮不一样
      this.circulationlist()
      if (row.taskName == '调整申请') {
        this.consent = false // 同意按钮显隐
        this.retrnsty = false // 退回按钮显隐
        this.submitlist = true // 提交按钮显隐
        this.chooseShow = true
      } else {
        this.consent = true
        this.retrnsty = true
        this.submitlist = false
        this.chooseShow = false
      }
      this.getUser()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 流转记录
    circulationlist() {
      const processInstanceId = this.porisgid
      circuList(processInstanceId).then(response => {
        this.circulation = response.data.data
      })
    },
    //  流程图
    fathClick(tab, event) {
      if (tab.label == '流程图') {
        if (this.porisgid == null) {
          this.$notify({
            title: '提示',
            message: '流程还未开始，没有流程图',
            type: 'warning',
            duration: 3000
          })
          this.chartData = ''
          return
        } else {
          this.fromLoading = true // 弹窗加载动画
          flowsheet(this.porisgid).then(response => {
            if (
              response.data.code !== 803 &&
                            response.data.code !== 808
            ) {
              this.chartData = response.request.responseURL
              document.getElementById('pic').src = this.chartData
            } else {
              this.$notify({
                title: '警告',
                message: response.data.msg,
                type: 'warning',
                duration: 2000
              })
              this.chartData = ''
            }
            setTimeout(() => {
              this.fromLoading = false
            }, 1 * 500)
          })
        }
      }
    },
    // 同意按钮
    saveData() {
      this.dialogStatus = 'update'
      this.noeli.opetion = ''
      this.postylitys = true
      this.affirmshow1 = true
      this.affirmshow2 = false
      this.$nextTick(() => {
        this.$refs['dataFormsty'].clearValidate()
      })
    },
    // 确认
    poslist1() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const noeliData = Object.assign({}, this.noeli)
          noeliData.id = this.temp.id
          noeliData.auditingType = 3
          noeliData.taskId = this.temp.taskId
          updateAuditing(noeliData).then(response => {
            if (response.data.code == 200) {
              this.postylitys = false
              this.dialogFormVisible = false
              this.getList()
              this.$message({
                title: '成功',
                message: response.data.msg,
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '警告',
                message: response.data.msg,
                type: 'warning',
                duration: 3000
              })
            }
          })
        }
      })
    },
    //   退回按钮
    updateSaveData() {
      this.dialogStatus = 'create'
      this.noeli.opetion = ''
      this.postylitys = true
      this.affirmshow1 = false
      this.affirmshow2 = true
      this.$nextTick(() => {
        this.$refs['dataFormsty'].clearValidate()
      })
    },
    // 确认
    poslist2() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const noeliData = Object.assign({}, this.noeli)
          noeliData.id = this.temp.id
          noeliData.auditingType = 4
          noeliData.taskId = this.temp.taskId
          updateAuditing(noeliData).then(response => {
            if (response.data.code == 200) {
              this.postylitys = false
              this.dialogFormVisible = false
              this.getList()

              this.$message({
                title: '成功',
                message: '退回成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '警告',
                message: response.data.msg,
                type: 'warning',
                duration: 3000
              })
            }
          })
        }
      })
    },
    // 获取当前用户信息
    getUser() {
      getCurrentUser().then(response => {
        this.userId = response.data.data.id
      })
    },
    // 获取node节点名字 this.nodetaskId
    getnodeNames() {
      getNodeTask(this.nodetaskId).then(response => {
        if (response.data.code == 200) {
          this.nodeName = response.data.data.name
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
    // 退回的时候就要能编辑而且按钮变为提交按钮
    submitData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          if (this.nodeName == '调整申请' && this.smallslist.length == 0) {
            this.$notify({
              title: '提示',
              message: '请上传开箱验收单附件',
              type: 'warning',
              duration: 3000
            })
            return
          }
          if (this.nodeName == '调整申请' && this.towlistdata.length == 0) {
            this.$notify({
              title: '提示',
              message: '请上传送货单附件',
              type: 'warning',
              duration: 3000
            })
            return
          }
          newlYupdate(tempData).then(response => {
            if (response.data.code == 200) {
              for (const v of this.listyst) {
                if (v.id === this.temp.id) {
                  const index = this.listyst.indexOf(v)
                  this.listyst.splice(index, 1, this.temp)
                  this.getList()
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: response.data.msg,
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '错误',
                message: response.data.msg,
                type: 'error',
                duration: 2000
              })
            }
          })
        }
      })
    },
    // 文件预览
    lookFile(row) {
      let url
      if (row.fileUrl !== undefined) {
        url =
                    baseUrl +
                    'onlinePreview?url=' +
                    encodeURIComponent(row.fileUrl)
      } else {
        url =
                    baseUrl +
                    'onlinePreview?url=' +
                    encodeURIComponent(row.filePath)
      }
      var winHeight = window.document.documentElement.clientHeight
      window.open(
        url,
        '_blank',
        'height=' +
                    winHeight +
                    ',top=10,left=10,toolbar=no,menubar=no,scrollbars=yes,resizable=yes'
      )
    },
    // 开箱验收单附件上传
    noticeUpload(e) {
      const file = e.target.files[0]
      const fileData1 = {
        attachmentCode: 'JJKXYSDFJ',
        moduleType: '28',
        fileName: undefined,
        filePath: undefined, // 文件URL
        node: this.nodeName,
        userId: this.userId,
        code: this.documentWordCode
      }

      if (file != null) {
        this.fromLoading = true
        const param = new FormData() // 创建form对象
        param.append('file', file, file.name) // 通过append向form对象添加数据
        fileData1.fileName = file.name
        uploadlist(param).then(resp => {
          // 调用上传接口
          if (resp.data.code == 200) {
            fileData1.filePath = resp.data.data.remoteFilename // 文件地址
            // 调用新增文件（陈状）
            insertFile(fileData1).then(response => {
              if (response.data.code == 200) {
                this.$message({
                  title: '成功',
                  message: '上传成功',
                  type: 'success',
                  duration: 2000
                })
                this.getFileList() // 获取文件
                const test = document.getElementById('uploadImg')
                test.value = ''
                this.fromLoading = false
              } else {
                this.$notify({
                  title: '警告',
                  message: response.data.msg,
                  type: 'warning',
                  duration: 2000
                })
              }
            })
            setTimeout(() => {
              this.fromLoading = false
            }, 1 * 500)
          } else if (resp.data.code == 402) {
            this.$notify({
              title: '警告',
              message: resp.data.msg,
              type: 'warning',
              duration: 3000
            })
            this.fromLoading = false
            const test = document.getElementById('uploadImg')
            test.value = ''
          } else {
            this.$notify({
              title: '警告',
              message: '上传失败',
              type: 'warning',
              duration: 3000
            })
            this.fromLoading = false
            const test = document.getElementById('uploadImg')
            test.value = ''
          }
        })
      }
    },
    // 开箱验收单附件下载
    downloadsty(row) {
      const att = row.fileName
      window.location.href = row.filePath + '?attname=' + att

      this.$message({
        title: '成功',
        message: '下载成功',
        type: 'success',
        duration: 2000
      })
    },
    // 开箱验收单附件删除按钮
    smalldelest(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          const ids = row.id
          samllDelete(ids).then(response => {
            const index = this.smallslist.indexOf(row)
            this.smallslist.splice(index, 1)
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 送货单附件上传
    imgUpload(e) {
      const file = e.target.files[0]
      const fileData1 = {
        attachmentCode: 'JJKXYSSHFJ',
        code: this.documentWordCode,
        moduleType: '28',
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
                this.towlistdata.push(fileData1)
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
          const fileInput1 = document.getElementById('deliveryNumberPic')
          fileInput1.value = ''
        })
      }
    },
    // 送货单附件删除
    twosmalldelest(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          const ids = row.id
          samllDelete(ids).then(response => {
            const index = this.towlistdata.indexOf(row)
            this.towlistdata.splice(index, 1)
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 夹具编码图片上传
    picUpload(e) {
      const file = e.target.files[0]
      const fileData1 = {
        fileName: undefined,
        filePath: undefined, // 文件URL
        fileUrl: undefined
      }
      if (file != null) {
        this.listLoading = true
        const param = new FormData() // 创建form对象
        param.append('file', file, file.name) // 通过append向form对象添加数据
        fileData1.fileName = file.name
        this.picName = fileData1.fileName
        uploadlist(param).then(resp => { // 调用上传接口
          if (resp.data.code == 200) {
              this.picShow = false;
            this.isShow = true;
            fileData1.filePath = resp.data.data.remoteFilename
            fileData1.fileUrl = resp.data.data.fileUrl
            this.temp.pictureUrl = fileData1.fileUrl
            // 调用新增文件
            // insertFile(fileData1).then(response => {
            //     this.temp.pictureUrl = fileData1.fileUrl;
            //     if (response.data.code == 200) {
            //         this.$message({
            //             title: '成功',
            //             message: '上传成功',
            //             type: 'success',
            //             duration: 2000
            //         })
            //     } else {
            //         this.$notify({
            //             title: '警告',
            //             message: response.data.msg,
            //             type: 'warning',
            //             duration: 2000
            //         })
            //     }
            //     this.listLoading = false
            // })
          } else if (resp.data.code == 402) {
              this.picShow = true;
              this.isShow = false;
            this.$notify({
              title: '警告',
              message: resp.data.msg,
              type: 'warning',
              duration: 2000
            })
          } else {
              this.picShow = true;
              this.isShow = false;
            this.$notify({
              title: '警告',
              message: '上传失败',
              type: 'warning',
              duration: 2000
            })
          }
          this.listLoading = false
          const fileInput1 = document.getElementById('pic')
          fileInput1.value = ''
        })
      }
    },
    //夹具图片放大
    handleBig(){
        this.dialogBig = true
    },
    // 删除夹具图片
    delPic(){
        this.temp.pictureUrl = '';
        document.getElementById("pic").value = ''
        this.picShow = true;
        this.isShow = false;
    },
    // 下载夹具图片
    downLoadPic() {
        const att = 'picture.jpg'
        window.location.href = this.temp.pictureUrl + '?attname=' + att
        this.$message({
            title: '成功',
            message: '下载成功',
            type: 'success',
            duration: 2000
        })
    },
    // 搜索
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    }
  }
}
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
