import request from '@/utils/request'
import { MES_USER, MES_EQUIPMENT } from '@/common'
// 查询设备类型树
export function fetchTree(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/category/listtree',
    method: 'get',
    params: query
  })
}
// 设备类型树点击加载表格
export function fetchListByCode(Code) {
  return request({
    url: MES_EQUIPMENT + 'equipment/category/getchildren/' + Code,
    method: 'get',
    params: { }
  })
}

// 删除设备类型信息
export function deleteCode(Code) {
  return request({
    url: MES_EQUIPMENT + 'equipment/category/delete/' + Code,
    method: 'delete',
    param: { }
  })
}
// 增加设备类型信息
export function createArticle(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/category/add',
    method: 'post',
    data
  })
}
// 根据设备类型编码查询类型信息
export function fetchDetail(Code) {
  return request({
    url: MES_EQUIPMENT + 'equipment/category/query/' + Code,
    method: 'get',
    params: { }
  })
}
// 编辑修改类型信息
export function updateArticle(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/category/update',
    method: 'put',
    data
  })
}
// 获取当前用户信息
export function getCurrentUser() {
  return request({
    url: MES_USER + 'sys/user/getCurrentUser',
    method: 'get'
  })
}
