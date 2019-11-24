import request from '@/utils/request'
import { MES_USER, MES_EQUIPMENT } from '@/common'
// 用户管理表格加载
export function fetchList(query) {
  return request({
    url: MES_USER + 'sys/user/listUser',
    method: 'get',
    params: query
  })
}
// 查询角色管理下拉
export function chooseRole(query) {
  return request({
    url: MES_USER + 'sys/role/getSelectInfo',
    method: 'get',
    params: query
  })
}
// 删除用户信息
export function deleteUser(Code) {
  return request({
    url: MES_USER + 'sys/user/deleteUser/' + Code,
    method: 'delete',
    param: { }
  })
}
// 新增用户信息
export function createArticle(data) {
  return request({
    url: MES_USER + 'sys/user/insertUser',
    method: 'post',
    data
  })
}
// 根据用户编号查询用户信息
export function fetchDetail(userCode) {
  return request({
    url: MES_USER + 'sys/user/getUser/' + userCode,
    method: 'get',
    param: { }
  })
}
// 修改用户信息
export function updateArticle(data) {
  return request({
    url: MES_USER + 'sys/user/updateUser',
    method: 'put',
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
// 重置用户密码
export function updatePassword(id) {
  return request({
    url: MES_USER + 'sys/user/resetPassword/' + id,
    method: 'put',
    param: { }
  })
}
// 判断用户名或者工号是否存在
export function checkUserName(data) {
  return request({
    url: MES_USER + 'sys/user/userIsExist',
    method: 'put',
    data
  })
}
// 替换用户
export function replacePerson(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/nodeUser/replaceApprovalUser',
    method: 'put',
    params: query
  })
}
