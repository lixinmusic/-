<template>
  <div class="app-container">
    <!--外部容器 -->
    <el-container> 
      <el-aside style="border:1px solid #f0f0f0;padding-top:20px;" width="230px">
        <el-tree 
          :data="equipData"      
          ref="tree" 
          show-checkbox 
          node-key="addressCode"
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
            <span>查询结果</span>
            <!-- <span style="margin-left:20px;color:red" prop='parCode'>{{parName}}</span> -->
          </div>
        </el-header> 
        <!-- 主要区域容器 -->
        <el-main style="padding-top:0;">
          <el-button size="mini" style="margin: 10px 10px;" type="primary" v-waves icon="el-icon-plus" @click="handleCreate" v-if="addShow">新增</el-button>
          <el-table :key='tableKey' :data="listData" height='200' v-loading="listLoading" border fit highlight-current-row
            style="width:100%;min-height:500px;margin-top:8px" :header-cell-style="{background:'oldlace'}">>
            <el-table-column align="center" label="地址名称" min-width="50">
              <template slot-scope="scope">
                <span>{{scope.row.addressName}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="地址编码" min-width="50">
              <template slot-scope="scope">
                <span>{{scope.row.addressCode}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="上级名称" min-width="50">
              <template slot-scope="scope">
                <span>{{scope.row.parentAddressName}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="备注" min-width="60">
              <template slot-scope="scope">
                <span>{{scope.row.remark}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
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
                  <el-form-item label="地址名称" prop="addressName">
                    <el-input v-model="popData.addressName"
                      maxlength="32"
                      placeholder="请输入地址名称">
                    </el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="12">
                  <el-form-item label="地址编码" prop="addressCode">
                    <el-input v-model="popData.addressCode" 
                      maxlength="32" 
                      placeholder="请输入地址编码" 
                      :disabled="isDisable">
                    </el-input>
                  </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="上级名称" prop="parentAddressName">
                    <el-input v-model="popData.parentAddressName" disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="是否为末级区域" prop="isEnd">
                    <el-radio v-model="popData.isEnd" label="1" :disabled="isChecked">是</el-radio>
                    <el-radio v-model="popData.isEnd" label="0" :disabled="isChecked">否</el-radio>
                  </el-form-item>
                </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="描述" prop="remark">
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
import { fetchTree, fetchListByCode, deleteCode, createArticle, fetchDetail, updateArticle } from '@/api/baseInfo/baseEquipAddress'
import { fetchButton } from '@/api/common/button'
import waves from '@/directive/waves' // 水波纹指令
import { menuList } from '@/store/modules/permission'// 按钮权限

export default {
  name: 'baseEquipAddress',
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
      equipData: [],
      defaultProps: {
        children: 'children',
        label: 'addressName'
      },
      // 设备地址选中状态改变时
      i: 0,
      // 设备地址编码是否可输
      isDisable: false,
      isChecked: false,
      // 表格初始数据
      tableKey: 0,
      listData: null,
      listLoading: false,
      // 父级地址编码
      parCode: 'sbdzqy',
      parName: '设备地址区域',
      // 弹出框表单数据
      popData: {
        id: undefined,
        addressName: undefined,
        addressCode: undefined,
        parentAddressCode: undefined,
        remark: undefined,
        isEnd: '0'
      },
      // 弹框显示
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑设备地址',
        create: '新增设备地址'
      },
      // 设备地址树被选中节点
      treeData: null,
      rules: {
        addressName: [{ required: true, message: '该字段不能为空', trigger: 'change' }],
        addressCode: [{ required: true, message: '该字段不能为空', trigger: 'change' }],
        // parentAddressName: [{ required: true, message: '该字段不能为空', trigger: 'change' }],
        isEnd: [{ required: true, message: '该字段不能为空', trigger: 'change' }]
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
          if (e.name == 'baseEquipAddress') {
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
        this.equipData.push(response.data.data[0])
      })
    },
    // 点击设备地址请求表格
    handleNodeClick(data) {
      this.parCode = data.addressCode
      this.parName = data.addressName
      this.getList(this.parCode)
    },
    // 表格加载
    getList(parCode) {
      this.listLoading = true
      fetchListByCode(parCode).then(response => {
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
        }
      })
    },

    // 删除设备地址事件
    deleteHandle(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const addressCode = row.addressCode
        deleteCode(addressCode).then(response => {
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
    // 设置树状图单选--节点变化事件
    handleClick(data, checked, node) {
      if (data.isEnd == 1 && this.addShow == true) {
        this.addShow = false
      } else if (data.isEnd == 0 && this.addShow == false) {
        this.addShow = false
      } else {
        this.addShow = true
      }
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
    // 获取设备地址树被选择的节点
    getCheckedNodes() {
      this.treeData = this.$refs.tree.getCheckedNodes()
      if (this.treeData[0] == undefined) {
        return
      }
      this.popData.parentAddressCode = this.treeData[0].addressCode
      this.popData.parentAddressName = this.treeData[0].addressName
      if (this.treeData[0].addressName == '设备地址区域') {
        this.popData.parentAddressName = '-'
      }
    },
    // 清空表单
    resetTemp() {
      this.popData = {
        id: undefined,
        addressName: undefined,
        addressCode: undefined,
        parentAddressCode: undefined,
        isEnd: '0',
        remark: undefined
      }
    },
    // 新增事件
    handleCreate() {
      this.isDisable = false
      this.isChecked = false
      this.resetTemp()
      this.getCheckedNodes()
      if (this.popData.parentAddressCode == undefined) {
        this.$notify({
          title: '警告',
          message: '请选中左侧地址',
          type: 'warning',
          duration: 3000
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
          createArticle(this.popData).then(response => {
            if (response.data.code === 200) {
              this.getList(this.popData.parentAddressCode)
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
      // 根据地址编码查询地址信息赋值给表单
      this.isDisable = true
      this.isChecked = true
      const addressCode = row.addressCode
      fetchDetail(addressCode).then(response => {
        this.popData = Object.assign({}, response.data.data.equipAddress)
        this.popData.isEnd = response.data.data.equipAddress.isEnd.toString()
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
                if (v.id === this.popData.id) {
                  const index = this.listData.indexOf(v)
                  this.listData.splice(index, 1, this.popData)
                  break
                }
              }
              // this.getList(this.popData.parentAddressCode)
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
