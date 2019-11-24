<template>
  <div class='app-container'>
    <el-container>
      <!-- <el-header style="height:115px"> -->
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
            <el-form-item label="安装完成时间">
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
            <el-form-item label="安装情况" prop="installType">
              <el-radio v-model="listQuery.installType" label="0">未安装</el-radio>
              <el-radio v-model="listQuery.installType" label="1">已安装</el-radio>	
            </el-form-item>
            <el-form-item>
              <el-button class="filter-item" type="primary" style="float:right"  icon="el-icon-search" @click="handleFilter">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
      <!-- </el-header> -->
      <el-main style="padding:20px 0">
        <el-table :key='tableKey' :data="tableData" height="200" row-key="id" v-loading="listLoading" 
          border fit highlight-current style="width: 100%;margin-top:10px;min-height:500px" 
          :header-cell-style="{background:'oldlace'}">
          <el-table-column align="center" label="单据编码">
            <template slot-scope="scope">
              <span class="look-detail" @click="handleDetail(scope.row)">{{scope.row.documentWordCode}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="供应商">
            <template slot-scope="scope">
              <span>{{scope.row.supplier}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="设备名称" >
            <template slot-scope="scope">
              <span>{{scope.row.equipmentName}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="设备号">
            <template slot-scope="scope">
              <span>{{scope.row.equipmenCode}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="出厂编号" >
            <template slot-scope="scope">
              <span>{{scope.row.serialNumber}}</span>
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
          <el-table-column align="center" label="送货单号" >
            <template slot-scope="scope">
              <span>{{scope.row.deliveryCode}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="安装完成时间" >
            <template slot-scope="scope">
              <span>{{scope.row.installDate}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="安装情况" >
            <template slot-scope="scope">
              <span>{{scope.row.installSituation==1?"已安装":"未安装"}}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button title="生成设备质量信息报告" type="primary" size="mini" icon="el-icon-document" @click="createQuality(scope.row)"
              :disabled="scope.row.createDisabled?true:false"></el-button>
            </template>
          </el-table-column> -->
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
      <el-dialog title="安装完成确认单" :close-on-click-modal="false" :visible.sync="dialogFormVisible" width="60%" v-dialogDrag v-loading="listLoading"> 
        <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="120px">
          <el-form-item>
            <span class="equip-title">安装完成确认单</span>
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="单据编码" prop="documentWordCode">
                <el-input v-model="temp.documentWordCode" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="供应商" prop="supplier"  >
                <el-input v-model="temp.supplier" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="设备名称" prop="equipmentName">
                <el-input v-model="temp.equipmentName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设备号" prop="equipmenCode">
                <el-input v-model="temp.equipmenCode"></el-input>
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
              <el-form-item label="型号规格" prop="typeSpecification">
                <el-input v-model="temp.typeSpecification" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="固定资产编号" prop="fixedAssetCode">
                <el-input v-model="temp.fixedAssetCode" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="送货单号" prop="deliveryCode">
                <el-input v-model="temp.deliveryCode" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="安装完成时间" prop="installDate">
                <el-date-picker style="width:100%"
                  v-model="temp.installDate"
                  type="date"
                  placeholder="选择日期" disabled>
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="安装情况" prop="installSituation">
                <el-input v-model="temp.installSituation" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="1" style="width:1px;color:red;padding:8px;">
              <span>*</span>
            </el-col>
            <el-col :span="22">
              <el-form-item label="铭牌图片上传" prop="mpfileData">
                <div v-if="mpfileData.length>0" v-for="item in mpfileData" :key="item.id">
                  <span class="look-detail" @click="lookImage(item)">{{item.fileName}}</span>
                  <el-button title="下载" type="primary" size="mini" icon="el-icon-download" @click="imageDown(item)"></el-button>
                </div>
                <input accept="image/*" id="uploadImg" type="file" @change="imageUpload" v-if="installShow">
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="1" style="width:1px;color:red;padding:8px;">
              <span>*</span>
            </el-col>
            <el-col :span="9">
              <el-form-item label="操作规程" prop="czgcfileData">
                <input id="uploadImg1" type="file" @change="fileUpload1" v-if="installShow">
              </el-form-item>
            </el-col>
          </el-row>
          <el-table :data="czgcfileData"
            border fit highlight-current style="width: 600px; margin-left:100px;">
            <el-table-column align="center" label="文件名" width="448px">
              <template slot-scope="scope">
                <span style="cursor:pointer;text-decoration:underline " @click="handlePreview(scope.row)">{{scope.row.fileName}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="150">
              <template slot-scope="scope">
                <el-button title="下载" type="primary" size="mini" icon="el-icon-download" @click="fileDown(scope.row)"></el-button>
                <el-button v-if="installShow" title="删除" type="danger" icon="el-icon-delete" size="mini" 
                @click="fileDelete1(scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row style="margin-top:10px">
            <el-col :span="1" style="width:1px;color:red;padding:8px;">
              <span>*</span>
            </el-col>
            <el-col :span="9">
              <el-form-item label="使用说明书" prop="sysmsfileData">
                <input id="uploadImg2" type="file" @change="fileUpload2" v-if="installShow">
              </el-form-item>
            </el-col>
          </el-row>
          <el-table :data="sysmsfileData"
            border fit highlight-current style="width:600px; margin-left:100px;">
            <el-table-column align="center" label="文件名" width="448px">
              <template slot-scope="scope">
                <span style="cursor:pointer;text-decoration:underline " @click="handlePreview(scope.row)">{{scope.row.fileName}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="150px">
              <template slot-scope="scope">
                <el-button title="下载" type="primary" size="mini" icon="el-icon-download" @click="fileDown(scope.row)"></el-button>
                <el-button v-if="installShow" title="删除" type="danger" icon="el-icon-delete" size="mini" 
                @click="fileDelete2(scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
        <el-dialog :close-on-click-modal="false" title="预览图片" :visible.sync="lookDialogVisible" append-to-body>
          <div id="lookImg">
            <img id="lookPic" :src="imageData"/>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="lookDialogVisible = false">取消</el-button>
          </div>
        </el-dialog>
        <el-form class="formDw">
          <el-form-item>
            <el-button @click="dialogFormVisible = false" type="primary">返回</el-button>
            <el-button v-if="installShow" type="primary" @click="installFinish">确认安装完成</el-button>
          </el-form-item>
        </el-form>
      </el-dialog> 
      <el-dialog title="提示" :close-on-click-modal="false" :visible.sync="centerDialogVisible" width="30%">
        <span>请制作设备操作规程，维护保养标准</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="centerDialogVisible=false">确定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="提示" :close-on-click-modal="false" :visible.sync="qualityDialog" width="30%">
        <span>已生成设备质量信息报告，请到设备质量信息报告页面处理</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="qualityDialog=false">确定</el-button>
        </span>
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
import { fetchList, getDetail, updateInstallFinish, createQualityReport } from '@/api/equipMent/installComplete'
import { uploadlist, insertFile, fileList, deleteFileById, getCurrentUser } from '@/api/common/common'
import { baseUrl } from '@/api/common/fileBaseUrl'
export default {
  name: 'installComplete',
  data() {
    return {
      // 表格数据
      tableKey: 0,
      listLoading: false,
      tableData: [],
      total: null,
      value01: undefined,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        equipmentName: undefined,
        fixedAssetCode: undefined,
        installFinishDateStart: undefined,
        installFinishDateEnd: undefined,
        installType: undefined
      },
      id: undefined,
      installShow: undefined,
      isCreateQualityExport: undefined, // 是否生成报告
      temp: {
        id: undefined,
        documentWordCode: undefined,
        supplier: undefined,

        equipmentName: undefined,
        equipmenCode: undefined,

        serialNumber: undefined,
        typeSpecification: undefined,

        fixedAssetCode: undefined,
        deliveryCode: undefined,

        installDate: undefined,
        installSituation: undefined
      },
      dialogFormVisible: false,
      centerDialogVisible: false,
      qualityDialog: false,
      lookDialogVisible: false, // 预览图片
      imageData: null,
      // 文件
      chooseShow: true,
      mpfileData: [],
      czgcfileData: [],
      sysmsfileData: [],
      documentWordCode: undefined, // 单据编码
      userId: undefined, // 用户id

      rules: {
        documentWordCode: [{ required: true, message: '请输入单据编码', trigger: 'change' }],
        supplier: [{ required: true, message: '请输入供应商', trigger: 'change' }],

        equipmentName: [{ required: true, message: '请输入设备名称', trigger: 'change' }],
        equipmenCode: [{ required: true, message: '请输入设备号', trigger: 'change' }],

        typeSpecification: [{ required: true, message: '请输入型号规格', trigger: 'change' }],
        serialNumber: [{ required: true, message: '请输入出厂编号', trigger: 'change' }],

        fixedAssetCode: [{ required: true, message: '请输入固定资产编号', trigger: 'change' }],
        deliveryCode: [{ required: true, message: '请输入送货单号', trigger: 'change' }]
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
            if (this.tableData[i].installSituation == 0) {
              this.tableData[i].createDisabled = true
            } else if (this.tableData[i].installSituation == 1 && this.tableData[i].isCreateQualityExport == 1) {
              this.tableData[i].createDisabled = true
            } else if (this.tableData[i].installSituation == 1 && this.tableData[i].isCreateQualityExport == 0) {
              this.tableData[i].createDisabled = false
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
        }
      })
    },
    // 日期搜索
    searchChange() {
      // 日期转换
      if (this.value01 == null) {
        this.listQuery.installFinishDateStart = ''
        this.listQuery.installFinishDateEnd = ''
      } else {
        this.listQuery.installFinishDateStart = this.value01[0]// 开始时间
        this.listQuery.installFinishDateEnd = this.value01[1]
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
      this.mpfileData = []
      this.czgcfileData = []
      this.sysmsfileData = []
      this.id = row.id
      this.documentWordCode = row.documentWordCode
      getDetail(this.id).then(response => {
        if (response.data.code == 200) {
          this.temp = Object.assign({}, response.data.data)
          if (this.temp.installSituation == 1) {
            this.temp.installSituation = '已安装'
            this.installShow = false
          } else {
            this.temp.installSituation = '未安装'
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
      this.dialogFormVisible = true
      this.getUser()
      this.getFileList() // 获取文件信息
    },
    // 获取当前用户信息
    getUser() {
      getCurrentUser().then(response => {
        this.userId = response.data.data.id
      })
    },
    // 点击安装完成
    installFinish() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.czgcfileData.length == 0 || this.sysmsfileData.length == 0 || this.mpfileData.length == 0) {
            this.$notify({
              title: '警告',
              message: '请上传相关附件',
              type: 'warning',
              duration: 2000
            })
            return
          }
          this.dialogFormVisible = false
          this.listLoading = true
          const find = {
            id: this.id,
            installSituation: 1,
            equipmenCode: this.temp.equipmenCode
          }
          updateInstallFinish(find).then(response => {
            if (response.data.code == 200) {
              this.listLoading = false
              // this.centerDialogVisible = true
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
        }
      })
    },
    // 生成质量信息报告
    createQuality(row) {
      this.listLoading = true
      const id = row.id
      createQualityReport(id).then(response => {
        if (response.data.code === 200) {
          this.qualityDialog = true
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
        }
      })
    },
    // 文件上传
    fileUpload1(e) {
      const file = e.target.files[0]
      const fileData1 = {
        attachmentCode: 'AZWCQRDCZGC',
        code: this.documentWordCode,
        moduleType: '3',
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
            insertFile(fileData1).then(response => {
              if (response.data.code == 200) {
                fileData1.id = response.data.data
                this.czgcfileData.push(fileData1)
                this.$message({
                  title: '成功',
                  message: '上传成功',
                  type: 'success',
                  duration: 2000
                })
              }
            })
            setTimeout(() => {
              this.listLoading = false
            }, 1 * 500)
          } else if (resp.data.code === 402) {
            this.$notify({
              title: '警告',
              message: resp.data.msg,
              type: 'warning',
              duration: 2000
            })
          } else {
            this.$notify({
              title: '警告',
              message: '上传失败',
              type: 'warning',
              duration: 2000
            })
          }
          this.listLoading = false
          const fileInput = document.getElementById('uploadImg1')
          fileInput.value = ''
        })
      }
    },
    fileUpload2(e) {
      const file = e.target.files[0]
      const fileData1 = {
        attachmentCode: 'AZWCQRDSYSMS',
        code: this.documentWordCode,
        moduleType: '3',
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
          if (resp.data.code === 200) {
            fileData1.filePath = resp.data.data.remoteFilename
            fileData1.fileUrl = resp.data.data.fileUrl
            insertFile(fileData1).then(response => {
              if (response.data.code == 200) {
                fileData1.id = response.data.data
                this.sysmsfileData.push(fileData1)
                this.$message({
                  title: '成功',
                  message: '上传成功',
                  type: 'success',
                  duration: 2000
                })
              }
            })
            setTimeout(() => {
              this.listLoading = false
            }, 1 * 500)
          } else if (resp.data.code === 402) {
            this.$notify({
              title: '警告',
              message: resp.data.msg,
              type: 'warning',
              duration: 2000
            })
          } else {
            this.$notify({
              title: '警告',
              message: '上传失败',
              type: 'warning',
              duration: 2000
            })
          }
          this.listLoading = false
          const fileInput1 = document.getElementById('uploadImg2')
          fileInput1.value = ''
        })
      }
    },
    imageUpload(e) {
      const file = e.target.files[0]
      const fileData1 = {
        attachmentCode: 'MPTPSCFJ',
        code: this.documentWordCode,
        moduleType: '17',
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
            insertFile(fileData1).then(response => {
              if (response.data.code == 200) {
                fileData1.id = response.data.data
                this.mpfileData = []
                this.mpfileData.push(fileData1)
                this.$message({
                  title: '成功',
                  message: '上传成功',
                  type: 'success',
                  duration: 2000
                })
              }
            })
            setTimeout(() => {
              this.listLoading = false
            }, 1 * 500)
          } else if (resp.data.code === 402) {
            this.$notify({
              title: '警告',
              message: resp.data.msg,
              type: 'warning',
              duration: 2000
            })
          } else {
            this.$notify({
              title: '警告',
              message: '上传失败',
              type: 'warning',
              duration: 2000
            })
          }
          this.listLoading = false
          const fileInput = document.getElementById('uploadImg')
          fileInput.value = ''
        })
      }
    },
    // 获取文件列表
    getFileList() {
      const find = {
        moduleType: '3', // 模块类别
        attachmentCode: 'AZWCQRDCZGC', // 附件编码
        documentWordCode: this.documentWordCode // 单据编码
      }
      fileList(find).then(response => {
        this.czgcfileData = response.data.data
      })
      const find1 = {
        moduleType: '3', // 模块类别
        attachmentCode: 'AZWCQRDSYSMS', // 附件编码
        documentWordCode: this.documentWordCode // 单据编码
      }
      fileList(find1).then(response => {
        this.sysmsfileData = response.data.data
      })
      const find2 = {
        moduleType: '17', // 模块类别
        attachmentCode: 'MPTPSCFJ', // 附件编码
        documentWordCode: this.documentWordCode // 单据编码
      }
      fileList(find2).then(response => {
        if (response.data.data.length !== 0) {
          var length = response.data.data.length - 1
          this.mpfileData = []
          this.mpfileData.push(response.data.data[length])
        }
      })
    },
    // 文件下载
    fileDown(row) {
      if (this.installShow == true && row.fileUrl !== undefined) {
        window.location.href = row.fileUrl + '?attname=' + row.fileName
      } else {
        window.location.href = row.filePath + '?attname=' + row.fileName
      }
    },
    imageDown(item) {
      if (this.installShow == true && item.fileUrl !== undefined) {
        window.location.href = item.fileUrl + '?attname=' + item.fileName
      } else {
        window.location.href = item.filePath + '?attname=' + item.fileName
      }
    },
    lookImage(item) {
      this.imageData = null
      this.lookDialogVisible = true
      if (this.installShow == true && item.fileUrl !== undefined) {
        this.imageData = item.fileUrl
      } else {
        this.imageData = item.filePath
      }
    },
    // 文件删除
    fileDelete1(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const id = row.id
        deleteFileById(id).then(response => {
          if (response.data.code === 200) {
            const index = this.czgcfileData.indexOf(row)
            this.czgcfileData.splice(index, 1)
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    fileDelete2(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const id = row.id
        deleteFileById(id).then(response => {
          if (response.data.code === 200) {
            const index = this.sysmsfileData.indexOf(row)
            this.sysmsfileData.splice(index, 1)
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
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
  /* margin-bottom: 15px; */
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
#lookPic {
  width: 100%;
} 
</style>

