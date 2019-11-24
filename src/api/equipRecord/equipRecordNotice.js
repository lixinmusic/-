import request from '@/utils/request'
import { MES_EQUIPMENT } from '@/common'
// 设备采购项目备案通知书

// 条件查询设备备案信息
export function fetchList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipRecord/list',
    method: 'get',
    params: query
  })
}
// 保存设备备案
export function saveArticle(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipRecord',
    method: 'post',
    data
  })
}
// 提交设备备案
export function createArticle(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipRecord/submit',
    method: 'post',
    data
  })
}
// 根据id查询设备备案信息 equipment/equipRecord/{id}
export function getDetail(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipRecord/' + id,
    method: 'get',
    params: { }
  })
}
// 修改设备备案（修改保存）
export function updateArticle(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipRecord',
    method: 'put',
    data
  })
}
// 修改提交 equipment/equipRecord/submit
export function updateArticleSubmit(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipRecord/submit',
    method: 'put',
    data
  })
}

// 删除设备备案
export function delById(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipRecord/' + id,
    method: 'delete',
    params: {}
  })
}
// 查看设备备案
export function fetchDetail(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipRecord/' + id,
    method: 'get',
    param: { }
  })
}

// 生成采购申请单
export function fetchProduce(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipRecord/createPurchase',
    method: 'get',
    params: query
  })
}
// 查看采购申请单 /equipment/equipRecord/findPurchaseByRecordCode/{recordCode}
export function findPurchaseByRecordCode(recordCode) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipRecord/findPurchaseByRecordCode/' + recordCode,
    method: 'get',
    param: { }
  })
}

// 设备采购项目备案通知书待办
// 条件查询设备备案待办信息
export function fetchNeedList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipRecord/needHandle',
    method: 'get',
    params: query
  })
}
// 任务审批 equipment/equipRecord/taskApproval
export function agreeApply(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipRecord/taskApproval/',
    method: 'get',
    params: query
  })
}
// 重新提交调整申请
export function reCommit(id, data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipRecord/adjustSub?taskId=' + id,
    method: 'put',
    data
  })
}
// 打印
export function fetchPrint(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipRecord/print',
    method: 'get',
    params: query
  })
}
// 设备采购项目备案通知书已办

// 条件查询设备备案已办信息
export function fetchDoneList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipRecord/alreadyHandle',
    method: 'get',
    params: query
  })
}
// 查询引用台账状态为闲置完好的信息列表
export function fetchInfoList(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/account/getEquipAccountByParam',
    method: 'post',
    data
  })
}
export function fetchAllList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipRecord/listAll',
    method: 'get',
    params: query
  })
}
export function fetchExportList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipRecord/getDetailExportPath',
    method: 'post',
    params: query
  })
}
