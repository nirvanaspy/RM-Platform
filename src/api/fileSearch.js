import request from '@/utils/request'
export function filesearch(query) {
  return request({
    url: '/modelResource',
    method: 'get',
    params: query
  })
}
export function modelconditon(data) {
  return request({
    url: '/modelResource/KeyWord',
    method: 'post',
    headers: {
      'content-type': 'application/json;charset=utf-8'
    },
    data
  })
}
// export function filesearch() {
//   return request({
//     url: '/modelResource/by/user',
//     method: 'get'
//   })
// }
export function toolsearch(query) {
  return request({
    url: '/tools/list',
    method: 'get',
    params: query
  })
}
