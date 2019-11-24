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
        <el-button class="filter-item" @click="handleCreate" type="primary" v-if="addShow">新增</el-button>
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
          <el-table-column align="center" label="操作" width="140px" fixed="right">
            <template slot-scope="scope">
              <el-button title="编辑" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)" 
                :disabled="scope.row.editDisabled?true:false" v-if="editShow"></el-button>
              <el-button title="删除" type="danger" icon="el-icon-delete" size="mini"  @click="deleteBtn(scope.row)" 
                :disabled="scope.row.deleteDisabled?true:false" v-if="deleteShow"></el-button>
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
      <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false"  width="750px" :visible.sync="dialogFormVisible" v-loading="listLoading" v-dialogDrag> 
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
                <el-col :span="9" style="padding-right:0px;">
                  <el-form-item label="设备名称" prop="equipmentName">
                    <el-input v-model="temp.equipmentName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2" style="padding-left:0px;">
                  <el-button type="primary" @click="chooseEquip" :disabled="!chooseShow">选择</el-button>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="配件品名" prop="sparePartsName">
                    <el-input v-model="temp.sparePartsName" maxlength="15" :disabled="!chooseShow"></el-input>
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
                    <el-input v-model="temp.parameter" maxlength="20" :disabled="!chooseShow"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="单位" prop="unit">
                    <el-input v-model="temp.unit" maxlength="5" :disabled="!chooseShow"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="24">
                  <el-form-item label="适用其他设备" prop="othersEquip">
                    <el-input v-model="temp.othersEquip" maxlength="50" :disabled="!chooseShow"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="1" style="width:1px;color:red;padding:8px;">
                  <span>*</span>
                </el-col>
                <el-col :span="22">
                  <el-form-item label="图片或图纸" prop="picList">
                    <div v-if="temp.picList.length>0" v-for="item in temp.picList" :key="item.id">
                      <span class="look-detail" @click="lookImage(item)">{{item.fileName}}</span>
                      <el-button title="下载" type="primary" size="mini" icon="el-icon-download" @click="imageDown(item)"></el-button>
                    </div>
                    <input accept="image/*" id="uploadImg" type="file" @change="imageUpload" v-if="chooseShow">
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  <el-form-item label="文件" prop="fList">
                    <input id="uploadFile" type="file" @change="fileUpload" v-if="chooseShow">
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <el-table :data="temp.fList"
              border fit highlight-current style="width:80%; margin-left:100px;">
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
                  <el-button title="删除" type="danger" icon="el-icon-delete" size="mini"  @click="fileDelete(scope.row)"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="流转记录" name="second" v-if="recordShow">
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
          <el-tab-pane label="流程图" name="three" v-if="recordShow">
            <div id="imgcontainer">
              <img id="pic" :src="chartData"/>
            </div>
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
      <el-dialog width="30%" :close-on-click-modal="false" title="选择设备名称" :visible.sync="centerDialogVisible" append-to-body>
        <span style="margin-left:20px;color:red;font-size:16px;" prop='getEquipmentName'>{{getEquipmentName}}</span>
        <el-collapse accordion>
          <el-collapse-item :title="item.orgName" :name="index" v-if="item.oList.length > 0" 
            v-for="(item, index) in equipData" :key="item.orgCode">
            <div class="route-item" :name="index + '-' + sub" 
              v-for="(route, sub) in item.oList" :key="route.id" 
              @click="routeFocus(item, route, index, sub)">
              <div class="routeName">{{route.equipmentName}}</div>
            </div>
          </el-collapse-item>
        </el-collapse>
        <div slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取消</el-button>
          <el-button @click="equipOk" type="primary">确定</el-button>
        </div>
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
import { fetchList, getDetail, fetchTree, createArticle, updateArticle, delById } from '@/api/equipSpareParts/addPartsApply'
import { commonOptions, recordList, uploadlist, deleteFile, fileList, deleteFileById, getCurrentUser, insertFile, processChart, getProxyOrgList } from '@/api/common/common'
import { fetchButton } from '@/api/common/button'
import { menuList } from '@/store/modules/permission'// 按钮权限
import { baseUrl } from '@/api/common/fileBaseUrl'
export default {
  name: 'addPartsApply',
  data() {
    return {
      // 代办审核
      ifSave: false,
      changeOrgVisible: undefined,
      proxyOrgList: [],
      comName: undefined,
      comCode: undefined,
      userCode: undefined, // 用户编码
      // 按钮是否显示
      addShow: false,
      editShow: false,
      deleteShow: false,
      chooseShow: true,
      chartData: null, // 流程图
      // 表格数据
      tableKey: 0,
      listLoading: false,
      tableData: [],
      total: null,
      // 审核状态下拉框
      options: commonOptions,
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
        procurementCycle: null,
        parameter: undefined,
        othersEquip: undefined,

        equipmentName: undefined,
        equipmentCode: undefined,
        equipmentId: undefined,
        fList: [],
        picList: [],
        proxyOrgCode: undefined, // 代理组织
        proxyOrgName: undefined
      },
      getEquipmentId: undefined,
      getEquipmentCode: undefined,
      getEquipmentName: undefined,
      equipData: [],
      dialogFormVisible: false,
      centerDialogVisible: false,
      lookDialogVisible: false, // 预览图片
      imageData: null,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增',
        detail: '查看'
      },
      // 文件数据
      folderList: [], // 文件List
      documentWordCode: undefined, // 单据编码
      userId: undefined, // 用户id
      processInstanceId: undefined, // 流程实例id
      filePathDown: undefined,
      imagePath: undefined,
      // 流转记录
      activeName: 'first',
      recordShow: false,
      recordData: null,
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
    this.getButton()
  },
  methods: {
    getButton() {
      menuList.forEach(item => {
        item.children.forEach(e => {
          if (e.name == 'addPartsApply') {
            this.menuCode = e.code
          }
        })
      })
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
            if (this.tableData[i].checkStatus == 1) {
              this.tableData[i].editDisabled = false
              this.tableData[i].deleteDisabled = false
            } else if (this.tableData[i].checkStatus == 2 || this.tableData[i].checkStatus == 3 || this.tableData[i].checkStatus == 4 || this.tableData[i].checkStatus == 5) {
              this.tableData[i].editDisabled = true
              this.tableData[i].deleteDisabled = true
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
    chooseEquip() {
      this.centerDialogVisible = true
      fetchTree().then(response => {
        this.equipData = []
        this.equipData = response.data.data.list
      })
    },
    // 设备被选中
    routeFocus(item, route, index, sub) {
      this.getEquipmentId = route.id
      this.getEquipmentCode = route.equipmentCode
      this.getEquipmentName = route.equipmentName
    },
    equipOk() {
      this.temp.equipmentId = this.getEquipmentId
      this.temp.equipmentCode = this.getEquipmentCode
      this.temp.equipmentName = this.getEquipmentName
      this.centerDialogVisible = false
    },
    // 根据编号查看
    handleDetail(row) {
      this.activeName = 'first'
      this.dialogStatus = 'detail'
      this.recordShow = true
      this.chooseShow = false
      this.dialogFormVisible = true
      this.documentWordCode = row.formCode
      const find = {
        id: row.id
      }
      // 表单信息
      getDetail(find).then(response => {
        if (response.data.code == 200) {
          this.temp = Object.assign({}, response.data.data)
          // 流转记录
          this.processInstanceId = this.temp.processInstanceId
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
    // 删除
    deleteBtn(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const find2 = {
          id: row.id,
          type: 2
        }
        delById(find2).then(response => {
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
    resetTemp() {
      this.temp = {
        id: undefined,
        formCode: undefined,
        sparePartsCode: undefined,
        sparePartsName: undefined,
        unit: undefined,
        procurementCycle: null,
        parameter: undefined,
        othersEquip: undefined,
        equipmentName: undefined,
        equipmentCode: undefined,
        equipmentId: undefined,
        fList: [],
        picList: [],
        proxyOrgCode: undefined, // 代理组织
        proxyOrgName: undefined
      }
      this.userId = undefined
      this.documentWordCode = undefined
    },
    // 新增
    handleCreate() {
      this.resetTemp()
      this.activeName = 'first'
      this.dialogStatus = 'create'
      this.chooseShow = true
      this.recordShow = false
      this.getUser()
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 新增保存
    saveData() {
      this.ifSave = true
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.temp.picList.length == 0) {
            this.$notify({
              title: '警告',
              message: '请上传图片或图纸',
              type: 'warning',
              duration: 2000
            })
            return
          }
          if (this.proxyOrgList.length != 0) {
            this.changeOrgVisible = true
          } else {
            this.temp.proxyOrgCode = this.comCode
            this.createSave()
          }
        }
      })
    },
    createSave() {
      this.listLoading = true
      const insertType = 1
      createArticle(insertType, this.temp).then(response => {
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
    },
    // 新增提交
    createData() {
      this.ifSave = false
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.temp.picList.length == 0) {
            this.$notify({
              title: '警告',
              message: '请上传图片或图纸',
              type: 'warning',
              duration: 2000
            })
            return
          }
          if (this.proxyOrgList.length != 0) {
            this.changeOrgVisible = true
          } else {
            this.temp.proxyOrgCode = this.comCode
            this.createSubmit()
          }
        }
      })
    },
    createSubmit() {
      const insertType = 2
      this.listLoading = true
      createArticle(insertType, this.temp).then(response => {
        if (response.data.code == 200) {
          this.dialogFormVisible = false
          this.getList()
          setTimeout(() => {
            this.listLoading = false
          }, 1 * 500)
          this.$message({
            title: '成功',
            message: '提交成功',
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
    // 编辑
    handleUpdate(row) {
      this.activeName = 'first'
      this.dialogStatus = 'update'
      this.recordShow = false
      this.chooseShow = true
      this.dialogFormVisible = true
      this.documentWordCode = row.formCode
      const find1 = {
        id: row.id
      }
      // 根据id获取详情
      getDetail(find1).then(response => {
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
      })
      this.getUser()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 获取当前用户信息
    getUser() {
      getCurrentUser().then(response => {
        if (response.data.code == 200) {
          this.userId = response.data.data.id
          this.userCode = response.data.data.userCode
          getProxyOrgList(this.userCode).then(response => {
            if (response.data.code == 200) {
              this.comName = response.data.data.orgName
              this.comCode = response.data.data.orgCode
              if (this.proxyOrgList != null) {
                this.proxyOrgList = response.data.data.list
              }
            }
          })
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
        if (this.ifSave == true) {
          this.createSave()
        } else if (this.ifSave == false) {
          this.createSubmit()
        }
      } else {
        if (this.ifSave == true) {
          this.createSave()
        } else if (this.ifSave == false) {
          this.createSubmit()
        }
      }
      this.changeOrgVisible = false
    },
    // 修改保存
    updateSaveData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.temp.picList.length == 0) {
            this.$notify({
              title: '警告',
              message: '请上传图片或图纸',
              type: 'warning',
              duration: 2000
            })
            return
          }
          this.listLoading = true
          const tempData = {
            id: this.temp.id,
            equipmentId: this.temp.equipmentId,
            othersEquip: this.temp.othersEquip,
            parameter: this.temp.parameter,
            procurementCycle: this.temp.procurementCycle,
            sparePartsName: this.temp.sparePartsName,
            unit: this.temp.unit
          }
          const updateType = 1
          updateArticle(updateType, tempData).then(response => {
            if (response.data.code == 200) {
              this.dialogFormVisible = false
              this.getList()
              setTimeout(() => {
                this.listLoading = false
              }, 1 * 500)
              this.$message({
                title: '成功',
                message: '提交成功',
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
          if (this.temp.picList.length == 0) {
            this.$notify({
              title: '警告',
              message: '请上传图片或图纸',
              type: 'warning',
              duration: 2000
            })
            return
          }
          this.updataSubmit()
        }
      })
    },
    updataSubmit() {
      this.listLoading = true
      const tempData = {
        id: this.temp.id,
        equipmentId: this.temp.equipmentId,
        othersEquip: this.temp.othersEquip,
        parameter: this.temp.parameter,
        procurementCycle: this.temp.procurementCycle,
        sparePartsName: this.temp.sparePartsName,
        unit: this.temp.unit,
        proxyOrgCode: this.temp.proxyOrgCode, // 代理组织
        proxyOrgName: this.temp.proxyOrgName
      }
      const updateType = 2
      updateArticle(updateType, tempData).then(response => {
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
    },
    // 获取图片列表
    getImageList() {
      const find = {
        moduleType: '12', // 模块类别
        attachmentCode: 'SBPJTPFJ', // 附件编码
        documentWordCode: this.documentWordCode // 单据编码
      }
      fileList(find).then(response => {
        var length = response.data.data.length - 1
        this.temp.picList = []
        this.temp.picList.push(response.data.data[length])
      })
    },
    // 获取文件列表
    getFileList() {
      const find1 = {
        moduleType: '12', // 模块类别
        attachmentCode: 'SBPJWJFJ', // 附件编码
        documentWordCode: this.documentWordCode // 单据编码
      }
      fileList(find1).then(response => {
        var length = response.data.data.length - 1
        this.temp.fList = []
        this.temp.fList.push(response.data.data[length])
      })
    },
    // 图片上传
    imageUpload(e) {
      const file = e.target.files[0]
      const fileData1 = {
        attachmentCode: 'SBPJTPFJ',
        code: this.documentWordCode,
        moduleType: '12',
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
                  this.getImageList()
                }
              })
            } else if (this.dialogStatus == 'create') {
              this.temp.picList = []
              this.temp.picList.push(fileData1)
              this.$message({
                title: '成功',
                message: '上传成功',
                type: 'success',
                duration: 2000
              })
            }
          } else if (resp.data.code == 402) {
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
          setTimeout(() => {
            this.listLoading = false
          }, 1 * 500)
          const fileInput = document.getElementById('uploadImg')
          fileInput.value = ''
        })
      }
    },
    // 文件上传
    fileUpload(e) {
      const file = e.target.files[0]
      const fileData1 = {
        attachmentCode: 'SBPJWJFJ',
        code: this.documentWordCode,
        moduleType: '12',
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
                  this.getFileList()
                }
              })
            } else if (this.dialogStatus == 'create') {
              this.temp.fList = []
              this.temp.fList.push(fileData1)
              this.$message({
                title: '成功',
                message: '上传成功',
                type: 'success',
                duration: 2000
              })
            }
          } else if (resp.data.code == 402) {
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
          setTimeout(() => {
            this.listLoading = false
          }, 1 * 500)
          const fileInput1 = document.getElementById('uploadFile')
          fileInput1.value = ''
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
    // 文件删除
    fileDelete(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 新增时删除
        if (this.dialogStatus == 'create') {
          const find1 = {
            fileName: row.filePath
          }
          deleteFile(find1).then(response => {
            if (response.data.code === 200) {
              const index = this.temp.fList.indexOf(row)
              this.temp.fList.splice(index, 1)
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
              const index = this.temp.fList.indexOf(row)
              this.temp.fList.splice(index, 1)
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
    // tabs 点击事件
    handleClick(tab, event) {
      this.recordData = null
      this.chartData = null
      if (this.processInstanceId != null && this.processInstanceId != '') {
        if (tab.label == '流转记录') {
          this.listLoading = true
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
      if (this.dialogStatus == 'create') {
        this.imageData = item.fileUrl
      } else {
        this.imageData = item.filePath
      }
    },
    imageDown(item) {
      if (this.dialogStatus == 'create') {
        window.location.href = item.fileUrl + '?attname=' + item.fileName
      } else {
        window.location.href = item.filePath + '?attname=' + item.fileName
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
.formDw{
	position: absolute;
	right: 20px;
	top: 80px;
}
.routeName{
  width:100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.routeName:focus{
  background:#6dc6fa
}
.el-collapse-item__content .route-item {
  padding:4px 0 4px 10px;
  cursor:pointer;
}
.el-collapse-item__content .route-item:hover {
  background:#6dc6fa
}
#pic,
#lookPic {
  width: 100%;
} 
</style>

