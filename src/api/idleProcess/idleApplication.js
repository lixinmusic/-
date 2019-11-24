import request from '@/utils/request';
import { MES_USER, MES_EQUIPMENT, MES_FILE, MES_ACTIVITI } from '@/common';

// 表格
export function fetchListdsy(query) {
    return request({
        url: MES_EQUIPMENT + 'equipment/unusedEquipHandle/form/query',
        method: 'get',
        params: query
    })
}


// 根据id查询的（编辑刚打开的页面）查询详情也是这个接口
export function evaluate(id) {
    return request({
      url: MES_EQUIPMENT + "equipment/unusedEquipHandle/form/detail/" + id,
      method: "get",
      params: {

      }
    });
}
 

// 删除 
export function fetchPv(id) {
    return request({
      url: MES_EQUIPMENT + "equipment/unusedEquipHandle/form/delete/" + id,
      method: "delete",
      params: {

      }
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


// 新增的小表格删除接口（文彪）
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

// 编辑，查看小表格列表文（陈状） 
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


// 保存按钮的接口
export function conservation(data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/unusedEquipHandle/form/save',
        method: 'post',
        data
    })
}

// 提交按钮的接口
export function referto(data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/unusedEquipHandle/form/submit',
        method: 'post',
        data
    })
}


//引用闲置待报废设置接口 字段跟设备台账的一样
export function fetchList(query) {
    return request({
      url:MES_EQUIPMENT +"equipment/unusedEquipHandle/unusedFormToDiscard/get",
      method: "get",
      params: query
    });
 }

// 闲置设备申请单的查询详情要取到 存放地址 这个字段
export function storageAddress(id) {
    return request({
        url: MES_EQUIPMENT + "equipment/unused/form/detail/" + id,
        method: "get",
        params: {

        }
    });
}


// 打印
export function stamplist(id) {
    return request({
        url: MES_EQUIPMENT + 'equipment/unusedEquipHandle/getPrintInfo/' + id,
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



