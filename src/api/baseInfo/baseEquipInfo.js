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
// 点击设备地址树获取导航信息
export function fetchNavByCode(Code) {
  return request({
    url: MES_EQUIPMENT + 'equipment/address/getnav/' + Code,
    method: 'get',
    params: { }
  })
}
// 根据设备类型模糊查询
export function fuzzyQuery(name) {
  return request({
    url: MES_EQUIPMENT + 'equipment/category/fuzzyQuery/' + name,
    method: 'get',
    params: { }
  })
}
// 设备地址树点击&搜索加载表格
export function fetchListByCode(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/info/listEquipInfo',
    method: 'get',
    params: query
  })
}

// 点击导入获取设备信息
export function fetchEquipList(fixedAssetCode,equipmentName,data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/basis/getEquipeInfoInport' + '?fixedAssetCode=' + fixedAssetCode + '&equipmentName=' + equipmentName,
    method: 'post',
    data
  })
}
// 添加设备信息
export function createArticle(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/info/insertEquipInfo',
    method: 'post',
    data
  })
}
// 根据设备id查询设备信息
export function fetchDetail(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/info/getEquipInfo/' + id,
    method: 'get',
    params: { }
  })
}
// 编辑修改设备信息
export function updateArticle(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/info/updateEquipInfo',
    method: 'put',
    data
  })
}
// 查询设备类别数组
export function fetchlbList(query) {
  return request({
    url: MES_USER + 'sys/word/listWordListByParCode/',
    method: 'get',
    params: query
  })
}
