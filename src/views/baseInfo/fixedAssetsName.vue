<template>
  <div class="app-container">
    <!--外部容器 -->
    <el-container> 
      <el-aside style="border:1px solid #f0f0f0;padding-top:20px;" width="230px">
        <el-tree 
          :data="typeData" 
          ref="tree" 
          show-checkbox 
          node-key="categoryCode"
          :props="defaultProps" 
          check-strictly
          @node-click="handleNodeClick"
          @check-change="handleClick"
          :render-content="renderContent">
        </el-tree>
      </el-aside>
      <!-- 内容容器 -->
      <el-container>
        <el-header style="height:40px;">
          <div class="title-header">
            <span>固定资产名称(设备名称)</span>
              <!-- <span style="margin-left:20px;color:red" prop='parCode'>{{parName}}</span> -->
          </div>
        </el-header> 
        <!-- 主要区域容器 -->
        <el-main style="padding-top:0;">
          <el-button size="mini" style="margin: 10px 10px;" type="primary" v-waves icon="el-icon-plus" @click="handleCreate" v-if="addShow">新增</el-button>
          <el-table :key='tableKey' :data="listData" height='200' v-loading="listLoading" border fit highlight-current-row
            style="width:100%;min-height:500px;margin-top:8px" :header-cell-style="{background:'oldlace'}">>
            <el-table-column prop="categoryName" align="center" label="设备名称" min-width="50">
            </el-table-column>
            <el-table-column prop="categoryCode" align="center" label="设备名称编码" min-width="50">
            </el-table-column>
            <el-table-column prop="parentCategoryName" align="center" label="上级设备类型" min-width="50">
            </el-table-column>
            <el-table-column prop="uTime" align="center" label="修改时间" min-width="50">
            </el-table-column>
            <el-table-column prop="uUser" align="center" label="修改人" min-width="50">
            </el-table-column>
            <el-table-column align="center" label="操作" width="140px">
              <template slot-scope="scope">
                <el-button title="编辑" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-if="editShow"></el-button>
                <el-button title="删除" type="danger" icon="el-icon-delete" size="mini"  @click="deleteHandle(scope.row)" v-if="deleteShow"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
        <!-- 弹框 -->
        <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" :visible.sync="dialogFormVisible" width="60%" v-dialogDrag>
          <el-form :rules="rules" ref="dataForm" :model="popData" 
            label-position="left" label-width="120px">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="设备名称" prop="categoryName">
                  <el-input v-model="popData.categoryName"
                    maxlength="32"
                    placeholder="请输入设备名称">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="设备名称编码" prop="categoryCode">
                  <el-input v-model="popData.categoryCode" maxlength="32" disabled>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="上级设备类型" prop="parentCategoryName">
                  <el-input v-model="popData.parentCategoryName" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="修改时间" prop="uTime">
                  <el-date-picker v-model="popData.uTime" style="width:100%" type="datetime" disabled>
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="修改人" prop="uUser">
                  <el-input v-model="popData.uUser" disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="备注" prop="remark">
                  <el-input type="textarea" maxlength="128" v-model="popData.remark"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">提交</el-button>
            <el-button v-else type="primary" @click="updateData">提交</el-button>
          </div>
        </el-dialog>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { fetchTree, fetchListByCode, deleteCode, createArticle, fetchDetail, updateArticle, checkEquipName } from '@/api/baseInfo/fixedAssetsName'
import { fetchButton } from '@/api/common/button'
import waves from '@/directive/waves' // 水波纹指令
import { menuList } from '@/store/modules/permission'// 按钮权限

