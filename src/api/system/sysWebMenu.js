import request from '@/utils/request';
import {MES_USER,MES_EQUIPMENT} from '@/common';
// web菜单查询
export function getMenusWeb(query) {
  return request({
    url: MES_USER+'sys/webmenu/getMenus',
    method: 'get',
    params: query
  })
}
// 新增
export function createArticleWeb(data) {
  return request({
    url: MES_USER+'sys/webmenu/add',
    method: 'post',
    data
  })
}
// 删除
export function deleteBtnById(query) {
  return request({
    url: MES_USER+'sys/webmenu/delete',
    method: 'delete',
    params: query
  })
}
// 编辑
export function updateArticleWeb(data) {
  return request({
    url: MES_USER+'sys/webmenu/up',
    method: 'put',
    data
  })
}
// 根据条件查询
export function filterWeb(query) {
  return request({
    url: MES_USER+'sys/webmenu/getMenuByParam',
    method: 'get',
    params: query
  })
}
// 调整顺序
export function changeOrderWeb(data) {
  return request({
    url: MES_USER+'sys/webmenu/menuChangeOrder',
    method: 'put',
    data
  })
}

