<template>
  <div class="app-container">
    <!--外部容器 -->
    <el-container>
       <!-- 顶部搜索 -->
      
        <div class="filter-container">
       
            <div class="formSearch">
            <el-form :inline="true">
              
                <el-form-item label="单据编号" >
                <el-input v-model="listQuery.formCode"   placeholder="请输入单据编号" clearable></el-input>
                </el-form-item>
             

               
                <el-form-item label="固定资产编号" >
                <el-input class="minier-input" style="width:200px" v-model="listQuery.fixedAssetCode" placeholder="请输入固定资产编号" clearable></el-input>
                </el-form-item>
             

              
                <el-form-item label="设备名称" >
                <el-input class="minier-input" style="width:180px" v-model="listQuery.equipName" placeholder="请输入设备名称" clearable></el-input>
                </el-form-item>
              

              
                <el-form-item label="型号规格" >
                <el-input class="minier-input" v-model="listQuery.equipType" placeholder="请输入型号规格" clearable></el-input>
                </el-form-item>
              

             
                <el-form-item label="评价时间" >
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
              
                
            
                <el-form-item label="审核状态">
                    <el-select v-model="listQuery.auditingType" style="width:180px" clearable  placeholder="请选择审核状态">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                    </el-select>
                    </el-form-item>
               
           
                <el-form-item label="验收情况" prop="acceptanceSituation" > 
                <el-radio v-model="listQuery.acceptanceSituation" label="1">验收通过</el-radio>
                <el-radio v-model="listQuery.acceptanceSituation" label="0">验收不通过</el-radio>
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

               <el-table-column prop="formCode" align="center" label="单据编号" min-width="100">
               <template slot-scope="scope">
                 <span class="link-type futiop" @click='checkDetails(scope.row)'>{{scope.row.formCode}}</span>
               </template>
                 </el-table-column>
                  <el-table-column prop="applicationTime" align="center" label="评价时间" min-width="80">
                 </el-table-column>
                 <el-table-column prop="equipName" align="center" label="设备名称" min-width="80">
                 </el-table-column>
                 <el-table-column prop="equipType" align="center" label="型号规格" min-width="80">
                 </el-table-column>
                <el-table-column prop="fixedAssetCode" align="center" label="固定资产编号" min-width="80">
                 </el-table-column>
              <el-table-column prop="serialNumber" align="center" label="出厂编号" min-width="80">
                 </el-table-column>
               <el-table-column prop="transferOutFactoryName" align="center" label="调出工厂" min-width="80">
                </el-table-column>
               <el-table-column prop="useCompanyName" align="center" label="使用公司" min-width="80">
                 </el-table-column>
               <el-table-column prop="useFactoryName" align="center" label="使用工厂" min-width="80">
                 </el-table-column>
               <el-table-column prop="useDepartmentName" align="center" label="使用部门" min-width="80">
                 </el-table-column>
               <el-table-column prop="acceptanceSituationName" align="center" label="验收情况" min-width="80">
                 </el-table-column>
               <el-table-column prop="auditingTypeName" align="center" label="审核状态" min-width="80">
                 </el-table-column>
                <el-table-column prop="currentOpUser" align="center" label="当前处理人" min-width="80">
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
                <span class="equip-title">调拨设备质量信息报告已办</span>
              </el-form-item>
              <el-row>
              <el-col :span="8">     
              <el-form-item label="单据编号"  prop="formCode">
              <el-input style="width:290px" v-model="temp.formCode" disabled maxlength="32" class="enter medium-input" placeholder="空" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="评价时间" prop="applicationTime" style="margin-left:200px">
               <div class="block">
                <el-date-picker
                  style="width:290px"
                  v-model="temp.applicationTime"
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
              <el-col :span="8">     
              <el-form-item label="设备名称"  prop="equipName">
              <el-input style="width:290px" v-model="temp.equipName" :disabled='siteCodeState?true:false' maxlength="32" class="enter medium-input" placeholder="输入设备名称" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="型号规格" prop="equipType" style="margin-left:200px;"> 
              <el-input v-model="temp.equipType" :disabled='siteCodeState?true:false' maxlength="8" style="width:290px" class="enter medium-input" placeholder="请输入型号规格" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">     
              <el-form-item label="固定资产编号" prop="fixedAssetCode">
              <el-input v-model="temp.fixedAssetCode" maxlength="8" :disabled='siteCodeState?true:false' style="width:290px" class="enter medium-input" placeholder="请输入固定资产编号" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="出厂编号" prop="serialNumber" style="margin-left:200px;">
              <el-input v-model="temp.serialNumber" maxlength="8" :disabled='siteCodeState?true:false' style="width:290px" class="enter medium-input" placeholder="请输入出厂编号" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">     
              <el-form-item label="调出工厂" prop="transferOutFactoryName"> 
              <el-input v-model="temp.transferOutFactoryName" :disabled='siteCodeState?true:false' maxlength="8" style="width:290px" class="enter medium-input" placeholder="请输入调出工厂" ></el-input>   
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="使用公司" prop="useCompanyName" style="margin-left:200px;"> 
              <el-input v-model="temp.useCompanyName" maxlength="8" :disabled='siteCodeState?true:false' style="width:290px" class="enter medium-input" placeholder="请输入使用公司" ></el-input>   
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">
              <el-form-item label="使用工厂" prop="useFactoryName"> 
              <el-input v-model="temp.useFactoryName" :disabled='siteCodeState?true:false' maxlength="8" style="width:290px" class="enter medium-input" placeholder="请输入使用工厂" ></el-input>   
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="使用部门" prop="useDepartmentName" style="margin-left:200px"> 
              <el-input v-model="temp.useDepartmentName" :disabled='siteCodeState?true:false' maxlength="8" style="width:290px" class="enter medium-input" placeholder="请输入使用部门" ></el-input>   
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="24">
              <el-form-item label="提供资料（必须提供）" prop="documentProvided" label-width="170px">
              <el-checkbox-group v-model="checkList" :disabled='siteCodeState?true:false'>     
                <el-checkbox label="1">设备操作规程</el-checkbox>
                <el-checkbox label="2" style="width:10px">设备维护标准及不按要求维护后果描述</el-checkbox>
               </el-checkbox-group>
               </el-form-item>
              </el-col>
              </el-row>

               <el-row>
               <el-col :span="14">
               <el-form-item label="验收情况" prop="acceptanceSituation"> 
                <el-radio v-model="temp.acceptanceSituation" :disabled='siteCodeState?true:false' label="1">验收通过</el-radio>
                <el-radio v-model="temp.acceptanceSituation" :disabled='siteCodeState?true:false' label="0">验收不通过</el-radio>
              </el-form-item>
              </el-col>
              </el-row>

               <el-form-item label="其他说明" prop="otherDescription" label-width="120px">
               <el-input type="textarea" :disabled='siteCodeState?true:false' style="width:798px" maxlength="200" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入其他说明" v-model="temp.otherDescription">
               </el-input>
              </el-form-item>

               <el-form-item label="设备运行稳定性（用数据说明）" prop="stabilityInfo" label-width="120px">
               <el-input type="textarea" :disabled='siteCodeState?true:false' style="width:798px" maxlength="200" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入设备运行稳定性" v-model="temp.stabilityInfo">
               </el-input>
              </el-form-item>

               <el-form-item label="产品质量情况（用数据说明）" prop="qualityInfo">
               <el-input type="textarea" :disabled='siteCodeState?true:false' style="width:810px" maxlength="200" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入产品质量情况" v-model="temp.qualityInfo">
               </el-input>
              </el-form-item>

               <el-form-item label="设备主要技术指标（达标情况）" prop="mainSpecificationInfo" label-width="120px">
               <el-input type="textarea" :disabled='siteCodeState?true:false' style="width:798px" maxlength="200" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入设备主要起诉指标" v-model="temp.mainSpecificationInfo">
               </el-input>
              </el-form-item>

              </el-form>
            </el-tab-pane>
            <el-tab-pane label="流转记录" name="second" v-if="roamshow">
             <!-- 流转记录表格 -->
             <el-table :data="circulation" v-loading="listLoading" border fit highlight-current-row
              style="width: 100%;min-height:auto;margin-top:8px" :header-cell-style="{background:'oldlace'}">

                <el-table-column  align="center" label="序号" min-width="48" type="index"></el-table-column>
                
               <el-table-column prop="taskName" align="center" label="步骤名" min-width="112">
                 <template slot-scope="scope">
                 <span>{{scope.row.taskName}}</span>
                 </template>
                </el-table-column>

                <el-table-column prop="userName" align="center" label="操作人" min-width="103">
                 <template slot-scope="scope">
                 <span>{{scope.row.userName}}</span>
                 </template>
                </el-table-column>

                <el-table-column prop="orgName" align="center" label="所在部门" min-width="103">
                 <template slot-scope="scope">
                 <span>{{scope.row.orgName}}</span>
                 </template>
                </el-table-column>

                <el-table-column prop="stationName" align="center" label="岗位" min-width="103">
                 <template slot-scope="scope">
                 <span>{{scope.row.stationName}}</span>
                 </template>
                </el-table-column>

                 <el-table-column prop="state" align="center" label="状态" min-width="103">
                 <template slot-scope="scope">
                 <span>{{scope.row.state}}</span>
                 </template>
                </el-table-column>

                 <el-table-column prop="opinion" align="center" label="意见" min-width="103">
                 <template slot-scope="scope">
                 <span>{{scope.row.opinion}}</span>
                 </template>
                </el-table-column>

                <el-table-column prop="dateTime" align="center" label="时间" min-width="155">
                 <template slot-scope="scope">
                 <span>{{scope.row.dateTime}}</span>
                 </template>
                </el-table-column>

                 <el-table-column prop="remark" align="center" label="备注" min-width="129">
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
        <el-dialog title="调拨设备质量信息报告打印预览" v-dialogDrag :close-on-click-modal="false" :visible.sync="printDialogVisible" width="60%">
        <el-button type="primary" @click="printDialogVisible = false">返回</el-button>
        <el-button type="success" v-print="'#printTest9'"><svg-icon icon-class="print"/>打印</el-button>
					<div id="printTest9">
					<table border= "0" width="99%" >
             <thead>
                   <tr>
                     <th colspan="9">调拨设备质量信息报告</th>
                   </tr>
             </thead>
           <!-- <h2 style="text-align:center;">调拨设备质量信息报告</h2>
           <div style="float:right;margin-right:20px">评价时间：{{printList.applicationTime}}</div>  -->
            <tbody>
               <tr>
                <td colspan="5" style="border:none;text-align:right">评价时间：{{printList.applicationTime}}</td>
               </tr>
              <tr style="height:40px">
                <td style="border:1px solid black;">设备名称</td>
                <td style="border:1px solid black;" colspan="3">{{printList.equipName}}</td>
                <td style="border:1px solid black;" colspan="3">型号规格</td>
                <td style="border:1px solid black;" colspan="1">{{printList.equipType}}</td>
              </tr>
             
              <tr style="height:40px">
                <td style="border:1px solid black;">固定资产编号</td>
                <td style="border:1px solid black;" colspan="3">{{printList.fixedAssetCode}}</td>
                <td style="border:1px solid black;" colspan="3">出厂编号</td>
                <td style="border:1px solid black;" colspan="1">{{printList.serialNumber}}</td>
              </tr>
               <tr style="height:40px">
                <td style="border:1px solid black;">调出工厂</td>
                <td style="border:1px solid black;" colspan="3">{{printList.transferOutFactoryName}}</td>
                <td style="border:1px solid black;" colspan="3">接收工厂</td>
                <td style="border:1px solid black;" colspan="1">{{printList.useFactoryName}}</td>
              </tr>
               <tr style="height:40px">
                <td style="border:1px solid black;">使用车间</td>
                <td style="border:1px solid black;" colspan="3">{{printList.useDepartmentName}}</td>
                <td style="border:1px solid black;" colspan="3">其他说明</td>
                <td style="border:1px solid black;" colspan="1">{{printList.otherDescription}}</td>
              </tr>
            
              <tr >
                 <td colspan="8" style="position:relative; border:1px solid black;">
                  <div style="width:38px;height:410px;border-right:1px solid #606266;float:left;text-align:center;line-height:40px">质<br>量<br>状<br>况<br>说<br>明</div>
                  <div style="float:left;margin-left:10px;">1.设备运行稳定性（用数据说明）：</div>
                  <div style="float:left;margin-left:0px;">{{printList.stabilityInfo}}</div>

                  <div style="position:absolute;left:50px;top:120px;">2.产品质量情况（用数据说明）：</div>
                  <div style="position:absolute;left:260px;top:120px;">{{printList.qualityInfo}}</div>

                  <div style="position:absolute;left:50px;top:250px;">3.设备主要技术指标（达标情况）：</div>
                  <div style="position:absolute;left:269px;top:250px;">{{printList.mainSpecificationInfo}}</div>

                  <div style="position:absolute;left:50px;top:350px;color:red">4.有无提供相关资料（必须提供）：</div>
                  <div style="position:absolute;left:50px;top:380px;color:red">
                  <!--   <input type="checkbox" name="你自己定" value="0" />设备操作规程<span></span>
                    <input type="checkbox" name="你自己定" value="1" /><span>设备维护标准及不按要求维护后果描述</span> -->
                    <span style="margin-left:10px">设备操作规程：（<span v-if="suggestShow1" style="padding-left:15px">√</span>）</span><span style="margin-left:20px">设备维护标准及不按要求维护后果描述（<span v-if="suggestShow2" style="padding-left:15px">√</span>）</span>
                    
                    </div>
                    
                 </td> 
                
              </tr>
              <tr>
                <td colspan="8" style="position:relative;border:1px solid black;">
                <div style="width:38px;height:131px;border-right:1px solid #606266;float:left;text-align:center;line-height:30px">处<br>理<br>建<br>议</div>
                 <div style="float:left;margin-left:10px;">{{printList.mainSpecificationInfo}}</div>
                </td> 
              </tr>   
              <tr style="border-bottom:0px solid white;">
                <td colspan="8" style="height:0px;border:1px solid black;border-bottom:none">车间主任：{{director}}</td>
              </tr>
              <tr style="border-top:0px solid white;">      
                <td colspan="8" style="height:0px;border:1px solid black;border-top:none" align="right"><span>签字：{{directorName}}</span><span>日期：{{directorDate}}</span></td>
              </tr>
               <tr style="border-bottom:0px solid white;">
                <td colspan="8" style="height:0px;border:1px solid black;border-bottom:none">设备科长：{{equipmentsty}}</td>
              </tr>
              <tr style="border-top:0px solid white;">
                <td colspan="8" style="height:0px;border:1px solid black;border-top:none" align="right"><span>签字：{{equipmentstyName}}</span><span>日期：{{equipmentstyDate}}</span></td>
              </tr>
              <tr style="border-bottom:0px solid white;">
                <td colspan="8" style="height:0px;border:1px solid black;border-bottom:none">厂长：{{factorypost}}</td>
              </tr>
              <tr style="border-top:0px solid white;">
                <td colspan="8" style="height:0px;border:1px solid black;border-top:none" align="right"><span>签字：{{factorypostName}}</span><span>日期：{{factorypostDate}}</span></td>
              </tr>
            
              <tr style="border-bottom:0px solid white;">
                <td colspan="8" style="height:0px;border:1px solid black;border-bottom:none">资产部设备主管：{{departmentpost}}</td>
              </tr>
              <tr style="border-top:0px solid white;">
                <td colspan="8" style="height:0px;border:1px solid black;border-top:none" align="right"><span>签字：{{departmentpostName}}</span><span>日期：{{departmentpostDate}}</span></td>
              </tr>
             
            </tbody>
          </table>
				</div>
			</el-dialog>
    </el-container>
  </div>
