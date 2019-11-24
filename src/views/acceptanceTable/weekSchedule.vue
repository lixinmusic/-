<template>
  <div class="app-container">
    <!--外部容器 -->
    <el-container>
       <!-- 顶部搜索 -->
      <!-- <el-header style="margin-bottom:120px"> -->
        <div class="filter-container">
          
            <div class="formSearch">
            <el-form :inline="true">
            
                <el-form-item label="固定资产编号">
                <el-input v-model="listQuery.fixedAssetCode"  placeholder="请输入固定资产编号" clearable></el-input>
                </el-form-item>
              
                <el-form-item label="设备名称">
                <el-input class="minier-input" v-model="listQuery.equipmentName" placeholder="请输入设备名称" clearable></el-input>
                </el-form-item>
              
                <el-form-item label="型号规格">
                <el-input class="minier-input" v-model="listQuery.model" placeholder="请输入型号规格" clearable></el-input>
                </el-form-item>
              
              
                <el-form-item label="供应商" style="margin-left:40px">
                <el-input class="minier-input" v-model="listQuery.buyers" placeholder="请输入供应商" clearable></el-input>
                </el-form-item>
             

            
                <el-form-item label="设备安装完成时间" >
                <div class="block">
                    <el-date-picker
                    style="width:250px"
                    v-model="value13"
                    type="daterange"
                    unlink-panels
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                      clearable  @change="searchsty()">
                    </el-date-picker>
                </div>
                  </el-form-item>
             

              
                <el-form-item label="新设备1周计划完成时间">
                <div class="block">
                    <el-date-picker
                    style="width:250px"
                    v-model="weekdates"
                    type="daterange"
                    unlink-panels
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                      clearable @change="searchsty()">
                    </el-date-picker>
                </div>
                
                </el-form-item>
             

               
               <el-form-item label="1周验收完成情况" v-model="listQuery.isComplete">
               <el-radio-group v-model="listQuery.isComplete">
               <!-- <el-radio :label=0>无</el-radio>    -->
               <el-radio :label=1>完成</el-radio>
               <el-radio :label=2>未完成</el-radio>
               </el-radio-group>
               </el-form-item>
               
                <el-form-item>
                <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
                </el-form-item>
             
            </el-form>
            </div>
          
        </div>
      <!--  </el-header> -->
      <!-- 内容容器 -->
     <!--  <el-container>
        <el-container> -->
          <!-- 主要区域容器 -->
          <el-main style="padding:20px 0px">
            <el-button class="filter-item"  @click="derivation" type="primary" icon="el-icon-edit" v-if="addnewly">导出</el-button>
            <!-- <el-button  style="margin: 10px 10px;" type="primary" v-waves @click="drag">拖拽完成</el-button> -->

            <el-table :data="listyst" v-loading="listLoading" border fit highlight-current-row
              style="width: 100%;min-height:auto;margin-top:8px" height="500" :header-cell-style="{background:'oldlace'}">
                 <el-table-column  align="center" label="序号" min-width="80" type="index"></el-table-column>

               <el-table-column prop="fixedAssetCode" align="center" label="固定资产编号" min-width="120">
                 </el-table-column>
                <el-table-column prop="companyName" align="center" label="使用公司" min-width="80">
                    
                 </el-table-column>
              <el-table-column prop="factoryName" align="center" label="使用工厂" min-width="80">
                 </el-table-column>
               <el-table-column prop="divisionName" align="center" label="使用部门" min-width="80">
                 </el-table-column>
               <el-table-column prop="contractNumber" align="center" label="合同编号" min-width="80">
                 </el-table-column>
                <el-table-column prop="buyers" align="center" label="供应商" min-width="80">
                 </el-table-column>
                <el-table-column prop="equipmentName" align="center" label="设备名称" min-width="80">
                 </el-table-column>
                <el-table-column prop="model" align="center" label="型号规格" min-width="80">
                 </el-table-column>
                <el-table-column prop="unit" align="center" label="单位" min-width="80">
                 </el-table-column>
                <el-table-column prop="amount" align="center" label="数量" min-width="80">
                 </el-table-column>
                <el-table-column prop="unpackingDate" align="center" label="设备到厂时间(开箱时间)" min-width="80">
                <template slot-scope="scope">
                  {{scope.row.unpackingDate}}
                 </template>
                 </el-table-column>
                <el-table-column prop="installDate" align="center" label="设备安装完成时间" min-width="80">
                <template slot-scope="scope">
                  {{scope.row.installDate}}
                 </template>
                 </el-table-column>
                <el-table-column prop="requestTime" align="center" label="新设备1周计划完成时间" min-width="80">
                <template slot-scope="scope">
                  {{scope.row.requestTime}}
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
              :current-page="listQuery.pageNum" 
              :page-sizes="[5,10,15,20]" 
              :page-size="listQuery.pageSize" 
              layout="total, sizes, prev, pager, next, jumper" 
              :total="total">
              </el-pagination>
            </div>
          </el-footer>
        <!-- </el-container>
      </el-container> -->
    </el-container>
  </div>
</template>

<script>
import { fetchList, derivationst } from '@/api/acceptanceTable/weekSchedule'
import waves from '@/directive/waves' // 水波纹指令
import { fetchButton } from '@/api/common/button'
import { menuList } from '@/store/modules/permission'//按钮权限


export default {
  name: 'weekSchedule',
  directives: {
    waves
  },
  data() {
    return {
      listyst: [],
      lookList: [],
      grite: '',
      total: null,
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
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
      // 按钮权限
      addnewly: false, // 新
      edit: false, // 编
      cutout: false, // 删
      listLoading: true, // 远程搜索加载动画
      // 弹框显示
      dialogFormVisible: false,
      popTitle: '',
      dialogStatus: '',

      // 弹框内输入框不填显示的提示信息
      rules: {
        // staCode: [{ required: true, message: '请输入岗位编码', trigger: 'change' }],
        // staName: [{ required: true, message: '请输入岗位名称', trigger: 'change' }]
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
    this.getbttonst()
  },

  methods: {
    // 按钮的权限
    getbttonst() {
		menuList.forEach(item => {
			item.children.forEach(e=>{
			if(e.name == "weekSchedule"){
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
              this.addnewly = true
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
      fetchList(this.listQuery).then(response => {
        this.listyst = response.data.data.list
        this.total = response.data.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 1000)
      })
    },

    // 导出
    derivation() {
      derivationst(this.listQueryst).then(response => {
        const liststyp = response.data.data
        // console.log(liststyp)
        window.location.href = liststyp
      })
    },
    // 日期控件  搜索
    searchsty() {
      if (this.value13 == null) {
        this.listQuery.realTimeUp = ''
        this.listQuery.realTimeEnd = ''
      } else {
        this.listQuery.realTimeUp = this.value13[0]// 开始时间
        this.listQuery.realTimeEnd = this.value13[1]
      }
      if (this.weekdates == null) {
        this.listQuery.requestTimeUp = ''
        this.listQuery.requestTimeEnd = ''
      } else {
        this.listQuery.requestTimeUp = this.weekdates[0]// 开始时间
        this.listQuery.requestTimeEnd = this.weekdates[1]
      }
    },

    // 搜索
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getAA()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getAA()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getAA()
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
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
