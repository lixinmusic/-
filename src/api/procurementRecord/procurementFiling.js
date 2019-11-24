import request from '@/utils/request'
import { MES_EQUIPMENT } from '@/common'

// 条件查询列表 ok
export function fetchList(pageNum,pageSize,documentWordCode,dctualOrgName,auditingType,data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/recordPurchase/list' + '?pageNum=' + pageNum + '&pageSize=' + pageSize + '&documentWordCode=' + documentWordCode + '&dctualOrgName=' + dctualOrgName + '&auditingType=' + auditingType,
        method: 'get',
        data
    })
}
// 根据id查询 ok
export function getDetail(id) {
    return request({
        url: MES_EQUIPMENT + 'equipment/recordPurchase/' + id,
        method: 'get',
        params: { }
    })
}
// 新增保存 OK
export function saveArticle(data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/recordPurchase',
        method: 'post',
        data
    })
}
// 新增提交 ok
export function createArticle(data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/recordPurchase/submit',
        method: 'post',
        data
    })
}
// 修改（修改保存）ok
export function updateArticle(data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/recordPurchase',
        method: 'put',
        data
    })
}
// 修改提交 ok
export function updateArticleSubmit(data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/recordPurchase/submit',
        method: 'put',
        data
    })
}
// 删除 ok
export function delById(id) {
    return request({
        url: MES_EQUIPMENT + 'equipment/recordPurchase/' + id,
        method: 'delete',
        params: {}
    })
}
// 待办
// 条件查询待办信息 ok
export function fetchNeedList(pageNum,pageSize,documentWordCode,dctualOrgName,data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/recordPurchase/needHandle' + '?pageNum=' + pageNum + '&pageSize=' + pageSize + '&documentWordCode=' + documentWordCode + '&dctualOrgName=' + dctualOrgName,
        method: 'get',
        data
    })
}
// 任务审批 
export function agreeApply(query) {
    return request({
        url: MES_EQUIPMENT + 'equipment/recordPurchase/taskApproval/',
        method: 'get',
        params: query
    })
}
// 重新提交调整申请 ok
export function reCommit(id, data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/recordPurchase/adjustSub?taskId=' + id,
        method: 'put',
        data
    })
}
// 打印
export function fetchPrint(query) {
    return request({
        url: MES_EQUIPMENT + 'equipment/recordPurchase/print',
        method: 'get',
        params: query
    })
}
// 已办
// 条件查询已办信息 ok
export function fetchDoneList(pageNum,pageSize,documentWordCode,dctualOrgName,auditingType,data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/recordPurchase/alreadyHandle' + '?pageNum=' + pageNum + '&pageSize=' + pageSize + '&documentWordCode=' + documentWordCode + '&dctualOrgName=' + dctualOrgName + '&auditingType=' + auditingType,
        method: 'get',
        data
    })
}
// 查询引用台账状态为闲置完好的信息列表 ok
export function fetchInfoList(data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/account/getEquipAccountByParam',
        method: 'post',
        data
    })
}
export function fetchAllList(query) {
    return request({
        url: MES_EQUIPMENT + 'equipment/equipRecord/listAll',
        method: 'get',
        params: query
    })
}
export function fetchExportList(query) {
    return request({
        url: MES_EQUIPMENT + 'equipment/equipRecord/getDetailExportPath',
        method: 'post',
        params: query
    })
}
