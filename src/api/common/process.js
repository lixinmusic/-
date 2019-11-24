import request from '@/utils/request'
import { MES_USER, MES_EQUIPMENT, MES_FILE, MES_ACTIVITI } from '@/common'
// 流转记录  activiti/selectHistoryTask/{processInstanceId}
export function recordList(id) {
  return request({
    url: MES_ACTIVITI + 'activiti/selectHistoryTask/' + id,
    method: 'get',
    params: { }
  })
}
// 文件上传
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
// 文件删除
export function deleteFile(query) {
  return request({
    url: MES_FILE + 'file/delete',
    method: 'delete',
    params: query
  })
}
// 获取文件信息列表
export function fileList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/file/listFlowFile',
    method: 'get',
    params: query
  })
}
// 编辑查看文件删除 DELETE /equipment/file/deleteFlowFile/{id}
export function deleteFileById(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/file/deleteFlowFile/' + id,
    method: 'delete',
    params: { }
  })
}
// 获取当前用户信息
export function getCurrentUser() {
  return request({
    url: MES_USER + 'sys/user/getCurrentUser',
    method: 'get'
  })
}
// 编辑查看新增文件 equipment/file/insertFlowFile
export function insertFile(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/file/insertFlowFile',
    method: 'post',
    data
  })
}
// 查询当前任务信息 GET /activiti/currentTask/{processInstanceId}
export function getCurrentTask(id) {
  return request({
    url: MES_ACTIVITI + 'activiti/currentTask/' + id,
    method: 'get',
    params: { }
  })
}
