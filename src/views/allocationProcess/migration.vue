<template>
  <div class="app-container">
    <!--外部容器 -->
    <el-container>
       <!-- 顶部搜索 -->
        <div class="filter-container">
       
            <div class="formSearch">
            <el-form :inline="true">
                 
                <el-form-item label="单据编号">
                <el-input v-model="listQuery.formCode"  style="width:230px" placeholder="请输入单据编号" clearable></el-input>
                </el-form-item>
                
                <el-form-item label="固定资产编号" >
                <el-input class="minier-input" v-model="listQuery.fixedAssetCode" placeholder="请输入固定资产编号" clearable></el-input>
                </el-form-item>
                           
                <el-form-item label="设备名称" >
                <el-input class="minier-input" v-model="listQuery.equipName" placeholder="请输入设备名称" clearable></el-input>
                </el-form-item>
               
                <el-form-item label="型号规格" >
                <el-input class="minier-input" v-model="listQuery.equipType" placeholder="请输入型号规格" clearable></el-input>
                </el-form-item>
            
                <el-form-item label="申请时间" >
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
                    <el-select v-model="listQuery.auditingType" style="width:213px" clearable  placeholder="请选择审核状态">
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
                <el-table-column prop="applicationTime" align="center" label="申请时间" min-width="80">
                   <template slot-scope="scope">
                   {{scope.row.applicationTime!==null?scope.row.applicationTime.substring(0,10):''}}
                 </template>

                 </el-table-column>
                 <el-table-column prop="transferOutDepartmentName" align="center" label="调出部门" min-width="80">
                 </el-table-column>
                 <el-table-column prop="transferInDepartmentName" align="center" label="调入部门" min-width="80">
                 </el-table-column>
                <el-table-column prop="fixedAssetCode" align="center" label="固定资产编号" min-width="80">
                 </el-table-column>
               <el-table-column prop="equipName" align="center" label="设备名称" min-width="80">
                 </el-table-column>
               <el-table-column prop="equipType" align="center" label="型号规格" min-width="80">
                </el-table-column>
               <el-table-column prop="depreciationPeriod" align="center" label="折旧年限" min-width="80">
                 </el-table-column>
               <el-table-column prop="usedPeriod" align="center" label="已用年限" min-width="80">
                 </el-table-column>
               <el-table-column prop="auditingTypeName" align="center" label="审核状态" min-width="80">
                 </el-table-column>
               <el-table-column prop="currentOpUser" align="center" label="当前处理人" min-width="80">
                 </el-table-column>
            
              <el-table-column align="center" label="操作" min-width="150" fixed="right" class-name="small-padding fixed-width">
                <template slot-scope="scope"><!-- v-if="edit"   v-if="cutout"  v-if="afreshst" -->
                  <el-button title="编辑" type="primary" :disabled="scope.row.stateshow?true:false" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-if="edit"></el-button>
                  <el-button title="删除" type="danger" :disabled="scope.row.deleshow?true:false" icon="el-icon-delete" size="mini"  @click="deleteBtn(scope.row)" v-if="cutout"></el-button> 
                  <!-- <el-button title="重新验收" type="warning" :disabled="scope.row.newshow?true:false" icon="el-icon-refresh" size="mini"  @click="newlyBtn(scope.row)" ></el-button> -->
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
          <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" v-dialogDrag top="8vh" width="870px" :visible.sync="dialogFormVisible" >
             <!-- 选项卡 -->
            <el-tabs v-model="activeName" v-loading="fromLoading" @tab-click="fathClick">
             <el-tab-pane label="表单信息" name="first">
              <el-form :rules="rules" ref="dataForm" :model="temp" label-width="110px">
              <el-form-item>
                <span class="equip-title">设备厂内迁移单</span>
              </el-form-item>
             <el-row>
              <el-col :span="8">     
              <el-form-item label="单据编号"  prop="formCode">
              <el-input style="width:230px" v-model="temp.formCode" disabled maxlength="32" class="enter medium-input" placeholder="空" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="16">     
              <el-form-item label="申请时间"  prop="applicationTime" style="margin-left:100px;">
              <el-input style="width:270px" v-model="temp.applicationTime" :disabled='siteCodeState?true:false' maxlength="32" class="enter medium-input" placeholder="输入申请时间" ></el-input>
              </el-form-item>
               </el-col>
              </el-row>
             
              <el-row>
              <el-col :span="8">     
              <el-form-item label="调出部门"  prop="transferOutDepartmentName">
              <el-input style="width:230px" v-model="temp.transferOutDepartmentName" :disabled='siteCodeState?true:false' maxlength="32" class="enter medium-input" placeholder="输入调出部门" ></el-input>
              </el-form-item>
               </el-col>  <!-- v-model="radio" value="listQuery.factoryCode"  -->
              <el-col :span="16">
              <el-form-item label="调入部门" prop="transferInDepartmentName" style="margin-left:100px;"> 
              <el-input v-model="temp.transferInDepartmentName" value="radio" :disabled='siteCodeState?true:false' maxlength="8" style="width:270px" class="enter medium-input" placeholder="请输入调入部门" ></el-input>
              <div class="buttonplace" id="buttstyps" @click="treeco" v-show='shoPoyt'>选择</div>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">     
              <el-form-item label="固定资产编号" prop="fixedAssetCode">
              <el-input v-model="temp.fixedAssetCode" maxlength="8" :disabled='siteCodeState?true:false' style="width:230px" class="enter medium-input" placeholder="请输入固定资产编号" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="设备名称" prop="equipName" style="margin-left:100px;">
              <el-input v-model="temp.equipName" maxlength="8" :disabled='siteCodeState?true:false' style="width:270px" class="enter medium-input" placeholder="请输入设备名称" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">     
              <el-form-item label="型号规格" prop="equipType"> 
              <el-input v-model="temp.equipType" :disabled='siteCodeState?true:false' maxlength="8" style="width:230px" class="enter medium-input" placeholder="请输入型号规格" ></el-input>   
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="出厂编号" prop="serialNumber" style="margin-left:100px;"> 
              <el-input v-model="temp.serialNumber" maxlength="8" :disabled='siteCodeState?true:false' style="width:270px" class="enter medium-input" placeholder="请输入出厂编号" ></el-input>   
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">
              <el-form-item label="制造厂家" prop="manufacturer"> 
              <el-input v-model="temp.manufacturer" :disabled='siteCodeState?true:false' maxlength="8" style="width:230px" class="enter medium-input" placeholder="请输入制造厂家" ></el-input>   
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="数量" prop="nums" style="margin-left:100px"> 
              <el-input v-model="temp.nums" :disabled='siteCodeState?true:false' maxlength="8" style="width:270px" class="enter medium-input" placeholder="请输入数量/单位:台" ></el-input>
               <span style="padding:0px;font-size:20px;font-weight:800;">台</span>   
              </el-form-item>
              </el-col>
              </el-row>

               <el-row>
              <el-col :span="8">
              <el-form-item label="折旧年限" prop="depreciationPeriod"> 
              <el-input v-model="temp.depreciationPeriod" :disabled='siteCodeState?true:false' maxlength="8" style="width:230px" class="enter medium-input" placeholder="请输入折旧年限" ></el-input>
               <span style="position:absolute;top:0px;right:-86px;padding:0px;font-size:20px;font-weight:800;">年</span>   
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="已用年限" prop="usedPeriod" style="margin-left:100px"> 
              <el-input v-model="temp.usedPeriod" :disabled='siteCodeState?true:false' maxlength="8" style="width:270px" class="enter medium-input" placeholder="请输入已用年限" ></el-input>
              <span style="padding:0px;font-size:20px;font-weight:800;">年</span>   
              </el-form-item>
              </el-col>
              </el-row>

               <el-row>
              <el-col :span="8">
              <el-form-item label="财务原值" prop="originalFinancialValue"> 
              <el-input v-model="temp.originalFinancialValue" :disabled='siteCodeState?true:false' maxlength="8" style="width:230px" class="enter medium-input" placeholder="请输入财务原值" ></el-input>
              <span style="position:absolute;top:0px;right:-86px;padding:0px;font-size:20px;font-weight:800;">元</span>   
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="账面净值" prop="netBookValue" style="margin-left:100px"> 
              <el-input v-model="temp.netBookValue" :disabled='siteCodeState?true:false' maxlength="8" style="width:270px" class="enter medium-input" placeholder="请输入账面净值" ></el-input>
              <span style="padding:0px;font-size:20px;font-weight:800;">元</span>   
              </el-form-item>
              </el-col>
              </el-row>

               <el-form-item label="备注" prop="remark" label-width="120px">
               <el-input type="textarea" :disabled='sitposty?true:false' style="width:640px" maxlength="200" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入备注" v-model="temp.remark">
               </el-input>
              </el-form-item>

               <el-form-item label="调拨原因" prop="reason" label-width="120px">
               <el-input type="textarea" :disabled='sitposty?true:false' style="width:640px" maxlength="200" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入调拨原因" v-model="temp.reason">
               </el-input>
              </el-form-item>

               <el-form-item label="其他说明" prop="otherDescription" label-width="120px">
               <el-input type="textarea" :disabled='sitposty?true:false' style="width:640px" maxlength="200" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入其他说明" v-model="temp.otherDescription">
               </el-input>
              </el-form-item>
             
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="流转记录" name="second" v-if="roamshow">
             <!-- 流转记录表格 -->
             <el-table :data="circulation" v-loading="listLoading" border fit highlight-current-row
              style="width: 100%;min-height:auto;margin-top:8px" :header-cell-style="{background:'oldlace'}">

                <el-table-column  align="center" label="序号" min-width="48" type="index"></el-table-column>
                
               <el-table-column prop="taskName" align="center" label="步骤名" min-width="92">
                 <template slot-scope="scope">
                 <span>{{scope.row.taskName}}</span>
                 </template>
                </el-table-column>

                <el-table-column prop="userName" align="center" label="操作人" min-width="89">
                 <template slot-scope="scope">
                 <span>{{scope.row.userName}}</span>
                 </template>
                </el-table-column>

                <el-table-column prop="orgName" align="center" label="所在部门" min-width="89">
                 <template slot-scope="scope">
                 <span>{{scope.row.orgName}}</span>
                 </template>
                </el-table-column>

                <el-table-column prop="stationName" align="center" label="岗位" min-width="89">
                 <template slot-scope="scope">
                 <span>{{scope.row.stationName}}</span>
                 </template>
                </el-table-column>

                 <el-table-column prop="state" align="center" label="状态" min-width="89">
                 <template slot-scope="scope">
                 <span>{{scope.row.state}}</span>
                 </template>
                </el-table-column>

                 <el-table-column prop="opinion" align="center" label="意见" min-width="89">
                 <template slot-scope="scope">
                 <span>{{scope.row.opinion}}</span>
                 </template>
                </el-table-column>

                <el-table-column prop="dateTime" align="center" label="时间" min-width="133">
                 <template slot-scope="scope">
                 <span>{{scope.row.dateTime}}</span>
                 </template>
                </el-table-column>

                 <el-table-column prop="remark" align="center" label="备注" min-width="111">
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
            <el-button type="primary" @click="chanDpol" v-if="posyRpo">确定</el-button>
          </div>
        </el-dialog>
          </el-dialog>

            <!-- 引用选择设备调拨（设备台账）弹框 -->
          <el-dialog title="选择设备" :close-on-click-modal="false" top="10vh" width="1290px" :visible.sync="dialoglookVisible"> 
         
          <div class="filter-container">
            <div class="formSearch">
            <el-form :inline="true">

              <el-form-item label="设备名称">
              <el-input v-model="listQu.equipName"  placeholder="请输入设备名称" clearable></el-input>
              </el-form-item>

              <el-form-item label="固定资产编号">
              <el-input class="minier-input" v-model="listQu.fixedAssetCode" placeholder="请输入固定资产编号" clearable></el-input>
              </el-form-item>

              <el-form-item label="型号规格">
              <el-input class="minier-input" v-model="listQu.equipType" placeholder="请输入型号规格" clearable></el-input>
              </el-form-item>

              <el-form-item label="出厂编号">
                <el-input class="filter-item input" placeholder="请输入出厂编号" v-model="listQu.serialNumber">
                </el-input>
              </el-form-item>
              
              <el-form-item>
              <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilterst">搜索</el-button>
              </el-form-item>
            </el-form>
            </div>
        </div>
         <!-- 引用台账的字段设备 -->
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

                 <el-table-column prop="assetOwnershipCompanyName" align="center" label="资产归属公司" min-width="120">
                 </el-table-column>

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

         <!-- 使用部门的弹框 -->
          <el-dialog title="调入部门" v-loading="facttLoading" :visible.sync="treeFormVisible" :modal="false">
           <span style="margin-left:20px;color:red" >{{yease}}</span> 
           <el-tree :data="datast" :props="defaultProps" @node-click="handleNodeClick" check-strictly ref="tree" node-key="orgCode" show-checkbox @check-change="handleClick" ></el-tree>
           <div slot="footer" class="dialog-footer">
              <el-button @click="treeFormVisible = false">取消</el-button>
              <el-button type="primary" @click="applist">确认</el-button>
            </div>
          </el-dialog>
            <el-dialog title="设备厂内迁移单预览" v-dialogDrag :close-on-click-modal="false" :visible.sync="printDialogVisible" width="99.5%">
        <el-button type="primary" @click="printDialogVisible = false">返回</el-button>
        <el-button type="success" v-print="'#printTest2'"><svg-icon icon-class="print"/>打印</el-button>
				<div id="printTest2">
					<table border= "0" width="99.5%">
          <thead>
                   <tr>
                     <th colspan="12">{{daolist.transferInCompanyName}}</th>
                   </tr>
                   <tr>
                      <th colspan="12">设备厂内迁移单</th>
                   </tr>
                   <tr>
                     <td colspan="12"><span>调出单位：{{daolist.transferOutCompanyName}} / {{daolist.transferOutFactoryName}} / {{daolist.transferOutDepartmentName}}</span></td>
                   </tr>
                    <tr>
                     <td colspan="6"><span>调入单位：{{daolist.transferInCompanyName}} / {{daolist.transferInFactoryName}} / {{daolist.transferInDepartmentName}}</span></td>
                     <td colspan="6" style="text-align:right"><span>编号：{{daolist.formCode}}</span></td>
                   </tr>

             </thead>

            <tbody>
              <tr >
                <td rowspan="2" style="text-align:center;border:1px solid black;">固定资产编号</td>
                <td rowspan="2" style="text-align:center;border:1px solid black;">设备名称</td>
                <td rowspan="2" style="text-align:center;border:1px solid black;">型号规格</td>
                <td rowspan="2" style="text-align:center;border:1px solid black;">出厂编号</td>
                <td rowspan="2" style="text-align:center;border:1px solid black;">制造厂家</td>
                <td rowspan="2" style="text-align:center;border:1px solid black;">数量</td>

                <td rowspan="2" style="text-align:center;border:1px solid black;">单位</td>
                <td colspan="2" style="text-align:center;border:1px solid black;">年限</td>
                <td colspan="2" style="text-align:center;border:1px solid black;">固定资产价值（元）</td>
                <td rowspan="2" style="text-align:center;border:1px solid black;">备注</td>
                
              </tr>
              <tr>
                <td style="text-align:center;border:1px solid black;">折旧</td>
                <td style="text-align:center;border:1px solid black;">已用</td>
                <td style="text-align:center;border:1px solid black;">原值</td>
                <td style="text-align:center;border:1px solid black;">净值</td>
              </tr>

             
               <tr style="height:50px">
                <td style="text-align:center;border:1px solid black;">{{daolist.fixedAssetCode}}</td>
                <td style="text-align:center;border:1px solid black;">{{daolist.equipName}}</td>
                <td style="text-align:center;border:1px solid black;">{{daolist.equipType}}</td>
                <td style="text-align:center;border:1px solid black;">{{daolist.serialNumber}}</td>
                <td style="text-align:center;border:1px solid black;">{{daolist.manufacturer}}</td>
                <td style="text-align:center;border:1px solid black;">{{daolist.nums}}</td>

                <td style="text-align:center;border:1px solid black;">台</td>
                <td style="text-align:center;border:1px solid black;">{{daolist.depreciationPeriod}}</td>
                <td style="text-align:center;border:1px solid black;">{{daolist.usedPeriod}}</td>
                <td style="text-align:center;border:1px solid black;">{{daolist.originalFinancialValue}}</td>
                <td style="text-align:center;border:1px solid black;">{{daolist.netBookValue}}</td>
                <td style="text-align:center;border:1px solid black;">{{daolist.remark}}</td>
              
              </tr>
           <tr style="height:70px">
             <td colspan="1" style="border:1px solid black">调拨原因</td>
             <td colspan="11" style="text-align:left;border:1px solid black">{{daolist.reason}}</td>
           </tr>
            <tr style="height:70px">
             <td colspan="1" style="border:1px solid black">其他说明</td>
             <td colspan="11" style="text-align:left;border:1px solid black">{{daolist.otherDescription}}</td>
           </tr>
           <tr style="height:50px">
             <td colspan="2" style="border:1px solid black">经办人签字</td>
             <td colspan="3" style="border:1px solid black">设备科长签字</td>
             <!-- <td colspan="2">调出厂签字</td> -->
             <td colspan="2" style="border:1px solid black">设备副总签字</td>
             <td colspan="3" style="border:1px solid black">资产部副部长签字</td>
             <td colspan="2" style="border:1px solid black">资产部盖章</td>
           </tr>   
           <tr style="height:50px">
             <td colspan="2" style="border:1px solid black;border-bottom:none" align=“left” valign="top"><div style="width:265px">意见：{{operator}}</div></td>
             <td colspan="3" style="border:1px solid black;border-bottom:none" align=“left” valign="top"><div style="width:265px">意见：{{branch}}</div></td>
             <!-- <td colspan="2" align=“left” valign="top">意见：</td> -->
             <td colspan="2" style="border:1px solid black;border-bottom:none" align=“left” valign="top"><div style="width:205px">意见：{{fuzong}}</div></td>
             <td colspan="3" style="border:1px solid black;border-bottom:none" align=“left” valign="top"><div style="width:265px">意见：{{zichan}}</div></td>
             <td colspan="2" style="border:1px solid black;border-bottom:none" align=“left” valign="top"><div style="width:265px">意见：</div></td>
           </tr>
             <tr style="height:40px">
             <td colspan="2" style="border:1px solid black;border-bottom:none;border-top:none">经办人：{{operatorname}}</td>
             <td colspan="3" style="border:1px solid black;border-bottom:none;border-top:none">经办人：{{branchname}}</td>
             <!-- <td colspan="2" style="border-top:1px solid #fff">经办人：</td> -->
             <td colspan="2" style="border:1px solid black;border-bottom:none;border-top:none">经办人：{{fuzongname}}</td>
             <td colspan="3" style="border:1px solid black;border-bottom:none;border-top:none">经办人：{{zichanname}}</td>
             <td colspan="2" style="border:1px solid black;border-bottom:none;border-top:none">经办人：</td>
           </tr>
           <tr style="height:40px">
             <td colspan="2" style="border:1px solid black;border-top:none">日期：{{operatordate}}</td>
             <td colspan="3" style="border:1px solid black;border-top:none">日期：{{branchdate}}</td>
             <!-- <td colspan="2" style="border-top:1px solid #fff">日期：</td> -->
             <td colspan="2" style="border:1px solid black;border-top:none">日期：{{fuzongdate}}</td>
             <td colspan="3" style="border:1px solid black;border-top:none">日期：{{zichandate}}</td>
             <td colspan="2" style="border:1px solid black;border-top:none">日期：</td>
             </tr>
            </tbody>
          </table>
				</div>
			</el-dialog>

    </el-container>
  </div>
