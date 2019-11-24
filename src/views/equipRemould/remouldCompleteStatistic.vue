<template>
  <div class='app-container'>
    <el-container>
      <div class="formSearch">
        <el-form :inline="true">
          <el-form-item label="设备名称">
            <el-input class="filter-item input" v-model="listQuery.equipmentName">
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
          <el-form-item label="申请时间">
            <el-date-picker
              v-model="value02"
              type="daterange"
              unlink-panels
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              clearable  @change="searchChange02()">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="固定资产编号">
            <el-input class="filter-item input" v-model="listQuery.fixedAssetCode">
            </el-input>
          </el-form-item>
          <el-form-item label="使用公司">
            <el-input v-model="listQuery.companyName" disabled>
              <el-button slot="append" @click="changeCompany">选择</el-button>
              <el-button slot="append" @click="deleteCompany">清空</el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="使用工厂">
            <el-input v-model="listQuery.factoryName" disabled>
              <el-button slot="append" @click="changeFactory">选择</el-button>
              <el-button slot="append" @click="deleteFactory">清空</el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="使用部门">
            <el-input v-model="listQuery.divisionName" disabled>
              <el-button slot="append" @click="changeDivision">选择</el-button>
              <el-button slot="append" @click="deleteDivision">清空</el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="安装情况" prop="installationSituation">
            <el-radio v-model="listQuery.installationSituation" label="0">未安装</el-radio>
            <el-radio v-model="listQuery.installationSituation" label="1">已安装</el-radio>	
          </el-form-item>
          <el-form-item>
            <el-button class="filter-item" type="primary" style="float:right;margin-left: 15px;" icon="el-icon-download" @click="handleExport">导出</el-button>
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
      <el-dialog title="改造安装完成确认单" :close-on-click-modal="false" :visible.sync="dialogFormVisible" width="60%" v-dialogDrag v-loading="listLoading"> 
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
              </template>
            </el-table-column>
          </el-table>
        </el-form>
        <el-form class="formDw">
          <el-form-item>
            <el-button @click="dialogFormVisible = false" type="primary">返回</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 选择公司/工厂 -->
      <el-dialog width="40%" :title="textMap1[dialogStatus1]" :visible.sync="companyVisible" :close-on-click-modal="false" v-dialogDrag >
        <el-container>
          <el-aside width="500px">
            <span style="margin-left:20px;color:red">{{getCompanyName}}</span>
            <el-tree 
              :data="companyData" 
              :props="defaultProps1" 
              node-key='orgCode' 
              @node-click="handleClick1" v-loading="diaLoading"></el-tree>
          </el-aside>
        </el-container>
        <div slot="footer" class="dialog-footer">
          <el-button @click="companyVisible = false" type="default">取消</el-button>
          <el-button v-if="dialogStatus1=='company'" type="primary" @click="handleClickCompany">确定</el-button>
          <el-button v-if="dialogStatus1=='factory'" type="primary" @click="handleClickFactory">确定</el-button>
        </div>
      </el-dialog>
      <!-- 选择使用部门 -->
      <el-dialog width="50%" title="选择使用部门" :visible.sync="divisionVisible" :close-on-click-modal="false" v-dialogDrag >
        <el-container>
          <el-aside width="500px">
            <span style="margin-left:20px;color:red">{{getOrgName}}</span>
            <el-tree 
              :data="orgData" 
              :props="defaultProps1"
              ref="orgTree"
              show-checkbox 
              node-key="orgCode"
              check-strictly
              @check-change="handleChange" v-loading="diaLoading"><!-- 当前节点变化时处理事件 -->
            </el-tree>
          </el-aside>
        </el-container>
        <div slot="footer" class="dialog-footer">
          <el-button @click="divisionVisible = false">取消</el-button>
          <el-button @click="handleClick2" type="primary">确定</el-button>
        </div>
      </el-dialog> 
    </el-container>
  </div>
</template>

