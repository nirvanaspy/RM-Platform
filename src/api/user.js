import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/oauth/token',
    method: 'post',
    auth: {
      username: 'OAUTH_CLIENT_ID',
      password: 'OAUTH_CLIENT_SECRET'
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data
  })
}

export function getuserlist(query) {
  return request({
    url: '/users',
    method: 'get',
    params: query
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}
export function deletuser(id) {
  return request({
    url: '/users/' + id,
    method: 'delete'
  })
}
export function getdepartment() {
  return request({
    url: '/departments',
    method: 'get'
  })
}
/**
 * 管理员添加用户
 * @param {object} data
 */
export function adduser(data) {
  return request({
    url: '/users/saveByAdmin',
    method: 'post',
    data
  })
}
/**
 * 管理员修改用户权限和部门
 * @param {string} id
 * @param {object} data
 */
export function edituser(id, data) {
  return request({
    url: '/users/' + id + '/updateUserByAdmin',
    method: 'post',
    data
  })
}
/**
 * 权限管理者修改用户权限
 * @param {string} id
 * @param {object} data
 */
export function reditsecurity(id, data) {
  return request({
    url: '/users/' + id + '/security-classification',
    method: 'patch',
    params: data
  })
}
