<template>
    <div class='app-container'>
        <el-container>
            <div class="formSearch">
                <el-form :inline="true">
                    <el-form-item label="夹具名称">
                        <el-input class="filter-item input" placeholder="请输入夹具名称" v-model="listQuery.fixtrueName" clearable>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="固定资产编号">
                        <el-input class="filter-item input" placeholder="请输入固定资产编号" v-model="listQuery.fixedAssetCode" clearable>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="型号规格">
                        <el-input class="filter-item input" placeholder="请输入型号规格" v-model="listQuery.model" clearable>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="检验结论">
                        <el-select v-model="listQuery.status" placeholder="请选择" clearable>
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="filter-item" type="primary" style="float:right" icon="el-icon-search" @click="handleFilter">搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-main style="padding:20px 0">
                <el-button class="filter-item" @click="handleCreate" type="primary" icon="el-icon-plus" v-if="addShow">新增</el-button>
                <el-table :key='tableKey' :data="tableData" height="200" row-key="id" v-loading="listLoading" border fit highlight-current style="width: 100%;margin-top:10px;min-height:500px" :header-cell-style="{background:'oldlace'}">
                    <el-table-column type="index" width="50" align="center" label="序号">
                        <template slot-scope="scope">
                            {{scope.$index+(pageNum -1) * pageSize +1}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="fixtrueName" align="center" label="夹具名称" width="160px">
                    </el-table-column>
                    <el-table-column prop="fixedAssetCode" align="center" label="固定资产编号" min-width="110px">
                    </el-table-column>
                    <el-table-column prop="model" align="center" label="型号规格">
                    </el-table-column>
                    <el-table-column prop="companyName" align="center" label="使用公司">
                    </el-table-column>
                    <el-table-column prop="factoryName" align="center" label="使用工厂">
                    </el-table-column>
                    <el-table-column prop="divisionName" align="center" label="使用车间">
                    </el-table-column>
                    <el-table-column prop="buyers" align="center" label="供应商">
                    </el-table-column>
                    <el-table-column prop="checkResult" align="center" label="检验结论">
                        <template slot-scope="scope">
                            <span>{{scope.row.checkResult == 2?'完好':'维修'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="checkUserName" align="center" label="检验员">
                    </el-table-column>
                    <el-table-column prop="checkDate" align="center" label="检验日期">
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="140px">
                        <template slot-scope="scope">
                            <el-button title="编辑" type="primary" size="mini" icon="el-icon-edit" @click="handleDetail(scope.row)" v-if="lookShow"></el-button>
                            <el-button title="删除" type="danger" icon="el-icon-delete" size="mini" @click="deleteBtn(scope.row)" v-if="deleteShow"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-main>
            <el-footer>
                <div class="pagination-container">
                    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[5,10,15, 20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                    </el-pagination>
                </div>
            </el-footer>
            <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" :visible.sync="dialogFormVisible" width="60%" v-dialogDrag v-loading="listLoading">
                <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="110px">
                    <el-row :gutter="20">
                        <el-col :span="6" style="padding-right:0px;">
                            <el-form-item label="夹具名称" prop="fixtrueName">
                                <el-input v-model="temp.fixtrueName" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="2" style="padding-left:0px;">
                            <el-button type="primary" @click="handleChooseEquip">选择</el-button>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="固定资产编号" prop="fixedAssetCode">
                                <el-input v-model="temp.fixedAssetCode" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="型号规格" prop="model">
                                <el-input v-model="temp.model" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="使用公司" prop="companyName">
                                <el-input v-model="temp.companyName" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="使用工厂" prop="factoryName">
                                <el-input v-model="temp.factoryName" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="所属车间" prop="divisionName">
                                <el-input v-model="temp.divisionName" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="数量" prop="num">
                                <el-input v-model="temp.num">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-table :data="dataList" height="200" row-key="id" v-loading="listLoading" border fit highlight-current style="width: 100%;margin-bottom:10px;min-height:300px" :header-cell-style="{background:'oldlace'}">
                        <el-table-column align="center" prop="iteam" label="验收项目">
                        </el-table-column>
                        <el-table-column align="center" prop="request" label="验收要求">
                        </el-table-column>
                        <el-table-column align="center" prop="info" label="实际情况">
                            <template slot-scope="scope">
                                <el-form-item label-width="1x">
                                    <el-input v-model="scope.row.info" placeholder="请输入实际情况" maxlength="120" @change="handleEdit(scope.$index, scope.row)"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="result" label="分项结论">
                            <template slot-scope="scope">
                                <el-form-item label-width="1x">
                                    <el-radio v-model="scope.row.result" label="true" @change="handleEdit(scope.$index, scope.row)">合格</el-radio>
                                    <el-radio v-model="scope.row.result" label="false" @change="handleEdit(scope.$index, scope.row)">不合格</el-radio>
                                </el-form-item>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="检验结论" prop="checkResult">
                                <el-radio v-model="temp.checkResult" label="2">完好</el-radio>
                                <el-radio v-model="temp.checkResult" label="3">维修</el-radio>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="备注" prop="remark">
                                <el-input type="textarea" maxlength="200" v-model="temp.remark">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="6" style="padding-right:0px;">
                            <el-form-item label="检验员" prop="checkUserName">
                                <el-input type="text" v-model="temp.checkUserName" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="2" style="padding-left:0px;"> 
                            <el-button type="primary" @click="handleChooseTech">选择</el-button>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="检验日期" prop="checkDate">
                                <el-date-picker v-model="temp.checkDate" style="width:100%" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false" type="info">取 消</el-button>
                    <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">提交</el-button>
                    <el-button v-else type="primary" @click="updateData">提交</el-button>
                </span>
            </el-dialog>
            <el-dialog width="60%" :close-on-click-modal="false" title="" :visible.sync="innerVisibleUseBranch1" append-to-body v-dialogDrag>
                <el-container>
                    <div class="filter-container">
                        <div class="formSearch">
                            <el-form :inline="true">
                                <el-form-item label="夹具名称">
                                    <el-input v-model="listQuery1.equipmentName" placeholder="请输入夹具名称" clearable></el-input>
                                </el-form-item>
                                <el-form-item label="固定资产编号">
                                    <el-input class="minier-input" style="width:196px" v-model="listQuery1.fixedAssetCode" placeholder="请输入固定资产编号" clearable></el-input>
                                </el-form-item>
                                <el-form-item label="型号规格">
                                    <el-input class="minier-input" style="width:196px" v-model="listQuery1.model" placeholder="请输入型号规格" clearable></el-input>
                                </el-form-item>
                                <el-form-item label="资产状态">
                                    <el-select v-model="listQuery1.equipmentStatus" placeholder="请选择" clearable>
                                        <el-option v-for="item in assetStatus" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item>
                                    <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter1">搜索</el-button>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                    <!-- 主要区域容器 -->
                    <el-main style="padding:20px 0px">
                        <el-table :data="listData" ref="multipleTable" @select="handleSelect" @selection-change="handleSelectionChange" v-loading="listLoading" border fit highlight-current-row style="width: 100%;min-height:auto;margin-top:8px" height="500" :header-cell-style="{background:'oldlace'}" :default-sort="{prop: 'cTime', order: 'descending'}">
                            <el-table-column fixed type="selection" width="50" align="center"></el-table-column>
                            <el-table-column align="center" label="序号" width="80" type="index"></el-table-column>
                            <el-table-column prop="equipmentName" align="center" label="夹具名称">
                            </el-table-column>
                            <el-table-column prop="fixedAssetCode" align="center" label="固定资产编号" min-width="120px">
                            </el-table-column>
                            <el-table-column prop="companyName" align="center" label="使用公司">
                            </el-table-column>
                            <el-table-column prop="factoryName" align="center" label="使用工厂">
                            </el-table-column>
                            <el-table-column prop="divisionName" align="center" label="使用部门">
                            </el-table-column>
                            <el-table-column prop="purchaseApplyDate" align="center" label="采购申请时间" min-width="120px">
                            </el-table-column>
                            <el-table-column prop="purchasePrice" align="center" label="采购金额">
                            </el-table-column>
                            <el-table-column prop="manufacturer" align="center" label="制造厂家">
                            </el-table-column>>
                            <el-table-column prop="belongStorehouseName" align="center" label="所在仓库">
                            </el-table-column>
                        </el-table>
                    </el-main>
                    <el-footer>
                        <div class="pagination-container">
                            <el-pagination background @size-change="handleSizeChange1" @current-change="handleCurrentChange1" :current-page="listQuery1.pageNum" :page-sizes="[10,20,50,100]" :page-size="listQuery1.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total1">
                            </el-pagination>
                        </div>
                    </el-footer>
                </el-container>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="innerVisibleUseBranch1 = false">取消</el-button>
                    <el-button @click="handleClickVisibleBranch1" type="primary">确定</el-button>
                </div>
            </el-dialog>
            <!-- 选择检验员弹框 -->
            <el-dialog width="60%" :close-on-click-modal="false" title="检验员" :visible.sync="innerVisibleTech" append-to-body v-dialogDrag>
                <el-header>
                    <el-form :inline="true" class="demo-form-inline">
                    <el-form-item label="姓名">
                        <el-input v-model="listQuery2.perName" placeholder="请输入姓名">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="工号">
                        <el-input v-model="listQuery2.workNumber" placeholder="请输入工号">
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="handlePerson">搜索</el-button>
                    </el-form-item>
                    </el-form>
                </el-header>
                <el-container>
                    <el-aside style="width:380px;">
                    <el-tree :data="personOrgData" :props="defaultProps1" @node-click="handleNodeClick"></el-tree>
                    </el-aside>
                    <el-main>
                    <span style="margin-left:20px;color:red">{{temp.checkUserName}}</span>
                    <el-table height='300' :data="orgListData" border fit highlight-current-row
                        style="width:100%;min-height:300px;margin-top:8px">
                        <el-table-column prop="orgName" align="center" label="部门" min-width="50">
                        </el-table-column>
                        <el-table-column prop="perName" align="center" label="人员" min-width="50">
                        </el-table-column>
                        <el-table-column align="center" label="工号" min-width="50">
                        <template slot-scope="scope">
                            <a class="look-detail" @click="chooseData1(scope.row)">{{scope.row.workNumber}}</a>
                        </template>
                        </el-table-column>
                    </el-table>
                    </el-main>
                </el-container>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="innerVisibleTech = false" type="primary">确定</el-button>
                </div>
            </el-dialog>
        </el-container>
    </div>
</template>

<script>
import { fetchList, fetchList1, delById, getDetail, createArticle, updateArticle } from '@/api/jigHandover/fixInspectionSheet'
import { getCurrentUser, fetchChooseTree, choosePersonList } from '@/api/common/common'
import { fetchButton } from '@/api/common/button'
import { menuList } from '@/store/modules/permission'
export default {
  name: 'fixInspectionSheet',
  data() {
    return {
      dataList: [{
        iteam: '夹具所有螺丝孔',
        request: '无铝屑或污垢堵塞、无断螺丝、螺丝孔无滑牙',
        info: '',
        result: ''
      }, {
        iteam: '拉爪、拉臂',
        request: '无严重敲打痕迹、表面无裂纹、爪未磨损',
        info: '',
        result: ''
      }, {
        iteam: '配合间隙处',
        request: '无铝屑堆积、插销无裂纹或断裂',
        info: '',
        result: ''
      }, {
        iteam: '大盘',
        request: '大盘有无撞击痕迹',
        info: '',
        result: ''
      }, {
        iteam: '铜套间隙',
        request: '铜套间隙<0.01',
        info: '',
        result: ''
      }, {
        iteam: '夹具的平面度、同轴度',
        request: '平面度<0.05，同轴度<0.05',
        info: '',
        result: ''
      }],
      options: [{
        value: '2',
        label: '完好'
      }, {
        value: '3',
        label: '维修'
      }, {
        value: '',
        label: '全部'
      }],
      menuCode: undefined,
      addShow: false,
      lookShow: false,
      deleteShow: false,
      innerVisibleUseBranch1: false,
      // 表格数据
      tableKey: 0,
      listLoading: false,
      tableData: [],
      listData: [],
      total: null,
      total1: null,
      pageNum: 1,
      pageSize: 10,
      listQuery: {
        model: '',
        fixedAssetCode: '',
        fixtrueName: '',
        status: ''
      },
      listQuery1: {
        pageNum: 1,
        pageSize: 10,
        equipmentName: '',
        fixedAssetCode: '',
        model: '',
        equipmentStatus: ''
      },
      checkedIndex: '',
      assetStatus: [
        { value: '1', label: '待接收' },
        { value: '2', label: '完好' },
        { value: '3', label: '维修' },
        { value: '4', label: '报废' },
        { value: '', label: '全部' }
      ],
      lbList: [],
      innerVisibleTech: false, // 检验员弹框
      personOrgData: [],
      orgListData: null,
      listQuery2: {},
      defaultProps1: {
        children: 'children',
        label: 'orgFullName'
      },
      temp: {
        buyers: undefined,
        checkDate: new Date(),
        checkResult: null,
        checkUserName: undefined,
        checkUserNo: undefined,
        companyCode: undefined,
        companyName: undefined,
        divisionCode: undefined,
        divisionName: undefined,
        factoryCode: undefined,
        factoryName: undefined,
        fixedAssetCode: undefined,
        fixtrueName: undefined,
        model: undefined,
        remark: undefined,
        details: [],
        num: undefined,
        remark: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        create: '新增',
        update: '编辑'
      },
      rules: {
        fixtrueName: [{ required: true, message: '此项为必填项', trigger: 'change' }],
        checkResult: [{ required: true, message: '此项为必填项', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
    this.getButton()
  },
  methods: {
    handleEdit(index, row) {
      this.temp.details = this.dataList
    },
    getButton() {
      menuList.forEach(item => {
        item.children.forEach(e => {
          if (e.name == 'fixInspectionSheet') {
            this.menuCode = e.code
          }
        })
      })
      // 查询按钮信息
      const params = {
        menuCode: this.menuCode,
        type: 'web'
      }
      fetchButton(params).then(response => {
        if (response.data.code == 200) {
          const getBtns = response.data.data
          for (var i = 0; i < getBtns.length; i++) {
            if (getBtns[i].buttonName == '新增') {
              this.addShow = true
            } else if (getBtns[i].buttonName == '编辑') {
              this.lookShow = true
            } else if (getBtns[i].buttonName == '删除') {
              this.deleteShow = true
            }
          }
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
    getList() {
      this.tableData = []
      this.listLoading = true
      fetchList(this.pageNum, this.pageSize, this.listQuery).then(
        response => {
          if (response.data.code === 200) {
            if (response.data.data != null && response.data.data.list != null) {
              this.tableData = response.data.data.list
              this.total = response.data.data.total
            }
            setTimeout(() => {
              this.listLoading = false
            }, 1 * 500)
          } else {
            this.$notify({
              title: '警告',
              message: response.data.msg,
              type: 'warning',
              duration: 2000
            })
            this.listLoading = false
          }
        }
      )
    },
    // 勾选台账信息
    handleSelect(val, row) {
      if (val.length > 1) {
        this.$refs.multipleTable.clearSelection()
        val.shift()
        this.$refs.multipleTable.toggleRowSelection(row)
      } else {
        this.multipleSelection = row
        this.checkedIndex = val.length
      }
    },
    handleSelectionChange(val) {},
    // 夹具名称选择
    handleChooseEquip() {
      this.innerVisibleUseBranch1 = true
      fetchList1(this.listQuery1).then(response => {
        if (response.data.code == 200) {
          if (
            response.data.data != null &&
                        response.data.data.list != null
          ) {
            this.listData = response.data.data.list
            this.total1 = response.data.data.total

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
    handleFilter1(data) {
      this.listQuery1.pageNum = 1
      this.handleChooseEquip()
    },
    handleSizeChange1(val) {
      this.listQuery1.pageSize = val
      this.handleChooseEquip()
    },
    handleCurrentChange1(val) {
      this.listQuery1.pageNum = val
      this.handleChooseEquip()
    },
    // 夹具名称树被选中
    handleChangeEquip(data, checked, node) {
      this.j++
      if (this.j % 2 == 0) {
        if (checked) {
          this.$refs.treeEquip.setCheckedNodes([])
          this.$refs.treeEquip.setCheckedNodes([data])
          // 交叉点击节点
        } else {
          this.$refs.treeEquip.setCheckedNodes([])
          // 点击已经选中的节点，置空
        }
      }
    },
    // 夹具名称点击确认
    handleClickVisibleBranch1() {
      if (this.checkedIndex != 1) {
        this.$notify({
          title: '警告',
          message: '请选择一条数据',
          type: 'warning',
          duration: 2000
        })
        return
      }
      if (this.$refs.multipleTable.selection[0].belongStorehouseCode == '' && this.$refs.multipleTable.selection[0].fixedAssetCode == '') {
        this.$notify({
          title: '警告',
          message: '仓库编号和固定资产编号不能为空',
          type: 'warning',
          duration: 2000
        })
        return
      }
      if (this.$refs.multipleTable.selection[0].belongStorehouseCode == '') {
        this.$notify({
          title: '警告',
          message: '仓库编号不能为空',
          type: 'warning',
          duration: 2000
        })
        return
      }
      if (this.$refs.multipleTable.selection[0].fixedAssetCode == '') {
        this.$notify({
          title: '警告',
          message: '固定资产编号不能为空',
          type: 'warning',
          duration: 2000
        })
        return
      }
      this.temp.fixtrueName = this.multipleSelection.equipmentName
      this.temp.fixedAssetCode = this.multipleSelection.fixedAssetCode
      this.temp.model = this.multipleSelection.model
      this.temp.companyCode = this.multipleSelection.companyCode // 公司
      this.temp.companyName = this.multipleSelection.companyName
      this.temp.factoryCode = this.multipleSelection.factoryCode // 工厂
      this.temp.factoryName = this.multipleSelection.factoryName
      this.temp.divisionCode = this.multipleSelection.divisionCode // 部门
      this.temp.divisionName = this.multipleSelection.divisionName
      this.temp.buyers = this.multipleSelection.manufacturer
      this.innerVisibleUseBranch1 = false
    },
    // 搜索
    handleFilter() {
      this.pageNum = 1
      this.getList()
    },
    // 分页
    handleSizeChange(val) {
      this.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.getList()
    },
    // 获取当前登录人
    getUser() {
      getCurrentUser().then(response => {
        if (response.data.code == 200) {
          this.temp.checkUserName = response.data.data.perName
          this.temp.checkUserNo = response.data.data.workNumber
          this.userId = response.data.data.id
        }
      })
    },
    choosePerson() {
      this.listQuery2 = {
        pageNum: 1,
        pageSize: 1000,
        perName: undefined,
        workNumber: undefined
      }
      this.orgListData = null
      fetchChooseTree().then(response => {
        this.personOrgData = []
        this.personOrgData.push(response.data.data)
      })
    },
    // 选择检验员
    handleChooseTech() {
      this.choosePerson()
      this.innerVisibleTech = true
    },
    handleNodeClick(data) {
      const params = {
        orgCode: data.orgCode,
        pageNum: 1,
        pageSize: 2000
      }
      choosePersonList(params).then(response => {
        this.orgListData = response.data.data.list
      })
    },
    handlePerson() {
      this.orgListData = []
      choosePersonList(this.listQuery2).then(response => {
        this.orgListData = response.data.data.list
      })
    },
    chooseData1(row) {
      this.temp.checkUserName = row.perName
      this.temp.checkUserNo = row.workNumber
    },
    // 重置表单
    resetTemp() {
      this.temp = {
        buyers: undefined,
        checkDate: new Date(),
        checkResult: null,
        checkUserName: undefined,
        checkUserNo: undefined,
        companyCode: undefined,
        companyName: undefined,
        divisionCode: undefined,
        divisionName: undefined,
        factoryCode: undefined,
        factoryName: undefined,
        fixedAssetCode: undefined,
        fixtrueName: undefined,
        model: undefined,
        remark: undefined,
        details: [],
        num: undefined,
        remark: undefined
      }
      this.dataList.forEach(item => {
        item.info = ''
        item.result = ''
      })
    },
    // 新增
    handleCreate() {
      this.resetTemp()
      this.getUser()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 新增提交
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.createSubmit()
        }
      })
    },
    createSubmit() {
      this.listLoading = true
      this.temp.details = this.dataList
      createArticle(this.temp).then(response => {
        if (response.data.code == 200) {
          this.dialogFormVisible = false
          this.getList()
          setTimeout(() => {
            this.listLoading = false
          }, 1 * 500)
          this.$message({
            title: '成功',
            message: '添加成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '警告',
            message: response.data.msg,
            type: 'warning',
            duration: 2000
          })
          this.listLoading = false
        }
      })
    },
    // 根据编号查看
    handleDetail(row) {
      this.id = row.id
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      const id = { id: row.id }
      getDetail(id).then(response => {
        if (response.data.code == 200) {
          this.temp = Object.assign({}, response.data.data)
          this.dataList = this.temp.details
          this.dataList.forEach(item => {
            if (item.result == true) {
              item.result = 'true'
            } else if (item.result == false) {
              item.result = 'false'
            } else {
              item.result = ""
            }
          })
          this.temp.checkResult = this.temp.checkResult.toString()
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
    // 编辑提交
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateArticle(tempData).then(response => {
            if (response.data.code === 200) {
              this.getList()
              this.dialogFormVisible = false
              this.$message({
                title: '成功',
                message: response.data.msg,
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
    // 删除
    deleteBtn(row) {
      this.$confirm('是否需要删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const id = { id: row.id }
          delById(id).then(response => {
            if (response.data.code === 200) {
              const index = this.tableData.indexOf(row)
              this.tableData.splice(index, 1)
              this.getList()
              this.$message({
                title: '成功',
                type: 'success',
                message: '删除成功!',
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
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>
<style>
.formSearch {
    width: 100%;
    background: #fafafa;
    border: 1px solid #e9e9e9;
    border-radius: 3px;
    padding: 18px 10px 0;
}
.el-table thead tr .el-checkbox__input {
    display: none;
}
</style>

