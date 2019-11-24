<template>
    <div class='app-container'>
        <el-container>
            <el-header>
                <div class="formSearch">
                    <el-form :inline="true">
                        <el-form-item label="选择单据">
                            <el-select v-model="listQuery.documentWordType" style="margin:0 20px;" placeholder="请选择" clearable>
                                <el-option v-for="item in optionsSec" :key="item.wordName" :label="item.documentWordType" :value="item.wordName">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="所属组织">
                            <el-select v-model="listQuery.orgCode" collapse-tags style="margin-left: 20px;" placeholder="请选择" clearable>
                                <el-option v-for="item in options" :key="item.orgCode" :label="item.orgFullName" :value="item.orgCode">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button class="filter-item" type="primary" style="float:right" icon="el-icon-search" @click="handleFilter">搜索</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-header>
            <el-main>
                <el-button class="filter-item" style="margin: 10px;" @click="handleCreate" type="primary" v-if="addShow">新增编码规则</el-button>
                <el-button class="filter-item" style="margin: 10px;" @click="refresh" type="primary">刷新</el-button>
                <el-table :key='tableKey' :data="tableData" height="200" row-key="id" v-loading="listLoading" border fit style="width: 100%;margin-top:15px;min-height:500px" :header-cell-style="{background:'oldlace'}">
                    <el-table-column prop="codePrefixOne" align="center" label="编码前缀1">
                        <template slot-scope="scope">
                            <span>{{scope.row.codePrefixOne}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="codePrefixTwo" align="center" label="编码前缀2">
                        <template slot-scope="scope">
                            <span>{{scope.row.codePrefixTwo}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="format" align="center" label="格式">
                        <template slot-scope="scope">
                            <span>{{scope.row.format}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="orderNumber" align="center" label="顺序号位数">
                        <template slot-scope="scope">
                            <span>{{scope.row.orderNumber}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="codeExample" align="center" label="编码示例">
                        <template slot-scope="scope">
                            <span>{{scope.row.codeExample}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="documentWordType" align="center" label="选择单据">
                        <template slot-scope="scope">
                            <span>{{scope.row.documentWordType}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="orgName" align="center" label="所属组织">
                        <template slot-scope="scope">
                            <span>{{scope.row.orgName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作">
                        <template slot-scope="scope">
                            <el-button title="编辑" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-if="editShow"></el-button>
                            <el-button title="删除" type="danger" icon="el-icon-delete" size="mini" @click="deleteBtn(scope.row)" v-if="deleteShow"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-main>
            <el-footer>
                <div class="pagination-container">
                    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[5,10,15, 20]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                    </el-pagination>
                </div>
            </el-footer>
            <el-dialog :close-on-click-modal="false" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" v-dialogDrag v-loading='isLoading'>
                <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>
                    <el-form-item label="编码前缀1" prop="codePrefixOne">
                        <el-input v-model="temp.codePrefixOne" maxlength="6"></el-input>
                    </el-form-item>
                    <el-form-item label="编码前缀2" prop="codePrefixTwo">
                        <el-input v-model="temp.codePrefixTwo" maxlength="6" oninput="value=value.replace(/[^A-Z]+$/,'');"></el-input>
                    </el-form-item>

                    <el-form-item label="格式" prop="format">
                        <el-radio label="YYYY-MM-DD" v-model="temp.format" style="margin-top:8px">YYYY-MM-DD</el-radio><br>
                        <el-radio label="YYYY-MM" v-model="temp.format" style="margin-top:8px">YYYY-MM</el-radio><br>
                        <el-radio label="MM-DD" v-model="temp.format" style="margin-top:8px">MM-DD</el-radio><br>
                        <el-radio label="YYYY" v-model="temp.format" style="margin-top:8px">YYYY</el-radio>
                    </el-form-item>
                    <el-form-item label="顺序号位数" prop="orderNumber">
                        <el-select v-model="temp.orderNumber" placeholder="请选择">
                            <el-option v-for="item in orderNumbers" :key="item.value" :label="item.orderNumber" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="编码示例" prop="codeExample">
                        <label>前缀1+前缀2格式+顺序号</label><br>
                        <label>示例：</label>
                        <span style="margin-left:10px;">{{codeEx.codeExample}}</span>
                    </el-form-item>
                    <el-form-item label="选择单据" prop="documentWordType">
                        <el-select v-model="temp.documentWordType" placeholder="请选择">
                            <el-option v-for="item in optionsSec" :key="item.wordName" :label="item.wordName" :value="item.wordName">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属组织" prop="orgCode">
                        <span style="margin-left:20px;color:red" prop='getOrgFullName'>{{getOrgFullName}}</span>
                        <el-tree :data="dataList" v-model='orgFullName' :props="defaultProps" node-key='orgFullName' :default-expanded-keys="expandedData" :default-checked-keys="checkedData" @node-click="handleNodeClick"></el-tree>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取消</el-button>
                    <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">提交</el-button>
                    <el-button v-else type="primary" @click="updateData">提交</el-button>
                </div>
            </el-dialog>
        </el-container>
    </div>
</template>

<script>
import { fetchList, fetchCompany, fetchReceipt, getOrgTree, delById, createArticle, getDetail, updateArticle} from "@/api/baseInfo/baseReceiptCode";
import { validateUpperCase } from "@/utils/validate";
import { fetchButton } from "@/api/common/button";
import { menuList } from "@/store/modules/permission"; //按钮权限
export default {
    name: "baseReceiptCode",
    data() {
        var codePrefix = (rule, value, callback) => {
            if (!validateUpperCase(value)) {
                callback(new Error("请输入编码前缀1"));
            } else {
                callback();
            }
        };
        return {
            addShow: false,
            editShow: false,
            deleteShow: false,
            isLoading: false, //加载弹窗
            // 所属组织树
            dataList: [],
            defaultProps: {
                children: "children",
                label: "orgFullName"
            },
            radio: "1",
            // 顺序号位数
            orderNumbers: [
                {
                    value: 1,
                    orderNumber: "1"
                },
                {
                    value: 2,
                    orderNumber: "2"
                },
                {
                    value: 3,
                    orderNumber: "3"
                },
                {
                    value: 4,
                    orderNumber: "4"
                },
                {
                    value: 5,
                    orderNumber: "5"
                },
                {
                    value: 6,
                    orderNumber: "6"
                }
            ],
            tableData: [],
            codeEx: [],
            // 选择单据
            optionsSec: null,
            wordName: [],
            // 所属组织树默认展开
            expandedData: null,
            checkedData: null,
            options: null,
            orgFullName: [],
            getOrgFullName: "",
            getOrgCode: "",
            // 获取编码示例
            getCodeExample: "",
            tableKey: 0,
            listLoading: false,
            total: null,
            listQuery: {
                pageNum: 1,
                pageSize: 10,
                orgCode: undefined,
                documentWordType: undefined
            },
            temp: {
                codePrefixOne: undefined,
                codePrefixTwo: undefined,
                documentWordType: undefined,
                format: "YYYY-MM-DD",
                orderNumber: undefined,
                orgCode: undefined,
                orgFullName: undefined,
                oldDocumentWordType: undefined,
                oldOrgCode: undefined,
                getOrgFullName: undefined,
                getOrgCode: undefined
            },
            dialogFormVisible: false,
            popTitle: "",
            dialogStatus: "",
            textMap: {
                update: "修改单据编码规则",
                create: "新增单据编码规则"
            },
            rules: {
                codePrefixOne: [{ required: true, validator: codePrefix, trigger: "change" }],
                format: [{ required: true, message: "请选择格式", trigger: "change" }],
                orderNumber: [{ required: true, message: "请输入顺序号位数", trigger: "change"}],
                documentWordType: [{ required: true, message: "请选择单据", trigger: "change" }]
            },
            downloadLoading: false
        };
    },
    created() {
        this.getList();
        this.getOrg();
        this.getTree();
        this.getWordName();
        this.getButton();
    },
    mounted() {},
    methods: {
        getButton() {
            menuList.forEach(item => {
                item.children.forEach(e => {
                    if (e.name == "baseReceiptCode") {
                        this.menuCode = e.code;
                    }
                });
            });
            const params = {
                menuCode: this.menuCode,
                type: "web"
            };
            fetchButton(params).then(response => {
                if (response.data.code == 200) {
                    const getBtns = response.data.data;
                    for (var i = 0; i < getBtns.length; i++) {
                        if (getBtns[i].buttonName == "新增") {
                            this.addShow = true;
                        } else if (getBtns[i].buttonName == "编辑") {
                            this.editShow = true;
                        } else if (getBtns[i].buttonName == "删除") {
                            this.deleteShow = true;
                        }
                    }
                } else {
                    this.$notify({
                        title: "警告",
                        message: response.data.msg,
                        type: "warning",
                        duration: 2000
                    });
                }
            });
        },
        getList() {
            this.listLoading = true;
            fetchList(this.listQuery).then(response => {
                if (response.data.code === 200) {
                    this.tableData = response.data.data.list;
                    this.total = response.data.data.total;
                    setTimeout(() => {
                        this.listLoading = false;
                    }, 1 * 500);
                } else {
                    this.$notify({
                        title: "警告",
                        message: response.data.msg,
                        type: "warning",
                        duration: 3000
                    });
                }
            });
        },
        // 新增页面 所属组织树状图
        getTree() {
            this.dataList = [];
            getOrgTree().then(response => {
                this.dataList.push(response.data.data);
            });
        },
        handleNodeClick(data) {
            this.getOrgFullName = data.orgFullName;
            this.getOrgCode = data.orgCode;
        },
        // 查询公司列表信息 所属组织下拉框
        getOrg() {
            fetchCompany().then(response => {
                this.options = response.data.data;
            });
        },
        // 选择单据下拉框
        getWordName() {
            fetchReceipt().then(response => {
                this.optionsSec = response.data.data;
            });
        },
        // 搜索
        handleFilter() {
            this.listQuery.pageNum = 1;
            this.getList();
        },
        // 刷新
        refresh() {
            this.listQuery.documentWordType = "";
            this.listQuery.orgCode = "";
            this.getList();
        },
        // 分页
        handleSizeChange(val) {
            this.listQuery.pageSize = val;
            this.getList();
        },
        handleCurrentChange(val) {
            this.listQuery.pageNum = val;
            this.getList();
        },
        resetTemp() {
            this.temp = {
                codeExample: undefined,
                codePrefixOne: undefined,
                codePrefixTwo: undefined,
                documentWordType: undefined,
                format: "YYYY-MM-DD",
                orderNumber: undefined,
                orgCode: undefined,
                orgFullName: undefined,
                getOrgFullName: undefined,
                getOrgCode: undefined
            };
            this.getOrgFullName = "";
            this.codeEx.codeExample = "";
        },
        // 新增
        handleCreate() {
            this.getTree();
            this.resetTemp();
            this.dialogStatus = "create";
            this.dialogFormVisible = true;
            this.$nextTick(() => {
                this.$refs["dataForm"].clearValidate();
            });
        },
        createData() {
            this.$refs["dataForm"].validate(valid => {
                if (valid) {
                    this.temp.orgCode = this.getOrgCode;
                    this.temp.orgFullName = this.getOrgFullName;
                    if (this.temp.orgFullName == "") {
                        this.$message({
                            title: "提示",
                            message: "请选择所属组织",
                            type: "warning",
                            duration: 3000
                        });
                    } else {
                        this.isLoading = true;
                        createArticle(this.temp).then(response => {
                            if (response.data.code == 200) {
                                this.tableData.unshift(this.temp);
                                this.dialogFormVisible = false;
                                this.getList();
                                setTimeout(() => {
                                    this.isLoading = false;
                                }, 1 * 500);
                                this.$message({
                                    title: "成功",
                                    message: "添加成功",
                                    type: "success",
                                    duration: 2000
                                });
                            } else {
                                this.$notify({
                                    title: "警告",
                                    message: response.data.msg,
                                    type: "warning",
                                    duration: 3000
                                });
                                this.isLoading = false;
                            }
                        });
                    }
                }
            });
        },
        // 编辑
        handleUpdate(row) {
            this.getTree();
            const id = row.id;
            getDetail(id).then(response => {
                this.codeEx = response.data.data;
                this.getOrgFullName = response.data.data.orgName;
                this.getOrgCode = response.data.data.orgCode;
                this.documentWordType = response.data.data.documentWordType;
                this.oldOrgCode = response.data.data.orgCode;
                this.oldDocumentWordType = response.data.data.documentWordType;
            });
            this.temp.orgName = this.getOrgFullName;
            this.temp.codeExample = this.codeEx.codeExample;
            this.temp = Object.assign({}, row);
            this.temp.format = row.format;
            this.dialogStatus = "update";
            this.dialogFormVisible = true;
            this.$nextTick(() => {
                this.$refs["dataForm"].clearValidate();
            });
        },
        updateData() {
            this.$refs["dataForm"].validate(valid => {
                if (valid) {
                    this.isLoading = true;
                    this.temp.orgCode = this.getOrgCode;
                    this.temp.orgFullName = this.getOrgFullName;
                    this.temp.oldDocumentWordType = this.oldDocumentWordType;
                    this.temp.oldOrgCode = this.oldOrgCode;
                    const tempData = Object.assign({}, this.temp);
                    updateArticle(tempData).then(response => {
                        if (response.data.code == 200) {
                            for (const v of this.tableData) {
                                if (v.id === this.temp.id) {
                                    const index = this.tableData.indexOf(v);
                                    this.tableData.splice(index, 1, this.temp);
                                    break;
                                }
                            }
                            this.dialogFormVisible = false;
                            this.getList();
                            setTimeout(() => {
                                this.isLoading = false;
                            }, 1 * 500);
                            this.$message({
                                title: "成功",
                                message: "修改成功",
                                type: "success",
                                duration: 2000
                            });
                        } else {
                            this.$notify({
                                title: "警告",
                                message: response.data.msg,
                                type: "warning",
                                duration: 3000
                            });
                            this.isLoading = false;
                        }
                    });
                }
            });
        },
        // 删除
        deleteBtn(row) {
            this.$confirm("是否确认删除?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    const id = row.id;
                    delById(id).then(response => {
                        if (response.data.code === 200) {
                            const index = this.tableData.indexOf(row);
                            this.tableData.splice(index, 1);
                            this.$message({
                                title: "成功",
                                type: "success",
                                message: "删除成功!",
                                duration: 3000
                            });
                            this.getList();
                        } else {
                            this.$notify({
                                title: "警告",
                                message: response.data.msg,
                                type: "warning",
                                duration: 3000
                            });
                        }
                    });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        }
    }
};
</script>
<style>
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
    border-radius: 3%;
}
</style>

