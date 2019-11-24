<template>
  <div class="app-container">
    <el-container>
      <el-header style="margin-bottom:30px; padding:0">
        <div class="formSearch">
          <el-form :inline="true">
            <el-form-item label="配件品名">
              <el-input class="filter-item input" placeholder="请输入配件品名" maxlength="32" v-model="listQuery.sparePartsName">
              </el-input>
            </el-form-item>
            <el-form-item label="配件编码">
              <el-input class="filter-item input" placeholder="请输入配件编码" maxlength="32" v-model="listQuery.sparePartsCode">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="filter-item button" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-header>
      <!-- 内容容器 -->
      <el-container>
        <!-- 侧边栏容器 -->
        <el-aside style="border:1px solid #f0f0f0" width="200px">
          <div class="tree">
            <span style="margin-left:30px;color:red" prop='getEquipName'>{{getEquipName}}</span> 
            <ul>
              <li v-for="orgItem in equipData" :key="orgItem.orgCode" :class="{closed: orgItem.closed}">
                <div class="routeName" @click="orgItem.closed=!orgItem.closed">
                  <span @click="changeOrg(orgItem)" class="change">
                    <span class="el-icon" :class="orgItem.closed?'el-icon-caret-right':'el-icon-caret-bottom'"></span>
                    {{orgItem.orgName}}
                  </span>
                </div>
                <ul v-show="!orgItem.closed">
                  <li v-for="equipItem in orgItem.oList" :key="equipItem.id" :class="{closed: equipItem.closed}">
                    <div class="routeName" @click="equipItem.closed=!equipItem.closed">   
                      <span @click="routeFocus(equipItem)" class="change">
                        <span class="el-icon" :class="equipItem.closed?'el-icon-caret-right':'el-icon-caret-bottom'"></span>
                        {{equipItem.equipmentName}}
                      </span>
                    </div>
                    <ul v-show="!equipItem.closed" style="padding-left:1.3em;">
                      <li v-for="item2 in equipItem.pList" :key="item2.id" >
                        <span>
                          {{item2.sparePartsName}}
                        </span>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </el-aside>
        <el-container>
          <!-- 主要区域容器 -->
          <el-main>
            <el-button size="mini" style="margin: 10px 10px;" type="primary" v-waves icon="el-icon-plus" @click="handleCreate" v-if="addShow">新增</el-button>
            <!-- 表格部分 -->
            <el-table :key='tableKey' :data="listData" height='200' v-loading="listLoading" border fit highlight-current-row v-if="tableShow"
              style="width:100%;min-height:500px;margin-top:8px" :header-cell-style="{background:'oldlace'}">
              <el-table-column prop="equipmentName" align="center" label="设备名称" min-width="50">
              </el-table-column>
              <el-table-column prop="equipmentCode" align="center" label="设备编码" min-width="50">
              </el-table-column>
              <el-table-column align="center" label="操作" width="160px">
                <template slot-scope="scope">
                <el-button title="编辑" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-if="editShow"></el-button>
                <el-button title="删除" type="danger" icon="el-icon-delete" size="mini"  @click="deleteHandle(scope.row)" v-if="deleteShow"></el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-table :data="tableData" height="200" v-loading="listLoading" v-if="!tableShow"
              border fit highlight-current style="width: 100%;margin-top:10px;min-height:500px" 
              :header-cell-style="{background:'oldlace'}">
              <el-table-column prop="orgName" align="center" label="所属车间">
              </el-table-column>
              <el-table-column prop="equipmentName" align="center" label="所属设备">
              </el-table-column>
              <el-table-column prop="sparePartsName" align="center" label="配件品名">
                <template slot-scope="scope">
                  <span class="look-detail" @click="handleDetail(scope.row)">{{scope.row.sparePartsName}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="sparePartsCode" align="center" label="配件编码">
              </el-table-column>
              <el-table-column prop="parameter" align="center" label="产品规格">
              </el-table-column>
              <el-table-column prop="unit" align="center" label="单位">
              </el-table-column>
              <el-table-column prop="procurementCycle" align="center" label="采购周期">
              </el-table-column>
              <el-table-column prop="othersEquip" align="center" label="适用其他设备">
              </el-table-column>
              <el-table-column prop="fileName" align="center" label="图片或图纸">
                <template slot-scope="scope">
                  <span class="look-detail" @click="lookImage(scope.row)">{{scope.row.fileName}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" width="160px" fixed="right">
                <template slot-scope="scope">
                  <el-button title="编辑" type="primary" size="mini" icon="el-icon-edit" @click="updateBtn(scope.row)" v-if="editShow"></el-button>
                  <el-button title="删除" type="danger" icon="el-icon-delete" size="mini" @click="deleteBtn(scope.row)" v-if="deleteShow"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
          <!-- 底栏容器 -->
          <el-footer>
            <!-- 分页 -->
            <div class="pagination-container">
              <el-pagination background 
              @size-change="handleSizeChange" 
              @current-change="handleCurrentChange" 
              :current-page="listQuery.pageNum" 
              :page-sizes="[5,10,15,20]" 
              :page-size="listQuery.pageSize" 
              layout="total, sizes, prev, pager, next, jumper" 
              :total="total">
              </el-pagination>
            </div>
          </el-footer>
          <!--新增编辑弹出框 -->
          <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" :visible.sync="dialogFormVisible" v-dialogDrag v-loading="listLoading">
            <el-form :rules="rules" ref="dataForm" :model="popData" 
              label-position="left" label-width="100px">
              <el-row :gutter="20">
                <el-col :span="20" style="padding-right:0px;">
                  <el-form-item label="设备名称" prop="equipmentName"  >
                    <el-input v-model="popData.equipmentName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="3" style="padding-left:0px;">
                  <el-button type="primary" @click="handleChooseEquip">选择</el-button>
                </el-col>
              </el-row>
               <el-row :gutter="20">
                <el-col :span="24">
                  <el-form-item label="设备编码" prop="equipmentCode">
                    <el-input v-model="popData.equipmentCode" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取消</el-button>
              <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">提交</el-button>
              <el-button v-if="dialogStatus=='update'" type="primary" @click="updateData">提交</el-button>
            </div>
          </el-dialog>
          <el-dialog width="30%" :close-on-click-modal="false" title="选择设备名称" :visible.sync="innerVisibleUseBranch1" append-to-body>
            <el-container>
              <el-aside>
                <span style="margin-left:20px;color:red" prop='getEquipTypeName'>{{getEquipTypeName}}</span>
                <el-tree 
                  :data="branchEquipData" 
                  :props="defaultPropsBranch1" 
                  ref="treeEquip"
                  show-checkbox 
                  node-key="categoryCode"
                  check-strictly
                  @check-change="handleChangeEquip">
                </el-tree>
              </el-aside>
            </el-container>
            <div slot="footer" class="dialog-footer">
              <el-button @click="innerVisibleUseBranch1 = false">取消</el-button>
              <el-button @click="handleClickVisibleBranch1" type="primary">确定</el-button>
            </div>
          </el-dialog>
          <!-- 配件弹框 -->
          <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" :visible.sync="dialogVisible" v-loading="listLoading" v-dialogDrag> 
            <el-form :rules="rulespj" ref="dataFormpj" :model="temp" label-position="left" label-width="110px">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="配件品名" prop="sparePartsName">
                    <el-input v-model="temp.sparePartsName" maxlength="15" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="配件编码" prop="sparePartsCode">
                    <el-input v-model="temp.sparePartsCode" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="单位" prop="unit">
                    <el-input v-model="temp.unit" maxlength="5" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="采购周期" prop="procurementCycle">
                    <el-input v-model="temp.procurementCycle" maxlength="10" :disabled="!chooseShow"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="产品规格" prop="parameter">
                    <el-input v-model="temp.parameter" maxlength="20" :disabled="!chooseShow"></el-input>
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
                <el-col :span="12">
                  <el-form-item label="图片或图纸">
                    <input accept="image/*" id="uploadImg" type="file" @change="imageUpload" v-if="chooseShow">
                    <div>{{nowImage}}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="文件">
                    <input id="uploadFile" type="file" @change="fileUpload" v-if="chooseShow">
                    <div>{{nowFile}}</div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="2" style="padding-right:5px;">
                  <el-form-item label="历史图片或图纸">
                  </el-form-item>
                </el-col>
                <el-col :span="22" style="padding-lift:0px;">
                  <el-table :data="temp.picList"
                    border fit highlight-current style="width:90%;margin-left:50px;">
                    <el-table-column prop="fileName" align="center" label="文件名">
                      <template slot-scope="scope">
                        <span class="look-detail" @click="lookImage(scope.row)">{{scope.row.fileName}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="createTime" align="center" label="上传时间">
                      <template slot-scope="scope">
                        <span>{{scope.row.createTime !==null?scope.row.createTime.substring(0,10):''}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作">
                      <template slot-scope="scope">
                        <el-button title="下载" type="primary" size="mini" icon="el-icon-download" @click="fileDown(scope.row)"></el-button>
                        <el-button v-if="chooseShow" title="删除" type="danger" icon="el-icon-delete" size="mini"  @click="imageDelete(scope.row)"></el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
              <el-row style="margin-top:10px;">
                <el-col :span="2" style="padding-right:5px;">
                  <el-form-item label="历史文件">
                  </el-form-item>
                </el-col>
                <el-col :span="22" style="padding-lift:0px;">
                  <el-table :data="temp.fileList"
                    border fit highlight-current style="width:90%; margin-left:50px;">
                    <el-table-column prop="fileName" align="center" label="文件名"> 
                      <template slot-scope="scope">
                        <span class="look-detail" @click="lookFile(scope.row)">{{scope.row.fileName}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="createTime" align="center" label="上传时间">
                      <template slot-scope="scope">
                        <span>{{scope.row.createTime !==null?scope.row.createTime.substring(0,10):''}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作">
                      <template slot-scope="scope">
                        <el-button title="下载" type="primary" size="mini" icon="el-icon-download" @click="fileDown(scope.row)"></el-button>
                        <el-button v-if="chooseShow" title="删除" type="danger" icon="el-icon-delete" size="mini"  @click="fileDelete(scope.row)"></el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取消</el-button>
              <el-button v-if="dialogStatus=='updatepj'" type="primary" @click="updateDatapj">提交</el-button>
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
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { fetchTree, fetchList, fetchEquipCode, deleteCode, createArticle, fetchDetail, updateArticle, deleteFileById } from '@/api/equipSpareParts/partsCatalog'
import { fetchEquipName, uploadlist } from '@/api/common/common'
import { fetchButton } from '@/api/common/button'
import waves from '@/directive/waves' // 水波纹指令
import { menuList } from '@/store/modules/permission'// 按钮权限
import { baseUrl } from '@/api/common/fileBaseUrl'

export default {
  name: 'partsCatalog',
  directives: {
    waves
  },
  data() {
    return {
      equipData: [],
      // 按钮是否显示
      addShow: false,
      editShow: false,
      deleteShow: false,
      chooseShow: true,
      tableShow: true,
      closed: 'closed',
      // 选择设备名称
      defaultPropsBranch1: {
        children: 'children',
        label: 'categoryName'
      },
      j: 0,
      branchEquipData: [],
      getEquipTypeName: '',
      // 表格初始数据
      tableKey: 0,
      listData: [],
      total: null,
      tableData: [],
      listLoading: false,
      listQuery: {
        formCode: undefined,
        orgCode: undefined,
        equipmentId: undefined,
        equipmentName: undefined,
        sparePartsCode: undefined,
        sparePartsName: undefined,
        pageNum: 1,
        pageSize: 10
      },
      // 弹出框表单数据
      popData: {
        id: undefined,
        equipmentCode: undefined,
        equipmentName: undefined,
        orgCode: undefined,
        orgName: undefined,
        type: 1
      },
      getOrgName: undefined,
      getEquipName: undefined,
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
        fileList: [],
        picList: [],
        type: 2,
        fileName: undefined,
        filePath: undefined,
        folderList: []
      },
      nowImage: undefined,
      nowFile: undefined,
      // 弹框显示
      dialogFormVisible: false,
      innerVisibleUseBranch1: false,
      dialogVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑设备',
        create: '新增设备',
        detail: '查看配件',
        updatepj: '编辑配件'
      },
      lookDialogVisible: false, // 预览图片
      imageData: null,
      rules: {
        equipmentName: [{ required: true, message: '该字段不能为空', trigger: 'change' }],
        equipmentCode: [{ required: true, message: '该字段不能为空', trigger: 'change' }]
      },
      rulespj: {
        sparePartsName: [{ required: true, message: '该字段不能为空', trigger: 'change' }],
        sparePartsCode: [{ required: true, message: '该字段不能为空', trigger: 'change' }],
        procurementCycle: [{ required: true, message: '该字段不能为空', trigger: 'change' }]
      }
    }
  },
  created() {
    // this.getList()
    this.getTree()
    this.getButton()
  },
  methods: {
    // 查询按钮信息
    getButton() {
      menuList.forEach(item => {
        item.children.forEach(e => {
          if (e.name == 'partsCatalog') {
            this.menuCode = e.code
          }
        })
      })
      const params = {
        menuCode: this.menuCode,
        type: 'web'
      }
      fetchButton(params).then(response => {
        if (response.data.code === 200) {
          const buttons = response.data.data
          for (var i = 0; i < buttons.length; i++) {
            if (buttons[i].buttonName == '新增') {
              this.addShow = true
            } else if (buttons[i].buttonName == '编辑') {
              this.editShow = true
            } else if (buttons[i].buttonName == '删除') {
              this.deleteShow = true
            }
          }
        } else {
          this.$notify({
            title: '警告',
            message: response.data.msg,
            type: 'warning',
            duration: 3000
          })
        }
      })
    },
    // 请求树
    getTree() {
      fetchTree().then(response => {
        this.equipData = []
        this.equipData = response.data.data.list
        this.equipData.forEach(item => {
          item.closed = true
          item.oList.forEach(e => {
            e.closed = true
          })
        })
      })
    },
    // 车间被选中
    changeOrg(orgItem) {
      this.getOrgName = orgItem.orgName
      this.getEquipName = orgItem.orgName
      this.listQuery.orgCode = orgItem.orgCode
      this.listQuery.equipmentId = undefined
      this.listQuery.equipmentName = undefined
      this.listQuery.sparePartsCode = undefined
      this.listQuery.sparePartsName = undefined
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = 10
      this.tableShow = true
      this.getList()
    },
    // 设备被选中
    routeFocus(equipItem) {
      this.getEquipName = equipItem.equipmentName
      this.listQuery.orgCode = undefined
      this.listQuery.equipmentId = equipItem.id
      this.listQuery.equipmentName = equipItem.equipmentName
      this.listQuery.sparePartsCode = undefined
      this.listQuery.sparePartsName = undefined
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = 10
      this.tableShow = false
      this.getList()
    },
    // 删除设备
    deleteHandle(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          id: row.id,
          type: 1
        }
        deleteCode(param).then(response => {
          if (response.data.code === 200) {
            const index = this.listData.indexOf(row)
            this.listData.splice(index, 1)
            this.getTree()
            this.$message({
              title: '成功',
              type: 'success',
              message: '删除成功!',
              duration: 3000
            })
          } else {
            this.$notify({
              title: '警告',
              message: response.data.msg,
              type: 'warning',
              duration: 3000
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
    // 删除配件
    deleteBtn(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          id: row.id,
          type: 2
        }
        deleteCode(param).then(response => {
          if (response.data.code === 200) {
            const index = this.tableData.indexOf(row)
            this.tableData.splice(index, 1)
            this.getTree()
            this.$message({
              title: '成功',
              type: 'success',
              message: '删除成功!',
              duration: 3000
            })
          } else {
            this.$notify({
              title: '警告',
              message: response.data.msg,
              type: 'warning',
              duration: 3000
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
    // 表格加载
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        if (response.data.code === 200) {
          if (this.listQuery.orgCode != undefined) {
            this.listData = response.data.data.list
            this.total = response.data.data.total
          } else if (this.listQuery.orgCode == undefined) {
            this.tableData = response.data.data.list
            this.total = response.data.data.total
          }
          setTimeout(() => {
            this.listLoading = false
          }, 1 * 500)
        } else {
          this.$notify({
            title: '警告',
            message: response.data.msg,
            type: 'warning',
            duration: 3000
          })
          this.listLoading = false
        }
      })
    },
    // 搜索
    handleFilter() {
      this.listQuery.orgCode = undefined
      this.listQuery.equipmentId = undefined
      this.listQuery.equipmentName = undefined
      this.tableShow = false
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = 10
      this.getList()
    },
    // 每页条数查询
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    // 页码查询
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    },
    // 设备名称选择
    handleChooseEquip() {
      this.innerVisibleUseBranch1 = true
      fetchEquipName().then(response => {
        this.branchEquipData = []
        this.branchEquipData = response.data.data
        for (var i = 0; i < this.branchEquipData.length; i++) {
          this.branchEquipData[i].disabled = true
          for (var j = 0; j < this.branchEquipData[i].children.length; j++) {
            const child = this.branchEquipData[i].children[j]
            child.disabled = true
          }
        }
      })
    },
    // 设备名称树被选中
    handleChangeEquip(data, checked, node) {
      this.j++
      if (this.j % 2 == 0) {
        if (checked) {
          this.$refs.treeEquip.setCheckedNodes([])
          this.$refs.treeEquip.setCheckedNodes([data])
          // 交叉点击节点
        } else {
          this.$refs.treeEquip.setCheckedNodes([])
          // 点击已经选中的节点，置空
        }
      }
    },
    // 设备名称点击确认
    handleClickVisibleBranch1() {
      this.treeData1 = this.$refs.treeEquip.getCheckedNodes()
      this.popData.equipmentName = this.treeData1[0].categoryName
      this.innerVisibleUseBranch1 = false
    },
    // 根据编号查看
    handleDetail(row) {
      this.dialogStatus = 'detail'
      this.chooseShow = false
      this.dialogVisible = true
      const find2 = {
        id: row.id,
        type: 2
      }
      // 表单信息
      fetchDetail(find2).then(response => {
        if (response.data.code == 200) {
          this.temp = Object.assign({}, response.data.data)
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
    resetTemp() {
      this.popData = {
        id: undefined,
        equipmentCode: undefined,
        equipmentName: undefined,
        orgCode: undefined,
        orgName: undefined,
        type: 1
      }
    },
    // 新增事件
    handleCreate() {
      if (this.listQuery.orgCode == undefined) {
        this.$notify({
          title: '警告',
          message: '请选左侧树状图中的车间',
          type: 'warning',
          duration: 3000
        })
        return
      }
      this.resetTemp()
      this.popData.orgCode = this.listQuery.orgCode
      this.popData.orgName = this.getOrgName
      const find = {
        orgCode: this.listQuery.orgCode
      }
      fetchEquipCode(find).then(response => {
        if (response.data.code === 200) {
          this.popData.equipmentCode = response.data.data.equipmentCode
        } else {
          this.$notify({
            title: '警告',
            message: response.data.msg,
            type: 'warning',
            duration: 3000
          })
        }
      })
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.listLoading = true
          createArticle(this.popData).then(response => {
            if (response.data.code === 200) {
              this.getList()
              this.getTree()
              this.dialogFormVisible = false
              this.$message({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 3000
              })
              this.listLoading = false
            } else {
              this.$notify({
                title: '警告',
                message: response.data.msg,
                type: 'warning',
                duration: 3000
              })
              this.listLoading = false
            }
          })
        }
      })
    },
    // 编辑设备
    handleUpdate(row) {
      const find1 = {
        id: row.id,
        type: 1
      }
      fetchDetail(find1).then(response => {
        this.popData.id = response.data.data.id
        this.popData.equipmentCode = response.data.data.equipmentCode
        this.popData.equipmentName = response.data.data.equipmentName
        this.popData.orgCode = response.data.data.orgCode
        this.popData.orgName = response.data.data.orgName
      })
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 编辑提交设备
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.listLoading = true
          const tempData = Object.assign({}, this.popData)
          updateArticle(tempData).then(response => {
            const msg = response.data.msg
            if (response.data.code === 200) {
              for (const v of this.listData) {
                if (v.equipmentCode === this.popData.equipmentCode) {
                  const index = this.listData.indexOf(v)
                  this.listData.splice(index, 1, this.popData)
                  break
                }
              }
              this.getTree()
              this.dialogFormVisible = false
              this.$message({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 3000
              })
              this.listLoading = false
            } else {
              this.$notify({
                title: '警告',
                message: msg,
                type: 'warning',
                duration: 3000
              })
              this.listLoading = false
            }
          })
        }
      })
    },
    // 编辑配件
    updateBtn(row) {
      const find2 = {
        id: row.id,
        type: 2
      }
      fetchDetail(find2).then(response => {
        this.temp.sparePartsName = response.data.data.sparePartsName
        this.temp.sparePartsCode = response.data.data.sparePartsCode
        this.temp.unit = response.data.data.unit
        this.temp.procurementCycle = response.data.data.procurementCycle
        this.temp.othersEquip = response.data.data.othersEquip
        this.temp.parameter = response.data.data.parameter
        this.temp.picList = response.data.data.picList.reverse()
        this.temp.fileList = response.data.data.fileList.reverse()
        this.temp.equipmentId = response.data.data.equipmentId
        this.temp.id = response.data.data.id
        this.temp.fileName = undefined
        this.temp.filePath = undefined
        this.temp.folderList = []
      })
      this.dialogStatus = 'updatepj'
      this.nowImage = undefined
      this.nowFile = undefined
      this.dialogVisible = true
      this.chooseShow = true
      this.$nextTick(() => {
        this.$refs['dataFormpj'].clearValidate()
      })
    },
    // 编辑配件提交
    updateDatapj() {
      this.$refs['dataFormpj'].validate(valid => {
        if (valid) {
          this.listLoading = true
          const tempData = Object.assign({}, this.temp)
          updateArticle(tempData).then(response => {
            const msg = response.data.msg
            if (response.data.code === 200) {
              // for (const v of this.tableData) {
              //   if (v.id === this.temp.id) {
              //     const index = this.tableData.indexOf(v)
              //     this.tableData.splice(index, 1, this.temp)
              //     break
              //   }
              // }
              this.getTree()
              this.getList()
              this.dialogVisible = false
              this.$message({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 3000
              })
              this.listLoading = false
            } else {
              this.$notify({
                title: '警告',
                message: msg,
                type: 'warning',
                duration: 3000
              })
              this.listLoading = false
            }
          })
        }
      })
    },
    // 图片上传
    imageUpload(e) {
      const file = e.target.files[0]
      const fileData1 = {
        fileName: undefined,
        filePath: undefined
      }
      if (file != null) {
        this.listLoading = true
        const param = new FormData() // 创建form对象
        param.append('file', file, file.name) // 通过append向form对象添加数据
        fileData1.fileName = file.name
        uploadlist(param).then(resp => { // 调用上传接口
          if (resp.data.code == 200) {
            fileData1.filePath = resp.data.data.remoteFilename
            this.nowImage = fileData1.fileName
            // fileData1.fileUrl = resp.data.data.fileUrl
            this.temp.fileName = fileData1.fileName
            this.temp.filePath = fileData1.filePath
            this.$message({
              title: '成功',
              message: '上传成功',
              type: 'success',
              duration: 2000
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
        fileName: undefined,
        filePath: undefined,
        sparePartsCode: this.temp.sparePartsCode
      }
      if (file != null) {
        this.listLoading = true
        const param = new FormData() // 创建form对象
        param.append('file', file, file.name) // 通过append向form对象添加数据
        fileData1.fileName = file.name
        uploadlist(param).then(resp => { // 调用上传接口
          if (resp.data.code == 200) {
            fileData1.filePath = resp.data.data.remoteFilename
            this.nowFile = fileData1.fileName
            // fileData1.fileUrl = resp.data.data.fileUrl
            this.temp.folderList = []
            this.temp.folderList.push(fileData1)
            this.$message({
              title: '成功',
              message: '上传成功',
              type: 'success',
              duration: 2000
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
    imageDelete(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const find = {
          id: row.id
        }
        deleteFileById(find).then(response => {
          if (response.data.code === 200) {
            const index = this.temp.picList.indexOf(row)
            this.temp.picList.splice(index, 1)
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
    fileDelete(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const find = {
          id: row.id
        }
        deleteFileById(find).then(response => {
          if (response.data.code === 200) {
            const index = this.temp.fileList.indexOf(row)
            this.temp.fileList.splice(index, 1)
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
    lookImage(row) {
      this.imageData = null
      this.lookDialogVisible = true
      this.imageData = row.filePath
      // document.getElementById('lookPic').src = this.imageData
    }
  }
}
</script>

<style>
.formSearch {
    width:100%;
    background:#fafafa;
    border: 1px solid #e9e9e9;
    border-radius: 3px;
    padding: 18px 10px 0;
    margin-bottom: 10px;
}
.drag-handler{
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.el-tree-node__content:hover {
  background-color: #6dc6fa;
  border-radius:3%
} 
.look-detail {
    text-decoration:underline;
    cursor: pointer;
}
.tree {
  margin-top:15px;
}
.tree li {
  cursor: pointer;
  padding-left: 1.3em;
}
.tree ul {
  list-style: none;
  padding-left: 0;
}
.tree li .routeName {
  height: 30px;
  padding: 5px;
  position:relative
}
.tree li .routeName .change{
  position:absolute;
  width:200px;
}
.tree li .routeName:hover{
  background:#6dc6fa
}
#lookPic {
  width: 100%;
}
</style>
