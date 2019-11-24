<template>
  <div class="app-container">
    <!--外部容器 -->
    <el-container>
       <!-- 顶部搜索 -->
     
     <!--  <el-header style="margin-bottom:40px"> -->
        <div class="filter-container">
          <!-- <div style="font-size:20px;color:#409eff;margin-bottom:10px;border-bottom:1px solid #ddd">岗位管理</div> -->
           
            <div class="formSearch">
            <el-form :inline="true">
                <el-form-item label="设备名称" >
                <el-input v-model="listQuery.equipmentName"  placeholder="请输入设备名称" clearable></el-input>
                </el-form-item>
        
                <el-form-item label="固定资产编号" >
                <el-input class="minier-input" style="width:196px" v-model="listQuery.fixedAssetCode" placeholder="请输入固定资产编号" clearable></el-input>
                </el-form-item>
              
                <el-form-item label="型号规格" >
                <el-input class="minier-input" style="width:196px" v-model="listQuery.model" placeholder="请输入型号规格" clearable></el-input>
                </el-form-item>
             
                <el-form-item label="设备状态" >
                 <el-select v-model="listQuery.equipmentStatus" style="width:190px"
                  placeholder="请选择设备状态" 
                  clearable>
                  <el-option v-for="item in genre" 
                  :key="item.value" 
                  :label="item.lsty" 
                  :value="item.value">
                  </el-option>
                </el-select>
                </el-form-item>
              
                <el-form-item >
                <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
                </el-form-item>
              
            </el-form>
            </div>
         
        </div>
        
     <!--   </el-header> -->
        
      
         <div class="square" @click="squareclick" v-if="stypot"></div> <!-- 下三角 -->
         <div class="showlist" v-if="showheast">
           <div style="margin-bottom:30px;padding:0px;height:240px;">
              <div class="filter-container">
              <el-form :inline="true">
              <!--   <el-row>
                <el-col :span="6"> class="seatsy" -->
                <el-form-item label="出厂编号" >
                <el-input v-model="listQuery.serialNumber"  placeholder="请输入出厂编号" clearable></el-input>
                </el-form-item>
                <!-- </el-col> -->
              
               <!--  <el-col :span="5"> -->
                 <el-form-item label="使用公司"  prop="radio">
                <el-input class="minier-input" style="width:284px" v-model="radio" :disabled='siteCodeState' placeholder="请选择使用公司" clearable></el-input>
                <div id="buttstyps" class="buttonplace" @click="treeco">选择</div>
                <div class="buttonplacest" id="buttstyps" @click="clears">清空</div>
                </el-form-item>

            
                 
      
                <el-form-item label="使用工厂" style="margin-left:45px">
                <el-input class="minier-input" style="width:260px" v-model="postyly" :disabled='siteCodeState' placeholder="请选择使用工厂" clearable></el-input>
                <div class="buttonplace" @click="manuf" id="buttstyps">选择</div>
                <div class="buttonplacest" @click="poacksty" id="buttstyps">清空</div>
                </el-form-item>
                 <br>

                <el-form-item label="使用部门" style="margin-left:0px">
                <el-input class="minier-input" style="width:220px" v-model="yesno" :disabled='siteCodeState' placeholder="请选择使用部门" clearable></el-input>
                <div class="buttonplace"  @click="treesection" id="buttstyps">选择</div>
                <div class="buttonplacest"  @click="clearsection" id="buttstyps">清空</div>
                </el-form-item>
              
                 <el-form-item label="采购商" style="margin-left:64px">
                <el-input class="minier-input" style="width:199px" v-model="listQuery.buyers" placeholder="请输入采购商" clearable></el-input>
                </el-form-item>
              


                <el-form-item label="报废日期" style="margin-left:46px">
                 <div class="block">
                    <el-date-picker
                    style="width:230px"
                    v-model="invalidated"
                    type="daterange"
                    unlink-panels
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                     @change="searchsty()">
                    </el-date-picker>
                </div>
                </el-form-item>
              
                
              
              
               
                 <br>

               
                
                 <el-form-item label="采购时间" style="margin-left:0px">
                <div class="block">
                    <el-date-picker  
                      v-model="listQuery.purchaseDate"
                      type="date"
                      placeholder="选择日期"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd" style="width:189px">
                    </el-date-picker>
                </div>
                </el-form-item>

                 <el-form-item label="设备所在地" style="margin-left:10px">
                <el-input class="minier-input" style="width:252px" v-model="listQuery.equipmentLocation" placeholder="请输入设备所在地" clearable></el-input>
                </el-form-item>
                
             
              
               <!--  <el-form-item label="折旧年限">
                <el-input class="minier-input" style="width:280px" v-model="listQuery.depreciationPeriod" placeholder="请输入折旧年限/单位:年" onkeyup="value=value.replace(/[^\d.]/g,'')" clearable></el-input>
                </el-form-item> -->
                

              <!--   <el-row>
                <el-col :span="6"> -->
                <el-form-item label="时间(财务转固)" style="margin-left:9px">
                 <div class="block">
                    <el-date-picker
                      v-model="listQuery.changeFixedDate"
                      type="date"
                      placeholder="选择日期"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd" style="width:233px">
                    </el-date-picker>
                  </div>
                </el-form-item>

              <!--   </el-col> -->
               <br>
                <!--  <el-col :span="6"> -->
                <el-form-item label="制造厂家" >
                <el-input class="minier-input" v-model="listQuery.manufacturer" placeholder="请输入制造厂家" clearable></el-input>
                </el-form-item>
                
               <!--  </el-col> -->

              <!--   <el-col :span="6"> -->
                <el-form-item label="设备等级" >
               <el-select v-model="listQuery.equipmentType" style="width:282px"
                  placeholder="请选择设备等级" 
                  clearable>
                  <el-option v-for="item in deviceclass" 
                  :key="item.value" 
                  :label="item.label" 
                  :value="item.value" >
                  </el-option>
                </el-select>
                </el-form-item>
             <!--    </el-col> -->

               <!--  <el-col :span="6"> -->
                <el-form-item label="调拨日期" style="margin-left:41px">
                 <div class="block">
                    <el-date-picker
                    style="width:235px"
                    v-model="allocatelist"
                    type="daterange"
                    unlink-panels
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                   @change="searchsty()">
                    </el-date-picker>
                </div>
                </el-form-item>
               <!--  </el-col>
                </el-row> -->

               
               <!-- <el-row>
               <el-col :span="6"> -->
                 <br>
               <el-form-item label="是否共用" v-model="listQuery.isShare" >
               <el-radio-group v-model="listQuery.isShare">
               <el-radio :label=0>无</el-radio>   
               <el-radio :label=2>否</el-radio>
               <el-radio :label=1>是</el-radio>
               </el-radio-group>
               </el-form-item>
             <!--   </el-col> -->
               
              <!--  <el-col :span="6"> -->
              

                <el-form-item label="申请闲置日期" >
                  <div class="block">
                    <el-date-picker
                    style="width:266px"
                    v-model="value13"
                    type="daterange"
                    unlink-panels
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                     @change="searchsty()">
                    </el-date-picker>
                </div>
                </el-form-item>
              <!--   </el-col>
                </el-row> -->
                  <el-form-item label="采购单编号" style="margin-left:41px">
                <el-input class="minier-input" clearable style="width:220px" v-model="listQuery.purchaseApplicationCode"  placeholder="请输入采购单编号" onkeyup="value=value.replace(/[^\d.]/g,'')"></el-input>
                </el-form-item>

            </el-form>
        </div>
       </div>
      <div class="tonesquare" @click="tonesquareclick" v-if="hosesty"></div><!--上三角 -->
    </div>       
                
      <!-- 内容容器 -->
     <!--  <el-container>
        <el-container> -->
          <!-- 主要区域容器 -->
          <el-main style="padding:20px 0px">
            <el-button class="filter-item" style="margin-left: 10px;" @click="derivation" type="primary" icon="el-icon-download" v-if="addnewly">导出</el-button>

            <el-table :data="listyst" v-loading="listLoading" border fit highlight-current-row
              style="width: 100%;min-height:auto;margin-top:8px" height="500" :header-cell-style="{background:'oldlace'}" :default-sort="{prop: 'cTime', order: 'descending'}">
              
               <el-table-column  align="center" label="序号" fixed="left" min-width="80" type="index"></el-table-column>
               <!-- fixed="left" -->
               <el-table-column prop="equipmentName" fixed="left" sortable align="center" label="设备名称"  min-width="120">
               <template slot-scope="scope">
                 <span class="link-type futiop" @click='checkDetails(scope.row)'>{{scope.row.equipmentName}}</span>
               </template>
              </el-table-column>

                <el-table-column prop="fixedAssetCode" fixed="left" align="center" label="固定资产编号" min-width="110"></el-table-column>

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

               <el-table-column prop="purchaseApplicationCode" align="center" label="采购单编号" min-width="135">
                </el-table-column>

               <el-table-column prop="purchaseEntity" align="center" label="采购主体" min-width="80">
                </el-table-column> 

               <el-table-column prop="purchaseChannel" align="center" label="采购渠道" min-width="80">
                  <template slot-scope="scope">
                  {{scope.row.purchaseChannel}}
                 </template>
                </el-table-column>

               <el-table-column prop="buyers" align="center" label="采购商" min-width="80">
                </el-table-column>

               <el-table-column prop="manufacturer" align="center" label="制造厂家" min-width="80">
                </el-table-column>

                <el-table-column prop="projectDate" align="center" label="立项下达时间" min-width="80">
                <!--  <template slot-scope="scope">
                  {{scope.row.projectDate!==null?scope.row.projectDate.substring(0,10):''}}
                 </template> -->
                </el-table-column>

                <el-table-column prop="tenderDate" align="center" label="招标资料移交采购时间" min-width="80">
             <!--    <template slot-scope="scope">
                  {{scope.row.tenderDate!==null?scope.row.tenderDate.substring(0,10):''}}
                 </template> -->
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

               <el-table-column prop="equipmentType" align="center" label="设备等级" min-width="80">
               </el-table-column>

               <el-table-column prop="equipmentStatus" align="center" label="设备状态" min-width="80">
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

                <el-table-column prop="cTime" align="center" label="生成时间" min-width="100">
                 <template slot-scope="scope">
                  {{scope.row.cTime}}
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
          <!-- 编辑是弹出框 -->
          <el-dialog :close-on-click-modal="false"  :title="textMap[dialogStatus]" v-dialogDrag top="10vh" width="1000px" :visible.sync="dialogFormVisible">
            <el-form :rules="rules" v-loading="fromLoading" ref="dataForm" :model="temp" label-width="100px">

              <el-row>
              <el-col :span="8">     
              <el-form-item label="设备名称" prop="equipmentName">
              <el-input v-model="temp.equipmentName" style="width:200px"  :disabled='siteCodeState'  maxlength="32" oninput="this.value=this.value.replace(/[^0-9A-z\.]/g,'')" class="enter medium-input" placeholder="请输入设备名称" ></el-input>
              </el-form-item>
              </el-col>
               <el-col :span="8">     
              <el-form-item label="出厂编号" prop="serialNumber">
              <el-input v-model="temp.serialNumber" :disabled='newdispaly' style="width:190px"  maxlength="32" class="enter medium-input" placeholder="请输入出厂编号" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="8">     
              <el-form-item label="设备所在地" prop="equipmentLocation" label-width="107px">
              <el-input v-model="temp.equipmentLocation" :disabled='newdispaly' style="width:193px"  maxlength="32" class="enter medium-input" placeholder="请输入设备所在地" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
               <el-col :span="8">
              <el-form-item label="固定资产编号" prop="fixedAssetCode"  label-width="110px"> 
              <el-input v-model="temp.fixedAssetCode" :disabled='siteCodeState'  style="width:190px" class="enter medium-input" placeholder="请输入固定资产编号" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="8">
              <el-form-item label="型号规格" prop="model"> 
              <el-input v-model="temp.model" :disabled='siteCodeState' maxlength="8" style="width:190px" class="enter medium-input" placeholder="请输入型号规格" ></el-input>
              </el-form-item>
              </el-col>
               <el-col :span="8">
              <el-form-item label="资产归属公司" prop="factoryCode"> 
              <el-input v-model="temp.assetOwnershipCompanyName" :disabled='siteCodeState' style="width:200px" class="enter medium-input" placeholder="请填写资产归属公司" ></el-input>
              <div id="buttstyps" class="buttonplace" @click="treeco1" v-show="buttonsplx">选择</div>
              </el-form-item>
              </el-col>  
              </el-row>

              <el-row>
              <el-col :span="8">
              <el-form-item label="使用公司" prop="companyCode"  label-width="110px"> 
              <el-input v-model="temp.companyName"  style="width:190px" :disabled='siteCodeState' class="enter medium-input" placeholder="请选择使用公司" ></el-input>
              <!-- <button class="buttonplace" @click="treeco">选择</button> -->
              </el-form-item>
              </el-col>
              <el-col :span="8">
              <el-form-item label="使用工厂" prop="factoryCode"> 
              <el-input v-model="temp.factoryName" style="width:190px" :disabled='siteCodeState' class="enter medium-input" placeholder="请选择使用工厂" ></el-input>
              <!-- <button class="buttonplace" @click="manufactory">选择</button> -->
              </el-form-item>
              </el-col> 
              <el-col :span="8">     
              <el-form-item label="使用部门" prop="divisionCode">
              <el-input v-model="temp.divisionName" style="width:200px" :disabled='siteCodeState' class="enter medium-input" placeholder="请选择使用部门" ></el-input>
              <!-- <button class="buttonplace" @click="treesection">选择</button> -->
              </el-form-item>
              </el-col>
              </el-row>
              <br>

              <el-row>
              <el-col :span="8">
              <el-form-item label="采购主体" prop="purchaseEntity"  label-width="110px"> 
              <el-input v-model="temp.purchaseEntity" :disabled='siteCodeState' maxlength="8"  style="width:190px" class="enter medium-input" placeholder="请输入采购主体" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="8">
              <el-form-item label="采购渠道" prop="purchaseChannel"> 
               <el-radio :disabled='newdispaly'  v-model="temp.purchaseChannel" label="1">自制设备</el-radio>
               <el-radio :disabled='newdispaly'  v-model="temp.purchaseChannel" label="2">外购设备</el-radio>
              </el-form-item>
              </el-col>
              <el-col :span="8">
              <el-form-item label="采购商" prop="buyers"> 
              <el-input v-model="temp.buyers" maxlength="32" :disabled='newdispaly' style="width:200px" class="enter medium-input" placeholder="请输入采购商" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">
              <el-form-item label="采购时间" prop="purchaseDate"  label-width="110px"> 
              <!-- <el-input v-model="temp.purchaseDate" :disabled='siteCodeState' maxlength="8"  style="width:190px" class="enter medium-input" placeholder="请输入采购时间" ></el-input> -->
               <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.purchaseDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                   :disabled='newdispaly'>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              <el-col :span="8">
              <el-form-item label="采购金额" prop="equipmentPrice"> 
              <el-input v-model="temp.equipmentPrice" :disabled='siteCodeState' maxlength="32" style="width:190px" class="enter medium-input" placeholder="请输入采购金额/单位:元" ></el-input>
              </el-form-item>
              </el-col>
             
              <el-col :span="8">     
              <el-form-item label="制造厂家" prop="manufacturer" label-width="107px">
              <el-input v-model="temp.manufacturer" :disabled='siteCodeState' style="width:193px"  maxlength="32" class="enter medium-input" placeholder="请输入制造厂家" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>
              <el-row>
              <el-col :span="8">
              <el-form-item label="采购单编号" prop="purchaseApplicationCode"  label-width="110px"> 
              <el-input v-model="temp.purchaseApplicationCode" :disabled='siteCodeState' maxlength="8"  style="width:190px" class="enter medium-input" placeholder="请输入采购单编号" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>
              <br>

              <el-row>
              <el-col :span="8">
              <el-form-item label="项目外部名称" prop="projectExternalName"  label-width="110px"> 
              <el-input v-model="temp.projectExternalName" :disabled='siteCodeState'  style="width:190px" class="enter medium-input" placeholder="请输入项目外部名称" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="8">
              <el-form-item label="立项下达时间" prop="projectDate"  label-width="110px"> 
              <!-- <el-input v-model="temp.purchaseDate" :disabled='siteCodeState' maxlength="8"  style="width:190px" class="enter medium-input" placeholder="请输入采购时间" ></el-input> -->
               <div class="block">
                <el-date-picker
                  style="width:180px"
                  v-model="temp.projectDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  
                   :disabled='siteCodeState'>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              <el-col :span="8">
              <el-form-item label="招标资料移交采购时间" prop="tenderDate"  label-width="110px" label-height="10px" style="display:block;height:10px"> 
              <!-- <el-input v-model="temp.purchaseDate" :disabled='siteCodeState' maxlength="8"  style="width:190px" class="enter medium-input" placeholder="请输入采购时间" ></el-input> -->
               <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.tenderDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  
                  :disabled='siteCodeState'>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col> 
              </el-row>

              <el-row>
              <el-col :span="8">     
              <el-form-item label="时间(财务转固)" prop="changeFixedDate" label-width="115px">
               <div class="block">
                <el-date-picker
                  style="width:185px"
                  v-model="temp.changeFixedDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  
                   :disabled="newdispaly">
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              <el-col :span="8">
              <el-form-item label="折旧年限" prop="depreciationPeriod"  label-width="110px"> 
              <el-input v-model="temp.depreciationPeriod" :disabled='siteCodeState' maxlength="32"  style="width:180px" class="enter medium-input" placeholder="请输入折旧年限/单位:年" onkeyup="value=value.replace(/[^\d.]/g,'')"></el-input>
              </el-form-item>
              </el-col>
               <el-col :span="8">
               <el-form-item label="是否共用" prop="isShare"> 
               <el-radio v-model="temp.isShare" :disabled='siteCodeState' label="0">否</el-radio>
               <el-radio v-model="temp.isShare" :disabled='siteCodeState' label="1">是</el-radio>
              </el-form-item>
              </el-col> 
              </el-row>
              <br>

              <el-row>
              <el-col :span="8">
              <el-form-item label="申请闲置日期" prop="applyLdleTime" label-width="110px"> 
              <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.applyLdleTime"
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
              <el-form-item label="报废日期" prop="scrapTime" label-width="107px">
              <div class="block">
                <el-date-picker
                  style="width:185px"
                  v-model="temp.scrapTime"
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
              <el-form-item label="改造费" prop="renovationFee"  label-width="110px"> 
              <el-input v-model="temp.renovationFee" :disabled='newdispaly' maxlength="32"  style="width:190px" class="enter medium-input" placeholder="请输入改造费" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>
              
              <el-row>
              <el-col :span="8">
              <el-form-item label="财务原值" prop="originalFinancialValue"> 
              <el-input v-model="temp.originalFinancialValue" :disabled='siteCodeState' style="width:200px" class="enter medium-input" placeholder="请输入财务原值/单位:元" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="8">     
              <el-form-item label="账面净值" prop="netBookValue" label-width="107px">
              <el-input v-model="temp.netBookValue" :disabled='siteCodeState' style="width:185px"  maxlength="32" class="enter medium-input" placeholder="请输入账面净值/单位:元" onkeyup="value=value.replace(/[^\d.]/g,'')"></el-input>
              </el-form-item>
              </el-col>
              </el-row>
              <br>

              <el-row>
               <el-col :span="8">     
              <el-form-item label="设备等级" prop="equipmentType" label-width="107px">
              <el-select v-model="temp.equipmentType" style="width:190px"
                  placeholder="请选择设备等级" 
                  clearable :disabled='siteCodeState'>
                  <el-option v-for="item in deviceclass" 
                  :key="item.value" 
                  :label="item.label" 
                  :value="item.value" :disabled='siteCodeState'>
                  </el-option>
                </el-select>
              </el-form-item>
              </el-col>
              <el-col :span="8">
              <el-form-item label="设备状态" prop="equipmentStatus"  label-width="110px"> 
               <el-select v-model="temp.equipmentStatus" style="width:185px"
                  placeholder="请选择设备状态" :disabled='siteCodeState'>
                  <el-option v-for="item in genre" 
                  :key="item.value" 
                  :label="item.lsty" 
                  :value="item.value" :disabled='siteCodeState'>
                  </el-option>
                </el-select>
              </el-form-item>
              </el-col>  
              </el-row>
              <el-row>
            
              <el-col :span="8">
              <el-form-item label="调拨日期" prop="transferDate"  label-width="110px"> 
             <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.transferDate"
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
              <el-form-item label="调拨后所在公司" prop="transferCompany" label-width="122px"> 
              <el-input v-model="temp.transferCompany" :disabled='siteCodeState'  style="width:175px" class="enter medium-input" placeholder="请输入调拨后所在公司" ></el-input>
              </el-form-item>
              </el-col>
               <el-col :span="8">     
              <el-form-item label="调拨使用部门" prop="transferDivision" label-width="107px">
              <el-input v-model="temp.transferDivision" :disabled='siteCodeState' style="width:193px"  maxlength="32" class="enter medium-input" placeholder="请输入调拨使用部门" ></el-input>
              </el-form-item>
              </el-col>   
              </el-row>

              <el-row>
              <el-col :span="8">
              <el-form-item label="生成时间" prop="cTime"  label-width="110px"> 
              <!-- <el-input v-model="temp.cTime" maxlength="8" :disabled='siteCodeState'  style="width:190px" class="enter medium-input" placeholder="请选择时间" ></el-input> -->
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

            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false" v-if="showpoat1">取消</el-button>
              <el-button type="primary" @click="updateData" v-if="showpoat2">提交</el-button>
              <el-button type="primary" @click="dialogFormVisible = false" v-if="showpoat3">返回</el-button>
            </div>
          </el-dialog>
           <!-- 使用公司的弹框 -->
          <el-dialog width="50%" title="使用公司" :close-on-click-modal="false" :visible.sync="treeFormVisible" append-to-body>
          <el-container>
					<el-aside width="500px">
          <span style="margin-left:20px;color:red" >{{radio}}</span>
          <el-tree :data="datast" :props="defaultProps" default-expand-all @node-click="handleNodeClick" check-strictly ref="tree" node-key="orgCode" show-checkbox @check-change="handleClick"></el-tree>
        
          </el-aside>
					</el-container>

           <div slot="footer" class="dialog-footer">
              <el-button @click="treeFormVisible = false">取消</el-button>
              <el-button type="primary" @click="treeFormVisible = false">确认</el-button>
            </div>
          </el-dialog>
            <!-- 使用部门的弹框 -->
           <el-dialog width="40%" title="使用部门" :close-on-click-modal="false" v-loading="listLoad" :visible.sync="treeDepartment" append-to-body>
           <el-container>
					 <el-aside width="500px">
            <span style="margin-left:20px;color:red" >{{yesno}}</span>
           <el-tree :data="datalisy"
            :props="terrdef" check-strictly  ref="treefrom" node-key="orgCode" show-checkbox @node-click="handleNodeClickst"  @check-change="hlsoClick"></el-tree>
           </el-aside>
					 </el-container>
           <div slot="footer" class="dialog-footer">
              <el-button @click="treeDepartment = false">取消</el-button>
              <el-button type="primary" @click="treeDepartment = false">确认</el-button>
            </div>
          </el-dialog>

          <!-- 使用工厂的弹框 -->
           <el-dialog width="40%" title="使用工厂" :close-on-click-modal="false" :visible.sync="treeworks" append-to-body>
           <el-container>
					 <el-aside width="500px">  
           <el-tree :data="plantlisy" :props="terrplant" @node-click="handleNodeClickworks" check-strictly ref="treeplisy" node-key="orgCode" show-checkbox highlight-current @check-change="hocheckck"></el-tree>
           </el-aside>
					 </el-container>
           <div slot="footer" class="dialog-footer">
              <el-button @click="treeworks = false">取消</el-button>
              <el-button type="primary" @click="treeworks = false">确认</el-button>
            </div>
          </el-dialog>

          <!-- 资产归属公司的弹框 -->
           <el-dialog width="40%" :close-on-click-modal="false" title="资产归属公司" :visible.sync="companysty" append-to-body>
           <el-container>
					 <el-aside width="500px">
           <el-tree :data="assets" :props="kstypod" @node-click="handlassetsClickworks" check-strictly ref="tpsst" node-key="orgCode" show-checkbox @check-change="handpppo"></el-tree>
           </el-aside>
					 </el-container>
           <div slot="footer" class="dialog-footer">
              <el-button @click="companysty = false">取消</el-button>
              <el-button type="primary" @click="applist">确认</el-button>
            </div>
          </el-dialog>

        <!-- </el-container>
      </el-container> -->
    </el-container>
  </div>
