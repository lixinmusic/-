<template>
    <div class='app-container'>
        <el-container>
            <div class="formSearch">
                <el-form :inline="true">
                    <el-form-item label="时间">
                        <el-date-picker
                            style="width:100%"
                            @change="changeTime()"
                            v-model="value13"
                            type="daterange"
                            format="yyyy-MM"
                            value-format="yyyy-MM-dd"
                            range-separator="至"
                            start-placeholder="开始月份"
                            end-placeholder="结束月份">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="公司">
                        <el-input v-model="companyName" disabled>
                            <el-button slot="append" style="padding:10px;" @click="changeCompany">选择</el-button>
                            <el-button slot="append" style="padding:10px;" @click="clearCompany">清空</el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="工厂">
                        <el-input v-model="factoryName" disabled>
                            <el-button slot="append" style="padding:10px;" @click="changeFactory">选择</el-button>
                            <el-button slot="append" style="padding:10px;" @click="clearFactory">清空</el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="车间">
                        <el-input v-model="divisionName" disabled>
                            <el-button slot="append" style="padding:10px;" @click="changeDivision">选择</el-button>
                            <el-button slot="append" style="padding:10px;" @click="clearDivision">清空</el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="filter-item" type="primary" style="float:right" icon="el-icon-search" @click="handleFilter">搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-main style="padding:20px 0">
                <el-table :key='tableKey' :data="tableData" height="200" row-key="id" v-loading="listLoading" border fit highlight-current style="width: 100%;margin-top:10px;min-height:500px" :header-cell-style="{background:'oldlace'}">
                    <el-table-column type="index" width="60" align="center" label="序号">
                        <template slot-scope="scope">
                            {{scope.$index+(pageNum -1) * pageSize +1}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="companyName" align="center" label="公司">
                    </el-table-column>
                    <el-table-column prop="factoryName" align="center" label="工厂">
                    </el-table-column>
                    <el-table-column prop="divisionName" align="center" label="车间">
                    </el-table-column>
                    <el-table-column prop="startNum" align="center" label="初期数量">
                    </el-table-column>
                    <el-table-column prop="equipNum" align="center" label="本月入库采购数">
                        <el-table-column prop="date" align="center" label="月份">
                        </el-table-column>
                        <el-table-column prop="procureNum" align="center" label="数量">
                            <template slot-scope="scope">
                                <span class="look-detail" @click="handleDetail(scope.row)">{{scope.row.procureNum}}</span>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column prop="equipNum" align="center" label="本月领用数">
                        <el-table-column prop="date" align="center" label="月份">
                        </el-table-column>
                        <el-table-column prop="receiveNum" align="center" label="数量">
                            <template slot-scope="scope">
                                <span class="look-detail" @click="handleDetail1(scope.row)">{{scope.row.receiveNum}}</span>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column prop="equipNum" align="center" label="本月归还数">
                        <el-table-column prop="date" align="center" label="月份">
                        </el-table-column>
                        <el-table-column prop="returnNum" align="center" label="数量">
                            <template slot-scope="scope">
                                <span class="look-detail" @click="handleDetail2(scope.row)">{{scope.row.returnNum}}</span>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column prop="" align="center" label="结存">
                        <template slot-scope="scope">
                            {{scope.row.startNum + scope.row.procureNum - scope.row.receiveNum + scope.row.returnNum}}
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
            <el-dialog title="夹具明细" :visible.sync="dialogTableVisible" width="60%" v-dialogDrag>
                <el-table :data="detailData" border fit highlight-current-row :header-cell-style="{background:'oldlace',color:'#606266'}" style="font-size:10px;">
                    <el-table-column type="index" width="60" align="center" label="序号"></el-table-column>
                    <el-table-column align="center" prop="fixtureName" label="夹具名称"></el-table-column>
                    <el-table-column align="center" prop="fixedAssetCode" label="固定资产编号"></el-table-column>
                    <el-table-column align="center" prop="model" label="规格型号"></el-table-column>
                    <el-table-column align="center" prop="manufacturer" label="制造厂家"></el-table-column>
                </el-table>
                <el-footer>
                    <div class="pagination-container" v-if="isShow">
                        <el-pagination background @size-change="handleSizeChange3" @current-change="handleCurrentChange3" :current-page="pageNum3" :page-sizes="[5,10,15, 20]" :page-size="pageSize3" layout="total, sizes, prev, pager, next, jumper" :total="total3">
                        </el-pagination>
                    </div>
                    <div class="pagination-container" v-if="isShow1">
                        <el-pagination background @size-change="handleSizeChange1" @current-change="handleCurrentChange1" :current-page="pageNum1" :page-sizes="[5,10,15, 20]" :page-size="pageSize1" layout="total, sizes, prev, pager, next, jumper" :total="total1">
                        </el-pagination>
                    </div>
                    <div class="pagination-container" v-if="isShow2">
                        <el-pagination background @size-change="handleSizeChange2" @current-change="handleCurrentChange2" :current-page="pageNum2" :page-sizes="[5,10,15, 20]" :page-size="pageSize2" layout="total, sizes, prev, pager, next, jumper" :total="total2">
                        </el-pagination>
                    </div>
                </el-footer>
            </el-dialog>
            <!-- 选择公司/工厂 -->
            <el-dialog width="40%" :title="textMap1[dialogStatus1]" :visible.sync="companyVisible" append-to-body :close-on-click-modal="false" v-dialogDrag>
                <el-container>
                    <el-aside width="500px">
                        <span style="margin-left:20px;color:red">{{getCompanyName}}</span>
                        <el-tree :data="companyData" :props="defaultProps" ref="comtree" show-checkbox node-key='orgCode' check-strictly @check-change="handleChange1" v-loading="diaLoading"></el-tree>
                    </el-aside>
                </el-container>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="companyVisible = false" type="default">取消</el-button>
                    <el-button v-if="dialogStatus1=='company'" type="primary" @click="handleClickCompany">确定</el-button>
                    <el-button v-if="dialogStatus1=='factory'" type="primary" @click="handleClickFactory">确定</el-button>
                </div>
            </el-dialog>
            <!-- 选择部门 -->
            <el-dialog width="50%" title="选择部门" :visible.sync="divisionVisible" append-to-body :close-on-click-modal="false" v-dialogDrag>
                <el-container>
                    <el-aside width="500px">
                        <span style="margin-left:20px;color:red">{{getOrgName}}</span>
                        <el-tree :data="orgData" :props="defaultProps" ref="tree" show-checkbox node-key="orgCode" check-strictly @check-change="handleChange" v-loading="diaLoading">
                        </el-tree>
                    </el-aside>
                </el-container>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="divisionVisible = false">取消</el-button>
                    <el-button @click="handleClick2" type="primary">确定</el-button>
                </div>
            </el-dialog>
        </el-container>
    </div>
</template>

<script>
import { fetchList, getDetail } from '@/api/jigHandover/monthlyStatistics'
import { fetchComTree, fetchOrgTree, fetchComByCode } from '@/api/common/common'
export default {
  name: 'monthlyStatistics',
  data() {
    return {
      dialogStatus1: '',
      diaLoading: false,
      textMap1: {
        company: '选择公司',
        factory: '选择工厂'
      },
      // 选择公司
      defaultProps: {
        children: 'children',
        label: 'orgFullName'
      },
      // 公司（工厂）
      j: 0,
      companyVisible: false,
      factoryVisible: false,
      companyData: [],
      // 部门
      i: 0,
      divisionVisible: false,
      orgData: [],
      getCompanyName: undefined,
      getCompanyCode: undefined,
      getOrgName: undefined,
      getOrgCode: undefined,
      value13: [],
      menuCode: undefined,
      // 表格数据
      tableKey: 0,
      listLoading: false,
      tableData: [],
      total: null,
      pageNum: 1,
      pageSize: 10,
      listQuery: {
        startDate: '',
        endDate: '',
        companyCode: undefined,
        factoryCode: undefined,
        divisionCode: undefined

      },
      companyName: undefined,
      factoryName: undefined,
      divisionName: undefined,
      dialogTableVisible: false,
      detailData: [],
      total3: null,
      pageNum3: 1,
      pageSize3: 10,
      total1: null,
      pageNum1: 1,
      pageSize1: 10,
      total2: null,
      pageNum2: 1,
      pageSize2: 10,
      row3: {},
      row1: {},
      row2: {},
      isShow: false,
      isShow1: false,
      isShow2: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    changeTime() {
      if (this.value13 == null) {
        this.listQuery.startDate = ''
        this.listQuery.endDate = ''
      } else {
        this.listQuery.startDate = this.value13[0]
        this.listQuery.endDate = this.value13[1]
      }
    },
    // 选择使用公司
    changeCompany() {
      this.j = 0
      this.dialogStatus1 = 'company'
      this.getCompanyCode = undefined
      this.getCompanyName = undefined
      this.companyData = []
      this.companyVisible = true
      this.diaLoading = true
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
      this.companyName = this.getCompanyName
      this.listQuery.companyCode = this.getCompanyCode
      this.listQuery.factoryCode = undefined
      this.factoryName = undefined
      this.companyVisible = false
    },
    // 清空选择公司
    clearCompany() {
      this.companyName = undefined
      this.listQuery.companyCode = undefined
    },
    // 设置公司/工厂组织树状图单选
    handleChange1(data, checked, node) {
      this.j++
      if (this.j % 2 == 0) {
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
    // 选择使用工厂
    changeFactory() {
      this.j = 0
      this.dialogStatus1 = 'factory'
      this.getCompanyCode = undefined
      this.getCompanyName = undefined
      this.companyData = []
      this.companyVisible = true
      this.diaLoading = true
      if (this.listQuery.companyCode != undefined && this.listQuery.companyCode != null && this.listQuery.companyCode != '') {
        const find = {
          orgCode: this.listQuery.companyCode
        }
        fetchComByCode(find).then(response => {
          if (response.data.code === 200) {
            this.companyData.push(response.data.data)
            for (var i = 0; i < this.companyData.length; i++) {
              if (this.companyData[i].orgType == '部门') {
                this.companyData[i].disabled = true
              }
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
                    if (
                      child.children[p].orgType == '部门'
                    ) {
                      child.children[p].disabled = true
                    }
                  }
                }
              }
            }
          }
        })
      }
      setTimeout(() => {
        this.diaLoading = false
      }, 1 * 1000)
    },
    // 选择工厂确认
    handleClickFactory() {
      this.treeData1 = this.$refs.comtree.getCheckedNodes()
      this.getCompanyCode = this.treeData1[0].orgCode
      this.getCompanyName = this.treeData1[0].orgFullName
      this.factoryName = this.getCompanyName
      this.listQuery.factoryCode = this.getCompanyCode
      this.divisionName = undefined
      this.companyVisible = false
    },
    // 清空选择工厂
    clearFactory() {
      this.factoryName = undefined
      this.listQuery.factoryCode = undefined
    },
    // 选择使用部门
    changeDivision() {
      this.getOrgCode = undefined
      this.getOrgName = undefined
      this.orgData = []
      this.divisionVisible = true
      this.diaLoading = true
      if (this.listQuery.factoryCode != undefined && this.listQuery.factoryCode != null && this.listQuery.factoryCode != '') {
        const find1 = {
          orgCode: this.listQuery.factoryCode
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
                          if (
                            child2.orgType == '公司'
                          ) {
                            child2.disabled = true
                          }
                          if (
                            child2.children != null
                          ) {
                            for (
                              var q = 0;
                              q <
                                                            child2.children
                                                              .length;
                              q++
                            ) {
                              const child3 =
                                                                child2.children[
                                                                  q
                                                                ]
                              if (
                                child3.orgType ==
                                                                '公司'
                              ) {
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
            }
          }
        })
      }

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
        } else {
          this.$refs.tree.setCheckedNodes([])
        }
      }
    },
    // 获取部门被选择的节点
    getCheckedNodes() {
      this.treeData = this.$refs.tree.getCheckedNodes()
      this.getOrgCode = this.treeData[0].orgCode
      this.getOrgName = this.treeData[0].orgFullName
    },
    // 点击选择部门确认
    handleClick2() {
      this.getCheckedNodes()
      this.divisionName = this.getOrgName
      this.listQuery.divisionCode = this.getOrgCode
      this.divisionVisible = false
    },
    // 清空使用部门
    clearDivision() {
      this.divisionName = undefined
      this.listQuery.divisionCode = undefined
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
    // 夹具明细 (采购)
    handleDetail(row) {
      this.isShow = true
      this.isShow1 = false
      this.isShow2 = false
      this.row3 = row
      this.detailData = []
      this.getBuy()
      this.dialogTableVisible = true
    },
    getBuy() {
      const param = {
        companyCode: this.row3.companyCode,
        divisionCode: this.row3.divisionCode,
        factoryCode: this.row3.factoryCode,
        flag: 2,
        startDate: this.row3.date + '-01'
      }
      getDetail(this.pageNum3, this.pageSize3, param).then(response => {
        if (response.data.code === 200) {
          this.detailData = response.data.data.list
          this.total3 = response.data.data.total
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
    // 夹具明细 (领用)
    handleDetail1(row) {
      this.isShow1 = true
      this.isShow = false
      this.isShow2 = false
      this.row1 = row
      this.detailData = []
      this.getUse()
      this.dialogTableVisible = true
    },
    getUse() {
      const param = {
        companyCode: this.row1.companyCode,
        divisionCode: this.row1.divisionCode,
        factoryCode: this.row1.factoryCode,
        flag: 3,
        startDate: this.row1.date + '-01'
      }
      getDetail(this.pageNum1, this.pageSize1, param).then(response => {
        if (response.data.code === 200) {
          this.detailData = response.data.data.list
          this.total1 = response.data.data.total
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
    // 夹具明细 (归还)
    handleDetail2(row) {
      this.isShow2 = true
      this.isShow = false
      this.isShow1 = false
      this.row2 = row
      this.detailData = []
      this.getReturn()
      this.dialogTableVisible = true
    },
    getReturn() {
      const param = {
        companyCode: this.row2.companyCode,
        divisionCode: this.row2.divisionCode,
        factoryCode: this.row2.factoryCode,
        flag: 4,
        startDate: this.row2.date + '-01'
      }
      getDetail(this.pageNum2, this.pageSize2, param).then(response => {
        if (response.data.code === 200) {
          this.detailData = response.data.data.list
          this.total2 = response.data.data.total
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
    // 夹具明细-->采购
    handleSizeChange3(val) {
      this.pageSize3 = val
      this.getBuy()
    },
    handleCurrentChange3(val) {
      this.pageNum3 = val
      this.getBuy()
    },
    // 夹具明细-->领用
    handleSizeChange1(val) {
      this.pageSize1 = val
      this.getUse()
    },
    handleCurrentChange1(val) {
      this.pageNum1 = val
      this.getUse()
    },
    // 夹具明细-->归还
    handleSizeChange2(val) {
      this.pageSize2 = val
      this.getReturn()
    },
    handleCurrentChange2(val) {
      this.pageNum2 = val
      this.getReturn()
    }
  }
}
</script>
<style scoped>
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
.look-detail {
    text-decoration: underline;
    cursor: pointer;
}
</style>

