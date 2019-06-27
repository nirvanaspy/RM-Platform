import request from '@/utils/request'
/**
 * 模型资源管理，获取文件列表
 */
export function filesearch(query) {
  return request({
    url: '/modelResource',
    method: 'get',
    params: query
  })
}
/**
 * 模型资源管理，关键字查找
 */
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
/**
 * 标准规范管理，获取文件列表
 */
export function standardFilelist(query) {
  return request({
    url: '/standards',
    method: 'get',
    params: query
  })
}
/**
 * 标准规范管理，关键字查找
 */
export function standardconditon(data) {
  return request({
    url: '/standards/KeyWord',
    method: 'post',
    headers: {
      'content-type': 'application/json;charset=utf-8'
    },
    data
  })
}
/**
 * 公共算法服务管理，获取文件列表
 */
export function algorithmAndServerlist(query) {
  return request({
    url: '/algorithmAndServer',
    method: 'get',
    params: query
  })
}
/**
 * 公共算法管理，关键字查找
 */
export function algorithmAndServerconditon(data) {
  return request({
    url: '/algorithmAndServer/KeyWord',
    method: 'post',
    headers: {
      'content-type': 'application/json;charset=utf-8'
    },
    data
  })
}
/**
 * 工具软件类管理，获取文件列表
 */
export function toolsAndSoftwarelist(query) {
  return request({
    url: '/toolsAndSoftware',
    method: 'get',
    params: query
  })
}
/**
 * 工具软件类管理，关键字查找
 */
export function toolsAndSoftwareconditon(data) {
  return request({
    url: '/toolsAndSoftware/KeyWord',
    method: 'post',
    headers: {
      'content-type': 'application/json;charset=utf-8'
    },
    data
  })
}
