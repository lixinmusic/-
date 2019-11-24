<template>
  <div class="app-container">
    <!--外部容器 -->
    <el-container>
       <!-- 顶部搜索 -->
     
        <div class="filter-container">
            <div class="formSearch">
            <el-form :inline="true">
              
                <el-form-item label="单据编号" >
                <el-input v-model="listQuery.formCode"  placeholder="请输入单据编号" clearable></el-input>
                </el-form-item>
                

              
                <el-form-item label="固定资产编号" >
                <el-input class="minier-input" style="width:213px" v-model="listQuery.fixedAssetCode" placeholder="请输入固定资产编号" clearable></el-input>
                </el-form-item>
               

             
                <el-form-item label="设备名称" >
                <el-input class="minier-input" style="width:213px" v-model="listQuery.equipmentName" placeholder="请输入设备名称" clearable></el-input>
                </el-form-item>
                

               
                <el-form-item label="出库日期">
                <div class="block">
                    <el-date-picker
                    style="width:250px"
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
              

             
                <el-form-item label="出库状态" prop="outWarehouse" > 
                <el-radio v-model="listQuery.outWarehouse" label="true">已出库</el-radio>
                <el-radio v-model="listQuery.outWarehouse" label="false">未出库</el-radio>
                </el-form-item>
               
                <el-form-item>
                <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
                </el-form-item>
                
            </el-form>
            </div>
            <!-- </v-pageSearch> -->
        </div>
     
      <!-- 内容容器 -->
    
          <!-- 主要区域容器 -->
          <el-main style="padding:20px 0px">
           
            <el-table :data="listyst" v-loading="listLoading" border fit highlight-current-row
              style="width: 100%;min-height:auto;margin-top:0px" height="500" :header-cell-style="{background:'oldlace'}">

              <el-table-column prop="formCode" align="center" label="单据编号" fixed="left" min-width="100">
               <template slot-scope="scope">
                 <span class="link-type futiop" @click='checkDetails(scope.row)'>{{scope.row.formCode}}</span>
               </template>
               </el-table-column>
                 <el-table-column prop="fixedAssetCode" align="center" label="固定资产编号" min-width="80">
                 </el-table-column>
                 <el-table-column prop="equipmentName" align="center" label="设备名称" min-width="80">
                 </el-table-column>
                 <el-table-column prop="model" align="center" label="型号规格" min-width="80">
                 </el-table-column>
                  <el-table-column prop="applyDate" align="center" label="申请日期" min-width="80">
                  <template slot-scope="scope">
                  {{scope.row.applyDate!==null?scope.row.applyDate.substring(0,10):''}}
                 </template> 
                 </el-table-column>
                 <el-table-column prop="outWarehouse" align="center" label="出库状态" min-width="80">
                 <template slot-scope="scope">
                 {{scope.row.outWarehouse == true ?'已出库':'未出库'}}
                 </template>
                 </el-table-column>
                  <el-table-column prop="outWarehouseDate" align="center" label="出库日期" min-width="80">
                  <template slot-scope="scope">
                  {{scope.row.outWarehouseDate!==null?scope.row.outWarehouseDate.substring(0,10):''}}
                 </template>
                 </el-table-column>
              
            </el-table>
          </el-main>
          <!-- 底栏容器 -->
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

           <!-- 新增和编辑是同一个弹出框 -->
          <el-dialog title="查看详情" top="8vh" v-dialogDrag width="700px" :visible.sync="dialogFormVisible">
              <!-- 选项卡 -->
        <el-tabs v-model="activeName" v-loading="fromLoading"><!-- @tab-click="handleClick" -->
          <el-tab-pane label="表单信息" name="first">
          <!-- 选项卡表格 -->
            <el-form :rules="rules" ref="dataForm" :model="temp" label-width="110px">
              <el-row>
              <el-form-item>
                <span class="equip-title">闲置处置出库单</span>
              </el-form-item>
              <el-col :span="8">     
              <el-form-item label="单据编号"  prop="formCode">
              <el-input style="width:190px" v-model="temp.formCode" disabled maxlength="32" class="enter medium-input" placeholder="空" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="固定资产编号" prop="fixedAssetCode" style="margin-left:100px;"> 
              <el-input v-model="temp.fixedAssetCode" :disabled='siteCodeState?true:false' maxlength="8" style="width:190px" class="enter medium-input" placeholder="请输入固定资产编号" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>
             
              <el-row>
              <el-col :span="8">     
              <el-form-item label="原使用部门"  prop="divisionName">
              <el-input style="width:190px" v-model="temp.divisionName" :disabled='siteCodeState?true:false' maxlength="32" class="enter medium-input" placeholder="输入原使用部门" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="申请日期" prop="applyDate" style="margin-left:100px">
               <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.applyDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  
                   :disabled='siteCodeState?true:false'>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              </el-row>

               <el-form-item label="存放地点" prop="storeAddress">
                <el-input type="textarea" style="width:510px" :disabled='siteCodeState?true:false' maxlength="128" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入存放地点..." v-model="temp.storeAddress">
                </el-input>
              </el-form-item>
              
              <el-row>
              <el-col :span="8">     
              <el-form-item label="设备名称" prop="equipmentName">
              <el-input v-model="temp.equipmentName" maxlength="8" :disabled='siteCodeState?true:false' style="width:190px" class="enter medium-input" placeholder="请输入设备名称" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="型号规格" prop="model" style="margin-left:100px;">
              <el-input v-model="temp.model" maxlength="8" :disabled='siteCodeState?true:false' style="width:190px" class="enter medium-input" placeholder="请输入型号规格" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">     
              <el-form-item label="采购时间" prop="purchaseDate"> 
              <el-input v-model="temp.purchaseDate" :disabled='siteCodeState?true:false' maxlength="8" style="width:190px" class="enter medium-input" placeholder="请输入采购时间" ></el-input>   
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="数量" prop="number" style="margin-left:100px;"> 
              <el-input v-model="temp.number" maxlength="8" :disabled='siteCodeState?true:false' style="width:190px" class="enter medium-input" placeholder="请输入数量/台" ></el-input>   
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">
              <el-form-item label="采购金额" prop="equipmentPrice"> 
              <el-input v-model="temp.equipmentPrice" :disabled='siteCodeState?true:false' maxlength="8" style="width:190px" class="enter medium-input" placeholder="请输入采购金额" ></el-input>   
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="账面净值" prop="netBookValue" style="margin-left:100px"> 
              <el-input v-model="temp.netBookValue" :disabled='siteCodeState?true:false' maxlength="8" style="width:190px" class="enter medium-input" placeholder="请输入账面净值" ></el-input>   
              </el-form-item>
              </el-col>
              </el-row>

               <el-form-item label="备注" prop="remark">
                <el-input type="textarea" style="width:510px" :disabled='siteCodeState?true:false' maxlength="128" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入备注..." v-model="temp.remark">
                </el-input>
              </el-form-item>

               <el-form-item label="制造厂家" prop="manufacturer">
                <el-input type="textarea" style="width:510px" :disabled='siteCodeState?true:false' maxlength="128" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入制造厂家..." v-model="temp.manufacturer">
                </el-input>
              </el-form-item>

               <el-form-item label="处置原因及目的（详细说明）" prop="handleReasonGoal">
                <el-input type="textarea" style="width:510px" :disabled='siteCodeState?true:false' maxlength="128" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入处置原因及目的..." v-model="temp.handleReasonGoal">
                </el-input>
              </el-form-item>
              <el-row>
               <el-col :span="24">
               <el-form-item label="处置形式" prop="handleType"> 
                <el-radio v-model="temp.handleType" :disabled='disposalForm?true:false' label="1" @change="kess">报废/出售</el-radio>
                <el-radio v-model="temp.handleType" :disabled='disposalForm?true:false' label="2" style="margin-left:190px" @change="placing">抵款</el-radio>
                </el-form-item>
                </el-col>
                </el-row>
 
                <el-row>
                <el-form-item label="预计的清理费用和清理收入说明" prop="clearingExpense" style="float:left">
                <el-input type="textarea" :rows="10" style="width:190px;" maxlength="128" placeholder="请输入备注..." v-model="temp.clearingExpense" :disabled='dlestly?true:false'>
                </el-input>
                </el-form-item>
               
                
                <el-form-item label="买方单位" prop="buyCompany" style="float:right;margin-right:40px">
                <el-input v-model="temp.buyCompany" maxlength="8" :disabled='dlisCodeState?true:false' style="width:190px" class="enter medium-input" placeholder="请输入买方单位" ></el-input>
                </el-form-item>
               
                <el-form-item label="购买用途" prop="buyPurpose" style="float:right;margin-right:40px">
                <el-input v-model="temp.buyPurpose" maxlength="8" :disabled='dlisCodeState?true:false' style="width:190px" class="enter medium-input" placeholder="请输入购买用途" ></el-input>
                </el-form-item>

                  <el-form-item label="估计金额" prop="evaluateMoney" style="float:right;margin-right:40px">
                <el-input v-model="temp.evaluateMoney" maxlength="8" :disabled='dlisCodeState?true:false' style="width:190px" class="enter medium-input" placeholder="请输入估计金额" ></el-input>
                </el-form-item>

                 <el-form-item label="出售工厂" prop="saleFactory" style="float:right;margin-right:40px">
                <el-input v-model="temp.saleFactory" maxlength="8" :disabled='dlisCodeState?true:false' style="width:190px" class="enter medium-input" placeholder="请输入出售工厂" ></el-input>
                </el-form-item>
              </el-row>

              <el-row>
              <el-col :span="18">
              <el-form-item label="附件上传" class="sepost" label-width="130px">
               
             <!--  <input id="uploadImg" type="file" @change="fileUpload"> -->
              </el-form-item>
              </el-col>
               </el-row> 
              <!--第一个小表格 -->
               <el-table :data="smallslist" border fit highlight-current-row
              style="width: 100%;min-height:auto;margin-top:8px" :header-cell-style="{background:'oldlace'}">

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

                <el-table-column align="center" label="操作" min-width="219"  class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-button title="下载" type="primary" @click="downloadsty(scope.row)" size="small" icon="el-icon-download"></el-button>
                  <el-button title="删除" type="danger" @click="smalldelest(scope.row)" icon="el-icon-delete" size="small" v-show="newapps"></el-button>
                   <el-button title="删除" type="danger" @click="updatadelest(scope.row)" icon="el-icon-delete" size="small" v-show="updelests"></el-button>
               
                  </template>
                 </el-table-column> 
                </el-table>

              </el-form>
            </el-tab-pane>

            <!-- 选项卡流转记录 -->
            <el-tab-pane label="流转记录" name="second" v-if="showpos">
               <!-- 流转记录表格 -->
             <el-table :data="circulation" v-loading="listLoading" border fit highlight-current-row
              style="width: 100%;min-height:auto;margin-top:8px" :header-cell-style="{background:'oldlace'}">

                <el-table-column  align="center" label="序号" min-width="50" type="index"></el-table-column>
                
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

            </el-tabs>
            <el-form class="buttonlist">
             <el-form-item>
            <el-button @click="dialogFormVisible = false" type="primary" size="mini">返回</el-button>
            <el-button type="primary" @click="saveData" size="mini" v-show="confirm1">确认出库</el-button>
             <el-button type="primary" size="mini" v-show="confirm2" :disabled='CodeState?true:false'>已出库</el-button>
            </el-form-item>  
            </el-form>
          </el-dialog>
     
        </el-container>
  </div>
