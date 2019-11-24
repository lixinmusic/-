import request from '@/utils/request'
import { MES_USER, MES_EQUIPMENT } from '@/common'
// 列表查询 ok
export function fetchList(data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/fixtureAccount/getEquipFixtureAccountByParam',
        method: 'post',
        data
    })
}
// 导出 OK
export function exportList(data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/fixtureAccount/getExportPath',
        method: 'post',
        data
    })
}
// 删除
export function deleteById(id) {
    return request({
        url: MES_EQUIPMENT + 'equipment/fixtureAccount/delete',
        method: 'delete',
        params:id
    })
}
// 编辑 ok
export function updateArticle(data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/fixtureAccount/up',
        method: 'put',
        data
    })
}
// 根据id查询 ok
export function getDetail(id) {
    return request({
        url: MES_EQUIPMENT + 'equipment/fixtureAccount/selectById',
        method: 'get',
        params: id
    })
}
// 使用公司的树接口
export function dendrogram(query) {
    return request({
        url:  MES_EQUIPMENT+'equipment/orgnization/listCompanyTree',
        method: 'get',
        params: query
    })
}
// 使用部门的树接口
export function section(query) {
    return request({
        url:  MES_USER+'sys/organization/orgCompanyByCode',
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