import moment from 'moment-timezone'
var timezone = 'Asia/Shanghai'

export default function format(data) {
  const newdate = moment(data)
    .tz(timezone)
    .format('YYYY-MM-DD hh:mm:ss')
  return newdate
}
// export default function format(data) {
//   const arr = data.split('T')
//   let date = arr[0]
//   const timearr = arr[1].split(':')
//   var hour, min, seconds
//   hour = +timearr[0] + 8
//   if (hour >= 24) {
//     var tranform = date.split('-')
//     tranform.pop()
//     var day = +date.split('-')[2] + 1
//     date = tranform.join('-') + '-' + (day > 9 ? day : '0' + day)
//     hour = hour - 24 + ''
//   } else {
//     hour += ''
//   }
//   min = timearr[1]
//   seconds = timearr[2].split('.')[0]
//   return date + ' ' + hour + ':' + min + ':' + seconds
// }

// export default function format(data) {
//   const arr = data.split('T')
//   let date = arr[0]
//   const timearr = arr[1].split(':')
//   var hour, min, seconds
//   hour = +timearr[0] + 8
//   if (hour === 24) {
//     date =
//       date
//         .split('-')
//         .pop()
//         .join('-') +
//       '-' +
//       +date.split('-')[2] +
//       1
//     hour = 0 + ''
//   } else {
//     hour += ''
//   }
//   min = timearr[1]
//   seconds = timearr[2].split('.')[0]
//   return date + ' ' + hour + ':' + min + ':' + seconds
// }
