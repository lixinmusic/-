import request from '@/utils/request';
import {MES_USER,MES_EQUIPMENT} from '@/common';
// 角色管理表格加载
export function fetchList(query) {
  return request({
    url: MES_USER+'sys/role/getRoles',
    method: 'get',
    params: query
  })
}
// 删除角色信息
export function deleteRole(id) {
  return request({
    url: MES_USER+'sys/role/delete',
    method: 'delete',
    params: id
  })
}
// 获取web权限
export function fetchWeb(query) {
  return request({
    url: MES_USER+'sys/role/getWebPurview',
    method: 'get',
    params: query
  })
}
// 获取pda权限
export function fetchPda(query) {
  return request({
    url: MES_USER+'sys/role/getPdaPurview',
    method: 'get',
    params: query
  })
}
// 获取app权限
export function fetchApp(query) {
  return request({
    url: MES_USER+'sys/role/getAppPurview',
    method: 'get',
    params: query
  })
}

// 增加角色信息
export function createArticle(data) {
  return request({
    url: MES_USER+'sys/role/add',
    method: 'post',
    data
  })
}
// 编辑修改角色信息
export function updateArticle(data) {
  return request({
    url: MES_USER+'sys/role/up',
    method: 'put',
    data
  })
}
// 查看角色详情
export function fetchDetail(id) {
  return request({
    url: MES_USER+'article/detail',
    method: 'get',
    params: { id }
  })
}
