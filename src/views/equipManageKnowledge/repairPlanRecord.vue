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
          @node-click="handleNodeClick"
          :render-content="renderContent">
        </el-tree>
      </el-aside>
      <!-- 内容容器 -->
      <el-container>
        <el-header style="height:80px;">
          <div class="formSearch">
            <el-form :inline="true">
              <el-form-item label="设备名称">
                <el-select v-model="listQuery.equipmentName"
                  filterable
                  remote
                  placeholder="请输入关键词"
                  :remote-method="getEuipeType"
                  @focus="getFocus">
                  <el-option
                    v-for="item in euipeTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="故障名称">
                <el-input class="filter-item input" placeholder="请输入故障名称" maxlength="32" v-model="listQuery.errorName">
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button class="filter-item button" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-header> 
        <!-- 主要区域容器 -->
        <el-main style="padding-top:0;">
          <el-table :key='tableKey' :data="listData" height='200' v-loading="listLoading" border fit highlight-current-row
            style="width:100%;min-height:500px;margin-top:8px" :header-cell-style="{background:'oldlace'}">>
            <el-table-column align="center" prop="schemeCode" label="方案编号" min-width="80">
            </el-table-column>
            <el-table-column align="center" prop="equipmentName"  label="设备名称" min-width="80">
            </el-table-column>
            <el-table-column align="center" prop="errorName"  label="故障名称" min-width="80">
            </el-table-column>
            <el-table-column align="center" prop="isAddName" label="是否添加" min-width="80">
            </el-table-column>
            <el-table-column align="center" prop="errorDescription" label="故障描述" min-width="100">
            </el-table-column>
            <el-table-column align="center" prop="errorCause"  label="故障原因" min-width="100">
            </el-table-column>
            <el-table-column align="center" prop="handleMode"  label="处置方式" min-width="100">
            </el-table-column>
            <el-table-column align="center" label="操作"  width="80px" fixed="right">
              <template slot-scope="scope">
                <el-button title="编辑" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-if="editShow" 
                :disabled="scope.row.editDisabled?true:false"></el-button>
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
        <el-dialog title="添加到故障库" :close-on-click-modal="false" :visible.sync="dialogFormVisible" v-dialogDrag v-loading="listLoading">
          <el-form :rules="rules" ref="dataForm" :model="popData" 
            label-position="left" label-width="80px">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="厂家故障代码" prop="factoryFaultCode" label-width="110px">
                  <el-input v-model="popData.factoryFaultCode"
                  maxlength="32"
                  placeholder="请输入厂家故障代码"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="内部故障代码" prop="internalFaultCode" label-width="110px">
                  <el-input v-model="popData.internalFaultCode" 
                  maxlength="32" 
                  placeholder="请输入内部故障代码">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="设备名称" prop="equipmentName">
                  <el-input v-model="popData.equipmentName" maxlength="32" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="故障名称" prop="faultName">
                  <el-input v-model="popData.faultName" disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11" style="margin-right:50px;">
                <el-form-item label="故障描述" prop="faultDescribe">
                  <el-input type="textarea" v-model="popData.faultDescribe" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="故障等级" prop="faultGrade">
                  <el-input v-model="popData.faultGrade" maxlength="2" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="1" style="color:red;padding:25px 8px 5px 0px;width:0px">
                <span>*</span>
              </el-col>
              <el-col :span="2">
                <el-form-item label="故障原因" style="padding:20px 3px 0 0">
                </el-form-item>
              </el-col>
              <el-col :span="21">
                <ul style="padding: 0px;">
                  <li style="list-style:none;float:left;width:20%;margin:5px 10px;" v-for="(item, index) in reasonList" :key="index">
                    <el-input type="textarea" maxlength="128" v-model="reasonList[index]"></el-input>
                  </li>
                </ul>
                <span style="color:#409EFF;font-size:16px;display:inline-block;margin-top:10px;" @click.prevent="addRow()"><i class="el-icon-plus"></i></span>
               </el-col>
              <!-- <el-col :span="1" >
                <span style="color:#409EFF;font-size:16px" @click.prevent="addRow()"><i class="el-icon-plus"></i></span>
              </el-col> -->
            </el-row>
            <el-row>
              <el-col :span="1" style="color:red;padding:25px 8px 5px 0px;width:0px">
                <span>*</span>
              </el-col>
              <el-col :span="2">
                <el-form-item label="处置方式" style="padding:20px 3px 0 0">
                </el-form-item>
              </el-col>
              <el-col :span="21">
                <ul style="padding: 0px;">
                  <li style="list-style:none;float:left;width:20%;margin:5px 10px;" v-for="(item1, index) in disposalList" :key="index">
                    <el-input type="textarea" maxlength="128" v-model="disposalList[index]"></el-input>
                  </li>
                </ul>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="updateData">添加</el-button>
          </div>
        </el-dialog>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { fetchTree, fetchList, fetchListByCode, createArticle, fuzzyQuery, isAddById } from '@/api/equipManageKnowledge/repairPlanRecord'
import { fetchButton } from '@/api/common/button'
import waves from '@/directive/waves' // 水波纹指令
import { menuList } from '@/store/modules/permission'// 按钮权限

