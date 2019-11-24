import request from '@/utils/request'
import { MES_USER, MES_EQUIPMENT, MES_ACTIVITI } from '@/common'

//查询12个月列表
export function fetchList(data) {
    return request({
      url: MES_EQUIPMENT + 'equipment/repair/plan/getTwelveMonthPlan',
      method: 'post',
      data
    })
} 
//12个月查询导出
export function exportList(data) {
    return request({
      url: MES_EQUIPMENT + 'equipment/repair/plan/getTwelveMonthPlanPath',
      method: 'post',
      data
    })
}