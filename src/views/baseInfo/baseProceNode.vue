<template>
  <div class="app-container">
    <el-container>
      <el-main style="padding-top:0;">
        <el-button class="filter-item" style="margin: 10px 10px;" @click="handleCreate" type="primary" icon="el-icon-plus" v-if="addShow">添加节点配置</el-button>
        <!-- 表格部分 -->
        <el-table :key='tableKey' height='500' :data="listData" v-loading="listLoading" border fit highlight-current-row
          style="width: 100%;min-height:500px;margin-top:8px" 
          :header-cell-style="{background:'oldlace'}">
          <!-- <el-table-column align="center" type="selection" min-width="50">
          </el-table-column> -->
          <el-table-column align="center" label="序号" type="index" width="50">
          </el-table-column>
          <!-- <el-table-column align="center" type="index" label="id" min-width="50">
            <template slot-scope="scope">
              <span>{{scope.row.id}}</span>
            </template>
          </el-table-column> -->
          <el-table-column prop="circuitName" align="center" label="流程名称" min-width="80">
          </el-table-column>
          <el-table-column prop="circuitKey" align="center" label="流程key" min-width="80">
          </el-table-column>
          <el-table-column prop="nodeName" align="center" label="节点名称" min-width="80">
          </el-table-column>
          <el-table-column prop="nodeKey" align="center" label="节点key" min-width="80">
          </el-table-column>
          <el-table-column prop="nodeType" align="center" label="节点类型" min-width="80">
            <template slot-scope="scope">
              <span>{{scope.row.nodeType==1?"单人":"多人"}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="260">
              <template slot-scope="scope">
              <el-button title="编辑节点" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)" ></el-button>
              <el-button title="删除节点" type="danger" icon="el-icon-delete" size="mini"  @click="deleteHandle(scope.row)" ></el-button>
              <el-button title="配置人员" style="padding: 10px;" type="warning" @click="staffDetail(scope.row)" >配置人员</el-button>
              </template>
          </el-table-column>
        </el-table>
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
      <!--新增编辑节点弹出框 -->
      <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" :visible.sync="dialogFormVisible" v-dialogDrag v-loading="dragLoading">
        <el-form :rules="rules" ref="dataForm" :model="popData" 
          label-position="left" label-width="80px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="流程名称" prop="circuitName">
                <el-input v-model="popData.circuitName"
                maxlength="64" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="流程key" prop="circuitKey">
                <el-input v-model="popData.circuitKey"
                maxlength="64" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="节点名称" prop="nodeName">
                  <el-input v-model="popData.nodeName"
                  maxlength="64"
                  placeholder="请输入节点名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="节点key" prop="nodeKey">
                  <el-input v-model="popData.nodeKey"
                  maxlength="32"
                  placeholder="请输入节点key" @blur.prevent="checkKey" :disabled="isDisable"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="节点类型" prop="nodeType">
                <el-radio v-model="popData.nodeType" label="1">单人</el-radio>
                <el-radio v-model="popData.nodeType" label="2">多人</el-radio>
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
      <!-- 配置人员 -->
      <el-dialog title="配置人员" :close-on-click-modal="false" :visible.sync="dialogTable" v-dialogDrag width="800px">
        <el-button style="margin: 10px 10px;" @click="addUser" type="primary" icon="el-icon-plus">添加人员</el-button>
        <el-table :data="infoList" height='300' v-loading="listLoading" 
          border fit highlight-current-row
          style="width:100%;min-height:500px;margin-top:8px">
           <!-- <el-table-column align="center" label="id" min-width="90">
            <template slot-scope="scope">
              <span>{{scope.row.id}}</span>
            </template>
          </el-table-column> -->
          <el-table-column prop="companyName" align="center" label="公司" min-width="90">
          </el-table-column>
          <el-table-column prop="parttimeOrgName" align="center" label="被审核部门" min-width="90" v-if="auditOrgShow">
          </el-table-column>
          <el-table-column prop="userName" align="center" label="姓名" min-width="80">
          </el-table-column>
          <el-table-column prop="workNumber" align="center" label="工号" min-width="80">
          </el-table-column>
          <el-table-column prop="orgName" align="center" label="审批人所属组织" min-width="100">
          </el-table-column>
          <el-table-column align="center" label="操作" width="150">
            <template slot-scope="scope">
              <el-button title="编辑" type="primary" size="mini" icon="el-icon-edit" @click="editUser(scope.row)" ></el-button>
              <el-button title="删除" type="danger" icon="el-icon-delete" size="mini"  @click="deleteUser(scope.row)" ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 新增编辑配置人员 -->
        <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" v-dialogDrag v-loading="dragLoading" :visible.sync="innerVisible" width="1000px" append-to-body>
          <el-form :rules="rules1" ref="dataForm" :model="temData" 
            label-position="left" label-width="100px">
            <el-row :gutter="20">
              <el-col :span="10">
                <el-form-item label="公司" prop="companyName">
                  <el-input v-model="temData.companyName" maxlength="64" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="姓名" prop="userName">
                  <el-input v-model="temData.userName" maxlength="32" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4" v-if="!auditOrgShow"> 
                <el-button type="primary">请在下方选择</el-button>
              </el-col>
            </el-row>
            <el-row :gutter="20" v-if="auditOrgShow">
              <el-col :span="16">
                <el-form-item label="被审核部门" prop="parttimeOrgName">
                  <el-input v-model="temData.parttimeOrgName" maxlength="64" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4"> 
                <el-button type="primary">请在下方选择</el-button>
              </el-col>
            </el-row>
          </el-form>
          <el-row :gutter="20">
            <el-col :span="9"><span style="font-size:16px;font-weight:800;float:right;padding:5px;">搜索人员：</span></el-col>
            <el-col :span="15">
              <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="姓名">
                  <el-input v-model="listQuery1.perName" placeholder="请输入姓名">
                  </el-input>
                </el-form-item>
                <el-form-item label="工号">
                  <el-input v-model="listQuery1.workNumber" placeholder="请输入工号">
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" icon="el-icon-search" @click="handlePerson">搜索</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
          <el-container>
            <el-main style="padding:0;">
              <el-row :gutter="20">
                <el-col :span="4" v-if="auditOrgShow">
                  <h4>选择公司</h4>
                  <el-tree :data="companyData"
                   :props="defaultProps" 
                   @node-click="handleNodeClick" 
                   :render-content="renderContent" v-loading="treeLoading">
                  </el-tree>
                </el-col>
                <el-col :span="7" v-if="!auditOrgShow">
                  <h4>选择公司</h4>
                  <el-tree :data="companyData" 
                   :props="defaultProps" 
                   @node-click="handleNodeClick" 
                   :render-content="renderContent" v-loading="treeLoading">
                  </el-tree>
                </el-col>
                <el-col :span="5" v-if="auditOrgShow">
                  <h4>选择被审核部门</h4>
                  <el-tree
                    :data="branchOrgData" 
                    :props="defaultProps"
                    ref="orgtree"
                    show-checkbox 
                    node-key="orgCode"
                    check-strictly
                    @check-change="handleChange" 
                    @check="handleCheck"
                    v-loading="treeLoading" 
                   :render-content="renderContent">
                  </el-tree>
                </el-col>
                <el-col :span="7" v-if="!auditOrgShow">
                  <h4>选择人员</h4>
                  <el-tree :data="orgData" 
                   :props="defaultProps" 
                   @node-click="handleNodeClick1" 
                   :render-content="renderContent" v-loading="treeLoading">
                  </el-tree>
                </el-col>
                <el-col :span="5" v-if="auditOrgShow">
                  <h4>选择人员</h4>
                  <el-tree :data="orgData" 
                   :props="defaultProps" 
                   @node-click="handleNodeClick1" 
                   :render-content="renderContent" v-loading="treeLoading">
                  </el-tree>
                </el-col>
                <el-col :span="10">
                  <el-table height='500' :data="orgListData" v-loading="listLoading" border fit highlight-current-row
                    style="width: 100%;min-height:500px;margin-top:8px">
                    <el-table-column prop="orgName" align="center" label="部门" min-width="60">
                    </el-table-column>
                    <el-table-column prop="perName" align="center" label="人员" min-width="50">
                    </el-table-column>
                    <el-table-column align="center" label="工号" min-width="50">
                      <template slot-scope="scope">
                        <a class="text-detail" @click="chooseData(scope.row)">{{scope.row.workNumber}}</a>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
            </el-main>
          </el-container>
          <div slot="footer" class="dialog-footer">
            <el-button @click="innerVisible = false">取消</el-button>
            <el-button v-if="dialogStatus=='create'" type="primary" @click="createData1" >提交</el-button>
            <el-button v-if="dialogStatus=='update'" type="primary" @click="updateData1">提交</el-button>
          </div>
        </el-dialog>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogTable = false">确认</el-button>
        </div>
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
import { fetchList, fetchPageList, deleteNode, createArticle, fetchKey, fetchDetail, updateArticle,
  fetchUserList, deleteNodeUser, createUser, fetchUser, updateUser, choosePerson } from '@/api/baseInfo/baseProceNode'
