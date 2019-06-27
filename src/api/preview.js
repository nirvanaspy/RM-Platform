import request from '@/utils/request'

export function preview(id) {
  return request({
    url: `standards/${id}/readPDF`,
    method: 'get'
  })
}
export function getallfiles(id) {
  return request({
    url: `standards/${id}/getAllFiles`,
    method: 'get'
  })
}
