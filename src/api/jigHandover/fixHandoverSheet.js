import request from '@/utils/request'
import { MES_USER, MES_EQUIPMENT } from '@/common'
// 分页查询 ok
export function fetchList(pageNum, pageSize, data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/fixture/handover/getListByParam' + '?pageNum=' + pageNum + '&pageSize=' + pageSize,
    method: 'post',
    data
  })
}
// 根据id查询
export function getDetail(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/fixture/handover/selectByPrimaryKey',
    method: 'get',
    params: id
  })
}
// 夹具台账列表查询 ok
export function fetchList1(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/fixtureAccount/getEquipFixtureAccountByParam',
    method: 'post',
    data
  })
}
// 根据字典值查询仓库 ok
export function fetchlbList(query) {
  return request({
    url: MES_USER + 'sys/word/listWordListByParCode/',
    method: 'get',
    params: query
  })
}
// 新增 ok
export function createArticle(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/fixture/handover/insertSelective',
    method: 'post',
    data
  })
}
// 删除 ok
export function delById(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/fixture/handover/deleteByPrimaryKey',
    method: 'delete',
    params: id
  })
}
