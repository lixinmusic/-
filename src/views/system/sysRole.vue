<template>
  <div class="app-container">
    <el-container>
      <!-- <el-header> -->
        <div class="formSearch">
          <el-form :inline="true">
            <el-form-item label="角色名称">
              <el-input class="filter-item input" placeholder="请输入角色名称" maxlength="32" v-model="listQuery.roleName">
              </el-input>
            </el-form-item>
            <el-form-item label="角色编码">
              <el-input class="filter-item input" placeholder="请输入角色编号" maxlength="32" v-model="listQuery.roleCode">
              </el-input>
            </el-form-item>
            <el-form-item label="是否可用" prop="isEnable">
              <el-radio v-model="listQuery.isEnable" label="1">是</el-radio>
              <el-radio v-model="listQuery.isEnable" label="0">否</el-radio>
            </el-form-item>
            <el-form-item>
              <el-button class="filter-item button" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
      <!-- </el-header> -->
      <el-main style="padding:20px 0">
        <el-button size="mini" type="primary" v-waves icon="el-icon-plus" @click="handleCreate" v-if="addShow">新增</el-button>
        <el-table :key='tableKey' row-key="id" height='200' :data="listData" v-loading="listLoading" border fit highlight-current-row
          style="width:100%;min-height:540px;margin-top:8px" :header-cell-style="{background:'oldlace'}">>
          <el-table-column prop="roleCode" align="center" label="角色编码" min-width="50">
          </el-table-column>
          <el-table-column prop="roleName" align="center" label="角色名称" min-width="50">
            <template slot-scope="scope">
              <span class="text-detail" @click="handleDetail(scope.row)">{{scope.row.roleName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="isEnable" align="center" label="是否可用" min-width="50">
            <template slot-scope="scope">
              <span>{{scope.row.isEnable== 1?"是":"否"}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="discription" align="center" label="角色描述" min-width="60">
          </el-table-column>
          <el-table-column align="center" label="操作" width="140px">
              <template slot-scope="scope">
              <el-button title="编辑" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-if="editShow"></el-button>
              <el-button title="删除" type="danger" icon="el-icon-delete" size="mini"  @click="deleteHandle(scope.row)" v-if="deleteShow"></el-button>
              </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <div class="pagination-container">
          <el-pagination background 
          @size-change="handleSizeChange" 
          @current-change="handleCurrentChange" 
          :current-page="listQuery.page" 
          :page-sizes="[5,10,15,20]" 
          :page-size="listQuery.limit" 
          layout="total, sizes, prev, pager, next, jumper" 
          :total="total">
          </el-pagination>
        </div>
      </el-footer>
      <!--新增编辑弹出框 -->
      <el-dialog  :close-on-click-modal="false" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" v-dialogDrag>
        <el-form :rules="rules" ref="dataForm" :model="popData" 
          label-position="left" label-width="90px">
          <el-row :gutter="20">
              <el-col :span="12">
              <el-form-item label="角色编码" prop="roleCode">
                  <el-input v-model="popData.roleCode"
                      maxlength="32"
                      placeholder="自动生成"
                      onkeyup="value=value.replace(/[^A-Z]$/g,'');" disabled>
                  </el-input>
              </el-form-item>
              </el-col>
              <el-col :span="12">
              <el-form-item label="角色名称" prop="roleName">
                  <el-input v-model="popData.roleName" 
                  maxlength="32"
                  placeholder="请输入角色名称"></el-input>
              </el-form-item>
              </el-col>
          </el-row>
          <el-row>
              <el-col :span="24">
                  <el-form-item label="是否启用" prop="isEnable">
                      <el-radio v-model="popData.isEnable" label="1">是</el-radio>
                      <el-radio v-model="popData.isEnable" label="0">否</el-radio>
                  </el-form-item>
              </el-col>
          </el-row>
          <el-row>
              <el-col :span="24">
              <el-form-item label="角色描述" prop="discription">
                  <el-input type="textarea" maxlength="128" v-model="popData.discription"></el-input>
              </el-form-item>
              </el-col>
          </el-row>
          <!-- web角色权限 -->
          <el-row class="rolePurview">
            <el-col :span="5">
                <h4 @click="getWebPurview" class="text-detail">web角色权限</h4>
            </el-col>   
            <el-col :span="19">
              <el-tree :data="webData"
                ref="webtree" 
                show-checkbox 
                node-key="code"
                empty-text="点击展示"
                check-strictly
                :default-expanded-keys="expandedData1"
                :default-checked-keys="checkedData1"
                :props="defaultProps"
                accordion>
              </el-tree>
            </el-col>
          </el-row>
          <!-- pda角色权限 -->
          <el-row class="rolePurview">
            <el-col :span="5">
              <h4 @click="getPdaPurview" class="text-detail">pda角色权限</h4>
            </el-col>
            <el-col :span="19">
              <el-tree :data="pdaData"
                ref="pdatree" 
                show-checkbox 
                node-key="code"
                empty-text="点击展示"
                check-strictly
                :default-expanded-keys="expandedData2"
                :default-checked-keys="checkedData2"
                :props="defaultProps"
                accordion>
              </el-tree>
            </el-col>
          </el-row>
          <!-- app角色权限 -->
          <el-row>
            <el-col :span="5">
              <h4 @click="getAppPurview" class="text-detail">app角色权限</h4>
            </el-col>
            <el-col :span="19">
              <el-tree :data="appData"
                ref="apptree" 
                show-checkbox 
                node-key="code"
                empty-text="点击展示"
                check-strictly
                :default-expanded-keys="expandedData3"
                :default-checked-keys="checkedData3"
                :props="defaultProps"
                accordion>
              </el-tree>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">提交</el-button>
          <el-button v-if="dialogStatus=='update'" type="primary" @click="updateData">提交</el-button>
        </div>
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
import { fetchList, deleteRole, fetchWeb, fetchApp, fetchPda, createArticle, updateArticle } from '@/api/system/sysRole'
import { fetchButton } from '@/api/common/button'
import waves from '@/directive/waves' // 水波纹指令
import { menuList } from '@/store/modules/permission'// 按钮权限

export default {
  name: 'complexTable',
  directives: {
    waves
  },
  data() {
    return {
      // 按钮是否显示
      addShow: false,
      editShow: false,
      deleteShow: false,
      // 表格初始数据
      tableKey: 0,
      listData: null,
      total: null,
      listLoading: true,
      listQuery: {
        roleName: undefined,
        roleCode: undefined,
        isEnable: null,
        type: undefined,
        page: 1,
        limit: 10
      },
      // 弹出框数据
      popData: {
        roleName: undefined,
        roleCode: undefined,
        isEnable: '1',
        discription: undefined,
        pcode: null,
        wcode: null,
        acode: null,
        webStatus: false,
        pdaStatus: false,
        appStatus: false
      },
      // 弹框显示
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑角色',
        create: '新增角色',
        detail: '查看角色详情'
      },
      // 弹框必输项
      rules: {
        roleName: [{ required: true, message: '角色名称为必填项', trigger: 'change' }],
        isEnable: [{ required: true, message: '是否可用为必填项', trigger: 'change' }]
      },
      // 角色权限数组
      webData: null,
      // webData1: null,
      pdaData: null,
      appData: null,
      // web权限树结构
      defaultProps: {
        children: 'childrens',
        label: 'name'
      },
      // web编号数组
      webcode: [],
      // pda编号数组
      pdacode: [],
      // app编号数组
      appcode: [],
      // web组织树默认展开选中数组
      webcodes: null,
      expandedData1: null,
      checkedData1: null,
      // pda组织树默认展开选中数组
      pdacodes: null,
      expandedData2: [],
      checkedData2: [],
      // app组织树默认展开选中数组
      appcodes: null,
      expandedData3: [],
      checkedData3: []
    }
  },
  filters: {

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
          if (e.name == 'sysRole') {
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
    // 删除事件
    deleteHandle(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: row.id
        }
        deleteRole(params).then(response => {
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
      const params = {
        code: this.listQuery.roleCode,
        name: this.listQuery.roleName,
        isEnable: this.listQuery.isEnable,
        pageNum: this.listQuery.page,
        pageSize: this.listQuery.limit
      }
      fetchList(params).then(response => {
        if (response.data.code === 200) {
          this.listData = response.data.data.list
          this.total = response.data.data.total
          setTimeout(() => {
            this.listLoading = false
          }, 1 * 1000)
        }
      })
    },
    // 搜索
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    // 获取web权限
    getWebPurview() {
      const params = {
        roleCode: this.popData.roleCode
      }
      fetchWeb(params).then(response => {
        this.webData = response.data.data.purviewDtos
        if (this.dialogStatus == 'update' || this.dialogStatus == 'detail') {
          this.popData.webStatus = true
          // this.webcodes = response.data.data.codes
          // for (var i = 0; i < this.webcodes.length; i++) {
          //   if ((this.webcodes[i]).slice(0, 2) == 'WB') {
          // this.expandedData1.push(this.webcodes[i])
          // this.checkedData1.push(this.webcodes[i])
          //   }
          // }
          this.expandedData1 = response.data.data.codes
          this.checkedData1 = response.data.data.codes
        }
        // this.webData = [{
        //     name:'web角色权限',
        //     childrens:this.webData1
        //     }
        // ];
      })
    },
    // 获取pda权限
    getPdaPurview() {
      const params = {
        roleCode: this.popData.roleCode
      }
      fetchPda(params).then(response => {
        this.pdaData = response.data.data.purviewDtos
        if (this.dialogStatus == 'update' || this.dialogStatus == 'detail') {
          this.popData.pdaStatus = true
          this.expandedData2 = response.data.data.codes
          this.checkedData2 = response.data.data.codes
          // this.pdacodes = response.data.data.codes
          // for (var i = 0; i < this.pdacodes.length; i++) {
          //   if ((this.pdacodes[i]).slice(0, 2) == 'PB') {
          //     this.expandedData2.push(this.pdacodes[i])
          //     this.checkedData2.push(this.pdacodes[i])
          //   }
          // }
        }
      })
    },
    // 获取app权限
    getAppPurview() {
      const params = {
        roleCode: this.popData.roleCode
      }
      fetchApp(params).then(response => {
        this.appData = response.data.data.purviewDtos
        if (this.dialogStatus == 'update' || this.dialogStatus == 'detail') {
          this.popData.appStatus = true
          this.expandedData3 = response.data.data.codes
          this.checkedData3 = response.data.data.codes
          // this.appcodes = response.data.data.codes
          // for (var i = 0; i < this.appcodes.length; i++) {
          //   if ((this.appcodes[i]).slice(0, 2) == 'AB') {
          //     this.expandedData3.push(this.appcodes[i])
          //     this.checkedData3.push(this.appcodes[i])
          //   }
          // }
        }
      })
    },
    // 新增清空弹框
    resetTemp() {
      this.popData = {
        roleName: undefined,
        roleCode: undefined,
        isEnable: '1',
        discription: undefined,
        pcode: null,
        wcode: null,
        acode: null,
        webStatus: false,
        pdaStatus: false,
        appStatus: false
      }
      // web组织树默认展开选中数组
      this.expandedData1 = null
      this.checkedData1 = null
      // pda组织树默认展开选中数组
      this.expandedData2 = null
      this.checkedData2 = null
      // app组织树默认展开选中数组
      this.expandedData3 = null
      this.checkedData3 = null
      this.webData = []
      this.appData = []
      this.pdaData = []
    },
    // 新增事件
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 获取web权限树被选择的节点
    getCheckedNodes() {
      // 获取web权限树被选择的节点
      const webNodes = this.$refs.webtree.getCheckedNodes()
      for (var i = 0; i < webNodes.length; i++) {
        this.webcode.push(webNodes[i].code)
      }
      // 获取pda权限树被选择的节点
      const pdaNodes = this.$refs.pdatree.getCheckedNodes()
      for (var i = 0; i < pdaNodes.length; i++) {
        this.pdacode.push(pdaNodes[i].code)
      }
      // 获取app权限树被选择的父节点
      const appNodes = this.$refs.apptree.getCheckedNodes()
      for (var i = 0; i < appNodes.length; i++) {
        this.appcode.push(appNodes[i].code)
      }
    },
    getHalfCheckedNodes() {
      // 获取web权限树被选择的父节点
      const webNodes1 = this.$refs.webtree.getHalfCheckedNodes()
      for (var i = 0; i < webNodes1.length; i++) {
        this.webcode.push(webNodes1[i].code)
      }
      // 获取pda权限树被选择的父节点
      const pdaNodes1 = this.$refs.pdatree.getHalfCheckedNodes()
      for (var i = 0; i < pdaNodes1.length; i++) {
        this.pdacode.push(pdaNodes1[i].code)
      }
      // 获取app权限树被选择的父节点

      const appNodes1 = this.$refs.apptree.getHalfCheckedNodes()
      for (var i = 0; i < appNodes1.length; i++) {
        this.appcode.push(appNodes1[i].code)
      }
    },

    createData() {
      this.getCheckedNodes()
      this.getHalfCheckedNodes()
      this.popData.name = this.popData.roleName
      this.popData.wcode = this.webcode
      this.popData.pcode = this.pdacode
      this.popData.acode = this.appcode
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createArticle(this.popData).then(response => {
            if (response.data.code === 200) {
              this.listData.unshift(this.popData)
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
      this.popData = Object.assign({}, row) // copy obj
      this.popData.isEnable = row.isEnable.toString()
      this.dialogStatus = 'update'
      this.webData = []
      this.appData = []
      this.pdaData = []
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.getCheckedNodes()
      this.getHalfCheckedNodes()
      this.popData.name = this.popData.roleName
      this.popData.code = this.popData.roleCode
      this.popData.wcode = this.webcode
      this.popData.pcode = this.pdacode
      this.popData.acode = this.appcode
      const tempData = Object.assign({}, this.popData)
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updateArticle(tempData).then(response => {
            if (response.data.code === 200) {
              for (const v of this.listData) {
                if (v.roleCode === this.popData.roleCode) {
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
    // 查看角色详情
    handleDetail(row) {
      this.dialogStatus = 'detail'
      this.dialogFormVisible = true
      this.webData = []
      this.appData = []
      this.pdaData = []
      this.popData = Object.assign({}, row) // copy obj
      this.popData.isEnable = row.isEnable.toString()
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
    /* margin-bottom: 10px; */
}
.text-detail {
  text-decoration:underline;
  cursor: pointer
}
.text-detail:hover{
  color:#20a0ff;;
}
.rolePurview {
  margin-bottom:20px;
}
.el-tree-node__content:hover {
  background-color: #6dc6fa;
  border-radius:3%
} 
</style>