</template>

<script>
import {fetchList,circuList,confirmation,evaluate,uploadlist,insertFile,smallAblist,getCurrentUser}from '@/api/idleProcess/eidlbeHandle'
import waves from '@/directive/waves' // 水波纹指
export default {
  name: 'eidlbeHandle',
  directives: {
    waves
  },
  data() {
    return {
      styid:'',  
      value13:[],
       documentW:'',
      listyst: [],
      lookList: [],
      circulation:[],//流转记录
      lookuplist:'',//查看里的id接口数据
      porisgid:'',
      grite: '',
      total: null,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        formType:2
      },
      activeName: 'first',//选项卡默认选项
      dlestly:'',//单选项（报废/损失）
      dlisCodeState:'',//单选项（出售）
      disposalForm:true,//单选按钮的显隐
      showpos:false,
      // 编辑和新增的字段设置
      temp: {
      
      },
      noeli:{  
        opetion:''//同意里的意见字段
      },
     smallslist:[],//第一个小表格1
     newapps:false,//一号小表格删除按钮
     updelests:false,//一号小表格删除按钮
     confirm1:false,//隐藏
     confirm2:false, //隐藏
     CodeState:false,//隐藏
      // 文件数据
      fileData: [],
      fileName: undefined,
      fileNameSC: undefined, // 文件名称
      fileUrl: undefined, // 文件URL
      documenyt:'',//单据编码的赋值
      userId:undefined,//用户id

      // 弹框显示
      dialogFormVisible: false,
      postylitys:false,
      affirmshow1:false,
      affirmshow2:false,
      popTitle: '',
      dialogStatus: '',
    
      isAdd: false, // 新增or编辑
      siteDetail: false, // 新增、编辑弹窗
      editLoading: false, // 提交按钮加载动画
      showStatus: true, // 表单项显示状态
      formSearch_send: false, // 查询条件点选
      listLoading: true, // 远程搜索加载动画
      fromLoading:true,//弹出框加载动画
      dialogPvVisible: false,
      dialoglookVisible: false, // 弹窗属性
      siteCodeState: '', // 岗位编码禁用状态
      // 弹框内输入框不填显示的提示信息
       rules: {
        storeAddress: [{ required: true, message: '请填写...', trigger: 'change' }],
        handleReasonGoal: [{ required: true, message: '请填写...', trigger: 'change' }]
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
  },
  methods: {
    // 表格的接口
    getAA() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.listyst = response.data.data.results
        this.total = response.data.data.total
        //   this.listLoading = false
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 1000)
      })
    },
 
      // 日期  搜索
   searchsty(){
        // 出库日期时间  搜索
      if(this.value13==null){
         this.listQuery.outWarehouseDateStart=''
         this.listQuery.outWarehouseDateEnd=''
      }else{
        this.listQuery.outWarehouseDateStart = this.value13[0]// 开始时间
        this.listQuery.outWarehouseDateEnd = this.value13[1]
      }
   },
     // 查看
    checkDetails(row) {
      this.dialogFormVisible = true
      this.styid = row.id
      const id = row.id
      this.dlestly = true//单选项（报废/损毁）
      this.dlisCodeState = true//单选框（出售）
      this.fromLoading = false//弹窗加载动画
      if(row.outWarehouse == true){//已出库
        this.confirm1 = false
        this.confirm2 = true
        this.CodeState = true
      }else if(row.outWarehouse == false){
       this.confirm1 = true
        this.confirm2 = false
      }
      console.log(9999999)
      this.getusesty()//获取用户
      // console.log(this.porisgid)
      evaluate(id).then(repanst => {
        console.log(repanst.data.data)
        if(repanst.data.code==200){
         this.lookuplist = repanst.data.data
         this.temp = Object.assign({}, this.lookuplist)
          if (this.temp.handleType !== null) {
            this.temp.handleType = this.temp.handleType.toString()// 单选框判null
            console.log(this.temp.handleType)
          }
        }
      })
     // 第一个小表格接口
          const samllblist={
            moduleType:11,
            attachmentCode:"XZSBCZSQDFJ",
            documentWordCode:row.formCode
          }
        smallAblist(samllblist).then(response => {
          this.smallslist = response.data.data
        })
      console.log(23456789)
      console.log(this.temp)
      this.dialoglookVisible = true
      this.siteCodeState = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
      // 单选项触发的事件(报废/损毁)
      kess(){
       this.dlestly = false
       this.dlisCodeState = true
       this.temp.buyCompany = ''
       this.temp.buyPurpose = ''
       this.temp.evaluateMoney = ''
       this.temp.saleFactory = ''
      },  
       // 单选项触发的事件(出售)
      placing(){
      this.dlestly = true
      this.dlisCodeState = false
      this.temp.clearingExpense = ''
      },

      // 获取当前用户信息
    getusesty(){
       getCurrentUser().then(response => {
        this.userId = response.data.data.id
        console.log(444444444)
        console.log(response.data.data)
        console.log(response.data.data.sysCurrentPersonDTO.orgCode)
        const orgsty = response.data.data.sysCurrentPersonDTO.orgCode
        if(orgsty == '资产部'){
           this.disposalForm = false
        }
      })
    },
  //  确认接收按钮
  saveData(){
     this.$refs['dataForm'].validate(valid => {
        if (valid) {
          console.log(this.styid)
            const ids = this.styid
            this.fromLoading = true//弹窗加载动画
          confirmation(ids).then(repost => {
            const masg = repost.data.data
    /*  if(masg == null){
       console.log(12234)
         this.$notify({
          title: '警告',
          message: repost.data.msg,
          type: 'warning',
          duration: 3000
         })
        return
     } */
      if(repost.data.code==200){
        this.$message({
         title: '成功',
         message: repost.data.msg ,
         type: 'success',
         duration: 2000
         })
           
           this.getAA()
           setTimeout(() => {
              this.fromLoading = false
            }, 1 * 500)
       }else{
         this.$notify({
         title: '警告',
         message: repost.data.msg,
         type: 'warning',
         duration: 3000
          })
         }
         this.dialogFormVisible = false
         })
        }
      })
     },

     // 第一个小表格接口 getlistsamll()    getlisttwo()
        getlistsamll(){  
          const samllblist={
            moduleType:11,
            attachmentCode:"XZSBCZSQDFJ",
            documentWordCode:this.documenyt
          }
        smallAblist(samllblist).then(response => {
          this.smallslist = response.data.data
        })
        },
    // 第一个文件上传
    fileUpload(e){
     console.log(1234)
      const file = e.target.files[0]
      console.log(file)
       const fileData1 = {
        attachmentCode: 'XZSBCZSQDFJ',
        moduleType: '11',
        fileName: undefined,
        filePath: undefined, // 文件URL
        node: '开始'
        /* code:this.documenyt//单据编码 */
      }   
      if (file != null) {
        const param = new FormData() // 创建form对象
        param.append('file', file, file.name) // 通过append向form对象添加数据
        this.fileName = file.name
        fileData1.fileName = file.name
        console.log(file.name)
        uploadlist(param).then(resp => { // 调用上传接口
          if (resp.data.code == 200) {
            fileData1.filePath = resp.data.data.remoteFilename //文件地址
            if(this.dialogStatus == 'update'){
              insertFile(fileData1).then(response => {
                if(response.data.code == 200){
                  this.$message({
                    title: '成功',
                    message: '上传成功',
                    type: 'success',
                    duration: 2000
                  })
                  this.getlistsamll()
                   const test = document.getElementById('uploadImg');
                   test.value = '';
                }
              })

            }else if(this.dialogStatus == 'create'){
              this.smallslist.push(fileData1)
               this.$message({
                  title: '成功',
                  message: '上传成功',
                  type: 'success',
                  duration: 2000
            })
            const test = document.getElementById('uploadImg');
            test.value = '';
           }
          } else {
            this.$notify({
              title: '警告',
              message: '上传失败',
              type: 'warning',
              duration: 3000
            })
          }
        })  
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
          </style>
