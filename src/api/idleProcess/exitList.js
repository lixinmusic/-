import request from '@/utils/request';
import { MES_USER, MES_EQUIPMENT, MES_FILE, MES_ACTIVITI } from '@/common';

// 表格
export function fetchList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/outWarehouse/form/query',
    method: 'get',
    params: query
  })
}


// 流转记录的接口
export function circuList(processInstanceId) {
  return request({
    url: MES_ACTIVITI + 'activiti/selectHistoryTask/' + processInstanceId,
    method: 'get',
    params: {

    }
  })
}

// 确认出库按钮
export function confirmation(id) {
  return request({
    url: MES_EQUIPMENT + "equipment/outWarehouse/form/out/" + id + "/" + 1,
    method: 'post',
    params: {

    }
  })
}

// 查看详情id接口
export function evaluate(id) {
  return request({
    url: MES_EQUIPMENT + "equipment/unusedStart/form/detail/" + id,
    method: "get",
    params: {

    }
  })
}

// 使用部门的树接口
export function dendrogram(query) {
  return request({
    url: MES_EQUIPMENT +'equipment/orgnization/listTree',
    method: 'get',
    params: query
  })
}



// 查询设备地址树
export function fetchTree(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/address/listtree',
    method: 'get',
    params: query
  })
}