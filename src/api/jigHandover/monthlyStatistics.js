import request from '@/utils/request'
import { MES_USER, MES_EQUIPMENT } from '@/common'
// 分页查询 ok
export function fetchList(pageNum, pageSize, data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/fixture/mangage/statistics' + '?pageNum=' + pageNum + '&pageSize=' + pageSize,
    method: 'post',
    data
  })
}
// 夹具月度统计明细
export function getDetail(pageNum, pageSize, data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/fixture/mangage/getDetailsByMonth' + '?pageNum=' + pageNum + '&pageSize=' + pageSize,
        method: 'post',
        data
    })
}
