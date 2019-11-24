import request from '@/utils/request'
import { MES_USER, MES_EQUIPMENT } from '@/common'
// 查询设备地址树
export function fetchTree(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/address/listtree',
    method: 'get',
    params: query
  })
}
// 设备地址树点击加载表格
export function fetchListByCode(Code) {
  return request({
    url: MES_EQUIPMENT + 'equipment/address/getchildren/' + Code,
    method: 'get',
    params: { }
  })
}

// 删除设备地址信息
export function deleteCode(Code) {
  return request({
    url: MES_EQUIPMENT + 'equipment/address/delete/' + Code,
    method: 'delete',
    param: { }
  })
}
// 增加设备地址信息
export function createArticle(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/address/add',
    method: 'post',
    data
  })
}
// 根据设备地址编码查询地址信息
export function fetchDetail(Code) {
  return request({
    url: MES_EQUIPMENT + 'equipment/address/query/' + Code,
    method: 'get',
    params: { }
  })
}
// 编辑修改地址信息
export function updateArticle(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/address/update',
    method: 'put',
    data
  })
}
