import request from '@/utils/request'
import { MES_EQUIPMENT } from '@/common'
// 设备闲置申请单

// 条件查询设备闲置申请单列表
export function fetchList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/unused/form/query',
    method: 'get',
    params: query
  })
}
// 根据id查询设备闲置申请单
export function getDetail(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/unused/form/detail/' + id,
    method: 'get',
    params: { }
  })
}
// 保存闲置申请单
export function saveFrom(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/unused/form/save',
    method: 'post',
    data
  })
}
// 提交设备闲置申请单
export function submitForm(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/unused/form/submit',
    method: 'post',
    data
  })
}
// 查询引用台账状态为完好的信息列表
export function fetchInfoList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/unused/form/getEquipAccountList/intact',
    method: 'get',
    params: query
  })
}
// 删除设备闲置申请单
export function delById(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/unused/form/delete/' + id,
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
// 设备闲置申请单待办

// 条件查询设备闲置申请单待办信息
export function fetchNeedList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/unused/listNeedDoUnusedFormByTerm',
    method: 'get',
    params: query
  })
}
// 任务审批-修改审核状态
export function agreeApply(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/unused/completeTask',
    method: 'put',
    data
  })
}
// 重新提交调整申请
export function reCommit(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/unused/form/submit',
    method: 'post',
    data
  })
}

// 设备闲置申请单已办

// 条件查询设备闲置申请单已办信息
export function fetchDoneList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/unused/listAlreadyDoUnusedFormByTerm',
    method: 'get',
    params: query
  })
}
// 闲置设备入库单
export function fetchGohouse(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/inWarehouse/form/query',
    method: 'get',
    params: query
  })
}
// 确认入库
export function wareHouse(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/inWarehouse/form/in/' + id,
    method: 'post',
    params: { }
  })
}
// 打印
export function fetchPrint(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/unused/getPrintInfo',
    method: 'get',
    params: query
  })
}
export function fetchAllList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/unused/form/queryFormListNoUser',
    method: 'get',
    params: query
  })
}
export function fetchExportList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/unused/form/queryFormListNoUserExport',
    method: 'get',
    params: query
  })
}
