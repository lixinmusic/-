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
                <el-form-item label="固定资产编号" >
                <el-input class="minier-input" v-model="listQuery.fixedAssetCode" placeholder="请输入固定资产编号" clearable></el-input>
                </el-form-item>

                <el-form-item label="质保验收完成日期" >
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
                <el-form-item label="验收情况" prop="acceptanceStatus"> 
                <el-radio v-model="listQuery.acceptanceStatus" label="1">验收通过</el-radio>
                <el-radio v-model="listQuery.acceptanceStatus" label="0">验收不通过</el-radio>
                </el-form-item>
                <el-form-item label="审核状态">
                    <el-select v-model="listQuery.auditingType" style="width:190px" clearable  placeholder="请选择">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                    </el-select>
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


               <el-table-column prop="documentWordCode" align="center" label="单据编码"  min-width="100">
               <template slot-scope="scope">
                 <span class="link-type futiop" @click='checkDetails(scope.row)'>{{scope.row.documentWordCode}}</span>
               </template>
                 </el-table-column>
                <el-table-column prop="useCompanyName" align="center" label="使用公司" min-width="80">
                 </el-table-column>
              <el-table-column prop="useFactoryName" align="center" label="使用工厂" min-width="80">
                 </el-table-column>
               <el-table-column prop="useWorkshopName" align="center" label="使用车间" min-width="80">
                </el-table-column>
                 <el-table-column prop="equipmentName" align="center" label="设备名称" min-width="80">
                 </el-table-column>
               <el-table-column prop="typeSpecification" align="center" label="型号规格" min-width="80">
                 </el-table-column>
               <el-table-column prop="fixedAssetCode" align="center" label="固定资产编号" min-width="80">
                 </el-table-column>
               <el-table-column prop="reformSupplier" align="center" label="改造供应商" min-width="80">
                 </el-table-column>
               <el-table-column prop="warrantyAcceptanceTime" align="center" label="质保验收日期" min-width="80">
                  <template slot-scope="scope">
                  {{scope.row.warrantyAcceptanceTime!==null?scope.row.warrantyAcceptanceTime.substring(0,10):''}}
                  </template> 
                 </el-table-column>
               <el-table-column prop="acceptanceSituationName" align="center" label="验收情况" min-width="80">
                 </el-table-column>
               <el-table-column prop="auditingTypeName" align="center" label="审核状态" min-width="80">
                 </el-table-column>
              <el-table-column align="center" label="操作" min-width="150" fixed="right" class-name="small-padding fixed-width">   <!-- v-if="edit"  v-if="afreshst" v-if="speechst" -->
                <template slot-scope="scope">
                  <el-button title="编辑" type="primary" :disabled="scope.row.stateshow?true:false" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-if="edit" ></el-button>
                  <el-button title="转办" type="success" :disabled="scope.row.stshow?true:false" size="mini" icon="el-icon-share" @click="transfer(scope.row)"></el-button>
                  <!-- <el-button title="删除" type="danger" :disabled="scope.row.deleshow?true:false" icon="el-icon-delete" size="mini"  @click="deleteBtn(scope.row)" v-if="cutout"></el-button> -->

                 <!--  <el-button title="重新验收" type="warning" :disabled="scope.row.newshow?true:false" icon="el-icon-refresh" size="mini"  @click="newlyBtn(scope.row)" v-if="afreshst" ></el-button>
                  <el-button title="生成设备质保验收单" type="primary" :disabled="scope.row.produceshow?true:false" icon="el-icon-document" size="mini" @click="newlproDuce(scope.row)" v-if="speechst" ></el-button> -->
                </template>
              </el-table-column>
            </el-table>
          </el-main>
          <!-- 底栏容器 afreshst speechst -->

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
          <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" v-dialogDrag top="8vh" width="1000px" :visible.sync="dialogFormVisible" >
             <!-- 选项卡 -->
            <el-tabs v-model="activeName" v-loading="fromLoading" @tab-click="fathClick">
             <el-tab-pane label="表单信息" name="first">
              <el-form :rules="rules" ref="dataForm" :model="temp" label-width="110px">
              <el-form-item>
                <span class="equip-title">设备改造质保验收单</span>
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
              <el-form-item label="改造供应商" prop="reformSupplier"> 
              <el-input v-model="temp.reformSupplier" :disabled='siteCodeState?true:false' style="width:290px" class="enter medium-input" placeholder="请输入出厂编号" ></el-input>   
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="固定资产编号" prop="fixedAssetCode" style="margin-left:200px;"> 
              <el-input v-model="temp.fixedAssetCode" :disabled='siteCodeState?true:false' style="width:290px" class="enter medium-input" placeholder="请输入固定资产编号" ></el-input>   
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-form-item label="改造内容" prop="reformContent" label-width="120px">
               <el-input type="textarea" v-model="temp.reformContent" :disabled='siteCodeState?true:false' style="width:798px" maxlength="128" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入改造内容">
               </el-input>
              </el-form-item>
              </el-row>

               <el-row>
              <el-col :span="10">     
              <el-form-item label="质保验收完成日期" prop="warrantyAcceptanceTime" label-width="150px">
               <div class="block">
                <el-date-picker
                  style="width:250px"
                  v-model="temp.warrantyAcceptanceTime"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  
                   :disabled='!filshow'>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              <el-col :span="14">
              <el-form-item label="验收情况" prop="acceptanceSituation" style="margin-left:95px"> 
                <el-radio v-model="temp.acceptanceSituation" label="1" :disabled='!filshow'>验收通过</el-radio>
                <el-radio v-model="temp.acceptanceSituation" label="0" :disabled='!filshow'>验收不通过</el-radio>

                </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="18">
              <span style="color:red;position:absolute;bottom:30px;left:0px">*</span>
              <el-form-item label="设备质保验收单附件" class="sepost" label-width="140px" style="margin-left:5px">
               
              <!-- <input class="uploadInput" id="uploadImg" ref="uploadImg" type="file" accept="image/gif,image/jpg,image/png,/image/gif,image/jpeg" @change="noticeUpload"> -->
              <input id="uploadImg" type="file" @change="fileUpload" v-show="filshow">
              </el-form-item>
              </el-col>
               </el-row> 
              <!--第一个小表格 -->
               <el-table :data="smallslist" border fit highlight-current-row

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
                  <el-button title="删除" type="danger" @click="smalldelest(scope.row)" icon="el-icon-delete" size="small" v-show="newapps"></el-button>
                   <el-button title="删除" type="danger" @click="updatadelest(scope.row)" icon="el-icon-delete" size="small" v-show="updelests"></el-button>
               
                  </template>
                 </el-table-column> 
                </el-table>
             
              
              
              <el-form-item label="设备检录记录单附件" class="sepost" label-width="140px">
               
              <input id="twoupload" type="file" @change="twofileUp" v-show="filshow">
              </el-form-item>
                <!--第二个小表格 -->
               <el-table :data="towlistdata" border fit highlight-current-row

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
                  <el-button title="下载" type="primary" @click="downty(scope.row)" size="small" icon="el-icon-download"></el-button>
                  <el-button title="删除" type="danger" @click="twosmalldelest(scope.row)" icon="el-icon-delete" size="small"  v-show="newdatale"></el-button>
                    <el-button title="删除" type="danger" @click="twoupdatadelest(scope.row)" icon="el-icon-delete" size="small" v-show="updelestdaat"></el-button>
                   
                  </template>
                 </el-table-column>
                </el-table>




              </el-form>
            </el-tab-pane>
            <el-tab-pane label="流转记录" name="second" v-if="roamshow">
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
             <el-tab-pane label="流程图" name="three" v-if="roamshow">
              <div id="imgcontainer">
                  <img id="pic" :src="chartData" />
                </div>
             </el-tab-pane>
            </el-tabs>

            <el-form class="buttonlist">
             <el-form-item>
            <el-button @click="dialogFormVisible = false" type="primary" size="mini">返回</el-button>
            <el-button type="primary" @click="updateSaveData" v-show="hold2" size="mini">保存</el-button>
            <el-button type="primary" @click="updateData" v-show="referring2" size="mini">提交</el-button>
            </el-form-item>
            </el-form>

           <!-- 提交时要加的判断弹窗 -->
          <!--   <el-dialog width="40%" title="选择发起组织" :visible.sync="changeOrgVisible" append-to-body :close-on-click-modal="false" v-dialogDrag >
           <el-container>
            <el-aside style="width:100%">
            <span style="font-weight:800">当前登录用户所在组织：{{comName}}</span>
            <el-form>
              <el-form-item>
              <el-select v-model="temp.proxyOrgName" clearable  placeholder="请选择组织" @change='proxyOrgChange' style="width:100%">
                <el-option
                  v-for="item in proxyOrgList"
                  :key="item.orgCode"
                  :label="item.orgName"
                  :value="item.orgName">
                </el-option>
              </el-select>
              </el-form-item>
            </el-form>
            </el-aside>
          </el-container>
          <div slot="footer" class="dialog-footer">
            <el-button @click="changeOrgVisible = false" type="default">取消</el-button>
            <el-button type="primary" @click="changeOrgOk">确定</el-button>
          </div>
        </el-dialog> -->

          </el-dialog>
           <!-- 生成设备质保验收单 -->
      <el-dialog title="提示" :close-on-click-modal="false" :visible.sync="centerDialogVisible" width="30%">
        <span>已生成设备质保验收单，请到设备质保验收单页面处理</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="centerDialogVisible=false">确定</el-button>
        </span>
      </el-dialog>
      
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
                        <a class="text-detail" style="text-decoration:underline">{{scope.row.workNumber}}</a>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
          </el-container>
           <div slot="footer" class="dialog-footer">
            <!-- @click="handleClickCompany" -->
          <!--  <el-button type="primary">确定</el-button> -->
          </div>
          </el-dialog>
 
     

    </el-container>
  </div>
