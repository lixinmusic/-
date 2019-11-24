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
          <el-dialog title="查看详情" top="8vh" v-dialogDrag width="850px" :visible.sync="dialogFormVisible">
              <!-- 选项卡 -->
        <el-tabs v-model="activeName" v-loading="fromLoading"><!-- @tab-click="handleClick" -->
          <el-tab-pane label="表单信息" name="first">
          <!-- 选项卡表格 -->
            <el-form :rules="rules" ref="dataForm" :model="temp" label-width="110px">
               <el-form-item>
                <span class="equip-title">闲置启动出库单</span>
              </el-form-item>
              <el-row>
              <el-col :span="8">     
              <el-form-item label="单据编号"  prop="formCode">
              <el-input style="width:281px" v-model="temp.formCode" disabled maxlength="32" class="enter medium-input" placeholder="空" ></el-input>
              </el-form-item>
              </el-col>
               <el-col :span="16">
              <el-form-item label="固定资产编号" prop="fixedAssetCode" style="margin-left:130px;"> 
              <el-input v-model="temp.fixedAssetCode" :disabled='siteCodeState?true:false' maxlength="8" style="width:271px" class="enter medium-input" placeholder="请输入固定资产编号" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>
             
              <el-row>
              <el-col :span="8">     
              <el-form-item label="使用公司"  prop="companyName">
              <el-input style="width:281px" v-model="temp.companyName" :disabled='siteCodeState?true:false' maxlength="32" class="enter medium-input" placeholder="输入使用公司" ></el-input>
              </el-form-item>
              </el-col>
               <el-col :span="16">
              <el-form-item label="使用工厂" prop="factoryName" style="margin-left:130px;"> 
              <el-input v-model="temp.factoryName" :disabled='siteCodeState?true:false' maxlength="8" style="width:271px" class="enter medium-input" placeholder="请输入使用工厂" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>
              
              <el-row>
              <el-col :span="8">     
              <el-form-item label="申请日期" prop="applyDate">
              <el-input v-model="temp.applyDate" maxlength="8" :disabled='siteCodeState?true:false' style="width:281px" class="enter medium-input" placeholder="请输入申请日期" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="设备名称" prop="equipmentName" style="margin-left:130px;">
              <el-input v-model="temp.equipmentName" maxlength="8" :disabled='siteCodeState?true:false' style="width:271px" class="enter medium-input" placeholder="请输入设备名称" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">     
              <el-form-item label="型号规格" prop="model"> 
              <el-input v-model="temp.model" :disabled='siteCodeState?true:false' maxlength="8" style="width:281px" class="enter medium-input" placeholder="请输入型号规格" ></el-input>   
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="数量" prop="number" style="margin-left:130px;"> 
              <el-input v-model="temp.number" maxlength="8" :disabled='siteCodeState?true:false' style="width:271px" class="enter medium-input" placeholder="请输入数量" ></el-input>   
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="11">
              <el-form-item label="原使用工厂" prop="originalFactoryName"> 
              <el-input v-model="temp.originalFactoryName" :disabled='siteCodeState?true:false' maxlength="8" style="width:281px" class="enter medium-input" placeholder="请输入原使用工厂" ></el-input>   
              </el-form-item>
              </el-col>
              <el-col :span="13">
              <el-form-item label="原使用部门" prop="originalDivisionName" style="margin-left:35px"> 
              <el-input v-model="temp.originalDivisionName" :disabled='siteCodeState?true:false' maxlength="8" style="width:271px" class="enter medium-input" placeholder="请输入原使用车间" ></el-input>   
              </el-form-item>
              </el-col>
              </el-row>

              
              <el-row>
              <el-col :span="10">     
              <el-form-item label="使用部门" prop="divisionName" > 
              <el-input value="radio" :disabled='siteCodeState?true:false' v-model="temp.divisionName" maxlength="8" style="width:281px" class="enter medium-input" placeholder="请输入使用部门"></el-input>
              <!-- <div type="primary" id="buttstyps" class="buttonplace" @click="treeco">选择</div> -->
              <!-- <div type="primary" id="buttstyps" class="buttonplacesy" @click="clears">清空</div>    -->
              </el-form-item>
              </el-col>
              <el-col :span="13" >
              <el-form-item label="启动安装位置" prop="installPlaceName" style="margin-left:65px"> 
              <el-input v-model="temp.installPlaceName"  :disabled='siteCodeState?true:false' maxlength="8" style="width:271px" class="enter medium-input" placeholder="请输入启动安装位置" ></el-input>
              <!-- <div type="primary" id="buttstyps" class="bupo" @click="changePlace">选择</div>    -->
              </el-form-item>
               </el-col>
             
              </el-row>

               <el-row>
              <el-col :span="11">     
              <el-form-item label="生产厂家(制作部门)" prop="manufacturer" label-width="80px" style="margin-left:29px"> 
              <el-input v-model="temp.manufacturer" :disabled='siteCodeState?true:false' maxlength="8" style="width:281px" class="enter medium-input" placeholder="请输入生产厂家" ></el-input>   
              </el-form-item>
              </el-col>
              <el-col :span="13">
              <el-form-item label="出厂编号" prop="serialNumber" style="margin-left:35px"> 
              <el-input v-model="temp.serialNumber" :disabled='siteCodeState?true:false' maxlength="8" style="width:271px" class="enter medium-input" placeholder="请输入出厂编号" ></el-input>   
              </el-form-item>
              </el-col>
              </el-row>

               <el-form-item label="申请启动理由" prop="applyReason">
                <el-input type="textarea" style="width:610px" :disabled='siteCodeState?true:false' maxlength="128" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入申请启动理由..." v-model="temp.applyReason">
                </el-input>
              </el-form-item>
              <!--  <el-form-item label="申请部门意见" prop="originalDepartmentAdvice">
                <el-input type="textarea" style="width:510px" maxlength="128" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入申请部门意见..." v-model="temp.originalDepartmentAdvice">
                </el-input>
              </el-form-item>
              <el-form-item label="资产部意见" prop="assetDepartmentAdvice">
                <el-input type="textarea" style="width:510px" maxlength="128" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入资产部意见..." v-model="temp.assetDepartmentAdvice">
                </el-input>
              </el-form-item> -->

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
            <!-- 使用部门的弹框 -->
          <el-dialog  width="40%" title="使用部门" :visible.sync="treeFormVisible" append-to-body :modal="false">
            <span style="margin-left:20px;color:red" >{{radio}}</span>
           <el-tree :data="datast" :props="defaultProps"  @node-click="handleNodeClick" check-strictly ref="tree" node-key="orgCode" show-checkbox highlight-current @check-change="handleClick"></el-tree>
           <div slot="footer" class="dialog-footer">
              <el-button @click="treeFormVisible = false">取消</el-button>
              <el-button type="primary" @click="treeFormVisible = false">确认</el-button>
            </div>
          </el-dialog>
           <!-- 选择设备地址 -->
      <el-dialog width="50%" title="选择位置" :visible.sync="equipVisible" append-to-body :close-on-click-modal="false" v-dialogDrag>
        <el-container>
          <el-aside width="500px">
            <span style="margin-left:20px;color:red" prop='getEquipTypeName'>{{getEquipTypeName}}</span>
            <el-tree 
            :data="equipData" 
            :props="defaultProps" 
            @node-click="handleNodeClick"></el-tree>
          </el-aside>
        </el-container>
        <div slot="footer" class="dialog-footer">
          <el-button @click="equipVisible= false">取消</el-button>
          <el-button @click="handleClickOk" type="primary">确定</el-button>
        </div>
      </el-dialog>
        </el-container>
  </div>
