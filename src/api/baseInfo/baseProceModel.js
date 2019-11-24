import request from '@/utils/request'
import { MES_USER, MES_EQUIPMENT, MES_ACTIVITI } from '@/common'
// 流程管理表格加载
export function fetchList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/circuit/getEquipCircuit',
    method: 'get',
    params: query
  })
}
// 删除流程信息
export function deleteProce(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/circuit/delete',
    method: 'delete',
    params: id
  })
}

// 增加流程信息
export function createArticle(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/circuit/add',
    method: 'post',
    data
  })
}
// 判断流程key是否存在
export function fetchKey(key) {
  return request({
    url: MES_EQUIPMENT + 'equipment/circuit/isExistKey',
    method: 'get',
    params: key
  })
}
// 根据流程id查询流程信息
export function fetchDetail(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/circuit/selectById',
    method: 'get',
    params: id
  })
}
// 编辑修改流程信息
export function updateArticle(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/circuit/up',
    method: 'put',
    data
  })
}
// 部署流程 activiti/deploye/{processName}
export function deployeProcess(name) {
  return request({
    url: MES_ACTIVITI + 'activiti/deploye/' + name,
    method: 'get',
    params: { }
  })
}
//流程图 读取资源，通过流程key
export function chartImg(processDefinitionKey) { 
	return request({
		url: MES_ACTIVITI + 'activiti/resource/processDefinitionKey',
    	method: 'get',
    	params: processDefinitionKey
	})
}
