import request from '@/utils/request'
import { MES_USER, MES_EQUIPMENT, MES_FILE, MES_ACTIVITI } from '@/common'

// 表格
export function fetchListdsy(pageNum, pageSize,data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/repair/doucument/getUpcoming' + '?pageNum=' + pageNum + '&pageSize=' + pageSize,
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

//  同意和退回的确认接口  consentToreturn
export function consentToreturn(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/repair/doucument/operating',
    method: 'get',
    params: query
  })
}

// 在待办时退回的时候再进行的提交
export function refto(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/repair/doucument/relaunch',
    method: 'get',
    params: query
  })
}

// 获取node节点的名字  activiti/currentTaskByTaskId/{ taskId }
export function getNodeTask(id) {
  return request({
    url: MES_ACTIVITI + 'activiti/currentTaskByTaskId/' + id,
    method: 'get',
    params: {}
  })
}

// 在资产部节点要传的接口
export function conservation(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/repair/doucument/up',
    method: 'put',
    data
  })
}

// 结束流程
export function endProcess(taskId, val, id, moduleTypeId) {
  return request({
    url: MES_EQUIPMENT + 'equipment/activiti/endProcess' + '?taskId=' + taskId + '&val=' + val + '&id=' + id + '&moduleTypeId=' + moduleTypeId,
    method: 'put',
    params: {}
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


// 编辑的小表格删除接口（壮）
export function updeletedata(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/file/deleteFlowFile/' + id,
    method: 'delete',
    params: {

    }
  })
}


// 编辑查看新增文件   insertFile,getCurrentUser
export function insertFile(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/file/insertFlowFile',
    method: 'post',
    data
  })
}





