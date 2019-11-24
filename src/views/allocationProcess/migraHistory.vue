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

                    <!--   -->
                <el-form-item label="使用公司" prop="radio"> 
                <el-input v-model="radio" maxlength="8" :disabled='siteCodeState' style="width:190px" class="enter medium-input" placeholder="请选择使用公司" ></el-input>
                <div class="buttonplace" id="buttstyps" @click="treeco">选择</div>
                <div class="buttonplacest" id="buttstyps" @click="clears">清空</div>
                </el-form-item>
                 <!--     -->
                <el-form-item label="使用工厂" prop="yesno" style="margin-left:40px"> 
                <el-input v-model="yesno" maxlength="8" style="width:190px" class="enter medium-input" :disabled='siteCodeState' placeholder="请选择使用工厂" ></el-input>
                <div class="buttonplace" id="buttstyps" @click="manufactory">选择</div>
                <div class="buttonplacest" id="buttstyps" @click="poacksty">清空</div>
                </el-form-item>
                 <!--     -->
                <el-form-item label="使用部门" prop="postyly" style="margin-left:40px">
                <el-input v-model="postyly" style="width:190px" :disabled='siteCodeState'  maxlength="32" class="enter medium-input" placeholder="请选择使用部门" ></el-input>
                <div class="buttonplace" id="buttstyps" @click="treesection">选择</div>
                <div class="buttonplacest" id="buttstyps" @click="clearsection">清空</div>
                </el-form-item>
        
             
             
                <el-form-item>
                <el-button class="filter-item" style="margin-left:40px" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
                </el-form-item>

                <el-form-item>
                  <el-button class="filter-item" style="margin-left:0px;margin-bottom:10px" @click="derivation" type="primary" icon="el-icon-download">导出</el-button>
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
            <!-- <el-button type="primary" size="mini" @click="printData" v-if="mimeograph">打印</el-button>  -->
           
            </el-form-item>
            </el-form>
          </el-dialog>
        <el-dialog title="设备厂内迁移单预览" v-dialogDrag :close-on-click-modal="false" :visible.sync="printDialogVisible" width="100%">
        <el-button type="primary" @click="printDialogVisible = false">返回</el-button>
        <el-button type="success" v-print="'#printTest12'"><svg-icon icon-class="print"/>打印</el-button>
				<div id="printTest12">
           <h2 style="text-align:center;">{{daolist.transferInCompanyName}}</h2>
            <h2 style="text-align:center;">设备厂内迁移单</h2>

          <div style="float:left"><span>调出部门：{{daolist.transferOutDepartmentName}}</span></div><br>
          <div style="float:left"><span>调入部门：{{daolist.transferInDepartmentName}}</span></div>
          <div style="float:right"><span>编号：{{daolist.formCode}}</span></div>
					<table border= "1" width="100%">
            <tbody>
              <tr >
                <td rowspan="2" style="text-align:center">固定资产编号</td>
                <td rowspan="2" style="text-align:center">设备名称</td>
                <td rowspan="2" style="text-align:center">型号规格</td>
                <td rowspan="2" style="text-align:center">出厂编号</td>
                <td rowspan="2" style="text-align:center">制造厂家</td>
                <td rowspan="2" style="text-align:center">数量</td>

                <td rowspan="2" style="text-align:center">单位</td>
                <td colspan="2" style="text-align:center">年限</td>
                <td colspan="2" style="text-align:center">固定资产价值（元）</td>
                <td rowspan="2" style="text-align:center">备注</td>
                
              </tr>
              <tr>
                <td style="text-align:center">折旧</td>
                <td style="text-align:center">已用</td>
                <td style="text-align:center">原值</td>
                <td style="text-align:center">净值</td>
              </tr>

             
               <tr style="height:50px">
                <td style="text-align:center">{{daolist.fixedAssetCode}}</td>
                <td style="text-align:center">{{daolist.equipName}}</td>
                <td style="text-align:center">{{daolist.equipType}}</td>
                <td style="text-align:center">{{daolist.serialNumber}}</td>
                <td style="text-align:center">{{daolist.manufacturer}}</td>
                <td style="text-align:center">{{daolist.nums}}</td>

                <td style="text-align:center">台</td>
                <td style="text-align:center">{{daolist.depreciationPeriod}}</td>
                <td style="text-align:center">{{daolist.usedPeriod}}</td>
                <td style="text-align:center">{{daolist.originalFinancialValue}}</td>
                <td style="text-align:center">{{daolist.netBookValue}}</td>
                <td style="text-align:center">{{daolist.remark}}</td>
              
              </tr>
           <tr style="height:70px">
             <td colspan="1">调拨原因</td>
             <td colspan="11" style="text-align:left">{{daolist.reason}}</td>
           </tr>
            <tr style="height:70px">
             <td colspan="1">其他说明</td>
             <td colspan="11" style="text-align:left">{{daolist.otherDescription}}</td>
           </tr>

           <tr style="height:50px">
             <td colspan="3">经办人签字</td>
             <td colspan="2">设备科长签字</td>
             <!-- <td colspan="2">调出厂签字</td> -->
             <td colspan="2">设备副总签字</td>
             <td colspan="3">资产部副部长签字</td>
             <td colspan="2">资产部盖章</td>
           </tr>   
           <tr style="height:50px">
             <td colspan="3" align=“left” valign="top">意见：{{operator}}</td>
             <td colspan="2" align=“left” valign="top">意见：{{branch}}</td>
             <!-- <td colspan="2" align=“left” valign="top">意见：</td> -->
             <td colspan="2" align=“left” valign="top">意见：{{fuzong}}</td>
             <td colspan="3" align=“left” valign="top">意见：{{zichan}}</td>
             <td colspan="2" align=“left” valign="top">意见：</td>
           </tr>
             <tr style="height:40px">
             <td colspan="3" style="border-top:1px solid #fff">经办人：{{operatorname}}</td>
             <td colspan="2" style="border-top:1px solid #fff">经办人：{{branchname}}</td>
             <!-- <td colspan="2" style="border-top:1px solid #fff">经办人：</td> -->
             <td colspan="2" style="border-top:1px solid #fff">经办人：{{fuzongname}}</td>
             <td colspan="3" style="border-top:1px solid #fff">经办人：{{zichanname}}</td>
             <td colspan="2" style="border-top:1px solid #fff">经办人：</td>
           </tr>
           <tr style="height:40px">
             <td colspan="3" style="border-top:1px solid #fff">日期：{{operatordate}}</td>
             <td colspan="2" style="border-top:1px solid #fff">日期：{{branchdate}}</td>
             <!-- <td colspan="2" style="border-top:1px solid #fff">日期：</td> -->
             <td colspan="2" style="border-top:1px solid #fff">日期：{{fuzongdate}}</td>
             <td colspan="3" style="border-top:1px solid #fff">日期：{{zichandate}}</td>
             <td colspan="2" style="border-top:1px solid #fff">日期：</td>
             </tr>
            </tbody>
          </table>
				</div>
			</el-dialog>

       <!-- 使用公司的弹框 -->
          <el-dialog width="50%" :close-on-click-modal="false" title="使用公司" :visible.sync="treeFormVisible" append-to-body>
          <el-container>
					<el-aside width="500px">
          <span style="margin-left:20px;color:red" >{{raposyt}}</span>
          <el-tree :data="datast" :props="defaultProps" default-expand-all @node-click="handleNodeClick" check-strictly ref="tree" node-key="orgCode" highlight-current @check-change="handleClick"></el-tree>
          </el-aside>
					</el-container>

           <div slot="footer" class="dialog-footer">
              <el-button @click="treeFormVisible = false">取消</el-button>
              <el-button type="primary" @click="queshlo1">确认</el-button>
            </div>
          </el-dialog>

           <!-- 使用工厂的弹框 -->
           <el-dialog  width="50%" :close-on-click-modal="false" title="使用工厂" :visible.sync="treeworks" append-to-body>
           <el-container>
	         <el-aside width="500px">
           <span style="margin-left:20px;color:red" >{{revealspo}}</span>  
           <el-tree :data="plantlisy" :props="terrplant" @node-click="handleNodeClickworks" check-strictly ref="treeplisy" node-key="orgCode" highlight-current @check-change="hocheckck"></el-tree>
           </el-aside>
	         </el-container>
           <div slot="footer" class="dialog-footer">
              <el-button @click="treeworks = false">取消</el-button>
              <el-button type="primary" @click="queshlo2">确认</el-button>
            </div>
          </el-dialog>

          <!-- 使用部门的弹框 -->
           <el-dialog width="50%" :close-on-click-modal="false" title="使用部门" :visible.sync="treeDepartment" append-to-body>
           <el-container>
	         <el-aside width="500px"> 
           <span style="margin-left:20px;color:red" >{{postyly}}</span> 
           <el-tree :data="datalisy" :props="terrdef" @node-click="handleNodeClickst" check-strictly ref="treefrom" node-key="orgCode" show-checkbox highlight-current @check-change="hlsoClick"></el-tree>
           </el-aside>
	         </el-container>
           <div slot="footer" class="dialog-footer">
              <el-button @click="treeDepartment = false">取消</el-button>
              <el-button type="primary" @click="queshlo3">确认</el-button>
            </div>
          </el-dialog>


    </el-container>
  </div>