</template>

<script>
import { fetchListdsy, updateArticle, fetchPv, evaluate, producePv, circuList, uploadlist, smallAblist, createArticlest, deleteapp, updeletedata, insertFile, getCurrentUser, fixedascode,transferReplace } from '@/api/equipRemould/remakevWarranty'
import waves from '@/directive/waves' // 水波纹指令
import { flowsheet } from '@/api/equipMent/acceptanceSheet'
import { fetchButton } from '@/api/common/button'
import { getProxyOrgList,choosePersonList, fetchChooseTree} from '@/api/common/common'// 代理组织
import { menuList } from '@/store/modules/permission'// 按钮权限
import { baseUrl } from '@/api/common/fileBaseUrl'


 
export default {
  name: 'remakevWarranty',
  directives: {
    waves
  },

  data() {
    return {
      bespurl:global.serverSrc,
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
      
      // 代理组织
      userCode: undefined, // 用户编码
      proxyOrgCode: undefined, // 代理组织
      proxyOrgName: undefined,
      proxyOrgList: [],
      comName: undefined,
      comCode: undefined,
      changeOrgVisible: false, // 提交时要加的判断弹窗

      // 审核状态下拉框
      options: [
        { value: '1', label: '未提交' },
        { value: '2', label: '审核中' },
        { value: '3', label: '审核通过' },
        { value: '4', label: '审核不通过' }
        // { value: '5', label: '流程关闭' }
      ],
      value13: [],
      listyst: [],
      lookList: [],
      circulation: [], // 流转记录
      porisgid: '', // 流转记录接口传参
      cheid: '',
      grite: '',
      total: null,
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      // 编辑的字段设置
      temp: {

      },
      smallslist: [], // 第一个小表格1
      towlistdata: [], // 第二个小表格
      newapps: false, // 一号小表格删除按钮
      updelests: false, // 一号小表格删除按钮
      newdatale: false, // 二号小表格删除按钮
      updelestdaat: false, // 二号小表格删除按钮
      // 附件列表
      list: [{
        attachmentCode: 'XSBYSDFJ',
        // code: undefined,
        fileName: undefined,
        filePath: undefined,
        moduleType: '7',
        node: '开始'
        // userId: undefined
      }],
      // 文件数据
      fileData: [],
      fileName: undefined,
      fileNameSC: undefined, // 文件名称
      fileUrl: undefined, // 文件URL
      documenyt: '', // 单据编码的赋值
      userId: undefined, // 用户id

      // 按钮权限
      menuCode: '',
      edit: false, // 编
      cutout: false, // 删
      afreshst: false, // 重新验收
      speechst: false, // 生成设备质量验收报告
      filshow: true, // 文件上传框显示隐藏
      centerDialogVisible: false,

      activeName: 'first', // 选项卡默认选项
      roamshow: false, // 流转记录隐藏
      chartData: '', // 流程图
      // 弹框显示
      dialogFormVisible: false,
      popTitle: '',
      dialogStatus: '',
      textMap: {
        update: '编辑',
        detail: '查看',
        newly: '重新验收'
      },
      newId: '', // 重新验收id赋值
      useCompany: '', // 使用公司
      useFactory: '', // 使用工厂
      useWorkshop: '', // 使用车间

      // 固定资产编号
      fixecodelist: {
        pageNum: 1,
        pageSize: 10
      },
      totalstcode: null,
      fixelistcode: [],
      dialogcodeVisible: false, // 弹窗属性()

      referring1: false,
      referring2: false,
      hold1: false,
      hold2: false,
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
      // 弹框内输入框不填显示的提示信息 useWorkshopName  useCompanyName useFactoryName

      rules: {
       /*  useCompany: [{ required: true, message: '请输入', trigger: 'change' }],
        useFactory: [{ required: true, message: '请输入', trigger: 'change' }],
        useWorkshop: [{ required: true, message: '请输入', trigger: 'change' }],
        equipmentName: [{ required: true, message: '请输入', trigger: 'change' }],
        typeSpecification: [{ required: true, message: '请输入', trigger: 'change' }],
        outFactoryCode: [{ required: true, message: '请输入', trigger: 'change' }],
        fixedAssetCode: [{ required: true, message: '请输入', trigger: 'change' }],
        supplier: [{ required: true, message: '请输入', trigger: 'change' }],
        payTime: [{ required: true, message: '请选择', trigger: 'change' }], */
        warrantyAcceptanceTime: [{ required: true, message: '请选择', trigger: 'change' }],
        acceptanceSituation: [{ required: true, message: '请选择', trigger: 'change' }]
        
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
    getbttonst() {
      menuList.forEach(item => {
        item.children.forEach(e => {
          if (e.name == 'remakevWarranty') {
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
        if (response.data.code == 200) {
          const authority = response.data.data
          for (var i = 0; i < authority.length; i++) {
            if (authority[i].buttonName == '重新验收') {
              this.afreshst = true
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
      fetchListdsy(this.listQuery).then(response => {
        if (response.data.code == 200) {
          this.listyst = response.data.data.list
          console.log(this.listyst)
          for (var i = 0; i < this.listyst.length; i++) {
            if (this.listyst[i].acceptanceSituation == 1) {
              this.listyst[i].acceptanceSituationName = '验收通过'
            } else if (this.listyst[i].acceptanceSituation == 0) {
              this.listyst[i].acceptanceSituationName = '验收不通过'
            }
            console.log(this.listyst[i].auditingType)
		 if (this.listyst[i].auditingType == 2) {
              this.listyst[i].auditingTypeName = '审核中'
              this.listyst[i].stateshow = true
              this.listyst[i].deleshow = true
              this.listyst[i].stshow = true
              console.log(111)
            } else if (this.listyst[i].auditingType == 1) {
              this.listyst[i].auditingTypeName = '未提交'
              this.listyst[i].stateshow = false
              this.listyst[i].deleshow = false
              this.listyst[i].stshow = false
		   } else if (this.listyst[i].auditingType == 3) {
              this.listyst[i].auditingTypeName = '审核通过'
              this.listyst[i].stateshow = true
              this.listyst[i].deleshow = true
              this.listyst[i].stshow = true
		   } else if (this.listyst[i].auditingType == 4) {
              this.listyst[i].auditingTypeName = '审核不通过'
              this.listyst[i].stateshow = true
              this.listyst[i].deleshow = true
              this.listyst[i].stshow = true
            }else if(this.listyst[i].auditingType == 5){
              this.listyst[i].auditingTypeName = '流程关闭'
              this.listyst[i].stateshow = true
              this.listyst[i].deleshow = true
              this.listyst[i].stshow = true
            }

            if (this.listyst[i].acceptanceSituation !== 0 || this.listyst[i].auditingType !== 3) {
              this.listyst[i].newshow = true
              if (this.listyst[i].isCreateWarranty == 0 && this.listyst[i].acceptanceSituation == 1 && this.listyst[i].auditingType == 3) {
                this.listyst[i].produceshow = false
              } else if (this.listyst[i].isCreateWarranty == 1) {
                this.listyst[i].produceshow = true
              }
            }
            if (this.listyst[i].acceptanceSituation !== 1 || this.listyst[i].auditingType !== 3) {
              this.listyst[i].produceshow = true
              if (this.listyst[i].isReAcceptance == 0 && this.listyst[i].acceptanceSituation == 0 && this.listyst[i].auditingType == 3) {
                this.listyst[i].newshow = false
              } else if (this.listyst[i].isReAcceptance == 1) {
                this.listyst[i].newshow = true
              }
            }
          }

          this.total = response.data.data.total
          setTimeout(() => {
            this.listLoading = false
          }, 1 * 500)
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
   
   

   
  // ******* 文件预览**********
   handlePreview(row){
     console.log(row)
          let url = baseUrl + "onlinePreview?url=" +  encodeURIComponent(row.filePath)
          var winHeight = window.document.documentElement.clientHeight-10;
          window.open(url, '_blank',"height=" + winHeight
                                + ",top=80,left=80,toolbar=no, menubar=no, scrollbars=yes, resizable=yes");
   },
  // ******转办按钮*******
    transfer(row) {
      console.log(row)
      this.transt = row.id
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
        type: 3,
        workNumber: val.workNumber,
        ids:this.transt
      }
      transferReplace(data).then(response => {
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
    // ---- 转办的弹窗结束---------


    // 日期  搜索
    searchsty() {
      // 申请闲置时间  搜索
      if (this.value13 == null) {
        this.listQuery.startTime = ''
        this.listQuery.endTime = ''
      } else {
        this.listQuery.startTime = this.value13[0]// 开始时间
        this.listQuery.endTime = this.value13[1]
      }
    },
    // 删除事件

    /* deleteBtn(row) {

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
    }, */

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
    // 查看
    checkDetails(row) {
      this.temp = Object.assign({}, row)
      this.porisgid = row.processInstanceId
      this.dialogStatus = 'detail'
      this.dialogFormVisible = true
      this.siteCodeState = true
      this.hold1 = false
      this.referring1 = false
      this.referring2 = false
      this.hold2 = false
      this.fromLoading = false// 弹窗加载动画
      this.filshow = false// 文件上传框显隐
      this.activeName = 'first'// 选项卡默认选项

      this.roamshow = true// 流转记录显示
      this.newapps = false// 一号小表格重新验收删除按钮
      this.updelests = false// 一号小表格编辑删除按钮
      this.newdatale = false // 二号小表格删除按钮
      this.updelestdaat = false// 二号小表格删除按钮
      if (row.acceptanceSituation !== null) {
        this.temp.acceptanceSituation = row.acceptanceSituation.toString()
      }
      this.circulationlist()
      // 第一个小表格接口
      const samllblist = {
        moduleType: 22,
        attachmentCode: 'SBGZZBYSDFJ',
        documentWordCode: row.documentWordCode
      }
      smallAblist(samllblist).then(response => {
        this.smallslist = response.data.data
      })
      // 第二个小表格数据 towlistdata
      const samblist = {
        moduleType: 22,
        attachmentCode: 'SBJXJLDFJ',
        documentWordCode: row.documentWordCode
      }
      smallAblist(samblist).then(response => {
        this.towlistdata = response.data.data
      })
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 流转记录
    circulationlist() {
      const processInstanceId = this.porisgid
      if (processInstanceId == '') {
        return
      } else {
        circuList(processInstanceId).then(response => {
          this.circulation = response.data.data
        })
      }
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
            // document.getElementById('pic').src = this.chartData;
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

    // 新增的小表格删除（第一个）
    smalldelest(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        const ids = this.fileName
        console.log(ids)
        deleteapp(ids).then(response => {
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

    // 新增的小表格删除（第二个）
    twosmalldelest(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        const ids = this.fileName
        console.log(ids)
        deleteapp(ids).then(response => {
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
    // 编辑里小表格的删除 (第一个)
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

    // 编辑里小表格的删除 （第二个）
    twoupdatadelest(row) {
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
    //  第一个下载的按钮
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
    //  第二个下载按钮
    downty(row) {
      const att = row.fileName
      window.location.href = row.filePath + '?attname=' + att
      this.$message({
        title: '成功',
        message: '下载成功',
        type: 'success',
        duration: 2000
      })
    },

    // 编辑点击打开弹窗事件
    handleUpdate(row) {
      const id = row.id
      this.siteCodeState = true
      this.dialogStatus = 'update'
      this.hold2 = true
      this.referring2 = true
      this.hold1 = false
      this.referring1 = false
      this.roamshow = false// 流转记录隐藏
      this.fromLoading = false// 弹窗加载动画
      this.filshow = true// 文件上传框显隐
      this.activeName = 'first'// 选项卡默认选项

      evaluate(id).then(response => {
        this.popTitle = response.data.data
        this.temp = Object.assign({}, this.popTitle)
        console.log(this.popTitle)
        this.documenyt = this.popTitle.documentWordCode// 单号编码
        console.log(this.documenyt)
        if (this.popTitle.acceptanceSituation !== null) {
          this.temp.acceptanceSituation = this.popTitle.acceptanceSituation.toString()
        }
        this.getlistsamll() // 第一个小表格list数据
        this.getlisttwo()// 第二个小表格list数据
      })
      this.dialogFormVisible = true
      this.newapps = false// 一号小表格重新验收删除按钮
      this.updelests = true// 一号小表格编辑删除按钮
      this.newdatale = false // 二号小表格删除按钮
      this.updelestdaat = true// 二号小表格删除按钮

      this.getUser()
      // 获取当前用户信息
      /*   getCurrentUser().then(response => {
        this.userId = response.data.data.id
      }) */
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 编辑里的保存
    updateSaveData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          console.log(tempData)
          tempData.auditingType = 1
          this.fromLoading = true// 弹窗加载动画
          if (this.smallslist == '') {
            this.$notify({
              title: '警告',
              message: '请上传设备质保验收单附件',
              type: 'warning',
              duration: 2000
            })
            this.fromLoading = false// 弹窗加载动画
            return
          } else {
            console.log(tempData)
            updateArticle(tempData).then(response => {
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
              setTimeout(() => {
                this.fromLoading = false
              }, 1 * 500)
            })
          }
        }
      })
    },
  /*******  代理开始 ********/
    getUser() {
      // 获取当前用户信息
      getCurrentUser().then(response => {
        if (response.data.code == 200) {
          this.userId = response.data.data.id
          this.userCode = response.data.data.userCode
          getProxyOrgList(this.userCode).then(response => {
            if (response.data.code == 200) {
              this.proxyOrgList = []
              this.comName = response.data.data.orgName
              this.comCode = response.data.data.orgCode
              if (this.proxyOrgList != null) {
                this.proxyOrgList = response.data.data.list
              }
            }
          })
        }
      })
    },
    proxyOrgChange() {
      this.proxyOrgList.forEach(item => {
        if (item.orgName == this.temp.proxyOrgName) {
          this.temp.proxyOrgCode = item.orgCode
        }
      })
    },

    changeOrgOk() {
      if (this.temp.proxyOrgName == undefined || this.temp.proxyOrgName == '' || this.temp.proxyOrgName == null) {
        this.temp.proxyOrgCode = this.comCode
        this.updataSubmit()
      } else {
        this.updataSubmit()
      }
      this.changeOrgVisible = false
    },
   /*******  代理结束********/

   
    // 编辑提交提交
  updateData() {
    this.$refs['dataForm'].validate(valid => {
      if (valid) { 
      this.fromLoading = true
         if (this.smallslist.length == 0) {
            this.$notify({
              title: '警告',
              message: '请上传设备质保验收单附件',
              type: 'warning',
              duration: 2000
            })
            return
          }
      const tempData = Object.assign({}, this.temp)
      console.log(tempData)
      tempData.auditingType = 2
      updateArticle(tempData).then(response => {
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
          this.fromLoading = false
        } else {
          this.$notify({
            title: '错误',
            message: msg,
            type: 'warning',
            duration: 2000
          })
        }
        setTimeout(() => {
          this.fromLoading = false
        }, 1 * 500)
       })
     }
  })
},
    // 第一个小表格接口 getlistsamll()    getlisttwo()
    getlistsamll() {
      const samllblist = {
        moduleType: 22,
        attachmentCode: 'SBGZZBYSDFJ',
        documentWordCode: this.documenyt
      }
      smallAblist(samllblist).then(response => {
        this.smallslist = response.data.data
      })
    },
    // 第二个小表格数据 towlistdata
    getlisttwo() {
      const samblist = {
        moduleType: 22,
        attachmentCode: 'SBJXJLDFJ',
        documentWordCode: this.documenyt
      }
      smallAblist(samblist).then(response => {
        this.towlistdata = response.data.data
      })
    },

    // 第一个文件上传
    fileUpload(e) {
      console.log(1234)
      const file = e.target.files[0]
      console.log(file)
      const fileData1 = {
        attachmentCode: 'SBGZZBYSDFJ',
        moduleType: '22',
        fileName: undefined,
        filePath: undefined, // 文件URL
        fileNameSC: undefined,
        fileUrl: undefined,
        node: '开始',
        userId: this.userId,
        code: this.documenyt// 单据编码

      }
      if (file != null) {
        this.fromLoading = true
        const param = new FormData() // 创建form对象
        param.append('file', file, file.name) // 通过append向form对象添加数据
        this.fileName = file.name
        fileData1.fileName = file.name
        console.log(file.name)
        uploadlist(param).then(resp => { // 调用上传接口
          if (resp.data.code == 200) {
            fileData1.filePath = resp.data.data.remoteFilename // 文件地址
            fileData1.fileNameSC = resp.data.data.remoteFilename
            fileData1.fileUrl = resp.data.data.fileUrl
            if (this.dialogStatus == 'update') {
              insertFile(fileData1).then(response => {
                if (response.data.code == 200) {
                  this.$message({
                    title: '成功',
                    message: '上传成功',
                    type: 'success',
                    duration: 2000
                  })
                  this.getlistsamll()
                  const test = document.getElementById('uploadImg')
                  test.value = ''
                }
              })
            } else if (this.dialogStatus == 'newly') {
              this.smallslist.push(fileData1)
              this.$message({
                title: '成功',
                message: '上传成功',
                type: 'success',
                duration: 2000
              })
              const test = document.getElementById('uploadImg')
              test.value = ''
            }
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
    //  第二个文件上传 twoupload

    twofileUp(e) {
      console.log(1234)
      const file = e.target.files[0]
      console.log(file)
      const fileData2 = {
        attachmentCode: 'SBJXJLDFJ',
        moduleType: '22',
        fileName: undefined,
        filePath: undefined, // 文件URL
        fileNameSC: undefined,
        fileUrl: undefined, // 文件URL
        node: '开始',
        userId: this.userId,
        code: this.documenyt// 单据编码

      }
      if (file != null) {
        this.fromLoading = true
        const param = new FormData() // 创建form对象
        param.append('file', file, file.name) // 通过append向form对象添加数据
        this.fileName = file.name
        fileData2.fileName = file.name
        console.log(file.name)
        uploadlist(param).then(resp => { // 调用上传接口
          if (resp.data.code == 200) {
            fileData2.filePath = resp.data.data.remoteFilename // 文件地址
            fileData2.fileNameSC = resp.data.data.remoteFilename
            fileData2.fileUrl = resp.data.data.fileUrl
            if (this.dialogStatus == 'update') {
              insertFile(fileData2).then(response => {
                if (response.data.code == 200) {
                  this.$message({
                    title: '成功',
                    message: '上传成功',
                    type: 'success',
                    duration: 2000
                  })
                  this.getlisttwo()
                  const test = document.getElementById('twoupload')
                  test.value = ''
                }
              })
            } else if (this.dialogStatus == 'newly') {
              this.towlistdata.push(fileData2)
              this.$message({
                title: '成功',
                message: '上传成功',
                type: 'success',
                duration: 2000
              })
              const test = document.getElementById('twoupload')
              test.value = ''
            }
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
            const test = document.getElementById('twoupload')
            test.value = ''
          } else {
            this.$notify({
              title: '警告',
              message: '上传失败',
              type: 'warning',
              duration: 3000
            })
            this.fromLoading = false
            const test = document.getElementById('twoupload')
            test.value = ''
          }
        })
      }
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
#pic{
  width: 100%;
}
</style>
