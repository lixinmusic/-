import request from '@/utils/request'
import { MES_EQUIPMENT } from '@/common'
// 表格
export function fetchList(pageNum, pageSize, data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/account/getEquipPurchaseStages' + '?pageNum=' + pageNum + '&pageSize=' + pageSize,
    method: 'post',
    data
  })
}

// 导出
export function exportList(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/account/getEquipPurchaseStageExportPath',
    method: 'post',
    data
  })
}

