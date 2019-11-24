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
    url: MES_EQUIPMENT + 'equipment/fault/listFaultLibraryByTree',
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
    url: MES_EQUIPMENT + 'equipment/fault/listFaultLibraryByTerm',
    method: 'get',
    params: query
  })
}
// 删除故障库信息
export function deleteCode(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/fault/deleteFaultLibrary/' + id,
    method: 'delete',
    param: { }
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
// 根据故障库id查询
export function fetchDetail(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/fault/getFaultLibraryById/' + id,
    method: 'get',
    params: { }
  })
}
// 编辑修改故障库
export function updateArticle(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/fault/updateFaultLibrary',
    method: 'put',
    data
  })
}
// 文件上传
export function uploadlist(param) {
  return request({ // 用axios发送post请求
    url: MES_EQUIPMENT + 'equipment/fault/fileUpload', // 请求地址
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: param
  })
}

