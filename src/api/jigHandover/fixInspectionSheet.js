import request from '@/utils/request'
import { MES_USER, MES_EQUIPMENT } from '@/common'
// 分页查询 ok
export function fetchList(pageNum, pageSize, data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/fixture/check/getListByParam' + '?pageNum=' + pageNum + '&pageSize=' + pageSize,
    method: 'post',
    data
  })
}
// 根据id查询 ok
export function getDetail(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/fixture/check/selectByPrimaryKey',
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
// 新增 ok
export function createArticle(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/fixture/check/insertSelective',
    method: 'post',
    data
  })
}
// 编辑 ok
export function updateArticle(data) {
    return request({
      url: MES_EQUIPMENT + 'equipment/fixture/check/updateByPrimaryKeySelective',
      method: 'put',
      data
    })
  }
// 删除 ok
export function delById(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/fixture/check/deleteByPrimaryKey',
    method: 'delete',
    params: id
  })
}
