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
                    <el-form-item>
                        <el-button class="filter-item" type="primary" style="float:right" icon="el-icon-search" @click="handleFilter">搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-main style="padding:20px 0">
                <el-button class="filter-item" @click="handleCreate" type="primary" v-if="addShow">新增</el-button>
                <el-table :key='tableKey' :data="tableData" height="200" row-key="id" v-loading="listLoading" border fit highlight-current style="width: 100%;margin-top:10px;min-height:500px" :header-cell-style="{background:'oldlace'}">
                    <el-table-column type="index" width="60" align="center" label="序号">
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
                    <el-table-column prop="equipNum" align="center" label="发出部门">
                        <el-table-column prop="outCompanyName" align="center" label="公司">
                        </el-table-column>
                        <el-table-column prop="outFactoryName" align="center" label="工厂">
                        </el-table-column>
                        <el-table-column prop="outDivisionName" align="center" label="车间">
                        </el-table-column>
                        <el-table-column prop="outStorehouseName" align="center" label="仓库">
                        </el-table-column>
                    </el-table-column>
                    <el-table-column prop="equipNum" align="center" label="接收部门">
                        <el-table-column prop="inCompanyName" align="center" label="公司">
                        </el-table-column>
                        <el-table-column prop="inFactoryName" align="center" label="工厂">
                        </el-table-column>
                        <el-table-column prop="inDivisionName" align="center" label="车间">
                        </el-table-column>
                        <el-table-column prop="inStorehouseName" align="center" label="仓库">
                        </el-table-column>
                    </el-table-column>
                    <el-table-column prop="handleDate" align="center" label="处理日期">
                    </el-table-column>
                    <el-table-column prop="handleUserName" align="center" label="处理人">
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="140px">
                        <template slot-scope="scope">
                            <el-button title="查看" type="success" size="mini" icon="el-icon-view" @click="handleDetail(scope.row)" v-if="lookShow"></el-button>
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
                            <el-button type="primary" @click="handleChooseEquip" :disabled="!chooseShow">选择</el-button>
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
                            <el-form-item label="使用公司" prop="outCompanyName">
                                <el-input v-model="temp.outCompanyName" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="使用工厂" prop="outFactoryName">
                                <el-input v-model="temp.outFactoryName" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="所属车间" prop="outDivisionName">
                                <el-input v-model="temp.outDivisionName" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="仓库" prop="outStorehouseName">
                                <el-input type="text" v-model="temp.outStorehouseName" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <span style="font-size:20px;font-weight:500;">接收部门信息:</span>
                    <el-row :gutter="20" style="margin-top:10px">
                        <el-col :span="6" style="padding-right:0px;">
                            <el-form-item label="使用公司" prop="inCompanyName">
                                <el-input v-model="temp.inCompanyName" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="2" style="padding:0px;">
                            <el-button type="primary" @click="changeCompany" :disabled="!chooseShow">选择</el-button>
                        </el-col>
                        <el-col :span="6" style="padding-right:0px;">
                            <el-form-item label="使用工厂" prop="inFactoryName">
                                <el-input v-model="temp.inFactoryName" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="2" style="padding:0px;">
                            <el-button type="primary" @click="changeFactory" :disabled="!chooseShow">选择</el-button>
                        </el-col>
                        <el-col :span="6" style="padding-right:0px;">
                            <el-form-item label="所属车间" prop="inDivisionName">
                                <el-input v-model="temp.inDivisionName" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="2" style="padding:0px;">
                            <el-button type="primary" @click="changeDivision" :disabled="!chooseShow">选择</el-button>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="仓库" prop="inStorehouseName">
                                <el-select v-model="temp.inStorehouseName" style="width:100%" clearable placeholder="请选择仓库" @change='lbChange' :disabled="!chooseShow">
                                    <el-option v-for="item in lbList" :key="item.wordCode" :label="item.wordName" :value="item.wordName">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="处理日期" prop="handleDate">
                                <el-date-picker v-model="temp.handleDate" style="width:100%" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" disabled>
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" style="padding-right:0px;">
                            <el-form-item label="处理人" prop="handleUserName"> 
                                <el-input type="text" v-model="temp.handleUserName" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="2" style="padding-left:0px;"> 
                            <el-button type="primary" @click="handleChooseTech" :disabled="!chooseShow">选择</el-button>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false" type="info">取 消</el-button>
                    <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">提交</el-button>
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
                            <el-table-column fixed type="selection" width="60" align="center"></el-table-column>
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
            <!-- 选择公司/工厂 -->
            <el-dialog width="40%" :title="textMap1[dialogStatus1]" :visible.sync="companyVisible" append-to-body :close-on-click-modal="false" v-dialogDrag>
                <el-container>
                    <el-aside width="500px">
                        <span style="margin-left:20px;color:red">{{getCompanyName}}</span>
                        <el-tree :data="companyData" :props="defaultProps1" ref="comtree" show-checkbox node-key='orgCode' check-strictly @check-change="handleChange1" v-loading="diaLoading"></el-tree>
                    </el-aside>
                </el-container>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="companyVisible = false" type="default">取消</el-button>
                    <el-button v-if="dialogStatus1=='company'" type="primary" @click="handleClickCompany">确定</el-button>
                    <el-button v-if="dialogStatus1=='factory'" type="primary" @click="handleClickFactory">确定</el-button>
                </div>
            </el-dialog>
            <!-- 选择使用部门 -->
            <el-dialog width="50%" title="选择使用部门" :visible.sync="divisionVisible" append-to-body :close-on-click-modal="false" v-dialogDrag>
                <el-container>
                    <el-aside width="500px">
                        <span style="margin-left:20px;color:red">{{getOrgName}}</span>
                        <el-tree :data="orgData" :props="defaultProps1" ref="tree" show-checkbox node-key="orgCode" check-strictly @check-change="handleChange" v-loading="diaLoading">
                        </el-tree>
                    </el-aside>
                </el-container>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="divisionVisible = false">取消</el-button>
                    <el-button @click="handleClick2" type="primary">确定</el-button>
                </div>
            </el-dialog>
            <!-- 选择处理人弹框 -->
            <el-dialog width="60%" :close-on-click-modal="false" title="处理人员" :visible.sync="innerVisibleTech" append-to-body v-dialogDrag>
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
                    <span style="margin-left:20px;color:red">{{temp.handleUserName}}</span>
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
import { fetchList, fetchList1, delById, getDetail, createArticle, fetchlbList } from '@/api/jigHandover/fixHandoverSheet'
import { fetchComTree, fetchComByCode, fetchOrgTree, choosePersonList, fetchChooseTree, getCurrentUser } from '@/api/common/common'
import { fetchButton } from '@/api/common/button'
import { menuList } from '@/store/modules/permission'
export default {
  name: 'fixHandoverSheet',
  data() {
    return {
      userCode: undefined, // 用户编码
      menuCode: undefined,
      addShow: false,
      lookShow: false,
      deleteShow: false,
      chooseShow: true, // 选择按钮
      diaLoading: false,
      // 公司（工厂）
      n: 0,
      companyVisible: false,
      companyData: [],
      // 部门
      i: 0,
      divisionVisible: false,
      orgData: [],
      defaultProps1: {
        children: 'children',
        label: 'orgFullName'
      },
      getCompanyName: undefined,
      getCompanyCode: undefined,
      getOrgName: undefined,
      getOrgCode: undefined,
      dialogStatus1: '',
      textMap1: {
        company: '选择公司',
        factory: '选择工厂'
      },
      j: 0,
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
        fixtrueName: ''
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
      innerVisibleTech: false, // 处理人弹框
      personOrgData: [],
      orgListData: null,
      listQuery2: { },
      temp: {
        fixedAssetCode: undefined,
        fixtrueName: undefined,
        handleDate: new Date(),
        inCompanyCode: undefined,
        inCompanyName: undefined,
        inDivisionCode: undefined,
        inDivisionName: undefined,
        inFactoryCode: undefined,
        inFactoryName: undefined,
        inStorehouseCode: undefined,
        inStorehouseName: undefined,
        model: undefined,
        outCompanyCode: undefined,
        outCompanyName: undefined,
        outDivisionCode: undefined,
        outDivisionName: undefined,
        outFactoryCode: undefined,
        outFactoryName: undefined,
        outStorehouseCode: undefined,
        outStorehouseName: undefined,
        handleUserNo: undefined,
        handleUserName: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        create: '新增',
        detail: '夹具交接单'
      },
      rules: {
        fixtrueName: [{ required: true, message: '此项为必填项', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
    this.getButton()
    this.getlbList()
  },
  methods: {
    getButton() {
      menuList.forEach(item => {
        item.children.forEach(e => {
          if (e.name == 'fixHandoverSheet') {
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
            } else if (getBtns[i].buttonName == '查看') {
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
      fetchList(this.pageNum, this.pageSize, this.listQuery).then(response => {
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
      })
    },
    // 根据字典值获取仓库
    getlbList() {
      const find = {
        parCode: 'CK',
        pageNum: 1,
        pageSize: 200
      }
      fetchlbList(find).then(response => {
        this.lbList = []
        this.lbList = response.data.data.list
      })
    },
    lbChange() {
      this.lbList.forEach(item => {
        if (item.wordName == this.temp.inStorehouseName) {
          this.temp.inStorehouseCode = item.wordCode
        }
      })
    },
    // 设置公司/工厂组织树状图单选
    handleChange1(data, checked, node) {
      this.n++
      if (this.n % 2 == 0) {
        if (checked) {
          this.$refs.comtree.setCheckedNodes([])
          this.$refs.comtree.setCheckedNodes([data])
          // 交叉点击节点
        } else {
          this.$refs.comtree.setCheckedNodes([])
          // 点击已经选中的节点，置空
        }
      }
    },
    // 选择使用公司
    changeCompany() {
      this.n = 0
      this.dialogStatus1 = 'company'
      this.getCompanyCode = undefined
      this.getCompanyName = undefined
      this.diaLoading = true
      this.companyVisible = true
      this.companyData = []
      fetchComTree().then(response => {
        if (response.data.code === 200) {
          this.companyData.push(response.data.data)
        }
      })
      setTimeout(() => {
        this.diaLoading = false
      }, 1 * 1000)
    },
    // 选择公司确认
    handleClickCompany() {
      this.treeData1 = this.$refs.comtree.getCheckedNodes()
      this.getCompanyCode = this.treeData1[0].orgCode
      this.getCompanyName = this.treeData1[0].orgFullName
      this.temp.inCompanyName = this.getCompanyName
      this.temp.inCompanyCode = this.getCompanyCode
      this.temp.inFactoryName = undefined
      this.temp.inFactoryCode = undefined
      this.companyVisible = false
    },
    // 选择使用工厂
    changeFactory() {
      this.n = 0
      this.dialogStatus1 = 'factory'
      this.getCompanyCode = undefined
      this.getCompanyName = undefined
      this.diaLoading = true
      this.companyVisible = true
      this.companyData = []
      const find = {
        orgCode: this.temp.inCompanyCode
      }
      fetchComByCode(find).then(response => {
        if (response.data.code === 200) {
          this.companyData.push(response.data.data)
          for (var i = 0; i < this.companyData.length; i++) {
            if (this.companyData[i].orgType == '部门') {
              this.companyData[i].disabled = true
            }
            if (this.companyData[i].children != null) {
              for (
                var j = 0;
                j < this.companyData[i].children.length;
                j++
              ) {
                const child = this.companyData[i].children[j]
                if (child.orgType == '部门') {
                  child.disabled = true
                }
                if (child.children !== null) {
                  for (
                    var p = 0;
                    p < child.children.length;
                    p++
                  ) {
                    const child1 = child.children[p]
                    if (child1.orgType == '部门') {
                      child1.disabled = true
                    }
                    if (child1.children != null) {
                      for (
                        var o = 0;
                        o < child1.children.length;
                        o++
                      ) {
                        const child2 =
                                                    child1.children[o]
                        if (child2.orgType == '部门') {
                          child2.disabled = true
                        }
                        if (child2.children != null) {
                          for (
                            var q = 0;
                            q <
                                                        child2.children.length;
                            q++
                          ) {
                            const child3 =
                                                            child2.children[q]
                            if (
                              child3.orgType ==
                                                            '部门'
                            ) {
                              child3.disabled = true
                            }
                            if (
                              child3.children !=
                                                            null
                            ) {
                              for (
                                var n = 0;
                                n <
                                                                child3.children
                                                                  .length;
                                n++
                              ) {
                                const child4 =
                                                                    child3
                                                                      .children[
                                                                        n
                                                                      ]
                                if (
                                  child4.orgType ==
                                                                    '部门'
                                ) {
                                  child4.disabled = true
                                }
                                if (
                                  child4.children !=
                                                                    null
                                ) {
                                  for (
                                    var m = 0;
                                    m <
                                                                        child4
                                                                          .children
                                                                          .length;
                                    m++
                                  ) {
                                    const child5 =
                                                                            child4
                                                                              .children[
                                                                                n
                                                                              ]
                                    if (
                                      child5.orgType ==
                                                                            '部门'
                                    ) {
                                      child5.disabled = true
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      })
      setTimeout(() => {
        this.diaLoading = false
      }, 1 * 1000)
    },
    // 选择工厂确认
    handleClickFactory() {
      this.treeData1 = this.$refs.comtree.getCheckedNodes()
      this.getCompanyCode = this.treeData1[0].orgCode
      this.getCompanyName = this.treeData1[0].orgFullName
      this.temp.inFactoryName = this.getCompanyName
      this.temp.inFactoryCode = this.getCompanyCode
      this.temp.inDivisionName = undefined
      this.companyVisible = false
    },
    // 选择使用部门
    changeDivision() {
      this.getOrgCode = undefined
      this.getOrgName = undefined
      this.divisionVisible = true
      this.diaLoading = true
      this.orgData = []
      const find1 = {
        orgCode: this.temp.inFactoryCode
      }
      fetchOrgTree(find1).then(response => {
        if (response.data.code === 200) {
          this.orgData = response.data.data
          for (var i = 0; i < this.orgData.length; i++) {
            if (this.orgData[i].orgType == '公司') {
              this.orgData[i].disabled = true
            }
            if (this.orgData[i].children !== null) {
              for (
                var j = 0;
                j < this.orgData[i].children.length;
                j++
              ) {
                const child = this.orgData[i].children[j]
                if (child.orgType == '公司') {
                  child.disabled = true
                }
                if (child.children != null) {
                  for (
                    var p = 0;
                    p < child.children.length;
                    p++
                  ) {
                    const child1 = child.children[p]
                    if (child1.orgType == '公司') {
                      child1.disabled = true
                    }
                    if (child1.children != null) {
                      for (
                        var o = 0;
                        o < child1.children.length;
                        o++
                      ) {
                        const child2 =
                                                    child1.children[o]
                        if (child2.orgType == '公司') {
                          child2.disabled = true
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      })
      setTimeout(() => {
        this.diaLoading = false
      }, 1 * 1000)
    },
    // 设置部门组织树状图单选
    handleChange(data, checked, node) {
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
    // 点击选择部门确认
    handleClick2() {
      // 获取部门被选择的节点
      this.treeData = this.$refs.tree.getCheckedNodes()
      this.getOrgCode = this.treeData[0].orgCode
      this.getOrgName = this.treeData[0].orgFullName
      this.temp.inDivisionName = this.getOrgName
      this.temp.inDivisionCode = this.getOrgCode
      this.divisionVisible = false
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
    handleSelectionChange(val) {

    },
    // 夹具名称选择
    handleChooseEquip() {
      this.innerVisibleUseBranch1 = true
      fetchList1(this.listQuery1).then(response => {
        if (response.data.code == 200) {
          if (response.data.data != null && response.data.data.list != null) {
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
      this.temp.outCompanyCode = this.multipleSelection.companyCode // 公司
      this.temp.outCompanyName = this.multipleSelection.companyName
      this.temp.outFactoryCode = this.multipleSelection.factoryCode // 工厂
      this.temp.outFactoryName = this.multipleSelection.factoryName
      this.temp.outDivisionCode = this.multipleSelection.divisionCode // 部门
      this.temp.outDivisionName = this.multipleSelection.divisionName
      this.temp.outStorehouseCode = this.multipleSelection.belongStorehouseCode // 仓库
      this.temp.outStorehouseName = this.multipleSelection.belongStorehouseName
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
    // 技术负责人选择
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
      this.temp.handleUserName = row.perName
      this.temp.handleUserNo = row.workNumber
    },
    // 获取当前登录人
    getUser() {
      getCurrentUser().then(response => {
        if (response.data.code == 200) {
          this.temp.handleUserName = response.data.data.perName
          this.temp.handleUserNo = response.data.data.workNumber
        }
      })
    },
    // 重置表单
    resetTemp() {
      this.temp = {
        fixedAssetCode: undefined,
        fixtrueName: undefined,
        handleDate: new Date(),
        inCompanyCode: undefined,
        inCompanyName: undefined,
        inDivisionCode: undefined,
        inDivisionName: undefined,
        inFactoryCode: undefined,
        inFactoryName: undefined,
        inStorehouseCode: undefined,
        inStorehouseName: undefined,
        model: undefined,
        outCompanyCode: undefined,
        outCompanyName: undefined,
        outDivisionCode: undefined,
        outDivisionName: undefined,
        outFactoryCode: undefined,
        outFactoryName: undefined,
        outStorehouseCode: undefined,
        outStorehouseName: undefined,
        handleUserNo: undefined,
        handleUserName: undefined
      }
    },
    // 新增
    handleCreate() {
      this.resetTemp()
      this.getUser()
      this.dialogStatus = 'create'
      this.chooseShow = true
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
      this.dialogStatus = 'detail'
      this.chooseShow = false
      this.dialogFormVisible = true
      const id = { id: row.id }
      getDetail(id).then(response => {
        if (response.data.code == 200) {
          this.temp = Object.assign({}, response.data.data)
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

