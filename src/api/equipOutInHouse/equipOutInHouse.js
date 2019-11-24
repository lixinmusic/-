import request from '@/utils/request'
import { MES_USER, MES_EQUIPMENT, MES_ACTIVITI } from '@/common'
// 设备出入库

// 条件查询设备出入库列表
export function fetchList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/inoutstock/list',
    method: 'get',
    params: query
  })
}
// 根据id查询设备出入库
export function getDetail(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/inoutstock/detail/' + id,
    method: 'get',
    params: { }
  })
}
// 保存设备出入库
export function saveFrom(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/inoutstock/save',
    method: 'post',
    data
  })
}
// 提交设备出入库
export function submitForm(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/inoutstock/submit',
    method: 'post',
    data
  })
}
// 查询引用报修设备信息列表
export function fetchInfoList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/inoutstock/list/equip',
    method: 'get',
    params: query
  })
}
// 删除设备出入库
export function delById(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/inoutstock/delete/' + id,
    method: 'delete',
    params: { }
  })
}
// 入库
export function chooseRepairSituation(id,repairSituation) {
    return request({
      url: MES_EQUIPMENT + 'equipment/inoutstock/chooseRepairSituation/' + id + '/' + repairSituation,
      method: 'get',
      params: { }
    })
}
