<template>
  <div class="app-container">
    <!--外部容器 -->
    <el-container>
      <!-- 树结构 -->
      <el-aside style="border:1px solid #f0f0f0;padding-top:20px;" width="280px">
        <el-tree :data="equipData" ref="tree" node-key="addressCode"
          :props="defaultProps" 
          check-strictly
          @node-click="handleNodeClick"
          :render-content="renderContent">
        </el-tree>
      </el-aside>
      <!-- 内容容器 -->
      <el-container>
         <el-header style="height:90px;" v-show="searchShow">
              <div class="formSearch">
              <el-form :inline="true">

                 <el-form-item label="时间">
                <div class="block">
                    <el-date-picker
                    style="width:250px"
                    v-model="value13"
                    type="daterange"
                    :picker-options="pickerOptions"
                    unlink-panels
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                      clearable  @change="searchsty()">
                    </el-date-picker>
                </div>
                </el-form-item>

                <el-form-item>
                <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
                </el-form-item>

                <el-form-item>
                <el-button class="filter-item" type="primary" icon="el-icon-download" @click="educeSC" v-show="DCshow">导出</el-button>
                </el-form-item>

              </el-form>
          </div>
        </el-header> 
       <!-- 主要区域容器  区域   show-summary :summary-method="getSummaries" -->
        <el-main style="padding-top:0px;" v-show="!tableShow">
          <el-table :key='tableKey'  :data="listData" show-summary :summary-method="getSummaries" v-loading="listLoading" border fit highlight-current-row
            style="width:100%;margin-top:8px" :header-cell-style="{background:'oldlace'}">>
           
             <el-table-column prop="equipmentType" align="center" label="设备类型" min-width="50">
              </el-table-column>
              <el-table-column prop="equipmentName" align="center" label="设备名称" min-width="50">
              </el-table-column>
               <el-table-column prop="equipmentCode" align="center" label="设备编号" min-width="50">
              </el-table-column>
               <el-table-column prop="openRate" align="center" label="开机率" min-width="50">
                   <template slot-scope="scope">
                    <!-- <span>{{scope.row.openRate*100+'%'}}</span> -->
                    <span>{{scope.row.openRate==0?0:scope.row.openRate*100+'%'}}</span>
                  </template>
              </el-table-column>
               <el-table-column prop="planWorkTime" align="center" label="计划工作时间" min-width="50">
              </el-table-column>
               <el-table-column prop="closeTime" align="center" label="关机时间(h)" min-width="50">
              </el-table-column>
               <el-table-column prop="machiningTime" align="center" label="加工时间(h)" min-width="50">
              </el-table-column>
               <el-table-column prop="stopTime" align="center" label="停工时间(h)" min-width="50">
              </el-table-column>
               <el-table-column prop="debugTime" align="center" label="调试时间(h)" min-width="50">
              </el-table-column>

            <el-table-column align="center" label="查看" min-width="210">
              <template slot-scope="scope">
                <el-button title="时序图" type="primary" size="mini" @click="profile(scope.row)" v-show="SXTbatshow">时序图</el-button>
                <el-button title="状态时长统计图" type="danger" size="mini" @click="cartogram(scope.row)">状态时长统计图</el-button>
                <el-button title="状态占比图" type="success" size="mini" @click="diagram(scope.row)">状态占比图</el-button>
              </template>
            </el-table-column>
          </el-table>
          	<!-- <table border= "0" width="100%" style="font-size:14px;color: #606266;">
                  <tbody>
                   <tr style="height:45px">
                      <td colspan="1" style="text-align:center;border:1px solid #ebeef5;padding-right:134px;border-top:none">总计</td>
                      <td colspan="10" style="text-align:center;border:1px solid #ebeef5;padding-right:4px;border-top:none;border-left:none">{{closeList}}</td>
                      <td colspan="10" style="text-align:center;border:1px solid #ebeef5;padding-right:0px;border-top:none;border-left:none">{{machiningTimeList}}</td>
                      <td colspan="10" style="text-align:center;border:1px solid #ebeef5;padding-right:0px;padding-left:9px;border-top:none;border-left:none">{{stopTimeList}}</td>
                      <td colspan="10" style="text-align:center;border:1px solid #ebeef5;padding-right:20px;border-top:none;border-left:none">{{debugTimeList}}</td>
                      <td colspan="10" style="text-align:center;border:1px solid #ebeef5;padding-right:133px;border-top:none;border-left:none">.</td> 
                    </tr>
                  </tbody>
                 </table> -->


         
         <!-- tab页面 -->
          <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
            <el-tab-pane label="各状态时长统计图" name="first">
               <div id="echart1" style="width:600px;height:600px;margin:0 auto;"></div> 
            </el-tab-pane>
            <!-- 状态占比图 -->
            <el-tab-pane label="状态占比图" name="second">
               <div id="echart2" style="width:600px;height:600px;margin:0 auto;"></div>
            </el-tab-pane>
           </el-tabs>

           </el-main>

        <!-- 第二个页面  车间页面-->
        <el-main style="padding-top:0px;" v-show="tableShow">
          <el-table :key='tableKey' :data="dataList" height='500' v-loading="listLoading" border fit highlight-current-row
            style="width:100%;min-height:500px;margin-top:8px" :header-cell-style="{background:'oldlace'}">>
            <el-table-column align="center" label="区域" min-width="186">
              <template slot-scope="scope">
                <span class="link-type futiop" @click='checkDetails(scope.row)'>{{scope.row.equipmentAreaName}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="计划工作时间" min-width="80%">
              <template slot-scope="scope">
                <span>{{scope.row.planWorkTime}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="关机时间(h)" min-width="80%">
              <template slot-scope="scope">
                <span>{{scope.row.closeTime}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="加工时间(h)" min-width="80%">
              <template slot-scope="scope">
                <span>{{scope.row.machiningTime}}</span>
              </template>
            </el-table-column>
             <el-table-column align="center" label="停工时间(h)" min-width="80%">
              <template slot-scope="scope">
                <span>{{scope.row.stopTime}}</span>
              </template>
            </el-table-column>
             <el-table-column align="center" label="调试时间(h)" min-width="80%">
              <template slot-scope="scope">
                <span>{{scope.row.debugTime}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
        <!-- 时序图弹框 -->
       <el-dialog :close-on-click-modal="false" title="查看" v-dialogDrag top="20vh" width="800px" :visible.sync="dialoglookVisible">
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
          <div id="echartSXT" style="width:600px;height:300px;margin-left:50px"></div>
       </el-dialog>
       <!-- 统计图弹框 -->
       <el-dialog :close-on-click-modal="false" title="查看" v-dialogDrag top="20vh" width="600px" :visible.sync="dialoglookGraph">
         <div id="echartTK" style="width:400px;height:600px;margin-left:50px"></div>
       </el-dialog>
       <!-- 占比图 -->
       <el-dialog :close-on-click-modal="false" title="查看" v-dialogDrag top="20vh" width="600px" :visible.sync="dialoglookDiagram">
          <div id="echartZB" style="width:400px;height:600px;margin-left:50px"></div>
       </el-dialog>
        <!-- 点击区域的弹框 -->
        <el-dialog :close-on-click-modal="false" title="查看" v-dialogDrag top="20vh" width="900px" :visible.sync="diaDiagram">
           <el-table  :data="poplistData"  border fit highlight-current-row
            style="width:100%;margin-top:8px" :header-cell-style="{background:'oldlace'}">>
           
             <el-table-column prop="equipmentType" align="center" label="设备类型" min-width="80">
              </el-table-column>
              <el-table-column prop="equipmentName" align="center" label="设备名称" min-width="80">
              </el-table-column>
               <el-table-column prop="equipmentCode" align="center" label="设备编号" min-width="80">
              </el-table-column>
               <el-table-column prop="openRate" align="center" label="开机率" min-width="80">
                   <template slot-scope="scope">
                    <!-- <span>{{scope.row.openRate*100+'%'}}</span> -->
                    <span>{{scope.row.openRate==0?0:scope.row.openRate*100+'%'}}</span>
                  </template>
              </el-table-column>
               <el-table-column prop="planWorkTime" align="center" label="计划工作时间" min-width="100">
              </el-table-column>
               <el-table-column prop="closeTime" align="center" label="关机时间" min-width="80">
              </el-table-column>
               <el-table-column prop="machiningTime" align="center" label="加工时间" min-width="80">
              </el-table-column>
               <el-table-column prop="stopTime" align="center" label="停工时间" min-width="80">
              </el-table-column>
               <el-table-column prop="debugTime" align="center" label="调试时间" min-width="80">
              </el-table-column>

          </el-table>
       </el-dialog>

      </el-container>
    </el-container>
  
  </div>
</template>

<script>
import { fetchTree, fetchListByCode,derivationst,SXTechart } from '@/api/equipMonitor/equipmentHistory'
import echarts from 'echarts'
export default {
  name: 'equipmentHistory',
  data() {
    return {
      searchShow:false,//搜索条件显隐
      levelCJ:'',//树的层级判断
      DCshow:false,//导出按钮的显隐
      
      dialoglookVisible: false, //时序图弹框
      dialoglookGraph:false,//统计图弹框
      dialoglookDiagram:false,//占比图弹框

      diaDiagram:false,
      // 表格时间总计的转化
      closeList:'',
      machiningTimeList:'',
      stopTimeList:'',
      debugTimeList:'',
      statusTotal:[],

      // 弹框里的数组
      countTX:[],//统计图
      closeTimeTX:'',//占比图
      machiningTimeTX:'',
      stopTimeTX:'',
      debugTimeTX:'',
      Yname:[],//时序图的y轴名字
      SXTrecord:[],//弹框时序图
      SXTbatshow:false,
      Series:[],

      // tab选项卡
      activeName2: '',
      tableShow:true,//俩个页面的显隐控制
      isEnd_xuan:'',//判断条件

      value13: [],
      listQuery: {
       
      },
     popList:{

     },
     poplistData:null,

      // 设备地址树结构
      equipData: [],
      defaultProps: {
        children: 'children',
        label: 'addressName'
      },
      // 设备地址选中状态改变时
      i: 0,
      // 设备地址编码是否可输
      isDisable: false,
      isChecked: false,
      // 表格初始数据
      tableKey: 0,
      listData: null,
      dataList:null,
      listLoading: false,
      // 父级地址编码
      parCode: 'sbdzqy',
      parName: '设备地址区域',
      // 弹出框表单数据
      popData: {
        id: undefined,
        addressName: undefined,
        addressCode: undefined,
        parentAddressCode: undefined,
        remark: undefined,
        isEnd: '0'
      },
      // 设备地址树被选中节点
      treeData: null,
    //  时间日期限制30天
      pickerMinDate: '',
       pickerOptions: {
          onPick: ({ maxDate, minDate }) => {
              this.pickerMinDate = minDate.getTime()
                 if (maxDate) {
                     this.pickerMinDate = ''
                     }
          },
          disabledDate: (time) => {
            if (this.pickerMinDate !== '') {
               const day30 = (30 - 1) * 24 * 3600 * 1000
                  let maxTime = this.pickerMinDate + day30
                  if (maxTime > new Date()) {
                           maxTime = new Date()
                     }
                     return time.getTime() > maxTime
                   }
               return time.getTime() > Date.now()
          }
       }
    }
  },
  created() {
    // this.getButton()
    //  this.getList(this.parCode)
    this.getTree()
    // this.getList()
  },
  methods: {
    renderContent(h, { node, data, store }) {
      return (
        <span>
          <span title={node.label}>{node.label}</span>
        </span>)
    },
    // 日期  搜索
    searchsty() {
      // 申请闲置时间  搜索
      if (this.value13 == null) {
        this.listQuery.startTime = ''
        this.listQuery.endTime = ''
      } else {
        this.listQuery.startTime = this.value13[0]// 开始时间
        this.listQuery.endTime = this.value13[1]
      }
    },
    
    // 请求设备地址树
    getTree() {
      fetchTree().then(response => {
        this.equipData = []
        this.equipData.push(response.data.data[0])
      })
    },
    // 点击设备地址请求表格
    handleNodeClick(data) {
      this.parCode = data.addressCode
      this.parName = data.addressName
      this.isEnd_xuan = data.isEnd
      this.searchShow = true
      this.levelCJ = data.level//树的层级数
     /*  console.log(this.levelCJ)
      console.log(data.isEnd) */
    //   this.getList(this.parCode)
       if(data.isEnd==0){//为零的时候低压车间显示
          this.tableShow = true
          // this.getQjian()
      }else if(data.isEnd==1){//为1的时候熔炼区显示
          this.tableShow = false
          // this.getList()
      }
    },
    // 低压车间显示的表格加载
   getQjian(){
     this.listQuery.isEnd = this.isEnd_xuan
     this.listQuery.workShopCode = this.parCode
      fetchListByCode(this.listQuery).then(response => {
        if (response.data.code === 200) {
          this.dataList = response.data.data.list
         this.$nextTick(() => {
            this.listLoading = false
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
   },

    // 熔炼区显示表格加载   
    getList() {
      this.listLoading = true
      this.listQuery.isEnd = this.isEnd_xuan
      // this.listQuery.endTime="2019-05-23"
      // this.listQuery.startTime= "2019-05-23"
      this.listQuery.equipmentAreaCode = this.parCode
      
      fetchListByCode(this.listQuery).then(response => {
        if (response.data.code === 200) {
          this.listData = response.data.data.list
          if( this.listQuery.isEnd == 1){
          this.closeList = response.data.data.closeTime
          this.machiningTimeList = response.data.data.machiningTime
          this.stopTimeList = response.data.data.stopTime
          this.debugTimeList = response.data.data.debugTime
          this.statusTotal = []
          this.statusTotal.push(this.closeList,this.machiningTimeList,this.stopTimeList,this.debugTimeList)
          }
         /*  console.log(123)
          console.log(this.statusTotal) */
         this.$nextTick(() => {
            this.listLoading = false
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
    },
    //  查询  
     handleFilter() {
        //  console.log(this.value13)
       if(this.value13==null||this.value13.length == 0){
         this.$notify({
            title: '提示',
            message: '请输入时间',
            type: 'warning',
            duration: 3000
          })
          return
       }else{
      if(this.levelCJ==4||this.levelCJ==5){ 
          this.DCshow = true//导出按钮显示
       if( this.tableShow == true){
            this.getQjian()//车间
       }else{
            this.activeName2=''
            this.getList()//区域
            if( this.listQuery.startTime === this.listQuery.endTime){//判断时序图按钮显隐
              this.SXTbatshow = true
              }else{
              this.SXTbatshow = false
            }
       }
       }else{
         this.DCshow = false//导出按钮隐藏
         this.dataList=[]  
         this.listData=[]
       }
      }
    },
    // 导出
    educeSC(){
        if(this.value13==null||this.value13.length == 0){
         this.$notify({
            title: '提示',
            message: '请输入时间',
            type: 'warning',
            duration: 3000
          })
          return
       }else{  
          derivationst(this.listQuery).then(response => {
             console.log(response)
         if (response.data.code == 200) {
           const liststyp = response.data.data
            // console.log(liststyp)
            window.location.href = liststyp
         }else if(response.data.code == 400002){
            this.$notify({
						title: '警告',
						message: response.data.msg,
						type: 'warning',
						duration: 3000
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
   },
    //  区域的弹框
   checkDetails(row){
  //  console.log(row)
   if(this.value13==null||this.value13.length == 0){
         this.$notify({
            title: '提示',
            message: '请输入时间',
            type: 'warning',
            duration: 3000
          })
          return
       }else{
          this.diaDiagram = true
          this.popList.endTime = this.listQuery.endTime
          this.popList.startTime= this.listQuery.startTime 
       }
      this.popList.isEnd = 1
      this.popList.equipmentAreaCode = row.equipmentAreaCode
    fetchListByCode(this.popList).then(response => {
      if (response.data.code === 200) {
         this.poplistData = response.data.data.list
         }else{
           this.$notify({
            title: '警告',
            message: response.data.msg,
            type: 'warning',
            duration: 3000
          })
       }
    })
   },
    // 表格总计的时间
    getSummaries(param) {
        const { columns, data } = param;
       /*   console.log(1234)
        console.log(param)   */ 
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总计';
            return;
          }
          
         switch(column.property) {
            case "closeTime":
            sums[index] = this.closeList + ' h' 
            break;
            case "machiningTime":
            sums[index] = this.machiningTimeList + ' h'
            break;
            case "stopTime":
            sums[index] = this.stopTimeList + ' h' 
            break;
            case "debugTime":
            sums[index] = this.debugTimeList + ' h' 
            break;
            default:
            break;
          }

        });

        return sums;
      },
   
    // 获取设备地址树被选择的节点
    getCheckedNodes() {
      this.treeData = this.$refs.tree.getCheckedNodes()
      if (this.treeData[0] == undefined) {
        return
      }
      this.popData.parentAddressCode = this.treeData[0].addressCode
      this.popData.parentAddressName = this.treeData[0].addressName
      if (this.treeData[0].addressName == '设备地址区域') {
        this.popData.parentAddressName = '-'
      }
    },
     // tab选项卡
      handleClick(tab, event) {
        //  console.log(tab, event);
         this.$nextTick(() => {
         this.initChart2()
         this.initChart3()
         })

      },
      // 各状态时长统计图
     initChart2(){
       var myChart1 = echarts.init(document.getElementById('echart1'));
       // 指定图表的配置项和数据
         var option ={
            title: {
                text: '状态时长统计'
            },
            tooltip: {},
           /*  legend: {
                data:['状态']
            }, */
             grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                  width:'500',
                  containLabel: true
              },
            xAxis: {
                data: ["关机","加工","停工","调试"]
              
            },
            yAxis: {
               name:'单位:小时',
                  nameLocation:'end',
                  nameTextStyle:{
                    padding:[0,0]
                   }
            },
            series: [{
                name: '状态',
                type: 'bar',
                data: this.statusTotal
            }],
             color:[
                'rgb(55,162,218)', 
            ]
        }
        // 使用刚指定的配置项和数据显示图表。
        myChart1.setOption(option);
    },
    // 状态占比图
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
            orient: 'vertical',
            left: 'left',
            data: ['关机','加工','停工','调试']
        },
        series : [
            {
                name: '状态',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[
                    {value:this.closeList, name:'关机',itemStyle:{color:"black"}},
                    {value:this.machiningTimeList, name:'加工',itemStyle:{color:"#00CC00"}},
                    {value:this.stopTimeList, name:'停工',itemStyle:{color:"red"}},
                    {value:this.debugTimeList, name:'调试',itemStyle:{color:"#FFA650"}}
                   
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
    // 弹框的统计图
    initChart4(){
      var myChart1 = echarts.init(document.getElementById('echartTK'));
      // console.log(myChart1)
       // 指定图表的配置项和数据
         var option ={
             title: {
                text: '统计图'
            }, 
            tooltip: {},
            legend: {
                data:['状态']
            },
            xAxis: {
                data: ["关机","加工","停工","调试"]
            },
            yAxis: {
                  name:'单位:小时',
                  nameLocation:'end',
                  nameTextStyle:{
                    padding:[0,0]
                   }
            },
            series: [{
                name: '状态',
                type: 'bar',
                data: this.countTX
            }],
            color:[
                'rgb(55,162,218)', 
            ]
        }
        // 使用刚指定的配置项和数据显示图表。
        myChart1.setOption(option);
    },
    // 弹框占比图
     initChart5(){
       var myChart2 = echarts.init(document.getElementById('echartZB'))
      myChart2.setOption({
        title : {
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c}h ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['关机','加工','停工','调试']
        },
        series : [
            {
                name: '状态',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[
                    {value:this.closeTimeTX, name:'关机',itemStyle:{color:"black"}},
                    {value:this.machiningTimeTX, name:'加工',itemStyle:{color:"#00CC00"}},
                    {value:this.stopTimeTX, name:'停工',itemStyle:{color:"red"}},
                    {value:this.debugTimeTX, name:'调试',itemStyle:{color:"#FFA650"}}
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
    // 弹框时序图
    initChart6(initData){
      var myChart2 = echarts.init(document.getElementById('echartSXT'))
      var colors = ['rgb(220,220,220)','rgb(0,0,0)','rgb(0,204,0)','rgb(254,0,0)','rgb(254,166,80)'] 
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
                    padding:[15,0]
                   },
                  splitNumber:24,
                  max:24

              },
              yAxis: {
                  type: 'category',
                  data:this.Yname
                  
              },
              series: initData,
           }
            myChart2.setOption(option,true);
        },

    // 时序图弹框
    profile(row){
      var colors = ['rgb(220,220,220)','rgb(0,0,0)','rgb(0,204,0)','rgb(254,0,0)','rgb(254,166,80)']
        this.dialoglookVisible = true
        this.listQuery.isEnd = 1
        this.listQuery.equipmentCode = row.equipmentCode
        SXTechart(this.listQuery).then(response => {
           if(response.data.code ===200){
            this.SXTrecord=[]
            this.SXTrecord = response.data.data
               this.Series = [];  
              //  var data = [];
            var initData = [];
            
            this.SXTrecord.forEach((item,index)=>{
                if(item.equipmentStatus===0){
                   var dataCom = Array.of(item.equipmentStatusContinueTime) 
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
                var dataCom = Array.of(item.equipmentStatusContinueTime)
                      // console.log(2344)
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
                  var dataCom = Array.of(item.equipmentStatusContinueTime)
                   initData.push({
                      name: '加工',
                      type: 'bar',
                      barWidth :50,
                      stack: '状态',
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
                var dataCom = Array.of(item.equipmentStatusContinueTime)
                  initData.push({
                      name: '停工',
                      type: 'bar',
                      barWidth :50,
                      stack: '状态',
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
                var dataCom = Array.of(item.equipmentStatusContinueTime)
                 initData.push({
                    name: '调试',
                    type: 'bar',
                    barWidth :50,
                    stack: '状态',
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
                this.initChart6(initData)
                  // console.log(initData)
          })
        }
      })
          this.Yname = []
          this.Yname.push(row.equipmentName)
        setTimeout(() => {
            // this.initChart6(initData)
        }, 800);
     
    },
    // 统计图弹框
    cartogram(row){
      this.countTX = []
      // console.log(row)
      this.countTX.push(row.closeTime,row.machiningTime,row.stopTime,row.debugTime)
      this.dialoglookGraph = true
      this.$nextTick(() => {
      this.initChart4()
      })
    },
    // 占比图弹框
    diagram(row){
     this.closeTimeTX = row.closeTime
     this.machiningTimeTX = row.machiningTime
     this.stopTimeTX = row.stopTime
     this.debugTimeTX = row.debugTime
     this.dialoglookDiagram = true
      this.$nextTick(() => {
          this.initChart5()
      })
    }
  },
   mounted () {
      // this.getList()
      this.initChart2()
      this.initChart3()
      
  },
}
</script>

<style scoped>
.title-header {
    font-size: 16px;
    color: #409eff;
    padding: 8px;
    border-bottom: 1px solid #ddd;
}
.formSearch {
    width:100%;
    background:#fafafa;
    border: 1px solid #e9e9e9;
    border-radius: 3px;
    padding: 18px 10px 0;
    margin-bottom: 10px;
}
.drag-handler{
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.el-tree-node__content:hover {
  background-color: #6dc6fa;
  border-radius:3%
} 
.el-tree{
  width: 260px;
}
.box{
   display: flex;
    justify-content:center;
}
.SKbat{
  margin:9px 3px 0 2px;
  width:20px;
  height:8px;
  border-radius:2px;
 
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

</style>
