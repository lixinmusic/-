import request from '@/utils/request';
import {MES_USER,MES_EQUIPMENT,MES_FILE,MES_ACTIVITI} from '@/common';

// 表格
export function fetchListdsy(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/warranty/listEquipWarranty',
    method: 'get',
    params: query
  })
}


// 编辑
export function updateArticle(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/warranty/updateEquipWarranty',
    method: 'put',
    data
  })
}

// 根据id查询的（编辑刚打开的页面）
export function evaluate(id) {
  return request({
    url: MES_EQUIPMENT + "/equipment/warranty/getEquipWarranty/" + id,
    method: "get",
    params: {}
  });
}


// 删除
export function fetchPv(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/warranty/deleteEquipWarranty/' + id,
    method: 'delete',
    params: {

    }
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

// 小表格接口
export function smallAblist(query) {
  return request({
    url: MES_EQUIPMENT+'equipment/file/listFlowFile',
    method: 'get',
    params: query
  })
}

// 重新验收
export function createArticlest(data) {
  return request({
    url: MES_EQUIPMENT+'equipment/warranty/reAcceptanceEquipWarranty',
    method: 'post',
    data
  })
}

// 重新验收的小表格删除接口（文彪）
export function deleteapp(query) {
  return request({
    url: MES_FILE+'file/delete',
    method: 'delete',
   params: query
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


// 根据固定资产编号折叠GET /equipment/warranty/listWarrantyAcceptanceByFixedAssetCode
export function fixedascode(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/warranty/listWarrantyAcceptanceByFixedAssetCode',
    method: 'get',
    params: query
  })
}

