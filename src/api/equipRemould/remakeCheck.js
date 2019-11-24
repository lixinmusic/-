import request from '@/utils/request';
import { MES_USER, MES_EQUIPMENT, MES_FILE, MES_ACTIVITI } from '@/common';

// 表格  POST /equipment/equipreformwarranty/selectByParam
export function fetchListdsy(data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/equipreformwarranty/selectByParam',
        method: 'post',
        data
    })
}



// 验收模块-发起人转办  

export function transferReplace(query) {
    return request({
        url: MES_EQUIPMENT + 'equipment/equipreformchecklist/transferToOffice',
        method: 'put',
        params: query
    })
}

// 编辑 PUT /
export function updateArticle(updateType,data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/equipreformwarranty/update' + "?updateType=" + updateType,
        method: 'put',
        data
    })
}

// 根据id查询的（编辑刚打开的页面）GET /equipment/equipreformwarranty/getById
export function evaluate(query) {
    return request({
        url: MES_EQUIPMENT + 'equipment/equipreformwarranty/getById',
        method: 'get',
        params: query

        
    })
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

// 生成设备质保验收单按钮
export function producePv(id) {
    return request({
        url: MES_EQUIPMENT + 'equipment/acceptance/createWarrantyAcceptance/' + id,
        method: 'post',
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

// 重新验收
export function createArticlest(data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/acceptance/reAccept',
        method: 'post',
        data
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

// 根据固定资产编号折叠GET /equipment/acceptance/listAcceptanceByFixedAssetCode
export function fixedascode(query) {
    return request({
        url: MES_EQUIPMENT + 'equipment/acceptance/listAcceptanceByFixedAssetCode',
        method: 'get',
        params: query
    })
}