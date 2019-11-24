import request from '@/utils/request'
import { MES_USER, MES_EQUIPMENT, MES_FILE, MES_ACTIVITI } from '@/common'

// 表格
export function fetchListdsy(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/allocation/list/handletype',
    method: 'get',
    params: query
  })
}

// 根据id查询的（编辑刚打开的页面）查询详情也是这个接口
export function evaluate(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/allocation/detail/' + id,
    method: 'get',
    params: {

    }
  })
}

// 流转记录的接口
export function circuList(processInstanceId) {
  return request({
    url: MES_ACTIVITI + 'activiti/selectHistoryTask/' + processInstanceId,
    method: 'get',
    params: {

    }
  })
}

// 获取当前用户信息
export function getCurrentUser() {
  return request({
    url: MES_USER + 'sys/user/getCurrentUser',
    method: 'get'
  })
}

// 打印
export function selist(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/allocation/transferRecord/' + id,
    method: 'get',
    params: {

    }
  })
}
// 发送通知
export function postMessage(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/allocation/postMessage',
    method: 'post',
    data
  })
}