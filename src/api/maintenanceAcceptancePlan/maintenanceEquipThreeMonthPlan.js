import request from '@/utils/request'
import { MES_USER, MES_EQUIPMENT, MES_ACTIVITI } from '@/common'

//查询3个月列表
export function fetchList(data) {
    return request({
      url: MES_EQUIPMENT + 'equipment/repair/plan/getThreeMonthPlan',
      method: 'post',
      data
    })
} 
//3个月查询导出
export function exportList(data) {
    return request({
      url: MES_EQUIPMENT + 'equipment/repair/plan/getThreeMonthPlanPath',
      method: 'post',
      data
    })
}