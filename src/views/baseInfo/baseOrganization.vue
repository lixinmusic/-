<template>
  <div class="app-container">
    <!--外部容器 -->
    <el-container>
       <!-- 顶部搜索 -->
      <el-header style="margin-bottom:30px;padding:0px;">
        <div class="filter-container">
         <!--  <div style="font-size:20px;color:#409eff;margin-bottom:10px;border-bottom:1px solid #ddd">组织管理</div> -->
            <!-- <v-pageSearch> -->
		<div class="formSearch">
            <el-form :inline="true">
                <el-form-item label="组织全称">
                <el-input class="minier-input" v-model="listQuery.orgFullName" placeholder="请输入组织全称" clearable></el-input>
                </el-form-item>
                <el-form-item label="组织编码"  class="seat">
                <el-input v-model="listQuery.orgCode" placeholder="请输入组织编码" clearable></el-input>
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
        <!-- <div class="erop" style="width:240px;height:624px;overflow-y:scroll;margin-top:40px;"> -->
        <el-aside style="border:1px solid #f0f0f0;width:290px;height:624px;padding-top:20px;"  >
        <el-tree :data="datast" :props="defaultProps" node-key="orgCode" ref="tree" @node-click="handleNodeClick"></el-tree>
        </el-aside>
        <!-- </div> -->
        <el-container>  <!--v-if="showPrise"  这个方法是让表格隐藏-->
          <!-- 主要区域容器 -->
          <el-main>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit" v-if="addnewly">新增</el-button>
            <el-button style="margin: 10px 10px;" type="primary" v-waves @click="drag" v-if="dragShow">拖拽完成</el-button>
            <el-table :key='tableKey' :data="listyst" v-loading="listLoading" border fit highlight-current-row
              style="width: 100%;min-height:500px;margin-top:8px" height="500" :header-cell-style="{background:'oldlace'}">
               
                 <el-table-column prop="orgFullName" align="center" label="组织全称"  min-width="80">
                   <template slot-scope="scope">
                        <span class="link-type futiop" @click='checkDetails(scope.row)'>{{scope.row.orgFullName}}</span>
                    </template>
                 </el-table-column>  
                <el-table-column prop="orgType" align="center" label="组织类型" min-width="80">
                 </el-table-column>

              <el-table-column prop="orgCode" align="center" label="组织编码" min-width="80">
                 </el-table-column>

               <el-table-column prop="orgLevel" align="center" label="组织等级" min-width="80">
                 </el-table-column>
              <el-table-column prop="isEnable" align="center" label="是否可用" min-width="80">
                  <template slot-scope="scope">
                  {{scope.row.isEnable ==1?'是':'否'}}
                  </template>
                 </el-table-column>

              <el-table-column align="center" label="操作" min-width="120"  class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-button title="编辑" type="primary" v-if="edit" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)"></el-button>
                  <el-button title="删除" type="danger" v-if="cutout" icon="el-icon-delete" size="mini" @click="deleteBtn(scope.row)"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
         <!--  <div class='show-d'>{{('nemo1')}} : &nbsp; {{ oldList}}</div>
         <div class='show-d'>{{('nemo后')}} : {{newList}}</div>
           <div class='show-d'>{{('id前')}} : &nbsp; {{ oldidList}}</div>
         <div class='show-d'>{{('id后')}} : {{newidList}}</div>
          <div class='show-d'>{{('code前')}} : &nbsp; {{ oldListCode}}</div>
         <div class='show-d'>{{('code后')}} : {{newListCode}}</div> -->
          <!-- 底栏容器 -->
          <el-footer>
            <div style="width:100%;height:50px;background:#fff">
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
            </div>
          </el-footer>
          
          <!-- 新增和编辑是同一个弹出框 -->
          <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" v-dialogDrag top="20vh" width="700px" :visible.sync="dialogFormVisible">
            <el-form :rules="rules" ref="dataForm" :model="temp" label-width="100px">
              <el-row>
              <el-col :span="8">     
              <el-form-item label="组织全称" prop="orgFullName">
              <el-input v-model="temp.orgFullName" maxlength="64" style="width:190px" class="enter medium-input" placeholder="请输入组织全称" ></el-input>
              </el-form-item>
              </el-col>
               <el-col :span="16">
              <el-form-item label="组织简称" prop="orgShortName" style="margin-left:100px;"> 
              <el-input v-model="temp.orgShortName" maxlength="32" style="width:190px" class="enter medium-input" placeholder="请输入组织简称" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">     
              <el-form-item label="组织类型" prop="orgType">
              <!-- <el-input v-model="site.orgType" style="width:190px" class="enter medium-input" placeholder="请输入网点编号" ></el-input> -->
               <el-select v-model="temp.orgType" style="width:190px" clearable placeholder="请选择类型">
                <el-option
                v-for="item in genre"
                :key="item.value"
                :label="item.lsty"
                :value="item.value">
                </el-option>
            </el-select>
              </el-form-item>
              </el-col>
               <el-col :span="16">
              <el-form-item label="组织编码" prop="orgCode" style="margin-left:100px;"> 
              <el-input v-model="temp.orgCode" :disabled="isDisable" style="width:190px" class="enter medium-input" placeholder="请输入组织编码" onkeyup="this.value=this.value.replace(/\D/g,'')"></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">     
              <el-form-item label="组织等级" prop="orgLevel">
              <el-input v-model="temp.orgLevel" style="width:190px" :disabled='siteCodeState=true' class="enter medium-input" placeholder="组织等级" ></el-input>
              </el-form-item>
              </el-col>
               <el-col :span="16">
              <el-form-item label="负责人" prop="charge"  style="margin-left:100px;"> 
              <el-input v-model="temp.charge" onkeyup="value=value.replace(/[\d]/g,'') "  onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[\d]/g,''))" maxlength="20" style="width:190px" class="enter medium-input" placeholder="请输入负责人" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>

               <el-row>
              <el-col :span="8">     
              <el-form-item label="座机号码" prop="tel">
              <el-input v-model="temp.tel" style="width:190px" maxlength="12" class="enter medium-input" placeholder="请输入座机号码" ></el-input>
              </el-form-item>
              </el-col>
               <el-col :span="16">
              <el-form-item label="联系地址" prop="address" style="margin-left:100px;"> 
              <el-input v-model="temp.address" maxlength="64" style="width:190px" class="enter medium-input" placeholder="请输入联系地址" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">     
              <el-form-item label="传真" prop="fax">
              <el-input v-model="temp.fax" style="width:190px" class="enter medium-input" placeholder="请输入传真" ></el-input>
              </el-form-item>
              </el-col>
               <el-col :span="16">
              <el-form-item label="邮箱" prop="email"  style="margin-left:100px;"> 
              <el-input v-model="temp.email" style="width:190px" class="enter medium-input" placeholder="请输入邮箱" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-form-item label="是否可用" prop="isEnable">
             
              <el-select v-model="temp.isEnable" style="width:190px" clearable placeholder="请选择">
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.lsty"
                :value="item.value">
                {{item.lsty}}
                </el-option>
             </el-select>
              </el-form-item>
              <el-form-item label="备注" prop="discription">
                <el-input type="textarea" maxlength="258" style="width:510px" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入备注" v-model="temp.discription">
                </el-input>

              </el-form-item>
              <el-form-item label="上级组织" prop="orgParCode"  style="margin-left:0px;"> 
                <!-- 组织图树 --> 
              <span style="color:red; margin-left:20px">当前所属组织：</span>
              <span style="color:red">{{receive}}</span>
              <el-tree :data="roprtys" node-key="id" :props="ParCodesty" highlight-curren ref="tree"  @node-click="handleNodeClicks"></el-tree>
              </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取消</el-button>
              <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">提交</el-button>
              <el-button v-else type="primary" @click="updateData">提交</el-button>
            </div>
          </el-dialog>
          <!-- 查看 -->
         <el-dialog :close-on-click-modal="false" title="查看详情" v-dialogDrag top="20vh" width="700px" :visible.sync="dialoglookVisible">
            <el-form ref="dataForm" :model="temp"  label-width="100px">
             <el-row>
              <el-col :span="8">     
              <el-form-item label="组织全称" prop="orgFullName">
              <el-input v-model="temp.orgFullName" :disabled='siteCodeState?true:false' style="width:190px" class="enter medium-input" placeholder="空" ></el-input>
              </el-form-item>
              </el-col>
               <el-col :span="16">
              <el-form-item label="组织简称" prop="orgShortName"  style="margin-left:100px;"> 
              <el-input v-model="temp.orgShortName" :disabled='siteCodeState?true:false' style="width:190px" class="enter medium-input" placeholder="空" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">     
              <el-form-item label="组织类型" prop="orgType">
              <!-- <el-input v-model="site.orgType" style="width:190px" class="enter medium-input" placeholder="请输入网点编号" ></el-input> -->
               <el-select v-model="temp.orgType" :disabled='siteCodeState?true:false' style="width:190px" clearable placeholder="空">
                <el-option
                v-for="item in genre"
                :key="item.value"
                :label="item.lsty"
                :value="item.value">
                </el-option>
            </el-select>
              </el-form-item>
              </el-col>
               <el-col :span="16">
              <el-form-item label="组织编码" prop="orgCode" style="margin-left:100px;"> 
              <el-input v-model="temp.orgCode" style="width:190px" :disabled='siteCodeState?true:false' class="enter medium-input" placeholder="空" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">     
              <el-form-item label="组织等级" prop="orgLevel">
              <el-input v-model="temp.orgLevel" style="width:190px" :disabled='siteCodeState?true:false' class="enter medium-input" placeholder="空" ></el-input>
              </el-form-item>
              </el-col>
               <el-col :span="16">
              <el-form-item label="负责人" prop="charge"  style="margin-left:100px;"> 
              <el-input v-model="temp.charge" maxlength="20" :disabled='siteCodeState?true:false' style="width:190px" class="enter medium-input" placeholder="空" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>

               <el-row>
              <el-col :span="8">     
              <el-form-item label="座机号码" prop="tel">
              <el-input v-model="temp.tel" style="width:190px" :disabled='siteCodeState?true:false' class="enter medium-input" placeholder="空" ></el-input>
              </el-form-item>
              </el-col>
               <el-col :span="16">
              <el-form-item label="联系地址" prop="address" style="margin-left:100px;"> 
              <el-input v-model="temp.address" maxlength="64" :disabled='siteCodeState?true:false' style="width:190px" class="enter medium-input" placeholder="空" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">     
              <el-form-item label="传真" prop="fax">
              <el-input v-model="temp.fax" style="width:190px" :disabled='siteCodeState?true:false' class="enter medium-input" placeholder="空" ></el-input>
              </el-form-item>
              </el-col>
               <el-col :span="16">
              <el-form-item label="邮箱" prop="email"  style="margin-left:100px;"> 
              <el-input v-model="temp.email" style="width:190px" :disabled='siteCodeState?true:false' class="enter medium-input" placeholder="空" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-form-item label="是否可用" prop="isEnable">
             
              <el-select v-model="temp.isEnable" :disabled='siteCodeState?true:false' style="width:190px" clearable placeholder="空">
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.lsty"
                :value="item.value">
                {{item.lsty}}
                </el-option>
             </el-select>
              </el-form-item>
              <el-form-item label="备注" prop="discription">
                <el-input type="textarea" maxlength="258" :disabled='siteCodeState?true:false' style="width:510px" :autosize="{ minRows: 2, maxRows: 4}" placeholder="空" v-model="temp.discription">
                </el-input>

              </el-form-item>
              <el-form-item label="上级组织" prop="orgParCode"  style="margin-left:0px;"> 
              <!-- <el-input v-model="temp.orgParCode" style="width:190px" class="enter medium-input" placeholder="请输入编号" ></el-input> -->
               <span style="color:red">当前所属组织：</span>
               <span style="color:red">{{receive}}</span>
                <!-- 组织图树 -->
              <!-- <el-tree :data="roprtys" :props="ParCodesty" :disabled='siteCodeState?true:false' @node-click="handleNodeClicks"></el-tree> -->
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialoglookVisible = false">确认</el-button>
            </span>
        </el-dialog>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>

