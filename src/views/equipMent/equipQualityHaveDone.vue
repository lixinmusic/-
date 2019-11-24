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
              <span>{{scope.row.contractCode}}/{{scope.row.supplier }}</span>
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
      <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" :visible.sync="dialogFormVisible" width="60%" v-dialogDrag> 
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
                    <el-radio v-model="temp.acceptanceSituation" label="1" disabled>验收通过</el-radio>
                    <el-radio v-model="temp.acceptanceSituation" label="0" disabled>验收不通过</el-radio>	
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="验收完成时间" prop="acceptanceFinishTime">
                    <el-date-picker style="width:100%"
                      v-model="temp.acceptanceFinishTime"
                      type="date"
                      placeholder="选择日期" disabled>
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  <el-form-item label="设备质量信息报告附件" prop="fileData" label-width="160px">
                    <input id="uploadImg" type="file" @change="fileUpload" v-if="false">
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
                  <span>{{scope.row.node}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <el-button title="下载" type="primary" size="mini" icon="el-icon-download" @click="fileDown(scope.row)"></el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row>
              <el-col :span="10">
                <el-form label-position="left">
                <el-form-item label="设备检修记录单附件" prop="jxfileData" label-width="150px">
                  <input id="uploadImg1" type="file" @change="fileUpload1" v-if="false">
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
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="流转记录" name="second">
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
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
import { fetchDoneList, getDetail, recordList, fileList } from '@/api/equipMent/equipQualityReport/equipQualityReport'
import { fetchButton } from '@/api/common/button'
import { baseUrl } from '@/api/common/fileBaseUrl'
export default {
  name: 'equipQualityHaveDone',
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
      isCreateEvaluate: undefined, // 是否生成报告
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
      dialogStatus: '',
      textMap: {
        detail: '查看设备质量信息报告'
      },
      // 文件数据
      chooseShow: true, // 选择按钮
      fileData: [], // 设备质量
      jxfileData: [], // 设备检修
      documentWordCode: undefined, // 单据编码
      userId: undefined, // 用户id
      processInstanceId: undefined, // 流程实例id

      // 流转记录
      activeName: 'first',
      recordData: null,
      rules: {
        documentWordCode: [{ required: true, message: '请输入单据编码', trigger: 'change' }],
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
      fetchDoneList(this.listQuery).then(response => {
        if (response.data.code === 200) {
          this.tableData = response.data.data.list
          for (var i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].auditingType == 1) {
              this.tableData[i].auditingType = '未提交'
            } else if (this.tableData[i].auditingType == 2) {
              this.tableData[i].auditingType = '审核中'
            } else if (this.tableData[i].auditingType == 3) {
              this.tableData[i].auditingType = '审核通过'
            } else if (this.tableData[i].auditingType == 4) {
              this.tableData[i].auditingType = '审核不通过'
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
      // this.chooseShow = false
      this.dialogFormVisible = true
      this.documentWordCode = row.documentWordCode
      const id = row.id
      // 表单信息
      getDetail(id).then(response => {
        if (response.data.code == 200) {
          this.temp = Object.assign({}, response.data.data)
          this.temp.acceptanceSituation = response.data.data.acceptanceSituation.toString()
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
    // 文件下载
    fileDown(row) {
      window.location.href = row.filePath + '?attname=' + row.fileName
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
  /* margin-bottom: 15px; */
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

