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
          <el-form-item label="安装情况" prop="installationSituation">
            <el-radio v-model="listQuery.installationSituation" label="0">未安装</el-radio>
            <el-radio v-model="listQuery.installationSituation" label="1">已安装</el-radio>	
            <el-radio v-model="listQuery.installationSituation" label="">全部</el-radio>
          </el-form-item>
          <el-form-item>
            <el-button class="filter-item" type="primary" style="float:right"  icon="el-icon-search" @click="handleFilter">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-main style="padding:20px 0">
        <el-button class="filter-item" @click="handleCreate" type="primary" v-if="addShow">新增</el-button>
        <el-table :key='tableKey' :data="tableData" height="200" row-key="id" v-loading="listLoading" 
          border fit highlight-current style="width: 100%;margin-top:10px;min-height:500px" 
          :header-cell-style="{background:'oldlace'}">
          <el-table-column align="center" label="单据编码">
            <template slot-scope="scope">
              <span class="look-detail" @click="handleDetail(scope.row)">{{scope.row.formCode}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="supplier" align="center" label="改造供应商">
          </el-table-column>
          <el-table-column prop="reformCode" align="center" label="改造记录编号">
          </el-table-column>
          <el-table-column prop="equipmentName" align="center" label="设备名称" >
          </el-table-column>
          <el-table-column prop="fixedAssetCode" align="center" label="固定资产编号" >
          </el-table-column>
          <el-table-column prop="typeSpecification" align="center" label="型号规格" >
          </el-table-column>
           <el-table-column prop="context" align="center" label="改造内容" >
          </el-table-column>
          <el-table-column prop="installationCompleted" align="center" label="安装完成时间">
            <template slot-scope="scope">
              <span>{{scope.row.installationCompleted!=null?scope.row.installationCompleted.substring(0,10):''}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="安装情况" >
            <template slot-scope="scope">
              <span>{{scope.row.installationSituation==1?"已安装":"未安装"}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="140px" fixed="right">
            <template slot-scope="scope">
              <el-button title="编辑" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-if="editShow" 
              :disabled="scope.row.editDisabled?true:false"></el-button>
              <el-button title="删除" type="danger" icon="el-icon-delete" size="mini"  @click="deleteBtn(scope.row)" v-if="deleteShow" 
              :disabled="scope.row.deleteDisabled?true:false"></el-button>
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
      <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" :visible.sync="dialogFormVisible" width="60%" v-dialogDrag v-loading="listLoading"> 
        <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="120px">
          <el-form-item>
            <span class="equip-title">改造安装完成确认单</span>
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="单据编码" prop="formCode">
                <el-input v-model="temp.formCode" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="改造供应商" prop="supplier"  >
                <el-input v-model="temp.supplier" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="改造记录编号" prop="reformCode">
                <el-input v-model="temp.reformCode" disabled></el-input>
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
              <el-form-item label="固定资产编号" prop="fixedAssetCode">
                <el-input v-model="temp.fixedAssetCode" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="型号规格" prop="typeSpecification">
                <el-input v-model="temp.typeSpecification" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="改造内容" prop="context">
                <el-input type="textarea" v-model="temp.context" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="安装完成时间" prop="installationCompleted">
                <el-date-picker style="width:100%"
                  v-model="temp.installationCompleted"
                  type="date"
                  placeholder="选择日期" disabled>
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="安装情况" prop="installationSituation">
                <el-input v-model="temp.installationSituation" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="margin-top:10px">
            <el-col :span="10">
              <el-form-item label="改造说明书附件">
                <input id="uploadImg2" type="file" @change="fileUpload2" v-if="chooseShow">
              </el-form-item>
            </el-col>
          </el-row>
          <el-table :data="gzsmsfileData"
            border fit highlight-current style="width:600px; margin-left:100px;">
            <el-table-column align="center" label="文件名" width="448px">
              <template slot-scope="scope">
                <span class="look-detail"  @click="handlePreview(scope.row)">{{scope.row.fileName}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="150px">
              <template slot-scope="scope">
                <el-button title="下载" type="primary" size="mini" icon="el-icon-download" @click="fileDown(scope.row)"></el-button>
                <el-button v-if="chooseShow" title="删除" type="danger" icon="el-icon-delete" size="mini" 
                @click="fileDelete2(scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
        <el-form class="formDw">
          <el-form-item>
            <el-button @click="dialogFormVisible = false" type="primary">返回</el-button>
            <el-button v-if="chooseShow" type="primary" @click="saveData">保存</el-button>
            <el-button v-if="chooseShow" type="primary" @click="installFinish">确认完成</el-button>
            <el-button v-if="dialogStatus=='create'" type="primary" @click="quoteEquip">引用改造备案记录一览表</el-button>
          </el-form-item>
        </el-form>
        <el-dialog width="40%" title="选择发起组织" :visible.sync="changeOrgVisible" append-to-body :close-on-click-modal="false" v-dialogDrag >
          <el-container>
            <el-aside style="width:100%">
            <span style="font-weight:800">当前登录用户所在组织：{{comName}}</span>
            <el-form>
              <el-form-item>
              <el-select v-model="temp.proxyOrgName" clearable  placeholder="请选择组织" @change='proxyOrgChange' style="width:100%">
                <el-option
                  v-for="item in proxyOrgList"
                  :key="item.orgCode"
                  :label="item.orgName"
                  :value="item.orgName">
                </el-option>
              </el-select>
              </el-form-item>
            </el-form>
            </el-aside>
          </el-container>
          <div slot="footer" class="dialog-footer">
            <el-button @click="changeOrgVisible = false" type="default">取消</el-button>
            <el-button type="primary" @click="changeOrgOk">确定</el-button>
          </div>
        </el-dialog>
      </el-dialog>
      <el-dialog title="选择设备" :visible.sync="equipDialogVisible" width="80%" :close-on-click-modal="false" v-dialogDrag>
        <el-form :inline="true">
          <el-form-item label="设备名称">
            <el-input class="filter-item input" v-model="listQuery1.equipmentName">
            </el-input>
          </el-form-item>
          <el-form-item label="固定资产编号">
            <el-input class="filter-item input" v-model="listQuery1.fixedAssetCode">
            </el-input>
          </el-form-item>
          <el-form-item label="型号规格">
            <el-input class="filter-item input" v-model="listQuery1.typeSpecification">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="filter-item" type="primary" style="float:right" icon="el-icon-search" @click="handleFilter1">搜索</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="infoList" height="500" v-loading="listLoading" 
          ref="multipleTable" border fit highlight-current-row
          @select="handleSelect" class="checkboxNoShow">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" label="序号" min-width="80" type="index"></el-table-column>
          <el-table-column prop="equipmentName" align="center" label="设备名称" min-width="80">
          </el-table-column>
          <el-table-column prop="fixedAssetCode" align="center" label="固定资产编号" min-width="80">
          </el-table-column>
          <el-table-column prop="typeSpecification" align="center" label="型号规格" >
          </el-table-column>
          <el-table-column prop="companyName " align="center" label="使用公司" min-width="80">
          </el-table-column>
          <el-table-column prop="factoryName" align="center" label="使用工厂" min-width="80">
          </el-table-column>
          <el-table-column prop="divisionName" align="center" label="使用部门" min-width="80">
          </el-table-column>
          <el-table-column prop="formCode" align="center" label="改造记录编号" min-width="100">
          </el-table-column>
          <el-table-column prop="recordCode" align="center" label="改造备案单号" min-width="100">
          </el-table-column>
          <el-table-column prop="projectInsideName" align="center" label="项目内部名称" min-width="80">
          </el-table-column>
          <el-table-column prop="projectExternalName" align="center" label="项目外部名称" min-width="80">
          </el-table-column>
          <el-table-column prop="suggestName" align="center" label="设备改造建议" min-width="80">
          </el-table-column>
          <el-table-column prop="context" align="center" label="改造具体内容" min-width="80">
          </el-table-column>
          <el-table-column prop="supplier" align="center" label="改造供应商" min-width="80">
          </el-table-column>
          <el-table-column prop="priceShouldFinishTime" align="center" label="定价应完成时间" min-width="80">
          </el-table-column>
          <el-table-column prop="priceFinishTime" align="center" label="定价实际完成时间" min-width="80">
          </el-table-column>
          <el-table-column prop="transferTime" align="center" label="资料移交招标组时间" min-width="80">
          </el-table-column>
          <el-table-column prop="invoiceNumber" align="center" label="发票信息" min-width="80">
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
        <div slot="footer" class="dialog-footer">
          <el-button @click="equipDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="importOk">确定</el-button>
        </div>
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
import { fetchList, createData, updateData, delById, getDetail, fetchInfoList } from '@/api/equipRemould/remouldInstallComplete'
import { uploadlist, insertFile, fileList, deleteFile, deleteFileById, getCurrentUser, getProxyOrgList } from '@/api/common/common'
import { fetchButton } from '@/api/common/button'
import { menuList } from '@/store/modules/permission'// 按钮权限
import { baseUrl } from '@/api/common/fileBaseUrl'
export default {
  name: 'remouldInstallComplete',
  data() {
    return {
      // 代理组织
      userCode: undefined, // 用户编码
      changeOrgVisible: undefined,
      proxyOrgList: [],
      comName: undefined,
      comCode: undefined,
      // 判断按钮权限显示隐藏
      menuCode: undefined,
      addShow: false,
      editShow: false,
      deleteShow: false,
      chooseShow: true, // 选择按钮
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
        installationCompletedStart: undefined,
        installationCompletedEnd: undefined,
        installationSituation: undefined
      },
      // 选择设备名称
      equipDialogVisible: false,
      infoList: [],
      total1: null,
      listQuery1: {
        pageNum: 1,
        pageSize: 10,
        equipmentName: undefined,
        fixedAssetCode: undefined,
        typeSpecification: undefined
      },
      // 选中的导入信息
      selectionArr: [],
      multipleSelection: null,
      checkedIndex: '',
      equipIndex: 0,
      id: undefined,
      temp: {
        id: undefined,
        formCode: undefined,
        supplier: undefined,
        reformCode: undefined,
        equipmentName: undefined,
        equipmentCode: undefined,
        typeSpecification: undefined,
        fixedAssetCode: undefined,
        context: undefined,
        installationCompleted: undefined,
        installationSituation: undefined,
        fList: [],
        proxyOrgCode: undefined, // 代理组织
        proxyOrgName: undefined
      },
      insertType: undefined,
      updateType: undefined,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增',
        detail: '查看'
      },
      // 文件
      gzsmsfileData: [],
      documentWordCode: undefined, // 单据编码
      userId: undefined, // 用户id

      rules: {
        formCode: [{ required: false, message: '请输入单据编码', trigger: 'change' }],
        supplier: [{ required: true, message: '请输入改造供应商', trigger: 'change' }],

        equipmentName: [{ required: true, message: '请输入设备名称', trigger: 'change' }],
        reformCode: [{ required: true, message: '请输入改造记录编号', trigger: 'change' }],

        typeSpecification: [{ required: true, message: '请输入型号规格', trigger: 'change' }],
        fixedAssetCode: [{ required: true, message: '请输入固定资产编号', trigger: 'change' }],
        context: [{ required: true, message: '请输入改造内容', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
    this.getButton()
  },
  methods: {
    // ******* 文件预览**********
    handlePreview(row) {
      var url = baseUrl + 'onlinePreview?url=' + encodeURIComponent(row.filePath)
      var winHeight = window.document.documentElement.clientHeight - 10
      window.open(url, '_blank', 'height=' + winHeight + ',top=80,left=80,toolbar=no, menubar=no, scrollbars=yes, resizable=yes')
    },
    // ******* 文件预览结束**********
    getButton() {
      menuList.forEach(item => {
        item.children.forEach(e => {
          if (e.name == 'remouldInstallComplete') {
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
            if (getBtns[i].buttonName == '新增') {
              this.addShow = true
            } else if (getBtns[i].buttonName == '编辑') {
              this.editShow = true
            } else if (getBtns[i].buttonName == '删除') {
              this.deleteShow = true
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
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        if (response.data.code === 200) {
          this.tableData = response.data.data.list
          for (var i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].installationSituation == 0) {
              this.tableData[i].editDisabled = false
              this.tableData[i].deleteDisabled = false
            } else {
              this.tableData[i].editDisabled = true
              this.tableData[i].deleteDisabled = true
            }
          }
          this.total = response.data.data.total
        } else {
          this.$notify({
            title: '警告',
            message: response.data.msg,
            type: 'warning',
            duration: 2000
          })
        }
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 500)
      })
    },
    // 日期搜索
    searchChange() {
      // 日期转换
      if (this.value01 == null) {
        this.listQuery.installationCompletedStart = ''
        this.listQuery.installationCompletedEnd = ''
      } else {
        this.listQuery.installationCompletedStart = this.value01[0]// 开始时间
        this.listQuery.installationCompletedEnd = this.value01[1]
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
    // 设备名称选择
    quoteEquip() {
      this.equipDialogVisible = true
      this.listQuery1 = {
        pageNum: 1,
        pageSize: 10,
        equipmentName: undefined,
        fixedAssetCode: undefined,
        typeSpecification: undefined
      }
      this.getInfoList()
    },
    // 弹框页面表格加载
    getInfoList() {
      this.multipleSelection = ''
      this.checkedIndex = ''
      this.listLoading = true
      fetchInfoList(this.listQuery1).then(response => {
        if (response.data.code === 200) {
          if (response.data.data != null && response.data.data.list != null) {
            this.infoList = response.data.data.list
            this.total1 = response.data.data.total
            for (var i = 0; i < this.infoList.length; i++) {
              if (this.infoList[i].suggest == 1) {
                this.infoList[i].suggestName = '外部'
              } else if (this.infoList[i].suggest == 0) {
                this.infoList[i].suggestName = '内部'
              }
            }
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
    // 弹框表格被选择
    handleSelect(val, row) {
      if (val.length > 1) {
        this.$refs.multipleTable.clearSelection() // 清空所有选择
        val.shift()
        this.$refs.multipleTable.toggleRowSelection(row) //  选中当前选择
      }
      this.selectionArr = val
      this.multipleSelection = row
      this.checkedIndex = val.length
    },
    // 引入确认
    importOk() {
      if (this.checkedIndex != 1) {
        this.$message({
          title: '警告',
          message: '请选择一条要引用的信息',
          type: 'warning',
          duration: 2000
        })
        return
      }
      this.equipDialogVisible = false
      this.temp.supplier = this.multipleSelection.supplier
      this.temp.reformCode = this.multipleSelection.formCode
      this.temp.equipmentName = this.multipleSelection.equipmentName
      this.temp.equipmentCode = this.multipleSelection.equipmentCode
      this.temp.fixedAssetCode = this.multipleSelection.fixedAssetCode
      this.temp.typeSpecification = this.multipleSelection.typeSpecification
      this.temp.context = this.multipleSelection.context
    },
    // 删除
    deleteBtn(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const find3 = {
          id: row.id
        }
        delById(find3).then(response => {
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
    // 根据编号查看
    handleDetail(row) {
      this.dialogStatus = 'detail'
      this.gzsmsfileData = []
      this.chooseShow = false
      this.documentWordCode = row.formCode
      const find = {
        id: row.id
      }
      getDetail(find).then(response => {
        if (response.data.code == 200) {
          this.temp = Object.assign({}, response.data.data)
          if (this.temp.installationSituation == 1) {
            this.temp.installationSituation = '已安装'
          } else {
            this.temp.installationSituation = '未安装'
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
      this.getFileList() // 获取文件信息
    },
    // 获取当前用户信息
    getUser() {
      // 获取当前用户信息
      getCurrentUser().then(response => {
        if (response.data.code == 200) {
          this.userId = response.data.data.id
          this.userCode = response.data.data.userCode
          if (this.dialogStatus == 'create') {
            getProxyOrgList(this.userCode).then(response => {
              if (response.data.code == 200) {
                this.proxyOrgList = []
                this.comName = response.data.data.orgName
                this.comCode = response.data.data.orgCode
                if (this.proxyOrgList != null) {
                  this.proxyOrgList = response.data.data.list
                }
              }
            })
          }
        }
      })
    },
    proxyOrgChange() {
      this.proxyOrgList.forEach(item => {
        if (item.orgName == this.temp.proxyOrgName) {
          this.temp.proxyOrgCode = item.orgCode
        }
      })
    },
    changeOrgOk() {
      if (this.temp.proxyOrgName == undefined || this.temp.proxyOrgName == '' || this.temp.proxyOrgName == null) {
        this.temp.proxyOrgCode = this.comCode
        if (this.dialogStatus == 'create') {
          this.createSave()
        } else if (this.dialogStatus == 'update') {
          this.updateSaveData()
        }
      } else {
        if (this.dialogStatus == 'create') {
          this.createSave()
        } else if (this.dialogStatus == 'update') {
          this.updateSaveData()
        }
      }
      this.changeOrgVisible = false
    },
    // 获取文件列表
    getFileList() {
      const find1 = {
        moduleType: '21', // 模块类别
        attachmentCode: 'SBGZAZWCQRDFJ', // 附件编码
        documentWordCode: this.documentWordCode // 单据编码
      }
      fileList(find1).then(response => {
        this.gzsmsfileData = response.data.data
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        formCode: undefined,
        supplier: undefined,
        reformCode: undefined,
        equipmentName: undefined,
        equipmentCode: undefined,
        typeSpecification: undefined,
        fixedAssetCode: undefined,
        context: undefined,
        installationCompleted: undefined,
        installationSituation: undefined,
        fList: [],
        proxyOrgCode: undefined, // 代理组织
        proxyOrgName: undefined
      }
      this.gzsmsfileData = []
      this.documentWordCode = ''
      this.userId = undefined
    },
    // 新增
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.chooseShow = true
      this.getUser()
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 保存
    saveData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.dialogStatus == 'create') {
            this.insertType = 1
            if (this.proxyOrgList.length != 0) {
              this.changeOrgVisible = true
            } else {
              this.temp.proxyOrgCode = this.comCode
              this.createSave()
            }
          } else if (this.dialogStatus == 'update') {
            this.updateType = 1
            this.updateSaveData()
          }
        }
      })
    },
    // 安装完成
    installFinish() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.dialogStatus == 'create') {
            this.insertType = 2
            if (this.proxyOrgList.length != 0) {
              this.changeOrgVisible = true
            } else {
              this.temp.proxyOrgCode = this.comCode
              this.createSave()
            }
          } else if (this.dialogStatus == 'update') {
            this.updateType = 2
            this.updateSaveData()
          }
        }
      })
    },
    // 新增请求
    createSave() {
      this.listLoading = true
      if (this.temp.installationSituation == '已安装') {
        this.temp.installationSituation = 1
      } else if (this.temp.installationSituation == '未安装') {
        this.temp.installationSituation = 0
      }
      this.temp.fList = this.gzsmsfileData
      createData(this.insertType, this.temp).then(response => {
        if (response.data.code == 200) {
          this.dialogFormVisible = false
          setTimeout(() => {
            this.listLoading = false
          }, 1 * 500)
          this.$message({
            title: '成功',
            message: '请求成功',
            type: 'success',
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
          this.listLoading = false
        }
      })
    },
    // 编辑
    handleUpdate(row) {
      this.dialogStatus = 'update'
      this.chooseShow = true
      this.dialogFormVisible = true
      this.documentWordCode = row.formCode
      // 根据id获取详情
      const find4 = {
        id: row.id
      }
      getDetail(find4).then(response => {
        this.temp = Object.assign({}, response.data.data)
        if (this.temp.installationSituation == 1) {
          this.temp.installationSituation = '已安装'
        } else if (this.temp.installationSituation == '0') {
          this.temp.installationSituation = '未安装'
        }
      })
      this.getUser()
      this.getFileList() // 获取文件
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 修改请求
    updateSaveData() {
      this.listLoading = true
      if (this.temp.installationSituation == '已安装') {
        this.temp.installationSituation = 1
      } else if (this.temp.installationSituation == '未安装') {
        this.temp.installationSituation = 0
      }
      const tempData = Object.assign({}, this.temp)
      updateData(this.updateType, tempData).then(response => {
        if (response.data.code == 200) {
          this.dialogFormVisible = false
          this.getList()
          setTimeout(() => {
            this.listLoading = false
          }, 1 * 500)
          this.$message({
            title: '成功',
            message: '请求成功',
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
    },
    // 上传文件
    fileUpload2(e) {
      const file = e.target.files[0]
      const fileData1 = {
        attachmentCode: 'SBGZAZWCQRDFJ',
        code: this.documentWordCode,
        moduleType: '21',
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
            if (this.dialogStatus == 'update') {
              insertFile(fileData1).then(response => {
                if (response.data.code == 200) {
                  fileData1.id = response.data.data
                  this.gzsmsfileData.push(fileData1)
                  this.$message({
                    title: '成功',
                    message: '上传成功',
                    type: 'success',
                    duration: 2000
                  })
                }
              })
            } else if (this.dialogStatus == 'create') {
              this.gzsmsfileData.push(fileData1)
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
    // 文件下载
    fileDown(row) {
      if (row.fileUrl !== undefined) {
        window.location.href = row.fileUrl + '?attname=' + row.fileName
      } else {
        window.location.href = row.filePath + '?attname=' + row.fileName
      }
    },
    fileDelete2(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 新增时删除
        if (this.dialogStatus == 'create') {
          const find2 = {
            fileName: row.filePath
          }
          deleteFile(find2).then(response => {
            if (response.data.code === 200) {
              const index = this.gzsmsfileData.indexOf(row)
              this.gzsmsfileData.splice(index, 1)
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
              const index = this.gzsmsfileData.indexOf(row)
              this.gzsmsfileData.splice(index, 1)
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
	right: 25px;
	top: 45px;
}
#lookPic {
  width: 100%;
} 
</style>

