import request from '@/utils/request'
import { MES_EQUIPMENT } from '@/common'

// 条件查询 ok
export function fetchList(pageNum,pageSize,data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/unusedOutFactory/getListByParam' + '?pageNum=' + pageNum + '&pageSize=' + pageSize,
        method: 'post',
        data
    })
}
// 根据id查询 ok
export function getDetail(id) {
    return request({
        url: MES_EQUIPMENT + 'equipment/unusedOutFactory/selectById' + '?id=' + id,
        method: 'get',
        params: { }
    })
}
// 新增保存or提交 ok
export function saveFrom(data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/unusedOutFactory/addPost',
        method: 'post',
        data
    })
}
// 编辑保存or提交  ok
export function submitForm(data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/unusedOutFactory/upPost',
        method: 'put',
        data
    })
}
// 选择设备 ok
export function fetchInfoList(pageNum,pageSize,data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/unusedOutFactory/getUnusedData' + '?pageNum=' + pageNum + '&pageSize=' + pageSize,
        method: 'post',
        data
    })
}
// 删除 ok
export function delById(id) {
    return request({
        url: MES_EQUIPMENT + 'equipment/unusedOutFactory/delete' + '?id=' + id,
        method: 'delete',
        params: { }
    })
}
// 待办&已办

// 条件查询待办 ok
export function fetchNeedList(pageNum,pageSize,data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/unusedOutFactory/getUpcoming' + '?pageNum=' + pageNum + '&pageSize=' + pageSize,
        method: 'post',
        data
    })
}
// 条件查询已办 ok
export function fetchDoneList(pageNum,pageSize,data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/unusedOutFactory/getAlready' + '?pageNum=' + pageNum + '&pageSize=' + pageSize,
        method: 'post',
        data
    })
}
// 任务审批-修改审核状态(同意或退回)  ok
export function agreeApply(taskId,opinion,leaderPass,userId,id,data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/unusedOutFactory/operating' + '?taskId=' + taskId + '&opinion=' + opinion + '&leaderPass=' + leaderPass + '&userId=' + userId + '&id=' + id,
        method: 'get',
        data
    })
}
// 重新提交调整申请 ok
export function reCommit(taskId,fixedAssetCode,id,data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/unusedOutFactory/relaunch' + '?taskId=' + taskId + '&fixedAssetCode=' + fixedAssetCode + '&id=' + id,
        method: 'get',
        data
    })
}
// 打印 ok
export function fetchPrint(id) {
    return request({
        url: MES_EQUIPMENT + 'equipment/unusedOutFactory/print' + '?id=' + id,
        method: 'get',
        params: { }
    })
}

