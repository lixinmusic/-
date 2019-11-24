import request from '@/utils/request'
import { MES_USER, MES_EQUIPMENT } from '@/common'
export function fetchList(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/activitistatistics/activitySelectParamCount',
    method: 'post',
    data
  })
}
export function fetchFormType(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/activitistatistics/selectAllEquipActivitiFormType',
    method: 'get',
    params: query
  })
}
