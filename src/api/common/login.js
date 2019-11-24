import request from '@/utils/request';
import {MES_USER,MES_EQUIPMENT} from '@/common';

export function login(username, password) {
  const data = {
    loginName:username,
    password:password,
    rememberMe:false
  }
  return request({
    url: MES_USER+'sys/user/authenticate',
    method: 'post',
    data
  })
}
export function getCurrentUser() {
  return request({
    url: MES_USER+'sys/user/getCurrentUser',
    method: 'get'
  })
}
