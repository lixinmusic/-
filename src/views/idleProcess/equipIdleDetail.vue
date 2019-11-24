<template>
  <div class='app-container'>
    <el-container>
      <el-header>
        <el-form :inline="true"> 
          <el-form-item label="选择月份">
            <el-date-picker
              v-model="listQuery.chooseTime"
              type="month"
              placeholder="选择月份"
              format="yyyy-MM"
              value-format="yyyy-MM">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button class="filter-item" type="primary" style="float:right"  icon="el-icon-search" @click="handleFilter">查询</el-button>
          </el-form-item>
        </el-form>
      </el-header>
      <el-main style="padding:10px 0">
        <ul class="charts">
          <li style="width:30%">
            <h3>闲置设备库月度一览</h3>
            <table border= "1">
              <thead>
                <tr>
                  <th>闲置数量</th>
                  <th>数量</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>上月库存数</td>
                  <td>{{monthstockAmount}}</td>
                </tr>
                <tr>
                  <td>本月进库数量</td>
                  <td>{{monthinNum}}</td>
                </tr>
                <tr>
                  <td>本月出库数量</td>
                  <td>{{monthoutNum}}</td>
                </tr>
                <tr>
                  <td>本月净增数</td>
                  <td>{{monthincrease}}</td>
                </tr>
                <tr>
                  <td>本月结余数量</td>
                  <td>{{monthbalance}}</td>
                </tr>
              </tbody>
            </table>
          </li>
          <li style="width:70%;background-color: white;">
            <div id="echart1" style="width:98%;height:480px"></div>
          </li>
        </ul>
        <div class="equipDetail">
          <table border= "1">
            <thead>
              <tr>
                <th style="width:120px;">日期</th>
                <th style="width:40px;" v-for="(item, index) in listDay" :key="index">{{listDay[index]}}</th>
                <th style="width:40px;">汇总</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="width:120px;">当日进库量</td>  
                <td style="width:40px;" v-for="(item,index) in chartData" :key="index" class="look-detail" @click="inNumDetail(item)">{{item.inNum}}</td>
                <td style="width:40px;" class="look-detail" @click="monthinNumDetail()">{{monthinNum}}</td>
              </tr>
              <tr>
                <td style="width:120px;">当日出库量</td>
                <td style="width:40px;" v-for="(item,index) in chartData" :key="index" class="look-detail" @click="outNumDetail(item)">{{item.outNum}}</td>
                <td style="width:40px;" class="look-detail" @click="monthoutNumDetail()">{{monthoutNum}}</td>
              </tr>
              <tr>
                <td style="width:120px;">当日净增数</td>
                <td style="width:40px;" v-for="(item,index) in chartData" :key="index">{{item.increase}}</td>
                <td style="width:40px;">-</td>
              </tr>
              <tr>
                <td style="width:120px;">当日库存数</td>
                <td style="width:40px;" v-for="(item,index) in chartData" :key="index" class="look-detail" @click="amountDetail(item)">{{item.amount}}</td>
                <td style="width:40px;">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </el-main>
      <el-dialog title="查看" :visible.sync="equipDialogVisible" width="80%" :close-on-click-modal="false" v-dialogDrag>
        <el-form :inline="true">
          <el-form-item label="固定资产编号">
            <el-input class="filter-item input" v-model="listQuery1.fixedAssetCode">
            </el-input>
          </el-form-item>
          <el-form-item label="设备名称">
            <el-input class="filter-item input" v-model="listQuery1.equipmentName">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="filter-item" type="primary" style="float:right;margin-left: 15px;" icon="el-icon-download" @click="handleExport">导出</el-button>
            <el-button class="filter-item" type="primary" style="float:right" icon="el-icon-search" @click="handleFilter1">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="infoList" height="500" v-loading="listLoading" border fit highlight-current-row>
          <el-table-column align="center" label="序号" min-width="80" type="index"></el-table-column>
          <el-table-column prop="factoryName" align="center" label="使用工厂" min-width="120">
          </el-table-column>
          <el-table-column prop="divisionName" align="center" label="使用部门" min-width="120">
          </el-table-column>
          <el-table-column prop="equipmentName" align="center" label="设备名称"  min-width="120">
          </el-table-column>
           <el-table-column prop="model" align="center" label="型号规格" min-width="80">
          </el-table-column>
          <el-table-column prop="fixedAssetCode" align="center" label="固定资产编号" min-width="80">
          </el-table-column>
          <el-table-column prop="originalFinancialValue" align="center" label="原值" min-width="80">
          </el-table-column>
          <el-table-column prop="netBookValue" align="center" label="净值" min-width="80">
          </el-table-column>
          <el-table-column prop="installTime" align="center" label="安装完成时间" min-width="80">
          <template slot-scope="scope">
            {{scope.row.installTime !=null?scope.row.installTime.substring(0,10):''}}
            </template>
          </el-table-column>
          <el-table-column prop="unusedPlace" align="center" label="闲置位置" min-width="80">
          </el-table-column>  
          <el-table-column prop="inWarehouseDate" align="center" label="入库日期" min-width="80" v-if="isInWare"> 
            <template slot-scope="scope">
              {{scope.row.inWarehouseDate!=null?scope.row.inWarehouseDate.substring(0,10):''}}
              </template>
          </el-table-column>
          <el-table-column prop="outWarehouseDate" align="center" label="出库日期" min-width="80" v-if="!isInWare">
            <template slot-scope="scope">
              {{scope.row.outWarehouseDate!=null?scope.row.outWarehouseDate.substring(0,10):''}}
              </template>
          </el-table-column>
          <el-table-column prop="equipmentStatusName" align="center" label="设备状态" min-width="80">
          </el-table-column>    
        </el-table>
        <div class="pagination-container">
          <el-pagination background 
          @size-change="handleSizeChange1" 
          @current-change="handleCurrentChange1" 
          :current-page="listQuery1.pageNum" 
          :page-sizes="[5,10,15, 20]" 
          :page-size="listQuery1.pageSize" 
          layout="total, sizes, prev, pager, next, jumper" 
          :total="total1">
          </el-pagination>
        </div>
      </el-dialog>
    </el-container>
  </div>