</template>

<script>
import { fetchList, derivationst, fetchPv, updateArticle, evaluate, dendrogram, section,works } from '@/api/baseInfo/newstandingBook'
import waves from '@/directive/waves' // 水波纹指令
import { fetchButton } from '@/api/common/button'
import { menuList } from '@/store/modules/permission'//按钮权限

export default {
  name: 'newstandingBook',
  directives: {
    waves
  },
  data() {
      var phoneNumberst = (rule, value, callback) => {
      if (value) {
        if ((/^\d+(?=\.{0,1}\d+$|$)/).test(value) == false) {
          callback(new Error('请输入数字'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    // 正整数
     var valiortNumber = (rule,value,callback) =>{
       if(value){
      if ((/^[0-9]\d*$/).test(value) == false) {
          callback(new Error('请输入数字'))
        } else {
          callback()
        }
      }else{
        callback()
      }
    }
    

    return {
      // 设备状态下拉  /^[0-9]+$/g
      genre: [
        { value: '1', lsty: '新设备' },
        { value: '2', lsty: '完好' },
        { value: '3', lsty: '维修' },
        { value: '4', lsty: '闲置完好' },
        { value: '5', lsty: '闲置待报废' },
        { value: '6', lsty: '报废' },
        { value: '7', lsty: '在建工程' }
      ],
      // 设备类别下拉框
      deviceclass: [
        { value: '1', label: '一般设备' },
        { value: '2', label: '关键设备' },
        { value: '3', label: '主要设备' }
      ],
      radio: '', // 使用公司
      yesno: '', // 使用部门
      // stno:'1',//搜索里的是否共用
      showheast: false, // 这个是三角形控制的div显示
      hosesty: false, // 上三角
      stypot: true, // 下三角
      value13: [], // 申请闲置时间数组
      invalidated: [], // 报废时间数组
      allocatelist: [], // 调拨日期数组
      listyst: [],
      lookList: [],
      grite: '',
      total: null,
      listQuery: {
        pageNum:1,
        pageSize:10,
        isShare: 0
      },
      //  导出字段
      listQueryst: {// 搜索字段
       /*  equipmentName: '', // 设备名称
        fixedAssetCode: '', // 固定资产编号
        model: '', // 型号规格
        equipmentStatus: '', // 设备状态
        serialNumber: '', // 出厂
        companyCode: '', // 使用公司
        divisionCode: '', // 使用部门
        equipmentLocation: '', // 设备所在地
        buyers: '', // 采购商
        manufacturer: '',
        purchaseDate: '', // 采购时间
        purchaseDate: '', // 采购金额
        changeFixedDate: '', // 时间（财务转固）
        depreciationPeriod: '', // 折旧年限（财务）
        isShare: '', // 是否共用
        equipmentType: '', // 设备类别
        applyLdleTimeUp: '', // 申请闲置时间（开始）
        applyLdleTimeEnd: '', // 申请闲置时间（结束）
        scrapTimeUp: '', // 报废时间（开始）
        scrapTimeEnd: '', // 报废时间（结束）
        renovationFee: '', // 改造费
        originalFinancialValue: '', // 财务原值
        netBookValue: '', // 账面净值
        transferDateUp: '', // 调拨日期（开始）
        transferDateEnd: '', // 调拨日期（结束）
        transferCompany: '', // 调拨后所在公司
        transferDivision: ''// 调拨使用部门 */
      },
      // 编辑的字段设置

      temp: {
        equipmentName: '', // 设备名称
        fixedAssetCode: '', // 固定资产编号
        model: '', // 型号规格
        equipmentStatus: '', // 设备状态
        serialNumber: '', // 出厂
        companyCode: '', // 使用公司
        companyName: '',
        divisionCode: '', // 使用部门
        divisionName: '',
        factoryCode: '', // 使用工厂
        factoryName: '',
        assetOwnershipCompanyCode: '', // 资产归属公司
        assetOwnershipCompanyName: '',

        equipmentLocation: '', // 设备所在地
        buyers: '', // 采购商
        manufacturer: '',
        purchaseDate: '', // 采购时间
        equipmentPrice: '', // 采购金额
        changeFixedDate: '', // 时间（财务转固）
        depreciationPeriod: '', // 折旧年限（财务）
        isShare: '', // 是否共用
        equipmentType: '', // 设备类别
        applyLdleTimeUp: '', // 申请闲置时间（开始）
        applyLdleTimeEnd: '', // 申请闲置时间（结束）
        scrapTimeUp: '', // 报废时间（开始）
        scrapTimeEnd: '', // 报废时间（结束）
        renovationFee: '', // 改造费
        originalFinancialValue: '', // 财务原值
        netBookValue: '', // 账面净值
        transferDateUp: '', // 调拨日期（开始）
        transferDateEnd: '', // 调拨日期（结束）
        transferCompany: '', // 调拨后所在公司
        transferDivision: '', // 调拨使用部门
        cTime: ''// 生成时间
      },

      // 按钮权限
      addnewly: false, // 导出
      edit: false, // 编
      cutout: false, // 删

      // 弹框显示
      dialogFormVisible: false,
      popTitle: '',
      dialogStatus: '',
      showpoat1:false,
      showpoat2:false,
      showpoat3:false,
      textMap: {
        update: '编辑',
        lookstpo: '查看'
      },
      ster: {
        staCode: '',
        staName: ''
      },
      // 使用公司树的数据
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
      // 资产归属公司
      assets: [],
      kstypod: {
        children: 'children',
        label: 'orgFullName'
      },
      nastss:'',
      postss:'',
      buttonsplx:false,

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
      companysty: false,
      siteCodeState: true, // 禁用状态
      siteCo:true,//禁用
      newdispaly:true,

      sendCustomer_options: [], // 新增里的岗位类别
      dropdownlists_options: [], //   新增里岗位等级下拉框
      // 弹框内输入框不填显示的提示信息
      rules: {
       /*  equipmentName:[{ required: true, message: '请填写', trigger: 'change' }],
        manufacturer: [{ required: true, message: '请填写', trigger: 'change' }],
        purchaseChannel:[{ required: true, message: '请选择', trigger: 'change' }],
        equipmentStatus:[{ required: true, message: '请选择', trigger: 'change' }],
        // buyers:[{ required: true, message: '请填写', trigger: 'change' }],
        netBookValue: [{ required: false, validator: phoneNumberst, trigger: 'change' }],
        depreciationPeriod: [{ required: false, validator: valiortNumber, trigger: 'change' }] */
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
    // this.treecoposy()
    // this.section()
  },

  methods: {
    // 按钮的权限
    getbttonst() {
		menuList.forEach(item => {
        item.children.forEach(e=>{
          if(e.name == "newstandingBook"){
            this.menuCode = e.code
          }
        })
      })
      const determine = {
                // menuCode: 'WM_045',
			  //  menuCode: 'WM_021',
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
     // 使用工厂清空按钮
    poacksty(){
    this.listQuery.factoryCode=''
    this.postyly = ''
    this.treeDepartment = false
    },
    // 使用部门清空按钮
    clearsection(){
    this.yesno=''  
    this.listQuery.divisionCode=''
    this.treeDepartment = false
    },   

    // 表格的接口
    getAA() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
      if (response.data.code == 200) {
        if(response.data.data!=null && response.data.data.list!=null){
        this.listyst = response.data.data.list
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

    // 导出
    derivation() {
    this.listQueryst.equipmentName =this.listQuery.equipmentName // 设备名称
    this.listQueryst.fixedAssetCode=this.listQuery.fixedAssetCode // 固定资产编号
    this.listQueryst.model=this.listQuery.model // 型号规格
    this.listQueryst.equipmentStatus=this.listQuery.equipmentStatus // 设备状态
     this.listQueryst.serialNumber = this.listQuery.serialNumber // 出厂
     this.listQueryst.companyCode =this.listQuery.companyCode // 使用公司
     this.listQueryst.divisionCode =this.listQuery.divisionCode // 使用部门
     this.listQueryst.equipmentLocation = this.listQuery.equipmentLocation // 设备所在地
    this.listQueryst.buyers=this.listQuery.buyers // 采购商
    this.listQueryst.manufacturer=this.listQuery.manufacturer
    this.listQueryst.purchaseDate=this.listQuery.purchaseDate // 采购时间
    this.listQueryst.purchaseDate= this.listQuery.purchaseDate // 采购金额
    this.listQueryst.changeFixedDate=this.listQuery.changeFixedDate // 时间（财务转固）
    this.listQueryst.depreciationPeriod=this.listQuery.depreciationPeriod // 折旧年限（财务）
    this.listQueryst.isShare =this.listQuery.isShare // 是否共用
    this.listQueryst.equipmentType= this.listQuery.equipmentType // 设备类别
    this.listQueryst.applyLdleTimeUp = this.listQuery.applyLdleTimeUp // 申请闲置时间（开始）
    this.listQueryst.applyLdleTimeEnd = this.listQuery.applyLdleTimeEnd // 申请闲置时间（结束）
    this.listQueryst.scrapTimeUp=this.listQuery.scrapTimeUp // 报废时间（开始）
    this.listQueryst.scrapTimeEnd= this.listQuery.scrapTimeEnd // 报废时间（结束）
    this.listQueryst.renovationFee=this.listQuery.renovationFee // 改造费
    this.listQueryst.originalFinancialValue=this.listQuery.originalFinancialValue // 财务原值
    this.listQueryst.netBookValue=this.listQuery.netBookValue // 账面净值
    this.listQueryst.transferDateUp=this.listQuery.transferDateUp // 调拨日期（开始）
    this.listQueryst.transferDateEnd=this.listQuery.transferDateEnd // 调拨日期（结束）
    this.listQueryst.transferCompany=this.listQuery.transferCompany // 调拨后所在公司
    this.listQueryst.transferDivision=this.listQuery.transferDivision// 调拨使用部门 */

    this.listQueryst.purchaseApplicationCode = this.listQuery.purchaseApplicationCode//采购单编号
      
      derivationst(this.listQueryst).then(response => {
        const liststyp = response.data.data
        // console.log(liststyp)
        window.location.href = liststyp
      })
    },

    searchsty() {
      // 申请闲置时间  搜索
      if (this.value13 == null) {
        this.listQuery.applyLdleTimeUp = ''
        this.listQuery.applyLdleTimeEnd = ''
      } else {
        this.listQuery.applyLdleTimeUp = this.value13[0]// 开始时间
        this.listQuery.applyLdleTimeEnd = this.value13[1]
      }
      // 报废时间 搜索
      if (this.invalidated == null) {
        this.listQuery.scrapTimeUp = ''
        this.listQuery.scrapTimeEnd = ''
      } else {
        this.listQuery.scrapTimeUp = this.invalidated[0]
        this.listQuery.scrapTimeEnd = this.invalidated[1]
      }
      // 调拨日期 搜索
      if (this.allocatelist == null) {
        this.listQuery.transferDateUp = ''
        this.listQuery.transferDateEnd = ''
      } else {
        this.listQuery.transferDateUp = this.allocatelist[0]
        this.listQuery.transferDateEnd = this.allocatelist[1]
      }
    },

   // 使用公司的树选择按钮
    treestyps() {
      this.treeFormVisible = true
      // 树状图的接口
      this.datast.splice(0)
      dendrogram('').then(response => {
        this.datast.push(response.data.data)
         /* console.log(123456)
         console.log(this.datast) */
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
     if(this.i%1==0){
       if(checked == true){
        //  console.log(222222) 
        //  console.log(checked)
        //  console.log(data)
         this.$refs.tree.setCheckedNodes([]);
         this.$refs.tree.setCheckedNodes([data]);
          this.listQuery.companyCode = data.orgCode
          this.radio = data.orgFullName
          this.orgsection = data.orgCode
          // 交叉点击节点
        } else {
          this.$refs.tree.setCheckedNodes([]);
          // 点击已经选中的节点，置空
        }
      }
    },
    // 树状图的点击方法
    handleNodeClick(data, checked, node) {
      
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
      if(checked == true){
         console.log(checked)
         console.log(data)
        this.checkedIds = data.id;
        this.$refs.treeplisy.setCheckedNodes([]);
        this.$refs.treeplisy.setCheckedNodes([data]);
        this.listQuery.factoryCode = data.orgCode
        this.postyly = data.orgFullName
        this.orgsewokes = data.orgCode
       }
     }
     },

    handleNodeClickworks(data) {
      // this.temp.factoryCode = data.orgCode
      // this.temp.factoryName = data.orgFullName
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
        //    console.log(this.datalisy)
            //  this.datalisy.push(sectionlist) 

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
      if (this.r % 1 == 0) {
        if (checked) {
          this.$refs.treefrom.setCheckedNodes([])
          this.$refs.treefrom.setCheckedNodes([data])
          this.listQuery.divisionCode = data.orgCode
          this.yesno = data.orgFullName
          // 交叉点击节点 treefrom
        } else {
          this.$refs.treeform.setCheckedNodes([])
          // 点击已经选中的节点，置空
        }
      }
    },
    handleNodeClickst(data) {
     
    },

    
    // 资产归属公司
    treecostylp() {
      this.companysty = true
      // 树状图的接口
      this.assets.splice(0)
      dendrogram('').then(response => {
        this.assets.push(response.data.data)

         for(var i=0;i<this.assets.length;i++){
            if(this.assets[i].orgType =="部门"){
               this.assets[i].disabled = true
             }
           for(var j=0;j<this.assets[i].children.length;j++){
             const child = this.assets[i].children[j]
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
     // 资产归属公司
    treeco1(){
      this.companysty = true
      this.treecostylp()
    },
   
    // 设置树状图单选  handpppo
    handpppo(data, checked, node) {
       this.i++;
     if(this.i%2 == 0){
       if(checked){
         this.$refs.tpsst.setCheckedNodes([]);
         this.$refs.tpsst.setCheckedNodes([data]);
        //  this.temp.assetOwnershipCompanyName = data.orgFullName
        //  this.temp.assetOwnershipCompanyCode = data.orgCode
          // this.orgsection = data.orgCode
          // 交叉点击节点
        } else {
          this.$refs.tpsst.setCheckedNodes([]);
          // 点击已经选中的节点，置空
        }
      }
    },

     // 节点
     getCheckedNodes() {
      this.treeData = this.$refs.tpsst.getCheckedNodes()
      this.postss = this.treeData[0].orgCode
      this.nastss = this.treeData[0].orgFullName
    },
     // 确认按钮 nastss postss
    applist(){
      this.getCheckedNodes()
      this.temp.assetOwnershipCompanyName = this.nastss
      this.temp.assetOwnershipCompanyCode = this.postss
      this.companysty = false
    
    },
    // 树状图的点击方法
    handlassetsClickworks(data) {
      
    },




    // 删除事件
    deleteBtn(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        // console.log(row)
        const deleteid = {
          id: row.id
        }
        // console.log(deleteid)
        fetchPv(deleteid).then(response => {
          if (response.data.code == 200) {
            this.getAA()
            const index = this.listyst.indexOf(row)
            this.listyst.splice(index, 1)
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
    // 搜索
    handleFilter(data) {
      this.listQuery.pageNum = 1
      this.getAA()
    //   console.log(345678900)
    //   console.log(this.listQuery.companyCode)
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
    checkDetails(row){
      const ids = {id: row.id}
       evaluate(ids).then(response => {
        this.popTitle = response.data.data
        this.temp = Object.assign({}, this.popTitle)
        this.temp.isShare = this.popTitle.isShare.toString()
        this.temp.purchaseChannel = this.popTitle.purchaseChannel.toString()
        if(this.temp.depreciationPeriod ==''){
          this.temp.depreciationPeriod = 0 
        }
         if(this.temp.netBookValue ==''){
           this.temp.netBookValue = 0
         }
      })
      this.siteCo = true//查看的禁用
      this.buttonsplx = false//树的选择按钮隐藏
      this.siteCodeState = true
      this.newdispaly = true
      this.showpoat1 = false
      this.showpoat2 = false
      this.showpoat3 = true
      this.dialogStatus = 'lookstpo'
      this.dialogFormVisible = true
      this.fromLoading = false
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 编辑点击打开弹窗事件
    handleUpdate(row) {
    //   console.log(row)
      const ids = {
        id: row.id
      }
      evaluate(ids).then(response => {
        this.popTitle = response.data.data
        this.temp = Object.assign({}, this.popTitle)
        this.temp.isShare = this.popTitle.isShare.toString()
        this.temp.purchaseChannel = this.popTitle.purchaseChannel.toString()
        if(this.temp.depreciationPeriod ==''){
          this.temp.depreciationPeriod = 0 
        }
         if(this.temp.netBookValue ==''){
           this.temp.netBookValue = 0
         }
        
      })
      this.buttonsplx = true//树的选择按钮显示
      this.showpoat1 = true
      this.showpoat2 = true
      this.showpoat3 = false
      this.siteCodeState = true
      this.newdispaly = false
      this.siteCo = false//查看的禁用
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.fromLoading = false
    //   console.log(this.temp)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 编辑提交按钮
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
           if(this.temp.depreciationPeriod ==''){
          this.temp.depreciationPeriod = 0 
        }
         if(this.temp.netBookValue ==''){
           this.temp.netBookValue = 0
         }
          const tempData = Object.assign({}, this.temp)
        //   console.log(tempData)
          this.fromLoading = true
          updateArticle(tempData).then(response => {
            const msg = response.data.msg
            if (response.data.code == 200) {
              for (const v of this.listyst) {
                // console.log(this.listyst)
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
            this.fromLoading = false
          })
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
.fiutr {
  float: left;
}
.seat {
  margin-left: 50px;
  padding-right: 15px;
}
.seatsy{
   margin-left: 60px;
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
.showlist{
  margin-bottom:30px;
  width:100%;
  padding:0px;
  height:280px;
}
#buttstyps{
   width:42px;
   height:36px;
   cursor:pointer;
   text-align:center;
    }
.buttonplacest{
height:36px;
background:#409EFF;
color:#fff;
border:1px solid #fff;
position:absolute;
right:-50px;
top:0;
border-radius: 5px;
}   
.el-tree-node__content:hover {
  background-color: #6dc6fa;
  border-radius:3%
}  
</style>
