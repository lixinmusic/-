<template>
  <div class="app-container">
    <!--外部容器 -->
    <el-container>
       <!-- 顶部搜索 -->
        <div class="filter-container">
       
            <div class="formSearch">
            <el-form :inline="true">
               
                <el-form-item label="单据编号" >
                <el-input v-model="listQuery.formCode" style="width:230px" placeholder="请输入单据编号" clearable></el-input>
                </el-form-item>
              

               
                <el-form-item label="固定资产编号" >
                <el-input class="minier-input" v-model="listQuery.fixedAssetCode" placeholder="请输入固定资产编号" clearable></el-input>
                </el-form-item>
               

               
                <el-form-item label="设备名称" >
                <el-input class="minier-input" v-model="listQuery.equipmentName" placeholder="请输入设备名称" clearable></el-input>
                </el-form-item>
               

                
                <el-form-item label="审核状态">
                    <el-select v-model="listQuery.auditingType" style="width:213px" clearable  placeholder="请选择">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                    </el-select>
                    </el-form-item>
               

             
                <el-form-item label="申请日期" >
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
            
               
                <el-form-item >
                <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
                </el-form-item>
              
                 
            </el-form>
            </div>
          
        </div>
      
      <!-- 内容容器 -->
     
          <!-- 主要区域容器  v-if="addnewly"-->
          <el-main style="padding:20px 0px">
            <el-button class="filter-item" style="margin-left: 10px;margin-bottom:20px" @click="handleCreate" type="primary" icon="el-icon-edit" v-if="addnewly">新增</el-button>
            <el-table :data="listyst" v-loading="listLoading" border fit highlight-current-row
              style="width: 100%;min-height:auto;" height="500" :header-cell-style="{background:'oldlace'}">

               <el-table-column prop="formCode" align="center" label="单据编号" min-width="130">
               <template slot-scope="scope">
                 <span class="link-type futiop" @click='checkDetails(scope.row)'>{{scope.row.formCode}}</span>
               </template>
                 </el-table-column>
                <el-table-column prop="fixedAssetCode" align="center" label="固定资产编号" min-width="80">
                 </el-table-column>
              <el-table-column prop="divisionName" align="center" label="原使用部门" min-width="80">
                 </el-table-column>
               <el-table-column prop="applyDate" align="center" label="申请日期" min-width="80">
                </el-table-column>
                 <el-table-column prop="equipmentName" align="center" label="设备名称" min-width="80">
                 </el-table-column>
               <el-table-column prop="model" align="center" label="型号规格" min-width="80">
                 </el-table-column>
               <el-table-column prop="purchaseDate" align="center" label="采购时间" min-width="80">
                 </el-table-column>
               <el-table-column prop="equipmentPrice" align="center" label="采购金额" min-width="80">
                 </el-table-column>
               <el-table-column prop="netBookValue" align="center" label="账面净值" min-width="80">
                 </el-table-column>
               <el-table-column prop="handleTypeName" align="center" label="处置形式" min-width="80">
                 <!--  <template slot-scope="scope">
                 {{scope.row.handleType == 1 ?'报废/损毁':'出售'}}
                 </template> -->
                 </el-table-column>
               <el-table-column prop="auditingTypeName" align="center" label="审核状态" min-width="80">
                 </el-table-column>
               <el-table-column prop="auditingUser" align="center" label="当前处理人" min-width="90">
                 </el-table-column>

              <el-table-column align="center" label="操作" min-width="160" fixed="right" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-button title="编辑" type="primary" :disabled="scope.row.stateshow?true:false" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-if="edit"></el-button>
                  <el-button title="删除" type="danger" :disabled="scope.row.deleshow?true:false" icon="el-icon-delete" size="mini"  @click="deleteBtn(scope.row)" v-if="cutout"></el-button> 
                 <!--  <el-button title="重新验收" type="warning" :disabled="scope.row.newshow?true:false" icon="el-icon-refresh" size="mini"  @click="newlyBtn(scope.row)" v-if="afreshst"></el-button>
                  <el-button title="生成设备质保验收单" type="primary" :disabled="scope.row.produceshow?true:false" icon="el-icon-document" size="mini" @click="newlproDuce(scope.row)" v-if="speechst"></el-button> -->
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
          <el-dialog :title="textMap[dialogStatus]" v-dialogDrag top="8vh" width="1200px" :visible.sync="dialogFormVisible" >
             <!-- 选项卡 -->
            <el-tabs v-model="activeName" v-loading="fromLoading"  @tab-click="fathClick">
             <el-tab-pane label="表单信息" name="first">
              <el-form :rules="rules" ref="dataForm" :model="temp" label-width="110px">
              <el-form-item>
                <span class="equip-title">闲置设备处置申请单</span>
              </el-form-item>
              <el-row>
              <el-col :span="8">     
              <el-form-item label="单据编号"  prop="formCode">
              <el-input style="width:360px" v-model="temp.formCode" disabled maxlength="32" class="enter medium-input" placeholder="空" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="固定资产编号" prop="fixedAssetCode" style="margin-left:260px;"> 
              <el-input v-model="temp.fixedAssetCode" :disabled='siteCodeState?true:false' maxlength="8" style="width:360px" class="enter medium-input" placeholder="请输入固定资产编号" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>
          
              <el-row>
              <el-col :span="8">     
              <el-form-item label="原使用部门"  prop="divisionName">
              <el-input style="width:360px" v-model="temp.divisionName" :disabled='siteCodeState?true:false' maxlength="32" class="enter medium-input" placeholder="输入原使用部门" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="申请日期" prop="applyDate" style="margin-left:260px">
               <div class="block">
                <el-date-picker
                  style="width:360px"
                  v-model="temp.applyDate"
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

               <el-form-item label="存放地点" prop="storeAddress">
                <el-input type="textarea" :disabled='sidetate?true:false' style="width:1010px" maxlength="128" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入存放地点..." v-model="temp.storeAddress">
                </el-input>
              </el-form-item>
              
              <el-row>
              <el-col :span="8">     
              <el-form-item label="设备名称" prop="equipmentName">
              <el-input v-model="temp.equipmentName" maxlength="8" :disabled='siteCodeState?true:false' style="width:360px" class="enter medium-input" placeholder="请输入设备名称" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="型号规格" prop="model" style="margin-left:260px;">
              <el-input v-model="temp.model" maxlength="8" :disabled='siteCodeState?true:false' style="width:360px" class="enter medium-input" placeholder="请输入型号规格" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">     
              <el-form-item label="采购时间" prop="purchaseDate"> 
              <el-input v-model="temp.purchaseDate" :disabled='siteCodeState?true:false' maxlength="8" style="width:360px" class="enter medium-input" placeholder="请输入采购时间" ></el-input>   
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="数量" prop="number" style="margin-left:260px;"> 
              <el-input v-model="temp.number" maxlength="8" :disabled='siteCodeState?true:false' style="width:360px" class="enter medium-input" placeholder="请输入数量/台" ></el-input>   
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">
              <el-form-item label="采购金额" prop="equipmentPrice"> 
              <el-input v-model="temp.equipmentPrice" :disabled='siteCodeState?true:false' maxlength="8" style="width:360px" class="enter medium-input" placeholder="请输入采购金额" ></el-input>   
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="账面净值" prop="netBookValue" style="margin-left:260px"> 
              <el-input v-model="temp.netBookValue" :disabled='siteCodeState?true:false' maxlength="8" style="width:360px" class="enter medium-input" placeholder="请输入账面净值" ></el-input>   
              </el-form-item>
              </el-col>
              </el-row>

               <el-form-item label="备注" prop="remark">
                <el-input type="textarea" :disabled='sidetate?true:false' style="width:1010px" maxlength="128" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入备注..." v-model="temp.remark">
                </el-input>
              </el-form-item>

               <el-form-item label="制造厂家" prop="manufacturer">
                <el-input type="textarea" style="width:1010px" :disabled='siteCodeState?true:false' maxlength="128" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入制造厂家..." v-model="temp.manufacturer">
                </el-input>
              </el-form-item>

               <el-form-item label="处置原因及目的（详细说明）" prop="handleReasonGoal">
                <el-input type="textarea" :disabled='sidetate?true:false' style="width:1010px" maxlength="128" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入处置原因及目的..." v-model="temp.handleReasonGoal">
                </el-input>
              </el-form-item>
              <el-row>
               <el-col :span="24">
               <el-form-item label="处置形式" prop="handleType" > 
                <el-radio :disabled='disposalForm?true:false' v-model="temp.handleType" label="1" @change="kess">报废/出售</el-radio>
                <el-radio :disabled='disposalForm?true:false' v-model="temp.handleType" label="2" style="margin-left:320px" @change="placing">抵款</el-radio>
                </el-form-item>
                </el-col>
                </el-row>
 
                <el-row>
                <el-form-item label="预计的清理费用和清理收入说明" prop="clearingExpense" style="float:left">
                <el-input type="textarea" :rows="10" style="width:360px;" maxlength="128" placeholder="请输入备注" v-model="temp.clearingExpense" :disabled='dlestly?true:false'>
                </el-input>
                </el-form-item>
               
                
                <el-form-item label="买方单位" prop="buyCompany" style="float:right;margin-right:40px">
                <el-input v-model="temp.buyCompany" maxlength="8" :disabled='dlisCodeState?true:false' style="width:190px" class="enter medium-input" placeholder="请输入买方单位" ></el-input>
                </el-form-item>
               
                <el-form-item label="购买用途" prop="buyPurpose" style="float:right;margin-right:40px">
                <el-input v-model="temp.buyPurpose" maxlength="8" :disabled='dlisCodeState?true:false' style="width:190px" class="enter medium-input" placeholder="请输入购买用途" ></el-input>
                </el-form-item>

                  <el-form-item label="估计金额" prop="evaluateMoney" style="float:right;margin-right:40px">
                <el-input v-model="temp.evaluateMoney" maxlength="8" :disabled='dlisCodeState?true:false' style="width:190px" class="enter medium-input" placeholder="请输入估计金额" ></el-input>
                </el-form-item>

                 <el-form-item label="出售工厂" prop="saleFactory" style="float:right;margin-right:40px">
                <el-input v-model="temp.saleFactory" maxlength="8" :disabled='dlisCodeState?true:false' style="width:190px" class="enter medium-input" placeholder="请输入出售工厂" ></el-input>
                </el-form-item>
              </el-row>

              <el-row>
              <el-col :span="18">
              <el-form-item label="附件上传" class="sepost" label-width="130px" style="margin-left:-62px">
               
              <input id="uploadImg" type="file" @change="fileUpload" v-show="showflie">
              </el-form-item>
              </el-col>
               </el-row> 
              <!--第一个小表格 -->
               <el-table :data="smallslist" border fit highlight-current-row
              style="width: 100%;min-height:auto;margin-top:8px" :header-cell-style="{background:'oldlace'}">

                <el-table-column prop="fileName" align="center" label="文件名" min-width="389">
                 <template slot-scope="scope">
                 <span style="cursor:pointer;text-decoration:underline " @click="handlePreview(scope.row)">{{scope.row.fileName}}</span>
                 </template>
                 </el-table-column>
                 <el-table-column prop="node" align="center" label="上传节点" min-width="385">
                 <template slot-scope="scope">
                 <span>{{scope.row.node}}</span>
                 </template>
                 </el-table-column>

                <el-table-column align="center" label="操作" min-width="385"  class-name="small-padding fixed-width">
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
                
               <el-table-column prop="taskName" align="center" label="步骤名" min-width="130">
                 <template slot-scope="scope">
                 <span>{{scope.row.taskName}}</span>
                 </template>
                </el-table-column>

                <el-table-column prop="userName" align="center" label="操作人" min-width="125">
                 <template slot-scope="scope">
                 <span>{{scope.row.userName}}</span>
                 </template>
                </el-table-column>

                <el-table-column prop="orgName" align="center" label="所在部门" min-width="125">
                 <template slot-scope="scope">
                 <span>{{scope.row.orgName}}</span>
                 </template>
                </el-table-column>

                <el-table-column prop="stationName" align="center" label="岗位" min-width="125">
                 <template slot-scope="scope">
                 <span>{{scope.row.stationName}}</span>
                 </template>
                </el-table-column>

                 <el-table-column prop="state" align="center" label="状态" min-width="125">
                 <template slot-scope="scope">
                 <span>{{scope.row.state}}</span>
                 </template>
                </el-table-column>

                 <el-table-column prop="opinion" align="center" label="意见" min-width="150">
                 <template slot-scope="scope">
                 <span>{{scope.row.opinion}}</span>
                 </template>
                </el-table-column>

                <el-table-column prop="dateTime" align="center" label="时间" min-width="184">
                 <template slot-scope="scope">
                 <span>{{scope.row.dateTime}}</span>
                 </template>
                </el-table-column>

                <el-table-column prop="remark" align="center" label="备注" min-width="147">
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
            <el-button type="primary" @click="sheetData" v-show="fastener" size="mini">选择闲置待报废设备</el-button>	
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
            <el-button type="primary" @click="chanDpol" v-if="posyRpo">确定</el-button>
          </div>
        </el-dialog>
          </el-dialog>

            <!-- 引用闲置待报废设备（设备台账）弹框 -->
          <el-dialog title="选择闲置待报废设备"  v-dialogDrag :close-on-click-modal="false"  top="10vh" width="1200px" :visible.sync="dialoglookVisible"> 
         
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
              style="width: 100%;min-height:auto;margin-top:0px" height="500" :header-cell-style="{background:'oldlace'}" :default-sort="{prop: 'cTime', order: 'descending'}" @select="handleSelect"  @select-all="handleSelectAll" @selection-change="handleSelectionChange">

               <el-table-column align="center" type="selection" width="55"></el-table-column>
               <el-table-column  align="center" label="序号" min-width="80" type="index"></el-table-column>
               <!-- fixed="left" -->
               <el-table-column prop="equipmentName" sortable align="center" label="设备名称"  min-width="120">
                 </el-table-column>

                <el-table-column prop="fixedAssetCode" align="center" label="固定资产编号" min-width="80"></el-table-column>

                <el-table-column prop="model" align="center" label="型号规格" min-width="80">
                 </el-table-column>

               <el-table-column prop="serialNumber" align="center" label="出厂编号" min-width="80">
                 </el-table-column>

                 <el-table-column prop="assetOwnershipCompanyName" align="center" label="资产归属公司" min-width="80">
                 </el-table-column>

               <el-table-column prop="companyName" sortable align="center" label="使用公司" min-width="120">
                 </el-table-column>

               <el-table-column prop="factoryName" sortable align="center" label="使用工厂" min-width="120">
                 </el-table-column>

               <el-table-column prop="divisionName" sortable align="center" label="使用部门" min-width="120">
                </el-table-column>
               
               <el-table-column prop="equipmentLocation" align="center" label="设备所在地" min-width="80">
                </el-table-column>

               <el-table-column prop="projectExternalName" sortable align="center" label="项目外部名称" min-width="80">
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
                  <template slot-scope="scope">
                   {{scope.row.changeFixedDate!==null?scope.row.changeFixedDate.substring(0,10):''}}
                 </template>
               </el-table-column> 

               <el-table-column prop="depreciationPeriod" align="center" label="折旧年限（财务）" min-width="80">
                </el-table-column>

               <el-table-column prop="isShare" align="center" label="是否共用" min-width="80">
                  <template slot-scope="scope">
                  {{scope.row.isShare ==0?'否':'是'}}
                  </template>
                </el-table-column> 

               <el-table-column prop="equipmentStatusname" align="center" label="设备等级" min-width="80">
               </el-table-column>
                 
               <el-table-column prop="equipmentTypename" align="center" label="设备状态" min-width="80">
               </el-table-column>
                      
                <el-table-column prop="applyLdleTime" align="center" label="申请闲置时间" min-width="80">
                <template slot-scope="scope">
                  {{scope.row.applyLdleTime!==null?scope.row.applyLdleTime.substring(0,10):''}}
                 </template>
                </el-table-column>

                <el-table-column prop="scrapTime" align="center" label="报废时间" min-width="80">
                <template slot-scope="scope">
                  {{scope.row.scrapTime!==null?scope.row.scrapTime.substring(0,10):''}}
                 </template>
                </el-table-column>

                <el-table-column prop="renovationFee" align="center" label="改造费" min-width="80">
                </el-table-column>

                <el-table-column prop="originalFinancialValue" align="center" label="财务原值" min-width="80">
                </el-table-column>

                <el-table-column prop="netBookValue" align="center" label="账面净值" min-width="80">
                </el-table-column>

                <el-table-column prop="transferDate" align="center" label="调拨日期" min-width="80">
                <template slot-scope="scope">
                  {{scope.row.transferDate!==null?scope.row.transferDate.substring(0,10):''}}
                 </template>
                </el-table-column>

                <el-table-column prop="transferCompany" align="center" label="调拨后所在公司" min-width="80">
                </el-table-column>

                <el-table-column prop="transferDivision" align="center" label="调拨使用部门" min-width="80">
                </el-table-column>

                <el-table-column prop="cTime" align="center" label="生成时间" min-width="80">
                <template slot-scope="scope">
                  {{scope.row.cTime}}
                 </template>
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
           <el-button @click="affirmlist" type="primary" style="float:right;margin-top:-40px">确定</el-button>
          <el-button @click="dialoglookVisible = false" style="float:right;margin-top:-40px;margin-right:80px">取消</el-button>
        </el-dialog>
       <el-dialog title="闲置设备处置申请单打印预览" v-dialogDrag :close-on-click-modal="false" :visible.sync="printDialogVisible" width="60%">
            <el-button type="primary" @click="printDialogVisible = false">返回</el-button>
            <el-button type="success" v-print="'#printTest'"><svg-icon icon-class="print"/>打印</el-button>
                <div id="printTest">
                    <table border= "0" width="99.6%">
                        <thead>
                            <tr>
                                <th colspan="9">闲置设备处置申请表</th>
                            </tr>
                        </thead>
                    <tbody>
                        <tr>
                            <td colspan="2" style="border:none;text-align:left">存放地点:{{printList.storeAddress}}</td>
                            <td colspan="2" style="border:none;">原使用部门:{{printList.divisionName}}</td>
                            <!-- <td colspan="1" style="border:none">年</td>
                            <td colspan="1" style="border:none">月</td>
                            <td colspan="1" style="border:none">日</td> -->
                            <td colspan="3" style="border:none;text-align:right;">
                                <span>{{Y}}年</span>
                                <span>{{N}}月</span>
                                <span>{{M}}日</span>
                            </td>
                            <td colspan="3" style="border:none;text-align:right">金额单位:元</td>
                        </tr> 
                            
                        <tr>
                            <td style="border:1px solid black;width:100px">固定资产编号</td> 
                            <td >设备名称</td>
                            <td>型号规格</td> 
                            <td>采购时间</td>
                            <td>数量</td> 
                            <td>采购金额</td>
                            <td colspan="2">账面净值</td> 
                            <td>备注</td>
                        </tr>
                        <tr>
                            <td style="height:55px">{{printList.fixedAssetCode}}</td> 
                            <td>{{printList.fixedAssetName}}</td>
                            <td>{{printList.model}}</td> 
                            <td>{{printList.purchaseDate}}</td>
                            <td>{{printList.number}}</td> 
                            <td>{{printList.equipmentPrice}}</td>
                            <td colspan="2">{{printList.netBookValue}}</td> 
                            <td>{{printList.remark}}</td>
                        </tr>
                        <tr>
                            <td colspan="1">制造厂家</td>
                            <td colspan="8" style="text-align:left">{{printList.manufacturer}}</td>
                        </tr>

                        <tr style="height:65px">
                            <td colspan="1">处置形式</td>
                            <td colspan="3">报废/出售(<span v-if="scrapShow1">√</span>)　　　抵款(<span v-if="scrapShow2">√</span>)</td>
                            <td rowspan="5" style="height:200px">其他<br>事项<br>说明</td>
                            <td colspan="1">报废/抵款</td>
                            <td colspan="3" style="position: relative"><span style="position: absolute;top:0;left:0">预计的清理费用和清理收入说明:{{printList.clearingExpense}}</span></td>
                        </tr>
                        <tr style="height:50px">
                            <td rowspan="4" colspan="1">处置原因及目的（详细说明）</td>
                            <td rowspan="4" colspan="3">{{printList.handleReasonGoal}}</td>
                            <td rowspan="4" colspan="1">抵款</td>
                            <td colspan="1">买方单位</td>
                            <td colspan="2">{{printList.buyCompany}}</td>                          
                        </tr>
                        <tr>
                            <td colspan="1">购买用途</td>
                            <td colspan="2">{{printList.buyPurpose}}</td>
                        </tr>
                        <tr>
                            <td colspan="1">估价金额</td>
                            <td colspan="2">{{printList.evaluateMoney}}</td>
                        </tr>
                        <tr>
                            <td colspan="1">出售工厂</td>
                            <td colspan="2">{{printList.saleFactory}}</td>
                        </tr>
                        <tr>
                            <td colspan="9" style="height:45px">评审部门意见</td>
                        </tr>
                        <tr style="border-right:1px solid black;border-bottom:1px solid black">
                            <td colspan="1" style="text-align:left">①申请人</td>
                            <td colspan="5" style="border:0px;text-align:left"><div style="width:428px">意见:{{procedure}}</div></td>
                            <td colspan="2" style="border:0px;text-align:left">签名:{{procedurename}}</td>
                            <td colspan="1" style="border-right:1px solid black;border-left:none;text-align:left">日期:{{proceduredate}}</td>
                        </tr>    
                         <tr style="border-right:1px solid black;border-bottom:1px solid black"> 
                            <td colspan="1" style="text-align:left">②设备科负责人</td>
                            <td colspan="5" style="border:0px;text-align:left"><div style="width:428px">意见:{{fixing}}</div></td>
                            <td colspan="2" style="border:0px;text-align:left">签名:{{fixingname}}</td>
                            <td colspan="1" style="border-right:1px solid black;border-left:none;text-align:left">日期:{{fixingdate}}</td>
                        </tr>
                         <tr style="border-right:1px solid black;border-bottom:1px solid black">
                            <td colspan="1" style="text-align:left">③工厂厂长</td>
                            <td colspan="5" style="border:0px;text-align:left"><div style="width:428px">意见:{{factstyp}}</div></td>
                            <td colspan="2" style="border:0px;text-align:left">签名:{{factstypname}}</td>
                            <td colspan="1" style="border-right:1px solid black;border-left:none;text-align:left">日期:{{factstypdate}}</td>
                        </tr>
                         <tr style="border:1px solid black;border-bottom:1px solid black">
                            <td colspan="1" style="text-align:left">④分管设备副总经理</td>
                            <td colspan="5" style="border:0px;text-align:left"><div style="width:428px">意见:{{assigned}}</div></td>
                            <td colspan="2" style="border:0px;text-align:left">签名:{{assignedname}}</td>
                            <td colspan="1" style="border-right:1px solid black;border-left:none;text-align:left">日期:{{assigneddate}}</td>
                        </tr>   
                         <tr style="border-right:1px solid black;border-bottom:1px solid black">
                            <td colspan="1" style="text-align:left">⑤事业部总经理</td>
                            <td colspan="5" style="border:0px;text-align:left"><div style="width:428px">意见:{{enterprise}}</div></td>
                            <td colspan="2" style="border:0px;text-align:left">签名:{{enterprisename}}</td>
                            <td colspan="1" style="border-right:1px solid black;border-left:none;text-align:left">日期:{{enterprisedate}}</td>
                        </tr>
                         <tr style="border-right:1px solid black;border-bottom:1px solid black">
                            <td colspan="1" style="text-align:left">⑥财务部负责人</td>
                            <td colspan="5" style="border:0px;text-align:left"><div style="width:428px">意见:{{caiwuuser}}</div></td>
                            <td colspan="2" style="border:0px;text-align:left">签名:{{caiwuusername}}</td>
                            <td colspan="1" style="border-right:1px solid black;border-left:none;text-align:left">日期:{{caiwuuserdate}}</td>
                        </tr>
                         <tr style="border-right:1px solid black;border-bottom:1px solid black">
                            <td colspan="1" style="text-align:left">⑦资产部</td>
                            <td colspan="5" style="border:0px;text-align:left"><div style="width:428px">意见:{{cichanuser}}</div></td>
                            <td colspan="2" style="border:0px;text-align:left">签名:{{cichanusername}}</td>
                            <td colspan="1" style="border-right:1px solid black;border-left:none;text-align:left">日期:{{cichanuserdate}}</td>
                        </tr>
                         <tr style="border-right:1px solid black;border-bottom:1px solid black">
                            <td colspan="1" style="text-align:left">⑧董事长</td>
                            <td colspan="5" style="border:0px;text-align:left"><div style="width:428px">意见:{{neiqinuser}}</div></td>
                            <td colspan="2" style="border:0px;text-align:left">签名:{{neiqinusername}}</td>
                            <td colspan="1" style="border-right:1px solid black;border-left:none;text-align:left">日期:{{neiqinuserdate}}</td>
                        </tr>
                    </tbody>
                    </table>
                </div>
            </el-dialog>
        

    </el-container>
  </div>