</template>

<script>
import {fetchList,circuList,confirmation,evaluate,dendrogram,fetchTree}from '@/api/idleProcess/exitList'
import waves from '@/directive/waves' // 水波纹指
export default {
  name: 'exitList',
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
        formType:1
      
      },
      activeName: 'first',//选项卡默认选项
      showpos:false,
      // 编辑和新增的字段设置
      temp: {
      
      },
      noeli:{  
        opetion:''//同意里的意见字段
      },
      // 使用公司树的数据
      radio: '', // 使用公司树的数组
      treeFormVisible: false, // 使用公司树选择
       i:0,
      datast: [],
      defaultProps: {
        children: 'children',
        label: 'orgFullName'
      },
      confirm1:false,//隐藏
      confirm2:false,//隐藏

     // 设备地址
      equipVisible: false,
      equipData: [],
      defaultProps: {
        children: 'children',
        label: 'addressName'
      },
      getEquipTypeCode: undefined,
      getEquipTypeName: undefined,
      dialogStatus: '',

      // 弹框显示
      dialogFormVisible: false,
      postylitys:false,
      affirmshow1:false,
      affirmshow2:false,
      popTitle: '',
      dialogStatus: '',
      CodeState:false,
    
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
      // 弹框内输入框不填显示的提示信息 divisionName
       rules: {
         applyReason: [{ required: true, message: '请填写...', trigger: 'change' }],
         installPlaceName: [{ required: true, message: '请填写...', trigger: 'change' }],
         divisionName: [{ required: true, message: '请选择...', trigger: 'change' }]
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
      this.fromLoading = false//弹窗加载动画
      console.log(9999999)
      if(row.outWarehouse == true){//已出库
        this.confirm1 = false
        this.confirm2 = true
        this.CodeState = true
      }else if(row.outWarehouse == false){
       this.confirm1 = true
        this.confirm2 = false
      }
      evaluate(id).then(repanst => {
        console.log(repanst.data.data)
        if(repanst.data.code==200){
         this.lookuplist = repanst.data.data
         this.temp = Object.assign({}, this.lookuplist)
         if(this.temp.applyDate!=null){ 
         this.temp.applyDate = this.temp.applyDate.substring(0,10)
         }
        }
      })
     
      console.log(23456789)
      console.log(this.temp)
      this.dialoglookVisible = true
      this.siteCodeState = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 使用公司清空按钮
    clears(){
    this.radio=''
    this.temp.divisionName=''
    this.treeFormVisible = false
    },
      // 使用公司树的接口
    // 树状图的接口
    treecostypo() {
      this.datast.splice(0)
      dendrogram('').then(response => {
        this.datast.push(response.data.data)
         
         for(var i=0;i<this.datast.length;i++){
            if(this.datast[i].orgType =="公司"){
               this.datast[i].disabled = true
             }
          /*  console.log(this.datast[i].children) */
           for(var j=0;j<this.datast[i].children.length;j++){
            /*  console.log(this.datast[i].children[j]) */
             const child = this.datast[i].children[j]
             if(child.orgType =="公司"){
               child.disabled = true
             }
             if(child.children!==null){
               for(var p=0;p<child.children.length;p++){
                 if(child.children[p].orgType =="公司"){
                  child.children[p].disabled = true
             }
               }
             }
           }
         }
      })
    },
     
   // 使用公司的树选择按钮
     treeco(){
      this.treeFormVisible = true
      this.treecostypo()
     },

     // 设置树状图单选
    handleClick(data, checked, node) {
     this.i++;
     if(this.i%1==0){
       if(checked == true){
         console.log(checked)
         console.log(data)
         this.$refs.tree.setCheckedNodes([]);
         this.$refs.tree.setCheckedNodes([data]);
         this.temp.divisionName = data.orgFullName
         this.radio = data.orgFullName
         this.orgwork = data.orgCode
       }else{
          this.$refs.tree.setCheckedNodes([]);
       }
     }
    },
     // 树状图的点击方法
    handleNodeClick(data, checked, node) {
       this.checkedId = data.id;
      
    },

    // 选择设备地址
    changePlace() {
      fetchTree().then(response => {
        this.equipData = []
        this.equipData = response.data.data[0].children
      })
      this.equipVisible = true
    },
    // 设备地址树
    handleNodeClick(data) {
      this.getEquipTypeCode = data.addressCode
      this.getEquipTypeName = data.addressName
    },
    // 选择设备地址确认
    handleClickOk() {
      this.temp.installPlaceName = this.getEquipTypeName
      this.temp.installPlaceCode = this.getEquipTypeCode
      this.equipVisible = false
    },


  //  确认接收按钮
  saveData(){
    this.$refs['dataForm'].validate(valid => {
      if (valid) {
      console.log(this.styid)
        const ids = this.styid
        console.log(ids)
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
       
     } */
      if(repost.data.code==200){
        this.$message({
         title: '成功',
         message:repost.data.msg ,
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
.bupo{

height:36px;
background:#409EFF;
color:#fff;
border:1px solid #fff;
position:absolute;
right:0;
top:0;
border-radius: 5px;
 text-align:center;
}
.buttonplacesy{
   height:36px;
background:#409EFF;
color:#fff;
border:1px solid #fff;
position:absolute;
right:-50px;
top:0px;
border-radius: 5px;
}
#buttstyps{
   width:42px;
   height:36px;
   cursor:pointer;
   text-align:center;
  }
          </style>
