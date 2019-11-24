import request from '@/utils/request'
import { MES_EQUIPMENT } from '@/common'

// 条件查询 ok
export function fetchList(query) {
    return request({
        url: MES_EQUIPMENT + 'equipment/fixturePurchase/list',
        method: 'get',
        params: query
    })
}
// 删除 ok
export function delById(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/fixturePurchase/' + id,
    method: 'delete',
    params: {}
  })
}
// 根据id查询 ok
export function getDetail(id) {
    return request({
        url: MES_EQUIPMENT + 'equipment/fixturePurchase/' + id,
        method: 'get',
        params: { }
    })
}

// 查看 ok
export function fetchDetail(id) {
    return request({
        url: MES_EQUIPMENT + 'equipment/fixturePurchase/' + id,
        method: 'get',
        params: { }
    })
}
// 新增提交 ok
export function createArticle(data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/fixturePurchase/submit',
        method: 'post',
        data
    })
}
// 新增保存 ok
export function saveArticle(data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/fixturePurchase',
        method: 'post',
        data
    })
}
// 修改提交 ok
export function updateArticleSubmit(data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/fixturePurchase/submit',
        method: 'put',
        data
    })
}
// 修改保存 ok
export function updateSaveArticle(data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/fixturePurchase',
        method: 'put',
        data
    })
}

// 待办
// 条件查询待办信息  
export function fetchNeedList(query) {
    return request({
        url: MES_EQUIPMENT + 'equipment/fixturePurchase/needHandle',
        method: 'get',
        params: query
    })
}
// 任务审批 ok
export function agreeApply(query) {
    return request({
        url: MES_EQUIPMENT + 'equipment/fixturePurchase/taskApproval',
        method: 'get',
        params: query
    })
}
// 重新提交调整申请
export function reCommit(id, data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/fixturePurchase/adjustSub?taskId=' + id,
        method: 'put',
        data
    })
}
// 打印 OK
export function fetchPrint(query) {
    return request({
        url: MES_EQUIPMENT + 'equipment/fixturePurchase/print',
        method: 'get',
        params: query
    })
}
// 单已办
// 条件查询已办信息
export function fetchDoneList(query) {
    return request({
        url: MES_EQUIPMENT + 'equipment/fixturePurchase/alreadyHandle',
        method: 'get',
        params: query
    })
}
// 查询引用台账状态为闲置完好的信息列表
export function fetchInfoList(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/account/getEquipAccountByParam',
    method: 'post',
    data
  })
}
// 夹具备案单关联的夹具信息
export function fetchEquiplist(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipRecord/equipRecordNumList',
    method: 'get',
    params: query
  })
}
// 查询所有申请信息
export function fetchAllList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipPurchase/listAll',
    method: 'get',
    params: query
  })
}
export function fetchExportList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipPurchase/getDetailExportPath',
    method: 'post',
    params: query
  })
}
