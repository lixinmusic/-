<template>
  <div class="app-container">
    <!--外部容器 -->
    <el-container>
       <!-- 顶部搜索 -->
     
        <div class="filter-container">
       
            <div class="formSearch">
           <el-form :inline="true">
              
                <el-form-item label="单据编号" >
                <el-input v-model="listQuery.formCode"  style="width:230px" placeholder="请输入单据编号" clearable></el-input>
                </el-form-item>
             

            
                <el-form-item label="固定资产编号" >
                <el-input class="minier-input" style="width:200px" v-model="listQuery.fixedAssetCode" placeholder="请输入固定资产编号" clearable></el-input>
                </el-form-item>
             

               
                <el-form-item label="设备名称" >
                <el-input class="minier-input" v-model="listQuery.equipName" placeholder="请输入设备名称" clearable></el-input>
                </el-form-item>
             

                
                <el-form-item label="型号规格" >
                <el-input class="minier-input" style="width:230px" v-model="listQuery.equipType" placeholder="请输入型号规格" clearable></el-input>
                </el-form-item>
              

           
                <el-form-item label="评价时间" >
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
              
                
               

             
                <el-form-item label="验收情况" prop="acceptanceSituation" > 
                <el-radio v-model="listQuery.acceptanceSituation" label="1">验收通过</el-radio>
                <el-radio v-model="listQuery.acceptanceSituation" label="0">验收不通过</el-radio>
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

               <el-table-column prop="formCode" align="center" label="单据编号" min-width="100">
               <template slot-scope="scope">
                 <span class="link-type futiop" @click='checkDetails(scope.row)'>{{scope.row.formCode}}</span>
               </template>
                 </el-table-column>
               <el-table-column prop="applicationTime" align="center" label="评价时间" min-width="80">
                 </el-table-column>
                 <el-table-column prop="equipName" align="center" label="设备名称" min-width="80">
                 </el-table-column>
                 <el-table-column prop="equipType" align="center" label="型号规格" min-width="80">
                 </el-table-column>
                <el-table-column prop="fixedAssetCode" align="center" label="固定资产编号" min-width="80">
                 </el-table-column>
              <el-table-column prop="serialNumber" align="center" label="出厂编号" min-width="80">
                 </el-table-column>
               <el-table-column prop="transferOutFactoryName" align="center" label="调出工厂" min-width="80">
                </el-table-column>
               <el-table-column prop="useCompanyName" align="center" label="使用公司" min-width="80">
                 </el-table-column>
               <el-table-column prop="useFactoryName" align="center" label="使用工厂" min-width="80">
                 </el-table-column>
               <el-table-column prop="useDepartmentName" align="center" label="使用部门" min-width="80">
                 </el-table-column>
               <el-table-column prop="acceptanceSituationName" align="center" label="验收情况" min-width="80">
                 </el-table-column>
               <el-table-column prop="auditingTypeName" align="center" label="审核状态" min-width="80">
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
              :current-page="listQuery.pageNum" 
              :page-sizes="[5,10,15,20]" 
              :page-size="listQuery.pageSize" 
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
            <!-- @click="handleClickCompany" -->
          <!--  <el-button type="primary">确定</el-button> -->
          </div>
          </el-dialog>



          <!-- 新增和编辑是同一个弹出框 -->
          <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" v-dialogDrag top="8vh" width="1000px" :visible.sync="dialogFormVisible" >
             <!-- 选项卡 -->
            <el-tabs v-model="activeName" v-loading="fromLoading" @tab-click="fathClick">
             <el-tab-pane label="表单信息" name="first">
              <el-form :rules="rules" ref="dataForm" :model="temp" label-width="110px">
              <el-form-item>
                <span class="equip-title">调拨设备质量信息报告待办</span>
              </el-form-item>
              <el-row>
              <el-col :span="8">     
              <el-form-item label="单据编号"  prop="formCode">
              <el-input style="width:290px" v-model="temp.formCode" disabled maxlength="32" class="enter medium-input" placeholder="空" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="评价时间" prop="applicationTime" style="margin-left:200px">
               <div class="block">
                <el-date-picker
                  style="width:290px"
                  v-model="temp.applicationTime"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                   :disabled='portionst?true:false'>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              </el-row>
             
              <el-row>
              <el-col :span="8">     
              <el-form-item label="设备名称"  prop="equipName">
              <el-input style="width:290px" v-model="temp.equipName" :disabled='siteCodeState?true:false' maxlength="32" class="enter medium-input" placeholder="输入设备名称" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="型号规格" prop="equipType" style="margin-left:200px;"> 
              <el-input v-model="temp.equipType" :disabled='siteCodeState?true:false' maxlength="8" style="width:290px" class="enter medium-input" placeholder="请输入型号规格" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">     
              <el-form-item label="固定资产编号" prop="fixedAssetCode">
              <el-input v-model="temp.fixedAssetCode" maxlength="8" :disabled='siteCodeState?true:false' style="width:290px" class="enter medium-input" placeholder="请输入固定资产编号" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="出厂编号" prop="serialNumber" style="margin-left:200px;">
              <el-input v-model="temp.serialNumber" maxlength="8" :disabled='siteCodeState?true:false' style="width:290px" class="enter medium-input" placeholder="请输入出厂编号" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">     
              <el-form-item label="调出工厂" prop="transferOutFactoryName"> 
              <el-input v-model="temp.transferOutFactoryName" :disabled='siteCodeState?true:false' maxlength="8" style="width:290px" class="enter medium-input" placeholder="请输入调出工厂" ></el-input>   
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="使用公司" prop="useCompanyName" style="margin-left:200px;"> 
              <el-input v-model="temp.useCompanyName" maxlength="8" :disabled='siteCodeState?true:false' style="width:290px" class="enter medium-input" placeholder="请输入使用公司" ></el-input>   
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">
              <el-form-item label="使用工厂" prop="useFactoryName"> 
              <el-input v-model="temp.useFactoryName" :disabled='siteCodeState?true:false' maxlength="8" style="width:290px" class="enter medium-input" placeholder="请输入使用工厂" ></el-input>   
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="使用部门" prop="useDepartmentName" style="margin-left:200px"> 
              <el-input v-model="temp.useDepartmentName" :disabled='siteCodeState?true:false' maxlength="8" style="width:290px" class="enter medium-input" placeholder="请输入使用部门" ></el-input>   
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="24">
              <!-- <span style="color:red;position:absolute;bottom:30px;left:0px">*</span> -->
              <el-form-item label="提供资料（必须提供）" prop="documentProvided" label-width="170px">
              <el-checkbox-group v-model="checkList" :disabled='portionst?true:false'>     
                <el-checkbox label="1">设备操作规程</el-checkbox>
                <el-checkbox label="2" style="width:10px">设备维护标准及不按要求维护后果描述</el-checkbox>
               </el-checkbox-group>
               </el-form-item>
              </el-col>
              </el-row>

               <el-row>
               <el-col :span="14">
               <el-form-item label="验收情况" prop="acceptanceSituation"> 
                <el-radio v-model="temp.acceptanceSituation" :disabled='portionst?true:false' label="1">验收通过</el-radio>
                <el-radio v-model="temp.acceptanceSituation" :disabled='portionst?true:false' label="0">验收不通过</el-radio>
              </el-form-item>
              </el-col>
              </el-row>

                <el-form-item label="其他说明" prop="otherDescription" label-width="120px">
               <el-input type="textarea" :disabled='portionst?true:false' style="width:798px" maxlength="200" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入其他说明" v-model="temp.otherDescription">
               </el-input>
              </el-form-item>

               <el-form-item label="设备运行稳定性（用数据说明）" prop="stabilityInfo" label-width="120px">
               <el-input type="textarea" :disabled='portionst?true:false' style="width:798px" maxlength="128" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入设备运行稳定性" v-model="temp.stabilityInfo">
               </el-input>
              </el-form-item>

               <el-form-item label="产品质量情况（用数据说明）" prop="qualityInfo">
               <el-input type="textarea" :disabled='portionst?true:false' style="width:810px" maxlength="128" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入产品质量情况" v-model="temp.qualityInfo">
               </el-input>
              </el-form-item>

               <el-form-item label="设备主要技术指标（达标情况）" prop="mainSpecificationInfo" label-width="120px">
               <el-input type="textarea" :disabled='portionst?true:false' style="width:798px" maxlength="128" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入设备主要起诉指标" v-model="temp.mainSpecificationInfo">
               </el-input>
              </el-form-item>
         
             
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="流转记录" name="second" v-if="roamshow">
             <!-- 流转记录表格 -->
             <el-table :data="circulation" v-loading="listLoading" border fit highlight-current-row
              style="width: 100%;min-height:auto;margin-top:8px" :header-cell-style="{background:'oldlace'}">

                <el-table-column  align="center" label="序号" min-width="48" type="index"></el-table-column>
                
               <el-table-column prop="taskName" align="center" label="步骤名" min-width="112">
                 <template slot-scope="scope">
                 <span>{{scope.row.taskName}}</span>
                 </template>
                </el-table-column>

                <el-table-column prop="userName" align="center" label="操作人" min-width="103">
                 <template slot-scope="scope">
                 <span>{{scope.row.userName}}</span>
                 </template>
                </el-table-column>

                <el-table-column prop="orgName" align="center" label="所在部门" min-width="103">
                 <template slot-scope="scope">
                 <span>{{scope.row.orgName}}</span>
                 </template>
                </el-table-column>

                <el-table-column prop="stationName" align="center" label="岗位" min-width="103">
                 <template slot-scope="scope">
                 <span>{{scope.row.stationName}}</span>
                 </template>
                </el-table-column>

                 <el-table-column prop="state" align="center" label="状态" min-width="103">
                 <template slot-scope="scope">
                 <span>{{scope.row.state}}</span>
                 </template>
                </el-table-column>

                 <el-table-column prop="opinion" align="center" label="意见" min-width="103">
                 <template slot-scope="scope">
                 <span>{{scope.row.opinion}}</span>
                 </template>
                </el-table-column>

                <el-table-column prop="dateTime" align="center" label="时间" min-width="155">
                 <template slot-scope="scope">
                 <span>{{scope.row.dateTime}}</span>
                 </template>
                </el-table-column>

                 <el-table-column prop="remark" align="center" label="备注" min-width="129">
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
import { fetchListdsy, evaluate, circuList, fetchList, consentToreturn, getNodeTask, refto, getCurrentUser } from '@/api/allocationProcess/qualitybTobedone'
import waves from '@/directive/waves' // 水波纹指令
import { flowsheet } from '@/api/allocationProcess/migration'
import { fetchButton } from '@/api/common/button'
import { choosePersonList, fetchChooseTree, transferList } from '@/api/common/common'

