<template>
    <div class='app-container'>
        <el-container>
            <div class="formSearch">
                <el-form :inline="true">
                    <el-form-item label="时间">
                        <el-date-picker
                            style="width:100%"
                            @change="changeTime()"
                            v-model="value13"
                            type="daterange"
                            format="yyyy-MM"
                            value-format="yyyy-MM-dd"
                            range-separator="至"
                            start-placeholder="开始月份"
                            end-placeholder="结束月份">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="仓库名称">
                        <el-select v-model="listQuery.storehouseCode" clearable placeholder="请选择仓库" @change='lbChange'>
                            <el-option v-for="item in lbList" :key="item.wordCode" :label="item.wordName" :value="item.wordCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="filter-item" type="primary" style="float:right" icon="el-icon-search" @click="handleFilter">搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-main style="padding:20px 0">
                <el-table :key='tableKey' :data="tableData" height="200" row-key="id" v-loading="listLoading" border fit highlight-current style="width: 100%;margin-top:10px;min-height:500px" :header-cell-style="{background:'oldlace'}">
                    <el-table-column type="index" width="60" align="center" label="序号">
                        <template slot-scope="scope">
                            {{scope.$index+(pageNum -1) * pageSize +1}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="storehouseName" align="center" label="仓库名称">
                    </el-table-column>
                    <el-table-column prop="startNum" align="center" label="初期数量">
                    </el-table-column>
                    <el-table-column prop="equipNum" align="center" label="本月采购数">
                        <el-table-column prop="date" align="center" label="日期">
                        </el-table-column>
                        <el-table-column prop="procureNum" align="center" label="数量">
                            <template slot-scope="scope">
                                <span class="look-detail" @click="handleDetail(scope.row)">{{scope.row.procureNum}}</span>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column prop="equipNum" align="center" label="本月领用数">
                        <el-table-column prop="date" align="center" label="日期">
                        </el-table-column>
                        <el-table-column prop="receiveNum" align="center" label="数量">
                            <template slot-scope="scope">
                                <span class="look-detail" @click="handleDetail1(scope.row)">{{scope.row.receiveNum}}</span>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column prop="equipNum" align="center" label="本月归还数">
                        <el-table-column prop="date" align="center" label="日期">
                        </el-table-column>
                        <el-table-column prop="returnNum" align="center" label="数量">
                            <template slot-scope="scope">
                                <span class="look-detail" @click="handleDetail2(scope.row)">{{scope.row.returnNum}}</span>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column prop="" align="center" label="结存">
                        <template slot-scope="scope">
                            {{scope.row.startNum + scope.row.procureNum - scope.row.receiveNum + scope.row.returnNum}}
                        </template>
                    </el-table-column>
                </el-table>
            </el-main>
            <el-footer>
                <div class="pagination-container">
                    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[5,10,15, 20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                    </el-pagination>
                </div>
            </el-footer>
            <el-dialog title="夹具明细" :visible.sync="dialogTableVisible" width="60%" v-dialogDrag>
                <el-table :data="detailData" border fit highlight-current-row :header-cell-style="{background:'oldlace',color:'#606266'}" style="font-size:10px;">
                    <el-table-column type="index" width="60" align="center" label="序号"></el-table-column>
                    <el-table-column align="center" prop="fixtureName" label="夹具名称"></el-table-column>
                    <el-table-column align="center" prop="fixedAssetCode" label="固定资产编号"></el-table-column>
                    <el-table-column align="center" prop="model" label="规格型号"></el-table-column>
                    <el-table-column align="center" prop="manufacturer" label="制造厂家"></el-table-column>
                </el-table>
                <el-footer>
                    <div class="pagination-container" v-if="isShow">
                        <el-pagination background @size-change="handleSizeChange3" @current-change="handleCurrentChange3" :current-page="pageNum3" :page-sizes="[5,10,15, 20]" :page-size="pageSize3" layout="total, sizes, prev, pager, next, jumper" :total="total3">
                        </el-pagination>
                    </div>
                    <div class="pagination-container" v-if="isShow1">
                        <el-pagination background @size-change="handleSizeChange1" @current-change="handleCurrentChange1" :current-page="pageNum1" :page-sizes="[5,10,15, 20]" :page-size="pageSize1" layout="total, sizes, prev, pager, next, jumper" :total="total1">
                        </el-pagination>
                    </div>
                    <div class="pagination-container" v-if="isShow2">
                        <el-pagination background @size-change="handleSizeChange2" @current-change="handleCurrentChange2" :current-page="pageNum2" :page-sizes="[5,10,15, 20]" :page-size="pageSize2" layout="total, sizes, prev, pager, next, jumper" :total="total2">
                        </el-pagination>
                    </div>
                </el-footer>
            </el-dialog>
        </el-container>
    </div>
</template>

<script>
import { fetchList, fetchlbList, getDetail } from '@/api/jigHandover/inventoryManagement'
export default {
  name: 'inventoryManagement',
  data() {
    return {
      value13: [],
      menuCode: undefined,
      // 表格数据
      tableKey: 0,
      listLoading: false,
      tableData: [],
      total: null,
      pageNum: 1,
      pageSize: 10,
      listQuery: {
        storehouseCode: '',
        startDate: '',
        endDate: ''
      },
      lbList: [],
      dialogTableVisible: false,
      detailData: [],
      total3: null,
      pageNum3: 1,
      pageSize3: 10,
      total1: null,
      pageNum1: 1,
      pageSize1: 10,
      total2: null,
      pageNum2: 1,
      pageSize2: 10,
      row3: {},
      row1: {},
      row2: {},
      isShow: false,
      isShow1: false,
      isShow2: false
    }
  },
  created() {
    this.getList()
    this.getlbList()
  },
  methods: {
    changeTime() {
      if (this.value13 == null) {
        this.listQuery.startDate = ''
        this.listQuery.endDate = ''
      } else {
        this.listQuery.startDate = this.value13[0]
        this.listQuery.endDate = this.value13[1]
      }
    },
    getList() {
      this.tableData = []
      this.listLoading = true
      fetchList(this.pageNum, this.pageSize, this.listQuery).then(
        response => {
          if (response.data.code === 200) {
            if (
              response.data.data != null &&
                            response.data.data.list != null
            ) {
              this.tableData = response.data.data.list
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
        }
      )
    },
    // 夹具明细 (采购)
    handleDetail(row) {
      this.isShow = true
      this.isShow1 = false
      this.isShow2 = false
      this.row3 = row
      this.detailData = []
      this.getBuy()
      this.dialogTableVisible = true
    },
    getBuy() {
      const param = {
        companyCode: this.row3.companyCode,
        divisionCode: this.row3.divisionCode,
        factoryCode: this.row3.factoryCode,
        flag: 2,
        startDate: this.row3.date,
        storehouseCode: this.row3.storehouseCode
      }
      getDetail(this.pageNum3, this.pageSize3, param).then(response => {
        if (response.data.code === 200) {
          this.detailData = response.data.data.list
          this.total3 = response.data.data.total
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
    // 夹具明细 (领用)
    handleDetail1(row) {
      this.isShow1 = true
      this.isShow = false
      this.isShow2 = false
      this.row1 = row
      this.detailData = []
      this.getUse()
      this.dialogTableVisible = true
    },
    getUse() {
      const param = {
        companyCode: this.row1.companyCode,
        divisionCode: this.row1.divisionCode,
        factoryCode: this.row1.factoryCode,
        flag: 3,
        startDate: this.row1.date,
        storehouseCode: this.row1.storehouseCode
      }
      getDetail(this.pageNum1, this.pageSize1, param).then(response => {
        if (response.data.code === 200) {
          this.detailData = response.data.data.list
          this.total1 = response.data.data.total
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
    // 夹具明细 (归还)
    handleDetail2(row) {
      this.isShow2 = true
      this.isShow = false
      this.isShow1 = false
      this.row2 = row
      this.detailData = []
      this.getReturn()
      this.dialogTableVisible = true
    },
    getReturn() {
      const param = {
        companyCode: this.row2.companyCode,
        divisionCode: this.row2.divisionCode,
        factoryCode: this.row2.factoryCode,
        flag: 4,
        startDate: this.row2.date,
        storehouseCode: this.row2.storehouseCode
      }
      getDetail(this.pageNum2, this.pageSize2, param).then(response => {
        if (response.data.code === 200) {
          this.detailData = response.data.data.list
          this.total2 = response.data.data.total
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
    // 根据字典值获取仓库
    getlbList() {
      const find = {
        parCode: 'CK',
        pageNum: 1,
        pageSize: 200
      }
      fetchlbList(find).then(response => {
        this.lbList = []
        this.lbList = response.data.data.list
      })
    },
    lbChange() {
      this.lbList.forEach(item => {
        if (item.wordName == this.listQuery.storehouseName) {
          this.listQuery.storehouseCode = item.wordCode
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
    // 夹具明细-->采购
    handleSizeChange3(val) {
      this.pageSize3 = val
      this.getBuy()
    },
    handleCurrentChange3(val) {
      this.pageNum3 = val
      this.getBuy()
    },
    // 夹具明细-->领用
    handleSizeChange1(val) {
      this.pageSize1 = val
      this.getUse()
    },
    handleCurrentChange1(val) {
      this.pageNum1 = val
      this.getUse()
    },
    // 夹具明细-->归还
    handleSizeChange2(val) {
      this.pageSize2 = val
      this.getReturn()
    },
    handleCurrentChange2(val) {
      this.pageNum2 = val
      this.getReturn()
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
.el-table thead tr .el-checkbox__input {
    display: none;
}
.look-detail {
    text-decoration: underline;
    cursor: pointer;
}
</style>