export default {
  name: 'fixedAssetsName',
  directives: {
    waves
  },
  data() {
    return {
      // 按钮是否显示
      addShow: false,
      editShow: false,
      deleteShow: false,
      // 设备类型树结构
      typeData: [],
      defaultProps: {
        children: 'childrens',
        label: 'categoryName'
      },
      // 设备选中状态改变时
      i: 0,
      // 表格初始数据
      tableKey: 0,
      listData: null,
      listLoading: false,
      // 父级设备编号
      parCode: 'GDZCLX0001',
      parName: '固定资产类型',
      // 弹出框表单数据
      popData: {
        id: undefined,
        categoryName: undefined,
        categoryCode: undefined,
        parentCategoryCode: undefined,
        parentCategoryName: undefined,
        uTime: undefined,
        uUser: undefined,
        remark: undefined
      },
      oldCategoryName: undefined,
      // 弹框显示
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑固定资产类型',
        create: '新增固定资产类型'
      },
      // 设备树被选中节点
      treeData: null,
      rules: {
        categoryName: [{ required: true, message: '该字段不能为空', trigger: 'change' }]
        // categoryCode: [{ required: true, message: '该字段不能为空', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getButton()
    this.getTree()
    this.getList(this.parCode)
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
          if (e.name == 'fixedAssetsName') {
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
    // 请求设备类型树
    getTree() {
      fetchTree().then(response => {
        this.typeData = []
        this.typeData.push(response.data.data[0])
      })
    },
    // 点击设备类型请求表格
    handleNodeClick(data) {
      this.parCode = data.categoryCode
      this.parName = data.categoryName
      this.getList(this.parCode)
    },
    // 表格加载
    getList(parCode) {
      this.listLoading = true
      const find = {
        categoryCode: parCode
      }
      fetchListByCode(find).then(response => {
        if (response.data.code === 200) {
          this.listData = response.data.data
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

    // 删除设备类型
    deleteHandle(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const find1 = {
          categoryCode: row.categoryCode
        }
        deleteCode(find1).then(response => {
          if (response.data.code === 200) {
            this.getList(this.parCode)
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
    // 获取设备类型树被选择的节点
    getCheckedNodes() {
      this.treeData = this.$refs.tree.getCheckedNodes()
      if (this.treeData[0] == undefined) {
        return
      }
      this.popData.parentCategoryCode = this.treeData[0].categoryCode
      this.popData.parentCategoryName = this.treeData[0].categoryName
    },
    // 清空表单
    resetTemp() {
      this.popData = {
        id: undefined,
        categoryName: undefined,
        categoryCode: undefined,
        parentCategoryCode: undefined,
        parentCategoryName: undefined,
        uTime: undefined,
        uUser: undefined,
        remark: undefined
      }
    },
    // 新增事件
    handleCreate() {
      this.resetTemp()
      this.getCheckedNodes()
      if (this.popData.parentCategoryCode == undefined) {
        this.$notify({
          title: '警告',
          message: '请选中左侧固定资产类型',
          type: 'warning',
          duration: 2000
        })
        return
      }
      if (this.treeData[0].level == 3) {
        this.$notify({
          title: '警告',
          message: '选中设备名称不能新增',
          type: 'warning',
          duration: 2000
        })
        return
      }
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          // 判读名称是否存在
          const find3 = {
            name: this.popData.categoryName
          }
          checkEquipName(find3).then(response => {
            if (response.data.code != 200) {
              this.$notify({
                title: '警告',
                message: response.data.msg,
                type: 'warning',
                duration: 2000
              })
            } else {
              createArticle(this.popData).then(response => {
                if (response.data.code === 200) {
                  this.getList(this.popData.parentCategoryCode)
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
        }
      })
    },
    // 编辑事件
    handleUpdate(row) {
      const find2 = {
        categoryCode: row.categoryCode
      }
      fetchDetail(find2).then(response => {
        this.popData = Object.assign({}, response.data.data)
        this.oldCategoryName = this.popData.categoryName
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
          if (this.oldCategoryName != this.popData.categoryName) {
            // 判读名称是否存在
            const find3 = {
              name: this.popData.categoryName
            }
            checkEquipName(find3).then(response => {
              if (response.data.code != 200) {
                this.$notify({
                  title: '警告',
                  message: response.data.msg,
                  type: 'warning',
                  duration: 2000
                })
              } else {
                this.updateSubmit()
              }
            })
          } else {
            this.updateSubmit()
          }
        }
      })
    },
    // 编辑提交请求
    updateSubmit() {
      const tempData = Object.assign({}, this.popData)
      updateArticle(tempData).then(response => {
        const msg = response.data.msg
        if (response.data.code === 200) {
          this.getList(this.popData.parentCategoryCode)
          this.getTree()
          this.dialogFormVisible = false
          this.$message({
            title: '成功',
            message: '修改成功',
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
.el-tree{
  width: 260px;
}
</style>
