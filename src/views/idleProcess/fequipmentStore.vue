<template>
  <div class="app-container">
    <!--外部容器 -->
    <el-container>
       <!-- 顶部搜索 -->
     
        <div class="filter-container">
            <div class="formSearch">
            <el-form :inline="true">

                <el-form-item label="使用工厂" style="margin-left:5px">
                <el-input class="minier-input" style="width:213px" v-model="radio" placeholder="请选择使用工厂" :disabled='siteCodeState' clearable></el-input>
                <div class="buttonplace"  id="buttstyps" @click="treeco">选择</div>
                <div class="buttonplacest" id="buttstyps" @click="clears">清空</div>
                </el-form-item>
          
                <el-form-item label="使用部门" style="margin-left:50px">
                <el-input class="minier-input" style="width:213px" v-model="yesno" :disabled='siteCodeState' placeholder="请选择使用部门" clearable></el-input>
                <div class="buttonplace" id="buttstyps" @click="treesection">选择</div>
                <div class="buttonplacest" id="buttstyps" @click="clearsection">清空</div>
                </el-form-item>
              
                <el-form-item label="设备名称" style="margin-left:50px">
                <el-input class="minier-input" style="width:240px" v-model="listQuery.equipmentName" placeholder="请输入设备名称" clearable></el-input>
                </el-form-item>
                
                <el-form-item label="固定资产编号">
                <el-input class="minier-input" style="width:243px" v-model="listQuery.fixedAssetCode" placeholder="请输入固定资产编号" clearable></el-input>
                </el-form-item>
              
                <el-form-item label="型号规格">
                <el-input v-model="listQuery.model" style="width:240px" placeholder="请输入型号规格" clearable></el-input>
                </el-form-item>
               

                 <el-form-item label="设备状态" style="margin-left:20px">
                 <el-select v-model="listQuery.equipStatus" style="width:240px"
                  placeholder="请选择设备状态" 
                  clearable>
                  <el-option v-for="item in genre" 
                  :key="item.value" 
                  :label="item.lsty" 
                  :value="item.value" >
                  </el-option>
                </el-select>
                </el-form-item>

                 <el-form-item label="入库日期">
                <div class="block">
                    <el-date-picker
                    style="width:271px"
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
            
                <el-form-item >
                <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
                </el-form-item>
             
            </el-form>
            </div>
        
        </div>
       
      <!-- 内容容器 -->
    
          <!-- 主要区域容器 v-if="addnewly"-->
          
          <el-main style="padding:20px 0px">
           <el-button class="filter-item" style="margin-left: 10px;margin-bottom:10px" @click="derivation" type="primary" icon="el-icon-download" v-if="addnewly">导出</el-button>

            <el-table :data="listyst" v-loading="listLoading" border fit highlight-current-row
              style="width: 100%;min-height:auto;margin-top:0px" height="500" :header-cell-style="{background:'oldlace'}">

               <el-table-column  align="center" label="序号" min-width="80" type="index"></el-table-column>
                <el-table-column prop="factoryName" align="center" label="使用工厂" min-width="80">
                 </el-table-column>
                 <el-table-column prop="divisionName" align="center" label="使用部门" min-width="80">
                 </el-table-column>
                 <el-table-column prop="equipmentName" align="center" label="设备名称" min-width="80">
                 </el-table-column>
                 <el-table-column prop="model" align="center" label="型号规格" min-width="80">
                 </el-table-column>
                  <el-table-column prop="fixedAssetCode" align="center" label="固定资产编号" min-width="80">
                 </el-table-column>
                  <el-table-column prop="originalFinancialValue" align="center" label="原值" min-width="80">
                 </el-table-column>

                 <el-table-column prop="netBookValue" align="center" label="净值" min-width="80">
                 </el-table-column>
                 <el-table-column prop="installDate" align="center" label="设备安装完成时间" min-width="80">
                 <template slot-scope="scope">
                  {{scope.row.installDate!==null?scope.row.installDate.substring(0,10):''}}
                 </template> 
                 </el-table-column>
                 <el-table-column prop="manufacturer" align="center" label="制造厂家" min-width="80">
                 </el-table-column>
                 <el-table-column prop="unusedPlace" align="center" label="闲置位置" min-width="80">
                 </el-table-column>
                  <el-table-column prop="inWarehouseDate" align="center" label="入库日期" min-width="80">
                   <template slot-scope="scope">
                  {{scope.row.inWarehouseDate!==null?scope.row.inWarehouseDate.substring(0,10):''}}
                 </template> 
                 </el-table-column>

                 <el-table-column prop="equipStatus" align="center" label="设备状态" min-width="80">
                  <template slot-scope="scope">
                 {{scope.row.equipStatus == 1 ?'闲置完好':'闲置待报废'}}
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
           <!-- 使用工厂的弹框 -->
          <el-dialog title="使用工厂" :visible.sync="treeFormVisible" :modal="false">
           <span style="margin-left:20px;color:red" >{{radio}}</span> 
           <el-tree :data="datast" :props="defaultProps" @node-click="handleNodeClick" check-strictly ref="tree" node-key="orgCode" show-checkbox highlight-current @check-change="handleClick" ></el-tree>
           <div slot="footer" class="dialog-footer">
              <el-button @click="treeFormVisible = false">取消</el-button>
              <el-button type="primary" @click="treeFormVisible = false">确认</el-button>
            </div>
          </el-dialog>
          <!-- 使用部门的弹框 -->
           <el-dialog title="使用部门" :visible.sync="treeDepartment" :modal="false">
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
// import {fetchList,circuList,Confirmation,evaluate}from '@/api/idleProcess/exitList'
import {fetchList,derivationst,dendrogram,section}from '@/api/idleProcess/fequipmentStore'
import waves from '@/directive/waves' // 水波纹指
import { fetchButton } from '@/api/common/button'
import { menuList } from '@/store/modules/permission'//按钮权限
export default {
  name: 'fequipmentStore',
  directives: {
    waves
  },
  data() {
    return {
      // 设备状态下拉
      genre: [
        { value: '1', lsty: '闲置完好' },
        { value: '2', lsty: '闲置待报废' }
      ], 
      addnewly:'',//导出按钮权限 
      menuCode:'',
      styid:'',  
      value13:[],
      documentW:'',
      listyst: [],
      lookList: [],
      porisgid:'',
      grite: '',
      total: null,
      listQuery: {
        pageNum: 1,
        pageSize: 10
      
      },
      listp:{

      },
      // 使用工厂树的数据
      datast: [],
      defaultProps: {
        children: 'children',
        label: 'orgFullName'
      },
        orgsection:'',//使用部门的编号
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
      // 弹框显示
      dialogFormVisible: false,
      postylitys:false,
      affirmshow1:false,
      affirmshow2:false,
      popTitle: '',
      dialogStatus: '',
    
      isAdd: false, // 新增or编辑
      siteDetail: false, // 新增、编辑弹窗
      editLoading: false, // 提交按钮加载动画
      showStatus: true, // 表单项显示状态
      formSearch_send: false, // 查询条件点选
      listLoading: true, // 远程搜索加载动画
      dialogPvVisible: false,
      dialoglookVisible: false, // 弹窗属性
      

      // 弹框内输入框不填显示的提示信息
       rules: {
        /* staCode: [{ required: true, message: '请输入岗位编码', trigger: 'change' }],
        staName: [{ required: true, message: '请输入岗位名称', trigger: 'change' }] */
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
    // 按钮的权限  afreshst speechst
    getbttonst(){
       menuList.forEach(item => {
        item.children.forEach(e=>{
          if(e.name == "fequipmentStore"){
            this.menuCode = e.code
          }
        })
      })
      // 查询按钮信息
      console.log(this.menuCode)
      const determine = {
        menuCode: this.menuCode,
        type: 'web'
      }
     
      fetchButton(determine).then(response => {
        if(response.data.code == 200){
          const authority=response.data.data
          for(var i=0;i<authority.length;i++){
            if(authority[i].buttonName=="导出"){
              this.addnewly=true
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
        this.listyst = response.data.data.results
        this.total = response.data.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 1000)
      })
    },
 
      // 日期  搜索
   searchsty(){
        // 出库日期时间  搜索
      if(this.value13==null){
         this.listQuery.inWarehouseDateStart=''
         this.listQuery.inWarehouseDateEnd=''
      }else{
        this.listQuery.inWarehouseDateStart = this.value13[0]// 开始时间
        this.listQuery.inWarehouseDateEnd = this.value13[1]
      }
   },
    
   
    // 导出
    derivation() {
      this.listp.divisionCode = this.listQuery.divisionCode
      this.listp.factoryCode = this.listQuery.factoryCode
      this.listp.equipmentName = this.listQuery.equipmentName
      this.listp.fixedAssetCode = this.listQuery.fixedAssetCode
      this.listp.model = this.listQuery.model
      this.listp.equipStatus = this.listQuery.equipStatus
      this.listp.inWarehouseDateStart = this.listQuery.inWarehouseDateStart 
      this.listp.inWarehouseDateEnd = this.listQuery.inWarehouseDateEnd 
      // console.log(this.listQuery)
       derivationst(this.listp).then(response => {
        const liststyp = response.data.data
        // console.log(liststyp)
        window.location.href = liststyp
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
          this.listQuery.factoryCode = data.orgCode
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
             orgFullName:'今飞控股集团',
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
          this.listQuery.divisionCode = data.orgCode
          this.yesno = data.orgFullName
          // 交叉点击节点
        } else {
          this.$refs.treeform.setCheckedNodes([])
          // 点击已经选中的节点，置空
        }
      }
    },
    handleNodeClickst(data) {
    //   this.listQuery.divisionCode = data.orgCode
    
    },
    // 使用工厂清空按钮
    clears(){
    this.listQuery.factoryCode=''
    this.radio=''
    this.treeFormVisible = false
   
    },
    // 使用部门清空按钮
    clearsection(){
    this.listQuery.divisionCode=''
     this.yesno=''
    this.treeDepartment = false
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
          .buttonlist{
              position:absolute;
              right:20px;
              top:80px;
              }
        #buttstyps{
              width:42px;
              height:36px;
              cursor:pointer;
              text-align:center;
    }
    </style>
