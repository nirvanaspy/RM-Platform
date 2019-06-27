import request from '@/utils/request'

export function addDepart(data) {
  return request({
    url: '/departments',
    method: 'post',
    data
  })
}
export function getDepart(query) {
  return request({
    url: '/departments',
    method: 'get',
    params: query
  })
}
export function getDepaData(departmentId) {
  return request({
    url: '/departments/' + departmentId,
    method: 'get'
  })
}

export function deleteDepart(departmentId) {
  return request({
    url: '/departments/' + departmentId,
    method: 'delete'
  })
}
export function updateDepart(departmentId, data) {
  return request({
    url: '/departments/' + departmentId,
    method: 'patch',
    data
  })
}
export function setDepartment(userId, departmentId) {
  return request({
    url: '/users/' + userId + '/updateUserForDepartment',
    method: 'patch',
    params: { departmentId }
  })
}
