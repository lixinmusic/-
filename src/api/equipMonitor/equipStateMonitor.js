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
// 三个tab选项卡共用的接口 
export function fetchListByCode(query) {
    return request({
      url: MES_DEVICE_INTERACTION + "device/devicecontroller/queryAll",
        method: 'get',
        params: query
    });
}

// 刚进来的时候饼图的数据
export function ZBfetch(query) {
    return request({
        url: MES_DEVICE_INTERACTION + "device/devicecontroller/queryAllClass",
        method: 'get',
        params: query
    });
}
// 设备汇总接口
export function HZlistpo(workShopCode) {
    return request({
        url: MES_DEVICE_INTERACTION + "device/devicecontroller/querySum/" + workShopCode,
        method: 'get',
        params: {

        }
    });
}

// 点击色块里的占比图接口
export function kposta(fixedAssetCode) {
    return request({
        url: MES_DEVICE_INTERACTION + "device/devicecontroller/queryRatio/" + fixedAssetCode,
        method: 'get',
        params: {

        }
    });
}

// 时序图
export function SXTposul(fixedAssetCode) {
    return request({
        url: MES_DEVICE_INTERACTION + "device/devicecontroller/queryTimingDiagram/" + fixedAssetCode,
        method: 'get',
        params: {

        }
    });
}

// 根据设备类型模糊查询
export function fuzzyQuery(name) {
    return request({
        url: MES_EQUIPMENT + 'equipment/category/fuzzyQuery/' + name,
        method: 'get',
        params: {}
    })
}