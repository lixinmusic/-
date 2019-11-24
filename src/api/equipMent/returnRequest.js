import request from '@/utils/request'
import { MES_EQUIPMENT } from '@/common'

// 条件查询列表 ok
export function fetchList(pageNum,pageSize,recordCode,fixedAssetCode,equipmentName,model,startDate,endDate,auditingType,data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/equipReturn/list'  + '?pageNum=' + pageNum + '&pageSize=' + pageSize + '&recordCode=' + recordCode + '&fixedAssetCode=' + fixedAssetCode + '&equipmentName=' + equipmentName + '&model=' + model + '&startDate=' + startDate + '&endDate=' +endDate + '&auditingType=' + auditingType,
        method: 'get',
        data
    })
}
// 根据id查询 ok
export function getDetail(id) {
    return request({
        url: MES_EQUIPMENT + 'equipment/equipReturn/' + id,
        method: 'get',
        params: { }
    })
}
// 新增保存 ok
export function saveFrom(data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/equipReturn',
        method: 'post',
        data
    })
}
// 编辑保存 ok
export function changeSaveFrom(data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/equipReturn',
        method: 'put',
        data
    })
}
// 新增提交 ok
export function submitForm(data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/equipReturn/submit',
        method: 'post',
        data
    })
}
// 编辑提交 ok
export function changeSubmitForm(data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/equipReturn/submit',
        method: 'put',
        data
    })
}
// 选择设备 ok
export function fetchInfoList(data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/account/selectAccountForEquipReturn',
        method: 'post',
        data
    })
}
// 删除 ok
export function delById(id) {
    return request({
        url: MES_EQUIPMENT + 'equipment/equipReturn/' + id,
        method: 'delete',
        params: { }
    })
}

// 待办&已办

// 条件查询待办 ok
export function fetchNeedList(pageNum,pageSize,recordCode,fixedAssetCode,equipmentName,model,startDate,endDate,data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/equipReturn/needHandle' + '?pageNum=' + pageNum + '&pageSize=' + pageSize + '&recordCode=' + recordCode + '&fixedAssetCode=' + fixedAssetCode + '&equipmentName=' + equipmentName + '&model=' + model + '&startDate=' + startDate + '&endDate=' +endDate,
        method: 'get',
        data
    })
}
// 已办条件查询
export function fetchDoneList(pageNum,pageSize,recordCode,fixedAssetCode,equipmentName,model,startDate,endDate,auditingType,data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/equipReturn/alreadyHandle' + '?pageNum=' + pageNum + '&pageSize=' + pageSize + '&recordCode=' + recordCode + '&fixedAssetCode=' + fixedAssetCode + '&equipmentName=' + equipmentName + '&model=' + model + '&startDate=' + startDate + '&endDate=' +endDate + '&auditingType=' + auditingType,
        method: 'get',
        data
    })
}
// 任务审批-修改审核状态(同意或退回) ok
export function agreeApply(opinion,leaderPass,taskId,recordId,data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/equipReturn/taskApproval' + '?opinion=' + opinion + '&leaderPass=' + leaderPass + '&taskId=' + taskId + '&recordId=' + recordId,
        method: 'get',
        data
    })
}
// 重新提交调整申请 ok
export function reCommit(taskId,data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/equipReturn/adjustSub' + '?taskId=' + taskId,
        method: 'put',
        data
    })
}
// 打印 ok
export function fetchPrint(recordId,processInstanceId) {
    return request({
        url: MES_EQUIPMENT + 'equipment/equipReturn/print' + '?recordId=' + recordId + '&processInstanceId=' + processInstanceId,
        method: 'get',
        params: { }
    })
}
export function fetchExportList(data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/allocation/export',
        method: 'post',
        data
    })
}
