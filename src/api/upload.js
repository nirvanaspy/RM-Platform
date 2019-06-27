import request from '@/utils/request'
export function postMerge(data) {
  return request({
    url: 'files/chunks/merge',
    method: 'post',
    data
  })
}
// export function commitdescrition(data) {
//   return request({
//     url: 'files/chunks/information',
//     method: 'post',
//     data
//   })
// }
/**
 * 文件合并完成后后端存文件
 * @param  data
 * @param  id
 */
export function realupload(id, data, parenid) {
  return request({
    url: 'resource-files/' + id + '/upload/files/' + parenid,
    method: 'post',
    headers: {
      'content-type': 'application/json;charset=utf-8'
    },
    data
  })
}
/**
 * 选择资源开始上传时获取本次上传id
 * @param  data
 */
export function getresourceId(data) {
  return request({
    url: 'modelResource',
    method: 'post',
    data
  })
}
