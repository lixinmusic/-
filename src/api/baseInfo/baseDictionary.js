import request from '@/utils/request';
import {MES_USER,MES_EQUIPMENT} from '@/common';
// 查询字典树
export function fetchTree(query) {
  return request({
    url: MES_USER+'sys/word/listWordTree',
    method: 'get',
    params: query
  })
}
// 字典树点击加载表格
export function fetchListByCode(query) {
  return request({
    url: MES_USER+'sys/word/listWordListByParCode',
    method: 'get',
    params: query
  })
}
// 字典管理表格加载
export function fetchList(query) {
  return request({
    url: MES_USER+'sys/word/listWord',
    method: 'get',
    params: query
  })
}
// 删除字典信息
export function fetchCode(Code) {
  return request({
    url: MES_USER+'sys/word/deleteWord/' + Code,
    method: 'delete',
    param: { }
  })
}
// 增加字典信息
export function createArticle(data) {
  return request({
    url: MES_USER+'sys/word/insertWord',
    method: 'post',
    data
  })
}
// 根据字典编码查询字典信息
export function fetchDetail(Code) {
  return request({
    url: MES_USER+'sys/word/getWord/' + Code,
    method: 'get',
    params: { }
  })
}
// 编辑修改字典信息
export function updateArticle(data) {
  return request({
    url: MES_USER+'sys/word/updateWord',
    method: 'put',
    data
  })
}
// 修改字典排序
export function updateOrder(data) {
  return request({
    url: MES_USER+'sys/word/UpdateOrderWord',
    method: 'put',
    data
  })
}
