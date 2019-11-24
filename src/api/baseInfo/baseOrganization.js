import request from '@/utils/request';
import {MES_USER,MES_EQUIPMENT} from '@/common';

export function fetchList(query) {
  return request({
    url: MES_USER+'sys/organization/listSysOrganization',
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
    url: MES_USER+'sys/organization/sysOrganization/' + id,
    method: 'delete',
    params: {

    }
  })
}

export function createArticle(data) {
  return request({
    url: MES_USER+'sys/organization/sysOrganization',
    method: 'post',
    data
  })
}
// 编辑
export function updateArticle(data) {
  return request({
    url: MES_USER+'sys/organization/sysOrganization',
    method: 'put',
    data
  })
}
// 查看
export function look(id) {
  return request({
    url: MES_USER+'sys/organization/sysOrganization/' + id,
    method: 'get',
    params: {

    }
  })
}
// 编号是否已存在
export function doesitExist(orgCode) {
  return request({
    url: MES_USER+'sys/organization/' + orgCode,
    method: 'get',
    params: {

    }
  })
}


// 排序
export function drafting(data) {
  return request({
    url: MES_USER+'sys/organization/updateOrder',
    method: 'put',
    data
  })
}
// 编辑id的接口
export function evaluate(id) {
  return request({
    url: MES_USER+'sys/organization/sysOrganization/' + id,
    method: 'get',
    params: {

    }
  })
}


