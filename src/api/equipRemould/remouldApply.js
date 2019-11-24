import request from '@/utils/request'
import { MES_EQUIPMENT } from '@/common'

// 条件查询
export function fetchList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipReform/list',
    method: 'get',
    params: query
  })
}
// 新增保存
export function saveArticle(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipReform',
    method: 'post',
    data
  })
}
// 新增提交
export function createArticle(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipReform/submit',
    method: 'post',
    data
  })
}
// 根据id查询
export function fetchDetail(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipReform/' + id,
    method: 'get',
    param: {}
  })
}
// 修改保存
export function updateArticle(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipReform',
    method: 'put',
    data
  })
}
// 修改提交
export function updateArticleSubmit(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipReform/submit',
    method: 'put',
    data
  })
}
// 删除
export function delById(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipReform/' + id,
    method: 'delete',
    params: {}
  })
}
// 查询引用的信息列表
export function fetchInfoList(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/account/getEquipAccountByParam',
    method: 'post',
    data
  })
}

// 条件待办查询
export function fetchNeedList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipReform/needHandle',
    method: 'get',
    params: query
  })
}
// 任务审批
export function agreeApply(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipReform/taskApproval',
    method: 'post',
    data
  })
}
// 重新提交调整申请
export function reCommit(id, data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipReform/adjustSub?taskId=' + id,
    method: 'put',
    data
  })
}
// 打印
export function fetchPrint(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipReform/print',
    method: 'get',
    params: query
  })
}

// 条件查询已办信息
export function fetchDoneList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipReform/alreadyHandle',
    method: 'get',
    params: query
  })
}
// 流程统计
export function fetchAllList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipReform/listAll',
    method: 'get',
    params: query
  })
}
// 统计导出
export function fetchExportList(query) {
  return request({
    url: MES_EQUIPMENT + '/equipment/equipReform/getDetailExportPath',
    method: 'post',
    params: query
  })
}
