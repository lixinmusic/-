<template>
  <div class="app-container">
    <!--外部容器 -->
    <el-container>
       <!-- 顶部搜索 -->
      
        <div class="filter-container">
          
            <div class="formSearch">
            <el-form :inline="true">
            
                <el-form-item label="使用工厂">
                <el-input class="minier-input" v-model="radio" :disabled='siteCodeState' placeholder="请选择使用工厂" clearable></el-input>
                <div class="buttonplace"  id="buttstyps" @click="treeco">选择</div>
                <div class="buttonplacest" id="buttstyps" @click="clears">清空</div>
                </el-form-item>
              
            
                <el-form-item label="使用部门" style="margin-left:50px">
                <el-input class="minier-input" v-model="yesno" :disabled='siteCodeState' placeholder="请选择使用部门" clearable></el-input>
                 <div class="buttonplace" id="buttstyps" @click="treesection">选择</div>
                 <div class="buttonplacest" id="buttstyps" @click="clearsection">清空</div>
                </el-form-item>
              

                
                <el-form-item style="margin-left:50px">
                <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
                </el-form-item>
             

            </el-form>
            </div>
          
        </div>
      
      <!-- 内容容器 -->
     
          <!-- 主要区域容器 -->
          <el-main style="padding:20px 0px">
            <el-button class="filter-item" @click="derivation" type="primary" icon="el-icon-edit" v-if="addnewly">导出</el-button>
          
            <el-table :data="lookList" v-loading="listLoading" border fit highlight-current-row
              style="width: 100%;min-height:auto;margin-top:8px" height="500" :header-cell-style="{background:'oldlace'}">
                 <el-table-column  align="center" label="序号" min-width="80" type="index">
                 </el-table-column>
              <el-table-column prop="factoryName" align="center" label="使用工厂" min-width="80">
                 </el-table-column>
               <el-table-column prop="divisionName" align="center" label="使用部门" min-width="80">
                </el-table-column>
             <el-table-column label="设备改造验收计划及时率" align="center">
               <el-table-column prop="acceptanceShouldTotal" align="center"  label="总项数" min-width="80">
                 <template slot-scope="scope">
                  {{scope.row.acceptanceShouldTotal}}
                  </template>
                </el-table-column>
                <el-table-column prop="acceptanceShouldPassNum" align="center" label="及时项数" min-width="80">
                 <template slot-scope="scope">
                  {{scope.row.acceptanceShouldPassNum}}
                  </template>
                </el-table-column>
                <el-table-column prop="acceptanceShouldUnPassNum" align="center" label="不及时项数" min-width="80">
                 <template slot-scope="scope">
                  {{scope.row.acceptanceShouldUnPassNum}}
                  </template>    
                </el-table-column>
                <el-table-column prop="acceptanceShouldPassRatio" align="center" label="验收及时率" min-width="80">
                <template slot-scope="scope">
                  {{scope.row.acceptanceShouldPassRatio}}
                </template>    
                </el-table-column>
                </el-table-column>

                <el-table-column label="改造质保验收计划及时率" align="center">
                <el-table-column prop="warrantyShouldTotal" align="center" label="总项数" min-width="80">
                 <template slot-scope="scope">
                  {{scope.row.warrantyShouldTotal}}
                  </template>
                </el-table-column>
                <el-table-column prop="warrantyShouldPassNum" align="center" label="及时项数" min-width="80">
                 <template slot-scope="scope">
                  {{scope.row.warrantyShouldPassNum}}
                  </template>
                </el-table-column>
                <el-table-column prop="warrantyShouldUnPassNum" align="center" label="不及时项数" min-width="80">
                 <template slot-scope="scope">
                  {{scope.row.warrantyShouldUnPassNum}}
                  </template>    
                </el-table-column>
                <el-table-column prop="warrantyShouldPassRatio" align="center" label="验收及时率" min-width="80">
                <template slot-scope="scope">
                  {{scope.row.warrantyShouldPassRatio}}
                </template>    
                </el-table-column>
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
           <!-- 使用工厂的弹框 -->
          <el-dialog title="使用工厂"  :close-on-click-modal="false" :visible.sync="treeFormVisible" :modal="false">
           <span style="margin-left:20px;color:red" >{{radio}}</span> 
           <el-tree :data="datast" :props="defaultProps" @node-click="handleNodeClick" check-strictly ref="tree" node-key="orgCode" show-checkbox highlight-current @check-change="handleClick" ></el-tree>
           <div slot="footer" class="dialog-footer">
              <el-button @click="treeFormVisible = false">取消</el-button>
              <el-button type="primary" @click="treeFormVisible = false">确认</el-button>
            </div>
          </el-dialog>
            <!-- 使用部门的弹框 -->
           <el-dialog title="使用部门" :close-on-click-modal="false" :visible.sync="treeDepartment" :modal="false">
             <span style="margin-left:20px;color:red" >{{yesno}}</span> 
           <el-tree :data="datalisy" :props="terrdef" @node-click="handleNodeClickst" check-strictly ref="treeform" node-key="orgCode" show-checkbox highlight-current @check-change="hlsoClick"></el-tree>
           <div slot="footer" class="dialog-footer">
              <el-button @click="treeDepartment = false">取消</el-button>
              <el-button type="primary" @click="treeDepartment = false">确认</el-button>
            </div>
          </el-dialog>
    </el-container>
  </div>
