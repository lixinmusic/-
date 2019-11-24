<template>
  <div class="app-container">
    <!--外部容器 -->
    <el-container>
       <!-- 顶部搜索 -->
        <div class="filter-container">
       
            <div class="formSearch">
            <el-form :inline="true">
                
                <el-form-item label="单据编号" >
                <el-input v-model="listQuery.documnetCode"  style="width:180px" placeholder="请输入单据编号" clearable></el-input>
                </el-form-item>
               

                
                <el-form-item label="设备名称" >
                <el-input class="minier-input" style="width:230px" v-model="listQuery.equipmentName" placeholder="请输入设备名称" clearable></el-input>
                </el-form-item>
             

              
                <el-form-item label="固定资产编号" >
                <el-input class="minier-input" v-model="listQuery.fixedAssetCode" placeholder="请输入固定资产编号" clearable></el-input>
                </el-form-item>
               

             
                <el-form-item label="审核状态">
                    <el-select v-model="listQuery.checkStart" style="width:180px" clearable  placeholder="请选择审核状态">
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
            <el-button class="filter-item" style="margin-left: 10px;margin-bottom:15px" @click="handleCreate" type="primary" icon="el-icon-edit" v-if="addnewly">新增</el-button>
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
               <el-table-column prop="repairSuggestName" align="center" label="维修建议" min-width="80">
                 </el-table-column>
               <el-table-column prop="checkStartName" align="center" label="审核状态" min-width="80">
                 </el-table-column>
               <el-table-column prop="processingPerson" align="center" label="当前处理人" min-width="80">
                 </el-table-column>

              <el-table-column align="center" label="操作" min-width="190" fixed="right" class-name="small-padding fixed-width">
                <template slot-scope="scope"><!-- v-if="edit"   v-if="cutout"  v-if="afreshst" -->
                  <el-button title="编辑" type="primary" :disabled="scope.row.stateshow?true:false" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-if="edit"></el-button>
                  <el-button title="删除" type="danger" :disabled="scope.row.deleshow?true:false" icon="el-icon-delete" size="mini"  @click="deleteBtn(scope.row)" v-if="cutout"></el-button> 
                <!--   <el-button title="重新验收" type="warning" :disabled="scope.row.newshow?true:false" icon="el-icon-refresh" size="mini"  @click="newlyBtn(scope.row)" ></el-button> -->
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
                <span class="equip-title">设备报修单</span>
              </el-form-item>
             <el-row>
              <el-col :span="8">     
              <el-form-item label="单据编码"  prop="documnetCode">
              <el-input style="width:290px" v-model="temp.documnetCode" disabled  class="enter medium-input" placeholder="空" ></el-input>
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
              <el-input v-model="temp.circuitBoardName" maxlength="30" :disabled='sipost?true:false' style="width:290px" class="enter medium-input" placeholder="请输入电路板名称" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">     
              <el-form-item label="电路板型号" prop="circuitBoardModel"> 
              <el-input v-model="temp.circuitBoardModel" maxlength="30" :disabled='sipost?true:false' style="width:290px" class="enter medium-input" placeholder="请输入电路板型号" ></el-input>   
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
                  
                  :disabled='sipost?true:false'>
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
               <el-input type="textarea" :disabled='sipost?true:false' maxlength="200" style="width:798px"  :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入故障原因及内容" v-model="temp.causeReason">
               </el-input>
              </el-form-item>

               <el-row>
              <el-col :span="18">
              <el-form-item label="附件" class="sepost" label-width="40px">
               
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
            <el-button type="primary" @click="saveData" v-show="hold1" size="mini">保存</el-button>
            <el-button type="primary" @click="updateSaveData" v-show="hold2" size="mini">保存</el-button>
            <el-button type="primary" @click="createData" v-show="referring1" size="mini">提交</el-button>
            <el-button type="primary" @click="updateData" v-show="referring2" size="mini">提交</el-button>
            <el-button type="primary" @click="sheetData" v-show="fastener" size="mini">选择设备</el-button>
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
            <el-button type="primary" @click="chanKxuo" v-if="posyRpo">确定</el-button>
          </div>
        </el-dialog>

          </el-dialog>

            <!-- 引用选择设备调拨（设备台账）弹框 -->
          <el-dialog title="选择设备" :close-on-click-modal="false" top="10vh" width="1200px" :visible.sync="dialoglookVisible"> 
         
          <div class="filter-container">
            <div class="formSearch">
            <el-form :inline="true">
                <el-form-item label="设备名称" class="seat">
                <el-input v-model="listQu.equipmentName"  placeholder="请输入设备名称" clearable></el-input>
                </el-form-item>

                <el-form-item label="固定资产编号">
                <el-input class="minier-input" v-model="listQu.fixedAssetCode" placeholder="请输入固定资产编号" clearable></el-input>
                </el-form-item>

                <el-form-item label="型号规格">
                <el-input class="minier-input" v-model="listQu.model" placeholder="请输入型号规格" clearable></el-input>
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
              <el-table-column prop="equipmentName" sortable align="center" label="设备名称"  min-width="120">
                 </el-table-column>

                <el-table-column prop="fixedAssetCode" align="center" label="固定资产编号" min-width="100"></el-table-column>

                <el-table-column prop="model" align="center" label="型号规格" min-width="80">
                 </el-table-column>

               <el-table-column prop="serialNumber" align="center" label="出厂编号" min-width="80">
                 </el-table-column>

               <!--   <el-table-column prop="assetOwnershipCompanyName" align="center" label="资产归属公司" min-width="120">
                 </el-table-column> -->

               <el-table-column prop="companyName" sortable align="center" label="使用公司" min-width="120">
                 </el-table-column>

               <el-table-column prop="factoryName" sortable align="center" label="使用工厂" min-width="120">
                 </el-table-column>

               <el-table-column prop="divisionName" sortable align="center" label="使用部门" min-width="120">
                </el-table-column>
               
               <el-table-column prop="equipmentLocation" align="center" label="设备所在地" min-width="80">
                </el-table-column>

               <el-table-column prop="projectExternalName" sortable align="center" label="项目外部名称" min-width="135">
                </el-table-column>

               <el-table-column prop="purchaseEntity" align="center" label="采购主体" min-width="80">
                </el-table-column> 

               <el-table-column prop="purchaseChannel" align="center" label="采购渠道" min-width="80">
                  <template slot-scope="scope">
                  {{scope.row.purchaseChannel==1?'自制设备':'外购设备'}}
                 </template>
                </el-table-column>

               <el-table-column prop="buyers" align="center" label="采购商" min-width="80">
                </el-table-column>

               <el-table-column prop="manufacturer" align="center" label="制造厂家" min-width="80">
                </el-table-column>

               <el-table-column prop="purchaseDate" align="center" label="采购时间" min-width="80">
                 <template slot-scope="scope">
                  {{scope.row.purchaseDate!==null?scope.row.purchaseDate.substring(0,10):''}}
                 </template>
                 
                </el-table-column> 

               <el-table-column prop="equipmentPrice" align="center" label="采购金额" min-width="80">
               </el-table-column>

               <el-table-column prop="changeFixedDate" align="center" label="时间（财务转固）" min-width="80">
                 
               </el-table-column> 

               <el-table-column prop="depreciationPeriod" align="center" label="折旧年限（财务）" min-width="80">
                </el-table-column>

               <el-table-column prop="isShare" align="center" label="是否共用" min-width="80">
                  <template slot-scope="scope">
                  {{scope.row.isShare ==0?'否':'是'}}
                  </template>
                </el-table-column> 

                <el-table-column prop="originalFinancialValue" align="center" label="财务原值" min-width="80">
                </el-table-column>

                <el-table-column prop="netBookValue" align="center" label="账面净值" min-width="80">
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
       <el-dialog title="设备报修单预览" v-dialogDrag :close-on-click-modal="false" :visible.sync="printDialogVisible" width="60%">
        <el-button type="primary" @click="printDialogVisible = false">返回</el-button>
        <el-button type="success" v-print="'#printTest1'"><svg-icon icon-class="print"/>打印</el-button>
				<div id="printTest1">
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
    </el-container>
  </div>
