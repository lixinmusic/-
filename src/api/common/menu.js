import request from '@/utils/request';
import {MES_USER,MES_EQUIPMENT} from '@/common';

export function getMenuList() {
  return request({
    url: MES_USER+'sys/user/ListMenuByToken',
    method: 'get'
  })
}
