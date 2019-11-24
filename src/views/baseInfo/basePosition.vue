
<template>

  <div class="app-container">
    <!--外部容器 -->
    <el-container>
       <!-- 顶部搜索 -->
      <el-header style="margin-bottom:30px">
        <div class="filter-container">
          <!-- <div style="font-size:20px;color:#409eff;margin-bottom:10px;border-bottom:1px solid #ddd">岗位管理</div> -->
            <!-- <v-pageSearch> -->
            <div class="formSearch">
            <el-form :inline="true">
                <el-form-item label="岗位名称" class="seat">
                <el-input v-model="listQuery.staName"  placeholder="请输入岗位名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="岗位编码">
                <el-input class="minier-input" v-model="listQuery.staCode" placeholder="请输入岗位编码" clearable></el-input>
                </el-form-item>
                <el-form-item>
                <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
                </el-form-item>
            </el-form>
            </div>
            <!-- </v-pageSearch> -->
        </div>
       </el-header>
      <!-- 内容容器 -->
      <el-container>
        <!-- 侧边栏容器 -->
       <!--  <el-aside style="border:1px solid #f0f0f0;width:240px;margin-top:20px;"  >
           
        <el-tree :data="datast" :props="defaultProps"  @node-click="handleNodeClick"></el-tree>
        </el-aside> -->
        <el-container>
          <!-- 主要区域容器 -->
          <el-main>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit" v-if="addnewly">新增</el-button>
            <!-- <el-button  style="margin: 10px 10px;" type="primary" v-waves @click="drag">拖拽完成</el-button> -->

            <el-table :data="listyst" v-loading="listLoading" border fit highlight-current-row
              style="width:100%;min-height:500px;margin-top:8px" height="550" :header-cell-style="{background:'oldlace'}">

               <el-table-column prop="staCode" align="center" label="岗位编码" fixed="left" min-width="100">
                 </el-table-column>
                <el-table-column prop="staName" align="center" label="岗位名称" min-width="80">
                    <template slot-scope="scope">
                        <span class="link-type futiop" @click='checkDetails(scope.row)'>{{scope.row.staName}}</span>
                    </template>
                 </el-table-column>

              <el-table-column prop="staType" align="center" label="岗位类别" min-width="80">
                 </el-table-column>

               <el-table-column prop="staLevel" align="center" label="岗位等级" min-width="80">
                 </el-table-column>
             
              <el-table-column align="center" label="操作" min-width="120"  class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-button title="编辑" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-if="edit"></el-button>
                  <el-button title="删除" type="danger" icon="el-icon-delete" size="mini"  @click="deleteBtn(scope.row)" v-if="cutout"></el-button>
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
          <!-- 新增和编辑是同一个弹出框 -->
          <el-dialog :close-on-click-modal="false" :title="textMap[dialogStatus]" top="20vh" width="700px" v-dialogDrag :visible.sync="dialogFormVisible">
            <el-form :rules="rules" ref="dataForm" :model="temp" label-width="100px">
              <el-row>
              <el-col :span="8">     
              <el-form-item label="岗位编码" prop="staCode">
              <el-input v-model="temp.staCode" style="width:190px" :disabled='siteCodeState?true:false'  maxlength="32" oninput="this.value=this.value.replace(/[^0-9A-z\.]/g,'')" class="enter medium-input" placeholder="请输入岗位编码" ></el-input>
              </el-form-item>
              </el-col>
               <el-col :span="16">
              <el-form-item label="岗位名称" prop="staName" style="margin-left:100px;"> 
              <el-input v-model="temp.staName" maxlength="8" onkeyup="this.value=this.value.replace(/[^\u4e00-\u9fa5]/g,'')" style="width:190px" class="enter medium-input" placeholder="请输入岗位名称" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">     
              <el-form-item label="岗位类别" prop="staType">
               <el-select v-model="temp.staType" style="width:190px"
                  placeholder="请选择岗位类别" 
                  clearable>
                  <el-option v-for="item in sendCustomer_options" 
                  :key="item.value" 
                  :label="item.label" 
                  :value="item.value" >
                  </el-option>
                </el-select>

              </el-form-item>
              </el-col>
               <el-col :span="16">
              <el-form-item label="岗位等级" prop="staLevel" style="margin-left:100px;"> 
              <!-- <el-input v-model="temp.staLevel" style="width:190px" class="enter medium-input" placeholder="请选择岗位等级" ></el-input> -->
               <el-select v-model="temp.staLevel" style="width:190px"
                  placeholder="请选择岗位等级" 
                  clearable>
                  <el-option v-for="item in dropdownlists_options" 
                  :key="item.value" 
                  :label="item.label" 
                  :value="item.value" >
                  </el-option>
                </el-select>
              </el-form-item>
              </el-col>
              </el-row>

              <el-form-item label="工作目标" prop="workGoal">
                <el-input type="textarea" style="width:510px" maxlength="128" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入工作目标..." v-model="temp.workGoal">
                </el-input>
              </el-form-item>
               <el-form-item label="岗位备注" prop="discription">
                <el-input type="textarea" style="width:510px" maxlength="30" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入岗位备注..." v-model="temp.discription">
                </el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取消</el-button>
              <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">提交</el-button>
              <el-button v-else type="primary" @click="updateData">提交</el-button>
            </div>
          </el-dialog>


        <el-dialog :close-on-click-modal="false" title="查看详情" v-dialogDrag  top="20vh" width="700px" :visible.sync="dialoglookVisible">
            <el-form  ref="dataForm" :model="temp" label-width="100px">
              <el-row>
              <el-col :span="8">     
              <el-form-item label="岗位编码" prop="staCode">
              <el-input v-model="temp.staCode" style="width:190px" :disabled='siteCodeState?true:false'  maxlength="32"  class="enter medium-input" placeholder="空" ></el-input>
              </el-form-item>
              </el-col>
               <el-col :span="16">
              <el-form-item label="岗位名称" prop="staName" style="margin-left:100px;"> 
              <el-input v-model="temp.staName" maxlength="8" style="width:190px" :disabled='siteCodeState?true:false' class="enter medium-input" placeholder="空" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">     
              <el-form-item label="岗位类别" prop="staType">
              <el-input v-model="temp.staType" style="width:190px" :disabled='siteCodeState?true:false' class="enter medium-input" placeholder="空" ></el-input>
              </el-form-item>
              </el-col>
               <el-col :span="16">
              <el-form-item label="岗位等级" prop="staLevel" style="margin-left:100px;"> 
              <el-input v-model="temp.staLevel" style="width:190px" :disabled='siteCodeState?true:false' class="enter medium-input" placeholder="空" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-form-item label="工作目标" prop="workGoal">
                <el-input type="textarea" style="width:510px" :disabled='siteCodeState?true:false' maxlength="128" :autosize="{ minRows: 2, maxRows: 4}" placeholder="空" v-model="temp.workGoal">
                </el-input>
              </el-form-item>
               <el-form-item label="岗位备注" prop="discription">
                <el-input type="textarea" style="width:510px" :disabled='siteCodeState?true:false' maxlength="128" :autosize="{ minRows: 2, maxRows: 4}" placeholder="空" v-model="temp.discription">
                </el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialoglookVisible = false">确定</el-button>
            </span>
        </el-dialog>
        </el-container>
      </el-container>
    </el-container>
  </div>
  
