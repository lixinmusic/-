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
            
            <el-table :data="listyst" v-loading="listLoading" border fit highlight-current-row
              style="width: 100%;min-height:auto;margin-top:0px" height="500" :header-cell-style="{background:'oldlace'}">

               <el-table-column prop="formCode" align="center" label="单据编号"  min-width="100">
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
               <el-table-column prop="handleTypeName" align="center" label="处置形式" min-width="80">
                 </el-table-column>
               <el-table-column prop="auditingTypeName" align="center" label="审核状态" min-width="80">
                 </el-table-column>
               <el-table-column prop="auditingUser" align="center" label="当前处理人" min-width="80">
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
            <el-tabs v-model="activeName" v-loading="fromLoading" @tab-click="fathClick">
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
                <el-input type="textarea" :disabled='siteCodeState?true:false' style="width:1010px" maxlength="128" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入存放地点..." v-model="temp.storeAddress">
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
                <el-input type="textarea" :disabled='siteCodeState?true:false' style="width:1010px" maxlength="128" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入备注..." v-model="temp.remark">
                </el-input>
              </el-form-item>

               <el-form-item label="制造厂家" prop="manufacturer">
                <el-input type="textarea" style="width:1010px" :disabled='siteCodeState?true:false' maxlength="128" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入制造厂家..." v-model="temp.manufacturer">
                </el-input>
              </el-form-item>

               <el-form-item label="处置原因及目的（详细说明）" prop="handleReasonGoal">
                <el-input type="textarea" :disabled='siteCodeState?true:false' style="width:1010px" maxlength="128" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入处置原因及目的..." v-model="temp.handleReasonGoal">
                </el-input>
              </el-form-item>
              <el-row>
               <el-col :span="24">
               <el-form-item label="处置形式" prop="handleType"> 
                <el-radio v-model="temp.handleType" :disabled='siteCodeState?true:false' label="1" @change="kess">报废/出售</el-radio>
                <el-radio v-model="temp.handleType" :disabled='siteCodeState?true:false' label="2" style="margin-left:320px" @change="placing">抵款</el-radio>
                </el-form-item>
                </el-col>
                </el-row>
 
                <el-row>
                <el-form-item label="预计的清理费用和清理收入说明" prop="clearingExpense" style="float:left">
                <el-input type="textarea" :rows="10" style="width:360px;" maxlength="128" placeholder="请输入备注..." v-model="temp.clearingExpense" :disabled='dlestly?true:false'>
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
               
             <!--  <input id="uploadImg" type="file" @change="fileUpload"> -->
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
                   <!-- <el-button title="删除" type="danger" @click="smalldelest(scope.row)" icon="el-icon-delete" size="small" disabled></el-button> -->
                   <!-- <el-button title="删除" type="danger" @click="updatadelest(scope.row)" icon="el-icon-delete" size="small" v-show="updelests"></el-button> -->
               
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
            <el-button type="primary" size="mini" @click="printData" v-if="mimeograph">打印</el-button>
           
            </el-form-item>
            </el-form>
          </el-dialog>
        <el-dialog title="闲置设备处置申请单打印预览" v-dialogDrag :close-on-click-modal="false"  :visible.sync="printDialogVisible" width="60%">
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
                                <span>{{Y}}年</span><span>{{N}}月</span><span>{{M}}日</span>
                                
                                
                            </td>
                            <td colspan="3" style="border:none;text-align:right">金额单位:元</td>
                        </tr> 
                            
                        <tr>
                            <td style="border:1px solid black;width:100px">固定资产编号</td> 
                            <td>设备名称</td>
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
                            <td colspan="1">报废/出售</td>
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
                         <tr style="border-right:1px solid black;border-bottom:1px solid black">
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
import { fetchListdsy, evaluate, circuList, uploadlist, smallAblist, insertFile, updeletedata, getCurrentUser, fetchList, stamplist } from '@/api/idleProcess/idleauDone'
import waves from '@/directive/waves' // 水波纹指令
import { flowsheet } from '@/api/idleProcess/idleApplication'
import { fetchButton } from '@/api/common/button'
import { baseUrl } from '@/api/common/fileBaseUrl'
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
      printList: {

      },
      chartData: '', // 流程图
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
      afreshst: false, // 重新验收
      speechst: false, // 生成设备质量验收报告

      activeName: 'first', // 选项卡默认选项
      roamshow: false, // 流转记录隐藏
      // 弹框显示
      dialogFormVisible: false,
      // 处置形式
      scrapShow1: false,
      scrapShow2: false,

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
      printDialogVisible: false, // 打印
      mimeograph: false,
      idst: '',
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
      auditType: '', // 审核状态

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
           var url = baseUrl + "onlinePreview?url=" +  encodeURIComponent(row.filePath)
           var winHeight = window.document.documentElement.clientHeight-10;
          window.open(url, '_blank',"height=" + winHeight+ ",top=80,left=80,toolbar=no, menubar=no, scrollbars=yes, resizable=yes");
   },
// ******* 文件预览结束**********
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
        this.listyst = response.data.data.list
        console.log(this.listyst)

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
      this.activeName = 'first'
      this.dlestly = true// 单选项（报废/损毁）
      this.dlisCodeState = true// 单选框（出售）
      this.auditType = row.auditingType// 审核状态
      if (row.auditingType == 3) {
        this.mimeograph = true// 打印按钮显示
      } else {
        this.mimeograph = false// 打印按钮不显示
      }

      this.fromLoading = false// 弹窗加载动画
      this.roamshow = true// 流转记录显示
      this.newapps = false// 一号小表格重新验收删除按钮
      this.updelests = true// 一号小表格编辑删除按钮
      evaluate(id).then(response => {
        if (response.data.code == 200) {
          this.lookout = response.data.data
          this.temp = Object.assign({}, this.lookout)
          this.temp.netBookValue = row.netBookValue
          this.temp.purchaseDate = this.temp.purchaseDate.substring(0, 10)
          if (this.temp.handleType !== null) {
            this.temp.handleType = this.temp.handleType.toString()// 单选框判null
          }
          console.log(this.temp.handleType)
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
    // 流转记录 mimeograph
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

    // 获取当前用户信息
    getusesty() {
      getCurrentUser().then(response => {
        this.userId = response.data.data.id
        console.log(444444444)
        console.log(response.data.data)
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
          } else {
            this.$notify({
              title: '警告',
              message: '上传失败',
              type: 'warning',
              duration: 3000
            })
          }
        })
      }
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
#printTest table{
    border-collapse:collapse;
    width: 99.6%;
}
#printTest table thead th{
    font-size: 20px;
    padding:10px;
}
#printTest table tbody tr{
    /* border: 1px solid black; */
    font-size:14px;
}
#printTest table tbody td{
    /* width:25%; */
    height: 48px;
    border: 1px solid black;    
    text-align: center;
}
#printTest table tbody td span{
    margin-right:20px;
}

#pic{
  width: 100%;
}

    
</style>