<script>
import { fetchAllList, getDetail, fetchExportList } from '@/api/equipRemould/remouldInstallComplete'
import { fileList, fetchComTree, fetchChooseTree } from '@/api/common/common'
import { baseUrl } from '@/api/common/fileBaseUrl'
export default {
  name: 'index',
  data() {
    return {
      routMsg: '',
      value02: null,
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
        installationSituation: undefined,
        startDate: undefined,
        endDate: undefined,
        companyName: undefined,
        companyCode: undefined,
        factoryName: undefined,
        factoryCode: undefined,
        divisionCode: undefined,
        divisionName: undefined
      },
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
        fList: []
      },
      dialogFormVisible: false,
      // 文件
      gzsmsfileData: [],
      documentWordCode: undefined, // 单据编码
      // 公司（工厂）
      diaLoading: false,
      companyVisible: false,
      companyData: [],
      // 部门
      i: 0,
      divisionVisible: false,
      orgData: [],
      defaultProps1: {
        children: 'children',
        label: 'orgFullName'
      },
      getCompanyName: undefined,
      getCompanyCode: undefined,
      getOrgName: undefined,
      getOrgCode: undefined,
      dialogStatus1: '',
      textMap1: {
        company: '选择公司',
        factory: '选择工厂'
      },
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
    this.getRoutParams()
    this.getList()
  },
  methods: {
    // ******* 文件预览**********
    handlePreview(row) {
      var url = baseUrl + 'onlinePreview?url=' + encodeURIComponent(row.filePath)
      var winHeight = window.document.documentElement.clientHeight - 10
      window.open(url, '_blank', 'height=' + winHeight + ',top=80,left=80,toolbar=no, menubar=no, scrollbars=yes, resizable=yes')
    },
    // ******* 文件预览结束**********
    getList() {
      this.listLoading = true
      fetchAllList(this.listQuery).then(response => {
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
        }
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
    searchChange02() {
      // 日期转换
      if (this.value02 == null) {
        this.listQuery.startDate = ''
        this.listQuery.endDate = ''
      } else {
        this.listQuery.startDate = this.value02[0]// 开始时间
        this.listQuery.endDate = this.value02[1]
      }
    },
     // 获取处理路由
   	getRoutParams() {
      this.routMsg = this.$route.params.dataObj
      if (this.routMsg.checkStatus == 3) {
        this.listQuery.installationSituation = '1'
      } else if (this.routMsg.checkStatus == 4) {
        this.listQuery.installationSituation = '0'
      }
      this.listQuery.startDate = this.routMsg.startDate
      this.listQuery.endDate = this.routMsg.endDate
      if (this.listQuery.startDate != undefined && this.listQuery.startDate != '') {
        this.value02 = []
        this.value02.push(this.listQuery.startDate)
        this.value02.push(this.listQuery.endDate)
      }
    },
    // 搜索
    handleFilter() {
      if (this.listQuery.companyName == '' || this.listQuery.companyName == undefined) {
        this.listQuery.companyCode = ''
      }
      if (this.listQuery.factoryName == '' || this.listQuery.factoryName == undefined) {
        this.listQuery.factoryCode = ''
      }
      if (this.listQuery.divisionName == '' || this.listQuery.divisionName == undefined) {
        this.listQuery.divisionCode = ''
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
    // 公司/工厂树被选择
    handleClick1(data) {
      this.getCompanyName = data.orgFullName
      this.getCompanyCode = data.orgCode
    },
    // 选择使用公司
    changeCompany() {
      this.dialogStatus1 = 'company'
      this.getCompanyCode = undefined
      this.getCompanyName = undefined
      this.companyVisible = true
      this.diaLoading = true
      this.companyData = []
      fetchComTree().then(response => {
        if (response.data.code === 200) {
          this.companyData.push(response.data.data)
        }
        this.diaLoading = false
      })
    },
    deleteCompany() {
      this.listQuery.companyName = undefined
      this.listQuery.companyCode = undefined
    },
    deleteFactory() {
      this.listQuery.factoryName = undefined
      this.listQuery.factoryCode = undefined
    },
    // 选择公司确认
    handleClickCompany() {
      this.listQuery.companyName = this.getCompanyName
      this.listQuery.companyCode = this.getCompanyCode
      this.companyVisible = false
    },
    // 选择使用工厂
    changeFactory() {
      this.dialogStatus1 = 'factory'
      this.getCompanyCode = undefined
      this.getCompanyName = undefined
      this.companyVisible = true
      this.diaLoading = true
      this.companyData = []
      fetchComTree().then(response => {
        if (response.data.code === 200) {
          this.companyData.push(response.data.data)
        }
        this.diaLoading = false
      })
    },
    // 选择工厂确认
    handleClickFactory() {
      this.listQuery.factoryName = this.getCompanyName
      this.listQuery.factoryCode = this.getCompanyCode
      this.companyVisible = false
    },
    // 选择使用部门
    changeDivision() {
      this.getOrgCode = undefined
      this.getOrgName = undefined
      this.divisionVisible = true
      this.diaLoading = true
      this.orgData = []
      fetchChooseTree().then(response => {
        if (response.data.code == 200) {
          this.orgData.push(response.data.data)
          for (var i = 0; i < this.orgData.length; i++) {
            if (this.orgData[i].orgType == '公司') {
              this.orgData[i].disabled = true
            }
            for (var j = 0; j < this.orgData[i].children.length; j++) {
              const child = this.orgData[i].children[j]
              if (child.orgType == '公司') {
                child.disabled = true
              }
              if (child.children != null) {
                for (var p = 0; p < child.children.length; p++) {
                  const child1 = child.children[p]
                  if (child1.orgType == '公司') {
                    child1.disabled = true
                  }
                  if (child1.children != null) {
                    for (var o = 0; o < child1.children.length; o++) {
                      const child2 = child1.children[o]
                      if (child2.orgType == '公司') {
                        child2.disabled = true
                      }
                      if (child2.children != null) {
                        for (var q = 0; q < child2.children.length; q++) {
                          const child3 = child2.children[q]
                          if (child3.orgType == '公司') {
                            child3.disabled = true
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      })
      this.diaLoading = false
    },
    deleteDivision() {
      this.listQuery.divisionName = undefined
      this.listQuery.divisionCode = undefined
    },
    // 设置部门组织树状图单选
    handleChange(data, checked, node) {
      this.i++
      if (this.i % 2 == 0) {
        if (checked) {
          this.$refs.orgTree.setCheckedNodes([])
          this.$refs.orgTree.setCheckedNodes([data])
          // 交叉点击节点
        } else {
          this.$refs.orgTree.setCheckedNodes([])
          // 点击已经选中的节点，置空
        }
      }
    },
    // 获取部门被选择的节点
    getCheckedNodes() {
      this.treeData = this.$refs.orgTree.getCheckedNodes()
      this.getOrgCode = this.treeData[0].orgCode
      this.getOrgName = this.treeData[0].orgFullName
    },
    // 点击选择部门确认
    handleClick2() {
      this.getCheckedNodes()
      this.listQuery.divisionName = this.getOrgName
      this.listQuery.divisionCode = this.getOrgCode
      this.divisionVisible = false
    },
    // 根据编号查看
    handleDetail(row) {
      this.gzsmsfileData = []
      this.id = row.id
      this.documentWordCode = row.documentWordCode
      getDetail(this.id).then(response => {
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
    // 文件下载
    fileDown(row) {
      if (row.fileUrl !== undefined) {
        window.location.href = row.fileUrl + '?attname=' + row.fileName
      } else {
        window.location.href = row.filePath + '?attname=' + row.fileName
      }
    },
    handleExport() {
      fetchExportList(this.listQuery).then(response => {
        if (response.data.code == 200) {
          window.location.href = response.data.data
        } else {
          this.$notify({
            title: '警告',
            message: response.data.msg,
            type: 'warning',
            duration: 3000
          })
        }
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

