
import request from '@/utils/request';
import {MES_USER,MES_EQUIPMENT,MES_FILE,MES_ACTIVITI} from '@/common';

// 表格
export function fetchListdsy(query) {
  return request({
    url: MES_EQUIPMENT+'equipment/openCheck/listOpenCheckByTerm',
    method: 'get',
    params: query
  })
}

// 新增
export function createArticlest(data) {
  return request({
    url: MES_EQUIPMENT+'equipment/openCheck/insertOpenCheck',
    method: 'post',
    data
  })
}

// 编辑
export function updateArticle(data) {
  return request({
    url: MES_EQUIPMENT+'equipment/openCheck/updateOpenCheckById',
    method: 'put',
    data
  })
}

// 删除
export function fetchPv(id) {
  return request({
    url: MES_EQUIPMENT+'equipment/openCheck/deleteOpenCheck/' + id,
    method: 'delete',
    params: {

    }
  })
}

// 根据id查询的（编辑刚打开的页面）
export function evaluate(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/openCheck/getOpenCheckById/' + id,
    method: 'get',
    params: {

    }
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
 
// 小表格删除接口(编辑时的删除 陈状)
export function samllDelete(id) {
  return request({
    url: MES_EQUIPMENT+'equipment/file/deleteFlowFile/' + id,
    method: 'delete',
    params: {

    }
  })
}
  
// 小表格删除接口(新增和重新验收时的删除 文彪)
export function samllapp(query) {
  return request({
    url: MES_FILE+'file/delete',
    method: 'delete',
   params: query
  })
}

// 使用公司的树接口
export function dendrogram(query) {
  return request({
    url: MES_EQUIPMENT +'equipment/orgnization/listCompanyTree',
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
    url: MES_EQUIPMENT +'sys/organization/orgCompanyByCode',
    method: 'get',
    params: query
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
    url: MES_ACTIVITI+'activiti/selectHistoryTask/'+ processInstanceId,
    method: 'get',
    params: {

    }
  })
}

// 生成设备质量信息报告按钮
export function producePv(id) {
  return request({
    url: MES_EQUIPMENT+'equipment/openCheck/createQualityReport/' + id,
    method: 'post',
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

// 一览表的数据表格
export function getschList(data) {
  return request({
    url: MES_EQUIPMENT + "equipment/basis/getAccountOpenCheckDTO",
    method: "post",
    data
  });
}

// 流程图 GET /activiti/process/trace/auto/{processInstanceId}
export function flowsheet(processInstanceId) {
  return request({
    url: MES_ACTIVITI + 'activiti/process/trace/auto/' + processInstanceId,
    method: 'get',
    params: {

    }
  })
}

// 根据固定资产编号折叠GET /
export function fixedascode(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/openCheck/listOpenCkeckByFixedAssetCode',
    method: 'get',
    params: query
  })
}



