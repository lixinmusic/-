<template>
  <div class="app-container">
    <!--外部容器 -->
    <el-container> 
      <el-aside style="border:1px solid #f0f0f0;padding-top:20px;" width="230px">
        <el-tree 
          :data="equipData" 
          ref="tree"
          node-key="addressCode"
          :props="defaultProps" 
          check-strictly
          @node-click="handleNodeClick"
          :render-content="renderContent">
        </el-tree>
      </el-aside>
      <!-- 内容容器 -->
      <el-container>
        <el-header style="height:40px;">
          <div class="title-header">
            <span>查询结果</span>
            <span style="margin-left:20px;color:red" prop='parCode'>{{parName}}</span>
          </div>
        </el-header> 
        <!-- 主要区域容器 -->
        <el-main style="padding-top:0;">
          <el-button size="mini" style="margin: 10px 10px;" type="primary" v-waves  @click="importData" v-if="addShow">导入</el-button>
          <el-button size="mini" style="margin: 10px 10px;" type="primary" v-waves  @click="refresh">刷新</el-button>
          <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter" style="float:right">查询</el-button>
          <el-select style="float:right"
            v-model="listQuery.equipTypeCode"
            filterable
            remote
            placeholder="请输入设备类型"
            :remote-method="getEuipeType"
            @focus="getFocus">
            <el-option
              v-for="item in euipeTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-table :key='tableKey' :data="listData" height='200' v-loading="listLoading" border fit highlight-current-row
            style="width:100%;min-height:500px;margin-top:8px" :header-cell-style="{background:'oldlace'}">
            <el-table-column prop="fixedAssetCode" align="center" label="固定资产编号" min-width="110">
            </el-table-column>
            <el-table-column prop="equipmentName" align="center" label="设备名称" min-width="90">
               <template slot-scope="scope">
                 <span class="link-type futiop" @click='checkDetails(scope.row)'>{{scope.row.equipmentName}}</span>
               </template>
            </el-table-column>
            <el-table-column prop="equipCode" align="center" label="设备号" min-width="70">
            </el-table-column>
            <el-table-column prop="equipTypeName" align="center" label="设备类型" min-width="90">
            </el-table-column>
            <el-table-column prop="equipCategoryName" align="center" label="设备类别" min-width="90">
            </el-table-column>
            <el-table-column prop="equipLevelName" align="center" label="设备等级" min-width="90">
            </el-table-column>
            <el-table-column prop="" align="center" label="设备状态" min-width="90">
              <template slot-scope="scope">
                <span>{{scope.row.equipState==1?"启用":"停用"}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="companyName" align="center" label="使用公司(集团)" min-width="120">
            </el-table-column>
            <el-table-column prop="factoryName" align="center" label="使用工厂" min-width="90">
            </el-table-column>
            <el-table-column prop="divisionName" align="center" label="使用部门" min-width="90">
            </el-table-column>
            <el-table-column prop="areaName" align="center" label="使用区域" min-width="90">
            </el-table-column>
            <el-table-column prop="equipIp" align="center" label="设备IP" min-width="80">
            </el-table-column>
            <el-table-column prop="" align="center" label="设备到厂时间" min-width="110">
              <template slot-scope="scope">
                <span>{{scope.row.unpackingDate!==null?scope.row.unpackingDate.substring(0,10):''}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="" align="center" label="安装完成时间" min-width="110">
              <template slot-scope="scope">
                <span>{{scope.row.installDate!==null?scope.row.installDate.substring(0,10):''}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="" align="center" label="预计停用时间" min-width="110">
              <template slot-scope="scope">
                <span>{{scope.row.estimeatedStopTime!==null?scope.row.estimeatedStopTime.substring(0,10):''}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="rotatName" align="center" label="班次类别" min-width="90">
            </el-table-column>
            <el-table-column prop="remarks" align="center" label="备注" min-width="70">
            </el-table-column>
            <el-table-column align="center" fixed="right" label="操作" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button title="编辑" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-if="editShow"></el-button>
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
        <!-- 导入弹框 -->
        <el-dialog title="请选择要导入的信息" top="2vh" :close-on-click-modal="false" :visible.sync="dialogTable">
           <div class="filter-container">
            <div class="formSearch">
            <el-form :inline="true">
                <el-form-item label="固定资产编号">
                <el-input class="minier-input" v-model="fixedAssetCodes" placeholder="请输入固定资产编号" clearable></el-input>
                </el-form-item>

                 <el-form-item label="设备名称" class="seat">
                <el-input v-model="equipmentNames"  placeholder="请输入设备名称" clearable></el-input>
                </el-form-item>

                <el-form-item>
                <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilterst">搜索</el-button>
                </el-form-item>
            </el-form>
            </div>
        </div>


          <el-table :data="infoList" height='300' v-loading="listLoading" 
            border fit highlight-current-row
            @selection-change="handleSelectionChange"
            style="width:100%;min-height:500px;margin-top:8px">
            <el-table-column align="center" type="selection" min-width="50">
            </el-table-column>
            <el-table-column align="center" label="固定资产编号" min-width="90">
              <template slot-scope="scope">
                <span>{{scope.row.fixedAssetCode}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="设备名称" min-width="80">
              <template slot-scope="scope">
              <span>{{scope.row.equipmentName}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="使用公司(集团)" min-width="100">
              <template slot-scope="scope">
                <span>{{scope.row.companyName}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="使用工厂" min-width="80">
              <template slot-scope="scope">
                <span>{{scope.row.factoryName}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="使用部门" min-width="80">
              <template slot-scope="scope">
                <span>{{scope.row.divisionName}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="设备到厂时间" min-width="90">
              <template slot-scope="scope">
                <span>{{scope.row.unpackingDate!==null?scope.row.unpackingDate.substring(0,10):''}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="安装完成时间" min-width="90">
              <template slot-scope="scope">
                <span>{{scope.row.installDate!==null?scope.row.installDate.substring(0,10):''}}</span>
              </template>
            </el-table-column>
          </el-table>
           <div class="pagination-container">
            <el-pagination background 
            @size-change="handleSizeChange1" 
            @current-change="handleCurrentChange1" 
            :current-page="infoQuery.pageNum" 
            :page-sizes="[50,100,500]" 
            :page-size="infoQuery.pageSize" 
            layout="total, sizes, prev, pager, next, jumper" 
            :total="infoTotal">
            </el-pagination>
          </div> 
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogTable = false">取消</el-button>
            <el-button type="primary" @click="importOk">确认</el-button>
          </div>
        </el-dialog>

        <!-- 新增设备信息弹框 -->
        <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" :visible.sync="dialogFormVisible" width="60%" v-dialogDrag>
          <el-form :rules="rules" ref="dataForm" :model="popData" label-position="left" label-width="120px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="固定资产编号:" prop="fixedAssetCode">
                  <el-input v-model="popData.fixedAssetCode" disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="设备名称:" prop="equipmentName">
                    <el-input v-model="popData.equipmentName" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="使用公司(集团):" prop="companyName">
                  <el-input v-model="popData.companyName" disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="使用工厂:" prop="factoryName">
                    <el-input v-model="popData.factoryName" disabled></el-input>
                  </el-form-item>
                </el-col>
              <el-col :span="12">
                <el-form-item label="使用部门:" prop="divisionName">
                    <el-input v-model="popData.divisionName" disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10" style="padding-right:0px;">
                <el-form-item label="使用区域:" prop="areaName">
                  <el-input v-model="popData.areaName" disabled placeholder="请选择使用区域"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2" style="padding-left:0px;"> 
                <el-button type="primary" @click="handleChoose">选择</el-button>
              </el-col>
              <el-col :span="12">
                <el-form-item label="设备类型:" prop="equipTypeName">
                  <el-input v-model="popData.equipTypeName" disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="设备类别" prop="equipCategoryName">
                  <el-select v-model="popData.equipCategoryName" clearable placeholder="请选择设备类别" @change='lbChange'>
                    <el-option
                      v-for="item in lbList"
                      :key="item.wordCode"
                      :label="item.wordName"
                      :value="item.wordName">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="设备等级:" prop="equipLevelName">
                  <el-select v-model="popData.equipLevelName" clearable placeholder="请选择设备等级" @change='djChange'>
                    <el-option
                      v-for="item in equipLevelList"
                      :key="item.equipLevel"
                      :label="item.equipLevelName"
                      :value="item.equipLevelName">
                    </el-option>
                  </el-select>
                  <!-- <el-input v-model="popData.equipLevelName" disabled></el-input> -->
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="设备状态" prop="equipState">
                    <el-radio v-model="popData.equipState" label="1" disabled>启用</el-radio>
                    <el-radio v-model="popData.equipState" label="2" disabled>停用</el-radio>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="设备号:" prop="equipCode">
                  <el-input v-model="popData.equipCode"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="设备IP:" prop="equipIp">
                  <el-input v-model="popData.equipIp"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="设备到厂时间:" prop="unpackingDate">
                  <el-date-picker v-model="popData.unpackingDate" 
                    type="date" 
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                     disabled>
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="安装完成时间:" prop="installDate">
                  <el-date-picker v-model="popData.installDate" type="date" 
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    
                    disabled>
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="预计停用时间:" prop="estimeatedStopTime">
                  <el-date-picker v-model="popData.estimeatedStopTime" type="date" 
                   placeholder="请选择"
                   format="yyyy-MM-dd"
                   value-format="yyyy-MM-dd"
                   >
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="班次类型" prop="rotatName">
                  <el-select v-model="popData.rotatName" clearable placeholder="请选择班次类型">
                    <el-option
                      v-for="item in rotatList"
                      :key="item"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
              <el-form-item label="备注" prop="remarks">
                  <el-input type="textarea" maxlength="128" v-model="popData.remarks"></el-input>
              </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <!-- 选择设备区域弹框 -->
          <el-dialog width="40%" title="选择设备使用区域" :close-on-click-modal="false" :visible.sync="innerVisible" append-to-body v-dialogDrag>
            <el-form :model="popData" label-position="left" label-width="120px">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="设备名称:" prop="equipmentName">
                    <el-input v-model="popData.equipmentName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="设备编码:" prop="equipTypeCode">
                      <el-input v-model="popData.equipTypeCode" disabled></el-input>
                    </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-form-item label="选择区域" prop="areaName">
                  <el-tree 
                    :data="addressData" 
                    ref="tree" 
                    show-checkbox 
                    node-key="addressCode"
                    :props="defaultProps" 
                    check-strictly
                    @check-change="handleClick" v-loading="diaLoading"><!-- 当前节点变化时处理事件 -->
                  </el-tree>
                </el-form-item>
                </el-row>
            </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="innerVisible = false">取消</el-button>
                <el-button type="primary" @click="chooseArea">确认</el-button>
              </div>
          </el-dialog>
          <div slot="footer" class="dialog-footer">
              <el-button v-if="dialogStatus=='detail'" @click="cancel">取消</el-button>
              <el-button v-else @click="dialogFormVisible = false">取消</el-button>
              <el-button v-if="dialogStatus=='detail'" type="primary" @click="nextData" >下一个</el-button>
              <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">完成</el-button>
              <el-button v-if="dialogStatus=='update'" type="primary" @click="updateData">提交</el-button>
          </div>
        </el-dialog>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { fetchTree, fetchNavByCode, fuzzyQuery, fetchListByCode, fetchEquipList, createArticle, fetchDetail, updateArticle, fetchlbList } from '@/api/baseInfo/baseEquipInfo'
import { menuList } from '@/store/modules/permission'
import { fetchButton } from '@/api/common/button'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'baseEquipInfo',
  directives: {
    waves
  },
  data() {
    return {
      // 按钮是否显示
      menuCode: undefined,
      addShow: false,
      editShow: false,
      // 父级地址编号
      parCode: 'sbdzqy',
      parName: '',
      // 表格初始数据
      tableKey: 0,
      listData: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        areaCode: undefined,
        equipTypeCode: undefined
      },
      // 弹框表格数据
      infoList: null,
      infoTotal: null,
      infoQuery: {
        pageNum: 1,
        pageSize: 100
      },
      fixedAssetCodes:'',
      equipmentNames:'',
      // 设备地址树结构
      diaLoading: false,
      equipData: [],
      addressData: [],
      defaultProps: {
        children: 'children',
        label: 'addressName'
      },
      // 设备类型模糊查询数组
      euipeTypeList: [],
      // 设备地址选中状态改变时
      i: 0,
      // 弹出框表单数据
      popData: {
        areaCode: undefined,
        areaName: undefined,
        companyCode: undefined,
        companyName: undefined,
        divisionCode: undefined,
        divisionName: undefined,
        equipCode: undefined,
        equipIp: undefined,
        equipState: undefined,
        equipTypeCode: undefined,
        equipTypeName: undefined,
        equipmentName: undefined,
        estimeatedStopTime: '',
        factoryCode: undefined,
        factoryName: undefined,
        fixedAssetCode: undefined,
        installDate: undefined,
        remarks: undefined,
        unpackingDate: undefined,

        equipCategory: undefined, // 设备类别编号
        equipCategoryName: undefined,
        equipLevel: undefined, // 设备等级编号
        equipLevelName: undefined,
        rotatName: undefined // 班次类型
      },
      // 设备类别下拉框
      lbList: [],
      // 班次类型下拉框
      rotatList: ['长白班', '两班制', '三班制'],
      // 设备等级
      equipLevelList: [{
        equipLevel: '1',
        equipLevelName: '一般设备'
      }, {
        equipLevel: '2',
        equipLevelName: '关键设备'
      }, {
        equipLevel: '3',
        equipLevelName: '主要设备'
      }],
      // 选中的导入信息数组
      multipleSelection: [],
      checkedIndex: '',
      number: 1,
      // 弹框显示
      dialogTable: false,
      dialogFormVisible: false,
      innerVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑设备信息',
        create: ' ',
        detail: ' ',
        looklistyp: '查看'
      },
      // 设备地址树被选中节点
      treeData: null,
      rules: {
        areaName: [{ required: true, message: '该字段不能为空', trigger: 'change' }],
        equipCode: [{ required: true, message: '该字段不能为空', trigger: 'change' }],
        estimeatedStopTime: [{ required: true, message: '该字段不能为空', trigger: 'change' }],
        equipCategoryName: [{ required: true, message: '该字段不能为空', trigger: 'change' }],
        rotatName: [{ required: true, message: '该字段不能为空', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getButton()
    this.getTree()
    this.getList()
    this.getlbList()
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
          if (e.name == 'baseEquipInfo') {
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
            if (buttons[i].buttonName == '导入') {
              this.addShow = true
            } else if (buttons[i].buttonName == '编辑') {
              this.editShow = true
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
    // 请求设备地址树
    getTree() {
      fetchTree().then(response => {
        this.equipData = []
        this.equipData.push(response.data.data[0])
      })
    },
    // 获取设备类别下拉框
    getlbList() {
      const find = {
        parCode: 'SBLB',
        pageNum: 1,
        pageSize: 50
      }
      fetchlbList(find).then(response => {
        this.lbList = []
        this.lbList = response.data.data.list
      })
    },
    lbChange() {
      this.lbList.forEach(item => {
        if (item.wordName == this.popData.equipCategoryName) {
          this.popData.equipCategory = item.wordCode
        }
      })
    },
    // 设备类型下拉框获取焦点
    getFocus() {
      this.euipeTypeList = []
      this.listQuery.equipTypeCode = ''
    },
    djChange() {
      this.equipLevelList.forEach(item => {
        if (item.equipLevelName == this.popData.equipLevelName) {
          this.popData.equipLevel = item.equipLevel
        }
      })
    },
    // 获取设备类型模糊查询数组
    getEuipeType(query) {
      if (query !== '') {
        this.euipeTypeList = []
        this.loading = true
        fuzzyQuery(query).then(response => {
          if (response.data.code === 200) {
            this.loading = false
            this.euipeTypeList = response.data.data.map(item => {
              return { value: item.categoryCode, label: item.categoryName }
            })
          }
        })
      } else {
        this.euipeTypeList = []
      }
    },
    // 点击设备地址请求表格和导航
    handleNodeClick(data) {
      this.parCode = data.addressCode
      this.listQuery.areaCode = data.addressCode
      this.getList()
      this.getNav(this.parCode)
    },
    // 设备地址导航信息
    getNav(parCode) {
      fetchNavByCode(parCode).then(response => {
        const navList = response.data.data.reverse()
        var navName = ''
        if (response.data.code === 200) {
          navName = ''
          navList.forEach(function(item, index) {
            navName = navName + '/         ' + item
          })
          var length = navName.length + 1
          this.parName = navName.substr(1, length)
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
    // 表格加载
    getList() {
      this.listLoading = true
      fetchListByCode(this.listQuery).then(response => {
        if (response.data.code === 200) {
          this.listData = response.data.data.list
          this.total = response.data.data.total
          setTimeout(() => {
            this.listLoading = false
          }, 200)
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
    // 刷新
    refresh() {
      this.listQuery = {
        pageNum: 1,
        pageSize: 10,
        areaCode: undefined,
        equipTypeCode: undefined
      }
      this.getList()
    },
    // 一、导入按钮
    importData() {
      this.dialogTable = true
      this.getInfoList()
    },
    // 弹框表格加载
    getInfoList() {
      this.listLoading = true
      fetchEquipList(this.fixedAssetCodes,this.equipmentNames,this.infoQuery).then(response => {
        if (response.data.code === 200) {
          this.infoList = response.data.data.list
          this.infoTotal = response.data.data.total
          setTimeout(() => {
            this.listLoading = false
          }, 200)
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
    // 弹框分页搜索
     handleFilterst(data) {
      this.infoQuery.pageNum = 1
      this.getInfoList()
    },
    handleSizeChange1(val) {
      this.infoQuery.pageSize = val
      this.getInfoList()
    },
    handleCurrentChange1(val) {
      this.infoQuery.pageNum = val
      this.getInfoList()
    },
    // 弹框表格被选择
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.checkedIndex = val.length
    },
    // 清空表单
    resetTemp() {
      this.popData = {
        areaCode: undefined,
        areaName: undefined,
        companyCode: undefined,
        companyName: undefined,
        divisionCode: undefined,
        divisionName: undefined,
        equipCode: undefined,
        equipIp: undefined,
        equipState: undefined,
        equipTypeCode: undefined,
        equipTypeName: undefined,
        equipmentName: undefined,
        estimeatedStopTime: '',
        factoryCode: undefined,
        factoryName: undefined,
        fixedAssetCode: undefined,
        installDate: undefined,
        remarks: undefined,
        unpackingDate: undefined,

        equipCategory: undefined, // 设备类别编号
        equipCategoryName: undefined,
        equipLevel: undefined, // 设备等级编号
        equipLevelName: undefined,
        rotatName: undefined // 班次类型
      }
    },
    // 表单赋值
    formAdd() {
      if (this.number != this.checkedIndex) {
        this.dialogStatus = 'detail'
        this.textMap.detail = '设备信息' + '  导入信息中(' + this.number + '  /   ' + this.checkedIndex + ')'
      } else if (this.number == this.checkedIndex) {
        this.dialogStatus = 'create'
        this.textMap.create = '设备信息' + '  导入信息中(' + this.number + '  /   ' + this.checkedIndex + ')'
      }
      this.popData = this.multipleSelection[this.number - 1]
      this.popData.equipIp = ''
      this.popData.remarks = ''
      // this.popData.unpackingDate = new Date(this.popData.unpackingDate)
      // this.popData.installDate = new Date(this.popData.installDate)

      //  this.popData.equipState = this.popData.equipmentStatus.toString()
       if(this.popData.equipmentStatus=="2"|| this.popData.equipmentStatus=="1"){
        // console.log(123)
        // console.log(this.popData.equipmentStatus.toString())
        this.popData.equipState = '1'
      }else{
       
        this.popData.equipState = '2'
      } 
      this.popData.equipTypeCode = this.popData.equipmentTypeCode
      this.popData.equipTypeName = this.popData.equipmentTypeName
      // this.popData.equipLevel = this.popData.equipmentType // 设备等级编号
      // if (this.popData.equipLevel == '1') {
      //   this.popData.equipLevelName = '一般设备'
      // } else if (this.popData.equipLevel == '2') {
      //   this.popData.equipLevelName = '关键设备'
      // } else if (this.popData.equipLevel == '3') {
      //   this.popData.equipLevelName = '主要设备'
      // }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 导入弹框确认
    importOk(row) {
      if (this.checkedIndex == 0) {
        this.$message({
          title: '警告',
          message: '请选择要导入的信息',
          type: 'warning',
          duration: 2000
        })
        return
      }
      this.resetTemp()
      this.number = 1
      this.dialogTable = false

      this.formAdd()
      this.dialogFormVisible = true
    },
    // 取消
    cancel() {
      this.number = this.number + 1
      this.formAdd()
    },
    // 下一个
    nextData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.popData.estimeatedStopTime == undefined) {
            this.$notify({
              title: '警告',
              message: '请选择预计停用时间',
              type: 'warning',
              duration: 2000
            })
            return
          }
          // 请求添加设备信息
           if(this.popData.unpackingDate!=null){
            this.popData.unpackingDate = this.popData.unpackingDate.substring(0, 10)//设备到厂时间
          } 
          if(this.popData.installDate!=null){
            this.popData.installDate = this.popData.installDate.substring(0, 10)//安装完成时间
          } 
          createArticle(this.popData).then(response => {
            if (response.data.code === 200) {
              this.$message({
                title: '成功',
                message: '导入成功',
                type: 'success',
                duration: 2000
              })
              this.resetTemp()
              this.number = this.number + 1

              this.formAdd()
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
      })
    },
    // 完成
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.popData.estimeatedStopTime == undefined) {
            this.$notify({
              title: '警告',
              message: '请选择预计停用时间',
              type: 'warning',
              duration: 2000
            })
            return
          }
           if(this.popData.unpackingDate!=null){
            this.popData.unpackingDate = this.popData.unpackingDate.substring(0, 10)//设备到厂时间
          } 
          if(this.popData.installDate!=null){
            this.popData.installDate = this.popData.installDate.substring(0, 10)//安装完成时间
          } 
          createArticle(this.popData).then(response => {
            if (response.data.code === 200) {
              this.dialogFormVisible = false
              this.$message({
                title: '成功',
                message: '导入成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
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
      })
    },
    // 查看
    checkDetails(row) {
      const id = row.id
      fetchDetail(id).then(response => {
        this.popData = Object.assign({}, response.data.data)
        this.popData.equipState = response.data.data.equipState.toString()
      })
      this.dialogStatus = 'looklistyp'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 编辑事件
    handleUpdate(row) {
      // 根据地址编码查询地址信息赋值给表单
      const id = row.id
      fetchDetail(id).then(response => {
        this.popData = Object.assign({}, response.data.data)
        // this.popData.unpackingDate = new Date(this.popData.unpackingDate)
        // this.popData.installDate = new Date(this.popData.installDate)
        // this.popData.estimeatedStopTime = new Date(this.popData.estimeatedStopTime)
        this.popData.equipState = response.data.data.equipState.toString()
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
              this.dialogFormVisible = false
              this.$message({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '警告',
                message: msg,
                type: 'warning',
                duration: 2000
              })
            }
          })
        }
      })
    },
    // 选择使用区域
    handleChoose() {
      this.innerVisible = true
      this.diaLoading = true
      // 查询地址树结构
      fetchTree().then(response => {
        this.addressData = []
        this.addressData = response.data.data[0].children
        setTimeout(() => {
          this.diaLoading = false
        }, 1 * 1000)
      })
    },
    // 设置树状图单选--节点变化事件
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
    // 获取设备地址树被选择的节点
    getCheckedNodes() {
      this.treeData = this.$refs.tree.getCheckedNodes()
      this.popData.areaCode = this.treeData[0].addressCode
      this.popData.areaName = this.treeData[0].addressName
    },
    // 选择设备区域确认
    chooseArea() {
      this.getCheckedNodes()
      this.innerVisible = false
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
.futiop{
text-decoration:underline
}
</style>
