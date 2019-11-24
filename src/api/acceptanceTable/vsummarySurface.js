import request from '@/utils/request';
import {MES_USER,MES_EQUIPMENT} from '@/common';

// 表格
export function fetchList(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/plan/getPlanTotalInfo',
    method: 'post',
    data
  })
}



// 导出
export function derivationst(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/plan/getPlanTotalInfoPath',
    method: 'post',
    data
  })
}


// 使用公司的树接口
export function dendrogram(query) {
  return request({
    url:  MES_EQUIPMENT+'equipment/orgnization/listCompanyTree',
    method: 'get',
    params: query
  })
}

/* // 使用部门的树接口
export function section(query) {
  return request({
    url:  MES_EQUIPMENT+'equipment/orgnization/listTree',
    method: 'get',
    params: query
  })
} */
// 使用部门的树接口
export function section(query) {
  return request({
    url: MES_USER + 'sys/organization/orgCompanyByCode',
    method: 'get',
    params: query
  })
}


