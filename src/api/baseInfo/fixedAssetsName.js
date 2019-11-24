import request from '@/utils/request'
import { MES_EQUIPMENT } from '@/common'
// 查询设备类型树
export function fetchTree(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipCategoryOffice/selectTree',
    method: 'get',
    params: query
  })
}
// 设备类型树点击加载表格
export function fetchListByCode(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipCategoryOffice/selectChildrenByCategoryCode',
    method: 'get',
    params: query
  })
}

// 删除设备类型信息
export function deleteCode(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipCategoryOffice/delete',
    method: 'delete',
    params: query
  })
}
// 增加设备类型信息
export function createArticle(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipCategoryOffice/add',
    method: 'post',
    params: query
  })
}
// 根据设备类型编码查询类型信息
export function fetchDetail(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipCategoryOffice/selectByCategoryCode/',
    method: 'get',
    params: query
  })
}
// 编辑修改类型信息
export function updateArticle(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipCategoryOffice/up',
    method: 'put',
    params: query
  })
}
// 判读名称是否存在
export function checkEquipName(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipCategoryOffice/isExistByName',
    method: 'get',
    params: query
  })
}
