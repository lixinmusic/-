import request from '@/utils/request'
import { MES_EQUIPMENT } from '@/common'
// 电机处置评审单

// 条件查询电机处置评审单列表
export function fetchList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/machineReview/form/query',
    method: 'get',
    params: query
  })
}
// 根据id查询电机处置评审单
export function getDetail(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/machineReview/form/get/' + id,
    method: 'get',
    params: { }
  })
}
// 保存电机处置评审单
export function saveFrom(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/machineReview/form/save',
    method: 'post',
    data
  })
}
// 提交电机处置评审单
export function submitForm(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/machineReview/form/submit',
    method: 'post',
    data
  })
}
// 删除电机处置评审单
export function delById(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/machineReview/form/delete/' + id,
    method: 'delete',
    params: { }
  })
}
// 电机处置评审单待办
// 条件查询电机处置评审单待办信息
export function fetchNeedList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/machineReview/listNeedDoUnusedFormByTerm',
    method: 'get',
    params: query
  })
}
// 任务审批-修改审核状态
export function agreeApply(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/machineReview/completeTask',
    method: 'put',
    data
  })
}
// 电机处置评审单已办

// 条件查询电机处置评审单已办信息
export function fetchDoneList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/machineReview/listAlreadyDoUnusedFormByTerm',
    method: 'get',
    params: query
  })
}
// 打印
export function fetchPrint(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/machineReview/getPrintInfo',
    method: 'get',
    params: query
  })
}
// 流程统计
export function fetchAllList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/machineReview/form/queryEquipMachineReviewFormListNoUser',
    method: 'get',
    params: query
  })
}
export function fetchExportList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/machineReview/form/queryEquipMachineReviewFormListNoUserExport',
    method: 'get',
    params: query
  })
}
