import request from '@/utils/request';
import { MES_USER, MES_EQUIPMENT, MES_FILE, MES_ACTIVITI } from '@/common';

// 表格 POST /
export function fetchListdsy(pageNum, pageSize, data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/repair/acceptance/getEquipRepairAcceptanceRecords' + "?pageNum=" + pageNum + "&pageSize=" + pageSize,
        method: 'post',
        data
    })
}

// 根据id查询的（编辑刚打开的页面） GET /equipment/repair/acceptance/selectByPrimaryKey
export function evaluate(query) {
    return request({
        url: MES_EQUIPMENT + "equipment/repair/acceptance/selectByPrimaryKey",
        method: "get",
        params: query
    });
}


// 编辑的提交和保存 PUT /equipment/repair/acceptance/upPost
export function updateArticle(query) {
    return request({
        url: MES_EQUIPMENT + "equipment/repair/acceptance/upPost",
        method: "put",
        params: query
    });
}

// 生成设备质保验收单按钮 GET /
export function producePv(query) {
    return request({
        url: MES_EQUIPMENT + "equipment/repair/acceptance/createDocumnet",
        method: "get",
        params: query
    });
}


// 新增保存和提交  POST /
export function createArticlest(status, proxyOrgCode, data) {
    return request({
        url: MES_EQUIPMENT + "equipment/repair/acceptance/save" + "?status=" + status + "&proxyOrgCode=" + proxyOrgCode,
        method: "post",
        data
    });
}




// 删除  
export function fetchPv(query) {
    return request({
        url: MES_EQUIPMENT + "equipment/repair/acceptance/delete",
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

// 获取当前用户信息
export function getCurrentUser() {
    return request({
        url: MES_USER + 'sys/user/getCurrentUser',
        method: 'get'
    })
}


//引用设备调拨单接口 
export function fetchsList(data) {
    return request({
        url: MES_EQUIPMENT + "equipment/basis/getAcceptanceDTO",
        method: "post",
        data
    });
}
