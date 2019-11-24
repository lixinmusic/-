<template>
  <div class="app-container">
    <!--外部容器 -->
    <el-container>
       <!-- 顶部搜索 -->

        <div class="filter-container">
            <div class="formSearch">
            <el-form :inline="true">
              
                <el-form-item label="设备名称">
                <el-input v-model="listQuery.equipmentName"  placeholder="请输入设备名称" clearable></el-input>
                </el-form-item>
               

              
                <el-form-item label="固定资产编号">
                <el-input class="minier-input" v-model="listQuery.fixedAssetCode" placeholder="请输入固定资产编号" clearable></el-input>
                </el-form-item>
            

                
                <el-form-item label="验收完成时间" >
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
             

              
                <el-form-item label="验收情况" prop="acceptanceType" > 
                <el-radio v-model="listQuery.acceptanceType" label="1">验收通过</el-radio>
                <el-radio v-model="listQuery.acceptanceType" label="0">验收不通过</el-radio>

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
           
            <el-table :data="listyst" v-loading="listLoading" border fit highlight-current-row
              style="width: 100%;min-height:auto;margin-top:0px" height="500" :header-cell-style="{background:'oldlace'}">


              <el-table-column prop="documentWordCode" align="center" label="单据编码" min-width="100">
               <template slot-scope="scope">
                 <span class="link-type futiop" @click='checkDetails(scope.row)'>{{scope.row.documentWordCode}}</span>
               </template>
               </el-table-column>
                <el-table-column prop="useCompanyName" align="center" label="使用公司" min-width="80">
                 </el-table-column>
                 <el-table-column prop="useFactoryName" align="center" label="使用工厂" min-width="80">
                 </el-table-column>
                 <el-table-column prop="useWorkshopName" align="center" label="使用部门" min-width="80">
                 </el-table-column>
                 <el-table-column prop="equipmentName" align="center" label="设备名称" min-width="80">
                 </el-table-column>
                  <el-table-column prop="typeSpecification" align="center" label="型号规格" min-width="80">
                 </el-table-column>
                 <el-table-column prop="outFactoryCode" align="center" label="出厂编号" min-width="80">
                 </el-table-column>
                  <el-table-column prop="fixedAssetCode" align="center" label="固定资产编号" min-width="80">
                 </el-table-column>
                <el-table-column prop="supplier" align="center" label="供应商" min-width="80">
                 </el-table-column>
               <el-table-column prop="payTime" align="center" label="交付日期" min-width="80">
                 </el-table-column>
               <el-table-column prop="acceptanceFinishTime" align="center" label="验收完成时间" min-width="80">
                 </el-table-column>
               <el-table-column prop="acceptanceSituationName" align="center" label="验收情况" min-width="80">
                 </el-table-column>
               <el-table-column prop="auditingTypeName" align="center" label="审核状态" min-width="80">
                 </el-table-column>

                  <el-table-column align="center" label="操作" min-width="150" fixed="right" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-button title="转办" type="primary" size="mini" icon="el-icon-share" @click="transfer(scope.row)"></el-button>
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

           <!-- 转办弹框 -->
           <el-dialog title="请选择转办接收人员" :close-on-click-modal="false" v-dialogDrag v-loading="dragLoading" :visible.sync="innerVisible" width="50%" append-to-body>
            <el-row :gutter="20">
              <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="姓名">
                  <el-input v-model="listQuery1.perName"  placeholder="请输入姓名">
                  </el-input>
                </el-form-item>
                <el-form-item label="工号">
                  <el-input v-model="listQuery1.workNumber" placeholder="请输入工号">
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" icon="el-icon-search"  @click="handlePerson">搜索</el-button>
                </el-form-item>
              </el-form>
              </el-row>
              <el-container>
                 <el-col :span="8">
                  <el-aside width="230px">
                  <h4>组织</h4>
                <el-tree :data="orgData" :props="defaultProps" @node-click="handleNodeClick1" v-loading="treeLoading" style="width:380px;height:500px;"></el-tree>
              </el-aside>
                </el-col>
                 <el-col :span="16">
                  <el-table height='578' :data="orgListData" v-loading="listLoading" border fit highlight-current-row
                    style="width: 100%;min-height:500px;margin-top:8px" @current-change="hanhange">
                    <el-table-column prop="orgName"  align="center" label="部门" min-width="60" style="cursor:pointer">
                     <template slot-scope="scope">
                        <a class="text-detail">{{scope.row.orgName}}</a>
                      </template>
                    </el-table-column>
                    <el-table-column  prop="perName" align="center" label="人员" min-width="50" style="cursor:pointer">
                       <template slot-scope="scope">
                        <a class="text-detail">{{scope.row.perName}}</a>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="工号" min-width="50">
                      <template slot-scope="scope">
                        <a class="text-detail">{{scope.row.workNumber}}</a>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
          </el-container>
           <div slot="footer" class="dialog-footer">
          </div>
          </el-dialog>


           <!-- 新增和编辑是同一个弹出框 -->
          <el-dialog title="查看详情" :close-on-click-modal="false" v-dialogDrag top="8vh" width="1000px" :visible.sync="dialogFormVisible">
              <!-- 选项卡 -->
        <el-tabs v-model="activeName" v-loading="fromLoading" @tab-click="fathClick"><!-- @tab-click="handleClick" -->
          <el-tab-pane label="表单信息" name="first">
          <!-- 选项卡表格 -->
            <el-form :rules="rules" ref="dataForm" :model="temp" label-width="110px">
              <el-form-item>
                <span class="equip-title">新设备验收单</span>
              </el-form-item>

              <el-row>
              <el-col :span="8">     
              <el-form-item label="单据编码"  prop="documentWordCode">
              <el-input style="width:290px" v-model="temp.documentWordCode" disabled  class="enter medium-input" placeholder="空" ></el-input>
              </el-form-item>
              </el-col>
               <el-col :span="16">
              <el-form-item label="使用公司" prop="useCompanyName" style="margin-left:200px;"> 
              <el-input v-model="temp.useCompanyName" :disabled='siteCodeState?true:false' style="width:290px" class="enter medium-input" placeholder="请输入使用公司" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>
             
              <el-row>
              <el-col :span="8">     
              <el-form-item label="使用工厂"  prop="useFactoryName">
              <el-input style="width:290px" v-model="temp.useFactoryName" :disabled='siteCodeState?true:false' class="enter medium-input" placeholder="输入使用工厂" ></el-input>
              </el-form-item>
              </el-col>
               <el-col :span="16">
              <el-form-item label="使用车间" prop="useWorkshopName" style="margin-left:200px;"> 
              <el-input v-model="temp.useWorkshopName" :disabled='siteCodeState?true:false' style="width:290px" class="enter medium-input" placeholder="请输入使用车间" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>
              
              <el-row>
              <el-col :span="8">     
              <el-form-item label="设备名称" prop="equipmentName">
              <el-input v-model="temp.equipmentName" :disabled='siteCodeState?true:false' style="width:290px" class="enter medium-input" placeholder="请输入设备名称" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="型号规格" prop="typeSpecification" style="margin-left:200px;">
              <el-input v-model="temp.typeSpecification" :disabled='siteCodeState?true:false' style="width:290px" class="enter medium-input" placeholder="请输入型号规格" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">     
              <el-form-item label="出厂编号" prop="outFactoryCode"> 
              <el-input v-model="temp.outFactoryCode" :disabled='siteCodeState?true:false' style="width:290px" class="enter medium-input" placeholder="请输入出厂编号" ></el-input>   
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="固定资产编号" prop="fixedAssetCode" style="margin-left:200px;"> 
              <el-input v-model="temp.fixedAssetCode" :disabled='siteCodeState?true:false' style="width:290px" class="enter medium-input" placeholder="请输入固定资产编号" ></el-input>   
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">
              <el-form-item label="供应商" prop="supplier"> 
              <el-input v-model="temp.supplier" :disabled='siteCodeState?true:false' style="width:290px" class="enter medium-input" placeholder="请输入供应商" ></el-input>   
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="交付日期" prop="payTime" style="margin-left:200px">
               <div class="block">
                <el-date-picker
                  style="width:290px"
                  v-model="temp.payTime"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  
                   :disabled='siteCodeState?true:false'>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              </el-row>

              
               <el-row>
              <el-col :span="10">     
              <el-form-item label="验收完成时间" prop="acceptanceFinishTime" >
               <div class="block">
                <el-date-picker
                  style="width:280px"
                  v-model="temp.acceptanceFinishTime"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                   :disabled='kstylsty?true:false'>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              <el-col :span="14">
              <el-form-item label="验收情况" prop="acceptanceSituation" :disabled='kstylsty?true:false' style="margin-left:80px"> 
                <el-radio v-model="temp.acceptanceSituation" :disabled='kstylsty?true:false' label="1">验收通过</el-radio>
                <el-radio v-model="temp.acceptanceSituation" :disabled='kstylsty?true:false' label="0">验收不通过</el-radio>

                </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="18">
              <span style="color:red;position:absolute;bottom:30px;left:0px">*</span>
              <el-form-item label="新设备验收单附件" class="sepost" label-width="130px">
               
              <!-- <input class="uploadInput" id="uploadImg" ref="uploadImg" type="file" accept="image/gif,image/jpg,image/png,/image/gif,image/jpeg" @change="noticeUpload"> -->
              <input id="uploadImg" type="file" @change="noticeUpload">
              </el-form-item>
              </el-col>
               </el-row> 
              <!-- 第一个小表格 -->
               <el-table :data="smallslist" v-loading="listLoading" border fit highlight-current-row
              style="width: 100%;min-height:auto;margin-top:8px" :header-cell-style="{background:'oldlace'}">

                <el-table-column prop="fileName" align="center" label="文件名" min-width="323">

                 <template slot-scope="scope">
                 <span style="cursor:pointer;text-decoration:underline " @click="handlePreview(scope.row)">{{scope.row.fileName}}</span>
                 </template>
                 </el-table-column>
                 <el-table-column prop="node" align="center" label="上传节点" min-width="318">

                 <template slot-scope="scope">
                 <span>{{scope.row.node}}</span>
                 </template>
                 </el-table-column>

                <el-table-column align="center" label="操作" min-width="318"  class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-button title="下载" type="primary" @click="downloadsty(scope.row)" size="small" icon="el-icon-download"></el-button>
                  <el-button title="删除" type="danger" @click="updatadelest(scope.row)" icon="el-icon-delete" size="small" :disabled="scope.row.deleteDisabled?true:false"></el-button>

               
                  </template>
                 </el-table-column>
                </el-table>
                
              <el-form-item label="设备检修记录单附件" class="sepost" label-width="140px">
               <input id="twoupload" type="file" @change="twofileUp">

              </el-form-item>
                <!--第二个小表格 -->
               <el-table :data="towlistdata" v-loading="listLoading" border fit highlight-current-row
              style="width: 100%;min-height:auto;margin-top:8px" :header-cell-style="{background:'oldlace'}">

                <el-table-column prop="fileName" align="center" label="文件名" min-width="323">

                 <template slot-scope="scope">
                 <span style="cursor:pointer;text-decoration:underline " @click="handlePreview(scope.row)">{{scope.row.fileName}}</span>
                 </template>
                 </el-table-column>
                 <el-table-column prop="node" align="center" label="上传节点" min-width="318">

                 <template slot-scope="scope">
                 <span>{{scope.row.node}}</span>
                 </template>
                 </el-table-column>

                <el-table-column align="center" label="操作" min-width="318"  class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-button title="下载" type="primary" @click="twodown(scope.row)" size="small" icon="el-icon-download"></el-button>
                  <el-button title="删除" type="danger" @click="twodelest(scope.row)" icon="el-icon-delete" size="small" :disabled="scope.row.deleteDisabled?true:false"></el-button>
                  </template>
                 </el-table-column>
                </el-table>
              </el-form>
            </el-tab-pane>

            <!-- 选项卡流转记录 -->
            <el-tab-pane label="流转记录" name="second">
               <!-- 流转记录表格 -->
             <el-table :data="circulation" v-loading="listLoading" border fit highlight-current-row
              style="width: 100%;min-height:auto;margin-top:8px" :header-cell-style="{background:'oldlace'}">

                <el-table-column  align="center" label="序号" min-width="48" type="index"></el-table-column>
                
               <el-table-column prop="taskName" align="center" label="步骤名" min-width="129">

                 <template slot-scope="scope">
                 <span>{{scope.row.taskName}}</span>
                 </template>
                </el-table-column>

                <el-table-column prop="userName" align="center" label="操作人" min-width="101">

                 <template slot-scope="scope">
                 <span>{{scope.row.userName}}</span>
                 </template>
                </el-table-column>

                <el-table-column prop="orgName" align="center" label="所在部门" min-width="101">

                 <template slot-scope="scope">
                 <span>{{scope.row.orgName}}</span>
                 </template>
                </el-table-column>

                <el-table-column prop="stationName" align="center" label="岗位" min-width="101">

                 <template slot-scope="scope">
                 <span>{{scope.row.stationName}}</span>
                 </template>
                </el-table-column>

                 <el-table-column prop="state" align="center" label="状态" min-width="101">

                 <template slot-scope="scope">
                 <span>{{scope.row.state}}</span>
                 </template>
                </el-table-column>

                 <el-table-column prop="opinion" align="center" label="意见" min-width="101">

                 <template slot-scope="scope">
                 <span>{{scope.row.opinion}}</span>
                 </template>
                </el-table-column>

                <el-table-column prop="dateTime" align="center" label="时间" min-width="151">
                 <template slot-scope="scope">
                 <span>{{scope.row.dateTime}}</span>
                 </template>
                </el-table-column>

                <el-table-column prop="remark" align="center" label="备注" min-width="126">
                 <template slot-scope="scope">
                 <span>{{scope.row.remark}}</span>
                 </template>
                </el-table-column>

              </el-table>
            </el-tab-pane>
             <el-tab-pane label="流程图" name="three">
              <div id="imgcontainer">
                  <img id="pic" :src="chartData" />
                </div>
             </el-tab-pane>

            </el-tabs>

            <el-form class="buttonlist">
             <el-form-item>
            <el-button @click="dialogFormVisible = false" type="primary" size="mini">返回</el-button>
            <el-button type="primary" @click="saveData" size="mini" v-show="consent">同意</el-button>
            <el-button type="primary" @click="updateSaveData" size="mini" v-show="retrnsty">退回</el-button>
            <el-button type="primary" @click="submData" size="mini" v-show="submitlist">提交</el-button>

            </el-form-item>
            </el-form>
          </el-dialog>
     
           <!-- 同意和退回弹窗   consent retrnsty submitlist-->

           <el-dialog  :title="textMap[dialogStatus]" :close-on-click-modal="false" top="8vh" width="700px" :visible.sync="postylitys">
            <el-form :rules="rules" ref="dataFormsty" :model="noeli" label-width="110px">
            <span style="color:red;position:absolute;top:90px;left:80px">*</span>
            <el-form-item label="意见" prop="opetion">
                <el-input type="textarea" style="width:510px" maxlength="128" :autosize="{ minRows: 2, maxRows: 4}" placeholder="" v-model="noeli.opetion">
                </el-input>
              </el-form-item>
              
              </el-form>
           
           <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="poslist1" v-show="affirmshow1">同意</el-button>
            <el-button type="primary" @click="poslist2" v-show="affirmshow2">退回</el-button>
            <el-button @click="postylitys = false" type="primary">返回</el-button>
            </div>
           
          </el-dialog>

        </el-container>

  </div>
