<template>
  <div class='app-container'>
    <el-container>
      <div class="formSearch">
        <el-form :inline="true">
          <el-form-item label="单据编号">
            <el-input class="filter-item input" v-model="listQuery.formCode">
            </el-input>
          </el-form-item>
          <el-form-item label="固定资产编号">
            <el-input class="filter-item input" v-model="listQuery.fixedAssetCode">
            </el-input>
          </el-form-item>
          <el-form-item label="设备名称">
            <el-input class="filter-item input" v-model="listQuery.equipmentName">
            </el-input>
          </el-form-item>
          <el-form-item label="入库状态" prop="inWarehouse">
            <el-radio v-model="listQuery.inWarehouse" label="true">已入库</el-radio>
            <el-radio v-model="listQuery.inWarehouse" label="false">未入库</el-radio>
          </el-form-item>
          <el-form-item label="入库日期">
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
          <el-table-column align="center" label="单据编号">
            <template slot-scope="scope">
              <span class="look-detail" @click="handleDetail(scope.row)">{{scope.row.formCode}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="固定资产编号" >
            <template slot-scope="scope">
              <span>{{scope.row.fixedAssetCode}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="设备名称" >
            <template slot-scope="scope">
              <span>{{scope.row.equipmentName}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="型号规格" >
            <template slot-scope="scope">
              <span>{{scope.row.model}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="出厂编号" >
            <template slot-scope="scope">
              <span>{{scope.row.serialNumber}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="equipStatus" align="center" label="设备完好情况" >
            <template slot-scope="scope">
              <span>{{scope.row.equipStatus ==1?'闲置可用':'闲置待报废'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="unusedPlace" align="center" label="闲置位置" >
            <template slot-scope="scope">
              <span>{{scope.row.unusedPlace}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="inWarehouse" align="center" label="入库状态" >
            <template slot-scope="scope">
              <span>{{scope.row.inWarehouse==true?'已入库':'未入库'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="inWarehouseDate" align="center" label="入库日期" >
            <template slot-scope="scope">
              <span>{{scope.row.inWarehouseDate}}</span>
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
      <!-- 新增编辑弹框 -->
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="60%" v-dialogDrag :close-on-click-modal="false"> 
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="表单信息" name="first">
            <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="110px">
              <el-form-item>
                <span class="equip-title">闲置设备入库单</span>
              </el-form-item>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="单据编号" prop="formCode">
                    <el-input v-model="temp.formCode" disabled></el-input>
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
                  <el-form-item label="使用公司" prop="companyName">
                    <el-input v-model="temp.companyName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="使用工厂" prop="factoryName">
                    <el-input v-model="temp.factoryName" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="申请日期" prop="applyDate">
                    <el-date-picker style="width:100%"
                      v-model="temp.applyDate"
                      type="date"
                      placeholder="选择日期"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                       disabled>
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="设备名称" prop="equipmentName">
                    <el-input v-model="temp.equipmentName" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="型号规格" prop="model">
                    <el-input v-model="temp.model" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="数量" prop="number">
                    <el-input v-model="temp.number" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="使用部门" prop="divisionName">
                    <el-input v-model="temp.divisionName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="闲置位置" prop="unusedPlace">
                    <el-input v-model="temp.unusedPlace" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="制造厂家(制造部门)" prop="manufacturer">
                    <el-input v-model="temp.manufacturer" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="出厂编号" prop="serialNumber">
                    <el-input v-model="temp.serialNumber" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="11">
                  <el-form-item label="闲置天数" prop="unusedDays">
                    <el-input v-model="temp.unusedDays" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="1" style="padding:0px;font-size:20px;font-weight:800;">
                  <span>天</span>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="设备完好情况" prop="equipStatus">
                    <el-radio v-model="temp.equipStatus" label="1" disabled>闲置可用</el-radio>
                    <el-radio v-model="temp.equipStatus" label="2" disabled>闲置待报废</el-radio>	
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="申请闲置理由" prop="applyUnusedReason">
                <el-input v-model="temp.applyUnusedReason" disabled></el-input>
              </el-form-item>
              <el-row>
                <el-col :span="10">
                  <el-form-item label="附件上传" prop="">
                    <input id="uploadImg1" type="file" @change="fileUpload1" v-if="false">
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <el-table :data="fileData"
              border fit highlight-current style="width: 60%; margin-left:100px;">
              <el-table-column align="center" label="文件名" >
                <template slot-scope="scope">
                  <span>{{scope.row.fileName}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="上传节点" >
                <template slot-scope="scope">
                  <span>{{scope.row.node}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <el-button title="下载" type="primary" size="mini" icon="el-icon-download" @click="fileDown(scope.row)"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <!-- <el-tab-pane label="流转记录" name="second">
            <el-table :data="recordData" 
              height="500" row-key="id" 
              v-loading="listLoading" 
              border fit highlight-current 
              style="width: 100%;">
              <el-table-column align="center" type="index" label="序号" min-width="100">
              </el-table-column>
              <el-table-column align="center" label="步骤名称" >
                <template slot-scope="scope">
                  <span>{{scope.row.taskName}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作人">
                <template slot-scope="scope">
                  <span>{{scope.row.userName}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="所在部门">
                <template slot-scope="scope">
                  <span>{{scope.row.orgName}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="岗位">
                <template slot-scope="scope">
                  <span>{{scope.row.stationName}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="状态">
                <template slot-scope="scope">
                  <span>{{scope.row.state}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="意见">
                <template slot-scope="scope">
                  <span>{{scope.row.opinion}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="时间">
                <template slot-scope="scope">
                  <span>{{scope.row.dateTime}}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane> -->
        </el-tabs>
        <!-- 按钮组 -->
        <el-form class="formDw"> 
          <el-form-item>
            <el-button type="primary" @click="dialogFormVisible = false">返回</el-button>
            <el-button v-if="installShow" type="primary" @click="installFinish">确认入库</el-button>
            <el-button v-if="!installShow" type="primary" disabled>已入库</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
import { fetchGohouse, getDetail, wareHouse } from '@/api/idleProcess/equipIdleApply/equipIdleApply'
import { recordList, fileList } from '@/api/common/common'
export default {
  name: 'idleEquipGohouse',
  data() {
    return {
      installShow: undefined,
      // 表格数据
      tableKey: 0,
      listLoading: false,
      tableData: [],
      total: null,
      value01: undefined,
      // 审核状态下拉框
      options: [{
        value: '1',
        label: '未提交'
      }, {
        value: '2',
        label: '审核中'
      }, {
        value: '3',
        label: '审核通过'
      }, {
        value: '4',
        label: '审核不通过'
      }],
      auditingType: '',
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        formCode: undefined,
        fixedAssetCode: undefined,
        equipmentName: undefined,
        inWarehouse: undefined,
        inWarehouseDateStart: undefined,
        inWarehouseDateEnd: undefined
      },
      id: undefined,
      temp: {
        id: undefined,
        accountId: undefined, // 台账id
        applyUnusedReason: undefined, // 申请闲置理由
        formCode: undefined, // 单据编号
        applyDate: undefined, // 申请时间

        number: 1, // 数量
        unusedDays: undefined, // 闲置天数
        unusedPlace: undefined, // 闲置位置

        fixedAssetCode: undefined, // 固定资产编码
        equipmentName: undefined, // 设备名称
        companyName: undefined, // 使用公司
        factoryName: undefined, // 使用工厂
        divisionName: undefined, // 使用部门
        model: undefined, // 规格型号
        manufacturer: undefined, // 制造厂家
        serialNumber: undefined, // 出厂编码
        equipStatus: undefined, // 闲置完好状态

        files: []
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        detail: '查看闲置设备入库单'
      },
      // 文件数据
      fileData: [],
      documentWordCode: undefined, // 单据编码
      userId: undefined, // 用户id
      processInstanceId: undefined, // 流程实例id

      // 流转记录
      activeName: 'first',
      recordData: null,
      rules: {
        formCode: [{ required: true, message: '请输入单据编号', trigger: 'change' }],
        equipmentName: [{ required: true, message: '请输入设备名称', trigger: 'change' }],
        model: [{ required: true, message: '请输入型号规格', trigger: 'change' }],
        fixedAssetCode: [{ required: true, message: '请输入固定资产编号', trigger: 'change' }],

        serialNumber: [{ required: true, message: '请输入出厂编号', trigger: 'change' }],
        // manufacturer: [{ required: true, message: '请输入制造厂家', trigger: 'change' }],

        companyName: [{ required: true, message: '请输入使用公司', trigger: 'change' }],
        factoryName: [{ required: true, message: '请输入使用工厂', trigger: 'change' }],
        divisionName: [{ required: true, message: '请输入使用部门', trigger: 'change' }],

        number: [{ required: true, message: '请输入数量', trigger: 'change' }],
        applyUnusedReason: [{ required: true, message: '请输入申请闲置理由', trigger: 'change' }],
        transferTime: [{ required: true, message: '请选择移交时间', trigger: 'change' }],
        unusedDays: [{ required: true, message: '请输入闲置天数', trigger: 'change' }],
        unusedPlace: [{ required: true, message: '请选择闲置位置', trigger: 'change' }],
        // applyDate:[{ required: true, message: '请选择申请日期', trigger: 'change' }],
        equipStatus: [{ required: true, message: '请选择闲置完好状态', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchGohouse(this.listQuery).then(response => {
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
        }
      })
    },
    // 日期搜索
    searchChange() {
      // 日期转换
      if (this.value01 == null) {
        this.listQuery.inWarehouseDateStart = ''
        this.listQuery.inWarehouseDateEnd = ''
      } else {
        this.listQuery.inWarehouseDateStart = this.value01[0]// 开始时间
        this.listQuery.inWarehouseDateEnd = this.value01[1]
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
      const id = row.id
      // 根据id获取详情
      getDetail(id).then(response => {
        if (response.data.code == 200) {
          const details = response.data.data
          this.temp = Object.assign({}, details)
          if (row.inWarehouse == true) {
            this.installShow = false
          } else {
            this.installShow = true
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
      this.activeName = 'first'
      this.dialogStatus = 'detail'
      this.dialogFormVisible = true
      this.id = row.id
      this.documentWordCode = row.formCode
      // 流转记录
      // this.processInstanceId = row.processInstanceId
      this.getFileList()
    },
    // 获取文件列表
    getFileList() {
      const find = {
        moduleType: '10', // 模块类别
        attachmentCode: 'SBXZSQDFJ', // 附件编码
        documentWordCode: this.documentWordCode // 单据编码
      }
      fileList(find).then(response => {
        this.fileData = response.data.data
      })
    },
    // 文件下载
    fileDown(row) {
      window.location.href = row.filePath + '?attname=' + row.fileName
    },
    // 点击确认入库
    installFinish() {
      const id = this.id
      wareHouse(id).then(response => {
        if (response.data.code == 200) {
          this.installShow = false
          this.getList()
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
    // tabs 点击事件流转记录
    handleClick(tab, event) {
      if (tab.label == '流转记录') {
        this.listLoading = true
        this.recordData = null
        // 请求流转记录
        recordList(this.processInstanceId).then(response => {
          if (response.data.code === 200) {
            this.recordData = response.data.data
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
      }
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

