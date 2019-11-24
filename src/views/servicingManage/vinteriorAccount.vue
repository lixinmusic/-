<template>
  <div class="app-container">
    <!--外部容器 -->
    <el-container>
       <!-- 顶部搜索 -->
     <!--  -->
        <div class="filter-container">
          
            <div class="formSearch">
            <el-form :inline="true">
             
                <el-form-item label="设备名称">
                <el-input v-model="listQuery.equipName" style="width:230px" placeholder="请输入设备名称" clearable></el-input>
                </el-form-item>
             
              
                <el-form-item label="固定资产编号">
                <el-input class="minier-input" style="width:200px" v-model="listQuery.fixedAssetCode" placeholder="请输入固定资产编号" clearable></el-input>
                </el-form-item>
                
             
                <el-form-item label="设备号">
                <el-input class="minier-input" v-model="listQuery.equipCode" placeholder="请输入设备号" clearable></el-input>
                </el-form-item>
                
                 <el-form-item label="报修时间" >
                <div class="block">
                    <el-date-picker
                    v-model="value13"
                     style="width:390px"
                    type="datetimerange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期" @change="searchsty()"  value-format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                </div>
                </el-form-item>

                  <el-form-item label="接单时间" >
                <!--  <div class="block">
                    <el-date-picker
                    style="width:230px"
                    v-model="invalidated"
                    type="daterange"
                    unlink-panels
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                     @change="searchsty()">
                    </el-date-picker>
                </div> -->
                   <div class="block">
                    <el-date-picker
                    v-model="invalidated"
                     style="width:390px"
                    type="datetimerange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期" @change="searchsty()"  value-format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                </div>
                </el-form-item>
             

        
                <el-form-item >
                <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
                </el-form-item>
            </el-form>
            </div>
          
        </div>
     
    
      <!-- 内容容器 -->
    
          <!-- 主要区域容器 -->
          <el-main style="padding:20px 0px">
            <el-button class="filter-item" @click="derivation" type="primary" icon="el-icon-edit">导出</el-button>
           
            <el-table :data="listyst" v-loading="listLoading" border fit highlight-current-row
              style="width: 100%;min-height:auto;margin-top:8px" height="500" :header-cell-style="{background:'oldlace'}">
                 <el-table-column  align="center" label="序号" min-width="80" type="index"></el-table-column>
                <el-table-column prop="equipName" align="center" label="设备名称" min-width="80">
                 <template slot-scope="scope">
                 <span class="link-type futiop" @click='checkDetails(scope.row)'>{{scope.row.equipName}}</span>
                 </template>  
                 </el-table-column>
               <el-table-column prop="reportTime" align="center" label="报修时间" min-width="100">
                 </el-table-column>
                <el-table-column prop="repairFactory" align="center" label="报修工厂" min-width="80">
                 </el-table-column>
              <el-table-column prop="repairDivision" align="center" label="报修部门" min-width="80">
                 </el-table-column>
               <el-table-column prop="fixedAssetCode" align="center" label="固定资产编号" min-width="80">
                 </el-table-column>
                <el-table-column prop="equipCode" align="center" label="设备号" min-width="80">
                 </el-table-column>
                <el-table-column prop="repairNo" align="center" label="维修工" min-width="80">
                 </el-table-column>
                <el-table-column prop="errorName" align="center" label="故障名称" min-width="80">
                 </el-table-column>
                <el-table-column prop="errorInfo" align="center" label="故障描述" min-width="80">
                 </el-table-column>
                <el-table-column prop="errorCause" align="center" label="故障原因" min-width="80">
                 </el-table-column>
                 <el-table-column prop="disposal" align="center" label="处置方式" min-width="80">
                 </el-table-column>
                <el-table-column prop="equipStopTime" align="center" label="设备停止时间" min-width="80">
                
                 </el-table-column>
                <el-table-column prop="orderTime" align="center" label="接单时间" min-width="80">
                 
                 </el-table-column>
                <el-table-column prop="repairTime" align="center" label="维修完成时间" min-width="80">
                     
                 </el-table-column>
                <el-table-column prop="equipFulTime" align="center" label="设备开动时间" min-width="80">
                  
                 </el-table-column>
                <el-table-column prop="equipErrorMinute" align="center" label="设备故障时间（分钟）" min-width="80">
                 </el-table-column>
                <el-table-column prop="equipErrorHour" align="center" label="设备故障时间（小时）" min-width="80">
                 </el-table-column>
                <el-table-column prop="repairFitting" align="center" label="维修使用配件品名" min-width="80">
                 </el-table-column>
                <el-table-column prop="fittingCode" align="center" label="配件编码" min-width="80">
                 </el-table-column>
                <el-table-column prop="amount" align="center" label="数量" min-width="80">
                 </el-table-column>

                                                            <!-- v-if="edit" -->
                <el-table-column fixed="right" align="center" label="操作" min-width="180"  class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-button title="编辑" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)"></el-button>
                </template>
              </el-table-column>     
            
            </el-table>
          </el-main>
          <!-- 底栏容器 -->
          <el-footer>
            <!-- 分页 -->
            <div class="pagination-container">
              <el-pagination background 
              @size-change="handleSizeChange" 
              @current-change="handleCurrentChange" 
              :current-page="pageNum" 
              :page-sizes="[10,20,50,100]" 
              :page-size="pageSize" 
              layout="total, sizes, prev, pager, next, jumper" 
              :total="total">
              </el-pagination>
            </div>
          </el-footer>
           <!-- 编辑是同一个弹出框 -->
          <el-dialog :title="textMap[dialogStatus]" v-dialogDrag top="10vh" width="1100px" :visible.sync="dialogFormVisible">
            <el-form :rules="rules" ref="dataForm" :model="temp" label-width="100px">

              <el-row>
              <el-col :span="8">     
              <el-form-item label="报修时间" prop="reportTime" label-width="110px">
              <el-input v-model="temp.reportTime" :disabled='siteCodeState' style="width:210px" maxlength="15" oninput="this.value=this.value.replace(/[^0-9A-z\.]/g,'')" class="enter medium-input" placeholder="请输入报修时间" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="8">
              <el-form-item label="报修工厂" prop="repairFactory"  label-width="110px"> 
              <el-input v-model="temp.repairFactory" :disabled='siteCodeState' style="width:210px" class="enter medium-input judge" placeholder="请输入报修工厂"></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="8"> 
              <el-form-item label="报修部门" prop="repairDivision"  label-width="110px"> 
              <el-input v-model="temp.repairDivision" :disabled='siteCodeState' style="width:210px" class="enter medium-input judge" placeholder="请输入报修部门"></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">
              <el-form-item label="设备名称" prop="equipName"  label-width="110px"> 
              <el-input v-model="temp.equipName"  :disabled='siteCodeState' style="width:210px" class="enter medium-input" placeholder="请输入设备名称" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="8">
              <el-form-item label="固定资产编号" prop="fixedAssetCode" label-width="110px"> 
              <el-input v-model="temp.fixedAssetCode" style="width:210px" class="enter medium-input" :disabled='siteCodeState' placeholder="请输入固定资产编号" ></el-input>
              </el-form-item>
              </el-col>
               <el-col :span="8">
              <el-form-item label="设备号" prop="equipCode">
              <el-input v-model="temp.equipCode"  style="width:220px" :disabled='siteCodeState'  maxlength="32" class="enter medium-input" placeholder="请输入设备号" ></el-input>
              </el-form-item>     
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">     
              <el-form-item label="维修工" prop="repairNo" label-width="110px">
              <el-input v-model="temp.repairNo" :disabled='siteCodeState' style="width:210px"  maxlength="20" class="enter medium-input" placeholder="请输入维修工" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="8">
              <el-form-item label="故障名称" prop="errorName"  label-width="110px"> 
              <el-input v-model="temp.errorName" :disabled='siteCodeState' maxlength="20"  style="width:210px" class="enter medium-input" placeholder="请输入故障名称" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="8">     
              <el-form-item label="故障描述" prop="errorInfo"  label-width="110px"> 
              <el-input v-model="temp.errorInfo" :disabled='siteCodeState' maxlength="20"  style="width:210px" class="enter medium-input" placeholder="请输入故障描述" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">
              <el-form-item label="故障原因" prop="errorCause"  label-width="110px"> 
              <el-input v-model="temp.errorCause" :disabled='siteCodeState' maxlength="20"  style="width:210px" class="enter medium-input" placeholder="请输入故障原因" ></el-input>
              </el-form-item>
              </el-col>    
              <el-col :span="8">
              <el-form-item label="处置方式" prop="disposal"  label-width="110px"> 
              <el-input v-model="temp.disposal" :disabled='siteCodeState' maxlength="10"  style="width:210px" class="enter medium-input" placeholder="请输入处置方式" ></el-input>
              </el-form-item>
              </el-col>
               <el-col :span="8">
              <el-form-item label="设备停止时间" prop="equipStopTime"  label-width="110px"> 
              <el-input v-model="temp.equipStopTime" :disabled='siteCodeState' maxlength="10"  style="width:210px" class="enter medium-input" placeholder="请输入设备停止时间" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">
             <el-form-item label="接单时间" prop="orderTime"  label-width="110px"> 
              <el-input v-model="temp.orderTime" :disabled='siteCodeState' maxlength="10"  style="width:210px" class="enter medium-input" placeholder="请输入接单时间" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="8">
              <el-form-item label="维修完成时间" prop="repairTime"  label-width="110px"> 
              <el-input v-model="temp.repairTime" :disabled='siteCodeState' maxlength="10"  style="width:210px" class="enter medium-input" placeholder="请输入维修完成时间" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="8">
              <el-form-item label="设备开动时间" prop="equipFulTime"  label-width="110px"> 
              <el-input v-model="temp.equipFulTime" :disabled='siteCodeState' maxlength="10"  style="width:210px" class="enter medium-input" placeholder="请输入设备开动时间" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>
              
            

              <el-row>
               <el-col :span="8">
              <el-form-item label="设备故障时间（分钟）" prop="equipErrorMinute"  label-width="110px"> 
              <el-input v-model="temp.equipErrorMinute" :disabled='siteCodeState' maxlength="10"  style="width:210px" class="enter medium-input" placeholder="请输入设备故障时间" ></el-input>
              </el-form-item>
              </el-col>
             <el-col :span="8">
              <el-form-item label="设备故障时间（小时）" prop="equipErrorHour"  label-width="110px"> 
              <el-input v-model="temp.equipErrorHour" :disabled='siteCodeState' maxlength="10"  style="width:210px" class="enter medium-input" placeholder="请输入设备故障时间" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="8">
              <el-form-item label="维修使用配件品名" prop="repairFitting"  label-width="130px"> 
              <el-input v-model="temp.repairFitting" :disabled='siteCodeState' maxlength="10"  style="width:190px" class="enter medium-input" placeholder="请输入维修使用配件品名" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">     
              <el-form-item label="配件编码" prop="fittingCode" label-width="110px">
              <el-input v-model="temp.fittingCode" :disabled='siteCodeState' style="width:210px"  maxlength="10" class="enter medium-input" placeholder="请输入配件编码" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="8">     
              <el-form-item label="数量" prop="amount" label-width="110px">
              <el-input v-model="temp.amount" :disabled='siteCodeState' style="width:210px"  maxlength="10" class="enter medium-input" placeholder="请输入数量" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>

            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取消</el-button>
              <!-- <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">提交</el-button>
              <el-button v-else type="primary" @click="updateData">提交</el-button> -->
            </div>
          </el-dialog>
    </el-container>
  </div>
