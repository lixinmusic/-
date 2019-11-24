<template>
  <div class="app-container">
    <!--外部容器 -->
    <el-container>
       <!-- 顶部搜索 -->
      
     <!--  -->
        <div class="filter-container">
          
            <div class="formSearch">
            <el-form :inline="true">

                <el-form-item label="固定资产编号">
                <el-input v-model="listQuery.fixedAssetCode"  placeholder="请输入固定资产编号" clearable></el-input>
                </el-form-item>

                 <el-form-item label="改造记录编号">
                <el-input class="minier-input" v-model="listQuery.formCode" placeholder="请输入改造记录编号" clearable></el-input>
                </el-form-item>
            
                <el-form-item label="设备名称">
                <el-input class="minier-input" v-model="listQuery.equipmentName" placeholder="请输入设备名称" clearable></el-input>
                </el-form-item>


                <el-form-item label="改造供应商">
                <el-input class="minier-input" v-model="listQuery.supplier" placeholder="请输入改造供应商" clearable></el-input>
                </el-form-item>
              
                <el-form-item label="设备改造验收计划完成时间">
                <div class="block">
                    <el-date-picker
                    style="width:230px"
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
               
               <el-form-item label="设备改造验收完成情况">
               <el-radio-group v-model="listQuery.reformInfo">
               <el-radio :label='1'>完成</el-radio>
               <el-radio :label='2'>未完成</el-radio>
               <el-radio :label='0'>全部</el-radio>
               </el-radio-group>
               </el-form-item>
               
                <el-form-item>
                <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
                </el-form-item>
             
            </el-form>
            </div>
        </div>
      <!-- 内容容器 -->
    
          <!-- 主要区域容器 -->
          <el-main style="padding:20px 0px">
            <el-button class="filter-item" @click="derivation" type="primary" icon="el-icon-edit" v-if="addnewly">导出</el-button>
            <!-- <el-button  style="margin: 10px 10px;" type="primary" v-waves @click="drag">拖拽完成</el-button> -->

            <el-table :data="listyst" v-loading="listLoading" border fit highlight-current-row
              style="width: 100%;min-height:auto;margin-top:8px" height="500" :header-cell-style="{background:'oldlace'}">
                  <el-table-column  align="center" label="序号" min-width="80" type="index"></el-table-column> 
               <el-table-column prop="formCode" align="center" label="改造记录编号" min-width="100">
                 </el-table-column>
               <el-table-column prop="fixedAssetCode" align="center" label="固定资产编号" min-width="100">
                 </el-table-column>
                <el-table-column prop="companyName" align="center" label="使用公司" min-width="80">
                 </el-table-column>
              <el-table-column prop="factoryName" align="center" label="使用工厂" min-width="80">
                 </el-table-column>
               <el-table-column prop="divisionName" align="center" label="使用部门" min-width="80">
                 </el-table-column>
               <el-table-column prop="supplier" align="center" label="改造供应商" min-width="80">
                 </el-table-column>
                <el-table-column prop="equipmentName" align="center" label="设备名称" min-width="80">
                 </el-table-column>
                <el-table-column prop="typeSpecification" align="center" label="型号规格" min-width="80">
                 </el-table-column>
                <el-table-column prop="context" align="center" label="改造内容" min-width="80">
                 </el-table-column>
                <el-table-column prop="startDate" align="center" label="设备改造验收计划完成时间" min-width="80">
                 </el-table-column>
                <el-table-column prop="endDate" align="center" label="设备改造验收单实际完成时间" min-width="80">
                <template slot-scope="scope">
                  {{scope.row.endDate}}
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
              :page-sizes="[5,10,15,20]" 
              :page-size="pageSize" 
              layout="total, sizes, prev, pager, next, jumper" 
              :total="total">
              </el-pagination>
            </div>
          </el-footer>
    </el-container>
  </div>
</template>

<script>
import { fetchList, derivationst } from '@/api/abrentionPlan/plannedTrans'
import waves from '@/directive/waves' // 水波纹指令
import { fetchButton } from '@/api/common/button'
import { menuList } from '@/store/modules/permission'//按钮权限

export default {
  name: 'plannedTrans',
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
        reformInfo:0
      },
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
    this.defaultime()
  },

  methods: {
    // 按钮的权限
    getbttonst() {
		 menuList.forEach(item => {
			item.children.forEach(e=>{
			if(e.name == "januarySchedule"){
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
     
      fetchList(this.pageNum, this.pageSize,this.listQuery).then(response => {
        this.listyst = response.data.data.list
        this.total = response.data.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 1000)
      })
    },

    // 导出
    derivation() {
      derivationst(this.listQuery).then(response => {
        if (response.data.code == 200) {
				  const liststyp = response.data.data
         window.location.href = liststyp
				}else if(response.data.code == 400002){
            this.$notify({
						title: '警告',
						message: response.data.msg,
						type: 'warning',
						duration: 3000
          			})
				}else {
				  	this.$notify({
						title: '警告',
						message: response.data.msg,
						type: 'warning',
						duration: 3000
           })
			  }
      })
    },
    // 日期控件  搜索
    defaultime(){
      var d = new Date();
      var year = d.getFullYear();
      var month = d.getMonth() + 1; // 记得当前月是要+1的 月
         /* if(month<10){
           month="0"+ month 
         } */
      var dt = d.getDate();//日
      console.log(dt)
      console.log(d.getMonth())
      //  var today = year + "-" + month + "-" + "26";
     
      var timeend =''
      var today = ''
      if(26>dt){
     
      if(month-1==0){
       var months = 12
           today = (year-1) + "-" + months + "-" + "26";
        }else{
            if(month<10){
              today = year + "-" +'0' + (month-1) + "-" + "26";
            }else{
              today = year + "-" + (month-1) + "-" + "26";
            }
        }
        console.log(987)
        timeend = year+"-"+month+"-"+"25"
        this.value13 = [today,timeend]
        console.log(this.value13)
        this.listQuery.acceptanceShouldTimeStart = this.value13[0]// 开始时间
        this.listQuery.acceptanceShouldTimeEnd = this.value13[1]
        // 导出
        this.listQueryst.acceptanceShouldTimeStart = this.value13[0]
        this.listQueryst.acceptanceShouldTimeEnd = this.value13[1]
      
      }else{
        console.log(123)
        if(month<10){
           today = year + "-"+'0' + month + "-" + "26";
        }else{
           today = year + "-" + month + "-" + "26";
        }
       
         console.log(890)
         if(month<10){
            timeend = year+"-"+'0'+(month+1)+"-"+"25"
         }else{
            timeend = year+"-"+(month+1)+"-"+"25"
         }
         
      
        this.value13 = [today,timeend]
        console.log(this.value13)
        this.listQuery.acceptanceShouldTimeStart = this.value13[0]// 开始时间
        this.listQuery.acceptanceShouldTimeEnd = this.value13[1]
        // 导出
        this.listQueryst.acceptanceShouldTimeStart = this.value13[0]
        this.listQueryst.acceptanceShouldTimeEnd = this.value13[1]
      }
    
 }, 

     searchsty() {
      if (this.value13 == null) {
        this.listQuery.acceptanceShouldTimeStart = ''
        this.listQuery.acceptanceShouldTimeEnd = ''
      } else {
        this.listQuery.acceptanceShouldTimeStart = this.value13[0]// 开始时间
        this.listQuery.acceptanceShouldTimeEnd = this.value13[1]
      }
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
