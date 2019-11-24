import request from '@/utils/request';
import { MES_USER, MES_EQUIPMENT } from '@/common';

// 表格 
export function fetchList(pageNum, pageSize,data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/equipReformCheckListPlan/getAcceptanceShouldPlan'+'?pageNum=' + pageNum + '&pageSize=' + pageSize,
        method: 'post',
        data
    })
}



// 导出 POST /
export function derivationst(data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/equipReformCheckListPlan/getAcceptanceShouldPlanExportPath',
        method: 'post',
        data
    })
}

