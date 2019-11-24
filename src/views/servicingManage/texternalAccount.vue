<template>
  <div class="app-container">
    <!--外部容器 -->
    <el-container>
       <!-- 顶部搜索 -->
      
     <!--  -->
        <div class="filter-container">
          
            <div class="formSearch">
            <el-form :inline="true">
             
                <el-form-item label="设备名称" >
                <el-input v-model="listQuery.equipName"  placeholder="请输入设备名称" clearable></el-input>
                </el-form-item>
            
                <el-form-item label="固定资产编号">
                <el-input class="minier-input" v-model="listQuery.fixedAssetCode" placeholder="请输入固定资产编号" clearable></el-input>
                </el-form-item>
              
              
                <el-form-item label="型号规格">
                <el-input class="minier-input" v-model="listQuery.model" placeholder="请输入型号规格" clearable></el-input>
                </el-form-item>
              
                <el-form-item label="合同编号">
                <el-input class="minier-input" v-model="listQuery.contractNumber" placeholder="请输入合同编号" clearable></el-input>
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
            <el-button class="filter-item" @click="derivation" type="primary" icon="el-icon-edit">导出</el-button>
           
            <el-table :data="listyst" v-loading="listLoading" border fit highlight-current-row
              style="width: 100%;min-height:auto;margin-top:8px" height="500" :header-cell-style="{background:'oldlace'}">
                 <el-table-column  align="center" label="序号" min-width="80" type="index"></el-table-column>

                 <el-table-column prop="equipmentName" align="center" label="设备名称" min-width="80">
                 <template slot-scope="scope">
                 <span class="link-type futiop" @click='checkDetails(scope.row)'>{{scope.row.equipmentName}}</span>
                 </template>
                 </el-table-column>
                <el-table-column prop="documnetCode" align="center" label="报修单编号" min-width="100">
                 </el-table-column>
                 <el-table-column prop="reportTime" align="center" label="报修时间" min-width="100">
                 </el-table-column>
                 <el-table-column prop="repairCompany" align="center" label="报修公司" min-width="100">
                 </el-table-column>
                  <el-table-column prop="repairCompany" align="center" label="报修工厂" min-width="100">
                 </el-table-column>
                 <el-table-column prop="repairDivision" align="center" label="报修部门" min-width="80">
                 </el-table-column>
                 <el-table-column prop="buyers" align="center" label="供应商" min-width="80">
                 </el-table-column>
                
               <el-table-column prop="model" align="center" label="型号规格" min-width="80">
                 </el-table-column>
                <el-table-column prop="fixedAssetCode" align="center" label="固定资产编号" min-width="80">
                 </el-table-column>
                <el-table-column prop="repairFactory" align="center" label="维修厂商" min-width="80">
                 </el-table-column>
                <el-table-column prop="aloofFactoryDate" align="center" label="出厂时间" min-width="80">
                 </el-table-column>
                <el-table-column prop="contractNumber" align="center" label="合同编号" min-width="80">
                 </el-table-column>
                <el-table-column prop="payName" align="center" label="付款方式" min-width="80">
                 </el-table-column>
                <el-table-column prop="repairTotalPrice" align="center" label="维修总金额（元）" min-width="80">
                 </el-table-column>
                <el-table-column prop="contractDeliveryDate" align="center" label="合同交货时间" min-width="80">
                 </el-table-column> 
                <el-table-column prop="unpackingDate" align="center" label="实际到货时间" min-width="80">
                 </el-table-column>
                <el-table-column prop="deliveryNoteNumber" align="center" label="送货单号" min-width="80">
                 </el-table-column>
                 <el-table-column prop="invoiceNumber" align="center" label="发票号" min-width="80">
                 </el-table-column>
                <el-table-column prop="invoice" align="center" label="发票金额（元）" min-width="80">
                 </el-table-column> 
                <el-table-column prop="invoiceDate" align="center" label="发票时间" min-width="80">
                 </el-table-column>

                <el-table-column label="合同要求付款期" align="center" min-width="100">
               <el-table-column prop="contractSubsistPrice" align="center" label="预付款金额（元）" min-width="100">
                </el-table-column>
               <el-table-column prop="contractSubsistDate" align="center" label="预付款付款时间" min-width="80">
                </el-table-column>
                <el-table-column prop="contractShipmentPrice" align="center" label="发货款金额（元）" min-width="100">
                </el-table-column>
               <el-table-column prop="contractShipmentDate" align="center" label="发货款付款时间" min-width="80">
                </el-table-column>
                 <el-table-column prop="contractAcceptancePrice" align="center" label="验收款金额（元）" min-width="100">
                </el-table-column>
               <el-table-column prop="contractAcceptanceDate" align="center" label="验收款付款时间" min-width="80">
                </el-table-column>
                 <el-table-column prop="contractWarrantyPrice" align="center" label="质保款金额（元）" min-width="100">
                </el-table-column>
               <el-table-column prop="contractWarrantyDate" align="center" label="质保款付款时间" min-width="80">
                </el-table-column>
               </el-table-column> 

                <el-table-column label="实际付款情况" align="center" min-width="100">
               <el-table-column prop="realSubsistPrice" align="center" label="预付款金额（元）" min-width="100">
                </el-table-column>
               <el-table-column prop="realSubsistDate" align="center" label="预付款付款时间" min-width="80"> 
                </el-table-column>
                <el-table-column prop="realShipmentPrice" align="center" label="发货款金额（元）" min-width="100">
                </el-table-column>
               <el-table-column prop="realShipmentDate" align="center" label="发货款付款时间" min-width="80"> 
                </el-table-column>
                <el-table-column prop="realAcceptancePrice" align="center" label="验收款金额（元）" min-width="100">
                </el-table-column>
               <el-table-column prop="realAcceptanceDate" align="center" label="验收款付款时间" min-width="80"> 
                </el-table-column>
                 <el-table-column prop="realWarrantyPrice" align="center" label="质保款金额（元）" min-width="100">
                </el-table-column>
               <el-table-column prop="realWarrantyDate" align="center" label="质保款付款时间" min-width="80"> 
                </el-table-column>
               </el-table-column>

               <el-table-column prop="repairEquipAcceptanceCycle" align="center" label="维修验收记录单验收周期（天）" min-width="80">
                 </el-table-column> 
               <el-table-column prop="repairEquipWarrantyCycle" align="center" label="维修质保确认单验收周期（天）" min-width="80">
                 </el-table-column>

               <!--  <el-table-column label="维修质量反馈单（到货一周）" align="center" min-width="100">
               <el-table-column prop="requestDate1" align="center" label="要求完成时间" min-width="100">
                </el-table-column>
               <el-table-column prop="realDate1" align="center" label="实际完成时间" min-width="80">
                </el-table-column>
               </el-table-column>  -->

                <el-table-column label="设备维修验收记录单（运行三个月或合同约定）" align="center" min-width="100">
               <el-table-column prop="acceptanceRequestDate" align="center" label="要求完成时间" min-width="100">
                </el-table-column>
               <el-table-column prop="acceptanceRealDate" align="center" label="实际完成时间" min-width="80">
                </el-table-column>
               </el-table-column> 

               <el-table-column label="维修质保确认单（运行1年或合同约定）" align="center" min-width="100">
               <el-table-column prop="warrantyRequestDate" align="center" label="要求完成时间" min-width="100">
                </el-table-column>
               <el-table-column prop="warrantyRealDate" align="center" label="实际完成时间" min-width="80">
                </el-table-column>
               </el-table-column> 
                <el-table-column prop="remark" align="center" label="备注" min-width="100">
                 </el-table-column>
                                             <!-- v-if="edit"  remark-->
                <el-table-column fixed="right" align="center" label="操作" min-width="150"  class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-button title="编辑" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)"></el-button>
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
              :current-page="pageNum" 
              :page-sizes="[10,20,50,100]" 
              :page-size="pageSize" 
              layout="total, sizes, prev, pager, next, jumper" 
              :total="total">
              </el-pagination>
            </div>
          </el-footer>
           <!-- 编辑是同一个弹出框 -->
          <el-dialog :title="textMap[dialogStatus]" v-dialogDrag top="10vh" width="1000px" :visible.sync="dialogFormVisible">
            <el-form :rules="rules" ref="dataForm" :model="temp" label-width="100px">

              <el-row>
              <el-col :span="8">     
              <el-form-item label="报修公司" prop="repairCompany">
              <el-input v-model="temp.repairCompany" style="width:190px" :disabled='siteCodeState' maxlength="32" oninput="this.value=this.value.replace(/[^0-9A-z\.]/g,'')" class="enter medium-input" placeholder="请输入报修公司" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="8">     
              <el-form-item label="报修工厂" prop="repairCompany">
              <el-input v-model="temp.repairCompany" style="width:190px" :disabled='siteCodeState' maxlength="32" oninput="this.value=this.value.replace(/[^0-9A-z\.]/g,'')" class="enter medium-input" placeholder="请输入报修公司" ></el-input>
              </el-form-item>
              </el-col>

              <el-col :span="8">
              <el-form-item label="报修部门" prop="repairDivision"  label-width="110px"> 
              <el-input v-model="temp.repairDivision" :disabled='siteCodeState' style="width:190px" class="enter medium-input judge" placeholder="请输入报修部门"></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">
              <el-form-item label="供应商" prop="buyers"> 
              <el-input v-model="temp.buyers" maxlength="20" :disabled='siteC' style="width:190px"  class="enter medium-input" placeholder="请输入供应商"></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="8">
              <el-form-item label="设备名称" prop="equipmentName"  label-width="110px"> 
              <el-input v-model="temp.equipmentName"  :disabled='siteCodeState' style="width:190px" class="enter medium-input" placeholder="请输入设备名称" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="8">
              <el-form-item label="型号规格" prop="model"> 
              <el-input v-model="temp.model"  style="width:190px" class="enter medium-input" :disabled='siteCodeState' placeholder="请输入型号规格" ></el-input>
             
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">
              <el-form-item label="固定资产编号" prop="fixedAssetCode">
              <el-input v-model="temp.fixedAssetCode"  style="width:190px" :disabled='siteCodeState'  maxlength="32" class="enter medium-input" placeholder="请输入固定资产编号" ></el-input>
              </el-form-item>     
              </el-col>
              <el-col :span="8">     
              <el-form-item label="维修厂商" prop="repairFactory">
              <el-input v-model="temp.repairFactory" :disabled='siteC' style="width:190px"  maxlength="20" class="enter medium-input" placeholder="请输入维修厂商" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="8">     
              <el-form-item label="出厂时间" prop="aloofFactoryDate" label-width="107px">
              <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.aloofFactoryDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                   :disabled='siteC'>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">
              <el-form-item label="合同编号" prop="contractNumber"  label-width="110px"> 
              <el-input v-model="temp.contractNumber" :disabled='siteC' maxlength="20"  style="width:190px" class="enter medium-input" placeholder="请输入合同编号" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="8">
              <el-form-item label="付款方式" prop="payName"  label-width="110px"> 
              <el-input v-model="temp.payName" :disabled='siteC' maxlength="20"  style="width:190px" class="enter medium-input" placeholder="请输入付款方式" ></el-input>
              </el-form-item>
              </el-col>    
              <el-col :span="8">
              <el-form-item label="维修总金额" prop="repairTotalPrice"  label-width="110px"> 
              <el-input v-model="temp.repairTotalPrice" :disabled='siteC' maxlength="10"  style="width:170px" class="enter medium-input" placeholder="请输入维修总金额" ></el-input>
              <span style="padding:0px;font-size:20px;font-weight:800;">元</span>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
               <el-col :span="8">
              <el-form-item label="合同交货时间" prop="contractDeliveryDate"> 
              <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.contractDeliveryDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd" :disabled='siteC'>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              <el-col :span="8">
              <el-form-item label="实际到厂时间" prop="unpackingDate"  label-width="110px"> 
              <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.unpackingDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd" :disabled='siteC'>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              <el-col :span="8">     
             <el-form-item label="送货单号" prop="deliveryNoteNumber" label-width="107px">
             <el-input v-model="temp.deliveryNoteNumber" :disabled='siteC' maxlength="20" style="width:190px" class="enter medium-input" placeholder="请输入送货单号" ></el-input>
              </el-form-item> 
              </el-col>
              </el-row>
              
              <el-row>
               <el-col :span="8">
              <el-form-item label="发票号" prop="invoiceNumber"> 
              <el-input v-model="temp.invoiceNumber" :disabled='siteC' maxlength="20" style="width:190px" class="enter medium-input" placeholder="请输入发票号" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="8">
              <el-form-item label="发票金额" prop="invoice"  label-width="110px"> 
              <el-input v-model="temp.invoice" :disabled='siteC' maxlength="10"  style="width:170px" class="enter medium-input" placeholder="请输入发票金额" ></el-input>
              <span style="padding:0px;font-size:20px;font-weight:800;">元</span>
              </el-form-item>
              </el-col>
              <el-col :span="8">
              <el-form-item label="发票时间" prop="invoiceDate"  label-width="110px"> 
              <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.invoiceDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd" :disabled='siteC'>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">
              <el-form-item label="预付款金额（合同要求）" prop="contractSubsistPrice"  label-width="110px"> 
              <el-input v-model="temp.contractSubsistPrice" :disabled='siteC' maxlength="10"  style="width:170px" class="enter medium-input" placeholder="请输入预付款金额" ></el-input>
              <span style="padding:0px;font-size:20px;font-weight:800;">元</span>
              </el-form-item>
              </el-col>
              <el-col :span="8">
              <el-form-item label="预付款付款时间（合同要求）" prop="contractSubsistDate"  label-width="110px"> 
              <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.contractSubsistDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  :disabled='siteC'>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>

              <el-col :span="8">     
              <el-form-item label="发货款金额（合同要求）" prop="contractShipmentPrice"  label-width="110px"> 
              <el-input v-model="temp.contractShipmentPrice" :disabled='siteC' maxlength="10"  style="width:170px" class="enter medium-input" placeholder="请输入发货款金额" onkeyup="value=value.replace(/[^\d.]/g,'')"></el-input>
              <span style="padding:0px;font-size:20px;font-weight:800;">元</span>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">
              <el-form-item label="发货款付款时间（合同要求）" prop="contractShipmentDate" label-width="110px"> 
               <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.contractShipmentDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                   :disabled='siteC'>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              <el-col :span="8">     
              <el-form-item label="验收款金额（合同要求）" prop="contractAcceptancePrice" label-width="107px">
              <el-input v-model="temp.contractAcceptancePrice" :disabled='siteC' style="width:170px"  maxlength="10" class="enter medium-input" placeholder="请输入验收款金额" ></el-input>
              <span style="padding:0px;font-size:20px;font-weight:800;">元</span>
              </el-form-item>
              </el-col>
              <el-col :span="8">
              <el-form-item label="验收款付款时间（合同要求）" prop="contractAcceptanceDate" label-width="110px"> 
               <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.contractAcceptanceDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                   :disabled='siteC'>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
                <el-col :span="8">
              <el-form-item label="质保金金额（合同要求）" prop="contractWarrantyPrice"> 
              <el-input v-model="temp.contractWarrantyPrice" :disabled='siteC' maxlength="10"  style="width:170px" class="enter medium-input" placeholder="请输入质保金金额" ></el-input>
              <span style="padding:0px;font-size:20px;font-weight:800;">元</span>
              </el-form-item>
              </el-col>
              <el-col :span="8">     
              <el-form-item label="质保金付款时间(合同要求)" prop="contractWarrantyDate" label-width="107px">
              <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.contractWarrantyDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  :disabled='siteC'>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              <el-col :span="8">
              <el-form-item label="预付款金额（实际付款）" prop="realSubsistPrice" label-width="122px"> 
              <el-input v-model="temp.realSubsistPrice" :disabled='siteC' maxlength="10" style="width:170px" class="enter medium-input" placeholder="请输入预付款金额" ></el-input>
              <span style="padding:0px;font-size:20px;font-weight:800;">元</span>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
               <el-col :span="8">
              <el-form-item label="预付款付款时间（实际付款）" prop="realSubsistDate"  label-width="110px"> 
              <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.realSubsistDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                   :disabled='siteC'>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              <el-col :span="8">     
              <el-form-item label="发货款金额（实际付款）" prop="realShipmentPrice" label-width="107px">
              <el-input v-model="temp.realShipmentPrice" :disabled='siteC' style="width:170px" maxlength="10" class="enter medium-input" placeholder="请输入发货款金额" onkeyup="value=value.replace(/[^\d.]/g,'')"></el-input>
              <span style="padding:0px;font-size:20px;font-weight:800;">元</span>
              </el-form-item>
              </el-col>
              <el-col :span="8">
              <el-form-item label="发货款付款时间（实际付款）" prop="realShipmentDate"  label-width="110px"> 
              <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.realShipmentDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd" :disabled='siteC'>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
               <el-col :span="8">     
              <el-form-item label="验收款金额（实际付款）" prop="realAcceptancePrice" label-width="107px">
              <el-input v-model="temp.realAcceptancePrice" :disabled='siteC' style="width:170px" maxlength="10" class="enter medium-input" placeholder="请输入验收款金额" onkeyup="value=value.replace(/[^\d.]/g,'')"></el-input>
              <span style="padding:0px;font-size:20px;font-weight:800;">元</span>
              </el-form-item>
              </el-col>
              <el-col :span="8">
              <el-form-item label="验收款付款时间(实际付款)" prop="realAcceptanceDate"  label-width="110px"> 
             <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.realAcceptanceDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  :disabled='siteC'>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              <el-col :span="8">    
              <el-form-item label="质保金金额(实际付款)" prop="realWarrantyPrice" label-width="107px">
              <el-input v-model="temp.realWarrantyPrice" :disabled='siteC' style="width:170px"  maxlength="10" class="enter medium-input" placeholder="请输入质保金金额" onkeyup="value=value.replace(/[^\d.]/g,'')"></el-input>
              <span style="padding:0px;font-size:20px;font-weight:800;">元</span>
              </el-form-item>
              </el-col>
             
              </el-row>

              <el-row>
               <el-col :span="8">     
              <el-form-item label="质保金付款时间(实际付款)" prop="realWarrantyDate" label-width="107px">
                <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.realWarrantyDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd" :disabled='siteC'>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              <el-col :span="8">     
              <!-- <el-form-item label="要求完成时间(维修质量验收单)" prop="qualityRequestDate" label-width="119px">
                <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.qualityRequestDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd" disabled>
                </el-date-picker>
              </div>
              </el-form-item> -->
                <el-form-item label="维修验收记录单验收周期" prop="repairEquipAcceptanceCycle" label-width="107px">
              <el-input v-model="temp.repairEquipAcceptanceCycle" :disabled='siteC' style="width:170px" maxlength="10" class="enter medium-input" placeholder="请输入天数" onkeyup="value=value.replace(/[^\d.]/g,'')"></el-input>
              <span style="padding:0px;font-size:20px;font-weight:800;">天</span>
              </el-form-item>
              </el-col>
             <el-col :span="8">
             <!--  <el-form-item label="实际完成时间(维修质量验收单)" prop="qualityRealDate"  label-width="119px"> 
              <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.qualityRealDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd" disabled>
                </el-date-picker>
              </div>
              </el-form-item> -->
               <el-form-item label="维修质保确认单验收周期" prop="repairEquipWarrantyCycle" label-width="107px">
              <el-input v-model="temp.repairEquipWarrantyCycle" :disabled='siteC' style="width:170px" maxlength="10" class="enter medium-input" placeholder="请输入天数" onkeyup="value=value.replace(/[^\d.]/g,'')"></el-input>
              <span style="padding:0px;font-size:20px;font-weight:800;">天</span>
              </el-form-item>
              </el-col>
             
              </el-row>

              <el-row>
              <el-col :span="8">
              <el-form-item label="要求完成时间(维修验收记录单)" prop="acceptanceRequestDate"  label-width="119px"> 
              <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.acceptanceRequestDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd" disabled>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
               <el-col :span="8">
              <el-form-item label="实际完成时间(维修验收记录单)" prop="acceptanceRealDate" label-width="119px"> 
              <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.acceptanceRealDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd" disabled>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              <el-col :span="8">
              <el-form-item label="要求完成时间(维修质保确认单)" prop="warrantyRequestDate" label-width="119px"> 
              <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.warrantyRequestDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd" disabled>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
            
              </el-row>

              <el-row>
              <el-col :span="8">
              <el-form-item label="实际完成时间(维修质保确认单)" prop="warrantyRealDate" label-width="119px"> 
              <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.warrantyRealDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd" disabled>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              <el-col :span="8">     
              <el-form-item label="生成时间" prop="cTime" label-width="107px">
               <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.cTime"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                   disabled>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              </el-row>

              <el-form-item label="备注" prop="remark" label-width="130px" style="margin-left:-60px">
                <el-input type="textarea" :disabled='siteCodeState' v-model="temp.remark" style="width:550px" maxlength="128" :autosize="{ minRows: 2, maxRows: 4}" placeholder="">
                </el-input>
              </el-form-item>
             

            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false" v-if="showpop1">取消</el-button>
              <el-button  type="primary" @click="updateData" v-if="showpop2">提交</el-button>
              <el-button  type="primary" @click="dialogFormVisible = false" v-if="showpop3">返回</el-button>
            </div>
          </el-dialog>
    </el-container>
  </div>
