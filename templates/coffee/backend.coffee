# TODO convert to resources
$.app.factory('Backend', ($http, $q) ->
  return {
    vote: (opinion, val) ->
# TODO $http.post('/vote', {opinion: opinion, vote: val})
      tmp = $q.defer()
      tmp.resolve(
        success: true
        score: 3
      )
      return tmp.promise
    opine: (opinion) ->
# TODO return $http.post('/opine', opinion)
      tmp = $q.defer()
      tmp.resolve(
        success: true
        date: '01/01/2014'
        text: opinion.new_text
      )
      return tmp.promise
    delete: (opinion) ->
# TODO return $http.post('/delete', opinion)
      tmp = $q.defer()
      tmp.resolve(
        success: false
        msg: 'Just an example of something not working'
      )
      return tmp.promise
    load_debate_list: () ->
# TODO add in some filtering/ordering/pagination, eventually this WILL be too much to handle in browser
      return $http.get('/api/debates')
  }
)

$.app.factory('Debate', ($resource) ->
  return $resource(
    '/api/debates/:id.json',
    {id: '@id'}
  )
)

$.app.factory('DebateList', ($resource) ->
  return $resource(
    '/api/debates',
    {
      sort: 'date'
    }
  )
)
  
$.app.factory('Opinion', ($resource) ->
  return $resource(
    '/api/opinion/:id.json',
    {
      id: '@id',
    },
    {
      vote: {
        method: 'POST',
        params: {
          vote: true
        }
      },
      comments: {
        method: 'GET',
        params: {
          comments: true
        }
      }
    }
  )
)

$.app.factory('Comment', ($resource) ->
  return $resource(
    '/api/comment/:id.json',
    {
      id: '@id',
    },
    {}
  )
)
