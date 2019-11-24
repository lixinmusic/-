<template>
  <div class='app-container'>
    <el-container>
      <!-- <el-header style="height:115px"> -->
        <div class="formSearch">
          <el-form :inline="true">
            <el-form-item label="统计流程">
              <el-select v-model="listQuery.formTypeName" clearable  placeholder="请选择" @change='formTypeChange'>
                <el-option
                  v-for="item in formTypeLists"
                  :key="item.formTypeCode"
                  :label="item.formTypeName"
                  :value="item.formTypeName">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="申请时间">
              <el-date-picker
                v-model="value01"
                type="daterange"
                unlink-panels
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                clearable  @change="searchChange()">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button class="filter-item" type="primary" style="float:right"  icon="el-icon-search" @click="handleFilter">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
      <!-- </el-header> -->
      <el-main style="padding:20px 0" class="slashTable">
        <el-table :key='tableKey' :data="tableData" height="200" row-key="id" v-loading="listLoading" 
          border fit highlight-current style="width: 100%;margin-top:10px;min-height:500px" 
          :header-cell-style="{background:'oldlace'}">
          <el-table-column align="center" label="审核状态">
            <el-table-column prop="formTypeName" align="center" label="单据类型" width="188">
            </el-table-column>
          </el-table-column>
          <el-table-column prop="allNum" align="center" label="全部状态">
            <template slot-scope="scope">
              <span class="look-detail" @click="handleDetailAll(scope.row)">{{scope.row.allNum}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="inNum" align="center" label="审核中" >
            <template slot-scope="scope">
              <span class="look-detail" @click="handleDetailIn(scope.row)">{{scope.row.inNum}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="passNum" align="center" label="审核通过">
            <template slot-scope="scope">
              <span class="look-detail" @click="handleDetailPass(scope.row)">{{scope.row.passNum}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="failedNum" align="center" label="审核不通过" >
            <template slot-scope="scope">
              <span class="look-detail" @click="handleDetailFailed(scope.row)">{{scope.row.failedNum}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <div class="pagination-container">
          <el-pagination background 
          @size-change="handleSizeChange" 
          @current-change="handleCurrentChange" 
          :current-page="listQuery.pageNum" 
          :page-sizes="[5,10,15, 20]" 
          :page-size="listQuery.pageSize" 
          layout="total, sizes, prev, pager, next, jumper" 
          :total="total">
          </el-pagination>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { fetchList, fetchFormType } from '@/api/baseInfo/baseProceStat'
import { parseTime } from '@/utils'
export default {
  name: 'baseProceStat',
  data() {
    return {
      routMsg: {
        checkStatus: null,
        startDate: undefined,
        endDate: undefined
      },
      // 表格数据
      tableKey: 0,
      listLoading: false,
      tableData: [],
      total: null,
      value01: undefined,
      // 单据类型下拉框
      formTypeLists: [],
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        startDate: undefined,
        endDate: new Date(),
        formTypeCode: undefined,
        formTypeName: undefined
      }
    }
  },
  created() {
    this.getFormType()
    this.setNowDate()
  },
  methods: {
    getFormType() {
      fetchFormType().then(response => {
        if (response.data.code == 200) {
          this.formTypeLists = response.data.data
        } else {
          this.$notify({
            title: '警告',
            message: response.data.msg,
            type: 'warning',
            duration: 2000
          })
        }
      })
    },
    formTypeChange() {
      this.formTypeLists.forEach(item => {
        if (item.formTypeName == this.listQuery.formTypeName) {
          this.listQuery.formTypeCode = item.formTypeCode
        }
      })
    },
    setNowDate() {
      this.listQuery.endDate = parseTime(this.listQuery.endDate)
      this.listQuery.endDate = this.listQuery.endDate.substring(0, 10)
      const month = this.listQuery.endDate.substring(0, 7)
      this.listQuery.startDate = month + '-01'
      this.value01 = []
      this.value01.push(this.listQuery.startDate)
      this.value01.push(this.listQuery.endDate)
      this.getList()
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        if (response.data.code == 200) {
          this.tableData = response.data.data.list
          this.total = response.data.data.total
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
        }
      })
    },
    // 日期搜索
    searchChange() {
      // 日期转换
      if (this.value01 == null) {
        this.listQuery.startDate = ''
        this.listQuery.endDate = ''
      } else {
        this.listQuery.startDate = this.value01[0]// 开始时间
        this.listQuery.endDate = this.value01[1]
      }
    },
    // 搜索
    handleFilter() {
      if (this.listQuery.formTypeName == '') {
        this.listQuery.formTypeCode = ''
      }
      this.listQuery.pageNum = 1
      this.getList()
    },
    // 分页
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    },
    // 详情
    handleDetailAll(row) {
      this.routMsg = {
        checkStatus: null,
        startDate: this.listQuery.startDate,
        endDate: this.listQuery.endDate
      }
      this.routeJump(row)
    },
    handleDetailIn(row) {
      this.routMsg = {
        checkStatus: '2',
        startDate: this.listQuery.startDate,
        endDate: this.listQuery.endDate
      }
      this.routeJump(row)
    },
    handleDetailPass(row) {
      this.routMsg = {
        checkStatus: '3',
        startDate: this.listQuery.startDate,
        endDate: this.listQuery.endDate
      }
      this.routeJump(row)
    },
    handleDetailFailed(row) {
      this.routMsg = {
        checkStatus: '4',
        startDate: this.listQuery.startDate,
        endDate: this.listQuery.endDate
      }
      this.routeJump(row)
    },
    // 路由跳转
    routeJump(row) {
      switch (row.formTypeCode) {
        case 'SBBAD': // 设备备案单
          this.$router.push({ name: 'equipStatistic', params: { name: 'equipStatistic', dataObj: this.routMsg }})
          break
        case 'SBCGSQD': // 设备采购申请单
          this.$router.push({ name: 'equipPurchaseStatistic', params: { name: 'equipPurchaseStatistic', dataObj: this.routMsg }})
          break
        case 'WXBXD': // 设备报修单
          this.$router.push({ name: 'declHistory', params: { name: 'declHistory', dataObj: this.routMsg }})
          break
        case 'SBWXYSJLD': // 设备维修验收记录单
          this.$router.push({ name: 'labelHistory', params: { name: 'labelHistory', dataObj: this.routMsg }})
          break
        case 'SBWXZBQRD': // 设备维修质保确认单
          this.$router.push({ name: 'hconfiHistory', params: { name: 'hconfiHistory', dataObj: this.routMsg }})
          break
        case 'SBWXCCD': // 设备维修出厂单
          this.$router.push({ name: 'equipRepairStatistic', params: { name: 'equipRepairStatistic', dataObj: this.routMsg }})
          break
        case 'SBDBD': // 设备调拨单
          this.$router.push({ name: 'equipAllotStatistic', params: { name: 'equipAllotStatistic', dataObj: this.routMsg }})
          break
        case 'SBCNQYD': // 设备厂内迁移单
          this.$router.push({ name: 'migraHistory', params: { name: 'migraHistory', dataObj: this.routMsg }})
          break
        case 'SBDBZLXXBG': // 设备调拨质量信息报告
          this.$router.push({ name: 'qualiHistory', params: { name: 'qualiHistory', dataObj: this.routMsg }})
          break
        case 'SBPJDS': // 设备配件单
          this.$router.push({ name: 'addPartsStatistic', params: { name: 'addPartsStatistic', dataObj: this.routMsg }})
          break
        case 'SBPJD': // 新设备评价表
          this.$router.push({ name: 'equipEvaluateStatistic', params: { name: 'equipEvaluateStatistic', dataObj: this.routMsg }})
          break
        case 'SBYJD': // 新设备移交单
          this.$router.push({ name: 'equipTransferStatistic', params: { name: 'equipTransferStatistic', dataObj: this.routMsg }})
          break
        case 'SBYSD': // 新设备验收单
          this.$router.push({ name: 'newReceHistory', params: { name: 'newReceHistory', dataObj: this.routMsg }})
          break
        case 'SBZBD': // 设备质保验收单
          this.$router.push({ name: 'ofixWaHistory', params: { name: 'ofixWaHistory', dataObj: this.routMsg }})
          break
        case 'SBXZSQD': // 设备闲置申请单
          this.$router.push({ name: 'equipIdleStatistic', params: { name: 'equipIdleStatistic', dataObj: this.routMsg }})
          break
        case 'DJCZPSD': // 电机处置评审单
          this.$router.push({ name: 'motorDisReviewStatistic', params: { name: 'motorDisReviewStatistic', dataObj: this.routMsg }})
          break
        case 'XZSBQDSQD': // 闲置设备启动申请单
          this.$router.push({ name: 'idleStartStatistic', params: { name: 'idleStartStatistic', dataObj: this.routMsg }})
          break
        case 'XZSBCZSQD': // 闲置设备处置申请单
          this.$router.push({ name: 'idleAppHistory', params: { name: 'idleAppHistory', dataObj: this.routMsg }})
          break
        case 'AZWCQRD': // 安装完成确认单
          this.$router.push({ name: 'installCompleteStatistic', params: { name: 'installCompleteStatistic', dataObj: this.routMsg }})
          break
        case 'SBGZBAD': // 设备改造备案单
          this.$router.push({ name: 'remouldStatistic', params: { name: 'remouldStatistic', dataObj: this.routMsg }})
          break
        case 'SBGZAZWCQRD': // 设备改造安装完成确认单
          this.$router.push({ name: 'remouldCompleteStatistic', params: { name: 'remouldCompleteStatistic', dataObj: this.routMsg }})
          break
        case 'SBGZYSD': //设备改造验收单
        this.$router.push({ name: 'remakeHistory', params: {name:'remakeHistory',dataObj:this.routMsg}})
          break
           case 'SBGZZBYSD': //设备改造质保验收单
        this.$router.push({name:'remakevwHistory',params:{name:'remakevwHistory',dataObj:this.routMsg}})
          break
        case 'KXYSD': //开箱验收单
        this.$router.push({name:'acceptanceSheetHistory',params:{name:'acceptanceSheetHistory',dataObj:this.routMsg}})
          break
      }
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
.slashTable .el-table thead.is-group tr:first-of-type th:first-of-type {
  border-bottom: none;
}
.slashTable .el-table thead.is-group tr:first-of-type th:first-of-type:before {
  content: '';
  position: absolute;
  width: 1px;
  height: 120px; /*这里需要自己调整，根据td的宽度和高度*/
  top: 0;
  left: 0;
  background-color: grey;
  opacity: 0.3;
  display: block;
  transform: rotate(-65.8deg); /*这里需要自己调整，根据线的位置*/
  transform-origin: top;
}
.slashTable .el-table thead.is-group tr:last-of-type th:first-of-type:before {
  content: '';
  position: absolute;
  width: 1px;
  height: 100px; /*这里需要自己调整，根据td的宽度和高度*/
  bottom: 0;
  right: 0;
  background-color: grey;
  opacity: 0.3;
  display: block;
  transform: rotate(-64.9deg); /*这里需要自己调整，根据线的位置*/
  transform-origin: bottom;
}
</style>
