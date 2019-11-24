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
                                <el-date-picker style="width:100%" v-model="value13" type="daterange" unlink-panels start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" clearable @change="searchsty()">
                                </el-date-picker>
                            </div>
                        </el-form-item>
                        <el-form-item label="验收情况" prop="acceptanceType">
                            <el-radio v-model="listQuery.acceptanceType" label="1">验收通过</el-radio>
                            <el-radio v-model="listQuery.acceptanceType" label="0">验收不通过</el-radio>
                        </el-form-item>
                        <el-form-item label="审核状态">
                            <el-select v-model="listQuery.auditingType" style="width:100%" clearable placeholder="请选择">
                                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <el-main style="padding:20px 0px">
                <el-table :data="tableData" v-loading="listLoading" border fit highlight-current-row style="width: 100%;min-height:auto;margin-top:0px" height="500" :header-cell-style="{background:'oldlace'}">
                    <el-table-column prop="documentWordCode" align="center" label="单据编码" min-width="100">
                        <template slot-scope="scope">
                            <span class="link-type futiop" @click='checkDetails(scope.row)'>{{scope.row.documentWordCode}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="supplier" align="center" label="供应商" min-width="80">
                    </el-table-column>
                    <el-table-column prop="equipmentName" align="center" label="夹具名称" min-width="80">
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
                </el-table>
            </el-main>
            <el-footer>
                <div class="pagination-container">
                    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[5,10,15,20]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                    </el-pagination>
                </div>
            </el-footer>
            <!-- 新增和编辑 -->
            <el-dialog title="查看详情" :close-on-click-modal="false" v-dialogDrag width="60%" :visible.sync="dialogFormVisible">
                <el-tabs v-model="activeName" v-loading="fromLoading" @tab-click="fathClick">
                    <el-tab-pane label="表单信息" name="first">
                        <el-form :rules="rules" ref="dataForm" :model="temp" label-width="110px">
                            <el-form-item>
                                <span class="equip-title">开箱验收单</span>
                            </el-form-item>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="单据编码" prop="documentWordCode">
                                        <el-input v-model="temp.documentWordCode" disabled class="enter medium-input" placeholder="空"></el-input>
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
                                        <el-input v-model="temp.serialNumber" :disabled='siteCodeState?true:false' class="enter medium-input"></el-input>
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
                                        <el-date-picker v-model="temp.acceptanceDate" style="width:100%" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :disabled='siteCodeState?true:false'>
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="采购入库仓库" prop="purchaseStorehouseName">
                                        <el-select v-model="temp.purchaseStorehouseName" style="width:100%" clearable placeholder="请选择仓库" @change='lbChange' :disabled='siteCodeState?true:false'>
                                            <el-option v-for="item in lbList" :key="item.wordCode" :label="item.wordName" :value="item.wordName">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="送货单号" prop="deliveryCode">
                                        <el-input v-model="temp.deliveryCode" :disabled='siteCodeState?true:false' class="enter medium-input"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="11">
                                    <el-form-item label="送货单附件">
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
                                    </template>
                                </el-table-column>
                            </el-table>
                            <el-row>
                                <el-col :span="12">
                                    <!-- <el-form-item label="夹具编码图片" prop="pictureUrl">
                                        <div :disabled='siteCodeState?true:false'>{{temp.pictureUrl}}</div>
                                    </el-form-item> -->
                                    <el-form-item label="夹具编码图片" prop="pictureUrl">
                                        <img v-if="isShow" :src="temp.pictureUrl" alt="" style="width: 150px;height:50px;cursor: pointer" @click="handleBig">
                                        <el-button type="primary" v-if="isShow" icon="el-icon-download" @click="downLoadPic"></el-button>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-form-item label="送货单内容" prop="deliveryCodeContent">
                                <el-input type="textarea" maxlength="200" :disabled='siteCodeState?true:false' v-model="temp.deliveryCodeContent">
                                </el-input>
                            </el-form-item>
                            <el-form-item label="实际验收情况" prop="actualAcceptSituation">
                                <el-input type="textarea" maxlength="200" :disabled='siteCodeState?true:false' v-model="temp.actualAcceptSituation">
                                </el-input>
                            </el-form-item>
                            <el-row>
                                <el-col :span="10">
                                    <el-form-item label="是否缺件" prop="missPieceType">
                                        <el-radio v-model="temp.missPieceType" label="1" :disabled='siteCodeState?true:false'>是</el-radio>
                                        <el-radio v-model="temp.missPieceType" label="0" :disabled='siteCodeState?true:false'>否</el-radio>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="14">
                                    <el-form-item label="验收情况" prop="acceptanceType" class="seat">
                                        <el-radio v-model="temp.acceptanceType" label="1" :disabled='siteCodeState?true:false'>验收通过</el-radio>
                                        <el-radio v-model="temp.acceptanceType" label="0" :disabled='siteCodeState?true:false'>验收不通过</el-radio>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-form-item label="开箱验收单附件">
                                </el-form-item>
                            </el-row>
                            <el-table :data="smallslist" v-loading="listLoading" border fit highlight-current-row style="width: 100%;min-height:auto;margin-top:8px" :header-cell-style="{background:'oldlace'}">
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
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-form>
                    </el-tab-pane>
                    <!-- 流转记录 -->
                    <el-tab-pane label="流转记录" name="second">
                        <el-table :data="circulation" v-loading="listLoading" border fit highlight-current-row style="width: 100%;min-height:auto;margin-top:8px" :header-cell-style="{background:'oldlace'}">
                            <el-table-column align="center" label="序号" min-width="60" type="index"></el-table-column>
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
                        <el-button @click="dialogFormVisible = false" type="primary" size="small">返回</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <!-- 同意和退回弹窗 -->
            <el-dialog :close-on-click-modal="false" :title="textMap[dialogStatus]" top="8vh" width="700px" :visible.sync="postylitys">
                <el-form :rules="rules" ref="dataFormsty" :model="noeli" label-width="110px">
                    <el-form-item label="意见" prop="opetion">
                        <el-input type="textarea" maxlength="128" v-model="noeli.opetion">
                        </el-input>
                    </el-form-item>
                </el-form>

                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="poslist1" v-show="affirmshow1">确认</el-button>
                    <el-button type="primary" @click="poslist2" v-show="affirmshow2">确认</el-button>
                    <el-button @click="postylitys = false" type="primary">返回</el-button>
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
import { fetchDoneList, fileList, uploadlist, circuList, updateAuditing, flowsheet, fetchlbList } from '@/api/toolFixtureManagement/openBoxAcceptance'
import { baseUrl } from '@/api/common/fileBaseUrl'
export default {
  name: 'openBoxAcceptanceDone',
  data() {
    return {
      lbList: [],
      isShow: false,
      dialogBig: false,
      options: [
        { value: '2', label: '审核中' },
        { value: '3', label: '审核通过' },
        { value: '4', label: '审核不通过' }
      ],
      value13: [],
      smallslist: [], // 开箱验收单附件
      towlistdata: [], // 送货单附件
      circulation: [], // 流转记录
      porisgid: '',
      documentW: '',
      tableData: [],
      lookList: [],
      grite: '',
      total: null,
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      activeName: 'first',
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
      // 弹框显示
      dialogFormVisible: false,
      postylitys: false,
      affirmshow1: false,
      affirmshow2: false,
      dialogStatus: '',
      textMap: {
        update: '同意办理',
        create: '退回办理'
      },
      chartData: '', // 流程图
      listLoading: true,
      fromLoading: true,
      siteCodeState: '',
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
      },
      downloadLoading: false
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
    // 列表查询
    getList() {
      this.listLoading = true
      fetchDoneList(this.listQuery).then(response => {
        this.tableData = response.data.data.list
        this.total = response.data.data.total
        this.$nextTick(() => {
          this.listLoading = false
        })
      })
    },
    // 验收日期
    searchsty() {
      if (this.value13 == null) {
        this.listQuery.acceptanceDateStart = ''
        this.listQuery.acceptanceDateEnd = ''
      } else {
        this.listQuery.acceptanceDateStart = this.value13[0] // 开始时间
        this.listQuery.acceptanceDateEnd = this.value13[1]
      }
    },
    // 查看
    checkDetails(row) {
      this.dialogFormVisible = true
      this.porisgid = row.processInstanceId
      this.temp = Object.assign({}, row)
      if(this.temp.pictureUrl == '' || this.temp.pictureUrl == null || this.temp.pictureUrl == undefined){
            this.isShow = false;
        }else{
            this.isShow = true;
      }
      this.siteCodeState = true
      this.activeName = 'first' // 选项卡默认选项
      this.fromLoading = false // 加载动画
      this.temp.acceptanceType = row.acceptanceType.toString()
      this.temp.missPieceType = row.missPieceType.toString()
      this.circulationlist()
      // 开箱验收单附件
      const samllblist = {
        moduleType: 28,
        attachmentCode: 'JJKXYSDFJ',
        documentWordCode: row.documentWordCode
      }
      fileList(samllblist).then(response => {
        this.smallslist = response.data.data
      })
      // 送货单附件
      const find = {
        moduleType: 28,
        attachmentCode: 'JJKXYSSHFJ',
        documentWordCode: row.documentWordCode
      }
      fileList(find).then(response => {
        this.towlistdata = response.data.data
      })
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
                message: '同意成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '警告',
                message: '失败',
                type: 'warning',
                duration: 3000
              })
            }
          })
        }
      })
    },
    // 退回按钮
    updateSaveData() {
      this.dialogStatus = 'create'
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
                message: '退回失败',
                type: 'warning',
                duration: 3000
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
    // 下载的按钮
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
    //夹具图片放大
    handleBig(){
        this.dialogBig = true
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
