import request from '@/utils/request'
import { MES_EQUIPMENT } from '@/common'
// 设备采购申请单

// 条件查询设备采购申请信息
export function fetchList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipPurchase/list',
    method: 'get',
    params: query
  })
}
// 删除设备采购申请
export function delById(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipPurchase/' + id,
    method: 'delete',
    params: {}
  })
}
// 根据id查询设备采购申请
export function getDetail(id) {
  return request({
    url: MES_EQUIPMENT + '/equipment/equipPurchase/' + id,
    method: 'get',
    params: { }
  })
}

// 查看
export function fetchDetail(id) {
  return request({
    url: MES_EQUIPMENT + '/equipment/equipPurchase/' + id,
    method: 'get',
    params: { }
  })
}
// 提交设备采购申请
export function createArticle(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipPurchase/submit',
    method: 'post',
    data
  })
}

// 保存设备采购申请
export function saveArticle(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipPurchase',
    method: 'post',
    data
  })
}
// 修改提交设备采购申请
export function updateArticleSubmit(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipPurchase/submit',
    method: 'put',
    data
  })
}
// 修改设备采购申请
export function updateSaveArticle(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipPurchase',
    method: 'put',
    data
  })
}

// 设备采购申请单待办
// 条件查询设备采购申请待办信息
export function fetchNeedList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipPurchase/needHandle',
    method: 'get',
    params: query
  })
}
// 任务审批 equipment/equipPurchase/taskApproval
export function agreeApply(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipPurchase/taskApproval/',
    method: 'get',
    params: query
  })
}
// 重新提交调整申请
export function reCommit(id, data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipPurchase/adjustSub?taskId=' + id,
    method: 'put',
    data
  })
}
// 打印
export function fetchPrint(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipPurchase/print',
    method: 'get',
    params: query
  })
}
// 设备采购申请单已办
// 条件查询设备采购申请已办信息
export function fetchDoneList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipPurchase/alreadyHandle',
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
// 设备备案单关联的设备信息
export function fetchEquiplist(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipRecord/equipRecordNumList',
    method: 'get',
    params: query
  })
}
// 查询所有申请信息
export function fetchAllList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipPurchase/listAll',
    method: 'get',
    params: query
  })
}
export function fetchExportList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipPurchase/getDetailExportPath',
    method: 'post',
    params: query
  })
}