export default {
  name: 'repairPlanRecord',
  directives: {
    waves
  },
  data() {
    return {
      // 按钮是否显示
      editShow: false,
      // 设备地址树结构
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
        equipmentName: undefined,
        errorName: undefined,
        categoryCode: 'SBLX' // 设备编码
      },
      // 弹出框表单数据
      detailId: undefined,
      popData: {
        id: undefined,
        factoryFaultCode: undefined,
        internalFaultCode: undefined,
        faultReason: undefined,
        disposalMethod: undefined,
        equipmentName: undefined,
        faultName: undefined,
        faultDescribe: undefined,
        faultGrade: undefined,
        remarks: undefined
      },
      reasonList: ['', '', ''],
      disposalList: ['', '', ''],
      // 弹框显示
      dialogFormVisible: false,
      // 设备名称模糊查询数组
      euipeTypeList: [],

      rules: {
        equipmentName: [{ required: true, message: '该字段不能为空', trigger: 'change' }],
        factoryFaultCode: [{ required: true, message: '该字段不能为空', trigger: 'change' }],
        faultDescribe: [{ required: true, message: '该字段不能为空', trigger: 'change' }],
        faultName: [{ required: true, message: '该字段不能为空', trigger: 'change' }],
        faultReason: [{ required: true, message: '该字段不能为空', trigger: 'change' }],
        internalFaultCode: [{ required: true, message: '该字段不能为空', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getButton()
    this.getTree()
    this.getList()
  },
  methods: {
    // 鼠标放上去显示文字
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
          if (e.name == 'repairPlanRecord') {
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
            if (buttons[i].buttonName == '编辑') {
              this.editShow = true
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
      })
    },
    // 设备类型下拉框获取焦点
    getFocus() {
      this.euipeTypeList = []
      this.listQuery.equipmentName = ''
    },
    // 获取设备名称模糊查询数组
    getEuipeType(query) {
      if (query !== '') {
        this.euipeTypeList = []
        fuzzyQuery(query).then(response => {
          if (response.data.code === 200) {
            this.euipeTypeList = response.data.data.results.map(item => {
              return { value: item.categoryName, label: item.categoryName }
            })
          }
        })
      } else {
        this.euipeTypeList = []
      }
    },
    // 点击设备类型请求表格
    handleNodeClick(data) {
      this.listQuery.equipmentName = undefined
      this.listQuery.errorName = undefined
      this.listQuery.categoryCode = data.categoryCode
      this.listQuery.pageNum = 1
      this.getList()
    },
    // 表格加载
    getList() {
      this.listLoading = true
      if (this.listQuery.categoryCode != undefined) {
        fetchListByCode(this.listQuery).then(response => {
          if (response.data.code === 200) {
            this.listData = response.data.data.list
            if (this.listData.length != 0) {
              for (var i = 0; i < this.listData.length; i++) {
                if (this.listData[i].isAdd == 1 && this.listData[i].isAlreadyAdd == 0) {
                  this.listData[i].editDisabled = false
                } else {
                  this.listData[i].editDisabled = true
                }
              }
            }
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
      } else if (this.listQuery.categoryCode == undefined) {
        fetchList(this.listQuery).then(response => {
          if (response.data.code === 200) {
            this.listData = response.data.data.list
            if (this.listData.length != 0) {
              for (var i = 0; i < this.listData.length; i++) {
                if (this.listData[i].isAdd == 1 && this.listData[i].isAlreadyAdd == 0) {
                  this.listData[i].editDisabled = false
                } else {
                  this.listData[i].editDisabled = true
                }
              }
            }
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
      }
    },
    // 搜索
    handleFilter() {
      this.listQuery.categoryCode = undefined
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
    // 表单里新增
    addRow() {
      var list = ''
      var list1 = ''
      this.reasonList.push(list)
      this.disposalList.push(list1)
    },
    // 编辑事件
    handleUpdate(row) {
      this.detailId = row.detailId
      this.popData.faultName = row.errorName
      this.popData.equipmentName = row.equipmentName
      this.popData.faultDescribe = row.errorDescription
      this.reasonList = row.errorCause.split('##')
      this.disposalList = row.handleMode.split('##')
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      var reasonList2 = []
      var disposalList2 = []
      for (var i = 0; i < this.reasonList.length; i++) {
        if (this.reasonList[i] != '') {
          for (var j = 0; j < this.disposalList.length; j++) {
            if (this.disposalList[i] == '') {
              this.$notify({
                title: '警告',
                message: '处置方式为必输项',
                type: 'warning',
                duration: 3000
              })
              return
            }
          }
        }
      }
      // 遍历故障原因数组
      this.reasonList.forEach(item => {
        if (item !== '') {
          reasonList2.push(item)
        }
      })
      if (reasonList2.length == 0) {
        this.$notify({
          title: '警告',
          message: '故障原因为必输项',
          type: 'warning',
          duration: 3000
        })
        return
      }
      // 遍历处置方式数组
      this.disposalList.forEach(item => {
        if (item !== '') {
          disposalList2.push(item)
        }
      })
      if (disposalList2.length == 0) {
        this.$notify({
          title: '警告',
          message: '处置方式为必输项',
          type: 'warning',
          duration: 3000
        })
        return
      }
      this.reasonList = reasonList2
      this.disposalList = disposalList2
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.listLoading = true
          this.popData.faultReason = this.reasonList.join('##')
          this.popData.disposalMethod = this.disposalList.join('##')
          const tempData = Object.assign({}, this.popData)
          createArticle(tempData).then(response => {
            const msg = response.data.msg
            if (response.data.code === 200) {
              const id = this.detailId
              isAddById(id).then(response => {
                if (response.data.code === 200) {
                  for (const v of this.listData) {
                    if (v.id === this.popData.id) {
                      const index = this.listData.indexOf(v)
                      this.listData.splice(index, 1, this.popData)
                      break
                    }
                  }
                  this.getList()
                  this.dialogFormVisible = false
                  this.$message({
                    title: '成功',
                    message: '更新成功',
                    type: 'success',
                    duration: 3000
                  })
                  this.listLoading = false
                }
              })
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
</style>
