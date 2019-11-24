import request from '@/utils/request'
import { MES_EQUIPMENT } from '@/common'
// 安装完成确认单

// 条件查询安装完成确认单列表
export function fetchList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/openCheck/listInstall',
    method: 'get',
    params: query
  })
}
// 根据id查询安装完成情况 equipment/openCheck/getOpenCheckById/{id}
export function getDetail(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/openCheck/getOpenCheckById/' + id,
    method: 'get',
    params: { }
  })
}
// 修改安装完成确认
export function updateInstallFinish(data) {
  return request({
    url: MES_EQUIPMENT + 'equipment/openCheck/updateInstallFinishType',
    method: 'put',
    data
  })
}
// 生成设备质量信息报告
export function createQualityReport(id) {
  return request({
    url: MES_EQUIPMENT + 'equipment/openCheck/createQualityReport/' + id,
    method: 'post',
    params: { }
  })
}
export function fetchAllList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/openCheck/listInstallNoUser',
    method: 'get',
    params: query
  })
}
export function fetchExportList(query) {
  return request({
    url: MES_EQUIPMENT + 'equipment/openCheck/listInstallNoUserExport',
    method: 'get',
    params: query
  })
}
