import request from '@/utils/request';
import { MES_USER, MES_EQUIPMENT, MES_FILE, MES_ACTIVITI } from '@/common';

// 表格
export function fetchListdsy(data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/repair/doucument/getEquipReportDoucumentByParam',
        method: 'post',
        data
    })
}


// 根据id查询的（编辑刚打开的页面）查询详情也是这个接口
export function evaluate(query) {
    return request({
      url: MES_EQUIPMENT + "equipment/repair/doucument/selectById" ,
      method: "get",
      params: query
    });
}


// 删除 
export function fetchPv(query) {
    return request({
        url: MES_EQUIPMENT + "equipment/repair/doucument/delete",
        method: "delete",
        params: query
    });
}

// 流转记录的接口
export function circuList(processInstanceId) {
    return request({
        url: MES_ACTIVITI + 'activiti/selectHistoryTask/' + processInstanceId,
        method: 'get',
        params: {

        }
    })
}

// 获取当前用户信息
export function getCurrentUser() {
    return request({
        url: MES_USER + 'sys/user/getCurrentUser',
        method: 'get'
    })
}

// 新增保存
export function addkeep(data) {
    return request({
      url: MES_EQUIPMENT + "equipment/repair/doucument/add",
      method: "post",
      data
    });
}
// 新增提交 
export function addpost(userId,data) {
    return request({
        url: MES_EQUIPMENT + "equipment/repair/doucument/addPost" + "?userId=" + userId ,
        method: "post",
        data
    });
}

// 编辑保存
export function conservation(data) {
    return request({
      url: MES_EQUIPMENT + "equipment/repair/doucument/up",
      method: "put",
      data
    });
}

// 编辑提交
export function referto(userId,data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/repair/doucument/upPost' + "?userId=" + userId,
        method: 'put',
        data
    })
}



//引用设备调拨单接口 
export function fetchList(query) {
    return request({
      url: MES_EQUIPMENT + "equipment/account/getReportList",
      method: "get",
      params: query
    });
}

// 打印
export function smilelist(code) {
    return request({
        url: MES_EQUIPMENT + 'equipment/repair/doucument/getPrintInfo/' + '?code=' + code,
        method: 'get',
        params: {

        }
    })
}

// 流程图 GET /activiti/process/trace/auto/{processInstanceId}
export function flowsheet(processInstanceId) {
    return request({
        url: MES_ACTIVITI + 'activiti/process/trace/auto/' + processInstanceId,
        method: 'get',
        params: {

        }
    })
}




// 上传接口
export function uploadlist(param) {
    return request({ // 用axios发送post请求
        url: MES_FILE + 'file/upload', // 请求地址
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data: param
    })
}

// 小表格接口  
export function smallAblist(query) {
    return request({
        url: MES_EQUIPMENT + 'equipment/file/listFlowFile',
        method: 'get',
        params: query
    })
}


// 重新验收的小表格删除接口（文彪）
export function deleteapp(query) {
    return request({
        url: MES_FILE + 'file/delete',
        method: 'delete',
        params: query
    })
}
// 编辑的小表格删除接口（壮）
export function updeletedata(id) {
    return request({
        url: MES_EQUIPMENT + 'equipment/file/deleteFlowFile/' + id,
        method: 'delete',
        params: {

        }
    })
}

// 编辑查看新增文件  
export function insertFile(data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/file/insertFlowFile',
        method: 'post',
        data
    })
}
