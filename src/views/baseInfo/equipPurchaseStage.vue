<template>
  <div class='app-container'>
    <el-container>
      <div class="formSearch">
        <el-form :inline="true">
          <el-form-item label="设备名称">
            <el-input class="filter-item input" placeholder="请输入设备名称" v-model="listQuery.equipmentName">
            </el-input>
          </el-form-item>
          <el-form-item label="固定资产编号">
            <el-input class="filter-item input" placeholder="请输入固定资产编号" v-model="listQuery.fixedAssetCode">
            </el-input>
          </el-form-item>
          <el-form-item label="备案时间">
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
          <el-form-item label="备案编号">
            <el-input class="filter-item input" placeholder="请输入备案编号" v-model="listQuery.filingNumber">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="filter-item" type="primary" style="float:right"  icon="el-icon-search" @click="handleFilter">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-main style="padding:20px 0">
        <el-button class="filter-item" @click="handleExport" type="primary" v-if="addShow">导出</el-button>
        <el-table :key='tableKey' :data="tableData" height="200" row-key="id" v-loading="listLoading" border fit highlight-current 
          style="width: 100%;margin-top:10px;min-height:500px" :header-cell-style="{background:'oldlace'}">
          <el-table-column prop="filingNumber" align="center" label="备案编号" >
          </el-table-column>
          <el-table-column prop="filingTime" align="center" label="备案时间" >
          </el-table-column>
          <el-table-column prop="equipmentName" align="center" label="设备名称" >
          </el-table-column>
          <el-table-column prop="fixedAssetCode" align="center" label="固定资产编号">
          </el-table-column>
          <el-table-column prop="purchaseEntity" align="center" label="采购主体" >
          </el-table-column>
          <el-table-column align="center" label="备案到立项下达时间" >
            <el-table-column prop="requestDate" align="center" label="要求完成时间" >
              <template slot-scope="scope">
                <span>{{scope.row.requestDate!==null?scope.row.requestDate.substring(0,10):''}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="filingDay" align="center" label="目标计划天数" >
            </el-table-column>
            <el-table-column prop="projectDate" align="center" label="实际完成时间" >
              <template slot-scope="scope">
                <span>{{scope.row.projectDate!==null?scope.row.projectDate.substring(0,10):''}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="projectDay" align="center" label="实际天数" >
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="招标资料移交采购时间" >
            <el-table-column prop="tenderRequest" align="center" label="要求完成时间" >
              <template slot-scope="scope">
                <span>{{scope.row.tenderRequest!==null?scope.row.tenderRequest.substring(0,10):''}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="tenderPlanDay" align="center" label="目标计划天数" >
            </el-table-column>
            <el-table-column prop="tenderDate" align="center" label="实际完成时间" >
              <template slot-scope="scope">
                <span>{{scope.row.tenderDate!==null?scope.row.tenderDate.substring(0,10):''}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="tenderRealDay" align="center" label="实际天数" >
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="采购定价的实际完成时间" >
            <el-table-column prop="purchaseCompletionPlanDate" align="center" label="要求完成时间" >
              <template slot-scope="scope">
                <span>{{scope.row.purchaseCompletionPlanDate!==null?scope.row.purchaseCompletionPlanDate.substring(0,10):''}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="purchaseCompletionPlanDay" align="center" label="目标计划天数" >
            </el-table-column>
            <el-table-column prop="purchaseCompletionDate" align="center" label="实际完成时间" >
              <template slot-scope="scope">
                <span>{{scope.row.purchaseCompletionDate!==null?scope.row.purchaseCompletionDate.substring(0,10):''}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="purchaseCompletionRealDay" align="center" label="实际天数" >
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="合同归档时间" >
            <el-table-column prop="contractFilingPlanDate" align="center" label="要求完成时间" >
              <template slot-scope="scope">
                <span>{{scope.row.contractFilingPlanDate!==null?scope.row.contractFilingPlanDate.substring(0,10):''}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="contractFilingPlanDay" align="center" label="目标计划天数" >
            </el-table-column>
            <el-table-column prop="contractFilingDate" align="center" label="实际完成时间" >
              <template slot-scope="scope">
                <span>{{scope.row.contractFilingDate!==null?scope.row.contractFilingDate.substring(0,10):''}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="contractFilingRealDay" align="center" label="实际天数" >
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="预付款时间（实际付款）" >
            <el-table-column prop="realSubsistPlanDate" align="center" label="要求完成时间" >
              <template slot-scope="scope">
                <span>{{scope.row.realSubsistPlanDate!==null?scope.row.realSubsistPlanDate.substring(0,10):''}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="realSubsistPlanDay" align="center" label="目标计划天数" >
            </el-table-column>
            <el-table-column prop="realSubsistDate" align="center" label="实际完成时间" >
              <template slot-scope="scope">
                <span>{{scope.row.realSubsistDate!==null?scope.row.realSubsistDate.substring(0,10):''}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="realSubsistRealDay" align="center" label="实际天数" >
            </el-table-column>
          </el-table-column>
          <el-table-column prop="equipNum" align="center" label="开票时间" >
            <el-table-column prop="invoicePlanDate" align="center" label="要求完成时间" >
              <template slot-scope="scope">
                <span>{{scope.row.invoicePlanDate!==null?scope.row.invoicePlanDate.substring(0,10):''}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="invoicePlanDay" align="center" label="目标计划天数" >
            </el-table-column>
            <el-table-column prop="invoiceDate" align="center" label="实际完成时间" >
              <template slot-scope="scope">
                <span>{{scope.row.invoiceDate!==null?scope.row.invoiceDate.substring(0,10):''}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="invoiceRealDay" align="center" label="实际天数" >
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="发货款时间（实际付款）" >
            <el-table-column prop="realShipmentPlanDate" align="center" label="要求完成时间" >
              <template slot-scope="scope">
                <span>{{scope.row.realShipmentPlanDate!==null?scope.row.realShipmentPlanDate.substring(0,10):''}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="realShipmentPlanDay" align="center" label="目标计划天数" >
            </el-table-column>
            <el-table-column prop="realShipmentDate" align="center" label="实际完成时间" >
              <template slot-scope="scope">
                <span>{{scope.row.realShipmentDate!==null?scope.row.realShipmentDate.substring(0,10):''}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="realShipmentDay" align="center" label="实际天数" >
            </el-table-column>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <div class="pagination-container">
          <el-pagination background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum" 
            :page-sizes="[5,10,15, 20]" 
            :page-size="pageSize" 
            layout="total, sizes, prev, pager, next, jumper" 
            :total="total">
          </el-pagination>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { fetchList, exportList } from '@/api/baseInfo/equipPurchaseStage'
import { fetchButton } from '@/api/common/button'
import { menuList } from '@/store/modules/permission'
export default {
  name: 'equipPurchaseApply',
  data() {
    return {
      // 判断按钮权限显示隐藏
      menuCode: undefined,
      addShow: false,
      // 表格数据
      tableKey: 0,
      listLoading: false,
      tableData: [],
      total: 0,
      listQuery: {
        equipmentName: undefined,
        filingNumber: undefined,
        filingTimeEnd: undefined,
        filingTimeUp: undefined,
        fixedAssetCode: undefined
      },
      pageNum: 1,
      pageSize: 10,
      value01: undefined
    }
  },
  created() {
    this.getList()
    this.getButton()
  },
  methods: {
    // 日期搜索
    searchChange() {
      // 日期转换
      if (this.value01 == null) {
        this.listQuery.filingTimeEnd = ''
        this.listQuery.filingTimeUp = ''
      } else {
        this.listQuery.filingTimeUp = this.value01[0]// 开始时间
        this.listQuery.filingTimeEnd = this.value01[1]
      }
    },
    getButton() {
      menuList.forEach(item => {
        item.children.forEach(e => {
          if (e.name == 'equipPurchaseStage') {
            this.menuCode = e.code
          }
        })
      })
      // 查询按钮信息
      const params = {
        menuCode: this.menuCode,
        type: 'web'
      }
      fetchButton(params).then(response => {
        if (response.data.code == 200) {
          const getBtns = response.data.data
          for (var i = 0; i < getBtns.length; i++) {
            if (getBtns[i].buttonName == '导出') {
              this.addShow = true
            }
          }
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
    getList() {
      this.tableData = []
      this.total = 0
      this.listLoading = true
      fetchList(this.pageNum, this.pageSize, this.listQuery).then(response => {
        if (response.data.code === 200) {
          if (response.data.data !== null && response.data.data.list !== null && response.data.data.list.length !== 0) {
            this.tableData = response.data.data.list
            const length = this.tableData.length - 1
            this.tableData[length].projectDay = this.tableData[length].projectDay + '%'
            this.tableData[length].tenderRealDay = this.tableData[length].tenderRealDay + '%'
            this.tableData[length].purchaseCompletionRealDay = this.tableData[length].purchaseCompletionRealDay + '%'
            this.tableData[length].contractFilingRealDay = this.tableData[length].contractFilingRealDay + '%'
            this.tableData[length].realSubsistRealDay = this.tableData[length].realSubsistRealDay + '%'
            this.tableData[length].invoiceRealDay = this.tableData[length].invoiceRealDay + '%'
            this.tableData[length].realShipmentDay = this.tableData[length].realShipmentDay + '%'
            this.total = response.data.data.total
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
    handleFilter() {
      this.pageNum = 1
      this.getList()
    },

    // 分页
    handleSizeChange(val) {
      this.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.getList()
    },
    handleExport() {
      exportList(this.listQuery).then(response => {
        const liststyp = response.data.data
        window.location.href = liststyp
      })
    }
  }
}
</script>
<style scoped>
.formSearch {
  width: 100%;
  background: #fafafa;
  border: 1px solid #e9e9e9;
  border-radius: 3px;
  padding: 18px 10px 0;
}
</style>

