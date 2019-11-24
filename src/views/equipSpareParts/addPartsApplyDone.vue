<template>
  <div class='app-container'>
    <el-container>
      <div class="formSearch">
        <el-form :inline="true">
          <el-form-item label="单据编号">
            <el-input class="filter-item input" v-model="listQuery.formCode">
            </el-input>
          </el-form-item>
          <el-form-item label="设备名称">
            <el-input class="filter-item input" v-model="listQuery.equipmentName">
            </el-input>
          </el-form-item>
          <el-form-item label="配件品名" prop="acceptanceType">
            <el-input class="filter-item input" v-model="listQuery.sparePartsName">
            </el-input>
          </el-form-item>
          <el-form-item label="审核状态">
            <el-select v-model="listQuery.checkStatus" clearable  placeholder="请选择">
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
          <el-table-column prop="" align="center" label="单据编号">
            <template slot-scope="scope">
              <span class="look-detail" @click="handleDetail(scope.row)">{{scope.row.formCode}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="equipmentName" align="center" label="设备名称" >
          </el-table-column>
          <el-table-column prop="sparePartsName"  align="center" label="配件品名" >
          </el-table-column>
          <el-table-column prop="sparePartsCode" align="center" label="配件编码" >
          </el-table-column>
          <el-table-column prop="procurementCycle" align="center" label="采购周期" >
          </el-table-column>
          <el-table-column prop="parameter" align="center" label="产品规格" >
          </el-table-column>
          <el-table-column prop="unit" align="center" label="单位" >
          </el-table-column>
          <el-table-column prop="checkStatusName" align="center" label="审核状态" >
          </el-table-column>
          <el-table-column prop="processingPerson" align="center" label="当前处理人" >
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
      <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" :visible.sync="dialogFormVisible" v-loading="listLoading" v-dialogDrag> 
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="表单信息" name="first">
            <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="110px">
              <el-form-item>
                <span class="equip-title">新增配件申请表</span>
              </el-form-item>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="单据编号" prop="formCode">
                    <el-input v-model="temp.formCode" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" style="padding-right:0px;">
                  <el-form-item label="设备名称" prop="equipmentName">
                    <el-input v-model="temp.equipmentName" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="配件品名" prop="sparePartsName">
                    <el-input v-model="temp.sparePartsName" maxlength="15" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="采购周期" prop="procurementCycle">
                    <el-input v-model="temp.procurementCycle" maxlength="10" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="产品规格" prop="parameter">
                    <el-input v-model="temp.parameter" maxlength="20" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="单位" prop="unit">
                    <el-input v-model="temp.unit" maxlength="5" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="24">
                  <el-form-item label="适用其他设备" prop="othersEquip">
                    <el-input v-model="temp.othersEquip" maxlength="50" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="22">
                  <el-form-item label="图片或图纸" prop="picList">
                    <div v-if="temp.picList.length>0" v-for="item in temp.picList" :key="item.id">
                      <span class="look-detail" @click="lookImage(item)">{{item.fileName}}</span>
                      <el-button title="下载" type="primary" size="mini" icon="el-icon-download" @click="imageDown(item)"></el-button>
                    </div>
                    <input accept="image/*" id="uploadImg" type="file" @change="imageUpload" v-if="false">
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  <el-form-item label="文件" prop="fList">
                    <input id="uploadFile" type="file" @change="fileUpload" v-if="false">
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <el-table :data="temp.fList"
              border fit highlight-current style="width: 60%; margin-left:100px;">
              <el-table-column prop="fileName" align="center" label="文件名" >
                <template slot-scope="scope">
                  <span class="look-detail" @click="lookFile(scope.row)">{{scope.row.fileName}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="node" align="center" label="上传节点" >
              </el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <el-button title="下载" type="primary" size="mini" icon="el-icon-download" @click="fileDown(scope.row)"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="流转记录" name="second">
            <el-table :data="recordData" height="500" border fit highlight-current style="width: 100%;">
              <el-table-column align="center" type="index" label="序号" min-width="100">
              </el-table-column>
              <el-table-column prop="taskName" align="center" label="步骤名称" >
              </el-table-column>
              <el-table-column prop="userName" align="center" label="操作人">
              </el-table-column>
              <el-table-column prop="orgName" align="center" label="所在部门">
              </el-table-column>
              <el-table-column prop="stationName" align="center" label="岗位">
              </el-table-column>
              <el-table-column prop="state" align="center" label="状态">
              </el-table-column>
              <el-table-column prop="opinion" align="center" label="意见">
              </el-table-column>
              <el-table-column prop="dateTime" align="center" label="时间">
              </el-table-column>
              <el-table-column prop="remark" align="center" label="备注">
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="流程图" name="three">
            <div id="imgcontainer">
              <img id="pic" :src="chartData"/>
            </div>
          </el-tab-pane>
        </el-tabs>
        <!-- 按钮组 -->
        <el-form class="formDw"> 
          <el-form-item>
            <el-button type="primary" @click="dialogFormVisible = false">返回</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
       <el-dialog :close-on-click-modal="false" title="预览图片" :visible.sync="lookDialogVisible" append-to-body>
        <div id="lookImg">
          <img id="lookPic" :src="imageData"/>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="lookDialogVisible = false">取消</el-button>
        </div>
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
import { fetchDoneList, getDetail } from '@/api/equipSpareParts/addPartsApply'
import { commonOptions1,recordList, processChart } from '@/api/common/common'
import { baseUrl } from '@/api/common/fileBaseUrl'
export default {
  name: 'addPartsApplyDone',
  data() {
    return {
      chartData: null, // 流程图
      // 表格数据
      tableKey: 0,
      listLoading: false,
      tableData: [],
      total: null,
      // 审核状态下拉框
      options: commonOptions1,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        equipmentName: undefined,
        formCode: undefined,
        sparePartsName: undefined,
        checkStatus: undefined
      },
      id: undefined,
      temp: {
        id: undefined,
        formCode: undefined,
        sparePartsCode: undefined,
        sparePartsName: undefined,

        unit: undefined,
        procurementCycle: undefined,
        parameter: undefined,
        othersEquip: undefined,

        equipmentName: undefined,
        equipmentCode: undefined,
        equipmentId: undefined,
        fList: [],
        picList: []
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        detail: '查看'
      },
      // 文件数据
      documentWordCode: undefined, // 单据编码
      userId: undefined, // 用户id
      processInstanceId: undefined, // 流程实例id
      filePathDown: undefined,
      // 流转记录
      activeName: 'first',
      recordData: null,
      lookDialogVisible: false, // 预览图片
      imageData: null,
      rules: {
        equipmentName: [{ required: true, message: '该字段为必填项', trigger: 'change' }],
        sparePartsName: [{ required: true, message: '该字段为必填项', trigger: 'change' }],
        // procurementCycle: [{ required: true, message: '该字段为必填项', trigger: 'change' }],
        // parameter: [{ required: true, message: '该字段为必填项', trigger: 'change' }],
        unit: [{ required: true, message: '该字段为必填项', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchDoneList(this.listQuery).then(response => {
        if (response.data.code === 200) {
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
          this.listLoading = false
        }
      })
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
      this.dialogFormVisible = true
      this.documentWordCode = row.formCode
      // 流转记录
      this.processInstanceId = row.processInstanceId
      const find = {
        id: row.id
      }
      // 表单信息
      getDetail(find).then(response => {
        if (response.data.code == 200) {
          this.temp = Object.assign({}, response.data.data)
          this.temp.folderList.forEach(item => {
            if (item.attachmentCode == 'SBPJTPFJ') {
              this.temp.picList = []
              this.temp.picList.push(item)
            } else if (item.attachmentCode == 'SBPJWJFJ') {
              this.temp.fList = []
              this.temp.fList.push(item)
            }
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
    },
    // 文件下载
    fileDown(row) {
      window.location.href = row.filePath + '?attname=' + row.fileName
    },
    lookFile(row) {
      let url
      if (row.fileUrl !== undefined) {
        url = baseUrl + 'onlinePreview?url=' + encodeURIComponent(row.fileUrl)
      } else {
        url = baseUrl + 'onlinePreview?url=' + encodeURIComponent(row.filePath)
      }
      var winHeight = window.document.documentElement.clientHeight
      window.open(url, '_blank', 'height=' + winHeight + ',top=10,left=10,toolbar=no,menubar=no,scrollbars=yes,resizable=yes')
    },
    // tabs 点击事件
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
      } else if (tab.label == '流程图') {
        this.chartData = null
        if (this.processInstanceId != null) {
          this.listLoading = true
          processChart(this.processInstanceId).then(response => {
            if (response.data.code != 803 && response.data.code != 808) {
              this.chartData = response.request.responseURL
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
    },
    lookImage(item) {
      this.imageData = null
      this.lookDialogVisible = true
      this.imageData = item.filePath
    },
    imageDown(item) {
      window.location.href = item.filePath + '?attname=' + item.fileName
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
.formDw{
	position: absolute;
	right: 20px;
	top: 80px;
}
#pic,
#lookPic {
  width: 100%;
}
</style>

