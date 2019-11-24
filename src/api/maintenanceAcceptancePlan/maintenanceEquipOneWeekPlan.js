import request from '@/utils/request'
import { MES_USER, MES_EQUIPMENT, MES_ACTIVITI } from '@/common'

//查询一周列表
export function fetchList(data) {
    return request({
      url: MES_EQUIPMENT + 'equipment/repair/plan/getOneWeekPlan',
      method: 'post',
      data
    })
} 
//一周查询导出
export function exportList(data) {
    return request({
      url: MES_EQUIPMENT + 'equipment/repair/plan/getOneWeekPlanPath',
      method: 'post',
      data
    })
}