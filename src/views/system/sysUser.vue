<template>
  <div class="app-container">
    <el-container>
      <el-header>
        <div class="formSearch">
          <el-form :inline="true">
            <el-form-item label="用户名">
              <el-input @keyup.enter.native="handleFilter" class="filter-item input" placeholder="请输入用户名" maxlength="64" v-model="listQuery.userName">
              </el-input>
            </el-form-item>
            <el-form-item label="关联人员">
              <el-input @keyup.enter.native="handleFilter" class="filter-item input" placeholder="请输入关联人员" v-model="listQuery.perName">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="filter-item button" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-header>
      <el-main>
        <el-button class="filter-item" style="margin: 10px 10px;" @click="handleCreate" type="primary" icon="el-icon-plus" v-if="addShow">新增</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" @click="resetPassword" type="warning" icon="el-icon-edit" v-if="passWordShow">密码重置</el-button>
        <!-- 表格部分 -->
        <el-table :key='tableKey' height='500' :data="listData" v-loading="listLoading" border fit highlight-current-row
          style="width: 100%;min-height:500px;margin-top:8px"
          ref="multipleTable" 
          @select="handleSelect"
          @selection-change="handleSelectionChange"
          :header-cell-style="{background:'oldlace'}">
          <el-table-column align="center" type="selection" min-width="50">
          </el-table-column>
          <!--<el-table-column align="center" type="index" label="序号" min-width="100">
            <template slot-scope="scope">
              <span>{{scope.row.id}}</span>
            </template>
          </el-table-column> -->
          <el-table-column prop="userName" align="center" label="用户名" min-width="50">
            <template slot-scope="scope">
              <span class="text-detail" @click="handleDetail(scope.row)">{{scope.row.userName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="perName" align="center" label="关联人员" min-width="50">
          </el-table-column>
          <el-table-column prop="workNumber" align="center" label="工号" min-width="50">
          </el-table-column>
          <el-table-column align="center" label="是否可用" min-width="50">
            <template slot-scope="scope">
              <span>{{scope.row.isEnable==1?"是":"否"}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="角色管理" min-width="60">
            <template slot-scope="scope">
              <span>{{scope.row.roleNames.toString()}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="discription" align="center" label="用户描述" min-width="80">
          </el-table-column>
          <el-table-column align="center" label="操作" width="200px" fixed="right">
              <template slot-scope="scope">
              <el-button title="编辑" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-if="editShow"></el-button>
              <el-button title="删除" type="danger" icon="el-icon-delete" size="mini"  @click="deleteHandle(scope.row)" v-if="deleteShow"></el-button>
              <el-button title="替换" type="success" icon="el-icon-refresh" size="mini"  @click="replaceHandle(scope.row)" v-if="replaceShow"></el-button>
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
      <!--新增编辑弹出框 -->
      <el-dialog :close-on-click-modal="false" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="60%" v-dialogDrag v-loading="listLoading">
        <el-form :rules="rules" ref="dataForm" :model="popData" 
          label-position="left" label-width="80px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="用户名" prop="userName">
                <el-input v-model="popData.userName"
                  maxlength="64"
                  placeholder="请输入用户名" :disabled="!chooseShow"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9" style="padding-right:0px;">
              <el-form-item label="关联人员" prop="perName">
                <el-input v-model="popData.perName" disabled
                  maxlength="10"
                  placeholder="请选择关联人员"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3" style="padding-left:0px;"> 
              <el-button type="primary" @click="handleChoose" :disabled="!chooseShow">选择</el-button>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="工号" prop="workNumber">
                <el-input disabled v-model="popData.workNumber"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否启用" prop="isEnable">
                <el-radio v-model="popData.isEnable" label="1" :disabled="!chooseShow">是</el-radio>
                <el-radio v-model="popData.isEnable" label="0" :disabled="!chooseShow">否</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="用户描述" prop="discription">
                <el-input type="textarea" maxlength="256" v-model="popData.discription" :disabled="!chooseShow"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20" style="padding-right:0px;">
              <el-form-item label="流程代理" prop="useCompanyName">
                <el-input type="textarea" v-model="popData.proxyOrgNames" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" style="padding:0px;">
              <el-button type="primary" @click="changeCompany" :disabled="!chooseShow">选择</el-button>
            </el-col>
            <el-col :span="2" style="padding:0px;">
              <el-button type="primary" @click="deteleCompany" :disabled="!chooseShow">清空</el-button>
            </el-col>
          </el-row>
          <!-- 角色管理 -->
          <el-row>
            <el-col :span="24">
              <el-form-item label="角色管理" prop="roles">
                <el-select v-model="roles" placeholder="请选择角色" multiple filterable>
                  <el-option
                    v-for="item in options"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code">
                  </el-option>
                </el-select>
                <p v-show="false">{{ roles }}</p>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 执行范围 -->
          <el-row>
            <el-col :span="24"> 
              <el-form-item label="执行范围" prop="orgCode"> 
                <el-tree :data="orgData1"
                  ref="orgtree" 
                  show-checkbox
                  node-key="orgCode"
                  check-strictly
                  :default-expanded-keys="expandedData"
                  :default-checked-keys="checkedData"
                  :props="defaultProps"
                  @check="clickDeal">
                </el-tree>
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
      <el-dialog width="40%" title="组织" :visible.sync="companyVisible" :close-on-click-modal="false" v-dialogDrag >
        <el-container>
          <el-aside width="500px">
            <!-- <span style="margin-left:20px;color:red">{{popData.proxyOrgNames}}</span> -->
            <el-tree
             :data="companyData"
             :props="defaultProps"
             ref="comtree"
             show-checkbox
             node-key='orgCode'
             check-strictly
             v-loading="treeLoading"
             default-expand-all></el-tree>
          </el-aside>
        </el-container>
        <div slot="footer" class="dialog-footer">
          <el-button @click="companyVisible = false" type="default">取消</el-button>
          <el-button type="primary" @click="handleClickCompany">确定</el-button>
        </div>
      </el-dialog>
      <!-- 选择关联人员弹框 -->
      <el-dialog width="60%" :title="textMapPer[dialogStatusPer]" :close-on-click-modal="false" :visible.sync="innerVisiblePerson" append-to-body v-dialogDrag>
        <el-container>
          <el-header>
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
          </el-header>
          <el-container>
            <el-aside width="300px">
              <h4>组织</h4>
              <el-tree :data="orgData" :props="defaultProps" @node-click="handleNodeClick" v-loading="treeLoading" style="width:380px;height:500px;"></el-tree>
            </el-aside>
            <el-main>
              <el-table height='500' :data="orgListData" v-loading="listLoading" border fit highlight-current-row
                style="width: 100%;min-height:500px;margin-top:8px">
                <el-table-column prop="orgName" align="center" label="部门" min-width="50">
                </el-table-column>
                <el-table-column prop="perName" align="center" label="人员" min-width="50">
                </el-table-column>
                <el-table-column align="center" label="工号" min-width="50">
                  <template slot-scope="scope">
                    <a class="text-detail" @click="chooseData(scope.row)"  v-if="dialogStatusPer=='releva'">{{scope.row.workNumber}}</a>
                    <a class="text-detail" @click="chooseReplace(scope.row)"  v-if="dialogStatusPer=='replace'">{{scope.row.workNumber}}</a>
                  </template>
                </el-table-column>
              </el-table>
            </el-main>
          </el-container>
        </el-container>
        <div slot="footer" class="dialog-footer">
          <el-button @click="innerVisiblePerson = false">取消</el-button>
        </div>
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
import { fetchList, chooseRole, fetchDetail, deleteUser, createArticle, updateArticle, updatePassword, checkUserName, replacePerson } from '@/api/system/sysUser'
import { fetchComTree, fetchChooseTree, choosePersonList } from '@/api/common/common'
import { fetchButton } from '@/api/common/button'
import { isvalidUsername } from '@/utils/validate'
import { menuList } from '@/store/modules/permission'// 按钮权限

export default {
  name: 'sysUser',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    return {
      // 按钮是否显示
      addShow: false,
      passWordShow: false,
      editShow: false,
      deleteShow: false,
      replaceShow: false,
      chooseShow: true, // 选择按钮
      // 用户id
      userId: undefined,
      // 表格初始数据
      tableKey: 0,
      listData: null,
      total: null,
      listLoading: false,
      treeLoading: false,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        perName: undefined
      },
      popData: {
        userName: '',
        perName: undefined,
        workNumber: undefined,
        isEnable: undefined,
        discription: undefined,
        roleCode: undefined,
        orgCode: undefined,
        oldUserName: undefined,
        oldWorkNumber: null,
        userCode: undefined,
        proxyOrgCode: undefined, // 流程代理
        proxyOrgs: undefined,
        proxyOrgNames: undefined
      },
      listQuery1: {
        pageNum: 1,
        pageSize: 1000,
        perName: undefined,
        workNumber: undefined
      },
      // 弹框显示
      dialogFormVisible: false,
      innerVisiblePerson: false,
      dialogStatus: '',
      textMap: {
        update: '编辑用户',
        create: '新增用户',
        detail: '查看用户'
      },
      dialogStatusPer: '',
      textMapPer: {
        releva: '选择关联人员',
        replace: '选择替换人员'
      },
      oldUserId: undefined,
      rules: {
        userName: [{ required: true, trigger: 'change', validator: validateUsername }],
        perName: [{ required: true, message: '关联人员为必填项', trigger: 'change' }],
        workNumber: [{ required: true, message: '工号为必填项', trigger: 'change' }],
        isEnable: [{ required: true, message: '是否可用为必填项', trigger: 'change' }]
      },
      // 流程代理公司
      companyVisible: false,
      companyData: [],
      getCompanyCode: [],
      getCompanyName: [],
      proxyData: [],
      // 角色管理下拉框
      options: null,
      // 角色编号数组
      roles: [],
      roleNames: [],
      // 组织树结构
      orgData: [],
      orgData1: [],
      defaultProps: {
        children: 'children',
        label: 'orgFullName'
      },
      // 组织树默认展开选中数组
      expandedData: null,
      checkedData: null,
      // 被选中的组织编号数组
      orgs: [],
      // 组织树表格数据
      orgListData: null,
      // 选中的用户信息数组
      selectionArr: [],
      multipleSelection: null,
      checkedIndex: ''
    }
  },
  filters: {
  },
  created() {
    this.getList()
    this.getButton()
  },
  methods: {
    // 选择使用公司
    changeCompany() {
      this.proxyData = []
      if (this.popData.proxyOrgCode != '' && this.popData.proxyOrgCode != undefined && this.popData.proxyOrgCode != null) {
        this.proxyData = this.popData.proxyOrgCode.split(',')
      }
      this.treeLoading = true
      this.companyVisible = true
      this.getCompanyCode = []
      this.getCompanyName = []
      this.companyData = []
      fetchComTree().then(response => {
        if (response.data.code === 200) {
          this.companyData.push(response.data.data)
          this.$nextTick(() => {
            this.$refs.comtree.setCheckedKeys(this.proxyData)
          })
        }
      })
      setTimeout(() => {
        this.treeLoading = false
      }, 1 * 1000)
    },
    deteleCompany() {
      this.popData.proxyOrgCode = ''
      this.popData.proxyOrgNames = ''
    },
    // 选择公司确认
    handleClickCompany() {
      const treeData1 = this.$refs.comtree.getCheckedNodes()
      for (var i = 0; i < treeData1.length; i++) {
        this.getCompanyCode.push(treeData1[i].orgCode)
        this.getCompanyName.push(treeData1[i].orgFullName)
      }
      this.popData.proxyOrgCode = this.getCompanyCode.join(',')
      this.popData.proxyOrgNames = this.getCompanyName.join(',')
      this.companyVisible = false
    },
    // 查询按钮信息
    getButton() {
      menuList.forEach(item => {
        item.children.forEach(e => {
          if (e.name == 'sysUser') {
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
            } else if (buttons[i].buttonName == '密码重置') {
              this.passWordShow = true
            } else if (buttons[i].buttonName == '替换') {
              this.replaceShow = true
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
        const userCode = row.userCode
        deleteUser(userCode).then(response => {
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
      fetchList(this.listQuery).then(response => {
        if (response.data.code === 200) {
          if (response.data.data != null && response.data.data.list != null) {
            this.listData = response.data.data.list
            this.total = response.data.data.total
          }
          setTimeout(() => {
            this.listLoading = false
          }, 1 * 1000)
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
        proxyOrgCode: undefined, // 流程代理
        proxyOrgs: undefined,
        proxyOrgNames: undefined,
        userName: '',
        perName: undefined,
        workNumber: undefined,
        isEnable: '1',
        discription: undefined,
        roleCode: undefined,
        orgCode: undefined
      }
      this.roles = []
      this.orgData1 = []
      // 组织树默认展开选中数组
      this.expandedData = null
      this.checkedData = null
      this.orgs = []
      this.proxyData = []
    },
    // 新增事件
    handleCreate() {
      this.resetTemp()
      this.chooseShow = true
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      // 查询组织树
      fetchChooseTree().then(response => {
        this.orgData1 = []
        this.orgData1.push(response.data.data)
      })
      // 查询角色下拉
      chooseRole().then(response => {
        this.options = response.data.data
      })
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.getCheckedNodes()
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.popData.roleCode = this.roles.join(',')
          this.popData.orgCode = this.orgs.join(',')
          createArticle(this.popData).then(response => {
            if (response.data.code === 200) {
              // this.listData.unshift(this.popData)
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
      this.listLoading = true
      this.chooseShow = true
      // 根据用户编码查询用户信息赋值给表单
      const userCode = row.userCode
      fetchDetail(userCode).then(response => {
        this.popData.userCode = response.data.data.userCode
        this.popData.userName = response.data.data.userName
        this.popData.perName = response.data.data.perName
        this.popData.workNumber = response.data.data.workNumber
        this.popData.isEnable = response.data.data.isEnable.toString()
        this.popData.discription = response.data.data.discription
        this.popData.oldUserName = response.data.data.userName
        this.popData.oldWorkNumber = response.data.data.workNumber
        // 角色管理默认赋值
        this.roles = response.data.data.roles
        // 组织树默认展开选中
        this.expandedData = response.data.data.orgs
        this.checkedData = response.data.data.orgs
        this.$refs.orgtree.setCheckedKeys(this.checkedData)
        // 流程代理
        // this.proxyData = response.data.data.proxyOrgs
        this.popData.proxyOrgCode = response.data.data.proxyOrgs.join(',')
        this.popData.proxyOrgNames = response.data.data.proxyOrgNames.join(',')
      })
      //  this.popData = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      // 查询组织树
      setTimeout(() => {
        fetchChooseTree().then(response => {
          this.orgData1 = []
          this.orgData1.push(response.data.data)
          this.listLoading = false
        })
      }, 1 * 100)
      // 查询角色下拉
      chooseRole().then(response => {
        this.options = response.data.data
      })
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 获取组织树被选择的节点
    getCheckedNodes() {
      const treeNodes = this.$refs.orgtree.getCheckedNodes()
      this.orgs = []
      for (var i = 0; i < treeNodes.length; i++) {
        this.orgs.push(treeNodes[i].orgCode)
      }
    },
    updateData() {
      this.getCheckedNodes()
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.popData.roleCode = this.roles.join(',')
          this.popData.orgCode = this.orgs.join(',')
          const tempData = Object.assign({}, this.popData)
          updateArticle(tempData).then(response => {
            // for (const v of this.listData) {
            //     if (v.workNumber === this.popData.workNumber) {
            //         const index = this.listData.indexOf(v)
            //         this.listData.splice(index, 1, this.popData)
            //         break
            //     }
            // }
            if (response.data.code === 200) {
              this.getList()
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
    // 选择关联人员
    handleChoose() {
      this.dialogStatusPer = 'releva'
      this.choosePerson()
    },
    // 替换
    replaceHandle(row) {
      this.oldUserId = row.id
      this.dialogStatusPer = 'replace'
      this.choosePerson()
    },
    choosePerson() {
      this.listQuery1 = {
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
        this.orgData = []
        this.orgData.push(response.data.data)
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
      choosePersonList(this.listQuery1).then(response => {
        this.orgListData = response.data.data.list
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 1000)
      })
    },
    // 关联人员提交
    chooseData(row) {
      this.popData.perName = row.perName
      this.popData.workNumber = row.workNumber
      const data = {
        userName: this.popData.userName,
        workNumber: this.popData.workNumber
      }
      if (this.popData.workNumber != this.popData.oldWorkNumber) {
        // 验证用户名和工号
        checkUserName(data).then(response => {
          if (response.data.code === 402) {
            this.$notify({
              title: '警告',
              message: response.data.msg,
              type: 'warning',
              duration: 2000
            })
          }
        })
      }
      this.innerVisiblePerson = false
    },
    // 替换人员提交
    chooseReplace(row) {
      const finds = {
        oldUserId: this.oldUserId,
        workNumber: row.workNumber
      }
      replacePerson(finds).then(response => {
        if (response.data.code === 200) {
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
    },
    // 查看用户详情
    handleDetail(row) {
      this.chooseShow = false
      this.dialogStatus = 'detail'
      this.dialogFormVisible = true
      const userCode = row.userCode
      fetchDetail(userCode).then(response => {
        if (response.data.code === 200) {
          this.popData = Object.assign({}, response.data.data)
          this.popData.isEnable = response.data.data.isEnable.toString()
          this.popData.oldUserName = response.data.data.wordCode
          this.popData.oldWorkNumber = response.data.data.wordCode
          // 角色管理默认赋值
          this.roles = response.data.data.roleNames
          // 组织树默认展开选中
          this.expandedData = response.data.data.orgs
          this.checkedData = response.data.data.orgs
          // 流程代理
          this.popData.proxyOrgNames = response.data.data.proxyOrgNames.join(',')
        } else {
          this.$notify({
            title: '警告',
            message: response.data.msg,
            type: 'warning',
            duration: 3000
          })
        }
      })
      setTimeout(() => {
        fetchChooseTree().then(response => {
          this.orgData1 = []
          this.orgData1.push(response.data.data)
        })
      }, 1 * 100)
    },
    // 弹框表格被选择
    handleSelect(val, row) {
      if (val.length > 1) {
        this.$refs.multipleTable.clearSelection() // 清空所有选择
        val.shift()
        this.$refs.multipleTable.toggleRowSelection(row) //  选中当前选择
      }
      this.selectionArr = val
      this.multipleSelection = row
      this.checkedIndex = val.length
    },
    handleSelectionChange(val) {
      // console.log(val)
      // this.multipleSelection = val
    },
    // 密码重置
    resetPassword() {
      if (this.checkedIndex == 0) {
        this.$message({
          title: '警告',
          message: '请选择要重置的用户',
          type: 'warning',
          duration: 2000
        })
        return
      }
      this.$confirm('确认重置该用户密码吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 获取选中的用户id
        this.userId = this.multipleSelection.id
        setTimeout(() => {
          updatePassword(this.userId).then(response => {
            if (response.data.code === 200) {
              this.$message({
                type: 'success',
                message: '重置密码成功!'
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
        }, 1 * 1000)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消重置密码'
        })
      })
    },
    clickDeal(currentObj, treeStatus) {
      // 用于：父子节点严格互不关联时，父节点勾选变化时通知子节点同步变化，实现单向关联。
      const selected = treeStatus.checkedKeys.indexOf(currentObj.orgCode) // -1未选中
      // 选中
      if (selected !== -1) {
        // 子节点只要被选中父节点就被选中
        this.selectedParent(currentObj)
        // 统一处理子节点为相同的勾选状态
        this.uniteChildSame(currentObj, true)
      } else {
        // 未选中 处理子节点全部未选中
        if (currentObj.children != null) {
          if (currentObj.children.length !== 0) {
            this.uniteChildSame(currentObj, false)
          }
        }
      }
    },
    // 统一处理子节点为相同的勾选状态
    uniteChildSame(treeList, isSelected) {
      this.$refs.orgtree.setChecked(treeList.orgCode, isSelected)
      if (treeList.children != null) {
        for (let i = 0; i < treeList.children.length; i++) {
          this.uniteChildSame(treeList.children[i], isSelected)
        }
      }
    },
    // 统一处理父节点为选中
    selectedParent(currentObj) {
      const currentNode = this.$refs.orgtree.getNode(currentObj)
      if (currentNode.parent.key !== undefined) {
        this.$refs.orgtree.setChecked(currentNode.parent, true)
        this.selectedParent(currentNode.parent)
      }
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
.text-detail {
    text-decoration:underline;
    cursor: pointer
}
.text-detail:hover{
  color:#20a0ff;;
}
.el-tree-node__content:hover {
  background-color: #6dc6fa;
  border-radius:3%
} 
</style>
