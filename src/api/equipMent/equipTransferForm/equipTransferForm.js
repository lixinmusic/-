import request from '@/utils/request'
import { MES_EQUIPMENT } from '@/common'
// 新设备移交单

// 条件查询新设备移交单列表
export function fetchList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/transfer/listTransferByTerm',
    method: 'get',
    params: query
  })
}
// 根据id查询新设备移交单
export function getDetail(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/transfer/getTransferById/' + id,
    method: 'get',
    params: { }
  })
}
// 修改新设备移交单
export function updateQualityInfo(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/transfer/updateTransferById',
    method: 'put',
    data
  })
}
// 删除新设备移交单
export function delById(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/transfer/deleteTransferById/' + id,
    method: 'delete',
    params: { }
  })
}
// 查询引用评价信息列表
export function fetchInfoList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/evaluate/listQuoteEvaluate',
    method: 'get',
    params: query
  })
}
// 引用评价表信息
export function importEvaluate(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/transfer/quote/' + id,
    method: 'put',
    params: { }
  })
}
// 通过评价表id查询所有附件信息
export function getAllFile(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/file/listFileByEvaluateId/' + id,
    method: 'get',
    params: { }
  })
}

// 新增移交单
export function createArticle(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/transfer/insertTransfer',
    method: 'post',
    data
  })
}

// 新设备移交单待办

// 条件查询新设备移交单待办信息
export function fetchNeedList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/transfer/listNeedDoTransferByTerm',
    method: 'get',
    params: query
  })
}
// 任务审批-修改审核状态
export function agreeApply(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/transfer/updateAuditing',
    method: 'put',
    data
  })
}
// 重新提交调整申请
export function reCommit(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/transfer/reCommit',
    method: 'put',
    data
  })
}

// 新设备移交单已办
// 条件查询新设备移交单已办信息
export function fetchDoneList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/transfer/listAlreadyDoTransferByTerm',
    method: 'get',
    params: query
  })
}
// 流程统计
export function fetchAllList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/transfer/listTransferByTermNoUser',
    method: 'get',
    params: query
  })
}
export function fetchExportList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/transfer/listTransferByTermNoUserExport',
    method: 'get',
    params: query
  })
}
