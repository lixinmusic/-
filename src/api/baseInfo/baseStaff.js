import request from '@/utils/request';
import {MES_USER,MES_EQUIPMENT} from '@/common';
// 表格
export function fetchList(query) {
  return request({
    url: MES_USER+'sys/person/listSysPerson',
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
    url: MES_USER+'/article/detail',
    method: 'get',
    params: {
      id
    }
  })
}
// 删除
export function fetchPv(id) {
  return request({
    url: MES_USER+'sys/person/sysPerson/' + id,
    method: 'delete',
    params: {

    }
  })
}
// 新增
export function createArticle(data) {
  return request({
    url: MES_USER+'sys/person/sysPerson',
    method: 'post',
    data
  })
}
// 编辑
export function updateArticle(data) {
  return request({
    url: MES_USER+'sys/person/sysPerson',
    method: 'put',
    data
  })
}

// 新增里的岗位名称的模糊查询接口
export function fuzzyQuery(staName) {
  return request({
    url: MES_USER+'sys/station/likeName/' + staName,
    method: 'get',
    params: {

    }
  })
}
// 查看
export function look(id) {
  return request({
    url: MES_USER+'sys/person/sysPerson/' + id,
    method: 'get',
    params: {

    }
  })
}
// 工号是否已存在
export function doesitExist(workNumber) {
  return request({
    url: MES_USER+'sys/person/' + workNumber,
    method: 'get',
    params: {

    }
  })
}
// 新增里的所属组织树
export function newlyiNcreased(query) {
  return request({
    url: MES_USER+'sys/organization/listTree',
    method: 'get',
    params: query
  })
}
// id去赋值
export function evaluate(id) {
  return request({
    url: MES_USER+'sys/person/sysPerson/' + id,
    method: 'get',
    params: {

    }
  })
}
