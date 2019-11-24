<template>
  <div class="app-container">
    <!--外部容器 -->
    <el-container>
       <!-- 顶部搜索 -->
        <div class="filter-container">
            <div class="formSearch">
            <el-form :inline="true">
              
                <el-form-item label="设备名称">
                <el-input v-model="listQuery.equipmentName"  placeholder="请输入设备名称" clearable></el-input>
                </el-form-item>
            

               
                <el-form-item label="固定资产编号" >
                <el-input class="minier-input" style="width:213px" v-model="listQuery.fixedAssetCode" placeholder="请输入固定资产编号" clearable></el-input>
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
          

           
                <el-form-item label="接收情况" prop="isAcceptanceType" > 
                <el-radio v-model="listQuery.isAcceptanceType" label="1">已接收</el-radio>
                <el-radio v-model="listQuery.isAcceptanceType" label="0">未接收</el-radio>
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
               <el-table-column prop="assetOwnershipCompany" align="center" label="资产归属公司" min-width="80">
                 </el-table-column>
                <el-table-column prop="useCompanyName" align="center" label="使用公司" min-width="80">
                 </el-table-column>
                 <el-table-column prop="useFactoryName" align="center" label="使用工厂" min-width="80">
                 </el-table-column>
                 <el-table-column prop="useWorkshopName" align="center" label="使用部门" min-width="80">
                 </el-table-column>
                 <el-table-column prop="equipmentName" align="center" label="设备名称" min-width="80">
                 </el-table-column>
                  <el-table-column prop="typeSpecification" align="center" label="型号规格" min-width="80">
                 </el-table-column>
                 <el-table-column prop="outFactoryCode" align="center" label="出厂编号" min-width="80">
                 </el-table-column>
                  <el-table-column prop="fixedAssetCode" align="center" label="固定资产编号" min-width="80">
                 </el-table-column>
                <el-table-column prop="supplier" align="center" label="供应商" min-width="80">
                 </el-table-column>
               <el-table-column prop="payTime" align="center" label="交付日期" min-width="80">
                 </el-table-column>
               <el-table-column prop="acceptanceFinishTime" align="center" label="验收完成时间" min-width="80">
                 </el-table-column>
               <el-table-column prop="acceptanceSituationName" align="center" label="验收情况" min-width="80">
                 </el-table-column>
               <el-table-column prop="auditingTypeName" align="center" label="审核状态" min-width="80">
                 </el-table-column>
               <el-table-column prop="isAcceptanceName" align="center" label="接收情况" min-width="80">
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
          <el-dialog title="查看详情" :close-on-click-modal="false" top="8vh" v-dialogDrag width="1000px" :visible.sync="dialogFormVisible">
              <!-- 选项卡 -->
        <el-tabs v-model="activeName" v-loading="fromLoading" @tab-click="fathClick"><!-- @tab-click="handleClick" -->
          <el-tab-pane label="表单信息" name="first">
          <!-- 选项卡表格 -->
            <el-form :rules="rules" ref="dataForm" :model="temp" label-width="110px">
              <el-form-item>
                <span class="equip-title">新设备验收单财务接收</span>
              </el-form-item>

              <el-row>
              <el-col :span="8">     
              <el-form-item label="单据编码"  prop="documentWordCode">
              <el-input style="width:290px" v-model="temp.documentWordCode" disabled  class="enter medium-input" placeholder="空" ></el-input>
              </el-form-item>
              </el-col>
               <el-col :span="16">
              <el-form-item label="使用公司" prop="useCompanyName" style="margin-left:200px;"> 
              <el-input v-model="temp.useCompanyName" :disabled='siteCodeState?true:false' style="width:290px" class="enter medium-input" placeholder="请输入使用公司" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>
             
              <el-row>
              <el-col :span="8">     
              <el-form-item label="使用工厂"  prop="useFactoryName">
              <el-input style="width:290px" v-model="temp.useFactoryName" :disabled='siteCodeState?true:false' class="enter medium-input" placeholder="输入使用工厂" ></el-input>
              </el-form-item>
              </el-col>
               <el-col :span="16">
              <el-form-item label="使用车间" prop="useWorkshopName" style="margin-left:200px;"> 
              <el-input v-model="temp.useWorkshopName" :disabled='siteCodeState?true:false' style="width:290px" class="enter medium-input" placeholder="请输入使用车间" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>
              
              <el-row>
              <el-col :span="8">     
              <el-form-item label="设备名称" prop="equipmentName">
              <el-input v-model="temp.equipmentName" :disabled='siteCodeState?true:false' style="width:290px" class="enter medium-input" placeholder="请输入设备名称" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="型号规格" prop="typeSpecification" style="margin-left:200px;">
              <el-input v-model="temp.typeSpecification" :disabled='siteCodeState?true:false' style="width:290px" class="enter medium-input" placeholder="请输入型号规格" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">     
              <el-form-item label="出厂编号" prop="outFactoryCode"> 
              <el-input v-model="temp.outFactoryCode" :disabled='siteCodeState?true:false' style="width:290px" class="enter medium-input" placeholder="请输入出厂编号" ></el-input>   
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="固定资产编号" prop="fixedAssetCode" style="margin-left:200px;"> 
              <el-input v-model="temp.fixedAssetCode" :disabled='siteCodeState?true:false' style="width:290px" class="enter medium-input" placeholder="请输入固定资产编号" ></el-input>   
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">
              <el-form-item label="供应商" prop="supplier"> 
              <el-input v-model="temp.supplier" :disabled='siteCodeState?true:false' style="width:290px" class="enter medium-input" placeholder="请输入供应商" ></el-input>   
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="交付日期" prop="payTime" style="margin-left:200px">
               <div class="block">
                <el-date-picker
                  style="width:290px"
                  v-model="temp.payTime"
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

              
               <el-row>
              <el-col :span="10">     
              <el-form-item label="验收完成时间" prop="acceptanceFinishTime" >
               <div class="block">
                <el-date-picker
                  style="width:280px"
                  v-model="temp.acceptanceFinishTime"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                   :disabled='siteCodeState?true:false'
                   >
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              <el-col :span="14">
              <el-form-item label="验收情况" prop="acceptanceSituation" style="margin-left:80px" :disabled='siteCodeState?true:false'> 
                <el-radio v-model="temp.acceptanceSituation" label="1" :disabled='siteCodeState?true:false'>验收通过</el-radio>
                <el-radio v-model="temp.acceptanceSituation" label="0" :disabled='siteCodeState?true:false'>验收不通过</el-radio>
                </el-form-item>
              </el-col>
              </el-row>
               <el-row>
              <el-col :span="10">
              <el-form-item label="资产归属公司" prop="assetOwnershipCompany"> 
              <el-input v-model="temp.assetOwnershipCompany" value="radio" style="width:270px" :disabled='siteCodeState?true:false' class="enter medium-input" placeholder="请选择资产归属公司" ></el-input>
              <div class="buttonplace" id="buttstyps" @click="treeco">选择</div>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="18">
              <el-form-item label="新设备验收单附件" class="sepost" label-width="130px">
              <!--  <input id="uploadImg" type="file" @change="noticeUpload"> -->

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
                  <!-- <el-button title="删除" type="danger" @click="updatadelest(scope.row)" icon="el-icon-delete" size="small" ></el-button> -->
               
                  </template>
                 </el-table-column>
                </el-table>
              <el-row>
              <el-col :span="18">
              <el-form-item label="设备检修记录单附件" class="sepost" label-width="140px">
             <!--   <input id="uploadImg" type="file" @change="twofileUp">  -->

              </el-form-item>
              </el-col>
              </el-row> 
              <!--第二个小表格 -->
               <el-table :data="towlistdata" v-loading="listLoading" border fit highlight-current-row
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
                  <el-button title="下载" type="primary" @click="twodown(scope.row)" size="small" icon="el-icon-download"></el-button>
                  <!-- <el-button title="删除" type="danger" @click="twodelest(scope.row)" icon="el-icon-delete" size="small" ></el-button> -->
               
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

                <el-table-column  align="center" label="序号" min-width="47" type="index"></el-table-column>
                
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
            <el-button type="primary" @click="saveData" v-if="numbersty" size="mini">确认接收</el-button>
            </el-form-item>
            </el-form>
          </el-dialog>
    
         <el-dialog title="资产归属公司"  :close-on-click-modal="false" :visible.sync="treeFormVisible" :modal="false">
           <!-- <span style="margin-left:20px;color:red" >{{yease}}</span>  -->
           <el-tree :data="datast" :props="defaultProps" @node-click="handleNodeClick" check-strictly ref="tree" node-key="orgCode" show-checkbox highlight-current @check-change="handleClick" ></el-tree>
           <div slot="footer" class="dialog-footer">
              <el-button @click="treeFormVisible = false">取消</el-button>
              <!-- <el-button type="primary" @click="treeFormVisible = false">确认</el-button> -->
              <el-button type="primary" @click="applist">确认</el-button>
            </div>
          </el-dialog>



    </el-container>
  </div>
