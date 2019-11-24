<template>
  <div class="app-container">
    <!--外部容器 -->
    <el-container>
        <div class="filter-container">
            <div class="formSearch">
				<el-form :inline="true">
					<el-row>
						<el-col :span="6">
						<el-form-item label="固定资产编号">
						<el-input v-model="listQuery.fixedAssetCode"  placeholder="请输入固定资产编号" clearable></el-input>
						</el-form-item>
						</el-col>

						<el-col :span="6">
						<el-form-item label="设备名称">
						<el-input class="minier-input" v-model="listQuery.equipmentName" placeholder="请输入设备名称" clearable></el-input>
						</el-form-item>
						</el-col>

						<el-col :span="6">
						<el-form-item label="型号规格">
						<el-input class="minier-input" v-model="listQuery.model" placeholder="请输入型号规格" clearable></el-input>
						</el-form-item>
						</el-col>
						<el-col :span="5">
						<el-form-item label="供应商">
						<el-input class="minier-input" v-model="listQuery.buyers" placeholder="请输入供应商" clearable></el-input>
						</el-form-item>
						</el-col>
					</el-row>

					<el-row>
						<el-col :span="6">
							<el-form-item label="实际到厂时间">
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
									clearable  @change="startAndEndTime()">
									</el-date-picker>
								</div>
							</el-form-item>
						</el-col>

						<el-col :span="6">
							<el-form-item label="维修设备验收记录单要求完成时间">
								<div class="block">
									<el-date-picker
									style="width:230px"
									v-model="weekdates"
									type="daterange"
									unlink-panels
									start-placeholder="开始日期"
									end-placeholder="结束日期"
									format="yyyy-MM-dd"
									value-format="yyyy-MM-dd"
									clearable @change="startAndEndTime()">
									</el-date-picker>
								</div>
							</el-form-item>
						</el-col>

						<el-col :span="6" style="margin-top:2px">
							<el-form-item label="维修验收完成情况" v-model="listQuery.status">
								<el-radio-group v-model="listQuery.status">
									<el-radio :label=1>完成</el-radio>
									<el-radio :label=2>未完成</el-radio>
								</el-radio-group>
							</el-form-item>
						</el-col>
						<el-col :span="6" style="margin-top:15px">
							<el-form-item>
								<el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
            </div>
        </div>
     
          <!-- 主要区域容器 -->
        <el-main style="padding:20px 0px">
            <el-button class="filter-item" @click="exportList" type="primary" icon="el-icon-edit" v-if="exportShow">导出</el-button>

            <el-table :data="listData" v-loading="listLoading" border fit highlight-current-row
              style="width: 100%;min-height:auto;margin-top:8px" height="500" :header-cell-style="{background:'oldlace'}">
                 <el-table-column  align="center" label="序号" min-width="80" type="index"></el-table-column>

               	<el-table-column align="center" label="固定资产编号" min-width="100">
					<template slot-scope="scope">
						<span>{{scope.row.fixedAssetCode}}</span>
					</template>
                </el-table-column>

                <el-table-column align="center" label="使用公司" min-width="80">
					<template slot-scope="scope">
						<span>{{scope.row.companyName}}</span>
					</template>
                </el-table-column>

              	<el-table-column align="center" label="使用工厂" min-width="80">
					<template slot-scope="scope">
						<span>{{scope.row.factoryName}}</span>
					</template>
                </el-table-column>

               	<el-table-column align="center" label="使用部门" min-width="80">
					<template slot-scope="scope">
						<span>{{scope.row.divisionName}}</span>
					</template>
                </el-table-column>

               	<el-table-column align="center" label="合同编号" min-width="80">
					<template slot-scope="scope">
						<span>{{scope.row.contractNumber}}</span>
					</template>
                </el-table-column>

                <el-table-column align="center" label="供应商" min-width="80">
					<template slot-scope="scope">
						<span>{{scope.row.buyers}}</span>
					</template>
                </el-table-column>

                <el-table-column align="center" label="设备名称" min-width="80">
					<template slot-scope="scope">
						<span>{{scope.row.equipmentName}}</span>
					</template>
                </el-table-column>

                <el-table-column align="center" label="型号规格" min-width="80">
					<template slot-scope="scope">
						<span>{{scope.row.model}}</span>
					</template>
                </el-table-column>

                <el-table-column align="center" label="实际到厂时间（入库时间）" min-width="150">
					<template slot-scope="scope">
						<span>{{scope.row.unpackingDate}}</span>
					</template>
                </el-table-column>

                <el-table-column align="center" label="维修设备验收记录单要求完成时间" min-width="150">
					<template slot-scope="scope">
						<span>{{scope.row.requestTime}}</span>
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
				:page-sizes="[5,10,15,20]" 
				:page-size="listQuery.pageSize" 
				layout="total, sizes, prev, pager, next, jumper" 
				:total="total">
				</el-pagination>
            </div>
          </el-footer>
    </el-container>
  </div>
