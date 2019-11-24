<template>
  <div class="app-container">
    <!--外部容器 -->
    <el-container>
       <!-- 顶部搜索 -->
        <div class="filter-container">
       
            <div class="formSearch">
            <el-form :inline="true">
              
                <el-form-item label="单据编号" >
                <el-input v-model="listQuery.formCode" placeholder="请输入单据编号" clearable></el-input>
                </el-form-item>
                

                
                <el-form-item label="固定资产编号" >
                <el-input class="minier-input" style="width:200px" v-model="listQuery.fixedAssetCode" placeholder="请输入固定资产编号" clearable></el-input>
                </el-form-item>
             

               
                <el-form-item label="设备名称" >
                <el-input class="minier-input" v-model="listQuery.equipName" placeholder="请输入设备名称" clearable></el-input>
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
                    <el-select v-model="listQuery.auditingType" style="width:190px" clearable  placeholder="请选择审核状态">
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
            <el-button class="filter-item" style="margin-left: 10px;margin-bottom:15px" @click="handleCreate" type="primary" icon="el-icon-edit" v-if="addnewly">新增</el-button>
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

              <el-table-column align="center" label="操作" min-width="150" fixed="right" class-name="small-padding fixed-width">
                <template slot-scope="scope"><!-- v-if="edit"   v-if="cutout"  v-if="afreshst" -->
                  <el-button title="编辑" type="primary" :disabled="scope.row.stateshow?true:false" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-if="edit"></el-button>
                  <el-button title="删除" type="danger" :disabled="scope.row.deleshow?true:false" icon="el-icon-delete" size="mini"  @click="deleteBtn(scope.row)" v-if="cutout"></el-button> 
                  <!-- <el-button title="重新验收" type="warning" :disabled="scope.row.newshow?true:false" icon="el-icon-refresh" size="mini"  @click="newlyBtn(scope.row)" v-if="speechst"></el-button> -->

                 <!-- <el-button title="生成设备质保验收单" type="primary" :disabled="scope.row.produceshow?true:false" icon="el-icon-document" size="mini" @click="newlproDuce(scope.row)" v-if="speechst"></el-button> -->
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
                <span class="equip-title">调拨设备质量信息报告</span>
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
                  
                  :disabled='sitePosty?true:false'>
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
              <!-- <span style="color:red;position:absolute;bottom:30px;left:0px">*</span> -->
              <el-form-item label="提供资料（必须提供）"  prop="documentProvided" label-width="170px">
              <el-checkbox-group v-model="checkList" >     
                <el-checkbox label="1" :disabled='sitePosty?true:false'>设备操作规程</el-checkbox>
                <el-checkbox label="2" style="width:10px;" :disabled='sitePosty?true:false'>设备维护标准及不按要求维护后果描述</el-checkbox>
               </el-checkbox-group>
               </el-form-item>
              </el-col>
              </el-row>

               <el-row>
               <el-col :span="14">
               <el-form-item label="验收情况" prop="acceptanceSituation"> 
                <el-radio v-model="temp.acceptanceSituation" label="1" :disabled='sitePosty?true:false'>验收通过</el-radio>
                <el-radio v-model="temp.acceptanceSituation" label="0" :disabled='sitePosty?true:false'>验收不通过</el-radio>
              </el-form-item>
              </el-col>
              </el-row>

              <el-form-item label="其他说明" prop="otherDescription" label-width="120px">
               <el-input type="textarea" :disabled='sitePosty?true:false' style="width:798px" maxlength="200" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入其他说明" v-model="temp.otherDescription">
               </el-input>
              </el-form-item>

               <el-form-item label="设备运行稳定性（用数据说明）" prop="stabilityInfo" label-width="120px">
               <el-input type="textarea" :disabled='sitePosty?true:false' style="width:798px" maxlength="128" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入设备运行稳定性" v-model="temp.stabilityInfo">
               </el-input>
              </el-form-item>

               <el-form-item label="产品质量情况（用数据说明）" prop="qualityInfo" label-width="120px">
               <el-input type="textarea" :disabled='sitePosty?true:false' style="width:810px" maxlength="128" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入产品质量情况" v-model="temp.qualityInfo">
               </el-input>
              </el-form-item>

               <el-form-item label="设备主要技术指标（达标情况）" prop="mainSpecificationInfo" label-width="120px">
               <el-input type="textarea" :disabled='sitePosty?true:false' style="width:798px" maxlength="128" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入设备主要起诉指标" v-model="temp.mainSpecificationInfo">
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
            <el-button type="primary" @click="saveData" v-show="hold1" size="mini">保存</el-button>
            <el-button type="primary" @click="updateSaveData" v-show="hold2" size="mini">保存</el-button>
            <el-button type="primary" @click="createData" v-show="referring1" size="mini">提交</el-button>
            <el-button type="primary" @click="updateData" v-show="referring2" size="mini">提交</el-button>
            <el-button type="primary" @click="sheetData" v-show="fastener" size="mini">选择调拨设备</el-button>
            <el-button type="primary" size="mini" @click="printData" v-if="mimeograph">打印</el-button>	
            </el-form-item>
            </el-form>

            <el-dialog width="40%" title="选择发起组织" :visible.sync="changeOrgVisible" append-to-body :close-on-click-modal="false" v-dialogDrag >
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
            <el-button type="primary" @click="changeOrgOk" v-if="posyl">确定</el-button>
            <el-button type="primary" @click="chanDatep" v-if="posyRpo">确定</el-button>
          </div>
        </el-dialog>
          </el-dialog>

            <!-- 引用选择设备调拨（设备台账）弹框  -->
          <el-dialog title="选择调拨设备" v-dialogDrag :close-on-click-modal="false" top="10vh" width="1200px" :visible.sync="dialoglookVisible"> 
        
          <div class="filter-container">
            <div class="formSearch">
            <el-form :inline="true">
                <el-form-item label="设备名称" class="seat">
                <el-input v-model="listQu.equipName"  placeholder="请输入设备名称" clearable></el-input>
                </el-form-item>

                <el-form-item label="固定资产编号">
                <el-input class="minier-input" v-model="listQu.fixedAssetCode" placeholder="请输入固定资产编号" clearable></el-input>
                </el-form-item>

                <el-form-item label="型号规格">
                <el-input class="minier-input" v-model="listQu.equipType" placeholder="请输入型号规格" clearable></el-input>
                </el-form-item>

                <el-form-item>
                <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilterst">搜索</el-button>
                </el-form-item>
            </el-form>
            </div>
        </div>
         <!-- 引用闲置待报废设备 -->
          <el-main>
            
            <el-table :data="equipmentList" ref="ftlpsty" v-loading="adhibitLoading" border fit highlight-current-row
              style="width: 100%;min-height:auto;margin-top:0px" height="500" :header-cell-style="{background:'oldlace'}" :default-sort="{prop: 'cTime', order: 'descending'}"  @select="handleSelect" @select-all="handleSelectAll" @selection-change="handleSelectionChange">

               <el-table-column align="center" type="selection" width="55"></el-table-column>
               <el-table-column  align="center" label="序号" min-width="80" type="index"></el-table-column>
               <!-- fixed="left" -->
               <el-table-column prop="formCode" sortable align="center" label="单据编号"  min-width="120">
                 </el-table-column>

                <el-table-column prop="applicationTime" align="center" label="申请时间" min-width="80">
                <template slot-scope="scope">
                  {{scope.row.applicationTime!==null?scope.row.applicationTime.substring(0,10):''}}
                </template>
                </el-table-column>

               <el-table-column prop="transferOutFactoryName" align="center" label="调出工厂" min-width="80">
                 </el-table-column>

                 <el-table-column prop="transferOutDepartmentName" align="center" label="调出部门" min-width="80">
                 </el-table-column>

               <el-table-column prop="transferInCompanyName" sortable align="center" label="调入公司" min-width="120">
                 </el-table-column>

               <el-table-column prop="transferInFactoryName" sortable align="center" label="调入工厂" min-width="120">
                 </el-table-column>

               <el-table-column prop="transferInDepartmentName" sortable align="center" label="调入部门" min-width="120">
                </el-table-column>
               
               <el-table-column prop="fixedAssetCode" align="center" label="固定资产编号" min-width="80">
                </el-table-column>

               <el-table-column prop="equipName" sortable align="center" label="设备名称" min-width="80">
                </el-table-column>

               <el-table-column prop="equipType" align="center" label="型号规格" min-width="80">
                </el-table-column> 

               <el-table-column prop="depreciationPeriod" align="center" label="折旧年限" min-width="80">
                </el-table-column>

               <el-table-column prop="usedPeriod" align="center" label="已用年限" min-width="80">
                </el-table-column>
        
            </el-table>
          </el-main>
          <el-footer>
            <!-- 分页 -->
            <div class="pagination-container">
              <el-pagination background 
              @size-change="handleSizeChangest" 
              @current-change="handleCurrentChangest" 
              :current-page="listQu.pageNum" 
              :page-sizes="[10,20,50,100]" 
              :page-size="listQu.pageSize" 
              layout="total, sizes, prev, pager, next, jumper" 
              :total="totalsty">
              </el-pagination>
            </div>
          </el-footer>
          <el-button @click="dialoglookVisible = false" style="float:right;margin-top:-40px;margin-right:80px">取消</el-button>
          <el-button @click="affirmlist" type="primary" style="float:right;margin-top:-40px">确定</el-button>
        </el-dialog>
        <el-dialog title="调拨设备质量信息报告打印预览" v-dialogDrag :close-on-click-modal="false" :visible.sync="printDialogVisible" width="60%">
        <el-button type="primary" @click="printDialogVisible = false">返回</el-button>
        <el-button type="success" v-print="'#printTest4'"><svg-icon icon-class="print"/>打印</el-button>
				<div id="printTest4">
					<table border= "0" width="99.5%" >
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
import { fetchListdsy, evaluate, fetchPv, circuList, getCurrentUser, conservation, referto, fetchList, storageAddress, stamplist } from '@/api/allocationProcess/qualityaReport'
import waves from '@/directive/waves' // 水波纹指令
import { flowsheet } from '@/api/allocationProcess/migration'
import { fetchButton } from '@/api/common/button'
import { getProxyOrgList } from '@/api/common/common'// 代理组织
import { menuList } from '@/store/modules/permission'// 按钮权限
export default {
  name: 'qualityaReport',
  directives: {
    waves
  },
  data() {
    return {
      // 代理组织
      userCode: undefined, // 用户编码
      proxyOrgCode: undefined, // 代理组织
      proxyOrgName: undefined,
      proxyOrgList: [],
      comName: undefined,
      comCode: undefined,
      changeOrgVisible: false, // 提交时要加的判断弹窗
      posyl: false,
      posyRpo: false,
      // 审核状态下拉框
      options: [
        { value: '1', label: '未提交' },
        { value: '2', label: '审核中' },
        { value: '3', label: '审核通过' },
        { value: '4', label: '审核不通过' }
       
      ],
      value13: [],
      checkList: [], // 复选框
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
      newapps: false, // 一号小表格删除按钮
      updelests: false, // 一号小表格删除按钮
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
      edit: false, // 编
      cutout: false, // 删
      addnewly: false, // 重新验收
      speechst: false, // 生成设备质量验收报告
      chartData: '', // 流程图

      activeName: 'first', // 选项卡默认选项
      roamshow: false, // 流转记录隐藏
      idList: '', // 获取id
      // 弹框显示
      dialogFormVisible: false,
      popTitle: '',
      lookout: '', // 查看的list
      dialogStatus: '',
      textMap: {
        update: '编辑',
        detail: '查看',
        create: '新增',
        newly: '重新验收'
      },
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
      idstylpo: '',

      // 引用闲置待报废设备
      fastener: false, // 引用闲置待报废设备
      dialoglookVisible: false, // 弹窗属性（引用闲置待报废设备）
      totalsty: null,
      listQu: {
        pageNum: 1,
        pageSize: 10
      },
      // 选中的导入信息
      selectionArr: [],
      multipleSelection: null,
      checkedIndex: '',
      // 引用的数据和字段
      equipmentList: [], // 引用台账的数据
      fixedAssetCode: '', // 固定资产编号

      equipName: '', // 设备名称
      equipType: '', // 型号规格
      serialNumber: '', // 出厂编
      transferOutFactory: '',
      transferOutFactoryName: '', // 调出工厂
      transferInCompany: '',
      transferInCompanyName: '', // 调入公司
      transferInFactory: '',
      transferInFactoryName: '', // 调入工厂
      transferInDepartment: '',
      transferInDepartmentName: '', // 调入部门

      menuCode: '', // 按钮权限
      dlestly: '', // 单选项（报废/损失）
      dlisCodeState: '', // 单选项（出售）
      disposalForm: true,
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
      adhibitLoading: true, // 引用的台账的表单远程搜索加载动画
      fromLoading: true, // 弹出框加载动画
      dialogPvVisible: false,
      siteCodeState: '', // 岗位编码禁用状态
      sitePosty: '', // 禁用状态
      // 弹框内输入框不填显示的提示信息
      rules: {
        applicationTime: [{ required: true, message: '请选择', trigger: 'change' }],
        //  documentProvided: [{ required: true, message: '请选择', trigger: 'change' }],
        acceptanceSituation: [{ required: true, message: '请选择', trigger: 'change' }],
        stabilityInfo: [{ required: true, message: '请填写', trigger: 'change' }],
        qualityInfo: [{ required: true, message: '请填写', trigger: 'change' }],
        mainSpecificationInfo: [{ required: true, message: '请填写', trigger: 'change' }],
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
      menuList.forEach(item => {
        item.children.forEach(e => {
          if (e.name == 'qualityaReport') {
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
            if (authority[i].buttonName == '新增') {
              this.addnewly = true
            } else if (authority[i].buttonName == '编辑') {
              this.edit = true
            } else if (authority[i].buttonName == '删除') {
              this.cutout = true
            } else if (authority[i].buttonName == '重新验收') {
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
        if (response.data.code == 200) {
          this.listyst = response.data.data.results
          console.log(this.listyst)
          // this.listyst.auditingTypeName = ''
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
            if (this.listyst[i].acceptanceSituation !== 0 || this.listyst[i].auditingType !== 3) {
              this.listyst[i].newshow = true
            }
            if (this.listyst[i].acceptanceSituation !== 1 || this.listyst[i].auditingType !== 3) {
              this.listyst[i].produceshow = true
              if (this.listyst[i].hasReaccept == 0 && this.listyst[i].acceptanceSituation == 0 && this.listyst[i].auditingType == 3) {
                this.listyst[i].newshow = false
              } else if (this.listyst[i].hasReaccept == 1) {
                this.listyst[i].newshow = true
              }
            }
            // 判断删除   this.listyst[i].hasReaccept == 1
            if (this.listyst[i].auditingType == 1 && this.listyst[i].canDelete == 0) {
              this.listyst[i].deleshow = true
            } else if (this.listyst[i].auditingType == 1 && this.listyst[i].canDelete == 1) {
              this.listyst[i].deleshow = false
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
    // 日期  搜索
    searchsty() {
      // 申请闲置时间  搜索
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
      this.idstylpo = row.id
      this.porisgid = row.processInstanceId
      this.dialogStatus = 'detail'
      this.dialogFormVisible = true
      this.siteCodeState = true
      this.sitePosty = true
      this.hold1 = false
      this.referring1 = false
      this.referring2 = false
      this.hold2 = false
      this.fastener = false// 引用闲置待报废设备
      this.activeName = 'first'// 选项卡默认选项
      this.fromLoading = false// 弹窗加载动画
      this.roamshow = true// 流转记录显示 mimeograph
      if (row.auditingType == 3) {
        this.mimeograph = true// 打印按钮显示
      } else {
        this.mimeograph = false
      }

      evaluate(id).then(response => {
        if (response.data.code == 200) {
          this.lookout = response.data.data
          this.temp = Object.assign({}, this.lookout)
          this.temp.applicationTime = this.temp.applicationTime.substring(0, 10)
          var po = []// 复选框的转换方式
          po.push(this.temp.documentProvided)
          console.log(po.join(',').split(','))
          this.checkList = po.join(',').split(',')

          console.log(this.checkList)
          if (this.temp.acceptanceSituation !== null) {
            this.temp.acceptanceSituation = this.temp.acceptanceSituation.toString()// 单选框判null
          }
          console.log(this.temp.handleType)
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

    // 重置表单
    resetForm() {
      for (const i in this.temp) {
        this.temp[i] = ''
      }
      this.checkList = [], // 复选框
      this.userId = undefined
    },

    // 新增弹出框按钮
    handleCreate() {
      this.resetForm()
      this.fromLoading = false// 弹窗加载动画
      this.dialogFormVisible = true
      this.siteCodeState = true// 不可编辑的
      this.sitePosty = false// 可编辑
      this.dialogStatus = 'create'
      this.roamshow = false// 流转记录隐藏
      this.hold1 = true
      this.referring1 = true
      this.referring2 = false
      this.hold2 = false
      this.mimeograph = false// 打印不显示
      this.activeName = 'first'// 选项卡默认选项
      this.fastener = true// 引用调拨设备
      this.getuserApp()// 获取当前用户
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 重新验收弹出框
    newlyBtn(row) {
      console.log(2378)
      console.log(row)
      this.resetForm()
      this.fromLoading = false// 弹窗加载动画
      this.roamshow = false// 流转记录隐藏
      this.hold1 = true
      this.referring1 = true
      this.referring2 = false
      this.hold2 = false
      this.fastener = false// 引用调拨设备
      this.dialogStatus = 'newly'
      this.mimeograph = false// 打印不显示
      this.dialogFormVisible = true
      this.activeName = 'first'// 选项卡默认选项
      this.siteCodeState = true// 不可编辑的
      this.sitePosty = false// 可编辑
      this.temp.equipName = row.equipName
      this.temp.equipType = row.equipType
      this.temp.fixedAssetCode = row.fixedAssetCode
      this.temp.serialNumber = row.serialNumber
      this.temp.fromAccept = 1 // 标识
      this.temp.id = row.id

      this.temp.transferOutFactoryName = row.transferOutFactoryName
      this.temp.transferOutFactory = row.transferOutFactory
      this.temp.useCompanyName = row.useCompanyName
      this.temp.useCompany = row.useCompany
      this.temp.useFactoryName = row.useFactoryName
      this.temp.useFactory = row.useFactory
      this.temp.useDepartmentName = row.useDepartmentName
      this.temp.useDepartment = row.useDepartment

      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 新增的保存
    saveData(row) {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.proxyOrgList.length != 0) {
            this.changeOrgVisible = true
            this.posyl = false // 提交时候
            this.posyRpo = true
          } else {
            this.temp.proxyOrgCode = this.comCode
            this.savPostyp()
          }
        }
      })
    },

    // 新增的保存
    savPostyp(row) {
      console.log(234555)
      console.log(this.temp)
      this.temp.documentProvided = this.checkList.join(',') // 复选框
      this.fromLoading = true// 弹窗加载动画
      conservation(this.temp).then(response => {
        console.log(response.data)
        if (response.data.code == 200) {
          console.log(response.data.code)
          console.log(this.temp)
          this.listyst.unshift(this.temp)
          this.dialogFormVisible = false
          this.getAA()
          this.$message({
            title: '成功',
            message: '创建成功',
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
        setTimeout(() => {
          this.fromLoading = false
        }, 1 * 500)
      })
    },

    // 新增提交
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          // if (this.fileData.length == 0) {
          //   this.$notify({
          //     title: '警告',
          //     message: '请上传附件',
          //     type: 'warning',
          //     duration: 2000
          //   })
          //   return
          // }
          if (this.proxyOrgList.length != 0) {
            this.changeOrgVisible = true
            this.posyl = true // 提交时候
            this.posyRpo = false
          } else {
            this.temp.proxyOrgCode = this.comCode
            this.createSubmit()
          }
        }
      })
    },
    // 新增的提交
    createSubmit(row) {
      console.log(266665)
      console.log(this.temp)
      this.temp.documentProvided = this.checkList.join(',') // 复选框
      this.fromLoading = true// 弹窗加载动画
      referto(this.temp).then(response => {
        console.log(response.data)
        if (response.data.code == 200) {
          console.log(response.data.code)
          console.log(this.temp)
          this.listyst.unshift(this.temp)
          this.dialogFormVisible = false
          this.getAA()
          this.$message({
            title: '成功',
            message: '创建成功',
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
        setTimeout(() => {
          this.fromLoading = false
        }, 1 * 500)
      })
    },

    // 删除事件
    deleteBtn(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(row)
        const deleteid = row.id
        console.log(deleteid)
        fetchPv(deleteid).then(response => {
          if (response.data.code == 200) {
            this.getAA()
            const index = this.listyst.indexOf(row)
            this.listyst.splice(index, 1)
            this.$message({
              type: 'success',
              message: response.data.msg
            })
          } else {
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
    // 编辑点击打开弹窗事件
    handleUpdate(row) {
      const id = row.id
      this.idList = row.id// 获取id
      this.siteCodeState = true
      this.sitePosty = false// 可编辑
      this.dialogStatus = 'update'
      this.hold2 = true
      this.referring2 = true
      this.hold1 = false
      this.referring1 = false
      this.fastener = true// 引用闲置待报废设备
      this.getuserApp()// 获取当前用户
      this.activeName = 'first'// 选项卡默认选项
      this.mimeograph = false// 打印不显示

      this.roamshow = false// 流转记录隐藏
      this.fromLoading = false// 弹窗加载动画
      evaluate(id).then(response => {
        this.popTitle = response.data.data
        this.temp = Object.assign({}, this.popTitle)
        console.log(this.popTitle)
        this.documenyt = this.popTitle.formCode// 单号编码
        console.log(this.documenyt)

        var po = []// 复选框的转换方式
        po.push(this.popTitle.documentProvided)
        console.log(po.join(',').split(','))
        this.checkList = po.join(',').split(',')
        console.log(this.checkList)
        // this.checkList.push(this.popTitle.documentProvided.toString()) //复选框
        console.log(this.checkList)
        if (this.temp.acceptanceSituation !== null) {
          this.temp.acceptanceSituation = this.temp.acceptanceSituation.toString()// 单选框判null
        }
      })
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 获取当前用户信息  disposalForm
    getuserApp() {
      getCurrentUser().then(response => {
        this.userId = response.data.data.id
        this.userCode = response.data.data.userCode
        const orgsty = response.data.data.sysCurrentPersonDTO.orgCode
        if (orgsty == '资产部') {
          this.disposalForm = false
        }
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
      })
    },
    proxyOrgChange() {
      this.proxyOrgList.forEach(item => {
        if (item.orgName == this.temp.proxyOrgName) {
          this.temp.proxyOrgCode = item.orgCode
        }
      })
    },
    // 确定按钮（提交）
    changeOrgOk() {
      if (this.temp.proxyOrgName == undefined || this.temp.proxyOrgName == '' || this.temp.proxyOrgName == null) {
        this.temp.proxyOrgCode = this.comCode
        if (this.dialogStatus == 'create') {
          this.createSubmit()
        } /* else if (this.dialogStatus == 'update') {
          this.updataSubmit()
        } */
      } else {
        if (this.dialogStatus == 'create') {
          this.createSubmit()
        } /* else if (this.dialogStatus == 'update') {
          this.updataSubmit()
        } */
      }
      this.changeOrgVisible = false
    },
    // 确定按钮（保存）
    chanDatep() {
      if (this.temp.proxyOrgName == undefined || this.temp.proxyOrgName == '' || this.temp.proxyOrgName == null) {
        this.temp.proxyOrgCode = this.comCode
        if (this.dialogStatus == 'create') {
          this.savPostyp()
        }
      } else {
        if (this.dialogStatus == 'create') {
          this.savPostyp()
        }
      }
      this.changeOrgVisible = false
    },
    // 编辑提交按钮
    /*  updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.proxyOrgList.length != 0) {
            this.changeOrgVisible = true
          } else {
            this.temp.proxyOrgCode = this.comCode
            this.updataSubmit()
          }
        }
      })
    }, */
    // 编辑提交按钮
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.temp.id = this.idList
          this.temp.documentProvided = this.checkList.join(',') // 复选框
          const tempData = Object.assign({}, this.temp)
          console.log(222334434)
          console.log(tempData)
          // tempData.auditingType = 2
          this.fromLoading = true// 弹窗加载动画
          referto(tempData).then(response => {
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
      })
    },
    // 编辑里的保存
    updateSaveData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.temp.id = this.idList
          this.temp.documentProvided = this.checkList.join(',') // 复选框
          const tempData = Object.assign({}, this.temp)
          console.log(tempData)
          this.fromLoading = true// 弹窗加载动画

          conservation(tempData).then(response => {
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
      })
    },

    // 打印
    printData() {
      const params = this.idstylpo
      stamplist(params).then(response => {
        if (response.data.code == 200) {
          this.printList = response.data.data
          this.histor = response.data.data.historyList
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

    //  引用闲置待报废设备（设备台账）
    // 引用按钮的弹出框
    sheetData() {
      this.dialoglookVisible = true
      this.getListaccount()
      this.listQu.equipName = ''
      this.listQu.fixedAssetCode = ''
      this.listQu.equipType = ''
      this.listQu.pageNum = 1
      this.listQu.pageSize = 10
      this.multipleSelection = ''
      this.checkedIndex = ''
    },
    handleSelect(val, row) {
      console.log(23232)
      console.log(row)
      console.log(val)
      if (val.length > 1) {
        this.$refs.ftlpsty.clearSelection() // 清空所有选择
        val.shift()
        this.$refs.ftlpsty.toggleRowSelection(row) //  选中当前选择
      }
      this.selectionArr = val
      this.multipleSelection = row
      this.checkedIndex = val.length
    },
    handleSelectionChange(val) {

    },
    handleSelectAll(val) {
      this.$message({
        title: '警告',
        message: '请选择一条要引用的信息',
        type: 'warning',
        duration: 3000
      })
    },

    // 引用的确认按钮
    affirmlist() {
      if (this.checkedIndex == 0) {
        this.$notify({
          title: '提示',
          message: '请选择一条引用信息',
          type: 'warning',
          duration: 3000
        })

        return
      }
      this.temp.fixedAssetCode = this.multipleSelection.fixedAssetCode// 固定资产编号
      this.temp.transferOutFactoryName = this.multipleSelection.transferOutFactoryName// 调出工厂
      this.temp.equipName = this.multipleSelection.equipName// 设备名称
      this.temp.equipType = this.multipleSelection.equipType// 型号规格
      this.temp.serialNumber = this.multipleSelection.serialNumber// 出厂编号
      this.temp.useCompanyName = this.multipleSelection.transferInCompanyName// 调入公司
      this.temp.useFactoryName = this.multipleSelection.transferInFactoryName// 调入工厂
      this.temp.useDepartmentName = this.multipleSelection.transferInDepartmentName// 调入部门

      this.temp.transferOutFactory = this.multipleSelection.transferOutFactory// 调出工厂编号
      this.temp.useCompany = this.multipleSelection.transferInCompany
      this.temp.useFactory = this.multipleSelection.transferInFactory
      this.temp.useDepartment = this.multipleSelection.transferInDepartment

      this.temp.allocationId = this.multipleSelection.id
      this.dialoglookVisible = false
    },
    // 表格的接口
    getListaccount() {
      this.adhibitLoading = true
      fetchList(this.listQu).then(response => {
        this.equipmentList = response.data.data.results
        console.log(12345)
        console.log(this.equipmentList)
        this.totalsty = response.data.data.total

        this.$nextTick(() => {
          this.adhibitLoading = false
        })
      })
    },

    // 搜索
    handleFilterst(data) {
      this.listQu.pageNum = 1
      this.getListaccount()
      console.log(345678900)
      console.log(this.listQu.companyCode)
    },
    handleSizeChangest(val) {
      this.listQu.pageSize = val
      this.getListaccount()
    },
    handleCurrentChangest(val) {
      this.listQu.pageNum = val
      this.getListaccount()
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
<style scope>
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
    /* margin: 0 auto; */
    text-align: center;
    display: block;
    font-size: 20px;
    font-weight: 600;
}

/* #printTest{
  margin-top:10px;
} */
#printTest4 table{
  border-collapse:collapse;
}
#printTest4 table thead th{
  font-size: 20px;
  padding:10px;
}
#printTest4 table tbody tr{
  height:30px;
  font-size:14px;
}
#printTest4 table tbody td{
  width:25%;
}
#printTest4 table tbody td span{
  margin-right:20px;
} 
.el-table thead tr .el-checkbox__input{
  display: none;
}
#pic{
  width:100%;
}
/* @page {
  size: A4 portrait;
} */

    
</style>