</template>

<script>
import { fetchList,smallAblist,samllDelete,uploadlist,circuList,updateAuditing,confirmation,updeletedata,dendrogram } from '@/api/equipMent/newVereception'
import {flowsheet} from '@/api/equipMent/acceptanceSheet'
import waves from '@/directive/waves' // 水波纹指
import { baseUrl } from '@/api/common/fileBaseUrl'
export default {
  name: 'newVereception',
  directives: {
    waves
  },
  data() {
    return {
      styid:'',  
      value13:[],
      smallslist:[],//第一个小表格
      towlistdata:[],//第二个小表格
       documentW:'',
      listyst: [],
      lookList: [],
      circulation:[],//流转记录
      fliestyps:null,//上传文件路径
      porisgid:'',
      grite: '',
      total: null,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        auditingType:3,
        type:0,
        acceptanceType:1
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
      numbersty:false,//确认按钮
      fromLoading:true,//弹出框加载动画
      chartData:'',//流程图
     
     // 使用工厂树的数据
      datast: [],
      defaultProps: {
        children: 'children',
        label: 'orgFullName'
      },
      i: 0,
      radio: '', // 使用工厂
      yease:'',
      treeFormVisible: false, // 使用工厂树选择

      
      isAdd: false, // 新增or编辑
      siteDetail: false, // 新增、编辑弹窗
      editLoading: false, // 提交按钮加载动画
      showStatus: true, // 表单项显示状态
      formSearch_send: false, // 查询条件点选
      listLoading: true, // 远程搜索加载动画
      dialogPvVisible: false,
      dialoglookVisible: false, // 弹窗属性
      siteCodeState: '', // 岗位编码禁用状态
      // 弹框内输入框不填显示的提示信息
       rules: {
        documentWordCode: [{ required: true, message: '请输入', trigger: 'change' }],
        useCompanyName: [{ required: true, message: '请输入', trigger: 'change' }],
        useFactoryName: [{ required: true, message: '请输入', trigger: 'change' }],
        useWorkshopName:[{ required: true, message: '请输入', trigger: 'change' }],
        equipmentName:[{ required: true, message: '请输入', trigger: 'change' }],
        typeSpecification:[{ required: true, message: '请输入', trigger: 'change' }],  
        outFactoryCode:[{ required: true, message: '请输入', trigger: 'change' }], 
        fixedAssetCode:[{ required: true, message: '请输入', trigger: 'change' }],
        supplier:[{ required: true, message: '请输入', trigger: 'change' }], 
        payTime:[{ required: true, message: '请输入', trigger: 'change' }], 
        acceptanceFinishTime:[{ required: true, message: '请输入', trigger: 'change' }],
        assetOwnershipCompany:[{ required: true, message: '请选择', trigger: 'change' }],
        acceptanceSituation:[{ required: true, message: '请输入', trigger: 'change' }]
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
          this.listyst = response.data.data.list
        this.total = response.data.data.total
        //   this.listLoading = false
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 1000)
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

     // 使用工厂的接口
    treestyps() {
      this.datast.splice(0)
      dendrogram('').then(response => {
        this.datast.push(response.data.data)
        console.log(this.datast)
         for(var i=0;i<this.datast.length;i++){
            if(this.datast[i].orgType =="部门"){
               this.datast[i].disabled = true
             }
          /*  console.log(this.datast[i].children) */
           for(var j=0;j<this.datast[i].children.length;j++){
            /*  console.log(this.datast[i].children[j]) */
             const child = this.datast[i].children[j]
             if(child.orgType =="部门"){
               child.disabled = true
             }
             if(child.children!==null){
               for(var p=0;p<child.children.length;p++){
                 if(child.children[p].orgType =="部门"){
                  child.children[p].disabled = true
             }
               }
             }
           }
         }
      })
    },
     // 使用工厂的树选择按钮
    treeco(){
      this.treeFormVisible = true
      this.treestyps()
    },
    // 设置树状图单选
    handleClick(data, checked, node) {
      this.i++
      if (this.i % 2 == 0) {
        if (checked) {
          console.log(checked)
          console.log(data)
          this.$refs.tree.setCheckedNodes([])
          this.$refs.tree.setCheckedNodes([data])
          
          // this.orgsection = data.orgCode
          // 交叉点击节点
        } else {
           this.$refs.tree.setCheckedNodes([])
          // 点击已经选中的节点，置空
        }
      }
    },
    // 节点
     getCheckedNodes() {
      this.treeData = this.$refs.tree.getCheckedNodes()
      this.radio = this.treeData[0].orgCode
      this.yease = this.treeData[0].orgFullName
    },

     // 确认按钮
    applist(){
      this.getCheckedNodes()
      this.temp.assetOwnershipCompany = this.yease
      this.temp.assetOwnershipCompanyCode = this.radio

      this.treeFormVisible = false
    
    },
    // 树状图的点击方法
    handleNodeClick(data) {
    
    },

  clearsp(){
    this.temp.assetOwnershipCompany = ''
    this.temp.assetOwnershipCompanyCode =''
  },


     // 查看
    checkDetails(row) {
      console.log(12344567)
      console.log(row)
      this.dialogFormVisible = true
      this.clearsp()
      this.styid = row.id
      this.porisgid = row.processInstanceId
      this.temp = Object.assign({}, row)
      this.dialoglookVisible = true
      this.siteCodeState = true
      this.fromLoading = false//弹窗加载动画
      this.activeName = 'first'//选项卡默认选项
      if(row.isAcceptanceName == "已接收"){
         this.numbersty = false
      }else{
         this.numbersty = true
      }
      
      this.temp.acceptanceSituation = row.acceptanceSituation.toString()
      this.circulationlist()
       // 第一个小表格接口
          const samllblist={
            moduleType:7,
            attachmentCode:"XSBYSDFJ",
            documentWordCode:row.documentWordCode
          }
        smallAblist(samllblist).then(response => {
          this.smallslist = response.data.data
        })
        // 第二个小表格数据 towlistdata
          const samblist={
            moduleType:7,
            attachmentCode:"SBJXJLFJ",
            documentWordCode:row.documentWordCode
          }
        smallAblist(samblist).then(response => {
          this.towlistdata = response.data.data
        })

      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
     // 流转记录
    circulationlist(){
      let processInstanceId=this.porisgid
     circuList(processInstanceId).then(response =>{
        this.circulation = response.data.data
     })
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
  //  确认接收按钮
  saveData(){
   console.log(this.styid)
    const ids =this.styid
    if(this.yease==''){
      this.$notify({
					  title: '提示',
				  	message:'请选择资产归属公司',
				  	type: 'warning',
				    duration: 3000
           }) 
           return
    }else{ 
    confirmation(ids,this.radio,this.yease).then(repost => {
      const masg = repost.data.msg
      if(repost.data.code==200){
        this.$message({
                    title: '成功',
                    message: masg ,
                    type: 'success',
                    duration: 2000
                  })
           this.dialogFormVisible = false
           this.getAA()
      }else{
        this.$notify({
                  title: '警告',
                  message: masg,
                  type: 'warning',
                  duration: 3000
            })
         } 
        }) 
      }
    },

   // 第一个上传的按钮
     noticeUpload(e){
       console.log(1234)
        let file = e.target.files[0];
        console.log(file)
         const fileData1 = {
        attachmentCode: 'XSBYSDFJ',
        moduleType: '7',
        fileName: undefined,
        filePath: undefined, // 文件URL
        node: '开始',
        code:undefined
      }   
        if (file != null) {
        let param = new FormData(); //创建form对象
        param.append("file", file, file.name); //通过append向form对象添加数据
         this.filenamesty = file.name
         fileData1.fileName = file.name
         console.log(file.name)
        uploadlist(param).then(resp => { //调用上传接口
          if (resp.data.code == 200) {
              this.fliestyps = resp.data.data.remoteFilename
               fileData1.filePath = resp.data.data.remoteFilename //文件地址
                this.smallslist.push(fileData1)
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
    //  第二个上传按钮
     twofileUp(e){
        console.log(1234)
        let file = e.target.files[0];
        console.log(file)
         const fileData2 = {
        attachmentCode: 'SBJXJLFJ',
        moduleType: '7',
        fileName: undefined,
        filePath: undefined, // 文件URL
        node: '开始',
        code:undefined
            }   
        if (file != null) {
        let param = new FormData(); //创建form对象
        param.append("file", file, file.name); //通过append向form对象添加数据
         this.filenamesty = file.name
         fileData2.fileName = file.name
         console.log(file.name)
        uploadlist(param).then(resp => { //调用上传接口
          if (resp.data.code == 200) {

               fileData2.filePath = resp.data.data.remoteFilename //文件地址
               this.towlistdata.push(fileData2)
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

#buttstyps{
   width:42px;
   height:36px;
   cursor:pointer;
   text-align:center;
    }
 .buttonplace{
height:36px;
background:#409EFF;
color:#fff;
border:1px solid #fff;
position:absolute;
right:0;
top:0;
border-radius: 5px;
}
          </style>
