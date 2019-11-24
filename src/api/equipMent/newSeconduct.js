import request from '@/utils/request';
import {MES_USER,MES_EQUIPMENT,MES_FILE,MES_ACTIVITI} from '@/common';

// 表格
export function fetchList(query) {
  return request({
    url: MES_EQUIPMENT+'equipment/acceptance/listNeedDoAcceptanceByTerm',
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
    url: MES_EQUIPMENT +'equipment/acceptance/updateAuditing',
    method: 'put',
    data
  })
}


// 编辑的小表格删除接口（壮）
export function updeletedata(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/file/deleteFlowFile/' + id,
    method: 'delete',
    params: {

    }
  })
}


// 编辑查看新增文件   insertFile,getCurrentUser
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


// 获取node节点的名字  activiti/currentTaskByTaskId/{ taskId }
export function getNodeTask(id) {
  return request({
    url: MES_ACTIVITI + 'activiti/currentTaskByTaskId/' + id,
    method: "get",
    params: {}
  });
}

// 在待办时退回的时候再进行的提交
export function newlYupdate(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/acceptance/reCommit',
    method: 'put',
    data
  })
}
