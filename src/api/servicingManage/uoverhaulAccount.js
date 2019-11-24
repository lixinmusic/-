import request from '@/utils/request';
import { MES_USER, MES_EQUIPMENT } from '@/common';

// 表格
export function fetchList(pageNum, pageSize, data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/repair/divisionRepairAccount/getDivisionRepairAccount' + "?pageNum=" + pageNum + "&pageSize=" + pageSize,
        method: 'post',
        data
    })
}

// 导出
export function derivationst(data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/repair/divisionRepairAccount/getExportPath',
        method: 'post',
        data
    })
}

// id查询
export function selectById(query) {
    return request({
        url: MES_EQUIPMENT + 'equipment/repair/divisionRepairAccount/selectById',
        method: 'get',
        params: query
    })
}

// 编辑提交

export function updateArticle(data) {
    return request({
        url: MES_EQUIPMENT + 'equipment/repair/divisionRepairAccount/up',
        method: 'put',
        data
    })
}
 
// 判断项目编号是否存在
export function existence(query) {
    return request({
        url: MES_EQUIPMENT + 'equipment/repair/divisionRepairAccount/projectCodeIsExits',
        method: 'get',
        params: query
    })
}
// 转修按钮接口
export function transfersp(query) {
    return request({
        url: MES_EQUIPMENT + 'equipment/repair/divisionRepairAccount/changeRepairType',
        method: 'put',
        params: query
    })
} 
