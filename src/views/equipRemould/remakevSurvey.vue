<template>
  <div class="app-container">
    <!--外部容器 -->
    <el-container>
       <!-- 顶部搜索 -->
      
     <!--  -->
        <div class="filter-container">
          
            <div class="formSearch">
            <el-form :inline="true">
              
                <el-form-item label="改造记录编号">
                <el-input v-model="listQuery.formCode"  placeholder="请输入改造记录编号" clearable></el-input>
                </el-form-item>
             
                <el-form-item label="改造备案单号">
                <el-input class="minier-input" v-model="listQuery.recordCode" placeholder="请输入改造备案单号" clearable></el-input>
                </el-form-item>
               
                <el-form-item label="固定资产编号">
                <el-input class="minier-input" v-model="listQuery.fixedAssetCode" placeholder="请输入固定资产编号" clearable></el-input>
                </el-form-item>
               
                 <el-form-item label="设备名称">
                <el-input class="minier-input" v-model="listQuery.equipmentName" placeholder="请输入设备名称" clearable></el-input>
                </el-form-item>
            
                <el-form-item >
                <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
                </el-form-item>
            </el-form>
            </div>
          
        </div>
     
    
      <!-- 内容容器 -->
    
          <!-- 主要区域容器 -->
          <el-main style="padding:20px 0px">
            <el-button class="filter-item" @click="derivation" type="primary" icon="el-icon-edit" v-if="afreshst">导出</el-button>
         <!-- :default-sort="{prop: 'equipmentName', order: 'descending'}"   -->
            <el-table :data="listyst" v-loading="listLoading" border fit highlight-current-row
              style="width: 100%;min-height:auto;margin-top:8px" height="500" :header-cell-style="{background:'oldlace'}" >
                 <!-- <el-table-column  align="center" label="序号" min-width="80" type="index"></el-table-column> -->
                <el-table-column prop="formCode" align="center" fixed="left" label="改造记录编号" min-width="100">
                <template slot-scope="scope">
                 <span class="link-type futiop" @click='checkDetails(scope.row)'>{{scope.row.formCode}}</span>
                 </template>
                 </el-table-column>
               <el-table-column prop="recordCode" align="center" fixed="left" label="改造备案单号" min-width="100">
                 </el-table-column>
                <el-table-column prop="fixedAssetCode" align="center" fixed="left" label="固定资产编号" min-width="80">
                 </el-table-column>
                 <el-table-column prop="typeSpecification" align="center" fixed="left" label="型号规格" min-width="80">
                 </el-table-column>
             <!--  <el-table-column prop="equipmentTypeCode" align="center" label="设备类型" min-width="80">
                 </el-table-column> -->
               <el-table-column prop="filingTime " align="center" label="备案时间" min-width="80">
                  <template slot-scope="scope">
                  {{scope.row.filingTime!==null?scope.row.filingTime.substring(0,10):''}}
                  </template>
                 </el-table-column>
               <el-table-column sortable prop="equipmentName" align="center" label="设备名称" min-width="120">
                 </el-table-column>
                <el-table-column sortable prop="companyName" align="center" label="使用公司" min-width="120">
                 </el-table-column>
                <el-table-column prop="factoryName" align="center" label="使用工厂" min-width="80">
                 </el-table-column>
                <el-table-column sortable prop="divisionName" align="center" label="使用部门" min-width="120">
                 </el-table-column>
                <el-table-column prop="projectInsideName" align="center" label="项目内部名称" min-width="80">
                 </el-table-column>
                <el-table-column sortable prop="projectExternalName" align="center" label="项目外部名称" min-width="80">
                 </el-table-column>
                <el-table-column prop="requestTime" align="center" label="项目要求完成时间" min-width="80">
                   <template slot-scope="scope">
                  {{scope.row.requestTime!==null?scope.row.requestTime.substring(0,10):''}}
                  </template> 
                 </el-table-column>
                <el-table-column prop="suggestName" align="center" label="设备改造建议" min-width="80">
                 </el-table-column>
                  <el-table-column prop="isProjectName" align="center" label="是否立项" min-width="80">
                 </el-table-column>
                 <el-table-column prop="context" align="center" label="改造具体内容" min-width="80">
                 </el-table-column>
                 <el-table-column prop="supplier" align="center" label="改造供应商" min-width="80">
                 </el-table-column>
                <el-table-column prop="actualCost" align="center" label="改造实际费用" min-width="80">
                 </el-table-column>
                <el-table-column prop="priceShouldFinishTime" align="center" label="定价应完成时间" min-width="80">
                   <template slot-scope="scope">
                  {{scope.row.priceShouldFinishTime!==null?scope.row.priceShouldFinishTime.substring(0,10):''}}
                  </template>
                 </el-table-column>
                <el-table-column prop="priceFinishTime" align="center" label="定价实际完成时间" min-width="80">
                   <template slot-scope="scope">
                  {{scope.row.priceFinishTime!==null?scope.row.priceFinishTime.substring(0,10):''}}
                  </template>
                 </el-table-column>
                <el-table-column prop="transferTime" align="center" label="资料移交招标组时间" min-width="80">
                   <template slot-scope="scope">
                  {{scope.row.transferTime!==null?scope.row.transferTime.substring(0,10):''}}
                  </template>
                 </el-table-column>
                <el-table-column prop="acceptanceTime" align="center" label="改造开箱验收时间" min-width="80">
                 <template slot-scope="scope">
                  {{scope.row.acceptanceTime!==null?scope.row.acceptanceTime.substring(0,10):''}}
                  </template>
                 </el-table-column>
                 <el-table-column prop="installationCompleted" align="center" label="改造安装完成时间" min-width="80">
                 <template slot-scope="scope">
                  {{scope.row.installationCompleted!==null?scope.row.installationCompleted.substring(0,10):''}}
                  </template>
                 </el-table-column>

                <el-table-column prop="invoiceNumber" align="center" label="改造发票信息" min-width="180">
                 <!--  <template slot-scope="scope">
                  <div v-for="item in scope.row.equipBasis.invoiceInfos" :key="item.id" style="padding:5px;">
                    <span v-if="item.code">{{item.code}}/</span>
                    <span v-if="item.price">{{item.price}}</span>
                    <span v-if="item.date">/{{item.date}}</span>
                    </div>
                  </template>   -->
                 </el-table-column>
                <el-table-column prop="contractNumber" align="center" label="改造合同编号" min-width="80">
                 </el-table-column>
                <el-table-column prop="payMethod" align="center" label="付款方式" min-width="80">
                 </el-table-column>
                <el-table-column prop="archiveNumber" align="center" label="存档编号" min-width="80">
                 </el-table-column>
                <el-table-column prop="contractFilingDate" align="center" label="合同归档日期" min-width="80">
                  <template slot-scope="scope">
                  {{scope.row.contractFilingDate!==null?scope.row.contractFilingDate.substring(0,10):''}}
                  </template>
                 </el-table-column>
                <el-table-column prop="contractDeliveryDate" align="center" label="合同交货日期" min-width="80">
                  <template slot-scope="scope">
                  {{scope.row.contractDeliveryDate!==null?scope.row.contractDeliveryDate.substring(0,10):''}}
                  </template>
                 </el-table-column>

               
                <el-table-column label="合同要求付款情况" align="center" min-width="100">
               <el-table-column prop="contractSubsistPrice" align="center" label="预付款金额" min-width="100">
                </el-table-column>
               <el-table-column prop="contractSubsistDate" align="center" label="预付款时间" min-width="100">
                 <template slot-scope="scope">
                  {{scope.row.contractSubsistDate!==null?scope.row.contractSubsistDate.substring(0,10):''}}
                  </template>
                </el-table-column>
                <el-table-column prop="contractShipmentPrice" align="center" label="发货款金额" min-width="100">
                </el-table-column>
                <el-table-column prop="contractShipmentDate" align="center" label="发货款时间" min-width="100">
                   <template slot-scope="scope">
                  {{scope.row.contractShipmentDate!==null?scope.row.contractShipmentDate.substring(0,10):''}}
                  </template>
                </el-table-column>
                 <el-table-column prop="contractAcceptancePrice" align="center" label="验收款金额" min-width="100">
                </el-table-column>
                <el-table-column prop="contractAcceptanceDate" align="center" label="验收款时间" min-width="100">
                   <template slot-scope="scope">
                  {{scope.row.contractAcceptanceDate!==null?scope.row.contractAcceptanceDate.substring(0,10):''}}
                  </template>
                </el-table-column>
                 <el-table-column prop="contractWarrantyPrice" align="center" label="质保金金额" min-width="100">
                </el-table-column>
                <el-table-column prop="contractWarrantyDate" align="center" label="质保金时间" min-width="100">
                  <template slot-scope="scope">
                  {{scope.row.contractWarrantyDate!==null?scope.row.contractWarrantyDate.substring(0,10):''}}
                  </template>
                </el-table-column>
               </el-table-column> 

                <el-table-column label="实际付款情况" align="center" min-width="100">
               <el-table-column prop="realSubsistPrice" align="center" label="预付款金额" min-width="100">
                </el-table-column>
               <el-table-column prop="realSubsistDate" align="center" label="预付款时间" min-width="100">
                 <template slot-scope="scope">
                  {{scope.row.realSubsistDate!==null?scope.row.realSubsistDate.substring(0,10):''}}
                  </template>
                </el-table-column>
                <el-table-column prop="realShipmentPrice" align="center" label="发货款金额" min-width="100">
                </el-table-column>
                <el-table-column prop="realShipmentDate" align="center" label="发货款时间" min-width="100">
                   <template slot-scope="scope">
                  {{scope.row.realShipmentDate!==null?scope.row.realShipmentDate.substring(0,10):''}}
                  </template>
                </el-table-column>
                 <el-table-column prop="realAcceptancePrice" align="center" label="验收款金额" min-width="100">
                </el-table-column>
                <el-table-column prop="realAcceptanceDate" align="center" label="验收款时间" min-width="100">
                   <template slot-scope="scope">
                  {{scope.row.realAcceptanceDate!==null?scope.row.realAcceptanceDate.substring(0,10):''}}
                  </template>
                </el-table-column>
                 <el-table-column prop="realWarrantyPrice" align="center" label="质保金金额" min-width="100">
                </el-table-column>
                <el-table-column prop="realWarrantyDate" align="center" label="质保金时间" min-width="100">
                   <template slot-scope="scope">
                  {{scope.row.realWarrantyDate!==null?scope.row.realWarrantyDate.substring(0,10):''}}
                  </template>
                </el-table-column>
               </el-table-column> 

                <el-table-column label="改造验收" align="center" min-width="100">
               <el-table-column prop="newEquipAcceptanceCycle" align="center" label="验收周期" min-width="100">
                </el-table-column>
               <el-table-column prop="acceptanceShouldTime" align="center" label="要求完成时间" min-width="80">
                  <template slot-scope="scope">
                  {{scope.row.acceptanceShouldTime!==null?scope.row.acceptanceShouldTime.substring(0,10):''}}
                  </template> 
                </el-table-column>
                <el-table-column prop="realAcceptanceShouldTime" align="center" label="实际完成时间" min-width="100">
                   <template slot-scope="scope">
                  {{scope.row.realAcceptanceShouldTime!==null?scope.row.realAcceptanceShouldTime.substring(0,10):''}}
                  </template>
                </el-table-column>
               </el-table-column>

                <el-table-column label="改造质保验收" align="center" min-width="100">
               <el-table-column prop="newEquipWarrantyCycle" align="center" label="验收周期" min-width="100">
                </el-table-column>
               <el-table-column prop="warrantyShouldTime" align="center" label="要求完成时间" min-width="80">
                  <template slot-scope="scope">
                  {{scope.row.warrantyShouldTime!==null?scope.row.warrantyShouldTime.substring(0,10):''}}
                  </template>
                </el-table-column>
                 <el-table-column prop="realWarrantyShouldTime" align="center" label="实际完成时间" min-width="80">
                   <template slot-scope="scope">
                  {{scope.row.realWarrantyShouldTime!==null?scope.row.realWarrantyShouldTime.substring(0,10):''}}
                  </template>
                </el-table-column>
               </el-table-column>
                <el-table-column prop="createTime" align="center" label="生成时间" min-width="100">
                </el-table-column>
                                                          <!-- v-if="edit" -->
                <el-table-column fixed="right" align="center" label="操作" min-width="150"  class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <!-- @click="handleUpdate(scope.row)" -->
                  <el-button title="编辑" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-if="edit"></el-button>
                   <el-button title="删除" type="danger"  icon="el-icon-delete" size="mini"  @click="deleteBtn(scope.row)" v-if="cutout"></el-button>
                  <!-- <el-button title="转修" type="success" size="mini" icon="el-icon-refresh" @click="transfer(scope.row)"></el-button> -->
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
              :page-sizes="[10,20,50,100]" 
              :page-size="listQuery.pageSize" 
              layout="total, sizes, prev, pager, next, jumper" 
              :total="total">
              </el-pagination>
            </div>
          </el-footer>
           <!-- 编辑是同一个弹出框 -->
          <el-dialog :title="textMap[dialogStatus]" v-dialogDrag top="10vh" width="1260px" :visible.sync="dialogFormVisible">
             <el-form :rules="rules" ref="dataForm" :model="temp" label-width="100px">

              <el-row>
              <el-col :span="6">
              <el-form-item label="改造记录编号" prop="formCode"  label-width="110px"> 
              <el-input v-model="temp.formCode" maxlength="32" value="temp.fixedAssetCode"  style="width:190px" class="enter medium-input judge" placeholder="请输入改造记录编号" :disabled='siteCodeState'></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="6">     
              <el-form-item label="改造备案单号" prop="recordCode" label-width="110px">
              <el-input v-model="temp.recordCode" style="width:190px" :disabled='siteCodeState'  maxlength="32" oninput="this.value=this.value.replace(/[^0-9A-z\.]/g,'')" class="enter medium-input" placeholder="请输入改造备案单号" ></el-input>
              </el-form-item>
              </el-col>
                <el-col :span="6">     
              <el-form-item label="固定资产编号" prop="fixedAssetCode" label-width="110px">
              <el-input v-model="temp.fixedAssetCode" style="width:190px" :disabled='siteCodeState'  maxlength="32" oninput="this.value=this.value.replace(/[^0-9A-z\.]/g,'')" class="enter medium-input" placeholder="请输入固定资产编号" ></el-input>
              </el-form-item>
              </el-col>
               <el-col :span="6">     
              <el-form-item label="型号规格" prop="typeSpecification" label-width="110px">
              <el-input v-model="temp.typeSpecification" style="width:190px" :disabled='siteCodeState'  maxlength="32" oninput="this.value=this.value.replace(/[^0-9A-z\.]/g,'')" class="enter medium-input" placeholder="请输入固定资产编号" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>
              <el-row>
             <!--  <el-col :span="6">     
              <el-form-item label="设备类型" prop="equipmentTypeCode">
              <el-input v-model="temp.equipmentTypeCode" style="width:190px" :disabled='siteCodeState'  maxlength="32" oninput="this.value=this.value.replace(/[^0-9A-z\.]/g,'')" class="enter medium-input" placeholder="请输入设备类型" ></el-input>
              </el-form-item>
              </el-col> -->
              <el-col :span="6">
               <el-form-item label="设备名称" prop="equipmentName"> 
              <el-input v-model="temp.equipmentName" maxlength="32" style="width:190px" :disabled='siteCodeState' class="enter medium-input" placeholder="请输入设备名称" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="6">     
              <el-form-item label="备案时间" prop="filingTime" label-width="107px">
              <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.filingTime"
                  type="date"
                  placeholder="选择日期"
                  default-value
                  format="yyyy-MM-dd"
                   disabled>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="6">
              <el-form-item label="使用公司" prop="companyCode"  label-width="110px"> 
              <el-input v-model="temp.companyName" value='temp.companyCode' :disabled='siteCodeState' style="width:190px" class="enter medium-input" placeholder="请选择使用公司" ></el-input>
              <!-- <div class="buttonplace" id="buttstyps" @click="treeco">选择</div> -->
              </el-form-item>
              </el-col>
              <el-col :span="6">
              <el-form-item label="使用工厂" prop="factoryCode"> 
              <el-input v-model="temp.factoryName" value='temp.factoryCode' style="width:190px" class="enter medium-input" :disabled='siteCodeState' placeholder="请选择使用工厂" ></el-input>
               <!-- <div class="buttonplace" id="buttstyps" @click="manufactory">选择</div> -->
              </el-form-item>
              </el-col>
               <el-col :span="6">
              <el-form-item label="使用部门" prop="divisionCode">
              <el-input v-model="temp.divisionName" value='temp.divisionCode' style="width:190px" :disabled='siteCodeState' class="enter medium-input" placeholder="请选择使用部门" ></el-input>
              <!-- <div class="buttonplace" id="buttstyps" @click="treesection">选择</div> -->
              </el-form-item>     
              </el-col>
              <el-col :span="6">
              <el-form-item label="是否立项" prop="isProjectApproval"  label-width="110px"> 
              <!-- <el-input v-model="temp.isProjectApproval" :disabled='siteCodeState'  style="width:190px" class="enter medium-input" placeholder="请输入是否立项" ></el-input> -->
              <el-radio :disabled='siteCodeState'  v-model="temp.isProjectApproval" label="0">是</el-radio>
              <el-radio :disabled='siteCodeState'  v-model="temp.isProjectApproval" label="1">否</el-radio>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="6">
              <el-form-item label="项目内部名称" prop="projectInsideName"  label-width="110px"> 
              <el-input v-model="temp.projectInsideName" :disabled='siteCodeState'  style="width:190px" class="enter medium-input" placeholder="请输入项目内部名称" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="6">
              <el-form-item label="项目外部名称" prop="projectExternalName"  label-width="110px"> 
              <el-input v-model="temp.projectExternalName" :disabled='siteCodeState'  style="width:190px" class="enter medium-input" placeholder="请输入项目外部名称" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="6">     
              <el-form-item label="项目要求完成时间" prop="requestTime" label-width="134px">
              <div class="block">
                <el-date-picker
                  style="width:180px"
                  v-model="temp.requestTime"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd HH:mm:ss"
                   disabled>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              <el-col :span="6">
              <el-form-item label="设备改造建议" prop="suggest "  label-width="110px"> 
              <!-- <el-input v-model="temp.suggest " :disabled='siteCodeState'  style="width:190px" class="enter medium-input" placeholder="请输入设备改造建议" ></el-input> -->
              <el-radio :disabled='siteCodeState'  v-model="temp.suggest" label="0">内部</el-radio>
              <el-radio :disabled='siteCodeState'  v-model="temp.suggest" label="1">外部</el-radio>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
               <el-col :span="6">
              <el-form-item label="项目组长" prop="projectLeaderName"  label-width="110px"> 
              <el-input v-model="temp.projectLeaderName" :disabled='siteCodeState'  style="width:190px" class="enter medium-input" placeholder="请输入项目组长" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="6">
              <el-form-item label="技术负责人" prop="technologyLeaderName"  label-width="110px"> 
              <el-input v-model="temp.technologyLeaderName" :disabled='siteCodeState'  style="width:190px" class="enter medium-input" placeholder="请输入技术负责人" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="6">
              <el-form-item label="预算金额" prop="estimateMoney"  label-width="110px"> 
              <el-input v-model="temp.estimateMoney" :disabled='siteCodeState'  style="width:190px" class="enter medium-input" placeholder="请输入预算金额" ></el-input>
              </el-form-item>
              </el-col>
               </el-row>

               <el-row>
              <el-form-item label="改造具体内容" prop="context" label-width="120px">
               <el-input type="textarea" v-model="temp.context" :disabled='siteCodeState' style="width:1098px" maxlength="128" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入改造具体内容">
               </el-input>
              </el-form-item>
              </el-row>

            <el-row>
              <el-col :span="6">
              <el-form-item label="改造供应商" prop="supplier"  label-width="110px"> 
              <el-input v-model="temp.supplier" :disabled='siteC'  style="width:190px" class="enter medium-input" placeholder="请输入改造供应商" ></el-input>
              </el-form-item>
              </el-col>
               <el-col :span="6">     
              <el-form-item label="改造实际费用" prop="actualCost"  label-width="110px"> 
              <el-input v-model="temp.actualCost" :disabled='siteC' maxlength="32"  style="width:170px" class="enter medium-input" placeholder="请输入改造实际费用" ></el-input>
               <span style="padding:0px;font-size:20px;font-weight:800;">元</span>
              </el-form-item>
              </el-col>
              <el-col :span="6">
              <el-form-item label="立项下达时间" prop="releaseTime" label-width="110px"> 
              <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.releaseTime"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd HH:mm:ss"
                   :disabled='siteC'>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
            </el-row>

              <el-row>
              <el-col :span="6">
              <el-form-item label="定价应完成时间" prop="priceShouldFinishTime" label-width="110px"> 
              <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.priceShouldFinishTime"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd HH:mm:ss"
                   :disabled='siteC'>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
               <el-col :span="6">
              <el-form-item label="定价实际完成时间" prop="priceFinishTime"  label-width="130px"> 
              <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.priceFinishTime"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd HH:mm:ss"
                   :disabled='siteC'>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
                <el-col :span="6">
              <el-form-item label="资料移交招标组时间" prop="transferTime"  label-width="160px"> 
              <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.transferTime"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd HH:mm:ss"
                   :disabled='siteC'>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              </el-row>
           
              <el-row>
              <el-col :span="6">
              <el-form-item label="改造开箱验收时间" prop="acceptanceTime"  label-width="130px"> 
              <div class="block">
                <el-date-picker
                  style="width:170px"
                  v-model="temp.acceptanceTime"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd HH:mm:ss"
                   :disabled='siteC'>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              <el-col :span="6">
              <el-form-item label="改造安装完成时间" prop="installationCompleted"  label-width="150px"> 
              <div class="block">
                <el-date-picker
                  style="width:170px"
                  v-model="temp.installationCompleted"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  disabled>
                <!--  @change="variety" -->
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              </el-row>
              <el-row>
              <el-col :span="2">
                <el-form-item label="改造发票信息" style="padding:0px 3px 0 0">
              </el-form-item>
              </el-col>
              <el-col :span="12">
              <li style="list-style:none;float:left;margin:5px 10px;" v-for="(nalist, index) in list" :key="index">
              <el-input v-model="list[index].invoiceNumber" :disabled='siteC' clearable maxlength="32" style="width:150px" class="enter medium-input" placeholder="请输入发票号"></el-input>
              <el-input v-model="list[index].invoicePrice" :disabled='siteC' clearable style="width:220px" maxlength="32" class="enter medium-input" placeholder="请输入发票金额(只输数字)/元" onkeypress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46 || /\.\d\d{2}$/.test(value))event.returnValue=false" onchange="if(/\D/.test(this.value)){alert('只能输入数字');this.value='';}"></el-input>
               <!-- <span style="padding:0px;font-size:20px;font-weight:800;">元</span> -->
             <!--  <el-input v-model="invoiceInfoArrays[index].c" :disabled='siteC' style="width:150px" maxlength="32" class="enter medium-input" placeholder="请输入发票金额/单位:元"></el-input>     onkeyup="this.value=this.value.replace(/\D/g,'')"-->
               <el-date-picker
                  style="width:150px"
                  v-model="list[index].invoiceDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                 value-format="yyyy-MM-dd" :disabled='siteC'>
                </el-date-picker>
                 
              </li>
              <!-- </ul> -->
              <span style="color:#409EFF;font-size:16px;display:inline-block;margin-top:10px;" v-if="plusShow"  @click.prevent="addRow()"><i class="el-icon-plus"></i></span>
              <span style="color:red;font-size:16px" @click.prevent="delRow()" v-if="delShow"><i class="el-icon-minus"></i></span>
              </el-col>
              </el-row>


               <!-- <div class="line_01"><span>合同要求付款期</span></div> -->
              <div class="line_05">—————<span>合同要求付款期</span>————————————</div>

              <el-row>
               <el-col :span="6">
              <el-form-item label="付款方式" prop="roles">
                <el-select v-model="roles" style="width:240px" placeholder="请选择付款方式" multiple filterable :disabled='siteC'>
                  <el-option
                    v-for="item in deviceclass"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value" :disabled='siteC'>
                  </el-option>
                </el-select>
                <!-- <p v-show="false">{{ roles }}</p> -->
              </el-form-item>
            </el-col>

             
               <el-col :span="6" style="margin-left:30px">
              <el-form-item label="合同编号" prop="contractNumber"  label-width="110px"> 
              <el-input v-model="temp.contractNumber" :disabled='siteC' maxlength="32"  style="width:190px" class="enter medium-input" placeholder="请输入合同编号" ></el-input>
              </el-form-item>
              </el-col>
               <el-col :span="6" style="margin-left:5px">
              <el-form-item label="存档编号" prop="archiveNumber" label-width="110px"> 
              <el-input v-model="temp.archiveNumber" :disabled='siteC' maxlength="64"  style="width:190px" class="enter medium-input" placeholder="请输入存档编号" ></el-input>
              </el-form-item>
              </el-col>
              </el-row> 

              <el-row>
              <el-col :span="6">
              <el-form-item label="合同归档日期" prop="contractFilingDate"  label-width="110px"> 
              <div class="block">
                <el-date-picker
                  style="width:230px"
                  v-model="temp.contractFilingDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd HH:mm:ss"
                   :disabled='siteC'>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
               <el-col :span="6" style="margin-left:30px">
              <el-form-item label="合同交货时间" prop="contractDeliveryDate" label-width="110px"> 
               <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.contractDeliveryDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :disabled='siteC'>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="12">    
              <el-form-item label="预付款金额(合同约定)" prop="contractSubsistPrice" label-width="150px">
              <el-input v-model="temp.contractSubsistPrice" :disabled='siteC'  style="width:190px"  maxlength="32" class="enter medium-input" placeholder="请输入付款金额/单位:元" onkeyup="value=value.replace(/[^\d.]/g,'')"></el-input>
              <span style="padding:0px;font-size:20px;font-weight:800;">元</span>
              </el-form-item>
              </el-col>
              <el-col :span="12">
              <el-form-item label="预付款时间(合同约定)" prop="contractSubsistDate"  label-width="150px"> 
             <div class="block">
                <el-date-picker
                  style="width:220px"
                  v-model="temp.contractSubsistDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :disabled='siteC'>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="12">
              <el-form-item label="发货款金额(合同约定)" prop="contractShipmentPrice"  label-width="150px"> 
                <el-input v-model="temp.contractShipmentPrice" :disabled='siteC' style="width:190px"  maxlength="32" class="enter medium-input" placeholder="请输入付款金额/单位:元" onkeyup="value=value.replace(/[^\d.]/g,'')"></el-input>
                <span style="padding:0px;font-size:20px;font-weight:800;">元</span>
              </el-form-item>
              </el-col>
              <el-col :span="12">     
              <el-form-item label="发货款付款时间(合同约定)" prop="contractShipmentDate" label-width="180px">
                <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.contractShipmentDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd HH:mm:ss" :disabled='siteC'>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="12">
              <el-form-item label="验收款金额(合同约定)" prop="contractAcceptancePrice"  label-width="150px"> 
              <el-input v-model="temp.contractAcceptancePrice" :disabled='siteC' maxlength="32" style="width:190px" class="enter medium-input" placeholder="请输入付款金额/单位:元" onkeyup="value=value.replace(/[^\d.]/g,'')"></el-input>
              <span style="padding:0px;font-size:20px;font-weight:800;">元</span>
              </el-form-item>
              </el-col>
              <el-col :span="12">
              <el-form-item label="验收款付款时间(合同约定)" prop="contractAcceptanceDate"  label-width="180px"> 
              <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.contractAcceptanceDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd HH:mm:ss" :disabled='siteC'>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
               <el-col :span="12">     
              <el-form-item label="质保金金额(合同约定)" prop="contractWarrantyPrice" label-width="150px">
              <el-input v-model="temp.contractWarrantyPrice" :disabled='siteC' style="width:190px"  maxlength="32" class="enter medium-input" placeholder="请输入金额/单位:元"   onkeyup="value=value.replace(/[^\d.]/g,'')"></el-input>
              <span style="padding:0px;font-size:20px;font-weight:800;">元</span>
              </el-form-item>
              </el-col>
              <el-col :span="12">
              <el-form-item label="质保金付款时间(合同约定)" prop="contractWarrantyDate" label-width="180px"> 
              <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.contractWarrantyDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                 value-format="yyyy-MM-dd HH:mm:ss" :disabled='siteC'>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              </el-row>

               <!-- <div class="line_01"><span>实际付款情况</span></div> -->
               <div class="line_05">—————<span>实际付款情况</span>————————————</div>

              <el-row>
              <el-col :span="12">
              <el-form-item label="预付款金额(实际付款)" prop="realSubsistPrice"  label-width="150px"> 
                <el-input v-model="temp.realSubsistPrice" :disabled='siteC' style="width:190px"  maxlength="32" class="enter medium-input" placeholder="请输入金额/单位:元" onkeyup="value=value.replace(/[^\d.]/g,'')"></el-input>
                <span style="padding:0px;font-size:20px;font-weight:800;">元</span>
              </el-form-item>
              </el-col>
               <el-col :span="12">     
              <el-form-item label="预付款付款时间(实际付款)" prop="realSubsistDate" label-width="180px">
              <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.realSubsistDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd HH:mm:ss" :disabled='siteC'>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="12">
              <el-form-item label="发货款金额(实际付款)" prop="realShipmentPrice"  label-width="150px"> 
              <el-input v-model="temp.realShipmentPrice" :disabled='siteC' maxlength="32" style="width:190px" class="enter medium-input" placeholder="请输入金额/单位:元" onkeyup="value=value.replace(/[^\d.]/g,'')"></el-input>
              <span style="padding:0px;font-size:20px;font-weight:800;">元</span>
              </el-form-item>
              </el-col>
              <el-col :span="12">
              <el-form-item label="发货款付款时间(实际付款)" prop="realShipmentDate"  label-width="180px"> 
              <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.realShipmentDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd HH:mm:ss" :disabled='siteC'>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="12">     
              <el-form-item label="验收款金额(实际付款)" prop="realAcceptancePrice" label-width="150px">
              <el-input v-model="temp.realAcceptancePrice" :disabled='siteC' style="width:190px"  maxlength="32" class="enter medium-input" placeholder="请输入金额/单位:元"   onkeyup="value=value.replace(/[^\d.]/g,'')"></el-input>
              <span style="padding:0px;font-size:20px;font-weight:800;">元</span>
              </el-form-item>
              </el-col>
              <el-col :span="12">
              <el-form-item label="验收款付款时间(实际付款)" prop="realAcceptanceDate"  label-width="180px"> 
              <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.realAcceptanceDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd HH:mm:ss" :disabled='siteC'>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="12">
              <el-form-item label="质保金金额(实际付款)" prop="realWarrantyPrice"  label-width="150px"> 
                <el-input v-model="temp.realWarrantyPrice" :disabled='siteC' style="width:190px"  maxlength="32" class="enter medium-input" placeholder="请输入金额/单位:元" onkeyup="value=value.replace(/[^\d.]/g,'')"></el-input>
                <span style="padding:0px;font-size:20px;font-weight:800;">元</span>
              </el-form-item>
              </el-col>
              <el-col :span="12">     
              <el-form-item label="质保金付款时间(实际付款)" prop="realWarrantyDate" label-width="180px">
              <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.realWarrantyDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd HH:mm:ss" :disabled='siteC'>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              </el-row>

               <div class="line_05">—————<span>改造验收</span>————————————</div>
