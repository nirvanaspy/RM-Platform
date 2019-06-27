export function searchmodelfile(obj) {
  var data = {
    logic: 'and', // 条件关系
    filters: []
  }
  for (var item in obj) {
    var searchcondition = {}
    searchcondition.field = item
    if (item === 'name') {
      searchcondition.operator = 'contains'
    } else searchcondition.operator = 'eq'

    searchcondition.value = obj[item]
    data.filters.push(searchcondition)
  }
  return data
}
