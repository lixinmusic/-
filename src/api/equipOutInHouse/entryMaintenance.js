import request from '@/utils/request'
import { MES_EQUIPMENT } from '@/common'

// 条件查询 ok
export function fetchList(pageNum,pageSize,data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/factoryRepair/getListByParam' + '?pageNum=' + pageNum + '&pageSize=' + pageSize ,
        method: 'post',
        data
    })
}
// 根据id查询 ok
export function getDetail(id) {
    return request({
        url: MES_EQUIPMENT + 'equipment/factoryRepair/selectById' + '?id=' + id,
        method: 'get',
        params: {}
    })
}
// 新增保存or提交 ok
export function saveFrom(data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/factoryRepair/addPost',
        method: 'post',
        data
    })
}
// 编辑保存or提交 ok
export function submitForm(data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/factoryRepair/upPost',
        method: 'put',
        data
    })
}
// 查询引用报修设备信息列表 ok
export function fetchInfoList(query) {
    return request({
        url: MES_EQUIPMENT + 'equipment/allocation/list/equip',
        method: 'get',
        params: query
    })
}
// 删除 ok
export function delById(id) {
    return request({
        url: MES_EQUIPMENT + 'equipment/factoryRepair/delete' + '?id=' + id,
        method: 'delete',
        params: { }
    })
}
// 待办&已办

// 待办-->条件查询 ok
export function fetchNeedList(pageNum,pageSize,data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/factoryRepair/getUpcoming' + '?pageNum=' + pageNum + '&pageSize=' + pageSize     ,
        method: 'post',
        data
    })
}
// 任务审批-修改审核状态（同意或退回）ok
export function agreeApply(taskId,opinion,leaderPass,userId,id,data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/factoryRepair/operating' + '?taskId=' + taskId + '&opinion=' + opinion + '&leaderPass=' + leaderPass + '&userId=' + userId + '&id=' + id,
        method: 'get',
        data
    })
}
// 重新提交调整申请（重新发起流程）ok
export function reCommit(taskId,fixedAssetCode,id,data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/factoryRepair/relaunch' + '?taskId=' + taskId + '&fixedAssetCode=' + fixedAssetCode + '&id=' + id,
        method: 'get',
        data
    })
}
// 已办-->条件查询 ok
export function fetchDoneList(pageNum,pageSize,data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/factoryRepair/getAlready' + '?pageNum=' + pageNum + '&pageSize=' + pageSize     ,
        method: 'post',
        data
    })
}
// 打印  ok
export function fetchPrint(id) {
    return request({
        url: MES_EQUIPMENT + 'equipment/factoryRepair/print' + '?id=' + id,
        method: 'get',
        params: { }
    })
}
