<template>
  <div class="app-container">
    <!--外部容器 -->
    <el-container>
       <!-- 顶部搜索 -->

        <div class="filter-container">
            <div class="formSearch">
            <el-form :inline="true">
              
                 
                <el-form-item label="设备名称" >
                <el-input v-model="listQuery.equipName"  placeholder="请输入设备名称" clearable></el-input>
                </el-form-item>
               

               
                <el-form-item label="固定资产编号" >
                <el-input class="minier-input" v-model="listQuery.fixedAssetCode" placeholder="请输入固定资产编号" clearable></el-input>
                </el-form-item>
               

              
                <el-form-item label="验收完成时间" >
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
            

              
                <el-form-item label="验收情况" prop="acceptanceInfo"> 
                <el-radio v-model="listQuery.acceptanceInfo" label="1">验收通过</el-radio>
                <el-radio v-model="listQuery.acceptanceInfo" label="2">验收不通过</el-radio>
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
           
            <el-table :data="listyst" v-loading="listLoading" border fit highlight-current-row
              style="width: 100%;min-height:auto;margin-top:0px" height="500" :header-cell-style="{background:'oldlace'}">


               <el-table-column prop="documnetCode" align="center" label="单据编码" min-width="100">
               <template slot-scope="scope">
                 <span class="link-type futiop" @click='checkDetails(scope.row)'>{{scope.row.documnetCode}}</span>
               </template>
                 </el-table-column>
                <el-table-column prop="equipmentName" align="center" label="设备名称" min-width="80">
                 </el-table-column>
              <el-table-column prop="model" align="center" label="型号规格" min-width="80">
                 </el-table-column>
               <el-table-column prop="fixedAssetCode" align="center" label="固定资产编号" min-width="80">
                </el-table-column>
                 <el-table-column prop="serialNumber" align="center" label="出厂编号" min-width="80">
                 </el-table-column>
               <el-table-column prop="contractNumber" align="center" label="合同编号" min-width="80">
                 </el-table-column>
               <el-table-column prop="buyers" align="center" label="供应商" min-width="80">
                 </el-table-column>
               <el-table-column prop="filingNumber" align="center" label="备案编号" min-width="80">
                 </el-table-column>
               <el-table-column prop="companyName" align="center" label="使用公司" min-width="80">
                 </el-table-column>
               <el-table-column prop="factoryName" align="center" label="使用工厂" min-width="80">
                 </el-table-column>
               <el-table-column prop="divisionName" align="center" label="使用车间" min-width="80">
                 </el-table-column>
               <el-table-column prop="acceptanceDate" align="center" label="验收完成时间" min-width="80">
                 </el-table-column>
               <el-table-column prop="acceptanceInfoName" align="center" label="验收情况" min-width="80">
                 </el-table-column>
               <el-table-column prop="checkStartName" align="center" label="审核状态" min-width="80">
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
              :current-page="pageNum" 
              :page-sizes="[5,10,15,20]" 
              :page-size="pageSize" 
              layout="total, sizes, prev, pager, next, jumper" 
              :total="total">
              </el-pagination>
            </div>
          </el-footer>

           <!-- 新增和编辑是同一个弹出框 -->
          <el-dialog title="查看详情" v-dialogDrag top="8vh" width="1000px" :visible.sync="dialogFormVisible">
              <!-- 选项卡 -->
        <el-tabs v-model="activeName" v-loading="fromLoading" @tab-click="fathClick"><!-- @tab-click="handleClick" -->
          <el-tab-pane label="表单信息" name="first" >
          <!-- 选项卡表格 -->
            <el-form :rules="rules" ref="dataForm" :model="temp" label-width="110px">
              <el-form-item>
                <span class="equip-title">设备维修质量验收单待办</span>
              </el-form-item>

              <el-row>
              <el-col :span="8">     
              <el-form-item label="单据编码"  prop="documnetCode">
              <el-input style="width:290px" v-model="temp.documnetCode" disabled maxlength="32" class="enter medium-input" placeholder="空" ></el-input>
              </el-form-item>
              </el-col>
               <el-col :span="16">
              <el-form-item label="设备名称" prop="equipmentName" style="margin-left:200px;"> 
              <el-input v-model="temp.equipmentName" :disabled='siteCodeState?true:false' maxlength="8" style="width:290px" class="enter medium-input" placeholder="请输入设备名称" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>
             
              <el-row>
              <el-col :span="8">     
              <el-form-item label="型号规格"  prop="model">
              <el-input style="width:290px" v-model="temp.model" :disabled='siteCodeState?true:false' maxlength="32" class="enter medium-input" placeholder="输入型号规格" ></el-input>
              </el-form-item>
              </el-col>
               <el-col :span="16">
              <el-form-item label="固定资产编号" prop="fixedAssetCode" style="margin-left:200px;"> 
              <el-input v-model="temp.fixedAssetCode" :disabled='siteCodeState?true:false' maxlength="8" style="width:290px" class="enter medium-input" placeholder="请输入固定资产编号" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>
              
              <el-row>
              <el-col :span="8">     
              <el-form-item label="出厂编号" prop="serialNumber">
              <el-input v-model="temp.serialNumber" maxlength="8" :disabled='siteCodeState?true:false' style="width:290px" class="enter medium-input" placeholder="请输入出厂编号" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="合同编号" prop="contractNumber" style="margin-left:200px;">
              <el-input v-model="temp.contractNumber" maxlength="8" :disabled='siteCodeState?true:false' style="width:290px" class="enter medium-input" placeholder="请输入合同编号" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">     
              <el-form-item label="供应商" prop="buyers"> 
              <el-input v-model="temp.buyers" :disabled='siteCodeState?true:false' maxlength="8" style="width:290px" class="enter medium-input" placeholder="请输入供应商" ></el-input>   
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="备案编号" prop="filingNumber" style="margin-left:200px;"> 
              <el-input v-model="temp.filingNumber" maxlength="8" :disabled='siteCodeState?true:false' style="width:290px" class="enter medium-input" placeholder="请输入备案编号" ></el-input>   
              </el-form-item>
              </el-col>
              </el-row>

               <el-row>
              <el-col :span="8">     
              <el-form-item label="使用公司" prop="companyName"> 
              <el-input v-model="temp.companyName" :disabled='siteCodeState?true:false' maxlength="8" style="width:290px" class="enter medium-input" placeholder="请输入使用公司" ></el-input>   
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="使用工厂" prop="factoryName" style="margin-left:200px;"> 
              <el-input v-model="temp.factoryName" maxlength="8" :disabled='siteCodeState?true:false' style="width:290px" class="enter medium-input" placeholder="请输入使用工厂" ></el-input>   
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">
              <el-form-item label="使用车间" prop="divisionName"> 
              <el-input v-model="temp.divisionName" :disabled='siteCodeState?true:false' maxlength="8" style="width:290px" class="enter medium-input" placeholder="请输入使用公司" ></el-input>   
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="验收完成时间" prop="acceptanceDate" style="margin-left:200px">
               <div class="block">
                <el-date-picker
                  style="width:290px"
                  v-model="temp.acceptanceDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  
                   :disabled='siSte?true:false'>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              </el-row>

              
               <el-row>
              <el-col :span="14">
              <el-form-item label="验收情况" prop="acceptanceInfo"> 
                <el-radio v-model="temp.acceptanceInfo" :disabled='siSte?true:false' label="1">验收通过</el-radio>
                <el-radio v-model="temp.acceptanceInfo" :disabled='siSte?true:false' label="2">验收不通过</el-radio>

                </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="18">
              <el-form-item label="设备维修质量验收单" class="sepost" label-width="140px">
               
              <!-- <input class="uploadInput" id="uploadImg" ref="uploadImg" type="file" accept="image/gif,image/jpg,image/png,/image/gif,image/jpeg" @change="noticeUpload"> -->
              <input id="uploadImg" type="file" @change="noticeUpload">
              </el-form-item>
              </el-col>
               </el-row> 
              <!-- 第一个小表格 -->
               <el-table :data="smallslist" v-loading="listLoading" border fit highlight-current-row
              style="width: 100%;min-height:auto;margin-top:8px" :header-cell-style="{background:'oldlace'}">

                <el-table-column prop="fileName" align="center" label="文件名" min-width="323">

                 <template slot-scope="scope">
                 <span>{{scope.row.fileName}}</span>
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
                
              <el-form-item label="设备检修记录单附件" class="sepost" label-width="140px">
               <input id="twoupload" type="file" @change="twofileUp">

              </el-form-item>
                <!--第二个小表格 -->
               <el-table :data="towlistdata" v-loading="listLoading" border fit highlight-current-row
              style="width: 100%;min-height:auto;margin-top:8px" :header-cell-style="{background:'oldlace'}">

                <el-table-column prop="fileName" align="center" label="文件名" min-width="323">

                 <template slot-scope="scope">
                 <span>{{scope.row.fileName}}</span>
                 </template>
                 </el-table-column>
                 <el-table-column prop="node" align="center" label="上传节点" min-width="318">

                 <template slot-scope="scope">
                 <span>{{scope.row.node}}</span>
                 </template>
                 </el-table-column>

                <el-table-column align="center" label="操作" min-width="318"  class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-button title="下载" type="primary" @click="twodown(scope.row)" size="small" icon="el-icon-download"></el-button>
                  <el-button title="删除" type="danger" @click="twodelest(scope.row)" icon="el-icon-delete" size="small" :disabled="scope.row.deleteDisabled?true:false"></el-button>

               
                  </template>
                 </el-table-column>
                </el-table>




              </el-form>
            </el-tab-pane>

            <!-- 选项卡流转记录 -->
            <el-tab-pane label="流转记录" name="second">
               <!-- 流转记录表格 -->
             <el-table :data="circulation" v-loading="listLoading" border fit highlight-current-row
              style="width: 100%;min-height:auto;margin-top:8px" :header-cell-style="{background:'oldlace'}">

                <el-table-column  align="center" label="序号" min-width="48" type="index"></el-table-column>
                
               <el-table-column prop="taskName" align="center" label="步骤名" min-width="126">

                 <template slot-scope="scope">
                 <span>{{scope.row.taskName}}</span>
                 </template>
                </el-table-column>

                <el-table-column prop="userName" align="center" label="操作人" min-width="119">

                 <template slot-scope="scope">
                 <span>{{scope.row.userName}}</span>
                 </template>
                </el-table-column>

                <el-table-column prop="orgName" align="center" label="所在部门" min-width="119">

                 <template slot-scope="scope">
                 <span>{{scope.row.orgName}}</span>
                 </template>
                </el-table-column>

                <el-table-column prop="stationName" align="center" label="岗位" min-width="119">

                 <template slot-scope="scope">
                 <span>{{scope.row.stationName}}</span>
                 </template>
                </el-table-column>

                 <el-table-column prop="state" align="center" label="状态" min-width="119">

                 <template slot-scope="scope">
                 <span>{{scope.row.state}}</span>
                 </template>
                </el-table-column>

                 <el-table-column prop="opinion" align="center" label="意见" min-width="119">

                 <template slot-scope="scope">
                 <span>{{scope.row.opinion}}</span>
                 </template>
                </el-table-column>

                <el-table-column prop="dateTime" align="center" label="时间" min-width="190">

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
            <el-button type="primary" @click="submData" size="mini" v-show="submitlist">提交</el-button>

            </el-form-item>
            </el-form>
          </el-dialog>
     
           <!-- 同意和退回弹窗   consent retrnsty submitlist-->

           <el-dialog  :title="textMap[dialogStatus]" top="8vh" width="700px" :visible.sync="postylitys">
            <el-form :rules="rules" ref="dataFormsty" :model="noeli" label-width="110px">
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
import { fetchList,smallAblist,samllDelete,uploadlist,circuList,updateAuditing,updeletedata,insertFile,getCurrentUser,getNodeTask,newlYupdate } from '@/api/servicingManage/servicingcTobedone'
import{ flowsheet } from '@/api/servicingManage/declareBill'
import waves from '@/directive/waves' // 水波纹指
export default {
  name: 'servicingcTobedone',
  directives: {
    waves
  },
  data() {
    return {
      value13:[],
      smallslist:[],//第一个小表格
       towlistdata:[],//第二个小表格
       documentW:'',
      listyst: [],
      lookList: [],
      circulation:[],//流转记录
      fliestyps:null,//上传文件路径
      documenyt:'',//单据编码赋值
      userId:'',//用户id
      nodeName:'',//节点的名字
      nodetaskId:'',//接口参数
      consent:false, //同意按钮显隐
      retrnsty:false, //退回显隐
      submitlist:false,//提交显隐
      chartData:'',//流程图

      porisgid:'',
      grite: '',
      total: null,
      listQuery: {
       
      },
       pageNum: 1,
       pageSize: 10,
      activeName: 'first',//选项卡默认选项
      // 编辑和新增的字段设置
      temp: {
      
      },
      noeli:{  
        opinion:''//同意里的意见字段
      },
      // 弹框显示
      dialogFormVisible: false,
      postylitys:false,
      affirmshow1:false,
      affirmshow2:false,
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
      fromLoading:true,//弹出框加载动画
      dialogPvVisible: false,
      dialoglookVisible: false, // 弹窗属性
      siteCodeState: '', // 岗位编码禁用状态
      siSte:'',//禁用可编辑的输入框
      // 弹框内输入框不填显示的提示信息
       rules: {
        equipmentName: [{ required: true, message: '请输入', trigger: 'change' }],
        fixedAssetCode: [{ required: true, message: '请输入', trigger: 'change' }], 
        model: [{ required: true, message: '请输入', trigger: 'change' }],
        companyName: [{ required: true, message: '请输入', trigger: 'change' }],
        factoryName: [{ required: true, message: '请输入', trigger: 'change' }],
        divisionName: [{ required: true, message: '请输入', trigger: 'change' }],
        // filingNumber: [{ required: true, message: '请输入', trigger: 'change' }],
        serialNumber: [{ required: true, message: '请输入', trigger: 'change' }],
        contractNumber: [{ required: true, message: '请输入', trigger: 'change' }],
        acceptanceDate: [{ required: true, message: '请选择日期', trigger: 'change' }],
        acceptanceInfo: [{ required: true, message: '请选择', trigger: 'change' }]
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
      fetchList(this.pageNum,this.pageSize,this.listQuery).then(response => {
        this.listyst = response.data.data.list
        for(var i=0;i<this.listyst.length;i++){
             if(this.listyst[i].acceptanceInfo == 1){
         this.listyst[i].acceptanceInfoName = '验收通过'
       }else if(this.listyst[i].acceptanceInfo == 2){
          this.listyst[i].acceptanceInfoName = '验收不通过'
       }
       if(this.listyst[i].checkStart == 2){
        this.listyst[i].checkStartName='审核中'
       }else if(this.listyst[i].checkStart==1){
        this.listyst[i].checkStartName = '未提交'
		   }else if(this.listyst[i].checkStart==3){
       this.listyst[i].checkStartName = '审核通过'
    
		   }else if(this.listyst[i].checkStart==4){
       this.listyst[i].checkStartName = '审核不通过'
    
      } 
    }
        this.total = response.data.data.total
        //   this.listLoading = false
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 1000)
      })
    },
 
      // 日期  搜索
   searchsty(){
        // 申请闲置时间  搜索
      if(this.value13==null){
         this.listQuery.acceptanceDateUp=''
         this.listQuery.acceptanceDateEnd=''
      }else{
        this.listQuery.acceptanceDateUp = this.value13[0]// 开始时间
        this.listQuery.acceptanceDateEnd = this.value13[1]
      }
   },
     // 查看
    checkDetails(row) {
      console.log(row)
      this.dialogFormVisible = true
      this.porisgid = row.processInstanceId
      this.documenyt = row.documnetCode //单据编码的赋值
      this.nodetaskId = row.taskId//接口参数
      this.temp = Object.assign({}, row)
      this.dialoglookVisible = true
      this.fromLoading = false//弹窗加载动画
      this.siteCodeState = true
      this.activeName = 'first'//选项卡默认选项
      this.temp.acceptanceInfo = row.acceptanceInfo.toString()
      // 判断taskName是否是调整申请显示的按钮不一样
      if(row.checkStart== 4){
        this.consent = false//同意按钮显隐
        this.retrnsty =  false//退回按钮显隐
        this.submitlist = true//提交按钮显隐
        this.siSte = false//可编辑的输入可输入
      }else{
        this.consent = true
        this.retrnsty =  true
        this.submitlist = false
        this.siSte = true//可编辑的输入不可输入
      }
      this.getUser()
      this.circulationlist()
      this.getlistsamll()  
      this.getlisttwo()
      this.getnodeNames()

      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
     // 流转记录
    circulationlist(){
    if(this.porisgid==''){
        let processInstanceId = null
        this.porisgid = null
        circuList(processInstanceId).then(response =>{
        this.circulation = response.data.data
        })
      }else{
      let processInstanceId = this.porisgid
       circuList(processInstanceId).then(response =>{
        this.circulation = response.data.data
        })
      }
    },
    //  流程图
     fathClick(tab, event){
        if (tab.label == '流程图') {
          
          if(this.porisgid == null){
             this.$notify({
					  title: '提示',
				  	message:'流程还未开始，没有流程图',
				  	type: 'warning',
				    duration: 3000
           }) 
          this.chartData=''
           return       
          }else{ 
          this.fromLoading = true// 弹窗加载动画
          flowsheet(this.porisgid).then(response =>{
            console.log(response)
            if(response.data.code!==803 && response.data.code!==808){
            this.chartData = response.request.responseURL;
            document.getElementById('pic').src = this.chartData;
           }else{
         
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

//    同意按钮
  saveData(){
   this.dialogStatus='update'
   this.postylitys = true
   this.affirmshow1=true
   this.affirmshow2=false
   this.noeli.opinion = ''
   console.log(this.temp)
    this.$nextTick(() => {
        this.$refs['dataFormsty'].clearValidate()
      })
  },
  // 确认
  poslist1(){
    this.$refs['dataForm'].validate(valid => { 
        if (valid) { 
        //  const noeliData = Object.assign({}, this.noeli)
         const noeliData ={
           taskId:this.temp.taskId,
           leaderPass:true,
           oldUserId:this.temp.userId,
           opinion:this.noeli.opinion
         }

        console.log(noeliData)
        updateAuditing(noeliData).then(response => {
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

            }else{
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
        updateSaveData(){
          this.dialogStatus='create'
          this.postylitys = true
          this.affirmshow1=false
          this.affirmshow2=true
          this.noeli.opinion=''
          this.$nextTick(() => {
                this.$refs['dataFormsty'].clearValidate()
              })
        },
        // 确认
        poslist2(){
        this.$refs['dataForm'].validate(valid => { 
        if (valid) { 
        // const noeliData = Object.assign({}, this.noeli)
           const noeliData ={
           taskId:this.temp.taskId,
           leaderPass:false,
           oldUserId:this.temp.userId,
           opinion:this.noeli.opinion
         }
         
       updateAuditing(noeliData).then(response => {
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
            }else{
                 this.$notify({
                  title: '警告',
                  message: msg,
                  type: 'warning',
                  duration: 3000
                })
               }
            })
           }     
         })
       },
        // 第一个下载
        downloadsty(row){
           const att = row.fileName
           window.location.href = row.filePath + '?attname='+ att
           this.$message({
                    title: '成功',
                    message: '下载成功',
                    type: 'success',
                    duration: 2000
                  })
              },
        // 第二个下载
        twodown(row){
          const att = row.fileName
           window.location.href = row.filePath + '?attname='+ att
           this.$message({
                    title: '成功',
                    message: '下载成功',
                    type: 'success',
                    duration: 2000
                  })
              },
             // 获取当前用户信息
            getUser() {
              getCurrentUser().then(response => {
                this.userId = response.data.data.id
              })
            },

        // 第一个小表格接口  getlistsamll()   getlisttwo()
         getlistsamll(){ 
          const samllblist={
            moduleType:12,
            attachmentCode:"SBWXZLYSD",
            documentWordCode:this.documenyt
          }
        smallAblist(samllblist).then(response => {
          this.smallslist = response.data.data
          for(var i=0;i<this.smallslist.length;i++){
            if(this.smallslist[i].userId == this.userId){
               this.smallslist[i].deleteDisabled = false
            }else{
               this.smallslist[i].deleteDisabled = true
            }
          }
        })
        },
        // 第二个小表格数据 towlistdata
         getlisttwo(){ 
          const samblist={
            moduleType:12,
            attachmentCode:"SBJXJLDFJ",
            documentWordCode:this.documenyt
          }
        smallAblist(samblist).then(response => {
          this.towlistdata = response.data.data
          for(var i=0;i<this.towlistdata.length;i++){
            if(this.towlistdata[i].userId == this.userId){
                 this.towlistdata[i].deleteDisabled = false
            }else{
                 this.towlistdata[i].deleteDisabled = true
            }
          }
        })
      },
   
    // 获取node节点名字 this.nodetaskId
    getnodeNames(){
      getNodeTask(this.nodetaskId).then(reap =>{
        if(reap.data.code==200){
          this.nodeName = reap.data.data.name
        }else{
          this.$notify({
            title: '警告',
            message: reap.data.msg,
            type: 'warning',
            duration: 2000
          })
        }
      })
    },
    //  退回的时候就要能编辑而且按钮变为提交按钮
        submData(){
           this.$refs['dataForm'].validate(valid => {
             if (valid) {
                 const tempData = {
                 taskId:this.temp.taskId,
                 acceptanceDate:this.temp.acceptanceDate,
                 acceptanceInfo:this.temp.acceptanceInfo,
                 checkStart:this.temp.checkStart,                
                 id:this.temp.id            
               }
              console.log(tempData)
               newlYupdate(tempData).then(response => {
                const msg = response.data.msg
                if(response.data.code==200){
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
            }else{
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



   // 上传的按钮
     noticeUpload(e){
        console.log(1234)
        let file = e.target.files[0];
        console.log(file)
         const fileData1 = {
        attachmentCode: 'SBWXZLYSD',
        moduleType: '12',
        fileName: undefined,
        filePath: undefined, // 文件URL
        node: this.nodeName,
        userId: this.userId,
        code:this.documenyt

      }   
        if (file != null) {
        this.fromLoading = true
        let param = new FormData(); //创建form对象
        param.append("file", file, file.name); //通过append向form对象添加数据
         this.filenamesty = file.name
         fileData1.fileName = file.name
         console.log(file.name)
        uploadlist(param).then(resp => { //调用上传接口
          if (resp.data.code == 200) {
               fileData1.filePath = resp.data.data.remoteFilename //文件地址
                insertFile(fileData1).then(response => {
              if (response.data.code == 200) {
                this.$message({
                  title: '成功',
                  message: '上传成功',
                  type: 'success',
                  duration: 2000
                })
                this.getlistsamll() // 获取文件
                const test = document.getElementById('uploadImg');
                test.value = '';
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

          }else{
            this.$notify({
                  title: '警告',
                  message: '上传失败',
                  type: 'warning',
                  duration: 3000
                })
               this.fromLoading = false
          }
         })

        }
     },
    //  第二个上传按钮 
     twofileUp(e){
            console.log(1234)
        let file = e.target.files[0];
        console.log(file)
         const fileData2 = {
        attachmentCode: 'SBJXJLDFJ',
        moduleType: '12',
        fileName: undefined,
        filePath: undefined, // 文件URL
        node: this.nodeName,
        userId: this.userId,
        code:this.documenyt

            }   
        if (file != null) {
        this.fromLoading = true
        let param = new FormData(); //创建form对象
        param.append("file", file, file.name); //通过append向form对象添加数据
         this.filenamesty = file.name
         fileData2.fileName = file.name
         console.log(file.name)
        uploadlist(param).then(resp => { //调用上传接口
          if (resp.data.code == 200) {
               fileData2.filePath = resp.data.data.remoteFilename //文件地址
               insertFile(fileData2).then(response => {
               if (response.data.code == 200) {
                this.$message({
                  title: '成功',
                  message: '上传成功',
                  type: 'success',
                  duration: 2000
                })
                this.getlisttwo() // 获取文件
                const test = document.getElementById('twoupload');
                test.value = '';
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
            
          }else{
            this.$notify({
                  title: '警告',
                  message: '上传失败',
                  type: 'warning',
                  duration: 3000
                })
             this.fromLoading = false
          }
         })

        }
     },
    //  第一个删除
    updatadelest(row){
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
            console.log(idst)
          updeletedata(idst).then(response => {
            // this.smalldatast()
            const index =  this.smallslist.indexOf(row)
            this.smallslist.splice(index, 1)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
   },
  //  第二个表格删除按钮
        twodelest(row){
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
            console.log(idst)
          updeletedata(idst).then(response => {
            // this.smalldatast()
            const index =  this.towlistdata.indexOf(row)
            this.towlistdata.splice(index, 1)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
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

</style>
