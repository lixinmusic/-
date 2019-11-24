import request from '@/utils/request'
import { MES_EQUIPMENT } from '@/common'

// 条件查询
export function fetchList(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipreformchecklist/selectByParam',
    method: 'post',
    data
  })
}
// 新增保存/提交
export function createData(type, data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipreformchecklist/insert?insertType=' + type,
    method: 'post',
    data
  })
}
// 根据id查询
export function getDetail(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipreformchecklist/getById',
    method: 'get',
    params: query
  })
}
// 修改保存/提交
export function updateData(type, data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipreformchecklist/update?updateType=' + type,
    method: 'put',
    data
  })
}
// 删除
export function delById(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipreformchecklist/deleteById/',
    method: 'delete',
    params: query
  })
}
// 查询引用信息列表
export function fetchInfoList(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipreformrecord/selectByParamToCheckList',
    method: 'post',
    data
  })
}
// 流程统计
export function fetchAllList(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipreformchecklist/activitySelectParam',
    method: 'post',
    data
  })
}
// 统计导出
export function fetchExportList(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipreformchecklist/equipReformCheckListExport',
    method: 'post',
    data
  })
}