</template>

<script>
import { fetchListdsy, evaluate, fetchPv, circuList, getCurrentUser, conservation, referto, fetchList, addkeep, addpost, smilelist, uploadlist, smallAblist, deleteapp, updeletedata, insertFile } from '@/api/servicingManage/declareBill'
import waves from '@/directive/waves' // 水波纹指令
import { fetchButton } from '@/api/common/button'
import { flowsheet } from '@/api/servicingManage/declareBill'
import { getProxyOrgList } from '@/api/common/common'// 代理组织
import { menuList } from '@/store/modules/permission'// 按钮权限
import { baseUrl } from '@/api/common/fileBaseUrl'
export default {
  name: 'declareBill',
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
      posyl: false, // 提交确认按钮
      posyRpo: false,

      // 审核状态下拉框
      url: '',
      options: [
        { value: '1', label: '未提交' },
        { value: '2', label: '审核中' },
        { value: '3', label: '审核通过' },
        { value: '4', label: '审核不通过' },
        { value: '5', label: '流程关闭' }
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
      chartData: '', // 流程图
      smallslist: [], // 第一个小表格1
      newapps: false, // 一号小表格删除按钮
      updelests: false, // 一号小表格删除按钮
      // 文件数据
      fileData: [],
      fileName: undefined,
      fileNameSC: undefined, // 文件名称
      fileUrl: undefined, // 文件URL
      documenyt: '', // 单据编码的赋值
      userId: '', // 用户id
      workNumber: '', // 员工号
      filshow: true, // 文件上传框显示隐藏

      // 按钮权限
      edit: false, // 编
      cutout: false, // 删
      addnewly: false, // 重新验收
      speechst: false, // 生成设备质量验收报告

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
      // 引用闲置待报废设备
      fastener: false, // 引用闲置待报废设备
      dialoglookVisible: false, // 弹窗属性（引用闲置待报废设备）
      totalsty: null,
      listQu: {
        pageNum: 1,
        pageSize: 10

      },
      // workNumber:'',
      // 选中的导入信息
      selectionArr: [],
      multipleSelection: null,
      checkedIndex: '',
      // 引用的数据和字段
      equipmentList: [], // 引用台账的数据
      fixedAssetCode: '', // 固定资产编号

      equipName: '', // 设备名称
      equipType: '', // 型号规格
      repairCompany: '', // 报修公司
      repairFactory: '', // 报修工厂
      repairDivision: '', // 报修部门

      transferOutFactory: '',
      transferOutFactoryName: '', // 调出工厂
      transferInCompany: '',
      transferInCompanyName: '', // 调入公司
      transferInFactory: '',
      transferInFactoryName: '', // 调入工厂
      transferInDepartment: '',
      transferInDepartmentName: '', // 调入部门
      menuCode: '', // 按钮权限

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
      codes: '',

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
      sipost: '', // 禁用属性
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
    this.getAA()
    this.getuserApp()
    this.getbttonst()
  },

  methods: {
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
    // 按钮的权限  afreshst speechst
    getbttonst() {
      menuList.forEach(item => {
        item.children.forEach(e => {
          if (e.name == 'declareBill') {
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

        if (this.listyst == null) {
          this.listyst = []
          return
        } else {
        // this.listyst.auditingTypeName = ''
          for (var i = 0; i < this.listyst.length; i++) {
            if (this.listyst[i].repairSuggest == 1) {
              this.listyst[i].repairSuggestName = '内部维修'
            } else if (this.listyst[i].repairSuggest == 2) {
              this.listyst[i].repairSuggestName = '外部维修'
            }

            console.log(this.listyst[i].checkStart)
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
      // 申请闲置时间  搜索
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
      const id = {
        id: row.id
      }
      this.porisgid = row.processInstanceId
      this.dialogStatus = 'detail'
      this.dialogFormVisible = true
      this.siteCodeState = true
      this.sipost = true
      this.codes = row.documnetCode
      this.hold1 = false
      this.referring1 = false
      this.referring2 = false
      this.hold2 = false
      this.fastener = false// 引用闲置待报废设备
      this.activeName = 'first'// 选项卡默认选项
      this.fromLoading = false// 弹窗加载动画
      this.roamshow = true// 流转记录显示
      this.filshow = false// 文件上传框显示
      this.newapps = false// 一号小表格删除按钮
      this.updelests = false// 一号小表格编辑删除按钮
      if (row.checkStart == 3) {
        this.mimeograph = true
      } else {
        this.mimeograph = false
      }
      evaluate(id).then(response => {
        if (response.data.code == 200) {
          this.lookout = response.data.data.doucument
          this.temp = Object.assign({}, this.lookout)

          if (this.temp.repariDate !== null) {
            // this.temp.repariDate = this.temp.repariDate.substring(0, 10)
          }
          if (this.temp.repairSuggest !== null || this.temp.repairSuggest !== '') {
            this.temp.repairSuggest = this.temp.repairSuggest.toString()// 单选框判null
          }
        }
      })

      this.circulationlist()
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
        this.circulation = []
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
    /* handleClick(tab, event){
       if(this.porisgid==''){
         this.recordData=[]
         return
      }else{
      const processInstanceId = this.porisgid
     if (tab.label == '流转记录') {

        // 请求流转记录
       circuList(processInstanceId).then(response => {
          if (response.data.code === 200) {
            this.circulation = response.data.data
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
    }, */
    // 重置表单
    resetForm() {
      for (const i in this.temp) {
        this.temp[i] = ''
      }
      this.checkList = [] // 复选框
      this.smallslist = []
      this.userId = undefined
    },

    // 新增弹出框按钮
    handleCreate() {
      this.resetForm()
      this.fromLoading = false// 弹窗加载动画
      this.dialogFormVisible = true
      this.siteCodeState = true// 不可编辑的
      this.sipost = false
      this.dialogStatus = 'create'
      this.roamshow = false// 流转记录隐藏
      this.hold1 = true
      this.referring1 = true
      this.referring2 = false
      this.hold2 = false
      this.mimeograph = false
      this.activeName = 'first'// 选项卡默认选项
      this.fastener = true// 引用调拨设备
      this.newapps = true// 一号小表格删除按钮
      this.updelests = false// 一号小表格编辑删除按钮
      this.filshow = true// 文件上传框显示
      this.getuserApp()// 获取当前用户
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 重新验收弹出框
    newlyBtn(row) {
      this.resetForm()
      this.fromLoading = false// 弹窗加载动画
      this.roamshow = false// 流转记录隐藏
      this.hold1 = true
      this.referring1 = true
      this.referring2 = false
      this.hold2 = false
      this.fastener = true// 引用调拨设备
      this.dialogStatus = 'newly'
      this.dialogFormVisible = true
      this.activeName = 'first'// 选项卡默认选项
      this.siteCodeState = true// 不可编辑的
      this.temp.equipName = row.equipName
      this.temp.equipType = row.equipType
      this.temp.fixedAssetCode = row.fixedAssetCode
      this.temp.transferOutFactoryName = row.transferOutFactoryName
      this.temp.useCompanyName = row.useCompanyName
      this.temp.useFactoryName = row.useFactoryName
      this.temp.useDepartmentName = row.useDepartmentName
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 新增的保存  addkeep addpost
    saveData(row) {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.proxyOrgList.length != 0) {
            this.changeOrgVisible = true
            this.posyl = false// 提交确认按钮
            this.posyRpo = true
          } else {
            this.temp.proxyOrgCode = this.comCode
            this.savDatesp()
          }
        }
      })
    },

    // 新增的保存  addkeep addpost
    savDatesp(row) {
      console.log(234555)
      console.log(this.temp)
      this.fromLoading = true// 弹窗加载动画
      this.temp.list = this.smallslist
      addkeep(this.temp).then(response => {
        if (response.data.code == 200) {
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
            this.posyl = true// 提交确认按钮
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
      // this.temp.userId = this.userId
      this.fromLoading = true// 弹窗加载动画
      this.temp.list = this.smallslist
      addpost(this.userId, this.temp).then(response => {
        if (response.data.code == 200) {
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
        const deleteid = {
          id: row.id
        }

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
      const id = { id: row.id }
      this.idList = row.id// 获取id
      this.siteCodeState = true
      this.sipost = false
      this.dialogStatus = 'update'
      this.hold2 = true
      this.referring2 = true
      this.hold1 = false
      this.referring1 = false
      this.fastener = true// 引用闲置待报废设备
      this.getuserApp()// 获取当前用户
      this.activeName = 'first'// 选项卡默认选项
      this.mimeograph = false

      this.roamshow = false// 流转记录隐藏
      this.fromLoading = false// 弹窗加载动画
      evaluate(id).then(response => {
        this.popTitle = response.data.data.doucument
        this.temp = Object.assign({}, this.popTitle)

        this.documenyt = this.popTitle.documnetCode// 单号编码

        if (this.temp.repariDate !== null) {
          this.temp.repariDate = this.temp.repariDate.substring(0, 10)
        }
        if (this.temp.repairSuggest !== null) {
          this.temp.repairSuggest = this.temp.repairSuggest.toString()// 单选框判null
        }
      })

      this.newapps = false// 一号小表格重新验收删除按钮
      this.updelests = true// 一号小表格编辑删除按钮
      this.filshow = true// 文件上传框显示
      setTimeout(() => {
        this.getlistsamll() // 第一个小表格list数据
      }, 1 * 500)
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 获取当前用户信息  disposalForm
    getuserApp() {
      getCurrentUser().then(response => {
        if (response.data.code == 200) {
          this.userId = response.data.data.id
          this.workNumber = response.data.data.sysCurrentPersonDTO.workNumber
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
    // 确认按钮（提交）
    changeOrgOk() {
      if (this.temp.proxyOrgName == undefined || this.temp.proxyOrgName == '' || this.temp.proxyOrgName == null) {
        this.temp.proxyOrgCode = this.comCode
        if (this.dialogStatus == 'create') {
          this.createSubmit()
        }
        /*  else if (this.dialogStatus == 'update') {
          this.updataSubmit()
        } */
      } else {
        if (this.dialogStatus == 'create') {
          this.createSubmit()
        }
        /*  else if (this.dialogStatus == 'update') {
          this.updataSubmit()
        } */
      }
      this.changeOrgVisible = false
    },

    // 确认按钮（保存）
    chanKxuo() {
      if (this.temp.proxyOrgName == undefined || this.temp.proxyOrgName == '' || this.temp.proxyOrgName == null) {
        this.temp.proxyOrgCode = this.comCode
        if (this.dialogStatus == 'create') {
          this.savDatesp()
        }
        /*  else if (this.dialogStatus == 'update') {
          this.updPsyo()
        } */
      } else {
        if (this.dialogStatus == 'create') {
          this.savDatesp()
        }
        /*  else if (this.dialogStatus == 'update') {
          this.updPsyo()
        } */
      }
      this.changeOrgVisible = false
    },
    // 编辑提交按钮

    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.temp.id = this.idList
          const tempData = Object.assign({}, this.temp)
          this.fromLoading = true// 弹窗加载动画
          referto(this.userId, tempData).then(response => {
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
    // 编辑里的保存 conservation referto
    /*  updateSaveData(){
          this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.proxyOrgList.length != 0) {
            this.changeOrgVisible = true
             this.posyl = false//提交确认按钮
             this.posyRpo = true
          } else {
            this.temp.proxyOrgCode = this.comCode
            this.updPsyo()
          }
        }
      })
     }, */
    // 编辑里的保存 conservation referto
    updateSaveData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.temp.id = this.idList
          // this.temp.proxyOrgCode = this.comCode
          const tempData = Object.assign({}, this.temp)
          this.fromLoading = true// 弹窗加载动画
          conservation(tempData).then(response => {
            const msg = response.data.msg
            if (response.data.code == 200) {
              for (const v of this.listyst) {
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
    //  第一个下载的按钮
    downloadsty(row) {
      if (this.dialogStatus == 'create') {
        window.location.href = row.fileUrl + '?attname=' + row.fileName
        this.$message({
          title: '成功',
          message: '下载成功',
          type: 'success',
          duration: 2000
        })
      } else if (this.dialogStatus == 'update') {
        const att = row.fileName
        window.location.href = row.filePath + '?attname=' + att
        this.$message({
          title: '成功',
          message: '下载成功',
          type: 'success',
          duration: 2000
        })
      }
    },
    // 第一个小表格接口 getlistsamll()    getlisttwo()
    getlistsamll() {
      const samllblist = {
        moduleType: 20,
        attachmentCode: 'SBBXDXGZ',
        documentWordCode: this.documenyt
      }
      smallAblist(samllblist).then(response => {
        this.smallslist = response.data.data
      })
    },

    // 第一个文件上传
    fileUpload(e) {
      const file = e.target.files[0]
      console.log(file)
      const fileData1 = {
        /*
        fileNameSC:undefined,*/
        fileUrl: undefined,
        attachmentCode: 'SBBXDXGZ',
        moduleType: '20',
        code: this.documenyt, // 单据编码
        fileName: undefined,
        filePath: undefined, // 文件URL
        node: '开始',
        userId: this.userId

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
            /*    fileData1.fileNameSC = resp.data.data.remoteFilename*/
            fileData1.fileUrl = resp.data.data.fileUrl
            if (this.dialogStatus == 'update') {
              insertFile(fileData1).then(response => {
                if (response.data.code == 200) {
                  console.log(977)
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
            } else if (this.dialogStatus == 'create') {
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

    //  引用闲置待报废设备（设备台账）
    // 引用按钮的弹出框
    sheetData() {
      this.dialoglookVisible = true
      this.getListaccount()
      this.listQu.equipmentName = ''
      this.listQu.fixedAssetCode = ''
      this.listQu.model = ''
      this.listQu.pageNum = 1
      this.listQu.pageSize = 10
      this.multipleSelection = ''
      this.checkedIndex = ''
    },
    handleSelect(val, row) {
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
        /*   for (const i in this.temp) {
        this.temp[i] = ''
      } */
        return
      } else if (this.checkedIndex !== 0) {
        this.temp.fixedAssetCode = this.multipleSelection.fixedAssetCode// 固定资产编号
        this.temp.equipmentName = this.multipleSelection.equipmentName// 设备名称
        this.temp.model = this.multipleSelection.model// 型号规格
        this.temp.repairCompany = this.multipleSelection.companyName// 报修公司
        this.temp.repairCompanyCode = this.multipleSelection.companyCode
        this.temp.repairFactory = this.multipleSelection.factoryName// 报修工厂
        this.temp.repairFactoryCode = this.multipleSelection.factoryCode
        this.temp.repairDivision = this.multipleSelection.divisionName// 报修部门
        this.temp.repairDivisionCode = this.multipleSelection.divisionCode
        this.dialoglookVisible = false
      }
    },
    // 表格的接口
    getListaccount() {
      this.adhibitLoading = true
      // this.listQu.workNumber = this.workNumber
      fetchList(this.listQu).then(response => {
        this.equipmentList = response.data.data.list
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
    },
    handleSizeChangest(val) {
      this.listQu.pageSize = val
      this.getListaccount()
    },
    handleCurrentChangest(val) {
      this.listQu.pageNum = val
      this.getListaccount()
    },

    // 打印
    printData() {
      const params = this.codes
      smilelist(params).then(response => {
        if (response.data.code == 200) {
          console.log(response.data.data.dto)
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
    /* margin: 0 auto; */
    text-align: center;
    display: block;
    font-size: 20px;
    font-weight: 600;
}
/*   #printTest{
  margin-top:10px;
}  */
#printTest1 table{
  border-collapse:collapse;
}
#printTest1 table thead th{
  font-size: 20px;
  padding:10px;
}
#printTest1 table tbody tr{
  height:30px;
  font-size:14px;
}
#printTest1 table tbody td{
  width:25%;
}
#printTest1 table tbody td span{
  margin-right:20px;
} 
.el-table thead tr .el-checkbox__input{
  display: none;
}
#pic{
  width:100%;
}    
</style>
