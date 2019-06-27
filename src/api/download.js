import request from '@/utils/request'
/* 模型资源下载 */
export function models(userid, ID) {
  return request({
    url: 'modelResource/' + userid + '/' + ID + '/download',
    method: 'get'
  })
}
/* 模型资源下载 */
export function standars(userid, ID) {
  return request({
    url: 'standards/' + userid + '/' + ID + '/download',
    method: 'get'
  })
}
/* 公共算法服务下载 */
export function algorithmAndServer(userid, ID) {
  return request({
    url: 'algorithmAndServer/' + userid + '/' + ID + '/download',
    method: 'get'
  })
}
/* 工具软件服务下载 */
export function toolsAndSoftware(userid, ID) {
  return request({
    url: 'toolsAndSoftware/' + userid + '/' + ID + '/download',
    method: 'get'
  })
}
