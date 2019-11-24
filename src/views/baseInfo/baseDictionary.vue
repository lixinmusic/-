<template>
  <div class="app-container">
    <el-container>
      <el-header style="margin-bottom:30px; padding:0">
        <div class="formSearch">
          <el-form :inline="true">
            <el-form-item label="字典名称">
              <el-input class="filter-item input" placeholder="请输入字典名称" maxlength="32" v-model="listQuery.wordName">
              </el-input>
            </el-form-item>
            <el-form-item label="字典编号">
              <el-input class="filter-item input" placeholder="请输入字典编号" maxlength="32" v-model="listQuery.wordCode">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="filter-item button" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-header>
      <el-container>
        <el-aside style="border:1px solid #f0f0f0" width="220px">
          <el-tree 
            :data="orgData"          
            ref="tree" 
            show-checkbox 
            node-key="wordCode"
            :props="defaultProps" 
            check-strictly
            @node-click="handleNodeClick"
            @check-change="handleClick"
            :render-content="renderContent">
          </el-tree>
        </el-aside>
        <el-container>
        <el-main>
          <el-button size="mini" style="margin: 10px 10px;" type="primary" v-waves icon="el-icon-plus" @click="handleCreate" v-if="addShow">新增</el-button>
          <el-button size="mini" style="margin: 10px 10px;" type="primary" v-waves @click="dragDone" v-if="dragShow">拖拽完成</el-button>
          <!-- 表格部分 -->
          <el-table :key='tableKey' :data="listData" height='200' v-loading="listLoading" border fit highlight-current-row
            style="width:100%;min-height:540px;margin-top:8px" :header-cell-style="{background:'oldlace'}">>
            <!-- <el-table-column align="center" label="字典顺序" min-width="50">
                <template slot-scope="scope">
                <span>{{scope.row.orderNumber}}</span>
                </template>
            </el-table-column> -->
            <el-table-column align="center" label="字典名称" min-width="50">
                <template slot-scope="scope">
                <span>{{scope.row.wordName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="字典编号" min-width="50">
                <template slot-scope="scope">
                <span>{{scope.row.wordCode}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="父级字典" min-width="50">
                <template slot-scope="scope">
                <span>{{scope.row.parName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="描述" min-width="60">
                <template slot-scope="scope">
                <span>{{scope.row.discription}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                <el-button title="编辑" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-if="editShow"></el-button>
                <el-button title="删除" type="danger" icon="el-icon-delete" size="mini"  @click="deleteHandle(scope.row)" v-if="deleteShow"></el-button>
                </template>
            </el-table-column>
            <!-- <el-table-column align="center" label="Drag" width="80">
                <template slot-scope="scope">
                <svg-icon class='drag-handler' icon-class="drag"></svg-icon>
                </template>
            </el-table-column> -->
          </el-table>
          <!-- <div class='show-d'>拖拽前 : &nbsp; {{ oldList}}</div>
          <div class='show-d'>拖拽后 : {{newList}}</div>
          <div class='show-d'>拖拽前 : &nbsp; {{ oldListCode}}</div>
          <div class='show-d'>拖拽后 : {{newListCode}}</div> -->
        </el-main>
        <el-footer>
          <div class="pagination-container" v-if="pageShow">
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
        <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" :visible.sync="dialogFormVisible" v-dialogDrag>
          <el-form :rules="rules" ref="dataForm" :model="popData" label-position="left" label-width="100px">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="textName" prop="wordName">
                  <el-input v-model="popData.wordName"
                    maxlength="32"
                    :placeholder="textName1">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="textCode" prop="wordCode">
                  <el-input v-model="popData.wordCode" 
                    maxlength="32" 
                    :placeholder="textCode1" 
                    :disabled="isDisable">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="父级字典" prop="parCode">
                  <el-input v-model="popData.parName" disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="描述" prop="discription">
                  <el-input type="textarea" maxlength="128" v-model="popData.discription"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button v-if="dialogStatus=='create'|| dialogStatus=='detail'" type="primary" @click="createData">提交</el-button>
            <el-button v-else type="primary" @click="updateData">提交</el-button>
          </div>
        </el-dialog>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { fetchTree, fetchListByCode, fetchList, fetchCode, createArticle, fetchDetail, updateArticle, updateOrder } from '@/api/baseInfo/baseDictionary'
import { fetchButton } from '@/api/common/button'
import waves from '@/directive/waves' // 水波纹指令
import Sortable from 'sortablejs'
import { validateUpperCase } from '@/utils/validate'
import { menuList } from '@/store/modules/permission'// 按钮权限

export default {
  name: 'baseDictionary',
  directives: {
    waves
  },
  data() {
    const validateWordCode = (rule, value, callback) => {
      if (!validateUpperCase(value)) {
        callback(new Error('请输入正确的编号(大写字母)'))
      } else {
        callback()
      }
    }
    return {
      // 按钮是否显示
      addShow: false,
      editShow: false,
      deleteShow: false,
      // 字典树结构
      orgData: [],
      defaultProps: {
        children: 'children',
        label: 'wordName'
      },
      // 字典选中状态改变时
      i: 0,
      // 字典编号是否可输
      isDisable: false,
      // 表格初始数据
      tableKey: 0,
      listData: null,
      total: null,
      listLoading: false,
      listQuery: {
        wordName: undefined,
        wordCode: undefined,
        parCode: undefined,
        pageNum: 1,
        pageSize: 10
      },
      // 父级字典编号
      parCode: undefined,
      // 拖拽是否显示
      dragShow: false,
      // 拖拽页码请求
      dragPage: false,
      pageShow: true,
      sortable: null,
      oldList: [],
      newList: [],
      oldListCode: [],
      newListCode: [],
      // 弹出框表单数据
      popData: {
        orderNumber: undefined,
        wordName: undefined,
        wordCode: undefined,
        parCode: undefined,
        discription: undefined,
        oldWordCode: undefined
      },
      // 弹框显示
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑字典',
        create: '新增字典',
        detail: '新增字典值'
      },
      textName: '',
      textName1: '',
      textCode: '',
      textCode1: '',
      // 字典树被选中节点
      treeData: null,
      rules: {
        wordName: [{ required: true, message: '该字段不能为空', trigger: 'change' }],
        wordCode: [{ required: true, trigger: 'change', validator: validateWordCode }]
      }
    }
  },
  filters: {

  },
  created() {
    this.getList()
    this.getTree()
    this.getButton()
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
          if (e.name == 'baseDictionary') {
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
    // 请求字典树
    getTree() {
      fetchTree().then(response => {
        this.orgData = []
        this.orgData.push(response.data.data)
      })
    },
    // 点击字典请求表格
    handleNodeClick(data) {
      // this.pageShow = false
      this.dragPage = true
      this.dragShow = true
      this.parCode = data.wordCode
      this.listQuery.pageNum = 1
      this.getList1(this.parCode)
    },
    getList1(parCode) {
      const finds = {
        parCode: parCode,
        pageNum: this.listQuery.pageNum,
        pageSize: this.listQuery.pageSize
      }
      fetchListByCode(finds).then(response => {
        this.listData = null
        this.listData = response.data.data.list
        this.total = response.data.data.total
        this.oldList = this.listData.map(v => v.orderNumber)
        this.newList = this.oldList.slice()
        this.oldListCode = this.listData.map(v => v.wordCode)
        this.newListCode = this.oldListCode.slice()
        this.$nextTick(() => {
          this.setSort()
        })
      })
    },
    // 拖拽表格
    setSort() {
      const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // 被拖动元素离开原来位置时原来位置的样式,
        setData: function(dataTransfer) {
          dataTransfer.setData('Text', '')
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
        },
        onEnd: evt => {
          // const targetRow = this.listdata.splice(evt.oldIndex, 1)[0]
          // this.listdata.splice(evt.newIndex, 0, targetRow)

          // // 为了显示更改，您可以在代码中删除
          const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
          this.newList.splice(evt.newIndex, 0, tempIndex)
          const tempIndex1 = this.newListCode.splice(evt.oldIndex, 1)[0]
          this.newListCode.splice(evt.newIndex, 0, tempIndex1)
        }
      })
    },
    // 拖拽完成
    dragDone() {
      const params = {
        parCode: this.parCode,
        wordOrder: this.oldList.join(','),
        wordCodeOrder: this.newListCode.join(',')
      }
      updateOrder(params).then(response => {
        if (response.data.code === 200) {
          this.getTree()
          this.$message({
            title: '成功',
            message: '拖拽成功',
            type: 'success',
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
    },
    // 删除字典事件
    deleteHandle(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const wordCode = row.wordCode
        fetchCode(wordCode).then(response => {
          if (response.data.code === 200) {
            if (this.dragPage == false) {
              this.getList()
            } else {
              this.getList1(this.parCode)
            }
            // const index = this.listData.indexOf(row)
            // this.listData.splice(index, 1)
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
      this.dragShow = false
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
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
        }
      })
    },

    // 搜索
    handleFilter() {
      this.dragPage = false
      this.listQuery.pageNum = 1
      this.getList()
    },
    // 每页条数查询
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      if (this.dragPage == false) {
        this.getList()
      } else {
        this.getList1(this.parCode)
      }
    },
    // 页码查询
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      if (this.dragPage == false) {
        this.getList()
      } else {
        this.getList1(this.parCode)
      }
      // this.getList()
    },
    resetTemp() {
      this.popData = {
        id: undefined,
        wordName: undefined,
        wordCode: undefined,
        parCode: undefined,
        discription: undefined
      }
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
    // 获取字典树被选择的节点
    getCheckedNodes() {
      this.treeData = this.$refs.tree.getCheckedNodes()
      if (this.treeData[0] == undefined) {
        this.$notify({
          title: '警告',
          message: '请选中左侧字典表或字典',
          type: 'warning',
          duration: 3000
        })
        return
      }
      this.popData.parCode = this.treeData[0].wordCode
      this.popData.parName = this.treeData[0].wordName
    },
    // 新增事件
    handleCreate() {
      this.isDisable = false
      this.resetTemp()
      this.getCheckedNodes()
      if (this.treeData[0].children.length == 0 && this.treeData[0].parCode != 'A' && this.treeData[0].wordCode != 'A') {
        this.$notify({
          title: '警告',
          message: '选中字典值不能新增',
          type: 'warning',
          duration: 3000
        })
        return
      }
      if (this.popData.parCode == 'A') {
        this.dialogStatus = 'create'
        this.textName = '字典名称'
        this.textCode = '字典编号'
        this.textName1 = '请输入字典名称'
        this.textCode1 = '请输入字典编号'
      } else {
        this.dialogStatus = 'detail'
        this.textName = '字典值名称'
        this.textCode = '字典值编号'
        this.textName1 = '请输入字典值名称'
        this.textCode1 = '请输入字典值编号'
      }
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createArticle(this.popData).then(response => {
            if (response.data.code === 200) {
              if (this.dragPage == false) {
                this.getList()
              } else {
                this.getList1(this.parCode)
              }
              // this.listData.unshift(this.popData)
              this.getTree()
              this.dialogFormVisible = false
              this.$message({
                title: '成功',
                message: '创建成功',
                type: 'success',
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
        }
      })
    },
    // 编辑事件
    handleUpdate(row) {
      if (row.parCode == 'A' || row.parCode == '') {
        this.textName = '字典名称'
        this.textCode = '字典编号'
        this.textName1 = '请输入字典名称'
        this.textCode1 = '请输入字典编号'
      } else {
        this.textName = '字典值名称'
        this.textCode = '字典值编号'
        this.textName1 = '请输入字典值名称'
        this.textCode1 = '请输入字典值编号'
      }
      // 根据字典编码查询字典信息赋值给表单
      this.isDisable = true
      const wordCode = row.wordCode
      fetchDetail(wordCode).then(response => {
        this.popData = Object.assign({}, response.data.data)
        this.popData.oldWordCode = response.data.data.wordCode
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
          const tempData = Object.assign({}, this.popData)
          updateArticle(tempData).then(response => {
            const msg = response.data.msg
            if (response.data.code === 200) {
              for (const v of this.listData) {
                if (v.wordCode === this.popData.wordCode) {
                  const index = this.listData.indexOf(v)
                  this.listData.splice(index, 1, this.popData)
                  break
                }
              }
              if (this.dragPage == false) {
                this.getList()
              } else {
                this.getList1(this.parCode)
              }
              this.getTree()
              this.dialogFormVisible = false
              this.$message({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 3000
              })
            } else {
              this.$notify({
                title: '警告',
                message: msg,
                type: 'warning',
                duration: 3000
              })
            }
          })
        }
      })
    }
  }
}
</script>
<style>
.sortable-ghost{
  opacity: .8;
  color: #fff!important;
  background: #42b983!important;
}
</style>
<style>
/* .title-header {
    font-size: 20px;
    color: #409eff;
    margin-top: 0;
    padding-bottom: 10px;
    border-bottom: 1px solid #ddd;
} */
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
