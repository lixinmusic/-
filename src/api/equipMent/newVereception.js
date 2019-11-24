import request from '@/utils/request';
import {MES_USER,MES_EQUIPMENT,MES_FILE,MES_ACTIVITI} from '@/common';

// 表格
export function fetchList(query) {
  return request({
    url: MES_EQUIPMENT+'equipment/acceptance/listEquipAcceptance',
    method: 'get',
    params: query
  })
}


// 新增里的小表格接口
export function smallAblist(query) {
  return request({
    url: MES_EQUIPMENT+'equipment/file/listFlowFile',
    method: 'get',
    params: query
  })
}

// 小表格删除接口
export function samllDelete(id) {
  return request({
    url: MES_EQUIPMENT+'equipment/file/deleteFlowFile/' + id,
    method: 'delete',
    params: {

    }
  })
}

// 上传接口
export function uploadlist(param){
    return request({ // 用axios发送post请求
      url: MES_FILE + 'file/upload', // 请求地址
      method: 'post',
      headers:{
              'Content-Type':'multipart/form-data'
      },
      data: param
    })
  }

// 流转记录的接口
export function circuList(processInstanceId) {
  return request({
    url: MES_ACTIVITI+'activiti/selectHistoryTask/' + processInstanceId,
    method: 'get',
    params: {

    }
  })
}



// 同意按钮和退回按钮
export function updateAuditing(data) {
  return request({
    url: MES_EQUIPMENT+'equipment/openCheck/updateAuditing',
    method: 'put',
    data
  })
}


// 确认接收按钮
export function confirmation(id, yesyp, names) {
  return request({
    url: MES_EQUIPMENT + 'equipment/acceptance/acceptance/' + id + "?assetOwnershipCompanyCode=" + yesyp +"&assetOwnershipCompany="+names,
    method: 'put',
    params: {

    }
  })
}

// 小表格删除接口（壮）
export function updeletedata(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/file/deleteFlowFile/' + id,
    method: 'delete',
    params: {

    }
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