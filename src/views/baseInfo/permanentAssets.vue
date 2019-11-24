<template>
  <div class="app-container">
    <!--外部容器  -->
    <el-container>
       <!-- 顶部搜索  equipName  fixedAssetCode-->
        <div class="filter-container">
            <div class="formSearch">
            <el-form :inline="true">
                <el-form-item label="设备名称" >
                <el-input v-model="listQuery.equipName"  placeholder="请输入设备名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="固定资产编号">
                <el-input class="minier-input" v-model="listQuery.fixedAssetCode" placeholder="请输入固定资产编号" clearable></el-input>
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
            <el-button class="filter-item" @click="handleCreate" v-if="addplso" type="primary" icon="el-icon-edit">新增</el-button>
            <el-button class="filter-item" @click="derivation" v-if="addnewly" type="primary" icon="el-icon-download">导出</el-button>
           
            <el-table :data="listyst" v-loading="listLoading" border fit highlight-current-row
              style="width: 100%;min-height:auto;margin-top:8px" height="500" :header-cell-style="{background:'oldlace'}">
                 <el-table-column  align="center" label="序号" fixed="left" min-width="80" type="index"></el-table-column>

                 <el-table-column prop="equipmentName" align="center" fixed="left" label="设备名称" min-width="80">
                 <template slot-scope="scope">
                 <span class="link-type futiop" @click='checkDetails(scope.row)'>{{scope.row.equipmentName}}</span>
                 </template>
                 </el-table-column>

               <el-table-column prop="fixedAssetCode" fixed="left" align="center" label="固定资产编号" min-width="100">
                 </el-table-column>
                  <el-table-column prop="equipmentLocation" align="center" label="设备所在地" min-width="100">
                 </el-table-column>
                <el-table-column prop="model" align="center" label="型号规格" min-width="80">
                    
                 </el-table-column>
              <el-table-column prop="assetOwnershipCompanyName" align="center" label="资产归属公司" min-width="80">
                 </el-table-column>
                <el-table-column prop="companyName" align="center" label="使用公司" min-width="80">
                 </el-table-column>
                <el-table-column prop="factoryName" align="center" label="使用工厂" min-width="80">
                 </el-table-column>
                <el-table-column prop="divisionName" align="center" label="使用部门" min-width="80">
                 </el-table-column>
                <el-table-column prop="purchaseEntity" align="center" label="采购主体" min-width="80">
                 </el-table-column>
                <el-table-column prop="purchaseChannel" align="center" label="采购渠道" min-width="80">
                 </el-table-column>
                <el-table-column prop="buyers" align="center" label="采购商" min-width="80">
                 </el-table-column>
                <el-table-column prop="purchaseDate" align="center" label="采购时间" min-width="80">
                   <template slot-scope="scope">
                  {{scope.row.purchaseDate!==null?scope.row.purchaseDate.substring(0,10):''}}
                 </template>
                 </el-table-column> 
                <el-table-column prop="purchasePrice" align="center" label="采购金额" min-width="80">
                 </el-table-column>
                <el-table-column prop="manufacturer" align="center" label="制造厂家" min-width="80">
                 </el-table-column>
                 <el-table-column prop="projectExternalName" align="center" label="项目外部名称" min-width="80">
                 </el-table-column>
                <el-table-column prop="depreciationPeriod" align="center" label="折旧年限（财务）" min-width="80">
                 </el-table-column> 
                <el-table-column prop="isShareName" align="center" label="是否共用" min-width="80">
                 </el-table-column>
                  <el-table-column prop="applyLdleTime" align="center" label="申请闲置日期" min-width="80">
                  <template slot-scope="scope">
                  {{scope.row.applyLdleTime!==null?scope.row.applyLdleTime.substring(0,10):''}}
                 </template>
                 </el-table-column>
                <el-table-column prop="scrapTime" align="center" label="报废日期" min-width="80">
                   <template slot-scope="scope">
                  {{scope.row.scrapTime!==null?scope.row.scrapTime.substring(0,10):''}}
                 </template>
                 </el-table-column>
                  <el-table-column prop="renovationFee" align="center" label="改造费（元）" min-width="80">
                 </el-table-column>
                 <el-table-column prop="originalFinancialValue" align="center" label="财务原值（元）" min-width="80">
                 </el-table-column>
                  <el-table-column prop="netBookValue" align="center" label="账面净值（元）" min-width="80">
                 </el-table-column>
                  <el-table-column prop="transferDate" align="center" label="调拨日期" min-width="80">
                  <template slot-scope="scope">
                  {{scope.row.transferDate!==null?scope.row.transferDate.substring(0,10):''}}
                 </template>
                 </el-table-column>
                 <el-table-column prop="transferCompanyName" align="center" label="调拨后所在公司" min-width="80">
                 </el-table-column>
                  <el-table-column prop="transferDivisionCode" align="center" label="调拨使用部门" min-width="80">
                 </el-table-column>
                <el-table-column prop="unpackingDate" align="center" label="到厂时间" min-width="80">
                <template slot-scope="scope">
                  {{scope.row.unpackingDate!==null?scope.row.unpackingDate.substring(0,10):''}}
                 </template>
                 </el-table-column>
                  <el-table-column prop="installDate" align="center" label="安装完成时间" min-width="80">
                <template slot-scope="scope">
                  {{scope.row.installDate!==null?scope.row.installDate.substring(0,10):''}}
                 </template>  
                 </el-table-column>
                  <el-table-column prop="archiveNumber" align="center" label="存档编号" min-width="80">
                 </el-table-column>
               <!--   <el-table-column prop="invoiceDate" align="center" label="发票情况（发票号/发票金额/开票时间）" min-width="180">
                 </el-table-column> -->
                   <el-table-column prop="invoiceInfo" align="center" label="发票情况（发票号/发票金额/开票时间）" min-width="160">
                 <!-- <template slot-scope="scope">
                  <div v-for="item in scope.row.invoiceInfos" :key="item.id" style="padding:5px;">
                    <span v-if="item.code">{{item.code}}/</span>
                    <span v-if="item.price">{{item.price}}</span>
                    <span v-if="item.date">/{{item.date}}</span>
                    </div>
                  </template>   -->
                </el-table-column>
                <el-table-column prop="cTime" align="center" label="生成时间" min-width="100">
                 </el-table-column>
                                             <!-- v-if="edit"  remark-->
                <el-table-column fixed="right" align="center" label="操作" min-width="150"  class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-button title="编辑" type="primary" v-if="edit" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)"></el-button>
                  <el-button title="删除" type="danger" v-if="cutout" icon="el-icon-delete" size="mini"  @click="deleteBtn(scope.row)"></el-button>
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
          <el-dialog :title="textMap[dialogStatus]" v-dialogDrag top="10vh" width="1180px" :visible.sync="dialogFormVisible">
            <el-form :rules="rules" ref="dataForm" :model="temp" label-width="110px">

              <el-row>
              <el-col :span="8">     
              <el-form-item label="固定资产编号" prop="fixedAssetCode">
              <el-input v-model="temp.fixedAssetCode" style="width:190px" @blur="triggerevent" :disabled='siteC' oninput="this.value=this.value.replace(/[^0-9A-z\.]/g,'')" class="enter medium-input" placeholder="请输入固定资产编号" ></el-input>
              </el-form-item>
              </el-col>
             <!--  <el-col :span="8">     
              <el-form-item label="设备名称" prop="equipmentName">
              <el-input v-model="temp.equipmentName" style="width:190px" :disabled='siteC' class="enter medium-input" placeholder="请输入设备名称" ></el-input>
              </el-form-item>
              </el-col> -->
              <el-col :span="8">
              <el-form-item label="设备名称" prop="equipmentName"> 
               <el-select style="width:190px" :disabled='siteC' v-model="temp.equipmentName" filterable remote 
                  reserve-keyword placeholder="请输入设备名称" 
                  :remote-method="getCustomer"  v-loading="listLoading"
                  clearable class="medium-input" @change="opopo">
                  <el-option v-for="item in sendCustomer_options" 
                  :key="item.value" 
                  :label="item.label" 
                  :value="item.label">
                  <span style="float: left; font-size: 13px;">{{ item.label }}</span>
                  
                  </el-option>
                </el-select>
               
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">
              <el-form-item label="设备所在地" prop="equipmentLocation"> 
              <el-input v-model="temp.equipmentLocation" :disabled='siteC' style="width:190px"  class="enter medium-input" placeholder="请输入设备所在地"></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="8">
              <el-form-item label="规格型号" prop="model"  label-width="110px"> 
              <el-input v-model="temp.model" :disabled='siteC' style="width:190px" class="enter medium-input" placeholder="请输入规格型号" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="8">
              <el-form-item label="资产归属公司" prop="assetOwnershipCompanyName"> 
              <el-input v-model="temp.assetOwnershipCompanyName"  style="width:190px" class="enter medium-input" :disabled='siteC' placeholder="请输入资产归属公司" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">
              <el-form-item label="使用公司" prop="companyName">
              <el-input v-model="temp.companyName" :disabled="true" clearable style="width:190px" class="enter medium-input" placeholder="请输入使用公司" ></el-input>
              <div type="primary" v-if="showName" class="buttonplace" disabled id="buttstyps" @click="treeco">选择</div>
               <div class="buces" v-if="showName" id="buttstyps" @click="clears">清空</div>
              </el-form-item>     
              </el-col>
              <el-col :span="8">     
              <el-form-item label="使用工厂" prop="factoryName">
              <el-input v-model="temp.factoryName" :disabled="true" style="width:190px"  class="enter medium-input" placeholder="请输入使用工厂" ></el-input>
              <div class="buttonplace" v-if="showName" id="buttstyps" @click="manuf" >选择</div>
              <div class="buces" v-if="showName" id="buttstyps" @click="poacksty" >清空</div>
              </el-form-item>
              </el-col>
               <el-col :span="8">     
              <el-form-item label="使用部门" prop="divisionName">
              <el-input v-model="temp.divisionName" :disabled="true"  style="width:190px"  class="enter medium-input" placeholder="请输入使用部门" ></el-input>
              <div class="buttonplace" v-if="showName" id="buttstyps" @click="treesection" >选择</div>
              <div class="buces" v-if="showName" id="buttstyps" @click="blion">清空</div>
              </el-form-item>
              </el-col>
              
              </el-row>

              <el-row>
              <el-col :span="8">
              <el-form-item label="采购主体" prop="purchaseEntity"  label-width="110px"> 
              <el-input v-model="temp.purchaseEntity" :disabled='siteC'  style="width:190px" class="enter medium-input" placeholder="请输入采购主体" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="8">
              <el-form-item label="采购渠道" prop="purchaseChannel"> 
               <el-radio :disabled='siteC' v-model="temp.purchaseChannel" label="1">自制设备</el-radio>
               <el-radio :disabled='siteC' v-model="temp.purchaseChannel" label="2">外购设备</el-radio>
              </el-form-item>
              </el-col>
              <el-col :span="8">
              <el-form-item label="采购商" prop="buyers"  label-width="110px"> 
              <el-input v-model="temp.buyers" :disabled='siteC'  style="width:170px" class="enter medium-input" placeholder="请输入采购商" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
               <el-col :span="8">
              <el-form-item label="采购时间" prop="purchaseDate"> 
              <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.purchaseDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd hh:mm:ss" :disabled='siteC'>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              <el-col :span="8">
              <el-form-item label="采购金额" prop="purchasePrice"  label-width="110px"> 
              <el-input v-model="temp.purchasePrice" :disabled='siteC'  style="width:170px" class="enter medium-input" placeholder="请输入采购金额" ></el-input>
              <span style="padding:0px;font-size:20px;font-weight:800;">元</span>
              </el-form-item>
              </el-col>
              <el-col :span="8">     
             <el-form-item label="制造厂家" prop="manufacturer" label-width="107px">
             <el-input v-model="temp.manufacturer" :disabled='siteC' style="width:190px" class="enter medium-input" placeholder="请输入制造厂家" ></el-input>
              </el-form-item> 
              </el-col>
              </el-row>
              
              <el-row>
               <el-col :span="8">
              <el-form-item label="项目外部名称" prop="projectExternalName"> 
              <el-input v-model="temp.projectExternalName" :disabled='siteC' style="width:190px" class="enter medium-input" placeholder="请输入项目外部名称" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="8">
              <el-form-item label="折旧年限（财务）" prop="depreciationPeriod"  label-width="110px"> 
              <el-input v-model="temp.depreciationPeriod" :disabled='siteC' style="width:170px" class="enter medium-input" placeholder="请输入折旧年限" ></el-input>
              <span style="padding:0px;font-size:20px;font-weight:800;">年</span>
              </el-form-item>
              </el-col>
              <el-col :span="8">
              <el-form-item label="是否共用" prop="isShare"> 
               <el-radio :disabled='siteC' v-model="temp.isShare" label="1">共用</el-radio>
               <el-radio :disabled='siteC' v-model="temp.isShare" label="0">不共用</el-radio>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">
              <el-form-item label="申请闲置日期" prop="applyLdleTime"  label-width="110px"> 
              <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.applyLdleTime"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd hh:mm:ss"
                  :disabled='siteC'>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              <el-col :span="8">
              <el-form-item label="报废日期" prop="scrapTime"  label-width="110px"> 
              <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.scrapTime"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd hh:mm:ss"
                  :disabled='siteC'>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              <el-col :span="8">     
              <el-form-item label="改造费" prop="renovationFee"  label-width="110px"> 
              <el-input v-model="temp.renovationFee" :disabled='siteC' style="width:170px" class="enter medium-input" placeholder="请输入改造费" onkeyup="value=value.replace(/[^\d.]/g,'')"></el-input>
              <span style="padding:0px;font-size:20px;font-weight:800;">元</span>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">     
              <el-form-item label="财务原值" prop="originalFinancialValue"  label-width="110px"> 
              <el-input v-model="temp.originalFinancialValue" :disabled='siteC' style="width:170px" class="enter medium-input" placeholder="请输入财务原值" onkeyup="value=value.replace(/[^\d.]/g,'')"></el-input>
              <span style="padding:0px;font-size:20px;font-weight:800;">元</span>
              </el-form-item>
              </el-col>
              <el-col :span="8">     
              <el-form-item label="账面净值" prop="netBookValue" label-width="107px">
              <el-input v-model="temp.netBookValue" :disabled='siteC' style="width:170px" class="enter medium-input" placeholder="请输入账面净值" ></el-input>
              <span style="padding:0px;font-size:20px;font-weight:800;">元</span>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">
              <el-form-item label="调拨日期" prop="transferDate" label-width="110px"> 
               <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.transferDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd hh:mm:ss"
                   :disabled='siteC'>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              <el-col :span="8">
              <el-form-item label="调拨后所在公司" prop="transferCompanyName" label-width="122px"> 
              <el-input v-model="temp.transferCompanyName" :disabled='siteC' style="width:170px" class="enter medium-input" placeholder="请输入调拨后所在公司" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="8">
              <el-form-item label="调拨使用部门" prop="transferDivisionName" label-width="122px"> 
              <el-input v-model="temp.transferDivisionName" :disabled='siteC' style="width:170px" class="enter medium-input" placeholder="请输入调拨使用部门" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>
              <br>

              <el-row>
               <el-col :span="8">
              <el-form-item label="到厂时间（入库日期）" prop="unpackingDate"  label-width="110px"> 
              <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.unpackingDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd hh:mm:ss"
                   :disabled='siteC'>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              <el-col :span="8">
              <el-form-item label="安装完成时间" prop="installDate"  label-width="110px"> 
              <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.installDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd hh:mm:ss" :disabled='siteC'>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
               <el-col :span="8">     
              <el-form-item label="存档编号" prop="archiveNumber" label-width="107px">
              <el-input v-model="temp.archiveNumber" :disabled='siteC' style="width:170px" class="enter medium-input" placeholder="请输入存档编号" onkeyup="value=value.replace(/[^\d.]/g,'')"></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="2.5">
                <el-form-item label="发票信息" style="padding:0px 3px 0 0">
              </el-form-item>
              </el-col>
              <el-col :span="15">
              <li style="list-style:none;float:left;margin:5px 10px;" v-for="(nalist, index) in invoiceInfos" :key="index">
              <el-input v-model="invoiceInfos[index].code" :disabled='siteC' clearable  style="width:150px" class="enter medium-input" placeholder="请输入发票号"></el-input>
              <el-input v-model="invoiceInfos[index].price" :disabled='siteC' clearable style="width:220px"  class="enter medium-input" placeholder="请输入发票金额(只输数字)/元" onkeypress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46 || /\.\d\d{2}$/.test(value))event.returnValue=false" onchange="if(/\D/.test(this.value)){alert('只能输入数字');this.value='';}"></el-input>
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

              <el-row>
              <el-col :span="8">     
              <el-form-item label="生成时间" prop="cTime" label-width="107px">
               <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.cTime"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd hh:mm:ss"
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
              <el-button  type="primary" @click="createData" v-if="showpop4">提交</el-button>
              <el-button  type="primary" @click="dialogFormVisible = false" v-if="showpop3">返回</el-button>
            </div>
          </el-dialog>
           <!-- 使用公司的弹框 -->
          <el-dialog width="50%" title="使用公司" :close-on-click-modal="false" :visible.sync="treeFormVisible" append-to-body>
          <el-container>
					<el-aside width="500px">
          <!-- <span style="margin-left:20px;color:red" >{{radio}}</span> -->
          <el-tree :data="datast" :props="defaultProps" default-expand-all check-strictly ref="tree" node-key="orgCode" show-checkbox @check-change="handleClick"></el-tree>
        
          </el-aside>
					</el-container>

           <div slot="footer" class="dialog-footer">
              <el-button @click="treeFormVisible = false">取消</el-button>
              <el-button type="primary" @click="applist">确认</el-button>
            </div>
          </el-dialog>
          <!-- 使用工厂的弹框 -->
           <el-dialog width="40%" title="使用工厂" :close-on-click-modal="false" :visible.sync="treeworks" append-to-body>
           <el-container>
					 <el-aside width="500px">  
           <el-tree :data="plantlisy" :props="terrplant" check-strictly ref="treeplisy" node-key="orgCode" show-checkbox highlight-current @check-change="hocheckck"></el-tree>
           </el-aside>
					 </el-container>
           <div slot="footer" class="dialog-footer">
              <el-button @click="treeworks = false">取消</el-button>
              <el-button type="primary" @click="treeworks = false">确认</el-button>
            </div>
          </el-dialog>
          <!-- 使用部门的弹框 -->
           <el-dialog width="40%" title="使用部门" :close-on-click-modal="false" :visible.sync="treeDepartment" append-to-body>
           <el-container>
					 <el-aside width="500px">
            <!-- <span style="margin-left:20px;color:red" >{{yesno}}</span> -->
           <el-tree :data="datalisy"
            :props="terrdef" check-strictly  ref="treefrom" node-key="orgCode" show-checkbox  @check-change="hlsoClick"></el-tree>
           </el-aside>
					 </el-container>
           <div slot="footer" class="dialog-footer">
              <el-button @click="treeDepartment = false">取消</el-button>
              <el-button type="primary" @click="treeDepartment = false">确认</el-button>
            </div>
          </el-dialog>

    </el-container>
  </div>
