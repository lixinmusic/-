import request from '@/utils/request'
import { MES_EQUIPMENT } from '@/common'

export function fetchDayList(query) {
  return request({
    url: MES_EQUIPMENT + '/equipment/equipUnusedWarehouse/monthlyOverview/',
    method: 'get',
    params: query
  })
}
export function fetchInfoList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipUnusedWarehouse/queryDetail',
    method: 'get',
    params: query
  })
}
export function fetchExportList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipUnusedWarehouse/exportQueryDetail',
    method: 'get',
    params: query
  })
}
