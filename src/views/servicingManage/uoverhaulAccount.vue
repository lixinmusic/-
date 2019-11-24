<template>
  <div class="app-container">
    <!--外部容器 -->
    <el-container>
       <!-- 顶部搜索 -->
     <!--  -->
        <div class="filter-container">
          
            <div class="formSearch">
            <el-form :inline="true">
              
                <el-form-item label="项目编号">
                <el-input v-model="listQuery.projectCode"  placeholder="请输入项目编号" clearable></el-input>
                </el-form-item>
             
                <el-form-item label="项目名称">
                <el-input class="minier-input" v-model="listQuery.equipName" placeholder="请输入项目名称" clearable></el-input>
                </el-form-item>
               
                <el-form-item label="固定资产编号">
                <el-input class="minier-input" v-model="listQuery.fixedAssetCode" placeholder="请输入固定资产编号" clearable></el-input>
                </el-form-item>
               
                <el-form-item label="修理类别" >
                 <el-select v-model="listQuery.repairType"
                  placeholder="请选择修理类别" 
                  clearable style="width:190px">
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
     
    
      <!-- 内容容器 -->
    
          <!-- 主要区域容器 -->
          <el-main style="padding:20px 0px">
            <el-button class="filter-item" @click="derivation" type="primary" icon="el-icon-edit">导出</el-button>
           
            <el-table :data="listyst" v-loading="listLoading" border fit highlight-current-row
              style="width: 100%;min-height:auto;margin-top:8px" height="500" :header-cell-style="{background:'oldlace'}">
                 <el-table-column  align="center" label="序号" min-width="80" type="index"></el-table-column>

               <el-table-column prop="projectCode" align="center" label="项目编号" min-width="100">
                 </el-table-column>
                <el-table-column prop="projectName" align="center" label="项目名称" min-width="80">
                <template slot-scope="scope">
                 <span class="link-type futiop" @click='checkDetails(scope.row)'>{{scope.row.projectName}}</span>
                 </template>
                 </el-table-column>
              <el-table-column prop="repairTypeName" align="center" label="修理类别" min-width="80">
                 </el-table-column>
               <el-table-column prop="fixedAssetCode" align="center" label="固定资产编号" min-width="80">
                 </el-table-column>
                 <el-table-column prop="documnetCode" align="center" label="报修单编号" min-width="80">
                 </el-table-column>
                 <el-table-column prop="reportTime" align="center" label="报修时间" min-width="80">
                 </el-table-column>
               <el-table-column prop="serialNumber" align="center" label="出厂编号" min-width="80">
                 </el-table-column>
                <el-table-column prop="repairCompany" align="center" label="维修公司" min-width="80">
                 </el-table-column>
                <el-table-column prop="repairFactory" align="center" label="维修工厂" min-width="80">
                 </el-table-column>
                <el-table-column prop="repairDivision" align="center" label="维修部门" min-width="80">
                 </el-table-column>
                <el-table-column prop="deliverDate" align="center" label="交付时间" min-width="80">
                 </el-table-column>
                <el-table-column prop="repairTotal" align="center" label="维修费总额(元)" min-width="80">
                 </el-table-column>
               
                <el-table-column label="发货款情况" align="center" min-width="100">
               <el-table-column prop="shipPrice" align="center" label="发货款金额（元）" min-width="100">
                </el-table-column>
               <el-table-column prop="shipDate" align="center" label="应收时间" min-width="80">
                </el-table-column>
                <el-table-column prop="shipRealDate" align="center" label="实际收款时间" min-width="100">
                </el-table-column>
               </el-table-column> 

                <el-table-column label="验收款情况" align="center" min-width="100">
               <el-table-column prop="shipCompleteDate" align="center" label="实际验收完成时间" min-width="100">
                </el-table-column>
               <el-table-column prop="acceptancePrice" align="center" label="验收款金额（元）" min-width="80"> 
                </el-table-column>
                <el-table-column prop="acceptanceDate" align="center" label="应收时间" min-width="100">
                </el-table-column>
               <el-table-column prop="acceptanceRealDate" align="center" label="实际收款时间" min-width="80"> 
                </el-table-column>
               </el-table-column>

                <el-table-column label="质保金金额" align="center" min-width="100">
               <el-table-column prop="warrantyCompleteDate" align="center" label="实际验收完成时间" min-width="100">
                </el-table-column>
               <el-table-column prop="warrantyPrice" align="center" label="质保金金额(元)" min-width="80">
                </el-table-column>
                 <el-table-column prop="warrantyDate" align="center" label="应收时间" min-width="80">
                </el-table-column>
                 <el-table-column prop="warrantyRealDate" align="center" label="实际收款时间" min-width="80">
                </el-table-column>
               </el-table-column>
               <el-table-column prop="unpackingDate" align="center" label="实际到厂时间" min-width="80">
                 </el-table-column>
               <el-table-column prop="repairEquipAcceptanceCycle" align="center" label="维修验收记录单验收周期（天）" min-width="80">
                 </el-table-column>
               <el-table-column prop="repairEquipWarrantyCycle" align="center" label="维修质保确认单验收周期（天）" min-width="80">
                 </el-table-column> 

                <el-table-column label="设备维修验收记录单（运行三个月或合同约定）" align="center" min-width="100">
               <el-table-column prop="acceptanceRequestTime" align="center" label="要求完成时间" min-width="100">
                </el-table-column>
               <el-table-column prop="acceptanceRealTime" align="center" label="实际完成时间" min-width="80"> 
                </el-table-column>
               </el-table-column> 

                <el-table-column label="维修质保确认单（运行1年或合同约定）" align="center" min-width="100">
               <el-table-column prop="warrantyRequestTime" align="center" label="要求完成时间" min-width="100">
                </el-table-column>
               <el-table-column prop="warrantyRealTime" align="center" label="实际完成时间" min-width="80"> 
                </el-table-column>
               </el-table-column>  
                                             <!-- v-if="edit" -->
                <el-table-column fixed="right" align="center" label="操作" min-width="150"  class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <!-- @click="handleUpdate(scope.row)" -->
                  <el-button title="编辑" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)"></el-button>
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
              <el-form-item label="项目编号" prop="projectCode" label-width="110px">
              <el-input v-model="temp.projectCode" :disabled='requerysty' style="width:190px" maxlength="15" oninput="this.value=this.value.replace(/[^0-9A-z\.]/g,'')" class="enter medium-input" placeholder="请输入项目编号"  @blur="triggerevent"></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="8">
              <el-form-item label="项目名称" prop="projectName"  label-width="110px"> 
              <el-input v-model="temp.projectName" :disabled='siteCodeState' style="width:190px" class="enter medium-input judge" placeholder="请输入项目名称"></el-input>
              </el-form-item>
              </el-col>
                <el-col :span="8"> 
                <el-form-item label="修理类别" prop="repairType">
                 <el-select v-model="temp.repairType"
                  placeholder="请选择修理类别" 
                  clearable style="width:215px" :disabled='siteC'>
                  <el-option v-for="item in genre" 
                  :key="item.value" 
                  :label="item.lsty" 
                  :value="item.value" :disabled='siteC'>
                  </el-option>
                </el-select>
                </el-form-item>
                 </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">
              <el-form-item label="固定资产编号" prop="fixedAssetCode"  label-width="110px"> 
              <el-input v-model="temp.fixedAssetCode"  :disabled='siteCodeState' style="width:190px" class="enter medium-input" placeholder="请输入固定资产编号" ></el-input>
             
              </el-form-item>
              </el-col>
              <el-col :span="8">
              <el-form-item label="出厂编号" prop="serialNumber" label-width="110px"> 
              <el-input v-model="temp.serialNumber"  style="width:190px" class="enter medium-input" :disabled='siteCodeState' placeholder="请输入出厂编号" ></el-input>
            
              </el-form-item>
              </el-col>
               <el-col :span="8">
              <el-form-item label="维修公司" prop="repairCompany">
              <el-input v-model="temp.repairCompany"  style="width:215px" :disabled='siteCodeState'  maxlength="32" class="enter medium-input" placeholder="请输入维修公司" ></el-input>
              </el-form-item>     
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">     
              <el-form-item label="维修工厂" prop="repairFactory" label-width="110px">
              <el-input v-model="temp.repairFactory" :disabled='siteCodeState' style="width:190px"  maxlength="20" class="enter medium-input" placeholder="请输入维修工厂" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="8">
              <el-form-item label="维修部门" prop="repairDivision"  label-width="110px"> 
              <el-input v-model="temp.repairDivision" :disabled='siteCodeState' maxlength="20"  style="width:190px" class="enter medium-input" placeholder="请输入维修部门" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="8">     
              <el-form-item label="交付时间" prop="deliverDate" label-width="100px">
              <div class="block">
                <el-date-picker
                  style="width:215px"
                  v-model="temp.deliverDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                   @change="variety" value-format="yyyy-MM-dd" :disabled='siteC'>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">
              <el-form-item label="维修费总额" prop="repairTotal"  label-width="110px"> 
              <el-input v-model="temp.repairTotal" :disabled='siteC' :oninput="aggregate()"  maxlength="20"  style="width:170px" class="enter medium-input" placeholder="请输入维修费总额/单位:元" ></el-input>
               <span style="padding:0px;font-size:20px;font-weight:800;">元</span>
              </el-form-item>
              </el-col>
            
              <el-col :span="8">
              <el-form-item label="发货款金额(发货款情况)" prop="shipPrice"  label-width="110px"> 
              <el-input v-model="temp.shipPrice" :disabled='siteCodeState' maxlength="10"  style="width:170px" class="enter medium-input" placeholder="请输入发货款金额" ></el-input>
               <span style="padding:0px;font-size:20px;font-weight:800;">元</span>
              </el-form-item>
              </el-col>
               <el-col :span="8">
              <el-form-item label="应收时间(发货款情况)" prop="shipDate"  label-width="110px"> 
              <el-input v-model="temp.shipDate" :disabled='siteCodeState' maxlength="10"  style="width:190px" class="enter medium-input" placeholder="请输入应收时间" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">
              <el-form-item label="实际收款时间(发货款情况)" prop="shipRealDate"  label-width="110px"> 
              <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.shipRealDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd" :disabled='siteC'>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
               <el-col :span="8">
              <el-form-item label="实际验收完成时间(验收款情况)" prop="shipCompleteDate"  label-width="110px"> 
              <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.shipCompleteDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd" disabled>
                </el-date-picker>
              </div>
              </el-form-item>
              </el-col>
               <el-col :span="8">
              <el-form-item label="验收款金额（验收款情况）" prop="acceptancePrice"  label-width="110px"> 
              <el-input v-model="temp.acceptancePrice" :disabled='siteCodeState' maxlength="10"  style="width:185px" class="enter medium-input" placeholder="请输入验收款金额" ></el-input>
              <span style="padding:0px;font-size:20px;font-weight:800;">元</span>
              </el-form-item>
              </el-col>
              </el-row>
              
            

              <el-row>
               <el-col :span="8">
              <el-form-item label="应收时间（验收款情况）" prop="acceptanceDate"  label-width="110px"> 
              <el-input v-model="temp.acceptanceDate" :disabled='siteCodeState' maxlength="10"  style="width:205px" class="enter medium-input" placeholder="请输入应收时间" ></el-input>
              </el-form-item>
              </el-col>
             <el-col :span="8">
              <el-form-item label="实际收款时间（验收款情况）" prop="acceptanceRealDate" label-width="110px"> 
               <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.acceptanceRealDate"
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
              <el-form-item label="实际验收完成时间（质保款情况）" prop="acceptanceCompleteDate" label-width="125px"> 
               <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.acceptanceCompleteDate"
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
              <el-col :span="8">     
              <el-form-item label="质保款金额（质保款情况）" prop="warrantyPrice" label-width="110px">
              <el-input v-model="temp.warrantyPrice" :disabled='siteCodeState' style="width:170px"  maxlength="10" class="enter medium-input" placeholder="请输入质保款金额" ></el-input>
              <span style="padding:0px;font-size:20px;font-weight:800;">元</span>
              </el-form-item>
              </el-col>
              <el-col :span="8">     
              <el-form-item label="应收时间（质保款情况）" prop="warrantyDate" label-width="110px">
              <el-input v-model="temp.warrantyDate" :disabled='siteCodeState' style="width:190px"  maxlength="10" class="enter medium-input" placeholder="请输入应收时间" ></el-input>
              </el-form-item>
              </el-col>
               <el-col :span="8">
              <el-form-item label="实际收款时间（质保款情况）" prop="warrantyRealDate" label-width="110px"> 
               <div class="block">
                <el-date-picker
                  style="width:205px"
                  v-model="temp.warrantyRealDate"
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
              <el-form-item label="实际到厂时间" prop="unpackingDate" label-width="110px"> 
               <div class="block">
                <el-date-picker
                  style="width:190px"
                  v-model="temp.unpackingDate"
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
              <el-form-item label="维修验收记录单验收周期" prop="repairEquipAcceptanceCycle" label-width="110px">
              <el-input v-model="temp.repairEquipAcceptanceCycle" :disabled='siteC' style="width:170px"  maxlength="10" class="enter medium-input" placeholder="请填写" ></el-input>
               <span style="padding:0px;font-size:20px;font-weight:800;">天</span>
              </el-form-item>
              </el-col>
              <el-col :span="8">     
              <el-form-item label="维修质保确认单验收周期" prop="repairEquipWarrantyCycle" label-width="110px">
              <el-input v-model="temp.repairEquipWarrantyCycle" :disabled='siteC' style="width:170px"  maxlength="10" class="enter medium-input" placeholder="请填写" ></el-input>
               <span style="padding:0px;font-size:20px;font-weight:800;">天</span>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">
              <el-form-item label="要求完成时间（维修验收记录单）" prop="acceptanceRequestTime" label-width="130px"> 
               <div class="block">
                <el-date-picker
                  style="width:180px"
                  v-model="temp.acceptanceRequestTime"
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
              <el-form-item label="实际完成时间（维修验收记录单）" prop="acceptanceRealTime" label-width="130px"> 
               <div class="block">
                <el-date-picker
                  style="width:180px"
                  v-model="temp.acceptanceRealTime"
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
              <el-form-item label="要求完成时间（维修质保确认单）" prop="warrantyRequestTime" label-width="130px"> 
               <div class="block">
                <el-date-picker
                  style="width:180px"
                  v-model="temp.warrantyRequestTime"
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
              <el-form-item label="实际完成时间（维修质保确认单）" prop="warrantyRealTime" label-width="130px"> 
               <div class="block">
                <el-date-picker
                  style="width:180px"
                  v-model="temp.warrantyRealTime"
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

            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false" v-if="showpop1">取消</el-button>
              <el-button type="primary" @click="updateData" v-if="showpop2">提交</el-button>
              <el-button type="primary" @click="dialogFormVisible = false" v-if="showpop3">返回</el-button>
            </div>
          </el-dialog>
          <!-- 转修弹窗 -->
       <el-dialog  title="转修" top="13vh" width="500px" :visible.sync="postylitys">
            
            <el-form :rules="rules" ref="dataFormsty" :model="noeli" label-width="110px">
            <h3>确认转外部维修？</h3>
            <span style="color:red; position: absolute;left:25px;top:150px">*</span>
            <el-form-item label="请填写转修理由:" prop="reason" label-width="130px">
                <el-input type="textarea" style="width:310px" maxlength="128" :autosize="{ minRows: 2, maxRows: 4}" placeholder="" v-model="noeli.reason">
                </el-input>
              </el-form-item>
              </el-form>
           <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="poslist1">确认</el-button>
            <el-button @click="postylitys = false">取消</el-button>
            </div>
          </el-dialog>

    </el-container>
  </div>