</template>

<script>
import { fetchListdsy, evaluate, fetchPv, circuList, getCurrentUser, conservation, referto, fetchList, storageAddress, dendrogram, selist, flowsheet } from '@/api/allocationProcess/migration'
import waves from '@/directive/waves' // 水波纹指令
import { fetchButton } from '@/api/common/button'
import { getProxyOrgList } from '@/api/common/common'// 代理组织
import { menuList } from '@/store/modules/permission'// 按钮权限
export default {
  name: 'migration',
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
        pageSize: 10,
        type: 3
      },
      // 编辑的字段设置
      temp: {

      },
      smallslist: [], // 第一个小表格1
      newapps: false, // 一号小表格删除按钮
      updelests: false, // 一号小表格删除按钮

      // 文件数据
      fileData: [],
      fileName: undefined,
      fileNameSC: undefined, // 文件名称
      fileUrl: undefined, // 文件URL
      documenyt: '', // 单据编码的赋值
      userId: undefined, // 用户id

      // 打印数据
      printDialogVisible: false, // 打印
      suggestShow: false,
      historyList: {

      },
      daolist: {

      },
      operator: '', // 经办人
      branch: '', // 部门
      fuzong: '', // 副总
      zichan: '', // 资产部

      operatorname: '', // 经办人
      branchname: '', // 部门
      fuzongname: '', // 副总
      zichanname: '', // 资产部

      operatordate: '', // 经办人
      branchdate: '', // 部门
      fuzongdate: '', // 副总
      zichandate: '', // 资产部
      mimeograph: false, // 打印按钮不显示
      shenbottl: '', // 审核状态
      idspou: '', //

      // 按钮权限
      edit: false, // 编
      cutout: false, // 删
      addnewly: false, // 重新验收
      speechst: false, // 生成设备质量验收报告

      activeName: 'first', // 选项卡默认选项
      roamshow: false, // 流转记录隐藏
      idList: '', // 获取id
      chartData: '', // 流程图
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
      shoPoyt: false,
      // 引用闲置待报废设备
      fastener: false, // 引用闲置待报废设备
      dialoglookVisible: false, // 弹窗属性（引用闲置待报废设备）
      totalsty: null,
      listQu: {
        pageNum: 1,
        pageSize: 10,
        type: 3
      },
      // 使用部门树的数据
      datast: [],
      setlist: [],
      defaultProps: {
        children: 'children',
        label: 'orgFullName'
      },
      radio: '', // 使用部门
      yease: '',

      i: 0,
      treeFormVisible: false, // 使用部门树选择
      // 选中的导入信息
      selectionArr: [],
      multipleSelection: null,
      checkedIndex: '',
      // 引用的数据和字段
      equipmentList: [], // 引用台账的数据
      fixedAssetCode: '', // 固定资产编号
      transferOutDepartmentName: '', // 调出部门
      transferOutDepartment: '',
      equipName: '', // 设备名称
      equipType: '', // 型号规格
      manufacturer: '', // 制造厂家
      serialNumber: '', // 出厂编号
      depreciationPeriod: '', // 折旧年限
      usedPeriod: '', // 已用年限
      originalFinancialValue: '', // 财务原值
      netBookValue: '', // 账面净值
      companyName: '', // 使用公司

      gomngs: '', // 使用工厂
      gomngsName: '', // 使用工厂名字
      menuCode: '', // 按钮权限
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
      facttLoading: true, // 树的加载动画
      fromLoading: true, // 弹出框加载动画
      dialogPvVisible: false,
      siteCodeState: '', // 岗位编码禁用状态
      sitposty: '', // 禁用状态
      // 弹框内输入框不填显示的提示信息
      rules: {
        //  applicationTime: [{ required: true, message: '请选择', trigger: 'change' }],
        acceptanceSituation: [{ required: true, message: '请选择', trigger: 'change' }],
        reason: [{ required: true, message: '请填写', trigger: 'change' }],
        transferOutDepartmentName: [{ required: true, message: '请填写', trigger: 'change' }],
        transferInDepartmentName: [{ required: true, message: '请选择', trigger: 'change' }],
        fixedAssetCode: [{ required: true, message: '请填写', trigger: 'change' }],
        equipName: [{ required: true, message: '请填写', trigger: 'change' }],
        equipType: [{ required: true, message: '请填写', trigger: 'change' }],
        serialNumber: [{ required: true, message: '请填写', trigger: 'change' }],
        // manufacturer: [{ required: true, message: '请填写', trigger: 'change' }],
        nums: [{ required: true, message: '请填写', trigger: 'change' }],
        //  depreciationPeriod: [{ required: true, message: '请填写', trigger: 'change' }],
        usedPeriod: [{ required: true, message: '请填写', trigger: 'change' }]
        //  originalFinancialValue: [{ required: true, message: '请填写', trigger: 'change' }],
        //  netBookValue:[{ required: true, message: '请填写', trigger: 'change' }]

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
          if (e.name == 'migration') {
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
            if (this.listyst[i].acceptanceType !== 0 || this.listyst[i].auditingType !== 3) {
              this.listyst[i].newshow = true
            }
            if (this.listyst[i].acceptanceType !== 1 || this.listyst[i].auditingType !== 3) {
              this.listyst[i].produceshow = true
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
      this.idspou = row.id
      this.porisgid = row.processInstanceId
      this.dialogStatus = 'detail'
      this.dialogFormVisible = true
      this.siteCodeState = true
      this.sitposty = true
      this.hold1 = false
      this.referring1 = false
      this.referring2 = false
      this.hold2 = false
      this.shoPoyt = false
      this.fastener = false// 引用闲置待报废设备
      this.activeName = 'first'// 选项卡默认选项
      if (row.auditingType == 3) {
        this.mimeograph = true// 按钮显示
      } else {
        this.mimeograph = false// 按钮不显示
      }

      this.fromLoading = false// 弹窗加载动画
      this.roamshow = true// 流转记录显示

      evaluate(id).then(response => {
        if (response.data.code == 200) {
          this.lookout = response.data.data
          this.temp = Object.assign({}, this.lookout)
          if (this.temp.applicationTime !== null) {
            this.temp.applicationTime = this.temp.applicationTime.substring(0, 10)
          }
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
        this.circulation = []
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
      this.yease = ''
      this.userId = undefined
      /*  this.temp.proxyOrgCode = undefined // 代理组织
      this.temp.proxyOrgName = undefined  */
    },

    // 新增弹出框按钮
    handleCreate() {
      this.resetForm()
      this.fromLoading = false// 弹窗加载动画
      this.dialogFormVisible = true
      this.siteCodeState = true// 不可编辑的
      this.sitposty = false// 可编辑
      this.dialogStatus = 'create'
      this.roamshow = false// 流转记录隐藏
      this.hold1 = true
      this.activeName = 'first'// 选项卡默认选项
      this.referring1 = true
      this.referring2 = false
      this.mimeograph = false// 打印按钮不显示
      this.hold2 = false
      this.shoPoyt = true
      this.fastener = true// 引用调拨设备
      this.getuserApp()// 获取当前用户
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 新增提交
    createData() {
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
      console.log(266665)
      console.log(this.temp)
      this.temp.type = 3// 迁移单标识
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
    //  新增保存
    saveData(row) {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.proxyOrgList.length != 0) {
            this.changeOrgVisible = true
            this.posyl = false // 提交时候
            this.posyRpo = true
          } else {
            this.temp.proxyOrgCode = this.comCode
            this.savPstot()
          }
        }
      })
    },
    // 新增的保存
    savPstot(row) {
      console.log(234555)
      console.log(this.temp)
      this.temp.type = 3// 迁移单标识
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
      this.sitposty = false// 可编辑
      this.dialogStatus = 'update'
      this.hold2 = true
      this.referring2 = true
      this.hold1 = false
      this.referring1 = false
      this.shoPoyt = true
      this.fastener = true// 引用闲置待报废设备
      this.getuserApp()// 获取当前用户
      this.activeName = 'first'// 选项卡默认选项
      this.mimeograph = false// 打印按钮不显示

      this.roamshow = false// 流转记录隐藏
      this.fromLoading = false// 弹窗加载动画
      evaluate(id).then(response => {
        this.popTitle = response.data.data
        this.temp = Object.assign({}, this.popTitle)
        console.log(this.popTitle)
        this.documenyt = this.popTitle.formCode// 单号编码
        console.log(this.documenyt)
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
        /* else if (this.dialogStatus == 'update') {
          this.updataSubmit()
        } */
      }
      this.changeOrgVisible = false
    },
    // 确认按钮（保存）
    chanDpol() {
      if (this.temp.proxyOrgName == undefined || this.temp.proxyOrgName == '' || this.temp.proxyOrgName == null) {
        this.temp.proxyOrgCode = this.comCode
        if (this.dialogStatus == 'create') {
          this.savPstot()
        }
      } else {
        if (this.dialogStatus == 'create') {
          this.savPstot()
        }
      }
      this.changeOrgVisible = false
    },
    // 编辑提交按钮
    /*  updateData() {
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
          this.temp.id = this.idList
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

    //  打印
    printData() {
      const params = this.idspou
      selist(params).then(response => {
        if (response.data.code == 200) {
          this.daolist = response.data.data
          console.log(this.daolist)
          this.hislist = response.data.data.historyList
          for (var i = 0; i < this.hislist.length; i++) {
            if (this.hislist[i].taskName == '流程开始') {
              this.operator = this.hislist[i].opinion// 经办人
              this.operatorname = this.hislist[i].userName
              this.operatordate = this.hislist[i].dateTime.substring(0, 10)
            } else if (this.hislist[i].taskName == '设备科长') {
              this.branch = this.hislist[i].opinion// 部门
              this.branchname = this.hislist[i].userName
              this.branchdate = this.hislist[i].dateTime.substring(0, 10)
            } else if (this.hislist[i].taskName == '设备副总') {
              this.fuzong = this.hislist[i].opinion// 副总
              this.fuzongname = this.hislist[i].userName
              this.fuzongdate = this.hislist[i].dateTime.substring(0, 10)
            } else if (this.hislist[i].taskName == '资产部副部长') {
              this.zichan = this.hislist[i].opinion// 资产部
              this.zichanname = this.hislist[i].userName
              this.zichandate = this.hislist[i].dateTime.substring(0, 10)
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
      this.listQu.serialNumber = ''
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
      //  divisionCode divisionName
      this.temp.transferOutDepartmentName = this.multipleSelection.divisionName// 调出部门
      this.temp.transferOutDepartment = this.multipleSelection.divisionCode
      this.temp.equipName = this.multipleSelection.equipmentName// 设备名称
      this.temp.equipType = this.multipleSelection.model// 型号规格
      this.temp.manufacturer = this.multipleSelection.manufacturer// 制造厂家
      this.temp.serialNumber = this.multipleSelection.serialNumber// 出厂编号
      this.temp.depreciationPeriod = this.multipleSelection.depreciationPeriod // 折旧年限
      this.temp.factoryCode = this.multipleSelection.factoryCode// 使用工厂
      this.gomngsName = this.multipleSelection.factoryName
      this.gomngs = this.temp.factoryCode
      var dateLy = new Date()
      var yearst = dateLy.getFullYear()
      console.log(yearst)
      if (yearst == 2018) {
        this.temp.usedPeriod = 0// 已用年限
      } else if (yearst == 2019) {
        this.temp.usedPeriod = 1// 已用年限
      }
      this.temp.nums = 1
      this.temp.originalFinancialValue = this.multipleSelection.originalFinancialValue// 财务原值
      this.temp.netBookValue = this.multipleSelection.netBookValue// 账面净值
      this.temp.transferInCompanyName = this.multipleSelection.companyName // 使用公司
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

    // 使用部门的树选择按钮
    treeco() {
      if (this.gomngs == '') {
        this.$notify({
          title: '提示',
          message: '请选择设备再点击',
          type: 'warning',
          duration: 3000
        })
        return
      } else {
        this.treeFormVisible = true
        this.treestyps()
      }
    },
    // 设置树状图单选
    handleClick(data, checked, node) {
      this.i++
      if (this.i % 2 == 0) {
        if (checked) {
          console.log(checked)
          console.log(data)
          this.$refs.tree.setCheckedNodes([])
          this.$refs.tree.setCheckedNodes([data])
          // this.listQuery.factoryCode = data.orgCode
          // 交叉点击节点
        } else {
          this.$refs.tree.setCheckedNodes([])
          // 点击已经选中的节点，置空
        }
      }
    },
    // 节点
    getCheckedNodes() {
      this.treeData = this.$refs.tree.getCheckedNodes()
      this.radio = this.treeData[0].orgCode
      this.yease = this.treeData[0].orgFullName
    },
    // 确认按钮
    applist() {
      this.getCheckedNodes()
      this.temp.transferInDepartmentName = this.yease
      this.temp.transferInDepartment = this.radio
      this.treeFormVisible = false
    },
    // 树状图的点击方法
    handleNodeClick(data) {

    },

    // 使用部门的接口
    treestyps() {
      this.datast.splice(0)
      this.facttLoading = true
      const orgCode = {
        orgCode: this.gomngs
      }
      dendrogram(orgCode).then(response => {
        this.setlist.push(response.data.data)
        this.setlist.children = response.data.data
        this.datast = [
          {
            orgFullName: this.gomngsName,
            children: this.setlist.children,
            orgType: '公司'
          }
        ]
        // this.datalisy.push(response.data.data)
        console.log(this.datast)
        console.log(234567)

        console.log(this.datast)
        if (this.datast !== null) {
          for (var i = 0; i < this.datast.length; i++) {
            if (this.datast[i].orgType == '公司') {
              this.datast[i].disabled = true
            }
            /*  console.log(this.datast[i].children) */
            for (var j = 0; j < this.datast[i].children.length; j++) {
            /*  console.log(this.datast[i].children[j]) */
              const child = this.datast[i].children[j]
              if (child.orgType == '公司') {
                child.disabled = true
              }
              if (child.children !== null) {
                for (var p = 0; p < child.children.length; p++) {
                  const rosyt = child.children[p]
                  if (rosyt.orgType == '公司') {
                    rosyt.disabled = true
                  }
                  if (rosyt.children !== null) {
                    for (var k = 0; k < rosyt.children.length; k++) {
                      const postdis = rosyt.children[k]
                      if (postdis.orgType == '公司') {
                        postdis.disabled = true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      })
      this.$nextTick(() => {
        this.facttLoading = false
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
#buttstyps{
   width:42px;
   height:36px;
   cursor:pointer;
   text-align:center;
 }
 .buttonplace{
height:36px;
background:#409EFF;
color:#fff;
border:1px solid #fff;
position:absolute;
right:26px;
top:0;
border-radius: 5px;
}

/* #printTest{
  margin-top:10px;
} */
#printTest2 table{
  border-collapse:collapse;
}
#printTest2 table thead th{
  font-size: 20px;
  padding:10px;
}
#printTest2 table tbody tr{
  height:30px;
  font-size:14px;
}
/* #printTest table tbody td{
   width:25%; 
} */
#printTest2 table tbody td span{
  margin-right:20px;
}

/* @page {
  size: A4 landscape;
} */
.el-table thead tr .el-checkbox__input{
  display: none;
}
 #pic{
  width:97%;
}   
</style>
