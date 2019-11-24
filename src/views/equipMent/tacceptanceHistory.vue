<template>
  <div class="app-container">
    <!--外部容器 -->
    <el-container>
       <!-- 顶部搜索 -->
     

        <div class="filter-container">
            <div class="formSearch">
            <el-form :inline="true">
              
                <el-form-item label="设备名称" >
                <el-input v-model="listQuery.equipmentName"  placeholder="请输入设备名称" clearable></el-input>
                </el-form-item>
             

             
                <el-form-item label="固定资产编号" >
                <el-input class="minier-input" v-model="listQuery.fixedAssetCode" placeholder="请输入固定资产编号" clearable></el-input>
                </el-form-item>
             

            
                <el-form-item label="验收日期" >
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
             

              
                <el-form-item label="验收情况" prop="acceptanceType"> 
                <el-radio v-model="listQuery.acceptanceType" label="1">验收通过</el-radio>
                <el-radio v-model="listQuery.acceptanceType" label="0">验收不通过</el-radio>

                </el-form-item>
              

              
                <el-form-item label="审核状态">
                    <el-select v-model="listQuery.auditingType" style="width:190px" clearable  placeholder="请选择">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                    </el-select>
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
          <el-dialog title="查看详情" :close-on-click-modal="false" top="8vh" v-dialogDrag width="700px" :visible.sync="dialogFormVisible">
              <!-- 选项卡 -->
        <el-tabs v-model="activeName" v-loading="fromLoading"  @tab-click="fathClick"><!-- @tab-click="handleClick" -->
          <el-tab-pane label="表单信息" name="first">
          <!-- 选项卡表格 -->
            <el-form :rules="rules" ref="dataForm" :model="temp" label-width="110px">
               <el-form-item>
                <span class="equip-title">开箱验收单历史</span>
              </el-form-item>
              <el-row>
              <el-col :span="8">     
              <el-form-item label="单据编码"  prop="documentWordCode">
              <el-input style="width:190px" v-model="temp.documentWordCode" disabled oninput="this.value=this.value.replace(/[^0-9A-z\.]/g,'')" class="enter medium-input" placeholder="空" ></el-input>
              </el-form-item>
              </el-col>
               <el-col :span="16">
              <el-form-item label="供应商" prop="supplier" style="margin-left:100px;"> 
              <el-input v-model="temp.supplier" :disabled='siteCodeState?true:false'  onkeyup="this.value=this.value.replace(/[^\u4e00-\u9fa5]/g,'')" style="width:190px" class="enter medium-input" placeholder="请引用新增设备一览表" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">     
              <el-form-item label="设备名称" prop="equipmentName">
              <el-input v-model="temp.equipmentName"  :disabled='siteCodeState?true:false' style="width:190px" class="enter medium-input" placeholder="请引用新增设备一览表" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="出厂编号" prop="serialNumber" style="margin-left:100px;"> 
              <el-input v-model="temp.serialNumber" :disabled='siteCodeState?true:false' maxlength="20" style="width:190px" class="enter medium-input" placeholder="请引用新增设备一览表" ></el-input>   
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">     
              <el-form-item label="型号规格" prop="typeSpecification">
              <el-input v-model="temp.typeSpecification"  :disabled='siteCodeState?true:false' style="width:190px" class="enter medium-input" placeholder="请引用新增设备一览表" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="固定资产编号" prop="fixedAssetCode" style="margin-left:100px;"> 
              <el-input v-model="temp.fixedAssetCode" :disabled='siteCodeState?true:false' style="width:190px" class="enter medium-input" placeholder="请引用新增设备一览表" ></el-input>   
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">     
              <el-form-item label="验收日期" prop="acceptanceDate">
             <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.acceptanceDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  
                   >
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="送货单号" prop="deliveryCode" style="margin-left:100px;"> 
              <el-input v-model="temp.deliveryCode" :disabled='siteCodeState?true:false' style="width:190px" class="enter medium-input" placeholder="请引用新增设备一览表" ></el-input>   
              </el-form-item>
              </el-col>
              </el-row>
              <el-row>  
             <!--  <span style="color:red;position:absolute;bottom:30px;left:13px">*</span> -->
              <el-form-item label="送货单号上传图片" label-width="128px" style="margin-left:20px">
               
                <!-- accept="image/gif,image/jpg,image/png,/image/gif,image/jpeg" twofileUp   -->
             <!--  <input  id="twoupload" type="file" accept="image/gif,image/jpg,image/png,/image/gif,image/jpeg" @change="twofileUp" v-show="filshow"> -->
              </el-form-item>
               </el-row> 
               <!-- 第二个小表格 -->
              <el-table :data="towlistdata"  border fit highlight-current-row
              style="width: 100%;min-height:auto;margin-top:8px" :header-cell-style="{background:'oldlace'}">

                <el-table-column prop="fileName" align="center" label="文件名" min-width="221">

                 <template slot-scope="scope">
                 <span style="cursor:pointer;text-decoration:underline " @click="handlePreview(scope.row)">{{scope.row.fileName}}</span>
                 </template>
                 </el-table-column>
                 <el-table-column prop="node" align="center" label="上传节点" min-width="219">

                 <template slot-scope="scope">
                 <span>{{scope.row.node}}</span>
                 </template>
                 </el-table-column>

                <el-table-column align="center" label="操作" min-width="219"  class-name="small-padding fixed-width">

                <template slot-scope="scope">
                  <el-button title="下载" type="primary" @click="downty(scope.row)" size="small" icon="el-icon-download"></el-button>
                  <!-- <el-button title="删除" type="danger" @click="twosmalldelest(scope.row)" icon="el-icon-delete" size="small" v-show="deleadds" ></el-button>
                  <el-button title="删除" type="danger" @click="twoupdatadelest(scope.row)" icon="el-icon-delete" size="small" v-show="deleuplet"></el-button> -->
                </template>
              </el-table-column>

              </el-table>




              <el-form-item label="送货单内容" prop="deliveryCodeContent" style="margin-top:10px">
                <el-input type="textarea" style="width:510px" maxlength="200" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入送货单内容..." v-model="temp.deliveryCodeContent">
                </el-input>
              </el-form-item>
               <el-form-item label="实际验收情况" prop="actualAcceptSituation">
                <el-input type="textarea" style="width:510px" maxlength="200" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入实际验收情况..." v-model="temp.actualAcceptSituation">
                </el-input>
              </el-form-item>
              
               <el-row>
              <el-col :span="10">     
              <el-form-item label="是否缺件" prop="missPieceType" > 
              <el-radio v-model="temp.missPieceType" label="1">是</el-radio>
              <el-radio v-model="temp.missPieceType" label="0">否</el-radio>
              </el-form-item>
              </el-col>
              <el-col :span="14">
              <el-form-item label="验收情况" prop="acceptanceType" class="seat"> 
                <el-radio v-model="temp.acceptanceType" label="1">验收通过</el-radio>
                <el-radio v-model="temp.acceptanceType" label="0">验收不通过</el-radio>

                </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-form-item label="开箱验收单附件" class="sepost">
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
                </el-upload>         accept="image/gif,image/jpg,image/png,/image/gif,image/jpeg"-->

                <!-- 上传按钮 -->
              <!-- <input class="uploadInput" id="uploadImg" ref="uploadImg" type="file" @change="noticeUpload"> -->
              </el-form-item>
               </el-row> 
              <!-- 小表格 -->
              <el-table :data="smallslist" v-loading="listLoading" border fit highlight-current-row
              style="width: 100%;min-height:auto;margin-top:8px" :header-cell-style="{background:'oldlace'}">

                <el-table-column prop="fileName" align="center" label="文件名" min-width="221">
                 <template slot-scope="scope">
                 <span style="cursor:pointer;text-decoration:underline " @click="handlePreview(scope.row)">{{scope.row.fileName}}</span>
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
                  <!-- <el-button title="删除" type="danger" @click="smalldelest(scope.row)" icon="el-icon-delete" size="small" ></el-button> -->
               
                </template>
              </el-table-column>

              </el-table>

            </el-form>
            </el-tab-pane>

            <!-- 选项卡流转记录 -->
            <el-tab-pane label="流转记录" name="second" v-if="shpows">
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
              <el-tab-pane label="流程图" name="three" v-if="shpows">
              <div id="imgcontainer">
                  <img id="pic" :src="chartData" />
                </div>
             </el-tab-pane>
            </el-tabs>

            <el-form class="buttonlist">
            <el-form-item>
            <el-button @click="dialogFormVisible = false" type="primary" size="mini">返回</el-button>
            <!-- <el-button type="primary" @click="saveData">同意</el-button>
            <el-button type="primary" @click="updateSaveData">退回</el-button> -->
            </el-form-item>
            </el-form>
          </el-dialog>
           <!-- 同意和退回弹窗 -->
           <el-dialog :close-on-click-modal="false" :title="textMap[dialogStatus]" top="8vh" width="700px" :visible.sync="postylitys">
            <el-form :rules="rules" ref="dataFormsty" :model="noeli" label-width="110px">
            <el-form-item label="意见" prop="opetion">
                <el-input type="textarea" style="width:510px" maxlength="128" :autosize="{ minRows: 2, maxRows: 4}" placeholder="" v-model="noeli.opetion">
                </el-input>
              </el-form-item>
              
              </el-form>
           
           <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="poslist1" v-show="affirmshow1">确认</el-button>
            <el-button type="primary" @click="poslist2" v-show="affirmshow2">确认</el-button>
            <el-button @click="postylitys = false" type="primary" >返回</el-button>
            </div>
           
          </el-dialog>

        </el-container>

  </div>
