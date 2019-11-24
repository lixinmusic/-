<template>
  <div class="app-container">
    <!--外部容器 -->
    <el-container>
       <!-- 顶部搜索 -->
      
        <div class="filter-container">
            <div class="formSearch">
            <el-form :inline="true">
            
                <el-form-item label="单据编号" >
                <el-input v-model="listQuery.documnetCode"  style="width:213px" placeholder="请输入单据编号" clearable></el-input>
                </el-form-item>
                
                <el-form-item label="设备名称" >
                <el-input class="minier-input" v-model="listQuery.equipmentName" placeholder="请输入设备名称" clearable></el-input>
                </el-form-item>
             
                <el-form-item label="固定资产编号" >
                <el-input class="minier-input" v-model="listQuery.fixedAssetCode" placeholder="请输入固定资产编号" clearable></el-input>
                </el-form-item>
                <el-form-item label="审核状态">
                    <el-select v-model="listQuery.checkStart" style="width:213px" clearable  placeholder="请选择审核状态">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                    </el-select>
                    </el-form-item>
                <el-form-item label="报修时间" >
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
              
                
                <el-form-item>
                <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
                </el-form-item>
               
            </el-form>
            </div>
          
        </div>
      
      <!-- 内容容器 -->
     
          <!-- 主要区域容器  v-if="addnewly"-->
          <el-main style="padding:20px 0px">
            
            <el-table :data="listyst" v-loading="listLoading" border fit highlight-current-row
              style="width: 100%;min-height:auto;margin-top:0px" height="500" :header-cell-style="{background:'oldlace'}">

              <el-table-column prop="documnetCode" align="center" label="单据编码" min-width="100">
               <template slot-scope="scope">
                 <span class="link-type futiop" @click='checkDetails(scope.row)'>{{scope.row.documnetCode}}</span>
               </template>
                 </el-table-column>
                <el-table-column prop="equipmentName" align="center" label="设备名称" min-width="80">
                 </el-table-column>
                 <el-table-column prop="fixedAssetCode" align="center" label="固定资产编号" min-width="80">
                 </el-table-column>
                 <el-table-column prop="model" align="center" label="型号规格" min-width="80">
                 </el-table-column>
                <el-table-column prop="repariDate" align="center" label="报修时间" min-width="80">
                   <template slot-scope="scope">
                   {{scope.row.repariDate!==null?scope.row.repariDate.substring(0,10):''}}
                 </template>
                 </el-table-column>
               <el-table-column prop="circuitBoardName" align="center" label="电路板名称" min-width="80">
                 </el-table-column>
               <el-table-column prop="circuitBoardModel" align="center" label="电路板型号" min-width="80">
                </el-table-column>
               <el-table-column prop="repairCompany" align="center" label="报修公司" min-width="80">
                 </el-table-column>
               <el-table-column prop="repairFactory" align="center" label="报修工厂" min-width="80">
                 </el-table-column>
               <el-table-column prop="repairDivision" align="center" label="报修部门" min-width="80">
                 </el-table-column>
               <el-table-column prop="requestDate" align="center" label="要求完成时间" min-width="80">
                  <template slot-scope="scope">
                   {{scope.row.requestDate!==null?scope.row.requestDate.substring(0,10):''}}
                 </template>
                 </el-table-column>
               <el-table-column prop="repairSuggestNames" align="center" label="维修建议" min-width="80">
                 </el-table-column>
               <el-table-column prop="checkStartName" align="center" label="审核状态" min-width="80">
                 </el-table-column>
               <el-table-column prop="processingPerson" align="center" label="当前处理人" min-width="80">
                 </el-table-column>

                <el-table-column align="center" label="操作" min-width="150" fixed="right" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                 <el-button title="通知" type="success" icon="el-icon-message" size="mini"  @click="sendMessage(scope.row)"
               :disabled="scope.row.noticeShow?true:false"></el-button>
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
              :current-page="pageNum" 
              :page-sizes="[5,10,15,20]" 
              :page-size="pageSize" 
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
                <span class="equip-title">设备报修单已办</span>
              </el-form-item>
                <el-row>
              <el-col :span="8">     
              <el-form-item label="单据编码"  prop="documnetCode">
              <el-input style="width:290px" v-model="temp.documnetCode" disabled class="enter medium-input" placeholder="空" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="16">     
              <el-form-item label="设备名称"  prop="equipmentName" style="margin-left:200px">
              <el-input style="width:290px" v-model="temp.equipmentName" :disabled='siteCodeState?true:false' class="enter medium-input" placeholder="输入设备名称" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>
             
              <el-row>
              <el-col :span="8">     
              <el-form-item label="固定资产编号"  prop="fixedAssetCode">
              <el-input style="width:290px" v-model="temp.fixedAssetCode" :disabled='siteCodeState?true:false' class="enter medium-input" placeholder="输入固定资产编号" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="型号规格" prop="model" style="margin-left:200px;"> 
              <el-input v-model="temp.model" :disabled='siteCodeState?true:false' style="width:290px" class="enter medium-input" placeholder="请输入型号规格" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">
              <el-form-item label="报修时间"  prop="repariDate">
              <el-input style="width:290px" v-model="temp.repariDate" :disabled='siteCodeState?true:false' class="enter medium-input" placeholder="输入报修时间" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="电路板名称" prop="circuitBoardName" style="margin-left:200px;">
              <el-input v-model="temp.circuitBoardName" :disabled='siteCodeState?true:false' style="width:290px" class="enter medium-input" placeholder="请输入电路板名称" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">     
              <el-form-item label="电路板型号" prop="circuitBoardModel"> 
              <el-input v-model="temp.circuitBoardModel" :disabled='siteCodeState?true:false' style="width:290px" class="enter medium-input" placeholder="请输入电路板型号" ></el-input>   
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="报修公司" prop="repairCompany" style="margin-left:200px;"> 
              <el-input v-model="temp.repairCompany" :disabled='siteCodeState?true:false' style="width:290px" class="enter medium-input" placeholder="请输入报修公司" ></el-input>   
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">
              <el-form-item label="报修工厂" prop="repairFactory"> 
              <el-input v-model="temp.repairFactory" :disabled='siteCodeState?true:false' style="width:290px" class="enter medium-input" placeholder="请输入报修工厂" ></el-input>   
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="报修部门" prop="repairDivision" style="margin-left:200px"> 
              <el-input v-model="temp.repairDivision" :disabled='siteCodeState?true:false' style="width:290px" class="enter medium-input" placeholder="请输入报修部门" ></el-input>   
              </el-form-item>
              </el-col>
              </el-row>

               <el-row>
               <el-col :span="8">
              <el-form-item label="要求完成时间" prop="requestDate">
               <div class="block">
                <el-date-picker
                  style="width:290px"
                  v-model="temp.requestDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  
                  :disabled='siteCodeState?true:false'>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
               <el-col :span="16">
               <el-form-item label="设备维修建议" prop="repairSuggest" style="margin-left:200px"> 
                <el-radio v-model="temp.repairSuggest" :disabled='siteCodeState?true:false' label="2">外部维修</el-radio>
                <el-radio v-model="temp.repairSuggest" :disabled='siteCodeState?true:false' label="1">内部维修</el-radio>
              </el-form-item>
              </el-col>
              </el-row>

               <el-form-item label="故障原因及内容" prop="causeReason" label-width="120px">
               <el-input type="textarea" :disabled='siteCodeState?true:false' style="width:798px" maxlength="128" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入故障原因及内容" v-model="temp.causeReason">
               </el-input>
              </el-form-item>

              <el-row>
              <el-col :span="18">
              <el-form-item label="附件" class="sepost" label-width="40px">
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
                  <el-button title="删除" type="danger" @click="updatadelest(scope.row)" icon="el-icon-delete" size="small" :disabled='teCoate?true:false'></el-button>
               
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
                
               <el-table-column prop="taskName" align="center" label="步骤名" min-width="104">
                 <template slot-scope="scope">
                 <span>{{scope.row.taskName}}</span>
                 </template>
                </el-table-column>

                <el-table-column prop="userName" align="center" label="操作人" min-width="102">
                 <template slot-scope="scope">
                 <span>{{scope.row.userName}}</span>
                 </template>
                </el-table-column>

                <el-table-column prop="orgName" align="center" label="所在部门" min-width="102">
                 <template slot-scope="scope">
                 <span>{{scope.row.orgName}}</span>
                 </template>
                </el-table-column>

                <el-table-column prop="stationName" align="center" label="岗位" min-width="102">
                 <template slot-scope="scope">
                 <span>{{scope.row.stationName}}</span>
                 </template>
                </el-table-column>

                 <el-table-column prop="state" align="center" label="状态" min-width="102">
                 <template slot-scope="scope">
                 <span>{{scope.row.state}}</span>
                 </template>
                </el-table-column>

                 <el-table-column prop="opinion" align="center" label="意见" min-width="122">
                 <template slot-scope="scope">
                 <span>{{scope.row.opinion}}</span>
                 </template>
                </el-table-column>

                <el-table-column prop="dateTime" align="center" label="时间" min-width="154">
                 <template slot-scope="scope">
                 <span>{{scope.row.dateTime}}</span>
                 </template>
                </el-table-column>

                <el-table-column prop="remark" align="center" label="备注" min-width="123">
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
             <el-button type="primary" size="mini" @click="printData" v-if="mimeograph">打印</el-button>
           
            </el-form-item>
            </el-form>
          </el-dialog>
           <el-dialog title="设备报修单预览" v-dialogDrag :close-on-click-modal="false" :visible.sync="printDialogVisible" width="60%">
        <el-button type="primary" @click="printDialogVisible = false">返回</el-button>
        <el-button type="success" v-print="'#printTest'"><svg-icon icon-class="print"/>打印</el-button>
			  <div id="printTest">
           <!-- <h2 style="text-align:center;">{{srintList.repairCompany}}设备报修单</h2> -->
          
					<table border= "0" width="99%" >
            <thead>
                   <tr>
                       <th colspan="8">{{srintList.repairCompany}}设备报修单</th>
                   </tr>
            </thead>
            <tbody>
              <tr style="height:60px">
                <td style="border:1px solid black">设备名称</td>
                <td style="border:1px solid black" colspan="3">{{srintList.equipmentName}}</td>
                <td style="border:1px solid black" colspan="3">固定资产编号</td>
                <td style="border:1px solid black" colspan="1">{{srintList.fixedAssetCode}}</td>
              </tr>
             
              <tr style="height:60px">
                <td style="border:1px solid black">型号规格</td>
                <td style="border:1px solid black" colspan="3">{{srintList.model}}</td>
                <td style="border:1px solid black" colspan="3">报修时间</td>
                <td style="border:1px solid black" colspan="1">{{srintList.repariDate}}</td>
              </tr>
               <tr style="height:60px">
                <td style="border:1px solid black">电路板名称</td>
                <td style="border:1px solid black" colspan="3">{{srintList.circuitBoardName}}</td>
                <td style="border:1px solid black" colspan="3">电路板型号</td>
                <td style="border:1px solid black" colspan="1">{{srintList.circuitBoardModel}}</td>
              </tr >
               <tr style="height:60px">
                <td style="border:1px solid black">报修部门</td>
                <td style="border:1px solid black" colspan="3">{{srintList.repairDivision}}</td>
                <td style="border:1px solid black" colspan="3">要求完成时间</td>
                <td style="border:1px solid black" colspan="1">{{srintList.requestDate}}</td>
              </tr>
              <tr>
               <td colspan="8" style="height:40px;border:1px solid black">
                <!-- <input type="checkbox" id="cheni1"><span>外部维修</span>
                <input type="checkbox" id="cheni2"><span>内部维修</span> -->
                 <span style="margin-left:170px">外部维修(<span v-if="suggestShow">√</span>)</span><span style="margin-left:120px">内部维修(<span v-if="sugg">√</span>)</span>
               </td>
             </tr>
              <tr style="height:100px">
                <td colspan="8" style="border:1px solid black" align="left" valign="top">
                  <div>故障原因及内容：{{srintList.causeReason}}</div>
                  </td>
              </tr>
            
             
              <tr style="height:100px">
                <td colspan="8" align="left" valign="top" style="height:50px;border:1px solid black;border-bottom:none">设备科审核意见：{{fixing}}</td>
              </tr>
              <tr style="border-top:0px solid white;">    
                <td colspan="8" align="right" style="border:1px solid black;border-top:none"><span>签字：{{fixingName}}</span><span>日期：{{fixingDate}}</span></td>
              </tr>
              <tr style="height:100px">
                <td colspan="8" align="left" valign="top" style="height:50px;border:1px solid black;border-bottom:none">厂长审核意见：{{factoryst}}</td>
              </tr>
              <tr style="border-top:0px solid white;"> 
                <td colspan="8" align="right" style="border:1px solid black;border-top:none"><span>签字：{{factorystName}}</span><span>日期：{{factorystDate}}</span></td>
              </tr>
               <tr style="height:100px">
                <td colspan="8" align="left" valign="top" style="height:50px;border:1px solid black;border-bottom:none">事业部分管副总意见：{{enterprise}}</td>
              </tr>
              <tr style="border-top:0px solid white;">
                <td colspan="8" align="right" style="border:1px solid black;border-top:none"><span>签字：{{enterpriseName}}</span><span>日期：{{enterpriseDate}}</span></td>
              </tr>
              <tr style="height:100px">
                <td colspan="8" align="left" valign="top" style="height:50px;border:1px solid black;border-bottom:none">资产部意见：{{propertyst}}</td>
              </tr>
              <tr style="border-top:0px solid white;">  
                <td colspan="8" align="right" style="border:1px solid black;border-top:none"><span>签字：{{propertystName}}</span><span>日期：{{propertystDate}}</span></td>
              </tr>
             
            </tbody>
          </table>
				</div>
			</el-dialog>
       
       <!-- 选择通知的人 -->
      <el-dialog width="60%" :close-on-click-modal="false" title="请选择要通知的人员" :visible.sync="innerVisiblePerson" append-to-body v-dialogDrag>
        <el-header>
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="姓名">
              <el-input v-model="listQuery1.perName" placeholder="请输入姓名">
              </el-input>
            </el-form-item>
            <el-form-item label="工号">
              <el-input v-model="listQuery1.workNumber" placeholder="请输入工号">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="handlePerson">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-header>
        <el-container>
          <el-aside style="width:380px;">
            <el-tree :data="personOrgData" :props="defaultProps" @node-click="handleNodeClick" v-loading="diaLoading" :render-content="renderContent"></el-tree>
          </el-aside>
          <el-main>
            <span style="margin-left:20px;color:red">{{choosePerName}}</span>
            <el-table height='300' :data="orgListData" border fit highlight-current-row
              style="width:100%;min-height:300px;margin-top:8px">
              <el-table-column prop="orgName" align="center" label="部门" min-width="50">
              </el-table-column>
              <el-table-column prop="perName" align="center" label="人员" min-width="50">
              </el-table-column>
              <el-table-column align="center" label="工号" min-width="50">
                <template slot-scope="scope">
                  <a class="look-detail" @click="chooseData1(scope.row)">{{scope.row.workNumber}}</a>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
        </el-container>
        <div slot="footer" class="dialog-footer">
          <el-button @click="choosePersonOk" type="primary">确定</el-button>
          <el-button @click="innerVisiblePerson = false" type="info">取消</el-button>
        </div>
      </el-dialog>




    </el-container>
  </div>
