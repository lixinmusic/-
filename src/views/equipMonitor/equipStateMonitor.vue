<template>
  <div class="app-container">
    <el-container> 
      <!-- 左侧树 -->
      <el-aside style="border:1px solid #f0f0f0;padding-top:20px;height:794px" width="280px">
        <el-tree 
          :data="equipData"      
          :props="defaultProps" 
          @node-click="handleNodeClick"
          :render-content="renderContent">
        </el-tree>
      </el-aside>
      <el-container>
        <el-main style="padding-top:0;"> <!-- v-show='mainShow' -->
          <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <!-- 按钮搜索条件 -->
            <div class="formDw" v-show="YCtabdiv">
                <button @click="toggle1()" :class="{'black':greenShow1,'public':!greenShow1}" style="color:white; font-weight: 400;width:70px;height:36px">关机</button>
                <span> {{closeTimeTX}}</span><span>/</span>
                <span style="margin-right:30px;" v-cloak>{{sumZJ}}</span>
            
              <button @click="toggle2()" :class="{'green':greenShow2,'public':!greenShow2}" style="color:white; font-weight: 400;width:70px;height:36px">加工</button>
                 <span> {{machiningTimeTX}}</span><span>/</span>
                <span style="margin-right:30px;" v-cloak>{{sumZJ}}</span>

              <button @click="toggle3()" :class="{'red':greenShow3,'public':!greenShow3}" style="color:white; font-weight: 400;width:70px;height:36px">停工</button>
               <span> {{stopTimeTX}}</span><span>/</span>
                <span style="margin-right:30px;" v-cloak>{{sumZJ}}</span>

              <button @click="toggle4()" :class="{'orange':greenShow4,'public':!greenShow4}" style="color:white; font-weight: 400;width:70px;height:36px">调试</button>
               <span> {{debugTimeTX}}</span><span>/</span>
                <span style="margin-right:30px;" v-cloak>{{sumZJ}}</span>

              <el-button type="primary" size="medium" style="float:right" icon="el-icon-search" @click="handleFilter">查询</el-button>
             <el-select style="float:right;width:13%"
                v-model="listQuery.equipmentType"
                filterable
                remote
                placeholder="请输入设备类型"
                :remote-method="getEuipeType"
                 clearable reserve-keyword>
                <el-option
                  v-for="item in euipeTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
          </el-select>
            </div>
            <!-- tab栏    设备明细-->
            <el-tab-pane label="设备明细" name="first">
              <el-row :gutter="20">
                <el-col :span="16" style="padding-right:0px;">
                  <el-row :gutter="20">
                    <el-col :span="7" style="padding-right:0px;" v-for="item in equipDetail" :key="item.id" >
                      <div @click="colorLump(item.equipmentType,item.equipmentCode,item.equipmentStatus,item.stopWorkReason,item.equipmentStatusStartTime,item.equipmentStatusContinueTime,item.planWorkTime,item.fixedAssetCode,item.equipmentName,item.equipmentCode)" class="machine-detail" :class="{'black':item.equipmentStatus==1,'green':item.equipmentStatus==2,'red':item.equipmentStatus==3,'orange':item.equipmentStatus==4,}">
                        <h4 style="color:#fff">{{item.equipmentName}}{{item.equipmentCode}}</h4>
                      </div> 
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="8" style="padding-right:0px;" v-if="right1">
                  <h3>设备基本信息</h3>
                  <div id="echart1" style="width:300px;height:400px" v-if="right1"></div> 
                </el-col>
                <!-- 设备基本信息 -->
                 <el-col :span="8" style="padding-right:0px;" v-show="right2">
                   <el-aside v-show="right2" style="border:1px solid #f0f0f0;width:450px;height:624px;margin-top:20px;" >
                   <h3 class="lefts">设备基本信息</h3>
                   <ul>
                     <li class="lefts">设备类型：{{equipmentType}}</li>
                     <li class="lefts">设备号：{{equipmentCode}}</li>
                     <li class="lefts">设备状态：{{equipmentStatu}}</li>
                     <li class="lefts">停工原因：{{stopWorkReason}}</li>
                     <li class="lefts">当前状态开始时间：{{equipmentStatusStartTime}}</li>
                     <li class="lefts">当前状态持续时间：{{equipmentStatusContinueTime}}h</li>
                     <li class="lefts">本日计划工作时间：{{planWorkTime}}<span v-show="hShow">h</span></li>
                   </ul>
                    <div class="box">
                      <div class="SKbat HS"></div>
                      <div class="YSpublic">设备无状态</div>
                      <div class="SKbat HH"></div>
                      <div class="YSpublic">关机</div>
                      <div class="SKbat LS"></div>
                      <div class="YSpublic">加工</div>
                      <div class="SKbat HE"></div>
                      <div class="YSpublic">停工</div>
                      <div class="SKbat CS"></div>
                      <div class="YSpublic">调试</div>
                      </div>
                <div id="main1" style="width:500px;height:300px;" v-show="right2"></div>
                <div id="echart2" style="width:300px;height:400px;margin-left:20%" v-show="right2"></div>
                </el-aside> 
                </el-col>
              </el-row>
                <!-- 分页 -->
               <div class="pagination-container">
                <el-pagination background 
                @size-change="handleSizeChange" 
                @current-change="handleCurrentChange" 
                :current-page="listQuery.pageNum" 
                :page-size="listQuery.pageSize"
                layout="prev, pager, next" :total="total">
                </el-pagination>
                </div>
            </el-tab-pane>
            <el-tab-pane label="列表明细" name="second">
              <el-table :data="equipDetail" width="1385" height="600" border fit highlight-current-row 
                style="width:1385px;" :header-cell-style="{background:'oldlace'}">
                <el-table-column prop="workShopName" align="center" label="车间" min-width="142">
                  <template slot-scope="scope">
                    <span>{{scope.row.workShopName==''?'_':scope.row.workShopName}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="fixedAssetCode" align="center" label="固定资产编号" min-width="142">
                  <template slot-scope="scope">
                    <span>{{scope.row.fixedAssetCode==''?'_':scope.row.fixedAssetCode}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="equipmentType" align="center" label="设备类型" min-width="134">
                  <template slot-scope="scope">
                    <span>{{scope.row.equipmentType==''?'_':scope.row.equipmentType}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="equipmentName" align="center" label="设备名称" min-width="134">
                   <template slot-scope="scope">
                    <span>{{scope.row.equipmentName==''?'_':scope.row.equipmentName + scope.row.equipmentCode}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="equipmentClass" align="center" label="设备类别" min-width="134">
                  <template slot-scope="scope">
                    <span>{{scope.row.equipmentClass==''?'_':scope.row.equipmentClass}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="emtStatusName" align="center" label="设备状态" min-width="134">
                  <template slot-scope="scope">
                    <span>{{scope.row.emtStatusName==''?'_':scope.row.emtStatusName}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="equipmentStatusStartTime" align="center" label="设备状态开始时间" min-width="168">
                   <template slot-scope="scope">
                    <span>{{scope.row.equipmentStatusStartTime==''?'_':scope.row.equipmentStatusStartTime}}</span>
                  </template> 
                </el-table-column>
                <el-table-column prop="equipmentStatusContinueTime" align="center" label="设备状态持续时间" min-width="134">
                  <template slot-scope="scope">
                   <span>{{scope.row.equipmentStatusContinueTime==''?'_':scope.row.equipmentStatusContinueTime}}h</span>
                  </template>
                </el-table-column>
                <el-table-column prop="stopWorkReason" align="center" label="停工原因" min-width="134">
                  <template slot-scope="scope">
                    <span>{{scope.row.stopWorkReason==''?'_':scope.row.stopWorkReason}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="planLoad" align="center" label="计划负荷" min-width="134"> 
                   <template slot-scope="scope">
                    <!-- <span>{{scope.row.planLoad==''?'_':scope.row.planLoad}}</span> -->
                        <span>24小时</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="及时稼动率" min-width="134">
                    <template slot-scope="scope">
                    <span>{{30/12}}</span>
                  </template>
                </el-table-column>
              </el-table>

              <div class="pagination-container">
                <el-pagination background 
                @size-change="handleSizeChange" 
                @current-change="handleCurrentChange"
                :current-page="listQuery.pageNum" 
                :page-size="listQuery.pageSize"  
                layout="prev, pager, next" :total="total">
                </el-pagination>
              </div>
            </el-tab-pane>
             <!-- show-summary :summary-method="getSummaries" -->
            <el-tab-pane label="设备汇总" name="third" v-if="tabShow">
              <el-table :data="postynHZ" show-summary :summary-method="getSummaries" v-loading="listLoading" border fit highlight-current-row 
                style="width: 100%;" :header-cell-style="{background:'oldlace'}">
                <el-table-column prop="factoryName" align="center" label="工厂">
                </el-table-column>
                <el-table-column prop="workShopName" align="center" label="车间">
                </el-table-column>
                <el-table-column prop="equipmentAreaName" align="center" label="设备区域">
                </el-table-column>
                <el-table-column prop="sum" align="center" label="设备台数">
                 <template slot-scope="scope">
                  {{scope.row.dto.sum==''?'*':scope.row.dto.sum}}
                  </template>
                </el-table-column>
                <el-table-column prop="two" align="center" label="加工台数">
                  <template slot-scope="scope">
                  {{scope.row.dto.two==''?'*':scope.row.dto.two}}
                  </template>
                </el-table-column>
                <el-table-column prop="three" align="center" label="停工台数">
                  <template slot-scope="scope">
                  {{scope.row.dto.three==''?'*':scope.row.dto.three}}
                  </template>
                </el-table-column>
                <el-table-column prop="four" align="center" label="调试台数">
                  <template slot-scope="scope">
                  {{scope.row.dto.four==''?'*':scope.row.dto.four}}
                  </template>
                </el-table-column>
                <el-table-column prop="one" align="center" label="关机台数">
                  <template slot-scope="scope">
                  {{scope.row.dto.one==''?'*':scope.row.dto.one}}
                  </template>
                </el-table-column>
               
              </el-table>
               <!-- 	<table border= "0" width="100%" style="font-size:14px;color: #606266;">
                  <tbody>
                   <tr style="height:45px">
                      <td colspan="1" style="text-align:center;border:1px solid #ebeef5;padding-right:3px;border-top:none">汇总</td>
                      <td colspan="12" style="text-align:center;border:1px solid #ebeef5;border-top:none;border-left:none">{{sumOfEquip}}</td>
                      <td colspan="12" style="text-align:center;border:1px solid #ebeef5;border-top:none;border-left:none">{{sumOfProcess}}</td>
                      <td colspan="12" style="text-align:center;border:1px solid #ebeef5;border-top:none;border-left:none">{{sumOfStop}}</td>
                      <td colspan="12" style="text-align:center;border:1px solid #ebeef5;border-top:none;border-left:none">{{sumOfDebug}}</td>
                      <td colspan="12" style="text-align:center;border:1px solid #ebeef5;border-top:none;border-left:none">{{sumOfOff}}</td>
                    </tr>
                  </tbody>
                 </table> -->
              
            </el-tab-pane>
          </el-tabs>
        </el-main>
        
      </el-container>
    </el-container>
  </div>
</template>

<script>
// import { fetchTree, fetchListByCode, fetchDetail } from '@/api/baseInfo/baseEquipAddress'
import { fetchTree, fetchListByCode,ZBfetch,HZlistpo,kposta,SXTposul,fuzzyQuery } from '@/api/equipMonitor/equipStateMonitor'
import echarts from 'echarts'
export default {
  name: 'equipStateMonitor',
  data() {
    return {
      hShow:false,//本日的计划时间单位
      emtStatusName:'',//设备状态的转化成名字
      isEnd_xuan:'',//isEnd的数值
      // 设备类型模糊查询数组
      euipeTypeList: [],
      YCtabdiv:true,//搜索条件隐藏
      levelDJ:'',//树的等级
      // mainShow:false,//页面刚打开显隐
      tabShow:false,//设备汇总的显隐
      flag:true,
      activeName:'first',
      // 设备地址树结构
      equipData: [],
      defaultProps: {
        children: 'children',
        label: 'addressName'
      },
      // 父级地址编码
      parCode: 'sbdzqy',
      parName: '设备地址区域',
      options:[],
      // 设备明细
      equipDetail:[],
      total: null,
      // 设备基本信息
      right1:true,
      right2:false,

      // 列表明细
      tableKey: 0,
      listLoading: false,
      tableDetail: [],
      // 设备汇总
      equipSummary:[],
      listQuery: {
        pageNum: 1,
        pageSize: 40
      
      },
      // 四个状态按钮的颜色切换
      greenShow1:true,
      greenShow2:true,
      greenShow3:true,
      greenShow4:true,
      // 四个状态的个数显示多少
      listZB:[],//占比图数据
      sumZJ:'',
      closeTimeTX:'',
      machiningTimeTX:'',
      stopTimeTX:'',
      debugTimeTX:'',
      // 每个色块的参数
      equipmentType:'',
      equipmentCode:'',
      equipmentStatu:'',
      stopWorkReason:'',
      equipmentStatusStartTime:'',
      equipmentStatusContinueTime:'',
      planWorkTime:'',
      postynHZ:[],
      // 设备汇总的汇总的个数
      sumOfEquip:'',
      sumOfProcess:'',
      sumOfStop:'',
      sumOfDebug:'',
      sumOfOff:'',
      // 点击色块里的占比图
      SKpinst:[],
      SKcloseTime:'',
      SKmachiningTime:'',
      SKstopTime:'',
      SKdebugTime:'',
      // 时序图
   
      SXTrecord:[],//时序图
      Yname:[],

    

    }
  },
  created() {
    this.getTree()
    this.getApp()
    this.ZBlist()
    this.posHZ()
     /* setTimeout(() => {
       this.F5postr()
     },300000) */
  },
  methods: {
    renderContent(h, { node, data, store }) {
      return (
        <span>
          <span title={node.label}>{node.label}</span>
        </span>)
    },
    // 每五分钟刷新
   /*  F5postr(){
        window.location.reload();
    }, */

    // 获取设备类型模糊查询数组
    getEuipeType(query) {
      if (query !== '') {
        this.euipeTypeList = []
        fuzzyQuery(query).then(response => {
          if (response.data.code === 200) {
            this.euipeTypeList = response.data.data.map(item => {
              return { value: item.categoryName, label: item.categoryName }
            })
          }
        })
      } else {
        this.euipeTypeList = []
      }
    },

    // 点击设备地址请求表格
    handleNodeClick(data) {
       this.parCode = data.addressCode
       this.parName = data.addressName
       this.isEnd_xuan = data.isEnd
       this.levelDJ = data.level
      // this.getList(this.parCode)
       if(data.isEnd==0 && data.level==4){//0为车间
        // this.mainShow = true//页面显隐
        this.tabShow = true//页面切换
        this.activeName = 'third'
        this.YCtabdiv = false//搜索条件隐藏
        this.getApp()
        this.posHZ()
      }else if(data.isEnd==1 && data.level==5){//1为区域 熔炼区
        // this.mainShow = true
        this.tabShow = false
        this.activeName = 'first'
        this.YCtabdiv = true
        this.right1 = true
        this.right2 = false
        this.getApp()
        this.ZBlist()
        this.greenShow1 = true
        this.greenShow2 = true
        this.greenShow3 = true
        this.greenShow4 = true
        setTimeout(() => {
          this.$nextTick(() => {
           this.initChart()
           })
         },800)
      } 
    },
    // 表格接口 jfjt
   getApp(){
          
          if(this.levelDJ ==4){
            this.listQuery.workShopCode = this.parCode
            this.listQuery.isEnd = this.isEnd_xuan
            delete this.listQuery.equipmentAreaCode
         }else if(this.levelDJ ==5){
            this.listQuery.equipmentAreaCode = this.parCode 
            this.listQuery.isEnd = this.isEnd_xuan
         }else{
           this.listQuery.equipmentAreaCode = 'jfjt'
           this.listQuery.isEnd = 1
         }
        var pos = [1,2,3,4]
        
        this.listQuery.status_list = pos + ''
        
    fetchListByCode(this.listQuery).then(response =>{
      if (response.data.code === 200) {
         this.equipDetail = response.data.data.list
         this.total = response.data.data.total
         for(var i=0;i<this.equipDetail.length;i++){
           console.log(this.equipDetail[i].equipmentStatus)
           if(this.equipDetail[i].equipmentStatus == 1){
               this.equipDetail[i].emtStatusName = '关机'
           }else if(this.equipDetail[i].equipmentStatus == 2){
               this.equipDetail[i].emtStatusName = '加工'
           }else if(this.equipDetail[i].equipmentStatus == 3){
               this.equipDetail[i].emtStatusName = '停工'
           }else if(this.equipDetail[i].equipmentStatus == 4){
                this.equipDetail[i].emtStatusName = '调试'
           }
         }
      }else {
          this.$notify({
            title: '警告',
            message: response.data.msg,
            type: 'warning',
            duration: 3000
          })
        }
    })
   },
  //  刚进来的饼状图
    ZBlist(){
       var po = {isEnd:1,equipmentAreaCode:'jfjt'}
      if(this.levelDJ ==5){
           var po = {isEnd:1,equipmentAreaCode:this.parCode}
             // equipmentAreaCode:"dyzz"
         }else if(this.levelDJ ==4){
             var po = {isEnd:0,workShopCode:this.parCode}
           }
     ZBfetch(po).then(response =>{//四个状态后面的数字
       if (response.data.code === 200) {
          // console.log(response.data.data)
           this.listZB = response.data.data
           this.sumZJ = this.listZB[0].sum//总数
           this.closeTimeTX = this.listZB[0].number //关机
           this.machiningTimeTX = this.listZB[1].number//加工
           this.stopTimeTX = this.listZB[2].number//停工
           this.debugTimeTX = this.listZB[3].number//调试
       }else {
          this.$notify({
            title: '警告',
            message: response.data.msg,
            type: 'warning',
            duration: 3000
          })
        }
     })
    },
  //  设备汇总接口  
    posHZ(){
      const workShopCode = this.parCode
     HZlistpo(workShopCode).then(response => {
        if (response.data.code === 200) {
             this.postynHZ = response.data.data.result
             this.sumOfEquip = response.data.data.numberOfEquipmentSum
             this.sumOfProcess = response.data.data.numberOfProcessSum
             this.sumOfStop = response.data.data.numberOfStopSum
             this.sumOfDebug = response.data.data.numberOfDebugSum
             this.sumOfOff = response.data.data.numberOfOffSum
        }else {
          this.$notify({
            title: '警告',
            message: response.data.msg,
            type: 'warning',
            duration: 3000
          })
        }
     })
    },
    // 设备汇总的时间
    getSummaries(param) {
        const { columns, data } = param;
       /*   console.log(1234)
        console.log(param)   */ 
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '汇总';
            return;
          }
         switch(column.property) {
            case "sum":
            sums[index] = this.sumOfEquip  
            break;
            case "two":
            sums[index] = this.sumOfProcess
            break;
            case "three":
            sums[index] = this.sumOfStop  
            break;
            case "four":
            sums[index] = this.sumOfDebug
            break;
            case "one":
            sums[index] =  this.sumOfOff  
            break;
            default:
            break;
          }
        })
        return sums;
      },

    
    // 关机按钮
     toggle1(){
        this.greenShow1 =!this.greenShow1
        // if(this.activeName=='first'){//设备明细tab
         if(this.greenShow1 && !this.greenShow2 && !this.greenShow3 && !this.greenShow4){
             var pos = [1]
         }else if(this.greenShow1 && this.greenShow2 && !this.greenShow3 && !this.greenShow4){
             var pos = [1,2]
         }else if(this.greenShow1 && this.greenShow2 && this.greenShow3 && !this.greenShow4){
             var pos = [1,2,3]
         }else if(this.greenShow1 && this.greenShow2 && this.greenShow3 && this.greenShow4){
              var pos = [1,2,3,4]
         }else if(this.greenShow1 && !this.greenShow2 && this.greenShow3 && !this.greenShow4){
              var pos = [1,3]
         }else if(this.greenShow1 && !this.greenShow2 && this.greenShow3 && this.greenShow4){
               var pos = [1,3,4]
         }else if(this.greenShow1 && !this.greenShow2 && !this.greenShow3 && this.greenShow4){
               var pos = [1,4]
         }else if(this.greenShow1 && this.greenShow2 && !this.greenShow3 && this.greenShow4){
               var pos = [1,2,4]
         }else if(!this.greenShow1 && this.greenShow2 && !this.greenShow3 && !this.greenShow4){
               var pos = [2]
         }else if(!this.greenShow1 && this.greenShow2 && this.greenShow3 && this.greenShow4){
                var pos = [2,3,4]
         }else if(!this.greenShow1 && this.greenShow2 && !this.greenShow3 && this.greenShow4){
                var pos = [2,4]
         }else if(!this.greenShow1 && this.greenShow2 && this.greenShow3 && !this.greenShow4){
                var pos = [2,3]
         }else if(!this.greenShow1 && !this.greenShow2 && this.greenShow3 && !this.greenShow4){
                var pos = [3]
         }else if(!this.greenShow1 && !this.greenShow2 && this.greenShow3 && this.greenShow4){
                var pos = [3,4]
         }else if(!this.greenShow1 && !this.greenShow2 && !this.greenShow3 && this.greenShow4){
                var pos = [4]
         }
          this.listQuery.status_list = pos + ''
            this.listQuery.isEnd = this.isEnd_xuan
            fetchListByCode(this.listQuery).then(response =>{
                if (response.data.code === 200) {
                  this.equipDetail = response.data.data.list
                   this.total = response.data.data.total
                   for(var i=0;i<this.equipDetail.length;i++){
                    if(this.equipDetail[i].equipmentStatus == 1){
                          this.equipDetail[i].emtStatusName = '关机'
                    }else if(this.equipDetail[i].equipmentStatus == 2){
                        this.equipDetail[i].emtStatusName = '加工'
                    }else if(this.equipDetail[i].equipmentStatus == 3){
                        this.equipDetail[i].emtStatusName = '停工'
                    }else if(this.equipDetail[i].equipmentStatus == 4){
                          this.equipDetail[i].emtStatusName = '调试'
                    }
                  }
                }
              })
       /*  }else if(this.activeName=='second'){
            console.log(2222)
        } */
     },  
      //加工按钮
      toggle2(){
            this.greenShow2 =!this.greenShow2
            if(this.greenShow1 && !this.greenShow2 && !this.greenShow3 && !this.greenShow4){
                var pos = [1]
            }else if(this.greenShow1 && this.greenShow2 && !this.greenShow3 && !this.greenShow4){
                var pos = [1,2]
            }else if(this.greenShow1 && this.greenShow2 && this.greenShow3 && !this.greenShow4){
                var pos = [1,2,3]
            }else if(this.greenShow1 && this.greenShow2 && this.greenShow3 && this.greenShow4){
                  var pos = [1,2,3,4]
            }else if(this.greenShow1 && !this.greenShow2 && this.greenShow3 && !this.greenShow4){
                  var pos = [1,3]
            }else if(this.greenShow1 && !this.greenShow2 && this.greenShow3 && this.greenShow4){
                  var pos = [1,3,4]
            }else if(this.greenShow1 && !this.greenShow2 && !this.greenShow3 && this.greenShow4){
                  var pos = [1,4]
            }else if(this.greenShow1 && this.greenShow2 && !this.greenShow3 && this.greenShow4){
                  var pos = [1,2,4]
            }else if(!this.greenShow1 && this.greenShow2 && !this.greenShow3 && !this.greenShow4){
                  var pos = [2]
            }else if(!this.greenShow1 && this.greenShow2 && this.greenShow3 && this.greenShow4){
                    var pos = [2,3,4]
            }else if(!this.greenShow1 && this.greenShow2 && !this.greenShow3 && this.greenShow4){
                    var pos = [2,4]
            }else if(!this.greenShow1 && this.greenShow2 && this.greenShow3 && !this.greenShow4){
                    var pos = [2,3]
            }else if(!this.greenShow1 && !this.greenShow2 && this.greenShow3 && !this.greenShow4){
                    var pos = [3]
            }else if(!this.greenShow1 && !this.greenShow2 && this.greenShow3 && this.greenShow4){
                    var pos = [3,4]
            }else if(!this.greenShow1 && !this.greenShow2 && !this.greenShow3 && this.greenShow4){
                    var pos = [4]
            }
              this.listQuery.status_list = pos + ''
              this.listQuery.isEnd = this.isEnd_xuan
                fetchListByCode(this.listQuery).then(response =>{
                    if (response.data.code === 200) {
                      this.equipDetail = response.data.data.list
                      this.total = response.data.data.total
                   for(var i=0;i<this.equipDetail.length;i++){
                    if(this.equipDetail[i].equipmentStatus == 1){
                          this.equipDetail[i].emtStatusName = '关机'
                    }else if(this.equipDetail[i].equipmentStatus == 2){
                        this.equipDetail[i].emtStatusName = '加工'
                    }else if(this.equipDetail[i].equipmentStatus == 3){
                        this.equipDetail[i].emtStatusName = '停工'
                    }else if(this.equipDetail[i].equipmentStatus == 4){
                          this.equipDetail[i].emtStatusName = '调试'
                    }
                  }
                    }
                  })
        },
    //停工按钮
    toggle3(){
         this.greenShow3 =!this.greenShow3
         if(this.greenShow1 && !this.greenShow2 && !this.greenShow3 && !this.greenShow4){
             var pos = [1]
         }else if(this.greenShow1 && this.greenShow2 && !this.greenShow3 && !this.greenShow4){
             var pos = [1,2]
         }else if(this.greenShow1 && this.greenShow2 && this.greenShow3 && !this.greenShow4){
             var pos = [1,2,3]
         }else if(this.greenShow1 && this.greenShow2 && this.greenShow3 && this.greenShow4){
              var pos = [1,2,3,4]
         }else if(this.greenShow1 && !this.greenShow2 && this.greenShow3 && !this.greenShow4){
              var pos = [1,3]
         }else if(this.greenShow1 && !this.greenShow2 && this.greenShow3 && this.greenShow4){
               var pos = [1,3,4]
         }else if(this.greenShow1 && !this.greenShow2 && !this.greenShow3 && this.greenShow4){
               var pos = [1,4]
         }else if(this.greenShow1 && this.greenShow2 && !this.greenShow3 && this.greenShow4){
               var pos = [1,2,4]
         }else if(!this.greenShow1 && this.greenShow2 && !this.greenShow3 && !this.greenShow4){
               var pos = [2]
         }else if(!this.greenShow1 && this.greenShow2 && this.greenShow3 && this.greenShow4){
                var pos = [2,3,4]
         }else if(!this.greenShow1 && this.greenShow2 && !this.greenShow3 && this.greenShow4){
                var pos = [2,4]
         }else if(!this.greenShow1 && this.greenShow2 && this.greenShow3 && !this.greenShow4){
                var pos = [2,3]
         }else if(!this.greenShow1 && !this.greenShow2 && this.greenShow3 && !this.greenShow4){
                var pos = [3]
         }else if(!this.greenShow1 && !this.greenShow2 && this.greenShow3 && this.greenShow4){
                var pos = [3,4]
         }else if(!this.greenShow1 && !this.greenShow2 && !this.greenShow3 && this.greenShow4){
                var pos = [4]
         }
              this.listQuery.status_list = pos + ''
              this.listQuery.isEnd = this.isEnd_xuan
                fetchListByCode(this.listQuery).then(response =>{
                    if (response.data.code === 200) {
                      this.equipDetail = response.data.data.list
                      this.total = response.data.data.total
                   for(var i=0;i<this.equipDetail.length;i++){
                    if(this.equipDetail[i].equipmentStatus == 1){
                        this.equipDetail[i].emtStatusName = '关机'
                    }else if(this.equipDetail[i].equipmentStatus == 2){
                        this.equipDetail[i].emtStatusName = '加工'
                    }else if(this.equipDetail[i].equipmentStatus == 3){
                        this.equipDetail[i].emtStatusName = '停工'
                    }else if(this.equipDetail[i].equipmentStatus == 4){
                        this.equipDetail[i].emtStatusName = '调试'
                    }
                  }
                    }
                  })

    },
     //  调试按钮
    toggle4(){
       this.greenShow4 =!this.greenShow4
            if(this.greenShow1 && !this.greenShow2 && !this.greenShow3 && !this.greenShow4){
             var pos = [1]
         }else if(this.greenShow1 && this.greenShow2 && !this.greenShow3 && !this.greenShow4){
             var pos = [1,2]
         }else if(this.greenShow1 && this.greenShow2 && this.greenShow3 && !this.greenShow4){
             var pos = [1,2,3]
         }else if(this.greenShow1 && this.greenShow2 && this.greenShow3 && this.greenShow4){
              var pos = [1,2,3,4]
         }else if(this.greenShow1 && !this.greenShow2 && this.greenShow3 && !this.greenShow4){
              var pos = [1,3]
         }else if(this.greenShow1 && !this.greenShow2 && this.greenShow3 && this.greenShow4){
               var pos = [1,3,4]
         }else if(this.greenShow1 && !this.greenShow2 && !this.greenShow3 && this.greenShow4){
               var pos = [1,4]
         }else if(this.greenShow1 && this.greenShow2 && !this.greenShow3 && this.greenShow4){
               var pos = [1,2,4]
         }else if(!this.greenShow1 && this.greenShow2 && !this.greenShow3 && !this.greenShow4){
               var pos = [2]
         }else if(!this.greenShow1 && this.greenShow2 && this.greenShow3 && this.greenShow4){
                var pos = [2,3,4]
         }else if(!this.greenShow1 && this.greenShow2 && !this.greenShow3 && this.greenShow4){
                var pos = [2,4]
         }else if(!this.greenShow1 && this.greenShow2 && this.greenShow3 && !this.greenShow4){
                var pos = [2,3]
         }else if(!this.greenShow1 && !this.greenShow2 && this.greenShow3 && !this.greenShow4){
                var pos = [3]
         }else if(!this.greenShow1 && !this.greenShow2 && this.greenShow3 && this.greenShow4){
                var pos = [3,4]
         }else if(!this.greenShow1 && !this.greenShow2 && !this.greenShow3 && this.greenShow4){
                var pos = [4]
         }
              this.listQuery.status_list = pos + ''
              this.listQuery.isEnd = this.isEnd_xuan
                fetchListByCode(this.listQuery).then(response =>{
                    if (response.data.code === 200) {
                      this.equipDetail = response.data.data.list
                      this.total = response.data.data.total
                   for(var i=0;i<this.equipDetail.length;i++){
                    if(this.equipDetail[i].equipmentStatus == 1){
                        this.equipDetail[i].emtStatusName = '关机'
                    }else if(this.equipDetail[i].equipmentStatus == 2){
                        this.equipDetail[i].emtStatusName = '加工'
                    }else if(this.equipDetail[i].equipmentStatus == 3){
                        this.equipDetail[i].emtStatusName = '停工'
                    }else if(this.equipDetail[i].equipmentStatus == 4){
                        this.equipDetail[i].emtStatusName = '调试'
                    }
                  }
                    }
                  })
    },
   
    // 请求设备地址树
    getTree() {
      fetchTree().then(response => {
        this.equipData = []
        this.equipData.push(response.data.data[0])
        console.log(this.equipData)
      })
    },
    
    
    // 搜索
    handleFilter() {
      // this.listQuery.pageNum = 1
      this.getApp()
    },
    // 分页
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getApp()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getApp()
    },
     initChart2(initData){//时序图
       var myChart1 = echarts.init(document.getElementById('main1'));
       var colors = ['rgb(220,220,220)','rgb(0,0,0)','rgb(0,204,0)','rgb(254,0,0)','rgb(254,166,80)']
       // 指定图表的配置项和数据
       var option = {
            title: {
                text: this.Yname
            }, 
              tooltip : {
              trigger: 'axis',
              axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                  type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
          },
           color:colors,
              /* legend: {
                  data: ['无状态','关机', '加工','停工','调试']
              }, */
              grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                  height:200,
                  containLabel: true
              },
              dataZoom: [{
                    type: 'slider',
                    start: 100,
                    end: 1
                }],
              xAxis:  {
                  type: 'value',
                  name:'单位:小时',
                  nameLocation:'start',
                  nameTextStyle:{
                    padding:[7,7]
                   },
                  splitNumber:24,
                  max:24

              },
              yAxis: {
                  type: 'category',
                  axisTick:{
                    length:2
                  },
                  data:this.Yname
                  
              },
              series: initData,
               
           }
            myChart1.setOption(option,true);
    },
    initChart3(){
       var myChart2 = echarts.init(document.getElementById('echart2'))
      myChart2.setOption({
        title : {
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c}h ({d}%)"
        },
        legend: {
            orient: 'horizontal',
            left: 'right',
            data: ['关机','加工','停工','调试']
        },
        series : [
            {
                name: '状态',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[
                    {value:this.SKcloseTime, name:'关机',itemStyle:{
                color:"black"
                }},
                    {value:this.SKmachiningTime, name:'加工',itemStyle:{
                color:"#00CC00"
                }},
                    {value:this.SKstopTime, name:'停工',itemStyle:{
                color:"red"
                }},
                    {value:this.SKdebugTime, name:'调试',itemStyle:{
                color:"#FFA650"
                }}
                    
                ],
                itemStyle: {
                    emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ],
        color:[
                    'rgb(0,0,0)',
                    'rgb(0,204,0)',
                    'rgb(254,0,0)',
                    'rgb(254,166,80)',
                   
                ]
      })
    },
     // 每个色块的点击事件
    colorLump(lx,hao,zt,tg,ks,cx,jh,gd,nm,cod){
      // console.log(lx,hao,zt,tg,ks,cx,jh)
      // 点击色块取的值
      this.equipmentType = lx
      this.equipmentCode = hao
      if(zt == 1){
         this.equipmentStatu = '关机'
      }else if(zt == 2){
         this.equipmentStatu = '加工'
      }else if(zt == 3){
         this.equipmentStatu = '停工'
      }else if(zt == 4){
         this.equipmentStatu = '调试'
      }
      if(tg == ''){
         this.stopWorkReason = '-'
      }else{
         this.stopWorkReason = tg
      }
    
      this.equipmentStatusStartTime = ks
      this.equipmentStatusContinueTime = cx
      if(jh==''||jh==null){
        this.hShow = false
        this.planWorkTime = '-'
      }else{
       this.hShow = true
       this.planWorkTime = jh
      }
     
      kposta(gd).then(response =>{//占比图的接口
         if (response.data.code === 200) {
           this.SKpinst = response.data.data
          //  this.SKcloseTime = parseInt(this.SKpinst.one/3600000)
           this.SKcloseTime = this.SKpinst.one
           this.SKmachiningTime = this.SKpinst.two
           this.SKstopTime = this.SKpinst.three
           this.SKdebugTime = this.SKpinst.four
         }
      })
      // 时序图的接口
      SXTposul(gd).then(response =>{
          console.log(response)
         if(response.data.code ===200){
            this.SXTrecord = response.data.data
             var initData = [];
             var colors = ['rgb(220,220,220)','rgb(0,0,0)','rgb(0,204,0)','rgb(254,0,0)','rgb(254,166,80)']
            this.SXTrecord.forEach(item =>{
               if(item.equipmentStatus===0){
                   var dataCom = Array.of(item.continuTime) 
                   initData.push({
                      name: '设备无状态',
                      type: 'bar',
                      stack: '状态',
                      barWidth :50,
                      data: dataCom,
                      itemStyle: {
                          normal:{
                              color: function (params){
                                  return colors[0];
                              }
                          }
                      }
                  });
                }else if(item.equipmentStatus===1){
                   var dataCom = Array.of(item.continuTime)
                    initData.push({
                      name: '关机',
                      type: 'bar',
                      stack: '状态',
                       barWidth :50,
                      data: dataCom,
                      itemStyle: {
                          normal:{
                              color: function (params){
                                  return colors[1];
                              }
                          }
                      }
                  });  
                }else if(item.equipmentStatus===2){
                  var dataCom = Array.of(item.continuTime)
                       initData.push({
                        name: '加工',
                        type: 'bar',
                        stack: '状态',
                         barWidth :50,
                        data: dataCom,
                        itemStyle: {
                            normal:{
                                color: function (params){
                                    return colors[2];
                                }
                            }
                        }
                    });
                }else if(item.equipmentStatus===3){
                     var dataCom = Array.of(item.continuTime)
                    initData.push({
                      name: '停工',
                      type: 'bar',
                      stack: '状态',
                      barWidth :50,
                      data: dataCom,
                      itemStyle: {
                          normal:{
                              color: function (params){
                                  return colors[3];
                              }
                          }
                      }
                  });
                }else if(item.equipmentStatus===4){
                       var dataCom = Array.of(item.continuTime)
                      
                       initData.push({
                          name: '调试',
                          type: 'bar',
                          stack: '状态',
                          barWidth :50,
                          data: dataCom,
                          itemStyle: {
                          normal:{
                            color: function (params){
                            return colors[4];
                           }
                          }
                        }
                     });        
                }
                // this.Series.push(initData)
                setTimeout(() => {
                this.initChart2(initData)
                },200)
            })
         }
          this.Yname = []
          var nameConde =  this.SXTrecord[0].equipmentName +'\n'+ this.SXTrecord[0].equipmentCode
          this.Yname.push(nameConde)
      })
      this.right1=false
      this.right2 = true
      setTimeout(() => {
        // this.initChart2()
        this.initChart3()
        }, 500);
    },
    // 刚进页面的设备明细 饼状图
    initChart() {
      var myChart = echarts.init(document.getElementById('echart1'))
      myChart.setOption({
        title : {
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c}台 ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['关机','加工','停工','调试']
        },
        series : [
            {

                name: '设备状态',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[
                {value:this.closeTimeTX, name:'关机',itemStyle:{
                color:"black"
                }},
                {value:this.machiningTimeTX, name:'加工',itemStyle:{
                color:"#00CC00"
                }},
                {value:this.stopTimeTX, name:'停工',itemStyle:{
                color:"red"
                }},
                {value:this.debugTimeTX, name:'调试',itemStyle:{
                color:"#FFA650"
                }}
                ],
                 itemStyle: {
                    emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                } 
            }
        ],
         color:[
                    'rgb(0,0,0)',
                    'rgb(0,204,0)',
                    'rgb(254,0,0)',
                    'rgb(254,166,80)',
                   
                ]
      })
    },
   
    // tabs 点击事件
    handleClick(tab, event) {
        if(this.activeName =='third'){
            this.YCtabdiv = false//搜索条件隐藏
            this.posHZ()//汇总
        }else{
          this.YCtabdiv = true
          this.getApp()
          this.ZBlist()
        }

        if(this.activeName =='first'){
           this.right1=true
           this.right2 = false
            this.greenShow1 = true
            this.greenShow2 = true
            this.greenShow3 = true
            this.greenShow4 = true
            this.$nextTick(() => {
           this.initChart()
         })
        }else if(this.activeName =='second'){
          this.greenShow1 = true
          this.greenShow2 = true
          this.greenShow3 = true
          this.greenShow4 = true
        }
         
    },
  },
  mounted () {
    /* this.initChart2()
    this.initChart3() */
    setTimeout(() => {
    this.initChart()
    },800)
    this.initChart2()
    this.initChart3()
    // 每5分钟请求一次
    /* if(this.timer){
         clearInterval(this.timer)
    }else{
    this.timer = setInterval(() => {
      this.posHZ()   
      this.ZBlist()  
      this.getApp()
    }, 30000);
    } */
  },
  /* destroyed(){
      clearInterval(this.timer)
  }, */
}
</script>

<style scoped>
ul,li{
  margin: 0;
  padding: 0;
  list-style:none;
}
.el-tree{
  width: 260px;
}
.formDw{
	position: relative;
	left: 5px;
  padding-bottom:10px;
}
.machine-detail{
  width: 170px; 
  height: 60px;
  text-align: center;
  line-height: 60px;
  margin: 10px 0;
  position: relative;
  box-shadow: 10px 10px 15px #a19e9e;
}
.machine-detail:hover{
  cursor: pointer;
  box-shadow: 10px 15px 20px #807e7e;
}

/*定义设备状态颜色*/
.public{
  background:#ccc;
}

.red {   
  background-color:red;  
}  
.green {  
  background-color: #00CC00;  
}
.orange {
  background-color:orange; 
}
.black {
  background-color:black;
}
.box{

   margin-top:10px;
   display: flex;
   justify-content:center;
}
.SKbat{
  margin:1px 3px 0 2px;
  width:20px;
  height:8px;
  border-radius:2px;
}
.YSpublic{
   font-size: 10px;
   color:#838383;
}
.HS{
  border:1px solid #DCDCDC;
  background:#DCDCDC
}
.HH{
  border:1px solid #000;
  background:#000;
}
.LS{
   border:1px solid #2DC92D;
   background:#2DC92D;
}
.HE{
    border:1px solid red;
    background:red;
}
.CS{
  border: 1px solid #FEA650;
  background:#FEA650;
}
.lefts{
  margin-left: 15px;
}
</style>
