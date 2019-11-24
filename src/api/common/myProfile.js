import request from '@/utils/request';
import {MES_USER,MES_EQUIPMENT} from '@/common';
// 获取当前用户信息
export function getCurrentUser() {
  return request({
    url: MES_USER+'sys/user/getCurrentUser',
    method: 'get'
  })
}
// 获取人员的信息
export function fetchPerson(workNumber) {
  return request({
    url: MES_USER+'sys/person/workNumber/' + workNumber,
    method: 'get',
    params: { }
  })
}
// 修改用户信息
export function updatePerson(data) {
  return request({
    url: MES_USER+'sys/user/updateUserInfo',
    method: 'put',
    data
  })
}
// 修改用户密码
export function updatePassword(data) {
  return request({
    url: MES_USER+'sys/user/updatePassword',
    method: 'put',
    data
  })
}
