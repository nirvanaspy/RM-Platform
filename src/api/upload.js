import request from '@/utils/request'
export function postMerge(data) {
  return request({
    url: 'files/chunks/merge',
    method: 'post',
    data
  })
}
/**
 * 文件合并完成后后端存文件
 * @param  data
 * @param  id
 */
export function realupload(id, data, parenid) {
  return request({
    url: 'resource-files/' + id + '/upload/files',
    method: 'post',
    headers: {
      'content-type': 'application/json;charset=utf-8'
    },
    // data: qs.stringify(data),
    data,
    params: parenid
  })
}
/* ****模型资源上传******/
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
/* ****标准资源上传******/
/**
 * 选择资源开始上传时获取本次上传id
 * @param  data
 */
export function getstandardresourceId(data) {
  return request({
    url: 'standards',
    method: 'post',
    data
  })
}
/* ****公共算法服务上传******/
/**
 * 选择资源开始上传时获取本次上传id
 * @param  data
 */
export function algorithmAndServerId(data) {
  return request({
    url: 'algorithmAndServer',
    method: 'post',
    data
  })
}
/* ****工具软件上传******/
/**
 * 选择资源开始上传时获取本次上传id
 * @param  data
 */
export function toolsAndSoftwareId(data) {
  return request({
    url: 'toolsAndSoftware',
    method: 'post',
    data
  })
}
