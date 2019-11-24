import request from '@/utils/request'
import { MES_MESSAGE, MES_EQUIPMENT } from '@/common'
// 获取流程单据信息
export function getFormList(data) {
  return request({
    url: MES_MESSAGE + 'message/ordinaryformmessage/selectByParam',
    method: 'post',
    data
  })
}
export function getFiveFormList(data) {
  return request({
    url: MES_MESSAGE + 'message/ordinaryformmessage/selectTopFiveOrdinaryFormMessage',
    method: 'post',
    data
  })
}
// 获取普通消息
export function getMessageList(data) {
  return request({
    url: MES_MESSAGE + 'message/ordinarymessage/selectByParam',
    method: 'post',
    data
  })
}
export function getFiveMessageList(data) {
  return request({
    url: MES_MESSAGE + 'message/ordinarymessage/selectTopFiveOrdinaryMessage',
    method: 'post',
    data
  })
}
// 修改消息状态
export function updateMessage(data) {
  return request({
    url: MES_MESSAGE + 'message/ordinarymessage/updateOrdinaryMessage',
    method: 'put',
    data
  })
}
// 确认设备到货超时消息
export function equipmessage(data) {
  return request({
    url: MES_EQUIPMENT + '/equipment/receiptremind/equipMessage',
    method: 'put',
    data
  })
}
// 查询设备到货超时消息
export function getMessageById(query) {
  return request({
    url: MES_EQUIPMENT + '/equipment/receiptremind/selectByPrimaryKey',
    method: 'get',
    params: query
  })
}
// 修改单据状态
export function updateFormMessage(query) {
  return request({
    url: MES_MESSAGE + 'message/ordinaryformmessage/updateOrdinaryFormMessageById',
    method: 'put',
    params: query
  })
}
