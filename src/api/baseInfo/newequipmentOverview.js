import request from '@/utils/request'
import { MES_USER, MES_EQUIPMENT } from '@/common'
// 表格
export function fetchList(data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/basis/getEquipBasisDTO',
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
// 删除
export function fetchPv(id) {
    return request({
        url: MES_EQUIPMENT + 'equipment/basis/delete',
        method: 'delete',
        params: id
    })
}

// 编辑PUT /equipment/basis/importDataUpdateByFixedAssetCode
export function updateArticle(data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/basis/importDataUpdateByFixedAssetCode',
        method: 'put',
        data
    })
}

// 判断固定资产编号是否被使用
export function propertl(fixedAssetCode) {
    return request({
        url: MES_EQUIPMENT + 'equipment/basis/getCountByFixedAssetCode',
        method: 'get',
        params: fixedAssetCode
    })
}

// 判断型号规格是否被使用
export function vrnorms(model) {
    return request({
        url: MES_EQUIPMENT + 'equipment/basis/getCountByModel',
        method: 'get',
        params: model
    })
}


// 导出
export function derivationst(data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/basis/getExportPath',
        method: 'post',
        data
    })
}

// 编辑id的接口
export function examine(id) {
    return request({
        url: MES_EQUIPMENT + 'equipment/basis/selectById',
        method: 'get',
        params: id
    })
}



