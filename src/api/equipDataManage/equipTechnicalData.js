import request from '@/utils/request'
import { MES_FILE, MES_EQUIPMENT } from '@/common'
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
    url: MES_EQUIPMENT + 'equipment/technicalData/listEquipTechnicalDataByTerm',
    method: 'get',
    params: query
  })
}

// 删除数据
export function deleteCode(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/technicalData/deleteEquipTechnicalData/' + id,
    method: 'delete',
    param: { }
  })
}
// 增加数据
export function createArticle(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/technicalData/insertEquipTechnicalData',
    method: 'post',
    data
  })
}
// 根据id查询数据
export function fetchDetail(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/technicalData/getEquipTechnicalDataById/' + id,
    method: 'get',
    params: { }
  })
}
// 编辑数据
export function updateArticle(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/technicalData/updateEquipTechnicalData',
    method: 'put',
    data
  })
}
// 文件上传
export function uploadlist(param) {
  return request({ // 用axios发送post请求
    url: MES_FILE + 'file/upload', // 请求地址
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: param
  })
}