</template>
 
<script>
import { fetchList, derivationst, selectById, updateArticle } from '@/api/servicingManage/texternalAccount'
import waves from '@/directive/waves' // 水波纹指令
import { fetchButton } from '@/api/common/button'
export default {
  name: 'texternalAccount',
  directives: {
    waves
  },
  data() {
    var phoneNum = (rule, value, callback) => {
      if (value != '') {
        if ((/^[0-9]+\.?[0-9]{0,2}$/).test(value) == false) {
          callback(new Error('请输入数字或小数，保留2位小数'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {

      listyst: [],
      lookList: [],
      grite: '',
      total: null,
      listQuery: {

      },
      pageNum: 1,
      pageSize: 10,
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
        lookpostyo: '查看'
      },
      showpop1: false,
      showpop2: false,
      showpop3: false,
      temp: {

      },
      // 按钮权限
      addnewly: false, // 新
      edit: false, // 编
      cutout: false, // 删
      listLoading: true, // 远程搜索加载动画
      siteCodeState: true, // 禁用状态
      siteC: true, // 查看禁用

      // 弹框内输入框不填显示的提示信息 repairCompany repairDivision
      rules: {
        repairCompany: [{ required: true, message: '请输入报修公司', trigger: 'change' }],
        repairDivision: [{ required: true, message: '请输入报修部门', trigger: 'change' }],
        repairTotalPrice: [{ required: false, validator: phoneNum, trigger: 'change' }],
        invoice: [{ required: false, validator: phoneNum, trigger: 'change' }],
        contractSubsistPrice: [{ required: false, validator: phoneNum, trigger: 'change' }],
        contractShipmentPrice: [{ required: false, validator: phoneNum, trigger: 'change' }],
        contractAcceptancePrice: [{ required: false, validator: phoneNum, trigger: 'change' }],
        contractWarrantyPrice: [{ required: false, validator: phoneNum, trigger: 'change' }],
        realSubsistPrice: [{ required: false, validator: phoneNum, trigger: 'change' }],
        realShipmentPrice: [{ required: false, validator: phoneNum, trigger: 'change' }],
        realAcceptancePrice: [{ required: false, validator: phoneNum, trigger: 'change' }],
        realWarrantyPrice: [{ required: false, validator: phoneNum, trigger: 'change' }],

        repairEquipAcceptanceCycle: [{ required: true, message: '请填写', trigger: 'change' }],
        repairEquipWarrantyCycle: [{ required: true, message: '请填写', trigger: 'change' }]
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
    // this.getbttonst()
  },

  methods: {
    // 按钮的权限
    getbttonst() {
      const determine = {
        menuCode: 'WM_052',
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

    // 表格的接口
    getAA() {
      this.listLoading = true
      fetchList(this.pageNum, this.pageSize, this.listQuery).then(response => {
        this.listyst = response.data.data.list
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
          window.location.href = liststyp
        } else if (response.data.code == 400002) {
          this.$notify({
            title: '警告',
            message: response.data.msg,
            type: 'warning',
            duration: 3000
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
    },
    // 查看弹窗事件
    checkDetails(row) {
      this.siteCodeState = true
      this.siteC = true
      this.dialogStatus = 'lookpostyo'
      this.showpop1 = false
      this.showpop2 = false
      this.showpop3 = true
      this.dialogFormVisible = true
      const ids = { id: row.id }
      selectById(ids).then(response => {
        this.popTitle = response.data.data
        this.temp = Object.assign({}, this.popTitle)
        this.temp.payName = row.payName
      })
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 编辑点击打开弹窗事件
    handleUpdate(row) {
      this.showpop1 = true
      this.showpop2 = true
      this.showpop3 = false
      this.siteCodeState = true
      this.siteC = false
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      const ids = {
        id: row.id
      }
      selectById(ids).then(response => {
        this.popTitle = response.data.data
        this.temp = Object.assign({}, this.popTitle)
        this.temp.payName = row.payName
      })
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 编辑提交按钮
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateArticle(tempData).then(response => {
            const msg = response.data.msg
            if (response.data.code == 200) {
              for (const v of this.listyst) {
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
</style>
