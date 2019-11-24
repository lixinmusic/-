import request from '@/utils/request';
import { MES_USER, MES_EQUIPMENT } from '@/common';

// 表格   POST /equipment/equipreformrecord/selectByParam
export function fetchList(data) {
    return request({
      url: MES_EQUIPMENT + "equipment/equipreformrecord/selectByParam",
      method: "post",
      data
    });
}

// 导出 POST /
export function derivationst(data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/equipreformrecord/requipReformRecordExport',
        method: 'post',
        data
    })
}

// id查询  
export function selectById(query) {
    return request({
      url: MES_EQUIPMENT + "equipment/equipreformrecord/getById",
      method: "get",
      params: query
    });
}

// 编辑提交 

export function updateArticle(data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/equipreformrecord/update',
        method: 'put',
        data
    })
}

// 删除 DELETE /
export function fetchPv(query) {
  return request({
    url: MES_EQUIPMENT+'equipment/equipreformrecord/deleteById',
    method: 'delete',
    params: query

  })
}
