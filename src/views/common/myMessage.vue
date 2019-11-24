<template>
  <div class='app-container'>
    <el-container>
      <div class="formSearch">
        <el-form :inline="true">
          <el-form-item label="标题：">
            <el-input class="filter-item input" v-model="listQuery.title">
            </el-input>
          </el-form-item>
          <el-form-item label="时间范围：">
            <el-date-picker
              v-model="value01"
              type="daterange"
              unlink-panels
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              clearable  @change="searchChange()">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button class="filter-item" type="primary" style="float:right"  icon="el-icon-search" @click="handleFilter">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-main style="padding:20px 30px;">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="未读消息" name="first">
            <span slot="label" v-if="flag1">未读消息
              <span class="red-point">&nbsp;{{total}}&nbsp;</span>
            </span>
            <el-table :data="needList" :show-header="false" height="500" style="width:91%;font-size:15px;" v-loading="listLoading">
              <el-table-column prop="title">
                <template slot-scope="scope">
                  <span class="look-detail" @click="messageDetail(scope.row)">{{scope.row.title}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.createTime}}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="已读消息" name="second">
            <span slot="label" v-if="!flag1">已读消息
              <span class="red-point">&nbsp;{{total}}&nbsp;</span>
            </span>
            <el-table :data="doneList" :show-header="false" height="500" style="width:91%;font-size:15px;" v-loading="listLoading">
              <el-table-column prop="title">
                <template slot-scope="scope">
                  <span class="look-detail" @click="messageDetail(scope.row)">{{scope.row.title}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.createTime}}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-main>
      <el-footer>
        <div class="pagination-container">
          <el-pagination background 
          @size-change="handleSizeChange" 
          @current-change="handleCurrentChange" 
          :current-page="listQuery.pageNum" 
          :page-sizes="[5,10,15, 20]" 
          :page-size="listQuery.pageSize" 
          layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </el-footer>
      <el-dialog :title="messageTitle" :close-on-click-modal="false" :visible.sync="centerDialogVisible" width="30%">
        <div>{{popData.messageContent}}</div>
        <span slot="footer" class="dialog-footer">
          <el-button v-if="flag" type="primary" @click="updateData()">知道了</el-button>
          <el-button type="primary" @click="centerDialogVisible=false">返回</el-button>
        </span>
      </el-dialog>
      <el-dialog :title="messageTitle" :close-on-click-modal="false" :visible.sync="formDialogVisible" width="30%">
        <div v-if="equipMessageContent.length>0" v-for="item in equipMessageContent" :key="item.remindId">
          <span>{{item.content}}</span>
        </div>
        <el-form :model="temp" label-position="left" label-width="110px">
          <el-row>
            <el-col :span="24">
              <el-form-item label="按要求交货" prop="isDelivery">
                <el-radio v-model="temp.isDelivery" label="1" @change="radioChange()">是</el-radio>
                <el-radio v-model="temp.isDelivery" label="0">否</el-radio>	
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="下次交货日期" prop="nextDeliveryDate">
                <el-date-picker style="width:100%"
                  v-model="temp.nextDeliveryDate"
                  type="date"
                  placeholder="选择时间"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                   :disabled="temp.isDelivery==1?true:false">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="处理结果" prop="processResult">
                <el-input type="textarea" maxlength="200" v-model="temp.processResult"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button v-if="flag" type="primary" @click="equipOK()">确认</el-button>
          <el-button type="primary" @click="formDialogVisible=false">返回</el-button>
        </span>
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
import { getMessageList, updateMessage, equipmessage, getMessageById } from '@/api/common/approvalMessages'
export default {
  name: 'myMessage',
  data() {
    return {
      flag: true,
      flag1: true,
      // 表格数据
      tableKey: 0,
      needList: [],
      doneList: [],
      listLoading: false,
      total: 0,
      value01: undefined,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        startDate: undefined,
        endDate: undefined,
        isRead: 0
      },
      activeName: 'first',
      centerDialogVisible: false,
      messageTitle: undefined,
      popData: {
        messageContent: undefined,
        id: undefined,
        isRead: 1, // 是否已读 0否1是
        messageId: undefined,
        sendeeId: undefined,
        sendeeName: undefined
      },
      formDialogVisible: false,
      equipMessageContent: [], // 设备到货超时消息
      temp: {
        id: undefined,
        messageId: undefined,
        userMessageId: undefined,
        isDelivery: '1',
        isRead: 1,
        nextDeliveryDate: undefined,
        processResult: undefined
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 日期搜索
    searchChange() {
      // 日期转换
      if (this.value01 == null) {
        this.listQuery.startDate = ''
        this.listQuery.endDate = ''
      } else {
        this.listQuery.startDate = this.value01[0]// 开始时间
        this.listQuery.endDate = this.value01[1]
      }
    },
    getList() {
      this.tableData = []
      this.listLoading = true
      getMessageList(this.listQuery).then(response => {
        if (response.data.code === 200) {
          if (response.data.data != null) {
            if (this.listQuery.isRead == 0) {
              this.needList = response.data.data.list
              this.total = response.data.data.total
            } else if (this.listQuery.isRead == 1) {
              this.doneList = response.data.data.list
              this.total = response.data.data.total
            }
          }
          setTimeout(() => {
            this.listLoading = false
          }, 1 * 500)
        } else {
          this.$notify({
            title: '警告',
            message: response.data.msg,
            type: 'warning',
            duration: 2000
          })
          this.listLoading = false
        }
      })
    },
    // 搜索
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    // 分页
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    },
    handleClick(tab, event) {
      this.total = 0
      if (tab.label == '已读消息') {
        this.listQuery = {
          pageNum: 1,
          pageSize: 10,
          title: undefined,
          startDate: undefined,
          endDate: undefined,
          isRead: 1
        }
        this.flag1 = false
        this.getList()
      } else if (tab.label == '未读消息') {
        this.listQuery = {
          pageNum: 1,
          pageSize: 10,
          title: undefined,
          startDate: undefined,
          endDate: undefined,
          isRead: 0
        }
        this.flag1 = true
        this.getList()
      }
    },
    messageDetail(row) {
      this.messageTitle = row.title
      if (row.messageType == 1) {
        this.popData.messageContent = row.content
        this.popData.id = row.id
        this.popData.messageId = row.messageId
        this.centerDialogVisible = true
      } else if (row.messageType == 2) {
        this.temp.messageId = row.messageId
        this.temp.userMessageId = row.id
        this.equipMessageContent = JSON.parse(row.content)
        this.temp.id = this.equipMessageContent[0].remindId
        if (row.isRead == 1) { // 已读状态
          const find = {
            id: this.temp.id
          }
          getMessageById(find).then(response => {
            if (response.data.code == 200) {
              this.temp = response.data.data
              this.temp.isDelivery = this.temp.isDelivery.toString()
              this.formDialogVisible = true
            } else {
              this.$notify({
                title: '警告',
                message: response.data.msg,
                type: 'warning',
                duration: 2000
              })
            }
          })
        }
        this.formDialogVisible = true
      }
      if (row.isRead == 0) {
        this.flag = true
      } else if (row.isRead == 1) {
        this.flag = false
      }
    },
    updateData() {
      updateMessage(this.popData).then(response => {
        if (response.data.code == 200) {
          this.centerDialogVisible = false
          this.getList()
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
    equipOK() {
      equipmessage(this.temp).then(response => {
        if (response.data.code == 200) {
          this.formDialogVisible = false
          this.getList()
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
    radioChange() {
      this.temp.nextDeliveryDate = undefined
    }
  }
}
</script>
<style scoped>
  .title-header {
    font-size: 20px;
    color: #409eff;
    margin: 20px 0;
    padding-bottom: 10px;
    border-bottom: 1px solid #ddd;
  }
  .look-detail:hover{
    font-size: 16px;
  }
  .formSearch {
    width: 100%;
    background: #fafafa;
    border: 1px solid #e9e9e9;
    border-radius: 3px;
    padding: 18px 10px 0;
  }
  .red-point{
    margin-left: 5px;
    background-color: red; 
    color:white;
    border-radius: 50%;
  }
</style>