export default {
  name: 'qualitybTobedone',
  directives: {
    waves
  },
  data() {
    return {
      value13: [],
      checkList: [], // 复选框
      listyst: [],
      lookList: [],
      circulation: [], // 流转记录
      porisgid: '', // 流转记录接口传参
      cheid: '',
      grite: '',
      total: null,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        handleType: 1
      },
      // 编辑的字段设置
      temp: {

      },
      // 文件数据
      fileData: [],
      fileName: undefined,
      fileNameSC: undefined, // 文件名称
      fileUrl: undefined, // 文件URL
      documenyt: '', // 单据编码的赋值
      userId: undefined, // 用户id
      idli: '', // 表格id

      activeName: 'first', // 选项卡默认选项
      roamshow: false, // 流转记录隐藏
      // 弹框显示
      dialogFormVisible: false,
      postylitys: false, // 同意弹框的打开
      noeli: {
        opinion: ''// 同意里的意见字段
      },
      hold1: false, // 同意按钮

      hold2: false, // 退回按钮
      submitlist: false, // 退回时的提交按钮
      affirmshow1: false, // 同意中的确认按钮
      affirmshow2: false, // 退回中的确认按钮
      taskid: '', // 在查看里获取taskId

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
      chartData: '', // 流程图
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
      portionst: '', // 禁用

      // 弹框内输入框不填显示的提示信息
      rules: {
        applicationTime: [{ required: true, message: '请填写', trigger: 'change' }],
        //  documentProvided: [{ required: true, message: '请选择', trigger: 'change' }],
        acceptanceSituation: [{ required: true, message: '请选择', trigger: 'change' }],
        stabilityInfo: [{ required: true, message: '请填写', trigger: 'change' }],
        qualityInfo: [{ required: true, message: '请填写', trigger: 'change' }],
        mainSpecificationInfo: [{ required: true, message: '请填写', trigger: 'change' }],
        equipName: [{ required: true, message: '请填写', trigger: 'change' }],
        equipType: [{ required: true, message: '请填写', trigger: 'change' }],
        fixedAssetCode: [{ required: true, message: '请填写', trigger: 'change' }],
        serialNumber: [{ required: true, message: '请填写', trigger: 'change' }],
        transferOutFactoryName: [{ required: true, message: '请填写', trigger: 'change' }],
        useFactoryName: [{ required: true, message: '请填写', trigger: 'change' }],
        useDepartmentName: [{ required: true, message: '请填写', trigger: 'change' }]
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
    //  this.getbttonst()
  },

  methods: {

    // 表格的接口
    getAA() {
      this.listLoading = true
      fetchListdsy(this.listQuery).then(response => {
        this.listyst = response.data.data.list
        console.log(this.listyst)
        for (var i = 0; i < this.listyst.length; i++) {
          if (this.listyst[i].acceptanceSituation == 1) {
            this.listyst[i].acceptanceSituationName = '验收通过'
          } else if (this.listyst[i].acceptanceSituation == 0) {
            this.listyst[i].acceptanceSituationName = '验收不通过'
          }
          console.log(this.listyst[i].auditingType)
		 if (this.listyst[i].auditingType == 2) {
            this.listyst[i].auditingTypeName = '审核中'
            this.listyst[i].stateshow = true
            this.listyst[i].deleshow = true
            console.log(111)
          } else if (this.listyst[i].auditingType == 1) {
            this.listyst[i].auditingTypeName = '未提交'
            this.listyst[i].stateshow = false
            this.listyst[i].deleshow = false
	   } else if (this.listyst[i].auditingType == 3) {
            this.listyst[i].auditingTypeName = '审核通过'
            this.listyst[i].stateshow = true
            this.listyst[i].deleshow = true
	   } else if (this.listyst[i].auditingType == 4) {
            this.listyst[i].auditingTypeName = '审核不通过'
            this.listyst[i].stateshow = true
            this.listyst[i].deleshow = true
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
        this.listQuery.applyStartTime = ''
        this.listQuery.applyEndTime = ''
      } else {
        this.listQuery.applyStartTime = this.value13[0]// 开始时间
        this.listQuery.applyEndTime = this.value13[1]
      }
    },

    // 搜索
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getAA()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getAA()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
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
      console.log(row)
      const id = row.id
      this.idli = row.id
      this.taskid = row.taskId// 获取taskId
      this.porisgid = row.processInstanceId
      this.documenyt = row.formCode // 单据编码的赋值
      this.dialogStatus = 'detail'
      this.dialogFormVisible = true
      this.siteCodeState = true
      this.activeName = 'first'// 选项卡默认选项
      console.log(229929999999000)
      console.log(row)

      if (row.taskName == '调整申请') {
        this.hold1 = false// 同意按钮
        this.hold2 = false// 退回按钮
        this.submitlist = true // 退回的时候提交按钮
        this.portionst = false// 这个是可以编辑的在这个节点
      } else {
        this.hold1 = true// 同意按钮
        this.hold2 = true// 退回按钮
        this.submitlist = false // 退回的时候提交按钮
        this.portionst = true
      }

      this.fromLoading = false// 弹窗加载动画
      this.roamshow = true// 流转记录显示

      evaluate(id).then(response => {
        if (response.data.code == 200) {
          this.lookout = response.data.data
          this.temp = Object.assign({}, this.lookout)
          this.temp.applicationTime = this.temp.applicationTime.substring(0, 10)
          var po = []// 复选框的转换方式
          po.push(this.temp.documentProvided)
          console.log(po.join(',').split(','))
          this.checkList = po.join(',').split(',')
          if (this.temp.acceptanceSituation !== null) {
            this.temp.acceptanceSituation = this.temp.acceptanceSituation.toString()// 单选框判null
          }
          console.log(this.temp.acceptanceSituation)
        }
      })

      this.circulationlist()
      this.getusesty()// 获取用户
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
            console.log(response)
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

    //  退回的时候就要能编辑而且按钮变为提交按钮
    submData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          console.log(123456)
          console.log(this.temp)
          this.temp.taskId = this.taskid
          this.temp.id = this.idli
          const tempData = Object.assign({}, this.temp)
          console.log(tempData)
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
        console.log(444444444)
        console.log(response.data.data)
        console.log(response.data.data.sysCurrentPersonDTO.orgCode)
        const orgsty = response.data.data.sysCurrentPersonDTO.orgCode
        if (orgsty == '资产部') {
          this.disposalForm = false
        }
      })
    },

    // 同意按钮弹出框
    saveData() {
      this.noeli.opinion = ''
      this.postylitys = true
      this.dialogStatus = 'update'
      this.affirmshow1 = true
      this.affirmshow2 = false
      this.$nextTick(() => {
        this.$refs['dataFormsty'].clearValidate()
      })
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
          console.log(noeliData)
          noeliData.processInstanceId = this.porisgid
          noeliData.leaderPass = true
          noeliData.taskId = this.taskid
          console.log(12333333)
          console.log(noeliData)
          consentToreturn(noeliData).then(response => {
            if (response.data.code == 200) {
              this.postylitys = false
              this.getAA()
              this.dialogFormVisible = false
              this.$message({
                title: '成功',
                message: '同意成功',
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
          console.log(noeliData)
          noeliData.processInstanceId = this.porisgid
          noeliData.leaderPass = false
          noeliData.taskId = this.taskid
          console.log(12333333)
          console.log(noeliData)
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
                message: response.data.msg,
                type: 'warning',
                duration: 3000
              })
            }
          })
        }
      })
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
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
@page {
  size: A4 portrait;
}
    
</style>
