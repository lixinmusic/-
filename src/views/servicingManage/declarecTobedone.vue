<template>
  <div class="app-container">
    <!--外部容器 -->
    <el-container>
       <!-- 顶部搜索 -->
     
        <div class="filter-container">
       
          <div class="formSearch">
            <el-form :inline="true">
               
                <el-form-item label="单据编号" >
                <el-input v-model="listQuery.documnetCode"  style="width:230px" placeholder="请输入单据编号" clearable></el-input>
                </el-form-item>
               

                
                <el-form-item label="设备名称" >
                <el-input class="minier-input" v-model="listQuery.equipmentName" placeholder="请输入设备名称" clearable></el-input>
                </el-form-item>
             

              
                <el-form-item label="固定资产编号" style="margin-left:64px">
                <el-input class="minier-input" v-model="listQuery.fixedAssetCode" placeholder="请输入固定资产编号" clearable></el-input>
                </el-form-item>
             

           
                <el-form-item label="报修时间" >
                <div class="block">
                    <el-date-picker
                    style="width:230px"
                    v-model="value13"
                    type="daterange"
                    unlink-panels
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                      clearable  @change="searchsty()">
                    </el-date-picker>
                </div>
                </el-form-item>
           

            
                <el-form-item>
                <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
                </el-form-item>
             
            </el-form>
            </div>
          
        </div>
     
      <!-- 内容容器 -->
     
          <!-- 主要区域容器  v-if="addnewly"-->
          <el-main style="padding:20px 0px">
            
            <el-table :data="listyst" v-loading="listLoading" border fit highlight-current-row
              style="width: 100%;min-height:auto;margin-top:0px" height="500" :header-cell-style="{background:'oldlace'}">

              <el-table-column prop="documnetCode" align="center" label="单据编码" min-width="100">
               <template slot-scope="scope">
                 <span class="link-type futiop" @click='checkDetails(scope.row)'>{{scope.row.documnetCode}}</span>
               </template>
                 </el-table-column>
                <el-table-column prop="equipmentName" align="center" label="设备名称" min-width="80">
                 </el-table-column>
                 <el-table-column prop="fixedAssetCode" align="center" label="固定资产编号" min-width="80">
                 </el-table-column>
                 <el-table-column prop="model" align="center" label="型号规格" min-width="80">
                 </el-table-column>
                <el-table-column prop="repariDate" align="center" label="报修时间" min-width="80">
                  <template slot-scope="scope">
                   {{scope.row.repariDate!==''?scope.row.repariDate.substring(0,10):''}}
                 </template>
                 </el-table-column>
               <el-table-column prop="circuitBoardName" align="center" label="电路板名称" min-width="80">
                 </el-table-column>
               <el-table-column prop="circuitBoardModel" align="center" label="电路板型号" min-width="80">
                </el-table-column>
               <el-table-column prop="repairCompany" align="center" label="报修公司" min-width="80">
                 </el-table-column>
               <el-table-column prop="repairFactory" align="center" label="报修工厂" min-width="80">
                 </el-table-column>
               <el-table-column prop="repairDivision" align="center" label="报修部门" min-width="80">
                 </el-table-column>
               <el-table-column prop="requestDate" align="center" label="要求完成时间" min-width="80">
                  <template slot-scope="scope">
                   {{scope.row.requestDate!==''?scope.row.requestDate.substring(0,10):''}}
                 </template>
                 </el-table-column>
               <el-table-column prop="repairSuggestName" align="center" label="维修建议" min-width="80">
                 </el-table-column>
               <el-table-column prop="checkStartName" align="center" label="审核状态" min-width="80">
                 </el-table-column>

               <el-table-column align="center" label="操作" min-width="150" fixed="right" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-button title="转办" type="primary" size="mini" icon="el-icon-share" @click="transfer(scope.row)"></el-button>
                </template>
              </el-table-column>
            
            </el-table>
          </el-main>
          <!-- 底栏容器 afreshst speechst -->
          <el-footer>
            <!-- 分页 -->
            <div class="pagination-container">
              <el-pagination background 
              @size-change="handleSizeChange" 
              @current-change="handleCurrentChange" 
              :current-page="pageNum" 
              :page-sizes="[5,10,15,20]" 
              :page-size="pageSize" 
              layout="total, sizes, prev, pager, next, jumper" 
              :total="total">
              </el-pagination>
            </div>
          </el-footer>

           <!-- 转办弹框 -->
           <el-dialog title="请选择转办接收人员" :close-on-click-modal="false" v-dialogDrag v-loading="dragLoading" :visible.sync="innerVisible" width="50%" append-to-body>
            <el-row :gutter="20">
              <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="姓名">
                  <el-input v-model="listQuery1.perName"  placeholder="请输入姓名">
                  </el-input>
                </el-form-item>
                <el-form-item label="工号">
                  <el-input v-model="listQuery1.workNumber" placeholder="请输入工号">
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" icon="el-icon-search"  @click="handlePerson">搜索</el-button>
                </el-form-item>
              </el-form>
              </el-row>
              <el-container>
                 <el-col :span="8">
                  <el-aside width="230px">
                  <h4>组织</h4>
                <el-tree :data="orgData" :props="defaultProps" @node-click="handleNodeClick1" v-loading="treeLoading" style="width:380px;height:500px;"></el-tree>
              </el-aside>
                </el-col>
                 <el-col :span="16">
                  <el-table height='578' :data="orgListData" v-loading="listLoading" border fit highlight-current-row
                    style="width: 100%;min-height:500px;margin-top:8px" @current-change="hanhange">
                    <el-table-column prop="orgName"  align="center" label="部门" min-width="60" style="cursor:pointer">
                     <template slot-scope="scope">
                        <a class="text-detail">{{scope.row.orgName}}</a>
                      </template>
                    </el-table-column>
                    <el-table-column  prop="perName" align="center" label="人员" min-width="50" style="cursor:pointer">
                       <template slot-scope="scope">
                        <a class="text-detail">{{scope.row.perName}}</a>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="工号" min-width="50">
                      <template slot-scope="scope">
                        <a class="text-detail">{{scope.row.workNumber}}</a>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
          </el-container>
           <div slot="footer" class="dialog-footer">
          </div>
          </el-dialog>

          <!-- 新增和编辑是同一个弹出框 -->
          <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" v-dialogDrag top="8vh" width="1000px" :visible.sync="dialogFormVisible" >
             <!-- 选项卡 -->
            <el-tabs v-model="activeName" v-loading="fromLoading" @tab-click="fathClick">
             <el-tab-pane label="表单信息" name="first">
              <el-form :rules="rules" ref="dataForm" :model="temp" label-width="110px">
              <el-form-item>
                <span class="equip-title">设备报修单待办</span>
              </el-form-item>
              <el-row>
              <el-col :span="8">     
              <el-form-item label="单据编码"  prop="documnetCode">
              <el-input style="width:290px" v-model="temp.documnetCode" disabled class="enter medium-input" placeholder="空" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="16">     
              <el-form-item label="设备名称"  prop="equipmentName" style="margin-left:200px">
              <el-input style="width:290px" v-model="temp.equipmentName" :disabled='siteCodeState?true:false'  class="enter medium-input" placeholder="输入设备名称" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>
             
              <el-row>
              <el-col :span="8">     
              <el-form-item label="固定资产编号"  prop="fixedAssetCode">
              <el-input style="width:290px" v-model="temp.fixedAssetCode" :disabled='siteCodeState?true:false' class="enter medium-input" placeholder="输入固定资产编号" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="型号规格" prop="model" style="margin-left:200px;"> 
              <el-input v-model="temp.model" :disabled='siteCodeState?true:false' style="width:290px" class="enter medium-input" placeholder="请输入型号规格" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">
              <el-form-item label="报修时间"  prop="repariDate">
              <el-input style="width:290px" v-model="temp.repariDate" :disabled='siteCodeState?true:false' class="enter medium-input" placeholder="输入报修时间" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="电路板名称" prop="circuitBoardName" style="margin-left:200px;">
              <el-input v-model="temp.circuitBoardName" maxlength="30" :disabled='portionst?true:false' style="width:290px" class="enter medium-input" placeholder="请输入电路板名称" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">     
              <el-form-item label="电路板型号" prop="circuitBoardModel"> 
              <el-input v-model="temp.circuitBoardModel" maxlength="30" :disabled='portionst?true:false' style="width:290px" class="enter medium-input" placeholder="请输入电路板型号" ></el-input>   
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="报修公司" prop="repairCompany" style="margin-left:200px;"> 
              <el-input v-model="temp.repairCompany" :disabled='siteCodeState?true:false' style="width:290px" class="enter medium-input" placeholder="请输入报修公司" ></el-input>   
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">
              <el-form-item label="报修工厂" prop="repairFactory"> 
              <el-input v-model="temp.repairFactory" :disabled='siteCodeState?true:false' style="width:290px" class="enter medium-input" placeholder="请输入报修工厂" ></el-input>   
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="报修部门" prop="repairDivision" style="margin-left:200px"> 
              <el-input v-model="temp.repairDivision" :disabled='siteCodeState?true:false' style="width:290px" class="enter medium-input" placeholder="请输入报修部门" ></el-input>   
              </el-form-item>
              </el-col>
              </el-row>

             
               <el-row>
               <el-col :span="8">
              <el-form-item label="要求完成时间" prop="requestDate">
               <div class="block">
                <el-date-picker
                  style="width:290px"
                  v-model="temp.requestDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  
                  :disabled='portionst?true:false'>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
               <el-col :span="16">
               <span style="color:red;position:absolute;top:5px;left:526px" v-if="potu">*</span>
               <el-form-item label="设备维修建议" prop="repairSuggest" style="margin-left:200px"> 
                <el-radio v-model="temp.repairSuggest" :disabled='portionstpo?true:false' label="2">外部维修</el-radio>
                <el-radio v-model="temp.repairSuggest" :disabled='portionstpo?true:false' label="1">内部维修</el-radio>
              </el-form-item>
              </el-col>
              </el-row>
  
               <el-form-item label="故障原因及内容" prop="causeReason" label-width="120px">
               <el-input type="textarea" :disabled='portionst?true:false' maxlength="200" style="width:798px" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入故障原因及内容" v-model="temp.causeReason">
               </el-input>
              </el-form-item>

              <el-row>
              <el-col :span="18">
              <el-form-item label="附件" class="sepost" label-width="40px">
              <input id="uploadImg" type="file" @change="noticeUpload" v-show="filshow">
              </el-form-item>
              </el-col>
               </el-row> 
              <!-- 第一个小表格 -->
               <el-table :data="smallslist" v-loading="listLoading" border fit highlight-current-row
              style="width: 100%;min-height:auto;margin-top:8px" :header-cell-style="{background:'oldlace'}">

                <el-table-column prop="fileName" align="center" label="文件名" min-width="323">

                 <template slot-scope="scope">
                 <span style="cursor:pointer;text-decoration:underline " @click="handlePreview(scope.row)">{{scope.row.fileName}}</span>
                 </template>
                 </el-table-column>
                 <el-table-column prop="node" align="center" label="上传节点" min-width="318">

                 <template slot-scope="scope">
                 <span>{{scope.row.node}}</span>
                 </template>
                 </el-table-column>

                <el-table-column align="center" label="操作" min-width="318"  class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-button title="下载" type="primary" @click="downloadsty(scope.row)" size="small" icon="el-icon-download"></el-button>
                  <el-button title="删除" type="danger" @click="updatadelest(scope.row)" icon="el-icon-delete" size="small" :disabled="scope.row.deleteDisabled?true:false"></el-button>
                  </template>
                 </el-table-column>
                </el-table>
           
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="流转记录" name="second" v-if="roamshow">
             <!-- 流转记录表格 -->
             <el-table :data="circulation" v-loading="listLoading" border fit highlight-current-row
              style="width: 100%;min-height:auto;margin-top:8px" :header-cell-style="{background:'oldlace'}">

                <el-table-column  align="center" label="序号" min-width="48" type="index"></el-table-column>
                
               <el-table-column prop="taskName" align="center" label="步骤名" min-width="104">
                 <template slot-scope="scope">
                 <span>{{scope.row.taskName}}</span>
                 </template>
                </el-table-column>

                <el-table-column prop="userName" align="center" label="操作人" min-width="102">
                 <template slot-scope="scope">
                 <span>{{scope.row.userName}}</span>
                 </template>
                </el-table-column>

                <el-table-column prop="orgName" align="center" label="所在部门" min-width="102">
                 <template slot-scope="scope">
                 <span>{{scope.row.orgName}}</span>
                 </template>
                </el-table-column>

                <el-table-column prop="stationName" align="center" label="岗位" min-width="102">
                 <template slot-scope="scope">
                 <span>{{scope.row.stationName}}</span>
                 </template>
                </el-table-column>

                 <el-table-column prop="state" align="center" label="状态" min-width="102">
                 <template slot-scope="scope">
                 <span>{{scope.row.state}}</span>
                 </template>
                </el-table-column>

                 <el-table-column prop="opinion" align="center" label="意见" min-width="122">
                 <template slot-scope="scope">
                 <span>{{scope.row.opinion}}</span>
                 </template>
                </el-table-column>

                <el-table-column prop="dateTime" align="center" label="时间" min-width="154">
                 <template slot-scope="scope">
                 <span>{{scope.row.dateTime}}</span>
                 </template>
                </el-table-column>

                <el-table-column prop="remark" align="center" label="备注" min-width="123">
                 <template slot-scope="scope">
                 <span>{{scope.row.remark}}</span>
                 </template>
                </el-table-column>

              </el-table>
            </el-tab-pane>
             <el-tab-pane label="流程图" name="three" v-if="roamshow">
              <div id="imgcontainer">
                  <img id="pic" :src="chartData" />
                </div>
             </el-tab-pane>
            </el-tabs>

             <el-form class="buttonlist">
             <el-form-item>
            <el-button @click="dialogFormVisible = false" type="primary" size="mini">返回</el-button>
            <el-button type="primary" @click="saveData" v-show="hold1" size="mini">同意</el-button>
            <!-- <el-button type="primary" @click="saveData" v-show="agent" size="mini">代董事长审核</el-button> -->
            <el-button type="primary" @click="updateSaveData" v-show="hold2" size="mini">退回</el-button>
            <el-button type="primary" @click="submData" v-show="submitlist" size="mini">提交</el-button>
            <el-button type="primary" @click="endbtn" v-show="submitlist" size="mini">结束流程</el-button>
                    
            </el-form-item>
            </el-form>
          </el-dialog>

          <!-- 同意和退回弹窗   consent retrnsty submitlist-->
           <el-dialog  :title="textMap[dialogStatus]" top="8vh" width="700px" :visible.sync="postylitys">
            <el-form :rules="rules" ref="dataFormsty" :model="noeli" label-width="110px">
            <span style="color:red;position:absolute;top:90px;left:80px">*</span>
            <el-form-item label="意见" prop="opinion">
                <el-input type="textarea" style="width:510px" maxlength="128" :autosize="{ minRows: 2, maxRows: 4}" placeholder="" v-model="noeli.opinion">
                </el-input>
              </el-form-item>
              
              </el-form>
          
           <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="poslist1" v-show="affirmshow1">同意</el-button>
            <el-button type="primary" @click="poslist2" v-show="affirmshow2">退回</el-button>
            <el-button @click="postylitys = false" type="primary">返回</el-button>
            </div>
          </el-dialog>
         
    </el-container>
  </div>