</template>

<script>
import { fetchList, derivationst, dendrogram, section } from '@/api/abrentionPlan/sumStaent'
import waves from '@/directive/waves' // 水波纹指令
import { fetchButton } from '@/api/common/button'
import { menuList } from '@/store/modules/permission'//按钮权限

export default {
  name: 'sumStaent',
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
        
      },
      pageNum: 1,
      pageSize: 10,
      value13: [], // 设备安装完成时间
      weekdates: [], // 新设备一周计划完成时间
      // 导出字段
      listQueryst: {
        divisionCode:'',
        factoryCode:''
      },
      // 使用工厂树的数据
      datast: [],
      defaultProps: {
        children: 'children',
        label: 'orgFullName'
      },
      orgsection:'',//使用部门的编号
      // 使用部门树的数据
      // 选中状态改变时
      i: 0,
      r:0,
      datalisy: [],
      setlist:[],
      terrdef: {
        children: 'children',
        label: 'orgFullName'
      },
      radio: '', // 使用工厂
      yesno: '', // 使用部门
      treeFormVisible: false, // 使用工厂树选择
      treeDepartment: false, // 使用部门树选择
      siteCodeState: true, // 禁用状态
      // 按钮权限
      addnewly: false, // 新
      edit: false, // 编
      cutout: false, // 删
      editLoading: false, // 提交按钮加载动画
      showStatus: true, // 表单项显示状态
      formSearch_send: false, // 查询条件点选
      listLoading: true, // 远程搜索加载动画
      dialogPvVisible: false,
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
    // this.treestyps()
    // this.sectionsty()
  },

  methods: {
    // 按钮的权限
    getbttonst() {
		menuList.forEach(item => {
			item.children.forEach(e=>{
			if(e.name == "vsummarySurface"){
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
      this.lookList = []
      this.listLoading = true
      fetchList(this.pageNum,this.pageSize,this.listQuery).then(response => {
      if (response.data.code == 200) {
        if(response.data.data!=null && response.data.data.list!=null){
        this.listyst = response.data.data.list
        for (var i = 0; i < this.listyst.length; i++) {
          this.lookList.push(this.listyst[i])
        }
        console.log(this.lookList)
        this.total = response.data.data.total
        this.$nextTick(() => {
          this.listLoading = false
        })
        }
        this.listLoading = false
       }else{
         this.listyst = []
         this.total = 0
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
    derivation() {
      derivationst(this.listQuery).then(response => {
        if (response.data.code == 200) {
			  const liststyp = response.data.data
        console.log(liststyp)
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
     // 使用工厂的接口
    treestyps() {
      this.datast.splice(0)
      dendrogram('').then(response => {
        this.datast.push(response.data.data)
        console.log(this.datast)
         for(var i=0;i<this.datast.length;i++){
            if(this.datast[i].orgType =="部门"){
               this.datast[i].disabled = true
             }
          /*  console.log(this.datast[i].children) */
           for(var j=0;j<this.datast[i].children.length;j++){
            /*  console.log(this.datast[i].children[j]) */
             const child = this.datast[i].children[j]
             if(child.orgType =="部门"){
               child.disabled = true
             }
             if(child.children!==null){
               for(var p=0;p<child.children.length;p++){
                 if(child.children[p].orgType =="部门"){
                  child.children[p].disabled = true
             }
               }
             }
           }
         }
      })
    },
     // 使用工厂的树选择按钮
    treeco(){
      this.treeFormVisible = true
      this.treestyps()
    },
    // 设置树状图单选
    handleClick(data, checked, node) {
      this.i++
      if (this.i % 1 == 0) {
        if (checked) {
          console.log(checked)
          console.log(data)
          this.$refs.tree.setCheckedNodes([])
          this.$refs.tree.setCheckedNodes([data])
           this.listQuery.factoryCode = data.orgCode //
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
    handleNodeClick(data) {
    
    },
    // 使用部门的树选择按钮
    sectionsty() {
      this.datalisy.splice(0)
      const orgCodest ={
        orgCode:this.orgsection
      } 
      section(orgCodest).then(response => {
              
        this.setlist.push(response.data.data)
        this.setlist.children = response.data.data
         this.datalisy=[
           {     
             orgFullName:this.radio,
             children: this.setlist.children,
             orgType:'公司'
           }
           ]
           console.log(this.datalisy)
            //  this.datalisy.push(sectionlist) 

        for(var i=0;i<this.datalisy.length;i++){
              console.log(this.datalisy[i])
          if(this.datalisy[i].orgType =="公司"){
             this.datalisy[i].disabled = true
          }
          for(var j=0;j<this.datalisy[i].children.length;j++){
               
            const childsty = this.datalisy[i].children[j]
            if(childsty.orgType=="公司"){
               childsty.disabled = true
            }
            if(childsty.children!==null){
              for(var p=0;p<childsty.children.length;p++){
                const rosyt =childsty.children[p]
                if(rosyt.orgType =="公司"){
                 rosyt.disabled = true
               }
               if(rosyt.children!==null){
                 for(var k=0;k<rosyt.children.length;k++){
                   const postdis = rosyt.children[k]
                   if(postdis.orgType=="公司"){
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

     treesection(){
      if( this.radio==''){
          this.$notify({
            title: '提示',
            message: '请选择使用工厂',
            type: 'warning',
            duration: 3000
            })
          return
      }else{ 
       this.treeDepartment = true
       this.sectionsty()
       }
     },
      hlsoClick(data, checked, node){
      this.r++
      if (this.r % 1 == 0) {
        if (checked) {
          this.$refs.treeform.setCheckedNodes([])
          this.$refs.treeform.setCheckedNodes([data])
          this.listQuery.divisionCode = data.orgCode //
          this.yesno = data.orgFullName
          // 交叉点击节点
        } else {
          this.$refs.treeform.setCheckedNodes([])
          // 点击已经选中的节点，置空
        }
      }
    },


    handleNodeClickst(data) {
    
    
    },


    // 使用工厂清空按钮 
    clears(){
    this.listQuery.factoryCode='' //
    this.radio=''
    this.treeFormVisible = false
   
    },
    // 使用部门清空按钮
    clearsection(){
    this.listQuery.divisionCode='' //
     this.yesno=''
    this.treeDepartment = false
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
<style>
.buttonplace{
height:36px;
background:#409EFF;
color:#fff;
border:1px solid #fff;
position:absolute;
right:0;
top:0;
border-radius: 5px;
}
.buttonplacest{
height:36px;
background:#409EFF;
color:#fff;
border:1px solid #fff;
position:absolute;
right:-50px;
top:0;
border-radius: 5px;
}
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
.square{
width: 0;
height: 0;
border-width: 18px;
border-style: solid;
border-color: #409EFF transparent transparent transparent;
margin:0 auto;
cursor: pointer;
}
#buttstyps{
   width:42px;
   height:36px;
   cursor:pointer;
   text-align:center;
    }
.tonesquare{
width: 0;
height: 0;
border-width: 18px;
border-style: solid;
border-color: transparent transparent #409EFF transparent;
margin:0 auto;
cursor: pointer;
}
.el-tree-node__content:hover {
  background-color: #6dc6fa;
  border-radius:3%
} 
</style>
