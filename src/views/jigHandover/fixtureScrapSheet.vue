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
                    <el-table-column prop="manufacturer" align="center" label="制造厂家">
                    </el-table-column>
                    <el-table-column prop="unpackingDate" align="center" label="进厂时间">
                    </el-table-column>
                    <el-table-column prop="applicationUserName" align="center" label="申请人">
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
                <el-button type="success" icon='el-icon-printer' @click="printData" v-if="chooseShow">打印</el-button>
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
                            <el-form-item label="进厂时间" prop="unpackingDate">
                                <el-input type="text" v-model="temp.unpackingDate" disabled></el-input>
                            </el-form-item>
                        </el-col>
                         <el-col :span="8">
                            <el-form-item label="制造厂家" prop="manufacturer">
                                <el-input type="text" v-model="temp.manufacturer" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="报废原因" prop="scrapCase">
                                <el-input type="textarea" maxlength="85" :disabled="chooseShow" v-model="temp.scrapCase">
                                </el-input>
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
                        <el-col :span="8" style="padding-right:0px;">
                            <el-form-item label="申请人" prop="applicationUserName">
                                <el-input type="text" v-model="temp.applicationUserName" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="申请日期" prop="applicationDate">
                                <el-date-picker v-model="temp.applicationDate" :disabled="chooseShow" style="width:100%" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <!-- <el-col :span="1" style="width:1px;color:red;padding:8px">
                            <span>*</span>
                        </el-col> -->
                        <el-col :span="10">
                            <el-form-item label="审核附件上传" prop="jszlFileData">
                                <input id="uploadImg2" type="file" @change="fileUpload2">
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-table :data="jszlFileData" border fit highlight-current style="width: 70%; margin-left:100px;">
                        <el-table-column prop="fileName" align="center" label="文件名">
                            <template slot-scope="scope">
                                <span class="look-detail" @click="lookFile(scope.row)">{{scope.row.fileName}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="操作">
                            <template slot-scope="scope">
                                <el-button title="下载" type="primary" size="mini" icon="el-icon-download" @click="fileDown(scope.row)"></el-button>
                                <!-- <el-button title="删除" type="danger" icon="el-icon-delete" size="mini" @click="jszlFileDelete(scope.row)" :disabled="scope.row.deleteDisabled?true:false"></el-button> -->
                                <el-button v-if="dialogStatus=='create'" title="删除" type="danger" icon="el-icon-delete" size="mini" @click="fileDelete(scope.row)"></el-button>
                                <el-button v-if="dialogStatus=='update'" title="删除1" type="danger" icon="el-icon-delete" size="mini" @click="jszlFileDelete(scope.row)"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
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
            <!-- 打印 -->
            <el-dialog title="打印预览" :close-on-click-modal="false" :visible.sync="printDialogVisible" width="60%" v-dialogDrag>
                <el-button type="primary" @click="printDialogVisible = false">返回</el-button>
                <el-button type="success" v-print="'#printTest'">
                    <svg-icon icon-class="print" />打印</el-button>
                <div id="printTest">
                    <table border="0" style="border-right:1px solid black">
                        <caption style="font-size: 24px;padding-bottom:20px; font-weight:800">工装夹具报废申请单</caption>
                        <tbody>
                            <tr>
                                <td>夹具名称/规格</td>
                                <td>{{printList.fixtrueName}}/{{printList.model}}</td>
                                <td>资产编码</td>
                                <td>{{printList.fixedAssetCode}}</td>
                                <td>制造厂家</td>
                                <td>{{printList.manufacturer}}</td>
                            </tr>
                            <tr>
                                <td>使用工厂</td>
                                <td>{{printList.factoryName}}</td>
                                <td>使用部门</td>
                                <td>{{printList.divisionName}}</td>
                                <td>进厂时间</td>
                                <td>{{printList.unpackingDate}}</td>
                            </tr>
                            <tr style="height:120px;">
                                <td style="position: relative;" colspan="6">
                                    <span style="position: absolute;left:5px;top:5px;">报废原因：
                                        <span style="font-size:14px;">{{printList.scrapCase}}</span>
                                    </span>
                                    <span style="position: absolute;right:200px;bottom:20px;">申请日期：{{printList.applicationDate!=null?printList.applicationDate.substring(0,10):''}}</span>
                                    <span style="position: absolute;right:450px;bottom:20px;">申请人：{{printList.applicationUserName}}</span>
                                </td>
                            </tr>
                            <!-- <tr style="height:60px;border-bottom:0px solid white;" >
                                <td rowspan="2" align="center">报废原因：</td>
                                <td align="left" colspan="3" style="border-bottom:0px solid white;">
                                    <span>{{printList.scrapCase}}</span>
                                </td>
                            </tr>
                            <tr style="border-top:0px solid white;">
                                <td style="border-top:0px solid white;border-bottom:0px solid white;" colspan="3" align="right">
                                    <span style="position: absolute;right:200px;bottom:20px;">申请日期：{{printList.applicationDate!=null?printList.applicationDate.substring(0,10):''}}</span>
                                    <span style="position: absolute;right:450px;bottom:20px;">申请人：{{printList.applicationUserName}}</span>
                                </td>
                            </tr> -->
                            <tr style="height:120px;">
                                <td style="position: relative;" colspan="6">
                                    <span style="position: absolute;left:5px;top:5px;">技术科（部）意见：
                                        <span style="font-size:14px;"></span>
                                    </span>
                                    <span style="position: absolute;right:200px;bottom:20px;">签字：</span>
                                    <span style="position: absolute;right:450px;bottom:20px;">日期：</span>
                                </td>
                            </tr>
                            <tr style="height:120px;">
                                <td style="position: relative;" colspan="6">
                                    <span style="position: absolute;left:5px;top:5px;">设备科（部）意见：
                                        <span style="font-size:14px;"></span>
                                    </span>
                                    <span style="position: absolute;right:200px;bottom:20px;">签字：</span>
                                    <span style="position: absolute;right:450px;bottom:20px;">日期：</span>
                                </td>
                            </tr>
                            <tr style="height:120px;">
                                <td style="position: relative;" colspan="6">
                                    <span style="position: absolute;left:5px;top:5px;">厂长：
                                        <span style="font-size:14px;"></span>
                                    </span>
                                    <span style="position: absolute;right:200px;bottom:20px;">签字：</span>
                                    <span style="position: absolute;right:450px;bottom:20px;">日期：</span>
                                </td>
                            </tr>
                            <tr style="height:120px;">
                                <td style="position: relative;" colspan="6">
                                    <span style="position: absolute;left:5px;top:5px;">资产部意见：
                                        <span style="font-size:14px;"></span>
                                    </span>
                                    <span style="position: absolute;right:200px;bottom:20px;">签字：</span>
                                    <span style="position: absolute;right:450px;bottom:20px;">日期：</span>
                                </td>
                            </tr>
                            <tr style="height:120px;">
                                <td style="position: relative;" colspan="6">
                                    <span style="position: absolute;left:5px;top:5px;">董事长：
                                        <span style="font-size:14px;"></span>
                                    </span>
                                    <span style="position: absolute;right:200px;bottom:20px;">签字：</span>
                                    <span style="position: absolute;right:450px;bottom:20px;">日期：</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </el-dialog>
        </el-container>
    </div>
</template>

<script>
import { fetchList, fetchList1, delById, getDetail, createArticle, updateArticle } from '@/api/jigHandover/fixtureScrapSheet'
import { getCurrentUser, fileList, uploadlist, insertFile, deleteFileById,deleteFile} from '@/api/common/common'
import { fetchButton } from '@/api/common/button'
import { menuList } from '@/store/modules/permission'
import { baseUrl } from '@/api/common/fileBaseUrl'
export default {
  name: 'fixtureScrapSheet',
  data() {
    return {
      chooseShow: false,
      multipleSelection: null,
      printDialogVisible: false, // 打印
      printList: {
        fixtrueName: null,
        fixedAssetCode: null,
        model: null,
        factoryName: null,
        divisionName: null,
        manufacturer: null,
        unpackingDate: null,
        scrapCase: null,
        applicationUserName: null,
        applicationDate: null
      },
      jszlFileData: [],
      id: '',
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
      listQuery2: {},
      temp: {
        fixtrueName: undefined,
        fixedAssetCode: undefined,
        model: undefined,
        companyCode: undefined,
        companyName: undefined,
        factoryCode: undefined,
        factoryName: undefined,
        divisionCode: undefined,
        divisionName: undefined,
        manufacturer: undefined,
        unpackingDate: undefined,
        applicationDate: new Date(),
        applicationUserNo: undefined,
        applicationUserName: undefined,
        remark: undefined,
        scrapCase: undefined,
        list: []
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        create: '新增',
        update: '编辑'
      },
      rules: {
        fixtrueName: [{ required: true, message: '此项为必填项', trigger: 'change' }],
        scrapCase: [{ required: true, message: '此项为必填项', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
    this.getButton()
  },
  methods: {
    getButton() {
      menuList.forEach(item => {
        item.children.forEach(e => {
          if (e.name == 'fixtureScrapSheet') {
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
            if (
              response.data.data != null &&
                            response.data.data.list != null
            ) {
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
      this.temp.unpackingDate = this.multipleSelection.openCheckDate
      this.temp.manufacturer = this.multipleSelection.manufacturer
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
          this.temp.applicationUserName = response.data.data.perName
          this.temp.applicationUserNo = response.data.data.workNumber
          this.userId = response.data.data.id
        }
      })
    },
    // 获取文件
    getFileList() {
      // 技术资料
      const find2 = {
        moduleType: '27', // 模块类别
        attachmentCode: 'GZJJBFSQDSHSQD',
        documentWordCode: this.id
      }
      fileList(find2).then(response => {
        this.jszlFileData = response.data.data
        for (var i = 0; i < this.jszlFileData.length; i++) {
          if (this.jszlFileData[i].userId == this.userId) {
            this.jszlFileData[i].deleteDisabled = false
          } else {
            this.jszlFileData[i].deleteDisabled = true
          }
        }
      })
    },
    // 重置表单
    resetTemp() {
      this.temp = {
        fixtrueName: undefined,
        fixedAssetCode: undefined,
        model: undefined,
        companyCode: undefined,
        companyName: undefined,
        factoryCode: undefined,
        factoryName: undefined,
        divisionCode: undefined,
        divisionName: undefined,
        manufacturer: undefined,
        unpackingDate: undefined,
        applicationDate: new Date(),
        applicationUserNo: undefined,
        applicationUserName: undefined,
        remark: undefined,
        scrapCase: undefined,
        list: []
      }
      this.jszlFileData = []
    },
    // 新增
    handleCreate() {
      this.chooseShow = false
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
      this.temp.list = this.jszlFileData
    //   if (this.temp.list.length == 0) {
    //     this.$notify({
    //       title: '警告',
    //       message: '请上传审核附件',
    //       type: 'warning',
    //       duration: 2000
    //     })
    //     return
    //   }
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
      this.chooseShow = true
      this.id = row.id
      this.dialogStatus = 'update'
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
      this.getUser()
      this.getFileList()
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
    },
    // 审核附件上传
    fileUpload2(e) {
      const file = e.target.files[0]
      const fileData2 = {
        attachmentCode: 'GZJJBFSQDSHSQD',
        code: this.id,
        moduleType: '27',
        fileName: undefined,
        filePath: undefined, // 文件URL
        node: '',
        fileUrl: undefined,
        userId: this.userId
      }
      if (file != null) {
        this.listLoading = true
        const param = new FormData() // 创建form对象
        param.append('file', file, file.name) // 通过append向form对象添加数据
        fileData2.fileName = file.name
        uploadlist(param).then(resp => {
          // 调用上传接口
          if (resp.data.code == 200) {
            fileData2.filePath = resp.data.data.remoteFilename
            fileData2.fileUrl = resp.data.data.fileUrl
            // 新增文件
            if (this.dialogStatus == 'update') {
              insertFile(fileData2).then(response => {
                if (response.data.code == 200) {
                    this.temp.flag = true;
                  fileData2.id = response.data.data
                  this.$message({
                    title: '成功',
                    message: '上传成功',
                    type: 'success',
                    duration: 2000
                  })
                  this.jszlFileData.push(fileData2)
                }
              })
            } else if (this.dialogStatus == 'create') {
              this.jszlFileData.push(fileData2)
              this.$message({
                title: '成功',
                message: '上传成功',
                type: 'success',
                duration: 2000
              })
            }
            setTimeout(() => {
              this.listLoading = false
            }, 1 * 500)
          } else if (resp.data.code == 402) {
            this.$notify({
              title: '警告',
              message: resp.data.msg,
              type: 'warning',
              duration: 2000
            })
          } else {
            this.$notify({
              title: '警告',
              message: '上传失败',
              type: 'warning',
              duration: 2000
            })
          }
          this.listLoading = false
          const fileInput2 = document.getElementById('uploadImg2')
          fileInput2.value = ''
        })
      }
    },
    // 文件下载
    fileDown(row) {
      if (row.fileUrl !== undefined) {
        window.location.href = row.fileUrl + '?attname=' + row.fileName
      } else {
        window.location.href =
                    row.filePath + '?attname=' + row.fileName
      }
    },
    // 新增删除文件
    fileDelete(row) {
        this.$confirm("是否确认删除?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        })
            .then(() => {
                const find1 = {
                    fileName: row.filePath
                };
                deleteFile(find1).then(response => {
                    if (response.data.code === 200) {
                        const index = this.jszlFileData.indexOf(row);
                        this.jszlFileData.splice(index, 1);
                        this.$message({
                            title: "成功",
                            type: "success",
                            message: "删除成功!",
                            duration: 2000
                        });
                    } else {
                        this.$notify({
                            title: "警告",
                            message: response.data.msg,
                            type: "warning",
                            duration: 2000
                        });
                    }
                });
            })
            .catch(() => {
                this.$message({
                    type: "info",
                    message: "已取消删除"
                });
            });
    },
    // 编辑删除审核附件
    jszlFileDelete(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const id = row.id
          deleteFileById(id).then(response => {
            if (response.data.code === 200) {
              const index = this.jszlFileData.indexOf(row)
              this.jszlFileData.splice(index, 1)
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
    },
    // 文件预览
    lookFile(row) {
      let url
      if (row.fileUrl !== undefined) {
        url =
                    baseUrl +
                    'onlinePreview?url=' +
                    encodeURIComponent(row.fileUrl)
      } else {
        url =
                    baseUrl +
                    'onlinePreview?url=' +
                    encodeURIComponent(row.filePath)
      }
      var winHeight = window.document.documentElement.clientHeight
      window.open(
        url,
        '_blank',
        'height=' +
                    winHeight +
                    ',top=10,left=10,toolbar=no,menubar=no,scrollbars=yes,resizable=yes'
      )
    },
    // 打印
    printData() {
      this.printDialogVisible = true
      const id = { id: this.id }
      getDetail(id).then(response => {
        if (response.data.code == 200) {
          this.printList = Object.assign({}, response.data.data)
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
#printTest table{
  font-family:"宋体";
  border-collapse:collapse;
  width:99.5%;
}
#printTest table thead th{
  height: 80px;
  font-size: 16px;
  text-align: left;
}
#printTest table tbody tr{
  font-size:16px;
  border: 1px solid black;
  height: 130px;
  text-align: center;
}
#printTest table tbody td{
  border: 1px solid black;
  width: 16.6%;
}
</style>

