<template>
  <div class="app-container">
    <!--外部容器 -->
    <el-container>
      <el-aside style="border:1px solid #f0f0f0;padding-top:20px;" width="230px">
        <el-tree :data="equipData" ref="tree" node-key="addressCode"
          :props="defaultProps" 
          check-strictly
          @node-click="handleNodeClick"
          :render-content="renderContent">
        </el-tree>
      </el-aside>
      <!-- 内容容器 -->
      <el-container>
         <el-header style="height:90px;">
              <div class="formSearch">
              <el-form :inline="true">
               <el-form-item label="日期">
                <el-input class="minier-input" placeholder="" clearable></el-input>
                </el-form-item>
              
                <el-form-item label="日期">
                <el-input class="minier-input"  placeholder="" clearable></el-input>
                </el-form-item>

                <el-form-item>
                <el-button class="filter-item" type="primary" icon="el-icon-search">查询</el-button>
                </el-form-item>

              </el-form>
          </div>
        </el-header> 
        <!-- 主要区域容器 -->
        <el-main style="padding-top:0px;" v-if="tableShow">
          <el-table :key='tableKey' :data="listData" height='200' v-loading="listLoading" border fit highlight-current-row
            style="width:100%;min-height:500px;margin-top:8px" :header-cell-style="{background:'oldlace'}">>
            <el-table-column align="center" label="地址名称" min-width="50">
              <template slot-scope="scope">
                <span>{{scope.row.addressName}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="地址编码" min-width="50">
              <template slot-scope="scope">
                <span>{{scope.row.addressCode}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="上级名称" min-width="50">
              <template slot-scope="scope">
                <span>{{scope.row.parentAddressName}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="备注" min-width="60">
              <template slot-scope="scope">
                <span>{{scope.row.remark}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" min-width="180">
              <template slot-scope="scope">
                <el-button title="时序图" type="primary" size="mini">时序图</el-button>
                <el-button title="状态时长统计图" type="danger" size="mini">状态时长统计图</el-button>
                <el-button title="状态占比图" type="success" size="mini">状态占比图</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
        <!-- 第二个表格 -->
        <el-main style="padding-top:0px;" v-if="!tableShow">
          <el-table :key='tableKey' :data="listData" height='200' v-loading="listLoading" border fit highlight-current-row
            style="width:100%;min-height:500px;margin-top:8px" :header-cell-style="{background:'oldlace'}">>
            <el-table-column align="center" label="地址名称1" min-width="186">
              <template slot-scope="scope">
                <span>{{scope.row.addressName}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="地址编码2" min-width="80%">
              <template slot-scope="scope">
                <span>{{scope.row.addressCode}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="上级名称3" min-width="80%">
              <template slot-scope="scope">
                <span>{{scope.row.parentAddressName}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="备注4" min-width="80%">
              <template slot-scope="scope">
                <span>{{scope.row.remark}}</span>
              </template>
            </el-table-column>
           <!--  <el-table-column align="center" label="操作5" min-width="180">
              <template slot-scope="scope">
                <el-button title="时序图" type="primary" size="mini">时序图</el-button>
                <el-button title="状态时长统计图" type="danger" size="mini">状态时长统计图</el-button>
                <el-button title="状态占比图" type="success" size="mini">状态占比图</el-button>
              </template>
            </el-table-column> -->
          </el-table>
        </el-main>
       
      </el-container>
    </el-container>
  
  </div>
</template>

<script>
import { fetchTree, fetchListByCode, fetchDetail } from '@/api/baseInfo/baseEquipAddress'
import { fetchButton } from '@/api/common/button'
import waves from '@/directive/waves' // 水波纹指令
import { menuList } from '@/store/modules/permission'// 按钮权限

export default {
  name: 'equipmentHistory',
  directives: {
    waves
  },
  data() {
    return {
      tableShow:true,
      // 按钮是否显示
      addShow: false,
      editShow: false,
      deleteShow: false,
      // 设备地址树结构
      equipData: [],
      defaultProps: {
        children: 'children',
        label: 'addressName'
      },
      // 设备地址选中状态改变时
      i: 0,
      // 设备地址编码是否可输
      isDisable: false,
      isChecked: false,
      // 表格初始数据
      tableKey: 0,
      listData: null,
      listLoading: false,
      // 父级地址编码
      parCode: 'sbdzqy',
      parName: '设备地址区域',
      // 弹出框表单数据
      popData: {
        id: undefined,
        addressName: undefined,
        addressCode: undefined,
        parentAddressCode: undefined,
        remark: undefined,
        isEnd: '0'
      },
    
      // 设备地址树被选中节点
      treeData: null,
     
    }
  },
  created() {
    this.getButton()
    this.getTree()
    this.getList(this.parCode)
  },
  methods: {
    renderContent(h, { node, data, store }) {
      return (
        <span>
          <span title={node.label}>{node.label}</span>
        </span>)
    },
    // 查询按钮信息
    getButton() {
      menuList.forEach(item => {
        item.children.forEach(e => {
          if (e.name == 'baseEquipAddress') {
            this.menuCode = e.code
          }
        })
      })
      const params = {
        menuCode: this.menuCode,
        type: 'web'
      }
      fetchButton(params).then(response => {
        if (response.data.code === 200) {
          const buttons = response.data.data
          for (var i = 0; i < buttons.length; i++) {
            if (buttons[i].buttonName == '新增') {
              this.addShow = true
            } else if (buttons[i].buttonName == '编辑') {
              this.editShow = true
            } else if (buttons[i].buttonName == '删除') {
              this.deleteShow = true
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
    // 请求设备地址树
    getTree() {
      fetchTree().then(response => {
        this.equipData = []
        this.equipData.push(response.data.data[0])
        
      })
    },
    // 点击设备地址请求表格
    handleNodeClick(data) {
        console.log(data)
        console.log(data.isEnd)
      this.parCode = data.addressCode
      this.parName = data.addressName
      if(data.isEnd==0){
          this.tableShow = true
           this.getList()
      }else if(data.isEnd==1){
          this.tableShow = false
      }
    //   this.getList(this.parCode)
    },
    // 表格加载
    getList(parCode) {
      this.listLoading = true
      fetchListByCode(parCode).then(response => {
        if (response.data.code === 200) {
          this.listData = response.data.data
          setTimeout(() => {
            this.listLoading = false
          }, 1 * 500)
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
    // 获取设备地址树被选择的节点
    getCheckedNodes() {
      this.treeData = this.$refs.tree.getCheckedNodes()
      if (this.treeData[0] == undefined) {
        return
      }
      this.popData.parentAddressCode = this.treeData[0].addressCode
      this.popData.parentAddressName = this.treeData[0].addressName
      if (this.treeData[0].addressName == '设备地址区域') {
        this.popData.parentAddressName = '-'
      }
    }








    
  }
}
</script>

<style>
.title-header {
    font-size: 16px;
    color: #409eff;
    padding: 8px;
    border-bottom: 1px solid #ddd;
}
.formSearch {
    width:100%;
    background:#fafafa;
    border: 1px solid #e9e9e9;
    border-radius: 3px;
    padding: 18px 10px 0;
    margin-bottom: 10px;
}
.drag-handler{
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.el-tree-node__content:hover {
  background-color: #6dc6fa;
  border-radius:3%
} 
.el-tree{
  width: 260px;
}
</style>