</template>

<script>
import { fetchListdsy, evaluate, circuList, getCurrentUser, smilelist, smallAblist, updeletedata, postMessage } from '@/api/servicingManage/declareDone'
import waves from '@/directive/waves' // 水波纹指令
import { flowsheet } from '@/api/servicingManage/declareBill'
// import { fetchButton } from '@/api/common/button'
import { baseUrl } from '@/api/common/fileBaseUrl'
import { fetchChooseTree, choosePersonList } from '@/api/common/common'
export default {
  name: 'declareDone',
  directives: {
    waves
  },
  data() {
    return {
      // 通知按钮的消息
      // 选择人
      diaLoading: false,
      orgListData: null,
      personOrgData: [],
      innerVisiblePerson: false, // 技术负责人弹框
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
      choosePerName: undefined,
      listQuery2: {
        documentId: undefined,
        workNumber: undefined

      },
      id: undefined,
      // 审核状态下拉框
      options: [
        { value: '2', label: '审核中' },
        { value: '3', label: '审核通过' },
        { value: '4', label: '审核不通过' },
        { value: '5', label: '流程关闭' }
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

      },
      pageNum: 1,
      pageSize: 10,
      // 编辑的字段设置
      temp: {

      },
      chartData: '', // 流程图
      // 文件数据
      smallslist: [], // 第一个小表格
      fileData: [],
      fileName: undefined,
      fileNameSC: undefined, // 文件名称
      fileUrl: undefined, // 文件URL
      documenyt: '', // 单据编码的赋值
      userId: '', // 用户id
      teCoate: '', // 小表格删除按钮禁用
      url: '',

      // 按钮权限
      edit: false, // 编
      cutout: false, // 删
      afreshst: false, // 重新验收
      speechst: false, // 生成设备质量验收报告

      activeName: 'first', // 选项卡默认选项
      roamshow: false, // 流转记录隐藏
      // 弹框显示
      dialogFormVisible: false,

      popTitle: '',
      lookout: '', // 查看的list
      dialogStatus: '',
      textMap: {
        update: '编辑',
        detail: '查看',
        create: '新增'
      },
      // 引用闲置待报废设备
      fastener: false, // 引用闲置待报废设备
      dialoglookVisible: false, // 弹窗属性（引用闲置待报废设备）
      listQu: {
        pageNum: 1,
        pageSize: 10
      },
      // 打印数据
      printDialogVisible: false, // 打印
      codes: '',
      srintList: {
        repairSuggest: ''
      },
      dtoList: {},
      fixing: '', // 设备科
      fixingName: '', // 设备科签字
      fixingDate: '',

      factoryst: '', // 厂长
      factorystName: '', // 厂长签字
      factorystDate: '',

      propertyst: '', // 资产
      propertystName: '', // 资产签字
      propertystDate: '',

      enterprise: '', // 事业部
      enterpriseName: '', // 事业部签字
      enterpriseDate: '',
      suggestShow: false,
      sugg: false,
      mimeograph: false,

      equipmentList: [], // 引用台账的数据
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
      siteCodeState: '', // 岗位编码禁用状态
      // 弹框内输入框不填显示的提示信息
      rules: {
        equipmentName: [{ required: true, message: '请填写', trigger: 'change' }],
        model: [{ required: true, message: '请填写', trigger: 'change' }],
        repairCompany: [{ required: true, message: '请填写', trigger: 'change' }],
        repairFactory: [{ required: true, message: '请填写', trigger: 'change' }],
        repairDivision: [{ required: true, message: '请填写', trigger: 'change' }],
        causeReason: [{ required: true, message: '请填写', trigger: 'change' }],
        fixedAssetCode: [{ required: true, message: '请填写', trigger: 'change' }],
        requestDate: [{ required: true, message: '请填写', trigger: 'change' }]

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
    this.getusesty()
    this.getAA()
  },

  methods: {
    renderContent(h, { node, data, store }) {
      return (
        <span>
          <span title={node.label}>{node.label}</span>
        </span>)
    },
    // ******* 文件预览**********
    handlePreview(row) {
      console.log(row)
      if (this.dialogStatus == 'create') {
        this.url = baseUrl + 'onlinePreview?url=' + encodeURIComponent(row.fileUrl)
      } else {
        this.url = baseUrl + 'onlinePreview?url=' + encodeURIComponent(row.filePath)
      }
      var winHeight = window.document.documentElement.clientHeight - 10
      window.open(this.url, '_blank', 'height=' + winHeight + ',top=80,left=80,toolbar=no, menubar=no, scrollbars=yes, resizable=yes')
    },
    // ******* 文件预览结束**********
    // 获取当前用户信息
    getusesty() {
      getCurrentUser().then(response => {
        this.userId = response.data.data.id
      })
    },
    // 表格的接口
    getAA() {
      this.listLoading = true
      fetchListdsy(this.pageNum, this.pageSize, this.listQuery).then(response => {
        this.listyst = response.data.data.list
        if (this.listyst == null) {
          this.listyst = []
          setTimeout(() => {
            this.listLoading = false
          }, 1 * 500)
          return
        } else {
          console.log(this.listyst)
          for (var i = 0; i < this.listyst.length; i++) {
            if (this.listyst[i].repairSuggest == 2) {
              this.listyst[i].repairSuggestNames = '外部维修'
            } else if (this.listyst[i].repairSuggest == 1) {
              this.listyst[i].repairSuggestNames = '内部维修'
            }

		 if (this.listyst[i].checkStart == 2) {
              this.listyst[i].checkStartName = '审核中'
              this.listyst[i].stateshow = true
              this.listyst[i].deleshow = true
            } else if (this.listyst[i].checkStart == 1) {
              this.listyst[i].checkStartName = '未提交'
              this.listyst[i].stateshow = false
              this.listyst[i].deleshow = false
	   } else if (this.listyst[i].checkStart == 3) {
              this.listyst[i].checkStartName = '审核通过'
              this.listyst[i].stateshow = true
              this.listyst[i].deleshow = true
	   } else if (this.listyst[i].checkStart == 4) {
              this.listyst[i].checkStartName = '审核不通过'
              this.listyst[i].stateshow = true
              this.listyst[i].deleshow = true
            } else if (this.listyst[i].checkStart == 5) {
              this.listyst[i].checkStartName = '流程关闭'
              this.listyst[i].stateshow = true
              this.listyst[i].deleshow = true
            }
            if (this.listyst[i].isEquipmanagerPass == 0) {
              this.listyst[i].noticeShow = true
            } else if (this.listyst[i].isEquipmanagerPass == 1) {
              this.listyst[i].noticeShow = false
            }
          }
        }
        this.total = response.data.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 500)
      })
    },
    // 日期  搜索
    searchsty() {
      // 评价时间  搜索
      if (this.value13 == null) {
        this.listQuery.requestDateUp = ''
        this.listQuery.requestDateEnd = ''
      } else {
        this.listQuery.requestDateUp = this.value13[0]// 开始时间
        this.listQuery.requestDateEnd = this.value13[1]
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
    // 查看
    checkDetails(row) {
      const id = { id: row.id }
      this.porisgid = row.processInstanceId
      this.dialogStatus = 'detail'
      this.dialogFormVisible = true
      this.siteCodeState = true
      this.hold1 = false
      this.referring1 = false
      this.referring2 = false
      this.hold2 = false
      this.activeName = 'first'// 选项卡默认选项
      this.codes = row.documnetCode
      this.fromLoading = false// 弹窗加载动画
      this.roamshow = true// 流转记录显示
      this.newapps = false// 一号小表格重新验收删除按钮
      this.updelests = true// 一号小表格编辑删除按钮
      if (row.checkStart == 3) {
        this.mimeograph = true
      } else {
        this.mimeograph = false
      }

      evaluate(id).then(response => {
        if (response.data.code == 200) {
          this.lookout = response.data.data.doucument
          this.temp = Object.assign({}, this.lookout)
          //  this.temp.applicationTime = this.temp.applicationTime.substring(0,10)
          if (this.temp.repariDate !== null) {
            this.temp.repariDate = this.temp.repariDate.substring(0, 10)
          }
          if (this.temp.repairSuggest !== null) {
            this.temp.repairSuggest = this.temp.repairSuggest.toString()// 单选框判null
          }
        }
      })

      this.circulationlist()
      this.teCoate = true
      // 第一个小表格接口
      const samllblist = {
        moduleType: 20,
        attachmentCode: 'SBBXDXGZ',
        documentWordCode: row.documnetCode
      }
      smallAblist(samllblist).then(response => {
        this.smallslist = response.data.data
      })

      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 流转记录
    circulationlist() {
      const processInstanceId = this.porisgid
      if (processInstanceId == '') {
        this.porisgid = null
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
    // 打印
    printData() {
      const params = this.codes
      smilelist(params).then(response => {
        if (response.data.code == 200) {
          this.dtoList = response.data.data.dto
          this.srintList = response.data.data.equipReportDoucument
          this.srintList.repariDate = response.data.data.equipReportDoucument.repariDate.substring(0, 10)
          this.srintList.requestDate = this.srintList.requestDate.substring(0, 10)
          if (this.srintList.repairSuggest == 1) {
            this.suggestShow = false// 不显示
            this.sugg = true
          } else if (this.srintList.repairSuggest == 2) {
            this.suggestShow = true
            this.sugg = false
          } else if (this.srintList.repairSuggest == null) {
            this.suggestShow = false
            this.sugg = false
          }
          for (var i = 0; i < this.dtoList.length; i++) {
            if (this.dtoList[i].taskName == '流程开始') {
              this.fixing = this.dtoList[i].opinion
              this.fixingName = this.dtoList[i].userName
              this.fixingDate = this.dtoList[i].dateTime.substring(0, 10)
            } else if (this.dtoList[i].taskName == '工厂厂长') {
              this.factoryst = this.dtoList[i].opinion
              this.factorystName = this.dtoList[i].userName
              this.factorystDate = this.dtoList[i].dateTime.substring(0, 10)
            } else if (this.dtoList[i].taskName == '资产部审核') {
              this.propertyst = this.dtoList[i].opinion
              this.propertystName = this.dtoList[i].userName
              this.propertystDate = this.dtoList[i].dateTime.substring(0, 10)
            } else if (this.dtoList[i].taskName == '设备副总审核') {
              this.enterprise = this.dtoList[i].opinion
              this.enterpriseName = this.dtoList[i].userName
              this.enterpriseDate = this.dtoList[i].dateTime.substring(0, 10)
            }
          }
        } else {
          this.$notify({
            title: '警告',
            message: response.data.msg,
            type: 'warning',
            duration: 2000
          })
        }
      })
      this.printDialogVisible = true
    },

    //* ************* 通知按钮的消息通知***************

    sendMessage(row) {
      this.listQuery2.documentId = row.id
      this.choosePerson()
      this.innerVisiblePerson = true
    },
    choosePerson() {
      this.listQuery1 = {
        pageNum: 1,
        pageSize: 2000,
        perName: undefined,
        workNumber: undefined
      }
      this.orgListData = null
      this.diaLoading = true
      fetchChooseTree().then(response => {
        this.personOrgData = []
        this.personOrgData.push(response.data.data)
        setTimeout(() => {
          this.diaLoading = false
        }, 1 * 1000)
      })
    },
    handleNodeClick(data) {
      const params = {
        orgCode: data.orgCode,
        pageNum: 1,
        pageSize: 2000
      }
      choosePersonList(params).then(response => {
        this.orgListData = response.data.data.list
      })
    },
    handlePerson() {
      this.orgListData = []
      choosePersonList(this.listQuery1).then(response => {
        this.orgListData = response.data.data.list
      })
    },
    chooseData1(row) {
      this.choosePerName = row.perName
      this.listQuery2.workNumber = row.workNumber
    },
    choosePersonOk() {
      postMessage(this.listQuery2).then(response => {
        if (response.data.code === 200) {
          this.innerVisiblePerson = false
        } else {
          this.$notify({
            title: '警告',
            message: response.data.msg,
            type: 'warning',
            duration: 2000
          })
        }
      })
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
/* #printTest{
  margin-top:10px;
} */
#printTest table{
  border-collapse:collapse;
}
#printTest table thead th{
  font-size: 20px;
  padding:10px;
}
#printTest table tbody tr{
  height:30px;
  font-size:14px;
}
#printTest table tbody td{
  width:25%;
}
#printTest table tbody td span{
  margin-right:20px;
}
#pic{
  width:100%;
}
    
</style>