</template>

<script>
import { fetchListdsy, evaluate, circuList, getCurrentUser, stamplist } from '@/api/allocationProcess/qualitycDone'
import waves from '@/directive/waves' // 水波纹指令
import { flowsheet } from '@/api/allocationProcess/migration'
import { fetchButton } from '@/api/common/button'
export default {
  name: 'index',
  directives: {
    waves
  },
  data() {
    return {
      // 审核状态下拉框
      options: [
        { value: '2', label: '审核中' },
        { value: '3', label: '审核通过' },
        { value: '4', label: '审核不通过' }
       
      ],
      checkList: [], // 复选框
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
        pageSize: 10,
        handleType: 2
      },
      // 编辑的字段设置
      temp: {

      },
      smallslist: [], // 第一个小表格1
      newapps: false, // 一号小表格删除按钮
      updelests: false, // 一号小表格删除按钮
      chartData: '', // 流程图

      // 文件数据
      fileData: [],
      fileName: undefined,
      fileNameSC: undefined, // 文件名称
      fileUrl: undefined, // 文件URL
      documenyt: '', // 单据编码的赋值
      userId: undefined, // 用户id

      // 按钮权限
      edit: false, // 编
      cutout: false, // 删
      afreshst: false, // 重新验收
      speechst: false, // 生成设备质量验收报告

      activeName: 'first', // 选项卡默认选项
      roamshow: false, // 流转记录隐藏
      // 弹框显示打印
      dialogFormVisible: false,
      printDialogVisible: false, // 打印
      suggestShow1: false,
      suggestShow2: false,
      mimeograph: false,
      histor: { },
      idst: '',
      printList: {

      },
      director: '', // 车间主任
      equipmentsty: '', // 设备科长
      factorypost: '', // 厂长
      departmentpost: '', // 资产部
      directorName: '',
      equipmentstyName: '',
      factorypostName: '',
      departmentpostName: '',
      directorDate: '', // 车间主任
      equipmentstyDate: '', // 设备科长
      factorypostDate: '', // 厂长
      departmentpostDate: '', // 资产部
      checkList: [], // 复选框

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
      equipmentList: [], // 引用台账的数据

      dlestly: '', // 单选项（报废/损失）
      dlisCodeState: '', // 单选项（出售）
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
        acceptanceSituation: [{ required: true, message: '请选择', trigger: 'change' }],
        stabilityInfo: [{ required: true, message: '请填写', trigger: 'change' }],
        qualityInfo: [{ required: true, message: '请填写', trigger: 'change' }],
        mainSpecificationInfo: [{ required: true, message: '请填写', trigger: 'change' }],
        applicationTime: [{ required: true, message: '请选择', trigger: 'change' }],
        equipName: [{ required: true, message: '请填写', trigger: 'change' }],
        equipType: [{ required: true, message: '请填写', trigger: 'change' }],
        fixedAssetCode: [{ required: true, message: '请填写', trigger: 'change' }],
        serialNumber: [{ required: true, message: '请填写', trigger: 'change' }],
        transferOutFactoryName: [{ required: true, message: '请填写', trigger: 'change' }],
        useFactoryName: [{ required: true, message: '请填写', trigger: 'change' }],
        useDepartmentName: [{ required: true, message: '请填写', trigger: 'change' }]
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
      const determine = {
        menuCode: 'WM_063',
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
            } else if (authority[i].buttonName == '生成设备质量信息报告') {
              this.speechst = true
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
            console.log(111)
          } else if (this.listyst[i].auditingType == 1) {
            this.listyst[i].auditingTypeName = '未提交'
            this.listyst[i].stateshow = false
            this.listyst[i].deleshow = false
	   } else if (this.listyst[i].auditingType == 3) {
            this.listyst[i].auditingTypeName = '审核通过'
            this.listyst[i].stateshow = true
            this.listyst[i].deleshow = true
	   } else if (this.listyst[i].auditingType == 4) {
            this.listyst[i].auditingTypeName = '审核不通过'
            this.listyst[i].stateshow = true
            this.listyst[i].deleshow = true
          }else if(this.listyst[i].auditingType == 5){
            this.listyst[i].auditingTypeName = '流程关闭'
            this.listyst[i].stateshow = true
            this.listyst[i].deleshow = true
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
        this.listQuery.applyStartTime = ''
        this.listQuery.applyEndTime = ''
      } else {
        this.listQuery.applyStartTime = this.value13[0]// 开始时间
        this.listQuery.applyEndTime = this.value13[1]
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
    // 查看
    checkDetails(row) {
      const id = row.id
      this.idst = row.id
      this.porisgid = row.processInstanceId
      this.dialogStatus = 'detail'
      this.dialogFormVisible = true
      this.siteCodeState = true
      this.hold1 = false
      this.referring1 = false
      this.referring2 = false
      this.hold2 = false
      this.activeName = 'first'// 选项卡默认选项
      this.dlestly = true// 单选项（报废/损毁）
      this.dlisCodeState = true// 单选框（出售）
      if (row.auditingType == 3) {
        this.mimeograph = true// 打印按钮显示
      } else {
        this.mimeograph = false
      }
      this.fromLoading = false// 弹窗加载动画
      this.roamshow = true// 流转记录显示
      this.newapps = false// 一号小表格重新验收删除按钮
      this.updelests = true// 一号小表格编辑删除按钮
      evaluate(id).then(response => {
        if (response.data.code == 200) {
          this.lookout = response.data.data
          this.temp = Object.assign({}, this.lookout)
          this.temp.applicationTime = this.temp.applicationTime.substring(0, 10)
          var po = []// 复选框的转换方式
          po.push(this.temp.documentProvided)
          console.log(po.join(',').split(','))
          this.checkList = po.join(',').split(',')
          if (this.temp.handleType !== null) {
            this.temp.acceptanceSituation = this.temp.acceptanceSituation.toString()// 单选框判null
          }
          console.log(this.temp.acceptanceSituation)
        }
      })

      this.circulationlist()

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
    // 打印
    printData() {
      const params = this.idst
      stamplist(params).then(response => {
        if (response.data.code == 200) {
          this.printList = response.data.data
          this.histor = response.data.data.historyList
          console.log(this.printList.documentProvided)
          if (this.printList.documentProvided == 1) {
            this.suggestShow1 = true
            this.suggestShow2 = false
          } else if (this.printList.documentProvided == 2) {
            this.suggestShow1 = false
            this.suggestShow2 = true
          } else if (this.printList.documentProvided == '1,2') {
            this.suggestShow1 = true
            this.suggestShow2 = true
          } else {
            this.suggestShow1 = false
            this.suggestShow2 = false
          }
          /* var po = []// 复选框的转换方式
         po.push(this.printList.documentProvided)
         console.log(po.join(',').split(','))
         this.checkList = po.join(',').split(',')
         console.log(this.checkList)
        if(this.checkList ==["1","2"] ){
           this.suggestShow1 = true
           this.suggestShow2 = true
        }else{
           this.suggestShow1 = false
           this.suggestShow2 = false
        } */

          for (var i = 0; i < this.histor.length; i++) {
            if (this.histor[i].taskName == '车间主任') {
              this.director = this.histor[i].opinion// 车间主任
              this.directorName = this.histor[i].userName
              this.directorDate = this.histor[i].dateTime.substring(0, 10)
            } else if (this.histor[i].taskName == '设备科长') {
              this.equipmentsty = this.histor[i].opinion// 设备科长
              this.equipmentstyName = this.histor[i].userName
              this.equipmentstyDate = this.histor[i].dateTime.substring(0, 10)
            } else if (this.histor[i].taskName == '厂长') {
              this.factorypost = this.histor[i].opinion// 厂长
              this.factorypostName = this.histor[i].userName
              this.factorypostDate = this.histor[i].dateTime.substring(0, 10)
            } else if (this.histor[i].taskName == '资产部') {
              this.departmentpost = this.histor[i].opinion // 资产部
              this.departmentpostName = this.histor[i].userName
              this.departmentpostDate = this.histor[i].dateTime.substring(0, 10)
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

    // 编辑里小表格的删除 (第一个)
    /* updatadelest(row){
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
            const index =  this.smallslist.indexOf(row)
            this.smallslist.splice(index, 1)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
       }, */

    //  第一个下载的按钮
    /*   downloadsty(row){
        if(this.dialogStatus == 'create'){
        const att = row.fileName
        window.location.href = row.fileUrl + '?attname='+ att
              this.$message({
               title: '成功',
               message: '下载成功',
               type: 'success',
               duration: 2000
            })
          }else{
            const att = row.fileName
            window.location.href = row.filePath + '?attname=' +att
            this.$message({
              title: '成功',
              message: '下载成功',
              type: 'success',
              duration: 2000
               })
             }
          }, */

    // 获取当前用户信息
    getusesty() {
      getCurrentUser().then(response => {
        this.userId = response.data.data.id
        console.log(444444444)
        console.log(response.data.data)
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
#printTest9 table{
  border-collapse:collapse;
}
#printTest9 table thead th{
  font-size: 20px;
  padding:10px;
}
#printTest9 table tbody tr{
  height:30px;
  font-size:14px;
}
#printTest9 table tbody td{
  width:25%;
}
#printTest9 table tbody td span{
  margin-right:20px;
} 
.opew{
  position:absolute;
  left:50px;
  top:100px;
}
#pic{
  width:100%;
}
/*  @page {
  size: A4 portrait;
}
 */
    
</style>
