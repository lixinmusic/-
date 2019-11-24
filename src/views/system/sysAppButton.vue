<template>
    <div class="app-container">
        <!--外部容器 -->
        <el-container>
            <!-- 内容容器 -->
            <el-container>
                <!-- 侧边栏容器 -->
                <el-aside style="border:1px solid #dcdfe6" width="18%">
                    <span style="margin-left:12%;">系统目录</span>
                    <el-tree :data="dataList" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
                </el-aside>
                <el-container>
                    <!-- 主要区域容器 -->
                    <el-main>
                        <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit" v-if="addShow">新增</el-button>
                        <el-table :key='tableKey' :data="list" row-key="id" height='200' v-loading="listLoading" border fit highlight-current-row style="width: 100%;margin-top:8px;min-height:500px" v-show="ok" :header-cell-style="{background:'oldlace'}">
                            <!-- 隐藏id列 -->
                            <el-table-column align="center" label="ID" v-if="false">
                                <template slot-scope="scope">
                                    <span>{{scope.row.id}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="按钮名称">
                                <template slot-scope="scope">
                                    <span>{{scope.row.buttonName}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="按钮编码">
                                <template slot-scope="scope">
                                    <span>{{scope.row.buttonCode}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column width="110px" align="center" label="是否启用">
                                <template slot-scope="scope">
                                    <span>{{scope.row.isEnable==1?'是':'否'}}</span>
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
                    <!-- 新增编辑弹出框 -->
                    <el-dialog :close-on-click-modal="false" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" v-dialogDrag v-loading='isLoading'>
                        <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="80px" style='width: 400px; margin-left:50px;'>
                            <el-form-item label="按钮名称" prop="buttonName">
                                <el-input v-model="temp.buttonName" maxlength="32"></el-input>
                            </el-form-item>
                            <el-form-item label="是否启用" prop="isEnable">
                                <el-radio v-model="temp.isEnable" label="1">是</el-radio>
                                <el-radio v-model="temp.isEnable" label="0">否</el-radio>
                            </el-form-item>
                            <el-form-item label="描述">
                                <el-input type="textarea" maxlength="128" v-model="temp.discription">
                                </el-input>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="dialogFormVisible = false">取消</el-button>
                            <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">提交</el-button>
                            <el-button v-else type="primary" @click="updateData">提交</el-button>
                        </div>
                    </el-dialog>
                </el-container>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import {fetchList,getMenusWeb,createArticle,deleteBtnById,updateArticle,filterWeb,changeOrderWeb} from "@/api/system/sysAppButton";
import { fetchButton } from "@/api/common/button";
import { menuList } from "@/store/modules/permission"; //按钮权限

export default {
    name: "sysAppButton",
    data() {
        return {
            addShow: false,
            editShow: false,
            deleteShow: false,
            visible2: false,
            isLoading: false, //弹窗加载
            radio: "1",
            sortable: null,
            dataList: null,
            defaultProps: {
                children: "childrens",
                label: "name"
            },
            // 控制表格是否显示
            ok: true,
            tableKey: 0,
            list: null,
            total: null,
            listLoading: true,
            listQuery: {
                name: undefined,
                id: undefined,
                title: undefined,
                type: "app"
            },
            menuCode1: "",
            // 时间控件
            temp: {
                buttonName: undefined,
                menuCode: undefined,
                url: "kaicom.cn",
                isEnable: "1",
                discription: undefined,
                // menuCode: undefined,
                type: "app"
            },
            // 弹框显示
            dialogFormVisible: false,
            popTitle: "",
            dialogStatus: "",
            textMap: {
                update: "编辑按钮",
                create: "新增按钮"
            },
            dialogPvVisible: false,
            pvData: [],
            rules: {
                buttonName: [
                    {
                        required: true,
                        message: "请输入菜单名称",
                        trigger: "change"
                    }
                ],
                // buttonCode: [{ required: true, message: '请输入菜单编码', trigger: 'change' }],
                url: [
                    { required: true, message: "请输入url", trigger: "change" }
                ],
                isEnable: [
                    {
                        required: true,
                        message: "请选择是否启用",
                        trigger: "change"
                    }
                ]
            },
            downloadLoading: false
        };
    },
    filters: {
        statusFilter(status) {
            const statusMap = {
                deleted: "danger"
            };
            return statusMap[status];
        }
    },
    created() {
        this.getList();
        this.getMenu();
        this.getButton();
    },
    methods: {
        getButton() {
            menuList.forEach(item => {
                item.children.forEach(e => {
                    if (e.name == "sysAppButton") {
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
        // 查询树状图
        getMenu() {
            getMenusWeb().then(response => {
                this.dataList = response.data.data;
                for (var i = 0; i < this.dataList.length; i++) {

                }
            });
        },
        handleNodeClick(data) {
            this.menuCode1 = data.code;
            const params = {
                menuCode: data.code,
                type: "app"
            };
            filterWeb(params).then(response => {
                this.list = response.data.data;
                for (var i = 0; i < this.list.length; i++) {
                    if (this.list[i].menuCode != "") {
                        this.menuCode = this.list[i].menuCode;
                    } else {
                        this.menuCode = "";
                    }
                }
            });
        },
        // 删除事件
        deleteBtn(row) {
            this.$confirm("是否确认删除?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    const params = {
                        buttonCode: row.buttonCode,
                        type: "app"
                    };
                    deleteBtnById(params).then(response => {
                        const index = this.list.indexOf(row);
                        this.list.splice(index, 1);
                    });
                    this.$message({
                        type: "success",
                        message: "删除成功!"
                    });
                    this.getList();
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        },

        getList() {
            this.listLoading = true;
            // 搜索框和树状图查询条件
            filterWeb(this.listQuery).then(response => {
                this.list = response.data.data;
                this.listLoading = false;
                setTimeout(() => {
                    this.listLoading = false;
                }, 1.5 * 10);
            });
        },

        // 搜索
        handleFilter() {
            this.listQuery.page = 1;
            this.getList();
        },
        handleSizeChange(val) {
            this.listQuery.limit = val;
            this.getList();
        },
        handleCurrentChange(val) {
            this.listQuery.page = val;
            this.getList();
        },
        resetTemp() {
            this.temp = {
                buttonName: undefined,
                url: "kaicom.cn",
                isEnable: "1",
                discription: undefined,
                menuCode: undefined,
                type: "app"
            };
        },

        // 新增事件
        handleCreate(data) {
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
                    this.isLoading = true;
                    this.temp.menuCode = this.menuCode1;
                    createArticle(this.temp).then(() => {
                        this.list.unshift(this.temp);
                        setTimeout(() => {
                            this.isLoading = false;
                        }, 1 * 500);
                        this.dialogFormVisible = false;
                        this.$notify({
                            title: "成功",
                            message: "添加成功",
                            type: "success",
                            duration: 2000
                        });
                        this.isLoading = false;
                    });
                }
            });
        },
        // 编辑事件
        handleUpdate(row) {
            this.temp = Object.assign({}, row);
            this.temp.isEnable = row.isEnable.toString();

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
                    this.temp.type = "app";
                    const tempData = Object.assign({}, this.temp);
                    updateArticle(tempData).then(() => {
                        for (const v of this.list) {
                            if (v.id === this.temp.id) {
                                const index = this.list.indexOf(v);
                                this.list.splice(index, 1, this.temp);
                                break;
                            }
                        }
                        this.getList();
                        setTimeout(() => {
                            this.isLoading = false;
                        }, 1 * 500);
                        this.dialogFormVisible = false;
                        this.$notify({
                            title: "成功",
                            message: "修改成功",
                            type: "success",
                            duration: 2000
                        });
                        this.isLoading = false;
                    });
                }
            });
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v =>
                filterVal.map(j => {
                    if (j === "timestamp") {
                        return parseTime(v[j]);
                    } else {
                        return v[j];
                    }
                })
            );
        }
    }
};
</script>
<style>
.sortable-ghost {
    opacity: 0.8;
    color: #fff !important;
    background: #42b983 !important;
}
.el-tree-node__content:hover {
    background-color: #6dc6fa;
    border-radius: 3%;
}
</style>

