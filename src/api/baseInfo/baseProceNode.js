import request from '@/utils/request'
import { MES_USER, MES_EQUIPMENT } from '@/common'
// 节点管理表格加载
export function fetchList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/node/getEquipNodesByCircuitKey',
    method: 'get',
    params: query
  })
}
export function fetchPageList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/node/getEquipnodes',
    method: 'get',
    params: query
  })
}
// 删除节点信息
export function deleteNode(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/node/delete',
    method: 'delete',
    params: id
  })
}

// 增加节点信息
export function createArticle(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/node/add',
    method: 'post',
    data
  })
}
// 判断节点key是否存在
export function fetchKey(key) {
  return request({
    url: MES_EQUIPMENT + 'equipment/node/isExistKey',
    method: 'get',
    params: key
  })
}
// 根据节点id查询节点信息
export function fetchDetail(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/node/selectById',
    method: 'get',
    params: id
  })
}
// 编辑修改节点信息
export function updateArticle(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/node/up',
    method: 'put',
    data
  })
}

// 节点人员表格加载
export function fetchUserList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/nodeUser/selectByNodeKey',
    method: 'get',
    params: query
  })
}

// 删除节点人员
export function deleteNodeUser(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/nodeUser/delete',
    method: 'delete',
    params: id
  })
}

// 增加节点人员
export function createUser(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/nodeUser/add',
    method: 'post',
    data
  })
}
// 根据id查询人员信息
export function fetchUser(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/nodeUser/selectById',
    method: 'get',
    params: id
  })
}
// 编辑修改人员信息
export function updateUser(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/nodeUser/up',
    method: 'put',
    data
  })
}
// 关联人员组织树点击加载表格
export function choosePerson(query) {
  return request({
    url: MES_USER + 'sys/person/listSysPerson',
    method: 'get',
    params: query
  })
}
