import request from '@/utils/request';
import {MES_USER,MES_EQUIPMENT} from '@/common';

// 表格
export function fetchList(pageNum,pageSize,data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/repair/externalRepair/getExternalRepairAccount'+"?pageNum="+pageNum+"&pageSize="+pageSize,
    method: 'post',
    data
  })
}



// 导出
export function derivationst(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/repair/externalRepair/getExportPath',
    method: 'post',
    data
  })
}

// id查询
export function selectById(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/repair/externalRepair/selectById',
    method: 'get',
    params: query
  })
}
// 编辑提交

export function updateArticle(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/repair/externalRepair/up',
    method: 'put',
    data
  })
}



