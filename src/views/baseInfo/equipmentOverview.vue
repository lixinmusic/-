<template>
  <div class="app-container">
    <!--外部容器 -->
    <el-container>
       <!-- 顶部搜索 -->
     <!--  <el-header style="margin-bottom:40px">   class="seat"-->
        <div class="filter-container">
            <div class="formSearch">
            <el-form :inline="true">
               
                <el-form-item label="设备名称" >
                <el-input v-model="listQuery.equipmentName" style="width:235px"  placeholder="请输入设备名称" clearable></el-input>
                </el-form-item>
               

               
                <el-form-item label="固定资产编号">
                <el-input class="minier-input" v-model="listQuery.fixedAssetCode" placeholder="请输入固定资产编号" clearable></el-input>
                </el-form-item>
             
                  
                
                <el-form-item label="型号规格" style="margin-left:20px">
                <el-input class="minier-input" v-model="listQuery.model" placeholder="请输入型号规格" clearable></el-input>
                </el-form-item>
             

             
                <el-form-item label="使用公司">
                <el-input class="minier-input" :disabled='siteCodeState' v-model="radio" placeholder="请选择使用公司" clearable></el-input>
                <div class="buttonplace" id="buttstyps" @click="treeco">选择</div>
                <div class="buces" id="buttstyps" @click="clears">清空</div>
                </el-form-item>
                
              
                <el-form-item style="margin-left:70px">
                <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
                </el-form-item>
              
             
            </el-form>
            </div>
          
        </div>
      <!--  </el-header> -->
       <!-- <el-main>  -->
         <div class="square" @click="squareclick" v-if="stypot" style="margin-top:1px"></div> <!-- 下三角 -->
         <div class="showlist" v-if="showheast">
            <div style="margin-bottom:0px;padding:0px;height:580px;">
              <div class="filter-container" style="background:#fff">
              <el-form :inline="true">

                <el-row>
                <el-col :span="3">
                <el-form-item label="使用部门">
                <el-input class="minier-input" style="width:190px" v-model="yesno" :disabled='siteCodeState' placeholder="请选择使用部门" clearable></el-input>
                <div class="buttonplace" id="buttstyps" @click="treesection">选择</div>
                <div class="buces" id="buttstyps" @click="clearsection">清空</div>
                </el-form-item>
                </el-col>

                <el-col :span="4" >
                <el-form-item label="备案编号" style="margin-left:120px">
                <el-input v-model="listQuery.filingNumber" style="width:230px"  placeholder="请输入备案编号" clearable></el-input>
                </el-form-item>
                </el-col>
                
                <el-col :span="5">
                <el-form-item label="合同编号" style="margin-left:190px">
                <el-input class="minier-input" style="width:230px" v-model="listQuery.contractNumber" placeholder="请输入合同编号" clearable></el-input>
                </el-form-item>
                </el-col>
              
                <el-col :span="4">
                <el-form-item label="采购金额" style="margin-left:215px">
                <el-input class="minier-input" style="width:230px" v-model="listQuery.equipmentPrice" placeholder="请输入金额/单位：元" clearable></el-input>
                </el-form-item>
                </el-col>
                </el-row>
                 
                <el-row>
                <el-col :span="3">  
                <el-form-item label="送货单号" >
                <el-input class="minier-input" style="width:230px" v-model="listQuery.deliveryNoteNumber" placeholder="请输入送货单号" clearable></el-input>
                </el-form-item>
                </el-col>
                
                <el-col :span="4">
                <el-form-item label="发票号" style="margin-left:119px">
                <el-input class="minier-input" style="width:230px" v-model="listQuery.invoiceNumber" placeholder="请输入发票号" clearable></el-input>
                </el-form-item>
                </el-col>
                 
                <el-col :span="5">
                 <el-form-item label="发票金额" style="margin-left:190px">
                  <el-input class="minier-input" style="width:230px" v-model="listQuery.invoice" placeholder="请输入金额/单位:元" clearable></el-input>
                </el-form-item>
                </el-col>
             
                <el-col :span="4">
                <el-form-item label="付款方式" style="margin-left:217px">
               <el-select v-model="rostpo" multiple style="width:230px"
                  placeholder="请选择付款方式" 
                  clearable>
                  <el-option v-for="item in deviceclass" 
                  :key="item.value" 
                  :label="item.label" 
                  :value="item.value">
                  </el-option>
                </el-select>
                </el-form-item>
                </el-col>
                </el-row>

                <el-row>
                <el-col :span="3">
                <el-form-item label="备案时间">
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
                     @change="searchsty()" clearable>
                    </el-date-picker>
                </div>
                </el-form-item>
                </el-col>
                
                <el-col :span="4">
                <el-form-item label="采购申请日期" style="margin-left:119px">
                <div class="block">
                    <el-date-picker
                    style="width:230px"
                    v-model="procurement"
                    type="daterange"
                    unlink-panels
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :default-time="['00:00:00', '23:59:59']" @change="searchsty()">
                    </el-date-picker>
                </div>
                </el-form-item>
                </el-col>

                <el-col :span="5">
                <el-form-item label="应完成时间（采购申请日期）" style="margin-left:190px">
                <div class="block">
                    <el-date-picker
                    style="width:230px"
                    v-model="achievest"
                    type="daterange"
                    unlink-panels
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :default-time="['00:00:00', '23:59:59']" @change="searchsty()">   
                    </el-date-picker>
                </div>
                </el-form-item>
                </el-col>
                
                <el-col :span="4">
                <el-form-item label="实际完成时间" style="margin-left:217px">
                <div class="block">
                    <el-date-picker
                    style="width:230px"
                    v-model="actualdata"
                    type="daterange"
                    unlink-panels
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :default-time="['00:00:00', '23:59:59']" @change="searchsty()">   
                    </el-date-picker>
                </div>
                </el-form-item>
                </el-col>
                </el-row>



              
               <el-row>
                <el-col :span="3">
                 <el-form-item label="存档编号">
                  <el-input class="minier-input" style="width:230px" v-model="listQuery.archiveNumber" placeholder="请输入存档编号" clearable></el-input>
                </el-form-item>
                </el-col> 

                 <el-col :span="4">
                 <el-form-item label="采购单编号" style="margin-left:119px">
                  <el-input class="minier-input" style="width:230px" v-model="listQuery.purchaseApplicationCode" placeholder="请输入采购单编号" clearable></el-input>
                </el-form-item>
                </el-col> 

               <el-col :span="5">
               <el-form-item label="合同归档日期" style="margin-left:190px"> 
                <div class="block">
                    <el-date-picker
                    style="width:230px"
                    v-model="bargaindate"
                    type="daterange"
                    unlink-panels
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :default-time="['00:00:00', '23:59:59']" @change="searchsty()">   
                    </el-date-picker>
                </div>
               </el-form-item>
               </el-col>
                
                 <el-col :span="4">
                <el-form-item label="技改要求交付期" style="margin-left:217px">
                <div class="block">
                    <el-date-picker
                    style="width:230px"
                    v-model="technicaldate"
                    type="daterange"
                    unlink-panels
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :default-time="['00:00:00', '23:59:59']" @change="searchsty()">   
                    </el-date-picker>
                </div>
                </el-form-item>
                </el-col>
                </el-row>



                <el-row>
                 <el-col :span="3">
                <el-form-item label="合同交货时间">
                 <div class="block">
                    <el-date-picker
                    style="width:230px"
                    v-model="deliverydate"
                    type="daterange"
                    unlink-panels
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :default-time="['00:00:00', '23:59:59']" @change="searchsty()">
                    </el-date-picker>
                </div>
                </el-form-item>
                </el-col>

                 <el-col :span="4">
                 <el-form-item label="设备到厂时间(开箱日期)" style="margin-left:119px">
                 <div class="block">
                    <el-date-picker
                    style="width:230px"
                    v-model="factorydate"
                    type="daterange"
                    unlink-panels
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :default-time="['00:00:00', '23:59:59']" @change="searchsty()">
                    </el-date-picker>
                </div>
                </el-form-item>
                </el-col>

                <el-col :span="5">
                <el-form-item label="要求完成时间(新设备评价试用)" style="margin-left:190px">
                <div class="block">
                    <el-date-picker
                    style="width:230px"
                    v-model="monthdatest"
                    type="daterange"
                    unlink-panels
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :default-time="['00:00:00', '23:59:59']" @change="searchsty()">
                    </el-date-picker>
                </div>
                </el-form-item>
                 </el-col>

                <el-col :span="3">
                <el-form-item label="实际完成时间(新设备评价试用)" style="margin-left:217px">
                <div class="block">
                    <el-date-picker
                    style="width:230px"
                    v-model="factmonths"
                    type="daterange"
                    unlink-panels
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :default-time="['00:00:00', '23:59:59']" @change="searchsty()">
                    </el-date-picker>
                </div>
                </el-form-item>
                </el-col>
                </el-row>


                <el-row>
                <el-col :span="3">
                <el-form-item label="要求完成时间(新设备验收试用)">
                <div class="block">
                    <el-date-picker
                    style="width:230px"
                    v-model="trimesterdatezy"
                    type="daterange"
                    unlink-panels
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :default-time="['00:00:00', '23:59:59']" @change="searchsty()">
                    </el-date-picker>
                </div>
                </el-form-item>
                </el-col>

                 <el-col :span="4">
                <el-form-item label="实际完成时间(新设备验收试用)" style="margin-left:119px">
                  <div class="block">
                    <el-date-picker
                    style="width:230px"
                    v-model="trimesterfact"
                    type="daterange"
                    unlink-panels
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :default-time="['00:00:00', '23:59:59']" @change="searchsty()">
                    </el-date-picker>
                </div>
                </el-form-item>
                </el-col>
                <el-col :span="5">
                <el-form-item label="要求完成时间(新设备质保验收试用)" style="margin-left:188px" label-width="240px">
                <div class="block">
                    <el-date-picker
                    style="width:230px"
                    v-model="finaldates"
                    type="daterange"
                    unlink-panels
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :default-time="['00:00:00', '23:59:59']" @change="searchsty()">
                    </el-date-picker>
                </div>
                </el-form-item>
                 </el-col>

                <el-col :span="4">
                <el-form-item label="实际完成时间(新设备质保验收试用)" style="margin-left:217px" label-width="240px">
                <div class="block">
                    <el-date-picker
                    style="width:230px"
                    v-model="gidatespta"
                    type="daterange"
                    unlink-panels
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :default-time="['00:00:00', '23:59:59']" @change="searchsty()">
                    </el-date-picker>
                </div>
                </el-form-item>
                </el-col>
                </el-row>
            </el-form>
        </div>
        </div>
      <div class="tonesquare" @click="tonesquareclick" v-if="hosesty"></div><!--上三角 -->
    </div>       
     <!-- </el-main> -->
      <!-- 内容容器 -->
     <!--  <el-container>
        <el-container> -->
          <!-- 主要区域容器 -->
          <el-main style="padding:20px 0px;">
            <el-button class="filter-item" style="margin-left:10px;" @click="derivation" type="primary" icon="el-icon-download" v-if="addnewly">导出</el-button>

            <el-table :data="lookList" v-loading="listLoading" border fit highlight-current-row
              style="width: 100%;min-height:auto;margin-top:8px;" height="500" :header-cell-style="{background:'#D8E3F2',color:'#626264'}" :default-sort="{prop: 'equipmentName', order: 'ascending'}">
              
                <el-table-column  align="center" label="序号" fixed="left" min-width="80" type="index"></el-table-column>
               
               <!-- :header-cell-style="{background:'oldlace'}"  B1C7E5-->
               <el-table-column sortable prop="equipmentName" fixed="left" align="center" label="设备名称"  min-width="140">
                 <template slot-scope="scope">
                  <span class="link-type futiop" @click='checkDetails(scope.row)'>{{scope.row.equipBasis.equipmentName}}</span>
                  </template>
                 </el-table-column>
                 
                <el-table-column prop="fixedAssetCode" fixed="left" align="center" label="固定资产编号" min-width="115">
                <template slot-scope="scope">
                  {{scope.row.equipBasis.fixedAssetCode}}
                  </template>
                </el-table-column>

                 <el-table-column prop="archiveNumber"  align="center" label="存档编号" min-width="115">
                 <template slot-scope="scope">
                  {{scope.row.equipBasis.archiveNumber}}
                  </template> 
                </el-table-column>

                <el-table-column prop="model" align="center" label="型号规格" min-width="80">
                <template slot-scope="scope">
                  {{scope.row.equipBasis.model}}
                  </template>
                 </el-table-column>

              
               <el-table-column sortable prop="companyName" align="center" label="使用公司" min-width="110">
               <template slot-scope="scope">
                  {{scope.row.equipBasis.companyName}}
                  </template>  
               </el-table-column>

               <el-table-column sortable prop="factoryName" align="center" label="使用工厂" min-width="110">
                  <template slot-scope="scope">
                  {{scope.row.equipBasis.factoryName}}
                  </template>
                 </el-table-column>

               <el-table-column sortable prop="divisionName" align="center" label="使用部门" min-width="110">
               <template slot-scope="scope">
                  {{scope.row.equipBasis.divisionName}}
                  </template>
                </el-table-column>
               
               <el-table-column prop="amount" align="center" label="数量" min-width="80">
               <template slot-scope="scope">
                  {{scope.row.equipBasis.amount}}
                  </template>  
                </el-table-column>

               <el-table-column prop="unit" align="center" label="单位" min-width="80">
               <template slot-scope="scope">
                  {{scope.row.equipBasis.unit}}
                  </template>    
                </el-table-column>

                <el-table-column prop="purchaseApplicationDate" align="center" label="采购申请日期" min-width="88">
               <template slot-scope="scope">
                  {{scope.row.equipBasis.purchaseApplicationDate}}
                  </template>    
                </el-table-column>

                <el-table-column prop="filingNumber" align="center" label="备案编号" min-width="80">
                <template slot-scope="scope">
                  {{scope.row.equipBasis.filingNumber}}
                  </template>  
                </el-table-column>

               <el-table-column prop="filingTime" align="center" label="备案时间" min-width="80">
               <template slot-scope="scope">
                  {{scope.row.equipBasis.filingTime}}
                  </template>  
                </el-table-column> 

               <el-table-column prop="projectExternalName" align="center" label="项目外部名称" min-width="80">
               <template slot-scope="scope">
                  {{scope.row.equipBasis.projectExternalName}}
                  </template>   
                </el-table-column> 
                
                <el-table-column prop="purchaseApplicationCode" align="center" label="采购单编号" min-width="80">
                <template slot-scope="scope">
                  {{scope.row.equipBasis.purchaseApplicationCode}}
                  </template>   
               </el-table-column>

               <el-table-column label="采购定价" align="center" min-width="100">
               <el-table-column prop="purchaseApplicationRequestDate" align="center" label="应完成时间(采购申请日期)" min-width="100">
               <template slot-scope="scope">
                  {{scope.row.purchaseApplicationRequestDate}}
                  </template>  
                </el-table-column>
               <el-table-column prop="purchaseCompletionDate" align="center" label="实际完成时间" min-width="80">
                  <template slot-scope="scope">
                  {{scope.row.equipBasis.purchaseCompletionDate}}
                  </template>  
                </el-table-column>
               </el-table-column>


               <el-table-column prop="purchaseEntity" align="center" label="采购主体" min-width="80">
                 <template slot-scope="scope">
                  {{scope.row.equipBasis.purchaseEntity}}
                  </template>  
                </el-table-column>

               <el-table-column prop="purchaseChannel" align="center" label="采购渠道" min-width="80">
               <template slot-scope="scope">
                  {{scope.row.equipBasis.purchaseChannel}}
                  </template>   
               </el-table-column>

               <el-table-column prop="changeFixedDate" align="center" label="时间（财务转固）" min-width="80">
                <template slot-scope="scope">
                  {{scope.row.equipBasis.changeFixedDate}}
                  </template>
               </el-table-column> 

               <el-table-column prop="contractNumber" align="center" label="合同编号" min-width="80">
                  <template slot-scope="scope">
                  {{scope.row.equipBasis.contractNumber}}
                  </template> 
               </el-table-column>

               <el-table-column prop="contractFilingDate" align="center" label="合同归档日期" min-width="80">
                <template slot-scope="scope">
                  {{scope.row.equipBasis.contractFilingDate!==null?scope.row.equipBasis.contractFilingDate.substring(0,10):''}}
                  </template>
                </el-table-column>

               <el-table-column prop="equipmentPrice" align="center" label="采购金额" min-width="80">
                  <template slot-scope="scope">
                  {{scope.row.equipBasis.equipmentPrice}}
                  </template>
                </el-table-column> 

               <el-table-column prop="requestDeliveryDate" align="center" label="技改要求交付时间" min-width="80">
                <template slot-scope="scope">
                  {{scope.row.equipBasis.requestDeliveryDate}}
                  </template>
                </el-table-column>

               <el-table-column prop="contractDeliveryDate" align="center" label="合同交货时间" min-width="80">
                 <template slot-scope="scope">
                  {{scope.row.equipBasis.contractDeliveryDate!==null?scope.row.equipBasis.contractDeliveryDate.substring(0,10):''}}
                  </template>   
                </el-table-column>

                <el-table-column prop="serialNumber" align="center" label="出厂编号" min-width="80">
                   <template slot-scope="scope">
                  {{scope.row.equipBasis.serialNumber}}
                  </template>
                </el-table-column>

                <el-table-column prop="buyers" align="center" label="采购商" min-width="80">
                 <template slot-scope="scope">
                  {{scope.row.equipBasis.buyers}}
                  </template>  
                </el-table-column>

                <el-table-column prop="deliveryNoteNumber" align="center" label="送货单号" min-width="80">
                <template slot-scope="scope">
                  {{scope.row.equipBasis.deliveryNoteNumber}}
                  </template>    
                </el-table-column>

                <el-table-column prop="unpackingDate" align="center" label="设备到厂时间（开箱时间）" min-width="80">
                 <template slot-scope="scope">
                  {{scope.row.equipBasis.unpackingDate!==null?scope.row.equipBasis.unpackingDate.substring(0,10):''}}
                  </template>
                </el-table-column>

                <el-table-column prop="installDate" align="center" label="安装完成时间" min-width="80">
                <template slot-scope="scope">
                  {{scope.row.equipBasis.installDate!==null?scope.row.equipBasis.installDate.substring(0,10):''}}
                  </template>  
                </el-table-column>

               <!--  <el-table-column prop="invoiceNumber" align="center" label="发票号" min-width="80">
                 <template slot-scope="scope">
                  {{scope.row.equipBasis.invoiceNumber}}
                  </template>  
                </el-table-column>

                <el-table-column prop="invoice" align="center" label="发票金额" min-width="80">
                <template slot-scope="scope">
                  {{scope.row.equipBasis.invoice}}
                  </template>  
                </el-table-column> -->

                 <el-table-column prop="invoiceInfos" align="center" label="发票信息" min-width="160">
                 <template slot-scope="scope">
                  
                  <div v-for="item in scope.row.equipBasis.invoiceInfos" :key="item.id" style="padding:5px;">
                    <span v-if="item.code">{{item.code}}/</span>
                    <span v-if="item.price">{{item.price}}</span>
                    <span v-if="item.date">/{{item.date}}</span>
                    </div>
                  <!-- <span v-html="scope.row.equipBasis.invoiceInfo"></span> -->
                  </template>  
                </el-table-column>

                 <el-table-column prop="payMethod" align="center" label="付款方式" min-width="80">
                <template slot-scope="scope">
                  {{scope.row.equipPay.payMethod}}
                  </template>  
                </el-table-column>

             <el-table-column label="合同约定付款期" align="center">
                  <el-table-column  align="center" label="预付款" min-width="80">
                  <el-table-column prop="contractSubsistPrice" align="center" label="预付款金额" min-width="80">
                  <template slot-scope="scope">
                  {{scope.row.equipPay.contractSubsistPrice}}
                  </template>
                  </el-table-column>
                  <el-table-column prop="contractSubsistDate" align="center" label="预付款时间" min-width="80">
                  <template slot-scope="scope">
                  {{scope.row.equipPay.contractSubsistDate!==null?scope.row.equipPay.contractSubsistDate.substring(0,10):''}}
                  </template>
                  </el-table-column> 
                  </el-table-column>

                  <el-table-column align="center" label="发货款" min-width="80">
                  <el-table-column prop="contractShipmentPrice" align="center" label="发货款金额" min-width="80">
                  <template slot-scope="scope">
                  {{scope.row.equipPay.contractShipmentPrice}}
                  </template>
                  </el-table-column>
                  <el-table-column prop="contractShipmentDate" align="center" label="发货款付款时间" min-width="80">
                  <template slot-scope="scope">
                  {{scope.row.equipPay.contractShipmentDate!==null?scope.row.equipPay.contractShipmentDate.substring(0,10):''}}
                  </template>
                  </el-table-column> 
                  </el-table-column>

                  <el-table-column  align="center" label="验收款" min-width="80">
                  <el-table-column prop="contractAcceptancePrice" align="center" label="验收款金额" min-width="80">
                  <template slot-scope="scope">
                  {{scope.row.equipPay.contractAcceptancePrice}}
                  </template>
                  </el-table-column>
                  <el-table-column prop="contractAcceptanceDate" align="center" label="验收款付款时间" min-width="80">
                  <template slot-scope="scope">
                  {{scope.row.equipPay.contractAcceptanceDate!==null?scope.row.equipPay.contractAcceptanceDate.substring(0,10):''}}
                  </template>
                  </el-table-column> 
                  </el-table-column>

                  <el-table-column  align="center" label="质保款" min-width="80">
                  <el-table-column prop="contractWarrantyPrice" align="center" label="质保金金额" min-width="80">
                  <template slot-scope="scope">
                  {{scope.row.equipPay.contractWarrantyPrice}}
                  </template>
                  </el-table-column>
                  <el-table-column prop="contractWarrantyDate" align="center" label="质保金付款时间" min-width="80">
                   <template slot-scope="scope">
                  {{scope.row.equipPay.contractWarrantyDate!==null?scope.row.equipPay.contractWarrantyDate.substring(0,10):''}}
                  </template>  
                  </el-table-column> 
                  </el-table-column>
             </el-table-column>

             <el-table-column label="实际付款情况" align="center">
                  <el-table-column align="center" label="预付款" min-width="80">
                  <el-table-column prop="realSubsistPrice" align="center" label="预付款" min-width="80">
                  <template slot-scope="scope">
                  {{scope.row.equipPay.realSubsistPrice}}
                  </template>   
                  </el-table-column>
                  <el-table-column prop="realSubsistDate" align="center" label="付款时间" min-width="80">
                  <template slot-scope="scope">
                  {{scope.row.equipPay.realSubsistDate!==null?scope.row.equipPay.realSubsistDate.substring(0,10):''}}
                  </template> 
                  </el-table-column> 
                  </el-table-column>


                  <el-table-column align="center" label="发货款" min-width="80">
                  <el-table-column prop="realShipmentPrice" align="center" label="发货款" min-width="80">
                  <template slot-scope="scope">
                  {{scope.row.equipPay.realShipmentPrice}}
                  </template> 
                  </el-table-column>
                  <el-table-column prop="realShipmentDate" align="center" label="付款时间" min-width="80">
                   <template slot-scope="scope">
                  {{scope.row.equipPay.realShipmentDate!==null?scope.row.equipPay.realShipmentDate.substring(0,10):''}}
                  </template>  
                  </el-table-column> 
                  </el-table-column>

                  <el-table-column align="center" label="验收款" min-width="80">
                  <el-table-column prop="realAcceptancePrice" align="center" label="验收款" min-width="80">
                  <template slot-scope="scope">
                  {{scope.row.equipPay.realAcceptancePrice}}
                  </template>  
                  </el-table-column>
                  <el-table-column prop="realAcceptanceDate" align="center" label="付款时间" min-width="80">
                  <template slot-scope="scope">
                  {{scope.row.equipPay.realAcceptanceDate!==null?scope.row.equipPay.realAcceptanceDate.substring(0,10):''}}
                  </template>  
                  </el-table-column> 
                  </el-table-column>

                  <el-table-column align="center" label="质保款" min-width="80">
                  <el-table-column prop="realWarrantyPrice" align="center" label="质保金" min-width="80">
                   <template slot-scope="scope">
                  {{scope.row.equipPay.realWarrantyPrice}}
                  </template>    
                  </el-table-column>
                  <el-table-column prop="realWarrantyDate" align="center" label="付款时间" min-width="80">
                  <template slot-scope="scope">
                  {{scope.row.equipPay.realWarrantyDate!==null?scope.row.equipPay.realWarrantyDate.substring(0,10):''}}
                  </template>    
                  </el-table-column> 
                  </el-table-column>
             </el-table-column>
               
              <el-table-column prop="newEquipEvaluateCycle" align="center" label="新设备评价表验收周期（天）" min-width="80">
                  <template slot-scope="scope">
                  {{scope.row.equipBasis.newEquipEvaluateCycle}}
                  </template>
                </el-table-column> 

               <el-table-column prop="newEquipAcceptanceCycle" align="center" label="新设备验收单验收周期（天）" min-width="80">
                <template slot-scope="scope">
                  {{scope.row.equipBasis.newEquipAcceptanceCycle}}
                  </template>
                </el-table-column>

               <el-table-column prop="newEquipWarrantyCycle" align="center" label="设备质保验收单验收周期（天）" min-width="80">
                 <template slot-scope="scope">
                  {{scope.row.equipBasis.newEquipWarrantyCycle}}
                  </template>   
                </el-table-column>

             <el-table-column label="新设备试用评价" align="center"> 
                  <el-table-column prop="oneMonthRequestTime" align="center" label="要求完成时间" min-width="80">
                    <template slot-scope="scope">
                  {{scope.row.equipBasis.oneMonthRequestTime}}
                  </template>    
                  </el-table-column>
                  <el-table-column prop="oneMonthRealTime" align="center" label="实际完成时间" min-width="80">
                  <template slot-scope="scope">
                  {{scope.row.equipBasis.oneMonthRealTime}}
                  </template>
                  </el-table-column> 
             </el-table-column>

            <!--  <el-table-column label="新设备1周试用" align="center"> 
                  <el-table-column prop="requestTime" align="center" label="要求完成时间" min-width="80">
                  <template slot-scope="scope">
                  {{scope.row.equipOneWeekPlan.requestTime}}
                  </template>
                  </el-table-column>
                  <el-table-column prop="realTime" align="center" label="实际完成时间" min-width="80">
                  <template slot-scope="scope">
                  {{scope.row.equipOneWeekPlan.realTime}}
                  </template>
                  </el-table-column>
             </el-table-column> -->

             <el-table-column label="验收" align="center"> 
                  <el-table-column prop="threeMonthRequestTime" align="center" label="要求完成时间" min-width="80">
                    <template slot-scope="scope">
                  {{scope.row.equipBasis.threeMonthRequestTime}}
                  </template>
                  </el-table-column>
                  <el-table-column prop="threeMonthRealTime" align="center" label="实际完成时间" min-width="80">
                   <template slot-scope="scope">
                  {{scope.row.equipBasis.threeMonthRealTime}}
                  </template>
                  </el-table-column> 
             </el-table-column>

             <el-table-column label="质保验收" align="center"> 
                  <el-table-column prop="twelveMonthRequestTime" align="center" label="要求完成时间" min-width="80">
                  <template slot-scope="scope">
                  {{scope.row.equipBasis.twelveMonthRequestTime}}
                  </template> 
                  </el-table-column>
                  <el-table-column prop="realTime" align="center" label="实际完成时间" min-width="80">
                  <template slot-scope="scope">
                  {{scope.row.equipBasis.twelveMonthRealTime}}
                  </template>  
                    </el-table-column> 
             </el-table-column>

                <el-table-column prop="uTime" align="center" label="生成时间" min-width="80">
                 <template slot-scope="scope">
                  {{scope.row.equipPay.uTime}}
                  </template>  
                </el-table-column>           
             
              <el-table-column  align="center" label="操作" min-width="150" fixed="right" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-button title="编辑" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-if="edit"></el-button>
                  <el-button title="删除" type="danger" icon="el-icon-delete" size="mini"  @click="deleteBtn(scope.row)" v-if="cutout"></el-button>
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
          <el-dialog :close-on-click-modal="false" :title="textMap[dialogStatus]" v-dialogDrag top="10vh" width="1260px" :visible.sync="dialogFormVisible">
            <el-form :rules="rules" ref="dataForm" v-loading="fromLoading" :model="temp" label-width="100px">

              <el-row>
              <el-col :span="6">
              <el-form-item label="固定资产编号" prop="fixedAssetCode"  label-width="110px"> 
              <el-input v-model="temp.fixedAssetCode" maxlength="32" style="width:190px" class="enter medium-input judge" placeholder="请输入固定资产编号" :disabled='requerysty' @blur="triggerevent" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>
              <el-row>
              <el-col :span="6">     
              <el-form-item label="设备名称" prop="equipmentName">
              <el-input v-model="temp.equipmentName" style="width:190px" :disabled='siteCodeState'  maxlength="32" oninput="this.value=this.value.replace(/[^0-9A-z\.]/g,'')" class="enter medium-input" placeholder="请输入设备名称" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="6">
               <el-form-item label="型号规格" prop="model"> <!--@blur="normsevent" -->
              <el-input v-model="temp.model" maxlength="32" style="width:190px"  class="enter medium-input" :disabled='versionsty' placeholder="请输入型号规格" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="6">
              <el-form-item label="使用公司" prop="companyCode"  label-width="110px"> 
              <el-input v-model="temp.companyName" :disabled='siteCodeState' style="width:190px" class="enter medium-input" placeholder="请选择使用公司" ></el-input>
              <!-- <div class="buttonplace" id="buttstyps" @click="treeco">选择</div> -->
              </el-form-item>
              </el-col>
              <el-col :span="6">
              <el-form-item label="使用工厂" prop="factoryCode"> 
              <el-input v-model="temp.factoryName" style="width:190px" class="enter medium-input" :disabled='siteCodeState' placeholder="请选择使用工厂" ></el-input>
               <!-- <div class="buttonplace" id="buttstyps" @click="manufactory">选择</div> -->
              </el-form-item>
              </el-col>
               <el-col :span="6">
              <el-form-item label="使用部门" prop="divisionCode">
              <el-input v-model="temp.divisionName" style="width:190px" :disabled='siteCodeState' class="enter medium-input" placeholder="请选择使用部门" ></el-input>
              <!-- <div class="buttonplace" id="buttstyps" @click="treesection">选择</div> -->
              </el-form-item>     
              </el-col>
              <el-col :span="6">
              <el-form-item label="项目外部名称" prop="projectExternalName"  label-width="110px"> 
              <el-input v-model="temp.projectExternalName" :disabled='siteCodeState'  style="width:190px" class="enter medium-input" placeholder="请输入项目外部名称" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="6">
              <el-form-item label="数量" prop="amount"  label-width="110px"> 
              <el-input v-model="temp.amount" :disabled='siteCodeState'  style="width:190px" class="enter medium-input" placeholder="请输入数量" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="6">     
              <el-form-item label="单位" prop="unit">
              <el-input v-model="temp.unit" :disabled='siteCodeState' style="width:190px" class="enter medium-input" placeholder="请输入单位" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="6">
              <el-form-item label="备案编号" prop="filingNumber"  label-width="110px"> 
              <el-input v-model="temp.filingNumber" :disabled='siteCodeState'  style="width:190px" class="enter medium-input" placeholder="请输入备案编号" ></el-input>
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
                  format="yyyy-MM-dd"
                   disabled>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              </el-row>
              <br>

              <el-row>
              <el-col :span="6">
              <el-form-item label="采购申请日期" prop="purchaseApplicationDate" label-width="120px"> 
              <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.purchaseApplicationDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                   disabled>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
             <el-col :span="6">     
             <el-form-item label="应完成时间(采购申请日期)"  prop="purchaseApplicationRequestDate" label-width="107px">
             <el-input  v-model="temp.purchaseApplicationRequestDate" :disabled='siteCodeState' style="width:190px" class="enter medium-input" placeholder="请输入日期" ></el-input>
             </el-form-item> 
              </el-col>
              <el-col :span="6">
              <el-form-item label="实际完成时间" prop="purchaseCompletionDate"  label-width="110px"> 
              <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.purchaseCompletionDate"
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
                <!-- :disabled='siteCodeState' -->
              <el-row>
              <el-col :span="6">
              <el-form-item label="采购主体" prop="purchaseEntity"> 
              <el-input v-model="temp.purchaseEntity" :disabled='siteC'  maxlength="32" style="width:190px" class="enter medium-input" placeholder="请输入采购主体" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="7">     
              <el-form-item label="采购商" prop="buyers" label-width="107px">
              <el-input v-model="temp.buyers" maxlength="50" :disabled='purchasersty' style="width:230px" class="enter medium-input" placeholder="请输入采购商" ></el-input>
              </el-form-item>
              </el-col>
               <el-col :span="6">
              <el-form-item label="技改要求交付期" prop="requestDeliveryDate"  label-width="110px"> 
              <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.requestDeliveryDate"
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
 <!-- onkeyup="value=value.replace(/[^\d.]/g,'')" -->
              <el-row>
              <el-col :span="6">
              <el-form-item label="合同编号" prop="contractNumber"  label-width="110px"> 
              <el-input v-model="temp.contractNumber" :disabled='siteC' maxlength="32"  style="width:190px" class="enter medium-input" placeholder="请输入合同编号" ></el-input>
              </el-form-item>
              </el-col>
               <el-col :span="6">
              <el-form-item label="合同归档日期" prop="contractFilingDate"  label-width="110px"> 
              <div class="block">
                <el-date-picker
                  style="width:230px"
                  v-model="temp.contractFilingDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                   :disabled='siteC' @change="variety">
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
               <el-col :span="6">     
              <el-form-item label="交货周期" prop="deliveryPeriod"  label-width="110px"> 
              <el-input v-model="temp.deliveryPeriod" @change="postho" :disabled='siteC' maxlength="32"  style="width:170px" class="enter medium-input" placeholder="请输入交货周期" ></el-input>
               <span style="padding:0px;font-size:20px;font-weight:800;">天</span>
              </el-form-item>
              </el-col>
               <el-col :span="6">
              <el-form-item label="合同交货时间" prop="contractDeliveryDate" label-width="110px"> 
               <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.contractDeliveryDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  :disabled='siteC' @change="kepsp">
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="6">     
               <el-form-item label="采购渠道" prop="purchaseChannel"> 
               <el-radio :disabled='siteCodeState' v-model="temp.purchaseChannel" label="1">自制设备</el-radio>
               <el-radio :disabled='siteCodeState' v-model="temp.purchaseChannel" label="2">外购设备</el-radio>
              </el-form-item>
              </el-col>
              <el-col :span="6">     
              <el-form-item label="采购金额" prop="equipmentPrice"  label-width="110px"> 
              <el-input v-model="temp.equipmentPrice" :disabled='siteC' maxlength="32"  style="width:170px" class="enter medium-input" placeholder="请输入采购金额/单位:元" ></el-input>
               <span style="padding:0px;font-size:20px;font-weight:800;">元</span>
              </el-form-item>
              </el-col>
              </el-row>

               <!--   <el-col :span="8">
              <el-form-item label="发票号" prop="invoiceNumber" label-width="122px"> 
              <el-input v-model="temp.invoiceNumber" :disabled='siteC' maxlength="8" style="width:190px" class="enter medium-input" placeholder="请输入发票号" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="8">     
              <el-form-item label="发票金额" prop="invoice" label-width="107px">
              <el-input v-model="temp.invoice" :disabled='siteC' style="width:190px" maxlength="32" class="enter medium-input" placeholder="请输入发票金额/单位:元" onkeyup="value=value.replace(/[^\d.]/g,'')"></el-input>
              </el-form-item>
              </el-col> -->

             <!--  <el-col :span="8">
              <el-form-item label="开票时间" prop="invoiceDate"  label-width="110px"> 
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
              </el-col> -->


              <el-row>
              <el-col :span="6">
              <el-form-item label="出厂编号" prop="serialNumber"  label-width="110px"> 
              <el-input v-model="temp.serialNumber" :disabled='siteCodeState' style="width:190px" class="enter medium-input" placeholder="请输入出厂编号" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="6">
              <el-form-item label="送货单号" prop="deliveryNoteNumber"> 
              <el-input v-model="temp.deliveryNoteNumber" :disabled='siteCodeState' style="width:190px" class="enter medium-input" placeholder="请输入送货单号" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="6">     
              <el-form-item label="设备到厂时间(开箱日期)" prop="unpackingDate" label-width="107px">
              <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.unpackingDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                   disabled>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              <el-col :span="6">
              <el-form-item label="安装完成时间" prop="installDate"  label-width="110px"> 
              <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.installDate"
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

              <el-row>
              <el-col :span="2">
                <el-form-item label="发票信息" style="padding:0px 3px 0 0">
              </el-form-item>
              </el-col>
              <el-col :span="12">
              <li style="list-style:none;float:left;margin:5px 10px;" v-for="(nalist, index) in invoiceInfos" :key="index">
              <el-input v-model="invoiceInfos[index].code" :disabled='siteC' clearable maxlength="32" style="width:150px" class="enter medium-input" placeholder="请输入发票号"></el-input>
              <el-input v-model="invoiceInfos[index].price" :disabled='siteC' clearable style="width:220px" maxlength="32" class="enter medium-input" placeholder="请输入发票金额(只输数字)/元" onkeypress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46 || /\.\d\d{2}$/.test(value))event.returnValue=false" onchange="if(/\D/.test(this.value)){alert('只能输入数字');this.value='';}"></el-input>
               <!-- <span style="padding:0px;font-size:20px;font-weight:800;">元</span> -->
             <!--  <el-input v-model="invoiceInfoArrays[index].c" :disabled='siteC' style="width:150px" maxlength="32" class="enter medium-input" placeholder="请输入发票金额/单位:元"></el-input>     onkeyup="this.value=this.value.replace(/\D/g,'')"-->
               <el-date-picker
                  style="width:150px"
                  v-model="invoiceInfos[index].date"
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
              <!-- <el-col :span="6">
              <el-form-item label="付款方式" prop="payMethod"  label-width="110px"> 
               <el-select v-model="temp.payMethod" style="width:230px"
                  placeholder="请选择付款方式" 
                  clearable :disabled='siteC'>
                  <el-option v-for="item in deviceclass" 
                  :key="item.value" 
                  :label="item.label" 
                  :value="item.value" :disabled='siteC'>
                  </el-option>
                </el-select>
              </el-form-item>
              </el-col> -->
             
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
              <el-col :span="6" style="margin-left:5px">
              <el-form-item label="存档编号"  label-width="110px"> 
              <el-input v-model="temp.archiveNumber" :disabled='siteC' maxlength="64"  style="width:190px" class="enter medium-input" placeholder="请输入存档编号" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="6">
              <el-form-item label="采购单编号" prop="purchaseApplicationCode"  label-width="110px"> 
              <el-input v-model="temp.purchaseApplicationCode" :disabled='siteCodeState' style="width:190px" class="enter medium-input" placeholder="请输入采购单编号" ></el-input>
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
                  value-format="yyyy-MM-dd"
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
                  value-format="yyyy-MM-dd" :disabled='siteC'>
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
                  value-format="yyyy-MM-dd" :disabled='siteC'>
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
                  value-format="yyyy-MM-dd" :disabled='siteC'>
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
                  value-format="yyyy-MM-dd" :disabled='siteC' @change="postho">
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
                  value-format="yyyy-MM-dd" :disabled='siteC'>
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
                  value-format="yyyy-MM-dd" :disabled='siteC'>
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
                  value-format="yyyy-MM-dd" :disabled='siteC'>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              </el-row>


              <!-- <div class="line_01"><span>新设备评价试用</span></div> -->
              <div class="line_05">—————<span>新设备试用评价</span>————————————</div>
              

              <el-row>
              <el-col :span="8">     
              <el-form-item label="验收周期" prop="newEquipEvaluateCycle" label-width="107px">
              <el-input v-model="temp.newEquipEvaluateCycle" :disabled='siteC' style="width:90px"  maxlength="32" class="enter medium-input" placeholder="单位:天"   onkeyup="value=value.replace(/[^\d.]/g,'')"></el-input>
              <span style="padding:0px;font-size:20px;font-weight:800;">天</span>
              </el-form-item>
              </el-col>
              <el-col :span="8">     
              <el-form-item label="要求完成时间" prop="oneMonthRequestTime" label-width="120px">
               <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.oneMonthRequestTime"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                   disabled>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
               <el-col :span="8">
              <el-form-item label="实际完成时间" prop="oneMonthRealTime"  label-width="120px"> 
               <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.oneMonthRealTime"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                   disabled >
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              </el-row>

              <!-- <div class="line_01"><span>新设备验收试用</span></div> -->
               <div class="line_05">—————<span>验收</span>————————————</div>

              <el-row>
              <el-col :span="8">     
              <el-form-item label="验收周期" prop="newEquipAcceptanceCycle" label-width="107px">
              <el-input v-model="temp.newEquipAcceptanceCycle" :disabled='siteC' style="width:90px"  maxlength="32" class="enter medium-input" placeholder="单位:天"   onkeyup="value=value.replace(/[^\d.]/g,'')"></el-input>
              <span style="padding:0px;font-size:20px;font-weight:800;">天</span>
              </el-form-item>
              </el-col>
              <el-col :span="8">
              <el-form-item label="要求完成时间" prop="threeMonthRequestTime"  label-width="120px"> 
              <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.threeMonthRequestTime"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                   disabled>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              <el-col :span="8">     
              <el-form-item label="实际完成时间" prop="threeMonthRealTime" label-width="120px">
              <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.threeMonthRealTime"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                   disabled @change="basbal">
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              </el-row>

              <!-- <div class="line_01"><span>新设备质保验收试用</span></div> -->
               <div class="line_05">—————<span>质保验收</span>————————————</div>

              <el-row>
              <el-col :span="8">     
              <el-form-item label="验收周期" prop="newEquipWarrantyCycle" label-width="107px">
              <el-input v-model="temp.newEquipWarrantyCycle" :disabled='siteC' style="width:90px"  maxlength="32" class="enter medium-input" placeholder="单位:天"   onkeyup="value=value.replace(/[^\d.]/g,'')"></el-input>
              <span style="padding:0px;font-size:20px;font-weight:800;">天</span>
              </el-form-item>
              </el-col>
              <el-col :span="8">
              <el-form-item label="要求完成时间" prop="twelveMonthRequestTime"  label-width="134px"> 
               <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.twelveMonthRequestTime"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                   disabled>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
               <el-col :span="8">
              <el-form-item label="实际完成时间" prop="twelveMonthRealTime"  label-width="134px"> 
               <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.twelveMonthRealTime"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                   disabled @change="feistyl">
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              </el-row>

               <el-row>
               <el-col :span="8">     
              <el-form-item label="生成时间" prop="cTime" label-width="107px">
               <div class="block">
                <el-date-picker
                  style="width:210px"
                  v-model="temp.uTime"
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
              <el-button  type="primary" @click="updateData" v-if="showpop2">提交</el-button>
              <el-button  type="primary" @click="dialogFormVisible = false" v-if="showpop3">返回</el-button>
            </div>
          </el-dialog>
           <!-- 使用公司的弹框 -->
          <el-dialog title="使用公司" :close-on-click-modal="false" :visible.sync="treeFormVisible" :modal="false">
          <span style="margin-left:20px;color:red" >{{radio}}</span>
          <el-tree :data="datast" node-key="orgCode" check-strictly ref="tree" show-checkbox :props="defaultProps" @node-click="handleNodeClick"  @check-change="handleClick"></el-tree>
           <div slot="footer" class="dialog-footer">
              <!-- <el-button @click="clears">input框清空</el-button> -->
              <el-button @click="treeFormVisible = false">取消</el-button>
              <el-button type="primary" @click="treeFormVisible = false">确认</el-button>
            </div>
          </el-dialog>
           <!-- 使用部门的弹框 -->
           <el-dialog title="使用部门" :close-on-click-modal="false" :visible.sync="treeDepartment" :modal="false">
             <span style="margin-left:20px;color:red" >{{yesno}}</span>
           <el-tree :data="datalisy" :props="terrdef" @node-click="handleNodeClickst" check-strictly show-checkbox ref="treefrom" node-key="orgCode" @check-change="hlsoClick"></el-tree>
           <div slot="footer" class="dialog-footer">
              <!-- <el-button @click="clearsection">input框清空</el-button> -->
              <el-button @click="treeDepartment = false">取消</el-button>
              <el-button type="primary" @click="treeDepartment = false">确认</el-button>
            </div>
          </el-dialog>

           <!-- 使用工厂的弹框 -->
           <el-dialog title="使用工厂" :close-on-click-modal="false" :visible.sync="treeworks" :modal="false">
           <el-tree :data="plantlisy" :props="terrplant" @node-click="handleNodeClickworks"></el-tree>
           <div slot="footer" class="dialog-footer">
              <el-button @click="treeworks = false">取消</el-button>
              <el-button type="primary" @click="treeworks = false">确认</el-button>
            </div>
          </el-dialog>


      <!--   </el-container>
      </el-container> -->
    </el-container>
  </div>
