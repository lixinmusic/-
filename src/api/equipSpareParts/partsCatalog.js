import request from '@/utils/request'
import { MES_EQUIPMENT } from '@/common'
// 查询树
export function fetchTree(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/spareparts/selectDendrogram',
    method: 'get',
    params: query
  })
}
// 树点击加载表格
export function fetchList(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/spareparts/selectCatalogByParam',
    method: 'POST',
    data
  })
}
// 新增时根据车间编号查询设备编号
export function fetchEquipCode(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/spareparts/getEquipmentCodeByOrgCode',
    method: 'get',
    params: query
  })
}
// 删除信息
export function deleteCode(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/spareparts/deleteById',
    method: 'delete',
    params: query
  })
}
// 增加信息
export function createArticle(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/spareparts/insertEquipment',
    method: 'post',
    data
  })
}
// 根据id查询信息
export function fetchDetail(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/spareparts/getCatalogById',
    method: 'get',
    params: query
  })
}
// 编辑信息
export function updateArticle(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/spareparts/updateCatalog',
    method: 'put',
    data
  })
}

//  配件目录根据id删除文件
export function deleteFileById(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/spareparts/deleteFileById/',
    method: 'delete',
    params: query
  })
}
