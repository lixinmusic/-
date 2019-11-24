<template>
  <div class="app-container">
    <!--外部容器 -->
    <el-container> 
      <el-aside style="border:1px solid #f0f0f0;padding-top:20px;" width="220px">
        <el-tree                       
          :data="equipData" 
          ref="tree"
          node-key="categoryCode"
          :props="defaultProps" 
          check-strictly
          show-checkbox 
          @check-change="handleClick"
          @node-click="handleNodeClick"
          :render-content="renderContent">
        </el-tree>
      </el-aside>
      <!-- 内容容器 -->
      <el-container>
        <!-- 主要区域容器 -->
        <el-main style="padding-top:0;">
          <el-button size="mini" style="margin: 10px 10px;" type="primary" v-waves icon="el-icon-plus" @click="handleCreate" v-if="addShow">新增</el-button>
          <el-table :key='tableKey' :data="listData" height='200' v-loading="listLoading" border fit highlight-current-row
            style="width:100%;min-height:500px;margin-top:8px" :header-cell-style="{background:'oldlace'}">>
            <el-table-column align="center" prop="equipmentName" label="设备名称" min-width="50">
            </el-table-column>
            <el-table-column align="center" prop="equipmentInstructions" label="设备说明书" min-width="50">
              <template slot-scope="scope">
                <span class="look-detail" @click="handleDetail(item)" v-for="item in scope.row.list_equipmentInstructions" :key="item.id">{{item.fileName}}，
                </span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="equipmentDrawings"  label="设备图纸" min-width="50">
              <template slot-scope="scope">
                <span class="look-detail" @click="handleDetail(item)"  v-for="item in scope.row.list_equipmentDrawings" :key="item.id">{{item.fileName}}，</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="operationRules"  label="操作规则" min-width="50">
              <template slot-scope="scope">
                <span class="look-detail" @click="handleDetail(item)" v-for="item in scope.row.list_operationRules" :key="item.id">{{item.fileName}}，</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="equipmentTechnicianPhone"  label="设备厂家技术员联系方式" min-width="50">
            </el-table-column>
            <el-table-column align="center" label="操作" width="140px" fixed="right">
              <template slot-scope="scope">
                <el-button title="编辑" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-if="editShow"></el-button>
                <el-button title="删除" type="danger" icon="el-icon-delete" size="mini"  @click="deleteHandle(scope.row)" v-if="deleteShow"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
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
        <!-- 弹框 -->
        <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" :visible.sync="dialogFormVisible" 
          v-dialogDrag v-loading="listLoading" width="800px">
          <el-form :rules="rules" ref="dataForm" :model="popData" 
            label-position="right" label-width="120px">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="设备名称：" prop="equipmentName">
                  <el-input v-model="popData.equipmentName" maxlength="32" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="设备名称编码：" prop="equipmentNameCode">
                  <el-input v-model="popData.equipmentNameCode" maxlength="32" disabled>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="使用工厂：" prop="useFactory">
                  <el-input v-model="popData.useFactory"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="使用部门：" prop="useDept">
                  <el-input v-model="popData.useDept"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item label="设备说明书：" prop="equipmentInstructions">
                  <input id="uploadImg1" type="file" @change="fileUpload1">
                </el-form-item>
              </el-col>
              <el-col :span="14">
                <div style="width:400px">
                  <span v-for="item in popData.list_equipmentInstructions" :key="item.id" style="padding:5px;">{{item.fileName}}</span>
                </div>
              </el-col>
            </el-row>
             <el-row>
              <el-col :span="10">
                <el-form-item label="设备图纸：" prop="equipmentDrawings">
                  <input id="uploadImg2" type="file" @change="fileUpload2">
                </el-form-item>
              </el-col>
               <el-col :span="14">
                <div style="width:400px">
                  <span v-for="item in popData.list_equipmentDrawings" :key="item.id" style="padding:5px;">{{item.fileName}}</span>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item label="操作规则：" prop="operationRules">
                  <input id="uploadImg3" type="file" @change="fileUpload3">
                </el-form-item>
              </el-col>
              <el-col :span="14">
                <div style="width:400px">
                  <span v-for="item in popData.list_operationRules" :key="item.id" style="padding:5px;">{{item.fileName}}</span>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="设备厂家技术员联系方式：" prop="equipmentTechnicianPhone">
                  <el-input v-model="popData.equipmentTechnicianPhone" style="padding:20px 0"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="备注：" prop="remarks">
                  <el-input type="textarea" maxlength="128" v-model="popData.remarks"></el-input>
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
        <!-- 生成采购申请单 -->
      <el-dialog title="提示" :close-on-click-modal="false" :visible.sync="centerDialogVisible" width="30%">
        <span class="look-detail" @click="lookFile()">{{dragFileName}}</span>
        <span slot="footer" class="dialog-footer">
          <el-button title="下载" type="primary" size="mini" icon="el-icon-download" @click="fileDown()">下载</el-button>
        </span>
      </el-dialog>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { fetchTree, fetchListByCode, deleteCode, createArticle, fetchDetail, updateArticle, uploadlist } from '@/api/equipDataManage/equipTechnicalData'
