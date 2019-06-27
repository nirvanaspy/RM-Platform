import request from '@/utils/request'
export function resetpassword(id, data) {
  return request({
    url: `/users/${id}/password`,
    method: 'patch',
    data
  })
}
