import request from '@/utils/request'
import { MES_USER } from '@/common'
// 获取按钮权限
export function fetchButton(query) {
  return request({
    url: MES_USER + 'sys/button/listButtonByRole',
    method: 'get',
    params: query
  })
}
