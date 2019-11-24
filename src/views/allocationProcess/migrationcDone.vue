<template>
  <div class="app-container">
    <!--外部容器 -->
    <el-container>
       <!-- 顶部搜索 -->
      
        <div class="filter-container">
       
            <div class="formSearch">
            <el-form :inline="true">
            
                <el-form-item label="单据编号" >
                <el-input v-model="listQuery.formCode"  placeholder="请输入单据编号" clearable></el-input>
                </el-form-item>
             
              
                <el-form-item label="固定资产编号" >
                <el-input class="minier-input" v-model="listQuery.fixedAssetCode" placeholder="请输入固定资产编号" clearable></el-input>
                </el-form-item>
              

              
                <el-form-item label="设备名称" >
                <el-input class="minier-input" style="width:213px" v-model="listQuery.equipName" placeholder="请输入设备名称" clearable></el-input>
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
                    <el-select v-model="listQuery.auditingType" style="width:200px" clearable  placeholder="请选择审核状态">
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
                <template slot-scope="scope">
                 <el-button title="通知" type="success" icon="el-icon-message" size="mini"  @click="sendMessage(scope.row)"
               :disabled="scope.row.noticeShow?true:false"></el-button>
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
                <span class="equip-title">设备厂内迁移单已办</span>
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
              </el-col>
              <el-col :span="16">
              <el-form-item label="调入部门" prop="transferInDepartmentName" style="margin-left:100px;"> 
              <el-input v-model="temp.transferInDepartmentName" :disabled='siteCodeState?true:false' maxlength="8" style="width:270px" class="enter medium-input" placeholder="请输入调入部门" ></el-input>
            
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
               <el-input type="textarea" :disabled='siteCodeState?true:false' style="width:640px" maxlength="200" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入备注" v-model="temp.remark">
               </el-input>
              </el-form-item>

               <el-form-item label="调拨原因" prop="reason" label-width="120px">
               <el-input type="textarea" :disabled='siteCodeState?true:false' style="width:640px" maxlength="200" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入调拨原因" v-model="temp.reason">
               </el-input>
              </el-form-item>

               <el-form-item label="其他说明" prop="otherDescription" label-width="120px">
               <el-input type="textarea" :disabled='siteCodeState?true:false' style="width:640px" maxlength="200" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入其他说明" v-model="temp.otherDescription">
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
            <el-button type="primary" size="mini" @click="printData" v-if="mimeograph">打印</el-button> 
           
            </el-form-item>
            </el-form>
          </el-dialog>
        <el-dialog title="设备厂内迁移单预览" v-dialogDrag :close-on-click-modal="false" :visible.sync="printDialogVisible" width="99%">
        <el-button type="primary" @click="printDialogVisible = false">返回</el-button>
        <el-button type="success" v-print="'#printTest6'"><svg-icon icon-class="print"/>打印</el-button>
				<div id="printTest6">
					<table border= "0" width="99%">
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

       <!-- 选择通知的人 -->
      <el-dialog width="60%" :close-on-click-modal="false" title="请选择要通知的人员" :visible.sync="innerVisiblePerson" append-to-body v-dialogDrag>
        <el-header>
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="姓名">
              <el-input v-model="listQuery1.perName" placeholder="请输入姓名">
              </el-input>
            </el-form-item>
            <el-form-item label="工号">
              <el-input v-model="listQuery1.workNumber" placeholder="请输入工号">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="handlePerson">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-header>
        <el-container>
          <el-aside style="width:380px;">
            <el-tree :data="personOrgData" :props="defaultProps" @node-click="handleNodeClick" v-loading="diaLoading" :render-content="renderContent"></el-tree>
          </el-aside>
          <el-main>
            <span style="margin-left:20px;color:red">{{choosePerName}}</span>
            <el-table height='300' :data="orgListData" border fit highlight-current-row
              style="width:100%;min-height:300px;margin-top:8px">
              <el-table-column prop="orgName" align="center" label="部门" min-width="50">
              </el-table-column>
              <el-table-column prop="perName" align="center" label="人员" min-width="50">
              </el-table-column>
              <el-table-column align="center" label="工号" min-width="50">
                <template slot-scope="scope">
                  <a class="look-detail" @click="chooseData1(scope.row)">{{scope.row.workNumber}}</a>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
        </el-container>
        <div slot="footer" class="dialog-footer">
          <el-button @click="choosePersonOk" type="primary">确定</el-button>
          <el-button @click="innerVisiblePerson = false" type="info">取消</el-button>
        </div>
      </el-dialog>


    </el-container>
  </div>
</template>