<!-- :oninput="variety()" -->
              <el-row>
              <el-col :span="8">     
              <el-form-item label="验收周期" prop="newEquipAcceptanceCycle" label-width="107px">
              <el-input v-model="temp.newEquipAcceptanceCycle" :disabled='siteC' style="width:190px"  maxlength="32" class="enter medium-input" placeholder="单位:天"   onkeyup="value=value.replace(/[^\d.]/g,'')"></el-input>
              <span style="padding:0px;font-size:20px;font-weight:800;">天</span>
              </el-form-item>
              </el-col>
              <el-col :span="8">
              <el-form-item label="要求完成时间" prop="acceptanceShouldTime"  label-width="120px"> 
              <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.acceptanceShouldTime"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd HH:mm:ss"
                   disabled>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              <el-col :span="8">     
              <el-form-item label="实际完成时间" prop="realAcceptanceShouldTime" label-width="120px">
              <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.realAcceptanceShouldTime"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd HH:mm:ss"
                   disabled>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              </el-row>

              <!-- <div class="line_01"><span>新设备质保验收试用</span></div>       :oninput="variety()"-->  
               <div class="line_05">—————<span>改造质保验收</span>————————————</div>

              <el-row>
              <el-col :span="8">     
              <el-form-item label="验收周期" prop="newEquipWarrantyCycle" label-width="107px">
              <el-input v-model="temp.newEquipWarrantyCycle" :disabled='siteC' style="width:190px"  maxlength="32" class="enter medium-input" placeholder="单位:天"   onkeyup="value=value.replace(/[^\d.]/g,'')"></el-input>
              <span style="padding:0px;font-size:20px;font-weight:800;">天</span>
              </el-form-item>
              </el-col>
              <el-col :span="8">
              <el-form-item label="要求完成时间" prop="warrantyShouldTime"  label-width="134px"> 
               <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.warrantyShouldTime"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd HH:mm:ss"
                   disabled>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
               <el-col :span="8">
              <el-form-item label="实际完成时间" prop="realWarrantyShouldTime"  label-width="134px"> 
               <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.realWarrantyShouldTime"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                 value-format="yyyy-MM-dd HH:mm:ss"
                   disabled>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              </el-row>

               <el-row>
               <el-col :span="8">     
              <el-form-item label="生成时间" prop="createTime" label-width="107px">
               <div class="block">
                <el-date-picker
                  style="width:210px"
                  v-model="temp.createTime"
                  type="datetime"
                  placeholder="选择日期"
                   disabled>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              </el-row>

            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false" v-if="showpop1">取消</el-button>
              <el-button type="primary" @click="updateData" v-if="showpop2">提交</el-button>
              <el-button type="primary" @click="dialogFormVisible = false" v-if="showpop3">返回</el-button>
            </div>
          </el-dialog>
        

    </el-container>
  </div>
