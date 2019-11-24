<template>
  <div class='app-container'>
    <el-container>
      <div class="formSearch">
        <el-form :inline="true">
          <el-form-item label="出库单号">
            <el-input class="filter-item input" v-model="listQuery.formCode">
            </el-input>
          </el-form-item>
          <el-form-item label="固定资产编号">
            <el-input class="filter-item input" v-model="listQuery.fixedAssetCode">
            </el-input>
          </el-form-item>
          <el-form-item label="设备名称">
            <el-input class="filter-item input" v-model="listQuery.equipName">
            </el-input>
          </el-form-item>
          <el-form-item label="型号规格">
            <el-input class="filter-item input" v-model="listQuery.equipType">
            </el-input>
          </el-form-item>
          <el-form-item label="出库时间">
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
      <el-main style="padding:20px 0">
        <el-table :key='tableKey' :data="tableData" height="200" row-key="id" v-loading="listLoading" 
          border fit highlight-current style="width: 100%;margin-top:10px;min-height:500px" 
          :header-cell-style="{background:'oldlace'}">
          <el-table-column align="center" label="出库单号">
            <template slot-scope="scope">
              <span class="look-detail" @click="handleDetail(scope.row)">{{scope.row.formCode}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="applicationTime" align="center" label="出库时间" >
          </el-table-column>
          <el-table-column prop="transferOutCompany" align="center" label="调出公司" >
          </el-table-column>
          <el-table-column prop="fixedAssetCode" align="center" label="固定资产编号" >
          </el-table-column>
          <el-table-column prop="equipName" align="center" label="设备名称" >
          </el-table-column>
          <el-table-column prop="equipType" align="center" label="型号规格" >
          </el-table-column>
          <el-table-column prop="serialNumber" align="center" label="出厂编号" >
          </el-table-column>
          <el-table-column prop="manufacturer" align="center" label="制造厂家" >
          </el-table-column>
          <el-table-column prop="status" align="center" label="库存状态" >
            <template slot-scope="scope">
              <span>{{scope.row.status==3?'已出库':'未出库'}}</span>
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
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="60%" v-dialogDrag :close-on-click-modal="false"> 
        <el-tabs v-model="activeName">
          <el-tab-pane label="表单信息" name="first">
            <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="110px">
              <el-form-item>
                <span class="equip-title">维修回厂出库单</span>
              </el-form-item>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="出库单号" prop="formCode">
                    <el-input v-model="temp.formCode" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="出库时间" prop="applicationTime">
                    <el-date-picker style="width:100%"
                      v-model="temp.applicationTime"
                      type="date"
                      placeholder="选择日期"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                       disabled>
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="调出公司" prop="transferOutCompany">
                    <el-input v-model="temp.transferOutCompany" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="固定资产编号" prop="fixedAssetCode">
                    <el-input v-model="temp.fixedAssetCode" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="设备名称" prop="equipName">
                    <el-input v-model="temp.equipName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="型号规格" prop="equipType">
                    <el-input v-model="temp.equipType" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="出厂编号" prop="serialNumber">
                    <el-input v-model="temp.serialNumber" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="制造厂家" prop="manufacturer">
                    <el-input v-model="temp.manufacturer" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="11">
                  <el-form-item label="数量" prop="nums">
                    <el-input v-model="temp.nums" disabled></el-input>
                  </el-form-item>
                </el-col>
                 <el-col :span="1" style="padding:0px;font-size:20px;font-weight:800;">
                  <span>台</span>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="库存状态" prop="status">
                    <el-radio v-model="temp.status" label="3" :disabled="statuShow">已出库</el-radio>
                    <el-radio v-model="temp.status" label="4" :disabled="statuShow">未出库</el-radio>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
        </el-tabs>
        <!-- 按钮组 -->
        <el-form class="formDw"> 
          <el-form-item>
            <el-button type="primary" @click="dialogFormVisible = false">返回</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
import { fetchList, getDetail } from '@/api/equipOutInHouse/equipOutInHouse'
export default {
  name: 'reqairInHouse',
  data() {
    return {
      activeName: 'first',
      statuShow: false,
      // 表格数据
      tableKey: 0,
      listLoading: false,
      tableData: [],
      total: null,
      value01: undefined,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        formCode: undefined,
        fixedAssetCode: undefined,
        equipName: undefined,
        equipType: undefined,
        startTime: undefined,
        endTime: undefined,
        type: 4
      },
      id: undefined,
      temp: {
        id: undefined,
        formCode: undefined, // 单据编号
        applicationTime: undefined,
        nums: 1, // 数量
        transferOutCompany: undefined,
        fixedAssetCode: undefined, // 固定资产编码
        equipName: undefined, // 设备名称
        equipType: undefined, // 规格型号
        manufacturer: undefined, // 制造厂家
        serialNumber: undefined, // 出厂编码
        status: undefined // 库存状态
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        detail: '查看维修回厂出库单'
      },
      rules: {
        equipName: [{ required: true, message: '请输入设备名称', trigger: 'change' }],
        equipType: [{ required: true, message: '请输入型号规格', trigger: 'change' }],
        fixedAssetCode: [{ required: true, message: '请输入固定资产编号', trigger: 'change' }],
        serialNumber: [{ required: true, message: '请输入出厂编号', trigger: 'change' }],
        // manufacturer: [{ required: true, message: '请输入制造厂家', trigger: 'change' }],

        transferOutCompany: [{ required: true, message: '请输入调出公司', trigger: 'change' }],
        nums: [{ required: true, message: '请输入数量', trigger: 'change' }],
        status: [{ required: true, message: '请选择库存状态', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        if (response.data.code === 200) {
          this.tableData = response.data.data.results
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
          this.listLoading = false
        }
      })
    },
    // 日期搜索
    searchChange() {
      // 日期转换
      if (this.value01 == null) {
        this.listQuery.startTime = ''
        this.listQuery.endTime = ''
      } else {
        this.listQuery.startTime = this.value01[0]// 开始时间
        this.listQuery.endTime = this.value01[1]
      }
    },
    // 搜索
    handleFilter() {
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
    // 根据编号查看
    handleDetail(row) {
      this.statuShow = false
      const id = row.id
      // 根据id获取详情
      getDetail(id).then(response => {
        if (response.data.code == 200) {
          const details = response.data.data
          this.temp = Object.assign({}, details)
          this.temp.nums = 1
          this.temp.status = this.temp.status.toString()
          this.statuShow = true
        } else {
          this.$notify({
            title: '警告',
            message: response.data.msg,
            type: 'warning',
            duration: 2000
          })
        }
      })
      this.activeName = 'first'
      this.dialogStatus = 'detail'
      this.dialogFormVisible = true
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
.equip-title{
    margin-left: -100px;
    text-align: center;
    display: block;
    font-size: 20px;
    font-weight: 600;
}
.look-detail {
    text-decoration:underline;
    cursor: pointer;
}
.formDw{
	position: absolute;
	right: 20px;
	top: 80px;
}
</style>