</template>

<script>
import { fetchListdsy, evaluate, fetchPv, circuList, uploadlist, smallAblist, deleteapp, insertFile, updeletedata, getCurrentUser, conservation, referto, fetchList, storageAddress, stamplist, flowsheet } from '@/api/idleProcess/idleApplication'
import waves from '@/directive/waves' // 水波纹指令
import { fetchButton } from '@/api/common/button'
import { getProxyOrgList } from '@/api/common/common'// 代理组织
import { menuList } from '@/store/modules/permission'
import { baseUrl } from '@/api/common/fileBaseUrl'
export default {
  name: 'index',
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
      showflie: false,
      // 按钮权限
      menuCode: '',
      edit: false, // 编
      cutout: false, // 删
      addnewly: false, // 新
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
      totalsty: null,
      listQu: {
        pageNum: 1,
        pageSize: 10

      },

      // 打印字段
      printDialogVisible: false, // 打印
      scrapShow1: false,
      scrapShow2: false,
      idsypoi: '',
      mimeograph: false, // 不显示打印按钮
      Y: '',
      N: '',
      M: '',
      procedure: '', // 申请人
      fixing: '', // 设备科
      factstyp: '', // 工厂
      assigned: '', // 分管
      enterprise: '', // 事业部
      caiwuuser: '', // 财务
      cichanuser: '', // 资产部
      neiqinuser: '', // 内勤

      procedurename: '', // 申请人
      fixingname: '', // 设备科
      factstypname: '', // 工厂
      assignedname: '', // 分管
      enterprisename: '', // 事业部
      caiwuusername: '', // 财务
      cichanusername: '', // 资产部
      neiqinusername: '', // 内勤

      proceduredate: '', // 申请人
      fixingdate: '', // 设备科
      factstypdate: '', // 工厂
      assigneddate: '', // 分管
      enterprisedate: '', // 事业部
      caiwuuserdate: '', // 财务
      cichanuserdate: '', // 资产部
      neiqinuserdate: '', // 内勤
      userlists: {

      },
      printList: {

      },

      // 选中的导入信息
      selectionArr: [],
      multipleSelection: null,
      checkedIndex: '',
      // 引用台账的数据和字段
      equipmentList: [], // 引用台账的数据
      fiaxeCode: '', // 固定资产编号
      diionName: '', // 使用部门
      equntName: '', // 设备名称
      modelsty: '', // 型号规格
      number: 1, // 数量
      purseDate: '', // 采购时间
      eqmentPrice: '', // 采购金额
      netkValue: '', // 账面净值
      manufacturer: '', // 制造厂家
      soctId: '', // 设备闲置申请单id
      uPlace: '', // 存放地点
      chartData: '', // 流程图

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
      sidetate: '',
      // 弹框内输入框不填显示的提示信息
      rules: {
        storeAddress: [{ required: true, message: '请填写', trigger: 'change' }],
        handleReasonGoal: [{ required: true, message: '请填写', trigger: 'change' }],
        fixedAssetCode: [{ required: true, message: '请填写', trigger: 'change' }],
        divisionName: [{ required: true, message: '请填写', trigger: 'change' }],
        equipmentName: [{ required: true, message: '请填写', trigger: 'change' }],
        purchaseDate: [{ required: true, message: '请填写', trigger: 'change' }],
        model: [{ required: true, message: '请填写', trigger: 'change' }],
        number: [{ required: true, message: '请填写', trigger: 'change' }],
        equipmentPrice: [{ required: true, message: '请填写', trigger: 'change' }],
        netBookValue: [{ required: true, message: '请填写', trigger: 'change' }],
        // manufacturer: [{ required: true, message: '请填写', trigger: 'change' }]
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
    // ******* 文件预览**********
   handlePreview(row){
     console.log(row)
          if(this.dialogStatus == 'create'){
            var url = baseUrl + "onlinePreview?url=" +  encodeURIComponent(row.fileUrl)
          }else{
           var url = baseUrl + "onlinePreview?url=" +  encodeURIComponent(row.filePath)
           }
           var winHeight = window.document.documentElement.clientHeight-10;
          window.open(url, '_blank',"height=" + winHeight+ ",top=80,left=80,toolbar=no, menubar=no, scrollbars=yes, resizable=yes");
   },
// ******* 文件预览结束**********
    // 按钮的权限  afreshst speechst
    getbttonst() {
      menuList.forEach(item => {
        item.children.forEach(e => {
          if (e.name == 'idleApplication') {
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
            if (authority[i].buttonName == '新增') {
              this.addnewly = true
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
    // 单选项触发的事件(报废/损毁)
    kess() {
      this.dlestly = false
      this.dlisCodeState = true
      this.temp.buyCompany = ''
      this.temp.buyPurpose = ''
      this.temp.evaluateMoney = ''
      this.temp.saleFactory = ''
    },
    // 单选项触发的事件(出售)
    placing() {
      this.dlestly = true
      this.dlisCodeState = false
      this.temp.clearingExpense = ''
    },
    // 表格的接口
    getAA() {
      this.listLoading = true
      fetchListdsy(this.listQuery).then(response => {
        this.listyst = response.data.data.results
        console.log(this.listyst)
        // this.listyst.auditingTypeName = ''
        for (var i = 0; i < this.listyst.length; i++) {
          if (this.listyst[i].handleType == 1) {
            this.listyst[i].handleTypeName = '报废/出售'
          } else if (this.listyst[i].handleType == 2) {
            this.listyst[i].handleTypeName = '抵款'
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
      // 申请闲置时间  搜索
      if (this.value13 == null) {
        this.listQuery.applyDateStart = ''
        this.listQuery.applyDateEnd = ''
      } else {
        this.listQuery.applyDateStart = this.value13[0]// 开始时间
        this.listQuery.applyDateEnd = this.value13[1]
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
      console.log(row)
      const id = row.id
      this.idsypoi = row.id
      this.activeName = 'first'
      this.porisgid = row.processInstanceId
      this.dialogStatus = 'detail'
      this.dialogFormVisible = true
      this.siteCodeState = true
      this.sidetate = true
      this.hold1 = false
      this.referring1 = false
      this.referring2 = false
      this.hold2 = false
      this.fastener = false// 引用闲置待报废设备
      this.dlestly = true// 单选项（报废/损毁）
      this.dlisCodeState = true// 单选框（出售）
      this.showflie = false// 上传附件隐藏
      if (row.auditingType == 3) {
        this.mimeograph = true// 显示打印按钮
      } else {
        this.mimeograph = false// 不显示打印按钮
      }

      this.fromLoading = false// 弹窗加载动画
      this.roamshow = true// 流转记录显示
      this.newapps = false// 一号小表格重新验收删除按钮
      this.updelests = false// 一号小表格编辑删除按钮
      evaluate(id).then(response => {
        if (response.data.code == 200) {
          this.lookout = response.data.data
          this.temp = Object.assign({}, this.lookout)
          console.log(111111)
          console.log(this.temp)
          this.temp.netBookValue = row.netBookValue
          this.temp.purchaseDate = this.temp.purchaseDate.substring(0, 10)
          if (this.temp.handleType !== null) {
            this.temp.handleType = this.temp.handleType.toString()// 单选框判null
            console.log(this.temp.handleType)
          }
        }
      })

      this.circulationlist()
      // 第一个小表格接口
      const samllblist = {
        moduleType: 11,
        attachmentCode: 'XZSBCZSQDFJ',
        documentWordCode: row.formCode
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

    // 重置表单
    resetForm() {
      for (const i in this.temp) {
        this.temp[i] = ''
      }
      this.smallslist = [],
      this.userId = undefined
    },

    // 新增弹出框按钮
    handleCreate() {
      this.resetForm()
      this.activeName = 'first'
      this.fromLoading = false// 弹窗加载动画
      this.newapps = true// 一号小表格删除按钮
      this.updelests = false// 一号小表格编辑删除按钮
      this.dialogFormVisible = true
      this.siteCodeState = true// 不可编辑的
      this.sidetate = false
      this.dialogStatus = 'create'
      this.roamshow = false// 流转记录隐藏
      this.hold1 = true
      this.referring1 = true
      this.referring2 = false
      this.mimeograph = false// 不显示打印按钮
      //  this.temp.applyDate = new Date()
      this.showflie = true// 上传附件隐藏
      this.hold2 = false
      this.fastener = true// 引用闲置待报废设备
      this.getuserApp()// 获取当前用户
      this.dlestly = true// 单选项（报废/损毁）
      this.dlisCodeState = true// 单选框（出售）
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
            this.savPsuop()
          }
        }
      })
    },
    // 新增的保存
    savPsuop(row) {
      console.log(234555)
      console.log(this.temp)
      this.temp.files = this.smallslist
      this.fromLoading = true// 弹窗加载动画
      conservation(this.temp).then(response => {
        console.log(response.data)
        if (response.data.code == 200) {
          console.log(response.data.code)
          console.log(this.temp)
          this.listyst.unshift(this.temp)
          this.dialogFormVisible = false
          this.getAA()
          this.getlistsamll() // 第一个小表格list数据
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
    createData(row) {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
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
    createSubmit() {
      this.temp.files = this.smallslist
      this.fromLoading = true// 弹窗加载动画
      referto(this.temp).then(response => {
        console.log(response.data)
        if (response.data.code == 200) {
          console.log(response.data.code)
          console.log(this.temp)
          this.listyst.unshift(this.temp)
          this.dialogFormVisible = false
          this.getAA()
          this.getlistsamll() // 第一个小表格list数据
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
        const ids = {
          fileName: row.filePath
        }
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

    //  第一个下载的按钮
    downloadsty(row) {
      if (this.dialogStatus == 'create') {
        const att = row.fileName
        window.location.href = row.fileUrl + '?attname=' + att
        this.$message({
          title: '成功',
          message: '下载成功',
          type: 'success',
          duration: 2000
        })
      } else {
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
      this.activeName = 'first'
      this.siteCodeState = true
      this.sidetate = false
      this.dialogStatus = 'update'
      this.hold2 = true
      this.referring2 = true
      this.hold1 = false
      this.referring1 = false
      this.fastener = true// 引用闲置待报废设备
      this.getuserApp()// 获取当前用户
      this.dlestly = true// 单选项（报废/损毁）
      this.dlisCodeState = true// 单选框（出售）
      this.showflie = true// 上传附件隐藏
      this.mimeograph = false// 不显示打印按钮
      this.documenyt = row.formCode// 单号编码

      this.roamshow = false// 流转记录隐藏
      this.fromLoading = false// 弹窗加载动画
      evaluate(id).then(response => {
        this.popTitle = response.data.data
        this.temp = Object.assign({}, this.popTitle)
        console.log(this.popTitle)
        this.temp.netBookValue = row.netBookValue
        this.documenyt = this.popTitle.formCode// 单号编码

        console.log(this.documenyt)
        this.temp.purchaseDate = this.temp.purchaseDate.substring(0, 10)
        if (this.temp.handleType !== null) {
          this.temp.handleType = this.temp.handleType.toString()// 单选框判null
        }
      })
      this.dialogFormVisible = true
      this.newapps = false// 一号小表格重新验收删除按钮
      this.updelests = true// 一号小表格编辑删除按钮
      setTimeout(() => {
        this.getlistsamll() // 第一个小表格list数据
      }, 1 * 500)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 获取当前用户信息  disposalForm
    getuserApp() {
      getCurrentUser().then(response => {
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
        const orgsty = response.data.data.sysCurrentPersonDTO.orgName
        if (orgsty == '资产部') {
          this.disposalForm = false
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
    // 确认按钮(提交)
    changeOrgOk() {
      if (this.temp.proxyOrgCode == undefined || this.temp.proxyOrgCode == '' || this.temp.proxyOrgCode == null) {
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
    // 确认按钮(保存)  chanDpol
    chanDpol() {
      if (this.temp.proxyOrgCode == undefined || this.temp.proxyOrgCode == '' || this.temp.proxyOrgCode == null) {
        this.temp.proxyOrgCode = this.comCode
        if (this.dialogStatus == 'create') {
          this.savPsuop()
        }
      } else {
        if (this.dialogStatus == 'create') {
          this.savPsuop()
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

    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
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
          const tempData = Object.assign({}, this.temp)
          console.log(tempData)
          /*   tempData.auditingType = 1 */
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

    // 第一个小表格接口 getlistsamll()    getlisttwo()
    getlistsamll() {
      const samllblist = {
        moduleType: 11,
        attachmentCode: 'XZSBCZSQDFJ',
        documentWordCode: this.documenyt
      }
      smallAblist(samllblist).then(response => {
        this.smallslist = response.data.data
      })
    },

    // 第一个文件上传
    fileUpload(e) {
      console.log(1234)
      const file = e.target.files[0]
      console.log(file)
      const fileData1 = {
        attachmentCode: 'XZSBCZSQDFJ',
        moduleType: '11',
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
                  this.fromLoading = false
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
              this.fromLoading = false
              const test = document.getElementById('uploadImg')
              test.value = ''
            }
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

    // 打印
    printData() {
      const params = this.idsypoi
      stamplist(params).then(response => {
        if (response.data.code == 200) {
          this.printList = response.data.data
          if (this.printList.handleType == 1) {
            this.scrapShow1 = true
            this.scrapShow2 = false
          } else if (this.printList.handleType == 2) {
            this.scrapShow1 = false
            this.scrapShow2 = true
          } else {
            this.scrapShow1 = false
            this.scrapShow2 = false
          }
          this.Y = this.printList.applyDate.substring(0, 4)
          this.N = this.printList.applyDate.substring(5, 7)
          this.M = this.printList.applyDate.substring(8, 10)
          this.userlists = response.data.data.list
          for (var i = 0; i < this.userlists.length; i++) {
            if (this.userlists[i].taskName == '流程开始') {
              this.procedure = this.userlists[i].opinion // 申请人
              this.procedurename = this.userlists[i].userName
              this.proceduredate = this.userlists[i].dateTime.substring(0, 10)
            } else if (this.userlists[i].taskName == '设备科负责人') {
              this.fixing = this.userlists[i].opinion// 设备科
              this.fixingname = this.userlists[i].userName
              this.fixingdate = this.userlists[i].dateTime.substring(0, 10)
            } else if (this.userlists[i].taskName == '工厂厂长') {
              this.factstyp = this.userlists[i].opinion// 工厂
              this.factstypname = this.userlists[i].userName
              this.factstypdate = this.userlists[i].dateTime.substring(0, 10)
            } else if (this.userlists[i].taskName == '分管设备副总') {
              this.assigned = this.userlists[i].opinion// 分管
              this.assignedname = this.userlists[i].userName
              this.assigneddate = this.userlists[i].dateTime.substring(0, 10)
            } else if (this.userlists[i].taskName == '事业部总经理') {
              this.enterprise = this.userlists[i].opinion// 事业部
              this.enterprisename = this.userlists[i].userName
              this.enterprisedate = this.userlists[i].dateTime.substring(0, 10)
            } else if (this.userlists[i].taskName == '财务负责人') {
              this.caiwuuser = this.userlists[i].opinion// 财务
              this.caiwuusername = this.userlists[i].userName
              this.caiwuuserdate = this.userlists[i].dateTime.substring(0, 10)
            } else if (this.userlists[i].taskName == '资产部') {
              this.cichanuser = this.userlists[i].opinion// 资产部
              this.cichanusername = this.userlists[i].userName
              this.cichanuserdate = this.userlists[i].dateTime.substring(0, 10)
            } else if (this.userlists[i].taskName == '内勤报董事长并处理') {
              this.neiqinuser = this.userlists[i].opinion// 内勤
              this.neiqinusername = this.userlists[i].userName
              this.neiqinuserdate = this.userlists[i].dateTime.substring(0, 10)
            }
          }
          console.log(2323)
          console.log(this.printList)
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
      this.listQu.equipmentName = ''
      this.listQu.fixedAssetCode = ''
      this.listQu.model = ''
      this.listQu.pageNum = 1
      this.listQu.pageSize = 10
      this.multipleSelection = ''
      this.checkedIndex = ''
    },
    // 复选勾选触发的事件
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
      // 取存放地点字段的接口 this.multipleSelection.id

      /*  storageAddress(row.id).then(response => {
        console.log(3777777777)
        console.log(response.data.data)
        this.uPlace = response.data.data.unusedPlace// 存放地点
      }) */
    },
    handleSelectAll(val) {
      this.$message({
        title: '警告',
        message: '请选择一条要引用的信息',
        type: 'warning',
        duration: 2000
      })
    },
    handleSelectionChange(val) {

    },
    //  一览表点击确认带过来的值
    affirmlist() {
      if (this.checkedIndex != 1) {
        this.$message({
          title: '提示',
          message: '请选择一条引用信息',
          type: 'warning',
          duration: 3000
        })

        return
      }

      this.soctId = this.multipleSelection.id// 设备闲置申请单id
      this.fiaxeCode = this.multipleSelection.fixedAssetCode// 固定资产编号
      this.diionName = this.multipleSelection.divisionName// 使用部门
      this.equntName = this.multipleSelection.equipmentName// 设备名称
      this.modelsty = this.multipleSelection.model// 型号规格
      this.number = 1// 数量
      this.purseDate = this.multipleSelection.purchaseDate.substring(0, 10)// 采购时间
      this.eqmentPrice = this.multipleSelection.equipmentPrice// 采购金额
      this.netkValue = this.multipleSelection.netBookValue// 账面净值
      this.manufacturer = this.multipleSelection.manufacturer// 制造厂家

      this.temp.accountId = this.soctId// 设备闲置申请单id
      this.temp.fixedAssetCode = this.fiaxeCode
      this.temp.divisionName = this.diionName
      this.temp.equipmentName = this.equntName
      this.temp.model = this.modelsty
      this.temp.number = 1
      this.temp.purchaseDate = this.purseDate
      this.temp.equipmentPrice = this.eqmentPrice
      this.temp.netBookValue = this.netkValue
      this.temp.manufacturer = this.manufacturer
      this.temp.storeAddress = this.uPlace// 存放地点
      this.dialoglookVisible = false
    },

    // 表格的接口
    getListaccount() {
      this.adhibitLoading = true
      fetchList(this.listQu).then(response => {
        this.equipmentList = response.data.data.results
        console.log(12345)
        console.log(this.equipmentList)
        for (var i = 0; i < this.equipmentList.length; i++) {
          if (this.equipmentList[i].equipmentStatus == 1) {
            this.equipmentList[i].equipmentTypename = '新设备'
          } else if (this.equipmentList[i].equipmentStatus == 2) {
            this.equipmentList[i].equipmentTypename = '完好'
          } else if (this.equipmentList[i].equipmentStatus == 3) {
            this.equipmentList[i].equipmentTypename = '维修'
          } else if (this.equipmentList[i].equipmentStatus == 4) {
            this.equipmentList[i].equipmentTypename = '闲置完好'
          } else if (this.equipmentList[i].equipmentStatus == 5) {
            this.equipmentList[i].equipmentTypename = '闲置待报废'
          } else if (this.equipmentList[i].equipmentStatus == 6) {
            this.equipmentList[i].equipmentTypename = '报废'
          }
          if (this.equipmentList[i].equipmentType == 1) {
            this.equipmentList[i].equipmentStatusname = '一般设备'
          } else if (this.equipmentList[i].equipmentType == 2) {
            this.equipmentList[i].equipmentStatusname = '关键设备'
          } else if (this.equipmentList[i].equipmentType == 3) {
            this.equipmentList[i].equipmentStatusname = '主要设备'
          }
          if (this.equipmentList[i].purchaseDate == null) {
            this.equipmentList[i].purchaseDate = ''
          } else if (this.equipmentList[i].purchaseDate == '') {
            this.equipmentList[i].purchaseDate = ''
          }
        }
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

/* #printTest{
    margin-top:10px;
} */
#printTest table{
    border-collapse:collapse;
    width: 99.6%;
}
#printTest table thead th{
    font-size: 20px;
    padding:10px;
}
#printTest table tbody tr{
    font-size:14px;
}
#printTest table tbody td{
    height: 48px;
    border: 1px solid black;    
    text-align: center;
}
#printTest table tbody td span{
    margin-right:20px;
}

.el-tree-node__content:hover {
  background-color: #6dc6fa;
  border-radius:3%
} 
.el-table thead tr .el-checkbox__input{
  display: none;
}
#pic{
  width:100%;
}    
</style>
