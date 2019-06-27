import request from '@/utils/request'
export function models(userid, ID) {
  return request({
    url: 'modelResource/' + userid + '/' + ID + '/download',
    method: 'get'
  })
}
