import request from '@/utils/request';
import { MES_USER, MES_EQUIPMENT, MES_FILE, MES_ACTIVITI } from '@/common';

// 表格 POST /equipment/repair/warranty/getEquipRepairWarrantyConfirms
export function fetchListdsy(pageNum, pageSize, data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/repair/warranty/getEquipRepairWarrantyConfirms' + "?pageNum=" + pageNum + "&pageSize=" + pageSize,
        method: 'post',
        data
    })
}


// 根据id查询的（编辑刚打开的页面） GET /equipment/repair/warranty/selectByPrimaryKey
export function evaluate(query) {
    return request({
      url: MES_EQUIPMENT + "equipment/repair/warranty/selectByPrimaryKey",
      method: "get",
      params: query
    });
}


// 编辑的提交和保存 PUT equipment/repair/warranty/upPost
export function updateArticle(query) {
    return request({
      url: MES_EQUIPMENT + "equipment/repair/warranty/upPost",
      method: "put",
      params: query
    });
}


// 重新验收 POST /equipment/repair/warranty/reAcceptance
export function createArticlest(status,data) {
    return request({
      url: MES_EQUIPMENT + "equipment/repair/warranty/reAcceptance" + "?status=" + status,
      method: "post",
      data
    });
}





// 删除
export function fetchPv(id) {
    return request({
        url: MES_EQUIPMENT + 'equipment/acceptance/deleteEquipAcceptance/' + id,
        method: 'delete',
        params: {

        }
    })
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