</template>

<script>
// import { fetchList, derivationst, selectById, updateArticle, existence,transfersp } from '@/api/servicingManage/uoverhaulAccount'
import { fetchList, derivationst, selectById,fetchPv,updateArticle, existence, } from '@/api/equipRemould/remakevSurvey'
import waves from '@/directive/waves' // 水波纹指令
import { fetchButton } from '@/api/common/button'
import { menuList } from '@/store/modules/permission'// 按钮权限
export default {
  name: 'uoverhaulAccount',
  directives: {
    waves
  },
  data() {
    var validateshortNumber = (rule,value,callback) =>{
       if(value){
      if ((/^[0-9]+([.]{1}[0-9]+){0,1}$/).test(value) == false) {
          callback(new Error('请输入正确的金额/例:1.2或2'))
        } else {
          callback()
        }
      }else{
        callback()
      }
    }
     var vaNumber = (rule,value,callback) =>{
       if(value){
      if ((/^[0-9]+([0-9]+){0,1}$/).test(value) == false) {
          callback(new Error('请输入整数'))
        } else {
          callback()
        }
      }else{
        callback()
      }
    }
    

    return {
      roles: [],
      rostpo:[],
      deviceclass: [
        { value: '1', label: '转账' },
        { value: '2', label: '支付宝' },
        { value: '3', label: '现金' },
        { value: '4', label: '承兑' },
        { value: '5', label: '电汇' },
        { value: '6', label: '电汇/承兑' },
        { value: '7', label: '电汇/信用证' }
        
      ],
      //发票号
       list: [{
        invoiceNumber:'',
        invoicePrice:'',
        invoiceDate:''
      }],
      delShow: false,//发票信息的的减号隐藏
      plusShow: false,// 发票信息的加好隐藏
     
      listyst: [],
      lookList: [],
      grite: '',
      total: null,
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      
      value13: [], // 设备安装完成时间
      weekdates: [], // 新设备一周计划完成时间
      // 导出字段
      listQueryst: {
        buyers: '',
        equipmentName: '',
        fixedAssetCode: '',
        isComplete: '',
        model: '',
        realTimeEnd: '',
        realTimeUp: '',
        requestTimeEnd: '',
        requestTimeUp: ''
      },
      // 弹框显示
      dialogFormVisible: false,
      popTitle: '',
      dialogStatus: '',
      textMap: {
        update: '编辑',
        lookpos: '查看'
      },
      // 转修弹框
      postylitys:false,
      dialo: '',
      noeli:{  
        reason:''//转修的意见
      },
     codefix:'',//固定资产
       

      showpop1:false,
      showpop2:false,
      showpop3:false,
      temp: {
        deliverDate:'',
        shipRealDate:'',
        acceptanceCompleteDate:'',
        acceptanceDate:'',
        acceptanceRealTime:'',
        acceptanceRequestTime:'',
        shipDate:'',
        unpackingDate:'',
        warrantyCompleteDate:'',
        warrantyRealDate:'',
        warrantyRealTime:'',
        warrantyRequestTime:'',

      },
     // 按钮权限
      menuCode: '',
      edit: false, // 编
      cutout: false, // 删
      afreshst: false, // 重新验收
      speechst: false, // 生成设备质量验收报告


      listLoading: true, // 远程搜索加载动画
      siteCodeState: true, // 禁用状态
      siteC:true,//查看禁用
      dstpost: '', // 交付时间

      // 弹框内输入框不填显示的提示信息  /^[A-Za-z0-9]+$/
       rules: {
        formCode: [{ required: true, message: '请输入改造记录编号', trigger: 'change' }],
        fixedAssetCode: [{ required: true, message: '请输入固定资产编号', trigger: 'change' }],
        recordCode:[{ required: true, message: '请输入改造备案单号', trigger: 'change' }],
        typeSpecification: [{ required: true, message: '请输入型号规格', trigger: 'change' }],
        equipmentName:[{ required: true, message: '请输入设备名称', trigger: 'change' }],
        filingTime:[{ required: true, message: '请输入备案时间', trigger: 'change' }],
        companyCode:[{ required: true, message: '请输入使用公司', trigger: 'change' }],
        factoryCode:[{ required: true, message: '请输入使用工厂', trigger: 'change' }],
        divisionCode:[{ required: true, message: '请输入使用部门', trigger: 'change' }],
        context:[{ required: true, message: '请输入改造具体内容', trigger: 'change' }],
        

        equipmentPrice:[{ required: false, validator: validateshortNumber, trigger: 'change' }],
        contractSubsistPrice:[{ required: false, validator: validateshortNumber, trigger: 'change' }],
        actualCost:[{ required: false, validator: validateshortNumber, trigger: 'change' }],
        invoice:[{ required: false, validator: validateshortNumber, trigger: 'change' }],
        contractShipmentPrice:[{ required: false, validator: validateshortNumber, trigger: 'change' }],
        contractAcceptancePrice:[{ required: false, validator: validateshortNumber, trigger: 'change' }],
        contractWarrantyPrice:[{ required: false, validator: validateshortNumber, trigger: 'change' }],
        realSubsistPrice:[{ required: false, validator: validateshortNumber, trigger: 'change' }],
        realShipmentPrice:[{ required: false, validator: validateshortNumber, trigger: 'change' }],
        realAcceptancePrice:[{ required: false, validator: validateshortNumber, trigger: 'change' }],
        realWarrantyPrice:[{ required: false, validator: validateshortNumber, trigger: 'change' }]

       
        /*  newEquipEvaluateCycle:[{ required: true, validator:vaNumber, trigger: 'change' }],
         newEquipAcceptanceCycle:[{ required: true, validator:vaNumber, trigger: 'change' }],
         newEquipWarrantyCycle:[{ required: true,  validator:vaNumber, trigger: 'change' }] */

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
          if (e.name == 'remakevSurvey') {
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
            if (authority[i].buttonName == '导出') {
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
  // 表格接口
    getAA() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.listyst = response.data.data.list
        console.log(this.listyst)
        for(var i=0;i<this.listyst.length;i++){
          if(this.listyst[i].suggest == 1){
            this.listyst[i].suggestName ='外部'
          }else if(this.listyst[i].suggest == 0){
           this.listyst[i].suggestName ='内部'
          }
          if(this.listyst[i].isProjectApproval == 0){
             this.listyst[i].isProjectName ='是'
          }else if(this.listyst[i].isProjectApproval == 1){
             this.listyst[i].isProjectName ='否'
          }
        }
        this.total = response.data.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 1000)
      })
    },

    // 导出
    derivation() {
      derivationst(this.listQuery).then(response => {
         if (response.data.code == 200) {
              const liststyp = response.data.data
              console.log(liststyp)
              window.location.href = liststyp
         }else if(response.data.code == 400002){
            this.$notify({
						title: '警告',
						message: response.data.msg,
						type: 'warning',
						duration: 3000
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
    },
      // 发票号新增
    addRow() {
      this.list.push({invoiceNumber:'',invoicePrice:'',invoiceDate:''})
      if (this.list.length == 1) {
        this.delShow = false
      }else{
        this.delShow = true
      }
    },
    // 发票号删除
    delRow(){ 
    this.list.pop({invoiceNumber:'',invoicePrice:'',invoiceDate:''})
    if (this.list.length == 1) {
        this.delShow = false
      }
    },

     //  改造验收 的验收周期时间
    variety() {
     if(this.temp.installationCompleted=='' ||this.temp.installationCompleted==null){
           this.temp.acceptanceShouldTime=''
     }else{  
      //  改造验收    1天 = 86400000毫秒
      const datmint = this.temp.newEquipAcceptanceCycle*86400000
      const datastlist = new Date(this.temp.installationCompleted)
      const time1 = datastlist.getTime()
      const op = time1 + datmint//7889400000-86400000// 3个月
      var newdate = new Date(op)
      var Y = newdate.getFullYear() + '-'
      var M = (newdate.getMonth() + 1 < 10 ? '0' + (newdate.getMonth() + 1) : newdate.getMonth() + 1) + '-'
      var D = newdate.getDate() + ' '
      console.log(Y + M + D)
      this.temp.acceptanceShouldTime = Y + M + D
       }
      //  改造设备质保验收
    if(this.temp.installationCompleted=='' ||this.temp.installationCompleted==null){
          this.temp.warrantyShouldTime=''
     }else{
      const datastlist3 = new Date(this.temp.installationCompleted)
      const datmint1 = this.temp.newEquipWarrantyCycle*86400000
      const time3 = datastlist3.getTime()
      const op3 = time3 + datmint1//31557600000 // 12个月
      var newdate3 = new Date(op3)
      var Y3 = newdate3.getFullYear() + '-'
      var M3 = (newdate3.getMonth() + 1 < 10 ? '0' + (newdate3.getMonth() + 1) : newdate3.getMonth() + 1) + '-'
      var D3 = newdate3.getDate() + ' '
      this.temp.warrantyShouldTime  = Y3 + M3 + D3 
      }
    },

  
    // 查看
    checkDetails(row){
       // 判断是否填了固定资产编号填了就质灰
      this.siteCodeState = true
      this.siteC = true//查看禁用
      this.dialogStatus = 'lookpos'
      this.showpop1 = false
      this.showpop2 = false
      this.showpop3 = true
      this.plusShow = false
      this.dialogFormVisible = true
      const ids = { id: row.id }
       selectById(ids).then(response => {
        this.popTitle = response.data.data
        this.temp = Object.assign({}, this.popTitle)
         if(this.popTitle.isProjectApproval!== null){
        this.temp.isProjectApproval = this.popTitle.isProjectApproval.toString()
        }
         if(this.popTitle.suggest!== null){
        this.temp.suggest = this.popTitle.suggest.toString()
        }
         // 发票信息
        if(this.temp.list!=null){
         this.list = this.temp.list
        }else if(this.temp.list==null){
         this.temp.list = [{invoiceNumber:'',invoicePrice:'',invoiceDate:''}]
         this.list = this.temp.list
         console.log(this.list)
        }else if(this.temp.list==''){
         this.temp.list = [{invoiceNumber:'',invoicePrice:'',invoiceDate:''}]
         this.list = this.temp.list
        }
        if(this.temp.newEquipAcceptanceCycle ==''||this.temp.newEquipAcceptanceCycle ==null){
            this.temp.newEquipAcceptanceCycle = 90
        }
        if(this.temp.newEquipWarrantyCycle ==''||this.temp.newEquipWarrantyCycle==null){
          this.temp.newEquipWarrantyCycle =365
        }
      })
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
  
    // 编辑点击打开弹窗事件  projectCode  acceptanceDate
    handleUpdate(row) {
      this.siteCodeState = true
      this.siteC = false//查看禁用
      this.plusShow = true//加号显示
      this.showpop1 = true
      this.showpop2 = true
      this.showpop3 = false
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      const ids = { id: row.id }
      selectById(ids).then(response => {
        this.popTitle = response.data.data
        this.temp = Object.assign({}, this.popTitle)
         // 付款方式
        if(this.temp.payMethod!=''){
         this.roles = this.temp.payMethod.split(",")
        }
         if(this.popTitle.isProjectApproval!== null){
        this.temp.isProjectApproval = this.popTitle.isProjectApproval.toString()
        }
         if(this.popTitle.suggest!== null){
        this.temp.suggest = this.popTitle.suggest.toString()
        }
        // 发票信息
        if(this.temp.list!=null){
         this.list = this.temp.list
        }else if(this.temp.list==null){
         this.temp.list = [{invoiceNumber:'',invoicePrice:'',invoiceDate:''}]
         this.list = this.temp.list
         console.log(this.list)
        }else if(this.temp.list==''){
         this.temp.list = [{invoiceNumber:'',invoicePrice:'',invoiceDate:''}]
         this.list = this.temp.list
        }
        if(this.temp.newEquipAcceptanceCycle ==''||this.temp.newEquipAcceptanceCycle ==null){
            this.temp.newEquipAcceptanceCycle = 90
        }
        if(this.temp.newEquipWarrantyCycle ==''||this.temp.newEquipWarrantyCycle==null){
          this.temp.newEquipWarrantyCycle = 365
        }
      })
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
   
    // 编辑提交按钮 projectCode
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.temp.payMethod = this.roles.join(',')
          const tempData = Object.assign({}, this.temp)
          console.log(tempData)
              updateArticle(tempData).then(response => {
                const msg = response.data.msg
                console.log(response.data.code)
                if (response.data.code == 200) {
                  for (const v of this.listyst) {
                    console.log(this.listyst)
                    if (v.id === this.temp.id) {
                      this.getAA()
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
          })
         },

  // 删除按钮
    deleteBtn(row){
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          // const deleteid = row.id
          const deleteid = { id: row.id }
          fetchPv(deleteid).then(response => {
            if(response.data.code == 200){ 
                this.getAA()	
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
.line_02{
    height: 1px;
    border-top: 1px solid #ccc;
    text-align: center;
    /* width:100px; */
}
.line_02 span{
    position: relative;
    top: -12px;
    background: #fff;
    padding: 0 20px;
}


.line_01{
    padding: 0 20px 0;
    margin: 20px 0;
    line-height: 1px;
    border-left: 500px solid #bbb;
    border-right: 500px solid #bbb;
    text-align: center;
}

.line_05{
    letter-spacing: -1px;
    color: #bbb;
    margin: 20px 0;
    line-height: 1px;
}
.line_05 span{
    letter-spacing: 0;
    color: #222;
    margin:0 20px;
}
</style>
