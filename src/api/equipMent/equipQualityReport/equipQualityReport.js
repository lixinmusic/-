import request from '@/utils/request'
import { MES_USER, MES_EQUIPMENT, MES_FILE, MES_ACTIVITI } from '@/common'
// 设备质量信息报告

// 条件查询质量信息报告列表
export function fetchList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/qualityInfo/listEquipQualityInfo',
    method: 'get',
    params: query
  })
}
// 根据id查询质量信息报告 equipment/qualityInfo/getEquipQualityInfo/{id}
export function getDetail(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/qualityInfo/getEquipQualityInfo/' + id,
    method: 'get',
    params: { }
  })
}
// 修改设备质量信息报告
export function updateQualityInfo(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/qualityInfo/updateQualityInfo',
    method: 'put',
    data
  })
}
// 删除设备质量信息报告
export function delById(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/qualityInfo/deleteEquipQualityInfo/' + id,
    method: 'delete',
    params: {}
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

// 生成评价表
export function createEvaluateReport(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/qualityInfo/createEvaluate/' + id,
    method: 'post',
    params: { }
  })
}
// 重新验收
export function createArticle(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/qualityInfo/reAcceptance',
    method: 'post',
    data
  })
}

// 设备质量信息报告待办

// 条件查询设备质量信息报告待办信息
export function fetchNeedList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/qualityInfo/listNeedDoQualityInfoByTerm',
    method: 'get',
    params: query
  })
}
// 任务审批-修改审核状态
export function agreeApply(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/qualityInfo/updateAuditing',
    method: 'put',
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
// 重新提交调整申请
export function reCommit(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/qualityInfo/reCommit',
    method: 'put',
    data
  })
}

// 设备质量信息报告已办

// 条件查询设备质量信息报告已办信息
export function fetchDoneList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/qualityInfo/listAlreadyDoQualityInfoByTerm',
    method: 'get',
    params: query
  })
}
