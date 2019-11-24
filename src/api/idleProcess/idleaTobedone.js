import request from "@/utils/request";
import { MES_USER, MES_EQUIPMENT, MES_FILE, MES_ACTIVITI } from "@/common";

// 表格
export function fetchListdsy(query) {
    return request({
      url:MES_EQUIPMENT +"equipment/unusedEquipHandle/listNeedDoUnusedHandleFormByTerm",
      method: "get",
      params: query
    });
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

// 编辑的小表格删除接口（壮）
export function updeletedata(id) {
    return request({
        url: MES_EQUIPMENT + 'equipment/file/deleteFlowFile/' + id,
        method: 'delete',
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


// 编辑，查看小表格列表文（陈状） 
export function insertFile(data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/file/insertFlowFile',
        method: 'post',
        data
    })
}


//  同意和退回的确认接口  consentToreturn
export function consentToreturn(data) {
    return request({
        url: MES_EQUIPMENT + "equipment/unusedEquipHandle/completeTask",
           method: "put",
           data
         });
       }



// 获取node节点的名字  activiti/currentTaskByTaskId/{ taskId }
export function getNodeTask(id) {
    return request({
        url: MES_ACTIVITI + 'activiti/currentTaskByTaskId/' + id,
        method: "get",
        params: {}
    });
}



// 在待办时退回的时候再进行的提交
export function refto(data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/unusedEquipHandle/form/submit',
        method: 'post',
        data
    })
}


// 资产部修改对应的数据
export function cons(data) {
    return request({
        url: MES_EQUIPMENT + "equipment/unusedEquipHandle/updateData",
        method: "put",
        data
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