</template>

<script>
import { fetchList, dendrogram, section, fetchPv, updateArticle, propertl, derivationst, examine, vrnorms } from '@/api/baseInfo/equipmentOverview'
import waves from '@/directive/waves' // 水波纹指令
import { fetchButton } from '@/api/common/button'
import { menuList } from '@/store/modules/permission'//按钮权限
export default {
  name: 'equipmentOverview',
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
      radio: '', // 使用公司树的数组
      yesno: '', // 使用部门
      // stno: '1', // 搜索里的是否共用
      showheast: false, // 这个是三角形控制的div显示
      hosesty: false, // 上三角
      stypot: true, // 下三角

      value13: [], // 备案时间数组
      procurement: [], // 采购申请日期
      achievest: [], // 应完成时间
      actualdata: [], // 实际完成时间
      bargaindate: [], // 合同归档日期
      technicaldate: [], // 技改日期
      deliverydate: [], // 合同交货时间
      factorydate: [], // 设备到厂日期
      aweekdeta: [], // 一周要求日期
      factweekdeta: [], // 一周实际日期
      monthdatest: [], // 1个月要求日期
      factmonths: [], // 1个月实际日期
      trimesterdatezy: [], // 3个月要求
      trimesterfact: [], // 3个月实际
      finaldates: [], // 12月
      gidatespta: [], // 12月实际
      listyst: [],
      lookList: [],
      nextlist: [],
      newlisttatle: [],
      grite: '',
      total: null,
      listQuery: {
        pageNum:1,
        pageSize:10
      },
      // 搜索字段
      listQueryst: {
       /*  companyCode: '',
        contractDeliveryDateEnd: '',
        contractDeliveryDateUp: '',
        contractFilingDateEnd: '',
        contractFilingDateUp: '',
        contractNumber: '',
        deliveryNoteNumber: '',
        divisionCode: '',
        equipmentName: '',
        equipmentPrice: '',
        factoryCode: '',
        filingNumber: '',
        filingTimeEnd: '',
        filingTimeUp: '',
        fixedAssetCode: '',
        invoice: '',
        invoiceNumber: '',
        model: '',
        payMethod: '',
        purchaseApplicationDate2End: '',
        purchaseApplicationDate2Up: '',
        purchaseApplicationDateEnd: '',
        purchaseApplicationDateUp: '',
        purchaseCompletionDateEnd: '',
        purchaseCompletionDateUp: '',
        realTimeOneMonthEnd: '',
        realTimeOneMonthUp: '',
        realTimeOneWeekEnd: '',
        realTimeOneWeekUp: '',
        realTimeThreeWeekEnd: '',
        realTimeThreeWeekUp: '',
        realTimeTwelveMonthEnd: '',
        realTimeTwelveMonthUp: '',
        requestDeliveryDateEnd: '',
        requestDeliveryDateUp: '',
        requestTimeOneMonthEnd: '',
        requestTimeOneMonthUp: '',
        requestTimeOneWeekEnd: '',
        requestTimeOneWeekUp: '',
        requestTimeThreeWeekEnd: '',
        requestTimeThreeWeekUp: '',
        requestTimeTwelveMonthEnd: '',
        requestTimeTwelveMonthUp: '',
        unpackingDateEnd: '',
        unpackingDateUp: ''*/
      }, 
      // 编辑的字段设置
      temp: {
        equipmentPrice: 0,
        invoice: 0,
        contractSubsistPrice: 0,
        contractShipmentPrice: 0,
        contractAcceptancePrice: 0,
        contractWarrantyPrice: 0,
        realSubsistPrice: 0,
        realShipmentPrice: 0,
        realAcceptancePrice: 0,
        realWarrantyPrice: 0,
        realTime1:'',
        requestTime1:'',
        realTime3:'',
        requestTime3:'',
        realTime12:'',
        requestTime12:''
      },

      // 按钮权限
      menuCode:'',
      addnewly: false, // 新
      edit: false, // 编
      cutout: false, // 删

      // 弹框显示
      dialogFormVisible: false,
      popTitle: '',
      dialogStatus: '',
      textMap: {
        update: '编辑',
        lookposypo: '查看'
      },
      showpop1:false,
      showpop2:false,
      showpop3:false,


      ster: {
        staCode: '',
        staName: ''
      },

      // 使用公司树的数据
       // 选中状态改变时
      i: 0,
      datast: [],
      defaultProps: {
        children: 'children',
        label: 'orgFullName'
      },
      // 使用部门树的数据
      datalisy: [],
      setlist:[],
      terrdef: {
        children: 'children',
        label: 'orgFullName'
      },
      orgsection:'',
      // 使用工厂树的数据
      plantlisy: [],
      terrplant: {
        children: 'children',
        label: 'orgFullName'
      },
      isAdd: false, // 新增or编辑
      siteDetail: false, // 新增、编辑弹窗
      editLoading: false, // 提交按钮加载动画
      showStatus: true, // 表单项显示状态
      formSearch_send: false, // 查询条件点选
      listLoading: true, // 远程搜索加载动画
      fromLoading:true,//加载的动画
      listLoad:true,
      dialogPvVisible: false,
      treeFormVisible: false, // 使用公司树选择
      treeDepartment: false, // 使用部门树选择
      treeworks: false, // 使用工厂树选择
      siteCodeState: true, // 禁用状态
      siteC:true,//查看禁用
      requerysty: false,
      versionsty:false,//型号规格
      purchasersty:false,//采购商

      invoiceInfos: [{
        code:'',
        date:'',
        price:''
      }],
     delShow: false,//发票信息的的减号隐藏
     plusShow: false,// 发票信息的加好隐藏
      
      // 弹框内输入框不填显示的提示信息  fixedAssetCode  buyers
      rules: {
        equipmentName: [{ required: true, message: '请输入设备名称', trigger: 'change' }],
        fixedAssetCode: [{ required: true, message: '请输入固定资产编号', trigger: 'change' }],
        model:[{ required: true, message: '请输入型号规格', trigger: 'change' }],
        buyers: [{ required: true, message: '请输入采购商', trigger: 'change' }],
        unit:[{ required: true, message: '请填写', trigger: 'change' }],
        amount:[{ required: true, message: '请填写', trigger: 'change' }],
        contractNumber:[{ required: true, message: '请输入合同编号', trigger: 'change' }],
        purchaseChannel:[{ required: true, message: '请选择', trigger: 'change' }],
        purchaseApplicationRequestDate:[{ required: true, message: '请填写', trigger: 'change' }],
        purchaseEntity:[{ required: true, message: '请输入采购主体', trigger: 'change' }],
        equipmentPrice:[{ required: false, validator: validateshortNumber, trigger: 'change' }],
        contractSubsistPrice:[{ required: false, validator: validateshortNumber, trigger: 'change' }],
        invoice:[{ required: false, validator: validateshortNumber, trigger: 'change' }],
        contractShipmentPrice:[{ required: false, validator: validateshortNumber, trigger: 'change' }],
        contractAcceptancePrice:[{ required: false, validator: validateshortNumber, trigger: 'change' }],
        contractWarrantyPrice:[{ required: false, validator: validateshortNumber, trigger: 'change' }],
        realSubsistPrice:[{ required: false, validator: validateshortNumber, trigger: 'change' }],
        realShipmentPrice:[{ required: false, validator: validateshortNumber, trigger: 'change' }],
        realAcceptancePrice:[{ required: false, validator: validateshortNumber, trigger: 'change' }],
        realWarrantyPrice:[{ required: false, validator: validateshortNumber, trigger: 'change' }],

       
         newEquipEvaluateCycle:[{ required: true, validator:vaNumber, trigger: 'change' }],
         newEquipAcceptanceCycle:[{ required: true, validator:vaNumber, trigger: 'change' }],
         newEquipWarrantyCycle:[{ required: true,  validator:vaNumber, trigger: 'change' }],
         deliveryPeriod:[{ required: false, validator:vaNumber, trigger: 'change' }]
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
    this.masntory()
    this.treecosytpi()  
    this.trction()

    
  },

  methods: {
    // 按钮的权限
    getbttonst() {
     menuList.forEach(item => {
        item.children.forEach(e=>{
          if(e.name == "equipmentOverview"){
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

    // 下三角按钮点击事件
    squareclick() {
      this.showheast = true
      this.stypot = false
      this.hosesty = true
    },
    // 上三角按钮点击事件
    tonesquareclick() {
      this.showheast = false
      this.stypot = true
      this.hosesty = false
    },
    // 使用公司清空按钮
    clears(){
    this.radio=''
    this.listQuery.companyCode=''
    this.treeFormVisible = false
    },
    // 使用部门清空按钮
    clearsection(){
    this.yesno=''  
    this.listQuery.divisionCode=''
    this.treeDepartment = false
    },  
    // 表格的接口
    getAA() {
      this.lookList = []
      console.log(6547)
      this.listLoading = true
      console.log(this.listQuery)
      // 付款方式的搜索判断
      if(this.rostpo == null){
         this.listQuery.payMethod = this.rostpo
        }else{
        this.listQuery.payMethod = this.rostpo.join(',')  
      }
      fetchList(this.listQuery).then(response => {
      if (response.data.code == 200) {
        if(response.data.data!=null && response.data.data.list!=null){
          this.listyst = response.data.data.list
          for (var i = 0; i < this.listyst.length; i++) {
            this.lookList.push(this.listyst[i])
          }
          console.log(this.lookList)
          //  this.newlisttatle = this.lookList
          console.log(this.newlisttatle)
          this.total = response.data.data.total
          this.$nextTick(() => {
            this.listLoading = false
          })
        }
         this.listLoading = false
        }else{
        this.listyst = []
        this.total = 0
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

     // 发票号新增
    addRow() {
      this.invoiceInfos.push({code:'',price:'',date:''})
      if (this.invoiceInfos.length == 1) {
        this.delShow = false
      }else{
        this.delShow = true
      }
    },
    // 发票号删除
    delRow(){ 
    this.invoiceInfos.pop({code:'',price:'',date:''})
    if (this.invoiceInfos.length == 1) {
        this.delShow = false
      }
    },
    // 合同归档时间 + 30天 = 预付款付款时间（合同约定）
   variety(){
      //      1天 = 86400000毫秒
      const datmint = 30*86400000
      const datastlist = new Date(this.temp.contractFilingDate)
      const time1 = datastlist.getTime()
      const op = time1 + datmint//7889400000-86400000// 3个月
      const newdate = new Date(op)
      const Y = newdate.getFullYear() + '-'
      const M = (newdate.getMonth() + 1 < 10 ? '0' + (newdate.getMonth() + 1) : newdate.getMonth() + 1) + '-'
      const D = newdate.getDate() + ' '
      // console.log(Y + M + D)
      this.temp.contractSubsistDate = Y + M + D
   },
   // 预付款付款时间（实际付款）+ 交货周期 （补充字段）=合同交货时间
    postho(){
       const datastlist3 = new Date(this.temp.realSubsistDate)
      if(this.temp.deliveryPeriod!==''||this.temp.deliveryPeriod!==null){
        var datmint1 = this.temp.deliveryPeriod*86400000
      }else{
        var datmint1 = 0
      }
      const time3 = datastlist3.getTime()
      const op3 = time3 + datmint1//31557600000 // 12个月
      const newdate3 = new Date(op3)
      const Y3 = newdate3.getFullYear() + '-'
      const M3 = (newdate3.getMonth() + 1 < 10 ? '0' + (newdate3.getMonth() + 1) : newdate3.getMonth() + 1) + '-'
      const D3 = newdate3.getDate() + ' '
      this.temp.contractDeliveryDate  = Y3 + M3 + D3  
      this.kepsp()
    },
    // 合同交货时间 - 7天= 发货款金额（合同约定）
    kepsp(){
      const datastlists2 = new Date(this.temp.contractDeliveryDate)
      const datmints2 = 7*86400000
      const times1 = datastlists2.getTime()
      const ops2 = times1 - datmints2
      var newdates2 = new Date(ops2)
      var Ys2 = newdates2.getFullYear() + '-'
      var Ms2 = (newdates2.getMonth() + 1 < 10 ? '0' + (newdates2.getMonth() + 1) : newdates2.getMonth() + 1) + '-'
      var Ds2 = newdates2.getDate() + ' '
      if(this.temp.contractDeliveryDate!==null || this.temp.contractDeliveryDate!==''){
         this.temp.contractShipmentDate  = Ys2 + Ms2 + Ds2
      }
    },
    // 实际完成时间（验收）+ 30天= 验收款付款时间（合同约定）
   basbal(){
     if(this.temp.threeMonthRealTime==null){
        this.temp.contractAcceptanceDate=null
     }else{
      const datmint = 30*86400000
      const datastlist = new Date(this.temp.threeMonthRealTime)
      const time1 = datastlist.getTime()
      const op = time1 + datmint//7889400000-86400000// 3个月
      const newdate = new Date(op)
      const Y = newdate.getFullYear() + '-'
      const M = (newdate.getMonth() + 1 < 10 ? '0' + (newdate.getMonth() + 1) : newdate.getMonth() + 1) + '-'
      const D = newdate.getDate() + ' '
      // console.log(Y + M + D)
      this.temp.contractAcceptanceDate = Y + M + D
     }
     
   },
  //  实际完成时间（质保验收）+30天= 质保金付款时间（合同约定）
  feistyl(){
    if(this.temp.twelveMonthRealTime==null){
       this.temp.contractWarrantyDate=null
    }else{
      const datmint = 30*86400000
      const datastlist = new Date(this.temp.twelveMonthRealTime)
      const time1 = datastlist.getTime()
      const op = time1 + datmint//7889400000-86400000// 3个月
      const newdate = new Date(op)
      const Y = newdate.getFullYear() + '-'
      const M = (newdate.getMonth() + 1 < 10 ? '0' + (newdate.getMonth() + 1) : newdate.getMonth() + 1) + '-'
      const D = newdate.getDate() + ' '
      // console.log(Y + M + D)
      this.temp.contractWarrantyDate = Y + M + D
    }
     
  },

    // 搜索
    handleFilter(data) {
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

    // 日期转化  搜索
    searchsty() {
      // 备案时间
      if (this.value13 == null) {
        this.listQuery.filingTimeUp = ''
        this.listQuery.filingTimeEnd = ''
      } else {
        this.listQuery.filingTimeUp = this.value13[0]// 开始时间
        this.listQuery.filingTimeEnd = this.value13[1]
      }
      // 采购申请日期
      if (this.procurement == null) {
        this.listQuery.purchaseApplicationDateUp = ''
        this.listQuery.purchaseApplicationDateEnd = ''
      } else {
        this.listQuery.purchaseApplicationDateUp = this.procurement[0]
        this.listQuery.purchaseApplicationDateEnd = this.procurement[1]
      }

      if (this.achievest == null) {
        this.listQuery.purchaseApplicationDate2Up = ''
        this.listQuery.purchaseApplicationDate2End = ''
      } else {
        this.listQuery.purchaseApplicationDate2Up = this.achievest[0]
        this.listQuery.purchaseApplicationDate2End = this.achievest[1]
      }
      // 采购实际完成日期
      if (this.actualdata == null) {
        this.listQuery.purchaseCompletionDateUp = ''
        this.listQuery.purchaseCompletionDateEnd = ''
      } else {
        this.listQuery.purchaseCompletionDateUp = this.actualdata[0]
        this.listQuery.purchaseCompletionDateEnd = this.actualdata[1]
      }
      // 合同归档日期
      if (this.bargaindate == null) {
        this.listQuery.contractFilingDateUp = ''
        this.listQuery.contractFilingDateEnd = ''
      } else {
        this.listQuery.contractFilingDateUp = this.bargaindate[0]
        this.listQuery.contractFilingDateEnd = this.bargaindate[1]
      }
      // 技改要求日期
      if (this.technicaldate == null) {
        this.listQuery.requestDeliveryDateUp = ''
        this.listQuery.requestDeliveryDateEnd = ''
      } else {
        this.listQuery.requestDeliveryDateUp = this.technicaldate[0]
        this.listQuery.requestDeliveryDateEnd = this.technicaldate[1]
      }
      // 合同交货
      if (this.deliverydate == null) {
        this.listQuery.contractDeliveryDateUp = ''
        this.listQuery.contractDeliveryDateEnd = ''
      } else {
        this.listQuery.contractDeliveryDateUp = this.deliverydate[0]
        this.listQuery.contractDeliveryDateEnd = this.deliverydate[1]
      }
      // 设备到厂时间
      if (this.factorydate == null) {
        this.listQuery.unpackingDateUp = ''
        this.listQuery.unpackingDateEnd = ''
      } else {
        this.listQuery.unpackingDateUp = this.factorydate[0]
        this.listQuery.unpackingDateEnd = this.factorydate[1]
      }
      //  1周要求和实际日期
      if (this.aweekdeta == null) {
        this.listQuery.requestTimeOneWeekUp = ''
        this.listQuery.requestTimeOneWeekEnd = ''
      } else {
        this.listQuery.requestTimeOneWeekUp = this.aweekdeta[0]
        this.listQuery.requestTimeOneWeekEnd = this.aweekdeta[1]
      }
      if (this.factweekdeta == null) {
        this.listQuery.realTimeOneWeekUp = ''
        this.listQuery.realTimeOneWeekEnd = ''
      } else {
        this.listQuery.realTimeOneWeekUp = this.factweekdeta[0]
        this.listQuery.realTimeOneWeekEnd = this.factweekdeta[1]
      }
      // 1个月要求和实际日期
      if (this.monthdatest == null) {
        this.listQuery.requestTimeOneMonthUp = ''
        this.listQuery.requestTimeOneMonthEnd = ''
      } else {
        this.listQuery.requestTimeOneMonthUp = this.monthdatest[0]
        this.listQuery.requestTimeOneMonthEnd = this.monthdatest[1]
      }
      if (this.factmonths == null) {
        this.listQuery.realTimeOneMonthUp = ''
        this.listQuery.realTimeOneMonthEnd = ''
      } else {
        this.listQuery.realTimeOneMonthUp = this.factmonths[0]
        this.listQuery.realTimeOneMonthEnd = this.factmonths[1]
      }
      // 3个月要求和实际日期
      if (this.trimesterdatezy == null) {
        this.listQuery.requestTimeThreeWeekUp = ''
        this.listQuery.requestTimeThreeWeekEnd = ''
      } else {
        this.listQuery.requestTimeThreeWeekUp = this.trimesterdatezy[0]
        this.listQuery.requestTimeThreeWeekEnd = this.trimesterdatezy[1]
      }
      if (this.trimesterfact == null) {
        this.listQuery.realTimeThreeWeekUp = ''
        this.listQuery.realTimeThreeWeekEnd = ''
      } else {
        this.listQuery.realTimeThreeWeekUp = this.trimesterfact[0]
        this.listQuery.realTimeThreeWeekEnd = this.trimesterfact[1]
      }
      // 12个月要求和实际日期
      if (this.finaldates == null) {
        this.listQuery.requestTimeTwelveMonthUp = ''
        this.listQuery.requestTimeTwelveMonthEnd = ''
      } else {
        this.listQuery.requestTimeTwelveMonthUp = this.finaldates[0]
        this.listQuery.requestTimeTwelveMonthEnd = this.finaldates[1]
      }
      if (this.gidatespta == null) {
        this.listQuery.realTimeTwelveMonthUp = ''
        this.listQuery.realTimeTwelveMonthEnd = ''
      } else {
        this.listQuery.realTimeTwelveMonthUp = this.gidatespta[0]
        this.listQuery.realTimeTwelveMonthEnd = this.gidatespta[1]
      }
    },

     // 树状图的接口
    treecosytpi() {
      this.datast.splice(0)
      dendrogram('').then(response => {
        this.datast.push(response.data.data)
         for(var i=0;i<this.datast.length;i++){
            if(this.datast[i].orgType =="部门"){
               this.datast[i].disabled = true
             }
          /*  console.log(this.datast[i].children) */
           for(var j=0;j<this.datast[i].children.length;j++){
            /*  console.log(this.datast[i].children[j]) */
             const child = this.datast[i].children[j]
             if(child.orgType =="部门"){
               child.disabled = true
             }
             if(child.children!==null){
               for(var p=0;p<child.children.length;p++){
                 if(child.children[p].orgType =="部门"){
                  child.children[p].disabled = true
             }
               }
             }
           }
         }
         this.$nextTick(() => {
          this.listLoad = false
        })
      })
    },
    // 使用公司的树选择按钮
    treeco(){
      this.treeFormVisible = true
      this.treecosytpi()
    },
    // 设置树状图单选
    handleClick(data, checked, node) {
      this.i++
      if (this.i % 1 == 0) {
        if (checked) {
          console.log(checked)
          console.log(data)
          this.$refs.tree.setCheckedNodes([])
          this.$refs.tree.setCheckedNodes([data])
          this.listQuery.companyCode = data.orgCode
          this.radio = data.orgFullName
          this.orgsection = data.orgCode
          this.temp.companyName = data.orgFullName
          this.temp.companyCode = data.orgCode
          // 交叉点击节点
        } else {
          this.$refs.tree.setCheckedNodes([])
          // 点击已经选中的节点，置空
        }
      }
    },

    // 树状图的点击方法
    handleNodeClick(data) {
     
    },
    // 使用部门树
    trction() {
      this.datalisy.splice(0)
       const orgCodest ={
        orgCode:this.orgsection
      } 
      section(orgCodest).then(response => {
        this.setlist.push(response.data.data)
        this.setlist.children = response.data.data
         this.datalisy=[
           {     
             orgFullName: this.radio,
             children: this.setlist.children,
             orgType:'公司'
           }
           ]

        // this.datalisy.push(response.data.data)
        for(var i=0;i<this.datalisy.length;i++){
              console.log(this.datalisy[i])
          if(this.datalisy[i].orgType =="公司"){
             this.datalisy[i].disabled = true
          }
          for(var j=0;j<this.datalisy[i].children.length;j++){
               
            const childsty = this.datalisy[i].children[j]
            if(childsty.orgType=="公司"){
               childsty.disabled = true
            }
            if(childsty.children!==null){
              for(var p=0;p<childsty.children.length;p++){
                const rosyt =childsty.children[p]
                if(rosyt.orgType =="公司"){
                 rosyt.disabled = true
               }
               if(rosyt.children!==null){
                 for(var k=0;k<rosyt.children.length;k++){
                   const postdis = rosyt.children[k]
                   if(postdis.orgType=="公司"){
                     postdis.disabled = true
                   }
                 }
               }
              }
            }
          }
        }
         this.$nextTick(() => {
          this.listLoad = false
        })
      })
    },
   
     treesection(){
       if( this.radio==''){
          this.$notify({
            title: '提示',
            message: '请选择使用公司',
            type: 'warning',
            duration: 3000
            })
          return
      }else{ 
      this.treeDepartment = true
      this.trction()
      }
     },

      hlsoClick(data, checked, node){
      this.i++
      if (this.i % 1 == 0) {
        if (checked) {
          this.$refs.treefrom.setCheckedNodes([])
          this.$refs.treefrom.setCheckedNodes([data])
          this.listQuery.divisionCode = data.orgCode
          this.yesno = data.orgFullName
          this.temp.divisionName = data.orgFullName
          this.temp.divisionCode = data.orgCode
          // 交叉点击节点
        } else {
          this.$refs.treefrom.setCheckedNodes([])
          // 点击已经选中的节点，置空
        }
      }
    },


    handleNodeClickst(data) {
      
    },
    // 使用工厂的树
    masntory() {
      this.plantlisy.splice(0)
      dendrogram('').then(response => {
        this.plantlisy.push(response.data.data)
         this.$nextTick(() => {
          this.listLoad = false
        })
      })
    },
   
     manufactory(){
      this.treeworks = true
      this.masntory()

     },
    handleNodeClickworks(data) {
      this.temp.factoryCode = data.orgCode
      this.temp.factoryName = data.orgFullName
    },

    // 导出
    derivation() {
      this.listQueryst.equipmentName = this.listQuery.equipmentName
      this.listQueryst.fixedAssetCode = this.listQuery.fixedAssetCode
      this.listQueryst.model = this.listQuery.model
      this.listQueryst.companyCode = this.listQuery.companyCode
      this.listQueryst.purchaseApplicationCode = this.listQuery.purchaseApplicationCode
      
      this.listQueryst.filingNumber = this.listQuery.filingNumber
      this.listQueryst.contractNumber = this.listQuery.contractNumber
      this.listQueryst.equipmentPrice = this.listQuery.equipmentPrice
      this.listQueryst.deliveryNoteNumber = this.listQuery.deliveryNoteNumber
      this.listQueryst.payMethod = this.listQuery.payMethod
      this.listQueryst.archiveNumber = this.listQuery.archiveNumber

      // 时间
      this.listQueryst.filingTimeUp = this.listQuery.filingTimeUp
      this.listQueryst.filingTimeEnd = this.listQuery.filingTimeEnd
      this.listQueryst.purchaseApplicationDateUp = this.listQuery.purchaseApplicationDateUp
      this.listQueryst.purchaseApplicationDateEnd = this.listQuery.purchaseApplicationDateEnd
      this.listQueryst.purchaseApplicationDate2Up = this.listQuery.purchaseApplicationDate2Up
      this.listQueryst.purchaseCompletionDateUp = this.listQuery.purchaseCompletionDateUp
      this.listQueryst.purchaseCompletionDateEnd = this.listQuery.purchaseCompletionDateEnd
      this.listQueryst.contractFilingDateUp = this.listQuery.contractFilingDateUp
      this.listQueryst.contractFilingDateEnd = this.listQuery.contractFilingDateEnd
      this.listQueryst.requestDeliveryDateUp = this.listQuery.requestDeliveryDateUp
      this.listQueryst.requestDeliveryDateEnd = this.listQuery.requestDeliveryDateEnd
      this.listQueryst.contractDeliveryDateUp = this.listQuery.contractDeliveryDateUp
      this.listQueryst.contractDeliveryDateEnd = this.listQuery.contractDeliveryDateEnd
      this.listQueryst.unpackingDateUp = this.listQuery.unpackingDateUp
      this.listQueryst.unpackingDateEnd = this.listQuery.unpackingDateEnd
      this.listQueryst.requestTimeOneWeekUp = this.listQuery.requestTimeOneWeekUp
      this.listQueryst.requestTimeOneWeekEnd = this.listQuery.requestTimeOneWeekEnd
      this.listQueryst.realTimeOneWeekUp = this.listQuery.realTimeOneWeekUp
      this.listQueryst.realTimeOneWeekEnd = this.listQuery.realTimeOneWeekEnd
      this.listQueryst.requestTimeOneMonthUp = this.listQuery.requestTimeOneMonthUp
      this.listQueryst.requestTimeOneMonthEnd = this.listQuery.requestTimeOneMonthEnd
      this.listQueryst.realTimeOneMonthUp = this.listQuery.realTimeOneMonthUp
      this.listQueryst.realTimeOneMonthEnd = this.listQuery.realTimeOneMonthEnd
      this.listQueryst.requestTimeThreeWeekUp = this.listQuery.requestTimeThreeWeekUp
      this.listQueryst.requestTimeThreeWeekEnd = this.listQuery.requestTimeThreeWeekEnd
      this.listQueryst.realTimeThreeWeekUp = this.listQuery.realTimeThreeWeekUp
      this.listQueryst.realTimeThreeWeekEnd = this.listQuery.realTimeThreeWeekEnd
      this.listQueryst.requestTimeTwelveMonthUp = this.listQuery.requestTimeTwelveMonthUp
      this.listQueryst.requestTimeTwelveMonthEnd = this.listQuery.requestTimeTwelveMonthEnd
      this.listQueryst.realTimeTwelveMonthUp = this.listQuery.realTimeTwelveMonthUp
      this.listQueryst.realTimeTwelveMonthEnd = this.listQuery.realTimeTwelveMonthEnd

      console.log(this.listQueryst)
      derivationst(this.listQueryst).then(response => {
         if (response.data.code == 200) {
          const liststyp = response.data.data
          console.log(liststyp)
          window.location.href = response.data.data
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

    // 删除事件
    deleteBtn(row) {
      console.log(row)
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
        const deleteid = {
          id: row.equipBasis.id
        }
        console.log(deleteid)
        fetchPv(deleteid).then(response => {
          if (response.data.code == 200) {
            this.getAA()
            const index = this.lookList.indexOf(row)
            console.log(index)
            this.lookList.splice(index, 1)
            console.log(this.lookList.splice(index, 1))
            this.$message({
              type: 'success',
              message: '删除成功!'
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
    // 查看
    checkDetails(row){
      console.log("pppp")
       // 判断是否填了固定资产编号填了就质灰
        this.requerysty = true
      // 判断是否填了型号规格填了就质灰
        this.versionsty = true
      // 判断是否填了采购商填了就质灰
        this.purchasersty = true

        this.showpop1 = false
        this.showpop2 = false
        this.showpop3 = true
        this.delShow = false//发票信息的减号
        this.plusShow = false//发票信息的加号
     const ids = { id: row.equipBasis.id }
      // id查询接口
      examine(ids).then(response => {
        this.popTitle = response.data.data
         console.log(311111111)
        console.log(this.popTitle)
        this.temp = Object.assign({}, this.popTitle.equipPay, this.popTitle.equipBasis)
        console.log(344444444)
        console.log(this.temp)
        this.temp.purchaseApplicationRequestDate =  this.popTitle.purchaseApplicationRequestDate
        /* this.temp.requestTime1 = this.popTitle.equipOneMonthPlan.requestTime
        this.temp.realTime1 = this.popTitle.equipOneMonthPlan.realTime

        this.temp.requestTime3 = this.popTitle.equipThreeWeekPlan.requestTime
        this.temp.realTime3 = this.popTitle.equipThreeWeekPlan.realTime

        this.temp.requestTime12 = this.popTitle.equipTwelveMonthPlan.requestTime
        this.temp.realTime12 = this.popTitle.equipTwelveMonthPlan.realTime */

        if (this.temp.contractSubsistPrice == '' || this.temp.contractSubsistPrice == null) {
          console.log(87899)
          this.temp.contractSubsistPrice = 0
        }
        if (this.temp.equipmentPrice == '' || this.temp.equipmentPrice == null) {
          this.temp.equipmentPrice = 0
        }
        if (this.temp.invoice == '' || this.temp.invoice == null) {
          this.temp.invoice = 0
        }
        if (this.temp.contractShipmentPrice == '' || this.temp.contractShipmentPrice == null) {
          this.temp.contractShipmentPrice = 0
        }
        if (this.temp.contractAcceptancePrice == '' || this.temp.contractAcceptancePrice == null) {
          this.temp.contractAcceptancePrice = 0
        }
        if (this.temp.contractWarrantyPrice == '' || this.temp.contractWarrantyPrice == null) {
          this.temp.contractWarrantyPrice = 0
        }
        if (this.temp.realSubsistPrice == '' || this.temp.realSubsistPrice == null) {
          this.temp.realSubsistPrice = 0
        }
        if (this.temp.realShipmentPrice == '' || this.temp.realShipmentPrice == null) {
          this.temp.realShipmentPrice = 0
        }
        if (this.temp.realAcceptancePrice == '' || this.temp.realAcceptancePrice == null) {
          this.temp.realAcceptancePrice = 0
        }
        if (this.temp.realWarrantyPrice == '' || this.temp.realWarrantyPrice == null) {
          this.temp.realWarrantyPrice = 0
        }
        console.log(67890)
        console.log(this.temp)
        this.feistyl()
        this.basbal()
      })
      this.siteCodeState = true
      this.siteC = true
      this.dialogStatus = 'lookposypo'
      this.dialogFormVisible = true
      this.fromLoading = false
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })

    },

    // 编辑点击打开弹窗事件  
    handleUpdate(row) {
      // 判断是否填了固定资产编号填了就质灰
      if (row.equipBasis.fixedAssetCode!== '' && row.equipBasis.fixedAssetCode!== null) {
        this.requerysty = true
      }else{
         this.requerysty = false
      }
      // 判断是否填了型号规格填了就质灰
      if (row.equipBasis.model!== '' && row.equipBasis.model!== null) {
        this.versionsty = true
      }else{
        this.versionsty = false
      }
      // 判断是否填了采购商填了就质灰
      if(row.equipBasis.buyers!==''&&row.equipBasis.buyers!==null){
        this.purchasersty = true
      }else{
        this.purchasersty = false
      }
      const ids = { id: row.equipBasis.id }
      // id查询接口
      examine(ids).then(response => {
        this.popTitle = response.data.data
        console.log(311111111)
        console.log(this.popTitle)
        this.temp = Object.assign({}, this.popTitle.equipPay, this.popTitle.equipBasis)
       
        console.log(this.temp)
        this.temp.purchaseApplicationRequestDate =  this.popTitle.purchaseApplicationRequestDate
        // 发票信息
         console.log(344444444)
        console.log(this.temp.invoiceInfos)
        if(this.temp.invoiceInfos!=null){
         this.invoiceInfos = this.temp.invoiceInfos
        }else if(this.temp.invoiceInfos==null){
         this.temp.invoiceInfos = [{code:'',date:'',price:''}]

         this.invoiceInfos = this.temp.invoiceInfos
         console.log(this.invoiceInfos)
        }else if(this.temp.invoiceInfos==''){
         this.temp.invoiceInfos = [{code:'',date:'',price:''}]

         this.invoiceInfos = this.temp.invoiceInfos
        }
        // 付款方式
        if(this.temp.payMethod!=''){
         this.roles = this.temp.payMethod.split(",")
        }
          
      // .split(',')
        if(this.popTitle.equipOneMonthPlan!=null){
        this.temp.requestTime1 = this.popTitle.equipOneMonthPlan.requestTime
        this.temp.realTime1 = this.popTitle.equipOneMonthPlan.realTime 
        }
       if(this.popTitle.equipThreeWeekPlan!=null){
        this.temp.requestTime3 = this.popTitle.equipThreeWeekPlan.requestTime
        this.temp.realTime3 = this.popTitle.equipThreeWeekPlan.realTime
       }
       if(this.popTitle.equipTwelveMonthPlan!=null){
        this.temp.requestTime12 = this.popTitle.equipTwelveMonthPlan.requestTime
        this.temp.realTime12 = this.popTitle.equipTwelveMonthPlan.realTime
       }
        
        if (this.temp.contractSubsistPrice == '' || this.temp.contractSubsistPrice == null) {
          console.log(87899)
          this.temp.contractSubsistPrice = 0
        }
        if (this.temp.equipmentPrice == '' || this.temp.equipmentPrice == null) {
          this.temp.equipmentPrice = 0
        }
        if (this.temp.invoice == '' || this.temp.invoice == null) {
          this.temp.invoice = 0
        }
        if (this.temp.contractShipmentPrice == '' || this.temp.contractShipmentPrice == null) {
          this.temp.contractShipmentPrice = 0
        }
        if (this.temp.contractAcceptancePrice == '' || this.temp.contractAcceptancePrice == null) {
          this.temp.contractAcceptancePrice = 0
        }
        if (this.temp.contractWarrantyPrice == '' || this.temp.contractWarrantyPrice == null) {
          this.temp.contractWarrantyPrice = 0
        }
        if (this.temp.realSubsistPrice == '' || this.temp.realSubsistPrice == null) {
          this.temp.realSubsistPrice = 0
        }
        if (this.temp.realShipmentPrice == '' || this.temp.realShipmentPrice == null) {
          this.temp.realShipmentPrice = 0
        }
        if (this.temp.realAcceptancePrice == '' || this.temp.realAcceptancePrice == null) {
          this.temp.realAcceptancePrice = 0
        }
        if (this.temp.realWarrantyPrice == '' || this.temp.realWarrantyPrice == null) {
          this.temp.realWarrantyPrice = 0
        }
        console.log(67890)
        console.log(this.temp)
        this.feistyl()
        this.basbal()
      })
      this.siteCodeState = true
      this.showpop1 = true
      this.showpop2 = true
      this.showpop3 = false
      this.siteC = false
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.fromLoading = false
      this.plusShow = true//发票信息的加号
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 判断是否固定资产编号有值
    triggerevent() {
      console.log(123455)
       console.log(this.temp.fixedAssetCode)
      const fixedAsse = { fixedAssetCode: this.temp.fixedAssetCode }
      console.log(fixedAsse)
      if(this.temp.fixedAssetCode =="" ){
        return
      }else if(this.temp.fixedAssetCode!==''){
      propertl(fixedAsse).then(response => {
        if (response.data.code == 1001) {
          this.$notify({
            title: '提示',
            type: 'warning',
            duration: 2000,
            message: response.data.msg
          })
          this.temp.fixedAssetCode=''
        }
      })
     }
  },
    // 判断是否型号规格有值
    normsevent() {
        console.log(123455)
       console.log(this.temp.model)
      const modelsty = { model: this.temp.model }
      if(this.temp.model==''){
        return
      }else if(this.temp.model!==''){
      vrnorms(modelsty).then(response => {
        if (response.data.code == 1002) {
          this.$notify({
            title: '提示',
            type: 'error',
            duration: 2000,
            message: response.data.msg
          })
        }
      })
     }
   },

    // 编辑提交按钮 newEquipEvaluateCycle  newEquipAcceptanceCycle newEquipWarrantyCycle
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          /*  const fixedAsse = {fixedAssetCode: this.temp.fixedAssetCode}
              propertl(fixedAsse).then(response => {
              if(response.data.code == 200){ */

             /* console.log(3456)
             console.log(this.invoiceInfos)
             console.log(this.temp)
             if(this.invoiceInfos!=null){
               for(var i=0;i<this.invoiceInfos.length;i++){
                 console.log(this.invoiceInfos[i].price)
                 var seetDatpo = this.invoiceInfos[i].price
                 if(seetDatpo!==''){
                 if(typeof seetDatpo!=='number'){
                   this.$notify({
                      title: '提示',
                      message: '发票信息只能输入数字',
                      type: 'warning',
                      duration: 3000
                      })
                  return
                 }
                }
               }
             }
console.log(343434) */
         if(this.temp.newEquipEvaluateCycle ==''|| this.temp.newEquipAcceptanceCycle ==''|| this.temp.newEquipWarrantyCycle ==''){
             this.$notify({
                title: '提示',
                message: '可编辑的必填项不能为空',
                type: 'warning',
                duration: 2000
              })
           return
          }else{  
          this.temp.cTime = ''
          this.temp.unpackingDate = ''
          this.temp.installDate = ''
          this.temp.invoiceInfos = this.invoiceInfos
          this.temp.payMethod = this.roles.join(',')
         
          var listsgu = this.temp
          console.log(listsgu)
          delete listsgu.requestDeliveryDate
          //  console.log(newst)
          const tempData = Object.assign({}, listsgu)
          //  console.log(tempData)
          this.fromLoading = true
          updateArticle(tempData).then(response => {
            const msg = response.data.msg
            if (response.data.code == 200) {
              for (const v of this.lookList) {
                //  console.log(this.lookList)
                if (v.id === this.temp.id) {
                  const index = this.lookList.indexOf(v)
                  this.lookList.splice(index, 1, this.temp)

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
              this.getAA()
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
   this.fromLoading = false
     }
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
.buttonplace{
height:36px;
background:#409EFF;
color:#fff;
border:1px solid #fff;
position:absolute;
right:0;
top:0;
border-radius: 5px;
}
.buces{
  height:36px;
background:#409EFF;
color:#fff;
border:1px solid #fff;
position:absolute;
right:-50px;
top:0;
border-radius: 5px;
}
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
.square{
width: 0;
height: 0;
border-width: 18px;
border-style: solid;
border-color: #409EFF transparent transparent transparent;
margin:0 auto;
cursor: pointer;
margin-top: -25px;
}
#buttstyps{
   width:42px;
   height:36px;
   cursor:pointer;
   text-align:center;
}
.tonesquare{
width: 0;
height: 0;
border-width: 18px;
border-style: solid;
border-color: transparent transparent #409EFF transparent;
margin:0 auto;
cursor: pointer;
}
.el-tree-node__content:hover {
  background-color: #6dc6fa;
  border-radius:3%
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
