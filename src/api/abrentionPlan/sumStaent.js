import request from '@/utils/request';
import { MES_USER, MES_EQUIPMENT } from '@/common';

// 表格 POST /
export function fetchList(pageNum, pageSize, data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/equipReformCheckListPlan/getEquipReformCheckListPlanStatistics' + '?pageNum=' + pageNum + '&pageSize=' + pageSize,
        method: 'post',
        data
    })
}



// 导出 POST /
export function derivationst(data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/equipReformCheckListPlan/getEquipReformCheckListPlanStatisticsExportPath',
        method: 'post',
        data
    })
}


// 使用公司的树接口
export function dendrogram(query) {
    return request({
        url: MES_EQUIPMENT + 'equipment/orgnization/listCompanyTree',
        method: 'get',
        params: query
    })
}

/* // 使用部门的树接口
export function section(query) {
  return request({
    url:  MES_EQUIPMENT+'equipment/orgnization/listTree',
    method: 'get',
    params: query
  })
} */
// 使用部门的树接口
export function section(query) {
    return request({
        url: MES_USER + 'sys/organization/orgCompanyByCode',
        method: 'get',
        params: query
    })
}


