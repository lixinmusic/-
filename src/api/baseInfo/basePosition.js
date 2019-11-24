import request from '@/utils/request';
import {MES_USER,MES_EQUIPMENT} from '@/common';
// 表格
export function fetchList(query) {
  return request({
    url: MES_USER+'sys/station/stations',
    method: 'get',
    params: query
  })
}
// 树
export function dendrogram(query) {
  return request({
    url: MES_USER+'sys/organization/listTree',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: MES_USER+'article/detail',
    method: 'get',
    params: {
      id
    }
  })
}
// 删除
export function fetchPv(id) {
  return request({
    url: MES_USER+'sys/station/' + id,
    method: 'delete',
    params: {

    }
  })
}
// 新增
export function createArticle(data) {
  return request({
    url: MES_USER+'sys/station/add',
    method: 'post',
    data
  })
}
// 编辑
export function updateArticle(data) {
  return request({
    url: MES_USER+'sys/station/update',
    method: 'put',
    data
  })
}
// 查看
export function look(id) {
  return request({
    url: MES_USER+'sys/station/' + id,
    method: 'get',
    params: {

    }
  })
}
// 新增里岗位类别下拉框GET 
export function listdown() {
  return request({
    url: MES_USER+'sys/word/listWordListByParName/station_type',
    method: 'get',
    params: {}
  })
}
// 新增里岗位等级下拉框
export function listdownstyp() {
  return request({
    url: MES_USER+'sys/word/listWordListByParName/station_stage',
    method: 'get',
    params: {}
  })
}