</template>

<script>
import { fetchList, smallAblist, samllDelete, uploadlist, circuList, updateAuditing, updeletedata, insertFile, getCurrentUser, getNodeTask, newlYupdate } from '@/api/equipMent/newSeconduct'
import { flowsheet } from '@/api/equipMent/acceptanceSheet'
import waves from '@/directive/waves' // 水波纹指
import { choosePersonList, fetchChooseTree, transferList } from '@/api/common/common'
import { baseUrl } from '@/api/common/fileBaseUrl'
export default {
  name: 'newSeconduct',
  directives: {
    waves
  },
  data() {
    return {
      value13: [],
      smallslist: [], // 第一个小表格
      towlistdata: [], // 第二个小表格
      documentW: '',
      listyst: [],
      lookList: [],
      circulation: [], // 流转记录
      fliestyps: null, // 上传文件路径
      documenyt: '', // 单据编码赋值
      userId: '', // 用户id
      nodeName: '', // 节点的名字
      nodetaskId: '', // 接口参数
      consent: false, // 同意按钮显隐
      retrnsty: false, // 退回显隐
      submitlist: false, // 提交显隐
      chartData: '', // 流程图

      porisgid: '',
      grite: '',
      total: null,
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      activeName: 'first', // 选项卡默认选项
      // 编辑和新增的字段设置
      temp: {

      },
      noeli: {
        opetion: ''// 同意里的意见字段
      },
      // 弹框显示
      dialogFormVisible: false,
      postylitys: false,
      affirmshow1: false,
      affirmshow2: false,
      popTitle: '',
      dialogStatus: '',
      textMap: {
        update: '同意办理',
        create: '退回办理'
      },
      //  转办弹窗按钮
      innerVisible: false,
      dragLoading: false,
      treeLoading: false,
      // 组织树结构
      orgData: [],
      orgData1: [],
      defaultProps: {
        children: 'children',
        label: 'orgFullName'
      },
      listQuery1: {
        pageNum: 1,
        pageSize: 1000,
        perName: undefined,
        workNumber: undefined
      },
      orgListData: null,
      transt: '',

      isAdd: false, // 新增or编辑
      siteDetail: false, // 新增、编辑弹窗
      editLoading: false, // 提交按钮加载动画
      showStatus: true, // 表单项显示状态
      formSearch_send: false, // 查询条件点选
      listLoading: true, // 远程搜索加载动画
      fromLoading: true, // 弹出框加载动画

      dialogPvVisible: false,
      dialoglookVisible: false, // 弹窗属性
      siteCodeState: '', // 岗位编码禁用状态
      kstylsty: '', // 禁止按钮
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
  },
  methods: {

    // ******* 文件预览**********
   handlePreview(row){
     console.log(row)
           var url = baseUrl + "onlinePreview?url=" +  encodeURIComponent(row.filePath)
           var winHeight = window.document.documentElement.clientHeight-10;
          window.open(url, '_blank',"height=" + winHeight+ ",top=80,left=80,toolbar=no, menubar=no, scrollbars=yes, resizable=yes");
   },
// ******* 文件预览结束**********
    // 表格的接口
    getAA() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        if (response.data.code == 200) {
          this.listyst = response.data.data.list
          this.total = response.data.data.total
          //   this.listLoading = false
          setTimeout(() => {
            this.listLoading = false
          }, 1 * 1000)
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

    // 日期  搜索
    searchsty() {
      // 申请闲置时间  搜索
      if (this.value13 == null) {
        this.listQuery.acceptanceDateStart = ''
        this.listQuery.acceptanceDateEnd = ''
      } else {
        this.listQuery.acceptanceDateStart = this.value13[0]// 开始时间
        this.listQuery.acceptanceDateEnd = this.value13[1]
      }
    },
    //  ******转办按钮*******
    transfer(row) {
      console.log(row)
      this.transt = row.processInstanceId
      this.listQuery1 = {
        pageNum: 1,
        pageSize: 1000,
        perName: undefined,
        workNumber: undefined
      }
      this.innerVisible = true
      this.treeLoading = true
      // 查询组织树结构
      fetchChooseTree().then(response => {
        this.orgData = []
        this.orgData.push(response.data.data)
        setTimeout(() => {
          this.treeLoading = false
        }, 1 * 1000)
      })
    },
    // 组织树点击事件加载表格数据
    handleNodeClick1(data) {
      this.listLoading = true
      const params = {
        orgCode: data.orgCode,
        pageNum: 1,
        pageSize: 1000
      }
      choosePersonList(params).then(response => {
        this.orgListData = response.data.data.list
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 1000)
      })
    },
    //  搜索
    handlePerson() {
      this.listLoading = true
      choosePersonList(this.listQuery1).then(response => {
        this.orgListData = response.data.data.list
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 1000)
      })
    },
    // 关联人员提交
    hanhange(val) {
      const data = {
        processInstanceId: this.transt,
        workNumber: val.workNumber
      }
      transferList(data).then(response => {
        if (response.data.code == 200) {
          this.$notify({
            title: '成功',
            message: response.data.msg,
            type: 'success',
            duration: 2000
          })
          this.getAA()
        } else {
          this.$notify({
            title: '警告',
            message: response.data.msg,
            type: 'warning',
            duration: 2000
          })
          this.getAA()
        }
      })
      this.innerVisible = false
    },

    // ---- 转换的弹窗结束---------

    // 查看
    checkDetails(row) {
      this.dialogFormVisible = true
      this.porisgid = row.processInstanceId
      this.documenyt = row.documentWordCode // 单据编码的赋值
      this.nodetaskId = row.taskId// 接口参数
      this.temp = Object.assign({}, row)
      this.dialoglookVisible = true
      this.siteCodeState = true
      this.fromLoading = false// 弹窗加载动画
      this.activeName = 'first'// 选项卡默认选项
      this.temp.acceptanceSituation = row.acceptanceSituation.toString()
      // 判断taskName是否是调整申请显示的按钮不一样
      if (row.taskName == '调整申请') {
        this.consent = false// 同意按钮显隐
        this.retrnsty = false// 退回按钮显隐
        this.submitlist = true// 提交按钮显隐
        this.kstylsty = false
      } else {
        this.consent = true
        this.retrnsty = true
        this.submitlist = false
        this.kstylsty = true
      }
      this.getUser()
      this.circulationlist()
      this.getlistsamll()
      this.getlisttwo()
      this.getnodeNames()

      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 流转记录
    circulationlist() {
      const processInstanceId = this.porisgid
      circuList(processInstanceId).then(response => {
        this.circulation = response.data.data
      })
    },

    //  流程图
    fathClick(tab, event) {
      if (tab.label == '流程图') {
        if (this.porisgid == null) {
          this.$notify({
					  title: '提示',
				  	message: '流程还未开始，没有流程图',
				  	type: 'warning',
				    duration: 3000
          })
          this.chartData = ''
          return
        } else {
          this.fromLoading = true// 弹窗加载动画
          flowsheet(this.porisgid).then(response => {
            console.log(response)
            if (response.data.code !== 803 && response.data.code !== 808) {
              this.chartData = response.request.responseURL
              document.getElementById('pic').src = this.chartData
            } else {
              this.$notify({
					  title: '警告',
				  	message: response.data.msg,
				  	type: 'warning',
				    duration: 2000
              })
              this.chartData = ''
            }
            setTimeout(() => {
              this.fromLoading = false
            }, 1 * 500)
          })
        }
      }
    },

    //    同意按钮
    saveData() {
      this.noeli.opetion = ''
      if (this.smallslist == '') {
        this.$notify({
          title: '提示',
          message: '请上传新设备验收单附件',
          type: 'error',
          duration: 2000
        })
        // this.fromLoading = false//弹窗加载动画
        return
      } else {
        this.dialogStatus = 'update'
        this.postylitys = true
        this.affirmshow1 = true
        this.affirmshow2 = false
        console.log(this.temp)
        this.$nextTick(() => {
          this.$refs['dataFormsty'].clearValidate()
        })
      }
    },
    // 确认
    poslist1() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.noeli.opetion == '') {
            this.$notify({
              title: '警告',
              message: '请填写意见',
              type: 'warning',
              duration: 3000
            })
            return
          }
          const noeliData = Object.assign({}, this.noeli)
          console.log(noeliData)
          noeliData.id = this.temp.id
          noeliData.auditingType = 3
          noeliData.taskId = this.temp.taskId
          updateAuditing(noeliData).then(response => {
            if (response.data.code == 200) {
              this.postylitys = false
              this.getAA()

              this.dialogFormVisible = false
              this.$message({
                title: '成功',
                message: '同意成功',
                type: 'success',
                duration: 2000
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

    //   退回按钮
    updateSaveData() {
      this.noeli.opetion = ''
      if (this.smallslist == '') {
        this.$notify({
          title: '提示',
          message: '请上传新设备验收单附件',
          type: 'error',
          duration: 2000
        })
        // this.fromLoading = false//弹窗加载动画
        return
      } else {
        this.dialogStatus = 'create'
        this.postylitys = true
        this.affirmshow1 = false
        this.affirmshow2 = true
        this.$nextTick(() => {
          this.$refs['dataFormsty'].clearValidate()
        })
      }
    },
    // 确认
    poslist2() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.noeli.opetion == '') {
            this.$notify({
              title: '警告',
              message: '请填写意见',
              type: 'warning',
              duration: 3000
            })
            return
          }
          const noeliData = Object.assign({}, this.noeli)
          console.log(noeliData)
          noeliData.id = this.temp.id
          noeliData.auditingType = 4
          noeliData.taskId = this.temp.taskId
          updateAuditing(noeliData).then(response => {
            if (response.data.code == 200) {
              this.postylitys = false
              this.getAA()

              this.dialogFormVisible = false
              this.$message({
                title: '成功',
                message: '退回成功',
                type: 'success',
                duration: 2000
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
    // 第一个下载
    downloadsty(row) {
      const att = row.fileName
      window.location.href = row.filePath + '?attname=' + att

      this.$message({
        title: '成功',
        message: '下载成功',
        type: 'success',
        duration: 2000
      })
    },
    // 第二个下载
    twodown(row) {
      const att = row.fileName
      window.location.href = row.filePath + '?attname=' + att
      this.$message({
        title: '成功',
        message: '下载成功',
        type: 'success',
        duration: 2000
      })
    },
    // 获取当前用户信息
    getUser() {
      getCurrentUser().then(response => {
        this.userId = response.data.data.id
      })
    },

    // 第一个小表格接口  getlistsamll()   getlisttwo()
    getlistsamll() {
      const samllblist = {
        moduleType: 7,
        attachmentCode: 'XSBYSDFJ',
        documentWordCode: this.documenyt
      }
      smallAblist(samllblist).then(response => {
        this.smallslist = response.data.data
        for (var i = 0; i < this.smallslist.length; i++) {
          if (this.smallslist[i].userId == this.userId) {
            this.smallslist[i].deleteDisabled = false
          } else {
            this.smallslist[i].deleteDisabled = true
          }
        }
      })
    },
    // 第二个小表格数据 towlistdata
    getlisttwo() {
      const samblist = {
        moduleType: 7,
        attachmentCode: 'SBJXJLFJ',
        documentWordCode: this.documenyt
      }
      smallAblist(samblist).then(response => {
        this.towlistdata = response.data.data
        for (var i = 0; i < this.towlistdata.length; i++) {
          if (this.towlistdata[i].userId == this.userId) {
            this.towlistdata[i].deleteDisabled = false
          } else {
            this.towlistdata[i].deleteDisabled = true
          }
        }
      })
    },

    // 获取node节点名字 this.nodetaskId
    getnodeNames() {
      getNodeTask(this.nodetaskId).then(reap => {
        if (reap.data.code == 200) {
          this.nodeName = reap.data.data.name
        } else {
          this.$notify({
            title: '警告',
            message: reap.data.msg,
            type: 'warning',
            duration: 2000
          })
        }
      })
    },
    //  退回的时候就要能编辑而且按钮变为提交按钮
    submData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          console.log(123456)
          console.log(this.temp)
          const tempData = {
            acceptanceSituation: this.temp.acceptanceSituation,
            id: this.temp.id,
            taskId: this.temp.taskId,
            acceptanceFinishTime: this.temp.acceptanceFinishTime,
            payTime: this.temp.payTime
          }
          if (this.smallslist == '') {
            this.$notify({
              title: '提示',
              message: '请上传新设备验收单附件',
              type: 'warning',
              duration: 3000
            })
            this.fromLoading = false // 加载动画
            return
          } else {
            console.log(tempData)
            newlYupdate(tempData).then(response => {
              const msg = response.data.msg
              if (response.data.code == 200) {
                for (const v of this.listyst) {
                  console.log(this.listyst)
                  if (v.id === this.temp.id) {
                    const index = this.listyst.indexOf(v)
                    this.listyst.splice(index, 1, this.temp)
                    this.getAA()
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
              } else {
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

    // 上传的按钮
    noticeUpload(e) {
      console.log(1234)
      const file = e.target.files[0]
      console.log(file)
      const fileData1 = {
        attachmentCode: 'XSBYSDFJ',
        moduleType: '7',
        fileName: undefined,
        filePath: undefined, // 文件URL
        node: this.nodeName,
        userId: this.userId,
        code: this.documenyt

      }
      if (file != null) {
        this.fromLoading = true
        const param = new FormData() // 创建form对象
        param.append('file', file, file.name) // 通过append向form对象添加数据
        this.filenamesty = file.name
        fileData1.fileName = file.name
        console.log(file.name)
        uploadlist(param).then(resp => { // 调用上传接口
          if (resp.data.code == 200) {
            fileData1.filePath = resp.data.data.remoteFilename // 文件地址
            insertFile(fileData1).then(response => {
              if (response.data.code == 200) {
                this.$message({
                  title: '成功',
                  message: '上传成功',
                  type: 'success',
                  duration: 2000
                })
                this.getlistsamll() // 获取文件
                const test = document.getElementById('uploadImg')
                test.value = ''
              } else {
                this.$notify({
                  title: '警告',
                  message: response.data.msg,
                  type: 'warning',
                  duration: 2000

                })
              }
            })
            setTimeout(() => {
              this.fromLoading = false
            }, 1 * 500)
          } else if (resp.data.code == 402) {
            this.$notify({
              title: '警告',
              message: resp.data.msg,
              type: 'warning',
              duration: 3000
            })
            this.fromLoading = false
            const test = document.getElementById('uploadImg')
            test.value = ''
          } else {
            this.$notify({
              title: '警告',
              message: '上传失败',
              type: 'warning',
              duration: 3000
            })
            this.fromLoading = false
            const test = document.getElementById('uploadImg')
            test.value = ''
          }
        })
      }
    },
    //  第二个上传按钮
    twofileUp(e) {
      console.log(1234)
      const file = e.target.files[0]
      console.log(file)
      const fileData2 = {
        attachmentCode: 'SBJXJLFJ',
        moduleType: '7',
        fileName: undefined,
        filePath: undefined, // 文件URL
        node: this.nodeName,
        userId: this.userId,
        code: this.documenyt

      }
      if (file != null) {
        this.fromLoading = true
        const param = new FormData() // 创建form对象
        param.append('file', file, file.name) // 通过append向form对象添加数据
        this.filenamesty = file.name
        fileData2.fileName = file.name
        console.log(file.name)
        uploadlist(param).then(resp => { // 调用上传接口
          if (resp.data.code == 200) {
            fileData2.filePath = resp.data.data.remoteFilename // 文件地址
            insertFile(fileData2).then(response => {
              if (response.data.code == 200) {
                this.$message({
                  title: '成功',
                  message: '上传成功',
                  type: 'success',
                  duration: 2000
                })
                this.getlisttwo() // 获取文件
                const test = document.getElementById('twoupload')
                test.value = ''
              } else {
                this.$notify({
                  title: '警告',
                  message: response.data.msg,
                  type: 'warning',
                  duration: 2000

                })
              }
            })
            setTimeout(() => {
              this.fromLoading = false
            }, 1 * 500)
          } else if (resp.data.code == 402) {
            this.$notify({
              title: '警告',
              message: resp.data.msg,
              type: 'warning',
              duration: 3000
            })
            this.fromLoading = false
          } else {
            this.$notify({
              title: '警告',
              message: '上传失败',
              type: 'warning',
              duration: 3000
            })
            this.fromLoading = false
          }
        })
      }
    },
    //  第一个删除
    updatadelest(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        const idst = row.id
        console.log(idst)
        updeletedata(idst).then(response => {
          // this.smalldatast()
          const index = this.smallslist.indexOf(row)
          this.smallslist.splice(index, 1)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    //  第二个表格删除按钮
    twodelest(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        const idst = row.id
        console.log(idst)
        updeletedata(idst).then(response => {
          // this.smalldatast()
          const index = this.towlistdata.indexOf(row)
          this.towlistdata.splice(index, 1)
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
.buttonlist{
    position:absolute;
    right:20px;
    top:80px;
    }
.equip-title{
    margin-left: -100px;
    text-align: center;
    display: block;
    font-size: 20px;
    font-weight: 600;
} 

</style>
