import request from '@/utils/request';
import { MES_USER, MES_EQUIPMENT, MES_FILE, MES_ACTIVITI, MES_DEVICE_INTERACTION } from '@/common';

// 查询设备地址树
export function fetchTree(query) {
    return request({
        url: MES_EQUIPMENT + 'equipment/address/listtree',
        method: 'get',
        params: query
    })
}
//俩列表的接口（共用） device/statushistory/selectByParam  
export function fetchListByCode(data) {
    return request({
      url: MES_DEVICE_INTERACTION + "device/statushistory/selectByParam",
      method: "post",
      data
    });
}

// 导出  
export function derivationst(data) {
    return request({
        url: MES_DEVICE_INTERACTION + 'device/statushistory/statusHistoryExport',
        method: 'post',
        data
    })
}

// 时序图
export function SXTechart(data) {
    return request({
        url: MES_DEVICE_INTERACTION + 'device/statushistory/selectTimeSequentialByEquipmentCode',
        method: 'post',
        data
    })
}