import { fetchButton } from '@/api/common/button'
import waves from '@/directive/waves' // 水波纹指令
import { menuList } from '@/store/modules/permission'// 按钮权限
import { baseUrl } from '@/api/common/fileBaseUrl'
export default {
  name: 'equipTechnicalData',
  directives: {
    waves
  },
  data() {
    return {
      // 按钮是否显示
      addShow: false,
      editShow: false,
      deleteShow: false,
      // 设备地址树结构
      i: 0,
      equipData: [],
      defaultProps: {
        children: 'children',
        label: 'categoryName'
      },
      // 表格初始数据
      tableKey: 0,
      listData: null,
      total: null,
      listLoading: false,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        categoryCode: 'SBLX' // 设备编码
      },
      // 弹出框表单数据
      popData: {
        id: undefined,
        equipmentName: undefined,
        equipmentNameCode: undefined,
        equipmentTechnicianPhone: undefined,
        remarks: undefined,
        useDept: undefined,
        useFactory: undefined,
        list_equipmentInstructions: [],
        list_equipmentDrawings: [],
        list_operationRules: []
      },
      // 弹框显示
      centerDialogVisible: false,
      dragFileName: undefined,
      dragFileUrl: undefined,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑设备技术资料',
        create: '新增设备技术资料'
      },
      // 设备名称模糊查询数组
      euipeTypeList: [],
      rules: {
        equipmentName: [{ required: true, message: '该字段不能为空', trigger: 'change' }],
        equipmentNameCode: [{ required: true, message: '该字段不能为空', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getButton()
    this.getTree()
    this.getList()
  },
  methods: {
    renderContent(h, { node, data, store }) {
      return (
        <span>
          <span title={node.label}>{node.label}</span>
        </span>)
    },
    // 查询按钮信息
    getButton() {
      menuList.forEach(item => {
        item.children.forEach(e => {
          if (e.name == 'equipTechnicalData') {
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
    // 请求设备地址树
    getTree() {
      fetchTree().then(response => {
        this.equipData = []
        this.equipData = response.data.data
        for (var i = 0; i < this.equipData.length; i++) {
          this.equipData[i].disabled = true
          for (var j = 0; j < this.equipData[i].children.length; j++) {
            const child = this.equipData[i].children[j]
            child.disabled = true
          }
        }
      })
    },
    // 设置树状图单选
    handleClick(data, checked, node) {
      this.i++
      if (this.i % 2 == 0) {
        if (checked) {
          this.$refs.tree.setCheckedNodes([])
          this.$refs.tree.setCheckedNodes([data])
          // 交叉点击节点
        } else {
          this.$refs.tree.setCheckedNodes([])
          // 点击已经选中的节点，置空
        }
      }
    },
    // 点击设备类型请求表格
    handleNodeClick(data) {
      this.listQuery.categoryCode = data.categoryCode
      this.getList()
    },
    // 表格加载
    getList() {
      this.listLoading = true
      fetchListByCode(this.listQuery).then(response => {
        if (response.data.code === 200) {
          this.listData = response.data.data.list
          this.total = response.data.data.total
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
    // 分页
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    },
    // 删除
    deleteHandle(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const id = row.id
        deleteCode(id).then(response => {
          if (response.data.code === 200) {
            this.getList()
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
    // 清空表单
    resetTemp() {
      this.popData = {
        id: undefined,
        equipmentName: undefined,
        equipmentNameCode: undefined,
        equipmentTechnicianPhone: undefined,
        remarks: undefined,
        useDept: undefined,
        useFactory: undefined,
        list_equipmentInstructions: [],
        list_equipmentDrawings: [],
        list_operationRules: []
      }
    },
    // 新增事件
    handleCreate() {
      this.resetTemp()
      // 获取字典树被选择的节点
      this.treeData = this.$refs.tree.getCheckedNodes()
      if (this.treeData[0] == undefined) {
        this.$notify({
          title: '警告',
          message: '请选中左侧设备',
          type: 'warning',
          duration: 2000
        })
        return
      }
      this.popData.equipmentNameCode = this.treeData[0].categoryCode
      this.popData.equipmentName = this.treeData[0].categoryName
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
          const tempData = Object.assign({}, this.popData)
          createArticle(tempData).then(response => {
            if (response.data.code === 200) {
              this.dialogFormVisible = false
              this.$message({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 3000
              })
              this.getList()
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
    // 编辑事件
    handleUpdate(row) {
      const id = row.id
      fetchDetail(id).then(response => {
        if (response.data.code == 200) {
          this.popData = Object.assign({}, response.data.data)
        } else {
          this.$notify({
            title: '警告',
            message: response.data.msg,
            type: 'warning',
            duration: 2000
          })
        }
      })
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.listLoading = true
          const tempData = Object.assign({}, this.popData)
          updateArticle(tempData).then(response => {
            const msg = response.data.msg
            if (response.data.code === 200) {
              for (const v of this.listData) {
                if (v.id === this.popData.id) {
                  const index = this.listData.indexOf(v)
                  this.listData.splice(index, 1, this.popData)
                  break
                }
              }
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
    // 文件上传
    fileUpload1(e) {
      const file = e.target.files[0]
      const fileData1 = {
        id: 0,
        fileName: undefined,
        fileUrl: undefined,
        type: 1
      }
      if (file != null) {
        this.listLoading = true
        const param = new FormData() // 创建form对象
        param.append('file', file, file.name) // 通过append向form对象添加数据
        fileData1.fileName = file.name
        uploadlist(param).then(resp => { // 调用上传接口
          if (resp.data.code == 200) {
            fileData1.fileUrl = resp.data.data.fileUrl
            this.popData.list_equipmentInstructions.push(fileData1)
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
          const fileInput = document.getElementById('uploadImg1')
          fileInput.value = ''
        })
      }
    },
    // 文件上传
    fileUpload2(e) {
      const file = e.target.files[0]
      const fileData1 = {
        id: 0,
        fileName: undefined,
        fileUrl: undefined,
        type: 2
      }
      if (file != null) {
        this.listLoading = true
        const param = new FormData() // 创建form对象
        param.append('file', file, file.name) // 通过append向form对象添加数据
        fileData1.fileName = file.name
        uploadlist(param).then(resp => { // 调用上传接口
          if (resp.data.code == 200) {
            fileData1.fileUrl = resp.data.data.fileUrl
            this.popData.list_equipmentDrawings.push(fileData1)
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
          const fileInput = document.getElementById('uploadImg2')
          fileInput.value = ''
        })
      }
    },
    fileUpload3(e) {
      const file = e.target.files[0]
      const fileData1 = {
        id: 0,
        fileName: undefined,
        fileUrl: undefined,
        type: 3
      }
      if (file != null) {
        this.listLoading = true
        const param = new FormData() // 创建form对象
        param.append('file', file, file.name) // 通过append向form对象添加数据
        fileData1.fileName = file.name
        uploadlist(param).then(resp => { // 调用上传接口
          if (resp.data.code == 200) {
            fileData1.fileUrl = resp.data.data.fileUrl
            this.popData.list_operationRules.push(fileData1)
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
          const fileInput = document.getElementById('uploadImg3')
          fileInput.value = ''
        })
      }
    },
    handleDetail(row) {
      this.dragFileName = row.fileName
      this.dragFileUrl = row.fileUrl
      this.centerDialogVisible = true
    },
    // 文件下载
    fileDown() {
      window.location.href = this.dragFileUrl + '?attname=' + this.dragFileName
    },
    lookFile() {
      const url = baseUrl + 'onlinePreview?url=' + encodeURIComponent(this.dragFileUrl)
      var winHeight = window.document.documentElement.clientHeight
      window.open(url, '_blank', 'height=' + winHeight + ',top=10,left=10,toolbar=no,menubar=no,scrollbars=yes,resizable=yes')
    }
  }
}
</script>

<style>
.title-header {
    font-size: 16px;
    color: #409eff;
    padding: 8px;
    border-bottom: 1px solid #ddd;
}
.look-detail {
    text-decoration:underline;
    cursor: pointer;
	/* color: #337ab7; */
}
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
</style>