</template>

<script>
import { fetchListdsy, evaluate, circuList, getCurrentUser, selist,derivationst } from '@/api/allocationProcess/migraHistory'
import { flowsheet } from '@/api/allocationProcess/migration'
import waves from '@/directive/waves' // 水波纹指令
import { fetchButton } from '@/api/common/button'
import { fetchComTree, fetchChooseTree } from '@/api/common/common'// 树接口
export default {
  name: 'migrationcDone',
  directives: {
    waves
  },
  data() {
    return {
      // 使用公司树的数据
      i: 0,
      datast: [],
      defaultProps: {
        children: 'children',
        label: 'orgFullName'
      },
      // 使用工厂树的数据
      plantlisy: [],
      terrplant: {
        children: 'children',
        label: 'orgFullName'
      },
      // 使用部门树的数据
      datalisy: [],
      setlist: [],
      terrdef: {
        children: 'children',
        label: 'orgFullName'
      },
      radio: '', // 使用公司
      yesno: '', // 使用工厂
      postyly: '', // 使用部门
      treeFormVisible: false, // 使用公司树选择
      treeDepartment: false, // 使用部门树选择
      treeworks: false, // 使用工厂树选择

      //  使用公司
      factoryscod: '',
      factorysname: '',
      raposyt: '',
      // 使用工厂
      firmcod: '',
      firmname: '',
      revealspo: '',
      // 使用部门
      getOrgName: '',
      getOrgCode: '',

      // 审核状态下拉框
      options: [
        { value: '2', label: '审核中' },
        { value: '3', label: '审核通过' },
        { value: '4', label: '审核不通过' }
      ],
      posyrouter: '',
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
        auditingType: '',
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
        manufacturer: [{ required: true, message: '请填写', trigger: 'change' }],
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
    this.alltiemw()
    this.getAA()
  },

  methods: {
    // 导出
    derivation() {
      derivationst(this.listQuery).then(response => {
        if (response.data.code == 200) {
				  const liststyp = response.data.data
         window.location.href = liststyp
				}else if(response.data.code == 400002){
            this.$notify({
						title: '警告',
						message: response.data.msg,
						type: 'warning',
						duration: 3000
          			})
				}else {
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
          }
        }
        this.total = response.data.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 500)
      })
    },
    // 使用公司清空按钮
    clears() {
      this.listQuery.companyCode = ''
      this.radio = ''
      this.raposyt = ''
      this.treeFormVisible = false
    },
    // 使用部门清空按钮
    clearsection() {
      this.listQuery.divisionCode = ''
      this.postyly = ''
      this.treeDepartment = false
    },
    poacksty() {
      this.listQuery.factoryCode = ''
      this.yesno = ''
      this.revealspo = ''
      this.treeworks = false
    },

    // 树状图的接口
    treecostypo() {
      this.datast.splice(0)
      fetchComTree('').then(response => {
        this.datast.push(response.data.data)

        for (var i = 0; i < this.datast.length; i++) {
          if (this.datast[i].orgType == '部门') {
            this.datast[i].disabled = true
          }
          /*  console.log(this.datast[i].children) */
          for (var j = 0; j < this.datast[i].children.length; j++) {
            /*  console.log(this.datast[i].children[j]) */
            const child = this.datast[i].children[j]
            if (child.orgType == '部门') {
              child.disabled = true
            }
            if (child.children !== null) {
              for (var p = 0; p < child.children.length; p++) {
                if (child.children[p].orgType == '部门') {
                  child.children[p].disabled = true
                }
              }
            }
          }
        }
      })
    },
    // 使用公司的树选择按钮
    treeco() {
      this.treeFormVisible = true
      this.treecostypo()
    },
    // 设置树状图单选
    handleClick(data, checked, node) {

    },
    // 树状图的点击方法
    handleNodeClick(data, checked, node) {
      //  this.checkedId = data.id;
      this.factoryscod = data.orgCode
      this.factorysname = data.orgFullName
      this.raposyt = data.orgFullName
    },
    // 确定的按钮使用公司
    queshlo1() {
      this.listQuery.companyCode = this.factoryscod
      this.radio = this.factorysname
      this.treeFormVisible = false
    },

    // 使用工厂的树
    manuftory() {
      this.plantlisy.splice(0)
      fetchComTree('').then(response => {
        this.plantlisy.push(response.data.data)
        for (var i = 0; i < this.plantlisy.length; i++) {
          if (this.plantlisy[i].orgType == '部门') {
            this.plantlisy[i].disabled = true
          }
          for (var j = 0; j < this.plantlisy[i].children.length; j++) {
            const child = this.plantlisy[i].children[j]
            if (child.orgType == '部门') {
              child.disabled = true
            }
            if (child.children !== null) {
              for (var p = 0; p < child.children.length; p++) {
                if (child.children[p].orgType == '部门') {
                  child.children[p].disabled = true
                }
              }
            }
          }
        }
      })
    },
    // 工厂点击选择按钮的弹窗
    manufactory() {
      this.treeworks = true
      this.manuftory()
    },
    //  工厂设置树状图单选
    hocheckck(data, checked, node) {

    },
    handleNodeClickworks(data) {
      this.firmcod = data.orgCode
      this.firmname = data.orgFullName
      this.revealspo = data.orgFullName
    },
    // 确认按钮使用工厂
    queshlo2() {
      this.listQuery.factoryCode = this.firmcod
      this.yesno = this.firmname
      this.treeworks = false
    },
    // 使用部门树接口
    sectionst() {
      this.datalisy.splice(0)
      fetchChooseTree('').then(response => {
        this.datalisy.push(response.data.data)
        for (var i = 0; i < this.datalisy.length; i++) {
          if (this.datalisy[i].orgType == '公司') {
            this.datalisy[i].disabled = true
          }
          for (var j = 0; j < this.datalisy[i].children.length; j++) {
            const childsty = this.datalisy[i].children[j]
            if (childsty.orgType == '公司') {
              childsty.disabled = true
            }
            if (childsty.children !== null) {
              for (var p = 0; p < childsty.children.length; p++) {
                const rosyt = childsty.children[p]
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
      })
    },

    // 使用部门树按钮
    treesection() {
      this.treeDepartment = true
      this.sectionst()
    },
    hlsoClick(data, checked, node) {
      this.i++
      if (this.i % 2 == 0) {
        if (checked) {
          this.checkedIdst = data.id
          this.$refs.treefrom.setCheckedNodes([])
          this.$refs.treefrom.setCheckedNodes([data])
        } else {
          this.$refs.treefrom.setCheckedNodes([])
        }
      }
    },

    handleNodeClickst(data) {
      this.checkedIdst = data.id
    },

    // 获取部门被选择的节点
    getCheckedNodes() {
      this.treeData = this.$refs.treefrom.getCheckedNodes()
      this.getOrgCode = this.treeData[0].orgCode
      this.getOrgName = this.treeData[0].orgFullName
    },
    // 点击选择部门确认
    queshlo3() {
      this.getCheckedNodes()
      this.listQuery.divisionCode = this.getOrgCode
      this.postyly = this.getOrgName
      this.treeDepartment = false
    },

    // 日期  搜索
    searchsty() {
      // 评价时间  搜索
      if (this.value13 == null) {
        this.listQuery.startDate = ''
        this.listQuery.endDate = ''
      } else {
        this.listQuery.startDate = this.value13[0]// 开始时间
        this.listQuery.endDate = this.value13[1]
      }
    },
    // 带过来的默认是时间和一些值
    alltiemw() {
      this.posyrouter = this.$route.params.dataObj
      this.listQuery.auditingType = this.posyrouter.checkStatus
      if (this.posyrouter.startDate != '') {
        var stars = ''
        var biges = []
        var stars = this.posyrouter.startDate
        var endes = this.posyrouter.endDate
        biges.push(stars, endes)
        console.log(biges)
        this.value13 = biges
        this.listQuery.startDate = this.value13[0]// 开始时间
        this.listQuery.endDate = this.value13[1]
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
#buttstyps{
   width:42px;
   height:36px;
   cursor:pointer;
   text-align:center;
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

#printTest12{
  margin-top:10px;
}
#printTest12 table{
  border-collapse:collapse;
}
#printTest12 table thead th{
  font-size: 20px;
  padding:10px;
}
#printTest12 table tbody tr{
  height:30px;
  font-size:14px;
}
/* #printTest table tbody td{
   width:25%; 
} */
#printTest12 table tbody td span{
  margin-right:20px;
}

@page {
  size: A4 landscape;
}

 #pic{
  width:97%;
}   
    
</style>