</template>

<script>
import { fetchListdsy, evaluate, circuList, consentToreturn, getNodeTask, refto, getCurrentUser, conservation, endProcess, smallAblist, uploadlist, updeletedata, insertFile } from '@/api/servicingManage/declarecTobedone'
import waves from '@/directive/waves' // 水波纹指令
import { flowsheet } from '@/api/servicingManage/declareBill'
// import { fetchButton } from '@/api/common/button'
import { choosePersonList, fetchChooseTree, transferList } from '@/api/common/common'
import { baseUrl } from '@/api/common/fileBaseUrl'
export default {
  name: 'declarecTobedone',
  directives: {
    waves
  },
  data() {
    return {
      url: '',
      value13: [],
      listyst: [],
      lookList: [],
      circulation: [], // 流转记录
      porisgid: '', // 流转记录接口传参
      cheid: '',
      grite: '',
      total: null,
      listQuery: {

      },
      pageNum: 1,
      pageSize: 10,
      // 编辑的字段设置
      temp: {

      },
      chartData: '', // 流程图
      // 文件数据
      smallslist: [], // 第一个小表格
      fileData: [],
      fileName: undefined,
      fileNameSC: undefined, // 文件名称
      fileUrl: undefined, // 文件URL
      documenyt: '', // 单据编码的赋值
      userId: '', // 用户id
      newuser: '',
      activeName: 'first', // 选项卡默认选项
      roamshow: false, // 流转记录隐藏
      filshow: true, // 文件上传框显示隐藏
      // 弹框显示
      dialogFormVisible: false,
      postylitys: false, // 同意弹框的打开
      noeli: {
        opinion: ''// 同意里的意见字段
      },
      // hold1: false, // 同意按钮
      // hold2: false, // 退回按钮
      submitlist: false, // 退回时的提交按钮
      affirmshow1: false, // 同意中的确认按钮
      affirmshow2: false, // 退回中的确认按钮
      taskid: '', // 在查看里获取taskId
      useidst: '',

      popTitle: '',
      lookout: '', // 查看的list
      dialogStatus: '',
      textMap: {
        update: '同意办理',
        detail: '查看',
        create: '退回办理'
      },
      //  转办弹窗按钮
      innerVisible: false,
      dragLoading: false,
      treeLoading: false,
      // 组织树结构
      orgData: [],
      orgData1: [],
      defaultProps: {
        children: 'children',
        label: 'orgFullName'
      },
      listQuery1: {
        pageNum: 1,
        pageSize: 1000,
        perName: undefined,
        workNumber: undefined
      },
      orgListData: null,
      transt: '',

      // 引用闲置待报废设备
      fastener: false, // 引用闲置待报废设备
      dialoglookVisible: false, // 弹窗属性（引用闲置待报废设备）
      listQu: {
        pageNum: 1,
        pageSize: 10
      },
      equipmentList: [], // 引用台账的数据

      nodeName: '',
      idsytp: '',
      repairSuggest: '',

      referring1: false,
      referring2: false,
      hold1: false,
      hold2: false,
      isAdd: false, // 新增or编辑
      siteDetail: false, // 新增、编辑弹窗
      editLoading: false, // 提交按钮加载动画
      showStatus: true, // 表单项显示状态
      formSearch_send: false, // 查询条件点选
      listLoading: true, // 远程搜索加载动画
      fromLoading: true, // 弹出框加载动画
      dialogPvVisible: false,
      siteCodeState: '', // 禁用状态
      portionst: '', // 禁止
      portionstpo: '',
      potu: false, // 不显示
      // 弹框内输入框不填显示的提示信息
      rules: {
        equipmentName: [{ required: true, message: '请填写', trigger: 'change' }],
        model: [{ required: true, message: '请填写', trigger: 'change' }],
        repairCompany: [{ required: true, message: '请填写', trigger: 'change' }],
        repairFactory: [{ required: true, message: '请填写', trigger: 'change' }],
        repairDivision: [{ required: true, message: '请填写', trigger: 'change' }],
        causeReason: [{ required: true, message: '请填写', trigger: 'change' }],
        fixedAssetCode: [{ required: true, message: '请填写', trigger: 'change' }],
        requestDate: [{ required: true, message: '请填写', trigger: 'change' }]

      },
      downloadLoading: false
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  created() {
    this.getAA()
    this.getusesty()
    //  this.getbttonst()
  },

  methods: {
    // ******* 文件预览**********
    handlePreview(row) {
      console.log(row)
      if (this.dialogStatus == 'create') {
        this.url = baseUrl + 'onlinePreview?url=' + encodeURIComponent(row.fileUrl)
      } else {
        this.url = baseUrl + 'onlinePreview?url=' + encodeURIComponent(row.filePath)
      }
      var winHeight = window.document.documentElement.clientHeight - 10
      window.open(this.url, '_blank', 'height=' + winHeight + ',top=80,left=80,toolbar=no, menubar=no, scrollbars=yes, resizable=yes')
    },
    // ******* 文件预览结束**********

    // 表格的接口
    getAA() {
      this.listLoading = true
      fetchListdsy(this.pageNum, this.pageSize, this.listQuery).then(response => {
        this.listyst = response.data.data.list
        if (this.listyst == null) {
          this.listyst = []
          setTimeout(() => {
            this.listLoading = false
          }, 1 * 500)
        } else {
          console.log(this.listyst)
          for (var i = 0; i < this.listyst.length; i++) {
            if (this.listyst[i].repairSuggest == 1) {
              this.listyst[i].repairSuggestName = '内部维修'
            } else if (this.listyst[i].repairSuggest == 2) {
              this.listyst[i].repairSuggestName = '外部维修'
            }

		 if (this.listyst[i].checkStart == 2) {
              this.listyst[i].checkStartName = '审核中'
              this.listyst[i].stateshow = true
              this.listyst[i].deleshow = true
            } else if (this.listyst[i].checkStart == 1) {
              this.listyst[i].checkStartName = '未提交'
              this.listyst[i].stateshow = false
              this.listyst[i].deleshow = false
	   } else if (this.listyst[i].checkStart == 3) {
              this.listyst[i].checkStartName = '审核通过'
              this.listyst[i].stateshow = true
              this.listyst[i].deleshow = true
	   } else if (this.listyst[i].checkStart == 4) {
              this.listyst[i].checkStartName = '审核不通过'
              this.listyst[i].stateshow = true
              this.listyst[i].deleshow = true
            }
          }
        }
        this.total = response.data.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 500)
      })
    },
    // 日期  搜索
    searchsty() {
      // 申请闲置时间  搜索
      if (this.value13 == null) {
        this.listQuery.requestDateUp = ''
        this.listQuery.requestDateEnd = ''
      } else {
        this.listQuery.requestDateUp = this.value13[0]// 开始时间
        this.listQuery.requestDateEnd = this.value13[1]
      }
    },

    // 搜索
    handleFilter() {
      this.pageNum = 1
      this.getAA()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getAA()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.getAA()
    },
    //  ******转办按钮*******
    transfer(row) {
      console.log(row)
      this.transt = row.processInstanceId
      this.listQuery1 = {
        pageNum: 1,
        pageSize: 1000,
        perName: undefined,
        workNumber: undefined
      }
      this.innerVisible = true
      this.treeLoading = true
      // 查询组织树结构
      fetchChooseTree().then(response => {
        this.orgData = []
        this.orgData.push(response.data.data)
        setTimeout(() => {
          this.treeLoading = false
        }, 1 * 1000)
      })
    },
    // 组织树点击事件加载表格数据
    handleNodeClick1(data) {
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
    //  搜索
    handlePerson() {
      this.listLoading = true
      choosePersonList(this.listQuery1).then(response => {
        this.orgListData = response.data.data.list
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 1000)
      })
    },
    // 关联人员提交
    hanhange(val) {
      const data = {
        processInstanceId: this.transt,
        workNumber: val.workNumber
      }
      transferList(data).then(response => {
        if (response.data.code == 200) {
          this.$notify({
            title: '成功',
            message: response.data.msg,
            type: 'success',
            duration: 2000
          })
          this.getAA()
        } else {
          this.$notify({
            title: '警告',
            message: response.data.msg,
            type: 'warning',
            duration: 2000
          })
          this.getAA()
        }
      })
      this.innerVisible = false
    },

    // ---- 转换的弹窗结束---------

    // 查看
    checkDetails(row) {
      const id = { id: row.id }
      this.idsytp = row.id
      this.newuser = row.userId
      this.taskid = row.taskId// 获取taskId
      this.porisgid = row.processInstanceId
      // this.useidst = row.id
      this.documenyt = row.documnetCode // 单据编码的赋值
      this.dialogStatus = 'detail'
      this.dialogFormVisible = true
      this.siteCodeState = true
      this.activeName = 'first'// 选项卡默认选项
      this.getnodeNames()
      if (row.checkStart == 4) {
        this.hold1 = false// 同意按钮
        this.hold2 = false// 退回按钮
        this.submitlist = true // 退回的时候提交按钮
        this.portionst = false// 这个是可以编辑的在这个节点
        this.portionstpo = true
        this.potu = false
        this.filshow = true// 文件上传框显示
      } else {
        this.hold1 = true// 同意按钮
        this.hold2 = true// 退回按钮
        this.submitlist = false // 退回的时候提交按钮
        this.portionst = true// 这个是可以编辑的在这个节点
        this.portionstpo = true
        this.potu = false// 不显示
        this.filshow = false// 文件上传框显示
      }

      this.fromLoading = false// 弹窗加载动画
      this.roamshow = true// 流转记录显示

      evaluate(id).then(response => {
        if (response.data.code == 200) {
          this.lookout = response.data.data.doucument
          this.temp = Object.assign({}, this.lookout)
          //  this.temp.applicationTime = this.temp.applicationTime.substring(0,10)
          if (this.temp.repariDate !== null) {
            this.temp.repariDate = this.temp.repariDate.substring(0, 10)
          }
          if (this.temp.repairSuggest !== null) {
            this.temp.repairSuggest = this.temp.repairSuggest.toString()// 单选框判null
          }
        }
      })

      this.circulationlist()
      this.getusesty()// 获取用户
      this.getlistsamll()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 流转记录
    circulationlist() {
      const processInstanceId = this.porisgid
      if (processInstanceId == '') {
        this.porisgid = null
        return
      } else {
        circuList(processInstanceId).then(response => {
          this.circulation = response.data.data
        })
      }
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
          this.fromLoading = true// 弹窗加载动画
          flowsheet(this.porisgid).then(response => {
            if (response.data.code !== 803 && response.data.code !== 808) {
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
    //  结束流程  taskId, val, id, moduleTypeId
    endbtn() {
      const taskId = this.taskid
      const val = 1
      const ids = this.idsytp
      const moduleTypeId = 3
      endProcess(taskId, val, ids, moduleTypeId).then(response => {
        if (response.data.code == 200) {
          // this.listLoading = false
          this.dialogFormVisible = false
          this.getAA()
          this.$message({
            title: '成功',
            message: '结束成功',
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
          // this.listLoading = false
        }
      })
    },

    // 编辑里小表格的删除 (第一个)
    updatadelest(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        const idst = row.id
        updeletedata(idst).then(response => {
          // this.smalldatast()
          const index = this.smallslist.indexOf(row)
          this.smallslist.splice(index, 1)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    //  退回的时候就要能编辑而且按钮变为提交按钮  this.idsytp = row.id
    submData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.temp.taskId = this.taskid
          // const tempData = Object.assign({}, this.temp)
          const tempData = {
            taskId: this.temp.taskId,
            id: this.temp.id,
            fixedAssetCode: this.temp.fixedAssetCode
          }

          refto(tempData).then(response => {
            const msg = response.data.msg
            if (response.data.code == 200) {
              for (const v of this.listyst) {
                console.log(this.listyst)
                if (v.id === this.temp.id) {
                  const index = this.listyst.indexOf(v)
                  this.listyst.splice(index, 1, this.temp)
                  this.getAA()
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: msg,
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '错误',
                message: msg,
                type: 'error',
                duration: 2000
              })
            }
          })
        }
      })
    },
    // 获取当前用户信息
    getusesty() {
      getCurrentUser().then(response => {
        this.userId = response.data.data.id
        const orgsty = response.data.data.sysCurrentPersonDTO.orgCode
        if (orgsty == '资产部') {
          this.disposalForm = false
        }
      })
    },
    // 第一个下载
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
    // 第一个小表格接口  getlistsamll()   getlisttwo()
    getlistsamll() {
      const samllblist = {
        moduleType: 20,
        attachmentCode: 'SBBXDXGZ',
        documentWordCode: this.documenyt
      }
      smallAblist(samllblist).then(response => {
        this.smallslist = response.data.data
        for (var i = 0; i < this.smallslist.length; i++) {
          if (this.smallslist[i].userId == this.userId) {
            this.smallslist[i].deleteDisabled = false
          } else {
            this.smallslist[i].deleteDisabled = true
          }
        }
      })
    },
    // 上传的按钮
    noticeUpload(e) {
      console.log(1234)
      const file = e.target.files[0]
      console.log(file)
      const fileData1 = {
        attachmentCode: 'SBBXDXGZ',
        moduleType: '20',
        fileName: undefined,
        filePath: undefined, // 文件URL
        node: this.nodeName,
        userId: this.userId,
        code: this.documenyt

      }
      if (file != null) {
        this.fromLoading = true
        const param = new FormData() // 创建form对象
        param.append('file', file, file.name) // 通过append向form对象添加数据
        this.filenamesty = file.name
        fileData1.fileName = file.name
        console.log(file.name)
        uploadlist(param).then(resp => { // 调用上传接口
          if (resp.data.code == 200) {
            fileData1.filePath = resp.data.data.remoteFilename // 文件地址
            insertFile(fileData1).then(response => {
              if (response.data.code == 200) {
                this.$message({
                  title: '成功',
                  message: '上传成功',
                  type: 'success',
                  duration: 2000
                })
                this.getlistsamll() // 获取文件
                const test = document.getElementById('uploadImg')
                test.value = ''
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

    // 获取node节点名字 this.nodetaskId  taskid nodeName
    getnodeNames() {
      getNodeTask(this.taskid).then(reap => {
        if (reap.data.code == 200) {
          this.nodeName = reap.data.data.name
          if (this.nodeName == '资产部审核') {
            this.portionstpo = false// 单选框可选
            this.potu = true// 不显示
          }
        } else {
          this.$notify({
            title: '警告',
            message: reap.data.msg,
            type: 'warning',
            duration: 2000
          })
        }
      })
    },

    // 同意按钮弹出框
    saveData() {
      this.noeli.opinion = ''
      this.repairSuggest = this.temp.repairSuggest
      if (this.nodeName == '资产部审核' && this.temp.repairSuggest == null) {
        this.$message({
          title: '提示',
          message: '请选择设备维修建议',
          type: 'success',
          duration: 2000
        })
        return
      } else {
        this.postylitys = true
        this.dialogStatus = 'update'
        this.affirmshow1 = true
        this.affirmshow2 = false

        this.$nextTick(() => {
          this.$refs['dataFormsty'].clearValidate()
        })
      }
    },
    // 同意的确定按钮
    poslist1() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.noeli.opinion == '') {
            this.$notify({
              title: '警告',
              message: '请填写意见',
              type: 'warning',
              duration: 3000
            })
            return
          }
          const noeliData = Object.assign({}, this.noeli)
          noeliData.userId = this.newuser
          noeliData.id = this.idsytp
          noeliData.leaderPass = true
          noeliData.taskId = this.taskid
          if (this.nodeName == '资产部审核') {
            const tempData = {
              id: this.idsytp,
              repairSuggest: this.repairSuggest
            }
            conservation(tempData).then(response => {
              console.log(response.data.data)
            })
          }
          setTimeout(() => {
            consentToreturn(noeliData).then(response => {
              const msg = response.data.msg
              if (response.data.code == 200) {
                this.postylitys = false
                this.getAA()
                this.dialogFormVisible = false
                this.$message({
                  title: '成功',
                  message: msg,
                  type: 'success',
                  duration: 2000
                })
              } else {
                this.$notify({
                  title: '警告',
                  message: msg,
                  type: 'warning',
                  duration: 3000
                })
              }
            })
          }, 1 * 1000)
        }
      })
    },

    //  退回弹出框
    updateSaveData() {
      this.noeli.opinion = ''
      this.postylitys = true
      this.dialogStatus = 'create'
      this.affirmshow1 = false
      this.affirmshow2 = true

      this.$nextTick(() => {
        this.$refs['dataFormsty'].clearValidate()
      })
    },
    // 退回的确认按钮
    poslist2() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.noeli.opinion == '') {
            this.$notify({
              title: '警告',
              message: '请填写意见',
              type: 'warning',
              duration: 3000
            })
            return
          }
          const noeliData = Object.assign({}, this.noeli)
          noeliData.id = this.idsytp
          noeliData.userId = this.newuser
          noeliData.leaderPass = false
          noeliData.taskId = this.taskid
          consentToreturn(noeliData).then(response => {
            if (response.data.code == 200) {
              this.postylitys = false
              this.getAA()
              this.dialogFormVisible = false
              this.$message({
                title: '成功',
                message: '退回成功',
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
.futiop{
text-decoration:underline
}
.formSearch {
  width: 100%;
  background: #fafafa;
  border: 1px solid #e9e9e9;
  border-radius: 3px;
  padding: 18px 10px 0;
  margin-bottom: 15px;
}
.buttonlist{
    position:absolute;
    right:20px;
    top:80px;
    }
.equip-title{
    margin-left: -100px;
    text-align: center;
    display: block;
    font-size: 20px;
    font-weight: 600;
}    
#pic{
  width:100%;
}  
</style>
