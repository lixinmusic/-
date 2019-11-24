import request from '@/utils/request'
import { MES_USER, MES_EQUIPMENT, MES_FILE, MES_ACTIVITI } from '@/common'
// 列表查询 ok
export function fetchList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/fixtureOpenCheck/listOpenCheckByTerm',
    method: 'get',
    params: query
  })
}
// 新增 保存auditingType 1 提交auditingType 2 OK
export function createArticlest(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/fixtureOpenCheck/insertOpenCheck',
    method: 'post',
    data
  })
}
// 编辑 保存auditingType 1 提交auditingType 2 OK
export function updateArticle(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/fixtureOpenCheck/updateOpenCheckById',
    method: 'put',
    data
  })
}
// 删除 ok
export function delById(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/fixtureOpenCheck/deleteOpenCheck/' + id,
    method: 'delete',
    params: {

    }
  })
}
// 根据id查询 ok
export function fetchDetail(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/fixtureOpenCheck/getOpenCheckById/' + id,
    method: 'get',
    params: {

    }
  })
}
// 根据字典值查询仓库 ok
export function fetchlbList(query) {
  return request({
    url: MES_USER + 'sys/word/listWordListByParCode/',
    method: 'get',
    params: query
  })
}
// 新增里的小表格接口 获取文件
export function fileList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/file/listFlowFile',
    method: 'get',
    params: query
  })
}
// 小表格删除接口(编辑时的删除 陈状)
export function samllDelete(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/file/deleteFlowFile/' + id,
    method: 'delete',
    params: {

    }
  })
}
// 小表格删除接口(新增和重新验收时的删除 文彪)
export function samllapp(query) {
  return request({
    url: MES_FILE + 'file/delete',
    method: 'delete',
    params: query
  })
}
// 同意按钮和退回按钮 ok
export function updateAuditing(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/fixtureOpenCheck/updateAuditing',
    method: 'put',
    data
  })
}
// 重新提交 ok
export function newlYupdate(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/fixtureOpenCheck/reCommit',
    method: 'put',
    data
  })
}
// 获取node节点的名字  activiti/currentTaskByTaskId/{ taskId }
export function getNodeTask(id) {
  return request({
    url: MES_ACTIVITI + 'activiti/currentTaskByTaskId/' + id,
    method: 'get',
    params: {}
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
    url: MES_EQUIPMENT + 'sys/organization/orgCompanyByCode',
    method: 'get',
    params: query
  })
}
// 上传接口
export function uploadlist(param) {
  return request({ // 用axios发送post请求
    url: MES_FILE + 'file/upload', // 请求地址
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: param
  })
}
// 流转记录的接口 OK
export function circuList(processInstanceId) {
  return request({
    url: MES_ACTIVITI + 'activiti/selectHistoryTask/' + processInstanceId,
    method: 'get',
    params: {

    }
  })
}
// 编辑查看新增文件 equipment/file/insertFlowFile
export function insertFile(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/file/insertFlowFile',
    method: 'post',
    data
  })
}
// 获取当前用户信息
export function getCurrentUser() {
  return request({
    url: MES_USER + 'sys/user/getCurrentUser',
    method: 'get'
  })
}
// 引用夹具台账 ok
export function getschList(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/fixtureAccount/getAccountForOpenCheck',
    method: 'post',
    data
  })
}
// 流程图
export function flowsheet(processInstanceId) {
  return request({
    url: MES_ACTIVITI + 'activiti/process/trace/auto/' + processInstanceId,
    method: 'get',
    params: {

    }
  })
}
// 根据固定资产编号查询列表
export function fixedascode(query) {
    return request({
        url: MES_EQUIPMENT + 'equipment/fixtureOpenCheck/listOpenCkeckByFixedAssetCode',
        method: 'get',
        params: query
    })
}
// 待办查询列表 ok
export function fetchNeedList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/fixtureOpenCheck/listNeedDoOpenCheckByTerm',
    method: 'get',
    params: query
  })
}
// 发起人转办 ok
export function transferReplace(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/fixtureOpenCheck/transferToOffice',
    method: 'put',
    params: query
  })
}
// 已办查询列表
export function fetchDoneList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/fixtureOpenCheck/listAlreadyDoOpenCheckByTerm',
    method: 'get',
    params: query
  })
}
