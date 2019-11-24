<template>
  <div class="app-container">
    <el-container>
      <!-- 顶部搜索 -->
      <!-- <el-header> -->
        <div class="formSearch">
          <el-form :inline="true">
            <el-form-item label="模型名称">
              <el-input @keyup.enter.native="handleFilter" class="filter-item input" placeholder="请输入模型名" maxlength="64" v-model="listQuery.name">
              </el-input>
            </el-form-item>
            <el-form-item label="模型key">
              <el-input @keyup.enter.native="handleFilter" class="filter-item input" placeholder="模型key" v-model="listQuery.key">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="filter-item button" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
      <!-- </el-header> -->
      <el-main style="padding:20px 0">
        <el-button class="filter-item" @click="handleCreate" type="primary" icon="el-icon-plus" v-if="addShow">新增</el-button>
        <el-table :key='tableKey' row-key="id" height='500' :data="listData" v-loading="listLoading" border fit highlight-current-row
          style="width:100%;min-height:540px;margin-top:10px" :header-cell-style="{background:'oldlace'}">
          <el-table-column align="center" label="序号" type="index" width="50">
          </el-table-column>
          <el-table-column align="center" label="模型名称" min-width="80">
            <template slot-scope="scope">
              <!-- <router-link 
                :to="{
                  path:'/baseInfo/baseProceNode',
                  params: { 
                    name: 'baseProceNode', 
                    dataObj: this.routMsg
                  },
                  query: {
                    name: 'baseProceNode', 
                    dataObj: this.routMsg
                  }
                }">
                <span class="text-detail">{{scope.row.circuitName}}</span>
              </router-link> -->
              <span class="text-detail" @click="nodeDetail(scope.row)">{{scope.row.circuitName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="circuitKey" align="center" label="模型key" min-width="80">
          </el-table-column>
          <el-table-column align="center" label="操作" width="360px">
            <template slot-scope="scope">
              <el-button title="编辑" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-if="editShow"></el-button>
              <el-button title="删除" type="danger" icon="el-icon-delete" size="mini"  @click="deleteHandle(scope.row)" v-if="deleteShow"></el-button>
              <el-button title="部署流程" size="mini" type="warning" @click="deployeProcess(scope.row)" v-if="deployeShow">部署流程</el-button>
			        <el-button title="流程图" size="mini" type="success" @click="chart(scope.row)" v-if="chartShow">流程图</el-button>
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
            :page-sizes="[5,10,15,20]" 
            :page-size="listQuery.pageSize" 
            layout="total, sizes, prev, pager, next, jumper" 
            :total="total">
          </el-pagination>
        </div>
      </el-footer>
      <!--新增编辑弹出框 -->
      <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" :visible.sync="dialogFormVisible" width="60%">
        <el-form :rules="rules" ref="dataForm" :model="popData" 
          label-position="left" label-width="80px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="模型名称" prop="circuitName">
                  <el-input v-model="popData.circuitName"
                  maxlength="64"
                  placeholder="请输入模型名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="模型key" prop="circuitKey">
                  <el-input v-model="popData.circuitKey"
                  maxlength="32"
                  placeholder="请输入模型key" @blur.prevent="checkKey" :disabled="isDisable"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button v-if="dialogStatus=='create'" type="primary" @click="createData" >提交</el-button>
            <el-button v-if="dialogStatus=='update'" type="primary" @click="updateData">提交</el-button>
        </div>
      </el-dialog>
	    <!-- 流程图弹出框 -->
	    <el-dialog title="流程图" :visible.sync="centerDialogVisible" :close-on-click-modal="false" width="60%">
        <div id="imgcontainer">
          <img id="pic" :src="chartData" />
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="centerDialogVisible=false">确定</el-button>
        </span>
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
import { fetchList, deleteProce, createArticle, fetchKey, fetchDetail, updateArticle, deployeProcess, chartImg } from '@/api/baseInfo/baseProceModel'
import { menuList } from '@/store/modules/permission'
import { fetchButton } from '@/api/common/button'
export default {
  name: 'baseProceModel',
  data() {
    return {
      routMsg: {
        circuitKey: '',
        circuitName: ''
      },
      // 按钮是否显示
      menuCode: undefined,
      addShow: false,
      editShow: false,
      deleteShow: false,
      deployeShow: false,
	    isDisable: false,
	    chartShow: false,
	    centerDialogVisible: false,
	    chartData: null,

      // 表格初始数据
      tableKey: 0,
      listData: [],
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        key: undefined
      },
      popData: {
        id: undefined,
        circuitKey: undefined,
        circuitName: undefined
      },
      // 弹框显示
      dialogFormVisible: false,
      innerVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑流程',
        create: '新增流程'
      },
      rules: {
        circuitName: [{ required: true, message: '模型名称为必填项', trigger: 'change' }],
        circuitKey: [{ required: true, message: '模型key为必填项', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
    this.getButton()
  },
  methods: {
    // 查询按钮信息
    getButton() {
      menuList.forEach(item => {
        item.children.forEach(e => {
          if (e.name == 'baseProceModel') {
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
            } else if (buttons[i].buttonName == '部署流程') {
              this.deployeShow = true
            } else if (buttons[i].buttonName == '流程图') {
			  this.chartShow = true
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
    // 删除事件
    deleteHandle(row) {
      this.$confirm('确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const deleteParam = {
          id: row.id
        }
        deleteProce(deleteParam).then(response => {
          if (response.data.code === 200) {
            const index = this.listData.indexOf(row)
            this.listData.splice(index, 1)
            this.$message({
              type: 'success',
              message: '删除成功!'
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
      this.listData = []
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
      this.listQuery.pageNum = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    },
    // 新增清空弹框
    resetTemp() {
      this.popData = {
        circuitKey: undefined,
        circuitName: undefined
      }
    },
    // 新增事件
    handleCreate() {
      this.isDisable = false
      this.resetTemp()
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
              this.getList()
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
      this.isDisable = true
      // 根据用户编码查询用户信息赋值给表单
      const params1 = {
        id: row.id
      }
      fetchDetail(params1).then(response => {
        this.popData = Object.assign({}, response.data.data)
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
    // 验证circuitKey
    checkKey() {
      const find = {
        key: this.popData.circuitKey
      }
      fetchKey(find).then(response => {
        if (response.data.code === 80001) {
          this.popData.circuitKey = ''
          this.$notify({
            title: '警告',
            message: response.data.msg,
            type: 'warning',
            duration: 2000
          })
        }
      })
    },
    // 选中流程
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 节点配置
    nodeDetail(row) {
      this.routMsg = {
        circuitKey: '',
        circuitName: ''
      }
      this.routMsg.circuitName = row.circuitName
      this.routMsg.circuitKey = row.circuitKey
      this.$router.push({
        path: 'baseInfo/baseProceNode',
        name: 'baseProceNode',
        params: {
          name: 'baseProceNode',
          dataObj: this.routMsg
        }
      })
    },
    // 部署流程
    deployeProcess(row) {
      this.listLoading = true
      const processName = row.circuitKey
      deployeProcess(processName).then(response => {
        if (response.data.code === 200) {
          setTimeout(() => {
            this.listLoading = false
          }, 1 * 500)
          this.$message({
            title: '成功',
            type: 'success',
            message: '流程部署成功!',
            duration: 2000
          })
        } else {
          this.listLoading = false
          this.$notify({
            title: '警告',
            message: '流程部署失败',
            type: 'warning',
            duration: 2000
          })
        }
      })
    },
    // 流程图
    chart(row) {
      const params = {
        processDefinitionKey: row.circuitKey
      }
      chartImg(params).then(response => {
        if (response.data.code != 805) {
          this.centerDialogVisible = true
          this.chartData = response.request.responseURL
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
  width:100%;
  background:#fafafa;
  border: 1px solid #e9e9e9;
  border-radius: 3px;
  padding: 18px 10px 0;
  /* margin-bottom: 10px; */
}
.text-detail {
  text-decoration:underline;
  cursor: pointer
}
.text-detail:hover{
  color:#20a0ff;
}
img{
	width: 100%;
	display: block;
}
</style>