import { fetchComTree, fetchChooseTree } from '@/api/common/common'
export default {
  name: 'baseProceNode',
  data() {
    return {
      routMsg: '',
      // 按钮是否显示
      addShow: false,
      isDisable: false,
      pageShow: false,
      auditOrgShow: false, // 被审核部门
      // 表格初始数据
      tableKey: 0,
      listData: null,
      total: null,
      listLoading: true,
      listQuery: {
        // pageNum: 1,
        // pageSize: 10,
        circuitKey: undefined
      },
      dragLoading: false,
      popData: {
        id: undefined,
        circuitKey: undefined,
        circuitName: undefined,
        nodeKey: undefined,
        nodeName: undefined,
        nodeType: '1'
      },
      nodeType: undefined,
      // 弹框显示
      dialogFormVisible: false,
      dialogTable: false,
      innerVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      // 节点人员信息
      infoList: null,
      nodeKey: undefined,
      temData: {
        id: undefined,
        companyName: undefined,
        companyCode: undefined,
        nodeKey: undefined,
        workNumber: undefined,
        userName: undefined,
        parttimeOrgCode: undefined, // 被审核部门
        parttimeOrgName: undefined
      },
      listQuery1: {
        pageNum: 1,
        pageSize: 1000,
        perName: undefined,
        workNumber: undefined
      },
      // 公司树结构
      companyData: [],
      // 组织树结构
      treeLoading: false,
      orgData: [],
      branchOrgData: [],
      i: 0,
      defaultProps: {
        children: 'children',
        label: 'orgFullName'
      },
      orgListData: null,
      rules: {
        nodeName: [{ required: true, message: '节点名称为必填项', trigger: 'change' }],
        nodeKey: [{ required: true, message: '节点key为必填项', trigger: 'change' }],
        nodeType: [{ required: true, message: '节点类型为必填项', trigger: 'change' }]
      },
      rules1: {
        companyName: [{ required: true, message: '公司为必填项', trigger: 'change' }],
        userName: [{ required: true, message: '姓名为必填项', trigger: 'change' }],
        parttimeOrgName: [{ required: true, message: '被审核部门为必填项', trigger: 'change' }]
      }
    }
  },
  activated: function() {
    this.getList()
  },
  created() {
    this.getParams()
    this.getList()
  },
  methods: {
    // 获取处理路由
    getParams() {
      // 取到路由带过来的参数
      const routerParams = this.$route.params.dataObj
      // 将数据放在当前组件的数据内
      this.routMsg = routerParams
    },
    // 删除节点事件
    deleteHandle(row) {
      this.$confirm('确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const deleteParam = {
          id: row.id
        }
        deleteNode(deleteParam).then(response => {
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
      this.listLoading = true
      if (this.routMsg == undefined) {
        this.addShow = false
        this.pageShow = true
        const listQuery = {
          pageNum: 1,
          pageSize: 10
        }
        fetchPageList(listQuery).then(response => {
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
      } else {
        this.addShow = true
        this.pageShow = false
        this.listQuery.circuitKey = this.routMsg.circuitKey
        fetchList(this.listQuery).then(response => {
          if (response.data.code === 200) {
            this.listData = null
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
      }
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
        id: undefined,
        circuitKey: undefined,
        circuitName: undefined,
        nodeKey: undefined,
        nodeName: undefined,
        nodeType: '1'
      }
    },
    // 新增节点事件
    handleCreate() {
      this.isDisable = false
      this.resetTemp()
      this.popData.circuitKey = this.routMsg.circuitKey
      this.popData.circuitName = this.routMsg.circuitName
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.dragLoading = true
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
              this.dragLoading = false
            } else {
              this.$notify({
                title: '警告',
                message: response.data.msg,
                type: 'warning',
                duration: 3000
              })
              this.dragLoading = false
            }
          })
        }
      })
    },
    // 编辑节点事件
    handleUpdate(row) {
      this.isDisable = true
      // 根据用户编码查询用户信息赋值给表单
      const params1 = {
        id: row.id
      }
      fetchDetail(params1).then(response => {
        this.popData = Object.assign({}, response.data.data)
        this.popData.nodeType = this.popData.nodeType.toString()
        this.nodeType = this.popData.nodeType
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
          if (this.nodeType != this.popData.nodeType) {
            this.$notify({
              title: '警告',
              message: '请重新配置人员',
              type: 'warning',
              duration: 3000
            })
          }
          this.dragLoading = true
          // this.popData.circuitName = this.popData.nodeName
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
              this.dragLoading = false
            } else {
              this.$notify({
                title: '警告',
                message: response.data.msg,
                type: 'warning',
                duration: 3000
              })
              this.dragLoading = false
            }
          })
        }
      })
    },
    // 验证nodeKey
    checkKey() {
      const find = {
        key: this.popData.nodeKey
      }
      fetchKey(find).then(response => {
        if (response.data.code === 80001) {
          this.popData.nodeKey = ''
          this.$notify({
            title: '警告',
            message: response.data.msg,
            type: 'warning',
            duration: 2000
          })
        }
      })
    },
    // 选中节点
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 人员配置表格
    staffDetail(row) {
      if (row.nodeType == 1) {
        this.auditOrgShow = false
      } else if (row.nodeType == 2) {
        this.auditOrgShow = true
      }
      this.dialogTable = true
      this.listLoading = true
      this.nodeKey = row.nodeKey
      const find1 = {
        nodeKey: row.nodeKey
      }
      fetchUserList(find1).then(response => {
        if (response.data.code === 200) {
          this.infoList = response.data.data
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
    // 新增人员清空弹框
    resetTemp1() {
      this.temData = {
        id: undefined,
        companyName: undefined,
        companyCode: undefined,
        nodeKey: undefined,
        workNumber: undefined,
        userName: undefined,
        parttimeOrgCode: undefined, // 兼职部门
        parttimeOrgName: undefined
      }
      this.listQuery1 = {
        pageNum: 1,
        pageSize: 1000,
        perName: undefined,
        workNumber: undefined
      }
    },
    // 新增人员
    addUser() {
      this.innerVisible = true
      this.resetTemp1()
      this.temData.nodeKey = this.nodeKey
      this.getTree()
      this.orgListData = null
      this.dialogStatus = 'create'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData1() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          // if(this.auditOrgShow == true){
          //   this.treeData = this.$refs.orgtree.getCheckedNodes() // 获取部门被选择的节点
          //   this.temData.parttimeOrgCode = this.treeData[0].orgCode
          //   this.temData.parttimeOrgName = this.treeData[0].orgFullNam
          // }
          this.dragLoading = true
          createUser(this.temData).then(response => {
            if (response.data.code === 200) {
              const find1 = {
                nodeKey: this.nodeKey
              }
              fetchUserList(find1).then(response => {
                if (response.data.code === 200) {
                  this.infoList = response.data.data
                } else {
                  this.$notify({
                    title: '警告',
                    message: response.data.msg,
                    type: 'warning',
                    duration: 3000
                  })
                }
              })
              this.innerVisible = false
              // this.staffDetail()
              // this.infoList.push(this.temData)
              this.$message({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 3000
              })
              this.dragLoading = false
            } else {
              this.$notify({
                title: '警告',
                message: response.data.msg,
                type: 'warning',
                duration: 3000
              })
              this.dragLoading = false
            }
          })
        }
      })
    },
    // 编辑人员
    editUser(row) {
      const params2 = {
        id: row.id
      }
      fetchUser(params2).then(response => {
        this.temData = Object.assign({}, response.data.data)
      })
      this.listQuery1 = {
        pageNum: 1,
        pageSize: 1000,
        perName: undefined,
        workNumber: undefined
      }
      this.getTree()
      this.orgListData = null
      this.dialogStatus = 'update'
      this.innerVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData1() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          // if(this.auditOrgShow == true){
          //   this.treeData = this.$refs.orgtree.getCheckedNodes() // 获取部门被选择的节点
          //   this.temData.parttimeOrgCode = this.treeData[0].orgCode
          //   this.temData.parttimeOrgName = this.treeData[0].orgFullName
          // }
          this.dragLoading = true
          const tempData = Object.assign({}, this.temData)
          updateUser(tempData).then(response => {
            if (response.data.code === 200) {
              // for (const v of this.infoList) {
              //   if (v.id === this.temData.id) {
              //     const index = this.infoList.indexOf(v)
              //     this.infoList.splice(index, 1, this.temData)
              //     break
              //   }
              // }
              const find1 = {
                nodeKey: this.nodeKey
              }
              fetchUserList(find1).then(response => {
                if (response.data.code === 200) {
                  this.infoList = response.data.data
                } else {
                  this.$notify({
                    title: '警告',
                    message: response.data.msg,
                    type: 'warning',
                    duration: 3000
                  })
                }
              })
              this.innerVisible = false
              this.$message({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 3000
              })
              this.dragLoading = false
            } else {
              this.$notify({
                title: '警告',
                message: response.data.msg,
                type: 'warning',
                duration: 3000
              })
              this.dragLoading = false
            }
          })
        }
      })
    },
    // 删除节点人员
    deleteUser(row) {
      this.$confirm('确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const deleteParam1 = {
          id: row.id
        }
        deleteNodeUser(deleteParam1).then(response => {
          if (response.data.code === 200) {
            const index = this.infoList.indexOf(row)
            this.infoList.splice(index, 1)
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
    // 鼠标放上去显示文字
    renderContent(h, { node, data, store }) {
      return (
        <span>
          <span title={node.label}>{node.label}</span>
        </span>)
    },
    getTree() {
      this.treeLoading = true
      // 查询公司树结构
      fetchComTree().then(response => {
        this.companyData = []
        this.companyData.push(response.data.data)
      })
      // 查询组织树结构
      fetchChooseTree().then(response => {
        this.orgData = []
        this.orgData.push(response.data.data)
        this.branchOrgData = []
        this.branchOrgData.push(response.data.data)
        for (var i = 0; i < this.branchOrgData.length; i++) {
          if (this.branchOrgData[i].orgType == '公司') {
            this.branchOrgData[i].disabled = true
          }
          for (var j = 0; j < this.branchOrgData[i].children.length; j++) {
            const child = this.branchOrgData[i].children[j]
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
        setTimeout(() => {
          this.treeLoading = false
        }, 1 * 1000)
      })
    },
    // 设置部门组织树状图单选
    handleChange(data, checked, node) {
      this.i++
      if (this.i % 2 == 0) {
        if (checked) {
          this.$refs.orgtree.setCheckedNodes([])
          this.$refs.orgtree.setCheckedNodes([data])
          // 交叉点击节点
        } else {
          this.$refs.orgtree.setCheckedNodes([])
          // 点击已经选中的节点，置空
        }
      }
    },
    handleCheck(data, node) {
      this.temData.parttimeOrgCode = data.orgCode
      this.temData.parttimeOrgName = data.orgFullName
    },
    // 组织树点击事件加载表格数据
    handleNodeClick(data) {
      this.temData.companyName = data.orgFullName
      this.temData.companyCode = data.orgCode
    },
    handleNodeClick1(data) {
      this.listLoading = true
      const param = {
        orgCode: data.orgCode,
        pageNum: 1,
        pageSize: 1000
      }
      choosePerson(param).then(response => {
        this.orgListData = response.data.data.list
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 1000)
      })
    },
    handlePerson() {
      this.listLoading = true
      choosePerson(this.listQuery1).then(response => {
        this.orgListData = response.data.data.list
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 1000)
      })
    },
    // 关联人员提交
    chooseData(row) {
      this.temData.userName = row.perName
      this.temData.workNumber = row.workNumber
    }
  },
  watch: {
    // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
    '$route': 'getParams'
  }
}
</script>
<style scoped>
.formSearch {
  width:100%;
  background:#fafafa;
  border: 1px solid #e9e9e9;
  border-radius: 3px;
  padding: 10px 0;
  margin-bottom: 10px;
}
.text-detail {
  text-decoration:underline;
  cursor: pointer
}
.text-detail:hover{
  color:#20a0ff;
}
.el-tree{
  width: 600px;
}
</style>