</template>

<script>
import { fetchList, derivationst, selectById, updateArticle, existence, transfersp } from '@/api/servicingManage/uoverhaulAccount'
import waves from '@/directive/waves' // 水波纹指令
import { fetchButton } from '@/api/common/button'
export default {
  name: 'uoverhaulAccount',
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
    // 英文和数字
    var project = (rule, value, callback) => {
      if (value != '') {
        if ((/^[A-Za-z0-9]+$/).test(value) == false) {
          callback(new Error('请输入项目编号(允许英文和数字输入)'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }

    var vaNumber = (rule, value, callback) => {
      if (value) {
        if ((/^[0-9]+([0-9]+){0,1}$/).test(value) == false) {
          callback(new Error('请输入整数'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }

    return {
      // 修理类别下拉
      genre: [
        { value: 1, lsty: '大修' },
        { value: 2, lsty: '保养' }
      ],
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
        lookpos: '查看'
      },
      // 转修弹框
      postylitys: false,
      dialo: '',
      textPst: {
        create: '转修'
      },
      noeli: {
        reason: ''// 转修的意见
      },
      codefix: '', // 固定资产

      showpop1: false,
      showpop2: false,
      showpop3: false,
      temp: {
        deliverDate: '',
        shipRealDate: '',
        acceptanceCompleteDate: '',
        acceptanceDate: '',
        acceptanceRealTime: '',
        acceptanceRequestTime: '',
        shipDate: '',
        unpackingDate: '',
        warrantyCompleteDate: '',
        warrantyRealDate: '',
        warrantyRealTime: '',
        warrantyRequestTime: ''

      },
      requerysty: false, // 项目编号唯一性
      // 按钮权限
      addnewly: false, // 新
      edit: false, // 编
      cutout: false, // 删
      listLoading: true, // 远程搜索加载动画
      siteCodeState: true, // 禁用状态
      siteC: true, // 查看禁用
      dstpost: '', // 交付时间

      // 弹框内输入框不填显示的提示信息  /^[A-Za-z0-9]+$/
      rules: {
        repairType: [{ required: true, message: '请选择修理类别', trigger: 'change' }],
        projectCode: [{ required: true, validator: project, trigger: 'change' }],
        projectName: [{ required: true, message: '请输入项目名称', trigger: 'change' }],
        fixedAssetCode: [{ required: true, message: '请输入固定资产编号', trigger: 'change' }],
        serialNumber: [{ required: true, message: '请输入出厂编号', trigger: 'change' }],
        repairTotal: [{ required: false, validator: phoneNum, trigger: 'change' }],

        repairEquipAcceptanceCycle: [{ required: true, validator: vaNumber, trigger: 'change' }],
        repairEquipWarrantyCycle: [{ required: true, validator: vaNumber, trigger: 'change' }]

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

    // 表格的接口  1, '大修'  2,  '保养'

    getAA() {
      this.listLoading = true
      fetchList(this.pageNum, this.pageSize, this.listQuery).then(response => {
        this.listyst = response.data.data.list
        for (var i = 0; i < this.listyst.length; i++) {
          if (this.listyst[i].repairType == 1) {
            this.listyst[i].repairTypeName = '大修'
          } else if (this.listyst[i].repairType == 2) {
            this.listyst[i].repairTypeName = '保养'
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
    // 查看
    checkDetails(row) {
      // 判断是否填了固定资产编号填了就质灰
      this.requerysty = true
      this.siteCodeState = true
      this.siteC = true// 查看禁用
      this.dialogStatus = 'lookpos'
      this.showpop1 = false
      this.showpop2 = false
      this.showpop3 = true
      this.dialogFormVisible = true
      const ids = { id: row.id }
      selectById(ids).then(response => {
        this.popTitle = response.data.data
        if (this.popTitle.repairType == 0) {
          this.popTitle.repairTypeName = ''
          this.popTitle.repairType = ''
        }
        this.temp = Object.assign({}, this.popTitle)
      })
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 转修弹窗
    transfer(row) {
      this.postylitys = true
      this.noeli.reason = ''
      this.codefix = row.documnetCode
      this.$nextTick(() => {
        this.$refs['dataFormsty'].clearValidate()
      })
    },
    // 确认
    poslist1() {
      this.$refs['dataFormsty'].validate(valid => {
        if (valid) {
          if (this.noeli.reason == '') {
            this.$notify({
              title: '警告',
              message: '请填写转修理由',
              type: 'warning',
              duration: 3000
            })
            return
          }
          const noeliData = {
            code: this.codefix,
            reason: this.noeli.reason
          }

          transfersp(noeliData).then(response => {
            const msg = response.data.msg
            if (response.data.code == 200) {
              this.postylitys = false
              this.getAA()

              this.dialogFormVisible = false
              this.$message({
                title: '成功',
                message: msg,
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '警告',
                message: msg,
                type: 'warning',
                duration: 3000
              })
            }
          })
        }
      })
    },

    // 编辑点击打开弹窗事件  projectCode  acceptanceDate
    handleUpdate(row) {
      // 判断是否填了固定资产编号填了就质灰
      if (row.projectCode !== '' && row.projectCode !== null) {
        this.requerysty = true
      } else {
        this.requerysty = false
      }
      this.siteCodeState = true
      this.siteC = false// 查看禁用
      this.showpop1 = true
      this.showpop2 = true
      this.showpop3 = false
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      const ids = { id: row.id }
      selectById(ids).then(response => {
        this.popTitle = response.data.data
        if (this.popTitle.repairType == 0) {
          this.popTitle.repairTypeName = ''
          this.popTitle.repairType = ''
        }
        this.temp = Object.assign({}, this.popTitle)

      })

      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 交付时间计算  shipDate
    variety() {
      // 发货
      const datastlist1 = new Date(this.temp.deliverDate)
      if (this.temp.deliverDate == null || this.temp.deliverDate == '') {
        this.temp.shipDate = ''
        this.temp.acceptanceDate = ''
        this.temp.warrantyDate = ''
      } else {
        const time2 = datastlist1.getTime()
        const op1 = time2 + 2629800000 + 86400000 // 1个月
        var newdate1 = new Date(op1)
        var Y1 = newdate1.getFullYear() + '-'
        var M1 = (newdate1.getMonth() + 1 < 10 ? '0' + (newdate1.getMonth() + 1) : newdate1.getMonth() + 1) + '-'
        var D1 = newdate1.getDate() + ' '
        this.temp.shipDate = Y1 + M1 + D1

        //  验收    1天 = 86400000毫秒
        const datastlist = new Date(this.temp.deliverDate)
        const time1 = datastlist.getTime()
        const op = time1 + 7889400000 - 86400000// 3个月
        var newdate = new Date(op)
        var Y = newdate.getFullYear() + '-'
        var M = (newdate.getMonth() + 1 < 10 ? '0' + (newdate.getMonth() + 1) : newdate.getMonth() + 1) + '-'
        var D = newdate.getDate() + ' '
        this.temp.acceptanceDate = Y + M + D
        //  质保
        const datastlist3 = new Date(this.temp.deliverDate)
        const time3 = datastlist3.getTime()
        const op3 = time3 + 31557600000 // 12个月
        var newdate3 = new Date(op3)
        var Y3 = newdate3.getFullYear() + '-'
        var M3 = (newdate3.getMonth() + 1 < 10 ? '0' + (newdate3.getMonth() + 1) : newdate3.getMonth() + 1) + '-'
        var D3 = newdate3.getDate() + ' '
        this.temp.warrantyDate = Y3 + M3 + D3
      }
    },
    //  维修总金额
    aggregate() {
      if (this.temp.repairTotal == '') {
        this.temp.shipPrice = ''
      } else {
        // 发货金额
        var x = this.temp.repairTotal
        var num = parseFloat(x)

        var newnum = num * 0.6
        newnum = newnum.toFixed(2)
        this.temp.shipPrice = newnum

        // 验收金额
        var x1 = this.temp.repairTotal
        var num1 = parseFloat(x1)
        var newnum1 = num1 * 0.3
        newnum1 = newnum1.toFixed(2)
        this.temp.acceptancePrice = newnum1

        // 质保金额
        var x2 = this.temp.repairTotal
        var num2 = parseFloat(x2)
        var newnum2 = num2 * 0.1
        newnum2 = newnum2.toFixed(2)
        this.temp.warrantyPrice = newnum2
      }
    },
    // 判断是否项目编号有值
    triggerevent() {
      const projectCode = { projectCode: this.temp.projectCode }
      if (this.temp.projectCode == '') {
        return
      } else if (this.temp.projectCode !== '') {
        existence(projectCode).then(resp => {
          if (resp.data.code == 3003) {
            this.$notify({
              title: '提示',
              message: resp.data.msg,
              type: 'warning',
              duration: 3000
            })
            this.temp.projectCode = ''
          }
        })
      }
    },

    // 编辑提交按钮 projectCode
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.temp.repairEquipAcceptanceCycle == '' || this.temp.repairEquipWarrantyCycle == '' || this.temp.projectCode == '') {
            this.$notify({
              title: '提示',
              message: '可编辑的必填项不能为空',
              type: 'warning',
              duration: 2000
            })
            return
          } else {
            /*  if(this.temp.deliverDate==null){
              this.temp.deliverDate=''
            } */
            const tempData = Object.assign({}, this.temp)
            // const projectCode = { projectCode: tempData.projectCode }
            // existence(projectCode).then(resp => {
            /*  if (resp.data.msg == '项目编号已存在') {
              this.$notify({
                title: '提示',
                message: resp.data.msg,
                type: 'error',
                duration: 3000
              })
              return
            } else { */
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
            // }
          // })
          }
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
