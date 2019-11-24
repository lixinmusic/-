// 单据编码规则
import request from '@/utils/request';
import {MES_USER,MES_EQUIPMENT} from '@/common';

// 查询单据信息列表
export function fetchList(query) {
  return request({
    url: MES_USER+'sys/documentWord/listDocumentWord',
    method: 'get',
    params: query
  })
}
// 查询公司列表信息 所属组织下拉框
export function fetchCompany(query) {
  return request({
    url: MES_USER+'sys/organization/listCompany',
    method: 'get',
    params: query
  })
}
// 选择单据下拉框
export function fetchReceipt() {
  return request({
    url: MES_USER+'sys/word/listWordListByParName/document_word_type',
    method: 'get',
    params: {}
  })
}
// 所属组织树状图
export function getOrgTree(query) {
  return request({
    url: MES_USER+'sys/organization/listCompanyTree',
    method: 'get',
    params: query
  })
}
// 删除
export function delById(id) {
  return request({
    url: MES_USER+'sys/documentWord/deleteDocumentWord/' + id,
    method: 'delete',
    params: {}
  })
}
// 新增
export function createArticle(data) {
  return request({
	  url: MES_USER+'sys/documentWord/insertDocumentWord',
	  method: 'post',
	  data
  })
}
// 编辑
export function updateArticle(data) {
  return request({
    url: MES_USER+'sys/documentWord/updateDocumentWord',
    method: 'put',
    data
  })
}
//获取详情
export function getDetail(id){
	return request({
		url:MES_USER+'sys/documentWord/getDocumentWord/' + id,
		method:'get',
		params:{ }
	})
}