import { fetchList, dendrogram, createArticle, updateArticle, fetchPv, look, doesitExist, drafting,evaluate } from '@/api/baseInfo/baseOrganization'
import waves from '@/directive/waves' // 水波纹指令
import Sortable from 'sortablejs'
import { fetchButton } from '@/api/common/button'
import { menuList } from '@/store/modules/permission'//按钮权限

export default {
  name: 'baseOrganization',
  directives: {
    waves
  },
  data() {
    //   电话校验
    var phoneNumberst = (rule, value, callback) => {
      if (value != '') {
        if ((/^((0\d{2,3}-\d{7,8}))$/).test(value) == false) {
          callback(new Error('请输入正确的座机号'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    // 邮箱校验
    var validateEmail = (rule, value, callback) => {
      if (value != '') {
        if ((/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/).test(value) == false) {
          callback(new Error('请输入有效的邮箱'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      // 是否可用下拉框
      options: [
        { value: 1, lsty: '是' },
        { value: 0, lsty: '否' }
      ],
      // 组织类型下拉框
      genre: [
        { value: '公司', lsty: '公司' },
        { value: '部门', lsty: '部门' }
	  ],
	  tableKey:0,
      listyst: [],
      lookList: [],
      grite: '',
      total: null,
      //   表格传的参数
      listQuery: {
        pageNum: 1,
        pageSize: 10
      /*   orgCode: '', // 组织编号
        orgFullName: '' // 组织全称 */
        // orgParCode: "" ,// 父组织编号
      },
	  orgCode: '',
    isDisable:false,
    estimate:'',
      // 树的数据
      datast: [],
      defaultProps: {
        children: 'children',
        label: 'orgFullName'
      },
      //   新增所属上级组织树
      roprtys: [],
      ParCodesty: {
        children: 'children',
        label: 'orgFullName'
      },
      // 编辑和新增的字段设置
      temp: {
        orgFullName: '', // 组织全称
        orgShortName: '', // 组织简称
        orgType: '', // 组织类型
        orgCode: '', // 组织编号
        orgLevel: '', // 组织等级
        charge: '', // 负责人
        tel: '', // 电话
        fax: '', // 传真
        email: '', // 邮箱
        address: '', // 联系地址
        isEnable: 1, // 是否可用
        discription: '' // 备注
      },
      orgFu: {
        orgFullName: ''
      },
      // 弹框显示
      dialogFormVisible: false,
      popTitle: '',
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      dragShow:false,
      i:0,
      isAdd: false, // 新增or编辑
      siteDetail: false, // 新增、编辑弹窗
      editLoading: false, // 提交按钮加载动画
      showStatus: true, // 表单项显示状态
      formSearch_send: false, // 查询条件点选
      listLoading: true, // 远程搜索加载动画
      showPrise: false, // 右边的表格的显示隐藏
      siteCodeState: '',
      receive: '',
      gather: [],
      sty: ['id', 'orgCode', 'orderNumber'],
      oldList: [],
      newList: [],
      oldListCode: [],
      newListCode: [],
      oldidList: [],
      newidList: [],
      // 按钮权限
      addnewly:false,//新
      edit:false,//编
      cutout:false,//删
      dragbutton:false,//拖
      referring:false,//提交
      remove:false,//取消
      huntfor:false,//搜索
      orgCodelopo:'',


      // 弹框内输入框不填显示的提示信息tel
      dialogPvVisible: false,
      dialoglookVisible: false,
      pvData: [],
      rules: {
        orgFullName: [{ required: true, message: '请填写', trigger: 'change' }],
        orgCode: [{ required: true, message: '请填写', trigger: 'change' }],
        orgType: [{ required: true, message: '请填写', trigger: 'blur' }],
        orgLevel: [{ required: true, message: '请选择上级组织', trigger: 'blur' }],
        isEnable: [{ required: true, message: '请填写', trigger: 'blur' }],
        orgParCode: [{ required: true, message: '请选择', trigger: 'blur' }],
        tel: [{ required: false, validator: phoneNumberst, trigger: 'change' }],
        email: [{ required: false, validator: validateEmail, trigger: 'change' }]
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
    this.getapst()
    this.getbttonst()
    // this.getstyl()
  },
  methods: {
    // 按钮的权限
    getbttonst(){
		 menuList.forEach(item => {
			item.children.forEach(e=>{
			if(e.name == "baseOrganization"){
				this.menuCode = e.code
			}
			})
		})
      const determine={
		// menuCode:"WM_011",
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
            }else if(authority[i].buttonName=="拖拽完成"){
                  this.dragbutton = true
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


    // 树状图的方法
    handleNodeClick(data) {
      console.log(data)
      console.log(12345678)
      // this.gather = []
      this.dragShow = true
      this.listLoading = true
      this.orgCodelopo = data.orgCode
      const treeclick = {
        orgParCode: this.orgCodelopo,
        pageNum: this.listQuery.pageNum,
        pageSize: this.listQuery.pageSize
      }
      fetchList(treeclick).then(response => {
        this.listyst = response.data.data.list
        this.total = response.data.data.total
        this.listLoading = false

        this.oldList = this.listyst.map(v => v.orderNumber)
        this.newList = this.oldList.slice()
        console.log(this.newList)// 1,1

        this.oldListCode = this.listyst.map(v => v.orgCode)
        this.newListCode = this.oldListCode.slice()// 03,05

        this.oldidList = this.listyst.map(v => v.id)
        this.newidList = this.oldidList.slice()// 8,13
        // console.log(this.gather) // JSON.stringify( arr )
        this.$nextTick(() => {
          this.setSort()
        })
      })
    },
    // 左侧树的单选
   /*   handleClick(data,checked, node) {
        console.log(this.i)
      this.i++;
      if(this.i%2==0){
          if(checked){
              this.$refs.tree.setCheckedNodes([]);
              this.$refs.tree.setCheckedNodes([data]);
              //交叉点击节点
          }else{
              this.$refs.tree.setCheckedNodes([]);
              //点击已经选中的节点，置空
          }
      }
    }, */
    // 树状图的接口
    getapst() {
      this.listLoading = true
      this.datast=[]
      dendrogram('').then(response => {
        this.datast.push(response.data.data)
        this.listLoading = false
      })
    },
    // 表格的接口
    getAA() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.listyst = response.data.data.list
        this.total = response.data.data.total
        //   this.listLoading = false
         this.$nextTick(()=>{
          this.listLoading = false
        })
      })
    },
     // 搜索
    handleFilter() {
      this.orgCodelopo=''
      this.showPrise = true// 表格显示隐藏
      this.dragShow = false
      this.listQuery.pageNum = 1
      this.getAA()
    
    },
    handleSizeChange(val) {
      if(this.orgCodelopo ==''){ 
      console.log(1234)
      console.log(val)
      this.showPrise = true
      this.listQuery.pageSize = val
      this.getAA()
    }else if(this.orgCodelopo!== ''){ 
      this.showPrise = true
      this.listQuery.pageSize = val
      console.log(12345678)
      // this.gather = []
      this.dragShow = true
      this.listLoading = true
      // this.orgCodelopo = data.orgCode
      const treeclick = {
        orgParCode: this.orgCodelopo,
        pageNum: this.listQuery.pageNum,
        pageSize: this.listQuery.pageSize
      }
      fetchList(treeclick).then(response => {
        this.listyst = response.data.data.list
        this.total = response.data.data.total
        this.listLoading = false
      })
    }
  },
    handleCurrentChange(val) {
      if(this.orgCodelopo == ''){ 
      console.log(44444)
      this.showPrise = true
      this.listQuery.pageNum = val
       this.getAA()
      }else if(this.orgCodelopo!== ''){  
      console.log(12345678)
      this.showPrise = true
      this.listQuery.pageNum = val
      this.dragShow = true
      this.listLoading = true
      // this.orgCodelopo = data.orgCode
      const treeclick = {
        orgParCode: this.orgCodelopo,
        pageNum: this.listQuery.pageNum,
        pageSize: this.listQuery.pageSize
      }
      fetchList(treeclick).then(response => {
        this.listyst = response.data.data.list
        this.total = response.data.data.total
        this.listLoading = false
      })
     }
    },
    // 拖拽表格
    setSort() {
      const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // 被拖动元素离开原来位置时原来位置的样式,
        setData: function(dataTransfer) {
          dataTransfer.setData('Text', '')
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
        },
        onEnd: evt => {
          console.log(11111)
          console.log(this.listyst)
          // // 为了显示更改，您可以在代码中删除
          const tempIndex = this.newidList.splice(evt.oldIndex, 1)[0]
          this.newidList.splice(evt.newIndex, 0, tempIndex)

          const tempIndex1 = this.newListCode.splice(evt.oldIndex, 1)[0]
          this.newListCode.splice(evt.newIndex, 0, tempIndex1)

          const tempIndex2 = this.newList.splice(evt.oldIndex, 1)[0]
          this.newList.splice(evt.newIndex, 0, tempIndex2)

          this.gather = this.newList.map((item, index) => {
            var objs = {}
            objs[this.sty[0]] = this.newidList[index]
            objs[this.sty[1]] = this.newListCode[index]
            objs[this.sty[2]] = this.listQuery.pageSize * (this.listQuery.pageNum - 1) + index + 1
            return objs
          })
        }
      })
    },
    // 拖拽完成
    drag() {
      const params = this.gather // JSON.stringify(this.gather)
      console.log(this.gather)
      drafting(params).then(data => {
          console.log(data.data.code)
            if (data.data.code== 200) {
              this.getapst()//左侧树的接口再调用	
              this.$message({
              title: '成功',
              message: '拖拽成功',
              type: 'success',
              duration: 2000
				    })
            }else{ 
               this.$notify({
                title:'警告',
                type: 'warning',
                message: '没有进行拖拽操作，请重新操作',
                duration: 2000
              })
        }
      })
    },
    // 查看
    checkDetails(row) {
        console.log(row.id)
        const id = row.id
        evaluate(id).then(response => {
        this.popTitle = response.data.data
        console.log(this.popTitle)
        this.receive = this.popTitle.orgParFullName
       /* this.temp.stationCode = this.popTitle.stationName */
        this.temp = Object.assign({}, this.popTitle)
         })
      this.dialoglookVisible = true
      this.siteCodeState = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
	   this.getstyl()
    },
    
    // 删除事件
    deleteBtn(row) {
      console.log(row)
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          console.log(row)
          const deleteid = row.id
          console.log(deleteid)
          fetchPv(deleteid).then(response => {
            if(response.data.code == 200){ 
                this.getAA()	
                this.getapst()
                const index = this.listyst.indexOf(row)
                this.listyst.splice(index, 1)
            
               this.$message({
                type: 'success',
                message: '删除成功!'
            })
              }else{
                 this.$notify({
                  title: '警告',
                  message: response.data.msg,
                  type: 'warning',
                  duration: 3000
            })
            return
            
            }
           })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
   
    // 重置表单
    resetForm() {
      this.temp = {
        orgFullName: '', // 组织全称
        orgShortName: '', // 组织简称
        orgType: '', // 组织类型
        orgCode: '', // 组织编号
        orgLevel: '', // 组织等级
        charge: '', // 负责人
        tel: '', // 电话
        fax: '', // 传真
        email: '', // 邮箱
        address: '', // 联系地址
        isEnable: 1, // 是否可用
        discription: '' // 备注
      }
     this.receive=""
     
    },
    //   所属上级的组织树的接口
    getstyl() {
      this.listLoading = true
       this.roprtys=[]
      dendrogram('').then(response => {
        this.roprtys.push(response.data.data)
        console.log(this.roprtys)
        this.listLoading = false
      })
    },
    handleNodeClicks(data) {
      this.receive = data.orgFullName
      this.temp.orgLevel = (data.orgLevel + 1)
      this.temp.orgParCode = data.orgCode
      console.log(this.receive)
      console.log(data)
    },
    // 新增点击打开弹窗事件
    handleCreate() {
	  this.siteCodeState = false
	  this.isDisable=false
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
       this.getstyl()
    },
    // 新增提交按钮
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          doesitExist(this.temp.orgCode).then(response => {
            console.log(this.temp.orgCode)
            console.log(response.data.data)
            if (response.data.data == 1) {
              this.$message({
                type: 'success',
                message: '组织编号已存在请重新输入!'
              })
              return
            } else {
              createArticle(this.temp).then(response => {
                if(response.data.code==200){
                  this.listyst.unshift(this.temp)
                  this.getAA()
                  this.getapst()
                  this.dialogFormVisible = false
                  this.$message({
                    title: '成功',
                    message: '创建成功',
                    type: 'success',
                    duration: 2000
                  })
                }else{
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
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    // 编辑点击打开弹窗事件
    handleUpdate(row) {
        this.isDisable=true
        this.siteCodeState = true
        console.log(row.id)
        const id = row.id
       
       evaluate(id).then(response => {
        this.popTitle = response.data.data
        console.log(this.popTitle)    
         this.receive = this.popTitle.orgParFullName
         this.estimate = this.popTitle.orgParCode
       /* this.temp.stationCode = this.popTitle.stationName */
        this.temp = Object.assign({}, this.popTitle)
         })
	     this.getstyl()
	  
     /*  this.temp = Object.assign({}, row) // copy obj 复制obj
      console.log(this.temp) */
    //   this.receive = this.temp.orgFullName
      console.log(this.receive)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      
    },
    // 编辑提交按钮
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          console.log(tempData.orgParCode)
           if(this.estimate != tempData.orgParCode){//判断是否上级组织改变了
            this.$confirm('确认组织人员和下级组织一起变动吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
         }).then(() => {
           updateArticle(tempData).then(response => {
            const msg = response.data.msg
            if (response.data.code === 200) {//判断接口是否请求成功
            for (const v of this.listyst) {
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
            //  this.getAA()
             this.getapst()
            }else{
             this.$notify({
                title: '错误',
                message: msg,
                type: 'error',
                duration: 2000
              })
           }
          }) 

      }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消编辑'
            })
           })
      }else{  
          updateArticle(tempData).then(response => {
            const msg = response.data.msg
            if (response.data.code === 200) {
            for (const v of this.listyst) {
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
            /*  this.getAA() */
             this.getapst()
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
<style>
.sortable-ghost{
  opacity: .8;
  color: #fff!important;
  background: #42b983!important;
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
.el-tree-node__content:hover {
  background-color: #6dc6fa;
  border-radius:3%
} 
</style>