</template>


<script>
import { fetchList, dendrogram, createArticle, updateArticle, fetchPv, look, listdown, listdownstyp } from '@/api/baseInfo/basePosition'
import waves from '@/directive/waves' // 水波纹指令
import { fetchButton } from '@/api/common/button'
import { menuList } from '@/store/modules/permission'//按钮权限
export default {
  name: 'basePosition',
  directives: {
    waves
  },
  data() {
    return {
      // 组织类型下拉框
      genre: [
        { value: '公司', lsty: '公司' },
        { value: '部门', lsty: '部门' }
      ],
      listyst: [],
      lookList: [],
      grite: '',
      total: null,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        staCode: undefined,
        staName: undefined
      },
      // 编辑和新增的字段设置
      temp: {
        staCode: '', // 岗位编码
        staName: '', // 岗位名称
        staType: '', // 岗位类别
        staLevel: '', // 岗位等级
        workGoal: '', // 工作目标
        discription: ''// 岗位备注
      },
       // 按钮权限
      addnewly:false,//新
      edit:false,//编
      cutout:false,//删
      huntfor:false,//搜索
      // 弹框显示
      dialogFormVisible: false,
      popTitle: '',
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      ster: {
        staCode: '',
        staName: ''
      },
      isAdd: false, // 新增or编辑
      siteDetail: false, // 新增、编辑弹窗
      editLoading: false, // 提交按钮加载动画
      showStatus: true, // 表单项显示状态
      formSearch_send: false, // 查询条件点选
      listLoading: true, // 远程搜索加载动画
      dialogPvVisible: false,
      dialoglookVisible: false, // 弹窗属性
      siteCodeState: '', // 岗位编码禁用状态
      sendCustomer_options: [], // 新增里的岗位类别
      dropdownlists_options: [], //   新增里岗位等级下拉框
      // 弹框内输入框不填显示的提示信息
      rules: {
        staCode: [{ required: true, message: '请输入岗位编码', trigger: 'change' }],
        staName: [{ required: true, message: '请输入岗位名称', trigger: 'change' }]
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
    getbttonst(){
		 menuList.forEach(item => {
			item.children.forEach(e=>{
			if(e.name == "basePosition"){
				this.menuCode = e.code
			}
			})
		})
      const determine={
		// menuCode:"WM_013",
		menuCode: this.menuCode,
        type:"web"
      }
      fetchButton(determine).then(response => {
        if(response.data.code == 200){
          const authority=response.data.data
          for(var i=0;i<authority.length;i++){
            if(authority[i].buttonName=="新增"){
              this.addnewly=true
            }else if(authority[i].buttonName=="编辑"){
                 this.edit = true
            }else if(authority[i].buttonName=="删除"){
               this.cutout = true
          
            }else if(authority[i].buttonName=="搜索"){
               this.huntfor = true
            }
          }
        }else{
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
        //   this.listLoading = false
        this.$nextTick(() => {
          this.listLoading = false
        })
      })
    },
    // 新增岗位类别下拉框
    getCustomer() {
      this.sendCustomer_options = []
      listdown('').then(response => {
        console.log(response.data.data)
        this.sendCustomer_options = response.data.data.map(item => {
          return { value: item.wordName, label: item.wordName }
        })
      })
    },
    //   新增里岗位等级下拉框
    getkust() {
      this.dropdownlists_options = []
      listdownstyp('').then(response => {
        console.log(response.data.data)
        this.dropdownlists_options = response.data.data.map(item => {
          return { value: item.wordName, label: item.wordName }
        })
      })
    },

    // 查看
    checkDetails(row) {
      this.temp = Object.assign({}, row)
      this.dialoglookVisible = true
      this.siteCodeState = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 删除事件
    deleteBtn(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        console.log(row)
        const deleteid = row.id
        console.log(deleteid)
        fetchPv(deleteid).then(response => {
          this.getAA()
          const index = this.listyst.indexOf(row)
          this.listyst.splice(index, 1)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
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
    // 重置表单
    resetForm() {
      this.temp = {
        staCode: '', // 岗位编码
        staName: '', // 岗位名称
        staType: '', // 岗位类别
        staLevel: '', // 岗位等级
        workGoal: '', // 工作目标
        discription: ''// 岗位备注
      }
    },
    // 新增点击打开弹窗事件
    handleCreate() {
      this.resetForm()
      this.siteCodeState = false
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.getCustomer() // 新增岗位类别下拉框
      this.getkust()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 新增提交按钮
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createArticle(this.temp).then(response => {
            console.log(response.data.code)
            if (response.data.code !== 200) {
              this.$message({
                type: 'info',
                message: '岗位编号不能重复，请重输'
              })
              return
            } else { // this.dialogFormVisible = true
              console.log(this.temp)
              // this.listyst.unshift(this.temp)
              this.dialogFormVisible = false
              this.getAA()
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 编辑点击打开弹窗事件
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj 复制obj
      this.siteCodeState = true
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.getCustomer() // 新增岗位类别下拉框
      this.getkust()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 编辑提交按钮
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          console.log(tempData)
          updateArticle(tempData).then(response => {
            const msg = response.data.msg
            if(response.data.code==200){
               for (const v of this.listyst) {
              console.log(this.listyst)
              if (v.id === this.temp.id) {
                const index = this.listyst.indexOf(v)
                this.listyst.splice(index, 1, this.temp)
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

            }else{
              this.$notify({
                title: '错误',
                message: msg,
                type: 'error',
                duration: 2000
              })
            }
           
          
          })
        }
      })
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
