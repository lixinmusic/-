import request from '@/utils/request';
import { MES_USER, MES_EQUIPMENT, MES_FILE, MES_ACTIVITI } from '@/common';

// 表格
export function fetchList(query) {
    return request({
        url: MES_EQUIPMENT + 'equipment/outWarehouse/form/query',
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

// 确认出库按钮
export function confirmation(id) {
    return request({
      url:MES_EQUIPMENT + "equipment/outWarehouse/form/out/" + id + "/" + 2,
      method: "post",
      params: {}
    });
}

// 查看详情id接口
export function evaluate(id) {
    return request({
      url: MES_EQUIPMENT + "equipment/unusedEquipHandle/form/detail/" + id,
      method: "get",
      params: {

      }
    });
}


// 编辑，查看小表格列表文（陈状） 
export function insertFile(data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/file/insertFlowFile',
        method: 'post',
        data
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


// 获取当前用户信息
export function getCurrentUser() {
    return request({
        url: MES_USER + 'sys/user/getCurrentUser',
        method: 'get'
    })
}