</template>
 
<script>
import { fetchList, derivationst,selectById,updateArticle,fetchPv,addpost,propertl,dendrogram,section,works,fuzzyQuery } from '@/api/baseInfo/permanentAssets'
import waves from '@/directive/waves' // 水波纹指令
import { fetchButton } from '@/api/common/button'
import { menuList } from '@/store/modules/permission'//按钮权限
export default {
  name: 'permanentAssets',
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
       staName: '',
       sendCustomer_options: [], // 新增里的模糊查询(设备名称)

      showName:false,
      // 使用公司树的数据
      radio: '', // 使用公司
      copName:'',

      yesno: '', // 使用部门
      datast: [],
      defaultProps: {
        children: 'children',
        label: 'orgFullName'
      },
      // 使用部门树的数据
      orgsection:'',//使用部门的编号
      datalisy: [],
      setlist:[],
      r:0,
      i:0,
      terrdef: {
        children: 'children',
        label: 'orgFullName'
      },
      // 使用工厂树的数据
      plantlisy: [],
      terrplant: {
        children: 'children',
        label: 'orgFullName'
      },
     orgsewokes:'',
     postyly:'',
     factName:'',
     treeFormVisible: false, // 使用公司树选择
     treeDepartment: false, // 使用部门树选择
     treeworks: false, // 使用工厂树选择
    //  发票信息
    invoiceInfos: [{
        code:'',
        date:'',
        price:''
      }],
     delShow: false,//发票信息的的减号隐藏
     plusShow: false,// 发票信息的加好隐藏
      listyst: [],
      lookList: [],
      grite: '',
      total: null,
      listQuery: {
       equipName:'',  
       fixedAssetCode:''
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
        lookpostyo: '查看',
        create: '新增'

      },
      showpop1:false,
      showpop2:false,
      showpop3:false,
      showpop4:false,
      temp:{
        companyName:'',
        companyCode:'',
        factoryName:'',  
        factoryCode:'',
        divisionCode:'',
        divisionName:'',
        equipmentCode:'',  
        equipmentName:''
      },
      // 按钮权限
      addnewly: false, // 导出
      edit: false, // 编
      cutout: false, // 删
      addplso:false,//新增
      listLoading: true, // 远程搜索加载动画
      siteCodeState:true,// 禁用状态
      siteC:true,//查看禁用
      fromLoading: true, // 弹出框加载动画
      // 弹框内输入框不填显示的提示信息 repairCompany repairDivision
      rules: {
       fixedAssetCode:[{ required: true, message: '请输入固定资产编号', trigger: 'change' }],
       equipmentName:[{ required: true, message: '请输入设备名称', trigger: 'change' }]
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
    // 按钮的权限
    getbttonst() {
		menuList.forEach(item => {
        item.children.forEach(e=>{
          if(e.name == "permanentAssets"){
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
            if (authority[i].buttonName == '导出') {
              this.addnewly = true
            } else if (authority[i].buttonName == '编辑') {
              this.edit = true
            } else if (authority[i].buttonName == '删除') {
              this.cutout = true
            }else if(authority[i].buttonName == '新增'){
              this.addplso = true
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
      fetchList(this.pageNum,this.pageSize,this.listQuery).then(response => {
        this.listyst = response.data.data.list
         for(var i = 0; i < this.listyst.length; i++){
           if(this.listyst[i].isShare === 1){
              this.listyst[i].isShareName = '共用'
           }else if(this.listyst[i].isShare === 0){
             this.listyst[i].isShareName = '不共用'
           }
         }
        this.total = response.data.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 1000)
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

     //   新增里的设备名称下拉的远程搜索
    getCustomer(query) {
      if (query) {
        // this.listLoading = true
        this.sendCustomer_options = []
        var names={
          name:query
        }
        // console.log(query)
        fuzzyQuery(names).then(response => {
          
          this.sendCustomer_options = response.data.data.map(item => {

            return { value: item.code , label: item.name }
          })
          // console.log(this.sendCustomer_options)
          console.log(this.temp.equipmentCode)
         
        })
      } else {
        this.sendCustomer_options = []
      }
    },
    opopo(){
       this.sendCustomer_options.forEach(item =>{
        
         if(item.label == this.temp.equipmentName){
           this.temp.equipmentCode = item.value
         }
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
     // 判断是否固定资产编号有值
    triggerevent() {
      // console.log(123455)
      //  console.log(this.temp.fixedAssetCode)
      const fixedAsse = { fixedAssetCode: this.temp.fixedAssetCode }
      // console.log(fixedAsse)
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
  clears(){
    this.radio=''
    this.copName=''
    this.temp.companyName=''
    this.treeFormVisible = false
  },
  poacksty(){
   this.postyly=''
   this.temp.factoryName=''
   this.temp.factoryCode=''
   this.treeworks = false
  },
  blion(){
   this.temp.divisionCode ='' 
   this.temp.divisionName =''
   this.treeDepartment = false
  },
 
   // 使用公司的树选择按钮
    treestyps() {
      this.treeFormVisible = true
      // 树状图的接口
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
      })
    },
   // 使用公司的树选择按钮
    treeco(){
      this.treeFormVisible = true
      this.treestyps()
    },
     // 设置树状图单选
    handleClick(data, checked, node) {
       this.i++;
    //   console.log(222222)
     if(this.i % 1 == 0){
       if(checked){
         this.$refs.tree.setCheckedNodes([]);
         this.$refs.tree.setCheckedNodes([data]);
         /*  this.temp.companyCode = data.orgCode
          this.radio = data.orgFullName */
          
          // 交叉点击节点
        } else {
          this.$refs.tree.setCheckedNodes([]);
          // 点击已经选中的节点，置空
        }
      }
    },
     // 节点
    getCheckedNodes() {
      this.treeData = this.$refs.tree.getCheckedNodes()
      this.radio = this.treeData[0].orgCode
      this.copName = this.treeData[0].orgFullName
    },
    // 确认按钮
    applist() {
      this.getCheckedNodes()
      this.temp.companyName = this.copName
      this.temp.companyCode = this.radio
      this.orgsection = this.radio
      this.treeFormVisible = false
    },
     // 使用工厂的树   works
    manufactory() {
      this.treeworks = true
      this.plantlisy.splice(0)
       const orgCodes ={
        orgCode:this.orgsection
      } 
     works(orgCodes).then(response => {
        this.plantlisy.push(response.data.data)
        for(var i=0;i<this.plantlisy.length;i++){
            if(this.plantlisy[i].orgType =="部门"){
               this.plantlisy[i].disabled = true
             }
          /*  console.log(this.datast[i].children) */
           for(var j=0;j<this.plantlisy[i].children.length;j++){
            /*  console.log(this.datast[i].children[j]) */
             const child = this.plantlisy[i].children[j]
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
      })
    },
    //工厂点击选择按钮的弹窗
        manuf(){
          if( this.radio==''){
          this.$notify({
            title: '提示',
            message: '请选择使用公司',
            type: 'warning',
            duration: 3000
            })
          return
          }else{  
          this.treeworks = true
          this.manufactory()
          }
        },
       //  工厂设置树状图单选
     hocheckck(data, checked, node){
      this.i++;
      
     if(this.i%1==0){
      if(checked){
        this.checkedIds = data.id;
        this.$refs.treeplisy.setCheckedNodes([]);
        this.$refs.treeplisy.setCheckedNodes([data]);
        this.temp.factoryCode = data.orgCode
        this.temp.factoryName = data.orgFullName  
        this.orgsewokes = data.orgCode
        this.postyly = this.temp.factoryName
       }
      }
    },

    // 使用部门的树选择按钮
    sectionsty() {
     this.datalisy.splice(0)
      const orgCodest ={
        orgCode:this.orgsewokes
      } 
      section(orgCodest).then(response => {
              
        this.setlist.push(response.data.data)
        this.setlist.children = response.data.data
         this.datalisy=[
           {     
             orgFullName: this.postyly,
             children: this.setlist.children,
             orgType:'公司'
           }
           ]
        for(var i=0;i<this.datalisy.length;i++){
            //   console.log(this.datalisy[i])
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
      })
    },

    treesection(){
      if( this.postyly==''){
          this.$notify({
            title: '提示',
            message: '请选择使用工厂',
            type: 'warning',
            duration: 3000
            })
          return
      }else{ 
       this.treeDepartment = true
       this.sectionsty()
       }
     },
      hlsoClick(data, checked, node){
      this.r++
      if (this.r%1 ==0) {
        if (checked) {
          this.$refs.treefrom.setCheckedNodes([])
          this.$refs.treefrom.setCheckedNodes([data])
          this.temp.divisionCode = data.orgCode
          this.temp.divisionName = data.orgFullName
          // 交叉点击节点 treefrom
        }else {
          this.$refs.treeform.setCheckedNodes([])
          // 点击已经选中的节点，置空
        } 
      }
    },
    // 查看弹窗事件
    checkDetails(row){
      this.siteCodeState = true
      this.siteC = true
      this.dialogStatus = 'lookpostyo'
      this.showpop1 = false
      this.showpop2 = false
      this.showpop3 = true
      this.showpop4 = false
      this.plusShow = false
      this.delShow = false
      this.fromLoading = false// 弹窗加载动画
      this.showName = false
      this.dialogFormVisible = true
       const ids = {id:row.id}
        selectById(ids).then(response => {
        this.popTitle = response.data.data
        this.temp = Object.assign({}, this.popTitle)
        this.temp.payName = row.payName
         if(this.popTitle.isShare!== null){
        this.temp.isShare = this.popTitle.isShare.toString()
        }
         if(this.popTitle.purchaseChannel!== null){
        this.temp.purchaseChannel = this.popTitle.purchaseChannel.toString()
        }

         this.sendCustomer_options.splice(0)
        this.sendCustomer_options.push({
          value: this.temp.equipmentCode,
          label: this.popTitle.equipmentName
        })
         // 发票信息
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
      })
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 重置表单
    resetForm(){
       for (const i in this.temp) {
        this.temp[i] = ''
      }
      this.postyly=''
      this.radio=''
      this.copName=''
      this.invoiceInfos = [{code:'',date:'',price:''}]
    },

    // 新增弹框
    handleCreate(){
    this.resetForm()
    this.showpop1 = true
    this.showpop2 = false
    this.showpop3 = false
    this.showpop4 = true
    this.fromLoading = false// 弹窗加载动画
    this.showName = true
    this.dialogStatus = 'create'
    this.dialogFormVisible = true
    this.siteCodeState = false
    this.siteC = false
    this.plusShow = true
     this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 新增提交按钮
    createData(){
       this.$refs['dataForm'].validate(valid => { 
        if (valid) { 
        this.fromLoading = true// 弹窗加载动画
        // console.log(this.invoiceInfos)
        this.temp.invoiceInfos = this.invoiceInfos
      addpost(this.temp).then(response => {
        if (response.data.code == 200) {
         
          // this.invoiceInfos = this.temp.invoiceInfos
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
     }
    })
   },
    // 编辑点击打开弹窗事件  
    handleUpdate(row) { 
      this.showpop1 = true
      this.showpop2 = true
      this.showpop3 = false
      this.showpop4 = false
      this.showName = true
      this.siteCodeState = true
      this.siteC = false
      this.plusShow = true
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.fromLoading = false// 弹窗加载动画
      // console.log(row)
      const ids = {
        id:row.id
      }
      selectById(ids).then(response => {
        this.popTitle = response.data.data
        this.temp = Object.assign({}, this.popTitle)
        this.temp.payName = row.payName
        if(this.popTitle.isShare!== null){
        this.temp.isShare = this.popTitle.isShare.toString()
        }
         if(this.popTitle.purchaseChannel!== null){
        this.temp.purchaseChannel = this.popTitle.purchaseChannel.toString()
        }
        this.sendCustomer_options.splice(0)
        this.sendCustomer_options.push({
          value: this.temp.equipmentCode,
          label: this.popTitle.equipmentName
        })
         // 发票信息
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
          console.log(tempData)
          updateArticle(tempData).then(response => {
            const msg = response.data.msg
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
.buttonplace{
height:36px;
background:#409EFF; 
color:#fff;
border:1px solid #fff;
position:absolute;
right:30px;
top:0;
border-radius: 5px;
 
}
.buces{
height:36px;
background:#409EFF;
color:#fff;
border:1px solid #fff;
position:absolute;
right:-15px;
top:0;
border-radius: 5px;
}
#buttstyps{
   width:42px;
   height:36px;
   cursor:pointer;
   text-align:center;
}
</style>
