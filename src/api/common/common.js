import request from '@/utils/request'
import { MES_USER, MES_EQUIPMENT, MES_FILE, MES_ACTIVITI } from '@/common'
// 结束流程
export function endProcess(taskId, val, id, moduleTypeId) {
  return request({
    url: MES_EQUIPMENT + 'equipment/activiti/endProcess' + '?taskId=' + taskId + '&val=' + val + '&id=' + id + '&moduleTypeId=' + moduleTypeId,
    method: 'put',
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
// 流转记录  activiti/selectHistoryTask/{processInstanceId}
export function recordList(id) {
  return request({
    url: MES_ACTIVITI + 'activiti/selectHistoryTask/' + id,
    method: 'get',
    params: { }
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
// 流程图
export function processChart(id) {
  return request({
    url: MES_ACTIVITI + 'activiti/process/trace/auto/' + id,
    method: 'get',
    params: { }
  })
}
// 查询公司类型
export function fetchComTree(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/orgnization/listCompanyTree',
    method: 'get',
    params: query
  })
}
// 根据公司查询工厂
export function fetchComByCode(query) {
  return request({
    url: MES_USER + 'sys/organization/listChildCompany',
    method: 'get',
    params: query
  })
}
// 根据工厂查询部门组织树
export function fetchOrgTree(query) {
  return request({
    url: MES_USER + 'sys/organization/orgCompanyByCode',
    method: 'get',
    params: query
  })
}
// 查询组织结构树（公司&部门）
export function fetchChooseTree(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/orgnization/listTree',
    method: 'get',
    params: query
  })
}
// 选择设备名称
export function fetchEquipName(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/category/listtree',
    method: 'get',
    params: query
  })
}
//  用户流程代理
export function getProxyOrgList(userCode) {
  return request({
    url: MES_USER + 'sys/userproxyorg/selectByUserCode/' + userCode,
    method: 'get',
    params: { }
  })
}
// 组织树点击加载人员表格
export function choosePersonList(query) {
  return request({
    url: MES_USER + 'sys/person/listSysPerson',
    method: 'get',
    params: query
  })
}
// 待办转办
export function transferList(query) {
  return request({
    url: MES_ACTIVITI + 'activiti/taskChange',
    method: 'get',
    params: query
  })
}
// 验收模块-发起人转办
export function transferReplace(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/openCheck/transferToOffice',
    method: 'put',
    params: query
  })
}
const commonOptions = [{
  value: '1',
  label: '未提交'
}, {
  value: '2',
  label: '审核中'
}, {
  value: '3',
  label: '审核通过'
}, {
  value: '4',
  label: '审核不通过'
}, {
  value: '5',
  label: '流程关闭'
}]
const commonOptions1 = [{
  value: '2',
  label: '审核中'
}, {
  value: '3',
  label: '审核通过'
}, {
  value: '4',
  label: '审核不通过'
}, {
  value: '5',
  label: '流程关闭'
}]
const commonOptions2 = [{
  value: '1',
  label: '未提交'
}, {
  value: '2',
  label: '审核中'
}, {
  value: '3',
  label: '审核通过'
}, {
  value: '4',
  label: '审核不通过'
}]
export { commonOptions, commonOptions1, commonOptions2 }