</template>
<script>
import { fetchDayList, fetchInfoList, fetchExportList } from '@/api/idleProcess/equipIdleDetail'
import echarts from 'echarts'
import resize from '@/components/Charts/mixins/resize'
import { parseTime } from '@/utils'
export default {
  mixins: [resize],
  data() {
    return {
      isInWare: true,
      month: undefined,
      chart: null,
      listQuery: {
        chooseTime: new Date()
      },
      monthstockAmount: undefined,
      monthinNum: undefined,
      monthoutNum: undefined,
      monthincrease: undefined,
      monthbalance: undefined,
      listDay: [],
      chartData: [],
      inNumList: [], // 当日进库数量
      outNumList: [], // 当日出库数量
      increaseList: [], // 当日净增数量
      amountList: [], // 当日库存数量
      // 弹框表格
      listLoading: false,
      equipDialogVisible: false,
      infoList: [],
      total1: null,
      listQuery1: {
        startDate: undefined,
        endDate: undefined,
        pageNum: 1,
        pageSize: 10,
        equipmentName: undefined,
        fixedAssetCode: undefined,
        type: undefined
      }
    }
  },
  mounted() {
    this.getList()
    // this.initChart()
  },
  methods: {
    handleFilter() {
      this.getList()
    },
    getList() {
      this.listLoading = true
      if (this.listQuery.chooseTime == undefined || this.listQuery.chooseTime == null) {
        this.$notify({
          title: '警告',
          message: '请选择查询月份',
          type: 'warning',
          duration: 2000
        })
        return
      } else {
        this.listQuery.chooseTime = parseTime(this.listQuery.chooseTime)
        this.listQuery.chooseTime = this.listQuery.chooseTime.substring(0, 7)
      }
      fetchDayList(this.listQuery).then(response => {
        if (response.data.code === 200) {
          this.monthstockAmount = response.data.data.stockAmount
          this.monthinNum = response.data.data.inNum
          this.monthoutNum = response.data.data.outNum
          this.monthincrease = response.data.data.increase
          this.monthbalance = response.data.data.balance
          this.listDay = response.data.data.listDay
          this.chartData = response.data.data.chartData
          this.inNumList = []
          this.outNumList = []
          this.increaseList = []
          this.amountList = []
          this.chartData.forEach(item => {
            this.inNumList.push(item.inNum)
            this.outNumList.push(item.outNum)
            this.increaseList.push(item.increase)
            this.amountList.push(item.amount)
          })
          this.initChart()
          setTimeout(() => {
            this.listLoading = false
          }, 1 * 500)
        } else {
          this.$notify({
            title: '警告',
            message: response.data.msg,
            type: 'warning',
            duration: 2000
          })
          this.listLoading = false
        }
      })
    },
    initChart() {
      var myChart = echarts.init(document.getElementById('echart1'))
      myChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['当日净增数', '库存数'],
          top: '0'
        },
        grid: {
          left: '10%',
          right: '10%',
          bottom: '15%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          axisTick: {
            show: false
          },
          data: this.listDay,
          position: 'bottom'
        }],
        yAxis: [
          {
            name: '当日净增数',
            type: 'value',
            nameGap: 40
          },
          {
            splitLine: {
              show: false
            },
            name: '库存数',
            type: 'value',
            nameGap: 40
          }
        ],
        series: [
          {
            name: '当日净增数',
            type: 'line',
            lineStyle: {
              width: 3,
              color: '#a5a5a5'
            },
            label: {
              normal: {
                position: 'inside',
                distance: 5
              }
            },
            yAxisIndex: 0,
            data: this.increaseList
          },
          {
            name: '库存数',
            type: 'line',
            lineStyle: {
              width: 3,
              color: '#ffc000'
            },
            label: {
              normal: {
                position: 'inside',
                distance: 5
              }
            },
            yAxisIndex: 1,
            data: this.amountList
          }
        ],
        dataZoom: [
          {
            type: 'slider',
            show: true,
            start: 0,
            end: 20,
            handleSize: 8
          },
          {
            type: 'inside',
            start: 0,
            end: 20
          }
        ]
      })
    },
    // 当日进库量
    inNumDetail(item) {
      this.isInWare = true
      this.listQuery1 = {
        startDate: item.statisticalDate,
        endDate: undefined,
        pageNum: 1,
        pageSize: 10,
        equipmentName: undefined,
        fixedAssetCode: undefined,
        type: 1
      }
      this.equipDialogVisible = true
      this.getInfoList()
    },
    // 当日出库量
    outNumDetail(item) {
      this.isInWare = false
      this.listQuery1 = {
        startDate: item.statisticalDate,
        endDate: undefined,
        pageNum: 1,
        pageSize: 10,
        equipmentName: undefined,
        fixedAssetCode: undefined,
        type: 2
      }
      this.equipDialogVisible = true
      this.getInfoList()
    },
    // 当日库存量
    amountDetail(item) {
      this.isInWare = true
      this.listQuery1 = {
        startDate: item.statisticalDate,
        endDate: undefined,
        pageNum: 1,
        pageSize: 10,
        equipmentName: undefined,
        fixedAssetCode: undefined,
        type: 3
      }
      this.equipDialogVisible = true
      this.getInfoList()
    },
    // 进库量汇总
    monthinNumDetail() {
      this.isInWare = true
      this.listQuery1 = {
        startDate: this.chartData[0].statisticalDate,
        endDate: this.chartData[this.chartData.length - 1].statisticalDate,
        pageNum: 1,
        pageSize: 10,
        equipmentName: undefined,
        fixedAssetCode: undefined,
        type: 1
      }
      this.equipDialogVisible = true
      this.getInfoList()
    },
    // 出库量汇总
    monthoutNumDetail() {
      this.isInWare = false
      this.listQuery1 = {
        startDate: this.chartData[0].statisticalDate,
        endDate: this.chartData[this.chartData.length - 1].statisticalDate,
        pageNum: 1,
        pageSize: 10,
        equipmentName: undefined,
        fixedAssetCode: undefined,
        type: 2
      }
      this.equipDialogVisible = true
      this.getInfoList()
    },
    // 弹框页面表格加载
    getInfoList() {
      this.listLoading = true
      fetchInfoList(this.listQuery1).then(response => {
        if (response.data.code === 200) {
          if (response.data.data != null && response.data.data.list != null) {
            this.infoList = response.data.data.list
            this.total1 = response.data.data.total
          }
          setTimeout(() => {
            this.listLoading = false
          }, 1 * 500)
        } else {
          this.$notify({
            title: '警告',
            message: response.data.msg,
            type: 'warning',
            duration: 2000
          })
          this.listLoading = false
        }
      })
    },
    // 搜索
    handleFilter1() {
      this.listQuery1.pageNum = 1
      this.getInfoList()
    },
    // 分页
    handleSizeChange1(val) {
      this.listQuery1.pageSize = val
      this.getInfoList()
    },
    handleCurrentChange1(val) {
      this.listQuery1.pageNum = val
      this.getInfoList()
    },
    handleExport() {
      fetchExportList(this.listQuery1).then(response => {
        if (response.data.code == 200) {
          window.location.href = response.data.data
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
  }
}
</script>
<style>
.formSearch {
  width: 100%;
  background: #fafafa;
  border: 1px solid #e9e9e9;
  border-radius: 3px;
  padding: 18px 10px 0;
}
.charts {
  height: 480px;
}
.charts li {
  float: left;
  list-style: none;
}
.charts table, 
.equipDetail table{
  border-collapse:collapse;
  width:100%;
  background-color: white;
}
.charts table tr, 
.equipDetail table tr{
  text-align: center;
}
.charts table thead tr,
.equipDetail table thead tr{
  background: #409EFF;
  height:50px;
  color:white
}
.charts table tbody tr,
.equipDetail table tbody tr{
  height:40px;
}
</style>