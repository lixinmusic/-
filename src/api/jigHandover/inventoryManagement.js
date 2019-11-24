import request from '@/utils/request'
import { MES_USER, MES_EQUIPMENT } from '@/common'
// 分页查询 ok
export function fetchList(pageNum, pageSize, data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/fixture/mangage/getListByParam' + '?pageNum=' + pageNum + '&pageSize=' + pageSize,
    method: 'post',
    data
  })
}
// 夹具明细
export function getDetail(pageNum, pageSize, data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/fixture/mangage/getDetailsByDay' + '?pageNum=' + pageNum + '&pageSize=' + pageSize,
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
