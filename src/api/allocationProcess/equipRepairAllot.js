import request from '@/utils/request'
import { MES_EQUIPMENT } from '@/common'
// 设备维修&调拨

// 条件查询设备维修&调拨列表
export function fetchList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/allocation/list',
    method: 'get',
    params: query
  })
}
// 根据id查询设备维修&调拨
export function getDetail(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/allocation/detail/' + id,
    method: 'get',
    params: { }
  })
}
// 保存设备维修&调拨
export function saveFrom(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/allocation/save',
    method: 'post',
    data
  })
}
// 提交设备维修&调拨
export function submitForm(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/allocation/submit',
    method: 'post',
    data
  })
}
// 查询引用报修设备信息列表
export function fetchInfoList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/allocation/list/equip',
    method: 'get',
    params: query
  })
}
// 删除设备维修&调拨
export function delById(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/allocation/delete/' + id,
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
// 设备维修&调拨待办&已办

// 条件查询设备维修&调拨待办&已办信息
export function fetchNeedList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/allocation/list/handletype',
    method: 'get',
    params: query
  })
}
// 任务审批-修改审核状态
export function agreeApply(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/allocation/taskApproval',
    method: 'post',
    data
  })
}
// 重新提交调整申请
export function reCommit(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/allocation/relaunch',
    method: 'post',
    data
  })
}
// 打印
export function fetchPrint(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/allocation/transferRecord/' + id,
    method: 'get',
    params: { }
  })
}
export function fetchAllList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/allocation/getListByAuditingType',
    method: 'get',
    params: query
  })
}
// 发送通知
export function postMessage(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/allocation/postMessage',
    method: 'post',
    data
  })
}
export function fetchExportList(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/allocation/export',
    method: 'post',
    data
  })
}
