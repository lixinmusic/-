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
          <el-table-column align="center" label="操作" width="140px">
            <template slot-scope="scope">
              <el-button title="转办" type="success" icon="el-icon-share" size="mini"  @click="changeHandle(scope.row)"></el-button>
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
                <el-col :span="9" style="padding-right:0px;">
                  <el-form-item label="设备名称" prop="equipmentName">
                    <el-input v-model="temp.equipmentName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2" style="padding-left:0px;">
                  <el-button type="primary" @click="chooseEquip" :disabled="tzsqTask">选择</el-button>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="配件品名" prop="sparePartsName">
                    <el-input v-model="temp.sparePartsName" maxlength="15" :disabled="tzsqTask"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="1" style="width:4px;color:red;padding:8px 8px 8px 1px" v-if="!finance">
                  <span>*</span>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="采购周期" prop="procurementCycle">
                    <el-input v-model="temp.procurementCycle" maxlength="10" :disabled="finance"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="产品规格" prop="parameter">
                    <el-input v-model="temp.parameter" maxlength="20" :disabled="tzsqTask"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="单位" prop="unit">
                    <el-input v-model="temp.unit" maxlength="5" :disabled="tzsqTask"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="24">
                  <el-form-item label="适用其他设备" prop="othersEquip">
                    <el-input v-model="temp.othersEquip" maxlength="50" :disabled="tzsqTask"></el-input>
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
                    <input accept="image/*" id="uploadImg" type="file" @change="imageUpload">
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  <el-form-item label="文件" prop="fList">
                    <input id="uploadFile" type="file" @change="fileUpload">
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <el-table :data="temp.fList"
              border fit highlight-current style="width:80%; margin-left:100px;">
              <el-table-column prop="fileName" align="center" label="文件名">
                <template slot-scope="scope">
                  <span class="look-detail" @click="lookFile(scope.row)">{{scope.row.fileName}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="node" align="center" label="上传节点" >
              </el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <el-button title="下载" type="primary" size="mini" icon="el-icon-download" @click="fileDown(scope.row)"></el-button>
                  <el-button title="删除" type="danger" icon="el-icon-delete" size="mini"  @click="updatefileDelete(scope.row)"
                  :disabled="scope.row.deleteDisabled?true:false"></el-button>
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
						<el-button type="primary" @click="agreeData" v-if="tzsqTask">同意</el-button>
						<el-button type="primary" @click="unAgreeData" v-if="tzsqTask">退回</el-button>
            <el-button type="primary" @click="againSubmit" v-if="!tzsqTask">提交</el-button>
            <el-button type="primary" @click="endbtn" v-if="!tzsqTask">结束流程</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 同意/退回 -->
			<el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" :visible.sync="agreeDialogVisible" width="30%">
				<el-form :model="popData" label-position="left" label-width="120px">
          <span style="color:red;position:absolute;top:90px;left:13px">*</span>
					<el-form-item label="意见" prop="opetion">
						<el-input type="textarea" maxlength="128" v-model="popData.opetion"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="agreeDialogVisible = false">取消</el-button>
					<el-button v-if="dialogStatus=='agree'" type="primary" @click="createData">同意</el-button>
          <el-button v-if="dialogStatus=='unagree'" type="primary" @click="updateData">确定</el-button>
				</div>
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
      <!-- 选择人员 -->
      <el-dialog width="60%" :close-on-click-modal="false" title="请选择转办接收人员" :visible.sync="innerVisiblePerson" append-to-body v-dialogDrag>
        <el-header>
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="姓名">
              <el-input v-model="listQuery2.perName" placeholder="请输入姓名">
              </el-input>
            </el-form-item>
            <el-form-item label="工号">
              <el-input v-model="listQuery2.workNumber" placeholder="请输入工号">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="handlePerson">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-header>
        <el-container>
          <el-aside>
            <el-tree :data="personOrgData" :props="defaultProps1" @node-click="handleNodeClick" v-loading="treeLoading" :render-content="renderContent"></el-tree>
          </el-aside>
          <el-main>
            <el-table height='500' :data="orgListData" v-loading="listLoading" border fit highlight-current-row
              style="width: 100%;min-height:300px;margin-top:8px">
              <el-table-column prop="orgName" align="center" label="部门" min-width="50">
              </el-table-column>
              <el-table-column prop="perName" align="center" label="人员" min-width="50">
              </el-table-column>
              <el-table-column align="center" label="工号" min-width="50">
                <template slot-scope="scope">
                  <a class="look-detail" @click="chooseReplace(scope.row)">{{scope.row.workNumber}}</a>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
        </el-container>
        <div slot="footer" class="dialog-footer">
          <el-button @click="innerVisiblePerson = false">取消</el-button>
        </div>
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
import { fetchNeedList, getDetail, agreeApply, reCommit, fetchTree } from '@/api/equipSpareParts/addPartsApply'
import { fetchButton } from '@/api/common/button'
import { fileList, recordList, uploadlist, deleteFileById, insertFile, getCurrentUser, getCurrentTask, endProcess, processChart, fetchChooseTree, choosePersonList, transferList } from '@/api/common/common'
import { baseUrl } from '@/api/common/fileBaseUrl'
export default {
  name: 'addPartsApplyNeed',
  data() {
    return {
      tzsqTask: true,
      finance: true, // 资产部
      // 表格数据
      tableKey: 0,
      listLoading: false,
      tableData: [],
      total: null,
      chartData: null, // 流程图
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        equipmentName: undefined,
        formCode: undefined,
        sparePartsName: undefined
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
        picList: []
      },
      // 选择人员
      defaultProps1: {
        children: 'children',
        label: 'orgFullName'
      },
      innerVisiblePerson: false,
      listQuery2: {
        pageNum: 1,
        pageSize: 1000,
        perName: undefined,
        workNumber: undefined
      },
      personOrgData: [],
      orgListData: [],
      treeLoading: false,
      changeProcessId: undefined,
      getEquipmentId: undefined,
      getEquipmentCode: undefined,
      getEquipmentName: undefined,
      equipData: [],
      dialogFormVisible: false,
      centerDialogVisible: false,
      agreeDialogVisible: false, // 同意/退回
      dialogStatus: '',
      textMap: {
        detail: '查看',
        agree: '同意办理',
        unagree: '退回办理'
      },
      // 文件数据
      nodeKey: undefined, // 节点key
      nodeName: undefined, // 节点名称
      documentWordCode: undefined, // 单据编码
      userId: undefined, // 用户id
      processInstanceId: undefined, // 流程实例id
      filePathDown: undefined,
      // 流转记录
      activeName: 'first',
      recordData: null,
      // 任务审批
      popData: {
        opetion: undefined,
        operationType: undefined,
        taskId: undefined, // 任务id
        id: undefined, // 设备备案id
        procurementCycle: null // 采购周期
      },
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
    renderContent(h, { node, data, store }) {
      return (
        <span>
          <span title={node.label}>{node.label}</span>
        </span>)
    },
    getList() {
      this.listLoading = true
      fetchNeedList(this.listQuery).then(response => {
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
      this.tzsqTask = true
      this.finance = true
      this.dialogFormVisible = true
      this.popData.taskId = row.taskId
      this.documentWordCode = row.formCode // 单据编号
      this.processInstanceId = row.processInstanceId // 流程实例id
      const find = {
        id: row.id
      }
      this.id = row.id
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
              for (var i = 0; i < this.temp.fList.length; i++) {
                if (this.temp.fList[i].userId == this.userId) {
                  this.temp.fList[i].deleteDisabled = false
                } else {
                  this.temp.fList[i].deleteDisabled = true
                }
              }
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
      this.getUser()
      this.getNodeKey() // 获取当前任务信息
    },
    // 获取当前用户信息
    getUser() {
      getCurrentUser().then(response => {
        this.userId = response.data.data.id
      })
    },
    // 查询当前任务信息（获取节点key值）
    getNodeKey() {
      getCurrentTask(this.processInstanceId).then(response => {
        if (response.data.code === 200) {
          this.nodeKey = response.data.data.definitionKey
          this.nodeName = response.data.data.name
          if (this.nodeName == '调整申请') {
            this.tzsqTask = false
          } else if (this.nodeKey == 'equipSpareParts_zkb') { // 判断是否是资产部审核节点
            this.finance = false
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
        for (var i = 0; i < this.temp.fList.length; i++) {
          if (this.temp.fList[i].userId == this.userId) {
            this.temp.fList[i].deleteDisabled = false
          } else {
            this.temp.fList[i].deleteDisabled = true
          }
        }
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
        node: this.nodeName, // 节点名称
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
        node: this.nodeName, // 节点名称
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
            insertFile(fileData1).then(response => {
              if (response.data.code == 200) {
                fileData1.id = response.data.data
                this.$message({
                  title: '成功',
                  message: '上传成功',
                  type: 'success',
                  duration: 2000
                })
                this.getFileList() // 获取文件
              }
            })
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
    // 文件删除
    updatefileDelete(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 同意
    agreeData() {
      this.popData.opetion = null
      this.popData.operationType = 1
      this.popData.id = this.temp.id // 设备备案id
      this.popData.procurementCycle = this.temp.procurementCycle // 预算
      if (this.nodeKey == 'equipSpareParts_zkb') {
        if (this.popData.procurementCycle == null || this.popData.procurementCycle == '') {
          this.$notify({
            title: '警告',
            message: '请输入采购周期',
            type: 'warning',
            duration: 2000
          })
        } else {
          this.dialogStatus = 'agree'
          this.agreeDialogVisible = true
        }
      } else {
        this.dialogStatus = 'agree'
        this.agreeDialogVisible = true
      }
    },
    createData() {
      if (this.popData.opetion == null || this.popData.opetion == '') {
        this.$notify({
          title: '警告',
          message: '请填写意见',
          type: 'warning',
          duration: 3000
        })
        return
      }
      const tempData = Object.assign({}, this.popData)
      agreeApply(tempData).then(response => {
        if (response.data.code == 200) {
          this.agreeDialogVisible = false
          this.dialogFormVisible = false
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
    // 退回
    unAgreeData() {
      this.popData.opetion = null
      this.popData.operationType = 2
      this.popData.id = this.temp.id // 设备备案id
      this.dialogStatus = 'unagree'
      this.agreeDialogVisible = true
    },
    updateData() {
      if (this.popData.opetion == null || this.popData.opetion == '') {
        this.$notify({
          title: '警告',
          message: '请填写意见',
          type: 'warning',
          duration: 3000
        })
        return
      }
      const tempData = Object.assign({}, this.popData)
      agreeApply(tempData).then(response => {
        if (response.data.code == 200) {
          this.agreeDialogVisible = false
          this.dialogFormVisible = false
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
    // 重新提交
    againSubmit() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const find = {
            id: this.temp.id,
            equipmentId: this.temp.equipmentId,
            othersEquip: this.temp.othersEquip,
            parameter: this.temp.parameter,
            // procurementCycle: this.temp.procurementCycle,
            sparePartsName: this.temp.sparePartsName,
            unit: this.temp.unit,
            taskId: this.popData.taskId
          }
          reCommit(find).then(response => {
            if (response.data.code == 200) {
              this.dialogFormVisible = false
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
        }
      })
    },
    endbtn() {
      const taskId = this.popData.taskId
      const val = 1
      const id = this.id
      const moduleTypeId = 11
      this.listLoading = true
      endProcess(taskId, val, id, moduleTypeId).then(response => {
        if (response.data.code == 200) {
          this.listLoading = false
          this.dialogFormVisible = false
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
    },
    changeHandle(row) {
      this.changeProcessId = row.processInstanceId
      this.choosePerson()
    },
    choosePerson() {
      this.listQuery2 = {
        pageNum: 1,
        pageSize: 1000,
        perName: undefined,
        workNumber: undefined
      }
      this.orgListData = []
      this.innerVisiblePerson = true
      this.treeLoading = true
      // 查询组织树结构
      fetchChooseTree().then(response => {
        this.personOrgData = []
        this.personOrgData.push(response.data.data)
        setTimeout(() => {
          this.treeLoading = false
        }, 1 * 1000)
      })
    },
    // 组织树点击事件加载表格数据
    handleNodeClick(data) {
      this.listLoading = true
      const params = {
        orgCode: data.orgCode,
        pageNum: 1,
        pageSize: 1000
      }
      choosePersonList(params).then(response => {
        this.orgListData = response.data.data.list
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 1000)
      })
    },
    handlePerson() {
      this.listLoading = true
      choosePersonList(this.listQuery2).then(response => {
        this.orgListData = response.data.data.list
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 1000)
      })
    },
    // 转办人员提交
    chooseReplace(row) {
      const finds = {
        processInstanceId: this.changeProcessId,
        workNumber: row.workNumber
      }
      transferList(finds).then(response => {
        if (response.data.code === 200) {
          this.getList()
          this.innerVisiblePerson = false
          this.$message({
            title: '成功',
            type: 'success',
            message: '请求成功!',
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
.el-collapse-item__content .route-item:hover{
  background:#6dc6fa
}
#pic,
#lookPic {
  width: 100%;
}
</style>

