import request from '@/utils/request'
import { MES_USER, MES_EQUIPMENT } from '@/common'
// 表格
export function fetchList(data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/account/getEquipAccountByParam',
        method: 'post',
        data
    })
}
// 导出
export function derivationst(data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/account/getExportPath',
        method: 'post',
        data
    })
}
// 删除
export function fetchPv(id) {
    return request({
        url: MES_EQUIPMENT + 'equipment/account/delete',
        method: 'delete',
        params: id
    })
}
// 编辑PUT /equipment/account/importDataUpdateById
export function updateArticle(data) {
    return request({
      url: MES_EQUIPMENT + "equipment/account/importDataUpdateById",
      method: "put",
      data
    });
}
// 编辑id的接口
export function evaluate(id) {
    return request({
        url: MES_EQUIPMENT + 'equipment/account/selectById',
        method: 'get',
        params: id
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

// 使用部门的树接口
export function section(query) {
    return request({
        url: MES_USER + 'sys/organization/orgCompanyByCode',
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



