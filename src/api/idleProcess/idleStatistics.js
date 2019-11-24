import request from '@/utils/request';
import { MES_USER, MES_EQUIPMENT, MES_FILE, MES_ACTIVITI } from '@/common';

// 表格
export function fetchList(query) {
    return request({
      url: MES_EQUIPMENT + "equipment/unusedStatistics/query",
      method: "get",
      params: query
    });
}



// 导出
export function derivationst(query) {
    return request({
      url: MES_EQUIPMENT + "equipment/unusedStatistics/export",
      method: "get",
      params: query
    });
}

// 使用工厂的树接口
export function dendrogram(query) {
    return request({
        url: MES_EQUIPMENT + 'equipment/orgnization/listCompanyTree',
        method: 'get',
        params: query
    })
}





