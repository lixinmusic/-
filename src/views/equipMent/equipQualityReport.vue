<template>
  <div class='app-container'>
    <el-container>
      <div class="formSearch">
        <el-form :inline="true">
          <el-form-item label="设备名称">
            <el-input class="filter-item input" v-model="listQuery.equipmentName">
            </el-input>
          </el-form-item>
          <el-form-item label="固定资产编号">
            <el-input class="filter-item input" v-model="listQuery.fixedAssetCode">
            </el-input>
          </el-form-item>
          <el-form-item label="验收完成时间">
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
          <el-form-item label="验收情况" prop="acceptanceType">
            <el-radio v-model="listQuery.acceptanceType" label="0">验收不通过</el-radio>
            <el-radio v-model="listQuery.acceptanceType" label="1">验收通过</el-radio>	
          </el-form-item>
          <el-form-item label="审核状态">
            <el-select v-model="listQuery.auditingType" clearable  placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
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
          <el-table-column align="center" label="单据编码">
            <template slot-scope="scope">
              <span class="look-detail" @click="handleDetail(scope.row)">{{scope.row.documentWordCode}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="设备名称" >
            <template slot-scope="scope">
              <span>{{scope.row.equipmentName}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="型号规格" >
            <template slot-scope="scope">
              <span>{{scope.row.typeSpecification}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="固定资产编号" >
            <template slot-scope="scope">
              <span>{{scope.row.fixedAssetCode}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="出厂编号" >
            <template slot-scope="scope">
              <span>{{scope.row.outFactoryCode}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="合同编号/供应商" >
            <template slot-scope="scope">
              <span>{{scope.row.contractCode + '/' + scope.row.supplier }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="备案编号" >
            <template slot-scope="scope">
              <span>{{scope.row.recordCode}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="使用公司" >
            <template slot-scope="scope">
              <span>{{scope.row.useCompanyName}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="使用工厂" >
            <template slot-scope="scope">
              <span>{{scope.row.useFactoryName}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="使用车间" >
            <template slot-scope="scope">
              <span>{{scope.row.useWorkshopName}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="验收情况" >
            <template slot-scope="scope">
              <span>{{scope.row.acceptanceSituationName}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="验收完成时间" >
            <template slot-scope="scope">
              <span>{{scope.row.acceptanceFinishTime}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="" align="center" label="审核状态" >
            <template slot-scope="scope">
              <span>{{scope.row.auditingType}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="240px" fixed="right">
            <template slot-scope="scope">
              <el-button title="编辑" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)" 
                :disabled="scope.row.editDisabled?true:false"></el-button>
              <!-- <el-button title="删除" type="danger" icon="el-icon-delete" size="mini"  @click="deleteBtn(scope.row)" 
                :disabled="scope.row.deleteDisabled?true:false"></el-button> -->
              <el-button title="重新验收" type="danger" icon="el-icon-refresh" size="mini"  @click="refreshBtn(scope.row)" 
                :disabled="scope.row.refreshDisabled?true:false"></el-button>
              <el-button title="生成新设备评价表" type="primary" size="mini" icon="el-icon-document" @click="createEvaluate(scope.row)"
                :disabled="scope.row.createDisabled?true:false"></el-button>
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
      <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" :visible.sync="dialogFormVisible" width="60%" v-loading="listLoading" v-dialogDrag> 
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="表单信息" name="first">
            <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="110px">
              <el-form-item>
                <span class="equip-title">设备质量信息报告</span>
              </el-form-item>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="单据编码" prop="documentWordCode">
                    <el-input v-model="temp.documentWordCode" disabled></el-input>
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
                  <el-form-item label="型号规格" prop="typeSpecification">
                    <el-input v-model="temp.typeSpecification" disabled></el-input>
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
                  <el-form-item label="出厂编号" prop="outFactoryCode">
                    <el-input v-model="temp.outFactoryCode" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="合同编号/供应商" prop="supplier" label-width="125px">
                    <el-input v-model="temp.supplier" disabled>{{temp.contractCode}}/{{temp.supplier}}</el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="备案编号" prop="recordCode">
                    <el-input v-model="temp.recordCode" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="使用公司" prop="useCompanyName">
                    <el-input v-model="temp.useCompanyName" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="使用工厂" prop="useFactoryName">
                    <el-input v-model="temp.useFactoryName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="使用车间" prop="useWorkshopName">
                    <el-input v-model="temp.useWorkshopName" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="验收情况" prop="acceptanceSituation">
                    <el-radio v-model="temp.acceptanceSituation" label="1">验收通过</el-radio>
                    <el-radio v-model="temp.acceptanceSituation" label="0">验收不通过</el-radio>	
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="验收完成时间" prop="acceptanceFinishTime">
                    <el-date-picker style="width:100%"
                      v-model="temp.acceptanceFinishTime"
                      type="date"
                      placeholder="选择日期"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="1" style="width:1px;color:red;padding:8px;">
                  <span>*</span>
                </el-col>
                <el-col :span="9">
                  <el-form-item label="设备质量信息报告附件" prop="fileData" label-width="160px">
                    <input id="uploadImg" type="file" @change="fileUpload" v-if="chooseShow">
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <el-table :data="fileData"
              border fit highlight-current style="width: 60%; margin-left:100px;">
              <el-table-column align="center" label="文件名" >
                <template slot-scope="scope">
                  <span style="cursor:pointer;text-decoration:underline " @click="handlePreview(scope.row)">{{scope.row.fileName}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="上传节点" >
                <template slot-scope="scope">
                  <span style="cursor:pointer;text-decoration:underline " @click="handlePreview(scope.row)">{{scope.row.node}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <el-button title="下载" type="primary" size="mini" icon="el-icon-download" @click="fileDown(scope.row)"></el-button>
                  <el-button v-if="chooseShow" title="删除" type="danger" icon="el-icon-delete" size="mini"  @click="zlFileDelete(scope.row)"></el-button>
                  <!-- <el-button v-if="dialogStatus=='update'" title="删除1" type="danger" icon="el-icon-delete" size="mini"  @click="updatefileDelete(scope.row)"></el-button> -->
                </template>
              </el-table-column>
            </el-table>
            <el-row>
              <el-col :span="10">
                <el-form label-position="left">
                  <el-form-item label="设备检修记录单附件" prop="jxfileData" label-width="150px">
                    <input id="uploadImg1" type="file" @change="fileUpload1" v-if="chooseShow">
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-table :data="jxfileData"
              border fit highlight-current style="width: 60%; margin-left:100px;">
              <el-table-column align="center" label="文件名" >
                <template slot-scope="scope">
                  <span style="cursor:pointer;text-decoration:underline " @click="handlePreview(scope.row)">{{scope.row.fileName}}</span>
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
                  <el-button v-if="chooseShow" title="删除" type="danger" icon="el-icon-delete" size="mini"  @click="jxFileDelete(scope.row)"></el-button>
                  <!-- <el-button v-if="dialogStatus=='update'" title="删除1" type="danger" icon="el-icon-delete" size="mini"  @click="updatefileDelete(scope.row)"></el-button> -->
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="流转记录" name="second" v-if="recordShow">
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
          </el-tab-pane>
        </el-tabs>
        <!-- 按钮组 -->
        <el-form class="formDw"> 
          <el-form-item>
            <el-button type="primary" @click="dialogFormVisible = false">返回</el-button>
            <el-button v-if="dialogStatus=='create'" type="primary" @click="saveData">保存</el-button>
            <el-button v-if="dialogStatus=='update'" type="primary" @click="updateSaveData">保存</el-button>
            <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">提交</el-button>
            <el-button v-if="dialogStatus=='update'" type="primary" @click="updateData">提交</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 生成新设备评价表 -->
      <el-dialog title="提示" :close-on-click-modal="false" :visible.sync="centerDialogVisible" width="30%">
        <span>已生成新设备评价表，请到新设备评价表页面处理</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="centerDialogVisible=false">确定</el-button>
        </span>
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
import { fetchList, getDetail, updateQualityInfo, delById, recordList, uploadlist, deleteFile, fileList, deleteFileById, getCurrentUser, insertFile, createEvaluateReport, createArticle } from '@/api/equipMent/equipQualityReport/equipQualityReport'
import { fetchButton } from '@/api/common/button'
import { baseUrl } from '@/api/common/fileBaseUrl'
export default {
  name: 'equipQualityReport',
  data() {
    return {
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
        equipmentName: undefined,
        fixedAssetCode: undefined,
        acceptanceDateStart: undefined,
        acceptanceDateEnd: undefined,
        acceptanceType: undefined,
        auditingType: undefined
      },
      id: undefined,
      isCreateEvaluate: undefined, // 是否生成评价表报告
      isReAcceptance: undefined, // 是否验收
      temp: {
        id: undefined,
        equId: undefined,
        documentWordCode: undefined,

        acceptanceFinishTime: undefined,
        acceptanceSituation: undefined,

        auditingType: undefined,
        contractCode: undefined,

        equipmentName: undefined,
        fixedAssetCode: undefined,

        outFactoryCode: undefined,
        recordCode: undefined,

        supplier: undefined,
        typeSpecification: undefined,

        useCompanyName: undefined,
        useFactoryName: undefined,
        useWorkshopName: undefined,
        list: []
      },
      dialogFormVisible: false,
      centerDialogVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '重新验收',
        detail: '查看设备质量信息报告'
      },
      // 文件数据
      chooseShow: true, // 选择按钮
      fileData: [], // 设备质量
      jxfileData: [], // 设备检修
      fileDataAll: [],
      documentWordCode: undefined, // 单据编码
      userId: undefined, // 用户id
      processInstanceId: undefined, // 流程实例id

      // 流转记录
      activeName: 'first',
      recordShow: false,
      recordData: null,
      rules: {
        // documentWordCode: [{ required: true, message: '请输入单据编码', trigger: 'change' }],
        equipmentName: [{ required: true, message: '请输入设备名称', trigger: 'change' }],

        typeSpecification: [{ required: true, message: '请输入型号规格', trigger: 'change' }],
        fixedAssetCode: [{ required: true, message: '请输入固定资产编号', trigger: 'change' }],

        outFactoryCode: [{ required: true, message: '请输入出厂编号', trigger: 'change' }],
        supplier: [{ required: true, message: '请输入供应商', trigger: 'change' }],

        // recordCode: [{ required: true, message: '请输入备案编号', trigger: 'change' }],
        useCompanyName: [{ required: true, message: '请输入使用公司', trigger: 'change' }],

        useFactoryName: [{ required: true, message: '请输入使用工厂', trigger: 'change' }],
        useWorkshopName: [{ required: true, message: '请输入使用车间', trigger: 'change' }],

        acceptanceSituation: [{ required: true, message: '请选择验收情况', trigger: 'change' }],
        acceptanceFinishTime: [{ required: true, message: '请选择验收完成时间', trigger: 'change' }]
        // fileData:[{ required: true, message: '请上传设备质量信息报告附件', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
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
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        if (response.data.code === 200) {
          this.tableData = response.data.data.list
          for (var i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].auditingType == 1) {
              this.tableData[i].auditingType = '未提交'

              this.tableData[i].refreshDisabled = true
              this.tableData[i].createDisabled = true
            } else if (this.tableData[i].auditingType == 2) {
              this.tableData[i].auditingType = '审核中'

              this.tableData[i].editDisabled = true
              // this.tableData[i].deleteDisabled = true
              this.tableData[i].refreshDisabled = true
              this.tableData[i].createDisabled = true
            } else if (this.tableData[i].auditingType == 3) { // 审核通过
              this.tableData[i].auditingType = '审核通过'

              this.tableData[i].editDisabled = true
              // this.tableData[i].deleteDisabled = true
              if (this.tableData[i].acceptanceSituation == 0) { // 验收不通过
                this.tableData[i].createDisabled = true
                if (this.tableData[i].isReAcceptance == 1) { // 已重新验收
                  this.tableData[i].refreshDisabled = true
                } else if (this.tableData[i].isReAcceptance == 0) { // 未重新验收
                  this.tableData[i].refreshDisabled = false
                }
              } else if (this.tableData[i].acceptanceSituation == 1) { // 验收通过
                this.tableData[i].refreshDisabled = true
                if (this.tableData[i].isCreateEvaluate == 1) { // 已生成评价表
                  this.tableData[i].createDisabled = true
                } else if (this.tableData[i].isCreateEvaluate == 0) { // 未生成评价表
                  this.tableData[i].createDisabled = false
                }
              }
            } else if (this.tableData[i].auditingType == 4) {
              this.tableData[i].auditingType = '审核不通过'

              this.tableData[i].editDisabled = true
              // this.tableData[i].deleteDisabled = true
              this.tableData[i].refreshDisabled = true
              this.tableData[i].createDisabled = true
            }
          }
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
        this.listQuery.acceptanceDateStart = ''
        this.listQuery.acceptanceDateEnd = ''
      } else {
        this.listQuery.acceptanceDateStart = this.value01[0]// 开始时间
        this.listQuery.acceptanceDateEnd = this.value01[1]
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
      this.activeName = 'first'
      this.dialogStatus = 'detail'
      this.recordShow = true
      this.chooseShow = false
      this.dialogFormVisible = true
      this.documentWordCode = row.documentWordCode
      const id = row.id
      // 表单信息
      getDetail(id).then(response => {
        if (response.data.code == 200) {
          this.temp = Object.assign({}, response.data.data)
          if (this.temp.acceptanceSituation != null) {
            this.temp.acceptanceSituation = response.data.data.acceptanceSituation.toString()
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
      // 流转记录
      this.processInstanceId = row.processInstanceId
      this.getFileList()
    },
    // 删除
    deleteBtn(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const id = row.id
        delById(id).then(response => {
          if (response.data.code === 200) {
            const index = this.tableData.indexOf(row)
            this.tableData.splice(index, 1)
            this.$message({
              title: '成功',
              type: 'success',
              message: '删除成功!',
              duration: 2000
            })
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 编辑
    handleUpdate(row) {
      this.activeName = 'first'
      this.dialogStatus = 'update'
      this.recordShow = false
      this.chooseShow = true
      this.dialogFormVisible = true
      this.documentWordCode = row.documentWordCode
      const id = row.id
      // 根据id获取详情
      getDetail(id).then(response => {
        this.temp = Object.assign({}, response.data.data)
        this.temp.acceptanceSituation = response.data.data.acceptanceSituation.toString()
      })
      this.getFileList() // 获取文件
      // 获取当前用户信息
      getCurrentUser().then(response => {
        this.userId = response.data.data.id
      })
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 修改保存
    updateSaveData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.fileData.length == 0) {
            this.$notify({
              title: '警告',
              message: '请上传设备质量信息报告附件',
              type: 'warning',
              duration: 2000
            })
            return
          }
          this.listLoading = true
          const tempData = {
            acceptanceFinishTime: this.temp.acceptanceFinishTime,
            acceptanceSituation: this.temp.acceptanceSituation,
            auditingType: 1,
            id: this.temp.id
          }
          updateQualityInfo(tempData).then(response => {
            if (response.data.code == 200) {
              this.dialogFormVisible = false
              this.getList()
              setTimeout(() => {
                this.listLoading = false
              }, 1 * 500)
              this.$message({
                title: '成功',
                message: '保存成功',
                type: 'success',
                duration: 2000
              })
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
        }
      })
    },
    // 修改提交
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.fileData.length == 0) {
            this.$notify({
              title: '警告',
              message: '请上传设备质量信息报告附件',
              type: 'warning',
              duration: 2000
            })
            return
          }
          this.listLoading = true
          const tempData = {
            acceptanceFinishTime: this.temp.acceptanceFinishTime,
            acceptanceSituation: this.temp.acceptanceSituation,
            auditingType: 2,
            id: this.temp.id
          }
          updateQualityInfo(tempData).then(response => {
            if (response.data.code == 200) {
              this.dialogFormVisible = false
              this.getList()
              setTimeout(() => {
                this.listLoading = false
              }, 1 * 500)
              this.$message({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
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
        }
      })
    },
    resetTemp() {
      // 附件列表
      this.fileData = [],
      this.jxfileData = [],
      this.fileDataAll = [],
      this.userId = undefined
      this.documentWordCode = undefined
    },
    // 重新验收
    refreshBtn(row) {
      const id = row.id
      // 根据id获取详情
      getDetail(id).then(response => {
        this.temp = Object.assign({}, response.data.data)
        this.temp.list = [],
        this.temp.acceptanceSituation = undefined
        this.temp.acceptanceFinishTime = undefined
        this.temp.documentWordCode = undefined
      })
      this.resetTemp()
      this.activeName = 'first'
      this.dialogStatus = 'create'
      this.chooseShow = true
      this.recordShow = false
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 重新验收保存
    saveData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.fileData.length == 0) {
            this.$notify({
              title: '警告',
              message: '请上传设备质量信息报告附件',
              type: 'warning',
              duration: 2000
            })
            return
          }
          this.listLoading = true
          this.fileDataAll = this.fileData
          this.jxfileData.forEach(item => {
            this.fileDataAll.push(item)
          })
          this.temp.list = this.fileDataAll
          this.temp.auditingType = 1
          createArticle(this.temp).then(response => {
            if (response.data.code == 200) {
              this.dialogFormVisible = false
              this.getList()
              setTimeout(() => {
                this.listLoading = false
              }, 1 * 500)
              this.$message({
                title: '成功',
                message: '保存成功',
                type: 'success',
                duration: 2000
              })
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
        }
      })
    },
    // 重新验收提交
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.fileData.length == 0) {
            this.$notify({
              title: '警告',
              message: '请上传设备质量信息报告附件',
              type: 'warning',
              duration: 2000
            })
            return
          }
          this.listLoading = true
          this.fileDataAll = this.fileData
          this.jxfileData.forEach(item => {
            this.fileDataAll.push(item)
          })
          this.temp.list = this.fileDataAll
          this.temp.auditingType = 2
          createArticle(this.temp).then(response => {
            if (response.data.code == 200) {
              this.dialogFormVisible = false
              this.getList()
              setTimeout(() => {
                this.listLoading = false
              }, 1 * 500)
              this.$message({
                title: '成功',
                message: '保存成功',
                type: 'success',
                duration: 2000
              })
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
        }
      })
    },
    // 获取文件列表
    getFileList() {
      // 设备质量信息报告附件
      const find = {
        moduleType: '4', // 模块类别
        attachmentCode: 'SBZLXXBGFJ', // 附件编码
        documentWordCode: this.documentWordCode // 单据编码
      }
      fileList(find).then(response => {
        this.fileData = response.data.data
      })
      // 设备检修记录附件
      const find1 = {
        moduleType: '4', // 模块类别
        attachmentCode: 'SBJXJLFJ', // 附件编码
        documentWordCode: this.documentWordCode // 单据编码
      }
      fileList(find1).then(response => {
        this.jxfileData = response.data.data
      })
    },
    // 文件上传设备质量
    fileUpload(e) {
      const file = e.target.files[0]
      const fileData1 = {
        attachmentCode: 'SBZLXXBGFJ',
        code: this.documentWordCode,
        moduleType: '4',
        fileName: undefined, // 文件名称
        filePath: undefined, // 文件URL
        node: '开始',
        fileUrl: undefined,
        userId: this.userId
      }
      if (file != null) {
        this.listLoading = true
        const param = new FormData() // 创建form对象
        param.append('file', file, file.name) // 通过append向form对象添加数据
        fileData1.fileName = file.name
        uploadlist(param).then(resp => { // 调用上传接口
          if (resp.data.code == 200) {
            fileData1.filePath = resp.data.data.remoteFilename
            fileData1.fileUrl = resp.data.data.fileUrl
            // 新增文件
            if (this.dialogStatus == 'update') {
              insertFile(fileData1).then(response => {
                if (response.data.code == 200) {
                  fileData1.id = response.data.data
                  this.$message({
                    title: '成功',
                    message: '上传成功',
                    type: 'success',
                    duration: 2000
                  })
                  this.fileData.push(fileData1)
                }
              })
            } else if (this.dialogStatus == 'create') {
              this.fileData.push(fileData1)
              this.$message({
                title: '成功',
                message: '上传成功',
                type: 'success',
                duration: 2000
              })
            }
            setTimeout(() => {
              this.listLoading = false
            }, 1 * 500)
            const fileInput = document.getElementById('uploadImg')
            fileInput.value = ''
          } else {
            this.$notify({
              title: '警告',
              message: '上传失败',
              type: 'warning',
              duration: 2000
            })
            this.listLoading = false
          }
        })
      }
    },
    // 文件上传设备检修
    fileUpload1(e) {
      const file = e.target.files[0]
      const fileData1 = {
        attachmentCode: 'SBJXJLFJ',
        code: this.documentWordCode,
        moduleType: '4',
        fileName: undefined,
        filePath: undefined, // 文件URL
        node: '开始',
        fileUrl: undefined,
        userId: this.userId
      }
      if (file != null) {
        this.listLoading = true
        const param = new FormData() // 创建form对象
        param.append('file', file, file.name) // 通过append向form对象添加数据
        fileData1.fileName = file.name
        uploadlist(param).then(resp => { // 调用上传接口
          if (resp.data.code == 200) {
            fileData1.filePath = resp.data.data.remoteFilename
            fileData1.fileUrl = resp.data.data.fileUrl
            // 新增文件
            if (this.dialogStatus == 'update') {
              insertFile(fileData1).then(response => {
                if (response.data.code == 200) {
                  fileData1.id = response.data.data
                  this.$message({
                    title: '成功',
                    message: '上传成功',
                    type: 'success',
                    duration: 2000
                  })
                  this.jxfileData.push(fileData1)
                }
              })
            } else if (this.dialogStatus == 'create') {
              this.jxfileData.push(fileData1)
              this.$message({
                title: '成功',
                message: '上传成功',
                type: 'success',
                duration: 2000
              })
            }
            setTimeout(() => {
              this.listLoading = false
            }, 1 * 500)
            const fileInput1 = document.getElementById('uploadImg1')
            fileInput1.value = ''
          } else {
            this.$notify({
              title: '警告',
              message: '上传失败',
              type: 'warning',
              duration: 2000
            })
            this.listLoading = false
          }
        })
      }
    },
    // 文件下载
    fileDown(row) {
      if (this.dialogStatus == 'create') {
        window.location.href = row.fileUrl + '?attname=' + row.fileName
      } else {
        window.location.href = row.filePath + '?attname=' + row.fileName
      }
    },
    // 质量文件删除
    zlFileDelete(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.dialogStatus == 'create') {
          const find1 = {
            fileName: row.filePath
          }
          deleteFile(find1).then(response => {
            if (response.data.code === 200) {
              const index = this.fileData.indexOf(row)
              this.fileData.splice(index, 1)
              this.$message({
                title: '成功',
                type: 'success',
                message: '删除成功!',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '警告',
                message: response.data.msg,
                type: 'warning',
                duration: 2000
              })
            }
          })
        } else if (this.dialogStatus == 'update') {
          const id = row.id
          deleteFileById(id).then(response => {
            if (response.data.code === 200) {
              const index = this.fileData.indexOf(row)
              this.fileData.splice(index, 1)
              this.$message({
                title: '成功',
                type: 'success',
                message: '删除成功!',
                duration: 2000
              })
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 检修文件删除
    jxFileDelete(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 新增时 删除
        if (this.dialogStatus == 'create') {
          const find1 = {
            fileName: row.filePath
          }
          deleteFile(find1).then(response => {
            if (response.data.code === 200) {
              const index = this.jxfileData.indexOf(row)
              this.jxfileData.splice(index, 1)
              this.$message({
                title: '成功',
                type: 'success',
                message: '删除成功!',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '警告',
                message: response.data.msg,
                type: 'warning',
                duration: 2000
              })
            }
          })
        } else if (this.dialogStatus == 'update') {
          const id = row.id
          deleteFileById(id).then(response => {
            if (response.data.code === 200) {
              const index = this.jxfileData.indexOf(row)
              this.jxfileData.splice(index, 1)
              this.$message({
                title: '成功',
                type: 'success',
                message: '删除成功!',
                duration: 2000
              })
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 生成新设备评价表
    createEvaluate(row) {
      this.listLoading = true
      const id = row.id
      createEvaluateReport(id).then(response => {
        if (response.data.code === 200) {
          this.centerDialogVisible = true
          setTimeout(() => {
            this.listLoading = false
          }, 1 * 500)
          this.getList()
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
            this.listLoading = false
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