</template>

<script>
import { fetchList, derivationst } from '@/api/servicingManage/vinteriorAccount'
import waves from '@/directive/waves' // 水波纹指令
import { fetchButton } from '@/api/common/button'
export default {
  name: 'vinteriorAccount',
  directives: {
    waves
  },
  data() {
    // var phoneNum = (rule, value, callback) => {
    //   if (value != '') {
    //     if ((/^[0-9]+\.?[0-9]{0,2}$/).test(value) == false) {
    //       callback(new Error('请输入数字或小数，保留2位小数'))
    //     } else {
    //       callback()
    //     }
    //   } else {
    //     callback()
    //   }
    // }
    // 英文和数字
    var project = (rule, value, callback) => {
      if (value != '') {
        if ((/^[A-Za-z0-9]+$/).test(value) == false) {
          callback(new Error('请输入项目编号(允许英文和数字输入)'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }

    return {

      listyst: [],
      lookList: [],
      grite: '',
      total: null,
      listQuery: {

      },
      value13: [], // 报修时间数组
      invalidated: [], // 接单时间数组
      pageNum: 1,
      pageSize: 10,
      value13: [], // 设备安装完成时间
      weekdates: [], // 新设备一周计划完成时间
      // 导出字段
      listQueryst: {
        buyers: '',
        equipmentName: '',
        fixedAssetCode: '',
        isComplete: '',
        model: '',
        realTimeEnd: '',
        realTimeUp: '',
        requestTimeEnd: '',
        requestTimeUp: ''
      },
      // 弹框显示
      dialogFormVisible: false,
      popTitle: '',
      dialogStatus: '',
      textMap: {
        update: '编辑',
        lookspol: '查看'
      },
      temp: {

      },
      // 按钮权限
      addnewly: false, // 新
      edit: false, // 编
      cutout: false, // 删
      listLoading: true, // 远程搜索加载动画
      siteCodeState: true, // 禁用状态
      dstpost: '', // 交付时间

      // 弹框内输入框不填显示的提示信息  /^[A-Za-z0-9]+$/
      rules: {
        /*  repairType: [{ required: true, message: '请选择修理类别', trigger: 'change' }],
        projectCode:[{ required: true, validator: project, trigger: 'change' }],
        projectName:[{ required: true, message: '请输入项目名称', trigger: 'change' }], */

      },
      downloadLoading: false
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  created() {
    this.getAA()
    // this.getbttonst()
  },

  methods: {
    // 按钮的权限
    getbttonst() {
      const determine = {
        menuCode: 'WM_052',
        type: 'web'
      }
      fetchButton(determine).then(response => {
        if (response.data.code == 200) {
          const authority = response.data.data
          for (var i = 0; i < authority.length; i++) {
            if (authority[i].buttonName == '新增') {
              this.addnewly = true
            } else if (authority[i].buttonName == '编辑') {
              this.edit = true
            } else if (authority[i].buttonName == '删除') {
              this.cutout = true
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

    // 表格的接口
    getAA() {
      this.listLoading = true
      fetchList(this.pageNum, this.pageSize, this.listQuery).then(response => {
        this.listyst = response.data.data.list
        this.total = response.data.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 1000)
      })
    },
    //   搜索时间转化
    searchsty() {
      if (this.value13 == null) {
        this.listQuery.reportTimeUp = ''
        this.listQuery.reportTimeEnd = ''
      } else {
        this.listQuery.reportTimeUp = this.value13[0]// 开始时间
        this.listQuery.reportTimeEnd = this.value13[1]
      }
      if (this.invalidated == null) {
        this.listQuery.orderTimeUp = ''
        this.listQuery.orderTimeeEnd = ''
      } else {
        this.listQuery.orderTimeUp = this.invalidated[0]
        this.listQuery.orderTimeeEnd = this.invalidated[1]
      }
    },

    // 导出
    derivation() {
      this.listLoading = true
      derivationst(this.listQueryst).then(response => {
        if (response.data.code == 200) {
          const liststyp = response.data.data
          console.log(liststyp)
          window.location.href = liststyp
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
      setTimeout(() => {
        this.listLoading = false
      }, 1 * 500)
    },
    // 查看
    checkDetails(row) {
      this.siteCodeState = true
      this.dialogStatus = 'lookspol'
      this.dialogFormVisible = true
      this.temp = Object.assign({}, row)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 编辑点击打开弹窗事件  projectCode  acceptanceDate
    handleUpdate(row) {
      this.siteCodeState = true
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.temp = Object.assign({}, row)
      /*  const ids = {id:row.id}
      selectById(ids).then(response => {
        this.popTitle = response.data.data

        console.log(typeof this.temp.deliverDate)
        // this.dstpost = this.temp.deliverDate

      }) */

      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 搜索
    handleFilter() {
      this.pageNum = 1
      this.getAA()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getAA()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.getAA()
    }
  }
}
</script>
<style scoped>
.fiutr {
  float: left;
}
.seat {
  margin-left: 50px;
  padding-right: 15px;
}
.inline-input {
  width: 200px;
  
}
.futiop{
text-decoration:underline
}
.formSearch {
  width: 100%;
  background: #fafafa;
  border: 1px solid #e9e9e9;
  border-radius: 3px;
  padding: 18px 10px 0;
  margin-bottom: 15px;
}
</style>
