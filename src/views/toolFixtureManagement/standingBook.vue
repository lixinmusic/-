<template>
    <div class="app-container">
        <!--外部容器 -->
        <el-container>
            <div class="filter-container">
                <div class="formSearch">
                    <el-form :inline="true">
                        <el-form-item label="夹具名称">
                            <el-input v-model="listQuery.equipmentName" placeholder="请输入夹具名称" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="固定资产编号">
                            <el-input class="minier-input" style="width:196px" v-model="listQuery.fixedAssetCode" placeholder="请输入固定资产编号" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="型号规格">
                            <el-input class="minier-input" style="width:196px" v-model="listQuery.model" placeholder="请输入型号规格" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="资产状态">
                            <el-select v-model="listQuery.equipmentStatus" placeholder="请选择" clearable>
                                <el-option v-for="item in assetStatus" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <!-- 主要区域容器 -->
            <el-main style="padding:20px 0px">
                <el-button class="filter-item" style="margin-left: 10px;" @click="handleExport" type="primary" icon="el-icon-download" v-if="exportShow">导出</el-button>
                <el-table :data="listData" v-loading="listLoading" border fit highlight-current-row style="width: 100%;min-height:auto;margin-top:8px" height="500" :header-cell-style="{background:'oldlace'}" :default-sort="{prop: 'cTime', order: 'descending'}">
                    <el-table-column align="center" label="序号" width="80" type="index"></el-table-column>
                    <el-table-column prop="equipmentName" align="center" label="夹具名称">
                        <template slot-scope="scope">
                            <span class="link-type futiop" @click='look(scope.row)'>{{scope.row.equipmentName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="fixedAssetCode" align="center" label="固定资产编号" min-width="120px">
                    </el-table-column>
                    <el-table-column prop="model" align="center" label="型号规格">
                    </el-table-column>
                    <el-table-column prop="companyName" align="center" label="使用公司">
                    </el-table-column>
                    <el-table-column prop="factoryName" align="center" label="使用工厂">
                    </el-table-column>
                    <el-table-column prop="divisionName" align="center" label="所属车间">
                    </el-table-column>
                    <el-table-column prop="quantity" align="center" label="数量">
                    </el-table-column>
                    <el-table-column prop="equipmentPrice" align="center" label="价值">
                    </el-table-column>
                    <el-table-column prop="manufacturer" align="center" label="制造厂家">
                    </el-table-column>
                    <el-table-column prop="useProcedure" align="center" label="使用工序">
                    </el-table-column>
                    <el-table-column prop="applyLathe" align="center" label="适用车床">
                    </el-table-column>
                    <el-table-column prop="purchaseStorehouseName" align="center" label="采购入库仓库" min-width="120px">
                    </el-table-column>
                    <el-table-column prop="purchaseApplyDate" align="center" label="采购申请时间" min-width="120px">
                    </el-table-column>
                    <el-table-column prop="equipBuySuggest" align="center" label="采购建议">
                    </el-table-column>
                    <el-table-column prop="requirementDeliveryTime" align="center" label="要求交货时间" min-width="120px">
                    </el-table-column>
                    <el-table-column prop="purchasePrice" align="center" label="采购金额">
                    </el-table-column>
                    <el-table-column prop="serialNumber" align="center" label="出厂编号">
                    </el-table-column>
                    <el-table-column prop="openCheckDate" align="center" label="开箱验收日期" min-width="120px">
                    </el-table-column>
                    <el-table-column prop="deliveryNoteNumber" align="center" label="送货单号">
                    </el-table-column>
                    <el-table-column prop="equipmentStatus" align="center" label="资产状态">
                    </el-table-column>
                    <el-table-column align="center" label="操作" min-width="150" fixed="right" class-name="small-padding fixed-width">
                        <template slot-scope="scope">
                            <el-button title="编辑" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-if="editShow"></el-button>
                            <el-button title="删除" type="danger" icon="el-icon-delete" size="mini" @click="deleteBtn(scope.row)" v-if="delShow"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-main>
            <el-footer>
                <div class="pagination-container">
                    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[10,20,50,100]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                    </el-pagination>
                </div>
            </el-footer>
            <!-- 查看 -->
            <el-dialog :close-on-click-modal="false" title="工装夹具台账" v-dialogDrag width="60%" :visible.sync="dialogFormVisible">
                <el-form :rules="rules" v-loading="fromLoading" ref="dataForm" :model="temp" label-width="120px">
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="夹具名称" prop="equipmentName">
                                <el-input v-model="temp.equipmentName" disabled oninput="this.value=this.value.replace(/[^0-9A-z\.]/g,'')"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="固定资产编号" prop="fixedAssetCode">
                                <el-input v-model="temp.fixedAssetCode" :disabled='chooseShow' maxlength="20"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="型号规格" prop="model">
                                <el-input v-model="temp.model" :disabled='chooseShow'></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="使用公司" prop="companyCode">
                                <el-input v-model="temp.companyName" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="使用工厂" prop="factoryCode">
                                <el-input v-model="temp.factoryName" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="所属车间" prop="divisionCode">
                                <el-input v-model="temp.divisionName" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20"> 
                        <el-col :span="8">
                            <el-form-item label="数量" prop="quantity">
                                <el-input v-model="temp.quantity" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="价值" prop="equipmentPrice">
                                <el-input v-model="temp.equipmentPrice" :disabled='chooseShow'></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="采购入库仓库" prop="purchaseStorehouseName">
                                <el-input v-model="temp.purchaseStorehouseName" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="制造厂家" prop="manufacturer">
                                <el-input v-model="temp.manufacturer" :disabled='chooseShow'></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="使用工序" prop="useProcedure">
                                <el-input v-model="temp.useProcedure" :disabled='chooseShow' maxlength="20"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="适用车床" prop="applyLathe">
                                <el-input v-model="temp.applyLathe" :disabled='chooseShow' maxlength="20"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="备注" prop="remark">
                                <el-input type="textarea" maxlength="200" v-model="temp.remark" :disabled='chooseShow'></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="资产状态" prop="equipmentStatus">
                                <el-select v-model="temp.equipmentStatus" disabled style="width:100%">
                                    <el-option v-for="item in assetStatus" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="所在仓库" prop="belongStorehouseName">
                                <el-input v-model="temp.belongStorehouseName" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="采购申请时间" prop="purchaseApplyDate">
                                <el-date-picker style="width:100%" v-model="temp.purchaseApplyDate" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" disabled>
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="采购建议" prop="equipBuySuggest">
                                <el-radio v-model="temp.equipBuySuggest" label="内部制造" disabled>内部制造</el-radio>
                                <el-radio v-model="temp.equipBuySuggest" label="外部制造" disabled>外部制造</el-radio>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="要求交货时间" prop="requirementDeliveryTime">
                                <div class="block">
                                    <el-date-picker style="width:100%" v-model="temp.requirementDeliveryTime" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" disabled>
                                    </el-date-picker>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="7">
                            <el-form-item label="采购金额" prop="purchasePrice">
                                <el-input type="text" v-model="temp.purchasePrice" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="1" style="padding:0px;font-size:20px;font-weight:800;">
                            <span>元</span>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="出厂编号" prop="serialNumber">
                                <el-input v-model="temp.serialNumber" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="开箱验收日期" prop="openCheckDate">
                                <el-date-picker style="width:100%" v-model="temp.openCheckDate" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" disabled>
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="送货单号" prop="deliveryNoteNumber">
                                <el-input v-model="temp.deliveryNoteNumber" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="发票号" prop="invoiceNumber">
                                <el-input v-model="temp.invoiceNumber" :disabled='chooseShow'></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="发票金额" prop="invoice">
                                <el-input v-model="temp.invoice" :disabled='chooseShow'></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="开票时间" prop="invoiceDate">
                                <el-date-picker v-model="temp.invoiceDate" style="width:100%" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :disabled='chooseShow'>
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false" v-if="showpoat1">取消</el-button>
                    <el-button type="primary" @click="updateData" v-if="showpoat2">提交</el-button>
                    <el-button type="primary" @click="dialogFormVisible = false" v-if="showpoat3">返回</el-button>
                </div>
            </el-dialog>
            <!-- 使用公司的弹框 -->
            <el-dialog width="50%" title="使用公司" :close-on-click-modal="false" :visible.sync="treeFormVisible" append-to-body>
                <el-container>
                    <el-aside width="500px">
                        <span style="margin-left:20px;color:red">{{radio}}</span>
                        <el-tree :data="datast" :props="defaultProps" default-expand-all @node-click="handleNodeClick" check-strictly ref="tree" node-key="orgCode" show-checkbox @check-change="handleClick"></el-tree>
                    </el-aside>
                </el-container>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="treeFormVisible = false">取消</el-button>
                    <el-button type="primary" @click="treeFormVisible = false">确认</el-button>
                </div>
            </el-dialog>
            <!-- 所属车间的弹框 -->
            <el-dialog width="40%" title="所属车间" :close-on-click-modal="false" v-loading="listLoad" :visible.sync="treeDepartment" append-to-body>
                <el-container>
                    <el-aside width="500px">
                        <span style="margin-left:20px;color:red">{{yesno}}</span>
                        <el-tree :data="datalisy" :props="terrdef" check-strictly ref="treefrom" node-key="orgCode" show-checkbox @node-click="handleNodeClickst" @check-change="hlsoClick"></el-tree>
                    </el-aside>
                </el-container>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="treeDepartment = false">取消</el-button>
                    <el-button type="primary" @click="treeDepartment = false">确认</el-button>
                </div>
            </el-dialog>
            <!-- 使用工厂的弹框 -->
            <el-dialog width="40%" title="使用工厂" :close-on-click-modal="false" :visible.sync="treeworks" append-to-body>
                <el-container>
                    <el-aside width="500px">
                        <el-tree :data="plantlisy" :props="terrplant" @node-click="handleNodeClickworks" check-strictly ref="treeplisy" node-key="orgCode" show-checkbox highlight-current @check-change="hocheckck"></el-tree>
                    </el-aside>
                </el-container>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="treeworks = false">取消</el-button>
                    <el-button type="primary" @click="treeworks = false">确认</el-button>
                </div>
            </el-dialog>
        </el-container>
    </div>
</template>

<script>
import { fetchList, exportList, deleteById, updateArticle, getDetail, dendrogram, section, works } from '@/api/toolFixtureManagement/standingBook'
import { fetchButton } from '@/api/common/button'
import { menuList } from '@/store/modules/permission' // 按钮权限
export default {
  name: 'standingBook',
  data() {
    var valiortNumber = (rule, value, callback) => {
      if (value) {
        if (/^[0-9]\d*$/.test(value) == false) {
          callback(new Error('请输入数值型'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      tableData: [],
      assetStatus: [
        { value: '1', label: '待接收' },
        { value: '2', label: '完好' },
        { value: '3', label: '维修' },
        { value: '4', label: '报废' },
        { value: '', label: '全部' }
      ],
      radio: '', // 使用公司
      yesno: '', // 所属车间
      listData: [],
      total: null,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        equipmentName: '',
        fixedAssetCode: '',
        model: '',
        equipmentStatus: ''
      },
      temp: {
        id: undefined,
        fixedAssetCode: '',
        invoiceNumber: undefined,
        invoice: undefined,
        invoiceDate: undefined,
        useProcedure: undefined,
        applyLathe: undefined,
        remark: undefined,
        equipmentPrice: undefined,
        model: ''
      },
      // 按钮权限
      exportShow: false, // 导出
      editShow: false, // 编
      delShow: false, // 删

      // 弹框显示
      dialogFormVisible: false,
      popTitle: {},
      dialogStatus: '',
      showpoat1: false,
      showpoat2: false,
      showpoat3: false,
      // 使用公司树的数据
      datast: [],
      defaultProps: {
        children: 'children',
        label: 'orgFullName'
      },
      // 所属车间树的数据
      orgsection: '', // 所属车间的编号
      datalisy: [],
      setlist: [],
      r: 0,
      i: 0,
      terrdef: {
        children: 'children',
        label: 'orgFullName'
      },
      // 使用工厂树的数据
      plantlisy: [],
      terrplant: {
        children: 'children',
        label: 'orgFullName'
      },
      orgsewokes: '',
      postyly: '',
      listLoading: true,
      fromLoading: true,
      listLoad: true,
      treeFormVisible: false, // 使用公司树选择
      treeDepartment: false, // 所属车间树选择
      treeworks: false, // 使用工厂树选择
      chooseShow: false,
      rules: {
        fixedAssetCode: [{ required: true, message: '此项为必填项', trigger: 'change' }],
        equipmentPrice: [{ required: false, validator: valiortNumber, trigger: 'change' }],
        model: [{ required: true, message: '此项为必填项', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
    this.getButton()
  },

  methods: {
    // 按钮的权限
    getButton() {
      menuList.forEach(item => {
        item.children.forEach(e => {
          if (e.name == 'standingBook') {
            this.menuCode = e.code
          }
        })
      })
      const determine = {
        menuCode: this.menuCode,
        type: 'web'
      }
      fetchButton(determine).then(response => {
        if (response.data.code == 200) {
          const authority = response.data.data
          for (var i = 0; i < authority.length; i++) {
            if (authority[i].buttonName == '导出') {
              this.exportShow = true
            } else if (authority[i].buttonName == '编辑') {
              this.editShow = true
            } else if (authority[i].buttonName == '删除') {
              this.delShow = true
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

    // 使用公司清空按钮
    clears() {
      this.radio = ''
      this.listQuery.companyCode = ''
      this.treeFormVisible = false
    },

    // 使用工厂清空按钮
    poacksty() {
      this.listQuery.factoryCode = ''
      this.postyly = ''
      this.treeDepartment = false
    },
    // 所属车间清空按钮
    clearsection() {
      this.yesno = ''
      this.listQuery.divisionCode = ''
      this.treeDepartment = false
    },
    // 表格的接口
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        if (response.data.code == 200) {
          if (response.data.data != null && response.data.data.list != null) {
            this.listData = response.data.data.list
            this.total = response.data.data.total

            this.$nextTick(() => {
              this.listLoading = false
            })
          }
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
    },
    // 导出
    handleExport() {
        const param = {
            equipmentName: '',
            fixedAssetCode: '',
            model: '',
            equipmentStatus: ''
        }
      exportList(param).then(response => {
        if (response.data.code == 200) {
          const exportData = response.data.data
          window.location.href = exportData
        } else if (response.data.code == 400002) {
          this.$notify({
            title: '警告',
            message: response.data.msg,
            type: 'warning',
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
    // 使用公司的树选择按钮
    treestyps() {
      this.treeFormVisible = true
      // 树状图的接口
      this.datast.splice(0)
      dendrogram('').then(response => {
        this.datast.push(response.data.data)
        for (var i = 0; i < this.datast.length; i++) {
          if (this.datast[i].orgType == '部门') {
            this.datast[i].disabled = true
          }
          for (var j = 0; j < this.datast[i].children.length; j++) {
            const child = this.datast[i].children[j]
            if (child.orgType == '部门') {
              child.disabled = true
            }
            if (child.children !== null) {
              for (var p = 0; p < child.children.length; p++) {
                if (child.children[p].orgType == '部门') {
                  child.children[p].disabled = true
                }
              }
            }
          }
        }
      })
    },
    // 使用公司的树选择按钮
    treeco() {
      this.treeFormVisible = true
      this.treestyps()
    },

    // 设置树状图单选
    handleClick(data, checked, node) {
      this.i++
      if (this.i % 1 == 0) {
        if (checked == true) {
          this.$refs.tree.setCheckedNodes([])
          this.$refs.tree.setCheckedNodes([data])
          this.listQuery.companyCode = data.orgCode
          this.radio = data.orgFullName
          this.orgsection = data.orgCode
          // 交叉点击节点
        } else {
          this.$refs.tree.setCheckedNodes([])
          // 点击已经选中的节点，置空
        }
      }
    },
    // 树状图的点击方法
    handleNodeClick(data, checked, node) {},

    // 使用工厂的树   works
    manufactory() {
      this.treeworks = true
      this.plantlisy.splice(0)
      const orgCodes = {
        orgCode: this.orgsection
      }
      works(orgCodes).then(response => {
        this.plantlisy.push(response.data.data)
        for (var i = 0; i < this.plantlisy.length; i++) {
          if (this.plantlisy[i].orgType == '部门') {
            this.plantlisy[i].disabled = true
          }
          for (
            var j = 0;
            j < this.plantlisy[i].children.length;
            j++
          ) {
            const child = this.plantlisy[i].children[j]
            if (child.orgType == '部门') {
              child.disabled = true
            }
            if (child.children !== null) {
              for (var p = 0; p < child.children.length; p++) {
                if (child.children[p].orgType == '部门') {
                  child.children[p].disabled = true
                }
              }
            }
          }
        }
      })
    },
    // 工厂点击选择按钮的弹窗
    manuf() {
      if (this.radio == '') {
        this.$notify({
          title: '提示',
          message: '请选择使用公司',
          type: 'warning',
          duration: 3000
        })
        return
      } else {
        this.treeworks = true
        this.manufactory()
      }
    },

    //  工厂设置树状图单选
    hocheckck(data, checked, node) {
      this.i++
      if (this.i % 1 == 0) {
        if (checked == true) {
          this.checkedIds = data.id
          this.$refs.treeplisy.setCheckedNodes([])
          this.$refs.treeplisy.setCheckedNodes([data])
          this.listQuery.factoryCode = data.orgCode
          this.postyly = data.orgFullName
          this.orgsewokes = data.orgCode
        }
      }
    },

    handleNodeClickworks(data) {

    },

    // 所属车间的树选择按钮
    sectionsty() {
      this.datalisy.splice(0)
      const orgCodest = {
        orgCode: this.orgsewokes
      }
      section(orgCodest).then(response => {
        this.setlist.push(response.data.data)
        this.setlist.children = response.data.data
        this.datalisy = [
          {
            orgFullName: this.postyly,
            children: this.setlist.children,
            orgType: '公司'
          }
        ]

        for (var i = 0; i < this.datalisy.length; i++) {
          if (this.datalisy[i].orgType == '公司') {
            this.datalisy[i].disabled = true
          }
          for (var j = 0; j < this.datalisy[i].children.length; j++) {
            const childsty = this.datalisy[i].children[j]
            if (childsty.orgType == '公司') {
              childsty.disabled = true
            }
            if (childsty.children !== null) {
              for (var p = 0; p < childsty.children.length; p++) {
                const rosyt = childsty.children[p]
                if (rosyt.orgType == '公司') {
                  rosyt.disabled = true
                }
                if (rosyt.children !== null) {
                  for (
                    var k = 0;
                    k < rosyt.children.length;
                    k++
                  ) {
                    const postdis = rosyt.children[k]
                    if (postdis.orgType == '公司') {
                      postdis.disabled = true
                    }
                  }
                }
              }
            }
          }
        }
      })
    },

    treesection() {
      if (this.postyly == '') {
        this.$notify({
          title: '提示',
          message: '请选择使用工厂',
          type: 'warning',
          duration: 3000
        })
        return
      } else {
        this.treeDepartment = true
        this.sectionsty()
      }
    },
    hlsoClick(data, checked, node) {
      this.r++
      if (this.r % 1 == 0) {
        if (checked) {
          this.$refs.treefrom.setCheckedNodes([])
          this.$refs.treefrom.setCheckedNodes([data])
          this.listQuery.divisionCode = data.orgCode
          this.yesno = data.orgFullName
          // 交叉点击节点 treefrom
        } else {
          this.$refs.treeform.setCheckedNodes([])
          // 点击已经选中的节点，置空
        }
      }
    },
    handleNodeClickst(data) {},

    // 删除
    deleteBtn(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          const deleteid = {
            id: row.id
          }
          deleteById(deleteid).then(response => {
            if (response.data.code == 200) {
              this.getList()
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
              return
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 搜索
    handleFilter(data) {
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
    // 查看
    look(row) {
      const ids = { id: row.id }
      getDetail(ids).then(response => {
        this.popTitle = response.data.data
        this.temp = Object.assign({}, this.popTitle)
      })
      this.chooseShow = true
      this.showpoat1 = false
      this.showpoat2 = false
      this.showpoat3 = true
      this.dialogStatus = 'lookstpo'
      this.dialogFormVisible = true
      this.fromLoading = false
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 编辑
    handleUpdate(row) {
      const ids = {
        id: row.id
      }
      getDetail(ids).then(response => {
        this.popTitle = response.data.data
        this.temp = Object.assign({}, this.popTitle)
        if (this.temp.netBookValue == '') {
          this.temp.netBookValue = 0
        }
      })
      this.showpoat1 = true
      this.showpoat2 = true
      this.showpoat3 = false
      this.chooseShow = false
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.fromLoading = false
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 编辑提交
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.temp.netBookValue == '') {
            this.temp.netBookValue = 0
          }
          const tempData = Object.assign({}, this.temp)
          this.fromLoading = true
          updateArticle(tempData).then(response => {
            const msg = response.data.msg
            if (response.data.code == 200) {
              for (const v of this.listData) {
                if (v.id === this.temp.id) {
                  this.getList()
                  const index = this.listData.indexOf(v)
                  this.listData.splice(index, 1, this.temp)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: msg,
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '错误',
                message: msg,
                type: 'error',
                duration: 2000
              })
            }
            this.fromLoading = false
          })
        }
      })
    }
  }
}
</script>
<style scoped>
.buttonplace {
    height: 36px;
    background: #409eff;
    color: #fff;
    border: 1px solid #fff;
    position: absolute;
    right: 0;
    top: 0;
    border-radius: 5px;
}
.fiutr {
    float: left;
}
.seat {
    margin-left: 50px;
    padding-right: 15px;
}
.seatsy {
    margin-left: 60px;
}
.inline-input {
    width: 200px;
}
.futiop {
    text-decoration: underline;
}
.formSearch {
    width: 100%;
    background: #fafafa;
    border: 1px solid #e9e9e9;
    border-radius: 3px;
    padding: 18px 10px 0;
    margin-bottom: 15px;
}
.square {
    width: 0;
    height: 0;
    border-width: 18px;
    border-style: solid;
    border-color: #409eff transparent transparent transparent;
    margin: 0 auto;
    cursor: pointer;
}
.tonesquare {
    width: 0;
    height: 0;
    border-width: 18px;
    border-style: solid;
    border-color: transparent transparent #409eff transparent;
    margin: 0 auto;
    cursor: pointer;
}
.showlist {
    margin-bottom: 30px;
    width: 100%;
    padding: 0px;
    height: 320px;
}
#buttstyps {
    width: 42px;
    height: 36px;
    cursor: pointer;
    text-align: center;
}
.buttonplacest {
    height: 36px;
    background: #409eff;
    color: #fff;
    border: 1px solid #fff;
    position: absolute;
    right: -50px;
    top: 0;
    border-radius: 5px;
}
.el-tree-node__content:hover {
    background-color: #6dc6fa;
    border-radius: 3%;
}

.demo-table-expand {
    font-size: 0;
}
.demo-table-expand label {
    width: 60px;
    color: #99a9bf;
}
.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 30%;
}
</style>
