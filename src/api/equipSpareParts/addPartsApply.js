import request from '@/utils/request'
import { MES_EQUIPMENT, MES_ACTIVITI } from '@/common'
// 设备配件

// 条件查询数据列表
export function fetchList(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/spareparts/selectByParam',
    method: 'post',
    data
  })
}
// 根据id查询数据
export function getDetail(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/spareparts/getById/',
    method: 'get',
    params: query
  })
}
// 查询两层树状图
export function fetchTree(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/spareparts/selectTwoLayersDendrogram',
    method: 'get',
    params: query
  })
}
// 新增数据
export function createArticle(type, data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/spareparts/insert?insertType=' + type,
    method: 'post',
    data
  })
}
// 修改数据
export function updateArticle(type, data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/spareparts/update?updateType=' + type,
    method: 'put',
    data
  })
}
// 删除数据
export function delById(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/spareparts/deleteById/',
    method: 'delete',
    params: query
  })
}
// 待办
// 条件查询待办数据
export function fetchNeedList(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/spareparts/selectNeedDoSparePartsByParam',
    method: 'post',
    data
  })
}
// 任务审批-修改审核状态
export function agreeApply(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/spareparts/updateAuditing',
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
    url: MES_EQUIPMENT + 'equipment/spareparts/reCommit',
    method: 'put',
    data
  })
}

// 已办
// 条件查询已办数据
export function fetchDoneList(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/spareparts/selectAlreadyDoSparePartsByParam',
    method: 'post',
    data
  })
}
// 查询所有申请信息
export function fetchAllList(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/spareparts/activitySelectParam',
    method: 'post',
    data
  })
}
export function fetchExportList(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/spareparts/activitySparePartExport',
    method: 'post',
    data
  })
}
