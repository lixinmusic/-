import request from '@/utils/request'
import { MES_EQUIPMENT } from '@/common'
// 查询设备类型树
export function fetchTree(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/category/listtree',
    method: 'get',
    params: query
  })
}
// 设备类型树点击加载表格
export function fetchListByCode(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/maintenanceSheet/listEquipMaintenanceSheetByTree',
    method: 'get',
    params: query
  })
}
// 设备名称查询下拉框
export function fuzzyQuery(name) {
  return request({
    url: MES_EQUIPMENT + 'equipment/category/getCategoryName/' + name,
    method: 'get',
    params: { }
  })
}
// 条件查询表格
export function fetchList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/maintenanceSheet/listEquipMaintenanceSheetByTerm',
    method: 'get',
    params: query
  })
}

// 增加故障库信息
export function createArticle(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/fault/insertEquipFaultLibrary',
    method: 'post',
    data
  })
}
// 已添加
export function isAddById(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/maintenanceSheet/upIsAlreadyAdd/' + id,
    method: 'put',
    params: { }
  })
}
