import request from '@/utils/request';
import {MES_USER,MES_EQUIPMENT} from '@/common';

// 表格  
export function fetchList(pageNum,pageSize,data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/fixedAssetAccount/getEquipAccountByParam'+"?pageNum="+pageNum+"&pageSize="+pageSize,
    method: 'post',
    data
  })
}



// 导出  
export function derivationst(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/fixedAssetAccount/getExportPath',
    method: 'post',
    data
  })
}

// id查询 
export function selectById(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/fixedAssetAccount/selectById',
    method: 'get',
    params: query
  })
}
// 编辑提交  
export function updateArticle(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/fixedAssetAccount/up',
    method: 'put',
    data
  })
}
// 删除   
export function fetchPv(id) {
    return request({
      url: MES_EQUIPMENT + "equipment/fixedAssetAccount/delete",
      method: "delete",
      params: id
    });
}

// 新增提交  
export function addpost(data) {
    return request({
      url: MES_EQUIPMENT + "equipment/fixedAssetAccount/add",
      method: "post",
      data
    });
}

// 判断固定资产编号是否被使用    
export function propertl(fixedAssetCode) {
  return request({
    url: MES_EQUIPMENT + 'equipment/fixedAssetAccount/getCountByFixedAssetCode',
    method: 'get',
    params: fixedAssetCode
  })
}
// 使用公司的树接口
export function dendrogram(query) {
    return request({
        url: MES_EQUIPMENT + 'equipment/orgnization/listCompanyTree',
        method: 'get',
        params: query
    })
}
// 使用部门的树接口
export function section(query) {
    return request({
        url: MES_USER + 'sys/organization/orgCompanyByCode',
        method: 'get',
        params: query
    })
}
// 使用工厂的树接口
export function works(query) {
    return request({
        url: MES_USER + 'sys/organization/listChildCompany',
        method: 'get',
        params: query
    })
}


// 新增里的设备名称的模糊查询接口
export function fuzzyQuery(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/equipCategoryOffice/getNameAndCodeByLikeName',
    method: 'get',
    params: query
  })
}
