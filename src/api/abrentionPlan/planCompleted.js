import request from '@/utils/request';
import { MES_USER, MES_EQUIPMENT } from '@/common';

// 表格 POST /
export function fetchList(pageNum,pageSize,data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/equipReformCheckListPlan/getEquipReformCheckListPlanInfo' + '?pageNum=' + pageNum + '&pageSize=' + pageSize,
        method: 'post',
        data
    })
}



// 导出POST /
export function derivationst(data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/equipReformCheckListPlan/getEquipReformCheckListPlanInfoExportPath',
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
// 使用工厂的树接口
export function works(query) {
    return request({
        url: MES_USER + 'sys/organization/listChildCompany',
        method: 'get',
        params: query
    })
}


// 使用部门的树接口
export function section(query) {
    return request({
        url: MES_USER + 'sys/organization/orgCompanyByCode',
        method: 'get',
        params: query
    })
}



