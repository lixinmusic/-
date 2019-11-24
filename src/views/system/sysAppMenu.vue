<template>
    <div class="app-container">
        <!--外部容器 -->
        <el-container>
            <!-- 顶部搜索 -->
            <el-header style="margin-bottom:30px;padding:0">
                <div class="formSearch">
                    <el-form :inline="true">
                        <el-form-item label="菜单名称">
                            <el-input class="filter-item input" placeholder="请输入菜单名称" maxlength="32" v-model="listQuery.name">
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button class="filter-item button" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-header>
            <!-- 内容容器 -->
            <el-container>
                <!-- 侧边栏容器 -->
                <el-aside style="border:1px solid #dcdfe6;" width="23%">
                    <span style="margin-left:20%;">系统目录</span>
                    <el-tree :data="dataList" ref="tree" node-key="code" show-checkbox :props="defaultProps" check-strictly @node-click="handleNodeClick" @check-change="handleClick"> ></el-tree>
                </el-aside>
                <el-container>
                    <!-- 主要区域容器 -->
                    <el-main>
                        <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit" v-if="addShow">新增</el-button>
                        <el-button class="filter-item" style="margin-left: 10px;" @click="dragFinish" type="primary" v-if='dragShow'>拖拽完成</el-button>
                        <el-table :key='tableKey' :data="list" row-key="id" height='200' v-loading="listLoading" border fit highlight-current-row style="width: 100%;margin-top:8px;min-height:500px" v-show="ok" :header-cell-style="{background:'oldlace'}">
                            <!-- 隐藏id列 -->
                            <el-table-column align="center" label="ID" v-if="false">
                                <template slot-scope="scope">
                                    <span>{{scope.row.id}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="菜单名称">
                                <template slot-scope="scope">
                                    <span>{{scope.row.menuName}}</span>
                                </template>
                            </el-table-column>
                            <!-- <el-table-column align="center" label="菜单编码">
                                <template slot-scope="scope">
                                    <span>{{scope.row.menuCode}}</span>
                                </template>
                            </el-table-column> -->
                            <el-table-column width="150px" align="center" label="url">
                                <template slot-scope="scope">
                                    <span>{{scope.row.url}}</span>
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
                    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false" v-dialogDrag>
                        <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="80px" style='width: 400px; margin-left:50px;'>
                            <el-form-item label="菜单名称" prop="menuName">
                                <el-input v-model="temp.menuName" maxlength="32"></el-input>
                            </el-form-item>
                            <el-form-item label="url" prop="url">
                                <el-input v-model="temp.url" maxlength="64"></el-input>
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
import {fetchList,getMenusWeb,createArticleWeb,deleteBtnById,updateArticleWeb,filterWeb,changeOrderWeb} from "@/api/system/sysAppMenu";
import { fetchButton } from "@/api/common/button";
import Sortable from "sortablejs"; // 拖拽
import { menuList } from "@/store/modules/permission"; //按钮权限

export default {
    name: "sysAppMenu",
    data() {
        return {
            i: 0,
            // isShow:false,
            sortable: null,
            oldList: [],
            newList: [],
            oldMenuList: [],
            newMenuList: [],

            visible2: false,
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
                // page: 1,
                // limit: 10,
                name: undefined,
                id: undefined,
                title: undefined,
                type: undefined
            },
            dragShow: false,
            addShow: false,
            editShow: false,
            deleteShow: false,
            // 时间控件
            temp: {
                id: undefined,
                remark: "",
                timestamp: new Date(),
                title: "",
                name: undefined,
                isEnable: "1",
                requestMethod: undefined
            },
            // 菜单编码数组
            menuCodeList: "",
            sty: ["menuCode"],
            // 弹框显示
            dialogFormVisible: false,
            popTitle: "",
            dialogStatus: "",
            textMap: {
                update: "编辑菜单",
                create: "新增菜单"
            },
            dialogPvVisible: false,
            pvData: [],
            rules: {
                menuName: [
                    {
                        required: true,
                        message: "请输入菜单名称",
                        trigger: "change"
                    }
                ],
                menuCode: [
                    {
                        required: true,
                        message: "请输入菜单编码",
                        trigger: "change"
                    }
                ],
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
        // 判断按钮权限
        getButton() {
            menuList.forEach(item => {
                item.children.forEach(e => {
                    if (e.name == "sysAppMenu") {
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
                        } else if (getBtns[i].buttonName == "拖拽完成") {
                            this.dragShow = false;
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
                this.dataList = null;
                // this.dataList.push(response.data.data)
                this.dataList = response.data.data;
            });
        },

        handleNodeClick(data) {
            this.dragShow = true;
            this.menuCodeList = [];
            const params = {
                fCode: data.code
                // name:data.name,
                // id:data.id
            };
            filterWeb(params).then(response => {
                this.list = response.data.data;
                this.oldList = this.list.map(v => v.id);
                this.newList = this.oldList.slice();
                this.oldMenuList = this.list.map(v => v.menuCode);
                this.newMenuList = this.oldMenuList.slice();

                this.$nextTick(() => {
                    this.setSort();
                });
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
                        id: row.id
                    };
                    deleteBtnById(params).then(response => {
                        const index = this.list.indexOf(row);
                        this.list.splice(index, 1);
                        this.getMenu();
                    });
                    this.$message({
                        type: "success",
                        message: "删除成功!"
                    });
                    this.getMenu();
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        },

        getList() {
            this.dragShow = false;
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

        // 拖拽
        setSort() {
            const el = document.querySelectorAll(
                ".el-table__body-wrapper > table > tbody"
            )[0];
            this.sortable = Sortable.create(el, {
                ghostClass: "sortable-ghost",
                setData: function(dataTransfer) {
                    dataTransfer.setData("Text", "");
                },
                onEnd: evt => {
                    const tempIndex = this.newList.splice(evt.oldIndex, 1)[0];
                    this.newList.splice(evt.newIndex, 0, tempIndex);
                    const tempIndex1 = this.newMenuList.splice(
                        evt.oldIndex,
                        1
                    )[0];
                    this.newMenuList.splice(evt.newIndex, 0, tempIndex1);
                    this.menuCodeList = this.newMenuList.map((item, index) => {
                        var objs = {};
                        objs[this.sty[0]] = this.newMenuList[index];
                        return objs;
                    });
                }
            });
        },
        // 拖拽完成
        dragFinish() {
            const params = this.menuCodeList;
            changeOrderWeb(params).then(response => {
                if (response.data.code == 200) {
                    this.getMenu();
                    this.$message({
                        title: "成功",
                        message: "拖拽成功",
                        type: "success",
                        duration: 2000
                    });
                } else {
                    this.$notify({
                        title: "警告",
                        message: "没有进行拖拽操作，请重新操作",
                        type: "warning",
                        duration: 2000
                    });
                }
            });
        },

        // 搜索
        handleFilter(data) {
            const params = data.menuName;
            //   console.log(params)
            filterWeb(params).then(() => {
                // console.log(response)
                // this.getList()
                // this.list = response.data.data
                //
            });
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
                menuName: undefined,
                menuCode: undefined,
                url: undefined,
                isEnable: "1",
                discription: undefined,
                name: undefined,
                requestMethod: undefined
            };
        },
        handleClick(data, checked, node) {
            this.i++;
            if (this.i % 2 == 0) {
                if (checked) {
                    this.$refs.tree.setCheckedNodes([]);
                    this.$refs.tree.setCheckedNodes([data]);
                    // 交叉点击节点
                } else {
                    this.$refs.tree.setCheckedNodes([]);
                    // 点击已经选中的节点，置空
                }
            }
        },
        getCheckedNodes() {
            const treeData = this.$refs.tree.getCheckedNodes()[0];
            this.treeData = this.$refs.tree.getCheckedNodes();
            if (this.treeData[0] == undefined) {
                this.temp.fCode = "";
            } else {
                this.temp.fCode = treeData.code;
            }
        },
        // 新增事件
        handleCreate() {
            this.resetTemp();
            this.getCheckedNodes();
            this.dialogStatus = "create";
            this.dialogFormVisible = true;
            this.$nextTick(() => {
                this.$refs["dataForm"].clearValidate();
            });
        },
        createData() {
            this.$refs["dataForm"].validate(valid => {
                if (valid) {
                    this.temp.name = this.temp.menuName;
                    createArticleWeb(this.temp).then(response => {
                        if (response.data.code == 200) {
                            this.temp.name = this.temp.menuName;
                            this.temp.requestMethod = this.list[0].requestMethod;
                            this.list.unshift(this.temp);
                            this.dialogFormVisible = false;
                            this.getList();
                            this.getMenu();
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
                        }
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
                    this.temp.name = this.temp.menuName;
                    this.temp.requestMethod = this.list[0].requestMethod;
                    const tempData = Object.assign({}, this.temp);
                    updateArticleWeb(tempData).then(response => {
                        if (response.data.code == 200) {
                            for (const v of this.list) {
                                if (v.id === this.temp.id) {
                                    const index = this.list.indexOf(v);
                                    this.list.splice(index, 1, this.temp);
                                    break;
                                }
                            }
                            this.getList();
                            this.getMenu();
                            this.dialogFormVisible = false;
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
                        }
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
</style>

<style>
.el-tree-node__content:hover {
    background-color: #6dc6fa;
    border-radius: 3%;
}
.formSearch {
    width: 100%;
    background: #fafafa;
    border: 1px solid #e9e9e9;
    border-radius: 3px;
    padding: 18px 10px 0;
    margin-bottom: 10px;
}
</style>


