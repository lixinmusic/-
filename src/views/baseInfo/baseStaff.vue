<template>
  <div class="app-container">
    <!--外部容器 -->
    <el-container>
       <!-- 顶部搜索 -->
      <el-header style="margin-bottom:30px;padding:0">
        <div class="filter-container">
        <!--   <div style="font-size:20px;color:#409eff;margin-bottom:10px;border-bottom:1px solid #ddd">人员管理</div> -->
           <div class="formSearch">
            <el-form :inline="true">
                <el-form-item label="姓名">
                <el-input class="minier-input" v-model="listQuery.perName" placeholder="请输入姓名" clearable></el-input>
                </el-form-item>
                <el-form-item label="工号" class="seat">
                <el-input v-model="listQuery.workNumber" placeholder="请输入工号" clearable></el-input>
                </el-form-item>
                <el-form-item label="岗位名称" class="seat">
                <el-input  class="minier-input" v-model="listQuery.stationName" placeholder="请输入岗位名称" clearable></el-input>
                </el-form-item>
                <el-form-item>
                <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
                </el-form-item>
            </el-form>
           </div>
          
        </div>
       </el-header>
      <!-- 内容容器 -->
      <el-container>
        <!-- 侧边栏容器 -->
        <!-- <div class="erop" style="width:240px;height:624px;overflow-y:scroll;margin-top:40px;"> -->
        <el-aside style="border:1px solid #f0f0f0;width:290px;height:624px;margin-top:20px;" >
        <el-tree :data="datast" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </el-aside>
        <!-- </div> -->
        <el-container>
          <!-- 主要区域容器 -->
          <el-main>
            <el-button class="filter-item" style="margin-left:20px;" @click="handleCreate" type="primary" icon="el-icon-edit" v-if="addnewly">新增</el-button>
            <el-table :data="listyst" v-loading="listLoading" border fit highlight-current-row
              style="width: 100%;min-height:auto;margin-top:8px" height="500" :header-cell-style="{background:'oldlace'}">

                <!--  <el-table-column type="index" align="center" label="序号" fixed="left" min-width="50">
                 </el-table-column> -->
                <el-table-column prop="perName" align="center" label="姓名" min-width="80">
                     <template slot-scope="scope">
                        <span class="link-type futiop" @click='checkDetails(scope.row)'>{{scope.row.perName}}</span>
                    </template>
                 </el-table-column>
                <el-table-column prop="workNumber" align="center" label="工号" min-width="80">
                 </el-table-column>
                <el-table-column prop="rfid" align="center" label="RFID" min-width="80">
                 </el-table-column>
                <el-table-column prop="phoneNumber" align="center" label="手机号码" min-width="80">
                 </el-table-column>
                <el-table-column prop="stationName" align="center" label="岗位名称" min-width="80">
                 </el-table-column>
                <el-table-column prop="email" align="center" label="邮箱" min-width="80">
                 </el-table-column>
                <el-table-column prop="isOnDuty" align="center" label="是否在职" min-width="80">
                     <template slot-scope="scope">
                   <span>{{scope.row.isOnDuty==0?'否':'是'}}</span>
                  </template>
                 </el-table-column>
               
              <el-table-column align="center" label="操作" min-width="150"  class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-button title="编辑" type="primary" v-if="edit" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)"></el-button>
                  <el-button title="删除" type="danger" v-if="cutout" icon="el-icon-delete" size="mini"  @click="deleteBtn(scope.row)"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
          <!-- 底栏容器 -->
          <el-footer>
             <div style="width:100%;height:50px;background:#fff">
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
          </div>
          </el-footer>
         
         
          <!-- 新增和编辑是同一个弹出框 -->
          <el-dialog :close-on-click-modal="false" :title="textMap[dialogStatus]" v-dialogDrag top="20vh" width="700px" :visible.sync="dialogFormVisible">
            <el-form :rules="rules" ref="dataForm" :model="temp" label-width="100px">
              <el-row>
              <el-col :span="8">     
              <el-form-item label="姓名" prop="perName">
              <el-input v-model="temp.perName" style="width:190px" maxlength="20" class="enter medium-input" placeholder="请输入姓名" ></el-input>
              </el-form-item>
              </el-col>
               <el-col :span="16">
              <el-form-item label="工号" prop="workNumber" style="margin-left:100px;"> 
              <el-input v-model="temp.workNumber" style="width:190px" :disabled='siteCodeState?true:false' maxlength="6" class="enter medium-input" placeholder="请输入工号" onkeyup="this.value=this.value.replace(/\D/g,'')"></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">     
              <el-form-item label="RFID号" prop="rfid">
              <el-input v-model="temp.rfid" style="width:190px" maxlength="10" class="enter medium-input" placeholder="请输入rfid号" onkeyup="this.value=this.value.replace(/\D/g,'')"></el-input>
              </el-form-item>
              </el-col>
               <el-col :span="16">
              <el-form-item label="钢号" prop="steelNumber" style="margin-left:100px;"> 
              <el-input v-model="temp.steelNumber" maxlength="20" style="width:190px" class="enter medium-input" placeholder="请输入钢号" onKeyUp="value=value.replace(/[^\d|abcdefghijklmnopqrstuvwxyz]/g,'')"></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">     
              <el-form-item label="手机号码" prop="phoneNumber">
              <el-input v-model="temp.phoneNumber"  maxlength="11" style="width:190px" class="enter medium-input" placeholder="请输入手机号码"></el-input>
              </el-form-item>
              </el-col>
               <el-col :span="16">
              <el-form-item label="座机号码" prop="teleNumber" style="margin-left:100px;"> 
              <el-input v-model="temp.teleNumber" maxlength="12" style="width:190px" class="enter medium-input" placeholder="请输入座机号码" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>

               <el-row>
              <el-col :span="8">     
              <el-form-item label="手机短号" prop="shortNumber">
              <el-input v-model="temp.shortNumber" style="width:190px" maxlength="8" class="enter medium-input" placeholder="请输入手机短号"></el-input>
              </el-form-item>
              </el-col>
               <el-col :span="16">
              <el-form-item label="邮箱" prop="email" style="margin-left:100px;"> 
              <el-input v-model="temp.email" style="width:190px" class="enter medium-input" placeholder="请输入邮箱" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">     
              <el-form-item label="员工类型" prop="employeeType">
              <!-- <el-input v-model="temp.employeeType" style="width:190px" class="enter medium-input" placeholder="请输入员工类型" ></el-input> -->
               <el-select v-model="temp.employeeType" style="width:190px" clearable placeholder="请选择">
                <el-option
                v-for="item in employeetype"
                :key="item.value"
                :label="item.lsty"
                :value="item.value">
                </el-option>
             </el-select>
              </el-form-item>
              </el-col>
               <el-col :span="16">
              <el-form-item label="身份证号" prop="idCard"  style="margin-left:100px;"> 
              <el-input v-model="temp.idCard" style="width:190px" maxlength="18" class="enter medium-input" placeholder="请输入身份证号"></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">
              <el-form-item label="身高"  prop="height">
              <el-input v-model="temp.height" style="width:190px" maxlength="3" onkeyup="this.value=this.value.replace(/\D/g,'')" class="enter medium-input" placeholder="请输入身高单位/cm" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="年龄" prop="age"  style="margin-left:100px;"> 
              <el-input v-model="temp.age" style="width:190px" maxlength="2" onkeyup="this.value=this.value.replace(/\D/g,'')" class="enter medium-input" placeholder="请输入年龄单位/岁" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">
              <el-form-item label="婚姻状况"  prop="maritalStatus">
              <el-select v-model="temp.maritalStatus" style="width:190px" clearable placeholder="请选择">
                <el-option
                v-for="item in matrimony"
                :key="item.value"
                :label="item.lsty"
                :value="item.value">
                </el-option>
             </el-select>
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="健康状况" prop="healthStatus"  style="margin-left:100px;"> 
              <!-- <el-input v-model="temp.healthStatus" style="width:190px" class="enter medium-input" placeholder="请选择" ></el-input> -->
               <el-select v-model="temp.healthStatus" style="width:190px" clearable placeholder="请选择健康状况">
                <el-option
                v-for="item in healthstatus"
                :key="item.value"
                :label="item.lsty"
                :value="item.value">
                </el-option>
             </el-select>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">
              <el-form-item label="政治面貌"  prop="politicalOutlook">
               <el-select v-model="temp.politicalOutlook" style="width:190px" clearable placeholder="请选择政治面貌">
                <el-option
                v-for="item in political"
                :key="item.value"
                :label="item.lsty"
                :value="item.value">
                </el-option>
             </el-select>
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="最高学历" prop="highestEducation"  style="margin-left:100px;"> 
              <!-- <el-input v-model="temp.highestEducation" style="width:190px" class="enter medium-input" placeholder="请输入学历" ></el-input> -->
               <el-select v-model="temp.highestEducation" style="width:190px" clearable placeholder="请选择学历">
                <el-option
                v-for="item in highesteducation"
                :key="item.value"
                :label="item.lsty"
                :value="item.value">
                </el-option>
             </el-select>
              </el-form-item>
              </el-col>
              </el-row>

            
              <el-row>
              <el-col :span="8">
              <el-form-item label="是否在职" prop="isOnDuty" style="width:190px"> 
               <el-select v-model="temp.isOnDuty" style="width:190px" clearable placeholder="请选择是否在职">
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.lsty"
                :value="item.value">
                {{item.lsty}}
                </el-option>
              </el-select>
              </el-form-item>
              </el-col>

              <el-col :span="16">
              <el-form-item label="岗位名称" prop="stationCode" style="margin-left:100px;"> 
               <el-select style="width:190px" v-model="temp.stationCode" filterable remote 
                  reserve-keyword placeholder="请输入岗位名称" 
                  :remote-method="getCustomer"  v-loading="listLoading"
                  clearable class="medium-input">
                  <el-option v-for="item in sendCustomer_options" 
                  :key="item.value" 
                  :label="item.label" 
                  :value="item.value">
                  <span style="float: left; font-size: 13px;">{{ item.label }}</span>
                  </el-option>
                </el-select>
                <!-- {{stationName}} -->
              </el-form-item>
              </el-col>
              </el-row>

              <el-form-item label="人员描述" prop="discription">
                <el-input type="textarea" style="width:510px" maxlength="256" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入描述" v-model="temp.discription">
                </el-input>
              </el-form-item>

           
              <el-form-item label="所属组织:"  prop="orgCode" style="margin-left:-20px">
              <!-- <span style="color:red">当前所属组织：</span> -->
              <span >{{receive}}</span>
              <div class="Treebox">
               <el-tree :data="roprtys" :props="ParCodesty" highlight-current ref="tree" @node-click="handleNodeClicks"></el-tree>
               </div>
              </el-form-item>
              
                  <!-- stationName -->
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取消</el-button>
              <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">提交</el-button>
              <el-button v-else type="primary" @click="updateData">提交</el-button>
            </div>
          </el-dialog>


      <el-dialog :close-on-click-modal="false" title="查看详情" v-dialogDrag top="20vh" width="700px" :visible.sync="dialoglookVisible">
        <el-form :model="temp" ref="dataForm" label-width="100px">
          <el-row>
              <el-col :span="8">     
              <el-form-item label="姓名" prop="perName">
              <el-input v-model="temp.perName" style="width:190px" :disabled='siteCodeState?true:false' maxlength="20" class="enter medium-input" placeholder="空" ></el-input>
              </el-form-item>
              </el-col>
               <el-col :span="16">
              <el-form-item label="工号" prop="workNumber" style="margin-left:100px;"> 
              <el-input v-model="temp.workNumber" style="width:190px" :disabled='siteCodeState?true:false' maxlength="6" class="enter medium-input" placeholder="空"></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">     
              <el-form-item label="RFID号" prop="rfid">
              <el-input v-model="temp.rfid" style="width:190px" :disabled='siteCodeState?true:false' maxlength="10" class="enter medium-input" placeholder="空" ></el-input>
              </el-form-item>
              </el-col>
               <el-col :span="16">
              <el-form-item label="钢号" prop="steelNumber" style="margin-left:100px;"> 
              <el-input v-model="temp.steelNumber" maxlength="20" :disabled='siteCodeState?true:false' style="width:190px" class="enter medium-input" placeholder="空"></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">     
              <el-form-item label="手机号码" prop="phoneNumber">
              <el-input v-model="temp.phoneNumber" style="width:190px" :disabled='siteCodeState?true:false' class="enter medium-input" placeholder="空" ></el-input>
              </el-form-item>
              </el-col>
               <el-col :span="16">
              <el-form-item label="电话号码" prop="teleNumber" style="margin-left:100px;"> 
              <el-input v-model="temp.teleNumber" :disabled='siteCodeState?true:false' style="width:190px" class="enter medium-input" placeholder="空" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>

               <el-row>
              <el-col :span="8">     
              <el-form-item label="手机短号" prop="shortNumber">
              <el-input v-model="temp.shortNumber" style="width:190px" maxlength="8" class="enter medium-input" placeholder="空" :disabled='siteCodeState?true:false'></el-input>
              </el-form-item>
              </el-col>
               <el-col :span="16">
              <el-form-item label="邮箱" prop="email" style="margin-left:100px;"> 
              <el-input v-model="temp.email" style="width:190px" :disabled='siteCodeState?true:false' class="enter medium-input" placeholder="空" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">     
              <el-form-item label="员工类型" prop="employeeType">
              <el-input v-model="temp.employeeType" style="width:190px" :disabled='siteCodeState?true:false' class="enter medium-input" placeholder="空" ></el-input>
              </el-form-item>
              </el-col>
               <el-col :span="16">
              <el-form-item label="身份证号" prop="idCard"  style="margin-left:100px;"> 
              <el-input v-model="temp.idCard" style="width:190px" maxlength="18" :disabled='siteCodeState?true:false' class="enter medium-input" placeholder="空" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">
              <el-form-item label="身高"  prop="height">
              <el-input v-model="temp.height" style="width:190px" :disabled='siteCodeState?true:false' maxlength="3" class="enter medium-input" placeholder="空" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="年龄" prop="age"  style="margin-left:100px;"> 
              <el-input v-model="temp.age" style="width:190px" :disabled='siteCodeState?true:false' maxlength="2" class="enter medium-input" placeholder="空" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">
              <el-form-item label="婚姻状况"  prop="maritalStatus">
              <el-input v-model="temp.maritalStatus" style="width:190px" :disabled='siteCodeState?true:false' maxlength="2" class="enter medium-input" placeholder="空" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="健康状况" prop="healthStatus"  style="margin-left:100px;"> 
              <el-input v-model="temp.healthStatus" style="width:190px" :disabled='siteCodeState?true:false' class="enter medium-input" placeholder="空" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">
              <el-form-item label="政治面貌"  prop="politicalOutlook">
              <el-input v-model="temp.politicalOutlook" style="width:190px" :disabled='siteCodeState?true:false' class="enter medium-input" placeholder="空" ></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="16">
              <el-form-item label="最高学历" prop="highestEducation"  style="margin-left:100px;"> 
              <el-input v-model="temp.highestEducation" :disabled='siteCodeState?true:false' style="width:190px" class="enter medium-input" placeholder="空" ></el-input>
              </el-form-item>
              </el-col>
              </el-row>

              <el-row>
              <el-col :span="8">
              <el-form-item label="是否在职" prop="isOnDuty" style="width:190px"> 
                <el-select v-model="temp.isOnDuty" :disabled='siteCodeState?true:false' style="width:190px" clearable placeholder="请选择是否在职">
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.lsty"
                :value="item.value">
                {{item.lsty}}
                </el-option>
             </el-select>    
              </el-form-item>
              </el-col>

              <el-col :span="16">
              <el-form-item label="岗位名称" prop="stationCode"  style="margin-left:100px;"> 
               <el-select style="width:190px" v-model="temp.stationCode" :disabled='siteCodeState?true:false' filterable remote 
                  reserve-keyword placeholder="空" 
                  :remote-method="getCustomer"  v-loading="listLoading"
                  clearable class="medium-input">
                  <el-option v-for="item in sendCustomer_options" 
                  :key="item.value" 
                  :label="item.label" 
                  :value="item.value" >
                    <span style="float: left; font-size: 13px">{{ item.label }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              </el-col>
              </el-row>
              <el-form-item label="人员描述" prop="discription">
                <el-input type="textarea" style="width:510px" :disabled='siteCodeState?true:false' maxlength="256" :autosize="{ minRows: 2, maxRows: 4}" placeholder="空" v-model="temp.discription">
                </el-input>
              </el-form-item>

          
              <el-form-item label="所属组织:"  prop="orgCode" style="margin-left:-20px">
              <!-- <span style="color:red">当前所属组织：</span> -->
              <span>{{receive}}</span>
              <div class="Treebox">
               <!-- <el-tree :data="roprtys" :props="ParCodesty" highlight-current ref="tree" show-checkbox  @node-click="handleNodeClicks"></el-tree> -->
               </div>
              </el-form-item>
            
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialoglookVisible = false">确定</el-button>
        </span>
      </el-dialog>

        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { fetchList, dendrogram, createArticle, updateArticle, fetchPv, fuzzyQuery, look, doesitExist, newlyiNcreased, evaluate } from '@/api/baseInfo/baseStaff'
import waves from '@/directive/waves' // 水波纹指令 baseStaff
import { fetchButton } from '@/api/common/button'
import { menuList } from '@/store/modules/permission'// 按钮权限

export default {
  name: 'baseStaff',
  directives: {
    waves
  },
  data() {
    var validatephone = (rule, value, callback) => {
      if (value) {
        if ((/^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/).test(value) == false) {
          callback(new Error('请输入正确的手机号'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    var validateteleNumber = (rule, value, callback) => {
      if (value) {
        if ((/^((0\d{2,3}-\d{7,8}))$/).test(value) == false) {
          callback(new Error('请输入正确的座机号'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    var validateEmail = (rule, value, callback) => {
      if (value) {
        if ((/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/).test(value) == false) {
          callback(new Error('请输入有效的邮箱'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    var validateIDCard = (rule, value, callback) => {
      if (value) {
        if ((/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/).test(value) == false) {
          callback(new Error('请输入有效的身份证号'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    var validateshortNumber = (rule, value, callback) => {
      if (value) {
        if ((/^[0-9]*$/).test(value) == false) {
          callback(new Error('请输入正确的手机短号'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }

    return {
      // 是否在职下拉框
      options: [
        { value: 1, lsty: '是' },
        { value: 0, lsty: '否' }
      ],
      matrimony: [
        { value: '未婚', lsty: '未婚' },
        { value: '已婚', lsty: '已婚' }
      ],
      political: [
        { value: '群众', lsty: '群众' },
        { value: '团员', lsty: '团员' },
        { value: '党员', lsty: '党员' }
      ],
      highesteducation: [
        { value: '小学', lsty: '小学' },
        { value: '初中', lsty: '初中' },
        { value: '高中', lsty: '高中' },
        { value: '大专', lsty: '大专' },
        { value: '本科', lsty: '本科' },
        { value: '硕士', lsty: '硕士' },
        { value: '博士', lsty: '博士' }
      ],
      healthstatus: [
        { value: '良好', lsty: '良好' },
        { value: '疾病', lsty: '疾病' }

      ],
      employeetype: [
        { value: '正式员工', lsty: '正式员工' },
        { value: '外包员工', lsty: '外包员工' }
      ],
      listyst: [],
      lookList: [],
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 10

      },
      stationstName: '',
      orgCode: '',
      staName: '',
      sendCustomer_options: [], // 新增里的模糊查询
      stationName: '',
      orgCodelopo: '',
      // 树的数据
      datast: [],
      defaultProps: {
        children: 'children',
        label: 'orgFullName'
      },
      // 新增里的所属组织树
      roprtys: [],
      ParCodesty: {
        children: 'children',
        label: 'orgFullName'
      },
      receive: '', // 新增里的所属组织树的数组
      oldorgCode: '',
      temp: {
        id: undefined,
        remark: '',
        timestamp: new Date(),
        title: ''
      },
      // 弹框显示
      dialogFormVisible: false,
      popTitle: '',
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      // 按钮权限
      addnewly: false, // 新
      edit: false, // 编
      cutout: false, // 删
      huntfor: false, // 搜索

      // 弹框内输入框不填显示的提示信息isOnDuty
      siteCodeState: '', // 工号禁用状态
      dialogPvVisible: false,
      dialoglookVisible: false, // 查看弹框打开
      downloadLoading: false,
      pvData: [],
      rules: {
        perName: [{ required: true, message: '姓名不能为空', trigger: 'change' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'change' }],
        orgCode: [{ required: true, message: '请选择', trigger: 'blur' }],
        // stationName: [{ required: true, message: '请输入1', trigger: 'blur' }],
        stationCode: [{ required: true, message: '请输入', trigger: 'blur' }],
        isOnDuty: [{ required: true, message: '必选项请选择', trigger: 'blur' }],
        // orgCode: [{ required: true, message: '请选择', trigger: 'blur' }],
        phoneNumber: [{ required: false, validator: validatephone, trigger: 'change' }],
        teleNumber: [{ required: false, validator: validateteleNumber, trigger: 'change' }],
        email: [{ required: false, validator: validateEmail, trigger: 'change' }],
        shortNumber: [{ required: false, validator: validateshortNumber, trigger: 'change' }],
        idCard: [{ required: false, validator: validateIDCard, trigger: 'change' }]

      }
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
    this.getapst()
    // this.fuzzy()
    this.getstyl()
    this.getbttonst()
  },

  methods: {
    // 按钮的权限
    getbttonst() {
      menuList.forEach(item => {
        item.children.forEach(e => {
          if (e.name == 'baseStaff') {
            this.menuCode = e.code
          }
        })
      })
      const determine = {
        // menuCode:"WM_012",//因为9.3号说测试服的是WM_012，所以才改为WM_012，本来是WM_019
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
    //   新增里的岗位名称下拉的远程搜索
    getCustomer(query) {
      if (query) {
        // this.listLoading = true
        this.sendCustomer_options = []
        // console.log(query)
        fuzzyQuery(query).then(response => {
          // console.log(response.data.data[0].staCode)
          // this.stationstName =response.data.data[0].staCode
          this.sendCustomer_options = response.data.data.map(item => {
            return { value: item.staCode, label: item.staName }
          })
          console.log(this.sendCustomer_options)
        })
      } else {
        this.sendCustomer_options = []
      }
    },
    // 表格的数据接口
    getAA() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.listyst = response.data.data.list
        this.total = response.data.data.total
        //   this.listLoading = false
        this.$nextTick(() => {
          this.listLoading = false
        })
      })
    },
    // 树状图的接口
    getapst() {
      this.listLoading = true
      this.datast.splice(0)
      dendrogram('').then(response => {
        this.datast.push(response.data.data)
        this.listLoading = false
      })
    },
    // 树状图的点击方法
    handleNodeClick(data) {
      this.listLoading = true
      this.orgCodelopo = data.orgCode
      const treeclick = {
        orgCode: this.orgCodelopo,
        pageNum: this.listQuery.pageNum,
        pageSize: this.listQuery.pageSize
      }
      fetchList(treeclick).then(response => {
        this.listyst = response.data.data.list
        this.total = response.data.data.total
        this.listLoading = false
      })
    },
    // 新增里的所属组织树
    getstyl() {
      this.listLoading = true
      this.roprtys = []
      newlyiNcreased('').then(response => {
        this.roprtys = []
        this.roprtys.push(response.data.data)
        console.log(this.roprtys)
        this.listLoading = false
      })
    },
    // 新增里的所属组织树点击事件
    handleNodeClicks(data) {
      this.receive = data.orgFullName
      this.temp.orgCode = data.orgCode
      this.temp.orgName = data.orgFullName
      this.oldorgCode = data.orgCode
      console.log(this.receive)
      console.log(data)
    },

    // 查看
    checkDetails(row) {
      /*  this.temp = Object.assign({}, row)
      this.dialoglookVisible = true
      this.siteCodeState = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      }) */

      console.log(row.id)
      const id = row.id
      evaluate(id).then(response => {
        this.popTitle = response.data.data
        console.log(this.popTitle)
        this.receive = this.popTitle.orgName
        this.temp = Object.assign({}, this.popTitle)

        this.sendCustomer_options.splice(0)
        this.sendCustomer_options.push({
          value: this.temp.stationCode,
          label: this.popTitle.stationName
        })
      })
      this.dialoglookVisible = true
      this.siteCodeState = true
      this.receive = this.temp.orgName
      this.stationName = this.temp.stationName
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 删除事件
    deleteBtn(row) {
      this.$confirm('是否确认删除,删除人员后，将与人员关联用户删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })

        console.log(row)
        const deleteid = row.id
        console.log(deleteid)
        fetchPv(deleteid).then(response => {
          this.getAA()
          this.getapst()
          const index = this.listyst.indexOf(row)
          this.listyst.splice(index, 1)
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
      this.orgCodelopo = ''
      this.listQuery.pageNum = 1
      this.getAA()
    },

    handleSizeChange(val) {
      if (this.orgCodelopo == '') {
        console.log(1234)
        console.log(val)
        // this.listQuery.pageSize = val
        // this.getAA()
        // this.showPrise = true
        this.listQuery.pageSize = val
        this.getAA()
      } else if (this.orgCodelopo !== '') {
      // this.showPrise = true
        this.listQuery.pageSize = val
        console.log(12345678)
        this.dragShow = true
        this.listLoading = true
        const treeclick = {
          orgCode: this.orgCodelopo,
          pageNum: this.listQuery.pageNum,
          pageSize: this.listQuery.pageSize
        }
        fetchList(treeclick).then(response => {
          this.listyst = response.data.data.list
          this.total = response.data.data.total
          this.listLoading = false
        })
      }
    },

    handleCurrentChange(val) {
      if (this.orgCodelopo == '') {
        console.log(1234)
        console.log(val)
        // this.listQuery.pageNum = val
        // this.getAA()
        // this.showPrise = true
        this.listQuery.pageNum = val
        this.getAA()
      } else if (this.orgCodelopo !== '') {
      // this.showPrise = true
        this.listQuery.pageNum = val
        console.log(12345678)
        this.dragShow = true
        this.listLoading = true
        const treeclick = {
          orgCode: this.orgCodelopo,
          pageNum: this.listQuery.pageNum,
          pageSize: this.listQuery.pageSize
        }
        fetchList(treeclick).then(response => {
          this.listyst = response.data.data.list
          this.total = response.data.data.total
          this.listLoading = false
        })
      }
    },
    // 重置表单
    resetForm() {
      for (const i in this.temp) {
        this.temp[i] = ''
      }
      this.receive = ''
      this.temp.isOnDuty = 1
    },

    // 新增事件
    handleCreate() {
      this.resetForm()
      //  this.getstyl()
      this.siteCodeState = false
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.getstyl()
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          doesitExist(this.temp.workNumber).then(response => {
            console.log(this.temp.workNumber)
            console.log(response.data.data)
            if (response.data.data == 1) {
              this.$message({
                type: 'success',
                message: '工号已存在请重新输入!'
              })
              return
            } else {
              this.temp.orgName = this.receive
              console.log(this.temp.orgName)
              this.temp.orgCode = this.oldorgCode
              console.log(this.temp.orgName)
              console.log(this.temp.orgCode)
              createArticle(this.temp).then(response => {
                if (response.data.code == 200) {
                  this.listyst.unshift(this.temp)
                  this.getAA()
                  this.getapst()
                  this.dialogFormVisible = false
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
              })
              //  this.getAA()
              //  this.getapst()
            }
          })
        }
      })
    },
    // 编辑事件
    handleUpdate(row) {
      const id = row.id
      evaluate(id).then(response => {
        this.popTitle = response.data.data
        console.log(this.popTitle)
        this.receive = this.popTitle.orgName
        this.temp = Object.assign({}, this.popTitle)

        this.sendCustomer_options.splice(0)
        this.sendCustomer_options.push({
          value: this.temp.stationCode,
          label: this.popTitle.stationName
        })
      })
      //  console.log(this.popTitle)  orgFullName
      this.getstyl()
      this.siteCodeState = true
      this.receive = this.temp.orgName
      this.stationName = this.temp.stationName
      // console.log(this.stationName)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.getCustomer()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          console.log(tempData.stationCode)
          if (tempData.stationCode == '') {
            this.$notify({
              title: '错误',
              message: '必填项填完再提交',
              type: 'error',
              duration: 2000
            })
            return
          } else {
            updateArticle(tempData).then(response => {
              const msg = response.data.msg
              if (response.data.code == 200) {
                for (const v of this.listyst) {
                  if (v.id === this.temp.id) {
                    const index = this.listyst.indexOf(v)
                    this.listyst.splice(index, 1, this.temp)
                    break
                  }
                }
                this.dialogFormVisible = false
                // this.getAA()
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
        }
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
<style>
.fiutr{
  float: left;
}
.seat{
  margin-left:50px;
  padding-right:15px;
}
.seats{
     margin-top:10px;
     padding-right:15px;
}
.search{
    margin-left:70px;
}
.inline-input{
  width:200px;
}
.futiop{
text-decoration:underline
}
.Treebox{
    width:260px;
}
.formSearch {
  width: 100%;
  background: #fafafa;
  border: 1px solid #e9e9e9;
  border-radius: 3px;
  padding: 18px 10px 0;
  margin-bottom: 15px;
}
.el-tree-node__content:hover {
  background-color: #6dc6fa;
  border-radius:3%
} 
</style>