</template>

<script>
import { fetchList,smallAblist,samllDelete,uploadlist,circuList,updateAuditing} from '@/api/equipMent/tacceptanceHistory'
import {flowsheet} from '@/api/equipMent/acceptanceSheet'
import waves from '@/directive/waves' // 水波纹指
import { baseUrl } from '@/api/common/fileBaseUrl'
export default {
  name: 'tacceptanceHistory',
  directives: {
    waves
  },
  data() {
    return {
        options: [
       {value: '3',label: '审核通过'},
       {value: '4',label: '审核不通过'}
       ],
      value13:[],
      smallslist:[],//这个是新增里的小表格
      circulation:[],//流转记录
      porisgid:'',
      documentW:'',
      listyst: [],
      lookList: [],
      grite: '',
      total: null,
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      activeName: 'first',//选项卡默认选项
      // 编辑和新增的字段设置
      temp: {
      
      },
      noeli:{  
        opetion:''//同意里的意见字段
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

      towlistdata:[],
      
      fromLoading:true,//弹出框加载动画
      chartData:'',//流程图
      isAdd: false, // 新增or编辑
      siteDetail: false, // 新增、编辑弹窗
      editLoading: false, // 提交按钮加载动画
      showStatus: true, // 表单项显示状态
      formSearch_send: false, // 查询条件点选
      listLoading: true, // 远程搜索加载动画
      dialogPvVisible: false,
      dialoglookVisible: false, // 弹窗属性
      siteCodeState: '', // 岗位编码禁用状态
      shpows:false,
      // 弹框内输入框不填显示的提示信息
       rules: {
        missPieceType: [{ required: true, message: '请输入', trigger: 'change' }],
        acceptanceType: [{ required: true, message: '请输入', trigger: 'change' }],
        documentWordCode:[{ required: true, message: '请输入', trigger: 'change' }],
        supplier:[{ required: true, message: '请输入', trigger: 'change' }],
        equipmentName:[{ required: true, message: '请输入', trigger: 'change' }],
        typeSpecification:[{ required: true, message: '请输入', trigger: 'change' }],
        acceptanceDate:[{ required: true, message: '请输入', trigger: 'change' }],
        deliveryCode:[{ required: true, message: '请输入', trigger: 'change' }],
        deliveryCodeContent:[{ required: true, message: '请输入', trigger: 'change' }],
        actualAcceptSituation:[{ required: true, message: '请输入', trigger: 'change' }],
        fixedAssetCode:[{ required: true, message: '请输入', trigger: 'change' }], 
        serialNumber:[{ required: true, message: '请输入', trigger: 'change' }]

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
    // ******* 文件预览**********
   handlePreview(row){
     console.log(row)
           var url = baseUrl + "onlinePreview?url=" +  encodeURIComponent(row.filePath)
           var winHeight = window.document.documentElement.clientHeight-10;
          window.open(url, '_blank',"height=" + winHeight+ ",top=80,left=80,toolbar=no, menubar=no, scrollbars=yes, resizable=yes");
   },
// ******* 文件预览结束**********
    // 表格的接口
    getAA() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        if(response.data.code==200){
         if(response.data.data!=null && response.data.data.list!==null ){
        this.listyst = response.data.data.list
        this.total = response.data.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 1000)
        }
         this.listLoading = false
        }else{
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
 
      // 日期  搜索
   searchsty(){
        // 申请闲置时间  搜索
      if(this.value13==null){
         this.listQuery.acceptanceDateStart=''
         this.listQuery.acceptanceDateEnd=''
      }else{
        this.listQuery.acceptanceDateStart = this.value13[0]// 开始时间
        this.listQuery.acceptanceDateEnd = this.value13[1]
      }
   },
     // 查看
    checkDetails(row) {
    //   console.log(12345)
    //   console.log(row)
      this.shpows = false
      this.porisgid = row.processInstanceId
      this.documentW = row.documentWordCode
      this.dialogFormVisible = true
      this.temp = Object.assign({}, row)
      this.dialoglookVisible = true
      this.siteCodeState = true
      this.fromLoading = false//弹窗加载动画
      this.activeName = 'first'//选项卡默认选项
      this.temp.acceptanceType = row.acceptanceType.toString()
      this.temp.missPieceType = row.missPieceType.toString()
      this.smalldast()
      this.smalldast1()
      this.circulationlist()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 流转记录
    circulationlist(){
      let processInstanceId = this.porisgid
     circuList(processInstanceId).then(response =>{
        this.circulation = response.data.data
        //  console.log(9876666)
        // console.log( this.circulation)
     })
    },

     //  流程图
     fathClick(tab, event){
        if (tab.label == '流程图') {
          
          if(this.porisgid == null){
             this.$notify({
					  title: '提示',
				  	message:'流程已结束',
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
//    console.log(this.temp)
    this.$nextTick(() => {
        this.$refs['dataFormsty'].clearValidate()
      })
  },
  // 确认
  poslist1(){
    this.$refs['dataForm'].validate(valid => { 
        if (valid) { 
         const noeliData = Object.assign({}, this.noeli)
        // console.log(noeliData)
         noeliData.id = this.temp.id
         noeliData.auditingType = 3
         noeliData.taskId = this.temp.taskId
       updateAuditing(noeliData).then(response => {
            if (resp.data.code == 200) { 
                this.$message({
                    title: '成功',
                    message: '同意成功',
                    type: 'success',
                    duration: 2000
                  })
                  this.postylitys = false
                  this.dialogFormVisible = false
            }else{
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
        //   退回按钮
        updateSaveData(){
          this.dialogStatus='create'
          this.postylitys = true
          this.affirmshow1=false
          this.affirmshow2=true
          this.$nextTick(() => {
                this.$refs['dataFormsty'].clearValidate()
              })
        },
        // 确认
        poslist2(){
            this.$refs['dataForm'].validate(valid => { 
        if (valid) { 
         const noeliData = Object.assign({}, this.noeli)
        // console.log(noeliData)
         noeliData.id = this.temp.id
         noeliData.auditingType = 4
         noeliData.taskId = this.temp.taskId
       updateAuditing(noeliData).then(response => {
            if (resp.data.code == 200) { 
                this.$message({
                    title: '成功',
                    message: '退回成功',
                    type: 'success',
                    duration: 2000
                  })
                  this.postylitys = false
                  this.dialogFormVisible = false
            }else{
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

   // 上传的按钮
     noticeUpload(e){
        // console.log(1234)
        let file = e.target.files[0];
        // console.log(file)
        if (file != null) {
        let param = new FormData(); //创建form对象
        param.append("file", file, file.name); //通过append向form对象添加数据
         this.filenamesty = file.name
        //  console.log(file.name)
        uploadlist(param).then(resp => { //调用上传接口
          if (resp.data.code == 200) {
              this.fliestyps = resp.data.data.remoteFilename
               this.$message({
                    title: '成功',
                    message: '上传成功',
                    type: 'success',
                    duration: 2000
                  })
            
          }else{
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
     // 查看里的小表格接口
     smalldast(){
      const samllblist={
        moduleType:3,
        attachmentCode:"KXYSDFJ",
        documentWordCode:this.documentW
      }
    smallAblist(samllblist).then(response => {
      this.smallslist = response.data.data
    })
    },
   smalldast1(){
      const samllblist={
        moduleType:3,
        attachmentCode:"SHDHFJ",
        documentWordCode:this.documentW
      }
    smallAblist(samllblist).then(response => {
      this.towlistdata = response.data.data
    })
    },


  //  下载按钮
  downloadsty(row){
        const att = row.fileName 
        window.location.href = row.filePath + '?attname=' +att
           this.$message({
                    title: '成功',
                    message: '下载成功',
                    type: 'success',
                    duration: 2000
                  })
  },
   // 送货单号上传图片下载
    downty(row){
        const att = row.fileName
        window.location.href = row.filePath + '?attname=' + att
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
