import request from '@/utils/request'
import { MES_USER, MES_EQUIPMENT, MES_FILE, MES_ACTIVITI } from '@/common'

// 表格 
export function fetchListdsy(data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/repair/doucument/getDataByParam',
        method: 'post',
        data
    })
}

// 根据id查询的（编辑刚打开的页面）查询详情也是这个接口
export function evaluate(query) {
    return request({
        url: MES_EQUIPMENT + 'equipment/repair/doucument/selectById',
        method: 'get',
        params: query
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

// 获取当前用户信息
export function getCurrentUser() {
    return request({
        url: MES_USER + 'sys/user/getCurrentUser',
        method: 'get'
    })
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

// 新增里的小表格接口
export function smallAblist(query) {
    return request({
        url: MES_EQUIPMENT + 'equipment/file/listFlowFile',
        method: 'get',
        params: query
    })
}

// 小表格删除接口
export function samllDelete(id) {
    return request({
        url: MES_EQUIPMENT + 'equipment/file/deleteFlowFile/' + id,
        method: 'delete',
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


// 小表格删除接口（壮）
export function updeletedata(id) {
    return request({
        url: MES_EQUIPMENT + 'equipment/file/deleteFlowFile/' + id,
        method: 'delete',
        params: {

        }
    })
}



// 导出   POST /
export function derivationst(data) {
    return request({
        url: MES_EQUIPMENT + "equipment/repair/doucument/getDetailExportPath",
        method: "post",
        data
    });
}