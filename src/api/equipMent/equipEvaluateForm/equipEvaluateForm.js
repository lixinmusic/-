import request from '@/utils/request'
import { MES_EQUIPMENT } from '@/common'
// 新设备评价表

// 条件查询新设备评价表列表
export function fetchList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/evaluate/listEvaluate',
    method: 'get',
    params: query
  })
}
// 根据id查询新设备评价表
export function getDetail(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/evaluate/getEvaluate/' + id,
    method: 'get',
    params: { }
  })
}
// 修改新设备评价表
export function updateQualityInfo(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/evaluate/updateEvaluate',
    method: 'put',
    data
  })
}
// 删除新设备评价表
export function delById(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/evaluate/deleteEvaluate/' + id,
    method: 'delete',
    params: {}
  })
}

// 生成新设备验收单
export function createAcceptanceReport(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/evaluate/createAcceptance/' + id,
    method: 'post',
    params: { }
  })
}

// 重新验收
export function createArticle(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/evaluate/reAcceptanceEvaluate',
    method: 'post',
    data
  })
}

// 新设备评价表待办

// 条件查询新设备评价表待办信息
export function fetchNeedList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/evaluate/listNeedDoEvaluateByTerm',
    method: 'get',
    params: query
  })
}
// 任务审批-修改审核状态
export function agreeApply(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/evaluate/updateAuditing',
    method: 'put',
    data
  })
}

// 重新提交调整申请
export function reCommit(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/evaluate/reCommit',
    method: 'put',
    data
  })
}

// 新设备评价表已办

// 条件查询新设备评价表已办信息
export function fetchDoneList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/evaluate/listAlreadyDoEvaluateByTerm',
    method: 'get',
    params: query
  })
}
// 根据固定资产查询
export function fetchAssetCodeList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/evaluate/listEvaluateByFixedAssetCode',
    method: 'get',
    params: query
  })
}
// 流程统计
export function fetchAllList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/evaluate/listEvaluateNoUser',
    method: 'get',
    params: query
  })
}
export function fetchExportList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/evaluate/listEvaluateNoUserExport',
    method: 'get',
    params: query
  })
}
