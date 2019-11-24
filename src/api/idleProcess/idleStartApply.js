import request from '@/utils/request'
import { MES_EQUIPMENT } from '@/common'
// 闲置设备启动申请单

// 条件查询闲置设备启动申请单列表
export function fetchList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/unusedStart/form/query',
    method: 'get',
    params: query
  })
}
// 根据id查询闲置设备启动申请单
export function getDetail(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/unusedStart/form/detail/' + id,
    method: 'get',
    params: { }
  })
}
// 保存闲置申请单
export function saveFrom(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/unusedStart/form/save',
    method: 'post',
    data
  })
}
// 提交闲置设备启动申请单
export function submitForm(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/unusedStart/form/submit',
    method: 'post',
    data
  })
}
// 查询引用闲置设备
export function fetchInfoList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/unused/form/inWarehouse/equipAccount',
    method: 'get',
    params: query
  })
}
// 删除闲置设备启动申请单
export function delById(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/unusedStart/form/delete/' + id,
    method: 'delete',
    params: { }
  })
}
// 查询设备地址树
export function fetchTree(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/address/listtree',
    method: 'get',
    params: query
  })
}
// 闲置设备启动申请单待办

// 条件查询闲置设备启动申请单待办信息
export function fetchNeedList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/unusedStart/listNeedDoUnusedFormByTerm',
    method: 'get',
    params: query
  })
}
// 任务审批-修改审核状态
export function agreeApply(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/unusedStart/completeTask',
    method: 'put',
    data
  })
}
// 闲置设备启动申请单已办

// 条件查询闲置设备启动申请单已办信息
export function fetchDoneList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/unusedStart/listAlreadyDoUnusedFormByTerm',
    method: 'get',
    params: query
  })
}
// 打印
export function fetchPrint(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/unusedStart/form/getPrintInfo/' + id,
    method: 'get',
    params: { }
  })
}
export function fetchAllList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/unusedStart/form/queryFormListNoUser',
    method: 'get',
    params: query
  })
}
export function fetchExportList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/unusedStart/form/queryFormListNoUserExport',
    method: 'get',
    params: query
  })
}