<script>
import { fetchListdsy, evaluate, circuList, getCurrentUser, selist,postMessage } from '@/api/allocationProcess/migrationcDone'
import { flowsheet } from '@/api/allocationProcess/migration'
import waves from '@/directive/waves' // 水波纹指令
import { commonOptions1, recordList, fileList, processChart, fetchChooseTree, choosePersonList } from '@/api/common/common'
import { fetchButton } from '@/api/common/button'
export default {
  name: 'index',
  directives: {
    waves
  },
  data() {
    return {

    // 通知按钮的消息
      // 选择人
      diaLoading: false,
      orgListData: null,
      personOrgData: [],
      innerVisiblePerson: false, // 技术负责人弹框
      defaultProps: {
        children: 'children',
        label: 'orgFullName'
      },
     listQuery1: {
        pageNum: 1,
        pageSize: 1000,
        perName: undefined,
        workNumber: undefined
      },
      choosePerName: undefined,
      listQuery2: {
        id: undefined,
        workNumber: undefined,
        type: 3
      },
      id: undefined,

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
        pageSize: 10,
        handleType: 2,
        type: 3
      },
      // 编辑的字段设置
      temp: {

      },
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
      chartData: '', // 流程图

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
      idspou: '',

      equipmentList: [], // 引用台账的数据
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
  },

  methods: {
     renderContent(h, { node, data, store }) {
      return (
        <span>
          <span title={node.label}>{node.label}</span>
        </span>)
    },

    // 表格的接口
    getAA() {
      this.listLoading = true
      fetchListdsy(this.listQuery).then(response => {
        this.listyst = response.data.data.list
        console.log(this.listyst)
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
           if (this.listyst[i].isEquipmanagerPass == 0) {
              this.listyst[i].noticeShow = true
            } else if (this.listyst[i].isEquipmanagerPass == 1) {
              this.listyst[i].noticeShow = false
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
      // 评价时间  搜索
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
      this.shenbottl = row.auditingType
      this.porisgid = row.processInstanceId
      this.dialogStatus = 'detail'
      this.dialogFormVisible = true
      this.siteCodeState = true
      this.hold1 = false
      this.referring1 = false
      this.referring2 = false
      this.hold2 = false
      this.activeName = 'first'// 选项卡默认选项
      if (row.auditingType == 3) {
        this.mimeograph = true // 打印显示按钮
      } else {
        this.mimeograph = false // 打印不显示按钮
      }

      this.fromLoading = false// 弹窗加载动画
      this.roamshow = true// 流转记录显示
      this.newapps = false// 一号小表格重新验收删除按钮
      this.updelests = true// 一号小表格编辑删除按钮
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

    // 获取当前用户信息
    getusesty() {
      getCurrentUser().then(response => {
        this.userId = response.data.data.id
        console.log(444444444)
        console.log(response.data.data)
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
//************** 通知按钮的消息通知***************

    sendMessage(row) {
      this.listQuery2.id = row.id
      this.choosePerson()
      this.innerVisiblePerson = true
    },
    choosePerson() {
      this.listQuery1 = {
        pageNum: 1,
        pageSize: 2000,
        perName: undefined,
        workNumber: undefined
      }
      this.orgListData = null
      this.diaLoading = true
      fetchChooseTree().then(response => {
        this.personOrgData = []
        this.personOrgData.push(response.data.data)
        setTimeout(() => {
          this.diaLoading = false
        }, 1 * 1000)
      })
    },
    handleNodeClick(data) {
      const params = {
        orgCode: data.orgCode,
        pageNum: 1,
        pageSize: 2000
      }
      choosePersonList(params).then(response => {
        this.orgListData = response.data.data.list
      })
    },
    handlePerson() {
      this.orgListData = []
      choosePersonList(this.listQuery1).then(response => {
        this.orgListData = response.data.data.list
      })
    },
    chooseData1(row) {
      this.choosePerName = row.perName
      this.listQuery2.workNumber = row.workNumber
    },
    choosePersonOk() {
      postMessage(this.listQuery2).then(response => {
        if (response.data.code === 200) {
          this.innerVisiblePerson = false
        } else {
          this.$notify({
            title: '警告',
            message: response.data.msg,
            type: 'warning',
            duration: 2000
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
#printTest6 table{
  border-collapse:collapse;
}
#printTest6 table thead th{
  font-size: 20px;
  padding:10px;
}
#printTest6 table tbody tr{
  height:30px;
  font-size:14px;
}
/* #printTest table tbody td{
   width:25%; 
} */
#printTest6 table tbody td span{
  margin-right:20px;
}
#pic{
  width:97%;
} 
/* @page {
  size: A4 landscape;
} */
    
</style>