</template>

<script>
import { fetchList, exportList } from "@/api/maintenanceAcceptancePlan/maintenanceEquipThreeMonthPlan";
import waves from "@/directive/waves"; // 水波纹指令
import { fetchButton } from "@/api/common/button";
import { menuList } from '@/store/modules/permission'//按钮权限
export default {
	name: "index",
	directives: {
		waves
	},
	data() {
		return {
			listData: [],
			total: null,
			listQuery: {
				pageNum: 1,
				pageSize: 10,
				buyers: "",
				equipmentName: "",
				fixedAssetCode: "",
				status: "",
				model: "",
				realTimeEnd: "",
				realTimeUp: "",
				requestTimeEnd: "",
				requestTimeUp: ""
			},
			value13: [], // 新设备1周试用评价实际完成时间
			weekdates: [], // 新设备3个月试用评价要求完成时间
			listQu:{
                buyers: "",
				equipmentName: "",
				fixedAssetCode: "",
				status: "",
				model: "",
				realTimeEnd: "",
				realTimeUp: "",
				requestTimeEnd: "",
				requestTimeUp: ""
			},

			listLoading: true, 
			dialogFormVisible: false,
			dialogStatus: "",
			exportShow: false,
			downloadLoading: false
		};
	},

	created() {
		this.getList();
		this.getButton()
	},

	methods: {
		// 判断按钮权限
		getButton() {
			menuList.forEach(item => {
				item.children.forEach(e=>{
				if(e.name == "maintenanceEquipThreeMonthPlan"){
					this.menuCode = e.code
				}
				})
			})
			const params = {
				menuCode: this.menuCode,
				type: 'web'
			}
			fetchButton(params).then(response => {
				if (response.data.code == 200) {
				const getBtns = response.data.data
				for (var i = 0; i < getBtns.length; i++) {
					if (getBtns[i].buttonName == '导出') {
						this.exportShow = true
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
		},
		//加载表格
		getList() {
			this.listLoading = true;
			fetchList(this.listQuery).then(response => {
				this.listData = response.data.data.list
				this.total = response.data.data.total
				setTimeout(() => {
					this.listLoading = false;
				}, 1 * 1000);
			})
		},

		// 导出
		exportList() {
			    this.listQu.buyers = this.listQuery.buyers
				this.listQu.equipmentName = this.listQuery.equipmentName
				this.listQu.fixedAssetCode = this.listQuery.fixedAssetCode
				this.listQu.model = this.listQuery.model
				this.listQu.realTimeEnd = this.listQuery.realTimeEnd
				this.listQu.realTimeUp = this.listQuery.realTimeUp
				this.listQu.requestTimeEnd = this.listQuery.requestTimeEnd
				this.listQu.requestTimeUp = this.listQuery.requestTimeUp
				this.listQu.status = this.listQuery.status
			exportList(this.listQu).then(response => {
				if (response.data.code == 200) {
					const exportData = response.data.data;
					window.location.href = exportData;
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
			});
		},
		//新设备1周试用评价实际完成时间   新设备3个月试用评价要求完成时间
		startAndEndTime() {
			if (this.value13 == null) {
				this.listQuery.realTimeUp = "";
				this.listQuery.realTimeEnd = "";
			} else {
				this.listQuery.realTimeUp = this.value13[0]; 
				this.listQuery.realTimeEnd = this.value13[1];
			}
			if (this.weekdates == null) {
				this.listQuery.requestTimeUp = "";
				this.listQuery.requestTimeEnd = "";
			} else {
				this.listQuery.requestTimeUp = this.weekdates[0]; 
				this.listQuery.requestTimeEnd = this.weekdates[1];
			}
		},

		// 搜索
		handleFilter() {
			this.listQuery.pageNum = 1;
			this.getList();
		},
		handleSizeChange(val) {
			this.listQuery.pageSize = val;
			this.getList();
		},
		handleCurrentChange(val) {
			this.listQuery.pageNum = val;
			this.getList();
		},

	}
};
</script>
<style scoped>
.formSearch {
	width: 100%;
	background: #fafafa;
	border: 1px solid #e9e9e9;
	border-radius: 3px;
	padding: 18px 10px 0;
	margin-bottom: 15px;
}
</style>
