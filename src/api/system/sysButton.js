import request from '@/utils/request';
import {MES_USER,MES_EQUIPMENT} from '@/common';
// 按钮
export function getMenusWeb(query) {
  return request({
    url: MES_USER+'sys/webmenu/getMenus',
    method: 'get',
    params: query
  })
}
// 新增
export function createArticle(data) {
  return request({
    url: MES_USER+'sys/button/insertWord',
    method: 'post',
    data
  })
}
// 删除
export function deleteBtnById(data) {
  return request({
    url: MES_USER+'sys/button/deleteButton',
    method: 'delete',
    data
  })
}
// 编辑
export function updateArticle(data) {
  return request({
    url: MES_USER+'sys/button/updateButton',
    method: 'put',
    data
  })
}
// 根据条件查询
export function filterWeb(query) {
  return request({
    url: MES_USER+'sys/button/listButton',
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
